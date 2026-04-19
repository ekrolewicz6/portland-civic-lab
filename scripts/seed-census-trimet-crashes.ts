/**
 * seed-census-trimet-crashes.ts
 *
 * Unified seed script for three major datasets:
 *   1. Census ACS 5-Year Demographics (2015-2023) — population, income, poverty, race, housing
 *   2. TriMet Monthly Ridership (2002-2026) — NTD Socrata API, ~1,172 rows by mode
 *   3. ODOT Crash Data for Multnomah County (2017-2022) — ArcGIS, ~59K records
 *
 * Usage:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/seed-census-trimet-crashes.ts
 *   npx tsx scripts/seed-census-trimet-crashes.ts --census-only
 *   npx tsx scripts/seed-census-trimet-crashes.ts --trimet-only
 *   npx tsx scripts/seed-census-trimet-crashes.ts --crashes-only
 */

import postgres from "postgres";

// ── Config ──────────────────────────────────────────────────────────────

const DB_URL = process.env.DATABASE_URL!;
if (!DB_URL) {
  console.error("Missing DATABASE_URL in environment");
  process.exit(1);
}

const CENSUS_API_KEY = process.env.CENSUS_API_KEY || "";

const BATCH_SIZE = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const ARCGIS_PAGE_SIZE = 2000;
const ARCGIS_MAX_PAGES = 30;

// ── DB connection (pooler-safe) ─────────────────────────────────────────

function makeSQL() {
  const isPooled = DB_URL.includes("pooler.supabase.com");
  if (isPooled) {
    const parsed = new URL(DB_URL);
    return postgres({
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
      database: parsed.pathname.slice(1) || "postgres",
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      ssl: "prefer",
      prepare: false,
      max: 1,
      onnotice: () => {},
    });
  }
  return postgres(DB_URL, { max: 1, prepare: false, onnotice: () => {} });
}

// ── Shared helpers ──────────────────────────────────────────────────────

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      // Rate-limited or server error — retry
      if (res.status === 429 || res.status >= 500) {
        const wait = RETRY_DELAY_MS * attempt;
        console.log(`  HTTP ${res.status}, retrying in ${wait}ms (attempt ${attempt}/${retries})`);
        await sleep(wait);
        continue;
      }
      // Client error — don't retry
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    } catch (err: any) {
      if (attempt === retries) throw err;
      const wait = RETRY_DELAY_MS * attempt;
      console.log(`  Fetch error: ${err.message}, retrying in ${wait}ms (attempt ${attempt}/${retries})`);
      await sleep(wait);
    }
  }
  throw new Error("Unreachable");
}

