/** Export sanitized, reviewable import evidence. No source downloads in Git. */
import { writeFile, readFile } from "node:fs/promises";
import sql from "../../src/lib/db-query";
import { coverage, csvCell } from "../../src/lib/oregon-fire/query";

async function main() {
  const directory = "research/oregon-fire-map-2026-09-10/";
  const sources = await coverage();
  const runs =
    await sql`SELECT id,source_id,status,started_at,completed_at,fetched_count,accepted_count,held_count,error,
    checkpoint->>'offset' AS checkpoint_offset,
    CASE WHEN status='complete' THEN metadata ELSE '{}'::jsonb END AS metadata
    FROM fire.import_runs WHERE source_id NOT LIKE 'private-storage-check-%' ORDER BY started_at`;
  const recordSets =
    await sql`SELECT s.id,count(r.id)::int AS stored_rows,md5(string_agg(r.checksum,'' ORDER BY r.id)) AS ordered_record_checksums_md5,
    count(*) FILTER(WHERE jsonb_typeof(r.data)<>'object' OR jsonb_typeof(r.geometry)<>'object')::int AS invalid_json
    FROM fire.sources s JOIN fire.records r ON r.run_id=s.active_run GROUP BY s.id`;
  const fod = JSON.parse(
    await readFile("runtime-data/oregon-fire/fod-manifest.json", "utf8"),
  );
  await writeFile(
    directory + "import-evidence.json",
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        stage: "downloaded; not confirmed by steward",
        sources,
        runs,
        recordSets,
        fod,
      },
      null,
      2,
    ) + "\n",
  );
  const fields = [
    "source",
    "agency",
    "role",
    "verification_stage",
    "availability",
    "public_records",
    "held_records",
    "unlocated_records",
    "min_year",
    "max_year",
    "last_success",
    "coverage",
    "limitations",
    "url",
  ];
  const rows = sources.map((s) => [
    s.name,
    s.agency,
    s.role,
    s.lastSuccess ? "downloaded" : s.verification,
    s.state,
    s.recordCount,
    s.heldCount,
    s.unlocatedCount,
    s.minYear,
    s.maxYear,
    s.lastSuccess,
    s.coverage,
    s.limitations,
    s.url,
  ]);
  await writeFile(
    directory + "coverage-matrix.csv",
    [fields.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join(
      "\n",
    ) + "\n",
  );
  console.log(
    JSON.stringify(
      sources.map((s) => ({
        source: s.id,
        records: s.recordCount,
        held: s.heldCount,
        unlocated: s.unlocatedCount,
        years: [s.minYear, s.maxYear],
        state: s.state,
      })),
      null,
      2,
    ),
  );
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Evidence export failed");
    process.exit(1);
  });
