/**
 * v3 loader — turns the City's employee wage roster (obtained via the public
 * records request in docs/prr-drafts/city-employee-salary-roster.md) into
 * src/data/individual-salaries.ts.
 *
 *   npx tsx ingest/load-salary-roster.ts path/to/roster.csv FY2024-25
 *
 * The exact column headers won't be known until the PRR comes back. Confirm
 * them against the delivered file and adjust COLUMNS below. Everything else
 * (bureau mapping, median-based name suppression, grouping, codegen) is ready.
 *
 * CJS module (no top-level await) per the repo's tsx convention.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// --- expected roster columns (edit to match the delivered file) ---
const COLUMNS = {
  name: "Name",
  classification: "Job Title",
  bureau: "Bureau",
  regularGross: "Regular Pay",
  overtime: "Overtime Pay",
  otherEarnings: "Other Pay",
};

// City roster bureau name -> org-chart bureau id. Extend as the roster reveals
// the exact strings it uses (these mirror the budget's bureau names).
const BUREAU_NAME_TO_ID: Record<string, string> = {
  "Portland Police Bureau": "ppb",
  "Portland Fire & Rescue": "pfr",
  "Portland Fire and Rescue": "pfr",
  "Bureau of Emergency Communications": "boec",
  "Portland Bureau of Emergency Management": "pbem",
  "Bureau of Environmental Services": "bes",
  "Portland Water Bureau": "water",
  "Water Bureau": "water",
  "Portland Bureau of Transportation": "pbot",
  "Portland Parks & Recreation": "parks",
  "Portland Parks and Recreation": "parks",
  "Bureau of Human Resources": "bhr",
  "Bureau of Technology Services": "bts",
  "Bureau of Fleet & Facilities": "bff",
  "City Budget Office": "cbo",
  "Portland Housing Bureau": "phb",
  "Bureau of Planning & Sustainability": "bps",
  "Portland Permitting & Development": "ppd",
  // …add the rest once the roster's exact bureau labels are known.
};

// Names are kept at or above this share of the citywide median total pay, and
// suppressed below it (Texas-Tribune model). 1.0 = keep at/above the median.
const NAME_THRESHOLD = 1.0;

interface Row {
  name: string | null;
  classification: string;
  bureauId: string;
  regularGross: number;
  overtime: number;
  otherEarnings: number;
  total: number;
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let record: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      record.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (field !== "" || record.length) {
        record.push(field);
        rows.push(record);
        record = [];
        field = "";
      }
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else {
      field += c;
    }
  }
  if (field !== "" || record.length) {
    record.push(field);
    rows.push(record);
  }
  const header = rows.shift() ?? [];
  return rows.map((r) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])),
  );
}

function num(s: string | undefined): number {
  return Number((s ?? "").replace(/[$,]/g, "")) || 0;
}

function main(): void {
  const [file, fy] = process.argv.slice(2);
  if (!file) {
    console.error("usage: tsx ingest/load-salary-roster.ts <roster.csv> <fiscalYear>");
    process.exit(1);
  }
  const records = parseCsv(readFileSync(resolve(file), "utf8"));
  const rows: Row[] = [];
  const unmapped = new Set<string>();
  for (const rec of records) {
    const bureauName = rec[COLUMNS.bureau] ?? "";
    const bureauId = BUREAU_NAME_TO_ID[bureauName];
    if (!bureauId) {
      if (bureauName) unmapped.add(bureauName);
      continue;
    }
    const regularGross = num(rec[COLUMNS.regularGross]);
    const overtime = num(rec[COLUMNS.overtime]);
    const otherEarnings = num(rec[COLUMNS.otherEarnings]);
    rows.push({
      name: (rec[COLUMNS.name] ?? "").trim() || null,
      classification: rec[COLUMNS.classification] ?? "",
      bureauId,
      regularGross,
      overtime,
      otherEarnings,
      total: regularGross + overtime + otherEarnings,
    });
  }

  // median-based name suppression
  const totals = rows.map((r) => r.total).sort((a, b) => a - b);
  const median = totals.length ? totals[Math.floor(totals.length / 2)] : 0;
  const cutoff = median * NAME_THRESHOLD;

  const byBureau: Record<string, Row[]> = {};
  for (const r of rows) {
    if (r.total < cutoff) r.name = null;
    (byBureau[r.bureauId] ??= []).push(r);
  }
  for (const id of Object.keys(byBureau)) {
    byBureau[id].sort((a, b) => b.total - a.total);
  }

  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const out: string[] = [];
  out.push("// GENERATED by ingest/load-salary-roster.ts — do not hand-edit.");
  out.push("export const INDIVIDUAL_SALARIES_AVAILABLE = true;");
  out.push(`export const INDIVIDUAL_SALARIES_FY = "${esc(fy ?? "")}";`);
  out.push(
    'export const INDIVIDUAL_SALARIES_SOURCE =\n  "City of Portland public records request (GovQA)";',
  );
  out.push(
    "export interface EmployeePay { name: string | null; classification: string; bureauId: string; regularGross: number; overtime: number; otherEarnings: number; }",
  );
  out.push("export const INDIVIDUAL_SALARIES: Record<string, EmployeePay[]> = {");
  for (const [id, list] of Object.entries(byBureau)) {
    out.push(`  "${id}": [`);
    for (const r of list) {
      const name = r.name === null ? "null" : `"${esc(r.name)}"`;
      out.push(
        `    { name: ${name}, classification: "${esc(r.classification)}", bureauId: "${id}", regularGross: ${Math.round(r.regularGross)}, overtime: ${Math.round(r.overtime)}, otherEarnings: ${Math.round(r.otherEarnings)} },`,
      );
    }
    out.push("  ],");
  }
  out.push("};");

  const dest = resolve("src/data/individual-salaries.ts");
  writeFileSync(dest, out.join("\n") + "\n");
  console.log(`wrote ${rows.length} rows across ${Object.keys(byBureau).length} bureaus → ${dest}`);
  console.log(`median total pay $${Math.round(median).toLocaleString()}; names below suppressed`);
  if (unmapped.size) {
    console.warn(`\nUNMAPPED bureau labels (add to BUREAU_NAME_TO_ID):`);
    for (const n of unmapped) console.warn(`  - ${n}`);
  }
}

main();
