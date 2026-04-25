import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";
import {
  computeEconomicHealth,
  formatHealthHeadline,
  type ScoringInputs,
} from "@/lib/scoring/economic-health";

export const dynamic = "force-dynamic";

const CACHE_KEY = "economic-health";
const CACHE_TTL = 60 * 60 * 1000; // 1h

// All scoring inputs in one round-trip. Mirrors the pattern in
// economy/route.ts and homelessness/detail/route.ts to avoid the parallel-
// query deadlock at `max: 1`.
const COMBINED_QUERY = `
  WITH
    biz AS (
      SELECT
        SUM(new_businesses) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS curr_new,
        SUM(new_businesses) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
            AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS prior_new,
        SUM(bankruptcies + lawsuits + tax_liens) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS curr_distress,
        SUM(bankruptcies + lawsuits + tax_liens) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
            AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS prior_distress,
        SUM(bankruptcies) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS curr_bankruptcies
      FROM pbj_business_monthly
    ),
    re AS (
      SELECT
        SUM(total_volume_usd) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS curr_volume,
        SUM(total_volume_usd) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
            AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS prior_volume
      FROM pbj_real_estate_monthly
    )
  SELECT json_build_object(
    'biz',  (SELECT row_to_json(b) FROM biz b),
    're',   (SELECT row_to_json(r) FROM re r),
    'qcewLatest', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter, establishments
        FROM economy.qcew_employment
        WHERE industry_code = '10'
        ORDER BY year DESC, quarter DESC
        LIMIT 1
      ) t
    ),
    'qcewYearAgo', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter, establishments
        FROM economy.qcew_employment
        WHERE industry_code = '10'
        ORDER BY year DESC, quarter DESC
        OFFSET 4 LIMIT 1
      ) t
    ),
    'unemployment', (
      SELECT value::numeric AS rate
      FROM business.bls_employment_series
      WHERE series_id = 'LAUMT413890000000003'
      ORDER BY year DESC, period DESC
      LIMIT 1
    ),
    'permitsCurr', (
      SELECT COUNT(*)::int
      FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '12 months')
    ),
    'permitsPrior', (
      SELECT COUNT(*)::int
      FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '24 months')
        AND issued_date <  (CURRENT_DATE - INTERVAL '12 months')
    ),
    'chart', (
      SELECT COALESCE(json_agg(t ORDER BY t.month), '[]'::json) FROM (
        SELECT
          to_char(month, 'YYYY-MM') AS month,
          new_businesses,
          (bankruptcies + lawsuits + tax_liens) AS distress
        FROM pbj_business_monthly
        ORDER BY month DESC
        LIMIT 24
      ) t
    ),
    'pbjAsOf', (
      SELECT to_char(MAX(month), 'YYYY-MM-DD') FROM pbj_business_monthly
    )
  ) AS payload
`;

