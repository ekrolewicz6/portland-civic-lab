"use client";

import type { RevenueSource, ForecastYear } from "@/data/general-fund-budget";
import DualLineChart from "@/components/charts/DualLineChart";

function formatM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const REVENUE_COLORS = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#6b7280",
  "#94a3b8",
];

export default function RevenueBreakdown({
  revenueSources,
  totalRevenue,
  totalExpenses,
  forecast,
}: {
  revenueSources: RevenueSource[];
  totalRevenue: number;
  totalExpenses: number;
  forecast: ForecastYear[];
}) {
  const sorted = [...revenueSources].sort((a, b) => b.amount - a.amount);
  const maxAmount = sorted[0]?.amount ?? 1;

  return (
    <div className="space-y-8">
      {/* Revenue bar breakdown */}
      <div>
        <div className="border border-[var(--color-parchment)] rounded-sm bg-white/50">
          {sorted.map((source, i) => {
            const barWidth = (source.amount / maxAmount) * 100;
            const pctOfTotal = (source.amount / totalRevenue) * 100;
            const color = REVENUE_COLORS[i % REVENUE_COLORS.length];
            return (
              <div
                key={source.name}
                className="py-3 px-4 border-b border-[var(--color-parchment)]/50 last:border-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[14px] text-[var(--color-ink)] font-medium truncate">
                      {source.name}
                    </span>
                  </div>
                  <span className="text-[13px] font-mono text-[var(--color-ink-muted)] flex-shrink-0 tabular-nums">
                    {pctOfTotal.toFixed(0)}%
                  </span>
                  <span className="text-[14px] font-mono font-semibold text-[var(--color-ink)] flex-shrink-0 tabular-nums">
                    {formatM(source.amount)}
                  </span>
                </div>
                <div className="mt-1.5 h-[6px] bg-[var(--color-parchment)]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue vs Expenses comparison */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-4 text-center">
            <p className="text-[10px] text-[var(--color-ink-muted)] font-semibold uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <p className="text-[22px] font-mono font-bold text-[#059669] leading-none tabular-nums">
              {formatM(totalRevenue)}
            </p>
          </div>
          <div className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-4 text-center">
            <p className="text-[10px] text-[var(--color-ink-muted)] font-semibold uppercase tracking-wider mb-1">
              Total Expenses (CSL)
            </p>
            <p className="text-[22px] font-mono font-bold text-[#dc2626] leading-none tabular-nums">
              {formatM(totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* 5-Year Forecast */}
      <div>
        <p className="text-[13px] text-[var(--color-ink-muted)] mb-3">
          Five-year General Fund forecast showing the structural gap between
          revenue and expenses. The gap narrows from {formatM(Math.abs(forecast[0]?.gap ?? 0) * 1_000_000)} in{" "}
          {forecast[0]?.year} to {formatM(Math.abs(forecast[forecast.length - 1]?.gap ?? 0) * 1_000_000)} by{" "}
          {forecast[forecast.length - 1]?.year} — but only if current service
          levels are reduced.
        </p>
        <DualLineChart
          data={forecast.map((f) => ({
            year: f.year,
            revenue: f.revenue,
            expenses: f.expenses,
          }))}
          xKey="year"
          line1Key="revenue"
          line2Key="expenses"
          line1Label="Revenue ($M)"
          line2Label="Expenses ($M)"
          color1="#059669"
          color2="#dc2626"
          height={280}
          valuePrefix="$"
          valueSuffix="M"
        />
      </div>
    </div>
  );
}
