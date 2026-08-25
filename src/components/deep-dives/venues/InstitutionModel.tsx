import type { ReactNode } from "react";
import {
  TEAM_ROLES,
  NOT_INTERNALIZED,
  P5_OPERATING_MODEL,
  FRAGMENTATION_COSTS,
  OPERATOR_INCENTIVES,
  HEADLINE,
} from "@/lib/venues/data";
import { fmtMillions } from "@/lib/venues/engine";

/**
 * §13. The institution the strategy requires: a centralized owner function
 * (the Portfolio Office), what it should never internalize, and the
 * recommended Portland'5 operating model with its anti-fragmentation rule.
 * Server component; renders inside Section's right column.
 */

function CardEyebrow({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "clay";
}) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
        tone === "clay" ? "text-[var(--color-clay)]" : "text-[var(--color-ink-muted)]"
      }`}
    >
      {children}
    </p>
  );
}

function CloudChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-3 py-1 text-[12px] text-[var(--color-ink)]">
      {children}
    </span>
  );
}

export default function InstitutionModel() {
  return (
    <div className="space-y-5">
      {/* ── (a) The concept ── */}
      <blockquote className="rounded-sm border border-[var(--color-parchment)] border-l-2 border-l-[var(--color-ember)] bg-white p-5 sm:p-7">
        <p className="font-editorial text-[20px] leading-[1.35] text-[var(--color-ink)]">
          A centralized Portland Public Venues Portfolio Office that owns the strategy, data,
          contracts, capital plan, and public scorecard, while specialized operators continue
          delivering events.
        </p>
      </blockquote>

      {/* ── (b) The team ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>The owner team: ten roles</CardEyebrow>
        <div className="mt-4 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
          {TEAM_ROLES.map((r) => (
            <div key={r.role}>
              <p className="text-[14px] font-semibold leading-snug text-[var(--color-ink)]">
                {r.role}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
                {r.charge}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── (c) What capacity costs + (d) what stays outsourced ── */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
          <CardEyebrow>What a real owner&apos;s office is worth</CardEyebrow>
          <p className="mt-4 text-[13px] text-[var(--color-ink-light)]">
            1% on a{" "}
            <span className="font-mono font-semibold tabular-nums text-[var(--color-ink)]">
              {fmtMillions(HEADLINE.modaFramework)}
            </span>{" "}
            project =
          </p>
          <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-[var(--color-canopy)]">
            {fmtMillions(HEADLINE.onePercentOfModa)}
          </p>
          <p className="mt-3 text-[12px] leading-snug text-[var(--color-ink-muted)]">
            That is enough to run a strong owner&apos;s office for years; the office itself costs a
            few million dollars a year.
          </p>
        </div>

        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
          <CardEyebrow>What the City should NOT take in-house</CardEyebrow>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {NOT_INTERNALIZED.map((item) => (
              <CloudChip key={item}>{item}</CloudChip>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-snug text-[var(--color-ink-light)]">
            The failure is not outsourcing. It is outsourcing without the right to the data, a way
            to compare operators, a price on every commercial right, real numbers on every event,
            disciplined savings, and teeth to enforce any of it.
          </p>
        </div>
      </div>

      {/* ── (e) The recommended Portland'5 model ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>The recommended Portland&apos;5 model</CardEyebrow>
        <ul className="mt-4 space-y-2.5">
          {P5_OPERATING_MODEL.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink)]"
            >
              <span
                aria-hidden
                className="mt-px font-mono text-[13px] font-bold text-[var(--color-fern)]"
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:p-5">
          <CardEyebrow tone="clay">What splitting five venues apart would duplicate</CardEyebrow>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FRAGMENTATION_COSTS.map((cost) => (
              <span
                key={cost}
                className="rounded-full border border-[var(--color-clay)]/40 bg-white px-3 py-1 text-[12px] text-[var(--color-ink)]"
              >
                {cost}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-snug text-[var(--color-ink-light)]">
            The rule: anyone who wants a separate operator for each venue must show, in numbers,
            that the benefit beats the cost of duplicating these eight functions.
          </p>
        </div>
      </div>

      {/* ── (f) Operator incentives ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <CardEyebrow>Pay operators for this, not for gross revenue alone</CardEyebrow>
        <div className="mt-4 flex flex-wrap gap-2">
          {OPERATOR_INCENTIVES.map((incentive) => (
            <CloudChip key={incentive}>{incentive}</CloudChip>
          ))}
        </div>
      </div>
    </div>
  );
}
