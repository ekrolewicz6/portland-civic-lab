import { DOCTRINE } from "@/lib/pps-budget/data";

/**
 * §14 (Act V close). The doctrine of the movable dollar, rendered as the
 * page's poster artifact: the whole argument reduced to one sentence, ten
 * commitments, and the question Portland should ask its school district in
 * public every spring.
 *
 * Certificate-style card, sibling to the venue portfolio doctrine card: a
 * double-rule frame (outer parchment rule, inner hairline), a centered mono
 * masthead, the doctrine sentence as the dominant centered element, the ten
 * commitments in two columns with oversized ghost numerals filled down each
 * column, and the annual question as a full-bleed canopy band capping the
 * card. Solid white so it reads the same wherever the page places it, and
 * kept whole across print page breaks where the browser can manage it.
 */
export default function DoctrineCard() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-1.5 print:break-inside-avoid">
      <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)]/70 px-5 pt-7 pb-6 sm:px-9 sm:pt-9 sm:pb-9">
        {/* ── Masthead ── */}
        <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-muted)]">
          <span>Portland Civic Lab</span>
          <span aria-hidden className="text-[var(--color-ember)]">
            ·
          </span>
          <span>PPS Budget Doctrine</span>
          <span aria-hidden className="text-[var(--color-ember)]">
            ·
          </span>
          <span className="tabular-nums">2026</span>
        </p>
        <div
          aria-hidden
          className="mx-auto mt-5 h-1.5 w-1.5 rotate-45 bg-[var(--color-ember)]"
        />

        {/* ── (a) The doctrine, in one sentence ── */}
        <p className="mt-7 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
          The doctrine of the movable dollar
        </p>
        <blockquote className="mx-auto mt-4 max-w-3xl text-center font-editorial text-[22px] leading-[1.25] text-[var(--color-ink)] [text-wrap:balance] sm:text-[27px] xl:text-[30px]">
          {DOCTRINE.sentence}
        </blockquote>

        <div
          aria-hidden
          className="mx-auto mt-9 h-1.5 w-1.5 rotate-45 bg-[var(--color-ember)]"
        />

        {/* ── (b) Ten commitments, ghost-numbered, filled down each column ── */}
        <p className="mt-7 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          Spelled out as ten commitments
        </p>
        <ol className="mt-5 grid gap-x-10 gap-y-4 md:grid-flow-col md:grid-cols-2 md:grid-rows-5">
          {DOCTRINE.commitments.map((commitment, i) => (
            <li key={commitment} className="flex items-start gap-3">
              <span
                aria-hidden
                className="w-9 shrink-0 select-none text-right font-mono text-[24px] font-semibold leading-none tabular-nums text-[var(--color-ember)]/30 sm:w-12 sm:text-[30px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1 text-[14px] leading-snug text-[var(--color-ink-light)]">
                {commitment}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center font-mono text-[10px] leading-relaxed text-[var(--color-ink-muted)]">
          Drawn from PPS adopted budgets and audits, Oregon Secretary of State
          audit findings, and TSCC budget reviews.
        </p>

        {/* ── (c) The annual question, a full-bleed canopy band capping the card ── */}
        <div className="-mx-5 -mb-6 mt-8 border-t border-[var(--color-ember)]/50 bg-[var(--color-canopy)] px-5 py-7 sm:-mx-9 sm:-mb-9 sm:px-10 sm:py-9">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
            The annual question
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center font-editorial text-[20px] italic leading-snug text-white [text-wrap:balance] sm:text-[24px]">
            {DOCTRINE.annualQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}
