/** Conditional fiscal comparison; all amounts are real $millions.
 * Geography does not determine a build probability. State income taxes enter
 * only the combined ledger. Construction receipts depend on whether built.
 */
export type Ledger = "local" | "statewide";
export interface DealInputs {
  taxableValueM: number; taxRatePct: number; abatementYears: number;
  paymentMode: "fixed" | "share" | "stepped-share"; laterPaymentSharePct: number; paymentStepYear: number; feeM: number; paymentSharePct: number; minimumPaymentM: number; upfrontM: number;
  jobs: number; wageK: number; incomeTaxPct: number;
  buildWithoutPct: number; buildWithPct: number;
  horizonYears: number; operatingYears: number; discountPct: number;
  baselineM: number; serviceCostM: number;
  constructionLocalM: number; constructionStateM: number;
}
/** Illustrative assumptions, not an assessed Oregon project. */
export const DEFAULT_INPUTS: DealInputs = {
  taxableValueM: 1400, taxRatePct: 1.1, abatementYears: 15,
  paymentMode: "fixed", laterPaymentSharePct: 65, paymentStepYear: 4, feeM: 2.7, paymentSharePct: 50, minimumPaymentM: 0, upfrontM: 0,
  jobs: 100, wageK: 90, incomeTaxPct: 6.5,
  buildWithoutPct: 50, buildWithPct: 100,
  horizonYears: 30, operatingYears: 30, discountPct: 4,
  baselineM: 0.05, serviceCostM: 0, constructionLocalM: 0, constructionStateM: 0,
};
export interface CashFlow {
  year: number; fullTaxM: number; dealPropertyM: number; incomeTaxM: number;
  serviceCostM: number; constructionM: number; baselineM: number; discountFactor: number;
}
export interface DealResult {
  pvFullTax: number; pvDealProperty: number; pvPostAbatement: number;
  pvIncomeTax: number; pvCosts: number; pvBaseline: number; pvConstruction: number;
  fullIfBuilt: number; dealIfBuilt: number; evSign: number; evHold: number; net: number;
  breakEvenP: number | null; rows: CashFlow[]; timeline: { year: number; deal: number; noBreak: number }[];
}
export function annuity(rate: number, years: number): number {
  if (years <= 0) return 0;
  return rate === 0 ? years : (1 - (1 + rate) ** -years) / rate;
}
export function dealMath(inp: DealInputs, ledger: Ledger = "local"): DealResult {
  for (const [key, value] of Object.entries(inp)) {
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) {
      throw new RangeError("Invalid input: " + key);
    }
  }
  if ([inp.buildWithPct, inp.buildWithoutPct, inp.paymentSharePct, inp.laterPaymentSharePct, inp.incomeTaxPct].some(v => v > 100)) {
    throw new RangeError("Percentages must be between 0 and 100");
  }
  if (inp.horizonYears < 1 || inp.horizonYears > 50 || !Number.isInteger(inp.horizonYears)
      || inp.paymentStepYear < 1 || !Number.isInteger(inp.paymentStepYear)
      || !Number.isInteger(inp.operatingYears) || !Number.isInteger(inp.abatementYears)) {
    throw new RangeError("Use whole years and a horizon of 1–50 years");
  }
  const fullTax = inp.taxableValueM * inp.taxRatePct / 100;
  const income = ledger === "statewide" ? inp.jobs * inp.wageK / 1000 * inp.incomeTaxPct / 100 : 0;
  const construction = inp.constructionLocalM + (ledger === "statewide" ? inp.constructionStateM : 0);
  const rows: CashFlow[] = Array.from({ length: inp.horizonYears }, (_, i) => {
    const year = i + 1;
    const operating = year <= inp.operatingYears;
    const share = inp.paymentMode === "stepped-share" && year >= inp.paymentStepYear ? inp.laterPaymentSharePct : inp.paymentSharePct;
    const payment = inp.paymentMode === "fixed" ? inp.feeM : Math.max(inp.minimumPaymentM, fullTax * share / 100);
    return {
      year, fullTaxM: operating ? fullTax : 0,
      dealPropertyM: operating ? (year <= inp.abatementYears ? payment : fullTax) + (year === 1 ? inp.upfrontM : 0) : 0,
      incomeTaxM: operating ? income : 0, serviceCostM: operating ? inp.serviceCostM : 0,
      constructionM: operating && year === 1 ? construction : 0,
      baselineM: inp.baselineM, discountFactor: (1 + inp.discountPct / 100) ** -year,
    };
  });
  const sum = (select: (r: CashFlow) => number) => rows.reduce((t, r) => t + select(r) * r.discountFactor, 0);
  const pvFullTax = sum(r => r.fullTaxM);
  const pvDealProperty = sum(r => r.dealPropertyM);
  const pvPostAbatement = sum(r => r.year > inp.abatementYears ? r.fullTaxM : 0);
  const pvIncomeTax = sum(r => r.incomeTaxM);
  const pvCosts = sum(r => r.serviceCostM);
  const pvConstruction = sum(r => r.constructionM);
  const pvBaseline = sum(r => r.baselineM);
  // After closure only baseline land receipts remain. No resale value or
  // residual facility tax is assumed; remediation costs remain unpriced.
  const afterClosure = sum(r => r.year > inp.operatingYears ? r.baselineM : 0);
  const fullIfBuilt = pvFullTax + pvIncomeTax + pvConstruction - pvCosts + afterClosure;
  const dealIfBuilt = pvDealProperty + pvIncomeTax + pvConstruction - pvCosts + afterClosure;
  const q = inp.buildWithPct / 100;
  const p = inp.buildWithoutPct / 100;
  const evSign = q * dealIfBuilt + (1 - q) * pvBaseline;
  const evHold = p * fullIfBuilt + (1 - p) * pvBaseline;
  const denominator = fullIfBuilt - pvBaseline;
  let cumulativeDeal = 0, cumulativeNoBreak = 0;
  const timeline = rows.map(r => {
    const common = r.incomeTaxM + r.constructionM - r.serviceCostM + (r.year > inp.operatingYears ? r.baselineM : 0);
    cumulativeDeal += (q * (r.dealPropertyM + common) + (1 - q) * r.baselineM) * r.discountFactor;
    cumulativeNoBreak += (p * (r.fullTaxM + common) + (1 - p) * r.baselineM) * r.discountFactor;
    return { year: r.year, deal: cumulativeDeal, noBreak: cumulativeNoBreak };
  });
  return {
    pvFullTax, pvDealProperty, pvPostAbatement, pvIncomeTax, pvCosts, pvBaseline,
    pvConstruction, fullIfBuilt, dealIfBuilt, evSign, evHold, net: evSign - evHold,
    // Do not clip thresholds: outside 0–1 conveys dominance, not a probability.
    breakEvenP: denominator > 0 ? (evSign - pvBaseline) / denominator : null, rows, timeline,
  };
}
export function cashFlowCsv(inp: DealInputs, ledger: Ledger): string {
  const result = dealMath(inp, ledger);
  return [
    "# Illustrative fiscal scenario; real USD millions; cash flows at year end",
    "# ledger=" + ledger + "; inputs=" + JSON.stringify(inp),
    "year,full_tax_if_built,deal_property_if_built,income_tax_if_built,service_cost_if_built,construction_revenue_if_built,no_build_land_revenue,discount_factor",
    ...result.rows.map(r => [r.year, r.fullTaxM, r.dealPropertyM, r.incomeTaxM, r.serviceCostM, r.constructionM, r.baselineM, r.discountFactor].join(",")),
    "# expected_deal_pv=" + result.evSign + "; expected_no_break_pv=" + result.evHold + "; difference=" + result.net,
  ].join("\n");
}
