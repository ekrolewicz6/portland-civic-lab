import { GOVERNANCE_CHAIN, HEADLINE, SOURCES } from "@/lib/libraries/data";

/**
 * Who approves what: the chain of authority from voters through the County
 * Board, MCL administration, and independent audit. Answers the question
 * "who has to say yes" for both money (levy, bond) and policy (fine-free,
 * program cuts, safety rules).
 */
export default function GovernanceApproval() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
            Operating levy
          </p>
          <p className="mt-2 font-mono text-[28px] font-bold tabular-nums text-[var(--color-ink)]">
            ${HEADLINE.levyRate.toFixed(2)}{" "}
            <span className="text-[15px] font-normal text-[var(--color-ink-muted)]">
              of ${HEADLINE.levyCap.toFixed(2)} legal max
            </span>
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
            Per $1,000 assessed value. Set annually by the County Board within the cap voters
            approved in 2012 — raising the cap itself needs another public vote.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
            Capital bond
          </p>
          <p className="mt-2 font-mono text-[28px] font-bold tabular-nums text-[var(--color-ink)]">
            ${HEADLINE.bondAuthorizedM}M
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
            General-obligation bonds, approved by {HEADLINE.bondApprovalPct}% of voters in November
            2020 (~${HEADLINE.bondTotalLowM}–{HEADLINE.bondTotalHighM}M with other sources). Any new
            bond needs a new vote.
          </p>
        </div>
      </div>

      <ol className="relative space-y-6 border-l border-[var(--color-parchment)] pl-6 sm:pl-8">
        {GOVERNANCE_CHAIN.map((step, i) => (
          <li key={step.who} className="relative">
            <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-paper)] bg-[var(--color-canopy)] font-mono text-[11px] font-semibold text-white sm:-left-[41px]">
              {i + 1}
            </span>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
              {step.role}
            </p>
            <h3 className="mt-1 font-editorial text-[20px] leading-snug text-[var(--color-ink)] sm:text-[22px]">
              {step.who}
            </h3>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
              {step.detail}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
              {step.sourceIds.map((sid, j) => {
                const src = SOURCES[sid];
                return (
                  <span key={sid}>
                    {j > 0 ? " · " : ""}
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[var(--color-sage)]/60 underline-offset-2 hover:text-[var(--color-canopy)]"
                    >
                      {src.org}
                    </a>
                  </span>
                );
              })}
            </p>
          </li>
        ))}
      </ol>

      <p className="rounded-sm border-l-[3px] border-l-[var(--color-clay)] bg-[var(--color-paper-warm)] p-4 text-[13px] leading-relaxed text-[var(--color-ink)]">
        The Library District is a legal component unit with its own tax authority — but it has no
        elected board of its own. The County Board of Commissioners governs it directly, and MCL
        operates as a County department. That single-layer structure is why the report proposes a
        formal <strong>annual joint public accountability session</strong>: today, budget, policy,
        and oversight all run through the same five commissioners who also run the rest of the County.
      </p>
    </div>
  );
}
