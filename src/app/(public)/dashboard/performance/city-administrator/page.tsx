import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Database,
  FileArchive,
  Layers3,
} from "lucide-react";
import type { PerformanceMetric, PerformanceSnapshot } from "@/lib/performance/types";
import { buildPerformanceDecisionSuite } from "@/lib/performance/decision-tools";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import {
  COUNCIL_BUDGET_HEARING_ISSUES,
  PERFORMANCE_SERVICE_AREAS,
  issueMetrics,
  metricsMatching,
  priorityServiceAreaMetrics,
  serviceAreaMetrics,
} from "@/lib/performance/product-layers";
import {
  EvidenceMetricCard,
  PageGuide,
  SectionHeader,
} from "../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "City Administrator Cockpit | Portland Civic Lab",
  description:
    "An executive operating view for the City Administrator's service delivery, risk, and Council readiness work.",
};

function formatFetchedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function dedupeMetrics(metrics: PerformanceMetric[]): PerformanceMetric[] {
  const seen = new Set<string>();
  return metrics.filter((metric) => {
    if (seen.has(metric.measureId)) return false;
    seen.add(metric.measureId);
    return true;
  });
}

function hasDataGap(metric: PerformanceMetric): boolean {
  return (
    metric.values.length === 0 ||
    Object.keys(metric.narratives).length < 4 ||
    !metric.latestPeriod ||
    !metric.latestActual
  );
}

function selectedByIds(metrics: PerformanceMetric[], ids: string[]): PerformanceMetric[] {
  const idSet = new Set(ids);
  return dedupeMetrics(metrics.filter((metric) => idSet.has(metric.measureId)));
}

function cityAdminServiceRows(snapshot: PerformanceSnapshot) {
  return PERFORMANCE_SERVICE_AREAS.filter((area) => area.slug !== "city-administrator").map(
    (area) => {
      const metrics = dedupeMetrics(serviceAreaMetrics(snapshot, area));
      const priorityMetrics = priorityServiceAreaMetrics(snapshot, area, 4);
      const negativeCount = metrics.filter((metric) => metric.trend.tone === "negative").length;
      const dataGapCount = metrics.filter(hasDataGap).length;
      const action =
        negativeCount > 0
          ? "Assign owner and explanation"
          : dataGapCount > 0
            ? "Close source or narrative gap"
            : "Monitor in next review";

      return {
        area,
        metrics,
        priorityMetrics,
        negativeCount,
        dataGapCount,
        action,
      };
    },
  );
}

function MiniMetricLink({
  metric,
  label,
}: {
  metric: PerformanceMetric;
  label: string;
}) {
  return (
    <Link
      href={`/dashboard/performance/${metric.measureId}`}
      className="group block rounded-sm border border-[var(--color-parchment)] bg-white p-3 shadow-[0_8px_28px_rgba(15,36,25,0.035)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage)]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        {label} · {metric.latestPeriod ?? "Unknown"}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
        {metric.title}
      </p>
      <p className="mt-2 text-2xl font-bold leading-none tabular-nums text-[var(--color-ink)]">
        {metric.latestActual ?? "No value"}
      </p>
    </Link>
  );
}

