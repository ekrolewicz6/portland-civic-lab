import { fmtExact, fmtMoney } from "@/lib/city-budget/types";
import {
  GROSS_TOTAL,
  BEGINNING_BALANCE,
  FUND_TRANSFERS,
  INTERAGENCY,
  EXTERNAL_REVENUE,
  BUREAU_EXPENSE,
  CONTINGENCY,
  ENDING_BALANCE,
  RESERVED_FUTURE,
  DEBT_RESERVES,
  DEBT_SERVICE,
} from "@/lib/city-budget/summary";

/**
 * The bridge from the City's headline number to money that actually moves.
 *
 * The $8.55B figure is real and official, but it counts a dollar again every
 * time it crosses between city funds. Rather than quietly publishing a
 * different number, this shows the arithmetic and where every removed dollar
 * went — including the residual, which is displayed even when it isn't zero.
 */
export default function Reconciliation() {
  const netIn = GROSS_TOTAL - BEGINNING_BALANCE - FUND_TRANSFERS - INTERAGENCY;
  const residualIn = netIn - EXTERNAL_REVENUE;

  const held = CONTINGENCY + ENDING_BALANCE + RESERVED_FUTURE + DEBT_RESERVES;
  const netOut = GROSS_TOTAL - FUND_TRANSFERS - held - INTERAGENCY;
  const spend = BUREAU_EXPENSE + DEBT_SERVICE - INTERAGENCY;
  const residualOut = netOut - spend;

  const rows = [
    { label: "Total city budget, as published", v: GROSS_TOTAL, kind: "start" as const },
    { label: "Carried over from prior years", v: -BEGINNING_BALANCE, note: "not new money" },
    { label: "Transfers between city funds", v: -FUND_TRANSFERS, note: "counted in two funds" },
    { label: "One bureau billing another", v: -INTERAGENCY, note: "counted twice" },
    { label: "New money arriving from outside", v: EXTERNAL_REVENUE, kind: "total" as const },
  ];

  const outRows = [
    { label: "Total city budget, as published", v: GROSS_TOTAL, kind: "start" as const },
    { label: "Transfers between city funds", v: -FUND_TRANSFERS, note: "counted twice" },
    { label: "One bureau billing another", v: -INTERAGENCY, note: "counted twice" },
    { label: "Held, not spent this year", v: -held, note: "contingency, reserves, ending balance" },
    { label: "What bureaus actually spend", v: spend, kind: "total" as const },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Ledger title="Where it comes from" rows={rows} residual={residualIn} gross={GROSS_TOTAL} />
      <Ledger title="Where it goes" rows={outRows} residual={residualOut} gross={GROSS_TOTAL} />
    </div>
  );
}

function Ledger({
  title,
  rows,
  residual,
  gross,
}: {
  title: string;
  rows: { label: string; v: number; note?: string; kind?: "start" | "total" }[];
  residual: number;
  gross: number;
}) {
  const share = Math.abs(residual) / gross;
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
        {title}
      </h3>
      <table className="w-full">
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              className={
                r.kind === "total"
                  ? "border-t-2 border-[var(--color-canopy)]"
                  : r.kind === "start"
                    ? "border-b border-[var(--color-parchment)]"
                    : ""
              }
            >
              <td className="py-2 pr-3 align-top">
                <span
                  className={`block text-[13px] leading-snug ${
                    r.kind ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-light)]"
                  }`}
                >
                  {r.label}
                </span>
                {r.note && (
                  <span className="block text-[11px] text-[var(--color-ink-muted)]">{r.note}</span>
                )}
              </td>
              <td
                className={`whitespace-nowrap py-2 text-right align-top font-mono tabular-nums ${
                  r.kind
                    ? "text-[15px] font-bold text-[var(--color-canopy)]"
                    : "text-[13px] text-[var(--color-clay)]"
                }`}
              >
                {r.v < 0 ? `− ${fmtExact(-r.v)}` : fmtExact(r.v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        className={`mt-3 border-t border-[var(--color-parchment)] pt-3 text-[11px] leading-relaxed ${
          share > 0.0025 ? "text-[var(--color-clay)]" : "text-[var(--color-ink-muted)]"
        }`}
      >
        Unexplained difference: {residual === 0 ? "none" : fmtMoney(Math.abs(residual))}
        {residual !== 0 && ` (${(share * 100).toFixed(3)}% of the total)`}. Shown rather than
        folded into a category.
      </p>
    </div>
  );
}
