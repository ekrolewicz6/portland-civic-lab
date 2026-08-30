import type { ReactNode } from "react";
import type { PlanDecision } from "@/lib/pps-budget/plan";
import { RED_TEAM, PLAN_DECISIONS, RECONCILIATION_RULE } from "@/lib/pps-budget/plan";

/**
 * Act V: The Movable Dollar Plan. Renders the red-team credential band
 * (seven hostile reviewers, the objection counts, the persona chips),
 * the ten decision cards with motion, cost/authority meta, the hardest
 * objection and its answer, and closes with the reconciliation rule as
 * a full-width pull line. Dark-section component: renders on the
 * canopy background. Server component.
 */

function DarkEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
      {children}
    </p>
  );
}

/** Mono numeral inside the editorial credential headline. */
function Num({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.88em] font-semibold tabular-nums text-[var(--color-ember-bright)]">
      {children}
    </span>
  );
}

function StatusChip({ status }: { status: PlanDecision["status"] }) {
  const changed = status === "changed";
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
        changed
          ? "border-[var(--color-ember)]/50 bg-[var(--color-ember)]/10 text-[var(--color-ember-bright)]"
          : "border-[var(--color-fern)]/60 bg-[var(--color-fern)]/20 text-[var(--color-sage)]"
      }`}
    >
      {changed ? "changed by the red team" : "defended"}
    </span>
  );
}

function DecisionCard({ d }: { d: PlanDecision }) {
  return (
    <article className="rounded-sm border border-white/15 bg-white/[0.04] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
          {d.id}
        </p>
        <StatusChip status={d.status} />
      </div>

      <h3 className="mt-2.5 font-editorial text-[21px] leading-snug text-white sm:text-[24px]">
        {d.title}
      </h3>

      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-white/80">{d.motion}</p>

      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] tabular-nums text-white/60">
        <span>
          <span className="font-semibold uppercase tracking-[0.14em] text-white/40">Cost </span>
          {d.cost}
        </span>
        <span>
          <span className="font-semibold uppercase tracking-[0.14em] text-white/40">
            Authority{" "}
          </span>
          {d.authority}
        </span>
      </p>

      {/* Two-tone objection / answer block */}
      <div className="mt-5 rounded-sm border border-[var(--color-clay)]/40 bg-[var(--color-clay)]/15 p-4 sm:p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
          The hardest objection · {d.objection.from}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">{d.objection.text}</p>
      </div>

      <div className="mt-4 border-l-2 border-[var(--color-sage)]/60 pl-4 sm:pl-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-sage)]">
          The answer
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">{d.answer}</p>
      </div>
    </article>
  );
}

export default function PlanDecisions() {
  return (
    <div className="space-y-8">
      {/* ── The credential band: built to be attacked ── */}
      <div className="rounded-sm border border-white/15 bg-white/[0.04] p-5 sm:p-7">
        <DarkEyebrow>Built to be attacked</DarkEyebrow>
        <p className="mt-2.5 max-w-3xl font-editorial text-[22px] leading-[1.35] text-white sm:text-[26px]">
          <Num>{RED_TEAM.personas.length}</Num> hostile reviewers,{" "}
          <Num>{RED_TEAM.objections}</Num> objections, <Num>{RED_TEAM.fatal}</Num> fatal to the
          first draft. What follows survived.
        </p>
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-white/60">{RED_TEAM.note}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {RED_TEAM.personas.map((persona) => (
            <span
              key={persona}
              className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[12px] text-white/80"
            >
              {persona}
            </span>
          ))}
        </div>
      </div>

      {/* ── The ten decisions, single column ── */}
      <div className="space-y-6">
        {PLAN_DECISIONS.map((d) => (
          <DecisionCard key={d.id} d={d} />
        ))}
      </div>

      {/* ── The reconciliation rule, full width ── */}
      <div className="border-y border-white/15 py-7 sm:py-9">
        <DarkEyebrow>The reconciliation rule</DarkEyebrow>
        <p className="mt-3 max-w-4xl font-editorial text-[24px] leading-[1.3] text-white sm:text-[30px]">
          {RECONCILIATION_RULE}
        </p>
      </div>

      <p className="font-mono text-[10px] leading-relaxed text-white/40">
        Sources: PPS adopted budget documents and board policies, Oregon Secretary of State audit
        division, PPS Community Budget Review Committee reports, Multnomah County Tax Supervising
        and Conservation Commission
      </p>
    </div>
  );
}
