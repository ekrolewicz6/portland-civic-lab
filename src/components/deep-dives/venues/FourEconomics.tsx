import { FOUR_ECONOMICS, THREE_CONDITIONS } from "@/lib/venues/data";

/**
 * §4: Four kinds of money, three kinds of "underperforming."
 *
 * Server component. Renders inside the deep-dive Section's right column:
 * (a) a schematic figure, "One sold-out night, four ledgers", showing one
 *     night's money fanning into three destinations of very different size,
 * (b) the four economics layers as a numbered 2×2 grid, each carrying the
 *     accent color of its band in the figure, and
 * (c) the three performance conditions whose conflation is the root failure
 *     of most venue debates.
 *
 * Figure geometry lives in a 100×46 viewBox. Bands are sankey-style ribbons;
 * thickness is rhetorical, not measured, and the figure says so twice. All
 * labels are HTML overlays (positioned in percentages of the same box) so
 * they never fall below 10px on a phone.
 */

/** Ledger accent colors: 1 gross (origin), 2 operators, 3 city, 4 region. */
const LEDGER_ACCENT: Record<number, string> = {
  1: "var(--color-canopy)",
  2: "var(--color-clay)",
  3: "var(--color-ember)",
  4: "var(--color-sage)",
};

/** Sankey-style ribbon between two vertical edge spans. */
function ribbon(x0: number, t0: number, b0: number, x1: number, t1: number, b1: number) {
  const c = (x0 + x1) / 2;
  return `M ${x0} ${t0} C ${c} ${t0}, ${c} ${t1}, ${x1} ${t1} L ${x1} ${b1} C ${c} ${b1}, ${c} ${b0}, ${x0} ${b0} Z`;
}

