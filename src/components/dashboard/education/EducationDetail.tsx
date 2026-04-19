"use client";

import { useEffect, useState, useMemo } from "react";
import StatGrid from "@/components/charts/StatGrid";
import ComparisonBarChart from "@/components/charts/ComparisonBarChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import TrendChart from "@/components/charts/TrendChart";
import DataNeeded from "@/components/dashboard/DataNeeded";
import NewsContext from "../NewsContext";
import {
  GraduationCap,
  TrendingUp,
  Users,
  BarChart3,
  BookOpen,
  TrendingDown,
  FileText,
  School,
  MapPin,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────

const ACCENT = "#3d7a5a";

const DISTRICT_COLORS: Record<string, string> = {
  "Portland SD 1J": "#3d7a5a",
  "Parkrose SD 3": "#7c4dba",
  "David Douglas SD 40": "#c05621",
  "Riverdale SD 51J": "#2d7d9a",
  "Reynolds SD 7": "#b85c8a",
  "Centennial SD 28J": "#5a7d3d",
};

const DISTRICT_SHORT: Record<string, string> = {
  "Portland SD 1J": "PPS",
  "Parkrose SD 3": "Parkrose",
  "David Douglas SD 40": "David Douglas",
  "Riverdale SD 51J": "Riverdale",
  "Reynolds SD 7": "Reynolds",
  "Centennial SD 28J": "Centennial",
};

// ── Types ────────────────────────────────────────────────────────────────

interface District {
  name: string;
  short: string;
}

interface EnrollmentYear {
  districtName: string;
  year: string;
  total: number;
}

interface EnrollmentTrendItem {
  year: string;
  total: number;
}

interface GradeEnrollment {
  districtName: string;
  grade: string;
  count: number;
}

interface GraduationRate {
  districtName: string;
  year: string;
  rate4yr: number | null;
  rate5yr: number | null;
  completers: number | null;
}

interface TestScore {
  districtName: string;
  year: string;
  subject: string;
  grade: string;
  proficiency: number | null;
  participationPct: number | null;
  nTested: number | null;
}

interface HeroStats {
  totalEnrollment: number;
  latestYear: string | null;
  avgGradRate: number | null;
  avgGradRateYear: string | null;
  avgProficiency: number | null;
  avgProficiencyYear: string | null;
}

interface EducationDetailData {
  districts: District[];
  enrollmentByYear: EnrollmentYear[];
  enrollmentTrend: EnrollmentTrendItem[];
  enrollmentByGrade: GradeEnrollment[];
  graduationRates: GraduationRate[];
  testScores: TestScore[];
  heroStats: HeroStats | null;
  topInsights: string[];
  latestYear: string | null;
  dataStatus: string;
}

// ── Subcomponents ────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon className="w-4 h-4" style={{ color: ACCENT }} />
      <h2 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-[var(--color-parchment)]" />
    </div>
  );
}

