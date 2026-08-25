import { PERIMETER } from "@/lib/venues/data";

/**
 * §2: the perimeter of the portfolio, drawn as three rings.
 *
 * Server component. Renders inside a light Section body: three bordered
 * cluster cards, one per ring, each listing its venues as chips with the
 * ring's oversight line above and its qualifying note below. The ring-3
 * note carries the Metro exclusion (Convention Center / Expo are Metro
 * assets, not City holdings). It renders as a footnote, not a caption,
 * so it reads as part of the definition of the perimeter.
 */
export default function PortfolioMap() {
  return (
    <div className="space-y-4">
      {PERIMETER.map((ring, i) => (
        <div
          key={ring.id}
          className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6"
        >
          {/* Ring header */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Ring {i + 1}
            </p>
            <p className="font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
              {ring.venues.length} {ring.venues.length === 1 ? "venue" : "venues"}
            </p>
          </div>
          <h3 className="mt-1.5 font-editorial text-[20px] sm:text-[22px] leading-snug text-[var(--color-ink)]">
            {ring.title}
          </h3>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            {ring.oversight}
          </p>

          {/* Venue chips */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {ring.venues.map((venue) => (
              <li
                key={venue}
                className="rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1.5 text-[13px] text-[var(--color-ink)]"
              >
                {venue}
              </li>
            ))}
          </ul>

          {/* Footnote: for ring 3 this carries the Metro exclusion */}
          {ring.note ? (
            <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              {ring.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
