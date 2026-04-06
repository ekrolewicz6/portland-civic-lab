"use client";

import type { BureauAllocation } from "@/data/general-fund-budget";

function formatM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function BudgetWhatIf({
  cutPct,
  onCutChange,
  bureaus,
  totalExpenses,
}: {
  cutPct: number;
  onCutChange: (pct: number) => void;
  bureaus: BureauAllocation[];
  totalExpenses: number;
}) {
  const totalCut = totalExpenses * (cutPct / 100);
  const totalAfter = totalExpenses - totalCut;

  // Aggregate FTE impact from matching scenarios
  const totalFTE = bureaus.reduce((sum, b) => {
    const scenario =
      cutPct >= 10
        ? b.reductionScenarios.find((s) => s.magnitude === "10%")
        : cutPct >= 3
          ? b.reductionScenarios.find((s) => s.magnitude === "3%")
          : null;
    return sum + (scenario?.fteImpact ?? 0);
  }, 0);

  // Count bureaus with documented scenarios
  const bureausWithScenarios = bureaus.filter((b) => {
    if (cutPct >= 10) return b.reductionScenarios.some((s) => s.magnitude === "10%");
    if (cutPct >= 3) return b.reductionScenarios.some((s) => s.magnitude === "3%");
    return false;
  }).length;

  return (
    <div className="space-y-4">
      {/* Slider */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <label className="text-[13px] text-[var(--color-ink-muted)] font-medium">
            General Fund Reduction
          </label>
          <span className="text-[28px] font-mono font-bold text-[var(--color-ink)] leading-none tabular-nums">
            {cutPct}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={cutPct}
          onChange={(e) => onCutChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer touch-none"
          style={{
            background: `linear-gradient(to right, #2563eb ${cutPct * 10}%, #e5e7eb ${cutPct * 10}%)`,
            WebkitAppearance: "none",
            padding: "8px 0",
          }}
        />
        <div className="flex justify-between mt-1 text-[10px] text-[var(--color-ink-muted)] font-mono">
          <span>0%</span>
          <span className="text-amber-600 font-semibold">3% scenario</span>
          <span className="text-red-600 font-semibold">10% scenario</span>
        </div>
      </div>

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
          Showing {cutPct >= 10 ? "10%" : cutPct >= 3 ? "3%" : "preliminary"}{" "}
          reduction scenarios from the Mayor&apos;s budget guidance.{" "}
          {bureausWithScenarios} of {bureaus.length} bureaus have documented
          service impact descriptions. Expand bureaus above to see specific cuts.
        </p>
      )}
    </div>
  );
}
