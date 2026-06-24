/**
 * FPDR calculation engine.
 *
 * Two models power the interactive pieces of the deep-dive:
 *
 *  1. personalCost()  — what the FPDR levy costs a single household, today.
 *     Straight arithmetic off the verified FY2025-26 tax rate.
 *
 *  2. simulateReform() — an illustrative, internally-consistent model of how
 *     switching from pay-as-you-go to a pre-funded trust changes the cost
 *     curve over time. It is a teaching tool, NOT an actuarial forecast.
 *     The one thing it gets exactly right is the core economics: the ONLY
 *     source of savings from pre-funding is investment returns, so at a 0%
 *     return the "savings" collapse to zero. Everything else is the timing
 *     of when those returns show up.
 */

import {
  HEADLINE,
  FPDR_RATE_FORECAST,
  PAYGO_ANCHORS,
  SIM_START_YEAR,
  SIM_END_YEAR,
} from "./data";

// ── Personal cost ─────────────────────────────────────────────────

export interface PersonalCost {
  /** Assessed value the household was charged on. */
  assessedValue: number;
  /** FPDR dollars this household pays per year. */
  annual: number;
  /** Per month. */
  monthly: number;
  /** Rough 10-year total at today's rate (no growth assumed). */
  tenYear: number;
  /** This household's share of the entire citywide FPDR levy. */
  shareOfLevy: number;
}

export function personalCost(assessedValue: number): PersonalCost {
  const annual = (assessedValue / 1000) * HEADLINE.ratePer1000AV_FY26;
  return {
    assessedValue,
    annual,
    monthly: annual / 12,
    tenYear: annual * 10,
    shareOfLevy: annual / HEADLINE.annualLevyFY26,
  };
}

export interface ProjectedCost {
  /** Number of fiscal years in the published forecast window. */
  years: number;
  /** Cumulative FPDR cost across that window ($). */
  total: number;
  /** The household's FPDR bill in the final forecast year ($). */
  finalAnnual: number;
}

/**
 * Projected cumulative FPDR cost for a household over the City's published
 * rate-forecast window (FY26–FY31). Grows assessed value by the City's assumed
 * AV growth each year and applies that year's published rate. This is the right
 * way to estimate a multi-year bill: both the rate and the assessed base rise,
 * so multiplying today's bill by N materially understates the real total.
 */
export function projectedCost(assessedValue: number): ProjectedCost {
  let av = assessedValue;
  let total = 0;
  let finalAnnual = 0;
  for (const yr of FPDR_RATE_FORECAST) {
    av = av * (1 + yr.avGrowth);
    finalAnnual = (av / 1000) * yr.ratePer1000AV;
    total += finalAnnual;
  }
  return { years: FPDR_RATE_FORECAST.length, total, finalAnnual };
}

// ── Pay-as-you-go projection (interpolated from anchors) ──────────

/** Linearly interpolate the projected benefit payments ($M) for a year. */
export function payGoAt(year: number): number {
  const a = PAYGO_ANCHORS;
  if (year <= a[0].year) return a[0].payments;
  if (year >= a[a.length - 1].year) return a[a.length - 1].payments;
  for (let i = 0; i < a.length - 1; i++) {
    const lo = a[i];
    const hi = a[i + 1];
    if (year >= lo.year && year <= hi.year) {
      const t = (year - lo.year) / (hi.year - lo.year);
      return lo.payments + t * (hi.payments - lo.payments);
    }
  }
  return a[a.length - 1].payments;
}

// ── Reform simulation ─────────────────────────────────────────────

export type Strategy = "status-quo" | "level" | "frontloaded";

interface StrategyParams {
  /**
   * Length of the transition / funding window in years. During the window the
   * city pays today's benefits AND builds an invested trust large enough to
   * cover every benefit after the window. A SHORTER window funds the trust
   * sooner, so its money is invested longer and captures more growth — that's
   * the "front-loaded" strategy.
   */
  windowYears: number;
}

const STRATEGY_PARAMS: Record<Strategy, StrategyParams> = {
  "status-quo": { windowYears: 0 },
  // Tuned so that at the 7% default return the lifetime savings land on the
  // figures Portland's actuary-watchers cite: ~25% (a quarter) for steady
  // pre-funding and ~33% (a third) for the front-loaded version.
  level: { windowYears: 28 },
  frontloaded: { windowYears: 22 },
};

export interface SimYear {
  year: number;
  /** Status-quo levy that year ($M) — just the benefits due. */
  payGo: number;
  /** Levy under the chosen reform ($M). */
  reform: number;
  /** Trust balance at year-end ($M). */
  trust: number;
}

