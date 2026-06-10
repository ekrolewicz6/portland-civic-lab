import Link from "next/link";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  FileWarning,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { PerformanceMetric } from "@/lib/performance/types";

export function PageGuide({
  start,
  importance,
  scrollFor,
  nextHref,
  nextLabel,
}: {
  start: string;
  importance: string;
  scrollFor: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  const steps = [
    {
      number: "01",
      label: "Start",
      title: "Read this first",
      copy: start,
    },
    {
      number: "02",
      label: "Interpret",
      title: "Why it matters",
      copy: importance,
    },
    {
      number: "03",
      label: "Act",
      title: "Scroll for",
      copy: scrollFor,
    },
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-sm border border-white/14 bg-white/[0.06] shadow-[0_24px_90px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {steps.map((step) => (
          <div key={step.number} className="group relative min-h-[190px] p-5 sm:p-6">
            <div className="absolute right-5 top-5 font-mono text-6xl font-bold leading-none text-white/[0.035] transition-colors group-hover:text-white/[0.07]">
              {step.number}
            </div>
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
                {step.label}
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{step.copy}</p>
              {step.number === "03" && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/64">
                  <ArrowDown className="h-3.5 w-3.5 text-[var(--color-ember-bright)]" />
                  Continue down
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {nextHref && nextLabel && (
        <Link
          href={nextHref}
          className="group flex items-center justify-between gap-4 border-t border-white/10 bg-[var(--color-ember)]/14 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ember)]/24 sm:px-6"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-ember-bright)]" />
            {nextLabel}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-canopy)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-4xl font-editorial text-[34px] leading-[1.02] tracking-tight text-[var(--color-ink)] sm:text-[42px]">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-ink-light)]">
        {copy}
      </p>
    </div>
  );
}

function trendIcon(metric: PerformanceMetric): LucideIcon {
  if (metric.trend.direction === "up") return ArrowUpRight;
  if (metric.trend.direction === "down") return ArrowDownRight;
  return ArrowRight;
}

function trendBadgeClass(metric: PerformanceMetric): string {
  if (metric.trend.tone === "positive") {
    return "border-emerald-300 bg-emerald-50 text-emerald-800";
  }
  if (metric.trend.tone === "negative") {
    return "border-red-300 bg-red-50 text-red-800";
  }
  return "border-stone-300 bg-white text-stone-700";
}

export function EvidenceMetricCard({
  metric,
  label,
  emphasis = "neutral",
}: {
  metric: PerformanceMetric;
  label?: string;
  emphasis?: "neutral" | "risk" | "success";
}) {
  const border =
    emphasis === "risk"
      ? "border-red-200 bg-red-50/40"
      : emphasis === "success"
        ? "border-emerald-200 bg-emerald-50/40"
        : "border-[var(--color-parchment)] bg-[var(--color-paper-warm)]";
  const TrendIcon = trendIcon(metric);

  return (
    <Link
      href={`/dashboard/performance/${metric.measureId}`}
      className={`group relative flex min-h-[246px] flex-col overflow-hidden rounded-sm border p-5 shadow-[0_12px_40px_rgba(15,36,25,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sage)] hover:shadow-[0_22px_70px_rgba(15,36,25,0.10)] ${border}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-canopy)] via-[var(--color-sage)] to-[var(--color-ember)] opacity-75" />
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          {label ?? metric.metricType} · {metric.latestPeriod ?? "Unknown period"}
        </p>
        <span className="rounded-full border border-[var(--color-parchment)] bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-ink-muted)]">
          #{metric.measureId}
        </span>
      </div>
      <p className="mt-4 line-clamp-4 text-base font-semibold leading-snug text-[var(--color-ink)]">
        {metric.title}
      </p>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-parchment)]/80 pt-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Latest official value
          </p>
          <p className="mt-1 truncate text-[clamp(26px,1.8vw,34px)] font-bold leading-none tabular-nums text-[var(--color-ink)]">
            {metric.latestActual ?? "No value"}
          </p>
        </div>
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-105 ${trendBadgeClass(metric)}`}
          title={`Trend ${metric.trend.direction}`}
          aria-label={`Trend ${metric.trend.direction}`}
        >
          <TrendIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Trend {metric.trend.direction}</span>
        </span>
      </div>
    </Link>
  );
}

export function EvidenceGap({
  title,
  copy,
  actionHref,
  actionLabel,
}: {
  title: string;
  copy: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-white/70 p-4">
      <div className="flex items-start gap-3">
        <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-ember)]" />
        <div>
          <p className="font-semibold text-[var(--color-ink)]">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-light)]">{copy}</p>
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-canopy)]"
            >
              {actionLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
