/**
 * Vol 2 -> programs.json
 *
 *   npx tsx ingest/budget/parse-vol2-programs.ts
 *
 * Vol 2 is organized Service Area > Bureau > Program, with a running
 * breadcrumb header on every page. The breadcrumb is the segmentation anchor:
 * consecutive pages sharing one breadcrumb are one program, which handles
 * multi-page programs without any special case.
 *
 * Each program page carries:
 *   Revenues by Fund and Major Object  <- WHICH fund pays, incl. the General
 *                                         Fund discretionary/overhead split
 *   Expenses by Major Object           <- personnel, M&S, capital, ...
 *   Positions by Job Class             <- FTE
 *   Program Description and Goals      <- prose
 */

import fs from "node:fs";
import { TEXT_DIR, PARSED_DIR, YEARS } from "./sources";
import { splitPages, topLines, type Page } from "./lib/pages";
import { parseTable, alignToYears, type SourceLine } from "./lib/table";
import { classifyRevenue, classifyExpense, slugify, normalize } from "./lib/labels";
import { emptyValues, addValues, parseFte, type Values } from "./lib/numbers";

export interface ProgramLine {
  label: string;
  depth: number;
  class: string | null;
  isTotal: boolean;
  values: Values;
}

export interface FundingEdge {
  fundName: string;
  /** null unless the fund is the General Fund. */
  gfSplit: "discretionary" | "overhead" | null;
  class: string | null;
  label: string;
  values: Values;
}

export interface Program {
  slug: string;
  name: string;
  serviceArea: string;
  bureau: string;
  breadcrumb: string[];
  pages: number[];
  description: string | null;
  expenses: ProgramLine[];
  expenseGrandTotal: Values;
  funding: FundingEdge[];
  revenueGrandTotal: Values;
  fteTotal: Values;
}

/** What counts as program spending, as opposed to fund-level bookkeeping. */
const PROGRAM_CLASSES = new Set([
  "personnel",
  "external-materials-services",
  "internal-materials-services",
  "capital-outlay",
  "debt-service",
]);

const REV_HDR = /^Revenues?\s+by\s+Fund\s+and\s+Major\s+Object\s*$/i;
const EXP_HDR = /^Expenses?\s+by\s+Major\s+Object\s*$/i;
const POS_HDR = /^Positions?\s+by\s+Job\s+Class\s*$/i;
const DESC_HDR = /^Program\s+Description\s+and\s+Goals\s*$/i;
const NEXT_HDR =
  /^(Performance|Summary of Budget Decisions|Legal Requirement|Revenues? by|Expenses? by|Positions? by|Overview)/i;

/** Markers that identify a bureau-level page rather than a program page. */
const BUREAU_SECTION =
  /^\s*(Expenses by Program Offer|Positions by Program Offer|Revenues by Fund\s*$|Summary of Budget Decisions|Performance Metrics)/im;

/** Same markers, matched per line, to cut a program group short. */
const BUREAU_ROLLUP =
  /^(Expenses by Program Offer|Positions by Program Offer|Revenues by Fund\s*$|Summary of Budget Decisions|Performance Metrics)/i;

function parseBreadcrumb(p: Page): string[] | null {
  for (const l of topLines(p, 5)) {
    if (!l.includes(" > ")) continue;
    if (/City of Portland Fiscal Year/i.test(l)) continue;
    const parts = l.split(/\s+>\s+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) return parts;
  }
  return null;
}

function findSection(lines: SourceLine[], re: RegExp): number {
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i].text.trim())) return i;
  return -1;
}

/** Any line that starts a new section, used to bound the one before it. */
// NOTE: deliberately does NOT match a bare "Budget" — that is the third line
// of a wrapped column header ("FY 2025-26 Revised" / … / "Budget"), and
// treating it as a section start truncates every table to nothing.
const ANY_SECTION =
  /^(Revenues? by (Fund|Major)|Expenses? by (Major|Program|Fund)|Positions? by|Program Description and Goals|Performance (Measures?|Metrics)|Summary of Budget Decisions|Legal Requirement|Overview)\b/i;

/**
 * Where the section starting at `at` ends. Without this a table parse runs
 * past its own section and picks up rows from the next one, which shifts the
 * derived indent depths and silently corrupts the hierarchy.
 */
function sectionLimit(lines: SourceLine[], at: number): number {
  for (let i = at + 1; i < lines.length; i++) {
    if (ANY_SECTION.test(lines[i].text.trim())) return i;
  }
  return lines.length;
}

function readProse(lines: SourceLine[], from: number): string | null {
  if (from < 0) return null;
  const out: string[] = [];
  for (let i = from + 1; i < lines.length; i++) {
    const t = lines[i].text.trim();
    if (NEXT_HDR.test(t)) break;
    if (/^\d{1,4}$/.test(t)) continue; // page folio
    if (/City of Portland Fiscal Year/i.test(t)) continue;
    if (t.includes(" > ")) continue; // running breadcrumb on a continuation page
    out.push(t);
  }
  return out.join(" ").replace(/\s+/g, " ").trim() || null;
}

