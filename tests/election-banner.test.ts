import { describe, expect, it } from "vitest";
import { daysUntilElection, electionBannerLabel } from "@/lib/election";

describe("election banner", () => {
  it("counts whole Pacific days to Election Day", () => {
    expect(daysUntilElection(new Date("2026-09-19T12:00:00-07:00"))).toBe(45);
    expect(electionBannerLabel(new Date("2026-09-19T12:00:00-07:00"))).toBe("45 days until Election Day");
    // 05:00 UTC on Nov 3 is still the evening of Nov 2 in Portland.
    expect(electionBannerLabel(new Date("2026-11-03T05:00:00Z"))).toBe("Election Day is tomorrow");
    expect(electionBannerLabel(new Date("2026-11-03T09:00:00-08:00"))).toBe("Election Day is today. Ballots are due by 8 p.m.");
  });
  it("retires once polls close at 8 p.m. Pacific", () => {
    expect(electionBannerLabel(new Date("2026-11-03T19:59:00-08:00"))).not.toBeNull();
    expect(electionBannerLabel(new Date("2026-11-03T20:00:00-08:00"))).toBeNull();
    expect(electionBannerLabel(new Date("2027-01-01T00:00:00Z"))).toBeNull();
  });
});