export interface SimResult {
  strategy: Strategy;
  annualReturn: number;
  rows: SimYear[];
  /** Total levied over the whole horizon under pay-go ($M). */
  lifetimePayGo: number;
  /** Net total cost under the reform, crediting any leftover trust ($M). */
  lifetimeReform: number;
  /** lifetimePayGo - lifetimeReform ($M). Equals total investment returns. */
  lifetimeSavings: number;
  savingsPct: number;
  /** Highest single-year levy under pay-go ($M). */
  peakPayGo: number;
  /** Highest single-year levy under the reform ($M) — the "hump". */
  peakReform: number;
  /** Year the reform levy peaks. */
  peakReformYear: number;
  /** First year the reform levy drops below the pay-go levy. */
  crossoverYear: number | null;
}

/**
 * Forward-simulate the levy under a reform strategy.
 *
 * Mechanics: while saving, the city levies benefits PLUS a surcharge and the
 * surcharge compounds in a trust at `annualReturn`. After the saving window,
 * the trust is drawn down to pay benefits, so the levy falls below pay-go.
 * Leftover trust at the end is credited back (it's real money), which makes
 * the net lifetime savings exactly equal to the investment returns earned.
 */
export function simulateReform(
  strategy: Strategy,
  annualReturn: number
): SimResult {
  const params = STRATEGY_PARAMS[strategy];
  const rows: SimYear[] = [];

  const N = params.windowYears;
  const r = annualReturn;
  const windowEndYear = SIM_START_YEAR + N; // first draw-down year

  // Size the trust: it must hold, at the end of the funding window, the
  // present value of every benefit paid after the window. Then solve for the
  // level annual contribution whose future value equals that target.
  let target = 0;
  for (let y = windowEndYear; y <= SIM_END_YEAR; y++) {
    target += payGoAt(y) / Math.pow(1 + r, y - windowEndYear);
  }
  // Level contribution whose value at the end of the funding window equals the
  // target. Contributions land at the start of each year and grow to year-end,
  // so this is an annuity-due future value.
  const contribution =
    strategy === "status-quo"
      ? 0
      : r === 0
        ? target / N
        : (target * r) / ((1 + r) * (Math.pow(1 + r, N) - 1));

  let trust = 0;
  let lifetimePayGo = 0;
  let cumReformLevy = 0;
  let peakPayGo = 0;
  let peakReform = 0;
  let peakReformYear = SIM_START_YEAR;
  let crossoverYear: number | null = null;

  for (let year = SIM_START_YEAR; year <= SIM_END_YEAR; year++) {
    const benefit = payGoAt(year);

    let levy: number;
    if (strategy === "status-quo") {
      levy = benefit;
    } else if (year < windowEndYear) {
      // Funding years: pay today's benefits AND set aside a contribution.
      trust += contribution;
      levy = benefit + contribution;
    } else {
      // Draw-down years: the trust pays the benefits.
      const draw = Math.min(benefit, trust);
      trust -= draw;
      levy = benefit - draw;
    }

    // Trust earns its return at year-end (after that year's cash flows).
    trust = trust * (1 + r);

    lifetimePayGo += benefit;
    cumReformLevy += levy;

    if (benefit > peakPayGo) peakPayGo = benefit;
    if (levy > peakReform) {
      peakReform = levy;
      peakReformYear = year;
    }
    if (crossoverYear === null && year > SIM_START_YEAR && levy < benefit - 0.01) {
      crossoverYear = year;
    }

    rows.push({ year, payGo: benefit, reform: Math.max(0, levy), trust: Math.max(0, trust) });
  }

  // Credit any leftover trust back against the reform's cost.
  const lifetimeReform = cumReformLevy - trust;
  const lifetimeSavings = lifetimePayGo - lifetimeReform;

  return {
    strategy,
    annualReturn,
    rows,
    lifetimePayGo,
    lifetimeReform,
    lifetimeSavings,
    savingsPct: lifetimeSavings / lifetimePayGo,
    peakPayGo,
    peakReform,
    peakReformYear,
    crossoverYear,
  };
}

// ── Formatting helpers (shared by the page) ───────────────────────

/** $251.6M, $3.9B, $896, etc. */
export function fmtMoney(value: number, opts?: { cents?: boolean }): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, "")}B`;
  if (abs >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 10_000) return `$${Math.round(value).toLocaleString()}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(value);
}

/** A value given in millions → a clean money string. */
export function fmtMillions(valueInMillions: number): string {
  return fmtMoney(valueInMillions * 1_000_000);
}

export function fmtPct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}