async function fetchJSON(url: string): Promise<any> {
  const res = await fetchWithRetry(url);
  return res.json();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ── 1. Census ACS 5-Year Demographics ──────────────────────────────────

interface CensusMetric {
  year: number;
  metric: string;
  value: number | null;
}

const CENSUS_VARIABLES = [
  "B01003_001E", // Total Population
  "B19013_001E", // Median Household Income
  "B17001_001E", // Poverty Universe (total)
  "B17001_002E", // Below Poverty Level
  "B02001_002E", // White alone
  "B02001_003E", // Black alone
  "B02001_005E", // Asian alone
  "B03002_012E", // Hispanic/Latino
  "B01002_001E", // Median Age
  "B25003_002E", // Owner-occupied housing units
  "B25003_003E", // Renter-occupied housing units
];

const METRIC_NAMES: Record<string, string> = {
  B01003_001E: "total_population",
  B19013_001E: "median_household_income",
  B17001_001E: "poverty_universe",
  B17001_002E: "below_poverty",
  B02001_002E: "white_alone",
  B02001_003E: "black_alone",
  B02001_005E: "asian_alone",
  B03002_012E: "hispanic_latino",
  B01002_001E: "median_age",
  B25003_002E: "owner_occupied",
  B25003_003E: "renter_occupied",
};

async function seedCensus(sql: postgres.Sql): Promise<number> {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  1. Census ACS 5-Year Demographics       ║");
  console.log("╚══════════════════════════════════════════╝\n");

  if (!CENSUS_API_KEY) {
    console.log("  WARNING: No CENSUS_API_KEY found. Census API may rate-limit without a key.");
  }

  // Create table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS public.census_demographics (
      id SERIAL PRIMARY KEY,
      year INT NOT NULL,
      metric TEXT NOT NULL,
      value NUMERIC,
      UNIQUE(year, metric)
    )
  `);

  const allMetrics: CensusMetric[] = [];
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const varsStr = CENSUS_VARIABLES.join(",");

  for (const year of years) {
    const keyParam = CENSUS_API_KEY ? `&key=${CENSUS_API_KEY}` : "";
    const url = `https://api.census.gov/data/${year}/acs/acs5?get=${varsStr}&for=place:59000&in=state:41${keyParam}`;

    try {
      console.log(`  Fetching ACS ${year}...`);
      const data = await fetchJSON(url);

      if (!Array.isArray(data) || data.length < 2) {
        console.log(`    No data for ${year}`);
        continue;
      }

      const headers: string[] = data[0];
      const row = data[1]; // Portland is the only result

      for (const varCode of CENSUS_VARIABLES) {
        const idx = headers.indexOf(varCode);
        if (idx < 0) continue;

        const rawVal = row[idx];
        const numVal = rawVal !== null && rawVal !== "" ? parseFloat(rawVal) : null;
        const metricName = METRIC_NAMES[varCode] || varCode;

        // Census uses negative numbers for missing/suppressed data
        if (numVal !== null && numVal >= 0) {
          allMetrics.push({ year, metric: metricName, value: numVal });
        } else {
          allMetrics.push({ year, metric: metricName, value: null });
        }
      }

      // Log a few highlights
      const popIdx = headers.indexOf("B01003_001E");
      const incIdx = headers.indexOf("B19013_001E");
      const pop = popIdx >= 0 ? parseInt(row[popIdx]) : 0;
      const inc = incIdx >= 0 ? parseInt(row[incIdx]) : 0;
      console.log(`    ${year}: pop=${pop.toLocaleString()}, median_income=$${inc.toLocaleString()}`);

      // Small pause between years to be polite
      await sleep(200);
    } catch (err: any) {
      console.log(`    ERROR fetching ${year}: ${err.message}`);
    }
  }

  if (allMetrics.length === 0) {
    console.log("  No census data fetched. Skipping insert.");
    return 0;
  }

  // Batch insert using unnest
  console.log(`\n  Inserting ${allMetrics.length} census metrics...`);
  let inserted = 0;

  for (const batch of chunks(allMetrics, BATCH_SIZE)) {
    const years = batch.map((m) => m.year);
    const metrics = batch.map((m) => m.metric);
    const values = batch.map((m) => m.value);

    await sql.unsafe(
      `INSERT INTO public.census_demographics (year, metric, value)
       SELECT * FROM unnest($1::int[], $2::text[], $3::numeric[])
       ON CONFLICT (year, metric) DO UPDATE SET value = EXCLUDED.value`,
      [years, metrics, values]
    );
    inserted += batch.length;
  }

  console.log(`  Inserted/updated ${inserted} census rows`);
  return inserted;
}

// ── 2. TriMet Monthly Ridership ────────────────────────────────────────

interface RidershipRow {
  month: string; // YYYY-MM-DD
  mode: string;
  boardings: number;
  vehicle_revenue_miles: number | null;
  vehicle_revenue_hours: number | null;
}

// Mode code mapping for the NTD data
const MODE_MAP: Record<string, string> = {
  MB: "Bus",
  LR: "Light Rail",
  DR: "Demand Response",
  CB: "Commuter Bus",
  CR: "Commuter Rail",
  VP: "Vanpool",
  TB: "Trolleybus",
  SR: "Streetcar",
  RB: "Bus Rapid Transit",
};

