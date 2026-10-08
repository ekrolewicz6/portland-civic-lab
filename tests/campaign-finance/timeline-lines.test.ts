import { describe, it, expect } from "vitest";
import { nearestPoint, nearestPolyline, readingText, rowAt, sameAmount, stepReading, weekRange, type LinePoint } from "@/lib/campaign-finance/timeline-lines";

const flat = (y: number, xs = [0, 100, 200]): LinePoint[] => xs.map((x) => ({ x, y }));
const weeks = ["2026-08-31", "2026-09-07", "2026-09-14", "2026-09-21"];
const line = (id: string, starts = weeks) => ({ id, rows: starts.map((weekStart) => ({ weekStart })) });

describe("timeline line reading", () => {
  it("measures a pointer against the sloped segments that are drawn", () => {
    const rising: LinePoint[] = [{ x: 0, y: 100 }, { x: 100, y: 0 }];
    // Halfway up the slope the pointer is on the rising line, though a flat line is closer at either week.
    expect(nearestPolyline([flat(80), rising], 50, 50)).toEqual({ index: 1, distance: 0 });
    expect(nearestPolyline([flat(80), rising], 50, 78)!.index).toBe(0);
    // Past the end of a line the distance runs to its last point.
    expect(nearestPolyline([flat(10)], 230, 50)!.distance).toBeCloseTo(50);
    expect(nearestPolyline([[{ x: 5, y: 5 }]], 8, 9)).toEqual({ index: 0, distance: 5 });
  });

  it("gives a tie to the line painted on top, and skips lines with nothing drawn", () => {
    expect(nearestPolyline([flat(40), flat(40), []], 50, 44)).toEqual({ index: 1, distance: 4 });
    expect(nearestPolyline([[], []], 50, 44)).toBeNull();
    expect(nearestPolyline([], 50, 44)).toBeNull();
  });

  it("holds the line being read until another is clearly closer", () => {
    const pair = [flat(40), flat(44)];
    expect(nearestPolyline(pair, 50, 43)!.index).toBe(1);
    expect(nearestPolyline(pair, 50, 43, 0)).toEqual({ index: 0, distance: 3 });
    expect(nearestPolyline(pair, 50, 48, 0)!.index).toBe(1);
    // A line that is no longer drawn cannot be held.
    expect(nearestPolyline([flat(40), []], 50, 43, 1)!.index).toBe(0);
  });

  it("reads the week under the pointer", () => {
    expect(nearestPoint(flat(0), -30)).toBe(0);
    expect(nearestPoint(flat(0), 49)).toBe(0);
    expect(nearestPoint(flat(0), 51)).toBe(1);
    expect(nearestPoint(flat(0), 900)).toBe(2);
  });

  it("keeps a reading on its week, or the closest earlier one once a filter drops that week", () => {
    const rows = line("a").rows;
    expect(rowAt(rows, "2026-09-14")).toBe(2);
    expect(rowAt(rows, "2026-09-10")).toBe(1);
    expect(rowAt(rows, "2025-01-06")).toBe(0);
    expect(rowAt(rows, "2027-01-04")).toBe(3);
  });

  it("moves with the keys: weeks sideways, candidates up and down", () => {
    const lines = [line("a"), line("b"), line("c", weeks.slice(0, 2))];
    // Any first arrow starts on the first line's latest week.
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"]) expect(stepReading(lines, null, key)).toEqual({ id: "a", week: "2026-09-21" });
    const at = { id: "a", week: "2026-09-14" };
    expect(stepReading(lines, at, "ArrowLeft")).toEqual({ id: "a", week: "2026-09-07" });
    expect(stepReading(lines, at, "ArrowRight")).toEqual({ id: "a", week: "2026-09-21" });
    expect(stepReading(lines, { id: "a", week: "2026-09-21" }, "ArrowRight")).toEqual({ id: "a", week: "2026-09-21" });
    expect(stepReading(lines, at, "PageUp")).toEqual({ id: "a", week: "2026-08-31" });
    expect(stepReading(lines, at, "Home")).toEqual({ id: "a", week: "2026-08-31" });
    expect(stepReading(lines, at, "End")).toEqual({ id: "a", week: "2026-09-21" });
    expect(stepReading(lines, at, "ArrowDown")).toEqual({ id: "b", week: "2026-09-14" });
    expect(stepReading(lines, at, "ArrowUp")).toEqual({ id: "c", week: "2026-09-07" });
    expect(stepReading(lines, { id: "c", week: "2026-09-07" }, "ArrowDown")).toEqual({ id: "a", week: "2026-09-07" });
    expect(stepReading(lines, at, "a")).toBeNull();
  });

  it("has nothing to step to when no line is drawn", () => {
    expect(stepReading([], null, "ArrowDown")).toBeNull();
    expect(stepReading([line("a", [])], null, "ArrowLeft")).toBeNull();
    // A pinned candidate who was unticked starts over on the first line.
    expect(stepReading([line("b")], { id: "a", week: "2026-09-07" }, "ArrowLeft")).toEqual({ id: "b", week: "2026-09-21" });
  });

  it("writes a week in words", () => {
    expect(weekRange("2026-09-14", "2026-09-20")).toBe("Sep 14 to 20, 2026");
    expect(weekRange("2026-08-31", "2026-09-06")).toBe("Aug 31 to Sep 6, 2026");
    expect(weekRange("2025-12-29", "2026-01-04")).toBe("Dec 29, 2025 to Jan 4, 2026");
    expect(weekRange("2026-09-28", "2026-09-28")).toBe("Sep 28, 2026");
    expect(readingText("weekly", "$2,297.80", "2026-09-14", "2026-09-20")).toBe("$2,297.80 in the week of Sep 14 to 20, 2026");
    expect(readingText("cumulative", "$0.00", "2026-09-14", "2026-09-20")).toBe("$0.00 in total through the week of Sep 14 to 20, 2026");
  });

  it("names up to three lines on the same amount and counts a longer list", () => {
    expect(sameAmount([])).toBe("");
    expect(sameAmount(["Avery"])).toBe("Same amount: Avery");
    expect(sameAmount(["Avery", "Blake"])).toBe("Same amount: Avery and Blake");
    expect(sameAmount(["Avery", "Blake", "Casey"])).toBe("Same amount: Avery, Blake, and Casey");
    expect(sameAmount(["Avery", "Blake", "Casey", "Devon"])).toBe("Same amount: 4 other candidates");
  });
});
