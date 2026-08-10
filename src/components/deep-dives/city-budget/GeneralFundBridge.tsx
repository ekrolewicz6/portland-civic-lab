import { dataset } from "@/lib/city-budget/data.server";
import { fmtExact } from "@/lib/city-budget/types";

/**
 * Three different "General Fund" numbers appear on this page, and without this
 * they look like a contradiction:
 *
 *   $1,186,002,037  everything flowing through the fund
 *     $805,259,687  revenue from outside the City (what the City calls
 *                   "discretionary resources", published as ~$803.4M)
 *     $660,223,055  what program pages actually tag as General Fund
 *                   discretionary
 *
 * All three are correct. They differ by internal money arriving from other
 * funds, and by costs paid at fund level before a program sees a dollar.
 */
export default function GeneralFundBridge() {
  const gf = dataset.funds.find((f) => f.name === "General Fund");
  if (!gf) return null;

  const CUR = 3;
  const at = (v: (number | null)[]) => v[CUR] ?? 0;
  const rev = (label: string) => at(gf.revenues.find((r) => r.label === label)?.values ?? []);
  const exp = (label: string) => at(gf.expenses.find((r) => r.label === label)?.values ?? []);

  const total = at(gf.expenseGrandTotal);
  const transfersIn = rev("Fund Transfers - Revenue");
  const interagency = rev("Interagency Revenue");
  const beginning = rev("Beginning Fund Balance");
  const internal = transfersIn + interagency + beginning;
  const external = total - internal;

  const transfersOut = exp("Fund Transfers - Expense");
  const contingency = exp("Contingency");
  const debt = exp("Debt Service");
  const fundLevel = transfersOut + contingency + debt;

  const toPrograms = dataset.programs.reduce(
    (s, p) =>
      s +
      p.funding
        .filter((f) => f.gfSplit === "discretionary")
        .reduce((t, f) => t + (f.values[CUR] ?? 0), 0),
    0,
  );

  const steps = [
    {
      v: total,
      label: "Everything flowing through the General Fund",
      note: "The fund's total requirements, which is the figure you'll find on its page in the budget book.",
      kind: "start" as const,
    },
    {
      v: -beginning,
      label: "Left over from last year",
      note: "Carry-over, not new money.",
    },
    {
      v: -transfersIn,
      label: "Transferred in from other city funds",
      note: "Already counted once in the fund it came from.",
    },
    {
      v: -interagency,
      label: "Other bureaus paying the General Fund for services",
      note: "Internal billing, counted on both sides.",
    },
    {
      v: external,
      label: "Revenue from outside the City",
      note: "Property tax, business licence tax, permits, lodging tax. This is what the City calls discretionary resources — it publishes it as about $803 million.",
      kind: "total" as const,
    },
    {
      v: -fundLevel,
      label: "Spent before any program sees it",
      note: "Debt service, contingency, and transfers out to other funds.",
    },
    {
      v: toPrograms,
      label: "Reaches programs as General Fund discretionary",
      note: "The figure the program pages actually tag. This is the money in the second column above.",
      kind: "total" as const,
    },
  ];

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
        Why the General Fund has three different sizes
      </h3>
      <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
        The General Fund appears on this page as {fmtExact(total)}, as about $803 million, and as{" "}
        {fmtExact(toPrograms)}. Those aren&apos;t competing claims — they are the same fund measured
        at three points on its way to a program.
      </p>

      <table className="mt-5 w-full">
        <tbody>
          {steps.map((s) => (
            <tr
              key={s.label}
              className={
                s.kind === "total"
                  ? "border-t-2 border-[var(--color-canopy)]"
                  : s.kind === "start"
                    ? "border-b border-[var(--color-parchment)]"
                    : ""
              }
            >
              <td className="py-2.5 pr-4 align-top">
                <span
                  className={`block text-[13.5px] leading-snug ${
                    s.kind
                      ? "font-semibold text-[var(--color-ink)]"
                      : "text-[var(--color-ink-light)]"
                  }`}
                >
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                  {s.note}
                </span>
              </td>
              <td
                className={`whitespace-nowrap py-2.5 text-right align-top font-mono tabular-nums ${
                  s.kind
                    ? "text-[15px] font-bold text-[var(--color-canopy)]"
                    : "text-[13px] text-[var(--color-clay)]"
                }`}
              >
                {s.v < 0 ? `− ${fmtExact(-s.v)}` : fmtExact(s.v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        The remaining gap between outside revenue and what reaches programs is General Fund
        overhead — central services charged back to bureaus, which the budget book tracks as its own
        line so it can be netted out. It nets to exactly zero citywide, which is one of the checks
        in the method section.
      </p>
    </div>
  );
}
