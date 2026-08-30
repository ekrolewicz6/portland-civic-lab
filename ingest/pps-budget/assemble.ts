/**
 * Assemble the per-agent CSV fragments into the canonical corpus tables.
 *
 *   npx tsx ingest/pps-budget/assemble.ts
 *
 * Deterministic: concatenates research/pps-budget/data/fragments/<agent>/<table>.csv
 * into research/pps-budget/data/<table>.csv, verifying every fragment's header
 * matches the canonical header for its table, tagging each row with its source
 * fragment, dropping exact duplicate rows, and sorting by (fy, first column).
 * Also regenerates data/COVERAGE.md — which table has rows from which agent
 * and which fiscal years.
 */

import fs from "node:fs";
import path from "node:path";

const FRAG = "research/pps-budget/data/fragments";
const OUT = "research/pps-budget/data";

const CANON: Record<string, string> = {
  "all_funds_by_fund.csv": "fund_name,resources_k,requirements_k,fy,basis,doc_id,page,notes",
  "gf_revenue.csv": "source,amount_k,fy,basis,doc_id,page,notes",
  "gf_requirements_function.csv": "function_code,label,amount_k,fy,basis,doc_id,page,notes",
  "gf_requirements_object.csv": "object_code,label,amount_k,fy,basis,doc_id,page,notes",
  "fte_by_function.csv": "group,fte,fy,basis,doc_id,page,notes",
  "tax_rates.csv":
    "permanent_rate,gap_rate,local_option_rate,bond_rate,av_billions,rmv_billions,compression_loss_k,fy,basis,doc_id,page,notes",
  "enrollment.csv": "enrollment,admr,admw,fy,basis,doc_id,page,notes",
  "reserves.csv": "contingency_k,ending_fund_balance_k,fy,basis,doc_id,page,notes",
  "debt.csv": "go_outstanding_k,pob_outstanding_k,debt_service_k,fy,basis,doc_id,page,notes",
  "ssf.csv": "ssf_total_k,gp_grant_k,local_revenue_offset_k,fy,basis,doc_id,page,notes",
  "levy.csv": "imposed_k,collected_k,positions_funded,fy,basis,doc_id,page,notes",
  "bond_projects.csv": "bond,project,original_budget_k,current_estimate_k,spent_k,as_of,doc_id,page,notes",
  "admw_breakout.csv": "category,admw,fy,basis,doc_id,page,notes",
  "sia_hss.csv": "program,amount_k,fy,basis,doc_id,page,notes",
};

/** Minimal CSV line splitter honoring double-quoted fields. */
function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function main() {
  const agents = fs
    .readdirSync(FRAG, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const problems: string[] = [];
  const coverage: Record<string, Record<string, { rows: number; fys: Set<string> }>> = {};
  const tables: Record<string, { header: string[]; rows: Map<string, string> }> = {};

  for (const agent of agents) {
    for (const file of fs.readdirSync(path.join(FRAG, agent)).sort()) {
      if (!file.endsWith(".csv")) continue;
      const canon = CANON[file];
      if (!canon) {
        problems.push(`${agent}/${file}: unknown table (not in CANON)`);
        continue;
      }
      const canonCols = canon.split(",");
      const lines = fs
        .readFileSync(path.join(FRAG, agent, file), "utf8")
        .split(/\r?\n/)
        .filter((l) => l.trim() !== "");
      if (lines.length === 0) continue;
      const header = splitCsv(lines[0]).map((h) => h.trim());
      if (header.join(",") !== canon) {
        problems.push(
          `${agent}/${file}: header mismatch\n    got  ${header.join(",")}\n    want ${canon}`,
        );
        continue;
      }
      tables[file] ??= { header: [...canonCols, "fragment"], rows: new Map() };
      const fyIdx = canonCols.indexOf("fy");
      for (const line of lines.slice(1)) {
        const cells = splitCsv(line);
        if (cells.length !== canonCols.length) {
          problems.push(`${agent}/${file}: row has ${cells.length} cells, want ${canonCols.length}: ${line.slice(0, 100)}`);
          continue;
        }
        const key = line; // exact-duplicate collapse across fragments
        if (!tables[file].rows.has(key)) tables[file].rows.set(key, `${line},${agent}`);
        coverage[file] ??= {};
        coverage[file][agent] ??= { rows: 0, fys: new Set() };
        coverage[file][agent].rows++;
        if (fyIdx >= 0 && cells[fyIdx]) coverage[file][agent].fys.add(cells[fyIdx]);
      }
    }
  }

  for (const [file, t] of Object.entries(tables)) {
    const fyIdx = t.header.indexOf("fy");
    const sorted = [...t.rows.values()].sort((a, b) => {
      const fa = fyIdx >= 0 ? splitCsv(a)[fyIdx] ?? "" : "";
      const fb = fyIdx >= 0 ? splitCsv(b)[fyIdx] ?? "" : "";
      return fa === fb ? a.localeCompare(b) : fa.localeCompare(fb);
    });
    fs.writeFileSync(path.join(OUT, file), [t.header.join(","), ...sorted].join("\n") + "\n");
    console.log(`${file}: ${sorted.length} rows from ${Object.keys(coverage[file] ?? {}).length} agents`);
  }

  const cov: string[] = [
    "# Coverage matrix (generated by assemble.ts — do not hand-edit)",
    "",
    "| table | agent | rows | fiscal years |",
    "|---|---|---|---|",
  ];
  for (const file of Object.keys(coverage).sort()) {
    for (const agent of Object.keys(coverage[file]).sort()) {
      const c = coverage[file][agent];
      cov.push(`| ${file} | ${agent} | ${c.rows} | ${[...c.fys].sort().join(" ")} |`);
    }
  }
  fs.writeFileSync(path.join(OUT, "COVERAGE.md"), cov.join("\n") + "\n");

  if (problems.length) {
    console.error(`\n${problems.length} PROBLEMS:`);
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }
  console.log("\nOK — canonical tables + COVERAGE.md written");
}

main();
