/**
 * Build the app-facing dataset.
 *
 *   npx tsx ingest/budget/build-dataset.ts
 *
 * Writes:
 *   src/data/budget/fy2026-27.json  — full detail, imported by SERVER
 *                                     components only (never a client bundle)
 *   src/lib/city-budget/summary.ts  — the headline numbers, small and
 *                                     reviewable, so changing one is always a
 *                                     readable git diff
 *
 * Refuses to write unless reconciliation passes with zero errors.
 */

import fs from "node:fs";
import path from "node:path";
import { PARSED_DIR, YEARS, FY, BOOK_TITLE, PUBLISHER, SOURCES, LOCK_PATH } from "./sources";
import type { Fund, ServiceAreaSummary } from "./parse-vol1-funds";
import type { Program } from "./parse-vol2-programs";
import type { CitywideFigure } from "./parse-citywide";
import { reconcile, type Finding } from "./reconcile";
import { slugify } from "./lib/labels";
import type { Values } from "./lib/numbers";

const OUT_JSON = "src/data/budget/fy2026-27.json";
const OUT_TS = "src/lib/city-budget/summary.ts";

const read = <T>(f: string): T => JSON.parse(fs.readFileSync(`${PARSED_DIR}/${f}`, "utf8")) as T;

const funds = read<Fund[]>("funds.json");
const programs = read<Program[]>("programs.json");
const summaries = read<ServiceAreaSummary[]>("service-area-summaries.json");
const citywide = read<CitywideFigure[]>("citywide.json");

const findings = reconcile(funds, programs, summaries, citywide);
const errors = findings.filter((f) => f.severity === "error" && !f.passed);
if (errors.length) {
  console.error("Reconciliation has errors — refusing to build.");
  for (const e of errors) console.error(`  ${e.id} ${e.title}`);
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));

// ── flatten to the shapes the app actually needs ────────────────────
const CUR = 3; // FY2026-27 adopted

const requirements = citywide.find((c) => /Requirements by Major Object/i.test(c.title));
const resources = citywide.find((c) => /Resources by Major Object/i.test(c.title));

/** Roll programs up to bureaus and service areas. */
interface BureauRow {
  slug: string;
  name: string;
  serviceArea: string;
  values: Values;
  fte: Values;
  programCount: number;
}
const bureauMap = new Map<string, BureauRow>();
for (const p of programs) {
  const slug = slugify(p.bureau);
  const b = bureauMap.get(slug) ?? {
    slug,
    name: p.bureau,
    serviceArea: p.serviceArea,
    values: [0, 0, 0, 0] as Values,
    fte: [0, 0, 0, 0] as Values,
    programCount: 0,
  };
  for (let i = 0; i < 4; i++) {
    b.values[i] = (b.values[i] ?? 0) + (p.expenseGrandTotal[i] ?? 0);
    b.fte[i] = Math.round(((b.fte[i] ?? 0) + (p.fteTotal[i] ?? 0)) * 100) / 100;
  }
  b.programCount++;
  bureauMap.set(slug, b);
}

/** Expense class totals across all programs, per year. */
const classTotals: Record<string, Values> = {};
for (const p of programs) {
  for (const e of p.expenses) {
    if (e.isTotal || !e.class) continue;
    const v = (classTotals[e.class] ??= [0, 0, 0, 0]);
    for (let i = 0; i < 4; i++) v[i] = (v[i] ?? 0) + (e.values[i] ?? 0);
  }
}

/**
 * Citywide revenue/expense by object for ALL FOUR years, aggregated from the
 * fund detail. The City's own Figure 6/7 tables only print two years, so
 * without this the diagram would have nothing to show for the actuals years —
 * and silently reusing the prior-year column would be worse than showing
 * nothing.
 */
const yearlyObjects = (() => {
  const rev = new Map<string, Values>();
  const exp = new Map<string, Values>();
  const add = (m: Map<string, Values>, label: string, v: Values) => {
    const cur = m.get(label) ?? ([0, 0, 0, 0] as Values);
    for (let i = 0; i < 4; i++) cur[i] = (cur[i] ?? 0) + (v[i] ?? 0);
    m.set(label, cur);
  };
  for (const f of funds) {
    for (const l of f.revenues) {
      if (l.isTotal || l.depth === 0) continue;
      if (/^(external|internal) revenues$/i.test(l.label)) continue;
      add(rev, l.label, l.values);
    }
    for (const l of f.expenses) {
      if (l.isTotal || l.depth === 0) continue;
      add(exp, l.label, l.values);
    }
  }
  return {
    revenues: Object.fromEntries(rev),
    expenses: Object.fromEntries(exp),
  };
})();

const dataset = {
  fy: FY,
  yearlyObjects,
  documentTitle: BOOK_TITLE,
  publisher: PUBLISHER,
  years: YEARS,
  extractedAt: new Date().toISOString().slice(0, 10),
  sources: SOURCES.filter((s) => s.parse).map((s) => ({
    volume: s.volume,
    title: s.title,
    url: s.url,
    sha256: lock.files[s.key]?.sha256 ?? null,
    pages: lock.files[s.key]?.pages ?? null,
  })),
  citywide: {
    requirements: requirements ?? null,
    resources: resources ?? null,
  },
  funds: funds.map((f) => ({
    slug: f.slug,
    name: f.name,
    serviceArea: f.serviceArea,
    pages: f.pages,
    summaryOnly: f.summaryOnly ?? false,
    revenues: f.revenues.filter((l) => !l.isTotal),
    expenses: f.expenses.filter((l) => !l.isTotal),
    revenueGrandTotal: f.revenueGrandTotal,
    expenseGrandTotal: f.expenseGrandTotal,
  })),
  programs: programs.map((p) => ({
    slug: p.slug,
    name: p.name,
    serviceArea: p.serviceArea,
    bureau: p.bureau,
    bureauSlug: slugify(p.bureau),
    pages: p.pages,
    description: p.description,
    expenses: p.expenses.filter((e) => !e.isTotal && e.class),
    total: p.expenseGrandTotal,
    fte: p.fteTotal,
    funding: p.funding.filter((f) => f.fundName),
  })),
  bureaus: [...bureauMap.values()].sort((a, b) => (b.values[CUR] ?? 0) - (a.values[CUR] ?? 0)),
  classTotals,
  serviceAreaSummaries: summaries,
  reconciliation: findings,
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(dataset));

