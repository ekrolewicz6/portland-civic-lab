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
    -- Labor Force Participation rate (ACS B23025) — already a percent.
    'lfpLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT MAX(year) AS year FROM metro_acs_annual WHERE lfp_rate IS NOT NULL
      ) t
    ),
    'lfpSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (
          SELECT metro_code, MAX(year) AS y FROM metro_acs_annual WHERE lfp_rate IS NOT NULL GROUP BY metro_code
        ),
        anchored AS (SELECT MIN(y) AS common_y FROM latest)
        SELECT a.metro_code, a.year, a.lfp_rate
        FROM metro_acs_annual a JOIN anchored ON a.year = anchored.common_y
        WHERE a.lfp_rate IS NOT NULL
      ) t
    ),
    'lfpPortlandHistory', (
      SELECT COALESCE(json_agg(lfp_rate ORDER BY year), '[]'::json)
      FROM metro_acs_annual
      WHERE metro_code = '${PORTLAND_METRO_CODE}' AND lfp_rate IS NOT NULL
    ),
    -- Business formation per 100k pop (BFS county roll-up / ACS pop 16+).
    'bfaLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT MAX(b.year) AS year FROM metro_business_applications_annual b
        JOIN metro_acs_annual a USING (metro_code, year)
        WHERE a.population_16_plus > 0
      ) t
    ),
    'bfaSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH common_year AS (
          SELECT MIN(latest.y) AS y FROM (
            SELECT b.metro_code, MAX(b.year) AS y
            FROM metro_business_applications_annual b
            JOIN metro_acs_annual a USING (metro_code, year)
            WHERE a.population_16_plus > 0
            GROUP BY b.metro_code
          ) latest
        )
        SELECT b.metro_code, b.year, b.applications_total,
               (b.applications_total::numeric / NULLIF(a.population_16_plus, 0)) * 100000 AS apps_per_100k
        FROM metro_business_applications_annual b
        JOIN metro_acs_annual a USING (metro_code, year)
        JOIN common_year cy ON b.year = cy.y
        WHERE a.population_16_plus > 0
      ) t
    ),
    'bfaPortlandHistory', (
      SELECT COALESCE(json_agg(rate ORDER BY year), '[]'::json) FROM (
        SELECT b.year,
               (b.applications_total::numeric / NULLIF(a.population_16_plus, 0)) * 100000 AS rate
        FROM metro_business_applications_annual b
        JOIN metro_acs_annual a USING (metro_code, year)
        WHERE b.metro_code = '${PORTLAND_METRO_CODE}' AND a.population_16_plus > 0
      ) t
    ),
    -- Affordability: home-price-to-income ratio (Zillow ZHVI / ACS median income).
    -- Use latest year that has both ZHVI Dec data and ACS income for that year.
    'affLatestPeriod', (
      SELECT row_to_json(t) FROM (
        SELECT MAX(z.year) AS year
        FROM metro_zhvi_monthly z
        JOIN metro_acs_annual a ON a.metro_code = z.metro_code AND a.year = z.year
        WHERE z.month = 12 AND a.median_household_income > 0
      ) t
    ),
    'affSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH common_year AS (
          SELECT MIN(latest.y) AS y FROM (
            SELECT z.metro_code, MAX(z.year) AS y
            FROM metro_zhvi_monthly z
            JOIN metro_acs_annual a ON a.metro_code = z.metro_code AND a.year = z.year
            WHERE z.month = 12 AND a.median_household_income > 0
            GROUP BY z.metro_code
          ) latest
        )
        SELECT z.metro_code, z.year, z.zhvi, a.median_household_income,
               z.zhvi / NULLIF(a.median_household_income, 0) AS price_to_income
        FROM metro_zhvi_monthly z
        JOIN metro_acs_annual a ON a.metro_code = z.metro_code AND a.year = z.year
        JOIN common_year cy ON z.year = cy.y
        WHERE z.month = 12 AND a.median_household_income > 0
      ) t
    ),
    'affPortlandHistory', (
      SELECT COALESCE(json_agg(ratio ORDER BY year), '[]'::json) FROM (
        SELECT z.year, z.zhvi / NULLIF(a.median_household_income, 0) AS ratio
        FROM metro_zhvi_monthly z
        JOIN metro_acs_annual a ON a.metro_code = z.metro_code AND a.year = z.year
        WHERE z.metro_code = '${PORTLAND_METRO_CODE}' AND z.month = 12 AND a.median_household_income > 0
      ) t
    ),
    -- BEA per-capita personal income (USD per person, level — not growth)
    'incomeSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH latest AS (SELECT metro_code, MAX(year) AS y FROM metro_personal_income_annual WHERE per_capita_income IS NOT NULL GROUP BY metro_code),
             anchored AS (SELECT MIN(y) AS common_y FROM latest)
        SELECT i.metro_code, i.year, i.per_capita_income FROM metro_personal_income_annual i JOIN anchored ON i.year = anchored.common_y
        WHERE i.per_capita_income IS NOT NULL
      ) t
    ),
    'incomePortlandHistory', (
      SELECT COALESCE(json_agg(per_capita_income ORDER BY year), '[]'::json)
      FROM metro_personal_income_annual
      WHERE metro_code = '${PORTLAND_METRO_CODE}' AND per_capita_income IS NOT NULL
    ),
    -- Population growth: YoY % change in BEA county-rolled-up population
    -- (more reliable than ACS pop16+ which is sample-based and noisy YoY).
    'popGrowthSnapshot', (
      SELECT COALESCE(json_agg(t), '[]'::json) FROM (
        WITH paired AS (
          SELECT curr.metro_code, curr.year, curr.population AS curr_pop, prior.population AS prior_pop
          FROM metro_personal_income_annual curr
          JOIN metro_personal_income_annual prior
            ON prior.metro_code = curr.metro_code AND prior.year = curr.year - 1
          WHERE curr.population IS NOT NULL AND prior.population IS NOT NULL
        ),
        latest AS (SELECT metro_code, MAX(year) AS y FROM paired GROUP BY metro_code),
        anchored AS (SELECT MIN(y) AS common_y FROM latest)
        SELECT p.metro_code, p.year,
               ((p.curr_pop - p.prior_pop)::numeric / NULLIF(p.prior_pop, 0)) * 100 AS yoy_pct
        FROM paired p JOIN anchored ON p.year = anchored.common_y
      ) t
    ),
    'popGrowthPortlandHistory', (
      SELECT COALESCE(json_agg(yoy ORDER BY year), '[]'::json) FROM (
        SELECT curr.year,
               ((curr.population - prior.population)::numeric / NULLIF(prior.population, 0)) * 100 AS yoy
        FROM metro_personal_income_annual curr
        JOIN metro_personal_income_annual prior
          ON prior.metro_code = curr.metro_code AND prior.year = curr.year - 1
        WHERE curr.metro_code = '${PORTLAND_METRO_CODE}' AND curr.population IS NOT NULL AND prior.population IS NOT NULL
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
          -- length 4 = the 11 NAICS supersectors (1011..1029).
          -- length 3 only has 2 broad rollups (101 Goods, 102 Services) which would
          -- produce the same row in both gainers and losers — exactly the bug we hit.
          AND length(curr.industry_code) = 4
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

/**
 * Authoritative entity classifier. The upstream Python pipeline's regex
 * (`\bCo\.\b`) has a known bug — it fails on names ending in "Co." because
 * `\.\b` requires a word boundary AFTER the period, which doesn't exist when
 * the period is followed by a space. We re-derive here so PGE / similar names
 * classify correctly without re-running the ingest.
 *
 * Patterns:
 *   - Standard suffixes: LLC, LLP, INC, CORP, CORPORATION, LTD, LP, PLLC,
 *     COMPANY, CO. (with trailing period or word boundary), PC.
 *   - Trust patterns: "<Name> Trust", "<Name> Property Trust"
 *   - Government / public agencies: "Metro" (Portland regional gov), "City of",
 *     "County of", "Port of", and explicit Metro housing entities.
 */
function classifyBuyer(name: string | null | undefined): "entity" | "person" {
  if (!name) return "person";
  const n = name.trim();
  if (!n) return "person";
  // Most entity suffixes — `\b` after the alternation handles word boundaries.
  // Note: "CO." at end-of-string is a special case because `\.\b` won't match
  // (no word char follows the period to anchor `\b`), so it gets its own regex.
  const suffixRe =
    /\b(LLC|L\.L\.C\.?|LLP|INC\.?|CORP\.?|CORPORATION|LTD\.?|LP|PLLC|PC\.?|COMPANY|TRUST|HOLDINGS?)\b/i;
  if (suffixRe.test(n)) return "entity";
  // "Co." or "Co" as the last token — Portland General Electric Co.,
  // Sunshine Dairy Co, etc. Lookahead matches space-or-end.
  if (/\bCo\.?(?=\s|$)/i.test(n)) return "entity";
  // Government / public agencies are entities, not persons.
  const govRe = /\b(METRO|CITY OF|COUNTY OF|PORT OF|HOMES? FORWARD|HOUSING AUTHORITY)\b/i;
  if (govRe.test(n)) return "entity";
  return "person";
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

    const lfpInput = buildSnapshotInput({
      metros,
      snapshot: (p.lfpSnapshot as Row[]) ?? [],
      valueKey: "lfp_rate",
      label: "Labor force participation",
      description:
        "Civilian labor force as a share of population 16+. Higher is better. Source: ACS B23025.",
      source: "Census ACS 1-year",
      inverted: false,
      portlandHistory: ((p.lfpPortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const bfaInput = buildSnapshotInput({
      metros,
      snapshot: (p.bfaSnapshot as Row[]) ?? [],
      valueKey: "apps_per_100k",
      label: "Business applications / 100k",
      description:
        "Annual new business applications per 100,000 people 16+. Higher is better. Census BFS county-roll-up.",
      source: "Census BFS + ACS",
      inverted: false,
      portlandHistory: ((p.bfaPortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const affInput = buildSnapshotInput({
      metros,
      snapshot: (p.affSnapshot as Row[]) ?? [],
      valueKey: "price_to_income",
      label: "Home-price-to-income ratio",
      description:
        "Median home value (Zillow ZHVI) / median household income. Lower is better — fewer years of income to buy a home.",
      source: "Zillow ZHVI + Census ACS",
      inverted: true,
      portlandHistory: ((p.affPortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const incomeInput = buildSnapshotInput({
      metros,
      snapshot: (p.incomeSnapshot as Row[]) ?? [],
      valueKey: "per_capita_income",
      label: "Income per capita",
      description: "BEA personal income per person (county roll-up). Higher is better.",
      source: "BEA CAINC1",
      inverted: false,
      portlandHistory: ((p.incomePortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const popGrowthInput = buildSnapshotInput({
      metros,
      snapshot: (p.popGrowthSnapshot as Row[]) ?? [],
      valueKey: "yoy_pct",
      label: "Population growth (YoY)",
      description: "Year-over-year metro population change. Higher = metro is gaining residents.",
      source: "BEA county roll-up",
      inverted: false,
      portlandHistory: ((p.popGrowthPortlandHistory as unknown[]) ?? [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v)),
    });

    const composite = computeEmpiricalHealth({
      unemployment: unemploymentInput,
      employment: employmentInput,
      wageGrowth: wageInput,
      laborForceParticipation: lfpInput,
      businessFormation: bfaInput,
      affordability: affInput,
      incomePerCapita: incomeInput,
      populationGrowth: popGrowthInput,
    });

    // Industry gainers / losers (still from QCEW NAICS detail).
    const industryYoY = (p.industryYoY as Row[]) ?? [];
    const sortedByPct = [...industryYoY].sort((a, b) => num(b.pct) - num(a.pct));
    // Guard against overlap when fewer than 6 sectors come back: split the
    // sorted list in half so the same sector never shows in both gainers and
    // losers. Only true gainers (pct >= 0) appear as gainers; only losers <0.
    const half = Math.floor(sortedByPct.length / 2);
    const gainersPool = sortedByPct.slice(0, Math.max(half, 3)).filter((r) => num(r.pct) >= 0);
    const losersPool = sortedByPct.slice(half).filter((r) => num(r.pct) < 0);
    const industryGainers = gainersPool.slice(0, 3).map((r) => ({
      sector: String(r.industry_title ?? r.industry_code),
      jobs_delta: num(r.jobs_delta),
      pct: num(r.pct),
    }));
    const industryLosers = losersPool
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
      serialBuyers: ((p.serialBuyers as Row[]) ?? []).map((b) => ({
        ...b,
        // Override the upstream-stored buyer_type with our authoritative classifier
        // (fixes "Portland General Electric Co." being labeled "person", etc.).
        buyer_type: classifyBuyer(b.buyer_name as string | null),
      })),
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
