/**
 * fix-homelessness-pit-2026-10.ts
 *
 * Brings the dashboard's Point-in-Time and by-name tables into line with their
 * primary sources. Found in the October 2026 review prompted by PSU HRAC.
 * Sources, checksums and refresh steps: ingest/homelessness/SOURCES.md.
 *
 * Point-in-Time (homelessness.pit_counts, OR-501), from HUD's Homeless
 * Populations and Subpopulations report for each year:
 *   - Only years with a full count (sheltered and unsheltered both counted that
 *     night) are kept: 2015, 2017, 2019, 2022, 2023, 2025. In 2020, 2021 and
 *     2024 Multnomah counted shelters only; HUD's reports for 2020 and 2024 carry
 *     the unsheltered figure forward from the year before (2,037 and 3,944), so
 *     those totals would put a sheltered-only year on the same line as full
 *     counts. Those rows are removed.
 *   - Every kept row's sheltered/unsheltered split and chronic count are reset to
 *     HUD's. Before this, 2025 carried the tri-county split, 6,297 (the 2023
 *     count) sat under 2024, 2023 held an unsourced 6,070, and the 2017, 2019,
 *     2020 and 2022 splits matched no report.
 *
 * By-name list (homelessness.by_name_list), from the county's dashboard edition
 * of October 2025 (archived), the newest edition the county published before its
 * dashboard went offline for maintenance in 2026:
 *   - Monthly totals January 2024 to October 2025. February 2025 had 13,864
 *     (November 2024's value); the county shows 14,864.
 *   - Inflow and outflow are kept only for January 2025 (1,277 and 865, from the
 *     county's April 16, 2025 release). They had also been copied onto January
 *     2024, and March 2025's pair had no source on file; those are cleared.
 *   The county says it will restate the whole series about 20% lower under a
 *   shorter inactivity rule. Reload from the dashboard when it returns.
 *
 * Usage:
 *   npx tsx ingest/fix-homelessness-pit-2026-10.ts           # dry run: prints current and planned rows
 *   npx tsx ingest/fix-homelessness-pit-2026-10.ts --apply   # writes, in one transaction
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";

const COC = "OR-501";
const COC_NAME = "Portland, Gresham/Multnomah County CoC";
const APPLY = process.argv.includes("--apply");
const hud = (year: number) => `https://files.hudexchange.info/reports/published/CoC_PopSub_CoC_OR-501-${year}_OR_${year}.pdf`;

/** HUD OR-501 reports: emergency shelter (incl. Safe Haven) + transitional = sheltered. */
const PIT_FULL_COUNTS = [
  { year: 2015, night: "Jan. 28, 2015", es: 872, th: 1042, unsheltered: 1887, total: 3801, chronic: null },
  { year: 2017, night: "Feb. 22, 2017", es: 1752, th: 757, unsheltered: 1668, total: 4177, chronic: 1290 },
  { year: 2019, night: "Jan. 23, 2019", es: 1459, th: 519, unsheltered: 2037, total: 4015, chronic: 1781 },
  { year: 2022, night: "Jan. 26, 2022", es: 1485, th: 686, unsheltered: 3057, total: 5228, chronic: 3120 },
  { year: 2023, night: "Jan. 24, 2023", es: 1821, th: 532, unsheltered: 3944, total: 6297, chronic: 2610 },
  { year: 2025, night: "Jan. 22, 2025", es: 2964, th: 650, unsheltered: 6912, total: 10526, chronic: 5158 },
] as const;
const SHELTER_ONLY_YEARS = [2020, 2021, 2024];

const BY_NAME_SOURCE = "Multnomah County HSD data dashboard, October 2025 edition (archived Jan. 10, 2026)";
/** Month, total on the list. From research/homelessness-data-2026-10/sources.md, section 1c. */
const BY_NAME_TOTALS: [string, number][] = [
  ["2024-01-01", 11430], ["2024-02-01", 11942], ["2024-03-01", 12295], ["2024-04-01", 12604],
  ["2024-05-01", 12580], ["2024-06-01", 12751], ["2024-07-01", 13048], ["2024-08-01", 13319],
  ["2024-09-01", 13353], ["2024-10-01", 13639], ["2024-11-01", 13864], ["2024-12-01", 13949],
  ["2025-01-01", 14361], ["2025-02-01", 14864], ["2025-03-01", 15245], ["2025-04-01", 15541],
  ["2025-05-01", 15563], ["2025-06-01", 15865], ["2025-07-01", 16029], ["2025-08-01", 16089],
  ["2025-09-01", 16192], ["2025-10-01", 16886],
];
const BY_NAME_FLOWS: Record<string, { inflow: number; outflow: number; source: string }> = {
  "2025-01-01": { inflow: 1277, outflow: 865, source: "Multnomah County news release, Apr. 16, 2025 (January 2025 by-name list)" },
};

