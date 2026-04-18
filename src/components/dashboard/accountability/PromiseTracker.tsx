"use client";

import { useEffect, useState } from "react";
import {
  Target,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------- Types ---------- */

interface Promise {
  promiseId: number;
  speaker: string;
  speech: string;
  speechDate: string;
  category: string;
  claimText: string;
  isDirectQuote: boolean;
  claimType: string;
  verificationStatus: string;
  verificationNotes: string | null;
  verifiedBy: string | null;
  metricTarget: string | null;
  metricActual: string | null;
  metricUnit: string | null;
  metricDirection: string | null;
  baselineValue: string | null;
  baselineDate: string | null;
  targetDate: string | null;
  dataSourceTable: string | null;
  dataSourceQuery: string | null;
  dataSourceName: string | null;
  dataNeeded: string | null;
  displayOrder: number;
}

interface PromisesPayload {
  promises: Promise[];
  summary: Record<string, number>;
  byCategory: Record<string, number>;
  source: string;
  lastUpdated: string;
  dataStatus: string;
}

/* ---------- Constants ---------- */

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  verified: { label: "VERIFIED", color: "#3d7a5a", icon: ShieldCheck },
  partially_verified: { label: "PARTIAL", color: "#2d4a6e", icon: AlertTriangle },
  in_progress: { label: "IN PROGRESS", color: "#c8956c", icon: Clock },
  unverifiable: { label: "NO DATA", color: "#9ca3af", icon: HelpCircle },
  contradicted: { label: "DISCREPANCY", color: "#b85c3a", icon: XCircle },
};

const CATEGORIES = [
  "homelessness",
  "safety",
  "economy",
  "budget",
  "infrastructure",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  homelessness: "Homelessness",
  safety: "Safety",
  economy: "Economy",
  budget: "Budget",
  infrastructure: "Infrastructure",
};

/* ---------- Sub-components ---------- */

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unverifiable;
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide whitespace-nowrap"
      style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function MetricComparison({
  target,
  actual,
  unit,
}: {
  target: string;
  actual: string;
  unit: string | null;
}) {
  const suffix = unit ? ` ${unit}` : "";
  return (
    <div className="mt-3 flex items-center gap-3 text-[12px] font-mono">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />
        <span className="text-[var(--color-ink-muted)]">
          Claimed: {target}{suffix}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#3d7a5a]" />
        <span className="text-[var(--color-ink)]">
          Actual: {actual}{suffix}
        </span>
      </div>
    </div>
  );
}

function ProgressIndicator({
  baseline,
  target,
  targetDate,
}: {
  baseline: string;
  target: string;
  targetDate: string;
}) {
  const baseNum = parseFloat(baseline);
  const targetNum = parseFloat(target);
  const range = Math.abs(targetNum - baseNum);
  const pct = range > 0 ? Math.min(100, Math.max(0, ((targetNum - baseNum) / range) * 50 + 50)) : 50;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)] mb-1">
        <span className="font-mono">Baseline: {baseline}</span>
        <span className="font-mono">Target: {target} by {targetDate}</span>
      </div>
      <div className="h-1.5 bg-[var(--color-parchment)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "#c8956c" }}
        />
      </div>
    </div>
  );
}

