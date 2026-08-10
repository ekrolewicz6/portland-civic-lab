/**
 * Vol 1 -> funds.json
 *
 *   npx tsx ingest/budget/parse-vol1-funds.ts
 *
 * Vol 1 is organized Service Area > Fund. Each fund carries "Revenues by Major
 * Object" and "Expenses by Major Object" over the same four year columns.
 *
 * Because a governmental fund statement balances by construction, revenue and
 * expense grand totals must agree per fund per year. That gives ~80 funds x 4
 * years of independent proof that column assignment and row hierarchy are
 * right, without needing any externally published figure.
 */

import fs from "node:fs";
import { TEXT_DIR, PARSED_DIR, YEARS } from "./sources";
import { splitPages, topLines, type Page } from "./lib/pages";
import { parseTable, alignToYears, type SourceLine, type Table } from "./lib/table";
import { classifyRevenue, classifyExpense, slugify, normalize } from "./lib/labels";
import { emptyValues, addValues, type Values } from "./lib/numbers";

export interface FundLine {
  label: string;
  depth: number;
  class: string | null;
  isTotal: boolean;
  values: Values;
  page: number;
}

export interface Fund {
  slug: string;
  name: string;
  serviceArea: string;
  pages: number[];
  revenues: FundLine[];
  expenses: FundLine[];
  revenueGrandTotal: Values;
  expenseGrandTotal: Values;
  /**
   * True when the fund appears only in a service-area summary table and has no
   * detail page of its own. Observed for Fire Special Revenue Fund
   * ($1,460,000 in FY26-27) — omitting it would miss the published total by
   * exactly that amount.
   */
  summaryOnly?: boolean;
}

/** A "<Service Area> Service Area Funds / Expenses by Fund" table. */
export interface ServiceAreaSummary {
  serviceArea: string;
  page: number;
  /** NOTE: these tables state they exclude unappropriated funds. */
  funds: { name: string; values: Values }[];
  grandTotal: Values;
}

const REV_HDR = /^Revenues?\s+by\s+Major\s+Object\s*$/i;
const EXP_HDR = /^Expenses?\s+by\s+Major\s+Object\s*$/i;

/** "Citywide> General Reserve Fund" or "Public Works > Water Fund" */
function parseFundHeader(p: Page): { serviceArea: string; fund: string } | null {
  for (const l of topLines(p, 5)) {
    const m = l.match(/^(.+?)\s*>\s*(.+)$/);
    if (!m) continue;
    const serviceArea = m[1].trim();
    const fund = m[2].trim();
    if (!serviceArea || !fund) continue;
    if (/City of Portland Fiscal Year/i.test(serviceArea)) continue;
    return { serviceArea, fund };
  }
  return null;
}

function findSection(lines: SourceLine[], re: RegExp): number {
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i].text.trim())) return i;
  }
  return -1;
}

function toLines(pages: Page[]): SourceLine[] {
  const out: SourceLine[] = [];
  for (const p of pages) {
    p.lines.forEach((text) => out.push({ text, page: p.n, idx: out.length }));
  }
  return out;
}

function rowsFrom(t: Table | null, kind: "rev" | "exp"): { lines: FundLine[]; total: Values } {
  if (!t) return { lines: [], total: emptyValues() };
  const al = alignToYears(t, YEARS);
  const lines = t.rows.map((r) => ({
    label: r.label,
    depth: r.depth,
    class: kind === "rev" ? classifyRevenue(r.label) : classifyExpense(r.label),
    isTotal: r.isTotal,
    values: al.values(r),
    page: r.page,
  }));

  // Some funds (General Fund, Transportation Operating) print no Grand Total
  // row. Derive it from the top-level rows — and the per-fund balance check
  // then independently confirms the derivation.
  let total = al.grandTotal;
  if (!total && lines.length) {
    const top = Math.min(...lines.map((l) => l.depth));
    total = lines
      .filter((l) => l.depth === top)
      .reduce<Values>((acc, l) => addValues(acc, l.values), emptyValues());
  }
  return { lines, total: total ?? emptyValues() };
}

const SA_TITLE = /^(.+?)\s+Service Area Funds\s*$/i;
const EXP_BY_FUND = /^Expenses?\s+by\s+Fund\s*$/i;

/** Service-area roll-up tables: "<Area> Service Area Funds" + "Expenses by Fund". */
function parseServiceAreaSummaries(pages: Page[]): ServiceAreaSummary[] {
  const out: ServiceAreaSummary[] = [];
  for (const p of pages) {
    const title = topLines(p, 3)
      .map((l) => l.match(SA_TITLE)?.[1])
      .find(Boolean);
    if (!title) continue;
    const lines: SourceLine[] = p.lines.map((text, idx) => ({ text, page: p.n, idx }));
    const at = findSection(lines, EXP_BY_FUND);
    if (at < 0) continue;
    const t = parseTable(lines, at);
    if (!t) continue;
    const al = alignToYears(t, YEARS);
    out.push({
      serviceArea: title.trim(),
      page: p.n,
      funds: t.rows.filter((r) => !r.isTotal).map((r) => ({ name: r.label, values: al.values(r) })),
      grandTotal: al.grandTotal ?? emptyValues(),
    });
  }
  return out;
}

