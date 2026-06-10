#!/usr/bin/env npx tsx
/**
 * seed-attendance-data.ts
 *
 * Parses ODE Regular Attenders / Chronic Absenteeism XLSX files (2014-15 through 2024-25)
 * and loads them into education.chronic_absenteeism for the 6 Portland-area districts.
 *
 * File variants:
 *   - notchronicallyabsent_1415.xlsx, notchronicallyabsent_1516.xlsx
 *     → single-sheet, columns: District ID, District, Institution ID, Institution,
 *       Institution Type, Subgroup/Grade Level, Students Included,
 *       Students Not Chronically Absent, Percent of Students Not Chronically Absent
 *
 *   - regularattenders_1617.xlsx
 *     → two sheets (Data, Notes), header row spans 2 rows (merged cells),
 *       columns A-K: District ID, District, Institution ID, Institution, Institution Type,
 *       Student Group, Students Included, [Regular Attenders] Number, %, [Chronically Absent] Number, %
 *
 *   - regularattenders_1718.xlsx
 *     → two sheets (Notes, Data), single header row,
 *       columns: District ID, District, Institution ID, Institution, Institution Type,
 *       Student Group, Students Included, Regular Attenders Number, Regular Attenders Percent,
 *       Chronically Absent Number, Chronically Absent %
 *
 *   - regularattenders_1819.xlsx through regularattenders_2122.xlsx
 *     → two sheets (Data Notes, YYYY-YYYY Regular Attenders), single header row, 11 columns (no Report Year)
 *
 *   - regularattenders_2223.xlsx through regularattenders_2425.xlsx
 *     → two sheets (Data Notes, YYYY-YYYY Regular Attenders), single header row, 12 columns (has Report Year col)
 *
 * Usage: set -a && source .env.local && set +a && npx tsx ingest/seed-attendance-data.ts
 */

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const XLSX = require("xlsx");

const DB_URL = process.env.DATABASE_URL!;
if (!DB_URL) {
  console.error("DATABASE_URL not set. Source .env.local first.");
  process.exit(1);
}

const sql = postgres(DB_URL, { prepare: false, max: 1 });

const DATA_DIR = path.resolve(
  new URL(".", import.meta.url).pathname,
  "..",
  "data",
  "ode_attendance"
);

// ── Portland districts ──────────────────────────────────────────────
const PORTLAND_DISTRICT_IDS = new Set([2180, 2181, 2182, 2185, 2187, 2188]);

// ── File → school year mapping ──────────────────────────────────────
function yearFromFilename(filename: string): string | null {
  // regularattenders_2425 → '2024-25', notchronicallyabsent_1415 → '2014-15'
  const m = filename.match(/(\d{2})(\d{2})\./);
  if (!m) return null;
  const startYY = parseInt(m[1], 10);
  const endYY = parseInt(m[2], 10);
  const startFull = startYY >= 90 ? 1900 + startYY : 2000 + startYY;
  return `${startFull}-${String(endYY).padStart(2, "0")}`;
}

// ── Row type ────────────────────────────────────────────────────────
interface AttendanceRow {
  school_year: string;
  district_name: string;
  institution_name: string | null;
  institution_type: string;
  student_group: string;
  students_included: number | null;
  regular_attenders: number | null;
  regular_attender_pct: number | null;
  chronically_absent: number | null;
  chronically_absent_pct: number | null;
}

