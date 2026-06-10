/**
 * sync-crime.ts
 *
 * Incremental crime data sync from PPB Tableau Public CSV downloads.
 * Safe to run repeatedly — uses UPSERT keyed on (case_number, offense_type).
 *
 * Data source:
 *   https://public.tableau.com/views/PPBOpenDataDownloads/New_Offense_Data_{YEAR}.csv
 *   Available for 2015-2026, ~57K records/year, no auth required.
 *
 * How it works:
 *   1. Queries DB for MAX(occur_date) to determine what year(s) need updating
 *   2. Always fetches current year + previous year (late-arriving reports)
 *   3. Parses CSV, maps columns, upserts via ON CONFLICT
 *   4. Clears safety dashboard cache after sync
 *   5. Prints year-by-year summary to verify
 *
 * Usage:
 *   npx tsx ingest/sync-crime.ts                # incremental (current + prev year)
 *   npx tsx ingest/sync-crime.ts --full          # re-sync all years 2015-2026
 *   npx tsx ingest/sync-crime.ts --year 2024     # sync a specific year only
 */

import postgres from "postgres";

// ── Config ──────────────────────────────────────────────────────────────

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required.");
  console.error(
    "Run with: set -a && source .env.local && set +a && npx tsx ingest/sync-crime.ts"
  );
  process.exit(1);
}

const sql = postgres(DB_URL, {
  prepare: false, // Required for Supabase transaction pooler
  max: 1, // Avoid deadlocks under max:1 pooler
  onnotice: () => {},
});

const TABLEAU_URL_TEMPLATE =
  "https://public.tableau.com/views/PPBOpenDataDownloads/New_Offense_Data_{YEAR}.csv?:showVizHome=no";

const INSERT_BATCH = 500;
const FIRST_AVAILABLE_YEAR = 2015;
const CURRENT_YEAR = new Date().getFullYear();

// ── Parse CLI args ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
const fullSync = args.includes("--full");
const yearIdx = args.indexOf("--year");
const specificYear =
  yearIdx >= 0 ? parseInt(args[yearIdx + 1], 10) : null;

// ── CSV Parser ─────────────────────────────────────────────────────────

/**
 * Parse CSV text that may contain quoted fields with commas.
 * Handles: "123 NW Foo, Suite 4",CaseNum,...
 */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split("\n");
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? "";
    }
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

// ── Date parsing ───────────────────────────────────────────────────────

/**
 * Parse M/D/YYYY date format to YYYY-MM-DD string.
 * Returns null for invalid/empty dates.
 */
