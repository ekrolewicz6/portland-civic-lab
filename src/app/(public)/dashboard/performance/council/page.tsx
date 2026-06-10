import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileArchive,
  Gavel,
  MessageSquareText,
  Scale,
  type LucideIcon,
} from "lucide-react";
import type { PerformanceMetric } from "@/lib/performance/types";
import {
  buildCouncilHearingAreas,
  COUNCIL_BUDGET_HEARING_ISSUES,
  issueMetrics,
  type CouncilBudgetIssue,
  type CouncilHearingArea,
} from "@/lib/performance/product-layers";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import {
  PageGuide,
} from "../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Council Budget Hearing Cockpit | Portland Civic Lab",
  description:
    "Source-backed budget hearing prep, amendment impact framing, and council question bank from official Performance Portland metrics.",
};

const COUNCIL_TOOLS = [
  {
    title: "Budget Hearing Prep",
    icon: Gavel,
    copy: "Open the exact April 8 and May 7 budget-hearing issue, then pull the official metrics and source gaps tied to it.",
  },
  {
    title: "Amendment Impact View",
    icon: Scale,
    copy: "Translate likely amendments into affected outputs, outcomes, fund restrictions, and future-year tradeoffs.",
  },
  {
    title: "Council Question Bank",
    icon: MessageSquareText,
    copy: "Use the hearing-record question first, then attach the official metric packet council staff can cite.",
  },
  {
    title: "Source Packet Export",
    icon: FileArchive,
    copy: "Export official values and narrative tabs, while keeping hearing interpretation separate from source facts.",
  },
];

function trendIcon(metric: PerformanceMetric): LucideIcon {
  if (metric.trend.direction === "up") return ArrowUpRight;
  if (metric.trend.direction === "down") return ArrowDownRight;
  return ArrowRight;
}

function trendClass(metric: PerformanceMetric): string {
  if (metric.trend.tone === "positive") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (metric.trend.tone === "negative") return "border-red-200 bg-red-50 text-red-800";
  return "border-stone-200 bg-white text-stone-700";
}