export function parseVol2(): {
  programs: Program[];
  orphanCount: number;
  unparsedPages: number[];
  bureauPages: number;
} {
  const pages = splitPages(fs.readFileSync(`${TEXT_DIR}/vol2-layout.txt`, "utf8"));

  const groups: { crumb: string[]; pages: Page[] }[] = [];
  const unparsedPages: number[] = [];
  let bureauPages = 0;

  // The breadcrumb is printed on a section's FIRST page only; continuation
  // pages carry none. So a page without one belongs to the section still in
  // effect — inheriting it is what keeps multi-page programs whole (their
  // Positions table and prose usually land on page 2).
  let inherited: string[] | null = null;
  for (const p of pages) {
    const own = parseBreadcrumb(p);
    // Bureau-level sections (roll-up tables, performance metrics, budget
    // decisions) also print no breadcrumb. Without this reset they'd inherit
    // the previous PROGRAM's breadcrumb and fold a whole bureau's tables into
    // that one program.
    if (!own && BUREAU_SECTION.test(p.raw)) {
      inherited = null;
      bureauPages++;
      continue;
    }
    const c = own ?? inherited;
    if (own) inherited = own;
    if (!c) {
      unparsedPages.push(p.n);
      continue;
    }
    if (c.length < 3) {
      bureauPages++; // service-area or bureau summary page
      continue;
    }
    const key = c.join(" > ");
    const last = groups[groups.length - 1];
    if (last && last.crumb.join(" > ") === key) last.pages.push(p);
    else groups.push({ crumb: c, pages: [p] });
  }

  const programs: Program[] = [];
  let orphanCount = 0;

  for (const g of groups) {
    // Stop at the first bureau-level roll-up line. A program's continuation
    // pages can be followed by its bureau's own tables ("Expenses by Program
    // Offer" sums the WHOLE bureau); absorbing one would inflate this
    // program's totals by an order of magnitude.
    const lines: SourceLine[] = [];
    outer: for (const p of g.pages) {
      for (const text of p.lines) {
        if (BUREAU_ROLLUP.test(text.trim())) break outer;
        lines.push({ text, page: p.n, idx: lines.length });
      }
    }

    const revAt = findSection(lines, REV_HDR);
    const expAt = findSection(lines, EXP_HDR);
    const posAt = findSection(lines, POS_HDR);
    const descAt = findSection(lines, DESC_HDR);
    if (expAt < 0) continue; // not a program detail page

    const revTable = revAt >= 0 ? parseTable(lines, revAt, sectionLimit(lines, revAt)) : null;
    const expTable = parseTable(lines, expAt, sectionLimit(lines, expAt));
    const posTable = posAt >= 0 ? parseTable(lines, posAt, sectionLimit(lines, posAt)) : null;
    orphanCount +=
      (revTable?.orphans.length ?? 0) + (expTable?.orphans.length ?? 0) + (posTable?.orphans.length ?? 0);

    // ── expenses ────────────────────────────────────────────────────
    const expAl = expTable ? alignToYears(expTable, YEARS) : null;
    const expenses: ProgramLine[] =
      expTable && expAl
        ? expTable.rows.map((r) => ({
            label: r.label,
            depth: r.depth,
            class: classifyExpense(r.label),
            isTotal: r.isTotal,
            values: expAl.values(r),
          }))
        : [];
    // A program's spending is the "Bureau Expense" subtree. Some pages also
    // print the enclosing fund's rows ("Fund Expense", "Unappropriated") —
    // Water Bureau Support shows $36.8M of bureau expense beside $1.09B of
    // fund expense — and counting those as program spending would inflate the
    // program by an order of magnitude and double-count against the funds.
    const top = expenses.length ? Math.min(...expenses.map((e) => e.depth)) : 0;
    const bureauRow = expenses.find(
      (e) => e.depth === top && normalize(e.label) === "bureau expense",
    );
    let expenseGrandTotal: Values;
    if (bureauRow) {
      expenseGrandTotal = bureauRow.values;
    } else {
      // No explicit Bureau Expense row: sum the operating/capital leaves.
      expenseGrandTotal = expenses
        .filter((e) => !e.isTotal && e.class && PROGRAM_CLASSES.has(e.class))
        .reduce<Values>((a, e) => addValues(a, e.values), emptyValues());
    }

    // ── funding edges ───────────────────────────────────────────────
    // depth 0 = fund name, depth 1 = External/Internal Revenues,
    // depth 2 = leaf object (including the GF discretionary/overhead split).
    const funding: FundingEdge[] = [];
    let revenueGrandTotal: Values = emptyValues();
    if (revTable) {
      const al = alignToYears(revTable, YEARS);
      revenueGrandTotal = al.grandTotal ?? emptyValues();
      let currentFund = "";
      for (const r of revTable.rows) {
        const isStructural =
          normalize(r.label) === "external revenues" || normalize(r.label) === "internal revenues";
        if (r.depth === 0 && !isStructural) {
          currentFund = r.label;
          continue;
        }
        const n = normalize(r.label);
        if (n === "external revenues" || n === "internal revenues") continue;
        const gfSplit =
          n === "general fund discretionary"
            ? ("discretionary" as const)
            : n === "general fund overhead"
              ? ("overhead" as const)
              : null;
        // Citywide tables (Fund and Debt Management, and the General Fund's own
        // pages) print no fund wrapper row — the table IS the General Fund's.
        // A discretionary/overhead split only exists there, so it identifies
        // the fund unambiguously.
        funding.push({
          fundName: currentFund || (gfSplit ? "General Fund" : ""),
          gfSplit,
          class: classifyRevenue(r.label),
          label: r.label,
          values: al.values(r),
        });
      }
      if (!revTable.grandTotal) {
        revenueGrandTotal = revTable.rows
          .filter((r) => r.depth === 0)
          .reduce<Values>((a, r) => addValues(a, al.values(r)), emptyValues());
      }
    }

    // ── FTE ─────────────────────────────────────────────────────────
    // FTE keeps decimals, so read the untouched cell text rather than the
    // money-rounded values.
    let fteTotal: Values = emptyValues();
    if (posTable) {
      const slot = new Map<number, number>();
      posTable.bands.forEach((b, i) => {
        const y = YEARS.indexOf(b.year as (typeof YEARS)[number]);
        if (y >= 0) slot.set(i, y);
      });
      for (const r of posTable.rows) {
        if (r.isTotal) continue;
        slot.forEach((yearIdx, bandIdx) => {
          const f = parseFte(r.raw[bandIdx]);
          if (f != null) fteTotal[yearIdx] = Math.round(((fteTotal[yearIdx] ?? 0) + f) * 100) / 100;
        });
      }
    }

    const [serviceArea, bureau, ...rest] = g.crumb;
    const name = rest.join(" > ");
    programs.push({
      slug: `${slugify(bureau)}/${slugify(name)}`,
      name,
      serviceArea,
      bureau,
      breadcrumb: g.crumb,
      pages: g.pages.map((p) => p.n),
      description: readProse(lines, descAt),
      expenses,
      expenseGrandTotal: expenseGrandTotal ?? emptyValues(),
      funding,
      revenueGrandTotal,
      fteTotal,
    });
  }

  return { programs, orphanCount, unparsedPages, bureauPages };
}

