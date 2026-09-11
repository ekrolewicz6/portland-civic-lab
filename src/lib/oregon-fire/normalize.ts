import { createHash } from "node:crypto";
import { bbox, booleanIntersects, feature, simplify } from "@turf/turf";
import type { Feature, Geometry, MultiPolygon, Polygon } from "geojson";
import type { FireRecord, FireSource } from "./types";

export type Attributes = Record<string, string | number | boolean | null>;
export interface InputFeature {
  type: "Feature";
  properties: Attributes;
  geometry: Geometry;
}
export function textValue(a: Attributes, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = a[key];
    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() &&
      !/^(unknown|no data|n\/a|none|null)$/i.test(String(value).trim())
    )
      return String(value).trim();
  }
  return null;
}
export function numberValue(a: Attributes, ...keys: string[]): number | null {
  const s = textValue(a, ...keys);
  const n = s === null ? NaN : Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
export function isoDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const d = new Date(typeof value === "number" ? value : String(value));
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}
export function cleanIrwin(s: string | null): string | null {
  return s?.replace(/[{}]/g, "").toLowerCase() || null;
}
export function normalize(source: FireSource, f: InputFeature): FireRecord {
  const a = f.properties;
  const s = source.id;
  if (s.startsWith("odf-") && !textValue(a, "RegistrationNumber"))
    throw new Error(`${s}: missing registration identifier`);
  const native =
    s === "facts"
      ? [a.activity_cn, a.activity_unit_cn, a.suid].join(":")
      : s.startsWith("odf-")
        ? [
            a.DistrictName,
            a.RegistrationNumber,
            a.ActualIgnitionTime ?? a.PlannedIgnitionTime,
            a.BurnType,
          ].join(":")
        : textValue(
            a,
            "GlobalID",
            "TRT_GUID",
            "IrwinID",
            "FOD_ID",
            "OBJECTID",
            "objectid",
          );
  if (!native || native === "::")
    throw new Error(`${s}: missing native identifier`);
  let date = isoDate(
    a.TRT_DATE ??
      a.date_completed ??
      a.DATE_COMPLETED ??
      a.ActualIgnitionTime ??
      a.PlannedIgnitionTime ??
      a.Dateplanned ??
      a.FireDiscoveryDateTime,
  );
  let year = date
    ? Number(date.slice(0, 4))
    : numberValue(
        a,
        "fire_year",
        "FIRE_YEAR",
        "fiscal_year_completed",
        "TRT_FY",
      );
  let precision: FireRecord["datePrecision"] = date
    ? "day"
    : year
      ? "year"
      : "unknown";
  if (s === "blm")
    precision =
      ({ Day: "day", Month: "month", Year: "year" } as const)[
        String(a.TRT_DATE_ACC) as "Day" | "Month" | "Year"
      ] ?? "unknown";
  if (s.startsWith("explorer")) {
    date = null;
    precision = "year";
  }
  if (s === "fod") {
    year = numberValue(a, "FIRE_YEAR");
    date =
      year && numberValue(a, "DISCOVERY_DOY")
        ? new Date(Date.UTC(year, 0, Number(a.DISCOVERY_DOY))).toISOString()
        : null;
    precision = date ? "day" : "year";
  }
  let kind: FireRecord["kind"] = "prescribed",
    recordKind: FireRecord["recordKind"] = "treatment",
    status = "Completed treatment";
  const activity =
    textValue(a, "activity", "BURN_TYPE", "BurnType", "ACTIVITY") ??
    "Not reported";
  if (s === "facts" && /burned in wildfire/i.test(activity)) {
    kind = "wildfire";
    status = "Treatment consumed by wildfire";
  }
  if (s === "blm") status = textValue(a, "TRT_STATUS") ?? "Unknown";
  if (s === "pnw") {
    const st = String(a.BURN_STATUS);
    status =
      (
        {
          "1": "Planned — under consideration",
          "2": "Planned in next 1–10 days",
          "3": "In progress — timing uncertain",
          "4": "Monitoring",
          "5": "Ignitions complete",
        } as Record<string, string>
      )[st] ?? "Unknown";
    kind = ["4", "5"].includes(st) ? "prescribed" : "planned";
    recordKind = "planning-unit";
  }
  if (s.startsWith("odf-")) {
    const accomplished = Number(s.slice(-1)) % 2 === 1;
    kind = accomplished ? "prescribed" : "planned";
    recordKind = accomplished ? "accomplishment" : "planning-unit";
    status = accomplished ? "Reported accomplishment" : "Planned";
  }
  if (s.startsWith("explorer")) {
    kind = "wildfire";
    recordKind = "perimeter";
    status = "Historical perimeter";
  }
  if (s === "fod" || s === "wfigs") {
    kind = "wildfire";
    recordKind = "occurrence";
    status =
      s === "fod"
        ? "Historical occurrence"
        : a.FireOutDateTime
          ? "Reported out"
          : "Recent report";
  }
  const reportedYear = year,
    reportedDate = date;
  const dateNote =
    year !== null && (year < 1800 || year > new Date().getFullYear() + 5)
      ? `Source reports year ${year}, outside the supported date range; retained as an unverified date.`
      : null;
  if (dateNote) {
    year = null;
    date = null;
    precision = "unknown";
  }
  const point = f.geometry.type === "Point";
  return {
    id: `${s}:${createHash("sha256").update(native).digest("hex").slice(0, 24)}`,
    sourceId: s,
    nativeId: native,
    reportedYear,
    reportedDate,
    dateNote,
    name:
      textValue(
        a,
        "TRT_NAME",
        "activity_unit_name",
        "ACTIVITY_UNIT_NAME",
        "SaleName",
        "fire_name",
        "FIRE_NAME",
        "IncidentName",
      ) ?? "Unnamed record",
    kind,
    recordKind,
    agency:
      textValue(
        a,
        "fs_unit_name",
        "AGENCY_NAME",
        "DistrictName",
        "POOProtectingAgency",
        "SOURCE_REPORTING_UNIT_NAME",
      ) ?? source.agency,
    county: textValue(a, "County", "POOCounty", "COUNTY"),
    method:
      recordKind === "occurrence" || recordKind === "perimeter"
        ? "Wildfire"
        : activity,
    purpose:
      textValue(a, "REASON") ??
      (textValue(a, "purpose_code")
        ? `Reported code: ${a.purpose_code}`
        : null),
    status,
    date,
    datePrecision: precision,
    year,
    treatmentAcres:
      s === "facts" && a.uom === "ACRES"
        ? numberValue(a, "nbr_units_accomplished")
        : s === "blm"
          ? numberValue(a, "TRT_ACRES")
          : null,
    burnedAcres:
      s === "fod"
        ? numberValue(a, "FIRE_SIZE")
        : s === "wfigs"
          ? numberValue(a, "IncidentSize", "DailyAcres")
          : null,
    polygonAcres: numberValue(a, "GIS_ACRES", "gis_acres"),
    geometryMeaning: point
      ? "Reported location; not a burn boundary"
      : recordKind === "perimeter"
        ? "Mapped wildfire perimeter; may include unburned areas"
        : "Treatment or planning unit; not a measured burned footprint",
    accuracy:
      s === "fod"
        ? "Source locations are at least as precise as a PLSS section; individual accuracy varies."
        : textValue(a, "ACCURACY_FT")
          ? `Source reports ${a.ACCURACY_FT} feet accuracy`
          : "Location accuracy not reported; polygon does not imply a surveyed boundary.",
    sourceUrl: source.url,
    documentIds: [
      textValue(a, "PLANID", "nepa_project_id"),
      textValue(a, "nepa_doc_name"),
    ].filter((v): v is string => v !== null),
    irwinId: cleanIrwin(textValue(a, "IrwinID", "IRWINID", "IRWIN_ID")),
    sourceUpdatedAt: isoDate(
      a.ModifiedOnDateTime_dt ?? a.etl_modified_date_haz,
    ),
  };
}

