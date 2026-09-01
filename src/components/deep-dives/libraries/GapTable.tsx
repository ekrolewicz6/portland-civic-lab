import { GAP_DOMAINS } from "@/lib/libraries/data";

/**
 * The delta: nine domains, each as a current-state / gap / world-leading-move
 * triptych. This is the report's central diagnostic table, rebuilt as cards
 * so "what's true now" and "what would close it" read as a real comparison
 * rather than a dense grid.
 */
export default function GapTable() {
  return (
    <div className="space-y-4">
      {GAP_DOMAINS.map((d) => (
        <article
          key={d.domain}
          className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white"
        >
          <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-3 sm:px-6">
            <h3 className="font-editorial text-[19px] leading-tight text-[var(--color-ink)] sm:text-[21px]">
              {d.domain}
            </h3>
          </div>
          <div className="grid gap-px bg-[var(--color-parchment)] sm:grid-cols-3">
            <div className="bg-white p-4 sm:p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canopy)]">
                Current assets
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink)]">{d.current}</p>
            </div>
            <div className="bg-white p-4 sm:p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-clay)]">
                Evidence of the gap
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink)]">{d.gap}</p>
            </div>
            <div className="bg-white p-4 sm:p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
                World-leading move
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink)]">{d.move}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
