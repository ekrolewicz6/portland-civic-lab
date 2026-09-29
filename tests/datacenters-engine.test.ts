import { describe, expect, it } from "vitest";
import { annuity, cashFlowCsv, dealMath, DEFAULT_INPUTS } from "../src/lib/datacenters/engine";

describe("data-center fiscal comparison", () => {
  it("keeps state payroll out of local receipts", () => {
    const local = dealMath(DEFAULT_INPUTS, "local");
    expect(local.pvIncomeTax).toBe(0);
    expect(dealMath({ ...DEFAULT_INPUTS, jobs: 900 }, "local").net).toBe(local.net);
    const combined = dealMath(DEFAULT_INPUTS, "statewide");
    const income = 100 * 90000 * .065 / 1e6 * annuity(.04, 30);
    expect(combined.net - local.net).toBeCloseTo(.5 * income, 8);
  });
  it("has identical outcomes without a concession and with equal build probabilities", () => {
    const r = dealMath({ ...DEFAULT_INPUTS, abatementYears: 0, buildWithPct: 60, buildWithoutPct: 60 });
    expect(r.net).toBeCloseTo(0, 10);
  });
  it("counts the operating years after an exemption and stops receipts at closure", () => {
    const r = dealMath({ ...DEFAULT_INPUTS, horizonYears: 30, operatingYears: 20 });
    expect(r.rows[14].dealPropertyM).toBe(2.7);
    expect(r.rows[15].dealPropertyM).toBeCloseTo(15.4);
    expect(r.rows[20].dealPropertyM).toBe(0);
    expect(r.pvPostAbatement).toBeCloseTo(15.4 * (annuity(.04, 20) - annuity(.04, 15)), 8);
    expect(dealMath({ ...DEFAULT_INPUTS, horizonYears: 15 }).pvPostAbatement).toBe(0);
  });
  it("weights construction receipts by each build probability instead of cancelling them", () => {
    const base = { ...DEFAULT_INPUTS, buildWithPct: 80, buildWithoutPct: 20 };
    expect(dealMath({ ...base, constructionLocalM: 10 }).net - dealMath(base).net).toBeCloseTo(6 / 1.04, 8);
  });
  it("uses baseline land receipts when neither proposal is built", () => {
    const r = dealMath({ ...DEFAULT_INPUTS, buildWithPct: 0, buildWithoutPct: 0, baselineM: 1, discountPct: 0 });
    expect(r.evSign).toBe(30);
    expect(r.evHold).toBe(30);
    expect(r.net).toBe(0);
  });
  it("does not invent a normal threshold when a taxed facility is worse than baseline", () => {
    expect(dealMath({ ...DEFAULT_INPUTS, serviceCostM: 100 }).breakEvenP).toBeNull();
    expect(dealMath({ ...DEFAULT_INPUTS, feeM: 100 }).breakEvenP).toBeGreaterThan(1);
  });
  it("reproduces the 2021 Wasco agreement's illustrative annual payment and floor", () => {
    // Agreement Exhibit A: $600M at 1.10%, project 1 at 50%, minimum $3M.
    // Validation of contract arithmetic only, not actual assessed value or collections.
    const example = { ...DEFAULT_INPUTS, taxableValueM: 600, paymentMode: "share" as const,
      paymentSharePct: 50, minimumPaymentM: 3, upfrontM: 0 };
    expect(dealMath(example).rows[0].fullTaxM).toBeCloseTo(6.6);
    expect(dealMath(example).rows[0].dealPropertyM).toBeCloseTo(3.3);
    expect(dealMath({ ...example, taxableValueM: 400 }).rows[0].dealPropertyM).toBe(3);
    expect(dealMath({ ...example, paymentSharePct: 60 }).rows[0].dealPropertyM).toBeCloseTo(3.96);
  });
  it("makes the threshold and expected comparison agree", () => {
    const r = dealMath(DEFAULT_INPUTS);
    expect(r.breakEvenP).not.toBeNull();
    expect(dealMath({ ...DEFAULT_INPUTS, buildWithoutPct: r.breakEvenP! * 100 }).net).toBeCloseTo(0, 8);
  });
  it("exports assumptions and annual flows without mixing ledgers", () => {
    const csv = cashFlowCsv({ ...DEFAULT_INPUTS, horizonYears: 15 }, "local");
    expect(csv).toContain('"horizonYears":15');
    expect(csv).toContain("ledger=local");
    expect(csv.split("\n").filter(line => /^\d+,/.test(line))).toHaveLength(15);
  });
  it("rejects invalid model inputs and handles a zero discount rate", () => {
    expect(annuity(0, 30)).toBe(30);
    expect(() => dealMath({ ...DEFAULT_INPUTS, buildWithoutPct: 101 })).toThrow();
    expect(() => dealMath({ ...DEFAULT_INPUTS, feeM: Number.NaN })).toThrow();
  });
});
