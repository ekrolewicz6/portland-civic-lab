/**
 * Mass Timber deep-dive calculation engine.
 *
 * Three models power the interactive pieces, all drawn from the briefing's
 * own numbers (which are MODELED estimates — see data.ts for the assumptions):
 *
 *  1. utilization()  — the central insight. A factory is a fixed-cost machine,
 *     so the cost per home depends on how full the line runs. Below a break-even
 *     it costs MORE than building on site; only when it's full does it cost less.
 *
 *  2. housingScale() — "how much housing, at what cost." Scales the report's
 *     5,000-unit / $1.7B / $550M-public illustration to any number of units.
 *
 *  3. projectFit()   — "what is it best for." A simple scorer for whether mass
 *     timber suits a given building (light-frame wins low-rise; mass timber's
 *     edge is large, repetitive mid-rise in high-labor markets).
 */

// ── Utilization cost model ────────────────────────────────────────
// Default inputs from the briefing's corrected utilization model.

export const UTIL = {
  /** Conventional site-built all-in cost per home. */
  conventionalAllIn: 423_000,
  /** Modular marginal (per-unit variable) cost — materials incl. timber premium,
   *  factory labor, transport, on-site assembly, soft/financing. Excludes fixed cost. */
  modularMarginal: 355_000,
  /** Annual fixed cost of running the factory (overhead that only amortizes when full). */
  fixedAnnual: 18_000_000,
  /** The Portland (Zaugg / Terminal 2) factory's planned annual capacity. */
  capacity: 700,
  /** Margin a viable business needs on top of cost to compete at the conventional price. */
  viabilityMargin: 0.08,
} as const;

/** Homes/year at which modular cost equals site-built cost (cost parity). */
export const PARITY_HOMES = Math.round(
  UTIL.fixedAnnual / (UTIL.conventionalAllIn - UTIL.modularMarginal)
); // ≈ 265

/** Homes/year at which modular both matches the price AND earns a sustaining margin. */
export const VIABLE_HOMES = Math.round(
  UTIL.fixedAnnual / (UTIL.conventionalAllIn / (1 + UTIL.viabilityMargin) - UTIL.modularMarginal)
); // ≈ 490

export type Zone = "failure" | "parity" | "viable";

export interface UtilResult {
  homes: number;
  utilizationPct: number;
  costPerHome: number;
  /** Dollar difference per home vs site-built (positive = more expensive). */
  deltaVsConventional: number;
  /** Same, as a fraction of the conventional cost. */
  pctVsConventional: number;
  zone: Zone;
}

export function utilization(homes: number): UtilResult {
  const h = Math.max(1, homes);
  const costPerHome = UTIL.modularMarginal + UTIL.fixedAnnual / h;
  const delta = costPerHome - UTIL.conventionalAllIn;
  const zone: Zone =
    homes < PARITY_HOMES ? "failure" : homes < VIABLE_HOMES ? "parity" : "viable";
  return {
    homes,
    utilizationPct: homes / UTIL.capacity,
    costPerHome,
    deltaVsConventional: delta,
    pctVsConventional: delta / UTIL.conventionalAllIn,
    zone,
  };
}

/** Cost-per-home curve for the chart, across a range of annual output. */
export function utilizationCurve(): { homes: number; modular: number; siteBuilt: number }[] {
  const rows: { homes: number; modular: number; siteBuilt: number }[] = [];
  for (let h = 60; h <= UTIL.capacity; h += 10) {
    rows.push({
      homes: h,
      modular: Math.round(UTIL.modularMarginal + UTIL.fixedAnnual / h),
      siteBuilt: UTIL.conventionalAllIn,
    });
  }
  return rows;
}

// ── Housing-scale model ───────────────────────────────────────────
// From the briefing's 5,000-unit illustration: ~$340k/unit all-in,
// public share ≈ a third (~$550M), LIHTC the largest single source (~$765M).

export const SCALE = {
  perUnitAllIn: 340_000,
  publicPerUnit: 110_000, // ~$550M / 5,000
  lihtcPerUnit: 153_000, // ~$765M / 5,000
  /** LIHTC allocation pace caps how fast units can be built (units/year, low–high). */
  paceLow: 650,
  paceHigh: 1000,
} as const;