export function prepareFeature(
  source: FireSource,
  f: InputFeature,
  boundary: Feature<Polygon | MultiPolygon>,
) {
  if (!f.geometry) throw new Error(`${source.id}: missing geometry`);
  const b = bbox(f.geometry);
  if (
    !b.every(Number.isFinite) ||
    b[0] < -180 ||
    b[2] > 180 ||
    b[1] < -90 ||
    b[3] > 90
  )
    throw new Error(`${source.id}: invalid WGS84 coordinates`);
  if (!booleanIntersects(feature(f.geometry), boundary)) return null;
  const data = normalize(source, f);
  const held =
    data.kind !== "wildfire" &&
    Object.entries(f.properties).some(
      ([k, v]) =>
        /ownership|agency|reason/i.test(k) &&
        /tribal|tribe|cultural|bureau of indian|\bBIA\b/i.test(String(v)),
    );
  const mapGeometry =
    f.geometry.type === "Point"
      ? f.geometry
      : simplify(feature(f.geometry), { tolerance: 0.0003, highQuality: true })
          .geometry;
  const checksum = createHash("sha256")
    .update(JSON.stringify({ attributes: f.properties, geometry: f.geometry }))
    .digest("hex");
  return {
    data,
    held,
    geometry: f.geometry,
    mapGeometry,
    b,
    checksum,
    attributes: f.properties,
  };
}
