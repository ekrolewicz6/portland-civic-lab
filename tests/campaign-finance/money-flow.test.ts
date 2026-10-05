import { describe, it, expect } from "vitest";
import { activeStart, addDays, axisTicks, buildPanel, clipToWindow, cumulative, daysBetween, lastValue, nearestLine, niceCeiling, position, stepPath, valueAt, SERIES_COLORS, type MoneyPoint, type PlotLine } from "@/lib/campaign-finance/money-flow";

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

  it("places days and month labels on the time axis", () => {
    expect(position("2025-01-01", "2025-01-01", "2026-01-01")).toBe(0);
    expect(position("2026-01-01", "2025-01-01", "2026-01-01")).toBe(1);
    expect(daysBetween("2025-10-01", "2026-10-04")).toBe(368);
    expect(addDays("2025-10-01", 368)).toBe("2026-10-04");
    // About a year: one label a quarter, with the year on the first label and on January.
    expect(axisTicks("2025-10-01", "2026-10-04")).toEqual([
      { day: "2025-10-01", label: "Oct", year: "2025" }, { day: "2026-01-01", label: "Jan", year: "2026" }, { day: "2026-04-01", label: "Apr" }, { day: "2026-07-01", label: "Jul" }, { day: "2026-10-01", label: "Oct" },
    ]);
    const labels = (start: string, end: string) => axisTicks(start, end).map((t) => t.year ? `${t.label} ${t.year}` : t.label);
    // Close to two years: January and July.
    expect(labels("2025-01-01", "2026-10-04")).toEqual(["Jan 2025", "Jul", "Jan 2026", "Jul"]);
    // A few months: every month. A window that opens mid-quarter still puts the year on its first label.
    expect(labels("2026-05-01", "2026-10-04")).toEqual(["May 2026", "Jun", "Jul", "Aug", "Sep", "Oct"]);
    expect(labels("2025-09-01", "2026-10-04")).toEqual(["Oct 2025", "Jan 2026", "Apr", "Jul", "Oct"]);
  });

  it("starts the chart in the month the money first reaches two percent of its total", () => {
    const slow: MoneyPoint[] = [["2025-02-03", 500], ["2025-06-10", 1_000], ["2025-10-14", 3_000], ["2026-03-01", 60_000]];
    const late: MoneyPoint[] = [["2025-11-20", 2_000], ["2026-08-01", 40_000]];
    // Total 100,000. The running total is 1,000 through June and reaches 3,000 on October 14.
    expect(activeStart([slow, late])).toBe("2025-10-01");
    expect(activeStart([slow, late], 0.005)).toBe("2025-02-01");
    expect(activeStart([[], []])).toBeNull();
    expect(activeStart([[["2026-04-09", 100]]])).toBe("2026-04-01");
  });

  it("carries what a campaign had already raised into the window", () => {
    const points: MoneyPoint[] = [["2025-02-03", 500], ["2025-06-10", 1_000], ["2025-10-14", 3_000], ["2026-03-01", 60_000]];
    const clipped = clipToWindow(points, "2025-10-01");
    expect(clipped).toEqual({ carried: true, points: [[0, 1_000], [13, 3_000], [151, 60_000]] });
    // The line ends where the full line ends, so the legend total and the last point agree.
    expect(clipped.points.at(-1)![1]).toBe(lastValue(points));
    expect(clipToWindow(points, "2025-01-01")).toMatchObject({ carried: false, points: [[33, 500], [160, 1_000], [286, 3_000], [424, 60_000]] });
    expect(clipToWindow([["2025-03-01", 700]], "2025-10-01")).toEqual({ carried: true, points: [[0, 700]] });
    expect(clipToWindow([["2025-09-30", 100], ["2025-10-01", 300]], "2025-10-01")).toEqual({ carried: true, points: [[0, 300]] });
    expect(clipToWindow([], "2025-10-01")).toEqual({ carried: false, points: [] });
    expect(valueAt(clipped.points, 0)).toBe(1_000);
    expect(valueAt(clipped.points, 12)).toBe(1_000);
    expect(valueAt(clipped.points, 13)).toBe(3_000);
    expect(valueAt(clipped.points, 400)).toBe(60_000);
    expect(valueAt([[5, 100]], 2)).toBe(0);
  });

  it("draws a stepped line that rises from zero, or enters at its own height when carried", () => {
    const path = stepPath([[0, 500], [183, 1000]], 365, 1000);
    expect(path.startsWith("M0.0,300.0V150.0H")).toBe(true);
    expect(path.endsWith("V0.0")).toBe(true);
    expect(stepPath([[0, 500], [183, 1000]], 365, 1000, true).startsWith("M0.0,150.0H")).toBe(true);
    expect(stepPath([], 365, 1000)).toBe("");
  });

  it("finds the line under a pointer, including on a vertical rise", () => {
    // A 400 by 200 pixel plot covering 100 days and 1,000 cents: 4 pixels a day, 0.2 pixels a cent.
    const box = { width: 400, height: 200, span: 100, top: 1_000 };
    const high: PlotLine = { carried: true, points: [[0, 800], [100, 900]] };
    const jumps: PlotLine = { carried: false, points: [[10, 100], [50, 600], [80, 650]] };
    const lines = [high, jumps];
    // On the upper line's flat run, at day 25.
    expect(nearestLine(lines, 100, 41, box)).toMatchObject({ index: 0, offset: 25 });
    // Halfway up the second line's rise on day 50. Its flat runs are far away, and the rise is under the pointer.
    expect(nearestLine(lines, 200, 130, box)).toMatchObject({ index: 1, offset: 50, distance: 0 });
    // Past the second line's last record, the reading stays on that record.
    expect(nearestLine(lines, 330, 72, box)).toMatchObject({ index: 1, offset: 80 });
    // Before the second line begins, the reading is its first day.
    expect(nearestLine(lines, 4, 195, box)).toMatchObject({ index: 1, offset: 10 });
    // A flat run reports the day under the pointer and never the day of the next rise.
    expect(nearestLine(lines, 199, 181, box)).toMatchObject({ index: 1, offset: 49 });
    expect(nearestLine([{ carried: false, points: [] }], 10, 10, box)).toBeNull();
  });
});
