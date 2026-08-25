/**
 * Pure math for the venue-portfolio deep-dive.
 *
 * These are teaching tools, not financing recommendations: the affordability
 * calculator reproduces the source analysis's illustrative debt-service
 * arithmetic, and the capital score enacts the five-gates / 100-point
 * framework so a reader can feel how it disciplines a proposal.
 */

export type GateId = "necessity" | "ownership" | "portfolio" | "lifecycle" | "downside";
export type DimId =
  | "safety"
  | "ownerReturn"
  | "demand"
  | "mission"
  | "leverage"
  | "district"
  | "optionality";

/**
 * Level-payment annual debt service: P·r / (1 − (1+r)^−n).
 * Verified against the source's own table (30y @ 4.5%):
 * $115M → ~$7.06M, $214M → ~$13.14M, $180M → ~$11.05M, $334.5M → ~$20.54M.
 */
export function annualDebtService(principal: number, rate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  if (rate <= 0) return principal / years;
  return (principal * rate) / (1 - Math.pow(1 + rate, -years));
}

export interface ScoreDimension {
  id: DimId;
  label: string;
  weight: number;
}

/** §10.2 — weights sum to exactly 100. */
export const SCORE_DIMENSIONS: ScoreDimension[] = [
  { id: "safety", label: "Life safety, legal compliance, ADA, asset protection", weight: 25 },
  { id: "ownerReturn", label: "Owner cash return or avoided lifecycle cost", weight: 20 },
  { id: "demand", label: "Demonstrated demand and utilization", weight: 15 },
  { id: "mission", label: "Public mission, cultural value, access, equity", weight: 15 },
  { id: "leverage", label: "Private, philanthropic, State, or regional leverage and risk transfer", weight: 10 },
  { id: "district", label: "Land, district, and economic-development leverage", weight: 10 },
  { id: "optionality", label: "Strategic optionality and system resilience", weight: 5 },
];

export interface ScoreInputs {
  gates: Record<GateId, boolean>;
  dims: Record<DimId, number>;
}

export interface ScoreResult {
  total: number;
  gatesPassed: boolean;
  failedGates: GateId[];
}

export function scoreProject(inputs: ScoreInputs): ScoreResult {
  const failedGates = (Object.keys(inputs.gates) as GateId[]).filter((g) => !inputs.gates[g]);
  const total = SCORE_DIMENSIONS.reduce((sum, d) => {
    const raw = inputs.dims[d.id] ?? 0;
    return sum + Math.max(0, Math.min(d.weight, raw));
  }, 0);
  return { total: Math.round(total), gatesPassed: failedGates.length === 0, failedGates };
}

export interface AffordPreset {
  id: string;
  label: string;
  amount: number;
  note: string;
}

/** §8.2 illustrative amounts, plus the two live venue figures for context. */
export const AFFORD_PRESETS: AffordPreset[] = [
  { id: "p5-low", label: "$115M", amount: 115_000_000, note: "Portland'5 through ~2035, low end" },
  { id: "p5-high", label: "$214M", amount: 214_000_000, note: "Portland'5 through ~2035, high end" },
  { id: "all-low", label: "$180M", amount: 180_000_000, note: "Portland'5 all horizons, low end" },
  { id: "all-high", label: "$334.5M", amount: 334_500_000, note: "Portland'5 all horizons, high end" },
  { id: "keller", label: "$290M", amount: 290_000_000, note: "Keller renovation estimate (Res. 2026-270)" },
  { id: "psu", label: "$447M", amount: 447_000_000, note: "PSU venue estimate (Res. 2026-270)" },
];

export interface ScorePreset {
  id: string;
  label: string;
  rationale: string;
  gates: Record<GateId, boolean>;
  dims: Record<DimId, number>;
}

/**
 * Illustrative presets authored by Portland Civic Lab to show how the
 * framework treats §10.3's priority tiers — not scores of live proposals.
 */
export const SCORE_PRESETS: ScorePreset[] = [
  {
    id: "moda-protected",
    label: "Arena renovation with full protections",
    rationale:
      "A Moda-shaped project that passes every gate: capped exposure, private overrun protection, enforceable return. Lands high-conditional — strong on demand and leverage, weaker on direct owner cash.",
    gates: { necessity: true, ownership: true, portfolio: true, lifecycle: true, downside: true },
    dims: { safety: 14, ownerReturn: 10, demand: 14, mission: 7, leverage: 8, district: 8, optionality: 3 },
  },
  {
    id: "psu-as-proposed",
    label: "New Broadway hall without a Keller decision",
    rationale:
      "A new hall proposed while the replacement question stays open fails Gate 3 (portfolio consistency) — the score never runs. Resolving Keller's disposition is what unlocks scoring.",
    gates: { necessity: true, ownership: true, portfolio: false, lifecycle: false, downside: true },
    dims: { safety: 10, ownerReturn: 8, demand: 12, mission: 12, leverage: 7, district: 6, optionality: 3 },
  },
  {
    id: "newmark",
    label: "Newmark modernization",
    rationale:
      "Mid-sized theater with real utilization and a credible long-term role: passes the gates, scores solidly conditional — strongest on mission and demand.",
    gates: { necessity: true, ownership: true, portfolio: true, lifecycle: true, downside: true },
    dims: { safety: 16, ownerReturn: 8, demand: 10, mission: 13, leverage: 4, district: 3, optionality: 4 },
  },
  {
    id: "garage-rebuild",
    label: "Garage rebuilt-in-kind",
    rationale:
      "Replacing parking capacity one-for-one, with no land-use analysis, assumes indefinite parking demand. Passes the gates only with generous readings, and scores low — redesign before funding.",
    gates: { necessity: true, ownership: true, portfolio: true, lifecycle: true, downside: false },
    dims: { safety: 12, ownerReturn: 6, demand: 6, mission: 2, leverage: 2, district: 3, optionality: 2 },
  },
];

/* ---------------------------------------------------------------- format */

export function fmtMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `$${b.toFixed(b >= 10 ? 0 : 1)}B`;
  }
  if (abs >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m.toFixed(m >= 100 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

export function fmtMillions(value: number): string {
  const m = value / 1_000_000;
  return `$${m.toFixed(m >= 100 ? 0 : 1)}M`;
}

export function fmtPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function fmtCount(value: number): string {
  return value.toLocaleString("en-US");
}
