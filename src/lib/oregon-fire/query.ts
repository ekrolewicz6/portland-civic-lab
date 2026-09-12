import { z } from "zod";
import sql from "../db-query";
import { FIRE_SOURCES } from "./sources";
import type {
  FireRecord,
  MapItem,
  RecordResult,
  SourceCoverage,
} from "./types";

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
      .enum(["prescribed", "wildfire", "planned", "all"])
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
function current() {
  return sql`WITH latest_rolling AS (
    SELECT DISTINCT ON(r.id) r.id,r.run_id,i.completed_at,s.active_run
    FROM fire.records r JOIN fire.import_runs i ON i.id=r.run_id JOIN fire.sources s ON s.id=r.source_id
    WHERE i.status='complete' AND r.source_id IN ('pnw','odf-2','odf-3','wfigs','wfigs-perimeters')
    ORDER BY r.id,i.completed_at DESC
  ), visible AS NOT MATERIALIZED (
    SELECT r.*,i.completed_at AS observed_at,true AS in_latest_feed
    FROM fire.sources s JOIN fire.records r ON r.run_id=s.active_run
    JOIN fire.import_runs i ON i.id=r.run_id AND i.status='complete'
    WHERE s.id NOT IN ('pnw','odf-0','odf-1','odf-2','odf-3','wfigs','wfigs-perimeters')
    UNION ALL
    SELECT r.*,l.completed_at AS observed_at,r.run_id=l.active_run AS in_latest_feed
    FROM latest_rolling l JOIN fire.records r ON r.run_id=l.run_id AND r.id=l.id
  ), current AS NOT MATERIALIZED (
    SELECT * FROM visible v WHERE public=true AND NOT (source_id='wfigs' AND EXISTS(
      SELECT 1 FROM fire.records f JOIN fire.sources fs ON fs.id='fod' AND f.run_id=fs.active_run
      WHERE f.source_id='fod' AND f.data->>'irwinId' IS NOT NULL AND f.data->>'irwinId'=v.data->>'irwinId'))
  )`;
}

function predicate(f: FireFilters) {
  const q = `%${f.q.replace(/[\\%_]/g, "\\$&")}%`;
  return sql`west<=${f.bbox[2]} AND east>=${f.bbox[0]} AND south<=${f.bbox[3]} AND north>=${f.bbox[1]}
    AND ((data->>'year')::int BETWEEN ${f.from} AND ${f.to} OR data->>'year' IS NULL)
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
  const where = predicate(f);
  const [counts, rows, options] = await Promise.all([
    sql`${current()} SELECT source_id,count(*)::int AS count FROM current WHERE ${where} GROUP BY source_id`,
    sql`${current()} SELECT data || jsonb_build_object('lastObservedAt',observed_at,'inLatestFeed',in_latest_feed) AS data FROM current WHERE ${where} ORDER BY (data->>'year')::int DESC NULLS LAST,id OFFSET ${f.cursor} LIMIT 50`,
    sql`SELECT i.metadata->'summary' AS summary FROM fire.import_runs i JOIN fire.sources s ON i.id=s.active_run`,
  ]);
  const total = counts.reduce((n, r) => n + Number(r.count), 0),
    aggregated = total > 1200 || f.zoom < 8;
  let map: MapItem[];
  if (aggregated) {
    const size = Math.max(0.005, Math.pow(2, 6 - Math.floor(f.zoom)) * 0.9);
    const cells =
      await sql`${current()} SELECT floor(((west+east)/2)/${size}) AS x,floor(((south+north)/2)/${size}) AS y,CASE WHEN count(DISTINCT data->>'kind')>1 THEN 'mixed' ELSE min(data->>'kind') END AS kind,count(*)::int AS count FROM current WHERE ${where} GROUP BY x,y`;
    map = cells.map((c) => ({
      id: `cell:${c.x}:${c.y}:${c.kind}`,
      name: `${c.count} ${c.kind === "mixed" ? "source" : c.kind} records`,
      kind: c.kind,
      count: Number(c.count),
      geometry: {
        type: "Point",
        coordinates: [(Number(c.x) + 0.5) * size, (Number(c.y) + 0.5) * size],
      },
    }));
  } else {
    const features =
      await sql`${current()} SELECT id,data->>'name' AS name,data->>'kind' AS kind,map_geometry FROM current WHERE ${where}`;
    map = features.map((r) => ({
      id: r.id,
      name: r.name,
      kind: r.kind,
      geometry: r.map_geometry,
    }));
  }
  const states = await coverage();
  return {
    dataStatus: states.some((s) => s.lastSuccess && s.role === "primary")
      ? "available"
      : "unavailable",
    records: rows.map((r) => r.data),
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
export async function recordDetail(id: string) {
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
      ? await sql`${current()} SELECT data FROM current WHERE ${linked} OR (id<>${id} AND data->>'irwinId' IS NOT NULL AND data->>'irwinId'=${row.data.irwinId}) LIMIT 30`
      : [];
  return {
    record: row.data as FireRecord,
    geometry: row.geometry,
    observedAt: row.observed_at,
    checksum: row.checksum,
    attributes: row.attributes,
    history,
    related: explicit.map((r) => r.data as FireRecord),
    explanations,
  };
}
export async function exportRows(f: FireFilters) {
  return sql`${current()} SELECT data || jsonb_build_object('lastObservedAt',observed_at,'inLatestFeed',in_latest_feed,'coverageNote','Source records are incomplete and may overlap other sources; not unique fires.') AS data FROM current WHERE ${predicate(f)} ORDER BY id`;
}
export function csvCell(v: unknown) {
  const s = String(v ?? "");
  return `"${(/^[=+@\-\t\r]/.test(s) ? "'" : "") + s.replace(/"/g, '""')}"`;
}