// ── Parse a numeric cell that may be suppressed (*, <5, >95) ───────
function parseNum(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return val;
  const s = String(val).trim();
  if (s === "*" || s.startsWith("<") || s.startsWith(">")) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// Normalize student group names across years
function normalizeGroup(raw: string): string {
  const s = raw.trim();
  // Older files use "All Students", newer use "Total" — normalize to "Total"
  if (s === "All Students") return "Total";
  return s;
}

// Normalize institution type across formats
function normalizeInstType(raw: string): string {
  const s = raw.trim();
  if (s === "State Level" || s === "State") return "State";
  return s; // "District" or "School" pass through
}

// ── Parse notchronicallyabsent files (2014-15, 2015-16) ────────────
function parseNotChronicallyAbsent(filepath: string, schoolYear: string): AttendanceRow[] {
  const wb = XLSX.readFile(filepath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);
  const rows: AttendanceRow[] = [];

  for (const r of raw) {
    const districtId = parseNum(r["District ID"]);
    if (districtId === null) continue;

    // Filter to Portland districts (and State-level for reference, but we skip it)
    if (!PORTLAND_DISTRICT_IDS.has(districtId) && districtId !== 9999) continue;
    // Skip state-level rows
    if (districtId === 9999) continue;

    const studentsIncluded = parseNum(r[" Students Included "] ?? r["Students Included"]);
    const notChronicNum = parseNum(r[" Students Not Chronically Absent "] ?? r["Students Not Chronically Absent"]);
    const notChronicPct = parseNum(r[" Percent of Students Not Chronically Absent "] ?? r["Percent of Students Not Chronically Absent"]);

    // Derive chronic absenteeism from "not chronically absent"
    const chronicNum = studentsIncluded !== null && notChronicNum !== null
      ? studentsIncluded - notChronicNum
      : null;
    const chronicPct = notChronicPct !== null
      ? Math.round((100 - notChronicPct) * 10) / 10
      : null;

    rows.push({
      school_year: schoolYear,
      district_name: String(r["District"] ?? "").trim(),
      institution_name: String(r["Institution"] ?? "").trim() || null,
      institution_type: normalizeInstType(String(r["Institution Type"] ?? "")),
      student_group: normalizeGroup(String(r["Subgroup/Grade Level"] ?? r["Student Group"] ?? "")),
      students_included: studentsIncluded,
      regular_attenders: notChronicNum,
      regular_attender_pct: notChronicPct,
      chronically_absent: chronicNum,
      chronically_absent_pct: chronicPct,
    });
  }

  return rows;
}

// ── Parse regularattenders_1617 (two-row header with merged cells) ──
function parseRegularAttenders1617(filepath: string, schoolYear: string): AttendanceRow[] {
  const wb = XLSX.readFile(filepath);
  const sheet = wb.Sheets["Data"];
  if (!sheet) {
    console.warn(`  No "Data" sheet in ${filepath}`);
    return [];
  }

  // Read as array-of-arrays to handle the multi-row header
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  // Row 0 has the headers with merged cells, Row 1 has Number/% sub-headers
  // Columns: 0=District ID, 1=District, 2=Institution ID, 3=Institution,
  //          4=Institution Type, 5=Student Group, 6=Students Included,
  //          7=Regular Attenders Number, 8=Regular Attenders %,
  //          9=Chronically Absent Number, 10=Chronically Absent %

  const rows: AttendanceRow[] = [];
  for (let i = 2; i < raw.length; i++) {
    const r = raw[i];
    if (!r || r.length < 7) continue;

    const districtId = parseNum(r[0]);
    if (districtId === null) continue;
    if (!PORTLAND_DISTRICT_IDS.has(districtId)) continue;

    rows.push({
      school_year: schoolYear,
      district_name: String(r[1] ?? "").trim(),
      institution_name: String(r[3] ?? "").trim() || null,
      institution_type: normalizeInstType(String(r[4] ?? "")),
      student_group: normalizeGroup(String(r[5] ?? "")),
      students_included: parseNum(r[6]),
      regular_attenders: parseNum(r[7]),
      regular_attender_pct: parseNum(r[8]),
      chronically_absent: parseNum(r[9]),
      chronically_absent_pct: parseNum(r[10]),
    });
  }

  return rows;
}

// ── Parse regularattenders files (1718 onward) ──────────────────────
function parseRegularAttenders(filepath: string, schoolYear: string): AttendanceRow[] {
  const wb = XLSX.readFile(filepath);

  // Find the data sheet (not "Notes" / "Data Notes")
  const dataSheetName = wb.SheetNames.find(
    (n: string) => !n.toLowerCase().includes("note")
  );
  if (!dataSheetName) {
    console.warn(`  No data sheet found in ${filepath}`);
    return [];
  }

  const sheet = wb.Sheets[dataSheetName];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);
  const rows: AttendanceRow[] = [];

  // Detect whether this file has a "Report Year" column (2223+)
  const firstRow = raw[0] ?? {};
  const hasReportYear = "Report Year" in firstRow;

  for (const r of raw) {
    const distIdKey = hasReportYear ? "District ID" : "District ID";
    const districtId = parseNum(r[distIdKey]);
    if (districtId === null) continue;
    if (!PORTLAND_DISTRICT_IDS.has(districtId)) continue;

    rows.push({
      school_year: schoolYear,
      district_name: String(r["District"] ?? "").trim(),
      institution_name: String(r["Institution"] ?? "").trim() || null,
      institution_type: normalizeInstType(String(r["Institution Type"] ?? "")),
      student_group: normalizeGroup(String(r["Student Group"] ?? "")),
      students_included: parseNum(r["Students Included"]),
      regular_attenders: parseNum(r["Number Regular Attenders"]),
      regular_attender_pct: parseNum(r["Percent Regular Attenders"]),
      chronically_absent: parseNum(r["Number Chronically Absent"]),
      chronically_absent_pct: parseNum(r["Percent Chronically Absent"]),
    });
  }

  return rows;
}

