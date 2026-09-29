import { describe, expect, it } from "vitest";
import { DEAL_EXAMPLES } from "../src/lib/datacenters/examples";
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


describe("document-based examples and visual totals", () => {
  it("applies the Hillsboro fee ceiling and school payment only in their specified years", () => {
    const inp = DEAL_EXAMPLES.find(e => e.id === "hillsboro")!.inputs;
    const r = dealMath(inp);
    expect(r.rows[0].dealPropertyM).toBeCloseTo(6.6 * .33);
    expect(r.rows[2].dealPropertyM).toBeCloseTo(6.6 * .33);
    expect(r.rows[3].dealPropertyM).toBeCloseTo(6.6 * (.50 + .15));
    expect(r.rows[4].dealPropertyM).toBeCloseTo(6.6 * .65);
    expect(r.rows[5].dealPropertyM).toBeCloseTo(6.6);
  });
  it("keeps the two contract shares and upfront payments distinct", () => {
    const first = dealMath(DEAL_EXAMPLES[0].inputs);
    const second = dealMath(DEAL_EXAMPLES[1].inputs);
    expect(first.rows[0].dealPropertyM).toBeCloseTo(3.3 + 3);
    expect(second.rows[0].dealPropertyM).toBeCloseTo(3.96 + 3);
    expect(first.rows[1].dealPropertyM).toBeCloseTo(3.3);
    expect(second.rows[1].dealPropertyM).toBeCloseTo(3.96);
  });
  it("makes every chart endpoint agree with the comparison, including closure and costs", () => {
    for (const example of DEAL_EXAMPLES) {
      for (const ledger of ["local", "statewide"] as const) {
        const inp = { ...example.inputs, operatingYears: 20, serviceCostM: .8, constructionLocalM: 5, constructionStateM: 10, buildWithPct: 80 };
        const r = dealMath(inp, ledger);
        const last = r.timeline.at(-1)!;
        expect(last.deal).toBeCloseTo(r.evSign, 9);
        expect(last.noBreak).toBeCloseTo(r.evHold, 9);
        expect(dealMath({ ...inp, buildWithoutPct: r.breakEvenP! * 100 }, ledger).net).toBeCloseTo(0, 8);
      }
      expect(dealMath({ ...example.inputs, buildWithoutPct: 0 }).net).toBeGreaterThan(0);
      expect(dealMath({ ...example.inputs, buildWithoutPct: 100 }).net).toBeLessThan(0);
    }
  });
});
