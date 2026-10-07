/**
 * rebuild-irp-campsites-2026-10.ts
 *
 * Rebuilds homelessness.irp_campsite_reports from the city's feed and re-keys it
 * on report_id. The nightly sync had loaded nothing since April 15, 2026 because
 * the city renumbered the feed's OBJECTIDs, and earlier renumberings had left the
 * table with 190,641 rows for 149,381 distinct reports.
 *
 * What --apply does:
 *   1. Copies the current table to homelessness.irp_campsite_reports_backup_20261007
 *      (skipped if that table already exists).
 *   2. In one transaction: drops the unique constraint on arcgis_object_id, deletes
 *      every row, loads the feed, and adds a unique index on report_id. Readers keep
 *      seeing the old rows until the transaction commits.
 *   3. Clears the cached dashboard answers that read this table.
 *
 * Usage:
 *   npx tsx ingest/rebuild-irp-campsites-2026-10.ts --from-file <feed.json.gz>          # dry run
 *   npx tsx ingest/rebuild-irp-campsites-2026-10.ts --from-file <feed.json.gz> --apply
 *   Without --from-file the feed is downloaded live (about 960 requests).
 *
 * The feed file is the raw download saved in runtime-data/source-archive/ (an array
 * of feature attributes with x and y in Web Mercator).
 */

import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";
import { featureToRow, IRP_FEED_URL, IRP_PAGE_SIZE, type CampsiteRow, type IrpFeature } from "@/lib/campsites/irp-feed";

const APPLY = process.argv.includes("--apply");
const fileArg = process.argv.indexOf("--from-file");
const FROM_FILE = fileArg > 0 ? process.argv[fileArg + 1] : null;
const BACKUP = "homelessness.irp_campsite_reports_backup_20261007";
const BATCH = 2000;

async function downloadFeed(): Promise<IrpFeature[]> {
  const features: IrpFeature[] = [];
  for (let offset = 0; ; offset += IRP_PAGE_SIZE) {
    const params = new URLSearchParams({ where: "1=1", outFields: "*", returnGeometry: "true", orderByFields: "OBJECTID ASC",
      resultOffset: String(offset), resultRecordCount: String(IRP_PAGE_SIZE), f: "json" });
    const res = await fetch(`${IRP_FEED_URL}?${params}`, { signal: AbortSignal.timeout(30_000) });
    const data = await res.json();
    if (!data.features) throw new Error(`Feed error at offset ${offset}: ${JSON.stringify(data.error ?? data).slice(0, 200)}`);
    features.push(...data.features);
    if (data.features.length < IRP_PAGE_SIZE && !data.exceededTransferLimit) return features;
  }
}

function readFeedFile(path: string): IrpFeature[] {
  const raw = readFileSync(path);
  const rows = JSON.parse((path.endsWith(".gz") ? gunzipSync(raw) : raw).toString("utf8")) as Record<string, unknown>[];
  return rows.map(({ x, y, ...attributes }) => ({ attributes, geometry: { x: x as number | null, y: y as number | null } }));
}

async function main() {
  const features = FROM_FILE ? readFeedFile(FROM_FILE) : await downloadFeed();
  const rows = features.map(featureToRow).filter((r): r is CampsiteRow => r !== null);
  const unique = new Map(rows.map((r) => [r.report_id, r]));
  const dates = rows.map((r) => r.item_date).filter(Boolean).sort() as string[];
  console.log(`Feed: ${features.length} features, ${rows.length} usable rows, ${unique.size} distinct report_ids, item dates ${dates[0]} to ${dates.at(-1)}`);
  if (unique.size !== rows.length) throw new Error("report_id is not unique in this feed; refusing to re-key on it");

  const sql = postgres(requireDatabaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
  try {
    const [now] = await sql`SELECT count(*)::int AS rows, count(DISTINCT report_id)::int AS reports, max(item_date)::text AS latest
      FROM homelessness.irp_campsite_reports`;
    console.log(`Table now: ${now.rows} rows, ${now.reports} distinct reports, latest item ${now.latest}`);
    if (!APPLY) { console.log("Dry run. Nothing written."); return; }

    const [{ exists }] = await sql`SELECT to_regclass(${BACKUP}) IS NOT NULL AS exists`;
    if (!exists) {
      await sql.unsafe(`CREATE TABLE ${BACKUP} AS TABLE homelessness.irp_campsite_reports`);
      console.log(`Backed up to ${BACKUP}`);
    } else console.log(`${BACKUP} already exists; kept as is`);

    await sql.begin(async (transaction) => {
      // postgres.js types a transaction as non-callable; it is the same tagged template at runtime.
      const tx = transaction as unknown as postgres.Sql;
      await tx.unsafe(`ALTER TABLE homelessness.irp_campsite_reports DROP CONSTRAINT IF EXISTS irp_campsite_reports_arcgis_object_id_key`);
      await tx`DELETE FROM homelessness.irp_campsite_reports`;
      const all = [...unique.values()];
      for (let i = 0; i < all.length; i += BATCH) {
        const b = all.slice(i, i + BATCH);
        await tx`INSERT INTO homelessness.irp_campsite_reports
            (report_id, arcgis_object_id, incident_date, incident_id, is_duplicate, item_date, is_vehicle, lat, lon)
          SELECT * FROM unnest(
            ${tx.array(b.map((r) => r.report_id))}::text[],
            ${tx.array(b.map((r) => r.arcgis_object_id))}::bigint[],
            ${tx.array(b.map((r) => r.incident_date))}::timestamptz[],
            ${tx.array(b.map((r) => r.incident_id))}::text[],
            ${tx.array(b.map((r) => r.is_duplicate))}::boolean[],
            ${tx.array(b.map((r) => r.item_date))}::timestamptz[],
            ${tx.array(b.map((r) => r.is_vehicle))}::boolean[],
            ${tx.array(b.map((r) => r.lat))}::numeric[],
            ${tx.array(b.map((r) => r.lon))}::numeric[])`;
      }
      await tx.unsafe(`CREATE UNIQUE INDEX IF NOT EXISTS irp_campsite_reports_report_id_key ON homelessness.irp_campsite_reports (report_id)`);
    });
    await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail', 'accountability_promises')`;

    const [after] = await sql`SELECT count(*)::int AS rows, count(DISTINCT report_id)::int AS reports, min(item_date)::text AS first,
      max(item_date)::text AS latest FROM homelessness.irp_campsite_reports`;
    console.log("Table after:", after);
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