export function parseVol1(): {
  funds: Fund[];
  summaries: ServiceAreaSummary[];
  orphanCount: number;
  unclassified: string[];
} {
  const pages = splitPages(fs.readFileSync(`${TEXT_DIR}/vol1-layout.txt`, "utf8"));

  // Group consecutive pages by fund header.
  const groups: { key: string; serviceArea: string; fund: string; pages: Page[] }[] = [];
  for (const p of pages) {
    const h = parseFundHeader(p);
    if (!h) continue;
    // Only fund-detail pages carry a Revenues-by-Major-Object table.
    const key = `${h.serviceArea} > ${h.fund}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.pages.push(p);
    else groups.push({ key, serviceArea: h.serviceArea, fund: h.fund, pages: [p] });
  }

  const funds: Fund[] = [];
  const unclassified = new Set<string>();
  let orphanCount = 0;

  for (const g of groups) {
    const lines = toLines(g.pages);
    const revAt = findSection(lines, REV_HDR);
    const expAt = findSection(lines, EXP_HDR);
    if (revAt < 0 || expAt < 0) continue; // narrative or summary page, not a fund

    const revTable = parseTable(lines, revAt, expAt > revAt ? expAt : lines.length);
    const expTable = parseTable(lines, expAt);
    orphanCount += (revTable?.orphans.length ?? 0) + (expTable?.orphans.length ?? 0);

    const rev = rowsFrom(revTable, "rev");
    const exp = rowsFrom(expTable, "exp");
    if (!rev.lines.length && !exp.lines.length) continue;

    for (const l of [...rev.lines, ...exp.lines]) {
      if (!l.class && !l.isTotal && l.depth > 0) unclassified.add(l.label);
    }

    funds.push({
      slug: slugify(g.fund),
      name: g.fund,
      serviceArea: g.serviceArea,
      pages: g.pages.map((p) => p.n),
      revenues: rev.lines,
      expenses: exp.lines,
      revenueGrandTotal: rev.total,
      expenseGrandTotal: exp.total,
    });
  }

  // Funds that appear only in a service-area roll-up and have no detail page.
  //
  // Roll-ups sometimes print the full legal name where the detail page uses a
  // short one ("PDX Clean Energy Community Benefits Fund" vs "PDX Clean Energy
  // Fund"), so match on significant-word containment rather than equality —
  // otherwise the same fund gets counted twice.
  const words = (s: string) =>
    new Set(
      normalize(s)
        .split(" ")
        .filter((w) => w && w !== "fund" && w !== "the" && w !== "and" && w !== "-"),
    );
  const parsedWords = funds.map((f) => ({ name: f.name, w: words(f.name) }));
  const matchesExisting = (name: string) => {
    const a = words(name);
    return parsedWords.some(({ w: b }) => {
      const [small, big] = a.size <= b.size ? [a, b] : [b, a];
      if (!small.size) return false;
      for (const t of small) if (!big.has(t)) return false;
      return true;
    });
  };

  const summaries = parseServiceAreaSummaries(pages);
  const have = new Set(funds.map((f) => normalize(f.name)));
  for (const s of summaries) {
    for (const row of s.funds) {
      const key = normalize(row.name);
      if (have.has(key) || matchesExisting(row.name)) continue;
      have.add(key);
      funds.push({
        slug: slugify(row.name),
        name: row.name,
        serviceArea: s.serviceArea,
        pages: [s.page],
        revenues: [],
        expenses: [],
        // The roll-up excludes unappropriated amounts, so for these funds
        // revenue and expense are the same appropriated figure.
        revenueGrandTotal: row.values,
        expenseGrandTotal: row.values,
        summaryOnly: true,
      });
    }
  }

  return { funds, summaries, orphanCount, unclassified: [...unclassified] };
}

if (process.argv[1] && process.argv[1].endsWith("parse-vol1-funds.ts")) {
  const { funds, summaries, orphanCount, unclassified } = parseVol1();
  fs.mkdirSync(PARSED_DIR, { recursive: true });
  fs.writeFileSync(`${PARSED_DIR}/funds.json`, JSON.stringify(funds, null, 1));
  fs.writeFileSync(`${PARSED_DIR}/service-area-summaries.json`, JSON.stringify(summaries, null, 1));
  console.log(`service-area summaries ${summaries.length}`);
  console.log(`summary-only funds     ${funds.filter((f) => f.summaryOnly).length}`);

  const balanced = funds.filter((f) =>
    YEARS.every(
      (_, i) => (f.revenueGrandTotal[i] ?? 0) === (f.expenseGrandTotal[i] ?? 0),
    ),
  );
  const total2627 = funds.reduce((s, f) => s + (f.expenseGrandTotal[3] ?? 0), 0);

  console.log(`funds parsed        ${funds.length}`);
  console.log(`orphan tokens       ${orphanCount}`);
  console.log(`balance proofs      ${balanced.length}/${funds.length} funds balance all 4 years`);
  console.log(`FY26-27 sum         $${total2627.toLocaleString("en-US")}`);
  console.log(`unclassified labels ${unclassified.length}`);
  if (unclassified.length) console.log(`  ${unclassified.slice(0, 25).join(" | ")}`);
  const unbal = funds.filter((f) => !balanced.includes(f));
  if (unbal.length) {
    console.log(`\nunbalanced funds:`);
    for (const f of unbal.slice(0, 15)) {
      console.log(
        `  ${f.name} (p${f.pages[0]})  rev ${f.revenueGrandTotal.join("/")}  exp ${f.expenseGrandTotal.join("/")}`,
      );
    }
  }
}
