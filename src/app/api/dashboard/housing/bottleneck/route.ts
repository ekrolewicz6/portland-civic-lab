import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";

export const dynamic = "force-dynamic";

const CACHE_KEY = "housing_bottleneck";

interface BottleneckEntry {
  activity_type: string;
  avg_days_to_complete: number;
  median_days_to_complete: number;
  pct_is_last_review: number;
  total_permits_reviewed: number;
  avg_correction_rounds: number;
}

interface SlowestPermit {
  detail_id: number;
  permit_type: string | null;
  address: string | null;
  days_to_issue: number | null;
  status: string | null;
  activity_type: string;
  days_from_setup: number;
}

interface TrendPoint {
  quarter: string;
  [key: string]: string | number; // activity_type keys with median_days values
}

interface BottleneckResponse {
  ranking: BottleneckEntry[];
  trend: TrendPoint[];
  slowest_examples: SlowestPermit[];
  total_permits_analyzed: number;
  date_range: { earliest: string; latest: string };
  correction_stats: {
    avg_rounds: number;
    pct_with_corrections: number;
  };
  dataStatus: string;
}

// All reads collapsed into a single round trip via json_build_object,
// using precomputed materialized views for the slow PERCENTILE_CONT and
// window-function queries (see ingest/create-housing-matviews.ts).
const EXCLUDED_TYPES = [
  'D - Permit Request',
  'Facilities Final Inspection',
  'Facilities Process Management',
  'Under Inspection',
  'Plat Issuance',
  'Enforcement',
  'Permit Expiration',
  'E - Code Compliance',
  'Tree Inspections',
  'Deconstruction Inspections',
  'Sign Inspections',
  'City Attorney',
  'Bond/Insurance PW',
  'Pre-Issuance PW',
  'Permit Frontage',
  'Deconstruction',
  'Intake',
  'Home Occupation Permit Issuance',
  'Revenue',
  'Multnomah County',
  'Trade Permits',
];

const COMBINED_QUERY = `
  SELECT json_build_object(
    'ranking', (
      SELECT COALESCE(json_agg(t ORDER BY avg_days_to_complete DESC), '[]'::json) FROM (
        SELECT
          activity_type,
          avg_days_to_complete::float,
          median_days_to_complete::float,
          pct_is_last_review::float,
          total_permits_reviewed::int,
          avg_correction_rounds::float
        FROM housing.permit_bottleneck_analysis
        WHERE NOT (activity_type = ANY($1::text[]))
      ) t
    ),
    'trend', (
      SELECT COALESCE(json_agg(t ORDER BY quarter, activity_type), '[]'::json) FROM (
        SELECT quarter, activity_type, median_days
        FROM housing.mv_permit_bottleneck_trend
      ) t
    ),
    'slowest', (
      SELECT COALESCE(json_agg(t ORDER BY activity_type, days_from_setup DESC), '[]'::json) FROM (
        SELECT detail_id, permit_type, address, days_to_issue, status, activity_type, days_from_setup
        FROM housing.mv_permit_slowest_examples
      ) t
    ),
    'corrections', (
      SELECT row_to_json(t) FROM (
        SELECT total_permits, with_corrections, avg_rounds,
               earliest_activity as earliest, latest_activity as latest
        FROM housing.mv_permit_correction_stats WHERE id = 1
      ) t
    )
  ) AS payload
`;

type Row = Record<string, unknown>;

export async function GET(): Promise<NextResponse<BottleneckResponse>> {
  try {
    const cached = await getCachedData<BottleneckResponse>(CACHE_KEY, 24 * 60 * 60 * 1000);
    if (cached) return NextResponse.json(cached);

    const t0 = Date.now();
    const result = await sql.unsafe(COMBINED_QUERY, [EXCLUDED_TYPES]);
    const payload = (result[0]?.payload ?? {}) as Record<string, unknown>;
    console.log(`[housing/bottleneck] combined matview query: ${Date.now() - t0}ms`);

    const rankingRows = (payload.ranking as Row[]) ?? [];
    const trendRows = (payload.trend as Row[]) ?? [];
    const slowestRows = (payload.slowest as Row[]) ?? [];
    const corr = (payload.corrections as Row | null) ?? null;

    const ranking: BottleneckEntry[] = rankingRows.map((r) => ({
      activity_type: r.activity_type as string,
      avg_days_to_complete: Number(r.avg_days_to_complete),
      median_days_to_complete: Number(r.median_days_to_complete),
      pct_is_last_review: Number(r.pct_is_last_review),
      total_permits_reviewed: Number(r.total_permits_reviewed),
      avg_correction_rounds: Number(r.avg_correction_rounds),
    }));

    // Pivot trend rows into {quarter, "Fire Inspections": 35, ...}
    const trendMap = new Map<string, Record<string, number>>();
    for (const r of trendRows) {
      const q = r.quarter as string;
      if (!trendMap.has(q)) trendMap.set(q, {});
      trendMap.get(q)![r.activity_type as string] = Number(r.median_days);
    }
    const trend: TrendPoint[] = [...trendMap.entries()].map(([quarter, types]) => ({
      quarter,
      ...types,
    }));

    const date_range = {
      earliest: (corr?.earliest as string) ?? "unknown",
      latest: (corr?.latest as string) ?? "unknown",
    };

    const slowest_examples: SlowestPermit[] = slowestRows.map((r) => ({
      detail_id: Number(r.detail_id),
      permit_type: r.permit_type as string | null,
      address: r.address as string | null,
      days_to_issue: r.days_to_issue ? Number(r.days_to_issue) : null,
      status: r.status as string | null,
      activity_type: r.activity_type as string,
      days_from_setup: Number(r.days_from_setup),
    }));

    const totalAnalyzed = Number(corr?.total_permits ?? 0);
    const withCorr = Number(corr?.with_corrections ?? 0);
    const avgRounds = Number(corr?.avg_rounds ?? 0);

    const responseData = {
      ranking,
      trend,
      slowest_examples,
      total_permits_analyzed: totalAnalyzed,
      date_range,
      correction_stats: {
        avg_rounds: avgRounds,
        pct_with_corrections:
          totalAnalyzed > 0
            ? Math.round((withCorr / totalAnalyzed) * 1000) / 10
            : 0,
      },
      dataStatus: ranking.length > 0 ? "available" : "empty",
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[housing/bottleneck] DB query failed:", error);
    return NextResponse.json(
      {
        ranking: [],
        trend: [],
        slowest_examples: [],
        total_permits_analyzed: 0,
        date_range: { earliest: "unknown", latest: "unknown" },
        correction_stats: { avg_rounds: 0, pct_with_corrections: 0 },
        dataStatus: "unavailable",
      },
      { status: 200 }
    );
  }
}