// ── For regularattenders_1718 which has slightly different col names ──
function parseRegularAttenders1718(filepath: string, schoolYear: string): AttendanceRow[] {
  const wb = XLSX.readFile(filepath);
  const dataSheetName = wb.SheetNames.find(
    (n: string) => !n.toLowerCase().includes("note")
  );
  if (!dataSheetName) {
    console.warn(`  No data sheet found in ${filepath}`);
    return [];
  }

  const sheet = wb.Sheets[dataSheetName];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);
  const rows: AttendanceRow[] = [];

  for (const r of raw) {
    const districtId = parseNum(r["District ID"]);
    if (districtId === null) continue;
    if (!PORTLAND_DISTRICT_IDS.has(districtId)) continue;

    // 1718 uses "Regular Attenders Number" / "Regular Attenders Percent"
    // or "Number Regular Attenders" / "Percent Regular Attenders" — handle both
    const regNum = parseNum(r["Regular Attenders Number"] ?? r["Number Regular Attenders"]);
    const regPct = parseNum(r["Regular Attenders Percent"] ?? r["Percent Regular Attenders"]);
    const absNum = parseNum(r["Chronically Absent Number"] ?? r["Number Chronically Absent"]);
    const absPct = parseNum(r["Chronically Absent %"] ?? r["Chronically Absent Percent"] ?? r["Percent Chronically Absent"]);

    rows.push({
      school_year: schoolYear,
      district_name: String(r["District"] ?? "").trim(),
      institution_name: String(r["Institution"] ?? "").trim() || null,
      institution_type: normalizeInstType(String(r["Institution Type"] ?? "")),
      student_group: normalizeGroup(String(r["Student Group"] ?? "")),
      students_included: parseNum(r["Students Included"] ?? r[" Students Included "]),
      regular_attenders: regNum,
      regular_attender_pct: regPct,
      chronically_absent: absNum,
      chronically_absent_pct: absPct,
    });
  }

  return rows;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log("Seeding chronic absenteeism data...\n");

  // Collect all files
  const files = fs.readdirSync(DATA_DIR).filter(
    (f) =>
      (f.startsWith("regularattenders_") || f.startsWith("notchronicallyabsent_")) &&
      f.endsWith(".xlsx")
  ).sort();

  console.log(`Found ${files.length} files:\n  ${files.join("\n  ")}\n`);

  // Parse all files
  let allRows: AttendanceRow[] = [];

  for (const file of files) {
    const filepath = path.join(DATA_DIR, file);
    const schoolYear = yearFromFilename(file);
    if (!schoolYear) {
      console.warn(`  Skipping ${file} — cannot determine school year`);
      continue;
    }

    let rows: AttendanceRow[];
    if (file.startsWith("notchronicallyabsent_")) {
      rows = parseNotChronicallyAbsent(filepath, schoolYear);
    } else if (file === "regularattenders_1617.xlsx") {
      rows = parseRegularAttenders1617(filepath, schoolYear);
    } else if (file === "regularattenders_1718.xlsx") {
      rows = parseRegularAttenders1718(filepath, schoolYear);
    } else {
      rows = parseRegularAttenders(filepath, schoolYear);
    }

    console.log(`  ${file} → ${schoolYear}: ${rows.length} Portland rows`);
    allRows = allRows.concat(rows);
  }

  console.log(`\nTotal rows to insert: ${allRows.length}\n`);

  if (allRows.length === 0) {
    console.error("No rows parsed — aborting.");
    await sql.end();
    process.exit(1);
  }

  // Drop and recreate table
  console.log("Creating education.chronic_absenteeism table...");
  await sql.unsafe(`
    CREATE SCHEMA IF NOT EXISTS education;
    DROP TABLE IF EXISTS education.chronic_absenteeism CASCADE;
    CREATE TABLE education.chronic_absenteeism (
      id SERIAL PRIMARY KEY,
      school_year TEXT NOT NULL,
      district_name TEXT NOT NULL,
      institution_name TEXT,
      institution_type TEXT,
      student_group TEXT NOT NULL,
      students_included INT,
      regular_attenders INT,
      regular_attender_pct NUMERIC(5,1),
      chronically_absent INT,
      chronically_absent_pct NUMERIC(5,1),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Batch insert
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
    const batch = allRows.slice(i, i + BATCH_SIZE);
    const values = batch
      .map(
        (r) =>
          `(${esc(r.school_year)}, ${esc(r.district_name)}, ${esc(r.institution_name)}, ${esc(r.institution_type)}, ${esc(r.student_group)}, ${numOrNull(r.students_included)}, ${numOrNull(r.regular_attenders)}, ${numOrNull(r.regular_attender_pct)}, ${numOrNull(r.chronically_absent)}, ${numOrNull(r.chronically_absent_pct)})`
      )
      .join(",\n");

    await sql.unsafe(`
      INSERT INTO education.chronic_absenteeism
        (school_year, district_name, institution_name, institution_type, student_group, students_included, regular_attenders, regular_attender_pct, chronically_absent, chronically_absent_pct)
      VALUES ${values}
    `);
    inserted += batch.length;
  }

  console.log(`\nInserted ${inserted} rows.\n`);

  // Create indexes
  await sql.unsafe(`
    CREATE INDEX idx_chronic_absenteeism_district ON education.chronic_absenteeism (district_name);
    CREATE INDEX idx_chronic_absenteeism_year ON education.chronic_absenteeism (school_year);
    CREATE INDEX idx_chronic_absenteeism_type ON education.chronic_absenteeism (institution_type);
  `);

  // ── Summary ────────────────────────────────────────────────────────
  console.log("=== ROWS BY YEAR ===");
  const byYear = await sql.unsafe(`
    SELECT school_year, COUNT(*)::int AS cnt
    FROM education.chronic_absenteeism
    GROUP BY school_year ORDER BY school_year
  `);
  for (const r of byYear) {
    console.log(`  ${r.school_year}: ${r.cnt} rows`);
  }

  console.log("\n=== ROWS BY DISTRICT ===");
  const byDist = await sql.unsafe(`
    SELECT district_name, COUNT(*)::int AS cnt
    FROM education.chronic_absenteeism
    GROUP BY district_name ORDER BY district_name
  `);
  for (const r of byDist) {
    console.log(`  ${r.district_name}: ${r.cnt} rows`);
  }

  // Quick sanity check: PPS Total rates by year
  console.log("\n=== PPS CHRONIC ABSENTEEISM % BY YEAR (District-level, Total) ===");
  const ppsTrend = await sql.unsafe(`
    SELECT school_year, chronically_absent_pct, students_included
    FROM education.chronic_absenteeism
    WHERE district_name = 'Portland SD 1J'
      AND institution_type = 'District'
      AND student_group = 'Total'
    ORDER BY school_year
  `);
  for (const r of ppsTrend) {
    console.log(`  ${r.school_year}: ${r.chronically_absent_pct}% (n=${r.students_included})`);
  }

  await sql.end();
  console.log("\nDone.");
}

// ── SQL helpers ─────────────────────────────────────────────────────
function esc(val: string | null): string {
  if (val === null) return "NULL";
  return `'${val.replace(/'/g, "''")}'`;
}

function numOrNull(val: number | null): string {
  if (val === null || val === undefined) return "NULL";
  return String(val);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
