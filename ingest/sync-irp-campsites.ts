/**
 * sync-irp-campsites.ts
 *
 * Manual version of the nightly /api/cron/sync-campsites job: loads the City of
 * Portland's Impact Reduction Program campsite reports into
 * homelessness.irp_campsite_reports.
 *
 * Re-reads every report dated within 14 days of the newest one held and upserts
 * on report_id. The feed's OBJECTID is renumbered when the city republishes the
 * layer, so it is stored for reference only and never used to mark progress.
 * Parsing lives in src/lib/campsites/irp-feed.ts, shared with the job.
 *
 * To rebuild the whole table from the feed, use rebuild-irp-campsites-2026-10.ts.
 *
 * Usage: set -a && source .env.local && set +a && npx tsx ingest/sync-irp-campsites.ts
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";
import { featureToRow, feedTimestamp, IRP_FEED_URL, IRP_OVERLAP_DAYS, IRP_PAGE_SIZE, type CampsiteRow, type IrpFeature } from "@/lib/campsites/irp-feed";

const BATCH = 500;

async function fetchWindow(where: string): Promise<IrpFeature[]> {
  const features: IrpFeature[] = [];
  for (let offset = 0; ; offset += IRP_PAGE_SIZE) {
    const params = new URLSearchParams({ where, outFields: "*", returnGeometry: "true", orderByFields: "OBJECTID ASC",
      resultOffset: String(offset), resultRecordCount: String(IRP_PAGE_SIZE), f: "json" });
    const res = await fetch(`${IRP_FEED_URL}?${params}`, { signal: AbortSignal.timeout(30_000) });
    const data = await res.json();
    if (!data.features) throw new Error(`Feed error at offset ${offset}: ${JSON.stringify(data.error ?? data).slice(0, 200)}`);
    features.push(...data.features);
    if (data.features.length < IRP_PAGE_SIZE && !data.exceededTransferLimit) return features;
  }
}

async function main() {
  const sql = postgres(requireDatabaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
  try {
    const [state] = await sql`SELECT max(item_date) AS max_item, count(*)::int AS total FROM homelessness.irp_campsite_reports`;
    const where = state.max_item
      ? `item_date_create >= '${feedTimestamp(new Date(new Date(state.max_item).getTime() - IRP_OVERLAP_DAYS * 86_400_000))}'`
      : "1=1";
    console.log(`Table holds ${state.total} reports, newest ${state.max_item ?? "none"}. Fetching where ${where}`);
    const rows = (await fetchWindow(where)).map(featureToRow).filter((r): r is CampsiteRow => r !== null);
    let affected = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
      const b = rows.slice(i, i + BATCH);
      const r = await sql`INSERT INTO homelessness.irp_campsite_reports
          (report_id, arcgis_object_id, incident_date, incident_id, is_duplicate, item_date, is_vehicle, lat, lon)
        SELECT * FROM unnest(
          ${sql.array(b.map((x) => x.report_id))}::text[], ${sql.array(b.map((x) => x.arcgis_object_id))}::bigint[],
          ${sql.array(b.map((x) => x.incident_date))}::timestamptz[], ${sql.array(b.map((x) => x.incident_id))}::text[],
          ${sql.array(b.map((x) => x.is_duplicate))}::boolean[], ${sql.array(b.map((x) => x.item_date))}::timestamptz[],
          ${sql.array(b.map((x) => x.is_vehicle))}::boolean[], ${sql.array(b.map((x) => x.lat))}::numeric[],
          ${sql.array(b.map((x) => x.lon))}::numeric[])
        ON CONFLICT (report_id) DO UPDATE SET arcgis_object_id = EXCLUDED.arcgis_object_id, incident_date = EXCLUDED.incident_date,
          incident_id = EXCLUDED.incident_id, is_duplicate = EXCLUDED.is_duplicate, item_date = EXCLUDED.item_date,
          is_vehicle = EXCLUDED.is_vehicle, lat = EXCLUDED.lat, lon = EXCLUDED.lon`;
      affected += r.count;
    }
    const [after] = await sql`SELECT max(item_date)::text AS max_item, count(*)::int AS total FROM homelessness.irp_campsite_reports`;
    console.log(`Fetched ${rows.length}, upserted ${affected}. Table now ${after.total} reports, newest ${after.max_item}.`);
    if (affected > 0) await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail', 'accountability_promises')`;
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