async function seedTrimet(sql: postgres.Sql): Promise<number> {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  2. TriMet Monthly Ridership (NTD)       ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Create table
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS transportation`);
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS transportation.ridership_monthly (
      id SERIAL PRIMARY KEY,
      month DATE NOT NULL,
      mode TEXT NOT NULL,
      boardings INT NOT NULL,
      vehicle_revenue_miles INT,
      vehicle_revenue_hours INT,
      source TEXT DEFAULT 'NTD',
      UNIQUE(month, mode)
    )
  `);

  // Fetch from Socrata (NTD data on data.transportation.gov)
  // The API returns fields: date (ISO datetime), mode (code), upt (string), vrm, vrh
  const url = `https://datahub.transportation.gov/resource/8bui-9xvu.json?$where=agency%20like%20%27%25Tri-County%25%27%20AND%20tos=%27DO%27&$limit=5000`;

  console.log("  Fetching NTD ridership data...");
  let rawData: any[];
  try {
    rawData = await fetchJSON(url);
  } catch (err: any) {
    console.log(`  ERROR fetching TriMet data: ${err.message}`);
    return 0;
  }

  if (!Array.isArray(rawData) || rawData.length === 0) {
    console.log("  No ridership data returned from NTD API.");
    return 0;
  }

  console.log(`  Received ${rawData.length} raw rows from NTD`);

  // Parse rows
  // Actual Socrata fields: date ("2002-01-01T00:00:00.000"), mode ("LR"), upt ("2137000"), vrm, vrh
  const rows: RidershipRow[] = [];
  let skipped = 0;

  for (const r of rawData) {
    const dateStr = r.date || "";
    const modeCode = r.mode || "";
    const upt = parseInt(r.upt || "0");

    if (!dateStr || !modeCode || isNaN(upt) || upt <= 0) {
      skipped++;
      continue;
    }

    // Parse the ISO date string to get YYYY-MM-01
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      skipped++;
      continue;
    }
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    const modeName = MODE_MAP[modeCode] || modeCode;
    const vrm = r.vrm ? parseInt(r.vrm) : null;
    const vrh = r.vrh ? parseInt(r.vrh) : null;

    rows.push({
      month: monthStr,
      mode: modeName,
      boardings: upt,
      vehicle_revenue_miles: isNaN(vrm as number) ? null : vrm,
      vehicle_revenue_hours: isNaN(vrh as number) ? null : vrh,
    });
  }

  console.log(`  Parsed ${rows.length} valid rows (skipped ${skipped})`);

  if (rows.length === 0) {
    console.log("  No valid rows to insert.");
    return 0;
  }

  // Deduplicate by (month, mode) — keep the last occurrence (most recent data wins)
  const deduped = new Map<string, RidershipRow>();
  for (const r of rows) {
    const key = `${r.month}|${r.mode}`;
    deduped.set(key, r);
  }
  const uniqueRows = Array.from(deduped.values());
  if (uniqueRows.length < rows.length) {
    console.log(`  Deduplicated: ${rows.length} -> ${uniqueRows.length} unique (month, mode) pairs`);
  }
  // Replace rows with deduped
  rows.length = 0;
  rows.push(...uniqueRows);

  // Log date range
  const months = rows.map((r) => r.month).sort();
  console.log(`  Date range: ${months[0]} to ${months[months.length - 1]}`);

  // Batch insert
  console.log(`  Inserting ${rows.length} ridership rows...`);
  let inserted = 0;

  for (const batch of chunks(rows, BATCH_SIZE)) {
    const bMonths = batch.map((r) => r.month);
    const bModes = batch.map((r) => r.mode);
    const bBoardings = batch.map((r) => r.boardings);
    const bVRM = batch.map((r) => r.vehicle_revenue_miles);
    const bVRH = batch.map((r) => r.vehicle_revenue_hours);

    await sql.unsafe(
      `INSERT INTO transportation.ridership_monthly (month, mode, boardings, vehicle_revenue_miles, vehicle_revenue_hours, source)
       SELECT m::date, md, b, vrm, vrh, 'NTD'
       FROM unnest($1::text[], $2::text[], $3::int[], $4::int[], $5::int[])
         AS t(m, md, b, vrm, vrh)
       ON CONFLICT (month, mode) DO UPDATE SET
         boardings = EXCLUDED.boardings,
         vehicle_revenue_miles = EXCLUDED.vehicle_revenue_miles,
         vehicle_revenue_hours = EXCLUDED.vehicle_revenue_hours`,
      [bMonths, bModes, bBoardings, bVRM, bVRH]
    );
    inserted += batch.length;
  }

  console.log(`  Inserted/updated ${inserted} ridership rows`);
  return inserted;
}

