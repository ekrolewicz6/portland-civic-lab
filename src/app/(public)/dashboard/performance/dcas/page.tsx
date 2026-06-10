import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ClipboardCheck, Map, TableProperties } from "lucide-react";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import {
  PERFORMANCE_SERVICE_AREAS,
  councilIssuesForServiceArea,
  priorityServiceAreaMetrics,
} from "@/lib/performance/product-layers";
import { EvidenceMetricCard, PageGuide } from "../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "DCA Performance Cockpits | Portland Civic Lab",
  description:
    "Service-area operating dashboards for Portland deputy city administrators using official Performance Portland metrics.",
};

const DCA_TOOLS = [
  {
    title: "Service Area Scorecard",
    icon: ClipboardCheck,
    copy: "Official metrics, trend status, owner, budget linkage, and last update.",
  },
  {
    title: "Bureau Drilldown",
    icon: TableProperties,
    copy: "Metric-by-bureau and program-by-program views for work-session prep.",
  },
  {
    title: "Budget-to-Outcome Map",
    icon: Map,
    copy: "Connect budget lines and amendments to the outcomes they claim to change.",
  },
  {
    title: "Meeting Brief Generator",
    icon: ClipboardCheck,
    copy: "One-page prep that starts from the current hearing issue, then adds metrics and source gaps.",
  },
  {
    title: "Data Gap Tracker",
    icon: TableProperties,
    copy: "Flags stale data, missing sources, incomplete narratives, and weak outcome logic.",
  },
];

export default async function DcaCockpitsPage() {
  const snapshot = await getPerformanceSnapshot();
  const dcaAreas = PERFORMANCE_SERVICE_AREAS.filter((area) => area.slug !== "city-administrator");

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
              DCA Cockpits
            </p>
            <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
              Operating dashboards for every deputy city administrator
            </h1>
            <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
              The shared pattern is the same for each DCA: start with official metrics,
              identify the budget/outcome linkage, then track the data gaps that will come
              up in council oversight.
            </p>
          </div>
          <PageGuide
            start="Choose the DCA portfolio that matches the meeting, budget item, or council question."
            importance="DCA pages should answer what the portfolio owns, which metrics matter, and what is still missing from the official scorecard."
            scrollFor="Shared DCA tools, service-area evidence, and the CED operating vertical."
            nextHref="/dashboard/performance/dcas/ced"
            nextLabel="Open CED first"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-5">
          {DCA_TOOLS.map((tool) => {
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

        <div className="mt-6 grid gap-5">
          {dcaAreas.map((area) => {
            const priorityMetrics = priorityServiceAreaMetrics(snapshot, area, 5);
            const isCed = area.slug === "community-economic-development";
            const hearingIssues = councilIssuesForServiceArea(area.slug);

            return (
              <article
                key={area.slug}
                className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_80px_rgba(15,36,25,0.065)]"
              >
                <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-start">
                  <div className="rounded-sm bg-[var(--color-paper-warm)] p-5 xl:w-[300px] xl:shrink-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                      {area.owner}
                    </p>
                    <h2 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
                      {area.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {area.operatingQuestion}
                    </p>
                  </div>
                  <div className="space-y-3 rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_40px_rgba(15,36,25,0.04)] xl:w-[320px] xl:shrink-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                      Budget hearing queue
                    </p>
                    {hearingIssues.length > 0 ? (
                      <div className="space-y-3">
                        {hearingIssues.slice(0, 2).map((issue) => (
                          <div
                            key={issue.slug}
                            className="rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] p-3"
                          >
                            <p className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
                              {issue.title}
                            </p>
                            <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[var(--color-ink-light)]">
                              {issue.question}
                            </p>
                          </div>
                        ))}
                        <Link
                          href="/dashboard/performance/council"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-canopy)]"
                        >
                          Open issue map
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-[var(--color-ink-light)]">
                        No current April 8 or May 7 hearing issue is mapped to this portfolio yet.
                        Use the service view to inspect the underlying scorecard.
                      </p>
                    )}
                    <Link
                      href={isCed ? "/dashboard/performance/dcas/ced" : "/dashboard/performance/service-areas"}
                      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold ${
                        isCed
                          ? "bg-[var(--color-canopy)] text-white"
                          : "bg-[var(--color-paper-warm)] text-[var(--color-canopy)]"
                      }`}
                    >
                      {isCed ? "Open CED cockpit" : "Service view"}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:flex-1">
                    {priorityMetrics.map((metric) => (
                      <EvidenceMetricCard
                        key={metric.measureId}
                        metric={metric}
                        label="DCA evidence"
                        emphasis={metric.trend.tone === "negative" ? "risk" : "neutral"}
                      />
                    ))}
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
