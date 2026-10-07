/**
 * fetch-hsd-dashboard.ts
 *
 * Refreshes homelessness.eviction_filings from Evicted in Oregon (PSU), the
 * Datawrapper chart "Eviction cases filed in Oregon in the past twelve months".
 * Run monthly; the chart is updated around the 15th.
 *
 *   1. https://datawrapper.dwcdn.net/0Ofed/ points (by meta refresh) to the newest
 *      published version (34 on Oct. 7, 2026).
 *   2. That version's page states the period ("filed between September 2025 and
 *      August 2026"). The CSV header names months without a year, so the period
 *      is what dates each column; the script refuses to load if they disagree.
 *   3. Every month in the window is rewritten, because the source revises recent
 *      months (April 2026 went from 955 to 966 between versions).
 *
 * The county's quarterly shelter dashboard (https://hsd.multco.us/quarterly-data-dashboard/)
 * that this script used to scrape has not changed since April 16, 2025 and its
 * quarters are fiscal, not calendar; shelter_capacity is now maintained by hand
 * (see ingest/homelessness/SOURCES.md).
 *
 * Before October 7, 2026 this script trimmed the CSV's leading tab, which shifted
 * every month one month late in the database (March's count stored as April's).
 * Rows from January 2025 on were reloaded on that date.
 *
 * Usage:
 *   npx tsx ingest/fetch-hsd-dashboard.ts            # dry run: prints what it would load
 *   npx tsx ingest/fetch-hsd-dashboard.ts --apply
 *   npx tsx ingest/fetch-hsd-dashboard.ts --calendar-year 2025 --apply   # a full calendar year
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";

const APPLY = process.argv.includes("--apply");
const yearArg = process.argv.indexOf("--calendar-year");
/** With --calendar-year YYYY, load Evicted in Oregon's full-year chart ("Eviction cases filed in Oregon in YYYY") instead. */
const CALENDAR_YEAR = yearArg > 0 ? process.argv[yearArg + 1] : null;
const CHART_ID = CALENDAR_YEAR ? "vlDrt" : "0Ofed";
const CHART = `https://datawrapper.dwcdn.net/${CHART_ID}/`;
const COUNTIES = ["Oregon", "Multnomah", "Washington", "Clackamas"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export type EvictionMonth = { county: string; month: string; filings: number };

/** "September 2025" -> [2025, 8] */
function parseMonthYear(text: string): [number, number] {
  const [name, year] = text.trim().split(/\s+/);
  const index = MONTHS.indexOf(name);
  if (index < 0 || !/^\d{4}$/.test(year)) throw new Error(`Cannot read "${text}" as a month and year`);
  return [Number(year), index];
}

/** Turns the chart's CSV into dated rows, using the period stated on the chart page. */
export function parseEvictionCsv(csv: string, periodStart: string, periodEnd: string): EvictionMonth[] {
  // trimEnd only: the header starts with an empty cell before "Total".
  const lines = csv.trimEnd().split("\n").map((line) => line.split("\t").map((cell) => cell.trim()));
  const header = lines[0];
  const monthColumns = header.slice(2); // "", "Total", then one column per month
  let [year, month] = parseMonthYear(periodStart);
  const dates = monthColumns.map((abbr) => {
    if (!MONTHS[month].startsWith(abbr)) throw new Error(`Column "${abbr}" does not match ${MONTHS[month]} ${year}`);
    const date = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    month += 1;
    if (month === 12) { month = 0; year += 1; }
    return date;
  });
  const [endYear, endMonth] = parseMonthYear(periodEnd);
  if (dates.at(-1) !== `${endYear}-${String(endMonth + 1).padStart(2, "0")}-01`) throw new Error(`CSV ends ${dates.at(-1)}, page says ${periodEnd}`);
  const rows: EvictionMonth[] = [];
  for (const cols of lines.slice(1)) {
    const county = cols[0].replace(/\*$/, "");
    if (!COUNTIES.includes(county)) continue;
    monthColumns.forEach((_, j) => {
      const filings = Number.parseInt(cols[j + 2], 10);
      if (Number.isFinite(filings)) rows.push({ county: county === "Oregon" ? "Oregon (statewide)" : county, month: dates[j], filings });
    });
  }
  return rows;
}

async function fetchLatest(): Promise<{ version: string; updated: string | null; rows: EvictionMonth[] }> {
  // The unversioned URL answers with a meta-refresh page naming the newest version.
  const pointer = await (await fetch(CHART)).text();
  const version = pointer.match(new RegExp(`/${CHART_ID}/(\\d+)/`))?.[1];
  if (!version) throw new Error(`No version in the page at ${CHART}`);
  const html = await (await fetch(`${CHART}${version}/`)).text();
  let period: [string, string];
  if (CALENDAR_YEAR) {
    if (!html.includes(`in Oregon in ${CALENDAR_YEAR}`)) throw new Error(`Chart ${CHART_ID} v${version} is not the ${CALENDAR_YEAR} chart; check it by hand`);
    period = [`January ${CALENDAR_YEAR}`, `December ${CALENDAR_YEAR}`];
  } else {
    const stated = html.match(/filed between ([A-Z][a-z]+ \d{4}) and ([A-Z][a-z]+ \d{4})/);
    if (!stated) throw new Error("The chart page no longer states the period it covers; check it by hand");
    period = [stated[1], stated[2]];
  }
  const updated = html.match(/Updated on ([A-Z][a-z]+ \d{1,2}, \d{4})/)?.[1] ?? null;
  const csv = await (await fetch(`${CHART}${version}/dataset.csv`)).text();
  return { version, updated, rows: parseEvictionCsv(csv, period[0], period[1]) };
}

async function main() {
  const { version, updated, rows } = await fetchLatest();
  const months = [...new Set(rows.map((r) => r.month))].sort();
  console.log(`Evicted in Oregon chart ${CHART_ID} version ${version}${updated ? `, updated ${updated}` : ""}: ${months[0]} to ${months.at(-1)}, ${rows.length} rows`);
  console.table(rows.filter((r) => r.county === "Multnomah").map((r) => ({ month: r.month, filings: r.filings })));
  if (!APPLY) { console.log("Dry run. Nothing written."); return; }

  const sql = postgres(requireDatabaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
  try {
    const source = `Evicted in Oregon (PSU), Datawrapper chart ${CHART_ID} v${version}${updated ? `, updated ${updated}` : ""}: ${CHART}${version}/`;
    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      for (const r of rows) {
        await tx`INSERT INTO homelessness.eviction_filings (month, county, filings, filing_rate_per_100, source)
          VALUES (${r.month}, ${r.county}, ${r.filings}, NULL, ${source})
          ON CONFLICT (month, county) DO UPDATE SET filings = EXCLUDED.filings, filing_rate_per_100 = NULL, source = EXCLUDED.source`;
      }
    });
    await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail')`;
    console.log(`Loaded ${rows.length} rows.`);
  } finally {
    await sql.end();
  }
}

if (process.argv[1]?.endsWith("fetch-hsd-dashboard.ts")) main().catch((error) => { console.error(error); process.exit(1); });
