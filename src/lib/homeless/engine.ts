/**
 * Homelessness deep-dive calculation engine.
 *
 * The two central models are ported directly from the founder's "homelessness
 * operating system" cockpit (bed-finder/src/app/cockpit/simulate + lib/spine):
 *
 *  1. simulate()       — a stocks-and-flows model of Multnomah County's by-name
 *     list. The lesson it makes visceral: homelessness grows because monthly
 *     INFLOW (~1,277) exceeds OUTFLOW (~865). Close that gap and the population
 *     stops growing before you house a single additional person.
 *
 *  2. costOfInaction() — the status quo is not free; it's just spread across a
 *     dozen budgets. Leaving someone on the street costs the public more than
 *     housing them. Making that denominator visible is the most powerful move.
 *
 * Both rest on sourced figures (see data.ts). The behavioral assumptions are
 * deliberately visible and contestable.
 */

// ── Flow model ────────────────────────────────────────────────────

export const FLOW = {
  /** People newly added to the by-name list per month (Jan 2025, verified). */
  inflow: 1277,
  /** People exiting to housing or going inactive per month. */
  outflow: 865,
  /** Approx. total on the by-name list, early 2026. */
  startTotal: 18000,
} as const;

/** Behavioral assumptions — visible and contestable on purpose. */
export const SIM = {
  /** Share of monthly inflow driven by eviction / economic shock. */
  evictionShareOfInflow: 0.25,
  /** Share arriving via institutional discharge (jail / hospital / foster). */
  dischargeShareOfInflow: 0.15,
  /** People served per staffed treatment bed per year. */
  treatmentTurnsPerBedYear: 4,
  /** Share of treatment stays that exit homelessness durably. */
  treatmentDurableExitRate: 0.35,
  /** Master-leased units come online linearly over this many months. */
  housingRampMonths: 12,
  /** Projection horizon. */
  months: 48,
} as const;

export interface Levers {
  /** 0..1 — share of eviction-driven inflow prevented. */
  evictionPrevention: number;
  /** 0..1 — share of discharge-driven inflow redirected. */
  dischargeBan: number;
  /** Number of new staffed treatment beds. */
  treatmentBeds: number;
  /** 0.5..1 — share of those beds actually staffed (the real rate-limiter). */
  workforceFill: number;
  /** Number of master-leased housing units brought online. */
  masterLeased: number;
}

export interface SimResult {
  rows: { month: number; baseline: number; scenario: number }[];
  /** First month the scenario's monthly inflow drops to or below outflow (growth stops). */
  crossover: number | null;
  baselineEnd: number;
  scenarioEnd: number;
  /** Net monthly change under the scenario at steady state (negative = shrinking). */
  scenarioNetMonthly: number;
}

export function simulate(levers: Levers): SimResult {
  const inflow0 = FLOW.inflow;
  const outflow0 = FLOW.outflow;
  const start = FLOW.startTotal;

  const rows: { month: number; baseline: number; scenario: number }[] = [
    { month: 0, baseline: start, scenario: start },
  ];
  let crossover: number | null = null;
  let lastInflow: number = inflow0;
  let lastOutflow: number = outflow0;

  for (let m = 1; m <= SIM.months; m++) {
    const prev = rows[m - 1];
    const baseline = Math.max(0, prev.baseline + inflow0 - outflow0);

    const inflow =
      inflow0 *
      (1 -
        SIM.evictionShareOfInflow * levers.evictionPrevention -
        SIM.dischargeShareOfInflow * levers.dischargeBan);
    const treatmentExits =
      (levers.treatmentBeds *
        levers.workforceFill *
        SIM.treatmentTurnsPerBedYear *
        SIM.treatmentDurableExitRate) /
      12;
    const housingExits =
      m <= SIM.housingRampMonths ? levers.masterLeased / SIM.housingRampMonths : 0;
    const outflow = outflow0 + treatmentExits + housingExits;

    const scenario = Math.max(0, prev.scenario + inflow - outflow);
    if (crossover === null && inflow <= outflow) crossover = m;
    lastInflow = inflow;
    lastOutflow = outflow;

    rows.push({ month: m, baseline: Math.round(baseline), scenario: Math.round(scenario) });
  }

  return {
    rows,
    crossover,
    baselineEnd: rows[rows.length - 1].baseline,
    scenarioEnd: rows[rows.length - 1].scenario,
    scenarioNetMonthly: Math.round(lastInflow - lastOutflow),
  };
}

// ── Cost of inaction ──────────────────────────────────────────────

export const COST = {
  /**
   * Public cost per chronically homeless person/year on the street (ER, jail,
   * EMS, sanitation). Central, well-sourced figure; NAEH puts the average at
   * ~$35,578, HUD/Culhane at ~$40,000, USICH at $30k–$50k. The very-highest-cost
   * individuals run far higher (Reno's "Million-Dollar Murray" was an outlier).
   */
  streetPerYear: 40_000,
  /** Cost per person/year in permanent supportive housing (NAEH 2025, ~$20,115). */
  housedPerYear: 20_000,
  /** Typical range across U.S. studies for the street figure. */
  streetRangeLow: 35_000,
  streetRangeHigh: 50_000,
} as const;

export interface InactionResult {
  people: number;
  streetCost: number;
  housedCost: number;
  saved: number;
  savedPerPerson: number;
}

export function costOfInaction(people: number): InactionResult {
  const streetCost = people * COST.streetPerYear;
  const housedCost = people * COST.housedPerYear;
  return {
    people,
    streetCost,
    housedCost,
    saved: streetCost - housedCost,
    savedPerPerson: COST.streetPerYear - COST.housedPerYear,
  };
}

// ── Formatting ────────────────────────────────────────────────────

export function fmtMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(value >= 100_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000) return `$${Math.round(value).toLocaleString()}`;
  return `$${Math.round(value)}`;
}

export function fmtNum(value: number): string {
  return Math.round(value).toLocaleString();
}

export function fmtPct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function fmtSignedNum(value: number): string {
  return `${value >= 0 ? "+" : "−"}${fmtNum(Math.abs(value))}`;
}
