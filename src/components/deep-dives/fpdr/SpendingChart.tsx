"use client";

import { SPENDING_FY26 } from "@/lib/fpdr/data";

export default function SpendingChart() {
  const total = SPENDING_FY26.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-5">
      {/* Single stacked bar */}
      <div className="flex h-12 w-full overflow-hidden rounded-sm border border-[var(--color-parchment)]">
        {SPENDING_FY26.map((d) => (
          <div
            key={d.key}
            style={{ width: `${(d.amount / total) * 100}%`, backgroundColor: d.color }}
            className="group relative"
            title={`${d.label}: $${d.amount}M`}
          />
        ))}
      </div>

      {/* Legend / rows */}
      <div className="space-y-2.5">
        {SPENDING_FY26.map((d) => (
          <div key={d.key} className="flex items-start gap-3">
            <span
              className="mt-1 h-3 w-3 flex-shrink-0 rounded-[2px]"
              style={{ backgroundColor: d.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-medium text-[var(--color-ink)]">{d.label}</span>
                <span className="font-mono text-[14px] font-semibold text-[var(--color-ink)] tabular-nums whitespace-nowrap">
                  ${d.amount}M
                  <span className="text-[var(--color-ink-muted)] font-normal ml-1.5">
                    {((d.amount / total) * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
              <p className="text-[12px] text-[var(--color-ink-muted)] leading-snug">{d.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
