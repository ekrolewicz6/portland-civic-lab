import { randomUUID } from "node:crypto";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import sql from "../db-query";
import { FIRE_SOURCES, SOURCE_BY_ID } from "./sources";
import {
  getJson,
  inspectLayer,
  fetchFeatures,
  type LayerMetadata,
} from "./arcgis";
import { prepareFeature, type InputFeature } from "./normalize";

const json = (data: unknown) =>
  sql.json(data as Parameters<typeof sql.json>[0]);
const boundaryUrl =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/State_County/MapServer/7/query";
export async function registerSources() {
  for (const source of FIRE_SOURCES)
    await sql`INSERT INTO fire.sources(id,definition) VALUES(${source.id},${json(source)}) ON CONFLICT(id) DO UPDATE SET definition=excluded.definition`;
}
export async function oregonBoundary(): Promise<
  Feature<Polygon | MultiPolygon>
> {
  const [row] =
    await sql`SELECT data FROM fire.reference WHERE id='oregon-boundary'`;
  if (row) return row.data;
  const data = await getJson<{ features: Feature<Polygon | MultiPolygon>[] }>(
    boundaryUrl,
    {
      f: "geojson",
      where: "STATE='41'",
      outFields: "NAME,STATE",
      outSR: "4326",
      returnGeometry: "true",
    },
  );
  if (data.features.length !== 1)
    throw new Error("Expected one Oregon boundary");
  await sql`INSERT INTO fire.reference(id,data,source_url) VALUES('oregon-boundary',${json(data.features[0])},${boundaryUrl}) ON CONFLICT(id) DO NOTHING`;
  return data.features[0];
}
interface Checkpoint {
  ids: number[];
  offset: number;
  meta: LayerMetadata;
  oid: string;
}
export async function writeBatch(
  runId: string,
  sourceId: string,
  features: InputFeature[],
  boundary: Feature<Polygon | MultiPolygon>,
) {
  const source = SOURCE_BY_ID[sourceId];
  const located = features.filter((f) => f.geometry);
  for (const f of features.filter((f) => !f.geometry)) {
    const native = String(f.properties.OBJECTID ?? f.properties.objectid);
    await sql`INSERT INTO fire.rejections(run_id,native_id,attributes,reason) VALUES(${runId},${native},${json(f.properties)},'Source geometry missing; Oregon intersection cannot be verified') ON CONFLICT DO NOTHING`;
  }
  const prepared = located
    .map((f) => prepareFeature(source, f, boundary))
    .filter((p) => p !== null);
  if (prepared.length) {
    const values = prepared.map((p) => ({
      run_id: runId,
      id: p.data.id,
      source_id: sourceId,
      native_id: p.data.nativeId,
      data: json(p.data),
      attributes: json(p.attributes),
      geometry: json(p.geometry),
      map_geometry: json(p.mapGeometry),
      checksum: p.checksum,
      west: p.b[0],
      south: p.b[1],
      east: p.b[2],
      north: p.b[3],
      public: !p.held,
    }));
    await sql`INSERT INTO fire.records ${sql(values)} ON CONFLICT(run_id,id) DO UPDATE SET data=excluded.data,attributes=excluded.attributes,geometry=excluded.geometry,map_geometry=excluded.map_geometry,checksum=excluded.checksum,west=excluded.west,south=excluded.south,east=excluded.east,north=excluded.north,public=excluded.public`;
  }
  return {
    accepted: prepared.length,
    held: prepared.filter((p) => p.held).length,
  };
}
export async function summarizeRun(runId: string) {
  const [summary] =
    await sql`SELECT min((data->>'year')::int) AS "minYear",max((data->>'year')::int) AS "maxYear",
    array_agg(DISTINCT data->>'agency') AS agencies,array_agg(DISTINCT data->>'method') AS methods,
    array_agg(DISTINCT data->>'purpose') FILTER(WHERE data->>'purpose' IS NOT NULL) AS purposes,array_agg(DISTINCT data->>'status') AS statuses,
    (SELECT count(*)::int FROM fire.rejections WHERE run_id=${runId}) AS unlocated
    FROM fire.records WHERE run_id=${runId} AND public`;
  await sql`UPDATE fire.import_runs SET metadata=metadata || jsonb_build_object('summary',${json(summary)}) WHERE id=${runId}`;
}
export async function completeRun(
  runId: string,
  sourceId: string,
  metadata: unknown,
) {
  await summarizeRun(runId);
  // A single transaction publishes the snapshot only after every requested ID.
  await sql.begin(async (tx) => {
    const invalid = await tx.unsafe(
      "SELECT id FROM fire.records WHERE run_id=$1 AND (jsonb_typeof(data)<>'object' OR jsonb_typeof(geometry)<>'object') LIMIT 1",
      [runId],
    );
    if (invalid.length)
      throw new Error("Invalid JSON representation; snapshot not published");
    await tx.unsafe(
      "UPDATE fire.import_runs SET accepted_count=(SELECT count(*) FROM fire.records WHERE run_id=$1),held_count=(SELECT count(*) FROM fire.records WHERE run_id=$1 AND NOT public) WHERE id=$1",
      [runId],
    );
    await tx.unsafe(
      "UPDATE fire.import_runs SET status='complete',completed_at=now(),metadata=metadata || $1::jsonb,checkpoint='{}' WHERE id=$2",
      [metadata as Parameters<typeof sql.json>[0], runId],
    );
    await tx.unsafe(
      "UPDATE fire.sources SET active_run=$1,last_success=now(),last_error=null WHERE id=$2",
      [runId, sourceId],
    );
  });
}
export async function failRun(runId: string, sourceId: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Import failed";
  await sql`UPDATE fire.import_runs SET status='failed',completed_at=now(),error=${message} WHERE id=${runId}`;
  await sql`UPDATE fire.sources SET last_error=${message} WHERE id=${sourceId}`;
}
export async function syncSource(
  sourceId: string,
  budgetMs = 220000,
  force = false,
) {
  const source = SOURCE_BY_ID[sourceId];
  if (!source?.endpoint) throw new Error("Unknown ArcGIS source");
  const started = Date.now();
  let runId: string | null = null;
  const [state] =
    await sql`SELECT *,last_success > now()-(${source.cadenceHours ?? 24}*interval '1 hour') AS fresh FROM fire.sources WHERE id=${sourceId}`;
  const [running] =
    await sql`SELECT id FROM fire.import_runs WHERE source_id=${sourceId} AND status='running'`;
  if (state?.fresh && !force && !running) return { sourceId, status: "fresh" };
  try {
    // Lease prevents concurrent cron/CLI workers from advancing the same cursor.
    const [claimed] =
      await sql`UPDATE fire.import_runs SET lease_until=now()+interval '6 minutes' WHERE source_id=${sourceId} AND status='running' AND lease_until<now() RETURNING *`;
    let checkpoint: Checkpoint;
    if (claimed) {
      runId = claimed.id;
      checkpoint = claimed.checkpoint;
    } else if (running) return { sourceId, status: "leased" };
    else {
      runId = randomUUID();
      const inserted =
        await sql`INSERT INTO fire.import_runs(id,source_id,status,lease_until) VALUES(${runId},${sourceId},'running',now()+interval '6 minutes') ON CONFLICT DO NOTHING RETURNING id`;
      if (!inserted.length) return { sourceId, status: "leased" };
      const inspection = await inspectLayer(source);
      checkpoint = { ...inspection, offset: 0 };
      await sql`UPDATE fire.import_runs SET checkpoint=${json(checkpoint)} WHERE id=${runId}`;
    }
    if (!checkpoint.ids)
      throw new Error("Incomplete import initialization; retry a new run");
    const boundary = await oregonBoundary();
    while (
      checkpoint.offset < checkpoint.ids.length &&
      Date.now() - started < budgetMs
    ) {
      const ids = checkpoint.ids.slice(
        checkpoint.offset,
        checkpoint.offset + (sourceId.startsWith("explorer") ? 20 : 200),
      );
      const features = await fetchFeatures(source, checkpoint.meta, ids);
      const count = await writeBatch(runId!, sourceId, features, boundary);
      checkpoint.offset += ids.length;
      await sql`UPDATE fire.import_runs SET checkpoint=${json(checkpoint)},lease_until=now()+interval '6 minutes',fetched_count=${checkpoint.offset},accepted_count=accepted_count+${count.accepted},held_count=held_count+${count.held} WHERE id=${runId!}`;
    }
    if (checkpoint.offset === checkpoint.ids.length) {
      // Reject a moving full inventory rather than publish a mixed snapshot.
      const after = await inspectLayer(source);
      if (
        JSON.stringify(after.ids) !== JSON.stringify(checkpoint.ids) ||
        after.meta.editingInfo?.lastEditDate !==
          checkpoint.meta.editingInfo?.lastEditDate
      )
        throw new Error(
          "Source changed during import; previous snapshot retained",
        );
      await completeRun(runId!, sourceId, {
        endpoint: source.endpoint,
        where: source.where ?? "1=1",
        outSR: 4326,
        expectedCount: checkpoint.ids.length,
        sourceMetadata: checkpoint.meta,
        completedIds: checkpoint.offset,
      });
      return { sourceId, status: "complete", fetched: checkpoint.offset };
    }
    await sql`UPDATE fire.import_runs SET lease_until=now() WHERE id=${runId!}`;
    return {
      sourceId,
      status: "running",
      fetched: checkpoint.offset,
      total: checkpoint.ids.length,
    };
  } catch (error) {
    if (runId) await failRun(runId, sourceId, error);
    throw error;
  }
}
