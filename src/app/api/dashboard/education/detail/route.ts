import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";

export const dynamic = "force-dynamic";

const CACHE_KEY = "education-detail";

const DISTRICTS = [
  "Portland SD 1J",
  "Parkrose SD 3",
  "David Douglas SD 40",
  "Riverdale SD 51J",
  "Reynolds SD 7",
  "Centennial SD 28J",
] as const;

const DISTRICT_SHORT: Record<string, string> = {
  "Portland SD 1J": "PPS",
  "Parkrose SD 3": "Parkrose",
  "David Douglas SD 40": "David Douglas",
  "Riverdale SD 51J": "Riverdale",
  "Reynolds SD 7": "Reynolds",
  "Centennial SD 28J": "Centennial",
};

// Single round-trip query — avoids pooler deadlocks with max:1 connections.
const COMBINED_QUERY = `
  SELECT json_build_object(
    'enrollment_by_district', (
      SELECT COALESCE(json_agg(t ORDER BY t.district_name, t.school_year), '[]'::json) FROM (
        SELECT district_name, school_year, enrollment
        FROM education.enrollment
        WHERE grade_level = 'Total' AND demographic_group IS NULL
          AND district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
      ) t
    ),
    'enrollment_trend', (
      SELECT COALESCE(json_agg(t ORDER BY t.school_year), '[]'::json) FROM (
        SELECT school_year, SUM(enrollment)::int AS total
        FROM education.enrollment
        WHERE grade_level = 'Total' AND demographic_group IS NULL
          AND district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
        GROUP BY school_year
      ) t
    ),
    'enrollment_by_grade', (
      SELECT COALESCE(json_agg(t ORDER BY t.district_name, t.sort_order), '[]'::json) FROM (
        SELECT district_name, grade_level, enrollment,
          CASE grade_level
            WHEN 'K' THEN 0
            WHEN 'KG' THEN 0
            WHEN 'Total' THEN 99
            ELSE NULLIF(regexp_replace(grade_level, '[^0-9]', '', 'g'), '')::int
          END AS sort_order
        FROM education.enrollment
        WHERE grade_level != 'Total'
          AND demographic_group IS NULL
          AND district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
          AND school_year = (SELECT MAX(school_year) FROM education.enrollment)
      ) t
    ),
    'graduation_rates', (
      SELECT COALESCE(json_agg(t ORDER BY t.district_name, t.school_year), '[]'::json) FROM (
        SELECT district_name, school_year, rate_4yr, rate_5yr, completers
        FROM education.graduation_rates
        WHERE district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
      ) t
    ),
    'test_scores', (
      SELECT COALESCE(json_agg(t ORDER BY t.district_name, t.school_year, t.subject, t.grade_level), '[]'::json) FROM (
        SELECT district_name, school_year, subject, grade_level, proficiency_pct, participation_pct, n_tested
        FROM education.test_scores
        WHERE district_name IN ('Portland SD 1J', 'Parkrose SD 3', 'David Douglas SD 40', 'Riverdale SD 51J', 'Reynolds SD 7', 'Centennial SD 28J')
      ) t
    ),
    'latest_year', (
      SELECT MAX(school_year) FROM education.enrollment
    )
  ) AS payload
`;

type Row = Record<string, unknown>;