function parseDateMDY(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;

  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  if (year < 2000 || year > 2030) return null; // Reject garbage dates
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Parse OccurTime (integer like 127 = 01:27, 2345 = 23:45) to HH:MM string.
 */
function parseTime(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const num = parseInt(raw.trim(), 10);
  if (isNaN(num) || num < 0 || num > 2359) return null;

  const hours = Math.floor(num / 100);
  const minutes = num % 100;
  if (hours > 23 || minutes > 59) return null;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// ── Row mapping ────────────────────────────────────────────────────────

interface CrimeRow {
  case_number: string;
  address: string | null;
  council_district: string | null;
  crime_against: string | null;
  custom_crime_against: string | null;
  custom_crime_category: string | null;
  neighborhood: string | null;
  occur_date: string | null;
  occur_time: string | null;
  offense_category: string | null;
  offense_count: number | null;
  offense_type: string | null;
  lat: number | null;
  lon: number | null;
  x: number | null;
  y: number | null;
  report_date: string | null;
  report_month_year: string | null;
}

function csvRowToCrimeRow(r: Record<string, string>): CrimeRow | null {
  const caseNumber = r["CaseNumber"]?.trim();
  if (!caseNumber) return null;

  const offenseType = r["OffenseType"]?.trim() || null;
  const occurDate = parseDateMDY(r["OccurDate"]);

  // Must have at least a case number and an offense type
  if (!offenseType) return null;

  const lat = r["OpenDataLat"] ? parseFloat(r["OpenDataLat"]) : null;
  const lon = r["OpenDataLon"] ? parseFloat(r["OpenDataLon"]) : null;
  const xCoord = r["OpenDataX"] ? parseFloat(r["OpenDataX"]) : null;
  const yCoord = r["OpenDataY"] ? parseFloat(r["OpenDataY"]) : null;
  const offenseCount = r["OffenseCount"]
    ? parseInt(r["OffenseCount"], 10)
    : null;

  return {
    case_number: caseNumber,
    address: r["Address"]?.trim() || null,
    council_district: r["CouncilDistrict"]?.trim() || null,
    crime_against: r["CrimeAgainst"]?.trim() || null,
    custom_crime_against: r["CustomCrimeAgainst"]?.trim() || null,
    custom_crime_category: r["CustomCrimeCategory"]?.trim() || null,
    neighborhood: r["Neighborhood"]?.trim() || null,
    occur_date: occurDate,
    occur_time: parseTime(r["OccurTime"]),
    offense_category: r["OffenseCategory"]?.trim() || null,
    offense_count: isNaN(offenseCount!) ? null : offenseCount,
    offense_type: offenseType,
    lat: lat && !isNaN(lat) ? lat : null,
    lon: lon && !isNaN(lon) ? lon : null,
    x: xCoord && !isNaN(xCoord) ? xCoord : null,
    y: yCoord && !isNaN(yCoord) ? yCoord : null,
    report_date: parseDateMDY(r["ReportDate"]),
    report_month_year: r["ReportMonthYear"]?.trim() || null,
  };
}

// ── Fetch CSV ──────────────────────────────────────────────────────────

async function fetchYearCSV(
  year: number,
  retries = 3
): Promise<Record<string, string>[]> {
  const url = TABLEAU_URL_TEMPLATE.replace("{YEAR}", String(year));
  console.log(`\n  Fetching ${year}: ${url}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          console.log(`    ${year}: Not found (404) — skipping`);
          return [];
        }
        if (attempt < retries) {
          const wait = attempt * 3000;
          console.log(
            `    HTTP ${res.status}, retry ${attempt}/${retries} in ${wait / 1000}s...`
          );
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        throw new Error(`HTTP ${res.status} after ${retries} attempts`);
      }

      const text = await res.text();

      // Tableau sometimes returns HTML instead of CSV on error
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        if (attempt < retries) {
          const wait = attempt * 3000;
          console.log(
            `    Got HTML instead of CSV, retry ${attempt}/${retries} in ${wait / 1000}s...`
          );
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        console.log(`    ${year}: Got HTML response — skipping`);
        return [];
      }

      const rows = parseCSV(text);
      console.log(`    ${year}: ${rows.length} rows parsed`);
      return rows;
    } catch (err: any) {
      if (attempt < retries && !err.message?.includes("after")) {
        const wait = attempt * 3000;
        console.log(
          `    Fetch error: ${err.message}, retry ${attempt}/${retries} in ${wait / 1000}s...`
        );
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}

// ── Upsert ─────────────────────────────────────────────────────────────

async function ensureUniqueConstraint(): Promise<void> {
  // Add unique constraint if not already present (needed for ON CONFLICT)
  const existing = await sql`
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'safety.ppb_offenses'::regclass
      AND conname = 'ppb_offenses_case_offense_uq'
  `;
  if (existing.length === 0) {
    console.log("\n  Creating unique constraint on (case_number, offense_type)...");
    // First deduplicate any existing rows (keep lowest id)
    const dupeCount = await sql`
      DELETE FROM safety.ppb_offenses a
      USING safety.ppb_offenses b
      WHERE a.case_number = b.case_number
        AND a.offense_type = b.offense_type
        AND a.id > b.id
    `;
    if (dupeCount.count > 0) {
      console.log(`    Removed ${dupeCount.count} duplicate rows before creating constraint`);
    }
    await sql`
      ALTER TABLE safety.ppb_offenses
      ADD CONSTRAINT ppb_offenses_case_offense_uq
      UNIQUE (case_number, offense_type)
    `;
    console.log("    Constraint created.");
  } else {
    console.log("\n  Unique constraint ppb_offenses_case_offense_uq already exists.");
  }
}

async function upsertBatch(
  rows: CrimeRow[]
): Promise<{ affected: number }> {
  if (rows.length === 0) return { affected: 0 };

  const result = await sql`
    INSERT INTO safety.ppb_offenses (
      case_number, address, council_district, crime_against,
      custom_crime_against, custom_crime_category, neighborhood,
      occur_date, occur_time, offense_category, offense_count,
      offense_type, lat, lon, x, y, report_date, report_month_year
    )
    SELECT * FROM unnest(
      ${sql.array(rows.map((r) => r.case_number))}::text[],
      ${sql.array(rows.map((r) => r.address))}::text[],
      ${sql.array(rows.map((r) => r.council_district))}::text[],
      ${sql.array(rows.map((r) => r.crime_against))}::text[],
      ${sql.array(rows.map((r) => r.custom_crime_against))}::text[],
      ${sql.array(rows.map((r) => r.custom_crime_category))}::text[],
      ${sql.array(rows.map((r) => r.neighborhood))}::text[],
      ${sql.array(rows.map((r) => r.occur_date))}::date[],
      ${sql.array(rows.map((r) => r.occur_time))}::text[],
      ${sql.array(rows.map((r) => r.offense_category))}::text[],
      ${sql.array(rows.map((r) => r.offense_count))}::int[],
      ${sql.array(rows.map((r) => r.offense_type))}::text[],
      ${sql.array(rows.map((r) => r.lat))}::float8[],
      ${sql.array(rows.map((r) => r.lon))}::float8[],
      ${sql.array(rows.map((r) => r.x))}::float8[],
      ${sql.array(rows.map((r) => r.y))}::float8[],
      ${sql.array(rows.map((r) => r.report_date))}::date[],
      ${sql.array(rows.map((r) => r.report_month_year))}::text[]
    )
    ON CONFLICT (case_number, offense_type)
    DO UPDATE SET
      address              = EXCLUDED.address,
      council_district     = EXCLUDED.council_district,
      crime_against        = EXCLUDED.crime_against,
      custom_crime_against = EXCLUDED.custom_crime_against,
      custom_crime_category = EXCLUDED.custom_crime_category,
      neighborhood         = EXCLUDED.neighborhood,
      occur_date           = EXCLUDED.occur_date,
      occur_time           = EXCLUDED.occur_time,
      offense_category     = EXCLUDED.offense_category,
      offense_count        = EXCLUDED.offense_count,
      lat                  = EXCLUDED.lat,
      lon                  = EXCLUDED.lon,
      x                    = EXCLUDED.x,
      y                    = EXCLUDED.y,
      report_date          = EXCLUDED.report_date,
      report_month_year    = EXCLUDED.report_month_year
    WHERE
      safety.ppb_offenses.address              IS DISTINCT FROM EXCLUDED.address
      OR safety.ppb_offenses.council_district  IS DISTINCT FROM EXCLUDED.council_district
      OR safety.ppb_offenses.neighborhood      IS DISTINCT FROM EXCLUDED.neighborhood
      OR safety.ppb_offenses.occur_date        IS DISTINCT FROM EXCLUDED.occur_date
      OR safety.ppb_offenses.lat               IS DISTINCT FROM EXCLUDED.lat
      OR safety.ppb_offenses.lon               IS DISTINCT FROM EXCLUDED.lon
      OR safety.ppb_offenses.report_date       IS DISTINCT FROM EXCLUDED.report_date
  `;

  return { affected: result.count };
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("Portland Crime Data — PPB Offense Sync");
  console.log("=======================================");
  console.log(
    `Mode: ${fullSync ? "FULL (2015-" + CURRENT_YEAR + ")" : specificYear ? `year ${specificYear}` : "INCREMENTAL"}`
  );

  // 1. Get current state
  const [state] = await sql`
    SELECT
      MAX(occur_date) AS max_date,
      COUNT(*)::int AS total
    FROM safety.ppb_offenses
  `;

  console.log(`\nCurrent DB state:`);
  console.log(`  Total offenses: ${state.total}`);
  console.log(`  Latest occur_date: ${state.max_date}`);

  // 2. Ensure unique constraint exists for upsert
  await ensureUniqueConstraint();

  // 3. Determine which years to sync
  let yearsToSync: number[] = [];

  if (fullSync) {
    for (let y = FIRST_AVAILABLE_YEAR; y <= CURRENT_YEAR; y++) {
      yearsToSync.push(y);
    }
  } else if (specificYear) {
    yearsToSync = [specificYear];
  } else {
    // Incremental: current year + previous year for late-arriving reports
    yearsToSync = [CURRENT_YEAR - 1, CURRENT_YEAR];
  }

  console.log(`\n  Years to sync: ${yearsToSync.join(", ")}`);

  // 4. Fetch and process each year
  let totalFetched = 0;
  let totalValid = 0;
  let totalSkipped = 0;
  let totalAffected = 0;
  let totalErrors = 0;

  for (const year of yearsToSync) {
    try {
      const csvRows = await fetchYearCSV(year);
      if (csvRows.length === 0) continue;

      totalFetched += csvRows.length;

      // Transform to DB rows
      const rows: CrimeRow[] = [];
      let yearSkipped = 0;
      for (const csvRow of csvRows) {
        const row = csvRowToCrimeRow(csvRow);
        if (row) {
          rows.push(row);
        } else {
          yearSkipped++;
        }
      }
      totalValid += rows.length;
      totalSkipped += yearSkipped;

      console.log(
        `    ${year}: ${rows.length} valid, ${yearSkipped} skipped`
      );

      // Upsert in batches
      let yearAffected = 0;
      for (let i = 0; i < rows.length; i += INSERT_BATCH) {
        const batch = rows.slice(i, i + INSERT_BATCH);
        try {
          const { affected } = await upsertBatch(batch);
          yearAffected += affected;
          if (
            (i + INSERT_BATCH) % 5000 === 0 ||
            i + INSERT_BATCH >= rows.length
          ) {
            process.stdout.write(
              `    ${year}: ${Math.min(i + INSERT_BATCH, rows.length)}/${rows.length} processed, ${yearAffected} affected\r`
            );
          }
        } catch (err: any) {
          totalErrors++;
          console.error(
            `\n    ERROR at batch ${i}-${i + INSERT_BATCH}: ${err.message}`
          );
          // Fallback: insert one by one
          for (const row of batch) {
            try {
              await upsertBatch([row]);
              yearAffected++;
            } catch (innerErr: any) {
              console.error(
                `      Skip ${row.case_number}: ${innerErr.message}`
              );
            }
          }
        }
      }

      totalAffected += yearAffected;
      console.log(
        `    ${year}: done — ${yearAffected} rows affected                    `
      );
    } catch (err: any) {
      console.error(`\n  ERROR fetching ${year}: ${err.message}`);
      totalErrors++;
    }
  }

  // 5. Clear safety dashboard cache
  if (totalAffected > 0) {
    console.log(`\n  Clearing safety dashboard cache...`);
    await sql`
      DELETE FROM public.dashboard_cache
      WHERE question IN ('safety', 'safety_detail')
    `;
    console.log(`    Cleared safety + safety_detail cache`);
  }

  // 6. Verify final state
  const [after] = await sql`
    SELECT
      MAX(occur_date) AS max_date,
      COUNT(*)::int AS total
    FROM safety.ppb_offenses
  `;

  console.log(`\n=======================================`);
  console.log(`Results:`);
  console.log(`  Before:    ${state.total} offenses (latest: ${state.max_date})`);
  console.log(`  After:     ${after.total} offenses (latest: ${after.max_date})`);
  console.log(`  Net new:   ${Number(after.total) - Number(state.total)}`);
  console.log(`  Fetched:   ${totalFetched} CSV rows`);
  console.log(`  Valid:     ${totalValid}`);
  console.log(`  Skipped:   ${totalSkipped}`);
  console.log(`  DB affected: ${totalAffected}`);
  console.log(`  Errors:    ${totalErrors}`);

  // 7. Print year-by-year summary
  console.log(`\n  Crime counts by year:`);
  const yearCounts = await sql`
    SELECT
      EXTRACT(YEAR FROM occur_date)::int AS year,
      COUNT(*)::int AS cnt
    FROM safety.ppb_offenses
    WHERE occur_date >= '2015-01-01'
    GROUP BY 1
    ORDER BY 1
  `;
  for (const row of yearCounts) {
    console.log(`    ${row.year}: ${Number(row.cnt).toLocaleString()}`);
  }

  await sql.end();
  console.log(`\nDone.`);
}

main().catch(async (err) => {
  console.error("\nFATAL:", err.message);
  console.error(err.stack);
  await sql.end();
  process.exit(1);
});
