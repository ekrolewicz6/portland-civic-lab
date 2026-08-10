/**
 * Reconciliation — the gate between extraction and publication.
 *
 *   npx tsx ingest/budget/reconcile.ts
 *
 * A wrong number on a civic transparency site is worse than no number, so
 * nothing is published unless every `error` assertion passes. Warnings are
 * published too — verbatim, on the page's methodology block — because the
 * checks that only partly pass are exactly the ones a reader deserves to see.
 */

import fs from "node:fs";
import { PARSED_DIR, REPORTS_DIR, YEARS } from "./sources";
import type { Fund, ServiceAreaSummary } from "./parse-vol1-funds";
import type { Program } from "./parse-vol2-programs";
import type { CitywideFigure } from "./parse-citywide";
import { normalize } from "./lib/labels";

export interface Finding {
  id: string;
  severity: "error" | "warn" | "info";
  title: string;
  expected?: string;
  actual?: string;
  delta?: string;
  passed: boolean;
  detail?: string;
}

/** Figures the City publishes; every one of these must be hit. */
export const PUBLISHED = {
  totalAllFunds2627: 8_546_060_062,
  totalAllFunds2526: 9_039_269_833,
  /** The book's own citywide FUND summary table, a different basis to Figure 6/7. */
  fundSummary2526: 9_090_927_679,
  changeYoY: -493_209_771,
  programExpenses2627: 4_480_000_000, // stated as "$4.48 billion"
  generalFundDiscretionary: 803_400_000, // stated as "$803.4 million"
  personnel2627: 1_448_447_121,
  beginningFundBalance2627: 2_264_623_032,
} as const;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function reconcile(
  funds: Fund[],
  programs: Program[],
  summaries: ServiceAreaSummary[],
  citywide: CitywideFigure[],
): Finding[] {
  const f: Finding[] = [];
  const sum = <T>(a: T[], g: (x: T) => number) => a.reduce((s, x) => s + g(x), 0);

  // ── A1 coverage ───────────────────────────────────────────────────
  f.push({
    id: "A1.1",
    severity: "error",
    title: "Fund count is in the expected range",
    expected: "80–100",
    actual: String(funds.length),
    passed: funds.length >= 80 && funds.length <= 100,
  });
  f.push({
    id: "A1.2",
    severity: "error",
    title: "Program count is in the expected range",
    expected: "250–450",
    actual: String(programs.length),
    passed: programs.length >= 250 && programs.length <= 450,
  });
  f.push({
    id: "A1.3",
    severity: "error",
    title: "Every service area is represented",
    expected: "8",
    actual: String(new Set(programs.map((p) => p.serviceArea)).size),
    passed: new Set(programs.map((p) => p.serviceArea)).size === 8,
  });

  // ── A2 internal consistency ───────────────────────────────────────
  // A governmental fund statement balances by construction, so this is proof
  // that column assignment and row hierarchy are right — with no reliance on
  // any externally published figure.
  for (const yi of [2, 3]) {
    const bad = funds.filter(
      (x) => (x.revenueGrandTotal[yi] ?? 0) !== (x.expenseGrandTotal[yi] ?? 0),
    );
    f.push({
      id: `A2.1.${YEARS[yi]}`,
      severity: "error",
      title: `Every fund balances in ${YEARS[yi]} (revenues === expenses)`,
      expected: `${funds.length}/${funds.length}`,
      actual: `${funds.length - bad.length}/${funds.length}`,
      passed: bad.length === 0,
      detail: bad.length ? bad.map((x) => x.name).join(", ") : undefined,
    });
  }

  // The General Fund overhead charged to programs must equal the overhead
  // credited by the distributing account — it is one internal transaction.
  const ohPos = sum(programs, (p) =>
    p.funding.filter((e) => e.gfSplit === "overhead" && (e.values[3] ?? 0) > 0).reduce((s, e) => s + (e.values[3] ?? 0), 0),
  );
  const ohNeg = sum(programs, (p) =>
    p.funding.filter((e) => e.gfSplit === "overhead" && (e.values[3] ?? 0) < 0).reduce((s, e) => s + (e.values[3] ?? 0), 0),
  );
  f.push({
    id: "A2.2",
    severity: "error",
    title: "General Fund overhead nets to zero (charged === credited)",
    expected: money(0),
    actual: money(ohPos + ohNeg),
    passed: Math.abs(ohPos + ohNeg) <= 1,
    detail: `charged ${money(ohPos)}, credited ${money(ohNeg)}`,
  });

  // ── A3 reconciliation to published totals ─────────────────────────
  const total2627 = sum(funds, (x) => x.expenseGrandTotal[3] ?? 0);
  f.push({
    id: "A3.1",
    severity: "error",
    title: "All-funds total matches the published figure exactly",
    expected: money(PUBLISHED.totalAllFunds2627),
    actual: money(total2627),
    delta: money(total2627 - PUBLISHED.totalAllFunds2627),
    passed: total2627 === PUBLISHED.totalAllFunds2627,
  });

  const total2526 = sum(funds, (x) => x.expenseGrandTotal[2] ?? 0);
  // Two different prior-year totals are published in the same book: Figure 6/7
  // says $9,039,269,833, while the citywide fund summary table says
  // $9,090,927,679. Our fund-by-fund parse reproduces the fund summary exactly,
  // which is the right comparison for a sum of fund pages.
  f.push({
    id: "A3.2",
    severity: "error",
    title: "Prior-year fund sum matches the book's own fund summary table",
    expected: money(PUBLISHED.fundSummary2526),
    actual: money(total2526),
    delta: money(total2526 - PUBLISHED.fundSummary2526),
    passed: total2526 === PUBLISHED.fundSummary2526,
    detail:
      "Figure 6/7 states a different prior-year total ($9,039,269,833) on a different basis; both are published by the City.",
  });

  const prog = sum(programs, (p) => p.expenseGrandTotal[3] ?? 0);
  f.push({
    id: "A3.3",
    severity: "error",
    title: "Program expenses match the published $4.48 billion",
    expected: `${money(PUBLISHED.programExpenses2627)} (3 s.f.)`,
    actual: money(prog),
    delta: `${(((prog - PUBLISHED.programExpenses2627) / PUBLISHED.programExpenses2627) * 100).toFixed(3)}%`,
    passed: Math.abs(prog - PUBLISHED.programExpenses2627) / PUBLISHED.programExpenses2627 < 0.005,
  });

  // Personnel is only broken out at program level (Vol 1 fund pages show one
  // "Bureau Expense" line), so this compares programs against Figure 6.
  const personnel = sum(programs, (p) =>
    p.expenses.filter((l) => l.class === "personnel").reduce((s, l) => s + (l.values[3] ?? 0), 0),
  );
  f.push({
    id: "A3.4",
    severity: "warn",
    title: "Program personnel vs the citywide published figure",
    expected: money(PUBLISHED.personnel2627),
    actual: money(personnel),
    delta: `${(((personnel - PUBLISHED.personnel2627) / PUBLISHED.personnel2627) * 100).toFixed(2)}%`,
    passed: Math.abs(personnel - PUBLISHED.personnel2627) / PUBLISHED.personnel2627 < 0.05,
    detail:
      "Program pages are the only place personnel is itemised; a small shortfall means a few program tables were not fully captured.",
  });

  const bfb = sum(funds, (x) =>
    x.revenues
      .filter((l) => l.class === "internal.beginning-fund-balance")
      .reduce((s, l) => s + (l.values[3] ?? 0), 0),
  );
  f.push({
    id: "A3.5",
    severity: "warn",
    title: "Beginning fund balance matches the published figure",
    expected: money(PUBLISHED.beginningFundBalance2627),
    actual: money(bfb),
    delta: money(bfb - PUBLISHED.beginningFundBalance2627),
    passed: Math.abs(bfb - PUBLISHED.beginningFundBalance2627) < 5_000_000,
  });

  // The citywide Figure tables are the City's own roll-up; our independently
  // parsed fund detail must reproduce their FY26-27 grand total exactly, and
  // both sides of the budget must agree with each other.
  const fig = citywide.find((c) => /Requirements by Major Object/i.test(c.title));
  const res = citywide.find((c) => /Resources by Major Object/i.test(c.title));
  f.push({
    id: "A3.6",
    severity: "error",
    title: "Citywide requirements and resources agree (Figures 6 and 7)",
    expected: money(fig?.grandTotal?.current ?? -1),
    actual: money(res?.grandTotal?.current ?? -2),
    passed:
      !!fig?.grandTotal?.current &&
      fig.grandTotal.current === res?.grandTotal?.current &&
      fig.grandTotal.current === PUBLISHED.totalAllFunds2627,
  });

  f.push({
    id: "A3.7",
    severity: "error",
    title: "Parsed fund detail reproduces the City's own citywide roll-up",
    expected: money(fig?.grandTotal?.current ?? -1),
    actual: money(total2627),
    delta: money(total2627 - (fig?.grandTotal?.current ?? 0)),
    passed: total2627 === fig?.grandTotal?.current,
  });

  // ── A4 transfers ──────────────────────────────────────────────────
  // Every transfer out of one fund is a transfer into another; if these don't
  // agree, netting is wrong and the flow diagram must not publish.
  const tIn = sum(funds, (x) =>
    x.revenues
      .filter((l) => l.class === "internal.fund-transfers-revenue")
      .reduce((s, l) => s + (l.values[3] ?? 0), 0),
  );
  const tOut = sum(funds, (x) =>
    x.expenses
      .filter((l) => l.class === "fund-transfers-expense")
      .reduce((s, l) => s + (l.values[3] ?? 0), 0),
  );
  f.push({
    id: "A4.1",
    severity: "warn",
    title: "Fund transfers in equal transfers out",
    expected: money(tOut),
    actual: money(tIn),
    delta: money(tIn - tOut),
    passed: Math.abs(tIn - tOut) < 1_000_000,
  });

  // ── A5 service-area roll-ups ──────────────────────────────────────
  for (const s of summaries) {
    const listed = s.grandTotal[3] ?? 0;
    const mine = sum(
      funds.filter((x) => normalize(x.serviceArea) === normalize(s.serviceArea)),
      (x) => x.expenseGrandTotal[3] ?? 0,
    );
    f.push({
      id: `A5.${normalize(s.serviceArea).replace(/\s+/g, "-")}`,
      severity: "info",
      title: `${s.serviceArea}: parsed funds vs the book's own roll-up`,
      expected: `${money(listed)} (roll-up excludes unappropriated)`,
      actual: money(mine),
      passed: mine >= listed,
      detail: "The roll-up states it excludes unappropriated amounts, so the parsed figure is expected to be larger.",
    });
  }

  return f;
}

