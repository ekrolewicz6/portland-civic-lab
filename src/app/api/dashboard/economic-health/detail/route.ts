import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";
import {
  computeEconomicHealth,
  type ScoringInputs,
} from "@/lib/scoring/economic-health";

export const dynamic = "force-dynamic";

const CACHE_KEY = "economic-health-detail";
const CACHE_TTL = 60 * 60 * 1000; // 1h

const COMBINED_QUERY = `
  WITH
    biz_window AS (
      SELECT
        SUM(new_businesses) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_new,
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
        SUM(bankruptcies) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_bankruptcies
      FROM pbj_business_monthly
    ),
    re_window AS (
      SELECT
        SUM(total_volume_usd) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_volume,
        SUM(total_volume_usd) FILTER (
          WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
            AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
        ) AS prior_volume,
        SUM(deal_count) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_deals,
        SUM(entity_buyers) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_entity_buyers
      FROM pbj_real_estate_monthly
    )
  SELECT json_build_object(
    'businessSeries', (
      SELECT COALESCE(json_agg(t ORDER BY t.month), '[]'::json) FROM (
        SELECT to_char(month,'YYYY-MM') AS month, new_businesses, bankruptcies, lawsuits, tax_liens
        FROM pbj_business_monthly
        ORDER BY month DESC LIMIT 24
      ) t
    ),
    'reSeries', (
      SELECT COALESCE(json_agg(t ORDER BY t.month), '[]'::json) FROM (
        SELECT to_char(month,'YYYY-MM') AS month, entity_buyers, person_buyers,
               total_volume_usd, deal_count, entity_share_pct
        FROM pbj_real_estate_monthly
        ORDER BY month DESC LIMIT 24
      ) t
    ),
    'serialBuyers', (
      SELECT COALESCE(json_agg(t ORDER BY t.deal_count DESC, t.total_volume_usd DESC), '[]'::json) FROM (
        SELECT buyer_name, buyer_type, deal_count, total_volume_usd, zip_count
        FROM pbj_serial_buyer
        ORDER BY deal_count DESC, total_volume_usd DESC
        LIMIT 25
      ) t
    ),
    'distressEntities', (
      SELECT COALESCE(json_agg(t ORDER BY t.category_count DESC), '[]'::json) FROM (
        SELECT entity_name, categories, category_count
        FROM pbj_distress_entity
        ORDER BY category_count DESC
        LIMIT 30
      ) t
    ),
    'topLawsuits', (
      SELECT COALESCE(json_agg(t ORDER BY t.damages_usd DESC), '[]'::json) FROM (
        SELECT defendant_name, plaintiff_name, suit_type, damages_usd, filed_date
        FROM pbj_top_lawsuit
        ORDER BY damages_usd DESC
        LIMIT 25
      ) t
    ),
    'zipInvestment', (
      SELECT COALESCE(json_agg(t ORDER BY t.total_investment_usd DESC), '[]'::json) FROM (
        SELECT zip_code, permit_count, permit_value_usd, re_deal_count, re_volume_usd,
               new_business_count, total_investment_usd
        FROM pbj_zip_investment
        WHERE zip_code LIKE '97%'
        ORDER BY total_investment_usd DESC
        LIMIT 30
      ) t
    ),
    'qcewLatest', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter, establishments, month3_employment, avg_weekly_wage
        FROM economy.qcew_employment
        WHERE industry_code = '10'
        ORDER BY year DESC, quarter DESC LIMIT 1
      ) t
    ),
    'qcewYearAgo', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter, establishments, month3_employment
        FROM economy.qcew_employment
        WHERE industry_code = '10'
        ORDER BY year DESC, quarter DESC OFFSET 4 LIMIT 1
      ) t
    ),
    'industryYoY', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        SELECT
          curr.industry_code,
          curr.industry_title,
          curr.month3_employment AS curr_jobs,
          prior.month3_employment AS prior_jobs,
          (curr.month3_employment - prior.month3_employment) AS jobs_delta,
          CASE WHEN prior.month3_employment > 0
               THEN ROUND(((curr.month3_employment - prior.month3_employment)::numeric / prior.month3_employment) * 100, 1)
               ELSE NULL END AS pct
        FROM economy.qcew_employment curr
        JOIN economy.qcew_employment prior
          ON prior.industry_code = curr.industry_code
         AND prior.year = curr.year - 1
         AND prior.quarter = curr.quarter
        WHERE curr.industry_code <> '10'
          AND length(curr.industry_code) = 3
          AND curr.year = (SELECT MAX(year) FROM economy.qcew_employment WHERE industry_code='10')
          AND curr.quarter = (SELECT MAX(quarter) FROM economy.qcew_employment WHERE industry_code='10' AND year = (SELECT MAX(year) FROM economy.qcew_employment WHERE industry_code='10'))
          AND curr.month3_employment > 1000
          AND prior.month3_employment > 1000
      ) t
    ),
    'unemployment', (
      SELECT row_to_json(t) FROM (
        SELECT value::numeric AS rate, year, period_name
        FROM business.bls_employment_series
        WHERE series_id = 'LAUMT413890000000003'
        ORDER BY year DESC, period DESC LIMIT 1
      ) t
    ),
    'permitsCurr', (
      SELECT COUNT(*)::int FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '12 months')
    ),
    'permitsPrior', (
      SELECT COUNT(*)::int FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '24 months')
        AND issued_date <  (CURRENT_DATE - INTERVAL '12 months')
    ),
    'biz', (SELECT row_to_json(b) FROM biz_window b),
    're',  (SELECT row_to_json(r) FROM re_window r),
    'pbjAsOf', (SELECT to_char(MAX(month),'YYYY-MM-DD') FROM pbj_business_monthly),
    'qcewAsOf', (
      SELECT MAX(year)::text || ' Q' || MAX(quarter)::text
      FROM economy.qcew_employment WHERE industry_code='10'
        AND year = (SELECT MAX(year) FROM economy.qcew_employment WHERE industry_code='10')
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

    const result = (await sql.unsafe(COMBINED_QUERY)) as unknown as Array<{ payload: Row }>;
    const p = result[0]?.payload ?? {};

    const biz = (p.biz as Row) ?? {};
    const re = (p.re as Row) ?? {};
    const qcewLatest = p.qcewLatest as Row | null;
    const qcewYearAgo = p.qcewYearAgo as Row | null;
    const unemp = p.unemployment as Row | null;
    const permitsCurr = num(p.permitsCurr);
    const permitsPrior = num(p.permitsPrior);
    const industryYoY = (p.industryYoY as Row[]) ?? [];

    // Compose scoring inputs (same shape as the hero so the score matches).
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
      unemploymentRate: unemp?.rate != null ? num(unemp.rate) : null,
      permits: permitsCurr || permitsPrior ? { current: permitsCurr, prior: permitsPrior } : null,
      realEstate:
        re.curr_volume !== null && re.prior_volume !== null
          ? { current: num(re.curr_volume), prior: num(re.prior_volume) }
          : null,
    };

    const composite = computeEconomicHealth(inputs);

    // Top industry gainers / losers (3 each).
    const sortedByPct = [...industryYoY].sort(
      (a, b) => num(b.pct) - num(a.pct),
    );
    const industryGainers = sortedByPct.slice(0, 3).map((r) => ({
      sector: String(r.industry_title ?? r.industry_code),
      jobs_delta: num(r.jobs_delta),
      pct: num(r.pct),
    }));
    const industryLosers = sortedByPct
      .slice(-3)
      .reverse()
      .map((r) => ({
        sector: String(r.industry_title ?? r.industry_code),
        jobs_delta: num(r.jobs_delta),
        pct: num(r.pct),
      }));

    const responseData = {
      composite: {
        score: composite.score,
        label: composite.label,
        subScores: composite.subScores,
        missing: composite.missing,
      },
      businessSeries: (p.businessSeries as Row[]) ?? [],
      reSeries: (p.reSeries as Row[]) ?? [],
      serialBuyers: (p.serialBuyers as Row[]) ?? [],
      distressEntities: (p.distressEntities as Row[]) ?? [],
      topLawsuits: (p.topLawsuits as Row[]) ?? [],
      zipInvestment: (p.zipInvestment as Row[]) ?? [],
      industryGainers,
      industryLosers,
      unemployment: {
        rate: unemp?.rate != null ? num(unemp.rate) : null,
        period: unemp ? `${unemp.period_name} ${unemp.year}` : null,
      },
      windowSummary: {
        newBiz12mo: num(biz.curr_new),
        newBizPriorYear: num(biz.prior_new),
        bankruptcies12mo: num(biz.curr_bankruptcies),
        distress12mo: num(biz.curr_distress),
        distressPriorYear: num(biz.prior_distress),
        reVolume12mo: num(re.curr_volume),
        reDeals12mo: num(re.curr_deals),
        entityBuyers12mo: num(re.curr_entity_buyers),
        permitsCurr,
        permitsPrior,
      },
      meta: {
        pbjAsOf: (p.pbjAsOf as string | null) ?? null,
        qcewAsOf: (p.qcewAsOf as string | null) ?? null,
        scoreAsOf: new Date().toISOString().slice(0, 10),
      },
      dataStatus: composite.label === "Insufficient data" ? "partial" : "live",
    };

    await setCachedData(CACHE_KEY, responseData);
    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Economic Health detail API error:", err);
    return NextResponse.json({
      composite: null,
      businessSeries: [],
      reSeries: [],
      serialBuyers: [],
      distressEntities: [],
      topLawsuits: [],
      zipInvestment: [],
      industryGainers: [],
      industryLosers: [],
      unemployment: { rate: null, period: null },
      windowSummary: null,
      meta: { pbjAsOf: null, qcewAsOf: null, scoreAsOf: null },
      dataStatus: "error",
    });
  }
}