// ── 3. ODOT Crash Data (ArcGIS) ────────────────────────────────────────

interface CrashRow {
  crash_id: number;
  crash_date: string | null;
  crash_year: number | null;
  crash_month: number | null;
  county: string;
  street: string | null;
  severity: string | null;
  total_fatalities: number;
  total_injuries: number;
  total_pedestrians: number;
  total_cyclists: number;
  crash_type: string | null;
  crash_cause: string | null;
  alcohol_involved: boolean;
  speed_involved: boolean;
  speed_limit: number | null;
  lat: number | null;
  lon: number | null;
}

// No code mapping needed — ODOT uses CRASH_SVRTY_LONG_DESC (text) directly
// and CRASH_CAUSE_1_LONG_DESC (text), POST_SPEED_LMT_VAL (text)

async function seedCrashes(sql: postgres.Sql): Promise<number> {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  3. ODOT Crash Data (Multnomah County)   ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Create table and indexes
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS transportation`);
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS transportation.crash_records (
      id SERIAL PRIMARY KEY,
      crash_id BIGINT UNIQUE,
      crash_date DATE,
      crash_year INT,
      crash_month INT,
      county TEXT,
      street TEXT,
      severity TEXT,
      total_fatalities INT DEFAULT 0,
      total_injuries INT DEFAULT 0,
      total_pedestrians INT DEFAULT 0,
      total_cyclists INT DEFAULT 0,
      crash_type TEXT,
      crash_cause TEXT,
      alcohol_involved BOOLEAN DEFAULT false,
      speed_involved BOOLEAN DEFAULT false,
      speed_limit INT,
      lat NUMERIC(10,7),
      lon NUMERIC(10,7),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_crash_date ON transportation.crash_records(crash_date)`);
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_crash_severity ON transportation.crash_records(severity)`);

  const baseUrl =
    "https://services.arcgis.com/gfpXnknjcY6QHKhU/arcgis/rest/services/Crash_ODOT/FeatureServer/0/query";

  // Fields to request (verified against FeatureServer metadata)
  const outFields = [
    "CRASH_ID", "CRASH_DT", "CRASH_YR_NO", "CRASH_MO_NO",
    "CNTY_NM", "ST_FULL_NM", "CRASH_SVRTY_LONG_DESC",
    "TOT_FATAL_CNT", "TOT_INJ_LVL_A_CNT", "TOT_INJ_LVL_B_CNT", "TOT_INJ_LVL_C_CNT",
    "TOT_PED_CNT", "TOT_PEDCYCL_CNT",
    "CRASH_TYP_LONG_DESC", "CRASH_CAUSE_1_LONG_DESC",
    "ALCHL_INVLV_FLG", "CRASH_SPEED_INVLV_FLG", "POST_SPEED_LMT_VAL",
    "LAT_DD", "LONGTD_DD",
  ].join(",");

  const allRows: CrashRow[] = [];
  let page = 0;

  console.log("  Paginating ArcGIS (2000 records/page)...");

  while (page < ARCGIS_MAX_PAGES) {
    const offset = page * ARCGIS_PAGE_SIZE;
    const params = new URLSearchParams({
      where: "CNTY_NM='Multnomah'",
      outFields,
      returnGeometry: "false",
      f: "json",
      resultRecordCount: String(ARCGIS_PAGE_SIZE),
      resultOffset: String(offset),
    });

    const url = `${baseUrl}?${params}`;

    try {
      const data = await fetchJSON(url);

      if (!data.features || !Array.isArray(data.features)) {
        console.log(`    Page ${page}: No features array in response`);
        break;
      }

      const features = data.features;
      console.log(`    Page ${page}: ${features.length} records (offset ${offset})`);

      if (features.length === 0) break;

      for (const f of features) {
        const a = f.attributes;
        if (!a || !a.CRASH_ID) continue;

        // Parse epoch date (ArcGIS returns ms since epoch)
        let crashDate: string | null = null;
        if (a.CRASH_DT && typeof a.CRASH_DT === "number" && a.CRASH_DT > 0) {
          const d = new Date(a.CRASH_DT);
          // Reject garbage dates (before 2000 or after 2030)
          if (d.getFullYear() >= 2000 && d.getFullYear() <= 2030) {
            crashDate = d.toISOString().slice(0, 10);
          }
        }

        // CRASH_SVRTY_LONG_DESC is a text field (e.g. "Fatal Crash", "Injury Crash", "PDO Crash")
        const severity = a.CRASH_SVRTY_LONG_DESC || null;

        // Total injuries = sum of injury levels A + B + C
        const totalInjuries = (a.TOT_INJ_LVL_A_CNT ?? 0) +
          (a.TOT_INJ_LVL_B_CNT ?? 0) + (a.TOT_INJ_LVL_C_CNT ?? 0);

        // CRASH_YR_NO and CRASH_MO_NO are strings in this layer
        const crashYear = a.CRASH_YR_NO ? parseInt(a.CRASH_YR_NO) : null;
        const crashMonth = a.CRASH_MO_NO ? parseInt(a.CRASH_MO_NO) : null;

        // POST_SPEED_LMT_VAL is a string
        const speedLimit = a.POST_SPEED_LMT_VAL ? parseInt(a.POST_SPEED_LMT_VAL) : null;

        allRows.push({
          crash_id: a.CRASH_ID,
          crash_date: crashDate,
          crash_year: isNaN(crashYear as number) ? null : crashYear,
          crash_month: isNaN(crashMonth as number) ? null : crashMonth,
          county: a.CNTY_NM || "Multnomah",
          street: a.ST_FULL_NM || null,
          severity,
          total_fatalities: a.TOT_FATAL_CNT ?? 0,
          total_injuries: totalInjuries,
          total_pedestrians: a.TOT_PED_CNT ?? 0,
          total_cyclists: a.TOT_PEDCYCL_CNT ?? 0,
          crash_type: a.CRASH_TYP_LONG_DESC || null,
          crash_cause: a.CRASH_CAUSE_1_LONG_DESC || null,
          alcohol_involved: a.ALCHL_INVLV_FLG === 1,
          speed_involved: a.CRASH_SPEED_INVLV_FLG === 1,
          speed_limit: isNaN(speedLimit as number) ? null : speedLimit,
          lat: a.LAT_DD ?? null,
          lon: a.LONGTD_DD ?? null,
        });
      }

      // If we got fewer than page size, we're done
      if (features.length < ARCGIS_PAGE_SIZE && !data.exceededTransferLimit) {
        break;
      }

      page++;
      // Brief pause between pages
      await sleep(300);
    } catch (err: any) {
      console.log(`    Page ${page} ERROR: ${err.message}`);
      // Try to continue with next page
      page++;
      await sleep(1000);
    }
  }

  console.log(`\n  Total crash records fetched: ${allRows.length}`);

  if (allRows.length === 0) {
    console.log("  No crash data fetched. Skipping insert.");
    return 0;
  }

  // Log year distribution
  const byYear: Record<number, number> = {};
  for (const r of allRows) {
    if (r.crash_year) {
      byYear[r.crash_year] = (byYear[r.crash_year] || 0) + 1;
    }
  }
  console.log("  Records by year:");
  for (const [yr, cnt] of Object.entries(byYear).sort()) {
    console.log(`    ${yr}: ${cnt.toLocaleString()}`);
  }

  // Batch insert using unnest
  console.log(`\n  Inserting ${allRows.length} crash records (${BATCH_SIZE}/batch)...`);
  let inserted = 0;

  for (const batch of chunks(allRows, BATCH_SIZE)) {
    const crashIds = batch.map((r) => r.crash_id);
    const crashDates = batch.map((r) => r.crash_date);
    const crashYears = batch.map((r) => r.crash_year);
    const crashMonths = batch.map((r) => r.crash_month);
    const counties = batch.map((r) => r.county);
    const streets = batch.map((r) => r.street);
    const severities = batch.map((r) => r.severity);
    const fatalities = batch.map((r) => r.total_fatalities);
    const injuries = batch.map((r) => r.total_injuries);
    const peds = batch.map((r) => r.total_pedestrians);
    const cyclists = batch.map((r) => r.total_cyclists);
    const types = batch.map((r) => r.crash_type);
    const causes = batch.map((r) => r.crash_cause);
    // Cast booleans to integers for unnest (postgres driver struggles with bool[])
    const alcohol = batch.map((r) => r.alcohol_involved ? 1 : 0);
    const speed = batch.map((r) => r.speed_involved ? 1 : 0);
    const speedLimits = batch.map((r) => r.speed_limit);
    const lats = batch.map((r) => r.lat);
    const lons = batch.map((r) => r.lon);

    try {
      await sql.unsafe(
        `INSERT INTO transportation.crash_records
           (crash_id, crash_date, crash_year, crash_month, county, street,
            severity, total_fatalities, total_injuries, total_pedestrians,
            total_cyclists, crash_type, crash_cause, alcohol_involved,
            speed_involved, speed_limit, lat, lon)
         SELECT
           cid, cd::date, cy, cm, co, st,
           sv, tf, ti, tp,
           tc, ct, cc, ai::int::boolean,
           si::int::boolean, sl, la, lo
         FROM unnest(
           $1::bigint[], $2::text[], $3::int[], $4::int[], $5::text[], $6::text[],
           $7::text[], $8::int[], $9::int[], $10::int[],
           $11::int[], $12::text[], $13::text[], $14::int[],
           $15::int[], $16::int[], $17::numeric[], $18::numeric[]
         ) AS t(cid, cd, cy, cm, co, st, sv, tf, ti, tp, tc, ct, cc, ai, si, sl, la, lo)
         ON CONFLICT (crash_id) DO UPDATE SET
           crash_date = EXCLUDED.crash_date,
           severity = EXCLUDED.severity,
           total_fatalities = EXCLUDED.total_fatalities,
           total_injuries = EXCLUDED.total_injuries,
           total_pedestrians = EXCLUDED.total_pedestrians,
           total_cyclists = EXCLUDED.total_cyclists`,
        [
          crashIds, crashDates, crashYears, crashMonths, counties, streets,
          severities, fatalities, injuries, peds,
          cyclists, types, causes, alcohol,
          speed, speedLimits, lats, lons,
        ]
      );
      inserted += batch.length;
    } catch (err: any) {
      console.log(`    Batch insert error: ${err.message}`);
      // Fall back to individual inserts for this batch
      for (const r of batch) {
        try {
          await sql.unsafe(
            `INSERT INTO transportation.crash_records
               (crash_id, crash_date, crash_year, crash_month, county, street,
                severity, total_fatalities, total_injuries, total_pedestrians,
                total_cyclists, crash_type, crash_cause, alcohol_involved,
                speed_involved, speed_limit, lat, lon)
             VALUES ($1, $2::date, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
             ON CONFLICT (crash_id) DO UPDATE SET
               crash_date = EXCLUDED.crash_date,
               severity = EXCLUDED.severity,
               total_fatalities = EXCLUDED.total_fatalities,
               total_injuries = EXCLUDED.total_injuries`,
            [
              r.crash_id, r.crash_date, r.crash_year, r.crash_month, r.county, r.street,
              r.severity, r.total_fatalities, r.total_injuries, r.total_pedestrians,
              r.total_cyclists, r.crash_type, r.crash_cause, r.alcohol_involved,
              r.speed_involved, r.speed_limit, r.lat, r.lon,
            ]
          );
          inserted++;
        } catch (innerErr: any) {
          // Skip individual row errors silently
        }
      }
    }

    // Progress indicator every 5 batches
    if (inserted % (BATCH_SIZE * 5) === 0 && inserted > 0) {
      console.log(`    ...${inserted.toLocaleString()} rows inserted`);
    }
  }

  console.log(`  Inserted/updated ${inserted.toLocaleString()} crash records`);
  return inserted;
}

// ── Summary & Verification ──────────────────────────────────────────────

async function printSummary(sql: postgres.Sql, ran: { census: boolean; trimet: boolean; crashes: boolean }) {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  SUMMARY                                 ║");
  console.log("╚══════════════════════════════════════════╝\n");

  if (ran.census) {
    try {
      const census = await sql`SELECT count(*)::int as cnt FROM public.census_demographics`;
      const yearRange = await sql`
        SELECT min(year) as min_yr, max(year) as max_yr,
               count(DISTINCT year)::int as years,
               count(DISTINCT metric)::int as metrics
        FROM public.census_demographics
      `;
      console.log(`  census_demographics: ${census[0].cnt} rows`);
      console.log(`    Years: ${yearRange[0].min_yr}-${yearRange[0].max_yr} (${yearRange[0].years} years, ${yearRange[0].metrics} metrics)`);
    } catch (err: any) {
      console.log(`  census_demographics: error reading — ${err.message}`);
    }
  }

  if (ran.trimet) {
    try {
      const trimet = await sql`SELECT count(*)::int as cnt FROM transportation.ridership_monthly`;
      const trimetRange = await sql`
        SELECT min(month) as min_mo, max(month) as max_mo,
               count(DISTINCT mode)::int as modes
        FROM transportation.ridership_monthly
      `;
      console.log(`  ridership_monthly: ${trimet[0].cnt} rows`);
      console.log(`    Range: ${trimetRange[0].min_mo} to ${trimetRange[0].max_mo} (${trimetRange[0].modes} modes)`);
    } catch (err: any) {
      console.log(`  ridership_monthly: error reading — ${err.message}`);
    }
  }

  if (ran.crashes) {
    try {
      const crashes = await sql`SELECT count(*)::int as cnt FROM transportation.crash_records`;
      const crashYears = await sql`
        SELECT crash_year, count(*)::int as cnt, sum(total_fatalities)::int as fatalities
        FROM transportation.crash_records
        WHERE crash_year IS NOT NULL
        GROUP BY crash_year
        ORDER BY crash_year
      `;
      console.log(`  crash_records: ${crashes[0].cnt.toLocaleString()} rows`);
      for (const r of crashYears) {
        console.log(`    ${r.crash_year}: ${r.cnt.toLocaleString()} crashes, ${r.fatalities} fatalities`);
      }
    } catch (err: any) {
      console.log(`  crash_records: error reading — ${err.message}`);
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const censusOnly = args.includes("--census-only");
  const trimetOnly = args.includes("--trimet-only");
  const crashesOnly = args.includes("--crashes-only");
  const runAll = !censusOnly && !trimetOnly && !crashesOnly;

  console.log("Portland Dashboard — Census + TriMet + ODOT Crash Seed");
  console.log("=======================================================");
  console.log(`  Mode: ${runAll ? "ALL" : args.join(", ")}`);
  console.log(`  Time: ${new Date().toISOString()}`);

  const sql = makeSQL();

  const ran = { census: false, trimet: false, crashes: false };
  const counts = { census: 0, trimet: 0, crashes: 0 };

  try {
    if (runAll || censusOnly) {
      counts.census = await seedCensus(sql);
      ran.census = true;
    }

    if (runAll || trimetOnly) {
      counts.trimet = await seedTrimet(sql);
      ran.trimet = true;
    }

    if (runAll || crashesOnly) {
      counts.crashes = await seedCrashes(sql);
      ran.crashes = true;
    }

    await printSummary(sql, ran);

    console.log("\n=======================================================");
    console.log("Seed complete!");
    console.log(`  Census:  ${counts.census} rows`);
    console.log(`  TriMet:  ${counts.trimet} rows`);
    console.log(`  Crashes: ${counts.crashes.toLocaleString()} rows`);
    console.log(`  Total:   ${(counts.census + counts.trimet + counts.crashes).toLocaleString()} rows`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
