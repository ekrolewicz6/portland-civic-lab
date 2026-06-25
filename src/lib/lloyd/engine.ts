/**
 * Lloyd Center deep-dive — small calc + formatting helpers.
 *
 * The one "model" here is buildoutYears(): at a given building pace, how long
 * would it take to deliver the plan's ~5,141 modeled homes? It's deliberately
 * simple arithmetic — the point is the scale, not a forecast.
 */

import { HEADLINE } from "./data";

/** Years to deliver all modeled homes at a given annual pace. */
export function buildoutYears(unitsPerYear: number): number {
  if (unitsPerYear <= 0) return Infinity;
  return HEADLINE.unitsModeled / unitsPerYear;
}

/** 1,200 → "1,200"; 5_141 → "5,141". */
export function fmtNum(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/** $290M, $177M, $1.2B, etc. */
export function fmtMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, "")}B`;
  if (abs >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${fmtNum(value)}`;
}

/** 0.9 → "90%". */
export function fmtPct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}
