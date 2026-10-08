/**
 * seed-statewide-homelessness.ts
 *
 * Loads the PSU HRAC 2025 Oregon Statewide Homelessness Estimates report (January
 * 2026) into the database. The figures live in ingest/homelessness/hrac-statewide-2025.ts;
 * check them against the report PDF with ingest/homelessness/verify-hrac-statewide.ts first.
 *
 * Rebuilds:
 *   - homelessness.statewide_pit_by_county (Tables 1-2)
 *   - homelessness.statewide_unsheltered_change (Table 3)
 *   - homelessness.racial_disparities (pp. 16-18)
 *   - homelessness.shelter_bed_inventory (Table 17)
 *   - homelessness.student_homelessness (Table 19)
 *   - homelessness.doubled_up (Table 20)
 *   + upserts the statewide rows of homelessness.context_stats
 *
 * Usage:
 *   npx tsx ingest/seed-statewide-homelessness.ts              # dry run: prints what would change
 *   npx tsx ingest/seed-statewide-homelessness.ts --apply      # saves the current rows, then rebuilds
 *     [--archive-dir runtime-data/source-archive/<YYYY-MM-DD>]  # where the pre-change export goes
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";
import {
  COUNTY_PIT,
  CONTEXT_STATS,
  DOUBLED_UP,
  RACIAL_DISPARITIES,
  SHELTER_BEDS,
  STUDENT_HOMELESSNESS,
  UNSHELTERED_CHANGE,
} from "./homelessness/hrac-statewide-2025";

type Value = string | number | null;
type TableSpec = {
  name: string;
  ddl: string;
  /** Inserted columns, in the order of each row. The first is the row's key. */
  columns: string[];
  rows: Value[][];
};

const TABLES: TableSpec[] = [
  {
    name: "statewide_pit_by_county",
    ddl: `id SERIAL PRIMARY KEY, county TEXT NOT NULL, coc TEXT, sheltered INT, unsheltered INT, total INT,
      unsheltered_pct NUMERIC(5,1), shelter_beds INT, rate_per_1000_sheltered NUMERIC(6,2),
      rate_per_1000_unsheltered NUMERIC(6,2), rate_per_1000_total NUMERIC(6,2), year INT DEFAULT 2025`,
    columns: ["county", "coc", "sheltered", "unsheltered", "total", "unsheltered_pct", "shelter_beds",
      "rate_per_1000_sheltered", "rate_per_1000_unsheltered", "rate_per_1000_total"],
    rows: COUNTY_PIT,
  },
  {
    name: "statewide_unsheltered_change",
    ddl: `id SERIAL PRIMARY KEY, county TEXT NOT NULL, count_2023 INT, count_2025 INT, numeric_change INT, pct_change INT`,
    columns: ["county", "count_2023", "count_2025", "numeric_change", "pct_change"],
    rows: UNSHELTERED_CHANGE,
  },
  {
    name: "racial_disparities",
    ddl: `id SERIAL PRIMARY KEY, race_group TEXT NOT NULL, pct_of_population NUMERIC(5,1), pct_of_pit NUMERIC(5,1),
      disparity_ratio NUMERIC(5,2), scope TEXT DEFAULT 'statewide', year INT DEFAULT 2025`,
    columns: ["race_group", "pct_of_population", "pct_of_pit", "disparity_ratio"],
    rows: RACIAL_DISPARITIES,
  },
  {
    name: "shelter_bed_inventory",
    ddl: `id SERIAL PRIMARY KEY, county TEXT NOT NULL, seasonal_overflow INT, year_round INT, total_beds INT,
      total_homeless INT, beds_pct_of_pit INT, year INT DEFAULT 2025`,
    columns: ["county", "seasonal_overflow", "year_round", "total_beds", "total_homeless", "beds_pct_of_pit"],
    rows: SHELTER_BEDS,
  },
  {
    name: "student_homelessness",
    ddl: `id SERIAL PRIMARY KEY, county TEXT NOT NULL, count_2023_24 INT, count_2024_25 INT, numeric_change INT, pct_change NUMERIC(6,1)`,
    columns: ["county", "count_2023_24", "count_2024_25", "numeric_change", "pct_change"],
    rows: STUDENT_HOMELESSNESS,
  },
  {
    name: "doubled_up",
    ddl: `id SERIAL PRIMARY KEY, county TEXT NOT NULL, estimate INT, margin_of_error INT, year INT DEFAULT 2024`,
    columns: ["county", "estimate", "margin_of_error"],
    rows: DOUBLED_UP,
  },
];

const norm = (v: unknown) => (v === null || v === undefined ? "null" : String(Number(v) === Number(v) && v !== "" ? Number(v) : v));
const rowText = (cols: string[], vals: unknown[]) => cols.map((c, i) => `${c}=${norm(vals[i])}`).join(", ");

