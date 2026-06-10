/**
 * seed-promises.ts
 *
 * Seeds Mayor Wilson's 2026 State of the City claims into the
 * accountability.promises table for tracking and verification.
 *
 * Usage: npx tsx ingest/seed-promises.ts
 */

import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("ERROR: DATABASE_URL required. Run: set -a && source .env.local && set +a");
  process.exit(1);
}

const sql = postgres(DB_URL, { prepare: false, max: 1, onnotice: () => {} });

// ── Promise definitions ─────────────────────────────────────────────────

interface PromiseDef {
  promise_id: string;
  speaker: string;
  speech: string;
  speech_date: string;
  category: string;
  claim_text: string;
  is_direct_quote: boolean;
  claim_type: string;
  verification_status: string;
  verification_notes: string;
  verified_by: string | null;
  metric_target: number | null;
  metric_actual: number | null;
  metric_unit: string | null;
  metric_direction: string | null;
  baseline_value: number | null;
  baseline_date: string | null;
  target_date: string | null;
  data_source_table: string | null;
  data_source_query: string | null;
  data_source_name: string | null;
  data_needed: string | null;
  display_order: number;
}

const SPEAKER = "Mayor Keith Wilson";
const SPEECH = "2026 State of the City";
const SPEECH_DATE = "2026-04-15";

