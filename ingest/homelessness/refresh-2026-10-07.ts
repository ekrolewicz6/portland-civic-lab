/**
 * refresh-2026-10-07.ts
 *
 * One-time correction and refresh of the homelessness dashboard tables that have
 * no automated loader, from the sources checked on October 7, 2026
 * (research/homelessness-data-2026-10/dashboard-refresh.md; raw files in
 * runtime-data/source-archive/2026-10-07/dashboard-refresh/).
 *
 * Eviction filings are refreshed separately by ingest/fetch-hsd-dashboard.ts.
 *
 * Usage:
 *   npx tsx ingest/homelessness/refresh-2026-10-07.ts           # dry run
 *   npx tsx ingest/homelessness/refresh-2026-10-07.ts --apply   # one transaction
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "../lib/db-url";

const APPLY = process.argv.includes("--apply");

const QDASH = "https://hsd.multco.us/quarterly-data-dashboard/";
/** Average HSD-funded shelter capacity, county-funded shelters only (Chart.js chart-1324), FY2022 Q1 to FY2024 Q4. */
const CAPACITY = [995, 1155, 1133, 1356, 1391, 1375, 1480, 1587, 1703, 1992, 2133, 2068];
/** Share of available beds occupied (chart-1370), labeled "2024 Q1" to "2024 Q4" on the dashboard. */
const UTILIZATION_FY2024 = [90.5, 92.1, 92.6, 90.6];
const QUARTER_MONTHS = ["Jul–Sep", "Oct–Dec", "Jan–Mar", "Apr–Jun"];
function fyQuarterLabel(fy: number, q: number): string {
  const calendarYear = q <= 2 ? fy - 1 : fy;
  return `FY${fy} Q${q} (${QUARTER_MONTHS[q - 1]} ${calendarYear})`;
}

const METRO_FY25_AR = "Metro SHS regional annual report FY2024-25, Exhibit F";
const METRO_FY26_YE = "https://www.oregonmetro.gov/sites/default/files/2026-09/fy-2025-26-shs-year-end-report_0.pdf";
const METRO_FY24_AR = "https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2024-20250211.pdf";
const METRO_BUDGET = "https://www.oregonmetro.gov/sites/default/files/2025-11/fy-2024-25-adopted-budget-20241021.pdf";

const SHS_FUNDING = [
  { year: 2022, revenue: 242_700_000, spending: 55_900_000, source: `Metro: FY2021-22 gross collections (sum of audited personal and business tax actuals, ${METRO_BUDGET}); regional county program spending (${METRO_FY24_AR}). Includes Year 1 collections from April 2021.` },
  { year: 2023, revenue: 347_000_000, spending: 149_100_000, source: `Metro: FY2022-23 gross collections (${METRO_BUDGET}); regional county program spending (${METRO_FY24_AR})` },
  { year: 2024, revenue: 335_100_000, spending: 294_100_000, source: `Metro: FY2023-24 gross collections and regional county program spending (${METRO_FY24_AR})` },
  { year: 2025, revenue: 324_964_017, spending: 424_900_000, source: `Metro: FY2024-25 actual collections and regional county program spending after year-end close (${METRO_FY25_AR})` },
  { year: 2026, revenue: 357_300_000, spending: 339_400_000, source: `Metro: FY2025-26 actual collections, unaudited, including about $36M of one-time late payments; regional county program spending, preliminary (${METRO_FY26_YE}; Metro FY26 Q4 financial report)` },
];

