#!/usr/bin/env npx tsx
/**
 * verify-api-queries.ts
 *
 * Pre-push verification: runs every dashboard API query against the
 * real database to ensure nothing returns dataStatus: "error".
 *
 * Exit 0 = all queries pass, safe to push
 * Exit 1 = at least one query failed, do NOT push
 *
 * Usage: set -a && source .env.local && set +a && npx tsx scripts/verify-api-queries.ts
 */

import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("ERROR: DATABASE_URL not set. Run: set -a && source .env.local && set +a");
  process.exit(1);
}

const sql = postgres(DB_URL, { prepare: false, max: 1, onnotice: () => {} });

interface TestResult {
  route: string;
  passed: boolean;
  error?: string;
  rows?: number;
}

const results: TestResult[] = [];

async function test(route: string, query: string, minRows = 0) {
  try {
    const r = await sql.unsafe(query);
    const rowCount = Array.isArray(r) ? r.length : 0;
    if (minRows > 0 && rowCount < minRows) {
      results.push({ route, passed: false, error: `Expected >= ${minRows} rows, got ${rowCount}`, rows: rowCount });
    } else {
      results.push({ route, passed: true, rows: rowCount });
    }
  } catch (err: any) {
    results.push({ route, passed: false, error: err.message });
  }
}

async function testJsonBuild(route: string, query: string) {
  try {
    const r = await sql.unsafe(query);
    const payload = r[0]?.payload;
    if (!payload || typeof payload !== "object") {
      results.push({ route, passed: false, error: "json_build_object returned null/non-object" });
    } else {
      results.push({ route, passed: true });
    }
  } catch (err: any) {
    results.push({ route, passed: false, error: err.message });
  }
}

async function main() {
  console.log("Verifying API queries against database...\n");

  // ── Education ─────────────────────────────────────────────────────
  await testJsonBuild("education/route", `
    SELECT json_build_object(
      'enrollment_latest', (
        SELECT COALESCE(json_agg(t), '[]'::json) FROM (
          SELECT school_year, SUM(enrollment)::int AS enrollment
          FROM education.enrollment
          WHERE grade_level = 'Total' AND demographic_group IS NULL
            AND district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
          GROUP BY school_year ORDER BY school_year DESC LIMIT 2
        ) t
      ),
      'avg_grad_rate', (
        SELECT row_to_json(t) FROM (
          SELECT school_year, ROUND(AVG(rate_4yr)::numeric, 1) AS avg_rate
          FROM education.graduation_rates
          WHERE district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
            AND rate_4yr IS NOT NULL
          GROUP BY school_year ORDER BY school_year DESC LIMIT 1
        ) t
      )
    ) AS payload
  `);

  await testJsonBuild("education/detail", `
    SELECT json_build_object(
      'enrollment_by_district', (
        SELECT COALESCE(json_agg(t), '[]'::json) FROM (
          SELECT district_name, school_year, enrollment
          FROM education.enrollment
          WHERE grade_level = 'Total' AND demographic_group IS NULL
            AND district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
        ) t
      ),
      'graduation_rates', (
        SELECT COALESCE(json_agg(t), '[]'::json) FROM (
          SELECT district_name, school_year, rate_4yr, rate_5yr
          FROM education.graduation_rates
          WHERE district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
        ) t
      ),
      'test_scores', (
        SELECT COALESCE(json_agg(t), '[]'::json) FROM (
          SELECT district_name, school_year, subject, grade_level, proficiency_pct
          FROM education.test_scores LIMIT 5
        ) t
      ),
      'enrollment_by_grade', (
        SELECT COALESCE(json_agg(t), '[]'::json) FROM (
          SELECT district_name, grade_level, enrollment
          FROM education.enrollment
          WHERE grade_level != 'Total' AND demographic_group IS NULL
            AND district_name = 'Portland SD 1J'
            AND school_year = (SELECT MAX(school_year) FROM education.enrollment)
          LIMIT 5
        ) t
      )
    ) AS payload
  `);

  // ── Safety ────────────────────────────────────────────────────────
  await test("safety/route", `
    SELECT count(*)::int AS total FROM safety.ppb_offenses WHERE occur_date <= CURRENT_DATE
  `, 1);

  await test("safety/detail (downtown scorecard)", `
    SELECT
      COUNT(*) FILTER (WHERE offense_category = 'Burglary')::int AS burglary,
      COUNT(*) FILTER (WHERE offense_type = 'Shoplifting')::int AS shoplifting
    FROM safety.ppb_offenses
    WHERE neighborhood IN ('Downtown', 'Old Town/Chinatown', 'Pearl')
      AND occur_date >= '2025-01-01'
  `, 1);

  // ── Housing ───────────────────────────────────────────────────────
  await test("housing/route", `
    SELECT count(*) AS total FROM housing.permits
    WHERE LOWER(status) IN ('finaled', 'final', 'final - uf', 'issued', 'issued - uf')
  `, 1);

  // ── Economy ───────────────────────────────────────────────────────
  await test("economy/route (msa)", `
    SELECT count(*)::int AS cnt FROM economy.msa_employment_wages
  `, 1);

  await test("economy/route (formation)", `
    SELECT count(*)::int AS cnt FROM economy.business_formation
  `, 1);

  // ── Quality ───────────────────────────────────────────────────────
  await testJsonBuild("quality/route", `
    SELECT json_build_object(
      'parks', (SELECT count(*)::int FROM quality.parks),
      'avg_pci', (SELECT ROUND(AVG(pci)) FROM quality.pavement_condition),
      'library', (SELECT count(*)::int FROM quality.library_stats)
    ) AS payload
  `);

  // ── Transportation ────────────────────────────────────────────────
  await test("transportation/route (ridership)", `
    SELECT count(*)::int AS cnt FROM transportation.ridership
  `, 1);

  await test("transportation/route (crashes)", `
    SELECT count(*)::int AS cnt FROM transportation.crashes
  `, 1);

  await test("transportation/route (commute)", `
    SELECT count(*)::int AS cnt FROM transportation.commute_mode
  `, 1);

  // ── Homelessness ──────────────────────────────────────────────────
  await test("homelessness/route (pit)", `
    SELECT count(*)::int AS cnt FROM homelessness.pit_counts
  `, 1);

  await test("homelessness/route (irp)", `
    SELECT count(*)::int AS cnt FROM homelessness.irp_campsite_reports
  `, 1);

  // ── Accountability ────────────────────────────────────────────────
  await test("accountability/route (promises)", `
    SELECT count(*)::int AS cnt FROM accountability.promises
  `, 1);

  await test("accountability/route (officials)", `
    SELECT count(*)::int AS cnt FROM accountability.elected_officials
  `, 1);

  // ── Print results ─────────────────────────────────────────────────
  console.log("Results:\n");
  let failures = 0;
  for (const r of results) {
    const icon = r.passed ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    const detail = r.passed
      ? (r.rows !== undefined ? `${r.rows} rows` : "OK")
      : r.error;
    console.log(`  ${icon} ${r.route.padEnd(40)} ${detail}`);
    if (!r.passed) failures++;
  }

  console.log(`\n${results.length} checks, ${failures} failures`);

  await sql.end();

  if (failures > 0) {
    console.error("\n\x1b[31mFAILED: Fix the above errors before pushing.\x1b[0m");
    process.exit(1);
  } else {
    console.log("\n\x1b[32mAll API queries verified. Safe to push.\x1b[0m");
  }
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
