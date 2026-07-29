/**
 * rematch-businesses.ts
 *
 * Re-runs catalog matching for every business. Existing matches are never
 * overwritten (the insert is ON CONFLICT DO NOTHING), so hand-curated
 * matches and any pipeline progress survive — this only fills in
 * opportunities a business became eligible for since it was last scored,
 * e.g. after the catalog grows or an owner completes their profile.
 *
 * Usage: npx tsx --env-file=.env.local ingest/rematch-businesses.ts
 */

import { generateMatchesForBusiness } from "../src/lib/funding/match";
import sql from "../src/lib/db-query";

async function main() {
  const businesses = (await sql`
    SELECT id, name FROM businesses ORDER BY id
  `) as unknown as { id: number; name: string }[];

  for (const b of businesses) {
    const added = await generateMatchesForBusiness(b.id);
    const [{ n }] = (await sql`
      SELECT COUNT(*)::int AS n FROM opportunity_matches WHERE business_id = ${b.id}
    `) as unknown as { n: number }[];
    console.log(`${b.name}: +${added} new, ${n} total`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
