import { describe, expect, it } from "vitest";
import {
  COUNTY_PIT,
  DOUBLED_UP,
  PIT_WITH_KNOWN_RACE,
  RACE_COUNTS,
  RACIAL_DISPARITIES,
  SHELTER_BEDS,
  STUDENT_HOMELESSNESS,
  UNSHELTERED_CHANGE,
} from "../../ingest/homelessness/hrac-statewide-2025";

// Statewide totals printed in the report (Tables 1, 3, 17, 19 and 20). The full
// check against the PDF is ingest/homelessness/verify-hrac-statewide.ts.
const sum = (values: (number | null)[]) => values.reduce<number>((s, v) => s + (v ?? 0), 0);
const counties = COUNTY_PIT.map((r) => r[0]);

describe("HRAC 2025 statewide estimates", () => {
  it("covers all 36 counties in every county table, so statewide sums are whole", () => {
    expect(new Set(counties).size).toBe(36);
    for (const table of [UNSHELTERED_CHANGE, SHELTER_BEDS, STUDENT_HOMELESSNESS.filter((r) => r[0] !== "Statewide")])
      expect(table.map((r) => r[0]).sort()).toEqual([...counties].sort());
  });

  it("adds up to the report's statewide totals", () => {
    expect(sum(COUNTY_PIT.map((r) => r[2]))).toBe(10607);
    expect(sum(COUNTY_PIT.map((r) => r[3]))).toBe(16512);
    expect(sum(COUNTY_PIT.map((r) => r[4]))).toBe(27119);
    expect(sum(SHELTER_BEDS.map((r) => r[3]))).toBe(12607);
    expect(sum(UNSHELTERED_CHANGE.map((r) => r[1]))).toBe(13004);
    for (const row of COUNTY_PIT) expect(row[2] + row[3]).toBe(row[4]);
  });

  it("keeps the deduplicated statewide student count apart from the county rows", () => {
    expect(STUDENT_HOMELESSNESS.find((r) => r[0] === "Statewide")?.[2]).toBe(21122);
    // Students counted in two counties appear in both, so counties add up to more.
    expect(sum(STUDENT_HOMELESSNESS.filter((r) => r[0] !== "Statewide").map((r) => r[2]))).toBe(21386);
  });

  it("has doubled-up areas that add up to the statewide estimate", () => {
    const areas = DOUBLED_UP.filter((r) => r[0] !== "Statewide");
    expect(sum(areas.map((r) => r[1]))).toBe(DOUBLED_UP.find((r) => r[0] === "Statewide")?.[1]);
  });

  it("derives each group's share of the count from its people with known race", () => {
    expect(sum(Object.values(RACE_COUNTS).map(([u, s]) => u + s))).toBe(PIT_WITH_KNOWN_RACE);
    for (const [group, , pctPit] of RACIAL_DISPARITIES) {
      const [u, s] = RACE_COUNTS[group];
      expect(Math.round(((u + s) / PIT_WITH_KNOWN_RACE) * 1000) / 10).toBe(pctPit);
    }
  });

  it("shows only the disparity ratios HRAC states", () => {
    const stated = Object.fromEntries(RACIAL_DISPARITIES.filter((r) => r[3] !== null).map((r) => [r[0], r[3]]));
    expect(stated).toEqual({
      "American Indian, Alaska Native, or Indigenous": 6.92,
      "Native Hawaiian or Pacific Islander": 5.47,
      "Black, African American, or African": 5.08,
      Multiracial: 1,
      White: 0.89,
    });
  });
});