const HF_DASH = "https://www.homeforward.org/performance-dashboard/";
const VACANCY = [
  { as_of: "2025-11-07", total: 6847, vacant: 956, pct: 14.0, days: null, source: "Willamette Week, Dec. 3, 2025, from Home Forward's Nov. 7, 2025 vacancy report", notes: "956 of 6,847 affordable units empty (headline 955). https://www.wweek.com/news/city/2025/12/03/portlands-housing-authority-sits-on-955-empty-apartments/" },
  { as_of: "2025-12-31", total: null, vacant: null, pct: 11.0, days: 185, source: "Home Forward data as of Dec. 31, 2025, reported by OPB (Feb. 27, 2026); 185-day average to fill is calendar 2025 from Home Forward's audited financial statements", notes: "https://www.opb.org/article/2026/02/27/portland-home-forward-housing-authority-vacancies-turnover/" },
  { as_of: "2026-03-25", total: null, vacant: null, pct: 11.7, days: null, source: "Willamette Week, Mar. 25, 2026 (Home Forward board briefing)", notes: "https://www.wweek.com/news/city/2026/03/25/home-forward-officials-brief-board-on-agencys-struggles/" },
  { as_of: "2026-10-02", total: null, vacant: null, pct: 8.6, days: null, source: `Home Forward performance dashboard, data as of Oct. 2, 2026 (${HF_DASH})`, notes: "Dashboard reports 91.4% overall occupancy (94.5% subsidized, 89.9% unsubsidized); vacancy shown here as 100 minus occupancy." },
];

const BY_NAME_MAR_2026 = {
  month: "2026-03-01", total: 18480, inflow: 1687, outflow: 1468,
  source: "Multnomah County Homeless Response System KPI deck, June 12, 2026, slides 6 and 14 (https://hsd.multco.us/wp-content/uploads/2026/06/Homeless-Response-System-KPI.HSD-Provider-Conference.6.2026.pdf); inflow and outflow: Homelessness Response Action Plan report, May 2026, p. 8. Old inactivity rule; the county will restate it.",
};

const DATA_SOURCES = [
  { key: "pit_count", name: "Point-in-Time Count", agency: "HUD, from Multnomah County's submission (PSU HRAC conducts the count)", freq: "Full count every two years; shelters only in other years", last: "2025-01-22", next: "2027-01-31", url: "https://files.hudexchange.info/reports/published/CoC_PopSub_CoC_OR-501-2025_OR_2025.pdf" },
  { key: "hmis_bnl", name: "HMIS By-Name List", agency: "Multnomah County HSD", freq: "monthly (dashboard offline for maintenance as of Oct. 2026)", last: "2026-03-31", next: "2026-10-31", url: "https://hsd.multco.us/data-dashboard/" },
  { key: "shs_outcomes", name: "SHS Outcomes Reports", agency: "Metro / Multnomah County HSD", freq: "quarterly; annual report each November", last: "2026-06-30", next: "2026-11-30", url: "https://hsd.multco.us/reports/" },
];

