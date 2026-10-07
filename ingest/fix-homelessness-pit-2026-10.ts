/**
 * fix-homelessness-pit-2026-10.ts
 *
 * Corrects the dashboard's Point-in-Time rows for OR-501 (Portland, Gresham/
 * Multnomah County CoC). Found in the October 2026 review prompted by PSU HRAC:
 *
 *   - 2025 was stored with the tri-county sheltered/unsheltered split
 *     (4,525 / 7,509, which sum to 12,034) under Multnomah's total of 10,526.
 *     Multnomah's own split is 3,614 / 6,912 (HUD 2025 OR-501 report).
 *   - Multnomah's 2023 count (6,297; 2,353 sheltered, 3,944 unsheltered, HUD
 *     2023 OR-501 report, count night January 24, 2023) was stored as 2024, and
 *     the 2023 row held 6,070, which no source supports. The dashboard therefore
 *     read "up 67% since 2024". There was no 2024 count.
 *   - With --drop-2020, removes the 2020 row (4,015), which repeats the 2019
 *     total exactly and has no published 2020 source on file.
 *
 * Sources and quotes: research/homelessness-data-2026-10/sources.md.
 *
 * Usage:
 *   npx tsx ingest/fix-homelessness-pit-2026-10.ts            # dry run: prints current rows and planned changes
 *   npx tsx ingest/fix-homelessness-pit-2026-10.ts --apply    # writes, in one transaction
 *   add --drop-2020 to also remove the 2020 row
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";

const COC = "OR-501";
const APPLY = process.argv.includes("--apply");
const DROP_2020 = process.argv.includes("--drop-2020");

const ROW_2023 = {
  year: 2023, total_homeless: 6297, sheltered: 2353, unsheltered: 3944,
  source: "HUD 2023 PIT, OR-501 Homeless Populations and Subpopulations (count night Jan. 24, 2023)",
};
const SPLIT_2025 = {
  sheltered: 3614, unsheltered: 6912,
  source: "HUD 2025 PIT, OR-501 Homeless Populations and Subpopulations; PSU 2025 Tri-County PIT Count (count night Jan. 22, 2025)",
};

async function main() {
  const sql = postgres(requireDatabaseUrl(), { max: 1 });
  try {
    const before = await sql`SELECT year, total_homeless, sheltered, unsheltered, source
      FROM homelessness.pit_counts WHERE coc_code = ${COC} ORDER BY year`;
    console.log("Current OR-501 rows:");
    console.table(before.map((r) => ({ ...r })));

    const plan = [
      `2025: set sheltered ${SPLIT_2025.sheltered}, unsheltered ${SPLIT_2025.unsheltered} (total stays 10,526)`,
      `2023: set total ${ROW_2023.total_homeless}, sheltered ${ROW_2023.sheltered}, unsheltered ${ROW_2023.unsheltered}`,
      "2024: delete (no 2024 count; the row held the 2023 total)",
      ...(DROP_2020 ? ["2020: delete (repeats the 2019 total; no source on file)"] : []),
    ];
    console.log(`\n${APPLY ? "Applying" : "Dry run, would apply"}:\n- ${plan.join("\n- ")}`);
    if (!APPLY) return;

    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      const r2025 = await tx`UPDATE homelessness.pit_counts
        SET sheltered = ${SPLIT_2025.sheltered}, unsheltered = ${SPLIT_2025.unsheltered}, source = ${SPLIT_2025.source}
        WHERE coc_code = ${COC} AND year = 2025 AND total_homeless = 10526`;
      if (r2025.count !== 1) throw new Error(`Expected one 2025 row with total 10,526, found ${r2025.count}`);
      await tx`INSERT INTO homelessness.pit_counts (year, coc_code, coc_name, total_homeless, sheltered, unsheltered, source)
        VALUES (${ROW_2023.year}, ${COC}, 'Portland, Gresham/Multnomah County CoC', ${ROW_2023.total_homeless}, ${ROW_2023.sheltered}, ${ROW_2023.unsheltered}, ${ROW_2023.source})
        ON CONFLICT (year, coc_code) DO UPDATE SET total_homeless = EXCLUDED.total_homeless,
          sheltered = EXCLUDED.sheltered, unsheltered = EXCLUDED.unsheltered, source = EXCLUDED.source`;
      await tx`DELETE FROM homelessness.pit_counts WHERE coc_code = ${COC} AND year = 2024`;
      if (DROP_2020) await tx`DELETE FROM homelessness.pit_counts WHERE coc_code = ${COC} AND year = 2020`;
    });

    const after = await sql`SELECT year, total_homeless, sheltered, unsheltered FROM homelessness.pit_counts
      WHERE coc_code = ${COC} ORDER BY year`;
    console.log("\nAfter:");
    console.table(after.map((r) => ({ ...r })));
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
