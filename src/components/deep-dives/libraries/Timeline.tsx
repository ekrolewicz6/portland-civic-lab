import { TIMELINE } from "@/lib/libraries/data";

/**
 * 1864–2026, as a single vertical spine. Dense report history compressed to
 * nineteen dated turns, each with the one sentence that matters.
 */
export default function Timeline() {
  return (
    <ol className="relative space-y-7 border-l border-[var(--color-parchment)] pl-6 sm:pl-8">
      {TIMELINE.map((e) => (
        <li key={e.year} className="relative">
          <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-paper)] bg-[var(--color-ember)] sm:-left-[41px]" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
            {e.year}
          </p>
          <h3 className="mt-1 font-editorial text-[19px] leading-snug text-[var(--color-ink)] sm:text-[21px]">
            {e.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
            {e.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
