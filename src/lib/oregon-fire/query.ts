import { costObservations } from "./costs";
import { projectsForRecord } from "./projects";
import { z } from "zod";
import { AsyncLocalStorage } from "node:async_hooks";
import defaultSql from "../db-query";
import { FIRE_SOURCES } from "./sources";
import type {
  FireRecord,
  MapItem,
  RecordResult,
  SourceCoverage,
} from "./types";

const readConnections = new AsyncLocalStorage<typeof defaultSql>();
const sql = new Proxy(defaultSql, {
  apply(_target, _thisArg, args) { return Reflect.apply(readConnections.getStore() ?? defaultSql, undefined, args); },
  get(_target, property) {
    const client = readConnections.getStore() ?? defaultSql;
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
async function readSnapshot<T>(read: () => Promise<T>): Promise<T> {
  // These short interactive queries do not benefit from LLVM compilation.
  // One snapshot also keeps counts, map cells and list rows consistent.
  return await defaultSql.begin("ISOLATION LEVEL REPEATABLE READ READ ONLY", async (tx) => {
    await tx.unsafe("SET LOCAL jit=off");
    return readConnections.run(tx as unknown as typeof defaultSql, read);
  }) as T;
}

export const filterSchema = z
  .object({
    from: z.coerce.number().int().min(1800).max(2200).default(2021),
    to: z.coerce
      .number()
      .int()
      .min(1800)
      .max(2200)
      .default(new Date().getFullYear()),
    kind: z
      .enum(["prescribed", "wildfire", "planned", "mechanical", "all"])
      .default("prescribed"),
    q: z.string().max(150).default(""),
    agency: z.string().max(150).default(""),
    method: z.string().max(150).default(""),
    purpose: z.string().max(150).default(""),
    status: z.string().max(150).default(""),
    cursor: z.coerce.number().int().min(0).max(1000000).default(0),
    zoom: z.coerce.number().min(0).max(20).default(6),
    bbox: z
      .string()
      .optional()
      .transform((s, ctx) => {
        const b = s ? s.split(",").map(Number) : [-124.9, 41.8, -116.3, 46.4];
        if (
          b.length !== 4 ||
          !b.every(Number.isFinite) ||
          b[0] >= b[2] ||
          b[1] >= b[3] ||
          b[0] < -180 ||
          b[2] > 180 ||
          b[1] < -90 ||
          b[3] > 90
        ) {
          ctx.addIssue({ code: "custom", message: "Invalid map bounds" });
          return z.NEVER;
        }
        return b;
      }),
  })
  .refine((v) => v.from <= v.to, {
    message: "Start year must precede end year",
  });
export type FireFilters = z.infer<typeof filterSchema>;

// Rolling records remain in history after disappearing from a feed. The last
// observed status is preserved, never inferred from absence. Full inventories
// use only their atomically published snapshot.
function current(kind = "all") {
  const includeIncidents = kind === "all" || kind === "wildfire";
  return sql`WITH latest_rolling AS (
    SELECT l.record_id AS id,l.run_id,i.completed_at,s.active_run
    FROM fire.rolling_latest l JOIN fire.import_runs i ON i.id=l.run_id JOIN fire.sources s ON s.id=l.source_id
    WHERE i.status='complete'
  ), recent_irwin AS MATERIALIZED (
    SELECT DISTINCT r.data->>'irwinId' AS irwin_id
    FROM latest_rolling l JOIN LATERAL (
      SELECT data,public,source_id FROM fire.records WHERE run_id=l.run_id AND id=l.id LIMIT 1
    ) r ON true
    WHERE r.public AND r.source_id='wfigs' AND r.data->>'irwinId' IS NOT NULL
  ), fod_irwin AS MATERIALIZED (
    SELECT DISTINCT r.data->>'irwinId' AS irwin_id
    FROM fire.sources s JOIN fire.records r ON r.run_id=s.active_run
    WHERE s.id='fod' AND r.public AND r.data->>'irwinId' IS NOT NULL
  ), visible AS NOT MATERIALIZED (
    SELECT r.*,i.completed_at AS observed_at,true AS in_latest_feed
    FROM fire.sources s JOIN fire.records r ON r.run_id=s.active_run
    JOIN fire.import_runs i ON i.id=r.run_id AND i.status='complete'
    WHERE s.id NOT IN ('pnw','odf-0','odf-1','odf-2','odf-3','wfigs','wfigs-perimeters')
    UNION ALL
    SELECT r.*,l.completed_at AS observed_at,r.run_id=l.active_run AS in_latest_feed
    FROM latest_rolling l JOIN LATERAL (
      SELECT * FROM fire.records WHERE run_id=l.run_id AND id=l.id LIMIT 1
    ) r ON true
  ), current AS NOT MATERIALIZED (
    SELECT * FROM visible WHERE public AND source_id NOT IN ('wfigs','wfigs-history')
    UNION ALL
    SELECT v.* FROM visible v
    LEFT JOIN fod_irwin f ON f.irwin_id=v.data->>'irwinId'
    LEFT JOIN recent_irwin recent ON v.source_id='wfigs-history' AND recent.irwin_id=v.data->>'irwinId'
    WHERE v.public AND ${includeIncidents} AND v.source_id IN ('wfigs','wfigs-history') AND f.irwin_id IS NULL AND recent.irwin_id IS NULL
  )`;
}

function predicate(f: FireFilters, includeYear = true) {
  const q = `%${f.q.replace(/[\\%_]/g, "\\$&")}%`;
  return sql`west<=${f.bbox[2]} AND east>=${f.bbox[0]} AND south<=${f.bbox[3]} AND north>=${f.bbox[1]}
    AND (${!includeYear} OR (data->>'year')::int BETWEEN ${f.from} AND ${f.to} OR (data->>'year')::int IS NULL)
    AND (${f.kind}='all' OR data->>'kind'=${f.kind})
    AND (${f.q}='' OR data->>'name' ILIKE ${q} OR data->>'county' ILIKE ${q} OR data->>'agency' ILIKE ${q})
    AND (${f.agency}='' OR data->>'agency'=${f.agency})
    AND (${f.method}='' OR data->>'method'=${f.method})
    AND (${f.purpose}='' OR data->>'purpose'=${f.purpose})
    AND (${f.status}='' OR data->>'status'=${f.status})`;
}
export async function coverage(): Promise<SourceCoverage[]> {
  try {
    const rows =
      await sql`SELECT s.id,s.last_success,s.last_error,i.accepted_count AS count,i.held_count AS held,
      (i.metadata->'summary'->>'minYear')::int AS min_year,(i.metadata->'summary'->>'maxYear')::int AS max_year,
      (i.metadata->'summary'->>'unlocated')::int AS unlocated
      FROM fire.sources s LEFT JOIN fire.import_runs i ON i.id=s.active_run`;
    return FIRE_SOURCES.map((s) => {
      const r = rows.find((r) => r.id === s.id),
        last = r?.last_success ? new Date(r.last_success).toISOString() : null;
      return {
        ...s,
        lastSuccess: last,
        error: r?.last_error
          ? last
            ? "Latest refresh failed; previous complete import retained."
            : "Import failed; no successful snapshot is available."
          : null,
        recordCount: last ? Number(r?.count) - Number(r?.held) : null,
        heldCount: last ? Number(r?.held) : null,
        unlocatedCount: last ? Number(r?.unlocated) : null,
        minYear: r?.min_year ?? null,
        maxYear: r?.max_year ?? null,
        state: !last
          ? "unavailable"
          : Date.now() - new Date(last).getTime() >
              (s.cadenceHours ?? 8760) * 3600000 * 2
            ? "stale"
            : "available",
      };
    });
  } catch {
    return FIRE_SOURCES.map((s) => ({
      ...s,
      lastSuccess: null,
      error: null,
      recordCount: null,
      heldCount: null,
      minYear: null,
      maxYear: null,
      state: "unavailable",
    }));
  }
}
export async function listRecords(f: FireFilters): Promise<RecordResult> {
  return readSnapshot(() => listRecordsInSnapshot(f));
}
async function listRecordsInSnapshot(f: FireFilters): Promise<RecordResult> {
  const where = predicate(f, false);
  const size = Math.max(0.005, Math.pow(2, 6 - Math.floor(f.zoom)) * 0.9);
  const [result] = await sql`${current(f.kind)}, filtered AS MATERIALIZED (
    SELECT id,run_id,source_id,data,west,east,south,north,observed_at,in_latest_feed FROM current
    WHERE ${where} AND (data->>'year')::int BETWEEN ${f.from} AND ${f.to}
    UNION ALL
    SELECT id,run_id,source_id,data,west,east,south,north,observed_at,in_latest_feed FROM current
    WHERE ${where} AND (data->>'year')::int IS NULL
  ), totals AS (SELECT count(*)::int AS total FROM filtered), page_rows AS (
    SELECT data || jsonb_build_object('lastObservedAt',observed_at,'inLatestFeed',in_latest_feed) AS data
    FROM filtered ORDER BY (data->>'year')::int DESC NULLS LAST,id OFFSET ${f.cursor} LIMIT 50
  ) SELECT totals.total,
    coalesce((SELECT jsonb_agg(data) FROM page_rows),'[]'::jsonb) AS records,
    coalesce((SELECT jsonb_agg(to_jsonb(c)) FROM (SELECT source_id,count(*)::int AS count FROM filtered GROUP BY source_id) c),'[]'::jsonb) AS counts,
    CASE WHEN totals.total>1200 OR ${f.zoom}<8 THEN
      coalesce((SELECT jsonb_agg(to_jsonb(c)) FROM (
        SELECT floor(((west+east)/2)/${size}) AS x,floor(((south+north)/2)/${size}) AS y,
        CASE WHEN count(DISTINCT data->>'kind')>1 THEN 'mixed' ELSE min(data->>'kind') END AS kind,count(*)::int AS count
        FROM filtered GROUP BY x,y) c),'[]'::jsonb)
    ELSE coalesce((SELECT jsonb_agg(jsonb_build_object('id',f.id,'name',f.data->>'name','kind',f.data->>'kind','geometry',r.map_geometry))
      FROM filtered f JOIN fire.records r ON r.run_id=f.run_id AND r.id=f.id),'[]'::jsonb) END AS map
    FROM totals`;
  const total = Number(result.total), aggregated = total > 1200 || f.zoom < 8;
  const counts = result.counts as { source_id: string; count: number }[];
  const map: MapItem[] = aggregated ? result.map.map((c: {x:number;y:number;kind:MapItem["kind"];count:number}) => ({
    id: `cell:${c.x}:${c.y}:${c.kind}`, name: `${c.count} ${c.kind === "mixed" ? "source" : c.kind} records`,
    kind: c.kind, count: c.count, geometry: { type: "Point", coordinates: [(Number(c.x)+0.5)*size,(Number(c.y)+0.5)*size] },
  })) : result.map;
  const options = await sql`SELECT i.metadata->'summary' AS summary FROM fire.import_runs i JOIN fire.sources s ON i.id=s.active_run`;
  const states = await coverage();
  return {
    dataStatus: states.some((s) => s.lastSuccess && s.role === "primary")
      ? "available"
      : "unavailable",
    records: result.records,
    total,
    nextCursor: f.cursor + 50 < total ? String(f.cursor + 50) : null,
    map,
    aggregated,
    sourceCounts: counts.map((r) => ({
      sourceId: r.source_id,
      count: Number(r.count),
    })),
    filters: {
      agencies: [
        ...new Set<string>(options.flatMap((r) => r.summary?.agencies ?? [])),
      ]
        .filter(Boolean)
        .sort(),
      methods: [
        ...new Set<string>(options.flatMap((r) => r.summary?.methods ?? [])),
      ]
        .filter(Boolean)
        .sort(),
      purposes: [
        ...new Set<string>(options.flatMap((r) => r.summary?.purposes ?? [])),
      ]
        .filter(Boolean)
        .sort(),
      statuses: [
        ...new Set<string>(options.flatMap((r) => r.summary?.statuses ?? [])),
      ]
        .filter(Boolean)
        .sort(),
    },
  };
}
export async function recordDetail(id: string, relatedCursor = 0) {
  return readSnapshot(() => recordDetailInSnapshot(id, relatedCursor));
}
async function recordDetailInSnapshot(id: string, relatedCursor: number) {
  const [row] =
    await sql`${current()} SELECT data || jsonb_build_object('lastObservedAt',observed_at,'inLatestFeed',in_latest_feed) AS data,geometry,observed_at,checksum,attributes FROM current WHERE id=${id}`;
  if (!row) return null;
  const [history, links, explanations] = await Promise.all([
    sql`SELECT DISTINCT ON(r.data->>'status',r.checksum) r.data->>'status' AS status,i.completed_at AS observed_at FROM fire.records r JOIN fire.import_runs i ON i.id=r.run_id WHERE r.id=${id} AND r.public AND i.status='complete' ORDER BY r.data->>'status',r.checksum,i.completed_at DESC`,
    sql`SELECT related_id FROM fire.links WHERE record_id=${id}`,
    sql`SELECT title,body,source_url,attribution,reviewed_at FROM fire.explanations WHERE record_id=${id} AND publication_approved`,
  ]);
  const linked = links.length
    ? sql`id IN ${sql(links.map((r) => r.related_id))}`
    : sql`false`;
  const explicit =
    links.length || row.data.irwinId
      ? await sql`${current()} SELECT data FROM current WHERE ${linked} OR (id<>${id} AND data->>'irwinId' IS NOT NULL AND data->>'irwinId'=${row.data.irwinId}) ORDER BY id LIMIT 31 OFFSET ${relatedCursor}`
      : [];
  return {
    record: row.data as FireRecord,
    geometry: row.geometry,
    observedAt: row.observed_at,
    checksum: row.checksum,
    attributes: row.attributes,
    history,
    related: explicit.slice(0,30).map((r) => r.data as FireRecord),
    relatedNextCursor: explicit.length > 30 ? String(relatedCursor + 30) : null,
    projects: projectsForRecord(id).map((p) => ({ id: p.id, title: p.title })),
    costs: costObservations(row.data as FireRecord, row.attributes),
    explanations,
  };
}
export async function exportRows(f: FireFilters) {
  return readSnapshot(async () => await sql`${current(f.kind)} SELECT data || jsonb_build_object('lastObservedAt',observed_at,'inLatestFeed',in_latest_feed,'coverageNote','Source records are incomplete and may overlap other sources; not unique fires.') AS data FROM current WHERE ${predicate(f)} ORDER BY id`);
}
export function csvCell(v: unknown) {
  const s = String(v ?? "");
  return `"${(/^[=+@\-\t\r]/.test(s) ? "'" : "") + s.replace(/"/g, '""')}"`;
}
