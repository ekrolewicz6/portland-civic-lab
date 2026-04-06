"use client";

import type { BureauAllocation } from "@/data/general-fund-budget";

function formatM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

type CutLevel = 0 | 3 | 10;

const SCENARIOS: { value: CutLevel; label: string; shortLabel: string; color: string; bgColor: string; borderColor: string }[] = [
  { value: 0, label: "No Cuts", shortLabel: "0%", color: "text-[var(--color-ink)]", bgColor: "bg-[var(--color-paper-warm)]", borderColor: "border-[var(--color-parchment)]" },
  { value: 3, label: "3% Reduction", shortLabel: "3%", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-300" },
  { value: 10, label: "10% Reduction", shortLabel: "10%", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-300" },
];

export default function BudgetWhatIf({
  cutPct,
  onCutChange,
  bureaus,
  totalExpenses,
}: {
  cutPct: CutLevel;
  onCutChange: (pct: CutLevel) => void;
  bureaus: BureauAllocation[];
  totalExpenses: number;
}) {
  const totalCut = totalExpenses * (cutPct / 100);
  const totalAfter = totalExpenses - totalCut;

  // Aggregate FTE impact from matching scenarios
  const totalFTE = bureaus.reduce((sum, b) => {
    const scenario =
      cutPct === 10
        ? b.reductionScenarios.find((s) => s.magnitude === "10%")
        : cutPct === 3
          ? b.reductionScenarios.find((s) => s.magnitude === "3%")
          : null;
    return sum + (scenario?.fteImpact ?? 0);
  }, 0);

  // Count bureaus with documented scenarios
  const bureausWithScenarios = bureaus.filter((b) => {
    if (cutPct === 10) return b.reductionScenarios.some((s) => s.magnitude === "10%");
    if (cutPct === 3) return b.reductionScenarios.some((s) => s.magnitude === "3%");
    return false;
  }).length;

  return (
    <div className="space-y-4">
      {/* Scenario buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {SCENARIOS.map((s) => {
          const isActive = cutPct === s.value;
          return (
            <button
              key={s.value}
              onClick={() => onCutChange(s.value)}
              className={`relative rounded-sm py-3 sm:py-4 px-2 sm:px-4 text-center transition-all border-2 ${
                isActive
                  ? `${s.bgColor} ${s.borderColor} ${s.color} shadow-sm`
                  : "bg-[var(--color-paper-warm)] border-[var(--color-parchment)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink-muted)]/30"
              }`}
            >
              <p className={`text-[20px] sm:text-[26px] font-mono font-bold leading-none tabular-nums ${isActive ? s.color : ""}`}>
                {s.shortLabel}
              </p>
              <p className={`text-[11px] sm:text-[12px] mt-1 font-medium ${isActive ? s.color : "text-[var(--color-ink-muted)]"}`}>
                {s.label}
              </p>
              {isActive && s.value > 0 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-current" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--color-ink-muted)]">
        Mayor Wilson directed all bureaus to prepare these two reduction
        scenarios in November 2025. These are the only levels with documented
        service impacts.
      </p>

      {/* Impact summary */}
      {cutPct > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-red-50 border border-red-200/60 rounded-sm p-2 sm:p-3 text-center">
            <p className="text-[9px] sm:text-[10px] text-red-600 font-semibold uppercase tracking-wider mb-0.5">
              Total Cut
            </p>
            <p className="text-[16px] sm:text-[20px] font-mono font-bold text-red-700 leading-none tabular-nums">
              {formatM(totalCut)}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200/60 rounded-sm p-2 sm:p-3 text-center">
            <p className="text-[9px] sm:text-[10px] text-amber-600 font-semibold uppercase tracking-wider mb-0.5">
              Positions at Risk
            </p>
            <p className="text-[16px] sm:text-[20px] font-mono font-bold text-amber-700 leading-none tabular-nums">
              {totalFTE > 0 ? `${totalFTE}+` : "—"}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200/60 rounded-sm p-2 sm:p-3 text-center">
            <p className="text-[9px] sm:text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-0.5">
              GF After Cuts
            </p>
            <p className="text-[16px] sm:text-[20px] font-mono font-bold text-blue-700 leading-none tabular-nums">
              {formatM(totalAfter)}
            </p>
          </div>
        </div>
      )}

      {cutPct > 0 && (
        <p className="text-[11px] text-[var(--color-ink-muted)] italic">
          Showing the {cutPct}% reduction scenario from the Mayor&apos;s budget
          guidance.{" "}
          {bureausWithScenarios} of {bureaus.length} bureaus have documented
          service impact descriptions. Expand bureaus below to see specific cuts.
        </p>
      )}
    </div>
  );
}
