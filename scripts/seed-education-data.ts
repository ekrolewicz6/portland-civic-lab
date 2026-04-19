/**
 * seed-education-data.ts
 *
 * Comprehensive education data seed script for 6 Portland-area school districts.
 * Downloads and parses ODE assessment XLSX files, then seeds:
 *   1. Test scores (ELA + Math proficiency) from ODE OSAS district-level reports
 *   2. Verifies/reports on existing enrollment and graduation rate data
 *
 * Data sources:
 *   - ODE Assessment Group Reports (XLSX):
 *     https://www.oregon.gov/ode/educator-resources/assessment/Pages/Assessment-Group-Reports.aspx
 *   - Enrollment: already seeded by parse-education.ts from ODE Fall Membership XLSX
 *   - Graduation: already seeded by parse-education.ts / fetch-education-extended.ts from ODE Cohort files
 *
 * Districts (ODE IDs):
 *   Portland SD 1J (2180), Parkrose SD 3 (2181), Reynolds SD 7 (2182),
 *   Centennial SD 28J (2185), David Douglas SD 40 (2187), Riverdale SD 51J (2188)
 *
 * Usage: npx tsx scripts/seed-education-data.ts
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

const DATA_DIR = path.resolve(
  new URL(".", import.meta.url).pathname,
  "..",
  "data"
);

// ── Target Districts ──────────────────────────────────────────────────

const TARGET_DISTRICTS = [
  { name: "Portland SD 1J", odeId: "2180" },
  { name: "Parkrose SD 3", odeId: "2181" },
  { name: "Reynolds SD 7", odeId: "2182" },
  { name: "Centennial SD 28J", odeId: "2185" },
  { name: "David Douglas SD 40", odeId: "2187" },
  { name: "Riverdale SD 51J", odeId: "2188" },
];

const TARGET_NAMES = new Set(TARGET_DISTRICTS.map((d) => d.name));

// ── Assessment File Configuration ─────────────────────────────────────

interface AssessmentFile {
  subject: "ELA" | "Math";
  schoolYear: string;
  localFile: string;
  downloadUrl: string;
}

const ASSESSMENT_FILES: AssessmentFile[] = [
  // ELA
  {
    subject: "ELA",
    schoolYear: "2024-25",
    localFile: "ode_assessment_ela_2425.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2425/pagr_Districts_ELA_2425.xlsx",
  },
  {
    subject: "ELA",
    schoolYear: "2023-24",
    localFile: "ode_assessment_ela_2324.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2324/pagr_Districts_ELA_2324.xlsx",
  },
  {
    subject: "ELA",
    schoolYear: "2022-23",
    localFile: "ode_assessment_ela_2223.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2223/pagr_Districts_ELA_2223.xlsx",
  },
  {
    subject: "ELA",
    schoolYear: "2021-22",
    localFile: "ode_assessment_ela_2122.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2122/pagr_Districts_ELA_2122.xlsx",
  },
  {
    subject: "ELA",
    schoolYear: "2018-19",
    localFile: "ode_assessment_ela_1819.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2122/TestResults2019/pagr_Districts_ELA_1819.xlsx",
  },
  // Math
  {
    subject: "Math",
    schoolYear: "2024-25",
    localFile: "ode_assessment_math_2425.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2425/pagr_Districts_MATH_2425.xlsx",
  },
  {
    subject: "Math",
    schoolYear: "2023-24",
    localFile: "ode_assessment_math_2324.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2324/pagr_Districts_MATH_2324.xlsx",
  },
  {
    subject: "Math",
    schoolYear: "2022-23",
    localFile: "ode_assessment_math_2223.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2223/pagr_Districts_MATH_2223.xlsx",
  },
  {
    subject: "Math",
    schoolYear: "2021-22",
    localFile: "ode_assessment_math_2122.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2122/pagr_Districts_MATH_2122.xlsx",
  },
  {
    subject: "Math",
    schoolYear: "2018-19",
    localFile: "ode_assessment_math_1819.xlsx",
    downloadUrl:
      "https://www.oregon.gov/ode/educator-resources/assessment/Documents/TestResults2122/TestResults2019/pagr_Districts_MATH_1819.xlsx",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────

function parseNum(val: any): number | null {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    val === "*" ||
    val === "-" ||
    val === "--" ||
    val === ">" ||
    val === "<" ||
    val === "***"
  )
    return null;
  const s = String(val).replace(/,/g, "").replace(/%/g, "").replace(/>/g, "").replace(/</g, "").trim();
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

async function downloadIfMissing(file: AssessmentFile): Promise<string | null> {
  const localPath = path.join(DATA_DIR, file.localFile);
  if (fs.existsSync(localPath)) {
    const stats = fs.statSync(localPath);
    if (stats.size > 10000) {
      return localPath; // Already have it
    }
  }

  console.log(`  Downloading ${file.localFile}...`);
  try {
    const res = await fetch(file.downloadUrl, {
      signal: AbortSignal.timeout(30000),
      headers: { "User-Agent": "Portland-Dashboard/1.0" },
    });
    if (!res.ok) {
      console.log(`    HTTP ${res.status} -- skipping`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10000) {
      const text = buf.toString("utf-8", 0, Math.min(buf.length, 500));
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        console.log(`    Got HTML error page -- skipping`);
        return null;
      }
    }
    fs.writeFileSync(localPath, buf);
    console.log(`    Saved ${(buf.length / 1024).toFixed(0)} KB`);
    return localPath;
  } catch (err: any) {
    console.log(`    Download failed: ${err.message}`);
    return null;
  }
}

// ── Parse Assessment XLSX ─────────────────────────────────────────────

interface TestScoreRow {
  school_year: string;
  district_name: string;
  subject: string;
  grade_level: string;
  proficiency_pct: number | null;
  participation_pct: number | null;
  n_tested: number | null;
}

function parseAssessmentFile(
  filePath: string,
  subject: string,
  schoolYear: string
): TestScoreRow[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Data sheet is always first
  const sheet = workbook.Sheets[sheetName];
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  // Find header row
  const headerRow = rawData[0];

  // Column mapping (standard across ODE assessment files)
  // col 0: Academic Year
  // col 1: District ID
  // col 2: District (name)
  // col 3: Subject
  // col 4: Student Group
  // col 5: Grade Level
  // col 6: Number Proficient
  // col 7: Percent Proficient
  // col 16: Number of Participants
  // col 17: Participation Rate
  //
  // But column positions can vary between years, so find them by header name
  let colDistName = -1;
  let colStudentGroup = -1;
  let colGradeLevel = -1;
  let colPctProficient = -1;
  let colParticipants = -1;
  let colPartRate = -1;

  for (let j = 0; j < headerRow.length; j++) {
    const h = String(headerRow[j] || "").trim().toLowerCase();
    if (h === "district" || h === "district name") colDistName = j;
    else if (h === "student group") colStudentGroup = j;
    else if (h === "grade level") colGradeLevel = j;
    else if (
      h === "percent proficient" ||
      h === "pct proficient" ||
      h === "% proficient" ||
      h.startsWith("percent proficient")
    )
      colPctProficient = j;
    else if (
      h === "number of participants" ||
      h === "participants" ||
      h === "num participants"
    )
      colParticipants = j;
    else if (
      h === "participation rate" ||
      h === "part rate" ||
      h === "participation %"
    )
      colPartRate = j;
  }

  if (colDistName < 0 || colPctProficient < 0) {
    console.log(
      `    WARNING: Could not find required columns in ${path.basename(filePath)}`
    );
    console.log(`    Headers: ${headerRow.join(" | ")}`);
    return [];
  }

  const results: TestScoreRow[] = [];

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    const distName = String(row[colDistName] || "").trim();
    if (!TARGET_NAMES.has(distName)) continue;

    // Only "Total Population (All Students)" or similar
    if (colStudentGroup >= 0) {
      const group = String(row[colStudentGroup] || "").trim().toLowerCase();
      if (
        !group.includes("total population") &&
        !group.includes("all students") &&
        group !== "total" &&
        group !== ""
      )
        continue;
    }

    const gradeLevel = colGradeLevel >= 0
      ? String(row[colGradeLevel] || "All Grades").trim()
      : "All Grades";
    const profPct = parseNum(row[colPctProficient]);
    const participants = colParticipants >= 0 ? parseNum(row[colParticipants]) : null;
    const partRate = colPartRate >= 0 ? parseNum(row[colPartRate]) : null;

    if (profPct === null) continue; // Skip suppressed data

    results.push({
      school_year: schoolYear,
      district_name: distName,
      subject,
      grade_level: gradeLevel,
      proficiency_pct: profPct,
      participation_pct: partRate,
      n_tested: participants !== null ? Math.round(participants) : null,
    });
  }

  return results;
}

// ── Database Operations ──────────────────────────────────────────────

async function seedTestScores(
  sql: ReturnType<typeof postgres>,
  scores: TestScoreRow[]
) {
  console.log(`\n=== Seeding ${scores.length} test score rows ===`);

  // Ensure schema and table exist
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS education`);

  // Alter table to add missing columns if needed
  await sql.unsafe(`
    ALTER TABLE education.test_scores
    ADD COLUMN IF NOT EXISTS participation_pct NUMERIC(5,1),
    ADD COLUMN IF NOT EXISTS n_tested INTEGER
  `);

  // Drop and recreate unique constraint to include grade_level properly
  // The existing unique constraint is (school_year, district_name, subject, grade_level)
  // which is correct for our needs

  // Clear existing test scores (we're replacing with comprehensive data)
  await sql.unsafe(`TRUNCATE education.test_scores RESTART IDENTITY`);

  let inserted = 0;
  let errors = 0;

  for (const score of scores) {
    try {
      await sql`
        INSERT INTO education.test_scores
          (school_year, district_name, subject, grade_level, proficiency_pct,
           participation_pct, n_tested, source)
        VALUES (
          ${score.school_year}, ${score.district_name}, ${score.subject},
          ${score.grade_level}, ${score.proficiency_pct},
          ${score.participation_pct}, ${score.n_tested},
          'ODE OSAS District Reports'
        )
        ON CONFLICT (school_year, district_name, subject, grade_level)
        DO UPDATE SET
          proficiency_pct = EXCLUDED.proficiency_pct,
          participation_pct = EXCLUDED.participation_pct,
          n_tested = EXCLUDED.n_tested,
          source = EXCLUDED.source
      `;
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 5) {
        console.log(
          `  Error inserting ${score.school_year}/${score.district_name}/${score.subject}/${score.grade_level}: ${err.message}`
        );
      }
    }
  }

  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
}

async function verifyData(sql: ReturnType<typeof postgres>) {
  console.log("\n=== Data Verification ===");

  // Enrollment summary
  const enrollSummary = await sql`
    SELECT district_name, COUNT(DISTINCT school_year) as years,
           MIN(school_year) as first_year, MAX(school_year) as last_year,
           MAX(CASE WHEN school_year = (SELECT MAX(school_year) FROM education.enrollment)
               AND grade_level = 'Total' AND demographic_group IS NULL
               THEN enrollment END) as latest_enrollment
    FROM education.enrollment
    WHERE grade_level = 'Total' AND demographic_group IS NULL
    GROUP BY district_name
    ORDER BY district_name
  `;
  console.log("\n  ENROLLMENT:");
  console.log("  " + "-".repeat(80));
  for (const r of enrollSummary) {
    console.log(
      `  ${r.district_name.padEnd(25)} | ${r.years} years (${r.first_year} to ${r.last_year}) | Latest: ${(r.latest_enrollment || "N/A").toString().padStart(6)}`
    );
  }

  // Graduation rates summary
  const gradSummary = await sql`
    SELECT district_name, COUNT(*) as years,
           MIN(school_year) as first_year, MAX(school_year) as last_year,
           MAX(CASE WHEN school_year = (SELECT MAX(school_year) FROM education.graduation_rates)
               THEN rate_4yr END) as latest_4yr,
           MAX(CASE WHEN school_year = (SELECT MAX(school_year) FROM education.graduation_rates)
               THEN rate_5yr END) as latest_5yr
    FROM education.graduation_rates
    GROUP BY district_name
    ORDER BY district_name
  `;
  console.log("\n  GRADUATION RATES:");
  console.log("  " + "-".repeat(80));
  for (const r of gradSummary) {
    console.log(
      `  ${r.district_name.padEnd(25)} | ${r.years} years (${r.first_year} to ${r.last_year}) | 4yr: ${(r.latest_4yr || "N/A").toString().padStart(5)}% | 5yr: ${(r.latest_5yr || "N/A").toString().padStart(5)}%`
    );
  }

  // Test scores summary
  const testSummary = await sql`
    SELECT district_name, subject,
           COUNT(DISTINCT school_year) as years,
           MIN(school_year) as first_year, MAX(school_year) as last_year,
           MAX(CASE WHEN school_year = (SELECT MAX(school_year) FROM education.test_scores WHERE grade_level = 'All Grades')
                    AND grade_level = 'All Grades'
               THEN proficiency_pct END) as latest_prof_pct
    FROM education.test_scores
    WHERE grade_level = 'All Grades'
    GROUP BY district_name, subject
    ORDER BY district_name, subject
  `;
  console.log("\n  TEST SCORES (All Grades):");
  console.log("  " + "-".repeat(90));
  for (const r of testSummary) {
    console.log(
      `  ${r.district_name.padEnd(25)} | ${r.subject.padEnd(5)} | ${r.years} years (${r.first_year} to ${r.last_year}) | Latest Prof: ${(r.latest_prof_pct || "N/A").toString().padStart(5)}%`
    );
  }

  // Total row counts
  const counts = await sql`
    SELECT
      (SELECT COUNT(*) FROM education.enrollment) as enrollment_rows,
      (SELECT COUNT(*) FROM education.graduation_rates) as graduation_rows,
      (SELECT COUNT(*) FROM education.test_scores) as test_score_rows,
      (SELECT COUNT(DISTINCT school_year) FROM education.test_scores) as test_score_years,
      (SELECT COUNT(DISTINCT district_name) FROM education.test_scores) as test_score_districts
  `;
  const c = counts[0];
  console.log("\n  TOTALS:");
  console.log(`  Enrollment rows:     ${c.enrollment_rows}`);
  console.log(`  Graduation rate rows: ${c.graduation_rows}`);
  console.log(`  Test score rows:      ${c.test_score_rows} (${c.test_score_years} years, ${c.test_score_districts} districts)`);

  // Update dashboard cache
  const cacheData = {
    source: "ODE OSAS District Reports, ODE Fall Membership, ODE Cohort Media Files",
    districts: TARGET_DISTRICTS.map((d) => d.name),
    data_summary: {
      enrollment: {
        years: enrollSummary.length > 0 ? `${enrollSummary[0].first_year} to ${enrollSummary[0].last_year}` : "none",
        districts: enrollSummary.length,
      },
      graduation_rates: {
        years: gradSummary.length > 0 ? `${gradSummary[0].first_year} to ${gradSummary[0].last_year}` : "none",
        districts: gradSummary.length,
      },
      test_scores: {
        years: testSummary.length > 0 ? `${testSummary[0].first_year} to ${testSummary[0].last_year}` : "none",
        districts: Number(c.test_score_districts),
        total_rows: Number(c.test_score_rows),
      },
    },
    seeded_at: new Date().toISOString(),
  };

  await sql`
    INSERT INTO public.dashboard_cache (question, data, updated_at)
    VALUES ('education_data_summary', ${sql.json(cacheData)}, now())
    ON CONFLICT (question) DO UPDATE SET
      data = ${sql.json(cacheData)},
      updated_at = now()
  `;
  console.log("\n  Updated dashboard_cache with education_data_summary");
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log("Portland Dashboard -- Education Data Seed");
  console.log("=========================================");
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(
    `Target districts: ${TARGET_DISTRICTS.map((d) => d.name).join(", ")}`
  );

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Step 1: Download any missing assessment files
  console.log("\n--- Step 1: Ensure assessment files are downloaded ---");
  const availableFiles: { file: AssessmentFile; path: string }[] = [];
  for (const file of ASSESSMENT_FILES) {
    const localPath = await downloadIfMissing(file);
    if (localPath) {
      availableFiles.push({ file, path: localPath });
      console.log(
        `  OK: ${file.subject} ${file.schoolYear} (${path.basename(localPath)})`
      );
    } else {
      console.log(`  MISSING: ${file.subject} ${file.schoolYear}`);
    }
  }

  // Step 2: Parse assessment files
  console.log("\n--- Step 2: Parse assessment data ---");
  const allScores: TestScoreRow[] = [];
  for (const { file, path: filePath } of availableFiles) {
    console.log(`  Parsing ${file.subject} ${file.schoolYear}...`);
    const rows = parseAssessmentFile(filePath, file.subject, file.schoolYear);
    console.log(`    Found ${rows.length} rows for target districts`);
    allScores.push(...rows);
  }

  console.log(`\nTotal test score rows parsed: ${allScores.length}`);

  // Summary of parsed data
  const yearSubjectCounts: Record<string, number> = {};
  for (const s of allScores) {
    const key = `${s.school_year} ${s.subject}`;
    yearSubjectCounts[key] = (yearSubjectCounts[key] || 0) + 1;
  }
  console.log("  Breakdown by year/subject:");
  for (const [key, count] of Object.entries(yearSubjectCounts).sort()) {
    console.log(`    ${key}: ${count} rows`);
  }

  if (allScores.length === 0) {
    console.error("\nERROR: No test score data parsed. Check XLSX files.");
    process.exit(1);
  }

  // Step 3: Insert into database
  console.log("\n--- Step 3: Seed database ---");
  const sql = postgres(DB_URL, {
    max: 1,
    prepare: false,
    onnotice: () => {},
  });

  try {
    await seedTestScores(sql, allScores);
    await verifyData(sql);
    await sql.end();
  } catch (err: any) {
    console.error("Database error:", err.message);
    await sql.end();
    process.exit(1);
  }

  console.log("\n=========================================");
  console.log("Education data seed complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
