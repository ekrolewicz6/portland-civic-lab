import { FOUR_ECONOMICS, THREE_CONDITIONS } from "@/lib/venues/data";

/**
 * §4: Four kinds of money, three kinds of "underperforming."
 *
 * Server component. Renders inside the deep-dive Section's right column:
 * (a) the four economics layers as a numbered 2×2 grid, and (b) the three
 * performance conditions whose conflation is the root failure of most
 * venue debates.
 */
export default function FourEconomics() {
  return (
    <div>
      {/* ── (a) The four ledgers ── */}
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        The same sold-out night, four different ledgers.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FOUR_ECONOMICS.map((layer) => (
          <div
            key={layer.n}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
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

      {/* ── (b) The three conditions ── */}
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
