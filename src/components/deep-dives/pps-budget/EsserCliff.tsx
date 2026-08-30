import { ESSER_TIMELINE } from "@/lib/pps-budget/data";

/**
 * Act III: the ESSER cliff, "one-time money in, cuts out."
 *
 * Server component, pure CSS bars. Left: a single tall sage bar for the
 * almost-$115M federal relief award (2020-2024). Right: the cut sequence as
 * ascending clay bars per fiscal year, on the same dollar scale, so the
 * reader sees the cuts climbing toward the size of the money that briefly
 * papered over them. The 2023-24 row has no public gap figure (gapM is
 * null), so it renders as a labeled dashed band, and 2027-28 is projected,
 * so it renders hatched. The committee's spring 2023 warning connects the
 * two sides as a pull-quote.
 */

/** Pixel height of the plot area; the $115M ESSER bar sets the scale. */
const FULL_BAR_PX = 176;
const PLOT_PX = 200;

function barPx(gapM: number): number {
  return Math.round((gapM / ESSER_TIMELINE.esserTotalM) * FULL_BAR_PX);
}

function fmtM(m: number): string {
  return `$${m.toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
}

/** Clay hatch for the projected year, tuned for the paper background. */
const HATCH =
  "repeating-linear-gradient(45deg, rgba(184,92,58,0.75) 0 6px, rgba(184,92,58,0.22) 6px 12px)";

type Cut = (typeof ESSER_TIMELINE.cuts)[number];

function isProjected(c: Cut): boolean {
  return "projected" in c && c.projected === true;
}

function CutColumn({ cut }: { cut: Cut }) {
  const projected = isProjected(cut);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div
        className="flex w-full flex-col items-center justify-end"
        style={{ height: `${PLOT_PX}px` }}
      >
        <span className="mb-1 font-mono text-[10px] font-semibold tabular-nums text-[var(--color-ink-light)]">
          {cut.gapM === null ? "–" : `${fmtM(cut.gapM)}${projected ? "+" : ""}`}
        </span>
        {cut.gapM === null ? (
          <div className="flex h-9 w-full max-w-[56px] items-center justify-center rounded-sm border border-dashed border-[var(--color-clay)]/60">
            <span className="font-mono text-[10px] text-[var(--color-clay)]">?</span>
          </div>
        ) : (
          <div
            className="w-full max-w-[56px] rounded-sm"
            style={{
              height: `${barPx(cut.gapM)}px`,
              backgroundColor: projected ? undefined : "var(--color-clay)",
              backgroundImage: projected ? HATCH : undefined,
            }}
          />
        )}
      </div>
      <span className="mt-1.5 font-mono text-[9px] tabular-nums text-[var(--color-ink-muted)] sm:text-[10px]">
        {cut.fy}
      </span>
    </div>
  );
}

export default function EsserCliff() {
  return (
    <div className="space-y-6">
      {/* ── The two sides of the cliff, one dollar scale ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            One-time money in, cuts out
          </p>
          <span className="font-mono text-[10px] tabular-nums text-[var(--color-ink-muted)]">
            full bar = {fmtM(ESSER_TIMELINE.esserTotalM)}
          </span>
        </div>
        <h3 className="mt-2 font-editorial text-[20px] leading-snug text-[var(--color-ink)]">
          Almost $115 million came in. The cuts are still going out.
        </h3>

        <div className="mt-6 grid grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8">
          {/* Money in: the ESSER award */}
          <div className="border-r border-[var(--color-parchment)] pr-4 sm:pr-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fern)]">
              Money in
            </p>
            <div
              className="mt-3 flex flex-col items-center justify-end"
              style={{ height: `${PLOT_PX}px` }}
            >
              <span className="mb-1 font-mono text-[10px] font-semibold tabular-nums text-[var(--color-ink-light)]">
                {fmtM(ESSER_TIMELINE.esserTotalM)}
              </span>
              <div
                className="w-full max-w-[72px] rounded-sm bg-[var(--color-sage)]"
                style={{ height: `${FULL_BAR_PX}px` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--color-ink-light)]">
              one-time federal relief 2020-2024
            </p>
          </div>

          {/* Cuts out: the ascending sequence */}
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-clay)]">
              Cuts out
            </p>
            <div className="mt-3 flex gap-1 sm:gap-3">
              {ESSER_TIMELINE.cuts.map((cut) => (
                <CutColumn key={cut.fy} cut={cut} />
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--color-parchment)] pt-4">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-sage)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              one-time relief
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-clay)]" />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              budget gap closed by cuts
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm" style={{ backgroundImage: HATCH }} />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">projected</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2 w-3 rounded-sm border border-dashed border-[var(--color-clay)]/60"
            />
            <span className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              no public gap figure
            </span>
          </span>
        </div>
      </div>

      {/* ── The committee saw it coming ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] border-l-[3px] border-l-[var(--color-clay)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          The warning, on the record
        </p>
        <blockquote className="mt-3 font-editorial text-[18px] leading-snug text-[var(--color-ink)] sm:text-[20px]">
          {ESSER_TIMELINE.cliffNote}
        </blockquote>
      </div>

      {/* ── Year by year, what each cut was ── */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="divide-y divide-[var(--color-parchment)]">
          {ESSER_TIMELINE.cuts.map((cut) => (
            <div key={cut.fy} className="flex items-baseline gap-3 px-4 py-3 sm:px-5">
              <span className="w-16 shrink-0 font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                {cut.fy}
              </span>
              <span className="w-14 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-[var(--color-clay)]">
                {cut.gapM === null ? "–" : `${fmtM(cut.gapM)}${isProjected(cut) ? "+" : ""}`}
              </span>
              <span className="min-w-0 text-[13px] leading-snug text-[var(--color-ink-light)]">
                {cut.label}
              </span>
            </div>
          ))}
        </div>
        <p className="border-t border-[var(--color-parchment)] px-4 py-3 font-mono text-[10px] text-[var(--color-ink-muted)] sm:px-5">
          Sources: Tax Supervising and Conservation Commission reviews; PPS Community Budget Review
          Committee, spring 2023 and 2026-27 reports; PPS adopted budget FY2023-24, Vol. 1.
        </p>
      </div>
    </div>
  );
}