// ── the small, reviewable summary module ────────────────────────────
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
const gross = sum(funds.map((f) => f.expenseGrandTotal[CUR] ?? 0));
const grossPrior = requirements?.grandTotal?.prior ?? 0;
const externalRevenue =
  resources?.rows.find((r) => /^External Revenues$/i.test(r.label))?.current ?? 0;
const beginningBalance =
  resources?.rows.find((r) => /^Beginning Fund Balance$/i.test(r.label))?.current ?? 0;
const transfers =
  resources?.rows.find((r) => /^Fund Transfers - Revenue$/i.test(r.label))?.current ?? 0;
const interagency =
  resources?.rows.find((r) => /^Interagency Revenue$/i.test(r.label))?.current ?? 0;
const bureauExpense =
  requirements?.rows.find((r) => /^Bureau Expense$/i.test(r.label))?.current ?? 0;
const contingency =
  requirements?.rows.find((r) => /^Contingency$/i.test(r.label))?.current ?? 0;
const endingBalance =
  requirements?.rows.find((r) => /^Ending Fund Balance$/i.test(r.label))?.current ?? 0;
const reservedFuture =
  requirements?.rows.find((r) => /^Reserved for Future Expenditure$/i.test(r.label))?.current ?? 0;
const debtReserves =
  requirements?.rows.find((r) => /^Debt Service Reserves$/i.test(r.label))?.current ?? 0;
const debtService =
  requirements?.rows.find((r) => /^Debt Service$/i.test(r.label))?.current ?? 0;

const ts = `/**
 * Headline figures for the FY ${FY} City of Portland budget.
 *
 * GENERATED by ingest/budget/build-dataset.ts — do not edit by hand.
 * Every number the site states as fact reads from here, so a changed headline
 * always shows up as a small, reviewable diff.
 *
 * Source: ${BOOK_TITLE}, ${PUBLISHER}.
 * Reconciliation: ${findings.filter((f) => f.passed).length}/${findings.length} checks passed,
 * ${errors.length} errors.
 */

export const BUDGET_FY = "${FY}" as const;
export const BUDGET_DOC = ${JSON.stringify(BOOK_TITLE)};
export const BUDGET_PUBLISHER = ${JSON.stringify(PUBLISHER)};
export const EXTRACTED_AT = ${JSON.stringify(dataset.extractedAt)};

/** The City's own total, which counts internal transactions more than once. */
export const GROSS_TOTAL = ${gross};
export const GROSS_TOTAL_PRIOR = ${grossPrior};
export const YOY_CHANGE = ${gross - grossPrior};
export const YOY_PCT = ${((gross - grossPrior) / grossPrior) * 100};

/** Money genuinely arriving from outside the City this year. */
export const EXTERNAL_REVENUE = ${externalRevenue};
/** Carried over from prior years — not new money. */
export const BEGINNING_BALANCE = ${beginningBalance};
/** Moved between City funds; counted on both sides of the gross total. */
export const FUND_TRANSFERS = ${transfers};
/** One City bureau billing another; also counted twice. */
export const INTERAGENCY = ${interagency};

/** What bureaus actually spend running programs. */
export const BUREAU_EXPENSE = ${bureauExpense};
export const DEBT_SERVICE = ${debtService};
export const CONTINGENCY = ${contingency};
export const ENDING_BALANCE = ${endingBalance};
export const RESERVED_FUTURE = ${reservedFuture};
export const DEBT_RESERVES = ${debtReserves};

export const PROGRAM_COUNT = ${programs.length};
export const BUREAU_COUNT = ${bureauMap.size};
export const FUND_COUNT = ${funds.length};
export const SERVICE_AREA_COUNT = ${new Set(programs.map((p) => p.serviceArea)).size};
export const TOTAL_FTE = ${sum(programs.map((p) => p.fteTotal[CUR] ?? 0)).toFixed(2)};

export const SOURCE_DOCS = ${JSON.stringify(dataset.sources, null, 2)} as const;
`;

fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });
fs.writeFileSync(OUT_TS, ts);

const kb = (f: string) => (fs.statSync(f).size / 1024).toFixed(0);
console.log(`${OUT_JSON}  ${kb(OUT_JSON)} KB`);
console.log(`${OUT_TS}  ${kb(OUT_TS)} KB`);
console.log(`\nGross              $${gross.toLocaleString("en-US")}`);
console.log(`  − beginning bal  $${beginningBalance.toLocaleString("en-US")}`);
console.log(`  − transfers      $${transfers.toLocaleString("en-US")}`);
console.log(`  − interagency    $${interagency.toLocaleString("en-US")}`);
console.log(`  = external rev   $${externalRevenue.toLocaleString("en-US")}`);
console.log(`\nBureau expense     $${bureauExpense.toLocaleString("en-US")}`);
console.log(`Programs ${programs.length}  bureaus ${bureauMap.size}  funds ${funds.length}`);
console.log(`Reconciliation: ${findings.filter((f: Finding) => f.passed).length}/${findings.length} passed`);