/** A single curved edge, for the dotted borders of the regional band. */
function edge(x0: number, y0: number, x1: number, y1: number) {
  const c = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${c} ${y0}, ${c} ${y1}, ${x1} ${y1}`;
}

/* Figure geometry (viewBox units). Origin ticket spans y 4–26; the three
   bands leave its right edge contiguously and fan out to their nodes. */
const X0 = 23; // right edge of the ticket
const X1 = 96; // left edge of the destination nodes

const FLOWS = [
  {
    n: 2,
    label: "Operators: teams, promoters, concessionaires",
    color: "var(--color-clay)",
    // thick: ~60% of the origin height
    path: ribbon(X0, 4, 17.2, X1, 5, 16),
    node: { y: 4, h: 13 },
    labelTop: "22.8%",
    // the long label needs extra room on phones to stay at two lines
    labelMaxW: "max-w-[56%] sm:max-w-[48%]",
  },
  {
    n: 3,
    label: "The City, as owner",
    color: "var(--color-ember)",
    // thin: ~12%
    path: ribbon(X0, 17.2, 19.8, X1, 21.4, 23.6),
    node: { y: 20.6, h: 3.8 },
    labelTop: "48.9%",
    labelMaxW: "max-w-[48%]",
  },
  {
    n: 4,
    label: "The region: hotels, restaurants, taxes",
    color: "var(--color-sage)",
    // medium, dotted edges: ~28%, indirect money
    path: ribbon(X0, 19.8, 26, X1, 30.4, 35.6),
    node: { y: 29.4, h: 7.2 },
    labelTop: "73%",
    labelMaxW: "max-w-[48%]",
  },
];

function LedgerFigure() {
  return (
    <figure className="mb-8 rounded-sm border border-[var(--color-parchment)] bg-white p-3 sm:p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          One sold-out night, four ledgers.
        </p>
        <span className="inline-flex items-center rounded-full border border-[var(--color-parchment)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Schematic
        </span>
      </div>

      <div className="relative mx-auto max-w-[880px]">
        <svg
          viewBox="0 0 100 46"
          className="block h-auto w-full"
          role="img"
          aria-label="Schematic flow diagram. One sold-out night, drawn as a ticket, splits left to right into three bands of very different thickness: a thick band to operators (teams, promoters, concessionaires), a thin band to the City as owner, and a medium band with dotted edges to the region (hotels, restaurants, taxes). Ledger 1 is everything fans spend that night; the three bands show who actually keeps that money."
        >
          <defs>
            <linearGradient id="fe-band-op">
              <stop offset="0" stopColor="var(--color-clay)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--color-clay)" stopOpacity="0.92" />
            </linearGradient>
            <linearGradient id="fe-band-city">
              <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.65" />
              <stop offset="1" stopColor="var(--color-ember)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="fe-band-region">
              <stop offset="0" stopColor="var(--color-sage)" stopOpacity="0.16" />
              <stop offset="1" stopColor="var(--color-sage)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* bands, thickest first so edges stay crisp where they meet */}
          <path d={FLOWS[0].path} fill="url(#fe-band-op)" />
          <path d={FLOWS[2].path} fill="url(#fe-band-region)" />
          <path
            d={edge(X0, 19.8, X1, 30.4)}
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="0.35"
            strokeDasharray="1 1.4"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          <path
            d={edge(X0, 26, X1, 35.6)}
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="0.35"
            strokeDasharray="1 1.4"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          <path d={FLOWS[1].path} fill="url(#fe-band-city)" />

          {/* origin: the ticket */}
          <rect x="2" y="4" width="21" height="22" rx="0.8" fill="var(--color-canopy)" />
          <line
            x1="19.6"
            y1="5.4"
            x2="19.6"
            y2="24.6"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="0.3"
            strokeDasharray="1 1"
            strokeLinecap="round"
          />
          <circle cx="19.6" cy="4" r="1.1" fill="white" />
          <circle cx="19.6" cy="26" r="1.1" fill="white" />

          {/* destination nodes */}
          {FLOWS.map((f) => (
            <rect
              key={f.n}
              x={X1}
              y={f.node.y}
              width="2.6"
              height={f.node.h}
              rx="0.5"
              fill={f.color}
            />
          ))}
        </svg>

        {/* HTML overlays: labels stay >= 10px on phones, unlike scaled SVG text */}
        <div
          className="absolute flex flex-col items-center justify-center gap-0.5 text-center sm:gap-1"
          style={{ left: "2%", top: "8.7%", width: "17.6%", height: "47.8%" }}
        >
          <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-white/60 sm:text-[9px] sm:tracking-[0.18em]">
            Ledger 1
          </span>
          <span className="font-editorial text-[11px] leading-tight text-white sm:text-[15px] xl:text-[17px]">
            A sold-out night
          </span>
        </div>

        {FLOWS.map((f) => (
          <div
            key={f.n}
            className={`absolute flex ${f.labelMaxW} -translate-y-1/2 items-start gap-1.5 rounded-sm border border-[var(--color-parchment)] bg-white/85 px-1.5 py-1 backdrop-blur-[1px] sm:gap-2 sm:px-2 sm:py-1.5`}
            style={{ top: f.labelTop, right: "5.5%" }}
          >
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-[var(--color-canopy)] font-mono text-[9px] font-bold tabular-nums text-white sm:h-4 sm:w-4 sm:text-[10px]">
              {f.n}
            </span>
            <span className="min-w-0 text-[10px] font-medium leading-[1.3] text-[var(--color-ink)] sm:text-[11px] xl:text-[12px]">
              {f.label}
            </span>
          </div>
        ))}

        <p
          className="absolute rounded-sm bg-white/90 p-1.5 text-[10px] leading-snug text-[var(--color-ink-light)] sm:p-2 sm:text-[12px] sm:leading-normal xl:text-[13px]"
          style={{ left: "2%", top: "60%", maxWidth: "44%" }}
        >
          <span className="font-semibold text-[var(--color-ink)]">
            Ledger 1 is everything fans spend that night:
          </span>{" "}
          tickets, beer, parking, merch. The three ribbons show who actually keeps that money.
        </p>
      </div>

      <figcaption className="mt-3 border-t border-[var(--color-parchment)] pt-3 font-mono text-[10px] leading-relaxed text-[var(--color-ink-muted)]">
        Ribbon widths are illustrative, not measured. These are four different sets of books, and
        the only one Portland publishes is the first: the total spent, which says nothing about
        who kept it.
      </figcaption>
    </figure>
  );
}

export default function FourEconomics() {
  return (
    <div>
      {/* ── (a) the figure ── */}
      <LedgerFigure />

      {/* ── (b) The four ledgers ── */}
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        What each ledger actually measures
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FOUR_ECONOMICS.map((layer) => (
          <div
            key={layer.n}
            className="rounded-sm border border-[var(--color-parchment)] border-t-[3px] bg-white p-5"
            style={{ borderTopColor: LEDGER_ACCENT[layer.n] }}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[var(--color-canopy)] font-mono text-[18px] font-bold tabular-nums text-white">
                {layer.n}
              </span>
              <div className="min-w-0">
                <h3 className="font-editorial text-[20px] leading-snug text-[var(--color-ink)]">
                  {layer.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                  {layer.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── (c) The three conditions ── */}
      <div className="mt-10">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          Three conditions that all get called &ldquo;underperforming&rdquo;
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {THREE_CONDITIONS.map((c) => (
            <div
              key={c.n}
              className="flex flex-col rounded-sm border border-[var(--color-parchment)] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] font-mono text-[14px] font-bold tabular-nums text-[var(--color-canopy)]">
                  {c.n}
                </span>
                <h3 className="font-editorial text-[18px] leading-snug text-[var(--color-ink)]">
                  {c.title}
                </h3>
              </div>
              <p className="mt-3 pb-4 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                {c.body}
              </p>
              <p className="mt-auto border-t border-[var(--color-parchment)] pt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                <span className="font-semibold text-[var(--color-ink)]">Assets here: </span>
                {c.assets}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12px] italic leading-relaxed text-[var(--color-ink-muted)]">
          Conflating these three (treating them as one undifferentiated problem called
          &ldquo;losing money&rdquo;) is how venue debates go wrong. Each condition demands a
          different response: insist on a fair return, price the subsidy explicitly, or question
          the building itself.
        </p>
      </div>
    </div>
  );
}
