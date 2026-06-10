import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDollarSign,
  FileWarning,
  MessageSquareText,
} from "lucide-react";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import {
  CED_VERTICALS,
  COUNCIL_BUDGET_HEARING_ISSUES,
  PERFORMANCE_SERVICE_AREAS,
  issueMetrics,
  metricsMatching,
  priorityServiceAreaMetrics,
} from "@/lib/performance/product-layers";
import {
  EvidenceGap,
  EvidenceMetricCard,
  PageGuide,
} from "../../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Community & Economic Development Cockpit | Portland Civic Lab",
  description:
    "Community and Economic Development performance cockpit covering permitting, housing, PCEF, economic development, arts, youth, and spectator venues.",
};

export default async function CedCockpitPage() {
  const snapshot = await getPerformanceSnapshot();
  const cedArea = PERFORMANCE_SERVICE_AREAS.find(
    (area) => area.slug === "community-economic-development",
  );
  const cedMetrics = cedArea ? priorityServiceAreaMetrics(snapshot, cedArea, 12) : [];
  const cedHearingIssues = COUNCIL_BUDGET_HEARING_ISSUES.filter(
    (issue) => issue.serviceAreaSlug === "community-economic-development",
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#f7f3ed_42%,#efe8dc_100%)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(224,168,112,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
          <Link
            href="/dashboard/performance/dcas"
            className="performance-dark-link inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            <ArrowLeft className="h-4 w-4" />
            DCA cockpits
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                Service-Area Cockpit
              </p>
              <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
                Community & Economic Development
              </h1>
              <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
                This page turns the CED scorecard into a work-session operating cockpit:
                permitting, housing, PCEF, economic development, arts/youth, and spectator
                venues all in one source-backed view.
              </p>
            </div>
            <div className="performance-dark-card rounded-sm p-5">
              <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.18em]">
                Core question
              </p>
              <p className="performance-dark-copy mt-3 text-sm leading-relaxed">
                Can CED connect budget asks and public narratives to measurable outputs and
                outcomes, or are major decisions still being made without operational proof?
              </p>
            </div>
          </div>
          <PageGuide
            start="Start with the six CED lanes, then open the lane tied to the work session, policy question, or budget request."
            importance="CED spans high-stakes areas where activity counts can hide whether the city is actually delivering housing, permits, climate outcomes, and economic benefit."
            scrollFor="Metrics by vertical, data-gap candidates, budget questions, and spectator-venue gaps."
            nextHref="/dashboard/performance/council"
            nextLabel="Turn into council prep"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-3">
          {cedMetrics.slice(0, 6).map((metric) => (
            <EvidenceMetricCard
              key={metric.measureId}
              metric={metric}
              label="CED priority metric"
              emphasis={metric.trend.tone === "negative" ? "risk" : "neutral"}
            />
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.07)]">
          <div className="grid bg-[var(--color-canopy)] text-white lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
                May 7 CEDSA hearing map
              </p>
              <h2 className="mt-3 max-w-4xl font-editorial-normal text-[38px] leading-[1.04] tracking-tight text-white sm:text-[52px]">
                CED questions Council actually asked
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/74">
                The CED page should not just show a portfolio. It should help staff answer the
                live work-session issues: PCEF/Moda displacement, Prosper workforce cuts,
                downtown ROI, housing/permitting evidence, and arts/children grant tradeoffs.
              </p>
            </div>
            <div className="border-t border-white/12 bg-white/[0.06] p-6 sm:p-7 lg:border-l lg:border-t-0">
              <MessageSquareText className="h-5 w-5 text-[var(--color-ember-bright)]" />
              <p className="mt-4 text-sm leading-relaxed text-white/74">
                Open one issue before the hearing, then use the linked official source
                packets to separate what Performance Portland can prove from what still
                needs follow-up data.
              </p>
              <Link
                href="/dashboard/performance/council"
                className="mt-5 inline-flex items-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-[var(--color-canopy)]"
              >
                Open full council issue map
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 bg-[var(--color-paper-warm)] p-5 sm:p-6 xl:grid-cols-2">
            {cedHearingIssues.map((issue) => {
              const metrics = issueMetrics(snapshot, issue, 4);
              return (
                <article
                  key={issue.slug}
                  className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_12px_45px_rgba(15,36,25,0.045)]"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                    Work-session issue
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl leading-tight text-[var(--color-ink)]">
                    {issue.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                    {issue.hearingRecord}
                  </p>
                  <p className="mt-4 border-l-2 border-[var(--color-ember)] pl-3 text-sm font-semibold leading-relaxed text-[var(--color-ink)]">
                    {issue.question}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {metrics.length > 0 ? (
                      metrics.map((metric) => (
                        <Link
                          key={`${issue.slug}-${metric.measureId}`}
                          href={`/dashboard/performance/${metric.measureId}`}
                          className="group flex items-start justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage)]"
                        >
                          <span>
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
                              {metric.title}
                            </span>
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                              {metric.latestPeriod ?? "Unknown"} · {metric.latestActual ?? "No value"}
                            </span>
                          </span>
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-canopy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        No direct official metric exists yet. Treat this as a follow-up data request.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid gap-5">
          {CED_VERTICALS.map((vertical) => {
            const metrics =
              vertical.slug === "spectator-venues-moda"
                ? []
                : metricsMatching(snapshot.metrics, vertical.phrases, 6);
            const weakCount = metrics.filter((metric) => Object.keys(metric.narratives).length < 4).length;

            return (
              <article
                key={vertical.slug}
                className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.065)]"
              >
                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[360px_1fr_340px]">
                  <div className="rounded-sm bg-[var(--color-canopy)] p-5 text-white">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                      {vertical.owner}
                    </p>
                    <h2 className="mt-2 font-editorial text-3xl leading-tight text-white">
                      {vertical.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {vertical.purpose}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white">
                      <FileWarning className="h-3 w-3 text-[var(--color-ember)]" />
                      {weakCount} data-gap candidates
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {metrics.length > 0 ? (
                      metrics.map((metric) => (
                        <EvidenceMetricCard
                          key={metric.measureId}
                          metric={metric}
                          label={vertical.title}
                          emphasis={metric.trend.tone === "negative" ? "risk" : "neutral"}
                        />
                      ))
                    ) : (
                      <EvidenceGap
                        title="No direct official metric found"
                        copy="The official Performance Portland scorecards do not yet expose a direct metric for this lane. That should be treated as a data gap, not as evidence that the issue is unimportant."
                        actionHref="/dashboard/performance/changes"
                        actionLabel="Track as data gap"
                      />
                    )}
                  </div>

                  <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-[var(--color-canopy)]" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                        Budget questions
                      </p>
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-ink)]">
                      {vertical.budgetQuestions.map((question) => (
                        <p key={question} className="border-l-2 border-[var(--color-ember)]/50 pl-3">
                          {question}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-6 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] p-5 text-white shadow-[0_22px_80px_rgba(15,36,25,0.12)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
            Spectator venues / Moda note
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-white/74">
            The official CED scorecard does not yet provide a clean spectator-venue or Moda
            performance measure. That absence is itself a data gap: public subsidy,
            enforceable community benefits, lease/funding status, and climate/PCEF exposure
            need measurable public outputs before council can evaluate tradeoffs.
          </p>
          <Link
            href="/dashboard/performance/council"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-[var(--color-canopy)]"
          >
            Convert this into council questions
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
