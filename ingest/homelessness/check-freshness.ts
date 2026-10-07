/**
 * check-freshness.ts
 *
 * Reports, for every table in sources.ts, the newest period in the database and
 * whether a newer period should be published by now. Read-only.
 *
 * Usage: npx tsx ingest/homelessness/check-freshness.ts
 * Exit code 1 when any table is overdue, so it can run on a schedule.
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "../lib/db-url";
import { DATASETS, type Cadence } from "./sources";

const CADENCE_MONTHS: Record<Cadence, number | null> = {
  nightly: 0, monthly: 1, quarterly: 3, annual: 12, biennial: 24, irregular: null,
};

/** The last day covered by a period label: 2025, 2025-10, 2025-10-31, 2024-Q4, FY2025. */
export function periodEnd(label: string): Date | null {
  let m: RegExpMatchArray | null;
  if ((m = label.match(/^(\d{4})-(\d{2})-(\d{2})/))) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if ((m = label.match(/^(\d{4})-(\d{2})$/))) return new Date(Date.UTC(+m[1], +m[2], 0));
  if ((m = label.match(/^(\d{4})-Q([1-4])$/))) return new Date(Date.UTC(+m[1], +m[2] * 3, 0));
  if ((m = label.match(/^FY ?(\d{4}) Q([1-4])/i))) return new Date(Date.UTC(+m[1] - 1, 6 + +m[2] * 3, 0));
  if ((m = label.match(/^FY ?(\d{4})$/i))) return new Date(Date.UTC(+m[1], 6, 0));
  if ((m = label.match(/^(\d{4})$/))) return new Date(Date.UTC(+m[1], 12, 0));
  return null;
}

const monthsBetween = (a: Date, b: Date) => (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());

async function main() {
  const sql = postgres(requireDatabaseUrl(), { max: 1 });
  const today = new Date();
  let overdue = 0;
  const rows = [];
  try {
    for (const d of DATASETS) {
      let newest = "n/a";
      if (d.periodSql) {
        const r = await sql.unsafe(`SELECT ${d.periodSql} AS p FROM ${d.table}`);
        newest = r[0]?.p ?? "empty";
      }
      const end = periodEnd(newest);
      const cadence = CADENCE_MONTHS[d.cadence];
      let status = "ok";
      if (!end) status = d.periodSql ? "no period" : "untracked";
      else if (cadence !== null) {
        const age = monthsBetween(end, today);
        if (age > cadence + d.publicationLagMonths) { status = `check upstream (${age} months old)`; overdue++; }
      }
      rows.push({ table: d.table.replace("homelessness.", ""), cadence: d.cadence, newest, status, refresh: d.refresh.split(":")[0] });
    }
  } finally {
    await sql.end();
  }
  console.table(rows);
  if (overdue) { console.log(`\n${overdue} table(s) may have newer data upstream. Steps: ingest/homelessness/SOURCES.md`); process.exitCode = 1; }
}

if (process.argv[1]?.endsWith("check-freshness.ts")) main().catch((e) => { console.error(e); process.exit(1); });