export default async function CityAdministratorCockpitPage() {
  const snapshot = await getPerformanceSnapshot();
  const suite = buildPerformanceDecisionSuite(snapshot);
  const cityAdminArea = PERFORMANCE_SERVICE_AREAS.find(
    (area) => area.slug === "city-administrator",
  );
  const executiveSignals = cityAdminArea
    ? priorityServiceAreaMetrics(snapshot, cityAdminArea, 8)
    : [];
  const serviceRows = cityAdminServiceRows(snapshot);
  const riskMetrics = selectedByIds(
    snapshot.metrics,
    suite.riskRegister.map((metric) => metric.measureId),
  );
  const dataGapMetrics = selectedByIds(
    snapshot.metrics,
    suite.staleOrWeakMetrics.map((metric) => metric.measureId),
  ).slice(0, 6);
  const decliningMetrics = dedupeMetrics(
    snapshot.metrics.filter((metric) => metric.trend.tone === "negative"),
  ).slice(0, 6);
  const improvingMetrics = dedupeMetrics(
    snapshot.metrics.filter((metric) => metric.trend.tone === "positive"),
  ).slice(0, 6);
  const changedMetrics = selectedByIds(
    snapshot.metrics,
    snapshot.changes.map((change) => change.measureId),
  ).slice(0, 4);
  const operationalWatchlist = dedupeMetrics([...riskMetrics, ...decliningMetrics]).slice(0, 8);
  const narrativeExamples = metricsMatching(snapshot.metrics, [
    "public satisfaction",
    "direction of the city",
    "311",
    "risk of expiring funding",
  ], 6);
  const negativeServiceAreas = serviceRows.filter((row) => row.negativeCount > 0).length;
  const executiveCouncilIssues = COUNCIL_BUDGET_HEARING_ISSUES.filter((issue) =>
    [
      "new-charter-dca-efficiency-and-access",
      "one-time-revenue-and-fund-integrity",
      "pcef-moda-opportunity-cost",
    ].includes(issue.slug),
  );
  const executiveIssueMetricMap = new Map(
    executiveCouncilIssues.map((issue) => [issue.slug, issueMetrics(snapshot, issue, 3)]),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#f7f3ed_42%,#efe8dc_100%)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(224,168,112,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
          <Link
            href="/dashboard/performance"
            className="performance-dark-link inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            <ArrowLeft className="h-4 w-4" />
            Performance warehouse
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                City Administrator Cockpit
              </p>
              <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
                A management view for service delivery, risk, and Council readiness
              </h1>
              <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
                Built for the City Administrator’s operating rhythm: see what changed,
                identify what needs an owner, prepare source-backed answers, and track
                follow-up across service areas.
              </p>
            </div>
            <div className="performance-dark-card rounded-sm p-5">
              <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.18em]">
                What this page helps with
              </p>
              <p className="performance-dark-copy mt-3 text-sm leading-relaxed">
                Weekly executive review, DCA check-ins, Council work sessions, budget
                hearings, and public updates that need a common evidence base.
              </p>
            </div>
          </div>
          <PageGuide
            start="Start with the executive brief, then use the service-area table to assign follow-up."
            importance="The City Administrator needs an early-warning view across service areas, not five separate dashboards that only answer bureau-by-bureau questions."
            scrollFor="Current brief, DCA delivery review, watchlist items, Council questions, and source-ready metric cards."
            nextHref="/dashboard/performance/service-areas"
            nextLabel="Compare service areas"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <section
          id="executive-brief"
          className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_24px_90px_rgba(15,36,25,0.08)]"
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="relative overflow-hidden bg-[var(--color-canopy)] p-6 text-white sm:p-7">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-sage)]/24 blur-3xl" />
              <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                Live Executive Brief
              </p>
              <h2 className="mt-2 max-w-4xl font-editorial text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
                Ready for the next City Administrator / DCA operating check-in
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72">
                This brief is generated from the cached Performance Portland scorecards. It
                gives staff a single place to start: what changed, what is moving the wrong
                direction, which metrics need better source support, and which service area
                should own the follow-up.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/performance/changes"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-[var(--color-canopy)]"
                >
                  Open change log
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/api/performance/export"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/16 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white"
                >
                  Export source data
                  <FileArchive className="h-4 w-4" />
                </Link>
              </div>
              </div>
            </div>

            <div className="grid gap-3 bg-[var(--color-paper-warm)] p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-1">
              {[
                {
                  icon: CalendarDays,
                  label: "Last refreshed",
                  value: formatFetchedAt(snapshot.fetchedAt),
                },
                {
                  icon: AlertTriangle,
                  label: "Watchlist items",
                  value: operationalWatchlist.length,
                },
                {
                  icon: Database,
                  label: "Official metrics cached",
                  value: snapshot.counts.uniqueMeasures,
                },
                {
                  icon: Layers3,
                  label: "Service areas with risk",
                  value: `${negativeServiceAreas} of ${serviceRows.length}`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_10px_35px_rgba(15,36,25,0.035)]">
                  <Icon className="h-5 w-5 text-[var(--color-canopy)]" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-tight text-[var(--color-ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6 lg:grid-cols-3">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_40px_rgba(15,36,25,0.04)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                What changed
              </p>
              <div className="mt-3 space-y-2">
                {changedMetrics.length > 0 ? (
                  changedMetrics.map((metric) => (
                    <MiniMetricLink key={metric.measureId} metric={metric} label="Changed value" />
                  ))
                ) : (
                  <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-[var(--color-paper)] p-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                    No latest-value changes were detected in the most recent cache comparison.
                    Use this as a baseline for the next refresh.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_40px_rgba(15,36,25,0.04)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                Moving the wrong direction
              </p>
              <div className="mt-3 space-y-2">
                {decliningMetrics.slice(0, 3).map((metric) => (
                  <MiniMetricLink key={metric.measureId} metric={metric} label="Declining signal" />
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_40px_rgba(15,36,25,0.04)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                Needs source cleanup
              </p>
              <div className="mt-3 space-y-2">
                {dataGapMetrics.slice(0, 3).map((metric) => (
                  <MiniMetricLink key={metric.measureId} metric={metric} label="Data gap" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6">
          <SectionHeader
            eyebrow="Service-Area Delivery Review"
            title="DCA accountability table"
            copy="This is the operating table for executive check-ins: each service area, the official scorecard behind it, how many risk/data-gap signals appear, and the next management action."
          />
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-parchment)] font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  <th className="py-3 pr-4">Service area</th>
                  <th className="px-4 py-3">DCA</th>
                  <th className="px-4 py-3">Official scorecard</th>
                  <th className="px-4 py-3 text-center">Priority metrics</th>
                  <th className="px-4 py-3 text-center">Risk signals</th>
                  <th className="px-4 py-3 text-center">Data gaps</th>
                  <th className="py-3 pl-4">Next action</th>
                </tr>
              </thead>
              <tbody>
                {serviceRows.map((row) => (
                  <tr key={row.area.slug} className="border-b border-[var(--color-parchment)] align-top">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-[var(--color-ink)]">{row.area.title}</p>
                      <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-[var(--color-ink-muted)]">
                        {row.area.portfolio}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[var(--color-ink)]">
                      {row.area.owner}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/performance?scorecard=${row.area.scorecardId}`}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--color-canopy)]"
                      >
                        #{row.area.scorecardId}
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-lg font-bold text-[var(--color-ink)]">
                      {row.priorityMetrics.length}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.negativeCount > 0
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.negativeCount}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.dataGapCount > 0
                            ? "bg-amber-50 text-amber-800"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.dataGapCount}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[var(--color-ink)]">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.07)]">
          <div className="grid lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="bg-[var(--color-canopy)] p-6 text-white sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                Council-Ready Issue Queue
              </p>
              <h2 className="mt-3 font-editorial text-[38px] leading-[1.04] text-white">
                Questions likely to become management follow-up
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/72">
                These are the budget-hearing issues that cut across service areas and
                require a citywide management answer, not just a bureau response.
              </p>
              <Link
                href="/dashboard/performance/council"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white"
              >
                Open full council issue map
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 bg-[var(--color-paper-warm)] p-5 sm:p-6 xl:grid-cols-3">
              {executiveCouncilIssues.map((issue) => {
                const metrics = executiveIssueMetricMap.get(issue.slug) ?? [];

                return (
                  <article
                    key={issue.slug}
                    className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_42px_rgba(15,36,25,0.045)]"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                      Hearing follow-up
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-tight text-[var(--color-ink)]">
                      {issue.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {issue.question}
                    </p>
                    <div className="mt-4 rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] p-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                        Management answer needed
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink)]">
                        {issue.budgetTest}
                      </p>
                    </div>
                    {metrics.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                          Source packets
                        </p>
                        {metrics.map((metric) => (
                          <Link
                            key={metric.measureId}
                            href={`/dashboard/performance/${metric.measureId}`}
                            className="flex items-start justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-white px-3 py-2 text-xs font-semibold leading-snug text-[var(--color-ink)] hover:border-[var(--color-sage)]"
                          >
                            <span className="line-clamp-2">{metric.title}</span>
                            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-canopy)]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6">
            <SectionHeader
              eyebrow="Executive Signal Board"
              title="Priority indicators for the first scan"
              copy="These are the initial official measures to scan before a DCA check-in. They are not the whole performance system, but they give an immediate starting point for trust, access, delivery, and basic service reliability."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {executiveSignals.map((metric) => (
                <EvidenceMetricCard
                  key={metric.measureId}
                  metric={metric}
                  label="Executive signal"
                  emphasis={metric.trend.tone === "negative" ? "risk" : "neutral"}
                />
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] p-5 text-white shadow-[0_18px_70px_rgba(15,36,25,0.12)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                Operational Watchlist
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Items that should have an owner, explanation, or next action before they
                become a Council escalation.
              </p>
              <div className="mt-4 space-y-3">
                {operationalWatchlist.map((metric) => (
                  <MiniMetricLink key={metric.measureId} metric={metric} label="Watchlist" />
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Briefing Facts and Source Packets
              </p>
              <h2 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
                Source-ready facts staff can lift into a briefing memo
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-light)]">
                Each card starts with an official Performance Portland value and links back
                to the full metric detail, including narrative notes and source URLs.
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-4">
              <CheckCircle2 className="h-5 w-5 text-[var(--color-canopy)]" />
              <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                Source packets are live
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                Metric detail pages include chart, history, official notes, and source URLs.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {narrativeExamples.map((metric) => (
              <Link
                key={metric.measureId}
                href={`/dashboard/performance/${metric.measureId}`}
                className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-4 hover:border-[var(--color-sage)]"
              >
                <p className="font-semibold text-[var(--color-ink)]">{metric.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                  Latest official value: {metric.latestPeriod ?? "Unknown"} is{" "}
                  {metric.latestActual ?? "not reported"}.
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-canopy)]">
                  Open source packet
                  <ArrowUpRight className="h-3 w-3" />
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white/75 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
              Improving signals also worth noting
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {improvingMetrics.slice(0, 3).map((metric) => (
                <MiniMetricLink key={metric.measureId} metric={metric} label="Improving signal" />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
