import { HEADLINE, TREND_ROWS } from "@/lib/libraries/data";

/**
 * The library now has two front doors. A bar-chart read of physical vs.
 * digital circulation across four fiscal years, then the full trend table
 * underneath for anyone who wants every metric.
 */

const CIRC_SERIES: Array<{ label: string; physicalM: number; digitalM: number }> = [
  { label: "FY2019", physicalM: 14.89, digitalM: 3.46 },
  { label: "FY2021", physicalM: 6.95, digitalM: 5.21 },
  { label: "FY2025", physicalM: 10.15, digitalM: 7.37 },
];

const MAX = 22;

export default function HybridTrend() {
  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Physical vs. digital circulation, FY2019–FY2025
          </p>
          <p className="font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
            digital circulation up {HEADLINE.digitalCircGrowthPct}%
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {CIRC_SERIES.map((row) => {
            const total = row.physicalM + row.digitalM;
            const physicalPct = (row.physicalM / MAX) * 100;
            const digitalPct = (row.digitalM / MAX) * 100;
            const digitalShare = Math.round((row.digitalM / total) * 100);
            return (
              <div key={row.label}>
                <div className="flex items-baseline justify-between font-mono text-[11px] text-[var(--color-ink-muted)]">
                  <span className="font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
                    {row.label}
                  </span>
                  <span className="tabular-nums">{digitalShare}% digital</span>
                </div>
                <div className="mt-1.5 flex h-6 w-full overflow-hidden rounded-sm bg-[var(--color-paper-warm)]">
                  <div
                    className="flex items-center justify-end bg-[var(--color-canopy-light)] pr-1.5"
                    style={{ width: `${physicalPct}%` }}
                    title={`Physical: ${row.physicalM}M`}
                  />
                  <div
                    className="flex items-center bg-[var(--color-ember)] pl-1.5"
                    style={{ width: `${digitalPct}%` }}
                    title={`Digital: ${row.digitalM}M`}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10.5px] tabular-nums text-[var(--color-ink-muted)]">
                  <span>{row.physicalM}M physical</span>
                  <span>{row.digitalM}M digital</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex gap-5 border-t border-[var(--color-parchment)] pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-canopy-light)]" /> Physical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-ember)]" /> Digital
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white">
        <table className="w-full min-w-[720px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Metric</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">FY2011</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">FY2019</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">FY2021</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">FY2025</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">Reading the trend</th>
            </tr>
          </thead>
          <tbody>
            {TREND_ROWS.map((r) => (
              <tr key={r.metric} className="border-b border-[var(--color-parchment)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{r.metric}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--color-ink-light)]">{r.fy2011}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--color-ink-light)]">{r.fy2019}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--color-ink-light)]">{r.fy2021}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-[var(--color-ink)]">{r.fy2025}</td>
                <td className="px-4 py-3 text-[12.5px] leading-snug text-[var(--color-ink-muted)]">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-[var(--color-parchment)] px-4 py-3 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
          * FY2011 used older circulation categories; long-run comparisons should be read as directional.
          Source: State Library of Oregon Public Library Statistics. MCL&apos;s current FY2025–26 reporting
          shows 18.1 million checkouts and renewals.
        </p>
      </div>
    </div>
  );
}
