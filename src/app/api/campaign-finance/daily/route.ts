import 'server-only';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import frozen from '@/lib/campaign-finance/campaign-dynamics.json';
import { activeManifest } from '@/lib/campaign-finance/active';
import { currentTimeline } from '@/lib/campaign-finance/current-timeline';
import { timelineCatalog, alignEvents } from '@/lib/campaign-finance/timeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const base = resolve(process.cwd(), 'runtime-data/orestar-daily');
const validSnapshot = /^orestar-20250101-\d{8}-[a-f0-9]{12}$/;
const expectedEnd = () => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  const day = new Date(`${value('year')}-${value('month')}-${value('day')}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 1);
  return day.toISOString().slice(0, 10);
};

function chartResponse(request: Request, payload: unknown, headers: Record<string, string> = {}) {
  const body = JSON.stringify(payload);
  const gzip = /(?:^|,)\s*gzip(?:\s*;|\s*,|\s*$)/i.test(request.headers.get('accept-encoding') ?? '');
  return new Response(gzip ? new Uint8Array(gzipSync(body)) : body, {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Accept-Encoding', ...(gzip ? { 'Content-Encoding': 'gzip' } : {}), ...headers },
  });
}

export async function GET(request: Request) {
  let pointer: { snapshot: string; end: string; sha256: string; publishedAt: string };
  try {
    pointer = JSON.parse(await readFile(resolve(base, 'current.json'), 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      return Response.json({ error: 'Daily snapshot pointer is unreadable; the frozen investigation is unchanged.' }, { status: 503 });
    }
    return chartResponse(request,await currentTimeline(),{'Cache-Control':'no-store'});
  }
  const active=activeManifest();
  if(active.end>pointer.end || (active.end>=pointer.end && active.source_files.some(source=>source.method==='user_supplied_manual_export')))return chartResponse(request,await currentTimeline(),{'Cache-Control':'no-store'});
  if (!validSnapshot.test(pointer.snapshot) || !/^\d{4}-\d{2}-\d{2}$/.test(pointer.end) || !/^[a-f0-9]{64}$/.test(pointer.sha256)) {
    return Response.json({ error: 'Invalid daily snapshot pointer; the frozen investigation is unchanged.' }, { status: 503 });
  }
  try {
    const bytes = await readFile(resolve(base, 'snapshots', `${pointer.snapshot}.json`));
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== pointer.sha256) throw new Error('Daily chart checksum mismatch');
    const update = JSON.parse(bytes.toString('utf8'));
    if (update.snapshot !== pointer.snapshot || update.end !== pointer.end || !Array.isArray(update.weekly) || !Array.isArray(update.events)) {
      throw new Error('Daily chart manifest mismatch');
    }
    const candidates = frozen.candidates.map(candidate => {
      const current = update.candidateTotals[candidate.committeeId];
      return current ? { ...candidate, cashCents: current.cash_cents, publicCents: current.public_cents, nonmatchingCents: current.nonmatching_cents } : candidate;
    });
    const etag = `"${pointer.sha256}-${timelineCatalog.version}"`;
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
    return chartResponse(request, { ...frozen, snapshot: update.snapshot, end: update.end, candidates,
      weekly: update.weekly, events: alignEvents(update.events), eventCatalog:timelineCatalog.version,
      refresh: { status: pointer.end < expectedEnd() ? 'stale' : 'validated', publishedAt: pointer.publishedAt, sourceRows: update.sourceRows,
        scope: 'Transaction-date curves and event windows only; the reviewed donor, geography and narrative sections remain on their dated edition.' }
    }, { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', ETag: etag });
  } catch (error) {
    console.error('Campaign-finance daily snapshot failed verification', error);
    return Response.json({ error: 'Daily snapshot failed verification; the frozen investigation is unchanged.' }, { status: 503 });
  }
}