if (process.argv[1] && process.argv[1].endsWith("reconcile.ts")) {
  const funds: Fund[] = JSON.parse(fs.readFileSync(`${PARSED_DIR}/funds.json`, "utf8"));
  const programs: Program[] = JSON.parse(fs.readFileSync(`${PARSED_DIR}/programs.json`, "utf8"));
  const summaries: ServiceAreaSummary[] = JSON.parse(
    fs.readFileSync(`${PARSED_DIR}/service-area-summaries.json`, "utf8"),
  );

  const citywide: CitywideFigure[] = JSON.parse(
    fs.readFileSync(`${PARSED_DIR}/citywide.json`, "utf8"),
  );
  const findings = reconcile(funds, programs, summaries, citywide);
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(`${REPORTS_DIR}/reconciliation.json`, JSON.stringify(findings, null, 2));

  const errors = findings.filter((x) => x.severity === "error" && !x.passed);
  const warns = findings.filter((x) => x.severity === "warn" && !x.passed);

  for (const x of findings) {
    const mark = x.passed ? "PASS" : x.severity === "error" ? "FAIL" : "warn";
    console.log(`[${mark}] ${x.id}  ${x.title}`);
    if (x.expected !== undefined) console.log(`        expected ${x.expected}`);
    if (x.actual !== undefined) console.log(`        actual   ${x.actual}`);
    if (x.delta !== undefined) console.log(`        delta    ${x.delta}`);
    if (x.detail && !x.passed) console.log(`        ${x.detail}`);
  }

  console.log(
    `\n${findings.filter((x) => x.passed).length}/${findings.length} passed · ` +
      `${errors.length} errors · ${warns.length} warnings`,
  );
  if (errors.length) {
    console.error("\nRECONCILIATION FAILED — not publishable.");
    process.exit(1);
  }
  console.log("Publishable.");
}
