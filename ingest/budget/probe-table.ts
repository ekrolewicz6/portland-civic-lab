/**
 * Scratch harness: parse a single page's tables and print them.
 *   npx tsx ingest/budget/probe-table.ts vol2 109
 * Used to eyeball the parser against the PDF during development.
 */
import fs from "node:fs";
import { TEXT_DIR, YEARS } from "./sources";
import { splitPages } from "./lib/pages";
import { parseTable, alignToYears, type SourceLine } from "./lib/table";

const key = process.argv[2] ?? "vol2";
const pageNo = Number(process.argv[3] ?? 109);

const pages = splitPages(fs.readFileSync(`${TEXT_DIR}/${key}-layout.txt`, "utf8"));
const page = pages[pageNo - 1];
const lines: SourceLine[] = page.lines.map((text, idx) => ({ text, page: page.n, idx }));

console.log(`${key} p${pageNo}`);
let cursor = 0;
let n = 0;
while (cursor < lines.length && n < 6) {
  const t = parseTable(lines, cursor);
  if (!t) break;
  n++;
  const al = alignToYears(t, YEARS);
  console.log(`\n── table ${n}  bands: ${t.bands.map((b) => `${b.year}/${b.basis}@${b.right}`).join("  ")}`);
  if (t.orphans.length) console.log(`   !! ${t.orphans.length} ORPHAN TOKENS`);
  for (const r of t.rows) {
    const v = al.values(r);
    console.log(
      `   ${"  ".repeat(r.depth)}${r.label.padEnd(38 - r.depth * 2)} ` +
        v.map((x) => (x == null ? "—" : x.toLocaleString("en-US")).padStart(14)).join(""),
    );
  }
  if (al.grandTotal) {
    console.log(
      `   ${"GRAND TOTAL".padEnd(38)} ` +
        al.grandTotal.map((x) => (x == null ? "—" : x.toLocaleString("en-US")).padStart(14)).join(""),
    );
  }
  cursor = t.endLine + 1;
}
