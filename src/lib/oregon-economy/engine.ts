/**
 * Small formatting + math helpers for the Oregon economic-development deep dive.
 * All dollar figures in the data layer are stored in millions unless noted.
 */

export function fmtUSD(millions: number, opts: { decimals?: number } = {}): string {
  const { decimals } = opts;
  const abs = Math.abs(millions);
  const sign = millions < 0 ? "-" : "";
  if (abs >= 1000) {
    const b = abs / 1000;
    return `${sign}$${b.toFixed(decimals ?? (b >= 10 ? 1 : 2)).replace(/\.0+$/, "")}B`;
  }
  return `${sign}$${abs.toFixed(decimals ?? 0)}M`;
}

/** Plain dollars (not millions) — for per-job / per-dollar figures. */
export function fmtDollars(value: number, maximumFractionDigits = 0): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits })}`;
}

export function fmtNum(value: number): string {
  return value.toLocaleString("en-US");
}

export function fmtPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/** Signed percentage gap of actual vs target (negative = missed). */
export function gapVsTarget(actual: number, target: number): number {
  if (!target) return 0;
  return (actual - target) / target;
}
