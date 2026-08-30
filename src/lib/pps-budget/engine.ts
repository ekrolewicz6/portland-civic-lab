/**
 * Small computation layer for the PPS budget dive.
 */

/** FY2026-27 PPS tax rates per $1,000 of assessed value. [budget-fy2026-27-vol1 p226] */
export const TAX_RATES = {
  permanent: 4.7743,
  gap: 0.5038,
  localOption: 1.99,
  bond: 2.5046,
} as const;

/** The levy's compression-adjusted effective rate, FY2024-25. [tscc-annual-report-2024-25-general p50] */
export const LEVY_EFFECTIVE_RATE = 1.5142;

export interface HomeownerTax {
  permanent: number;
  gap: number;
  localOption: number;
  localOptionEffective: number;
  bond: number;
  total: number;
}

/** What a home at `assessedValue` pays PPS per year across the four lines. */
export function homeownerTax(assessedValue: number): HomeownerTax {
  const per = assessedValue / 1000;
  return {
    permanent: per * TAX_RATES.permanent,
    gap: per * TAX_RATES.gap,
    localOption: per * TAX_RATES.localOption,
    localOptionEffective: per * LEVY_EFFECTIVE_RATE,
    bond: per * TAX_RATES.bond,
    total:
      per *
      (TAX_RATES.permanent + TAX_RATES.gap + TAX_RATES.localOption + TAX_RATES.bond),
  };
}

export function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function fmtMillionsFromK(k: number): string {
  const m = k / 1000;
  return m >= 1000
    ? `$${(m / 1000).toFixed(2)}B`
    : `$${m >= 100 ? Math.round(m) : m.toFixed(1)}M`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtCount(n: number): string {
  return n.toLocaleString("en-US");
}
