import { PERIMETER } from "@/lib/venues/data";
import {
  BRIDGE_PATHS,
  COLUMBIA_PATH,
  MAP_VIEWBOX,
  RING_META,
  TIER_RADIUS,
  VENUE_POINTS,
  WILLAMETTE_PATH,
} from "@/lib/venues/map";

/**
 * §2: the portfolio, drawn on the city.
 *
 * The map is the argument: the dots cover the whole town. An abstracted
 * Portland (rivers, bridges, hand-placed venue points on their real
 * relative geography) rendered as inline SVG, followed by the three-ring
 * inventory. Full venue names show inside the map from sm up; on phones
 * the numbered key below the map does that work.
 */

const plot = {
  x: (x: number) => x,
  y: (y: number) => y,
};

export default function PortfolioMap() {
  return (
    <div className="space-y-6">
      {/* ── The map ── */}
      <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The city, dotted with what you own
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {(Object.keys(RING_META) as Array<keyof typeof RING_META>).map((ring) => (
              <span key={ring} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `var(${RING_META[ring].colorVar})` }}
                />
                {RING_META[ring].label}
              </span>
            ))}
          </div>
        </div>

        <div className="px-2 py-3 sm:px-4">
          <svg
            viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`}
            className="h-auto w-full"
            role="img"
            aria-label="Map of Portland showing every publicly owned venue: the arenas at the Rose Quarter, the stadium and theaters downtown, the raceway at the north edge, and neighborhood venues across the east and southwest"
          >
            {/* ground */}
            <rect x="0" y="0" width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h} fill="var(--color-paper-warm)" />

            {/* rivers */}
            <path d={COLUMBIA_PATH} fill="none" stroke="var(--color-canopy)" strokeOpacity="0.28" strokeWidth="3.2" strokeLinecap="round" />
            <path d={WILLAMETTE_PATH} fill="none" stroke="var(--color-canopy)" strokeOpacity="0.28" strokeWidth="2.6" strokeLinecap="round" />
            {BRIDGE_PATHS.map((d) => (
              <path key={d} d={d} fill="none" stroke="var(--color-ink-muted)" strokeOpacity="0.5" strokeWidth="0.35" />
            ))}

            {/* river names */}
            <text x="80" y="4.4" fontSize="2.1" fill="var(--color-ink-muted)" fillOpacity="0.75" fontFamily="var(--font-mono, monospace)" letterSpacing="0.4">
              COLUMBIA RIVER
            </text>
            <text x="52.5" y="90" fontSize="2.1" fill="var(--color-ink-muted)" fillOpacity="0.75" fontFamily="var(--font-mono, monospace)" letterSpacing="0.4">
              WILLAMETTE
            </text>

            {/* compass */}
            <text x="95.5" y="14" fontSize="3" fill="var(--color-ink-muted)" fontFamily="var(--font-mono, monospace)" textAnchor="middle">
              N
            </text>
            <path d="M 95.5 15.5 L 95.5 19" stroke="var(--color-ink-muted)" strokeWidth="0.3" />
            <path d="M 95.5 15.2 L 94.6 17 L 96.4 17 Z" fill="var(--color-ink-muted)" />

            {/* venues */}
            {VENUE_POINTS.map((v, i) => {
              const r = TIER_RADIUS[v.tier];
              const labelX = v.side === "left" ? v.x - r - 1.2 : v.x + r + 1.2;
              const anchor = v.side === "left" ? "end" : "start";
              return (
                <g key={v.id}>
                  <circle
                    cx={plot.x(v.x)}
                    cy={plot.y(v.y)}
                    r={r}
                    style={{ fill: `var(${RING_META[v.ring].colorVar})` }}
                    stroke="white"
                    strokeWidth="0.35"
                  />
                  {/* full name from sm up */}
                  <text
                    x={labelX}
                    y={v.y + 0.8}
                    fontSize="2.4"
                    textAnchor={anchor}
                    className="max-sm:hidden"
                    fill="var(--color-ink)"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {v.short}
                  </text>
                  {/* numeral on phones */}
                  <text
                    x={labelX}
                    y={v.y + 0.9}
                    fontSize="2.6"
                    textAnchor={anchor}
                    className="sm:hidden"
                    fill="var(--color-ink-light)"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* numbered key: the phone's label layer, and everyone's index */}
        <div className="border-t border-[var(--color-parchment)] px-5 py-4">
          <ol className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {VENUE_POINTS.map((v, i) => (
              <li key={v.id} className="flex items-baseline gap-2 text-[12.5px] leading-snug text-[var(--color-ink)]">
                <span className="w-4 shrink-0 text-right font-mono text-[10px] tabular-nums text-[var(--color-ink-muted)]">
                  {i + 1}
                </span>
                <span
                  className="mt-[1px] h-1.5 w-1.5 shrink-0 self-center rounded-full"
                  style={{ background: `var(${RING_META[v.ring].colorVar})` }}
                />
                <span>
                  {v.name}
                  {v.note ? (
                    <span className="text-[var(--color-ink-muted)]"> · {v.note}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-[var(--color-parchment)] pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Dots sized by venue scale · positions schematic, geography real
          </p>
        </div>
      </div>

      {/* ── The three rings ── */}
      {PERIMETER.map((ring, i) => (
        <div
          key={ring.id}
          className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6"
        >
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
