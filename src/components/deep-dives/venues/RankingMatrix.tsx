import { RANKING, type RankingRow } from "@/lib/venues/assets";

/**
 * §9.1 — The twelve-asset ranking matrix.
 *
 * Server component. On lg+ it renders as a five-column table; below lg it
 * stacks into one card per asset so no cell ever has to shrink into
 * illegibility. Same data, two physical layouts.
 */

const DIMENSIONS: { label: string; get: (r: RankingRow) => string }[] = [
  { label: "Demand & utilization", get: (r) => r.demand },
  { label: "Owner economics", get: (r) => r.ownerEconomics },
  { label: "Physical condition", get: (r) => r.condition },
];

const HEADERS = [
  "Asset",
  "Demand & utilization",
  "Owner economics",
  "Physical condition",
  "Strategic recommendation",
];

export default function RankingMatrix() {
  return (
    <div>
      {/* ── Desktop: the full matrix ── */}
      <div className="hidden overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white lg:block">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {RANKING.map((row) => (
              <tr key={row.asset} className="align-top">
                <td className="px-4 py-3.5 text-[13px] font-semibold leading-snug text-[var(--color-ink)]">
                  {row.asset}
                </td>
                <td className="px-4 py-3.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
                  {row.demand}
                </td>
                <td className="px-4 py-3.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
                  {row.ownerEconomics}
                </td>
                <td className="px-4 py-3.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
                  {row.condition}
                </td>
                <td className="px-4 py-3.5">
                  <span className="block border-l-2 border-[var(--color-ember)] pl-3 text-[13px] font-semibold leading-snug text-[var(--color-ink)]">
                    {row.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: one card per asset ── */}
      <div className="space-y-4 lg:hidden">
        {RANKING.map((row) => (
          <div
            key={row.asset}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
          >
            <h3 className="font-editorial text-[18px] leading-snug text-[var(--color-ink)]">
              {row.asset}
            </h3>
            <dl className="mt-3 space-y-3">
              {DIMENSIONS.map((d) => (
                <div key={d.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    {d.label}
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                    {d.get(row)}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  Strategic recommendation
                </dt>
                <dd className="mt-1 border-l-2 border-[var(--color-ember)] pl-3 text-[14px] font-semibold leading-snug text-[var(--color-ink)]">
                  {row.recommendation}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
