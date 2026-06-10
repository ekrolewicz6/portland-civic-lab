"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Database,
  FileDown,
  Layers3,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type {
  PerformanceDecisionSuite,
  PerformanceDecisionTool,
  PerformanceMetric,
  PerformanceScorecard,
  PerformanceSnapshot,
} from "@/lib/performance/types";

interface PerformanceDashboardClientProps {
  snapshot: PerformanceSnapshot;
  decisionSuite: PerformanceDecisionSuite;
}

const AUDIENCE_LABELS = {
  raymondLee: "Executive Office",
  dcas: "DCAs",
  cityCouncil: "City Council",
};

const PRODUCT_LINKS = [
  {
    title: "All Scorecards",
    href: "/dashboard/performance",
    eyebrow: "Warehouse",
    copy: "Search every official metric, section, and narrative tab.",
  },
  {
    title: "Service Area View",
    href: "/dashboard/performance/service-areas",
    eyebrow: "Operating map",
    copy: "City Administrator and DCA views by service area.",
  },
  {
    title: "Change Log",
    href: "/dashboard/performance/changes",
    eyebrow: "Updates",
    copy: "Changed values, weak metrics, and refresh status.",
  },
  {
    title: "City Administrator Cockpit",
    href: "/dashboard/performance/city-administrator",
    eyebrow: "Executive",
    copy: "Reorganization proof, risk register, and narrative builder.",
  },
  {
    title: "DCA Cockpits",
    href: "/dashboard/performance/dcas",
    eyebrow: "Service areas",
    copy: "Shared DCA tools and bureau/program drilldown pattern.",
  },
  {
    title: "Community & Economic Development",
    href: "/dashboard/performance/dcas/ced",
    eyebrow: "CED vertical",
    copy: "Permitting, housing, PCEF, economy, arts, youth, venues.",
  },
  {
    title: "Council Budget Hearing",
    href: "/dashboard/performance/council",
    eyebrow: "Oversight",
    copy: "April 8 priorities, May 7 CEDSA issues, amendment tests, and source packets.",
  },
];

function trendIcon(metric: PerformanceMetric): LucideIcon {
  if (metric.trend.direction === "up") return ArrowUpRight;
  if (metric.trend.direction === "down") return ArrowDownRight;
  return ArrowRight;
}

function trendClass(metric: PerformanceMetric): string {
  if (metric.trend.tone === "positive") return "border-emerald-300 bg-emerald-50 text-emerald-800";
  if (metric.trend.tone === "negative") return "border-red-300 bg-red-50 text-red-800";
  return "border-stone-300 bg-white text-stone-700";
}

function toolAudienceLabel(tool: PerformanceDecisionTool): string {
  if (tool.audience === "raymond_lee") return "Executive Office";
  if (tool.audience === "dca") return "Service Areas";
  return "City Council";
}

function narrativeCoverage(metric: PerformanceMetric): string {
  const count = Object.keys(metric.narratives).length;
  return `${count}/4 notes`;
}