if (process.argv[1] && process.argv[1].endsWith("parse-vol2-programs.ts")) {
  const { programs, orphanCount, unparsedPages, bureauPages } = parseVol2();
  fs.mkdirSync(PARSED_DIR, { recursive: true });
  fs.writeFileSync(`${PARSED_DIR}/programs.json`, JSON.stringify(programs, null, 1));

  const sum = (f: (p: Program) => number) => programs.reduce((s, p) => s + f(p), 0);
  const disc = sum((p) =>
    p.funding.filter((e) => e.gfSplit === "discretionary").reduce((s, e) => s + (e.values[3] ?? 0), 0),
  );
  const over = sum((p) =>
    p.funding.filter((e) => e.gfSplit === "overhead").reduce((s, e) => s + (e.values[3] ?? 0), 0),
  );
  const balanced = programs.filter(
    (p) => (p.revenueGrandTotal[3] ?? 0) === (p.expenseGrandTotal[3] ?? 0),
  ).length;

  console.log(`programs parsed      ${programs.length}`);
  console.log(`bureau/area pages    ${bureauPages}`);
  console.log(`pages w/o breadcrumb ${unparsedPages.length}`);
  console.log(`orphan tokens        ${orphanCount}`);
  console.log(`rev==exp FY26-27     ${balanced}/${programs.length}`);
  console.log(`service areas        ${[...new Set(programs.map((p) => p.serviceArea))].join(" | ")}`);
  console.log(`bureaus              ${new Set(programs.map((p) => p.bureau)).size}`);
  console.log(`FY26-27 expenses     $${sum((p) => p.expenseGrandTotal[3] ?? 0).toLocaleString("en-US")}`);
  console.log(`  GF discretionary   $${disc.toLocaleString("en-US")}   (published ~$803.4M)`);
  console.log(`  GF overhead        $${over.toLocaleString("en-US")}`);
  console.log(`FTE FY26-27          ${sum((p) => p.fteTotal[3] ?? 0).toFixed(2)}`);
  console.log(`with description     ${programs.filter((p) => p.description).length}`);
}
