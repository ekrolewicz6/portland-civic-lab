import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  FileDown,
  Info,
  MousePointer2,
} from "lucide-react";
import { PERFORMANCE_NOTE_KEYS, type PerformanceMetric } from "@/lib/performance/types";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import { getPerformanceTopicLinks } from "@/lib/performance/topic-links";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface MetricDetailPageProps {
  params: Promise<{ measureId: string }>;
}

function numericValue(value: string | null): number | null {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberFromUnknown(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function recordFromUnknown(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function valueUnit(values: Array<{ raw: string | null }>): "percent" | "dollar" | "number" {
  const joined = values.map((value) => value.raw ?? "").join(" ");
  if (joined.includes("%")) return "percent";
  if (joined.includes("$")) return "dollar";
  return "number";
}

function formatTick(value: number, unit: "percent" | "dollar" | "number"): string {
  if (unit === "percent") return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
  if (unit === "dollar") {
    if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function shortPeriodLabel(label: string): string {
  const fiscal = label.match(/FY\s*(\d{4})\s*-\s*(\d{2})/i);
  if (fiscal) return `FY ${fiscal[2]}`;
  const year = label.match(/\b(20\d{2})\b/);
  if (year) return year[1];
  return label.length > 12 ? label.slice(0, 12) : label;
}

function metricReading(metric: PerformanceMetric): string {
  const why = metric.narratives.why_is_this_important?.text;
  if (why && why.length > 0) return why.split(/(?<=[.!?])\s+/)[0] ?? why;
  if (metric.metricType === "Performance Measure") {
    return "This is an official performance measure, so it should help users judge whether city operations are producing the intended result.";
  }
  return "This official indicator provides context for a policy area, but may not be fully controlled by city government.";
}

function narrativeTitle(key: string): string {
  if (key === "why_is_this_important") return "Why Is This Important?";
  if (key === "what_do_the_numbers_show") return "What Do The Numbers Show?";
  if (key === "how_did_we_arrive") return "How Did We Arrive at These Numbers?";
  return "Where Can I Find More Information?";
}

function splitMetricTitle(title: string): { category: string | null; headline: string } {
  const separator = title.indexOf(":");
  if (separator === -1) return { category: null, headline: title };

  const category = title.slice(0, separator).trim();
  const headline = title.slice(separator + 1).trim();

  if (!category || !headline) return { category: null, headline: title };
  return { category, headline };
}

function trendBadgeClass(metric: PerformanceMetric): string {
  if (metric.trend.tone === "positive") return "border-emerald-300/45 bg-emerald-300/12 text-emerald-50";
  if (metric.trend.tone === "negative") return "border-red-300/45 bg-red-300/12 text-red-50";
  return "border-white/20 bg-white/10 text-white/78";
}

function TrendIcon({ metric }: { metric: PerformanceMetric }) {
  if (metric.trend.direction === "up") return <ArrowUpRight className="h-4 w-4" />;
  if (metric.trend.direction === "down") return <ArrowDownRight className="h-4 w-4" />;
  return <ArrowRight className="h-4 w-4" />;
}

function chartDomain(
  metric: PerformanceMetric,
  numbers: number[],
): { min: number; max: number; usesOfficialScale: boolean } {
  const chartData = recordFromUnknown(metric.chartData);
  const explicitMin = numberFromUnknown(chartData.yMinExplicit);
  const explicitMax = numberFromUnknown(chartData.yMaxExplicit);
  const rawMin = Math.min(...numbers, 0);
  const rawMax = Math.max(...numbers, 1);

  if (explicitMin !== null || explicitMax !== null) {
    const min = explicitMin ?? Math.min(0, rawMin);
    const max = explicitMax ?? Math.max(rawMax, min + 1);

    if (max > min) {
      return {
        min: Math.min(min, rawMin),
        max: Math.max(max, rawMax),
        usesOfficialScale: true,
      };
    }
  }

  const range = rawMax - rawMin || 1;
  const padding = range * 0.12;

  return {
    min: Math.min(0, rawMin - padding),
    max: rawMax + padding,
    usesOfficialScale: false,
  };
}

function chartTicks(min: number, max: number): number[] {
  const range = max - min;

  if (Number.isInteger(min) && Number.isInteger(max) && range > 0 && range <= 8) {
    return Array.from({ length: range + 1 }, (_, index) => min + index);
  }

  return Array.from({ length: 5 }, (_, index) => min + (range / 4) * index);
}

function OfficialValueChart({ metric }: { metric: PerformanceMetric }) {
  const values = metric.values
    .slice()
    .reverse()
    .map((value) => ({
      label: value.timePeriod,
      raw: value.actualValue,
      numeric: numericValue(value.actualValue),
    }))
    .filter((value) => value.numeric !== null)
    .slice(-14);
  const unit = valueUnit(values);
  const rawNumbers = values.map((value) => value.numeric ?? 0);
  const { min, max, usesOfficialScale } = chartDomain(metric, rawNumbers);
  const width = 1180;
  const height = 500;
  const margin = { top: 34, right: 44, bottom: 126, left: 92 };
  const xTickLabelY = height - margin.bottom + 42;
  const axisNoteY = height - 24;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const yTicks = chartTicks(min, max);
  const xFor = (index: number) =>
    margin.left + (values.length === 1 ? plotWidth / 2 : (plotWidth / (values.length - 1)) * index);
  const yFor = (value: number) =>
    margin.top + plotHeight - ((value - min) / (max - min)) * plotHeight;
  const path = values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(value.numeric ?? 0)}`)
    .join(" ");
  const latest = values[values.length - 1];
  const first = values[0];
  const delta =
    latest && first && latest.numeric !== null && first.numeric !== null
      ? latest.numeric - first.numeric
      : null;

  if (values.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-white/70 p-5 text-sm text-[var(--color-ink-muted)]">
        No numeric history is available for a chart. The full raw history is still listed
        below.
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-sm border border-[var(--color-parchment)] bg-white p-4 shadow-[0_18px_60px_rgba(15,36,25,0.06)] sm:p-6">
      <div className="grid gap-5 border-b border-[var(--color-parchment)] pb-5 md:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Latest
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-ink)]">
            {latest?.raw ?? metric.latestActual ?? "No value"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{latest?.label}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            First shown
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-ink)]">{first?.raw ?? "—"}</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{first?.label}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Change shown
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-ink)]">
            {delta === null ? "—" : formatTick(delta, unit)}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Within visible history</p>
        </div>
      </div>

      <div className="mt-6 min-w-0 overflow-x-auto">
        <svg
          role="img"
          aria-label={`Historical values for ${metric.title}`}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[880px]"
        >
          <rect x="0" y="0" width={width} height={height} fill="#fff" />
          {yTicks.map((tick, tickIndex) => {
            const y = yFor(tick);
            return (
              <g key={`${tick}-${tickIndex}`}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={y}
                  y2={y}
                  stroke="#e4ddd1"
                  strokeWidth="1"
                />
                <text
                  x={margin.left - 14}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[var(--color-ink-muted)] font-mono text-[13px]"
                >
                  {formatTick(tick, unit)}
                </text>
              </g>
            );
          })}
          <line
            x1={margin.left}
            x2={margin.left}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="#9c9589"
            strokeWidth="1.2"
          />
          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={height - margin.bottom}
            y2={height - margin.bottom}
            stroke="#9c9589"
            strokeWidth="1.2"
          />
          <path d={path} fill="none" stroke="var(--color-canopy)" strokeWidth="4" />
          {values.map((value, index) => (
            <g key={value.label}>
              <circle
                cx={xFor(index)}
                cy={yFor(value.numeric ?? 0)}
                r={index === values.length - 1 ? 7 : 5}
                fill={index === values.length - 1 ? "var(--color-ember)" : "var(--color-canopy)"}
                stroke="#fff"
                strokeWidth="3"
              />
              <text
                x={xFor(index)}
                y={xTickLabelY}
                textAnchor="end"
                transform={`rotate(-34 ${xFor(index)} ${xTickLabelY})`}
                className="fill-[var(--color-ink-muted)] font-mono text-[12px]"
              >
                {shortPeriodLabel(value.label)}
              </text>
              {(index === 0 || index === values.length - 1) && (
                <text
                  x={xFor(index)}
                  y={yFor(value.numeric ?? 0) - 14}
                  textAnchor={index === 0 ? "start" : "end"}
                  className="fill-[var(--color-ink)] font-mono text-[13px] font-bold"
                >
                  {value.raw}
                </text>
              )}
            </g>
          ))}
          <text
            x={margin.left}
            y={axisNoteY}
            className="fill-[var(--color-ink-muted)] font-mono text-[12px]"
          >
            X-axis: reporting period. Y-axis: official actual value
            {usesOfficialScale ? " on the ClearImpact scale" : ""}.
          </text>
        </svg>
      </div>
    </div>
  );
}

async function findMetric(measureId: string) {
  const snapshot = await getPerformanceSnapshot();
  const metric = snapshot.metrics.find((item) => item.measureId === measureId);
  if (!metric) return { snapshot, metric: null, contexts: [] };

  const contexts = snapshot.scorecards.flatMap((scorecard) =>
    scorecard.containers
      .filter((container) =>
        container.metrics.some((containerMetric) => containerMetric.measureId === measureId),
      )
      .map((container) => ({ scorecard, container })),
  );

  return { snapshot, metric, contexts };
}

export async function generateMetadata({
  params,
}: MetricDetailPageProps): Promise<Metadata> {
  const { measureId } = await params;
  const { metric } = await findMetric(measureId);

  return {
    title: metric
      ? `${metric.title} | Performance Portland Mirror`
      : "Performance Metric | Portland Civic Lab",
    description: metric
      ? `Official Performance Portland metric history and narrative notes for ${metric.title}.`
      : "Official Performance Portland metric detail.",
  };
}

export default async function MetricDetailPage({ params }: MetricDetailPageProps) {
  const { measureId } = await params;
  const { snapshot, metric, contexts } = await findMetric(measureId);

  if (!metric) notFound();
  const topicLinks = getPerformanceTopicLinks(metric);
  const titleParts = splitMetricTitle(metric.title);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#f7f3ed_42%,#efe8dc_100%)]">
      <style>{`
        .performance-detail-shell {
          width: 100%;
          max-width: 1680px;
          margin-inline: auto;
          padding-inline: 20px;
        }

        .performance-detail-hero-grid,
        .performance-detail-body-grid,
        .performance-detail-history-grid {
          display: grid;
        }

        .performance-detail-hero-grid,
        .performance-detail-body-grid {
          gap: 32px;
        }

        .performance-detail-history-grid {
          gap: 24px;
        }

        .performance-detail-rail {
          display: grid;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .performance-detail-shell {
            padding-inline: 32px;
          }
        }

        @media (min-width: 768px) {
          .performance-detail-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .performance-detail-shell {
            padding-inline: 48px;
          }
        }

        @media (min-width: 1280px) {
          .performance-detail-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
            align-items: start;
          }

          .performance-detail-hero-summary {
            margin-top: 24px;
          }

          .performance-detail-body-grid {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 400px);
            align-items: start;
          }

          .performance-detail-rail {
            display: block;
            position: sticky;
            top: 24px;
            align-self: start;
          }

          .performance-detail-rail > * + * {
            margin-top: 20px;
          }
        }

        @media (min-width: 1536px) {
          .performance-detail-shell {
            padding-inline: 64px;
          }

          .performance-detail-hero-grid {
            grid-template-columns: minmax(0, 1fr) 420px;
          }

          .performance-detail-body-grid {
            grid-template-columns: minmax(0, 1fr) 420px;
          }
        }

      `}</style>
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(224,168,112,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="absolute right-[-12%] top-[-45%] h-[520px] w-[520px] rounded-full bg-[var(--color-sage)]/20 blur-[150px]" />
        <div className="absolute bottom-[-40%] left-[-15%] h-[420px] w-[420px] rounded-full bg-[var(--color-ember)]/10 blur-[140px]" />
        <div className="performance-detail-shell relative py-8 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/dashboard/performance"
              className="performance-dark-link inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
            >
              <ArrowLeft className="h-4 w-4" />
              Performance warehouse
            </Link>
            <div className="flex flex-wrap gap-2">
              {[metric.metricType, `Measure #${metric.measureId}`, `Value #${metric.valueId}`].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/18 bg-white/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/72"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="performance-detail-hero-grid mt-8">
            <div>
              {titleParts.category ? (
                <p className="max-w-3xl font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
                  {titleParts.category}
                </p>
              ) : null}
              <h1 className="mt-4 max-w-4xl font-editorial-normal text-[34px] leading-[1.06] tracking-tight text-white sm:text-[48px] lg:text-[58px]">
                {titleParts.headline}
              </h1>
              <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed sm:text-lg">
                A complete source packet for this Performance Portland measure: current value,
                official scale, history, narrative notes, context, and links.
              </p>
            </div>

            <aside className="performance-detail-hero-summary performance-dark-card-strong overflow-hidden rounded-sm p-0">
              <div className="p-5">
              <p className="performance-dark-eyebrow font-mono text-[10px] uppercase tracking-[0.18em]">
                Latest official value
              </p>
              <p className="mt-3 break-words text-6xl font-bold leading-none tabular-nums text-white">
                {metric.latestActual ?? "No value"}
              </p>
              <div className="mt-5 grid gap-3 border-t border-white/16 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="performance-dark-muted text-xs font-semibold uppercase tracking-[0.12em]">
                    Period
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {metric.latestPeriod ?? "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="performance-dark-muted text-xs font-semibold uppercase tracking-[0.12em]">
                    Current trend
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${trendBadgeClass(metric)}`}
                  >
                    <TrendIcon metric={metric} />
                    {metric.trend.direction}
                  </span>
                </div>
              </div>
              </div>
              <Link
                href={`/api/performance/export?measureId=${metric.measureId}`}
                className="group flex items-center justify-between gap-3 border-t border-white/12 bg-white/[0.06] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.10]"
              >
                Export this source packet
                <FileDown className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </aside>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3 xl:gap-4">
            {[
              {
                step: "1",
                title: "Start with value",
                copy: "Use the latest official value and current trend as the first read.",
              },
              {
                step: "2",
                title: "Check why it matters",
                copy: metricReading(metric),
              },
              {
                step: "3",
                title: "Use the source packet",
                copy: "Continue to the chart, official notes, topic links, source URLs, and full history table.",
              },
            ].map((card) => (
              <div key={card.step} className="performance-dark-card rounded-sm p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-ember-bright)]/45 bg-[var(--color-ember)]/15 font-mono text-xs font-bold text-[var(--color-ember-bright)]">
                    {card.step}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold leading-tight text-white">
                      {card.title}
                    </h2>
                    <p className="performance-dark-copy mt-2 text-sm leading-relaxed">
                      {card.copy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="performance-detail-shell performance-detail-body-grid py-8">
        <div className="min-w-0 space-y-6">
          <div className="min-w-0 rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6 2xl:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                  History
                </p>
                <h2 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
                  Official values
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-ink-light)]">
                  This chart uses the official actual values cached from ClearImpact. The
                  latest point is highlighted; the table below preserves every raw row.
                </p>
              </div>
              <Link
                href={`/api/performance/export?measureId=${metric.measureId}`}
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-4 py-2 text-sm font-semibold text-white"
              >
                <FileDown className="h-4 w-4" />
                Export source packet
              </Link>
            </div>
            <div className="performance-detail-history-grid mt-6 min-w-0">
              <div className="min-w-0">
                <OfficialValueChart metric={metric} />
              </div>
              <div className="min-w-0 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                <div className="border-b border-[var(--color-parchment)] px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    Full source history
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-ink-light)]">
                    Every cached ClearImpact row for this measure.
                  </p>
                </div>
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full min-w-[380px] border-collapse text-sm">
                    <thead className="sticky top-0 bg-[var(--color-paper-warm)]">
                      <tr className="border-b border-[var(--color-parchment)] text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                        <th className="py-3 pl-4 pr-3">Period</th>
                        <th className="py-3 pr-3">Actual</th>
                        <th className="py-3 pr-3">Target</th>
                        <th className="py-3 pr-4">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metric.values.map((value) => (
                        <tr
                          key={`${value.timePeriod}-${value.sortOrder}`}
                          className="border-b border-[var(--color-parchment)]/70 last:border-b-0"
                        >
                          <td className="py-3 pl-4 pr-3 font-semibold text-[var(--color-ink)]">
                            {value.timePeriod}
                          </td>
                          <td className="py-3 pr-3 text-[var(--color-ink)]">
                            {value.actualValue ?? "—"}
                          </td>
                          <td className="py-3 pr-3 text-[var(--color-ink-light)]">
                            {value.targetValue ?? "—"}
                          </td>
                          <td className="py-3 pr-4 text-[var(--color-ink-light)]">
                            {value.currentTrendDirection ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_18px_60px_rgba(15,36,25,0.05)] sm:p-6 2xl:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              Narrative Tabs
            </p>
            <h2 className="mt-2 font-editorial text-3xl text-[var(--color-ink)]">
              Official Performance Portland notes
            </h2>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {PERFORMANCE_NOTE_KEYS.map((key) => {
                const narrative = metric.narratives[key];
                return (
                  <article key={key} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 shadow-[0_10px_35px_rgba(15,36,25,0.035)]">
                    <h3 className="font-semibold text-[var(--color-ink)]">
                      {narrative?.title ?? narrativeTitle(key)}
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink-light)]">
                      {narrative?.text || "No narrative text is currently available for this tab."}
                    </p>
                    {narrative && narrative.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {narrative.links.map((link) => (
                          <Link
                            key={`${link.href}-${link.text}`}
                            href={link.href}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-canopy)]"
                          >
                            {link.text || "Source"}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="performance-detail-rail">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] p-5 text-white shadow-[0_18px_70px_rgba(15,36,25,0.14)] xl:p-6">
            <div className="flex items-center gap-3">
              <MousePointer2 className="h-4 w-4 text-[var(--color-ember-bright)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                Use This Page
              </p>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/76">
              <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                1. Confirm the latest official value and direction.
              </p>
              <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                2. Read the official explanation tabs before interpreting the metric.
              </p>
              <p className="border-l-2 border-[var(--color-ember)]/70 pl-3">
                3. Use topic links and source URLs to decide what to do next.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-5 xl:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              Context
            </p>
            <div className="mt-4 space-y-3">
              {contexts.map(({ scorecard, container }) => (
                <div key={`${scorecard.scorecardId}-${container.containerId}`} className="border-l-2 border-[var(--color-ember)]/50 pl-3">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {scorecard.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-light)]">{container.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 xl:p-6">
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-[var(--color-canopy)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Source Facts
              </p>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-[var(--color-ink)]">Cached at</dt>
                <dd className="text-[var(--color-ink-light)]">
                  {new Date(snapshot.fetchedAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-ink)]">Narrative coverage</dt>
                <dd className="text-[var(--color-ink-light)]">
                  {Object.keys(metric.narratives).length} of 4 official tabs
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-ink)]">History rows</dt>
                <dd className="text-[var(--color-ink-light)]">{metric.values.length}</dd>
              </div>
            </dl>
          </div>

          {topicLinks.length > 0 && (
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-5 xl:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Civic Lab Topic Links
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
                These links are Civic Lab interpretation: they show where this official
                metric can strengthen an existing topic dashboard.
              </p>
              <div className="mt-4 space-y-2">
                {topicLinks.map((link) => (
                  <Link
                    key={link.slug}
                    href={link.href}
                    className="block rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 hover:border-[var(--color-sage)]"
                  >
                    <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--color-ink)]">
                      {link.title}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--color-ink-light)]">
                      {link.rationale}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white/75 p-5 xl:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              Links
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
              Public links go to human-readable source pages. Machine-readable feeds are
              kept internal for refresh and audit workflows.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href={metric.sourceUrl}
                className="flex items-center justify-between gap-3 rounded-sm border border-[var(--color-parchment)] px-3 py-2 text-sm font-semibold text-[var(--color-ink)]"
              >
                ClearImpact measure
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