async function main() {
  const apply = process.argv.includes("--apply");
  const dirFlag = process.argv.indexOf("--archive-dir");
  const today = new Date().toISOString().slice(0, 10);
  const archiveDir = dirFlag > 0 ? process.argv[dirFlag + 1] : path.join("runtime-data", "source-archive", today);

  const sql = postgres(requireDatabaseUrl(), { prepare: false, max: 1, onnotice: () => {} });
  try {
    // ── Compare the database with the report ──
    const before: Record<string, unknown[]> = {};
    let changes = 0;
    for (const t of TABLES) {
      const exists = await sql`SELECT to_regclass(${`homelessness.${t.name}`}) AS r`;
      const current = exists[0].r ? await sql.unsafe(`SELECT * FROM homelessness.${t.name} ORDER BY id`) : [];
      before[t.name] = [...current];
      const byKey = new Map(current.map((r) => [String(r[t.columns[0]]), r]));
      const lines: string[] = [];
      for (const row of t.rows) {
        const old = byKey.get(String(row[0]));
        byKey.delete(String(row[0]));
        if (!old) lines.push(`  + ${rowText(t.columns, row)}`);
        else {
          const diff = t.columns.filter((c, i) => norm(old[c]) !== norm(row[i]));
          if (diff.length) lines.push(`  ~ ${row[0]}: ${diff.map((c) => `${c} ${norm(old[c])} -> ${norm(row[t.columns.indexOf(c)])}`).join(", ")}`);
        }
      }
      for (const [key] of byKey) lines.push(`  - ${key}`);
      changes += lines.length;
      console.log(`homelessness.${t.name}: ${current.length} rows now, ${t.rows.length} in the report, ${lines.length} changes`);
      for (const l of lines) console.log(l);
    }

    const metrics = CONTEXT_STATS.map((s) => s.metric);
    const ctx = await sql`SELECT metric, value, context, source, as_of_date::text AS as_of_date FROM homelessness.context_stats WHERE metric IN ${sql(metrics)}`;
    before.context_stats = [...ctx];
    const ctxBy = new Map(ctx.map((r) => [r.metric, r]));
    const ctxLines = CONTEXT_STATS.flatMap((s) => {
      const old = ctxBy.get(s.metric);
      if (!old) return [`  + ${s.metric} = ${s.value}`];
      const diff = (["value", "context", "source", "as_of_date"] as const).filter((k) => String(old[k]) !== s[k]);
      return diff.length ? [`  ~ ${s.metric}: ${diff.map((k) => `${k} "${old[k]}" -> "${s[k]}"`).join("; ")}`] : [];
    });
    changes += ctxLines.length;
    console.log(`homelessness.context_stats (statewide rows): ${ctxLines.length} changes`);
    for (const l of ctxLines) console.log(l);

    if (!apply) {
      console.log(`\nDry run: ${changes} changes. Nothing written. Re-run with --apply to rebuild.`);
      return;
    }

    // ── Save the current rows, then rebuild in one transaction ──
    mkdirSync(archiveDir, { recursive: true });
    const backup = path.join(archiveDir, `hrac-statewide-tables-before-${today}.json`);
    writeFileSync(backup, JSON.stringify(before, null, 1));
    console.log(`\nSaved the current rows to ${backup}`);

    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      await tx.unsafe(`CREATE SCHEMA IF NOT EXISTS homelessness`);
      for (const t of TABLES) {
        await tx.unsafe(`DROP TABLE IF EXISTS homelessness.${t.name} CASCADE; CREATE TABLE homelessness.${t.name} (${t.ddl})`);
        for (const row of t.rows) {
          const record = Object.fromEntries(t.columns.map((c, i) => [c, row[i]]));
          await tx`INSERT INTO ${tx(`homelessness.${t.name}`)} ${tx(record, ...t.columns)}`;
        }
        console.log(`  homelessness.${t.name}: ${t.rows.length} rows`);
      }
      for (const row of CONTEXT_STATS) {
        await tx`
          INSERT INTO homelessness.context_stats (metric, value, context, source, as_of_date)
          VALUES (${row.metric}, ${row.value}, ${row.context}, ${row.source}, ${row.as_of_date}::date)
          ON CONFLICT (metric) DO UPDATE SET
            value = EXCLUDED.value, context = EXCLUDED.context,
            source = EXCLUDED.source, as_of_date = EXCLUDED.as_of_date
        `;
      }
      console.log(`  homelessness.context_stats: ${CONTEXT_STATS.length} statewide rows upserted`);
    });
    // The dashboard serves a cached payload; clear it so the page reads the new rows.
    await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail')`;

    const check = await sql`
      SELECT (SELECT sum(total_beds)::int FROM homelessness.shelter_bed_inventory) AS beds,
             (SELECT sum(total_homeless)::int FROM homelessness.shelter_bed_inventory) AS homeless,
             (SELECT count_2024_25 FROM homelessness.student_homelessness WHERE county = 'Statewide') AS students`;
    console.log(`\nCheck: ${check[0].beds} shelter beds and ${check[0].homeless} people statewide (report: 12,607 and 27,119); ${check[0].students} students (report: 21,122).`);
  } finally {
    await sql.end();
  }
}

main().catch((err: unknown) => {
  console.error("\nERROR:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
