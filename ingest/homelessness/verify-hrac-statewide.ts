/**
 * verify-hrac-statewide.ts
 *
 * Checks every figure in hrac-statewide-2025.ts against the HRAC report PDF, so a
 * typo or a partial table cannot reach the dashboard. Reads the PDF with poppler's
 * pdftotext (brew install poppler). Read-only; touches no database.
 *
 * Usage:
 *   npx tsx ingest/homelessness/verify-hrac-statewide.ts <path-to-report.pdf>
 *
 * Exit code 1 on any mismatch. When HRAC publishes the next edition, copy the data
 * module for the new year, update its numbers, point this script at the new PDF and
 * adjust the table titles below if they change.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  COUNTY_PIT,
  DOUBLED_UP,
  PIT_WITH_KNOWN_RACE,
  RACE_COUNTS,
  RACIAL_DISPARITIES,
  REPORT,
  SHELTER_BEDS,
  STUDENT_HOMELESSNESS,
  UNSHELTERED_CHANGE,
} from "./hrac-statewide-2025";

const pdf = process.argv[2];
if (!pdf) {
  console.error("Usage: npx tsx ingest/homelessness/verify-hrac-statewide.ts <report.pdf>");
  process.exit(2);
}

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

const sha = createHash("sha256").update(readFileSync(pdf)).digest("hex");
if (sha !== REPORT.pdfSha256) fail(`PDF SHA-256 is ${sha}; the data module was checked against ${REPORT.pdfSha256}`);

const lines = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).split("\n");
const COUNTIES = COUNTY_PIT.map((r) => r[0]);

/** A value as printed: "1,464%" -> 1464, "NA" or "-" -> null, "<10" -> null. */
function parse(cell: string): number | null {
  const s = cell.replace(/[,%]/g, "");
  return s === "NA" || s === "-" || s.startsWith("<") ? null : Number(s);
}

/**
 * Reads a county table: the lines after its title (skipping the list of tables at the
 * front of the report) up to `endPattern`, keyed by county, plus the Total row.
 */
function readTable(title: string, endPattern: RegExp, width: number): Map<string, (number | null)[]> {
  const start = lines.findIndex((l, i) => i > 300 && l.includes(title));
  if (start < 0) {
    fail(`table not found: ${title}`);
    return new Map();
  }
  const out = new Map<string, (number | null)[]>();
  for (const line of lines.slice(start + 1)) {
    if (endPattern.test(line)) break;
    const total = line.match(/^\s*(Total|Oregon Statewide)\s+(.*)$/);
    const county = COUNTIES.find((c) => new RegExp(`(^|\\s)${c}\\*?\\s{2,}`).test(line));
    const rest = total ? total[2] : county ? line.slice(line.indexOf(county) + county.length) : null;
    if (rest === null) continue;
    const cells = rest.match(/<10|-?[\d,]+(\.\d+)?%?|NA|(?<=\s)-(?=\s|$)/g) ?? [];
    if (cells.length < width) continue;
    out.set(total ? "_total" : county!, cells.slice(0, width).map(parse));
  }
  return out;
}

function compare(label: string, table: Map<string, (number | null)[]>, rows: (string | number | null)[][], pick: (row: (string | number | null)[]) => (number | null)[]) {
  const keys = rows.map((r) => String(r[0])).filter((k) => k !== "Statewide");
  const missing = COUNTIES.filter((c) => !keys.includes(c));
  if (missing.length) fail(`${label}: no rows for ${missing.join(", ")}`);
  for (const row of rows) {
    const key = row[0] === "Statewide" ? "_total" : String(row[0]);
    const printed = table.get(key);
    const ours = pick(row);
    if (!printed) fail(`${label}: ${row[0]} not found in the PDF`);
    else if (ours.some((v, i) => v !== printed[i])) fail(`${label}: ${row[0]} is ${JSON.stringify(ours)}, PDF has ${JSON.stringify(printed)}`);
  }
}

const sum = (rows: (string | number | null)[][], i: number) => rows.reduce((s, r) => s + (typeof r[i] === "number" ? (r[i] as number) : 0), 0);

// Tables 1 and 2: county counts, beds and rates.
const t1 = readTable("TABLE 1: HOMELESSNESS AND SHELTER BED TOTALS BY COUNTY", /^\*All data in this table/, 5);
const t2 = readTable("TABLE 2: RATES OF HOMELESSNESS BY COUNTY", /^\*County-level population/, 3);
compare("Table 1", t1, COUNTY_PIT, (r) => [r[2], r[3], r[4], r[5], r[6]] as (number | null)[]);
compare("Table 2", t2, COUNTY_PIT, (r) => [r[7], r[8], r[9]] as (number | null)[]);
const t1Total = t1.get("_total");
if (t1Total && [sum(COUNTY_PIT, 2), sum(COUNTY_PIT, 3), sum(COUNTY_PIT, 4), sum(COUNTY_PIT, 6)].join() !== [t1Total[0], t1Total[1], t1Total[2], t1Total[4]].join())
  fail(`Table 1: county rows do not sum to the statewide row ${JSON.stringify(t1Total)}`);

// Table 3: unsheltered change, 2023 to 2025.
const t3 = readTable("TABLE 3: STATEWIDE UNSHELTERED HOMELESSNESS, INDIVIDUALS", /^\s*TABLE 4/, 4);
compare("Table 3", t3, UNSHELTERED_CHANGE, (r) => r.slice(1) as (number | null)[]);

