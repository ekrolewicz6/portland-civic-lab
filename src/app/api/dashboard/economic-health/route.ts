import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";
import {
  computeEmpiricalHealth,
  type EmpiricalIndicatorInput,
  type MetroObservation,
} from "@/lib/scoring/empirical-health";

export const dynamic = "force-dynamic";

const CACHE_KEY = "economic-health";
const CACHE_TTL = 60 * 60 * 1000;

const PORTLAND_METRO_CODE = "38900";

const COMBINED_QUERY = `
  SELECT json_build_object(
    'metros', (
      SELECT COALESCE(json_agg(t ORDER BY t.display_order), '[]'::json) FROM (
        SELECT metro_code, short_name, is_portland, population
        FROM metro_metadata ORDER BY display_order
      ) t
    ),
    'unemploymentSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year * 100 + month) AS ym
          FROM metro_unemployment_monthly GROUP BY metro_code
        ),
        anchored AS (SELECT MIN(ym) AS common_ym FROM latest)
        SELECT u.metro_code, u.rate
        FROM metro_unemployment_monthly u
        JOIN anchored a ON u.year * 100 + u.month = a.common_ym
      ) t
    ),
    'unemploymentPortlandHistory', (
      SELECT COALESCE(json_agg(rate ORDER BY year, month), '[]'::json)
      FROM metro_unemployment_monthly WHERE metro_code = '${PORTLAND_METRO_CODE}'
    ),
    'employmentSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year * 10 + quarter) AS yq
          FROM metro_employment_quarterly WHERE establishments IS NOT NULL GROUP BY metro_code
        ),
        anchored AS (SELECT MIN(yq) AS common_yq FROM latest)
        SELECT e.metro_code,
               (
                 SELECT CASE WHEN prior.establishments > 0
                              THEN (e.establishments - prior.establishments)::numeric / prior.establishments * 100
                              ELSE NULL END
                 FROM metro_employment_quarterly prior
                 WHERE prior.metro_code = e.metro_code
                   AND prior.year = e.year - 1
                   AND prior.quarter = e.quarter
               ) AS yoy_pct
        FROM metro_employment_quarterly e
        JOIN anchored a ON e.year * 10 + e.quarter = a.common_yq
      ) t
    ),
    'employmentPortlandHistory', (
      SELECT COALESCE(json_agg(yoy ORDER BY year, quarter), '[]'::json) FROM (
        SELECT curr.year, curr.quarter,
               (curr.establishments - prior.establishments)::numeric / NULLIF(prior.establishments,0) * 100 AS yoy
        FROM metro_employment_quarterly curr
        JOIN metro_employment_quarterly prior
          ON prior.metro_code = curr.metro_code
         AND prior.year = curr.year - 1
         AND prior.quarter = curr.quarter
        WHERE curr.metro_code = '${PORTLAND_METRO_CODE}' AND curr.establishments IS NOT NULL
      ) t
    ),
    'wageSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year * 10 + quarter) AS yq
          FROM metro_employment_quarterly
          WHERE avg_weekly_wage IS NOT NULL GROUP BY metro_code
        ),
        anchored AS (SELECT MIN(yq) AS common_yq FROM latest)
        SELECT e.metro_code,
               (
                 SELECT CASE WHEN prior.avg_weekly_wage > 0
                              THEN (e.avg_weekly_wage - prior.avg_weekly_wage)::numeric / prior.avg_weekly_wage * 100
                              ELSE NULL END
                 FROM metro_employment_quarterly prior
                 WHERE prior.metro_code = e.metro_code
                   AND prior.year = e.year - 1
                   AND prior.quarter = e.quarter
               ) AS wage_yoy_pct
        FROM metro_employment_quarterly e
        JOIN anchored a ON e.year * 10 + e.quarter = a.common_yq
      ) t
    ),
    'wagePortlandHistory', (
      SELECT COALESCE(json_agg(yoy ORDER BY year, quarter), '[]'::json) FROM (
        SELECT curr.year, curr.quarter,
               (curr.avg_weekly_wage - prior.avg_weekly_wage)::numeric / NULLIF(prior.avg_weekly_wage,0) * 100 AS yoy
        FROM metro_employment_quarterly curr
        JOIN metro_employment_quarterly prior
          ON prior.metro_code = curr.metro_code
         AND prior.year = curr.year - 1
         AND prior.quarter = curr.quarter
        WHERE curr.metro_code = '${PORTLAND_METRO_CODE}' AND curr.avg_weekly_wage IS NOT NULL
      ) t
    ),
    'pbjAsOf', (SELECT to_char(MAX(month),'YYYY-MM-DD') FROM pbj_business_monthly),
    'businessTrend12mo', (
      SELECT json_build_object('curr', curr, 'prior', prior) FROM (
        SELECT
          SUM(new_businesses) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr,
          SUM(new_businesses) FILTER (
            WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
              AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
          ) AS prior
        FROM pbj_business_monthly
      ) t
    )
  ) AS payload
`;

