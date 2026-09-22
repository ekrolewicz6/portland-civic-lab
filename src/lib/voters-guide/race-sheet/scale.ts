import type { Evidence } from "../types";

/**
 * The scale of each body's power, for the hub's ladder of government:
 * what the seat's budget is, how many people it serves, how many members
 * decide, and what it actually controls. Every number carries its official
 * source; the hub draws budget bars from `budget` on a log scale so a
 * $7 trillion federal budget and a $60 million city budget can share a page.
 *
 * Filled by research. Budgets are the most recent ADOPTED total (all funds)
 * for the current fiscal year or biennium, stated in the label with the
 * period; population is the most recent official estimate.
 */
export type ScaleTier = "federal" | "state" | "county" | "city";

export type BodyScale = {
  /** Must match Office.body exactly ("Portland City Council" is listed as "City of Portland"). */
  body: string;
  tier: ScaleTier;
  /** Annual budget in U.S. dollars (a biennium divided by two), for the bar. */
  budget: number;
  /** e.g. "$8.5 billion adopted, FY 2025–26" */
  budgetLabel: string;
  budgetSource: Evidence;
  /** People served. */
  people: number;
  /** e.g. "652,000 residents" */
  peopleLabel: string;
  peopleSource: Evidence;
  /** e.g. "12 councilors and a mayor", "1 governor", "5 commissioners". */
  members: string;
  /** One sentence, plain words: what this body decides that touches a resident. */
  decides: string;
};

export const bodyScales: BodyScale[] = [];

export const scaleFor = (body: string) => bodyScales.find((b) => b.body === body || (body === "Portland City Council" && b.body === "City of Portland")) ?? null;