// Table 17: shelter beds against the PIT count.
const t17 = readTable("TABLE 17: SHELTER BED COUNT AND SHORTFALL BY COUNTY", /TABLE 18/, 5);
compare("Table 17", t17, SHELTER_BEDS, (r) => r.slice(1) as (number | null)[]);
const t17Total = t17.get("_total");
if (t17Total && sum(SHELTER_BEDS, 3) !== t17Total[2]) fail(`Table 17: beds sum to ${sum(SHELTER_BEDS, 3)}, report total ${t17Total[2]}`);

// Table 19: students, including the deduplicated statewide row.
const t19 = readTable("TABLE 19: HOMELESSNESS AMONG SCHOOL CHILDREN BY COUNTY", /^\*In counties with fewer/, 4);
compare("Table 19", t19, STUDENT_HOMELESSNESS, (r) => r.slice(1) as (number | null)[]);

// Table 20: doubled-up estimates by PUMA. Groups span several printed rows, so check
// that each estimate and margin is printed in the table and that they add up.
const t20Start = lines.findIndex((l, i) => i > 300 && l.includes("TABLE 20: ACS ESTIMATES OF DOUBLED-UP HOMELESSNESS"));
const t20Text = lines.slice(t20Start, t20Start + 60).join("\n");
for (const [area, est, moe] of DOUBLED_UP) {
  const re = new RegExp(`${est.toLocaleString("en-US")}\\s+\\+/- ${moe.toLocaleString("en-US")}`);
  if (!re.test(t20Text)) fail(`Table 20: ${area} ${est} +/- ${moe} not printed`);
}
const duAreas = DOUBLED_UP.filter((r) => r[0] !== "Statewide");
if (sum(duAreas, 1) !== DOUBLED_UP.find((r) => r[0] === "Statewide")![1]) fail(`Table 20: areas sum to ${sum(duAreas, 1)}, not the statewide estimate`);

// Racial disparities: stated ratios appear in the text; PIT shares match Tables 5 and 12.
const text = lines.join(" ").replace(/\s+/g, " ");
const statedPhrase: Record<string, (ratio: number) => string> = {
  "American Indian, Alaska Native, or Indigenous": (r) => `Indigenous Oregonians experienced homelessness at a rate ${r.toFixed(2)} times higher`,
  "Native Hawaiian or Pacific Islander": (r) => `Pacific Islander Oregonians experienced homelessness at a rate ${r.toFixed(2)} times higher`,
  "Black, African American, or African": (r) => `African Oregonians experienced homelessness at a rate ${r.toFixed(2)} times higher`,
  "White": (r) => `White people experienced homelessness at a rate ${r.toFixed(2)} times that of their proportion`,
  "Multiracial": (r) => (r === 1 ? "multiracial Oregonians experienced it at the same rate as their share" : "\u0000"),
};
for (const [group, , pctPit, ratio] of RACIAL_DISPARITIES) {
  if (ratio !== null && !text.includes(statedPhrase[group]?.(ratio) ?? "\u0000")) fail(`Racial disparities: the report does not state ${ratio} for ${group}`);
  const counts = RACE_COUNTS[group];
  const computed = Math.round(((counts[0] + counts[1]) / PIT_WITH_KNOWN_RACE) * 1000) / 10;
  if (computed !== pctPit) fail(`Racial disparities: ${group} share is ${pctPit}, Tables 5 and 12 give ${computed}`);
}
// Total rows of Tables 5 (unsheltered) and 12 (sheltered), in the report's column order.
const RACE_COLUMNS = [
  "American Indian, Alaska Native, or Indigenous", "Asian or Asian American", "Black, African American, or African",
  "Native Hawaiian or Pacific Islander", "Middle Eastern or North African", "Multiracial", "White", "Some other race",
  "Hispanic/Latina/e/o (any race)",
];
const raceTotal = (title: string, end: RegExp) => {
  const start = lines.findIndex((l, i) => i > 300 && l.includes(title));
  const row = lines.slice(start).find((l, i) => i > 0 && /^Total\s/.test(l.trim()));
  if (start < 0 || !row || end.test(row)) return null;
  return (row.match(/[\d,]+/g) ?? []).map((c) => Number(c.replace(/,/g, "")));
};
const t5 = raceTotal("TABLE 5: UNSHELTERED HOMELESSNESS BY RACE AND ETHNICITY", /TABLE 6/);
const t12 = raceTotal("TABLE 12: SHELTERED HOMELESSNESS BY RACE AND ETHNICITY", /TABLE 13/);
if (!t5 || !t12) fail("Racial disparities: Table 5 or Table 12 total row not found");
else {
  RACE_COLUMNS.forEach((group, i) => {
    if (RACE_COUNTS[group][0] !== t5[i] || RACE_COUNTS[group][1] !== t12[i])
      fail(`Racial disparities: ${group} counts ${RACE_COUNTS[group]} differ from Tables 5 and 12 (${t5[i]}, ${t12[i]})`);
  });
  // Columns 9 and 10 are "No Data" and the table's sum.
  const known = t5[10] - t5[9] + (t12[10] - t12[9]);
  if (known !== PIT_WITH_KNOWN_RACE) fail(`Racial disparities: Tables 5 and 12 have ${known} people with known race, not ${PIT_WITH_KNOWN_RACE}`);
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`All figures in hrac-statewide-2025.ts match the report (${COUNTY_PIT.length} counties; Tables 1-3, 17, 19, 20; racial disparities).`);
