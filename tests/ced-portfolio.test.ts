import { describe, expect, it } from "vitest";
import {
  addDays,
  csvCell,
  decisionsCsv,
  EDITION,
  isActive,
  portfolio,
  statusExplanation,
  statusOf,
  stats,
  upcoming,
} from "../src/lib/ced/model";
import type { Decision } from "../src/lib/ced/types";
const example: Decision = {
  id: "example",
  initiative: "example",
  question: "A decision",
  authority: "Council",
  kind: "decision",
  expected: {
    label: "Q3 2026",
    start: "2026-07-01",
    end: "2026-09-30",
    precision: "quarter",
  },
  state: "unresolved",
  observed: "2026-08-17",
  checked: "2026-10-03",
  source: "example",
};
describe("CED timing and institutional memory", () => {
  it("retains quarter precision through the last day", () => {
    expect(statusOf(example, "2026-09-01")).toBe("Due");
    expect(statusOf(example, "2026-09-30")).toBe("Due");
    expect(statusOf(example, "2026-10-01")).toBe("Past expected date");
  });
  it("handles exact deadlines and does not auto-resolve after a date", () => {
    const d = {
      ...example,
      expected: {
        label: "Oct 6",
        start: "2026-10-06",
        end: "2026-10-06",
        precision: "day" as const,
      },
    };
    expect(statusOf(d, "2026-10-03")).toBe("Upcoming");
    expect(statusOf(d, "2026-10-06")).toBe("Due");
    expect(statusOf(d, "2026-10-07")).toBe("Past expected date");
    expect(d.state).toBe("unresolved");
  });
  it("does not invent a deadline for seasonal or missing timing", () => {
    expect(
      statusOf(
        {
          ...example,
          expected: { label: "Winter 2026–27", precision: "window" },
        },
        "2027-12-31",
      ),
    ).toBe("No public date found");
  });
  it("preserves a seasonal window while recording a later editorial check", () => {
    const d: Decision = {
      ...example,
      expected: {
        label: "Summer 2026",
        precision: "window",
        reviewedPastOn: "2026-10-03",
      },
    };
    expect(statusOf(d, "2026-09-01")).toBe("No public date found");
    expect(statusOf(d, "2026-10-03")).toBe("Past expected date");
    expect(d.expected.start).toBeUndefined();
    expect(d.expected.end).toBeUndefined();
    expect(statusExplanation(d, "2026-10-03")).toContain(
      "No resolution located",
    );
  });
  it("distinguishes expired evidence from a source review after a deadline", () => {
    expect(
      statusExplanation({ ...example, checked: "2026-08-17" }, "2026-10-03"),
    ).toContain("A new source check is needed");
    expect(statusExplanation(example, "2026-10-03")).toContain(
      "No resolution located",
    );
  });
  it("preserves resolved status forever", () => {
    expect(statusOf({ ...example, state: "resolved" }, "2035-01-01")).toBe(
      "Resolved",
    );
    expect(statusOf({ ...example, state: "superseded" }, "2035-01-01")).toBe(
      "Superseded",
    );
  });
  it("includes the exact 60-day edge and excludes history", () => {
    expect(addDays(EDITION, 60)).toBe("2026-12-02");
    const ids = upcoming(EDITION).map((d) => d.id);
    expect(ids).toContain("psu-agreement");
    expect(ids).toContain("arts-survey");
    expect(ids).not.toContain("moda-final");
    expect(ids).not.toContain("psu-direction");
  });
  it("separates decision counts from hearings and other milestones", () => {
    const s = stats(EDITION);
    expect(s.decisions + s.milestones).toBe(
      portfolio.decisions.filter(isActive).length,
    );
    expect(s.past).toBe(2);
  });
  it("corrects the specific stale decisions and preserves replacements", () => {
    for (const id of [
      "psu-direction",
      "albina-direction",
      "hps-study",
      "p5-operating-model",
      "p5-rfp",
    ])
      expect(portfolio.decisions.find((d) => d.id === id)?.state).toBe(
        "resolved",
      );
    expect(
      portfolio.decisions.find((d) => d.id === "central-old-hearing")
        ?.successor,
    ).toBe("central-hearing");
    expect(
      portfolio.decisions.find((d) => d.id === "climate-presentation")?.kind,
    ).toBe("milestone");
  });
});
describe("CED evidence integrity", () => {
  const sourceIds = new Set(portfolio.sources.map((s) => s.id));
  const initiativeIds = new Set(portfolio.initiatives.map((i) => i.id));
  const decisionIds = new Set(portfolio.decisions.map((d) => d.id));
  it("uses unique stable IDs", () => {
    expect(sourceIds.size).toBe(portfolio.sources.length);
    expect(initiativeIds.size).toBe(28);
    expect(decisionIds.size).toBe(portfolio.decisions.length);
  });
  it("has valid evidence and record links throughout", () => {
    for (const i of portfolio.initiatives) {
      expect(i.objective.length).toBeGreaterThan(10);
      expect(i.unknowns.length).toBeGreaterThan(0);
      for (const id of [
        i.recordSource,
        i.latest.source,
        i.next.source,
        ...i.sources,
        ...i.dependencies.map((d) => d.source),
        ...i.outcomes.map((o) => o.source),
      ])
        expect(sourceIds.has(id), `${i.id}: ${id}`).toBe(true);
      for (const dep of i.dependencies)
        if (dep.type === "sequence")
          expect(initiativeIds.has(dep.target)).toBe(true);
    }
    for (const d of portfolio.decisions) {
      expect(initiativeIds.has(d.initiative)).toBe(true);
      expect(sourceIds.has(d.source)).toBe(true);
      if (d.expected.start) {
        expect(d.expected.end).toBeDefined();
        expect(d.expected.start <= d.expected.end!).toBe(true);
      }
      if (d.state !== "unresolved") {
        expect(d.resolution).toBeDefined();
        expect(sourceIds.has(d.resolution!.source)).toBe(true);
        expect(d.resolution!.date <= d.checked).toBe(true);
      }
      if (d.successor) expect(decisionIds.has(d.successor)).toBe(true);
    }
    for (const c of portfolio.changes) {
      expect(initiativeIds.has(c.initiative)).toBe(true);
      expect(sourceIds.has(c.source)).toBe(true);
      expect(c.eventDate <= c.recorded).toBe(true);
    }
  });
  it("keeps financial meaning and overlap instead of computing a false total", () => {
    for (const f of portfolio.funding) {
      expect(initiativeIds.has(f.initiative)).toBe(true);
      expect(sourceIds.has(f.source)).toBe(true);
      expect(f.amount).toBeGreaterThan(0);
      expect(f.period.length).toBeGreaterThan(3);
      expect(f.overlap.length).toBeGreaterThan(20);
    }
    expect(portfolio.funding.find((f) => f.id === "moda-city")?.type).toBe(
      "proposal",
    );
    expect(portfolio.funding.find((f) => f.id === "psu-estimate")?.type).toBe(
      "estimate",
    );
    expect(portfolio.funding.find((f) => f.id === "metro-bond")?.amount).toBe(
      219000000,
    );
  });
  it("does not force arts access or children into economic KPIs", () => {
    expect(
      portfolio.initiatives.find((i) => i.id === "childrens-levy-small-grants")
        ?.outcomes,
    ).toHaveLength(0);
    expect(
      portfolio.initiatives.find((i) => i.id === "arts-access-accountability")
        ?.outcomes,
    ).toHaveLength(0);
  });
  it("discloses the arena conflict in both related entries", () => {
    expect(
      portfolio.initiatives.filter((i) => i.conflict).map((i) => i.id),
    ).toEqual(
      expect.arrayContaining([
        "moda-center-renovation-blazers-lease",
        "rose-quarter-district-development-partner",
      ]),
    );
  });
  it("exports complete history with dates and source links", () => {
    const csv = decisionsCsv(EDITION);
    expect(csv).toContain("Resolution date");
    expect(csv).toContain("37752");
    expect(csv).toContain("Superseded");
    expect(csv.split("\r\n")).toHaveLength(portfolio.decisions.length + 1);
  });
  it("quotes CSV correctly and neutralizes spreadsheet formulas", () => {
    expect(csvCell('A "quote"')).toBe('"A ""quote"""');
    expect(csvCell("=1+1")).toBe('"\'=1+1"');
  });
});
