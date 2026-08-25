import {
  GOVERNANCE_ROWS,
  HEADLINE,
  MANAGEMENT_GRADES,
  OWNER_QUESTIONS,
} from "@/lib/venues/data";

/**
 * §3: who runs what, and how well the system works as an owner.
 *
 * Server component, light context. Three blocks:
 *  (a) the seven-row governance table (Asset / Owner / Operator / Oversight),
 *  (b) the report card: dimension grades plus the oversized overall "C",
 *  (c) the nine things a first-class owner always knows, with the closer.
 */

const GRADE_CHIP_TONE: Record<"good" | "warn" | "bad", string> = {
  good: "border-[var(--color-fern)] text-[var(--color-fern)]",
  warn: "border-[var(--color-clay)] text-[var(--color-clay)]",
  bad: "border-[var(--color-clay)] text-[var(--color-ember)]",
};

const TABLE_HEADERS = ["Asset", "Owner", "Operator / manager", "City oversight"];

export default function GovernanceGrade() {
  return (
    <div className="space-y-5">
      {/* ── (a) The governance table: stacked cards on phones, table from md up ── */}
      <div className="space-y-3 md:hidden">
        {GOVERNANCE_ROWS.map((row) => (
          <div
            key={row.asset}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-4"
          >
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">{row.asset}</p>
            <dl className="mt-2 space-y-1.5">
              {[
                ["Owner", row.owner],
                ["Operator / manager", row.operator],
                ["City oversight", row.oversight],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                    {label}
                  </dt>
                  <dd className="text-right text-[13px] text-[var(--color-ink-light)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="hidden rounded-sm border border-[var(--color-parchment)] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-parchment)]">
              {GOVERNANCE_ROWS.map((row) => (
                <tr key={row.asset}>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[var(--color-ink)]">
                    {row.asset}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-ink-light)]">
                    {row.owner}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-ink-light)]">
                    {row.operator}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-ink-light)]">
                    {row.oversight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── (b) The report card ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
          The report card
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_230px]">
          <ul className="divide-y divide-[var(--color-parchment)]">
            {MANAGEMENT_GRADES.map((g) => (
              <li
                key={g.dimension}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <span className="text-[14px] text-[var(--color-ink)]">
                  {g.dimension}
                </span>
                <span
                  className={`shrink-0 rounded-sm border bg-white px-2.5 py-0.5 font-mono text-[13px] font-semibold tabular-nums ${GRADE_CHIP_TONE[g.tone]}`}
                >
                  {g.grade}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--color-parchment)] pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Overall
            </p>
            <p className="mt-1 font-editorial text-[64px] leading-none text-[var(--color-clay)]">
              {HEADLINE.ownerGrade}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
              Overall institutional-owner grade: a grade of the system, not a
              claim that individual staff are incompetent.
            </p>
          </div>
        </div>
        <p className="mt-5 border-t border-[var(--color-parchment)] pt-4 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
          <span className="font-semibold text-[var(--color-ink)]">Graded from the public
          record.</span>{" "}
          These grades reflect what the city publishes and what public records show. The city may
          hold internal reporting we could not see. If it exists and surfaces, we will update the
          grades accordingly, and say so.
        </p>
      </div>

      {/* ── (c) What a first-class owner always knows ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
        <h3 className="font-editorial text-[20px] sm:text-[22px] leading-snug text-[var(--color-ink)]">
          What a first-class owner always knows
        </h3>
        <ol className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {OWNER_QUESTIONS.map((q, i) => (
            <li
              key={q}
              className="flex items-baseline gap-3 text-[14px] leading-snug text-[var(--color-ink-light)]"
            >
              <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ember)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {q}
            </li>
          ))}
        </ol>
        <p className="mt-5 border-t border-[var(--color-parchment)] pt-4 text-[13px] font-semibold text-[var(--color-ink)]">
          Portland cannot currently answer all of these from one system.
        </p>
      </div>
    </div>
  );
}
