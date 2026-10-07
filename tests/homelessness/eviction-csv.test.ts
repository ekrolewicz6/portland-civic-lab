import { describe, it, expect } from "vitest";
import { parseEvictionCsv } from "../../ingest/fetch-hsd-dashboard";

// Shape of Evicted in Oregon's Datawrapper CSV: an empty first header cell, "Total", then months without a year.
const csv = [
  "\tTotal\tNov\tDec\tJan\tFeb",
  "Oregon\t9459\t1884\t2574\t2750\t2241",
  "Multnomah*\t3965\t786\t1131\t1132\t916",
  "Benton\t100\t20\t30\t25\t25",
].join("\n") + "\n";

describe("Evicted in Oregon CSV", () => {
  it("dates each month column from the period the chart page states, across a year boundary", () => {
    const rows = parseEvictionCsv(csv, "November 2025", "February 2026");
    expect(rows.filter((r) => r.county === "Multnomah")).toEqual([
      { county: "Multnomah", month: "2025-11-01", filings: 786 },
      { county: "Multnomah", month: "2025-12-01", filings: 1131 },
      { county: "Multnomah", month: "2026-01-01", filings: 1132 },
      { county: "Multnomah", month: "2026-02-01", filings: 916 },
    ]);
    expect(rows.some((r) => r.county === "Oregon (statewide)")).toBe(true);
    expect(rows.some((r) => r.county === "Benton")).toBe(false);
  });

  it("refuses to load when the stated period does not match the columns", () => {
    expect(() => parseEvictionCsv(csv, "October 2025", "January 2026")).toThrow();
    expect(() => parseEvictionCsv(csv, "November 2025", "March 2026")).toThrow();
  });
});
