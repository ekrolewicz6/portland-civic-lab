/**
 * Vol 1 "Figure N:" citywide summary tables -> citywide.json
 *
 *   npx tsx ingest/budget/parse-citywide.ts
 *
 * These are the City's OWN published roll-ups (Budget Summary, Vol 1 pp.27-31):
 * requirements and resources by major object, the net budget, and requirements
 * by service area. They carry two year columns (FY25-26 Revised, FY26-27
 * Adopted) plus dollar/percent change.
 *
 * They matter for two reasons:
 *   1. They are the authoritative reconciliation target — our independently
 *      parsed fund detail must reproduce them.
 *   2. They are the honest top of the flow diagram: the City's own numbers,
 *      quoted rather than recomputed.
 */

import fs from "node:fs";
import { TEXT_DIR, PARSED_DIR } from "./sources";
import { splitPages } from "./lib/pages";
import { parseTable, type SourceLine } from "./lib/table";

export interface CitywideRow {
  label: string;
  depth: number;
  isTotal: boolean;
  /** [FY2025-26 revised, FY2026-27 adopted] */
  prior: number | null;
  current: number | null;
}

export interface CitywideFigure {
  figure: string;
  title: string;
  page: number;
  rows: CitywideRow[];
  grandTotal: { prior: number | null; current: number | null } | null;
}

const FIGURE = /^Figure\s+(\d+)\s*[:.]\s*(.+?)\s*$/i;

export function parseCitywide(): CitywideFigure[] {
  const pages = splitPages(fs.readFileSync(`${TEXT_DIR}/vol1-layout.txt`, "utf8"));

  // Flatten the Budget Summary chapter so a table can run across a page break
  // (Figure 7 starts on p27 and finishes on p28).
  const lines: SourceLine[] = [];
  for (const p of pages.slice(20, 40)) {
    p.lines.forEach((text) => lines.push({ text, page: p.n, idx: lines.length }));
  }

  const marks: { at: number; figure: string; title: string; page: number }[] = [];
  lines.forEach((l, i) => {
    const m = l.text.trim().match(FIGURE);
    if (m) marks.push({ at: i, figure: m[1], title: m[2], page: l.page });
  });

  const out: CitywideFigure[] = [];
  for (let k = 0; k < marks.length; k++) {
    const start = marks[k].at;
    const limit = k + 1 < marks.length ? marks[k + 1].at : lines.length;
    const t = parseTable(lines, start, limit);
    if (!t) continue;

    // Two year bands, in printed order: prior year then current year.
    const yearIdx = t.bands.map((b, i) => ({ b, i })).filter((x) => x.b.year);
    if (yearIdx.length < 2) continue;
    const pi = yearIdx[0].i;
    const ci = yearIdx[yearIdx.length - 1].i;

    out.push({
      figure: marks[k].figure,
      title: marks[k].title,
      page: marks[k].page,
      rows: t.rows.map((r) => ({
        label: r.label,
        depth: r.depth,
        isTotal: r.isTotal,
        prior: r.values[pi] ?? null,
        current: r.values[ci] ?? null,
      })),
      grandTotal: t.grandTotal
        ? { prior: t.grandTotal[pi] ?? null, current: t.grandTotal[ci] ?? null }
        : null,
    });
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith("parse-citywide.ts")) {
  const figures = parseCitywide();
  fs.mkdirSync(PARSED_DIR, { recursive: true });
  fs.writeFileSync(`${PARSED_DIR}/citywide.json`, JSON.stringify(figures, null, 1));

  for (const f of figures) {
    console.log(`\nFigure ${f.figure}: ${f.title}  (p${f.page}, ${f.rows.length} rows)`);
    for (const r of f.rows.slice(0, 14)) {
      console.log(
        `  ${"  ".repeat(r.depth)}${r.label.padEnd(36 - r.depth * 2)}` +
          `${(r.prior == null ? "—" : r.prior.toLocaleString("en-US")).padStart(16)}` +
          `${(r.current == null ? "—" : r.current.toLocaleString("en-US")).padStart(16)}`,
      );
    }
    if (f.rows.length > 14) console.log(`  … ${f.rows.length - 14} more`);
    if (f.grandTotal) {
      console.log(
        `  ${"GRAND TOTAL".padEnd(36)}` +
          `${(f.grandTotal.prior ?? 0).toLocaleString("en-US").padStart(16)}` +
          `${(f.grandTotal.current ?? 0).toLocaleString("en-US").padStart(16)}`,
      );
    }
  }
  console.log(`\n${figures.length} figures -> ${PARSED_DIR}/citywide.json`);
}