function matchesMetric(metric: PerformanceMetric, query: string): boolean {
  if (!query) return true;
  const haystack = [
    metric.title,
    metric.metricType,
    metric.latestPeriod ?? "",
    metric.latestActual ?? "",
    metric.measureId,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function filteredScorecards(
  scorecards: PerformanceScorecard[],
  query: string,
  scorecardId: string,
): PerformanceScorecard[] {
  return scorecards
    .filter((scorecard) => scorecardId === "all" || scorecard.scorecardId === scorecardId)
    .map((scorecard) => ({
      ...scorecard,
      containers: scorecard.containers
        .map((container) => ({
          ...container,
          metrics: container.metrics.filter((metric) => matchesMetric(metric, query)),
        }))
        .filter((container) => container.metrics.length > 0),
    }))
    .filter((scorecard) => scorecard.containers.length > 0);
}

function ToolCard({ tool }: { tool: PerformanceDecisionTool }) {
  return (
    <article className="group relative overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_18px_60px_rgba(15,36,25,0.06)] transition-all hover:-translate-y-1 hover:border-[var(--color-sage)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-canopy)] via-[var(--color-sage)] to-[var(--color-ember)]" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
            {toolAudienceLabel(tool)}
          </p>
          <h3 className="mt-2 font-editorial text-2xl leading-tight text-[var(--color-ink)]">
            {tool.title}
          </h3>
        </div>
        <ShieldCheck className="mt-1 h-5 w-5 text-[var(--color-sage)]" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
        {tool.purpose}
      </p>
      <p className="mt-3 border-l-2 border-[var(--color-ember)]/50 pl-3 text-sm leading-relaxed text-[var(--color-ink)]">
        {tool.delivery}
      </p>
      {tool.priorityMetrics.length > 0 && (
        <div className="mt-4 space-y-2">
          {tool.priorityMetrics.slice(0, 4).map((metric) => (
            <Link
              key={metric.measureId}
              href={`/dashboard/performance/${metric.measureId}`}
              className="flex items-center justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-3 py-2 text-sm hover:border-[var(--color-sage)]"
            >
              <span className="line-clamp-1 text-[var(--color-ink)]">{metric.title}</span>
              <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-muted)]">
                {metric.latestActual ?? "No value"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const TrendIcon = trendIcon(metric);

  return (
    <Link
      href={`/dashboard/performance/${metric.measureId}`}
      className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_12px_42px_rgba(15,36,25,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sage)] hover:shadow-[0_24px_80px_rgba(15,36,25,0.10)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-canopy)] via-[var(--color-sage)] to-[var(--color-ember)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div>
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {metric.metricType} · #{metric.measureId}
          </p>
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm ${trendClass(metric)}`}
            title={`Trend ${metric.trend.direction}`}
            aria-label={`Trend ${metric.trend.direction}`}
          >
            <TrendIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Trend {metric.trend.direction}</span>
          </span>
        </div>
        <h4 className="mt-2 line-clamp-4 text-base font-semibold leading-snug text-[var(--color-ink)]">
          {metric.title}
        </h4>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--color-parchment)] pt-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Period
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--color-ink)]">
            {metric.latestPeriod ?? "Unknown"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Actual
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--color-ink)]">
            {metric.latestActual ?? "No value"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Notes
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--color-ink)]">
            {narrativeCoverage(metric)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function PerformanceDashboardClient({
  snapshot,
  decisionSuite,
}: PerformanceDashboardClientProps) {
  const [query, setQuery] = useState("");
  const [scorecardId, setScorecardId] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const visibleScorecards = filteredScorecards(
    snapshot.scorecards,
    deferredQuery,
    scorecardId,
  );
  const audienceSections: Array<{
    key: keyof typeof AUDIENCE_LABELS;
    tools: PerformanceDecisionTool[];
  }> = [
    { key: "raymondLee", tools: decisionSuite.raymondLee },
    { key: "dcas", tools: decisionSuite.dcas },
    { key: "cityCouncil", tools: decisionSuite.cityCouncil },
  ];
  const featuredTools = [
    ...decisionSuite.raymondLee.slice(0, 2),
    decisionSuite.dcas[0],
    decisionSuite.cityCouncil[0],
  ].filter((tool): tool is PerformanceDecisionTool => Boolean(tool));

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#f7f3ed_38%,#efe8dc_100%)]">
      <style>{`
        .performance-index-shell {
          width: 100%;
          max-width: 1680px;
          margin-inline: auto;
          padding-inline: 20px;
        }

        .performance-index-hero-grid,
        .performance-index-stat-grid,
        .performance-index-path-grid,
        .performance-index-product-grid,
        .performance-index-tool-grid,
        .performance-index-scorecard-grid {
          display: grid;
        }

        .performance-index-hero-grid {
          gap: 32px;
        }

        .performance-index-stat-grid,
        .performance-index-path-grid,
        .performance-index-product-grid,
        .performance-index-tool-grid,
        .performance-index-scorecard-grid {
          gap: 16px;
        }

        @media (min-width: 640px) {
          .performance-index-shell {
            padding-inline: 32px;
          }

          .performance-index-stat-grid,
          .performance-index-path-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 768px) {
          .performance-index-product-grid,
          .performance-index-scorecard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .performance-index-shell {
            padding-inline: 48px;
          }

          .performance-index-hero-grid {
            grid-template-columns: minmax(0, 1fr) 420px;
            align-items: end;
          }

          .performance-index-stat-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }

          .performance-index-path-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .performance-index-product-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .performance-index-tool-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .performance-index-scorecard-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1536px) {
          .performance-index-shell {
            padding-inline: 64px;
          }

          .performance-index-hero-grid {
            grid-template-columns: minmax(0, 1fr) 440px;
          }

          .performance-index-tool-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .performance-index-scorecard-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_34%),radial-gradient(circle_at_72%_16%,rgba(224,168,112,0.18),transparent_34%),radial-gradient(circle_at_12%_86%,rgba(127,168,142,0.20),transparent_32%)]" />
        <div className="absolute right-[-10%] top-[-30%] h-[560px] w-[560px] rounded-full bg-[var(--color-sage)]/25 blur-[150px]" />
        <div className="absolute bottom-[-35%] left-[-10%] h-[480px] w-[480px] rounded-full bg-[var(--color-ember)]/12 blur-[140px]" />
        <div className="performance-index-shell relative py-10 lg:py-14">
          <div className="performance-dark-eyebrow flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="text-[var(--color-ember-bright)]">Performance Portland Mirror</span>
            <span>Cache: {snapshot.cacheStatus ?? "unknown"}</span>
            <span>Fetched {new Date(snapshot.fetchedAt).toLocaleString()}</span>
          </div>
          <div className="performance-index-hero-grid mt-7">
            <div>
              <h1 className="max-w-5xl font-editorial-normal text-[46px] leading-[0.98] tracking-tight text-white sm:text-[66px] lg:text-[88px]">
                The operating layer above Portland’s official performance data.
              </h1>
              <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed sm:text-lg">
                A public mirror of Performance Portland scorecards, preserving official
                values and narrative notes while adding the missing operating layer for the
                City Administrator, DCAs, and council oversight.
              </p>
            </div>
            <div className="performance-dark-card rounded-sm p-6 backdrop-blur">
              <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.18em]">
                How to use this
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Find the official metric.",
                  "Read the source explanation.",
                  "Use the cockpit pages to ask better management and oversight questions.",
                ].map((copy, index) => (
                  <div key={copy} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-bold text-[var(--color-ember-bright)]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-white/76">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="performance-index-stat-grid mt-8">
            {[
              ["Scorecards", snapshot.counts.scorecards],
              ["Sections", snapshot.counts.containers],
              ["Metric instances", snapshot.counts.metricInstances],
              ["Unique measures", snapshot.counts.uniqueMeasures],
              ["Narrative notes", snapshot.counts.narrativeNotes],
            ].map(([label, value]) => (
              <div key={label} className="performance-dark-card rounded-sm p-4">
                <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.16em]">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="performance-index-path-grid mt-7">
            {[
              {
                label: "If you need to manage",
                title: "City Administrator View",
                href: "/dashboard/performance/city-administrator",
                copy: "Use the cockpit for executive briefs, service-area signals, watchlist items, and Council-ready source packets.",
              },
              {
                label: "If you need to operate",
                title: "Start with DCAs",
                href: "/dashboard/performance/dcas",
                copy: "Use service-area scorecards and the CED operating vertical for work-session prep.",
              },
              {
                label: "If you need to oversee",
                title: "Start with Council",
                href: "/dashboard/performance/council",
                copy: "Use the April 8 priorities, May 7 CEDSA issues, amendment tests, and source packet exports.",
              },
            ].map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="performance-dark-card-strong group rounded-sm p-5 transition-all hover:-translate-y-0.5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                  {path.label}
                </p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h2 className="font-editorial text-3xl leading-tight text-white">
                    {path.title}
                  </h2>
                  <ArrowUpRight className="performance-dark-muted h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <p className="performance-dark-copy mt-3 text-sm leading-relaxed">{path.copy}</p>
              </Link>
            ))}
          </div>

          <div className="performance-index-product-grid mt-6">
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="performance-dark-card group rounded-sm p-4 transition-all hover:-translate-y-0.5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
                  {link.eyebrow}
                </p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h2 className="font-editorial text-2xl leading-tight text-white">
                    {link.title}
                  </h2>
                  <ArrowUpRight className="performance-dark-muted h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <p className="performance-dark-copy mt-3 text-sm leading-relaxed">{link.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="performance-index-shell py-8">
        <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-[0_22px_90px_rgba(15,36,25,0.08)]">
          <div className="grid gap-6 border-b border-[var(--color-parchment)] p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Layers3 className="h-5 w-5 text-[var(--color-canopy)]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                  Decision layer
                </p>
              </div>
              <h2 className="mt-3 font-editorial text-4xl leading-tight text-[var(--color-ink)]">
                Start with the work product, then open the source packet.
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[var(--color-ink-light)]">
                These cockpit cards are the practical bridge between official Performance
                Portland metrics and the decisions staff actually need to prepare: executive
                briefings, service-area delivery reviews, hearing prep, and source-backed
                oversight questions.
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Current cache
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--color-ink)]">
                {snapshot.counts.uniqueMeasures} unique measures
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-light)]">
                {snapshot.counts.narrativeNotes} official narrative notes preserved.
              </p>
            </div>
          </div>

          <div className="performance-index-tool-grid bg-[var(--color-paper-warm)] p-5 sm:p-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] text-white shadow-[0_18px_70px_rgba(15,36,25,0.12)]">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-[var(--color-ember-bright)]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                  Change Log
                </p>
              </div>
              <h2 className="mt-3 font-editorial text-3xl leading-tight text-white">
                What moved since the last Performance Portland sync?
              </h2>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-white/72">
                This becomes the public “what changed?” feed once the sync has at least
                two cached runs. Until then, the export still gives staff the current
                normalized scorecard warehouse.
              </p>
            </div>
            <Link
              href="/api/performance/export"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-semibold text-[var(--color-canopy)]"
            >
              <FileDown className="h-4 w-4" />
              Export CSV
            </Link>
          </div>
          <div className="border-t border-white/12 bg-white/[0.05] p-5 sm:p-6">
            {snapshot.changes.length === 0 ? (
              <div className="rounded-sm border border-dashed border-white/18 bg-white/[0.06] p-4 text-sm leading-relaxed text-white/70">
                No changed values recorded yet. Run the internal performance sync job twice
                to start seeing comparisons.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {snapshot.changes.slice(0, 6).map((change) => (
                  <Link
                    key={`${change.measureId}-${change.changedAt}`}
                    href={`/dashboard/performance/${change.measureId}`}
                    className="block rounded-sm border border-white/14 bg-white/[0.07] p-3 text-sm hover:border-[var(--color-ember-bright)]"
                  >
                    <p className="font-semibold text-white">#{change.measureId}</p>
                    <p className="mt-1 text-white/68">
                      {change.previousActual ?? "none"} → {change.newActual ?? "none"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="performance-index-shell pb-12">
        <div className="sticky top-0 z-10 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)]/95 p-5 shadow-[0_18px_70px_rgba(15,36,25,0.08)] backdrop-blur sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h2 className="font-editorial text-4xl text-[var(--color-ink)]">
                All Scorecards
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-light)]">
                Search every official scorecard, section, and metric. Start with the
                filters if you know the service area; use the search box if you know the
                issue. Each metric detail page gives you the chart, official notes, source
                URLs, and next-step links.
              </p>
              <div className="mt-4 grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] sm:grid-cols-3">
                <span className="rounded-full border border-[var(--color-parchment)] bg-white px-3 py-2">
                  1. Filter service area
                </span>
                <span className="rounded-full border border-[var(--color-parchment)] bg-white px-3 py-2">
                  2. Open metric detail
                </span>
                <span className="rounded-full border border-[var(--color-parchment)] bg-white px-3 py-2">
                  3. Export source packet
                </span>
              </div>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search metrics, IDs, values..."
                className="w-full rounded-sm border border-[var(--color-parchment)] bg-white py-3 pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScorecardId("all")}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                scorecardId === "all"
                  ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                  : "border-[var(--color-parchment)] bg-white text-[var(--color-ink)]"
              }`}
            >
              All scorecards
            </button>
            {snapshot.scorecards.map((scorecard) => (
              <button
                key={scorecard.scorecardId}
                type="button"
                onClick={() => setScorecardId(scorecard.scorecardId)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  scorecardId === scorecard.scorecardId
                    ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                    : "border-[var(--color-parchment)] bg-white text-[var(--color-ink)]"
                }`}
              >
                {scorecard.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {visibleScorecards.map((scorecard) => (
            <section
              key={scorecard.scorecardId}
              className="rounded-sm border border-[var(--color-parchment)] bg-white/75"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-parchment)] p-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                    Scorecard #{scorecard.scorecardId}
                  </p>
                  <h3 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
                    {scorecard.title}
                  </h3>
                </div>
                <Link
                  href={scorecard.officialPath}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-canopy)]"
                >
                  Official page
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-5 p-5">
                {scorecard.containers.map((container) => (
                  <div key={container.containerId}>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-lg font-semibold text-[var(--color-ink)]">
                        {container.title}
                      </h4>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                        {container.metrics.length} metrics
                      </span>
                    </div>
                    <div className="performance-index-scorecard-grid">
                      {container.metrics.map((metric) => (
                        <MetricCard key={`${container.containerId}-${metric.measureId}`} metric={metric} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {audienceSections.map(({ key, tools }) => (
            <div key={key} className="rounded-sm border border-[var(--color-parchment)] bg-white/70 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                {AUDIENCE_LABELS[key]}
              </p>
              <div className="mt-4 space-y-3">
                {tools.map((tool) => (
                  <div key={tool.slug} className="border-l-2 border-[var(--color-ember)]/50 pl-3">
                    <p className="font-semibold text-[var(--color-ink)]">{tool.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {tool.openQuestions[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