const PROMISES: PromiseDef[] = [
  // ── HOMELESSNESS ───────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-H1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "We have a safe bed for every person who will accept one.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "partially_verified",
    verification_notes:
      "Shelter capacity data shows total beds exceed unsheltered count on most nights. However, the qualifier 'who will accept one' makes full verification impossible without acceptance/refusal rate data.",
    verified_by: "manual:editor",
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: "homelessness.shelter_capacity",
    data_source_query: null,
    data_source_name: "JOHS Shelter Reports / HUD PIT Count",
    data_needed:
      "Shelter acceptance/refusal rate data — how many offers are declined nightly",
    display_order: 1,
  },
  {
    promise_id: "WILSON-SOTC-2026-H2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "We've provided more than 100,000 nights of safe sleep in our new emergency overnight shelters.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "unverifiable",
    verification_notes:
      "No public data source currently tracks cumulative shelter-nights in Portland's new emergency overnight shelters. Would require JOHS program outcome data.",
    verified_by: null,
    metric_target: 100000,
    metric_actual: null,
    metric_unit: "count",
    metric_direction: "increase",
    baseline_value: 0,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "JOHS emergency shelter nightly occupancy records or program outcome reports",
    display_order: 2,
  },
  {
    promise_id: "WILSON-SOTC-2026-H3",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "Tent encampments are down citywide by as much as 75% in the downtown core.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "partially_verified",
    verification_notes:
      "No public encampment count time-series exists. Anecdotal and media reports support a significant reduction. The '75%' figure and baseline are from the Mayor's office; independent verification requires IRP/JOHS campsite tracking data.",
    verified_by: null,
    metric_target: -75,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "IRP or JOHS campsite/encampment count data with historical baseline",
    display_order: 3,
  },
  {
    promise_id: "WILSON-SOTC-2026-H4",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "We have the fewest tents in our city in a decade.",
    is_direct_quote: true,
    claim_type: "comparison",
    verification_status: "partially_verified",
    verification_notes:
      "No public historical tent/encampment count exists for independent verification. The PIT Count measures individuals, not tents, and is conducted biennially. Media and neighborhood reports are consistent with significant reduction.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "Historical tent count time-series data (annual or quarterly) from JOHS or IRP",
    display_order: 4,
  },
  {
    promise_id: "WILSON-SOTC-2026-H5",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "Our homeless reunification program has helped reunite 376 people with their families and caretakers to 45 states.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "unverifiable",
    verification_notes:
      "The reunification program is administered by the Mayor's office. No public data source independently tracks reunification counts. The 376 figure comes directly from the Mayor's speech.",
    verified_by: null,
    metric_target: null,
    metric_actual: 376,
    metric_unit: "count",
    metric_direction: "increase",
    baseline_value: 0,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "JOHS HMIS reunification module data or Mayor's office program reports",
    display_order: 5,
  },
  {
    promise_id: "WILSON-SOTC-2026-H6",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "homelessness",
    claim_text:
      "Affordable housing vacancies recently peaked at 7.4%. By the end of 2026, we will bring that vacancy rate down to 5.4% or lower.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "in_progress",
    verification_notes:
      "Time-bound goal with December 2026 deadline. Baseline of 7.4% cited by Wilson. Requires Home Forward and PHB vacancy data to track progress. Wilson mentioned bi-weekly meetings with Home Forward; they went from 14% to 11% already.",
    verified_by: null,
    metric_target: 5.4,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: 7.4,
    baseline_date: "2025-12-01",
    target_date: "2026-12-31",
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Home Forward / PHB",
    data_needed:
      "Home Forward and PHB affordable housing vacancy rate (monthly or quarterly)",
    display_order: 6,
  },

  // ── SAFETY ─────────────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-S1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "March had the fewest number of shooting incidents in six years in Portland.",
    is_direct_quote: true,
    claim_type: "comparison",
    verification_status: "in_progress",
    verification_notes:
      "Safety data currently extends through January 2026 only. Once updated through March, this claim can be verified against PPB NIBRS offense data for assault offenses involving firearms.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: null,
    metric_actual: null,
    metric_unit: "count",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT EXTRACT(YEAR FROM occur_date)::int AS yr, COUNT(*) FROM safety.ppb_offenses WHERE offense_category = 'Assault Offenses' AND EXTRACT(MONTH FROM occur_date) = 3 GROUP BY 1 ORDER BY 1",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed:
      "PPB offense data needs to be synced through March 2026. Also need 'weapon' column or firearm-specific offense filter to isolate shootings from other assaults.",
    display_order: 7,
  },
  {
    promise_id: "WILSON-SOTC-2026-S2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "Drug arrests are up citywide; in downtown they're up 76% year-over-year, 171% in Old Town alone.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "partially_verified",
    verification_notes:
      "Our data tracks offense reports, not arrests. PPB NIBRS data shows Drug/Narcotic Offenses in the downtown area, but offense counts and arrest counts are different metrics. Arrest data requires PPB records not currently in our database.",
    verified_by: null,
    metric_target: 76,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "increase",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT COUNT(*) FILTER (WHERE occur_date >= '2026-01-01') AS current, COUNT(*) FILTER (WHERE occur_date >= '2025-01-01' AND occur_date < '2025-04-15') AS prior FROM safety.ppb_offenses WHERE offense_category = 'Drug/Narcotic Offenses' AND neighborhood IN ('Downtown', 'Old Town/Chinatown')",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed:
      "PPB arrest data (distinct from offense reports). NIBRS tracks offenses reported, not arrests made.",
    display_order: 8,
  },
  {
    promise_id: "WILSON-SOTC-2026-S3",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "Downtown since January, break-ins are down 17%.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "in_progress",
    verification_notes:
      "Can be verified against PPB NIBRS 'Burglary' offense category for downtown neighborhoods once data is synced through April 2026. Current data only extends through January 2026.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: -17,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT COUNT(*) FILTER (WHERE occur_date >= '2026-01-01') AS current, COUNT(*) FILTER (WHERE occur_date >= '2025-01-01' AND occur_date < '2025-04-15') AS prior FROM safety.ppb_offenses WHERE offense_category = 'Burglary' AND neighborhood IN ('Downtown', 'Old Town/Chinatown', 'Pearl')",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed: "PPB offense data sync through April 2026",
    display_order: 9,
  },
  {
    promise_id: "WILSON-SOTC-2026-S4",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "Shoplifting is down 30% [downtown since January].",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "in_progress",
    verification_notes:
      "Can be verified against PPB NIBRS 'Shoplifting' offense type for downtown neighborhoods once data is synced through April 2026.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: -30,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT COUNT(*) FILTER (WHERE occur_date >= '2026-01-01') AS current, COUNT(*) FILTER (WHERE occur_date >= '2025-01-01' AND occur_date < '2025-04-15') AS prior FROM safety.ppb_offenses WHERE offense_type = 'Shoplifting' AND neighborhood IN ('Downtown', 'Old Town/Chinatown', 'Pearl')",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed: "PPB offense data sync through April 2026",
    display_order: 10,
  },
  {
    promise_id: "WILSON-SOTC-2026-S5",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "Stolen cars are down 29% [downtown since January].",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "in_progress",
    verification_notes:
      "Can be verified against PPB NIBRS 'Motor Vehicle Theft' category for downtown neighborhoods once data is synced through April 2026.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: -29,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT COUNT(*) FILTER (WHERE occur_date >= '2026-01-01') AS current, COUNT(*) FILTER (WHERE occur_date >= '2025-01-01' AND occur_date < '2025-04-15') AS prior FROM safety.ppb_offenses WHERE offense_category = 'Motor Vehicle Theft' AND neighborhood IN ('Downtown', 'Old Town/Chinatown', 'Pearl')",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed: "PPB offense data sync through April 2026",
    display_order: 11,
  },
  {
    promise_id: "WILSON-SOTC-2026-S6",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "Burglary is down 51% [downtown since January].",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "in_progress",
    verification_notes:
      "Can be verified against PPB NIBRS 'Burglary' category. Note: Wilson cited both 'break-ins down 17%' and 'burglary down 51%' separately, suggesting different definitions. May refer to residential vs commercial burglary.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: -51,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT COUNT(*) FILTER (WHERE occur_date >= '2026-01-01') AS current, COUNT(*) FILTER (WHERE occur_date >= '2025-01-01' AND occur_date < '2025-04-15') AS prior FROM safety.ppb_offenses WHERE offense_category = 'Burglary' AND neighborhood IN ('Downtown', 'Old Town/Chinatown', 'Pearl')",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed: "PPB offense data sync through April 2026",
    display_order: 12,
  },
  {
    promise_id: "WILSON-SOTC-2026-S7",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "We've had one of the steepest declines in homicides in the nation.",
    is_direct_quote: true,
    claim_type: "comparison",
    verification_status: "partially_verified",
    verification_notes:
      "PPB NIBRS data shows a decline in Homicide Offenses. However, verifying 'one of the steepest in the nation' requires FBI UCR data from other cities for comparison, which is not in our database. Portland's 2025 homicide rate (~8 per 100,000) was still roughly double that of San Francisco and NYC.",
    verified_by: "auto:safety.ppb_offenses",
    metric_target: null,
    metric_actual: null,
    metric_unit: "rate",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: "safety.ppb_offenses",
    data_source_query:
      "SELECT EXTRACT(YEAR FROM occur_date)::int AS yr, COUNT(*) FROM safety.ppb_offenses WHERE offense_category = 'Homicide Offenses' GROUP BY 1 ORDER BY 1",
    data_source_name: "Portland Police Bureau NIBRS Offense Data",
    data_needed:
      "FBI UCR data from comparable cities to verify 'one of the steepest declines in the nation'",
    display_order: 13,
  },

  // ── ECONOMY ────────────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-E1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "Office vacancies are falling for the first time in years.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "unverifiable",
    verification_notes:
      "Downtown office vacancy tracking requires CoStar or similar commercial real estate data, which is behind a paywall. Portland's downtown vacancy rate was reported as the highest among major US cities in 2025.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: "percent",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "CoStar or CBRE downtown office vacancy rate data (quarterly)",
    display_order: 14,
  },
  {
    promise_id: "WILSON-SOTC-2026-E2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "If you want to start a grocery store, the city will contribute $100,000. Restaurants: $50,000. Other businesses and retailers: $25,000.",
    is_direct_quote: true,
    claim_type: "program",
    verification_status: "in_progress",
    verification_notes:
      "This is the Storefront Support Program, passed nearly unanimously by City Council (co-sponsored by Councilor Ryan). Program details are public but disbursement tracking requires Prosper Portland data.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: "dollars",
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Prosper Portland / City Council",
    data_needed:
      "Prosper Portland grant disbursement data: how many grants awarded, total dollars, by type",
    display_order: 15,
  },
  {
    promise_id: "WILSON-SOTC-2026-E3",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "Lowering the business license tax will deliver a much-needed tax break to over 10,000 small businesses in Portland.",
    is_direct_quote: true,
    claim_type: "program",
    verification_status: "unverifiable",
    verification_notes:
      "The business license tax ordinance was co-sponsored by Wilson and Councilor Zimmerman. The 10,000 figure comes from the Mayor's office. Independent verification requires Revenue Division data on eligible businesses.",
    verified_by: null,
    metric_target: 10000,
    metric_actual: null,
    metric_unit: "count",
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "City Revenue Division data on business license tax filers and projected impact of rate reduction",
    display_order: 16,
  },
  {
    promise_id: "WILSON-SOTC-2026-E4",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "We've waived system development charges, we've speeded permitting.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "in_progress",
    verification_notes:
      "Permit processing time data is available in our database (175K+ permits). Average processing days can be compared across time periods to verify whether permitting has sped up. SDC waiver tracking requires PP&D data.",
    verified_by: "auto:housing.permits",
    metric_target: null,
    metric_actual: null,
    metric_unit: "days",
    metric_direction: "decrease",
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: "housing.permits",
    data_source_query:
      "SELECT AVG(processing_days) FILTER (WHERE issued_date >= '2025-06-01') AS recent, AVG(processing_days) FILTER (WHERE issued_date >= '2023-01-01' AND issued_date < '2024-01-01') AS baseline FROM housing.permits WHERE processing_days IS NOT NULL AND processing_days >= 0 AND processing_days <= 365",
    data_source_name: "Portland Bureau of Development Services",
    data_needed:
      "SDC waiver records from PP&D to verify waiver claim",
    display_order: 17,
  },
  {
    promise_id: "WILSON-SOTC-2026-E5",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "Uniqlo is opening downtown. The Nike flagship store is back. The Portland Art Museum just completed a $140 million renovation. Alaska Airlines put $120 million into their engineering hangar. ZGF Timber is about to start operations producing 700 new homes a year.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "partially_verified",
    verification_notes:
      "These individual business announcements are publicly reported in local media. Uniqlo and Nike openings confirmed by Oregonian and Portland Business Journal. Art Museum renovation confirmed. Alaska Airlines hangar confirmed. ZGF Timber facility announced but not yet operational.",
    verified_by: "manual:editor",
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Oregonian / Portland Business Journal",
    data_needed: null,
    display_order: 18,
  },

  // ── BUDGET ─────────────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-B1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "budget",
    claim_text:
      "We have a $160 million deficit in our general fund.",
    is_direct_quote: true,
    claim_type: "metric",
    verification_status: "contradicted",
    verification_notes:
      "The City Budget Office March 2026 General Fund forecast shows a $67.8M deficit for FY 2026-27 (revenue $725.4M vs expenses $793.2M). The $160M figure may refer to a cumulative multi-year shortfall, a broader fund scope beyond the General Fund, or include projected gaps in other city funds. The single-year General Fund gap is $67.8M per CBO data.",
    verified_by: "manual:cbo-data",
    metric_target: 160000000,
    metric_actual: 67800000,
    metric_unit: "dollars",
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: "City Budget Office FY 2026-27 Forecast",
    data_needed:
      "Clarification from Mayor's office on whether $160M refers to multi-year, multi-fund, or a different accounting scope than CBO's $67.8M single-year General Fund figure",
    display_order: 19,
  },
  {
    promise_id: "WILSON-SOTC-2026-B2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "budget",
    claim_text:
      "I will keep every fire station open and preserve our seven-minute fire emergency response time.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "in_progress",
    verification_notes:
      "This is a commitment in the proposed budget (released the Monday after the speech). Verification requires comparing the adopted budget to current fire station operations. Response time data available from PF&R.",
    verified_by: null,
    metric_target: 7,
    metric_actual: null,
    metric_unit: "minutes",
    metric_direction: "maintain",
    baseline_value: 7,
    baseline_date: "2025-01-01",
    target_date: "2027-06-30",
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Portland Fire & Rescue",
    data_needed:
      "Adopted FY 2026-27 budget and PF&R response time data",
    display_order: 20,
  },
  {
    promise_id: "WILSON-SOTC-2026-B3",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "budget",
    claim_text:
      "I will fund every park and community center and not close a single jewel of our city.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "in_progress",
    verification_notes:
      "Budget commitment. Requires comparing adopted budget to current PP&R operations. Any park or community center closures would be publicly reported.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: "maintain",
    baseline_value: null,
    baseline_date: null,
    target_date: "2027-06-30",
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Portland Parks & Recreation",
    data_needed:
      "Adopted FY 2026-27 budget for PP&R and any facility closure announcements",
    display_order: 21,
  },
  {
    promise_id: "WILSON-SOTC-2026-B4",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "budget",
    claim_text:
      "I will keep every Portland police officer and investigator on the job.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "in_progress",
    verification_notes:
      "Budget commitment. Requires comparing adopted budget to current PPB authorized strength. Also promised 24 investigators to be added, with 5 already promoted.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: "maintain",
    baseline_value: null,
    baseline_date: null,
    target_date: "2027-06-30",
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Portland Police Bureau",
    data_needed:
      "PPB authorized vs filled positions, adopted budget FTE counts",
    display_order: 22,
  },

  // ── INFRASTRUCTURE ─────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-I1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "infrastructure",
    claim_text:
      "I want every pothole filled.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "unverifiable",
    verification_notes:
      "PBOT pothole repair data is tracked internally but not published in a format accessible to our dashboard. The PDX Reporter 311 system tracks reports but not completions.",
    verified_by: null,
    metric_target: null,
    metric_actual: null,
    metric_unit: null,
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "PBOT pothole repair completion records or PDX Reporter 311 resolution data",
    display_order: 23,
  },
  {
    promise_id: "WILSON-SOTC-2026-I2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "infrastructure",
    claim_text:
      "I want 20,000 miles of clean streets, sidewalks, and bike lanes.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "unverifiable",
    verification_notes:
      "PBOT street sweeping data is not publicly available in a structured format. The 20,000 miles figure likely represents total lane miles in the city network, not miles cleaned.",
    verified_by: null,
    metric_target: 20000,
    metric_actual: null,
    metric_unit: "miles",
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "PBOT street sweeping schedule and completion data",
    display_order: 24,
  },
  {
    promise_id: "WILSON-SOTC-2026-I3",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "infrastructure",
    claim_text:
      "Every neighborhood street should be cleaned four times a year and in Old Town every three nights.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "unverifiable",
    verification_notes:
      "This is a budget proposal, not a current achievement. Verification requires PBOT street sweeping records showing actual cleaning frequency by neighborhood.",
    verified_by: null,
    metric_target: 4,
    metric_actual: null,
    metric_unit: "times per year",
    metric_direction: "increase",
    baseline_value: null,
    baseline_date: null,
    target_date: "2027-06-30",
    data_source_table: null,
    data_source_query: null,
    data_source_name: null,
    data_needed:
      "PBOT street sweeping frequency data by neighborhood",
    display_order: 25,
  },

  // ── ADDITIONAL ─────────────────────────────────────────────────────────
  {
    promise_id: "WILSON-SOTC-2026-A1",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "safety",
    claim_text:
      "I want 24 investigators added to our Portland Police Bureau. We promoted the first five just a couple of months ago.",
    is_direct_quote: true,
    claim_type: "goal",
    verification_status: "in_progress",
    verification_notes:
      "Partially achieved per Wilson's own account (5 of 24 promoted). Full verification requires PPB staffing data showing investigator positions authorized vs filled.",
    verified_by: null,
    metric_target: 24,
    metric_actual: 5,
    metric_unit: "count",
    metric_direction: "increase",
    baseline_value: 0,
    baseline_date: "2025-01-01",
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: "Portland Police Bureau",
    data_needed:
      "PPB staffing reports showing investigator positions (authorized, filled, promoted)",
    display_order: 26,
  },
  {
    promise_id: "WILSON-SOTC-2026-A2",
    speaker: SPEAKER,
    speech: SPEECH,
    speech_date: SPEECH_DATE,
    category: "economy",
    claim_text:
      "The Moda Center renovation: the city is into the capital renovation for about $120 million, the state has stepped up with $365 million, Multnomah County has stepped up with just shy of $100 million.",
    is_direct_quote: true,
    claim_type: "investment",
    verification_status: "in_progress",
    verification_notes:
      "These funding commitments are from public statements by the Mayor, state legislature, and county commission. The city's $120M source is still under discussion (Clean Energy Fund is one proposed source). State and county amounts are from legislative/commission actions.",
    verified_by: null,
    metric_target: 585000000,
    metric_actual: null,
    metric_unit: "dollars",
    metric_direction: null,
    baseline_value: null,
    baseline_date: null,
    target_date: null,
    data_source_table: null,
    data_source_query: null,
    data_source_name: "City Council / State Legislature / County Commission",
    data_needed:
      "Official appropriation records from city, state, and county for Moda Center renovation",
    display_order: 27,
  },
];

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("Portland Promise Tracker — Seed Script");
  console.log("=======================================\n");

  // Ensure schema exists
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS accountability`);

  // Create promises table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS accountability.promises (
      id                  SERIAL PRIMARY KEY,
      promise_id          TEXT NOT NULL UNIQUE,
      speaker             TEXT NOT NULL,
      speech              TEXT NOT NULL,
      speech_date         DATE NOT NULL,
      category            TEXT NOT NULL,
      claim_text          TEXT NOT NULL,
      is_direct_quote     BOOLEAN NOT NULL DEFAULT true,
      claim_type          TEXT NOT NULL DEFAULT 'metric',
      verification_status TEXT NOT NULL DEFAULT 'in_progress',
      verification_notes  TEXT,
      verified_at         TIMESTAMPTZ,
      verified_by         TEXT,
      metric_target       NUMERIC,
      metric_actual       NUMERIC,
      metric_unit         TEXT,
      metric_direction    TEXT,
      baseline_value      NUMERIC,
      baseline_date       DATE,
      target_date         DATE,
      data_source_table   TEXT,
      data_source_query   TEXT,
      data_source_name    TEXT,
      data_needed         TEXT,
      display_order       INTEGER NOT NULL DEFAULT 0,
      created_at          TIMESTAMPTZ DEFAULT NOW(),
      updated_at          TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Create evidence table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS accountability.promise_evidence (
      id            SERIAL PRIMARY KEY,
      promise_id    TEXT NOT NULL,
      snapshot_date DATE NOT NULL,
      metric_value  NUMERIC,
      source        TEXT,
      notes         TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log("Tables created.\n");

  // Upsert all promises
  let inserted = 0;
  let updated = 0;

  for (const p of PROMISES) {
    const result = await sql`
      INSERT INTO accountability.promises (
        promise_id, speaker, speech, speech_date, category,
        claim_text, is_direct_quote, claim_type,
        verification_status, verification_notes, verified_by,
        metric_target, metric_actual, metric_unit, metric_direction,
        baseline_value, baseline_date, target_date,
        data_source_table, data_source_query, data_source_name, data_needed,
        display_order, updated_at
      ) VALUES (
        ${p.promise_id}, ${p.speaker}, ${p.speech}, ${p.speech_date}::date, ${p.category},
        ${p.claim_text}, ${p.is_direct_quote}, ${p.claim_type},
        ${p.verification_status}, ${p.verification_notes}, ${p.verified_by},
        ${p.metric_target}, ${p.metric_actual}, ${p.metric_unit}, ${p.metric_direction},
        ${p.baseline_value}, ${p.baseline_date}, ${p.target_date},
        ${p.data_source_table}, ${p.data_source_query}, ${p.data_source_name}, ${p.data_needed},
        ${p.display_order}, NOW()
      )
      ON CONFLICT (promise_id) DO UPDATE SET
        claim_text = EXCLUDED.claim_text,
        verification_status = EXCLUDED.verification_status,
        verification_notes = EXCLUDED.verification_notes,
        verified_by = EXCLUDED.verified_by,
        metric_target = EXCLUDED.metric_target,
        metric_actual = EXCLUDED.metric_actual,
        metric_unit = EXCLUDED.metric_unit,
        metric_direction = EXCLUDED.metric_direction,
        baseline_value = EXCLUDED.baseline_value,
        baseline_date = EXCLUDED.baseline_date,
        target_date = EXCLUDED.target_date,
        data_source_table = EXCLUDED.data_source_table,
        data_source_query = EXCLUDED.data_source_query,
        data_source_name = EXCLUDED.data_source_name,
        data_needed = EXCLUDED.data_needed,
        display_order = EXCLUDED.display_order,
        updated_at = NOW()
    `;
    if (result.count > 0) {
      inserted++;
    } else {
      updated++;
    }
  }

  console.log(`Upserted ${inserted + updated} promises (${inserted} new, ${updated} updated)`);

  // Summary
  const summary = await sql`
    SELECT
      verification_status,
      COUNT(*)::int AS cnt
    FROM accountability.promises
    GROUP BY 1
    ORDER BY cnt DESC
  `;
  console.log("\nBy status:");
  for (const r of summary) {
    console.log(`  ${String(r.verification_status).padEnd(25)} ${r.cnt}`);
  }

  const byCat = await sql`
    SELECT category, COUNT(*)::int AS cnt
    FROM accountability.promises
    GROUP BY 1 ORDER BY cnt DESC
  `;
  console.log("\nBy category:");
  for (const r of byCat) {
    console.log(`  ${String(r.category).padEnd(20)} ${r.cnt}`);
  }

  // Clear accountability cache
  await sql`DELETE FROM public.dashboard_cache WHERE question LIKE 'accountability%'`;
  console.log("\nCleared accountability cache.");

  await sql.end();
  console.log("\nDone.");
}

main().catch(async (err) => {
  console.error("FATAL:", err.message);
  await sql.end();
  process.exit(1);
});