function MetricEvidenceRow({
  metric,
  index,
}: {
  metric: PerformanceMetric;
  index: number;
}) {
  const TrendIcon = trendIcon(metric);

  return (
    <Link
      href={`/dashboard/performance/${metric.measureId}`}
      className="group grid gap-3 rounded-sm border border-[var(--color-parchment)] bg-white/80 p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage)] md:grid-cols-[34px_minmax(0,1fr)_120px_84px_24px] md:items-center"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-canopy)] font-mono text-xs font-bold text-white">
        {index + 1}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-base font-semibold leading-snug text-[var(--color-ink)]">
          {metric.title}
        </span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          {metric.metricType} · {metric.latestPeriod ?? "Unknown period"}
        </span>
      </span>
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Latest
        </span>
        <span className="mt-1 block truncate text-2xl font-bold leading-none tabular-nums text-[var(--color-ink)]">
          {metric.latestActual ?? "No value"}
        </span>
      </span>
      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${trendClass(metric)}`}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {metric.trend.direction}
      </span>
      <ArrowUpRight className="h-4 w-4 text-[var(--color-canopy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function IssueMetricLink({ metric }: { metric: PerformanceMetric }) {
  const TrendIcon = trendIcon(metric);

  return (
    <Link
      href={`/dashboard/performance/${metric.measureId}`}
      className="group flex items-start justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-white/85 p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage)]"
    >
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
          {metric.title}
        </span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          {metric.latestPeriod ?? "Unknown"} · {metric.latestActual ?? "No value"}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] ${trendClass(metric)}`}>
          <TrendIcon className="h-3 w-3" />
          {metric.trend.direction}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--color-canopy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function BudgetIssueCard({
  issue,
  metrics,
  compact = false,
}: {
  issue: CouncilBudgetIssue;
  metrics: PerformanceMetric[];
  compact?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_16px_55px_rgba(15,36,25,0.055)]">
      <div className="border-t-4 border-[var(--color-ember)] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
          Budget-hearing issue
        </p>
        <h3 className="mt-2 font-editorial text-2xl leading-tight text-[var(--color-ink)]">
          {issue.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
          {issue.hearingRecord}
        </p>
      </div>

      <div className={`grid gap-4 border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 ${compact ? "" : "lg:grid-cols-[1fr_1fr]"}`}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Council signal
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
            {issue.councilSignal}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Budget test
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
            {issue.budgetTest}
          </p>
        </div>
      </div>

      <div className="grid gap-4 border-t border-[var(--color-parchment)] p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
            Ask this in the hearing
          </p>
          <p className="mt-2 border-l-2 border-[var(--color-ember)] pl-3 text-base font-semibold leading-relaxed text-[var(--color-ink)]">
            {issue.question}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
            Likely amendment path
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-light)]">
            {issue.likelyAmendment}
          </p>
          <p className="mt-4 rounded-sm border border-amber-200 bg-amber-50/80 p-3 text-sm leading-relaxed text-amber-950">
            <span className="font-semibold">Source gap: </span>
            {issue.sourceGap}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
            Open source packets
          </p>
          <div className="mt-3 space-y-2">
            {metrics.length > 0 ? (
              metrics.slice(0, compact ? 3 : 5).map((metric) => (
                <IssueMetricLink key={`${issue.slug}-${metric.measureId}`} metric={metric} />
              ))
            ) : (
              <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-white/80 p-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                No matching official metric exists yet. Treat this as an explicit budget data gap.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function HearingAreaBrief({
  area,
  index,
  issueMetricMap,
}: {
  area: CouncilHearingArea;
  index: number;
  issueMetricMap: Map<string, PerformanceMetric[]>;
}) {
  const flaggedChecks = area.contradictionChecks.filter((check) => check.status === "flagged");
  const flaggedMetrics = flaggedChecks.reduce(
    (count, check) => count + check.metrics.length,
    0,
  );
  const firstQuestion = area.questions[0] ?? "Which budget claim needs official evidence?";

  return (
    <article className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_18px_60px_rgba(15,36,25,0.07)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative overflow-hidden bg-[var(--color-canopy)] p-6 text-white sm:p-7">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-sage)]/25 blur-3xl" />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
              Hearing prep · {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 max-w-3xl font-editorial-normal text-[38px] leading-[1.02] tracking-tight text-white sm:text-[50px]">
              {area.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78">
              {area.hearingPurpose}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Evidence metrics", area.metrics.length],
                ["Active flags", flaggedChecks.length],
                ["Flagged links", flaggedMetrics],
              ].map(([label, value]) => (
                <div key={label} className="rounded-sm border border-white/14 bg-white/8 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/56">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-bold leading-none tabular-nums text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="bg-[var(--color-paper-warm)] p-6 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
            Ask first
          </p>
          <p className="mt-4 border-l-2 border-[var(--color-ember)] pl-4 text-xl font-semibold leading-snug text-[var(--color-ink)]">
            {firstQuestion}
          </p>
          <div className="mt-5 space-y-3">
            {area.questions.slice(1).map((question) => (
              <p
                key={question}
                className="rounded-sm border border-[var(--color-parchment)] bg-white/80 p-3 text-sm leading-relaxed text-[var(--color-ink-light)]"
              >
                {question}
              </p>
            ))}
          </div>
        </aside>
      </div>

      {area.hearingIssues.length > 0 && (
        <section className="border-t border-[var(--color-parchment)] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Hearing issues from the record
              </p>
              <h3 className="mt-2 font-editorial text-3xl leading-tight text-[var(--color-ink)]">
                Start with the actual fight, then open the evidence
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--color-ink-light)]">
              These cards translate the April 8 and May 7 budget hearings into specific
              questions, likely amendments, source packets, and data gaps.
            </p>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {area.hearingIssues.map((issue) => (
              <BudgetIssueCard
                key={issue.slug}
                issue={issue}
                metrics={issueMetricMap.get(issue.slug) ?? []}
                compact
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Evidence to open
              </p>
              <h3 className="mt-2 font-editorial text-3xl leading-tight text-[var(--color-ink)]">
                Official metrics behind the hearing
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--color-ink-light)]">
              Each row is a source packet: latest value, trend, official notes, history, and
              ClearImpact source links.
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            {area.metrics.map((metric, metricIndex) => (
              <MetricEvidenceRow
                key={metric.measureId}
                metric={metric}
                index={metricIndex}
              />
            ))}
          </div>
        </section>

        <aside className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
            Contradictions to resolve
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
            This is the user’s next move: check whether the budget story is supported by the
            official metric direction and explanation.
          </p>
          <div className="mt-5 space-y-3">
            {area.contradictionChecks.map((check) => (
              <div
                key={check.slug}
                className={`rounded-sm border p-4 ${
                  check.status === "flagged"
                    ? "border-red-200 bg-red-50/75"
                    : "border-emerald-200 bg-emerald-50/65"
                }`}
              >
                <div className="flex items-start gap-3">
                  {check.status === "flagged" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
                      {check.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {check.summary}
                    </p>
                  </div>
                </div>
                <p className="mt-3 border-l-2 border-[var(--color-ember)]/60 pl-3 text-sm leading-relaxed text-[var(--color-ink)]">
                  {check.question}
                </p>
                {check.metrics.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                      Open flagged evidence
                    </p>
                    {check.metrics.slice(0, 4).map((metric) => (
                      <Link
                        key={`${check.slug}-${metric.measureId}`}
                        href={`/dashboard/performance/${metric.measureId}`}
                        className="group block rounded-sm border border-[var(--color-parchment)] bg-white/85 p-3 hover:border-[var(--color-sage)]"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
                              {metric.title}
                            </span>
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                              {metric.latestPeriod ?? "Unknown period"} ·{" "}
                              {metric.latestActual ?? "No value"} · Trend{" "}
                              {metric.trend.direction}
                            </span>
                          </span>
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-canopy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}

export default async function CouncilCockpitPage() {
  const snapshot = await getPerformanceSnapshot();
  const hearingAreas = buildCouncilHearingAreas(snapshot);
  const issueMetricEntries = COUNCIL_BUDGET_HEARING_ISSUES.map(
    (issue) => [issue.slug, issueMetrics(snapshot, issue, 5)] as const,
  );
  const issueMetricMap = new Map(issueMetricEntries);
  const topIssueMetrics = issueMetricEntries.reduce(
    (count, [, metrics]) => count + metrics.length,
    0,
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
                Council Budget Hearing Cockpit
              </p>
              <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
                Budget-hearing questions backed by official metrics
              </h1>
              <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
                This cockpit turns the April 8 council priorities session and the May 7
                CEDSA work session into hearing prep: what question is on the table,
                which budget claim needs evidence, what source packet to open, and what
                amendment path is available.
              </p>
            </div>
            <div className="performance-dark-card rounded-sm p-5">
              <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.18em]">
                Built around the current hearings
              </p>
              <p className="performance-dark-copy mt-3 text-sm leading-relaxed">
                Current issue map: {COUNCIL_BUDGET_HEARING_ISSUES.length} budget-hearing
                issues, {topIssueMetrics} source-packet links, and explicit data gaps where
                Performance Portland does not yet answer the council question.
              </p>
            </div>
          </div>
          <PageGuide
            start="Pick the service area on the agenda, then read the metrics and question bank together."
            importance="Councilors need a fast path from a budget claim to official evidence, evidence gaps, and source packets staff can reuse."
            scrollFor="Hearing prep by service area, amendment impact logic, source export, and question prompts."
            nextHref="/api/performance/export"
            nextLabel="Export source data"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-4">
          {COUNCIL_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.title}
                className="group relative overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_16px_55px_rgba(15,36,25,0.055)] transition-all hover:-translate-y-1 hover:border-[var(--color-sage)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-canopy)] via-[var(--color-sage)] to-[var(--color-ember)] opacity-0 transition-opacity group-hover:opacity-100" />
                <Icon className="h-5 w-5 text-[var(--color-canopy)]" />
                <h2 className="mt-4 font-editorial text-2xl leading-tight text-[var(--color-ink)]">
                  {tool.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                  {tool.copy}
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-6 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.07)]">
          <div className="grid bg-[var(--color-canopy)] text-white lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
                Budget-hearing issue map
              </p>
              <h2 className="mt-3 max-w-4xl font-editorial-normal text-[38px] leading-[1.04] tracking-tight text-white sm:text-[52px]">
                The specific budget questions Council needs to resolve
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/74">
                Each issue below comes from a public budget hearing, names the policy
                question, identifies the amendment test, and links to official metrics
                that can ground the discussion.
              </p>
            </div>
            <div className="border-t border-white/12 bg-white/[0.06] p-6 sm:p-7 lg:border-l lg:border-t-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/58">
                Use this first when
              </p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/76">
                <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                  Preparing for a question about how the proposed budget reflects April 8 priorities.
                </p>
                <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                  Translating a service-area claim into a measurable output or outcome.
                </p>
                <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                  Connecting a proposed amendment to source data and a clear tradeoff explanation.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 bg-[var(--color-paper-warm)] p-5 sm:p-6 xl:grid-cols-2">
            {COUNCIL_BUDGET_HEARING_ISSUES.map((issue) => (
              <BudgetIssueCard
                key={issue.slug}
                issue={issue}
                metrics={issueMetricMap.get(issue.slug) ?? []}
              />
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-8">
          {hearingAreas.map((area, index) => (
            <HearingAreaBrief
              key={area.slug}
              area={area}
              index={index}
              issueMetricMap={issueMetricMap}
            />
          ))}
        </div>

        <section className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
            Amendment Impact View
          </p>
          <h2 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
            Amendment tests from the hearings
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "State the hearing priority or follow-up request the amendment is responding to.",
              "Attach source packets for every official metric the amendment claims to affect.",
              "Name the tradeoff: restored service, delayed project, restricted fund use, reserve risk, or missing outcome evidence.",
            ].map((copy) => (
              <div key={copy} className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-4 text-sm leading-relaxed text-[var(--color-ink)]">
                {copy}
              </div>
            ))}
          </div>
          <Link
            href="/api/performance/export"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-4 py-2 text-sm font-semibold text-white"
          >
            Export all source data
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