function DistrictToggle({
  districts,
  activeDistricts,
  onToggle,
}: {
  districts: District[];
  activeDistricts: Set<string>;
  onToggle: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {districts.map((d) => {
        const active = activeDistricts.has(d.name);
        const color = DISTRICT_COLORS[d.name] ?? ACCENT;
        return (
          <button
            key={d.name}
            onClick={() => onToggle(d.name)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-medium transition-all duration-200 border cursor-pointer"
            style={{
              backgroundColor: active ? `${color}14` : "transparent",
              borderColor: active ? color : "var(--color-parchment)",
              color: active ? color : "var(--color-ink-muted)",
              opacity: active ? 1 : 0.55,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 transition-opacity duration-200"
              style={{
                backgroundColor: color,
                opacity: active ? 1 : 0.3,
              }}
            />
            {d.short}
          </button>
        );
      })}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

function shortName(dist: string): string {
  return DISTRICT_SHORT[dist] ?? dist;
}

// ── Main Component ───────────────────────────────────────────────────────

export default function EducationDetail() {
  const [data, setData] = useState<EducationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeDistricts, setActiveDistricts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/dashboard/education/detail")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.districts) {
          setActiveDistricts(new Set(d.districts.map((dd: District) => dd.name)));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const toggleDistrict = (name: string) => {
    setActiveDistricts((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size > 1) next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // ── Derived data ──────────────────────────────────────────────────────

  const derived = useMemo(() => {
    if (!data) return null;

    const { enrollmentByYear, graduationRates, testScores } = data;
    const allDistricts = data.districts?.map((d) => d.name) ?? [];

    // Latest enrollment per district
    const latestByDistrict = new Map<string, EnrollmentYear>();
    const priorByDistrict = new Map<string, EnrollmentYear>();
    for (const d of allDistricts) {
      const distRows = enrollmentByYear.filter((e) => e.districtName === d);
      if (distRows.length > 0) latestByDistrict.set(d, distRows[distRows.length - 1]);
      if (distRows.length > 1) priorByDistrict.set(d, distRows[distRows.length - 2]);
    }

    // Total enrollment across all districts
    const latestYear = data.latestYear;
    const totalEnrollment = Array.from(latestByDistrict.values())
      .filter((e) => e.year === latestYear)
      .reduce((sum, e) => sum + e.total, 0);
    const totalPriorEnrollment = Array.from(priorByDistrict.values())
      .reduce((sum, e) => sum + e.total, 0);

    // Largest and smallest district
    const sorted = Array.from(latestByDistrict.entries())
      .filter(([, e]) => e.year === latestYear)
      .sort(([, a], [, b]) => b.total - a.total);
    const largest = sorted[0];
    const smallest = sorted[sorted.length - 1];

    // Enrollment trend data for MultiLineChart — pivot years as rows, districts as columns
    const years = Array.from(new Set(enrollmentByYear.map((e) => e.year))).sort();
    const enrollmentChartData = years.map((year) => {
      const row: Record<string, string | number> = { year };
      for (const d of allDistricts) {
        const match = enrollmentByYear.find((e) => e.districtName === d && e.year === year);
        if (match) row[shortName(d)] = match.total;
      }
      return row;
    });

    // Graduation rates: latest per district
    const latestGradByDistrict = new Map<string, GraduationRate>();
    for (const d of allDistricts) {
      const distRows = graduationRates.filter((g) => g.districtName === d && g.rate4yr !== null);
      if (distRows.length > 0) latestGradByDistrict.set(d, distRows[distRows.length - 1]);
    }

    // Graduation rate chart data — years as rows, districts as columns
    const gradYears = Array.from(new Set(graduationRates.filter((g) => g.rate4yr !== null).map((g) => g.year))).sort();
    const gradChartData = gradYears.map((year) => {
      const row: Record<string, string | number> = { year };
      for (const d of allDistricts) {
        const match = graduationRates.find((g) => g.districtName === d && g.year === year && g.rate4yr !== null);
        if (match) row[shortName(d)] = match.rate4yr!;
      }
      return row;
    });

    // PPS enrollment peak and decline
    const ppsEnrollment = enrollmentByYear.filter((e) => e.districtName === "Portland SD 1J");
    const ppsPeak = ppsEnrollment.length > 0
      ? ppsEnrollment.reduce((max, d) => d.total > max.total ? d : max, ppsEnrollment[0])
      : null;
    const ppsLatest = ppsEnrollment.length > 0 ? ppsEnrollment[ppsEnrollment.length - 1] : null;
    const ppsDecline = ppsPeak && ppsLatest ? ppsPeak.total - ppsLatest.total : 0;
    const ppsDeclinePct = ppsPeak && ppsLatest && ppsPeak.total > 0
      ? ((ppsDecline / ppsPeak.total) * 100).toFixed(1)
      : "0";

    // PPS graduation rate
    const ppsLatestGrad = latestGradByDistrict.get("Portland SD 1J");

    // Test scores: latest year, district-level proficiency by subject
    const testYears = Array.from(new Set(testScores.map((t) => t.year))).sort();
    const latestTestYear = testYears[testYears.length - 1] ?? null;
    const latestTestScores = latestTestYear
      ? testScores.filter((t) => t.year === latestTestYear && t.proficiency !== null)
      : [];

    // District-level proficiency comparison (avg across grades for each subject)
    const testScoreByDistrictSubject = new Map<string, { ela: number | null; math: number | null }>();
    for (const d of allDistricts) {
      const distEla = latestTestScores.filter((t) => t.districtName === d && t.subject === "ELA");
      const distMath = latestTestScores.filter((t) => t.districtName === d && t.subject === "Math");
      const avgEla = distEla.length > 0
        ? Math.round(distEla.reduce((s, t) => s + (t.proficiency ?? 0), 0) / distEla.length * 10) / 10
        : null;
      const avgMath = distMath.length > 0
        ? Math.round(distMath.reduce((s, t) => s + (t.proficiency ?? 0), 0) / distMath.length * 10) / 10
        : null;
      testScoreByDistrictSubject.set(d, { ela: avgEla, math: avgMath });
    }

    // District comparison table data
    const comparisonRows = allDistricts.map((d) => {
      const enrollment = latestByDistrict.get(d);
      const grad = latestGradByDistrict.get(d);
      const scores = testScoreByDistrictSubject.get(d);
      return {
        district: d,
        shortName: shortName(d),
        color: DISTRICT_COLORS[d] ?? ACCENT,
        enrollment: enrollment?.total ?? null,
        gradRate: grad?.rate4yr ?? null,
        elaProficiency: scores?.ela ?? null,
        mathProficiency: scores?.math ?? null,
      };
    }).sort((a, b) => (b.enrollment ?? 0) - (a.enrollment ?? 0));

    return {
      allDistricts,
      latestByDistrict,
      totalEnrollment,
      totalPriorEnrollment,
      largest,
      smallest,
      enrollmentChartData,
      gradChartData,
      latestGradByDistrict,
      ppsPeak,
      ppsLatest,
      ppsDecline,
      ppsDeclinePct,
      ppsLatestGrad,
      comparisonRows,
      years,
      gradYears,
      latestTestYear,
      latestTestScores,
      testScoreByDistrictSubject,
    };
  }, [data]);

  // ── Loading / Error states ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-sm bg-[var(--color-parchment)]"
          />
        ))}
      </div>
    );
  }

  if (error || !data || data.dataStatus === "error" || !derived) {
    return (
      <div className="text-center py-16 text-[var(--color-ink-muted)]">
        <p className="text-sm">Education data temporarily unavailable.</p>
        <p className="text-xs mt-1">
          Run <code className="font-mono">npx tsx scripts/parse-education.ts</code> to load data.
        </p>
      </div>
    );
  }

  const {
    allDistricts,
    totalEnrollment,
    totalPriorEnrollment,
    largest,
    smallest,
    enrollmentChartData,
    gradChartData,
    ppsPeak,
    ppsLatest,
    ppsDecline,
    ppsDeclinePct,
    ppsLatestGrad,
    comparisonRows,
    latestTestYear,
    latestTestScores,
    testScoreByDistrictSubject,
  } = derived;

  const yoyChange =
    totalEnrollment && totalPriorEnrollment && totalPriorEnrollment > 0
      ? ((totalEnrollment - totalPriorEnrollment) / totalPriorEnrollment) * 100
      : undefined;

  // Active district lines for charts
  const activeDistrictLines = allDistricts
    .filter((d) => activeDistricts.has(d))
    .map((d) => ({
      key: shortName(d),
      label: shortName(d),
      color: DISTRICT_COLORS[d] ?? ACCENT,
    }));

  // Combined enrollment trend for TrendChart
  const combinedTrendData = (data.enrollmentTrend ?? []).map((t) => ({
    date: t.year,
    value: t.total,
  }));

  // Proficiency comparison bar chart data
  const proficiencyBarData = allDistricts
    .filter((d) => activeDistricts.has(d))
    .map((d) => {
      const scores = testScoreByDistrictSubject.get(d);
      return {
        district: shortName(d),
        ELA: scores?.ela ?? 0,
        Math: scores?.math ?? 0,
      };
    })
    .filter((d) => d.ELA > 0 || d.Math > 0);

  return (
    <div className="space-y-10">
      {/* News Context */}
      <NewsContext category="education" />

      {/* 1. NARRATIVE SUMMARY */}
      <section>
        <div className="bg-[var(--color-canopy)] rounded-sm p-6 text-white/90">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[var(--color-ember)] flex-shrink-0 mt-1" />
            <h3 className="font-editorial-normal text-[28px] sm:text-[34px] leading-snug text-white">
              Six school districts serve Portland students
            </h3>
          </div>
          <div className="space-y-3 text-[14px] text-white/70 leading-relaxed">
            <p>
              Portland is not one school district. <strong className="text-white">Six districts</strong> serve
              students within city limits: PPS (the largest), David Douglas, Reynolds, Centennial,
              Parkrose, and Riverdale. Together they enroll{" "}
              <strong className="text-white">{totalEnrollment.toLocaleString()}</strong> students
              ({data.latestYear}), with vastly different demographics and outcomes.
            </p>
            {ppsPeak && ppsLatest && ppsDecline > 0 && (
              <p>
                PPS, serving most of the city, peaked at{" "}
                <strong className="text-white">{ppsPeak.total.toLocaleString()}</strong> ({ppsPeak.year})
                and has fallen to{" "}
                <strong className="text-white">{ppsLatest.total.toLocaleString()}</strong> ({ppsLatest.year})
                — down <strong className="text-white">{ppsDeclinePct}%</strong> /{" "}
                <strong className="text-white">{ppsDecline.toLocaleString()}</strong> students.
                Meanwhile, east Portland districts like David Douglas and Centennial have seen
                different enrollment patterns driven by immigration and housing shifts.
              </p>
            )}
            <p>
              {data.heroStats?.avgProficiency && (
                <>
                  Academic outcomes vary widely: average proficiency across all districts is{" "}
                  <strong className="text-white">{data.heroStats.avgProficiency}%</strong>.{" "}
                </>
              )}
              {ppsLatestGrad?.rate4yr && (
                <>
                  The PPS 4-year graduation rate stands at{" "}
                  <strong className="text-white">{ppsLatestGrad.rate4yr}%</strong>.{" "}
                </>
              )}
              Riverdale, a small affluent district, and east Portland districts serving
              predominantly immigrant communities face entirely different challenges.
            </p>
          </div>
          <p className="text-[11px] text-white/40 mt-4 font-mono">
            Source: Oregon Department of Education enrollment, assessment &amp; graduation data
          </p>
        </div>
      </section>

      {/* Top Insights */}
      {data.topInsights && data.topInsights.length > 0 && (
        <section>
          <SectionHeader icon={TrendingDown} title="Key Findings" />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
            <ul className="space-y-2">
              {data.topInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-light)] leading-relaxed">
                  <span className="text-[var(--color-ink-muted)] mt-0.5 flex-shrink-0">&#8226;</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* DISTRICT FILTER */}
      <section>
        <SectionHeader icon={School} title="Filter Districts" />
        <DistrictToggle
          districts={data.districts}
          activeDistricts={activeDistricts}
          onToggle={toggleDistrict}
        />
      </section>

      {/* 2. KEY STATS */}
      <section>
        <SectionHeader icon={GraduationCap} title="Education Overview" />
        <StatGrid
          accentColor={ACCENT}
          stats={[
            {
              label: "Total Enrollment (6 Districts)",
              value: totalEnrollment,
              change: yoyChange,
              changeLabel: "vs prior year",
            },
            ...(largest
              ? [
                  {
                    label: "Largest District",
                    value: largest[1].total.toLocaleString(),
                    changeLabel: shortName(largest[0]),
                  },
                ]
              : []),
            ...(smallest
              ? [
                  {
                    label: "Smallest District",
                    value: smallest[1].total.toLocaleString(),
                    changeLabel: shortName(smallest[0]),
                  },
                ]
              : []),
            ...(data.heroStats?.avgGradRate
              ? [
                  {
                    label: "Avg 4-Year Grad Rate",
                    value: `${data.heroStats.avgGradRate}%`,
                    changeLabel: data.heroStats.avgGradRateYear ?? "",
                  },
                ]
              : []),
          ]}
        />
      </section>

      {/* 3. COMBINED ENROLLMENT TREND */}
      {combinedTrendData.length > 0 && (
        <section>
          <SectionHeader icon={TrendingUp} title="Total Enrollment — All 6 Districts" />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
            <TrendChart
              data={combinedTrendData}
              color={ACCENT}
              height={280}
              yAxisDomain="auto"
            />
          </div>
        </section>
      )}

      {/* 4. ENROLLMENT TREND BY DISTRICT (multi-line) */}
      {enrollmentChartData.length > 0 && activeDistrictLines.length > 0 && (
        <section>
          <SectionHeader icon={TrendingUp} title="Enrollment Trend by District" />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
            <MultiLineChart
              data={enrollmentChartData}
              lines={activeDistrictLines}
              xKey="year"
              height={320}
            />
          </div>
        </section>
      )}

      {/* 5. DISTRICT COMPARISON TABLE */}
      {comparisonRows.length > 0 && (
        <section>
          <SectionHeader icon={BarChart3} title={`District Comparison (${data.latestYear})`} />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--color-parchment)]">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      District
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Enrollment
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Grad Rate
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      ELA Prof.
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Math Prof.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows
                    .filter((r) => activeDistricts.has(r.district))
                    .map((r) => (
                      <tr
                        key={r.district}
                        className="border-b border-[var(--color-parchment)]/60 last:border-b-0 hover:bg-[var(--color-parchment)]/20 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: r.color }}
                            />
                            <span className="font-medium text-[var(--color-ink)]">
                              {r.shortName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {r.enrollment !== null ? r.enrollment.toLocaleString() : "\u2014"}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {r.gradRate !== null ? `${r.gradRate}%` : "\u2014"}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {r.elaProficiency !== null ? `${r.elaProficiency}%` : "\u2014"}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {r.mathProficiency !== null ? `${r.mathProficiency}%` : "\u2014"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 6. GRADUATION RATES (multi-district) */}
      {gradChartData.length > 0 && activeDistrictLines.length > 0 ? (
        <section>
          <SectionHeader icon={GraduationCap} title="4-Year Graduation Rate by District" />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
            <MultiLineChart
              data={gradChartData}
              lines={activeDistrictLines}
              xKey="year"
              height={280}
              valueSuffix="%"
            />
          </div>
        </section>
      ) : (
        <DataNeeded
          title="Graduation Rates"
          description="Four-year and five-year graduation rates by district. Available from Oregon Department of Education annual reports."
          actions={[
            {
              label: "Download ODE graduation rate data",
              type: "download",
              href: "https://www.oregon.gov/ode/reports-and-data/students/Pages/Cohort-Graduation-Rate.aspx",
            },
          ]}
          color={ACCENT}
        />
      )}

      {/* 7. TEST SCORE PROFICIENCY BY DISTRICT */}
      {proficiencyBarData.length > 0 ? (
        <section>
          <SectionHeader icon={BookOpen} title={`Test Proficiency by District (${latestTestYear})`} />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
            <ComparisonBarChart
              data={proficiencyBarData}
              xKey="district"
              bars={[
                { key: "ELA", label: "ELA Proficiency %", color: ACCENT },
                { key: "Math", label: "Math Proficiency %", color: "#7c4dba" },
              ]}
              height={300}
              valueSuffix="%"
            />
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-3 leading-relaxed">
              Percentage of students meeting or exceeding grade-level standards on the
              Smarter Balanced Assessment. Averaged across all tested grade levels.
            </p>
          </div>
        </section>
      ) : (
        <DataNeeded
          title="Test Scores"
          description="Standardized assessment results for Portland students."
          actions={[
            {
              label: "Download ODE assessment data",
              type: "download",
              href: "https://www.oregon.gov/ode/educator-resources/assessment/Pages/Assessment-Group-Reports.aspx",
            },
          ]}
          color={ACCENT}
        />
      )}

      {/* 8. DETAILED TEST SCORES TABLE */}
      {latestTestScores.length > 0 && (
        <section>
          <SectionHeader icon={BookOpen} title={`Test Scores by Grade — All Districts (${latestTestYear})`} />
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--color-parchment)]">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      District
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Subject
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Grade
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Proficiency
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                      Tested
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {latestTestScores
                    .filter((t) => activeDistricts.has(t.districtName))
                    .slice(0, 50)
                    .map((t, i) => (
                      <tr
                        key={`${t.districtName}-${t.subject}-${t.grade}-${i}`}
                        className="border-b border-[var(--color-parchment)]/60 last:border-b-0"
                      >
                        <td className="px-4 py-2 text-[var(--color-ink-light)]">
                          {shortName(t.districtName)}
                        </td>
                        <td className="px-4 py-2 text-[var(--color-ink-light)]">
                          {t.subject}
                        </td>
                        <td className="px-4 py-2 text-[var(--color-ink-light)]">
                          {t.grade}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {t.proficiency !== null ? `${t.proficiency}%` : "\u2014"}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-[var(--color-ink-light)] tabular-nums">
                          {t.nTested !== null ? t.nTested.toLocaleString() : "\u2014"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 9. GRADE-LEVEL ENROLLMENT (PPS) */}
      {(() => {
        const ppsGrades = data.enrollmentByGrade.filter(
          (g) => g.districtName === "Portland SD 1J",
        );
        if (ppsGrades.length === 0 || !activeDistricts.has("Portland SD 1J")) return null;
        return (
          <section>
            <SectionHeader icon={BarChart3} title={`PPS Enrollment by Grade (${data.latestYear})`} />
            <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
              <ComparisonBarChart
                data={ppsGrades.map((g) => ({
                  grade: g.grade === "K" ? "K" : g.grade,
                  students: g.count,
                }))}
                xKey="grade"
                bars={[{ key: "students", label: "Students", color: ACCENT }]}
                height={300}
                showLegend={false}
              />
            </div>
          </section>
        );
      })()}

      {/* 10. DATA STILL NEEDED */}
      <section className="space-y-4">
        <DataNeeded
          title="Student Demographics"
          description="Race/ethnicity and English learner breakdowns by district."
          actions={[
            {
              label: "View ODE enrollment reports",
              type: "download",
              href: "https://www.oregon.gov/ode/reports-and-data/students/Pages/Student-Enrollment-Reports.aspx",
            },
          ]}
          color={ACCENT}
        />
        <DataNeeded
          title="Teacher Staffing Ratios"
          description="Student-to-teacher ratios across Portland-area districts."
          actions={[
            {
              label: "Download ODE staffing reports",
              type: "download",
              href: "https://www.oregon.gov/ode/educator-resources/Pages/default.aspx",
            },
          ]}
          color={ACCENT}
        />
        <DataNeeded
          title="Chronic Absenteeism Rate"
          description="Percentage of students missing 10%+ of school days by district."
          actions={[
            {
              label: "View ODE chronic absenteeism data",
              type: "download",
              href: "https://www.oregon.gov/ode/reports-and-data/students/Pages/Chronic-Absenteeism.aspx",
            },
          ]}
          color={ACCENT}
        />
      </section>

      {/* 11. METHODOLOGY */}
      <section>
        <SectionHeader icon={FileText} title="Methodology" />
        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5">
          <div className="space-y-3 text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
            <p>
              <strong className="text-[var(--color-ink-light)]">Coverage</strong>: This dashboard
              tracks all six school districts that serve students within Portland city limits: Portland
              SD 1J (PPS), Parkrose SD 3, David Douglas SD 40, Riverdale SD 51J, Reynolds SD 7, and
              Centennial SD 28J. Some districts (Reynolds, Centennial) extend beyond Portland into
              other jurisdictions.
            </p>
            <p>
              <strong className="text-[var(--color-ink-light)]">Enrollment data</strong> comes from
              the Oregon Department of Education (ODE) annual enrollment reports. Figures reflect
              October 1 headcount for each school year.
            </p>
            <p>
              <strong className="text-[var(--color-ink-light)]">Graduation rates</strong> use ODE&apos;s
              4-year adjusted cohort graduation rate, the federal standard. This tracks a cohort of
              first-time 9th graders and measures the percentage who graduate within four years,
              adjusting for transfers in and out.
            </p>
            <p>
              <strong className="text-[var(--color-ink-light)]">Test scores</strong> are Smarter Balanced
              Assessment results published by ODE. Proficiency rates shown are the percentage of students
              meeting or exceeding grade-level standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
