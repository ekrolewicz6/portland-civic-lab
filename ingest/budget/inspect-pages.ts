/**
 * Read-only discovery pass over the extracted text.
 *
 *   npx tsx ingest/budget/inspect-pages.ts
 *
 * Writes nothing. Prints the evidence the parser constants are derived from:
 * the real service-area set, the section headers that anchor each table, the
 * indentation levels, and how often column detection succeeds.
 *
 * Run this before changing any constant in lib/. Guessing at anchors is how
 * silent extraction bugs get in.
 */

import fs from "node:fs";
import { TEXT_DIR } from "./sources";
import { splitPages } from "./lib/pages";
import { detectColumns } from "./lib/columns";

function counts(items: string[]): [string, number][] {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function inspect(key: string) {
  const txt = fs.readFileSync(`${TEXT_DIR}/${key}-layout.txt`, "utf8");
  const pages = splitPages(txt);
  console.log(`\n${"=".repeat(72)}\n${key.toUpperCase()} — ${pages.length} pages\n${"=".repeat(72)}`);

  // ── breadcrumbs ──────────────────────────────────────────────────
  const crumbs: string[][] = [];
  for (const p of pages) {
    for (const l of p.lines.slice(0, 4)) {
      if (l.includes(" > ")) {
        crumbs.push(l.split(/\s+>\s+/).map((s) => s.trim()).filter(Boolean));
        break;
      }
    }
  }
  console.log(`\nBreadcrumb pages: ${crumbs.length} / ${pages.length}`);
  console.log("\nLevel-1 values (the service-area set):");
  for (const [v, n] of counts(crumbs.map((c) => c[0]))) {
    console.log(`  ${String(n).padStart(4)}  ${v}`);
  }
  console.log("\nBreadcrumb depths:");
  for (const [d, n] of counts(crumbs.map((c) => String(c.length)))) {
    console.log(`  depth ${d}: ${n} pages`);
  }
  const distinct = new Set(crumbs.map((c) => c.join(" > ")));
  console.log(`Distinct breadcrumbs: ${distinct.size}`);
  const depth3 = new Set(crumbs.filter((c) => c.length >= 3).map((c) => c.join(" > ")));
  console.log(`Distinct depth>=3 (programs): ${depth3.size}`);

  // ── section headers ──────────────────────────────────────────────
  const headerish: string[] = [];
  for (const p of pages) {
    for (const l of p.lines) {
      const t = l.trim();
      if (!t || t.length > 60) continue;
      if (/^(Revenues?|Expenses?|Positions?|Program|Performance|Overview|Budget|Summary|Fund)\b/i.test(t)) {
        headerish.push(t);
      }
    }
  }
  console.log("\nSection-header candidates (count >= 15):");
  for (const [v, n] of counts(headerish)) {
    if (n >= 15) console.log(`  ${String(n).padStart(5)}  ${v}`);
  }

  // ── column detection ─────────────────────────────────────────────
  let withCols = 0;
  const bandSets = new Set<string>();
  for (const p of pages) {
    let found = false;
    for (const l of p.lines) {
      const b = detectColumns(l);
      if (b) {
        found = true;
        bandSets.add(b.map((x) => `${x.year}/${x.basis}@${x.right}`).join(" | "));
      }
    }
    if (found) withCols++;
  }
  console.log(`\nPages with >=1 detected column header: ${withCols} / ${pages.length}`);
  console.log(`Distinct band signatures: ${bandSets.size}`);
  for (const s of [...bandSets].slice(0, 8)) console.log(`  ${s}`);

  // ── indentation ──────────────────────────────────────────────────
  const indents: string[] = [];
  for (const p of pages) {
    for (const l of p.lines) {
      if (!l.trim()) continue;
      if (!/\$[\d,]|\(\$?[\d,]+\)/.test(l)) continue;
      indents.push(String(l.length - l.trimStart().length));
    }
  }
  console.log("\nIndent levels on value-bearing lines:");
  for (const [v, n] of counts(indents).slice(0, 12)) {
    console.log(`  indent ${String(v).padStart(3)}: ${n}`);
  }

  // ── pages with no recognizable content ───────────────────────────
  const bare = pages.filter((p) => p.lines.filter((l) => l.trim()).length < 3);
  console.log(`\nNear-empty pages: ${bare.length}${bare.length ? ` (e.g. ${bare.slice(0, 8).map((p) => p.n).join(", ")})` : ""}`);
}

inspect("vol1");
inspect("vol2");
