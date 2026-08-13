/**
 * Data sources for the I-5 Rose Quarter closure experiment.
 *
 * PORTAL is the PSU Transportation Data Archive — the public research archive
 * of Portland-region freeway detector data. Its download forms are backed by a
 * plain GET JSON/CSV API with no login and no token; the parameters below were
 * read off the forms' own `data-apibase` attributes and verified against live
 * responses on 2026-08-13.
 *
 * Two things about that API will silently corrupt the data if forgotten:
 *
 *   1. `end_date` is EXCLUSIVE at midnight. Passing the same date for start and
 *      end returns hour 00 only — one twenty-fourth of the day, with no error.
 *      `dayRange()` below is the only place that arithmetic is allowed to live.
 *   2. Rows are per DETECTOR (per lane), not per station. Aggregating without
 *      summing lanes first understates volume and mis-weights speed.
 *
 * PORTAL is a public good run by a university. We identify ourselves, fetch
 * sequentially at about one request a second, and cache aggressively so a
 * re-run costs nothing. Being the reason a public archive adds rate limits
 * would be a poor outcome for a civic transparency project.
 */

export const PORTAL_BASE = "https://new.portal.its.pdx.edu";
export const FREEWAY_API = `${PORTAL_BASE}/highways/api/freewaydata/`;
export const STATION_META = `${PORTAL_BASE}/highways/api/stationmetadata/`;
export const DETECTOR_META = `${PORTAL_BASE}/highways/api/detectormetadata/`;

export const USER_AGENT =
  "PortlandCivicLab/1.0 (+https://www.portlandciviclab.org; civic transparency research)";

/** PORTAL's supported aggregation levels. */
export type Resolution = "00:00:20" | "00:05:00" | "00:15:00" | "01:00:00" | "24:00:00";

export const ROOT = "runtime-data/rose-quarter";
export const RAW_DIR = `${ROOT}/portal/raw`;
export const META_DIR = `${ROOT}/portal/meta`;
export const MANUAL_DIR = `${ROOT}/portal/manual`;
export const REPORTS_DIR = `${ROOT}/reports`;

export const LOCK_PATH = "ingest/rose-quarter/snapshots.lock.json";

export interface Snapshot {
  highwayId: number;
  date: string;
  resolution: Resolution;
  sha256: string;
  bytes: number;
  rowCount: number;
  distinctHours: number;
  fetchedAt: string;
  source: "api" | "manual-csv";
  /** sha256 of a prior fetch of the same key, when PORTAL backfilled late data. */
  supersedes?: string;
}

export interface Lock {
  note: string;
  snapshots: Snapshot[];
}

/**
 * PORTAL's `end_date` is exclusive, so a single day needs tomorrow's date as
 * the end. Isolated here, and unit-tested, because getting it wrong loses 23 of
 * every 24 hours without raising an error.
 */
export function dayRange(date: string): { start: string; end: string } {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`bad date: ${date}`);
  const next = new Date(d.getTime() + 24 * 60 * 60 * 1000);
  return { start: date, end: next.toISOString().slice(0, 10) };
}

export function freewayUrl(o: {
  highwayId: number;
  date: string;
  resolution: Resolution;
  format?: "json" | "csv";
}): string {
  const { start, end } = dayRange(o.date);
  const p = new URLSearchParams({
    start_date: start,
    end_date: end,
    highway_id: String(o.highwayId),
    resolution: o.resolution,
    format: o.format ?? "json",
  });
  return `${FREEWAY_API}?${p.toString()}`;
}

export function rawPath(highwayId: number, date: string, resolution: Resolution): string {
  const res = resolution.replace(/:/g, "");
  return `${RAW_DIR}/hw${highwayId}/res${res}/${date}.json`;
}

/** A row as PORTAL returns it — one lane, one interval. */
export interface DetectorRow {
  id: number;
  starttime: string;
  detector_id: number;
  volume: number | null;
  speed: number | null;
  occupancy: number | null;
  countreadings: number | null;
  vmt: number | null;
  vht: number | null;
  delay: number | null;
  traveltime: number | null;
  resolution: string;
}

/**
 * Weather, for flagging days rather than deleting them. Open-Meteo's archive
 * needs no key. Coordinates are PDX.
 */
export const WEATHER_API =
  "https://archive-api.open-meteo.com/v1/archive?latitude=45.5887&longitude=-122.5969" +
  "&hourly=precipitation&timezone=America%2FLos_Angeles";
