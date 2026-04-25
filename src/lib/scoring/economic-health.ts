/**
 * Economic Health composite score.
 *
 * Six weighted sub-scores combine into a single 0–100 number with a label.
 * Pure function — both the hero API and detail API import this so weights
 * and label thresholds are tunable in one place.
 *
 * Scoring inputs are all *current vs prior* aggregates. The caller is
 * responsible for window selection (typically last-12-months vs prior-12).
 *
 * If a sub-score input is missing (null), it is dropped and the remaining
 * weights are re-normalized — the score still produces a defensible number
 * with fewer ingredients (e.g., when PBJ data is stale).
 */

export interface ScoringInputs {
  /** new businesses, current 12 mo / prior 12 mo */
  formation: { current: number; prior: number } | null;
  /** bankruptcies + lawsuits + tax liens, current / prior */
  distress: { current: number; prior: number } | null;
  /** QCEW total establishments, current / prior */
  employment: { current: number; prior: number } | null;
  /** Portland MSA unemployment rate (percent, e.g. 4.2) */
  unemploymentRate: number | null;
  /** BDS permit count, current / prior */
  permits: { current: number; prior: number } | null;
  /** real-estate $ volume, current / prior */
  realEstate: { current: number; prior: number } | null;
}

export interface SubScore {
  key: keyof ScoringInputs;
  label: string;
  value: number; // 0-100
  weight: number; // 0-1, post-normalization weight applied to this run
  rawWeight: number; // the canonical weight before any re-normalization
  description: string;
}

export interface EconomicHealthResult {
  score: number; // 0-100
  label: "Healthy" | "Mixed" | "Concerning" | "Insufficient data";
  subScores: SubScore[];
  /** sub-score keys that were dropped because input was null */
  missing: Array<keyof ScoringInputs>;
}

const RAW_WEIGHTS: Record<keyof ScoringInputs, number> = {
  formation: 0.2,
  distress: 0.2,
  employment: 0.2,
  unemploymentRate: 0.15,
  permits: 0.15,
  realEstate: 0.1,
};

const LABELS: Record<keyof ScoringInputs, string> = {
  formation: "Business formation",
  distress: "Financial distress (inv.)",
  employment: "Employment (establishments)",
  unemploymentRate: "Unemployment (inv.)",
  permits: "Permit pipeline",
  realEstate: "Real estate volume",
};

const DESCRIPTIONS: Record<keyof ScoringInputs, string> = {
  formation: "New business registrations, last 12 months vs prior 12.",
  distress: "Bankruptcies + lawsuits + active tax liens. Inverted (more = worse).",
  employment: "QCEW total establishments year-over-year change.",
  unemploymentRate: "Portland MSA unemployment rate. Inverted.",
  permits: "Building Bureau permits issued, last 12 months vs prior 12.",
  realEstate: "Real-estate transaction dollar volume year-over-year.",
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Symmetric ratio score: 1.0 = 50, 1.5 = 100, 0.5 = 0. Clamped. */
function ratioScore(current: number, prior: number): number {
  const ratio = prior > 0 ? current / prior : 1;
  // Map 0.5..1.5 onto 0..100; 1.0 -> 50.
  return clamp((ratio - 0.5) * 100, 0, 100);
}

/** Inverted ratio score: a *growing* ratio is bad. 1.0 = 50, 0.5 = 100, 1.5 = 0. */
function invRatioScore(current: number, prior: number): number {
  const ratio = prior > 0 ? current / prior : 1;
  return clamp((1.5 - ratio) * 100, 0, 100);
}

/** Unemployment rate to 0-100. 4% rate = 60, 8% rate = 20, 0% = 100. Clamped. */
function unemploymentScore(rate: number): number {
  return clamp(100 - rate * 10, 0, 100);
}

export function computeEconomicHealth(inputs: ScoringInputs): EconomicHealthResult {
  const raw: Array<{ key: keyof ScoringInputs; value: number | null }> = [
    {
      key: "formation",
      value: inputs.formation ? ratioScore(inputs.formation.current, inputs.formation.prior) : null,
    },
    {
      key: "distress",
      value: inputs.distress ? invRatioScore(inputs.distress.current, inputs.distress.prior) : null,
    },
    {
      key: "employment",
      value: inputs.employment
        ? ratioScore(inputs.employment.current, inputs.employment.prior)
        : null,
    },
    {
      key: "unemploymentRate",
      value: inputs.unemploymentRate !== null ? unemploymentScore(inputs.unemploymentRate) : null,
    },
    {
      key: "permits",
      value: inputs.permits ? ratioScore(inputs.permits.current, inputs.permits.prior) : null,
    },
    {
      key: "realEstate",
      value: inputs.realEstate
        ? ratioScore(inputs.realEstate.current, inputs.realEstate.prior)
        : null,
    },
  ];

  const present = raw.filter((s) => s.value !== null) as Array<{
    key: keyof ScoringInputs;
    value: number;
  }>;
  const missing = raw.filter((s) => s.value === null).map((s) => s.key);

  if (present.length === 0) {
    return { score: 0, label: "Insufficient data", subScores: [], missing };
  }

  // Re-normalize weights so the present sub-scores sum to 1.0.
  const presentWeightSum = present.reduce((sum, s) => sum + RAW_WEIGHTS[s.key], 0);
  const subScores: SubScore[] = present.map((s) => {
    const normalizedWeight = RAW_WEIGHTS[s.key] / presentWeightSum;
    return {
      key: s.key,
      label: LABELS[s.key],
      value: Math.round(s.value),
      weight: Number(normalizedWeight.toFixed(3)),
      rawWeight: RAW_WEIGHTS[s.key],
      description: DESCRIPTIONS[s.key],
    };
  });

  const composite = subScores.reduce((sum, s) => sum + s.value * s.weight, 0);
  const score = Math.round(composite);

  const label: EconomicHealthResult["label"] =
    score >= 70 ? "Healthy" : score >= 40 ? "Mixed" : "Concerning";

  return { score, label, subScores, missing };
}

/** Helper for the API route to format the headline string. */
export function formatHealthHeadline(result: EconomicHealthResult, ctx: {
  newBiz12mo?: number;
  bankruptciesUp?: boolean;
  unemployment?: number;
}): string {
  if (result.label === "Insufficient data") {
    return "Economic Health: data refreshing — partial signal available.";
  }
  const parts: string[] = [];
  if (ctx.newBiz12mo) parts.push(`${ctx.newBiz12mo.toLocaleString()} new businesses (12mo)`);
  if (ctx.bankruptciesUp) parts.push("bankruptcies trending up");
  if (typeof ctx.unemployment === "number")
    parts.push(`${ctx.unemployment.toFixed(1)}% unemployment`);
  const tail = parts.length ? ` — ${parts.join(", ")}.` : ".";
  return `Economic Health: ${result.score}/100 (${result.label})${tail}`;
}
