"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { BureauAllocation } from "@/data/general-fund-budget";

const CATEGORY_COLORS: Record<string, string> = {
  "public-safety": "#2563eb",
  "community-dev": "#059669",
  operations: "#6b7280",
  "public-works": "#d97706",
  elected: "#7c3aed",
  transfers: "#94a3b8",
  other: "#94a3b8",
};

const CATEGORY_LABELS: Record<string, string> = {
  "public-safety": "Public Safety",
  "community-dev": "Community & Economic Dev",
  operations: "City Operations",
  "public-works": "Public Works",
  elected: "Elected Officials",
  transfers: "Transfers",
  other: "Other",
};

function formatM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function BureauRow({
  bureau,
  maxAmount,
  cutPct,
}: {
  bureau: BureauAllocation;
  maxAmount: number;
  cutPct: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[bureau.category] ?? "#94a3b8";
  const barWidth = (bureau.total / maxAmount) * 100;
  const cutAmount = bureau.total * (cutPct / 100);
  const afterCut = bureau.total - cutAmount;

  // Find the applicable reduction scenario text
  const scenario =
    cutPct >= 10
      ? bureau.reductionScenarios.find((s) => s.magnitude === "10%")
      : cutPct >= 3
        ? bureau.reductionScenarios.find((s) => s.magnitude === "3%")
        : bureau.reductionScenarios.find((s) => s.magnitude === "CSL");

  const hasContent = bureau.programs.length > 0 || (cutPct > 0 && scenario);

  return (
    <div className="border-b border-[var(--color-parchment)]/50 last:border-0">
      <button
        onClick={() => hasContent && setExpanded(!expanded)}
        className={`w-full text-left py-3 px-1 transition-colors group ${hasContent ? "hover:bg-[var(--color-parchment)]/30 cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-center gap-3">
          {hasContent ? (
            expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--color-ink-muted)] flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-ink-muted)] flex-shrink-0" />
            )
          ) : (
            <span className="w-3.5 flex-shrink-0" />
          )}
          <span
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[14px] text-[var(--color-ink)] font-medium flex-1 min-w-0 truncate">
            {bureau.name}
          </span>
          <span className="text-[14px] font-mono font-semibold text-[var(--color-ink)] flex-shrink-0 tabular-nums">
            {cutPct > 0 ? formatM(afterCut) : formatM(bureau.total)}
          </span>
          {cutPct > 0 && (
            <span className="text-[12px] font-mono text-red-600 flex-shrink-0 tabular-nums">
              −{formatM(cutAmount)}
            </span>
          )}
        </div>
        <div className="mt-1.5 ml-10">
          <div className="h-[6px] bg-[var(--color-parchment)]/60 rounded-full overflow-hidden">
            {cutPct > 0 ? (
              <div className="h-full flex">
                <div
                  className="h-full rounded-l-full transition-all duration-300"
                  style={{
                    width: `${barWidth * (1 - cutPct / 100)}%`,
                    backgroundColor: color,
                  }}
                />
                <div
                  className="h-full rounded-r-full transition-all duration-300"
                  style={{
                    width: `${barWidth * (cutPct / 100)}%`,
                    backgroundColor: "#ef4444",
                    opacity: 0.4,
                  }}
                />
              </div>
            ) : (
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: color,
                }}
              />
            )}
          </div>
        </div>
      </button>

      {/* Expanded: programs + reduction scenario */}
      {expanded && hasContent && (
        <div className="pl-12 pr-2 pb-4 space-y-3">
          {/* Programs */}
          {bureau.programs.length > 0 && (
            <div className="space-y-1">
              {bureau.programs
                .filter((p) => p.amount > 0)
                .sort((a, b) => b.amount - a.amount)
                .map((prog) => {
                  const progBarWidth = (prog.amount / bureau.total) * 100;
                  const yoyChange =
                    prog.priorYear && prog.priorYear > 0
                      ? ((prog.amount - prog.priorYear) / prog.priorYear) * 100
                      : undefined;
                  return (
                    <div key={prog.name} className="py-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[var(--color-ink-muted)] truncate flex-1">
                          {prog.name}
                        </span>
                        <span className="text-[12px] font-mono text-[var(--color-ink-muted)] tabular-nums flex-shrink-0">
                          {formatM(prog.amount)}
                        </span>
                        {yoyChange !== undefined && (
                          <span
                            className={`text-[11px] font-mono flex-shrink-0 ${
                              yoyChange > 0
                                ? "text-green-700"
                                : yoyChange < 0
                                  ? "text-red-600"
                                  : "text-[var(--color-ink-muted)]"
                            }`}
                          >
                            {yoyChange > 0 ? "+" : ""}
                            {yoyChange.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 h-[3px] bg-[var(--color-parchment)]/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progBarWidth}%`,
                            backgroundColor: color,
                            opacity: 0.5,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Reduction scenario detail */}
          {cutPct > 0 && scenario && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200/60 rounded-sm">
              <p className="text-[11px] font-semibold text-red-700 uppercase tracking-wider mb-1">
                {scenario.magnitude} Scenario: {scenario.title}
              </p>
              <p className="text-[12px] text-red-900/80 leading-relaxed mb-1.5">
                {scenario.description}
              </p>
              <p className="text-[12px] text-red-800 font-medium leading-relaxed">
                <span className="font-semibold">Impact:</span>{" "}
                {scenario.serviceImpact}
              </p>
              {scenario.fteImpact && (
                <p className="text-[11px] text-red-700 mt-1 font-mono">
                  {scenario.fteImpact} positions eliminated
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BureauBreakdown({
  bureaus,
  cutPct = 0,
}: {
  bureaus: BureauAllocation[];
  cutPct?: number;
}) {
  const sorted = [...bureaus].sort((a, b) => b.total - a.total);
  const maxAmount = sorted[0]?.total ?? 1;

  // Category totals
  const categoryTotals = bureaus.reduce(
    (acc, b) => {
      const cat = b.category;
      acc[cat] = (acc[cat] ?? 0) + b.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalGF = bureaus.reduce((s, b) => s + b.total, 0);

  return (
    <div>
      {/* Category legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
        {Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .map(([cat, total]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: CATEGORY_COLORS[cat] ?? "#94a3b8" }}
              />
              <span className="text-[11px] text-[var(--color-ink-muted)]">
                {CATEGORY_LABELS[cat] ?? cat}{" "}
                <span className="font-mono font-medium">
                  {formatM(total)} ({((total / totalGF) * 100).toFixed(0)}%)
                </span>
              </span>
            </div>
          ))}
      </div>

      {/* Bureau rows */}
      <div className="border border-[var(--color-parchment)] rounded-sm bg-white/50">
        {sorted.map((b) => (
          <BureauRow
            key={b.code}
            bureau={b}
            maxAmount={maxAmount}
            cutPct={cutPct}
          />
        ))}
      </div>
    </div>
  );
}
