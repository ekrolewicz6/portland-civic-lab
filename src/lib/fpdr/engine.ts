/** Household tax estimates and a deterministic educational funding scenario.
 * The scenario is not a funding valuation or a forecast of the complete levy.
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
  /** This household's share of the entire citywide FPDR levy. */
  shareOfLevy: number;
}

export function personalCost(assessedValue: number): PersonalCost {
  const annual = (assessedValue / 1000) * HEADLINE.ratePer1000AV_FY26;
  return {
    assessedValue,
    annual,
    monthly: annual / 12,
    shareOfLevy: annual / HEADLINE.annualLevyFY26,
  };
}

export interface ProjectedCost {
  years: number;
  total: number;
  finalAnnual: number;
  rows: {
    fy: string;
    assessedValue: number;
    rate: number;
    annual: number;
    projected: boolean;
  }[];
}

/** FY26 input AV is unchanged in the base year. Subsequent years use a separate
 * household-growth scenario, not the City's aggregate AV forecast. Neither
 * compression nor discounts/exemptions are modeled. */
export function projectedCost(
  assessedValue: number,
  householdGrowth = 0.03,
): ProjectedCost {
  if (
    !Number.isFinite(assessedValue) ||
    assessedValue < 0 ||
    !Number.isFinite(householdGrowth) ||
    householdGrowth < 0 ||
    householdGrowth > 0.03
  ) {
    throw new RangeError(
      "Use a non-negative assessed value and household growth between 0% and 3%.",
    );
  }
  const rows = FPDR_RATE_FORECAST.map((year, index) => {
    const av = assessedValue * Math.pow(1 + householdGrowth, index);
    return {
      fy: year.fy,
      assessedValue: av,
      rate: year.ratePer1000AV,
      annual: (av / 1000) * year.ratePer1000AV,
      projected: year.projected,
    };
  });
  return {
    years: rows.length,
    total: rows.reduce((sum, row) => sum + row.annual, 0),
    finalAnnual: rows[rows.length - 1].annual,
    rows,
  };
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

// The contribution path is solved afresh for each selected constant return,
// assuming that return is known in advance. It is not a market stress test.
export const FUNDING_ASSUMPTIONS = {
  years: 30,
  contributionDecline: 0.02,
  bondRate: 0.055,
  bondYears: 25,
} as const;

export interface FundingSimYear {
  year: number;
  /** Status-quo levy that year ($M) — just the benefits due. */
  payGo: number;
  /** Levy under the funding policy ($M) — the contribution; benefits come from the trust. */
  reform: number;
  /** Invested trust balance at year-end ($M). */
  trust: number;
  cumulativePayGo: number;
  cumulativeReform: number;
}

export interface FundingSimResult {
  annualReturn: number;
  /** Pension-obligation bond seeded into the trust ($M). */
  pobAmount: number;
  rows: FundingSimYear[];
  /** Total levied over the whole horizon under pay-go ($M). */
  lifetimePayGo: number;
  /** Total tax contributions under the policy through the modeled horizon ($M). */
  lifetimeReform: number;
  /** lifetimePayGo - lifetimeReform ($M). Includes bond interest costs when applicable. */
  lifetimeSavings: number;
  savingsPct: number;
  /** Highest single-year levy under the policy ($M) — the early "bump". */
  peakReform: number;
  /** Year the policy levy peaks (the first funding year). */
  peakReformYear: number;
  /** First year the policy levy drops below the pay-go levy. */
  crossoverYear: number | null;
  /** First year cumulative tax contributions are lower than pay-go. */
  cumulativeCrossoverYear: number | null;
  /** First year without new trust contributions, not the end of benefit payments. */
  contributionEndYear: number;
}

/** Solves a declining 30-year contribution schedule to cover an illustrative
 * benefit path through 2082, using a constant net investment return. Existing
 * assets and benefit payments after the horizon are excluded in both scenarios.
 * PERS, disability, admin, inflation and market volatility are not modeled.
 */
export function simulateFundingPolicy(
  annualReturn: number,
  pobAmount = 0,
): FundingSimResult {
  if (
    !Number.isFinite(annualReturn) ||
    annualReturn < 0 ||
    annualReturn > 0.08 ||
    !Number.isFinite(pobAmount) ||
    pobAmount < 0 ||
    pobAmount > 200
  ) {
    throw new RangeError(
      "Scenario supports 0–8% returns and bonds of $0–200M.",
    );
  }
  const r = annualReturn;
  const N = FUNDING_ASSUMPTIONS.years;
  const d = FUNDING_ASSUMPTIONS.contributionDecline;

  const years: number[] = [];
  for (let y = SIM_START_YEAR; y <= SIM_END_YEAR; y++) years.push(y);
  const benefits = years.map(payGoAt);
  const H = years.length;

  const contribution = (c0: number, t: number) =>
    t < N ? c0 * Math.pow(1 - d, t) : 0;

  // Forward-run the trust for a given starting contribution.
  const run = (c0: number) => {
    let trust = pobAmount;
    let minTrust = Infinity;
    const path: number[] = [];
    for (let t = 0; t < H; t++) {
      trust = (trust + contribution(c0, t) - benefits[t]) * (1 + r);
      path.push(trust);
      if (trust < minTrust) minTrust = trust;
    }
    return { path, minTrust, end: trust };
  };

  // Solve for the smallest initial contribution that keeps the invested trust
  // solvent through the whole horizon (higher c0 → higher trust everywhere).
  let lo = 0;
  let hi = 10_000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (run(mid).minTrust >= 0) hi = mid;
    else lo = mid;
  }
  const c0 = hi;
  const { path } = run(c0);

  // Level annual debt service to repay the bond over its term (the proceeds were
  // already seeded into the trust inside run()); added to the levy, not the trust.
  const debtService =
    pobAmount === 0
      ? 0
      : (pobAmount * FUNDING_ASSUMPTIONS.bondRate) /
        (1 -
          Math.pow(
            1 + FUNDING_ASSUMPTIONS.bondRate,
            -FUNDING_ASSUMPTIONS.bondYears,
          ));

  const rows: FundingSimYear[] = [];
  let lifetimePayGo = 0;
  let cumReform = 0;
  let peakReform = 0;
  let peakReformYear = SIM_START_YEAR;
  let crossoverYear: number | null = null;
  let cumulativeCrossoverYear: number | null = null;

  for (let t = 0; t < H; t++) {
    // Taxpayer levy = funding contribution + any bond debt service that year.
    const levy =
      contribution(c0, t) +
      (t < FUNDING_ASSUMPTIONS.bondYears ? debtService : 0);
    lifetimePayGo += benefits[t];
    cumReform += levy;
    if (levy > peakReform) {
      peakReform = levy;
      peakReformYear = years[t];
    }
    if (crossoverYear === null && t > 0 && levy < benefits[t] - 0.01) {
      crossoverYear = years[t];
    }
    if (cumulativeCrossoverYear === null && cumReform < lifetimePayGo - 0.01) {
      cumulativeCrossoverYear = years[t];
    }
    rows.push({
      year: years[t],
      payGo: benefits[t],
      reform: levy,
      trust: Math.max(0, path[t]),
      cumulativePayGo: lifetimePayGo,
      cumulativeReform: cumReform,
    });
  }

  // Report cash contributions; never net hypothetical residual assets against taxes.
  const lifetimeReform = cumReform;
  const lifetimeSavings = lifetimePayGo - lifetimeReform;

  return {
    annualReturn: r,
    pobAmount,
    rows,
    lifetimePayGo,
    lifetimeReform,
    lifetimeSavings,
    savingsPct: lifetimeSavings / lifetimePayGo,
    peakReform,
    peakReformYear,
    crossoverYear,
    cumulativeCrossoverYear,
    contributionEndYear: SIM_START_YEAR + N,
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