export async function GET() {
  try {
    // Check cache first
    const cached = await getCachedData<Record<string, unknown>>(CACHE_KEY);
    if (cached) return NextResponse.json(cached);

    const result = await sql.unsafe(COMBINED_QUERY);
    const payload = (result[0]?.payload ?? {}) as Record<string, unknown>;

    const enrollmentByDistrictRaw = (payload.enrollment_by_district as Row[]) ?? [];
    const enrollmentTrendRaw = (payload.enrollment_trend as Row[]) ?? [];
    const enrollmentByGradeRaw = (payload.enrollment_by_grade as Row[]) ?? [];
    const graduationRatesRaw = (payload.graduation_rates as Row[]) ?? [];
    const testScoresRaw = (payload.test_scores as Row[]) ?? [];
    const latestYear = (payload.latest_year as string) ?? null;

    // Transform enrollment by district
    const enrollmentByYear = enrollmentByDistrictRaw.map((r) => ({
      districtName: r.district_name as string,
      year: r.school_year as string,
      total: Number(r.enrollment),
    }));

    // Transform enrollment trend (all districts combined)
    const enrollmentTrend = enrollmentTrendRaw.map((r) => ({
      year: r.school_year as string,
      total: Number(r.total),
    }));

    // Transform enrollment by grade
    const enrollmentByGrade = enrollmentByGradeRaw.map((r) => ({
      districtName: r.district_name as string,
      grade: r.grade_level === "KG" ? "K" : String(r.grade_level),
      count: Number(r.enrollment),
    }));

    // Transform graduation rates
    const graduationRates = graduationRatesRaw.map((r) => ({
      districtName: r.district_name as string,
      year: r.school_year as string,
      rate4yr: r.rate_4yr !== null ? Number(r.rate_4yr) : null,
      rate5yr: r.rate_5yr !== null ? Number(r.rate_5yr) : null,
      completers: r.completers !== null ? Number(r.completers) : null,
    }));

    // Transform test scores
    const testScores = testScoresRaw.map((r) => ({
      districtName: r.district_name as string,
      year: r.school_year as string,
      subject: r.subject as string,
      grade: r.grade_level as string,
      proficiency: r.proficiency_pct !== null ? Number(r.proficiency_pct) : null,
      participationPct: r.participation_pct !== null ? Number(r.participation_pct) : null,
      nTested: r.n_tested !== null ? Number(r.n_tested) : null,
    }));

    // Compute hero stats
    const latestEnrollments = enrollmentByYear.filter((e) => e.year === latestYear);
    const totalEnrollment = latestEnrollments.reduce((sum, e) => sum + e.total, 0);

    const latestGradRates = graduationRates.filter(
      (g) => g.rate4yr !== null
    );
    const latestGradYear = latestGradRates.length > 0
      ? latestGradRates.reduce((latest, g) => g.year > latest ? g.year : latest, "")
      : null;
    const latestYearGradRates = latestGradYear
      ? latestGradRates.filter((g) => g.year === latestGradYear)
      : [];
    const avgGradRate = latestYearGradRates.length > 0
      ? Math.round(
          (latestYearGradRates.reduce((sum, g) => sum + (g.rate4yr ?? 0), 0) /
            latestYearGradRates.length) *
            10
        ) / 10
      : null;

    const latestTestScores = testScores.filter((t) => t.proficiency !== null);
    const latestTestYear = latestTestScores.length > 0
      ? latestTestScores.reduce((latest, t) => t.year > latest ? t.year : latest, "")
      : null;
    const latestYearTestScores = latestTestYear
      ? latestTestScores.filter((t) => t.year === latestTestYear)
      : [];
    const avgProficiency = latestYearTestScores.length > 0
      ? Math.round(
          (latestYearTestScores.reduce((sum, t) => sum + (t.proficiency ?? 0), 0) /
            latestYearTestScores.length) *
            10
        ) / 10
      : null;

    // Compute top insights from real data
    const topInsights: string[] = [];

    // PPS enrollment decline
    const ppsEnrollment = enrollmentByYear.filter((e) => e.districtName === "Portland SD 1J");
    if (ppsEnrollment.length >= 2) {
      const ppsPeak = ppsEnrollment.reduce((max, e) => e.total > max.total ? e : max, ppsEnrollment[0]);
      const ppsLatest = ppsEnrollment[ppsEnrollment.length - 1];
      if (ppsPeak.total > ppsLatest.total) {
        const decline = ppsPeak.total - ppsLatest.total;
        const declinePct = ((decline / ppsPeak.total) * 100).toFixed(1);
        topInsights.push(
          `PPS enrollment peaked at ${ppsPeak.total.toLocaleString()} (${ppsPeak.year}) and has fallen to ${ppsLatest.total.toLocaleString()} (${ppsLatest.year}), a ${declinePct}% decline of ${decline.toLocaleString()} students`
        );
      }
    }

    // Graduation rate spread
    if (latestYearGradRates.length >= 2) {
      const sorted = [...latestYearGradRates].sort((a, b) => (b.rate4yr ?? 0) - (a.rate4yr ?? 0));
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      topInsights.push(
        `Graduation rates range from ${lowest.rate4yr}% (${DISTRICT_SHORT[lowest.districtName] ?? lowest.districtName}) to ${highest.rate4yr}% (${DISTRICT_SHORT[highest.districtName] ?? highest.districtName}) (${latestGradYear})`
      );
    }

    // Proficiency gap
    if (latestYearTestScores.length >= 2) {
      const elaScores = latestYearTestScores.filter((t) => t.subject === "ELA");
      const mathScores = latestYearTestScores.filter((t) => t.subject === "Math");
      const avgEla = elaScores.length > 0
        ? Math.round(elaScores.reduce((s, t) => s + (t.proficiency ?? 0), 0) / elaScores.length * 10) / 10
        : null;
      const avgMath = mathScores.length > 0
        ? Math.round(mathScores.reduce((s, t) => s + (t.proficiency ?? 0), 0) / mathScores.length * 10) / 10
        : null;
      if (avgEla !== null && avgMath !== null) {
        topInsights.push(
          `Average ELA proficiency: ${avgEla}%, Math proficiency: ${avgMath}% across all districts (${latestTestYear})`
        );
      }
    }

    const heroStats = {
      totalEnrollment,
      latestYear,
      avgGradRate,
      avgGradRateYear: latestGradYear,
      avgProficiency,
      avgProficiencyYear: latestTestYear,
    };

    const responseData = {
      districts: DISTRICTS.map((d) => ({
        name: d,
        short: DISTRICT_SHORT[d],
      })),
      enrollmentByYear,
      enrollmentTrend,
      enrollmentByGrade,
      graduationRates,
      testScores,
      heroStats,
      topInsights,
      latestYear,
      dataStatus: "live",
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Education detail API error:", message);
    return NextResponse.json({
      districts: [],
      enrollmentByYear: [],
      enrollmentTrend: [],
      enrollmentByGrade: [],
      graduationRates: [],
      testScores: [],
      heroStats: null,
      topInsights: [],
      latestYear: null,
      dataStatus: "error",
    });
  }
}
