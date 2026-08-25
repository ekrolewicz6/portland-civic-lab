import type { ReactNode } from "react";
import {
  CAPITAL_EXPOSURES,
  DANGER_SCENARIO,
  DISCIPLINE_PRINCIPLES,
  HEADLINE,
} from "@/lib/venues/data";
import type { CapitalExposure } from "@/lib/venues/data";
import { fmtMillions } from "@/lib/venues/engine";

/**
 * §8.1: every identified capital exposure on one shared dollar scale,
 * drawn so that what is committed, what is framework, what is a range,
 * and what is simply unknown each *look* different. Dark-section
 * component: renders on the canopy background.
 *
 * The one thing this chart must not let a reader do is add the bars.
 * The overlap map below it exists to make that impossible to miss.
 */

/** Shared scale: the full Moda framework is the widest bar. */
const MAX_SCALE = HEADLINE.modaFramework; // $573M

/** Framework split segments, in data order: State / County / City. */
const SEGMENT_COLORS = [
  "var(--color-fern)",
  "var(--color-sage)",
  "var(--color-ember)",
];

/** Clay hatch for the uncertain zone of a range (low → high). */
const HATCH =
  "repeating-linear-gradient(45deg, rgba(184,92,58,0.85) 0 6px, rgba(184,92,58,0.28) 6px 12px)";

function pct(value: number): string {
  return `${((value / MAX_SCALE) * 100).toFixed(2)}%`;
}

function amountLabel(e: CapitalExposure): string {
  if (e.kind === "unknown") return "–";
  if (e.kind === "range") {
    const low = e.low ?? 0;
    return `${low === 0 ? "$0" : fmtMillions(low)}–${fmtMillions(e.high ?? 0)}`;
  }
  return fmtMillions(e.high ?? 0);
}

function ExposureBar({ e }: { e: CapitalExposure }) {
  if (e.kind === "unknown") {
    return (
      <div className="flex h-5 w-full items-center justify-center rounded-sm border border-dashed border-white/40">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          ? unknown
        </span>
      </div>
    );
  }

  const high = e.high ?? 0;
  const low = e.low ?? 0;

  return (
    <div className="relative h-5 w-full overflow-hidden rounded-sm bg-white/8">
      {e.kind === "committed" && (
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-fern)]"
          style={{ width: pct(high) }}
        />
      )}
      {e.kind === "framework" && e.split && (
        <div className="absolute inset-y-0 left-0 flex" style={{ width: pct(high) }}>
          {e.split.map((seg, i) => (
            <div
              key={seg.label}
              style={{
                width: `${((seg.amount / high) * 100).toFixed(2)}%`,
                backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
              }}
            />
          ))}
        </div>
      )}
      {e.kind === "range" && (
        <>
          {low > 0 && (
            <div
              className="absolute inset-y-0 left-0 bg-[var(--color-clay)]"
              style={{ width: pct(low) }}
            />
          )}
          <div
            className="absolute inset-y-0"
            style={{
              left: pct(low),
              width: pct(high - low),
              backgroundImage: HATCH,
            }}
          />
        </>
      )}
    </div>
  );
}

function ExposureRow({ e }: { e: CapitalExposure }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-[14px] font-semibold leading-snug text-white">{e.label}</span>
        <span className="font-mono text-[13px] font-semibold tabular-nums text-white/90">
          {amountLabel(e)}
        </span>
      </div>
      <p className="mt-0.5 max-w-2xl text-[12px] leading-snug text-white/60">{e.qualification}</p>
      {e.kind === "framework" && e.split && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {e.split.map((seg, i) => (
            <span key={seg.label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
              <span className="font-mono text-[10px] tabular-nums text-white/70">
                {seg.label} {fmtMillions(seg.amount)}
              </span>
            </span>
          ))}
        </div>
      )}
      <div className="mt-1.5">
        <ExposureBar e={e} />
      </div>
    </div>
  );
}

function DarkEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
      {children}
    </p>
  );
}

export default function CapitalCliff() {
  return (
    <div className="space-y-8">
      {/* ── The bars, one shared scale ── */}
      <div className="rounded-sm border border-white/12 bg-white/[0.06] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <DarkEyebrow>Every identified exposure, one scale</DarkEyebrow>
          <span className="font-mono text-[10px] tabular-nums text-white/50">
            full width = {fmtMillions(MAX_SCALE)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-fern)]" />
            <span className="font-mono text-[10px] text-white/60">committed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm bg-[var(--color-clay)]" />
            <span className="font-mono text-[10px] text-white/60">range floor</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm" style={{ backgroundImage: HATCH }} />
            <span className="font-mono text-[10px] text-white/60">range ceiling</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3 rounded-sm border border-dashed border-white/40" />
            <span className="font-mono text-[10px] text-white/60">no public figure</span>
          </span>
        </div>
        <div className="mt-6 space-y-6">
          {CAPITAL_EXPOSURES.map((e) => (
            <ExposureRow key={e.id} e={e} />
          ))}
        </div>
      </div>

      {/* ── Overlap map: the figures that must not be added ── */}
      <div>
        <DarkEyebrow>The overlap map: figures that must not be added</DarkEyebrow>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-sm border border-white/12 bg-white/[0.06] p-4">
            <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ember-bright)]">
              01
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
              {"PSU ↔ Keller: one replaces the other. Never stack the $447–449M and a full Keller rebuild"}
            </p>
          </div>
          <div className="rounded-sm border border-white/12 bg-white/[0.06] p-4">
            <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ember-bright)]">
              02
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
              {"The three Portland'5 ranges are the SAME buildings across different horizons, never additive"}
            </p>
          </div>
          <div className="rounded-sm border border-white/12 bg-white/[0.06] p-4">
            <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ember-bright)]">
              03
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
              {"Part of Moda's $288.6M eligible program may be venue-fee-funded, not unrestricted City cash"}
            </p>
          </div>
        </div>
      </div>

      {/* ── The danger scenario ── */}
      <div className="rounded-sm border border-white/12 bg-white/[0.06] p-5 sm:p-6">
        <h3 className="font-editorial text-[20px] leading-snug text-white">
          The most dangerous scenario: additive accumulation
        </h3>
        <ol className="mt-4 space-y-2.5">
          {DANGER_SCENARIO.map((item, i) => (
            <li key={item} className="flex gap-3 text-[14px] leading-snug text-white/80">
              <span className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-ember-bright)]">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 border-t border-white/12 pt-4 text-[13.5px] leading-relaxed text-white/70">
          Every project can be defended individually. The portfolio may still be unable to afford
          the combination.
        </p>
      </div>

      {/* ── Discipline principles ── */}
      <div>
        <DarkEyebrow>Five discipline principles</DarkEyebrow>
        <ul className="mt-3 space-y-2">
          {DISCIPLINE_PRINCIPLES.map((p) => (
            <li key={p} className="flex gap-2.5 text-[14px] font-bold leading-snug text-white">
              <span aria-hidden className="text-[var(--color-ember-bright)]">
                ▸
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer stat line ── */}
      <p className="border-t border-white/12 pt-5 text-[13.5px] leading-relaxed text-white/70">
        A capital-allocation problem measured in the high hundreds of millions, potentially
        exceeding $1 billion across overlapping choices. These figures must not be mechanically
        added.
      </p>
    </div>
  );
}
