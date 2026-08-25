/**
 * Catalogue freshness sweep.
 *
 *   npx tsx --env-file=.env.local ingest/business/verify-catalog.ts
 *   npx tsx --env-file=.env.local ingest/business/verify-catalog.ts --write
 *
 * Without --write it reports and changes nothing.
 *
 * What this does and does not prove. It confirms a URL still resolves and
 * flags deadlines that have passed. It does NOT confirm a programme is still
 * open, still funded, or still on the stated terms — a live page can describe
 * a grant that closed two years ago. That judgement stays human, and lands in
 * verified_at; this script only maintains link_checked_at and link_status.
 *
 * Conflating the two would recreate the exact failure this guards against: a
 * directory that looks maintained because the links are green, while quietly
 * recommending programmes that no longer exist.
 */

import postgres from "postgres";

const TIMEOUT_MS = 12_000;
const CONCURRENCY = 5;
/** Beyond this a programme should be re-read by a person, not just pinged. */
const STALE_DAYS = 90;

const WRITE = process.argv.includes("--write");

type LinkStatus = "ok" | "redirect" | "not_found" | "blocked" | "error" | "unreachable";

interface Row {
  id: number;
  slug: string;
  name: string;
  url: string | null;
  deadline: string | null;
  rolling: boolean;
  verification_status: string;
  verified_at: string | null;
}

interface Check {
  row: Row;
  status: LinkStatus;
  detail: string;
}

function db() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL not set. Run with --env-file=.env.local");
  return postgres(raw.replace(/^"|"$/g, ""), { prepare: false, ssl: "require" });
}

async function checkUrl(url: string): Promise<{ status: LinkStatus; detail: string }> {
  // HEAD first — cheaper, and most public sector sites answer it. Several
  // reject HEAD with 405 while serving GET fine, so fall through rather than
  // reporting a false dead link.
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "User-Agent": "PortlandCivicLab/1.0 (+https://www.portlandciviclab.org)" },
      });
      if (res.status === 405 && method === "HEAD") continue;
      if (res.status === 404 || res.status === 410) {
        return { status: "not_found", detail: `HTTP ${res.status}` };
      }
      // 403/429 almost always means a bot filter, not a dead page. Reporting
      // those as rot trains you to ignore the report, which defeats it.
      if (res.status === 403 || res.status === 429) {
        return { status: "blocked", detail: `HTTP ${res.status} — bot filter, check by hand` };
      }
      if (!res.ok) return { status: "error", detail: `HTTP ${res.status}` };
      // A redirect that lands somewhere structurally different usually means
      // the programme page was folded into a generic landing page.
      const landed = new URL(res.url);
      const asked = new URL(url);
      if (landed.pathname.replace(/\/$/, "") !== asked.pathname.replace(/\/$/, "")) {
        return { status: "redirect", detail: `now redirects to ${res.url}` };
      }
      return { status: "ok", detail: "" };
    } catch (err) {
      if (method === "GET") {
        const msg = err instanceof Error ? err.message : String(err);
        return { status: "unreachable", detail: msg.slice(0, 80) };
      }
    }
  }
  return { status: "unreachable", detail: "no response" };
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

function daysSince(date: string | null): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
}

async function main() {
  const sql = db();
  try {
    const rows = (await sql`
      SELECT id, slug, name, url, deadline, rolling, verification_status, verified_at
      FROM funding_opportunities
      ORDER BY name
    `) as unknown as Row[];

    console.log(`Checking ${rows.length} programmes${WRITE ? "" : "  (dry run — pass --write to save)"}\n`);

    const withUrls = rows.filter((r) => r.url);
    const checks: Check[] = await mapLimit(withUrls, CONCURRENCY, async (row) => {
      const { status, detail } = await checkUrl(row.url!);
      return { row, status, detail };
    });

    const broken = checks.filter((c) => c.status === "not_found" || c.status === "error" || c.status === "unreachable");
    const moved = checks.filter((c) => c.status === "redirect");
    const blocked = checks.filter((c) => c.status === "blocked");
    const today = new Date().toISOString().slice(0, 10);
    const expired = rows.filter((r) => !r.rolling && r.deadline && r.deadline < today);
    const stale = rows.filter((r) => {
      const d = daysSince(r.verified_at);
      return d === null || d > STALE_DAYS;
    });

    const report = (title: string, items: Check[], note?: string) => {
      if (!items.length) return;
      console.log(`${title} (${items.length})`);
      if (note) console.log(`   ${note}`);
      for (const c of items) {
        console.log(`   [${c.status}] ${c.row.name}`);
        console.log(`      ${c.row.url}`);
        if (c.detail) console.log(`      ${c.detail}`);
      }
      console.log();
    };

    report("BROKEN", broken, "Dead or erroring. Fix or remove.");
    report(
      "MOVED",
      moved,
      "Still resolves, but somewhere else. A redirect to a generic landing page usually means the programme page is gone.",
    );
    report("BLOCKED", blocked, "A bot filter answered, not the site. Verify these by hand — not evidence of rot.");
    if (!broken.length && !moved.length && !blocked.length) {
      console.log(`All ${checks.length} links resolve cleanly.\n`);
    }

    if (expired.length) {
      console.log(`DEADLINES PASSED (${expired.length})`);
      for (const r of expired) console.log(`   ${r.name} — deadline ${r.deadline}`);
      console.log();
    }

    console.log(`NEVER VERIFIED, OR NOT IN ${STALE_DAYS} DAYS (${stale.length} of ${rows.length})`);
    for (const r of stale) {
      const d = daysSince(r.verified_at);
      console.log(`   ${r.name} — ${d === null ? "never verified" : `${d} days ago`}`);
    }
    console.log(
      `\nA resolving link is not a verified programme. These need a person to open the page\n` +
        `and confirm it is still open on the stated terms, then set verified_at.`,
    );

    if (WRITE) {
      for (const c of checks) {
        await sql`
          UPDATE funding_opportunities
          SET link_checked_at = now(), link_status = ${c.status}
          WHERE id = ${c.row.id}
        `;
      }
      // A dead link is positive evidence of staleness, so downgrade it. We
      // never upgrade on a green link — that is the human's call.
      const deadIds = checks.filter((c) => c.status === "not_found").map((c) => c.row.id);
      if (deadIds.length) {
        await sql`
          UPDATE funding_opportunities SET verification_status = 'stale'
          WHERE id = ANY(${deadIds}) AND verification_status <> 'stale'
        `;
        console.log(`\nMarked ${deadIds.length} programme(s) stale on a dead link.`);
      }
      console.log(`Saved link status for ${checks.length} programmes.`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((e) => {
  console.error(`FAILED: ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
