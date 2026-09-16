/** 2026 OPA individual-booth marginal commission schedule; USD. */
export function showcaseCommission(sales: number): number {
  if (!Number.isFinite(sales) || sales < 0) throw new Error('Sales must be a nonnegative finite amount');
  const bands = [[2000, .17], [1000, .14], [1000, .12], [1500, .10], [Infinity, .05]];
  let remaining = sales, commission = 0;
  for (const [width, rate] of bands) {
    const portion = Math.min(remaining, width);
    commission += portion * rate;
    remaining -= portion;
  }
  return Math.round(commission * 100) / 100;
}
export function showcaseRemainder(sales: number, productionCost: number, otherCost: number) {
  return sales - showcaseCommission(sales) - 275 - 20 - productionCost - otherCost;
}
