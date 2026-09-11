import type { FireSource } from "./types";
import type { Attributes, InputFeature } from "./normalize";

export interface LayerMetadata {
  objectIdField?: string;
  objectIdFieldName?: string;
  maxRecordCount?: number;
  fields: {
    name: string;
    type: string;
    domain?: { codedValues?: { code: string | number; name: string }[] };
  }[];
  editingInfo?: { lastEditDate?: number };
  extent?: { spatialReference?: unknown };
}
export async function getJson<T>(
  url: string,
  params: Record<string, string> = {},
  attempt = 0,
): Promise<T> {
  const target = new URL(url);
  Object.entries(params).forEach(([k, v]) => target.searchParams.set(k, v));
  const response = await fetch(target, {
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });
  if (!response.ok) {
    if (
      attempt < 2 &&
      [404, 429, 500, 502, 503, 504].includes(response.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      return getJson<T>(url, params, attempt + 1);
    }
    throw new Error(`Source HTTP ${response.status} at ${target.pathname}`);
  }
  const data = (await response.json()) as {
    error?: { code?: number; message?: string; details?: unknown };
  };
  if (
    data.error &&
    attempt < 2 &&
    [400, 429, 500, 503].includes(data.error.code ?? 0)
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    return getJson<T>(url, params, attempt + 1);
  }
  if (data.error)
    throw new Error(
      `ArcGIS ${data.error.code}: ${data.error.message || JSON.stringify(data.error.details)}`,
    );
  return data as T;
}
export async function inspectLayer(source: FireSource) {
  if (!source.endpoint) throw new Error("No ArcGIS endpoint");
  const meta = await getJson<LayerMetadata>(source.endpoint, { f: "json" });
  const oid =
    meta.objectIdField ??
    meta.objectIdFieldName ??
    meta.fields.find((f) => f.type === "esriFieldTypeOID")?.name;
  if (!oid) throw new Error("Source is missing an object ID field");
  const ids = await getJson<{
    objectIds: number[] | null;
    exceededTransferLimit?: boolean;
  }>(`${source.endpoint}/query`, {
    f: "json",
    where: source.where ?? "1=1",
    returnIdsOnly: "true",
  });
  if (ids.exceededTransferLimit)
    throw new Error("Source truncated ID inventory");
  return { meta, oid, ids: (ids.objectIds ?? []).sort((a, b) => a - b) };
}
const explorerFields = [
  "OBJECTID",
  "GlobalID",
  "fire_name",
  "fire_year",
  "gis_acres",
  "source",
  "orig_source",
];
export async function fetchFeatures(
  source: FireSource,
  meta: LayerMetadata,
  ids: number[],
): Promise<InputFeature[]> {
  if (!ids.length) return [];
  const available = new Set(meta.fields.map((f) => f.name));
  const fields = (source.fields ?? explorerFields).filter((f) =>
    available.has(f),
  );
  const oid =
    meta.objectIdField ??
    meta.objectIdFieldName ??
    meta.fields.find((f) => f.type === "esriFieldTypeOID")?.name;
  if (oid && !fields.includes(oid)) fields.push(oid);
  // Some ArcGIS front ends answer 404 for long GET query strings. Keep
  // requests below that limit without dropping any IDs.
  if (
    ids.length > 1 &&
    source.endpoint!.length +
      ids.join(",").length +
      fields.join(",").length +
      200 >
      1700
  ) {
    const half = Math.ceil(ids.length / 2);
    return [
      ...(await fetchFeatures(source, meta, ids.slice(0, half))),
      ...(await fetchFeatures(source, meta, ids.slice(half))),
    ];
  }
  const data = await getJson<{
    features: InputFeature[];
    exceededTransferLimit?: boolean;
  }>(`${source.endpoint}/query`, {
    f: "geojson",
    objectIds: ids.join(","),
    outFields: fields.join(","),
    returnGeometry: "true",
    outSR: "4326",
  });
  const returnedIds = new Set(
    data.features.map((f) => Number(oid ? f.properties[oid] : NaN)),
  );
  if (
    data.exceededTransferLimit ||
    data.features.length !== ids.length ||
    (oid && !ids.every((id) => returnedIds.has(id)))
  ) {
    if (ids.length === 1)
      throw new Error("Source changed or truncated a record during import");
    const half = Math.ceil(ids.length / 2);
    return [
      ...(await fetchFeatures(source, meta, ids.slice(0, half))),
      ...(await fetchFeatures(source, meta, ids.slice(half))),
    ];
  }
  return data.features.map((f) => {
    const properties: Attributes = {};
    for (const key of fields) properties[key] = f.properties[key] ?? null;
    // Decode agency and method domains, but preserve status codes for mapping.
    for (const field of meta.fields.filter((x) =>
      ["AGENCY_NAME", "ACTIVITY", "Ownership", "ownership_code"].includes(
        x.name,
      ),
    )) {
      const code = properties[field.name];
      const match = field.domain?.codedValues?.find(
        (v) => String(v.code) === String(code),
      );
      if (match) properties[field.name] = match.name;
    }
    return { ...f, properties };
  });
}
