import { describe, it, expect } from "vitest";
import { buildPanel, cumulative, lastValue, niceCeiling, position, quarterTicks, stepPath, SERIES_COLORS } from "@/lib/campaign-finance/money-flow";

describe("money-over-time helpers", () => {
  it("accumulates in date order and skips days with no money", () => {
    expect(cumulative([{ day: "2026-02-01", cents: 500 }, { day: "2026-01-01", cents: 100 }, { day: "2026-01-15", cents: 0 }])).toEqual([["2026-01-01", 100], ["2026-02-01", 600]]);
    expect(cumulative([])).toEqual([]);
    expect(lastValue([])).toBe(0);
  });

  it("orders a panel by money raised and keeps one color per candidate", () => {
    const flows = [
      { committee_id: "1", day: "2026-01-01", raised_cents: 100, matching_cents: 40, paid_cents: 0 },
      { committee_id: "2", day: "2026-01-02", raised_cents: 900, matching_cents: 0, paid_cents: 300 },
      { committee_id: "2", day: "2026-03-02", raised_cents: 0, matching_cents: 0, paid_cents: 200 },
    ];
    const panel = buildPanel("d", "District", [{ id: "1", name: "Avery" }, { id: "2", name: "Blake" }, { id: "3", name: "Casey" }], flows);
    expect(panel.series.map((s) => s.name)).toEqual(["Blake", "Avery", "Casey"]);
    expect(panel.series[0].paid).toEqual([["2026-01-02", 300], ["2026-03-02", 500]]);
    expect(panel.series[1].matchingCents).toBe(40);
    expect(panel.series[2].raised).toEqual([]);
    expect(panel.series.map((s) => s.color)).toEqual(SERIES_COLORS.slice(0, 3));
    expect(new Set(SERIES_COLORS).size).toBe(9);
    const fixed = buildPanel("g", "Governor", [{ id: "1", name: "Avery", color: "#000", dashed: true }], flows);
    expect(fixed.series[0]).toMatchObject({ color: "#000", dashed: true });
  });

  it("rounds an axis up to a readable ceiling", () => {
    expect(niceCeiling(28_818_115)).toBe(30_000_000);
    expect(niceCeiling(1_434_144_600)).toBe(1_500_000_000);
    expect(niceCeiling(20_892_641)).toBe(25_000_000);
    expect(niceCeiling(1_017_582_000)).toBe(1_200_000_000);
    expect(niceCeiling(100)).toBe(100);
    expect(niceCeiling(0)).toBe(100);
  });

  it("places days and quarter labels on the time axis", () => {
    expect(position("2025-01-01", "2025-01-01", "2026-01-01")).toBe(0);
    expect(position("2026-01-01", "2025-01-01", "2026-01-01")).toBe(1);
    const ticks = quarterTicks("2025-01-01", "2026-10-04");
    expect(ticks.map((t) => t.day)).toEqual(["2025-01-01", "2025-07-01", "2026-01-01", "2026-07-01"]);
    expect(ticks.filter((t) => !t.minor).map((t) => t.label)).toEqual(["Jan 2025", "Jan 2026"]);
  });

  it("draws a stepped line that starts at zero on the first day and ends on the last", () => {
    const path = stepPath([["2025-01-01", 500], ["2025-07-02", 1000]], "2025-01-01", "2026-01-01", 1000);
    expect(path.startsWith("M0.0,300.0V150.0H")).toBe(true);
    expect(path.endsWith("V0.0")).toBe(true);
    expect(stepPath([], "2025-01-01", "2026-01-01", 1000)).toBe("");
  });
});
