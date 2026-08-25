import { QUADRANT_POINTS, RING_META } from "@/lib/venues/map";

/**
 * §9.1 as a picture: every asset placed on two axes at once.
 *
 * Vertical: how strong demand is. Horizontal: how well the owner actually
 * understands the economics. The top-left quadrant (strong demand, owner in
 * the dark) is where the biggest dollars and the biggest risks sit, so it
 * gets the warning tint. Placements come from our grades in the ranking
 * table: they are positions, not measurements, and the page says so.
 */

const PAD = { left: 8, right: 4, top: 6, bottom: 12 };
const PLOT = { w: 100 - PAD.left - PAD.right, h: 78 - PAD.top - PAD.bottom };

const px = (x: number) => PAD.left + (x / 100) * PLOT.w;
const py = (y: number) => PAD.top + ((100 - y) / 100) * PLOT.h;

export default function PortfolioQuadrant() {
  const midX = px(50);
  const midY = py(50);
  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
          The whole portfolio on two axes
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          ↑ demand · knows the economics →
        </p>
      </div>

      <div className="px-2 py-3 sm:px-4">
        <svg
          viewBox="0 0 100 78"
          className="h-auto w-full"
          role="img"
          aria-label="Scatter chart placing every venue by demand and by how well the city understands its economics. Moda Center, the Rose Quarter land, and Providence Park sit high on demand but far left, where the owner is in the dark."
        >
          {/* danger quadrant tint: strong demand, owner in the dark */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={midX - PAD.left}
            height={midY - PAD.top}
            fill="var(--color-ember)"
            fillOpacity="0.07"
          />

          {/* frame + midlines */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={PLOT.w}
            height={PLOT.h}
            fill="none"
            stroke="var(--color-parchment)"
            strokeWidth="0.4"
          />
          <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top + PLOT.h} stroke="var(--color-parchment)" strokeWidth="0.35" strokeDasharray="1.4 1.6" />
          <line x1={PAD.left} y1={midY} x2={PAD.left + PLOT.w} y2={midY} stroke="var(--color-parchment)" strokeWidth="0.35" strokeDasharray="1.4 1.6" />

          {/* quadrant captions */}
          <text x={PAD.left + 1.6} y={PAD.top + 3.2} fontSize="2.3" fill="var(--color-clay)" fontFamily="var(--font-mono, monospace)" letterSpacing="0.3">
            STRONG DEMAND, OWNER IN THE DARK
          </text>
          <text x={midX + 1.6} y={PAD.top + 3.2} fontSize="2.3" fill="var(--color-ink-muted)" fillOpacity="0.8" fontFamily="var(--font-mono, monospace)" letterSpacing="0.3">
            STRONG AND UNDERSTOOD
          </text>
          <text x={PAD.left + 1.6} y={PAD.top + PLOT.h - 1.8} fontSize="2.3" fill="var(--color-ink-muted)" fillOpacity="0.8" fontFamily="var(--font-mono, monospace)" letterSpacing="0.3">
            SMALL AND UNEXAMINED
          </text>
          <text x={midX + 1.6} y={PAD.top + PLOT.h - 1.8} fontSize="2.3" fill="var(--color-ink-muted)" fillOpacity="0.8" fontFamily="var(--font-mono, monospace)" letterSpacing="0.3">
            UNDERSTOOD, QUIETER DEMAND
          </text>

          {/* axis captions */}
          <text x={PAD.left + PLOT.w / 2} y={76.5} fontSize="2.4" textAnchor="middle" fill="var(--color-ink-light)" fontFamily="var(--font-mono, monospace)" letterSpacing="0.3">
            HOW WELL THE OWNER KNOWS THE ECONOMICS →
          </text>
          <text
            x={3.2}
            y={PAD.top + PLOT.h / 2}
            fontSize="2.4"
            textAnchor="middle"
            fill="var(--color-ink-light)"
            fontFamily="var(--font-mono, monospace)"
            letterSpacing="0.3"
            transform={`rotate(-90 3.2 ${PAD.top + PLOT.h / 2})`}
          >
            DEMAND →
          </text>

          {/* points */}
          {QUADRANT_POINTS.map((p) => {
            const x = px(p.x);
            const y = py(p.y);
            const anchorRight = p.x > 66;
            return (
              <g key={p.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="1.7"
                  style={{ fill: `var(${RING_META[p.ring].colorVar})` }}
                  stroke="white"
                  strokeWidth="0.35"
                />
                <text
                  x={anchorRight ? x - 2.6 : x + 2.6}
                  y={y + 0.8}
                  fontSize="2.5"
                  textAnchor={anchorRight ? "end" : "start"}
                  fill="var(--color-ink)"
                  fontFamily="var(--font-mono, monospace)"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="border-t border-[var(--color-parchment)] px-5 py-3 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
        The tinted quadrant is the problem this whole page exists to fix: the assets with the most
        demand and the most money at stake are the ones whose economics the owner understands
        least. Placements are drawn from our grades in the table below. They are positions, not
        measurements.
      </p>
    </div>
  );
}
