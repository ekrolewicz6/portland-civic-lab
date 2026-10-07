import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db-query";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { featureToRow, feedTimestamp, IRP_FEED_URL, IRP_OVERLAP_DAYS, IRP_PAGE_SIZE, type CampsiteRow, type IrpFeature } from "@/lib/campsites/irp-feed";

/** Upper bound on any single upstream request. */
const FETCH_TIMEOUT_MS = 30_000;

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const INSERT_BATCH = 500;
const MAX_PAGES = 2000;

async function fetchPage(
  where: string,
  offset: number,
  retries = 3,
): Promise<{ features: any[]; exceededTransferLimit: boolean }> {
  const params = new URLSearchParams({
    where,
    outFields: "*",
    f: "json",
    returnGeometry: "true",
    resultRecordCount: String(IRP_PAGE_SIZE),
    resultOffset: String(offset),
    orderByFields: "OBJECTID ASC",
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Bounded so a hung upstream cannot eat the entire maxDuration budget.
      const res = await fetch(`${IRP_FEED_URL}?${params}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, attempt * 3000));
          continue;
        }
        throw new Error(`HTTP ${res.status} after ${retries} attempts`);
      }
      const data = await res.json();
      if (data.error) throw new Error(`ArcGIS: ${data.error.message}`);
      return {
        features: data.features ?? [],
        exceededTransferLimit: data.exceededTransferLimit === true,
      };
    } catch (err: any) {
      if (attempt < retries && !err.message?.includes("after")) {
        await new Promise((r) => setTimeout(r, attempt * 3000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}

async function upsertBatch(rows: CampsiteRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const result = await sql`
    INSERT INTO homelessness.irp_campsite_reports (
      report_id, arcgis_object_id, incident_date, incident_id, is_duplicate,
      item_date, is_vehicle, lat, lon
    )
    SELECT * FROM unnest(
      ${sql.array(rows.map((r) => r.report_id))}::text[],
      ${sql.array(rows.map((r) => r.arcgis_object_id))}::bigint[],
      ${sql.array(rows.map((r) => r.incident_date))}::timestamptz[],
      ${sql.array(rows.map((r) => r.incident_id))}::text[],
      ${sql.array(rows.map((r) => r.is_duplicate))}::boolean[],
      ${sql.array(rows.map((r) => r.item_date))}::timestamptz[],
      ${sql.array(rows.map((r) => r.is_vehicle))}::boolean[],
      ${sql.array(rows.map((r) => r.lat))}::numeric[],
      ${sql.array(rows.map((r) => r.lon))}::numeric[]
    )
    ON CONFLICT (report_id) DO UPDATE SET
      arcgis_object_id = EXCLUDED.arcgis_object_id,
      incident_date    = EXCLUDED.incident_date,
      incident_id      = EXCLUDED.incident_id,
      is_duplicate     = EXCLUDED.is_duplicate,
      item_date        = EXCLUDED.item_date,
      is_vehicle       = EXCLUDED.is_vehicle,
      lat              = EXCLUDED.lat,
      lon              = EXCLUDED.lon
  `;
  return result.count;
}

// ── Route handler ───────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const t0 = Date.now();

  try {
    // Get current state
    const [state] = await sql`
      SELECT MAX(item_date) AS max_item, COUNT(*)::int AS total
      FROM homelessness.irp_campsite_reports
    `;

    // Re-read every report dated within IRP_OVERLAP_DAYS of the newest one held, keyed on report_id.
    // The feed's OBJECTID is renumbered when the city republishes, so it cannot mark progress.
    const allFeatures: IrpFeature[] = [];
    const where = state.max_item
      ? `item_date_create >= '${feedTimestamp(new Date(new Date(state.max_item).getTime() - IRP_OVERLAP_DAYS * 86_400_000))}'`
      : "1=1";

    for (let page = 0; page < MAX_PAGES; page++) {
      const offset = page * IRP_PAGE_SIZE;
      const { features, exceededTransferLimit } = await fetchPage(
        where,
        offset,
      );
      allFeatures.push(...features);
      if (features.length < IRP_PAGE_SIZE && !exceededTransferLimit) break;
    }

    // Transform and upsert
    const rows = allFeatures
      .map(featureToRow)
      .filter((r): r is CampsiteRow => r !== null);

    let totalAffected = 0;
    let batchErrors = 0;
    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
      const batch = rows.slice(i, i + INSERT_BATCH);
      try {
        totalAffected += await upsertBatch(batch);
      } catch (err) {
        batchErrors++;
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[sync-campsites] batch error at ${i}: ${message}`);
      }
    }

    const [after] = await sql`
      SELECT MAX(item_date)::text AS max_date, COUNT(*)::int AS total
      FROM homelessness.irp_campsite_reports
    `;

    if (totalAffected > 0) {
      await sql`
        DELETE FROM public.dashboard_cache
        WHERE question IN ('homelessness', 'homelessness_detail', 'accountability_promises')
      `;
    }

    // Rows fetched but none written is a failed run, not a quiet one.
    const failed = rows.length > 0 && totalAffected === 0;

    const result = {
      ok: !failed,
      ms: Date.now() - t0,
      fetched: allFeatures.length,
      upserted: rows.length,
      affected: totalAffected,
      batchErrors,
      before: state.total,
      after: after.total,
      netNew: Number(after.total) - Number(state.total),
      latestDate: after.max_date,
    };

    console.log(
      `[sync-campsites] Done: +${result.netNew} new, ${totalAffected} affected, ${Date.now() - t0}ms`,
    );
    return NextResponse.json(result, { status: failed ? 500 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sync-campsites] FATAL: ${message}`);
    return NextResponse.json(
      { ok: false, error: message, ms: Date.now() - t0 },
      { status: 500 },
    );
  }
}
