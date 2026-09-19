/** Narrow a saved official ORESTAR export. Never log or publish full source rows. */
import fs from "node:fs";
import * as XLSX from "xlsx";

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output)
  throw new Error(
    "Usage: npx tsx ingest/voters-guide/extract-state-roster.ts INPUT.xlsx OUTPUT.json",
  );
const workbook = XLSX.readFile(input);
const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  workbook.Sheets[workbook.SheetNames[0]],
  { defval: "" },
);
const candidates = rows
  .filter(
    (r) =>
      r["Election Txt"] === "2026 General Election" &&
      r["Qlf Ind"] === "Y" &&
      !r["Witdrw Date"],
  )
  .map((r) => ({
    office: String(r["Candidate Office"]).trim(),
    name: String(r["Cand Ballot Name Txt"]).trim(),
    party: String(r["Party Descr"]).trim(),
    filingId: String(r["Candidate File RSN"]).trim(),
  }));
if (
  !candidates.length ||
  candidates.some((r) => !r.office || !r.name || !/^\d+$/.test(r.filingId))
)
  throw new Error(
    "Export format or election filter changed; inspect the schema before proceeding.",
  );
fs.writeFileSync(
  output,
  JSON.stringify(
    {
      reviewed: "2026-09-18",
      source: "https://secure.sos.state.or.us/orestar/CFSearchPage.do",
      filter:
        "2026 General Election; qualified Y; no withdrawal date. Multiple party nominations retained.",
      candidates,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Wrote ${candidates.length} narrowed filing rows; no contact/address fields retained.`,
);
