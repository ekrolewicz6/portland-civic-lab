/**
 * The City of Portland's Impact Reduction Program campsite-report feed, shared by
 * the nightly sync (/api/cron/sync-campsites), the manual sync and the rebuild.
 *
 * Rows are keyed on report_id. The feed's OBJECTID is not stable: the city
 * renumbers it when it republishes the layer (by October 2026 OBJECTID 1 was the
 * newest report), so syncing "OBJECTID greater than the last one seen" silently
 * stopped loading in April 2026. report_id was unique across all 190,938 rows of
 * the feed on October 7, 2026.
 *
 * Feed: https://www.portlandmaps.com/od/rest/services/COP_OpenData_Miscellaneous/MapServer/1396
 * (200 records per request; item_date_create is a YYYYMMDDHHMMSS string).
 */

export const IRP_FEED_URL =
  "https://www.portlandmaps.com/od/rest/services/COP_OpenData_Miscellaneous/MapServer/1396/query";
export const IRP_PAGE_SIZE = 200;

export interface CampsiteRow {
  report_id: string;
  arcgis_object_id: number | null;
  incident_date: string;
  incident_id: string | null;
  is_duplicate: boolean;
  item_date: string | null;
  is_vehicle: boolean;
  lat: number | null;
  lon: number | null;
}

/** A feed feature, as returned by the ArcGIS query endpoint. */
export type IrpFeature = { attributes: Record<string, unknown>; geometry?: { x?: number | null; y?: number | null } | null };

function inRange(d: Date): boolean {
  return !isNaN(d.getTime()) && d.getUTCFullYear() >= 2020 && d.getUTCFullYear() <= 2035;
}

export function parseItemDate(s: unknown): string | null {
  if (typeof s !== "string" || s.length < 14) return null;
  const d = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}Z`);
  return inRange(d) ? d.toISOString() : null;
}

export function epochToTimestamp(epoch: unknown): string | null {
  if (typeof epoch !== "number") return null;
  const d = new Date(epoch);
  return inRange(d) ? d.toISOString() : null;
}

export function webMercatorToLatLon(x: number, y: number): { lat: number; lon: number } {
  const lon = (x / 20037508.34) * 180;
  let lat = (y / 20037508.34) * 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
  return { lat: Math.round(lat * 1e7) / 1e7, lon: Math.round(lon * 1e7) / 1e7 };
}

/** One feed feature as a table row, or null when it has no report_id or no valid incident date. */
export function featureToRow(f: IrpFeature): CampsiteRow | null {
  const a = f.attributes;
  const reportId = a.report_id == null ? "" : String(a.report_id).trim();
  const incidentDate = epochToTimestamp(a.inc_date_create);
  if (!reportId || !incidentDate) return null;
  const x = f.geometry?.x, y = f.geometry?.y;
  const coords = x != null && y != null ? webMercatorToLatLon(x, y) : null;
  return {
    report_id: reportId,
    arcgis_object_id: typeof a.OBJECTID === "number" ? a.OBJECTID : null,
    incident_date: incidentDate,
    incident_id: a.inc_id == null ? null : String(a.inc_id),
    is_duplicate: a.duplicate === 1,
    item_date: parseItemDate(a.item_date_create),
    is_vehicle: a.IS_VEHICLE === "Yes",
    lat: coords?.lat ?? null,
    lon: coords?.lon ?? null,
  };
}

/** The feed's YYYYMMDDHHMMSS form of a date, for "item_date_create >= ..." windows. */
export function feedTimestamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
}

/** Days re-read on every sync, so late edits to recent reports are picked up. */
export const IRP_OVERLAP_DAYS = 14;