function PromiseCard({ promise }: { promise: Promise }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const cfg = STATUS_CONFIG[promise.verificationStatus] ?? STATUS_CONFIG.unverifiable;

  return (
    <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm relative overflow-hidden">
      {/* Top color bar */}
      <div
        className="h-[3px]"
        style={{ backgroundColor: cfg.color }}
      />

      <div className="p-5">
        {/* Header row: category + status badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
            {CATEGORY_LABELS[promise.category] ?? promise.category}
          </span>
          <StatusBadge status={promise.verificationStatus} />
        </div>

        {/* Claim text */}
        <div
          className="border-l-2 pl-3 mb-3"
          style={{ borderColor: `${cfg.color}40` }}
        >
          <p
            className={`text-[13px] leading-relaxed text-[var(--color-ink)] ${
              promise.isDirectQuote ? "italic" : ""
            }`}
          >
            {promise.isDirectQuote ? `"${promise.claimText}"` : promise.claimText}
          </p>
        </div>

        {/* Source */}
        <p className="text-[11px] text-[var(--color-ink-muted)] mb-1">
          {promise.speech}, {promise.speechDate ? new Date(promise.speechDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
        </p>

        {/* Metric comparison */}
        {promise.metricTarget && promise.metricActual && (
          <MetricComparison
            target={promise.metricTarget}
            actual={promise.metricActual}
            unit={promise.metricUnit}
          />
        )}

        {/* Progress bar */}
        {promise.baselineValue && promise.targetDate && promise.metricTarget && (
          <ProgressIndicator
            baseline={promise.baselineValue}
            target={promise.metricTarget}
            targetDate={promise.targetDate}
          />
        )}

        {/* Data needed callout */}
        {promise.dataNeeded && (
          <div className="mt-3 flex items-start gap-2 bg-[var(--color-parchment)]/30 border border-[var(--color-parchment)] rounded-sm px-3 py-2">
            <HelpCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--color-ink-muted)]" />
            <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
              <span className="font-semibold">Data needed:</span> {promise.dataNeeded}
            </p>
          </div>
        )}

        {/* Verification notes (collapsible) */}
        {promise.verificationNotes && (
          <div className="mt-3">
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              {notesOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              Verification notes
            </button>
            {notesOpen && (
              <p className="mt-1.5 text-[12px] text-[var(--color-ink-light)] leading-relaxed pl-5">
                {promise.verificationNotes}
              </p>
            )}
          </div>
        )}

        {/* Data source attribution */}
        {promise.dataSourceName && (
          <p className="mt-2 text-[10px] font-mono text-[var(--color-ink-muted)]/60 uppercase tracking-wider">
            Source: {promise.dataSourceName}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function PromiseTracker() {
  const [data, setData] = useState<PromisesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/accountability/promises")
      .then((r) => r.json())
      .then((d: PromisesPayload) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-3 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[var(--color-parchment)]/50 rounded-sm h-16 w-28" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--color-parchment)]/50 rounded-sm h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.dataStatus === "unavailable") {
    return (
      <p className="text-[var(--color-ink-muted)] text-[13px]">
        Unable to load promise tracker data.
      </p>
    );
  }

  const { promises, summary } = data;

  const filteredPromises = activeCategory
    ? promises.filter((p) => p.category === activeCategory)
    : promises;

  const statusOrder = [
    "verified",
    "partially_verified",
    "in_progress",
    "unverifiable",
    "contradicted",
  ];

  return (
    <div className="space-y-5">
      {/* Summary stat bar */}
      <div className="flex flex-wrap gap-2.5">
        {statusOrder.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const count = summary[status] ?? 0;
          return (
            <div
              key={status}
              className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm px-4 py-2.5 flex items-center gap-2.5 min-w-[120px]"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <div>
                <p className="text-[16px] font-semibold font-mono text-[var(--color-ink)]">
                  {count}
                </p>
                <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider">
                  {cfg.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-colors ${
            activeCategory === null
              ? "bg-[#8a5c6a] text-white border-[#8a5c6a]"
              : "bg-transparent text-[var(--color-ink-muted)] border-[var(--color-parchment)] hover:border-[#8a5c6a]/40"
          }`}
        >
          All ({promises.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = data.byCategory[cat] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-colors ${
                activeCategory === cat
                  ? "bg-[#8a5c6a] text-white border-[#8a5c6a]"
                  : "bg-transparent text-[var(--color-ink-muted)] border-[var(--color-parchment)] hover:border-[#8a5c6a]/40"
              }`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Promise cards grid */}
      {filteredPromises.length === 0 ? (
        <p className="text-[13px] text-[var(--color-ink-muted)] py-8 text-center">
          No claims in this category.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPromises.map((p) => (
            <PromiseCard key={p.promiseId} promise={p} />
          ))}
        </div>
      )}

      {/* Footer attribution */}
      <p className="text-[10px] font-mono text-[var(--color-ink-muted)]/50 uppercase tracking-wider text-right">
        {data.source} &middot; Updated {data.lastUpdated}
      </p>
    </div>
  );
}
