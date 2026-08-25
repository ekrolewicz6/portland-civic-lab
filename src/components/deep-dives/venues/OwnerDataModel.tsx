import type { ReactNode } from "react";
import {
  LEDGERS,
  PORTFOLIO_KPIS,
  DATA_TABLES,
  ANSWERABLE_QUESTIONS,
  RECORDS_PLAN,
} from "@/lib/venues/data";

/**
 * §14–16 — the owner's data system: five ledgers, thirteen KPIs, the seven
 * relational tables, the questions the system unlocks, and the public-records
 * acquisition plan that would let anyone rebuild it from primary sources.
 * Server component; renders inside Section's right column.
 */

function CardEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
      {children}
    </p>
  );
}

export default function OwnerDataModel() {
  const collapsibleGroups = RECORDS_PLAN.slice(0, -1);
  const recipientsGroup = RECORDS_PLAN[RECORDS_PLAN.length - 1];

  return (
    <div className="space-y-5">
      {/* ── (a) The five ledgers ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {LEDGERS.map((ledger) => (
          <div
            key={ledger.name}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
          >
            <h3 className="font-editorial text-[19px] leading-tight text-[var(--color-ink)]">
              {ledger.name}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-[var(--color-ink-muted)]">
              {ledger.holds}
            </p>
            <ul className="mt-3 space-y-1.5 border-t border-[var(--color-parchment)] pt-3">
              {ledger.fields.map((field) => (
                <li
                  key={field}
                  className="flex items-start gap-2 text-[13px] leading-snug text-[var(--color-ink-light)]"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-sage)]"
                  />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── (b) The thirteen KPIs ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>The thirteen numbers that matter</CardEyebrow>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {PORTFOLIO_KPIS.map((kpi) => (
            <span
              key={kpi}
              className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-2.5 py-1 font-mono text-[12px] text-[var(--color-ink)]"
            >
              {kpi}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-snug text-[var(--color-ink-light)]">
          Regional economic impact appears in a separate section — never mixed with owner cash.
        </p>
      </div>

      {/* ── (c) The seven tables ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>One relational model — seven tables</CardEyebrow>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DATA_TABLES.map((t) => (
            <div
              key={t.table}
              className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3.5"
            >
              <p className="font-mono text-[13px] font-semibold text-[var(--color-canopy)]">
                {t.table}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-light)]">{t.row}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-[var(--color-ink-muted)]">
          Linked by asset, event, contract, and operator keys.
        </p>
      </div>

      {/* ── (d) What the system can answer ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>Eight questions today&rsquo;s reports cannot answer</CardEyebrow>
        <ol className="mt-4 space-y-2.5">
          {ANSWERABLE_QUESTIONS.map((question, i) => (
            <li
              key={question}
              className="flex items-start gap-3 text-[13px] leading-snug text-[var(--color-ink)]"
            >
              <span className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ember)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {question}
            </li>
          ))}
        </ol>
      </div>

      {/* ── (e) The public-records acquisition plan ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>The public-records acquisition plan</CardEyebrow>
        <p className="mt-3 text-[13px] leading-snug text-[var(--color-ink-light)]">
          The deepest defensible analysis cannot be completed from published summaries. These
          records, in machine-readable form:
        </p>
        <div className="mt-4 divide-y divide-[var(--color-parchment)] border-y border-[var(--color-parchment)]">
          {collapsibleGroups.map((group) => (
            <details key={group.group} className="group">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-[14px] font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                {group.group}
                <span
                  aria-hidden
                  className="font-mono text-[12px] text-[var(--color-ink-muted)] transition-transform group-open:rotate-90"
                >
                  ▸
                </span>
              </summary>
              <p className="pb-3.5 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                {group.items}
              </p>
            </details>
          ))}
        </div>
        {recipientsGroup ? (
          <div className="mt-4 rounded-sm border border-[var(--color-parchment)] border-l-2 border-l-[var(--color-ember)] bg-[var(--color-paper-warm)] p-4">
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">
              {recipientsGroup.group}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              {recipientsGroup.items}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
