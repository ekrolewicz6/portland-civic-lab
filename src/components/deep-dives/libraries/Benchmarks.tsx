import { BENCHMARKS, SOURCES } from "@/lib/libraries/data";

/**
 * Eight practice benchmarks, not a ranking — the report is explicit that no
 * credible global league table exists. Cards, not a table, so each system's
 * one lesson reads on its own.
 */
export default function Benchmarks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {BENCHMARKS.map((b) => (
        <article key={b.city} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            {b.city}
          </p>
          <h3 className="mt-1 font-editorial text-[21px] leading-tight text-[var(--color-ink)]">
            {b.system}
          </h3>
          <p className="mt-2 font-mono text-[11.5px] tabular-nums text-[var(--color-ink-muted)]">{b.stat}</p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">{b.lesson}</p>
          <p className="mt-3 border-t border-[var(--color-parchment)] pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            {b.sourceIds.map((sid, j) => {
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
        </article>
      ))}
    </div>
  );
}