async function main() {
  const sql = postgres(requireDatabaseUrl(), { max: 1 });
  try {
    const pitBefore = await sql`SELECT year, total_homeless, sheltered, unsheltered, chronically_homeless
      FROM homelessness.pit_counts WHERE coc_code = ${COC} ORDER BY year`;
    console.log("Point-in-Time rows now:");
    console.table(pitBefore.map((r) => ({ ...r })));
    console.log(`Planned: full counts ${PIT_FULL_COUNTS.map((r) => r.year).join(", ")} from HUD; remove shelter-only years ${SHELTER_ONLY_YEARS.join(", ")}.`);
    console.table(PIT_FULL_COUNTS.map((r) => ({ year: r.year, total: r.total, sheltered: r.es + r.th, unsheltered: r.unsheltered, chronic: r.chronic })));

    const bnlBefore = await sql`SELECT month::text, total_on_list, new_entries, exits_to_housing FROM homelessness.by_name_list ORDER BY month`;
    const changes = BY_NAME_TOTALS.map(([month, total]) => {
      const now = bnlBefore.find((r) => r.month === month);
      const flow = BY_NAME_FLOWS[month];
      return { month, now: now?.total_on_list ?? "(none)", planned: total, flows: flow ? `${flow.inflow}/${flow.outflow}` : "cleared" };
    }).filter((c) => c.now !== c.planned || c.flows !== "cleared");
    console.log("\nBy-name rows that change (totals; inflow/outflow kept only where sourced):");
    console.table(changes);

    for (const r of PIT_FULL_COUNTS) if (r.es + r.th + r.unsheltered !== r.total) throw new Error(`HUD ${r.year} parts do not sum`);
    if (!APPLY) { console.log("\nDry run. Nothing written."); return; }

    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      for (const r of PIT_FULL_COUNTS) {
        const source = `HUD ${r.year} PIT, OR-501 Homeless Populations and Subpopulations (count night ${r.night}): ${hud(r.year)}`;
        await tx`INSERT INTO homelessness.pit_counts (year, coc_code, coc_name, total_homeless, sheltered, unsheltered, chronically_homeless, source)
          VALUES (${r.year}, ${COC}, ${COC_NAME}, ${r.total}, ${r.es + r.th}, ${r.unsheltered}, ${r.chronic}, ${source})
          ON CONFLICT (year, coc_code) DO UPDATE SET total_homeless = EXCLUDED.total_homeless, sheltered = EXCLUDED.sheltered,
            unsheltered = EXCLUDED.unsheltered, chronically_homeless = EXCLUDED.chronically_homeless, source = EXCLUDED.source`;
      }
      await tx`DELETE FROM homelessness.pit_counts WHERE coc_code = ${COC} AND year IN ${tx(SHELTER_ONLY_YEARS)}`;

      for (const [month, total] of BY_NAME_TOTALS) {
        const flow = BY_NAME_FLOWS[month];
        const source = flow ? `${BY_NAME_SOURCE}; flows: ${flow.source}` : BY_NAME_SOURCE;
        await tx`INSERT INTO homelessness.by_name_list (month, total_on_list, new_entries, exits_to_housing, source)
          VALUES (${month}, ${total}, ${flow?.inflow ?? null}, ${flow?.outflow ?? null}, ${source})
          ON CONFLICT (month) DO UPDATE SET total_on_list = EXCLUDED.total_on_list, new_entries = EXCLUDED.new_entries,
            exits_to_housing = EXCLUDED.exits_to_housing, source = EXCLUDED.source`;
      }
    });

    const pitAfter = await sql`SELECT year, total_homeless, sheltered, unsheltered, chronically_homeless FROM homelessness.pit_counts
      WHERE coc_code = ${COC} ORDER BY year`;
    console.log("\nPoint-in-Time rows after:");
    console.table(pitAfter.map((r) => ({ ...r })));
    const bnlAfter = await sql`SELECT count(*)::int AS months, min(month)::text AS first, max(month)::text AS last FROM homelessness.by_name_list`;
    console.log("By-name list after:", bnlAfter[0]);
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