type Row = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    const cached = await getCachedData<Record<string, unknown>>(CACHE_KEY, CACHE_TTL);
    if (cached) return NextResponse.json(cached);

    const result = (await sql.unsafe(COMBINED_QUERY)) as unknown as Array<{
      payload: Record<string, unknown>;
    }>;
    const p = result[0]?.payload ?? {};

    const biz = (p.biz as Row) ?? {};
    const re = (p.re as Row) ?? {};
    const qcewLatest = p.qcewLatest as Row | null;
    const qcewYearAgo = p.qcewYearAgo as Row | null;
    const unempRow = p.unemployment as Row | null;
    const permitsCurr = num(p.permitsCurr);
    const permitsPrior = num(p.permitsPrior);
    const chartRows = (p.chart as Row[]) ?? [];
    const pbjAsOf = (p.pbjAsOf as string | null) ?? null;

    const inputs: ScoringInputs = {
      formation:
        biz.curr_new !== null && biz.prior_new !== null
          ? { current: num(biz.curr_new), prior: num(biz.prior_new) }
          : null,
      distress:
        biz.curr_distress !== null && biz.prior_distress !== null
          ? { current: num(biz.curr_distress), prior: num(biz.prior_distress) }
          : null,
      employment:
        qcewLatest && qcewYearAgo
          ? {
              current: num(qcewLatest.establishments),
              prior: num(qcewYearAgo.establishments),
            }
          : null,
      unemploymentRate: unempRow?.rate != null ? num(unempRow.rate) : null,
      permits: permitsCurr || permitsPrior ? { current: permitsCurr, prior: permitsPrior } : null,
      realEstate:
        re.curr_volume !== null && re.prior_volume !== null
          ? { current: num(re.curr_volume), prior: num(re.prior_volume) }
          : null,
    };

    const result_ = computeEconomicHealth(inputs);
    const newBiz12mo = num(biz.curr_new);
    const bankruptciesUp = num(biz.curr_bankruptcies) > 0; // simplified flag
    const headline = formatHealthHeadline(result_, {
      newBiz12mo,
      bankruptciesUp,
      unemployment: inputs.unemploymentRate ?? undefined,
    });

    const trendLabel = pbjAsOf ? `12-month window through ${pbjAsOf}` : "12-month window";
    const trendDirection: "up" | "down" | "flat" =
      result_.score >= 60 ? "up" : result_.score >= 40 ? "flat" : "down";

    // Hero chart: monthly new-business count (drives the "is the economy growing?" question).
    const chartData = chartRows
      .slice()
      .reverse()
      .map((r) => ({
        date: String(r.month),
        value: num(r.new_businesses),
      }));

    const insights: string[] = [];
    if (inputs.formation) {
      const pct =
        inputs.formation.prior > 0
          ? Math.round(((inputs.formation.current - inputs.formation.prior) / inputs.formation.prior) * 1000) / 10
          : 0;
      insights.push(
        `${inputs.formation.current.toLocaleString()} new businesses formed in the last 12 months (${pct >= 0 ? "+" : ""}${pct}% vs prior 12).`,
      );
    }
    if (inputs.distress) {
      const pct =
        inputs.distress.prior > 0
          ? Math.round(((inputs.distress.current - inputs.distress.prior) / inputs.distress.prior) * 1000) / 10
          : 0;
      insights.push(
        `Distress filings (bankruptcies + lawsuits + tax liens): ${inputs.distress.current.toLocaleString()} (${pct >= 0 ? "+" : ""}${pct}% YoY).`,
      );
    }
    if (inputs.unemploymentRate !== null) {
      insights.push(`Portland MSA unemployment: ${inputs.unemploymentRate.toFixed(1)}%.`);
    }
    if (result_.missing.length) {
      insights.push(
        `Score computed from ${result_.subScores.length} of 6 indicators (missing: ${result_.missing.join(", ")}).`,
      );
    }

    const responseData = {
      headline,
      headlineValue: result_.score,
      dataStatus: result_.label === "Insufficient data" ? "partial" : "live",
      dataAvailable: result_.subScores.length > 0,
      composite: {
        score: result_.score,
        label: result_.label,
        subScores: result_.subScores,
        missing: result_.missing,
      },
      dataSources: [
        {
          name: "PBJ Public Records (weekly)",
          status: pbjAsOf ? "connected" : "no_data",
          provider: "Portland Business Journal",
          action: pbjAsOf ? `data through ${pbjAsOf}` : "no data",
        },
        {
          name: "BLS QCEW (Multnomah)",
          status: qcewLatest ? "connected" : "no_data",
          provider: "Bureau of Labor Statistics",
          action: qcewLatest
            ? `${num(qcewLatest.establishments).toLocaleString()} establishments`
            : "no data",
        },
        {
          name: "BLS LAUS (MSA unemployment)",
          status: unempRow ? "connected" : "no_data",
          provider: "BLS LAUS",
          action: unempRow ? `${num(unempRow.rate).toFixed(1)}% rate` : "no data",
        },
        {
          name: "Portland BDS Permits",
          status: permitsCurr > 0 ? "connected" : "no_data",
          provider: "Bureau of Development Services",
          action: permitsCurr > 0 ? `${permitsCurr.toLocaleString()} permits (12mo)` : "no data",
        },
      ],
      trend: {
        direction: trendDirection,
        percentage: result_.score,
        label: trendLabel,
      },
      chartData,
      source: "PBJ Public Records · BLS QCEW · BLS LAUS · Portland BDS",
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
      source: "PBJ Public Records · BLS QCEW · BLS LAUS · Portland BDS",
      lastUpdated: new Date().toISOString().slice(0, 10),
      insights: [],
    });
  }
}