async function main() {
  const sql = postgres(requireDatabaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
  try {
    const nullable = await sql`SELECT table_name, column_name, is_nullable FROM information_schema.columns
      WHERE table_schema = 'homelessness' AND table_name IN ('shelter_capacity', 'affordable_housing_vacancy', 'shs_funding', 'by_name_list')
      AND is_nullable = 'NO' AND column_default IS NULL`;
    console.log("Required columns:", nullable.map((r) => `${r.table_name}.${r.column_name}`).join(", "));
    const shelter = CAPACITY.map((beds, i) => {
      const fy = 2022 + Math.floor(i / 4), q = (i % 4) + 1;
      return { quarter: fyQuarterLabel(fy, q), beds, util: fy === 2024 ? UTILIZATION_FY2024[q - 1] : null };
    });
    console.log("\nshelter_capacity: replace calendar-labeled 2024-Q1..Q4 with fiscal quarters; drop the unsourced 24-hour/overnight split");
    console.table(shelter);
    console.log("housing_placements FY2025: psh_placements 244 -> 1,085 (people placed in SHS-funded PSH); rapid_rehousing -> 1,420; source -> final");
    console.log("shs_funding: delete 2021 (Year 1 belongs to FY2022); replace revenue with Metro collections; add FY2026; clear Multnomah-only unit counts from the regional 2025 row");
    console.table(SHS_FUNDING.map(({ year, revenue, spending }) => ({ year, revenue, spending })));
    console.log("by_name_list: add March 2026 (18,480; inflow 1,687; outflow 1,468) from county documents");
    console.log("affordable_housing_vacancy: replace with four dated rows");
    console.table(VACANCY.map(({ as_of, vacant, pct, days }) => ({ as_of, vacant, pct, days })));
    console.log("eviction_filings: clear filing_rate_per_100 (an annual rate stored on every month)");
    console.log("context_stats.city_overnight_beds: 1,566 (the city's goal) -> 580 regular adult overnight beds planned for winter 2026-27");
    console.log("data_sources: update", DATA_SOURCES.map((d) => d.key).join(", "));
    if (!APPLY) { console.log("\nDry run. Nothing written."); return; }

    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      await tx`DELETE FROM homelessness.shelter_capacity`;
      for (const s of shelter) {
        await tx`INSERT INTO homelessness.shelter_capacity (quarter, total_beds, county_24hr_beds, city_overnight_beds, utilization_pct, source)
          VALUES (${s.quarter}, ${s.beds}, NULL, NULL, ${s.util},
            ${`Multnomah County HSD quarterly data dashboard, average HSD-funded shelter capacity (county-funded shelters only), ${QDASH}; the dashboard has not been updated since April 16, 2025${s.util !== null ? ". Utilization is labeled 2024 Q1-Q4 on the dashboard without saying fiscal or calendar" : ""}`})`;
      }
      await tx`UPDATE homelessness.housing_placements SET psh_placements = 1085, rapid_rehousing = 1420,
        source = 'Multnomah County release Nov. 26, 2025 (system-wide, Jul. 1, 2024 to Jun. 30, 2025); SHS-funded placements, PSH and RRH from the HSD SHS Annual Report FY2025'
        WHERE fiscal_year = 'FY2025'`;
      await tx`DELETE FROM homelessness.shs_funding WHERE year = 2021`;
      for (const f of SHS_FUNDING) {
        await tx`INSERT INTO homelessness.shs_funding (year, tax_revenue, spending, psh_units_added, psh_units_cumulative, source)
          VALUES (${f.year}, ${f.revenue}, ${f.spending}, NULL, NULL, ${f.source})
          ON CONFLICT (year) DO UPDATE SET tax_revenue = EXCLUDED.tax_revenue, spending = EXCLUDED.spending,
            psh_units_added = NULL, psh_units_cumulative = NULL, source = EXCLUDED.source`;
      }
      await tx`INSERT INTO homelessness.by_name_list (month, total_on_list, new_entries, exits_to_housing, source)
        VALUES (${BY_NAME_MAR_2026.month}, ${BY_NAME_MAR_2026.total}, ${BY_NAME_MAR_2026.inflow}, ${BY_NAME_MAR_2026.outflow}, ${BY_NAME_MAR_2026.source})
        ON CONFLICT (month) DO UPDATE SET total_on_list = EXCLUDED.total_on_list, new_entries = EXCLUDED.new_entries,
          exits_to_housing = EXCLUDED.exits_to_housing, source = EXCLUDED.source`;
      await tx`DELETE FROM homelessness.affordable_housing_vacancy`;
      for (const v of VACANCY) {
        await tx`INSERT INTO homelessness.affordable_housing_vacancy (as_of, source, total_units, vacant_units, vacancy_pct, avg_days_to_fill, notes)
          VALUES (${v.as_of}, ${v.source}, ${v.total}, ${v.vacant}, ${v.pct}, ${v.days}, ${v.notes})`;
      }
      await tx`UPDATE homelessness.eviction_filings SET filing_rate_per_100 = NULL`;
      // The page falls back to this figure for city overnight beds; it held the city's 1,566 goal.
      await tx`UPDATE homelessness.context_stats SET value = '580',
        context = 'planned for winter 2026-27 (876 the winter before)',
        source = 'City of Portland, Changes to City shelter services, Jul. 21, 2026 (https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services)',
        as_of_date = '2026-07' WHERE metric = 'city_overnight_beds'`;
      for (const d of DATA_SOURCES) {
        await tx`UPDATE homelessness.data_sources SET display_name = ${d.name}, agency = ${d.agency}, update_frequency = ${d.freq},
          last_updated = ${d.last}, next_expected = ${d.next}, url = ${d.url} WHERE source_key = ${d.key}`;
      }
    });
    await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail')`;
    console.log("\nApplied.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
