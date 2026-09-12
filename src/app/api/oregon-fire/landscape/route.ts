import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db-query";
import { feature, simplify } from "@turf/turf";
import { coverage, filterSchema } from "@/lib/oregon-fire/query";
import type { LandscapeResult } from "@/lib/oregon-fire/landscape";

export const dynamic = "force-dynamic";
const schema = z.object({
  end: z.coerce
    .number()
    .int()
    .min(2009)
    .max(new Date().getFullYear())
    .default(new Date().getFullYear()),
  zoom: z.coerce.number().min(0).max(20).default(6),
  years: z.enum(["1", "5", "10"]).default("5"),
});
// Reuse the existing bounds validator without accepting arbitrary SQL filters.
export async function GET(request: Request) {
  const p = Object.fromEntries(new URL(request.url).searchParams);
  const window = schema.safeParse(p);
  const view = filterSchema.safeParse({ bbox: p.bbox });
  if (!window.success || !view.success)
    return NextResponse.json(
      { error: "Invalid time window or map bounds" },
      { status: 400 },
    );
  const to = window.data.end,
    from = to - Number(window.data.years) + 1;
  const [west, south, east, north] = view.data.bbox;
  const effectiveZoom = Math.min(
    window.data.zoom,
    Math.log2(360 / (east - west)) + 2,
  );
  const tolerance =
    effectiveZoom >= 10 ? 0.0003 : effectiveZoom >= 8 ? 0.0007 : 0.002;
  try {
    const sources = (await coverage()).filter((s) =>
      ["explorer-0", "wfigs-perimeters"].includes(s.id),
    );
    if (!sources.some((s) => s.lastSuccess))
      return NextResponse.json(
        {
          error:
            "Fire perimeters are unavailable; source coverage remains available below.",
        },
        { status: 503 },
      );
    const baselineEnd =
      sources.find((s) => s.id === "explorer-0" && s.lastSuccess)?.maxYear ??
      1999;
    const rows = await sql`WITH latest AS (
      SELECT DISTINCT ON(r.id) r.id,r.run_id FROM fire.records r
      JOIN fire.import_runs i ON i.id=r.run_id
      WHERE r.source_id='wfigs-perimeters' AND i.status='complete'
      ORDER BY r.id,i.completed_at DESC
    ), perimeters AS NOT MATERIALIZED (
      SELECT r.* FROM fire.records r JOIN fire.sources s ON s.id='explorer-0' AND r.run_id=s.active_run WHERE r.source_id='explorer-0'
      UNION ALL
      SELECT r.* FROM latest l JOIN fire.records r ON r.run_id=l.run_id AND r.id=l.id
    ) SELECT id,source_id,data->>'name' AS name,(data->>'year')::int AS year,map_geometry FROM perimeters
      WHERE public=true AND data->>'recordKind'='perimeter' AND data->>'kind'='wildfire'
      AND (source_id='explorer-0' OR (source_id='wfigs-perimeters' AND (data->>'year')::int>${baselineEnd}))
      AND (data->>'year')::int BETWEEN ${from} AND ${to}
      AND west<=${east} AND east>=${west} AND south<=${north} AND north>=${south}
      ORDER BY (data->>'year')::int,id`;
    const result: LandscapeResult = {
      scars: rows.map((r) => ({
        id: r.id,
        sourceId: r.source_id,
        name: r.name,
        year: r.year,
        kind: "wildfire",
        geometry: simplify(feature(r.map_geometry), {
          tolerance: tolerance,
          highQuality: true,
        }).geometry,
      })),
      total: rows.length,
      from,
      to,
      years: Array.from({ length: to - from + 1 }, (_, i) => ({
        year: from + i,
        count: rows.filter((r) => r.year === from + i).length,
      })),
      coverage: sources.map((s) => ({
        sourceId: s.id,
        lastSuccess: s.lastSuccess,
        maxYear: s.maxYear,
        state: s.state,
      })),
    };
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Fire perimeters are temporarily unavailable. Try again shortly.",
      },
      { status: 503 },
    );
  }
}