type Row = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function buildSnapshotInput(args: {
  metros: Array<{ metro_code: string; short_name: string; is_portland: boolean; population: number | null }>;
  snapshot: Row[];
  valueKey: string;
  populationDivide?: boolean;
  inverted: boolean;
  label: string;
  description: string;
  source: string;
  portlandHistory: number[];
}): EmpiricalIndicatorInput | null {
  const metroById = new Map(args.metros.map((m) => [m.metro_code, m]));
  const obs: MetroObservation[] = [];
  for (const s of args.snapshot) {
    const meta = metroById.get(String(s.metro_code));
    if (!meta) continue;
    let v = num(s[args.valueKey]);
    if (args.populationDivide && meta.population) v = (v / meta.population) * 100_000;
    obs.push({
      metroCode: meta.metro_code,
      isPortland: meta.is_portland,
      shortName: meta.short_name,
      current: v,
      population: meta.population,
    });
  }
  const portland = obs.find((o) => o.isPortland);
  if (!portland) return null;
  if (args.portlandHistory.length < 6) return null;
  let history = args.portlandHistory;
  if (args.populationDivide && portland.population) {
    history = history.map((v) => (v / portland.population!) * 100_000);
  }
  return {
    portlandCurrent: portland.current,
    portlandHistory: history,
    peerSnapshot: obs,
    inverted: args.inverted,
    label: args.label,
    description: args.description,
    source: args.source,
  };
}

