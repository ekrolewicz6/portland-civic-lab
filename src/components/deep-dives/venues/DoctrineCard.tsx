import {
  ANNUAL_QUESTION,
  DOCTRINE_POINTS,
  DOCTRINE_SENTENCE,
  GATES,
} from "@/lib/venues/data";

/**
 * §18–19 — the handable block: the doctrine in one sentence, the ten
 * commitments, the five gates, and the question Portland should answer
 * in public every year. Designed to survive printing: one card, kept
 * whole across page breaks where the browser can manage it.
 */
export default function DoctrineCard() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8 print:break-inside-avoid">
      {/* ── (a) The doctrine, in one sentence ── */}
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
        The doctrine, in one sentence
      </p>
      <blockquote className="mt-4 border-l-2 border-[var(--color-ember)] pl-5 font-editorial text-[24px] leading-tight text-[var(--color-ink)] sm:text-[30px]">
        {DOCTRINE_SENTENCE}
      </blockquote>

      {/* ── (b) Ten commitments ── */}
      <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        Unpacked into ten commitments
      </p>
      <ol className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {DOCTRINE_POINTS.map((point, i) => (
          <li
            key={point}
            className="flex gap-3 text-[14px] leading-snug text-[var(--color-ink-light)]"
          >
            <span className="shrink-0 font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ember)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>

      {/* ── (c) The five gates, one line each ── */}
      <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        Every proposal passes five gates before it is scored
      </p>
      <div className="mt-3 divide-y divide-[var(--color-parchment)] border-t border-[var(--color-parchment)]">
        {GATES.map((gate) => (
          <div key={gate.id} className="flex flex-wrap items-baseline gap-x-2 py-2">
            <span className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ember)]">
              {gate.n}
            </span>
            <span className="text-[13px] font-semibold text-[var(--color-ink)]">
              {gate.title}.
            </span>
            <span className="text-[13px] leading-snug text-[var(--color-ink-light)]">
              {gate.question}
            </span>
          </div>
        ))}
      </div>

      {/* ── (d) The annual question ── */}
      <div className="mt-9 rounded-sm border border-[var(--color-ember)]/50 bg-[var(--color-paper-warm)] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
          The question Portland should answer in public, every year
        </p>
        <p className="mt-2 font-editorial text-[19px] leading-snug text-[var(--color-ink)]">
          {ANNUAL_QUESTION}
        </p>
      </div>
    </div>
  );
}
