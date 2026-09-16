import { describe, expect, it } from "vitest";
import {
  personalCost,
  projectedCost,
  simulateFundingPolicy,
  FUNDING_ASSUMPTIONS,
} from "@/lib/fpdr/engine";
import { HEADLINE, SPENDING_FY27 } from "@/lib/fpdr/data";

describe("household tax estimates", () => {
  it("keeps the certified base year and applies household growth only to future years", () => {
    const projection = projectedCost(350_000);
    expect(personalCost(350_000).annual).toBeCloseTo(1045.59, 2);
    expect(projection.rows[0].assessedValue).toBe(350_000);
    expect(projection.rows[1].assessedValue).toBe(360_500);
    expect(projection.rows[1].annual).toBeCloseTo(1150.2113, 4);
    expect(projection.rows[5].assessedValue).toBeCloseTo(405745.926005, 4);
    expect(projection.total).toBeCloseTo(7554.062875876741, 5);
  });
  it("separates a no-growth scenario from changing levy rates", () => {
    const projection = projectedCost(350_000, 0);
    expect(projection.rows.every((row) => row.assessedValue === 350_000)).toBe(
      true,
    );
    expect(projection.finalAnnual).toBeCloseTo(1262.87, 2);
    expect(projectedCost(0).total).toBe(0);
    expect(() => projectedCost(-1)).toThrow(RangeError);
    expect(() => projectedCost(350_000, 0.039)).toThrow(RangeError);
  });
  it("uses a defined citywide denominator and reconciles adopted program expenses", () => {
    expect(HEADLINE.shareOfCityLine).toBeCloseTo(279235522 / 868476000, 10);
    expect(
      SPENDING_FY27.reduce((sum, row) => sum + row.amount, 0) * 1e6,
    ).toBeCloseTo(258656860, 2);
  });
});

describe("illustrative funding scenarios", () => {
  it("does not create savings by shifting payments earlier at zero returns", () => {
    const sim = simulateFundingPolicy(0);
    expect(sim.lifetimeSavings).toBeCloseTo(0, 5);
    expect(sim.cumulativeCrossoverYear).toBeNull();
    expect(sim.crossoverYear).not.toBeNull();
  });
  it("counts bond interest as a real loss at zero investment returns", () => {
    const sim = simulateFundingPolicy(0, 200);
    const debtService =
      (200 * FUNDING_ASSUMPTIONS.bondRate) /
      (1 -
        (1 + FUNDING_ASSUMPTIONS.bondRate) ** -FUNDING_ASSUMPTIONS.bondYears);
    expect(sim.lifetimeSavings).toBeCloseTo(
      -(debtService * FUNDING_ASSUMPTIONS.bondYears - 200),
      5,
    );
    expect(sim.cumulativeCrossoverYear).toBeNull();
  });
  it("distinguishes annual from cumulative crossover and continues benefit payments after contributions end", () => {
    const sim = simulateFundingPolicy(0.07);
    expect(sim.cumulativeCrossoverYear!).toBeGreaterThan(sim.crossoverYear!);
    const crossing = sim.rows.find(
      (row) => row.year === sim.cumulativeCrossoverYear,
    )!;
    const preceding = sim.rows.find((row) => row.year === crossing.year - 1)!;
    expect(crossing.cumulativeReform).toBeLessThan(crossing.cumulativePayGo);
    expect(preceding.cumulativeReform).toBeGreaterThan(
      preceding.cumulativePayGo,
    );
    const last = sim.rows.at(-1)!;
    expect(last.cumulativeReform).toBeCloseTo(sim.lifetimeReform, 5);
    expect(
      sim.rows
        .filter((row) => row.year >= sim.contributionEndYear)
        .every((row) => row.reform === 0 && row.payGo > 0),
    ).toBe(true);
    expect(sim.rows.every((row) => row.trust >= 0)).toBe(true);
  });
});
