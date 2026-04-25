import { NextResponse } from "next/server";
import sql, { getCachedData, setCachedData } from "@/lib/db-query";
import {
  computeEmpiricalHealth,
  type EmpiricalIndicatorInput,
  type MetroObservation,
} from "@/lib/scoring/empirical-health";

export const dynamic = "force-dynamic";

const CACHE_KEY = "economic-health-detail";
const CACHE_TTL = 60 * 60 * 1000; // 1h

const PORTLAND_METRO_CODE = "38900";

const COMBINED_QUERY = `
  SELECT json_build_object(
    'metros', (
      SELECT COALESCE(json_agg(t ORDER BY t.display_order), '[]'::json) FROM (
        SELECT metro_code, short_name, metro_name, is_portland, population, display_order
        FROM metro_metadata ORDER BY display_order
      ) t
    ),
    'unemploymentLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT MAX(year) AS year,
               MAX(month) FILTER (WHERE year = (SELECT MAX(year) FROM metro_unemployment_monthly)) AS month
        FROM metro_unemployment_monthly
      ) t
    ),
    'unemploymentSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year * 100 + month) AS ym
          FROM metro_unemployment_monthly GROUP BY metro_code
        ),
        anchored AS (
          SELECT MIN(ym) AS common_ym FROM latest
        )
        SELECT u.metro_code, u.year, u.month, u.rate
        FROM metro_unemployment_monthly u
        JOIN anchored a ON u.year * 100 + u.month = a.common_ym
      ) t
    ),
    'unemploymentPortlandHistory', (
      SELECT COALESCE(json_agg(rate ORDER BY year, month), '[]'::json)
      FROM metro_unemployment_monthly
      WHERE metro_code = '${PORTLAND_METRO_CODE}'
    ),
    'employmentLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter FROM metro_employment_quarterly
        WHERE establishments IS NOT NULL
        ORDER BY year DESC, quarter DESC LIMIT 1
      ) t
    ),
    'employmentSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year * 10 + quarter) AS yq
          FROM metro_employment_quarterly WHERE establishments IS NOT NULL GROUP BY metro_code
        ),
        anchored AS (SELECT MIN(yq) AS common_yq FROM latest),
        priors AS (
          SELECT metro_code, MIN(year * 10 + quarter) AS yq
          FROM metro_employment_quarterly
          WHERE establishments IS NOT NULL
          GROUP BY metro_code
        )
        SELECT e.metro_code, e.year, e.quarter, e.establishments, e.employment, e.avg_weekly_wage,
               -- Compute YoY growth rate (current vs same quarter prior year, per metro).
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
      -- Portland's QoQ year-over-year %, used as the empirical distribution.
      SELECT COALESCE(json_agg(yoy ORDER BY year, quarter), '[]'::json) FROM (
        SELECT curr.year, curr.quarter,
               (curr.establishments - prior.establishments)::numeric / NULLIF(prior.establishments,0) * 100 AS yoy
        FROM metro_employment_quarterly curr
        JOIN metro_employment_quarterly prior
          ON prior.metro_code = curr.metro_code
         AND prior.year = curr.year - 1
         AND prior.quarter = curr.quarter
        WHERE curr.metro_code = '${PORTLAND_METRO_CODE}'
          AND curr.establishments IS NOT NULL
          AND prior.establishments IS NOT NULL
      ) t
    ),
    'wageLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT year, quarter FROM metro_employment_quarterly
        WHERE avg_weekly_wage IS NOT NULL
        ORDER BY year DESC, quarter DESC LIMIT 1
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
        SELECT e.metro_code, e.year, e.quarter, e.avg_weekly_wage,
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
        ORDER BY deal_count DESC, total_volume_usd DESC LIMIT 25
      ) t
    ),
    'distressEntities', (
      SELECT COALESCE(json_agg(t ORDER BY t.category_count DESC), '[]'::json) FROM (
        SELECT entity_name, categories, category_count
        FROM pbj_distress_entity ORDER BY category_count DESC LIMIT 30
      ) t
    ),
    'topLawsuits', (
      SELECT COALESCE(json_agg(t ORDER BY t.damages_usd DESC), '[]'::json) FROM (
        SELECT defendant_name, plaintiff_name, suit_type, damages_usd, filed_date
        FROM pbj_top_lawsuit ORDER BY damages_usd DESC LIMIT 25
      ) t
    ),
    'zipInvestment', (
      SELECT COALESCE(json_agg(t ORDER BY t.total_investment_usd DESC), '[]'::json) FROM (
        SELECT zip_code, permit_count, permit_value_usd, re_deal_count, re_volume_usd,
               new_business_count, total_investment_usd
        FROM pbj_zip_investment
        WHERE zip_code LIKE '97%'
        ORDER BY total_investment_usd DESC LIMIT 30
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
    'pbjAsOf', (SELECT to_char(MAX(month),'YYYY-MM-DD') FROM pbj_business_monthly),
    'permitsCurr', (
      SELECT COUNT(*)::int FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '12 months')
    ),
    'permitsPrior', (
      SELECT COUNT(*)::int FROM housing.permits
      WHERE issued_date >= (CURRENT_DATE - INTERVAL '24 months')
        AND issued_date <  (CURRENT_DATE - INTERVAL '12 months')
    ),
    'pbjBiz', (
      SELECT row_to_json(t) FROM (
        SELECT
          SUM(new_businesses) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_new,
          SUM(new_businesses) FILTER (
            WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
              AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
          ) AS prior_new,
          SUM(bankruptcies) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_bankruptcies,
          SUM(bankruptcies + lawsuits + tax_liens) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_distress,
          SUM(bankruptcies + lawsuits + tax_liens) FILTER (
            WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '24 months')
              AND month <  (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')
          ) AS prior_distress
        FROM pbj_business_monthly
      ) t
    ),
    'pbjRe', (
      SELECT row_to_json(t) FROM (
        SELECT
          SUM(total_volume_usd) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_volume,
          SUM(deal_count) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_deals,
          SUM(entity_buyers) FILTER (WHERE month >= (date_trunc('month', CURRENT_DATE) - INTERVAL '12 months')) AS curr_entity_buyers
        FROM pbj_real_estate_monthly
      ) t
    ),
    'unemploymentLatest', (
      SELECT row_to_json(t) FROM (
        SELECT u.year, u.month, u.rate
        FROM metro_unemployment_monthly u
        WHERE u.metro_code = '${PORTLAND_METRO_CODE}'
        ORDER BY u.year DESC, u.month DESC LIMIT 1
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
  snapshot: Array<Row>;
  valueKey: string;
  populationDivide?: boolean;
  label: string;
  description: string;
  source: string;
  inverted: boolean;
  portlandHistory: number[];
}): EmpiricalIndicatorInput | null {
  const metroById = new Map(args.metros.map((m) => [m.metro_code, m]));
  const obs: MetroObservation[] = [];
  for (const s of args.snapshot) {
    const meta = metroById.get(String(s.metro_code));
    if (!meta) continue;
    let v = num(s[args.valueKey]);
    if (args.populationDivide && meta.population) {
      v = (v / meta.population) * 100_000;
    }
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
  if (args.populationDivide) {
    const pop = portland.population ?? null;
    if (pop) history = history.map((v) => (v / pop) * 100_000);
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
      metro_name: string;
      is_portland: boolean;
      population: number | null;
      display_order: number;
    }>) ?? [];

    // ── Empirical inputs ────────────────────────────────────────────────
    const unemploymentInput = buildSnapshotInput({
      metros,
      snapshot: (p.unemploymentSnapshot as Row[]) ?? [],
      valueKey: "rate",
      label: "Unemployment rate",
      description: "BLS LAUS Portland MSA. Lower is better.",
      source: "BLS LAUS",
      inverted: true,
      portlandHistory: ((p.unemploymentPortlandHistory as unknown[]) ?? []).map((v) => Number(v)),
    });

    const employmentInput = buildSnapshotInput({
      metros,
      snapshot: (p.employmentSnapshot as Row[]) ?? [],
      valueKey: "yoy_pct",
      label: "Employment growth (YoY)",
      description: "QCEW total establishments year-over-year change. Higher is better.",
      source: "BLS QCEW",
      inverted: false,
      portlandHistory: ((p.employmentPortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const wageInput = buildSnapshotInput({
      metros,
      snapshot: (p.wageSnapshot as Row[]) ?? [],
      valueKey: "wage_yoy_pct",
      label: "Wage growth (YoY %)",
      description:
        "QCEW average weekly wage, year-over-year change. Higher is better.",
      source: "BLS QCEW",
      inverted: false,
      portlandHistory: ((p.wagePortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const composite = computeEmpiricalHealth({
      unemployment: unemploymentInput,
      employment: employmentInput,
      wageGrowth: wageInput,
    });

    // Industry gainers / losers (still from QCEW NAICS detail).
    const industryYoY = (p.industryYoY as Row[]) ?? [];
    const sortedByPct = [...industryYoY].sort((a, b) => num(b.pct) - num(a.pct));
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
      // Tier-2 (descriptive only, NOT in the score).
      businessSeries: (p.businessSeries as Row[]) ?? [],
      reSeries: (p.reSeries as Row[]) ?? [],
      serialBuyers: (p.serialBuyers as Row[]) ?? [],
      distressEntities: (p.distressEntities as Row[]) ?? [],
      topLawsuits: (p.topLawsuits as Row[]) ?? [],
      zipInvestment: (p.zipInvestment as Row[]) ?? [],
      industryGainers,
      industryLosers,
      windowSummary: (() => {
        const biz = (p.pbjBiz as Row) ?? {};
        const re = (p.pbjRe as Row) ?? {};
        return {
          newBiz12mo: num(biz.curr_new),
          newBizPriorYear: num(biz.prior_new),
          bankruptcies12mo: num(biz.curr_bankruptcies),
          distress12mo: num(biz.curr_distress),
          distressPriorYear: num(biz.prior_distress),
          reVolume12mo: num(re.curr_volume),
          reDeals12mo: num(re.curr_deals),
          entityBuyers12mo: num(re.curr_entity_buyers),
          permitsCurr: num(p.permitsCurr),
          permitsPrior: num(p.permitsPrior),
        };
      })(),
      unemployment: (() => {
        const u = p.unemploymentLatest as Row | null;
        return {
          rate: u?.rate != null ? num(u.rate) : null,
          period: u ? `${u.year} M${String(u.month).padStart(2, "0")}` : null,
        };
      })(),
      meta: {
        pbjAsOf: (p.pbjAsOf as string | null) ?? null,
        unemploymentAsOf: p.unemploymentLatestPeriod
          ? `${(p.unemploymentLatestPeriod as Row).year} M${String((p.unemploymentLatestPeriod as Row).month).padStart(2, "0")}`
          : null,
        employmentAsOf: p.employmentLatestPeriod
          ? `${(p.employmentLatestPeriod as Row).year} Q${(p.employmentLatestPeriod as Row).quarter}`
          : null,
        wageAsOf: p.wageLatestPeriod
          ? `${(p.wageLatestPeriod as Row).year} Q${(p.wageLatestPeriod as Row).quarter}`
          : null,
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
      windowSummary: null,
      meta: { pbjAsOf: null, unemploymentAsOf: null, employmentAsOf: null, wageAsOf: null, scoreAsOf: null },
      dataStatus: "error",
    });
  }
}