export async function GET() {
  try {
    const cached = await getCachedData<Record<string, unknown>>(CACHE_KEY, CACHE_TTL);
    if (cached) return NextResponse.json(cached);

    const result = (await sql.unsafe(COMBINED_QUERY)) as unknown as Array<{ payload: Row }>;
    const p = result[0]?.payload ?? {};

    const metros = (p.metros as Array<{
      metro_code: string;
      short_name: string;
      is_portland: boolean;
      population: number | null;
    }>) ?? [];

    const composite = computeEmpiricalHealth({
      unemployment: buildSnapshotInput({
        metros,
        snapshot: (p.unemploymentSnapshot as Row[]) ?? [],
        valueKey: "rate",
        inverted: true,
        label: "Unemployment rate",
        description: "BLS LAUS Portland MSA. Lower is better.",
        source: "BLS LAUS",
        portlandHistory: ((p.unemploymentPortlandHistory as unknown[]) ?? []).map((v) => Number(v)),
      }),
      employment: buildSnapshotInput({
        metros,
        snapshot: (p.employmentSnapshot as Row[]) ?? [],
        valueKey: "yoy_pct",
        inverted: false,
        label: "Employment growth (YoY)",
        description: "QCEW total establishments year-over-year change.",
        source: "BLS QCEW",
        portlandHistory: ((p.employmentPortlandHistory as unknown[]) ?? [])
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v)),
      }),
      wageGrowth: buildSnapshotInput({
        metros,
        snapshot: (p.wageSnapshot as Row[]) ?? [],
        valueKey: "wage_yoy_pct",
        inverted: false,
        label: "Wage growth (YoY %)",
        description: "QCEW average weekly wage, year-over-year change.",
        source: "BLS QCEW",
        portlandHistory: ((p.wagePortlandHistory as unknown[]) ?? [])
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v)),
      }),
    });

    const tail = composite.subScores
      .map(
        (s) =>
          `${s.label.toLowerCase()} ${s.value} (Portland ${s.portlandHistoricalPercentile}p, peers ${s.peerPercentile}p)`,
      )
      .join("; ");
    const headline =
      composite.label === "Insufficient data"
        ? "Economic Health: data refreshing — partial signal available."
        : `Economic Health: ${composite.score}/100 (${composite.label}) — ${tail || "see detail"}.`;

    const trendDirection: "up" | "down" | "flat" =
      composite.score >= 60 ? "up" : composite.score >= 40 ? "flat" : "down";

    // Hero chart: monthly new-business count from PBJ — simplest 24-pt series
    // that signals "is the local economy growing".
    const businessSeriesQ = `
      SELECT to_char(month,'YYYY-MM') AS month, new_businesses
      FROM pbj_business_monthly ORDER BY month
    `;
    const series = (await sql.unsafe(businessSeriesQ)) as unknown as Array<{
      month: string;
      new_businesses: number;
    }>;
    const chartData = series.map((r) => ({ date: r.month, value: num(r.new_businesses) }));

    const insights = composite.subScores.map((s) => {
      const histDirection = s.inverted
        ? s.portlandHistoricalPercentile >= 70
          ? "below"
          : s.portlandHistoricalPercentile <= 30
          ? "above"
          : "near"
        : s.portlandHistoricalPercentile >= 70
        ? "above"
        : s.portlandHistoricalPercentile <= 30
        ? "below"
        : "near";
      const peerDirection = s.peerPercentile >= 60
        ? "ahead of peer median"
        : s.peerPercentile <= 40
        ? "behind peer median"
        : "near peer median";
      const valStr = s.label.toLowerCase().includes("rate")
        ? s.portlandCurrent.toFixed(1) + "%"
        : s.label.toLowerCase().includes("growth")
        ? s.portlandCurrent.toFixed(1) + "%"
        : Math.round(s.portlandCurrent).toLocaleString();
      return `${s.label}: Portland at ${valStr} — ${histDirection} historical median, ${peerDirection}.`;
    });

    const responseData = {
      headline,
      headlineValue: composite.score,
      dataStatus: composite.label === "Insufficient data" ? "partial" : "live",
      dataAvailable: composite.subScores.length > 0,
      composite: {
        score: composite.score,
        label: composite.label,
        subScores: composite.subScores,
        missing: composite.missing,
      },
      dataSources: [
        { name: "BLS LAUS (Unemployment, monthly)", status: "connected", provider: "Bureau of Labor Statistics", action: "7 metros, 10y history" },
        { name: "BLS QCEW (Employment, quarterly)", status: "connected", provider: "Bureau of Labor Statistics", action: "7 metros, 10y history" },
        { name: "BLS QCEW (Wages, quarterly)", status: "connected", provider: "Bureau of Labor Statistics", action: "7 metros, 10y history" },
        { name: "PBJ Public Records (descriptive)", status: (p.pbjAsOf as string) ? "connected" : "no_data", provider: "Portland Business Journal", action: (p.pbjAsOf as string) ? `data through ${p.pbjAsOf}` : "no data" },
      ],
      trend: { direction: trendDirection, percentage: composite.score, label: "vs Portland history + peer metros" },
      chartData,
      source: "BLS LAUS · BLS QCEW · Census BFS",
      lastUpdated: new Date().toISOString().slice(0, 10),
      insights,
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Economic Health API error:", err);
    return NextResponse.json({
      headline: "Economic health data temporarily unavailable",
      headlineValue: 0,
      dataStatus: "error",
      dataAvailable: false,
      composite: null,
      dataSources: [],
      trend: { direction: "flat" as const, percentage: 0, label: "error" },
      chartData: [],
      source: "BLS LAUS · BLS QCEW · Census BFS",
      lastUpdated: new Date().toISOString().slice(0, 10),
      insights: [],
    });
  }
}