export interface ScaleResult {
  units: number;
  totalDevelopmentCost: number;
  lihtcEquity: number;
  publicShare: number;
  debtAndCdfi: number;
  publicPerUnit: number;
  yearsLow: number;
  yearsHigh: number;
}

export function housingScale(units: number): ScaleResult {
  const tdc = units * SCALE.perUnitAllIn;
  const lihtc = units * SCALE.lihtcPerUnit;
  const publicShare = units * SCALE.publicPerUnit;
  return {
    units,
    totalDevelopmentCost: tdc,
    lihtcEquity: lihtc,
    publicShare,
    debtAndCdfi: tdc - lihtc - publicShare,
    publicPerUnit: SCALE.publicPerUnit,
    yearsLow: Math.max(1, Math.ceil(units / SCALE.paceHigh)),
    yearsHigh: Math.max(1, Math.ceil(units / SCALE.paceLow)),
  };
}

// ── Project-fit scorer ────────────────────────────────────────────

export type Stories = "low" | "mid" | "tall";
export type Repetition = "oneoff" | "repetitive";
export type Labor = "low" | "high";

export interface FitInput {
  stories: Stories;
  repetition: Repetition;
  labor: Labor;
}

export interface FitResult {
  score: number; // 0–100
  verdict: "poor" | "fair" | "strong" | "ideal";
  headline: string;
  reasons: { good: boolean; text: string }[];
}

export function projectFit({ stories, repetition, labor }: FitInput): FitResult {
  const reasons: { good: boolean; text: string }[] = [];
  let score = 50;

  if (stories === "low") {
    score -= 35;
    reasons.push({ good: false, text: "Low-rise: ordinary light-frame ('stick') wood is almost always cheaper here." });
  } else if (stories === "mid") {
    score += 25;
    reasons.push({ good: true, text: "Mid-rise (4–12 stories): mass timber's structural sweet spot — too tall for cheap stick-framing, no need for full concrete/steel." });
  } else {
    score += 10;
    reasons.push({ good: true, text: "Tall (13–18 stories): possible under Oregon's code, but premium-priced — usually market-rate, not affordable." });
  }

  if (repetition === "repetitive") {
    score += 22;
    reasons.push({ good: true, text: "Regular, repeatable layouts let a factory reuse one design — the repetition that turns the premium into savings." });
  } else {
    score -= 22;
    reasons.push({ good: false, text: "One-off, irregular designs force bespoke fabrication — exactly what bankrupts modular factories." });
  }

  if (labor === "high") {
    score += 18;
    reasons.push({ good: true, text: "High-cost labor market: prefab cuts the on-site crew ~in half, a real saving where labor is expensive." });
  } else {
    score -= 12;
    reasons.push({ good: false, text: "Low-cost labor market: the on-site labor savings shrink, weakening the case." });
  }

  score = Math.max(2, Math.min(98, score));
  const verdict: FitResult["verdict"] =
    score >= 80 ? "ideal" : score >= 60 ? "strong" : score >= 40 ? "fair" : "poor";
  const headline =
    verdict === "ideal"
      ? "A textbook fit for mass timber"
      : verdict === "strong"
        ? "A good candidate for mass timber"
        : verdict === "fair"
          ? "It could work — with the right conditions"
          : "Mass timber probably isn't the cheapest choice here";

  return { score, verdict, headline, reasons };
}

// ── Formatting helpers ────────────────────────────────────────────

export function fmtMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (abs >= 1_000) return `$${Math.round(value).toLocaleString()}`;
  return `$${Math.round(value)}`;
}

/** Money with sign, for deltas. */
export function fmtSignedMoney(value: number): string {
  return `${value >= 0 ? "+" : "−"}${fmtMoney(Math.abs(value))}`;
}

export function fmtPct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function fmtSignedPct(fraction: number, digits = 0): string {
  return `${fraction >= 0 ? "+" : "−"}${Math.abs(fraction * 100).toFixed(digits)}%`;
}
