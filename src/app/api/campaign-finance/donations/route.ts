import { activeManifest } from '@/lib/campaign-finance/active';
import { currentDonationStatistics, donationCandidates } from '@/lib/campaign-finance/current-donations';
import { fundingLabels } from '@/lib/campaign-finance/donation-statistics';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const committee = params.get('committee'), race = params.get('race');
  if ((committee && race) || [...params.keys()].some(key => !['committee','race'].includes(key))) return Response.json({ error: 'Choose one reviewed committee or race' }, { status: 400 });
  const candidates = donationCandidates.filter(candidate => committee ? candidate.committeeId === committee : race ? candidate.raceId === race : true);
  if (!candidates.length) return Response.json({ error: 'No reviewed candidate committee' }, { status: 404 });
  const active = activeManifest();
  const rows = await Promise.all(candidates.map(async candidate => ({ ...candidate, statistics: await currentDonationStatistics(candidate.committeeId) })));
  return Response.json({ snapshot: active.snapshot, start: active.start, end: active.end, completenessVerified: active.completeness_verified,
    definitions: { statistics: 'Positive itemized cash records before refunds; individual statistics exclude City matches, unnamed combined entries and non-individual types. Mean and interpolated quartiles/median retain fractional cents.', mode: 'All tied most frequent amounts; no mode when all values occur once.', funding: 'Non-City cash, classified by reported type. Individual size bands use cumulative cash per conservative entity group across the window, not per gift or verified person. Business size and corporate ownership are not inferred.' }, fundingLabels, candidates: rows }, { headers: { 'Cache-Control': 'no-store' } });
}
