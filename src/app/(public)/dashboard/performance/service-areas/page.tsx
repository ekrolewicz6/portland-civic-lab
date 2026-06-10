import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Gauge } from "lucide-react";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import {
  PERFORMANCE_SERVICE_AREAS,
  councilIssuesForServiceArea,
  priorityServiceAreaMetrics,
  serviceAreaMetrics,
} from "@/lib/performance/product-layers";
import {
  EvidenceMetricCard,
  PageGuide,
} from "../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Service Area Performance | Portland Civic Lab",
  description:
    "Service-area views of official Performance Portland metrics for the City Administrator, DCAs, and City Council.",
};

export default async function ServiceAreasPage() {
  const snapshot = await getPerformanceSnapshot();

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
          <div className="mt-8 max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
              Service Area View
            </p>
            <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
              The operating map for the new city structure
            </h1>
            <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
              Each service area below starts with official Performance Portland metrics, then
              adds the operating question a DCA or councilor needs answered.
            </p>
          </div>
          <PageGuide
            start="Pick the service area tied to the decision or hearing you are preparing for."
            importance="Portland’s new government structure only works if residents and council can see performance by operating portfolio."
            scrollFor="Owner, operating question, priority metrics, and the link back to the official scorecard inventory."
            nextHref="/dashboard/performance/council"
            nextLabel="Use for hearing prep"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-5">
          {PERFORMANCE_SERVICE_AREAS.map((area) => {
            const allMetrics = serviceAreaMetrics(snapshot, area);
            const priorityMetrics = priorityServiceAreaMetrics(snapshot, area, 6);
            const negative = allMetrics.filter((metric) => metric.trend.tone === "negative").length;
            const councilIssues = councilIssuesForServiceArea(area.slug);

            return (
              <article
                key={area.slug}
                className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.07)]"
              >
                <div className="grid lg:grid-cols-[390px_1fr]">
                  <div className="relative overflow-hidden bg-[var(--color-canopy)] p-6 text-white">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-sage)]/20 blur-3xl" />
                    <div className="relative">
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-[var(--color-ember-bright)]" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                        {area.owner}
                      </p>
                    </div>
                    <h2 className="mt-3 font-editorial text-4xl leading-tight text-white">
                      {area.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {area.portfolio}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-sm border border-white/14 bg-white/8 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/54">
                          Metrics
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {allMetrics.length}
                        </p>
                      </div>
                      <div className="rounded-sm border border-white/14 bg-white/8 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/54">
                          Risk
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {negative}
                        </p>
                      </div>
                      <div className="rounded-sm border border-white/14 bg-white/8 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/54">
                          Scorecard
                        </p>
                        <p className="mt-1 text-2xl font-bold text-white">
                          {area.scorecardId}
                        </p>
                      </div>
                    </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="rounded-sm border-l-2 border-[var(--color-ember)]/60 bg-white/75 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                        Operating question
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-[var(--color-ink)]">
                        {area.operatingQuestion}
                      </p>
                    </div>

                    {councilIssues.length > 0 && (
                      <div className="mt-4 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                            Council hearing issues
                          </p>
                          <Link
                            href="/dashboard/performance/council"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-canopy)]"
                          >
                            Open issue map
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                          {councilIssues.slice(0, 3).map((issue) => (
                            <div
                              key={issue.slug}
                              className="rounded-sm border border-[var(--color-parchment)] bg-white p-3"
                            >
                              <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
                                {issue.title}
                              </p>
                              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-ink-light)]">
                                {issue.question}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {priorityMetrics.map((metric) => (
                        <EvidenceMetricCard
                          key={metric.measureId}
                          metric={metric}
                          label="Priority official metric"
                          emphasis={metric.trend.tone === "negative" ? "risk" : "neutral"}
                        />
                      ))}
                    </div>
                    <Link
                      href={`/dashboard/performance?scorecard=${area.scorecardId}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-canopy)]"
                    >
                      Browse full scorecard
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
