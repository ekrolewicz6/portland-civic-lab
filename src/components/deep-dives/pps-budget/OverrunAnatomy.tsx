/**
 * Anatomy of an overrun: why PPS construction costs blow past their ballot
 * numbers, using Benson Polytechnic as the documented case. Renders in the
 * waste section directly after the bond ledger.
 *
 *   1. The Benson waterfall: every published estimate 2017-2025, each step
 *      labeled with its cause, from the bond audits (notes/per-year/bonds.md).
 *   2. The causes ranked, including the one auditor-decomposed step and the
 *      union non-answer.
 *   3. The base rate: is this Portland, or everywhere? (Both, precisely.)
 *
 * Research trail: research/pps-budget/notes/bond-overruns-2026-08-30.md.
 * Server component, pure CSS bars.
 */

const BALLOT_M = 202;
const FINAL_M = 421.2;

/** Benson's published estimates, each with its cause. From the bond audits. */
const WATERFALL = [
  {
    total: 202,
    label: "May 2017 · the ballot",
    cause: "What voters saw, ~$100M below the district's own cost model, trimmed with no documented rationale.",
  },
  {
    total: 330,
    label: "June 2019 · first honest re-estimate",
    cause: "The biggest jump, before most construction: the real cost surfacing.",
  },
  {
    total: 357.7,
    label: "January 2020 · the board adds scope",
    cause: "Board-chosen additions: new programs and a swing site.",
  },
  {
    total: 410.2,
    label: "March 2022 · the one step auditors decomposed",
    cause: "$21.2M inflation, $17M scope, $14M arithmetic error, per the audit.",
  },
  {
    total: 421.2,
    label: "February 2025 · estimate at completion",
    cause: "+108% over the ballot. Who pays is now in litigation.",
  },
] as const;

const CAUSES = [
  {
    rank: "1",
    name: "The ballot number itself",
    body: "Pitched ~$100M below the district's own model. Part of the overrun was an underpriced promise.",
  },
  {
    rank: "2",
    name: "Construction inflation",
    body: "The industry index rose ~17% in 2020-23: a sixth of Benson's +108%. Lincoln, same market, finished under budget.",
  },
  {
    rank: "3",
    name: "Added scope",
    body: "Seismic and hazmat surprises, plus programs the board added mid-project. Tens of millions, documented and chosen.",
  },
  {
    rank: "4",
    name: "Plain error",
    body: "A $14M arithmetic mistake the auditors named.",
  },
  {
    rank: "✕",
    name: "Not the teachers union",
    body: "Bond money cannot legally pay teachers, and no audit ties labor agreements to these overruns.",
  },
] as const;

function fmtM(m: number): string {
  return `$${m.toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
}

function Eyebrow({ children, tone = "muted" }: { children: string; tone?: "muted" | "ember" }) {
  return (
    <p
      className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
        tone === "ember" ? "text-[var(--color-ember)]" : "text-[var(--color-ink-muted)]"
      }`}
    >
      {children}
    </p>
  );
}

export default function OverrunAnatomy() {
  return (
    <div className="mt-6 space-y-6">
      {/* ── 1. The Benson waterfall ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Eyebrow>Anatomy of one overrun · Benson Polytechnic</Eyebrow>
          <span className="font-mono text-[10px] tabular-nums text-[var(--color-ink-muted)]">
            full width = {fmtM(FINAL_M)}
          </span>
        </div>
        <h3 className="mt-2 font-editorial text-[20px] leading-snug text-[var(--color-ink)]">
          {"Every estimate the district published, and what caused each jump."}
        </h3>
        <div className="mt-5 space-y-4">
          {WATERFALL.map((step, i) => {
            const prev = i === 0 ? null : WATERFALL[i - 1];
            const delta = prev === null ? null : step.total - prev.total;
            return (
              <div key={step.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
                    {step.label}
                  </p>
                  <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ink)]">
                    {fmtM(step.total)}
                    {delta !== null && (
                      <span className="ml-2 text-[var(--color-clay)]">
                        +{fmtM(delta).slice(1)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-1 h-3.5 w-full overflow-hidden rounded-sm bg-[var(--color-paper-warm)]">
                  <div className="flex h-full">
                    <div
                      className="h-full bg-[var(--color-canopy)]"
                      style={{ width: `${((BALLOT_M / FINAL_M) * 100).toFixed(1)}%` }}
                    />
                    {step.total > BALLOT_M && (
                      <div
                        className="h-full bg-[var(--color-clay)]"
                        style={{
                          width: `${(((step.total - BALLOT_M) / FINAL_M) * 100).toFixed(1)}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
                <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                  {step.cause}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--color-parchment)] pt-3">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-canopy)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              the $202M voters approved
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-clay)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              everything above it
            </span>
          </span>
        </div>
      </div>

      {/* ── 2. The causes, ranked ── */}
      <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
          <Eyebrow tone="ember">So what causes the overruns, and how much each?</Eyebrow>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--color-ink-light)]">No public document breaks the overruns into percentages. That absence is a finding. The record does support a ranking:</p>
        </div>
        <ul className="divide-y divide-[var(--color-parchment)]">
          {CAUSES.map((c) => (
            <li key={c.name} className="flex gap-4 px-5 py-4">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                  c.rank === "✕"
                    ? "bg-[var(--color-paper-warm)] text-[var(--color-ink-muted)]"
                    : "bg-[var(--color-canopy)] text-white"
                }`}
              >
                {c.rank}
              </span>
              <div>
                <p className="text-[14px] font-semibold leading-snug text-[var(--color-ink)]">
                  {c.name}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 3. Is it just Portland? ── */}
      <div className="rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] p-5">
        <Eyebrow tone="ember">Is this a Portland problem?</Eyebrow>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink)]">
          <span className="font-semibold">The direction is universal; the size is not.</span> Nine in ten large public projects overrun, worldwide, for seventy years. Benson&apos;s +108% is several times what the market explains, and the best-documented local cause was a choice: the ballot number.</p>
      </div>
    </div>
  );
}
