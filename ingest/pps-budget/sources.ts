/**
 * Portland Public Schools budget research corpus — the master source registry.
 *
 * Two layers:
 *  - sources.generated.json — harvested from the PPS index pages by
 *    harvest-index.ts on 2026-08-29 (budget books, ACFRs, bond audits, CBRC,
 *    OIPA, CBAs). Regenerate with harvest-index.ts, re-curate, review the diff.
 *  - EXTRA below — hand-curated: TSCC, ODE, statutes, LRO, news, advocacy.
 *
 * Every URL here gets a Wayback snapshot (archive.ts) BEFORE fetching —
 * pps.net documents sit behind Finalsite UUIDs that have already rotted once.
 * PDFs land in runtime-data/pps-budget/ (gitignored); checksums.lock.json is
 * committed and is the only thing in git that pins what we extracted from.
 *
 * kind:"page" entries are archive-only (never fetched/hashed): index pages,
 * statutes, news. fetchTier: 1 = the spine (fetch first), 2 = verification and
 * context, 3 = nice-to-have, 9 = pre-horizon (archive only, do not fetch).
 */

import generated from "./sources.generated.json";

export interface PpsDoc {
  id: string;
  series:
    | "budget-book"
    | "acfr"
    | "tscc"
    | "lb1"
    | "cbrc"
    | "bond-audit"
    | "cba"
    | "oipa"
    | "ode"
    | "sos-audit"
    | "enrollment"
    | "emma"
    | "statute"
    | "news"
    | "advocacy"
    | "other";
  fy?: string;
  title: string;
  org: string;
  url: string;
  mirrorUrl?: string;
  kind: "pdf" | "xlsx" | "page";
  acquisition: "scripted" | "manual-browser" | "boardbook" | "records-request";
  fetchTier?: number;
  notes?: string;
}

const RM = "https://www.pps.net/fs/resource-manager/view";
const TSCC = "https://www.tsccmultco.com/wp-content/uploads";

const EXTRA: PpsDoc[] = [
  // Missed by the generator's curation pass (present on the ACFR index page):
  { id: "acfr-fy2023", series: "acfr", fy: "2023", title: "PPS ACFR 2023", org: "Portland Public Schools", url: `${RM}/9b1d1b65-3a9f-42e7-85cb-d6b021f33930`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },

  // ── FY2026-27 and FY2025-26 process artifacts (from budget process pages) ──
  { id: "budget-fy2026-27-supt-message", series: "budget-book", fy: "2026-27", title: "Superintendent's FY2026-27 Proposed Budget Message", org: "Portland Public Schools", url: `${RM}/51380314-e6ee-4177-a0e8-b8d5e17964ee`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "lb1-fy2026-27", series: "lb1", fy: "2026-27", title: "FY2026-27 Notice of Budget Hearing & Budget Summary (LB-1)", org: "Portland Public Schools", url: `${RM}/c3920faf-5257-4af4-81f4-78a245a335c1`, kind: "pdf", acquisition: "scripted", fetchTier: 1, notes: "Cleanest one-page adopted fund totals + tax rates" },
  { id: "budget-fy2026-27-committee-notice", series: "budget-book", fy: "2026-27", title: "FY2026-27 Notice of Budget Committee Meeting", org: "Portland Public Schools", url: `${RM}/5c455955-32c8-4184-89d7-850210e7cbef`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "budget-fy2026-27-calendar-amended", series: "budget-book", fy: "2026-27", title: "FY2026-27 AMENDED Budget Calendar", org: "Portland Public Schools", url: `${RM}/80abecd4-dec9-4383-8c9a-5dee678ae7ed`, kind: "pdf", acquisition: "scripted", fetchTier: 2, notes: "Mid-cycle amendment is itself a finding" },
  { id: "budget-fy2025-26-proposed-vol1", series: "budget-book", fy: "2025-26", title: "PPS FY2025-26 Proposed Budget Vol 1", org: "Portland Public Schools", url: `${RM}/59d80019-d7da-4cc2-9bbc-0601814d85a6`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "budget-fy2025-26-proposed-vol2", series: "budget-book", fy: "2025-26", title: "PPS FY2025-26 Proposed Budget Vol 2", org: "Portland Public Schools", url: `${RM}/eab55b04-4d27-4b05-85b6-9d8c06ba32a7`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "lb1-fy2025-26", series: "lb1", fy: "2025-26", title: "FY2025-26 Notice of Budget Hearing & Budget Summary (LB-1)", org: "Portland Public Schools", url: `${RM}/4b439b90-e823-489e-b28c-be4142cd5597`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "budget-fy2025-26-calendar", series: "budget-book", fy: "2025-26", title: "FY2025-26 Budget Calendar", org: "Portland Public Schools", url: `${RM}/4e3efb67-45d6-4095-9692-b302e03a1458`, kind: "pdf", acquisition: "scripted", fetchTier: 3 },

  // ── TSCC ──────────────────────────────────────────────────────────────────
  { id: "tscc-review-fy2026", series: "tscc", fy: "2025-26", title: "TSCC Budget Review 2025-26: Portland Public Schools", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/Portland-Public-School-District-FY-26-Budget-Review.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "tscc-review-fy2025", series: "tscc", fy: "2024-25", title: "TSCC Budget Review 2024-25: Portland Public Schools", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/PPS-A-FY25-Budget-Review.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "tscc-review-fy2024", series: "tscc", fy: "2023-24", title: "TSCC Budget Review 2023-24: Portland Public Schools", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/FY24-Portland-Public-Schools-Budget-Review.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "tscc-measure-26-259-review", series: "tscc", title: "TSCC Tax Measure Review: PPS Measure 26-259 (May 2025 bond)", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/PPS-Bond-Levy-Review-May-2025.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "tscc-measure-26-215-review", series: "tscc", title: "TSCC Tax Measure Review: PPS Measure 26-215 (Nov 2020)", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/26-215-PPS-Nov-2020-Property-Tax-Measure-Review.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "tscc-annual-report-2024-25-general", series: "tscc", fy: "2024-25", title: "TSCC Annual Report 2024-25: General Information Section", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/2024-25-General-Information-Section-Annual-Report.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "tscc-annual-report-2024-25-summaries", series: "tscc", fy: "2024-25", title: "TSCC Annual Report 2024-25: Budget Summaries Section", org: "Tax Supervising & Conservation Commission", url: `${TSCC}/2024-25-Budget-Summaries-Section-Annual-Report.pdf`, kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "tscc-district-reviews-index", series: "tscc", title: "TSCC district reviews hub", org: "Tax Supervising & Conservation Commission", url: "https://www.tsccmultco.com/district-reviews/", kind: "page", acquisition: "manual-browser", notes: "Enumerate /wp-content/uploads/ for earlier PPS reviews + hearing minutes; FY27 PPS review not yet located (G7)" },

  // ── ODE / state finance ───────────────────────────────────────────────────
  { id: "ode-sia-allocation-25-27", series: "ode", title: "ODE 2025-27 SIA Allocations (PPS $43.68M/$45.46M)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/StudentSuccess/Documents/25-27%20SIA%20Allocation.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "ode-hss-allocation-25-27", series: "ode", title: "ODE 2025-27 High School Success (M98) Allocations (PPS $12.62M/$13.14M)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/StudentSuccess/Documents/25-27%20HSS%20Allocation.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "ode-ssf-payments-page", series: "ode", title: "ODE School District and ESD Payment Statements (SSF estimates + ADMw breakouts)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/grants/pages/school-district-and-esd-payment-statements.aspx", kind: "page", acquisition: "manual-browser", notes: "XLSX per year, multiple revisions; harvest per-year links in extraction phase; cite revision dates" },
  { id: "ode-fiscal-transparency-page", series: "ode", title: "ODE Fiscal Transparency portal (NOE per ADMr, school-level spending, budget-to-actuals)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/FiscalTransparency/Pages/FiscalTransparencyHome.aspx", kind: "page", acquisition: "manual-browser", notes: "Coverage 2017-18 through 2023-24" },
  { id: "ode-pbam-page", series: "ode", title: "ODE Program Budgeting & Accounting Manual (chart of accounts)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/FiscalTransparency/Pages/Program-Budgeting-and-Accounting-Manual.aspx", kind: "page", acquisition: "manual-browser", notes: "Required for lib/coa.ts" },
  { id: "lro-5-24-equalization", series: "ode", title: "LRO Research Report #5-24: K-12 School Funding Equalization (Aug 2024)", org: "Oregon Legislative Revenue Office", url: "https://www.oregonlegislature.gov/lro/Documents/K-12%20and%20ESD%20Finance%20RR%20August%2024%20Final.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 1 },
  { id: "dor-local-budgeting-manual", series: "ode", title: "Oregon DOR Local Budgeting Manual 150-504-420", org: "Oregon Department of Revenue", url: "https://www.oregon.gov/dor/programs/property/Documents/Local%20Budgeting%20Manual,%20150-504-420.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "osba-budget-committee-handbook", series: "ode", title: "OSBA Budget Committee Handbook for School Districts and ESDs (2024)", org: "Oregon School Boards Association", url: "https://osba.enviseams.com/docs/default-source/default-document-library/2024_budgetcommitteehandbook_fillable.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 3 },
  { id: "sos-audit-2019-01", series: "sos-audit", title: "Oregon SoS Audit 2019-01: ODE and PPS spending transparency (Jan 2019)", org: "Oregon Secretary of State", url: `${RM}/f1b59ce8-400f-4784-aabb-812676ac0ab3`, mirrorUrl: "https://sos.oregon.gov/audits/Documents/2019-01.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 1, notes: "SoS original URL died between Apr and Aug 2026; PPS-hosted mirror is primary now (verified: 98pp, 26 recommendations)" },
  { id: "csf-2025-distributions", series: "ode", title: "Common School Fund 2025 district distributions (PPS $6.6M)", org: "Oregon Dept of State Lands", url: "https://www.oregon.gov/dsl/Documents/2025_CommonSchoolFund_DistrictDistributions.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 3 },
  { id: "jpea-adequacy-report-2025", series: "ode", title: "Joint Committee on Public Education Appropriations adequacy report (Nov 2025)", org: "Oregon Legislature", url: "https://www.oregonlegislature.gov/citizen_engagement/Reports/2025JPEAReportontheAdequacyofPublicEducationAppropriations-FINAL.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "pers-2025-27-rate-adoption", series: "ode", title: "PERS Board: Adoption of 2025-2027 Employer Contribution Rates", org: "Oregon PERS", url: "https://www.oregon.gov/pers/Documents/Financials/Actuarial/2024/Adoption%20of%202025-2027%20Employer%20Contribution%20Rates.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },

  // ── Enrollment ────────────────────────────────────────────────────────────
  { id: "psu-forecast-2024", series: "enrollment", title: "PSU PRC enrollment forecast: PPS 2024-25 to 2033-34", org: "PSU Population Research Center", url: "https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=1152&context=enrollmentforecasts", mirrorUrl: "https://pdxscholar.library.pdx.edu/enrollmentforecasts/151/", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "psu-forecast-2022", series: "enrollment", title: "PSU PRC enrollment forecast: PPS 2022-23 to 2036-37", org: "PSU Population Research Center", url: "https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=1149&context=enrollmentforecasts", mirrorUrl: "https://pdxscholar.library.pdx.edu/enrollmentforecasts/150/", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "psu-forecast-2012", series: "enrollment", title: "PSU PRC enrollment forecast: PPS 2012-13 to 2025-26", org: "PSU Population Research Center", url: "https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=1073&context=enrollmentforecasts", mirrorUrl: "https://pdxscholar.library.pdx.edu/enrollmentforecasts/78/", kind: "pdf", acquisition: "scripted", fetchTier: 2 },

  // ── ODE SSF estimates + ADMw breakouts (latest revision per posted year) ──
  { id: "ode-ssf-estimates-fy2026-27", series: "ode", fy: "2026-27", title: "ODE 2026-27 SSF District Estimates (rev. 6-15-26)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/grants/Documents/2026-27%20State%20School%20Fund/26-27%20SSF%20Estimates%206-15-26%20-%20READY.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "ode-admw-breakout-fy2026-27", series: "ode", fy: "2026-27", title: "ODE 2026-27 ADMw Breakout (rev. 6-15-26)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/grants/Documents/2026-27%20State%20School%20Fund/26-27%20ADMw%20breakout%206-15-26%20READY.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "ode-ssf-estimates-fy2025-26", series: "ode", fy: "2025-26", title: "ODE 2025-26 SSF District Estimates (rev. 5-1-26)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/grants/Documents/2025-26%20State%20School%20Fund/25-26%20Estimates%205-1-26.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2 },
  { id: "ode-admw-breakout-fy2025-26", series: "ode", fy: "2025-26", title: "ODE 2025-26 ADMw Breakout (rev. 5-1-26)", org: "Oregon Department of Education", url: "https://www.oregon.gov/ode/schools-and-districts/grants/Documents/2025-26%20State%20School%20Fund/25-26%20ADMw%20Breakout%205-1-26.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 2, notes: "Earlier-year SSF/ADMw not on the payments page; actual SSF received per year comes from ACFRs/TSCC instead" },
  { id: "ppsdata-info", series: "advocacy", title: "ppsdata.info school-closure dashboard (unofficial; lead generator only, never citable)", org: "Independent", url: "https://ppsdata.info/", kind: "page", acquisition: "manual-browser" },

  // ── Measures, levy, arts tax ──────────────────────────────────────────────
  { id: "multco-measure-26-259", series: "other", title: "Multnomah County: Ballot Measure 26-259 (2025 $1.83B bond)", org: "Multnomah County", url: "https://multco.us/info/ballot-measure-26-259-portland-school-district-1j", kind: "page", acquisition: "manual-browser" },
  { id: "multco-measure-26-246", series: "other", title: "Multnomah County: Ballot Measure 26-246 (2024 levy renewal)", org: "Multnomah County", url: "https://multco.us/info/ballot-measure-26-246-portland-public-school-district", kind: "page", acquisition: "manual-browser" },
  { id: "multco-measure-26-207", series: "other", title: "Multnomah County: Measure 26-207 (2019 levy renewal, 77% yes)", org: "Multnomah County", url: "https://multco.us/info/measure-26-207-november-2019-special-election", kind: "page", acquisition: "manual-browser" },
  { id: "lwv-bond-analysis-2025", series: "advocacy", title: "League of Women Voters analysis: Measure 26-259", org: "LWV Portland", url: "https://lwvpdx.org/wp-content/uploads/2025/04/2025-Special-Election_-MultCo-Ballot-Measure-26-259-Portland-Public-Schools-bond-250411-version-.pdf", kind: "pdf", acquisition: "scripted", fetchTier: 3 },
  { id: "arts-tax-disbursements", series: "other", title: "Portland Arts Tax: collections, disbursements, and costs", org: "City of Portland Revenue Division", url: "https://www.portland.gov/revenue/arts-tax-disbursements", kind: "page", acquisition: "manual-browser" },
  { id: "arts-tax-audit-2026", series: "other", title: "City Auditor: Arts Tax performance audit (Mar 2026)", org: "Portland City Auditor", url: "https://www.portland.gov/auditor/audit-services/news/2026/3/18/arts-tax-city-needs-make-improvements-deliver-voter-approved", kind: "page", acquisition: "manual-browser" },

  // ── EMMA / debt (manual lane) ─────────────────────────────────────────────
  { id: "emma-issuer-search", series: "emma", title: "MSRB EMMA: Official Statements + continuing disclosure for Portland SD 1J / Multnomah County SD 1J", org: "MSRB", url: "https://emma.msrb.org", kind: "page", acquisition: "manual-browser", notes: "G1: search BOTH issuer names; pull OSs for 2012/2017/2020/2025 GOs + 2021 POB + latest annual disclosure" },
  { id: "boardbook-org-915", series: "other", title: "BoardBook Premier org 915: PPS board packets, resolutions, supplementals", org: "PPS Board of Education", url: "https://meetings.boardbook.org/public/Organization/915", kind: "page", acquisition: "boardbook", notes: "G6/G12: month-by-month harvest FY2023-24 to present" },

  // ── Statutes & rules (archive-only) ───────────────────────────────────────
  { id: "ors-294-414", series: "statute", title: "ORS 294.414 budget committee composition", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.414", kind: "page", acquisition: "manual-browser" },
  { id: "ors-294-423", series: "statute", title: "ORS 294.423 governing body as budget committee (the PPS exception)", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.423", kind: "page", acquisition: "manual-browser" },
  { id: "ors-294-456", series: "statute", title: "ORS 294.456 adoption, appropriations, amendment caps", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.456", kind: "page", acquisition: "manual-browser" },
  { id: "ors-294-471", series: "statute", title: "ORS 294.471 supplemental budgets", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.471", kind: "page", acquisition: "manual-browser" },
  { id: "ors-294-473", series: "statute", title: "ORS 294.473 supplemental budget hearings (>10% fund change)", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.473", kind: "page", acquisition: "manual-browser" },
  { id: "ors-294-635", series: "statute", title: "ORS 294.635 TSCC filing by May 15", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_294.635", kind: "page", acquisition: "manual-browser" },
  { id: "ors-327-011", series: "statute", title: "ORS 327.011 local revenues definition (the offset)", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_327.011", kind: "page", acquisition: "manual-browser" },
  { id: "ors-327-013", series: "statute", title: "ORS 327.013 SSF distribution formula (ADMw weights)", org: "oregon.public.law", url: "https://oregon.public.law/statutes/ors_327.013", kind: "page", acquisition: "manual-browser" },
  { id: "oar-581-022-2320", series: "statute", title: "OAR 581-022-2320 instructional time minimums", org: "oregon.public.law", url: "https://oregon.public.law/rules/oar_581-022-2320", kind: "page", acquisition: "manual-browser" },

  // ── Advocacy / contested (labeled, never for uncontested facts) ───────────
  { id: "pat-funding-memo", series: "advocacy", title: "PAT funding memo (revenue underreporting + 149 central positions claims)", org: "Portland Association of Teachers", url: "https://www.pdxteachers.org/fundingmemo", kind: "page", acquisition: "manual-browser" },
  { id: "cir-lawsuit-page", series: "advocacy", title: "CIR case page: equity staffing formula lawsuit (Oct 2025)", org: "Center for Individual Rights", url: "https://cir-usa.org/cases/stopping-race-based-funding-and-restoring-fairness-in-portland-public-schools/", kind: "page", acquisition: "manual-browser" },
  { id: "cascade-bond-critique", series: "advocacy", title: "Cascade Policy Institute: PPS Bond M26-259 critique", org: "Cascade Policy Institute", url: "https://cascadepolicy.org/education/pps-bond-m26-259/", kind: "page", acquisition: "manual-browser" },

  // ── Load-bearing news (archive-only; series news) ─────────────────────────
  { id: "news-ww-2025-10-29-50m", series: "news", title: "WW: PPS forecasts preliminary $50M shortfall (2025-10-29)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2025/10/29/pps-forecasts-preliminary-50-million-budget-shortfall-for-202627-fiscal-year/", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2026-02-24-midyear", series: "news", title: "OPB: mid-year cuts from just-discovered shortages (2026-02-24)", org: "OPB", url: "https://www.opb.org/article/2026/02/24/portland-public-schools-mid-year-cuts-shortages/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-02-27-furloughs", series: "news", title: "WW: furloughs-or-layoffs for $10M mid-year gap (2026-02-27)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/02/27/pps-offers-unions-furloughs-or-layoffs-to-patch-10-million-mid-year-budget-gap/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-04-28-deficit", series: "news", title: "WW: $56M deficit, 336 layoffs, admin +88% 2000-2019 (2026-04-28)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/04/28/portland-public-schools-faces-56-million-budget-deficit-as-superintendent-proposes-336-layoffs/", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2026-04-29-budget", series: "news", title: "OPB: proposed $2.77B budget, deep cuts (2026-04-29)", org: "OPB", url: "https://www.opb.org/article/2026/04/29/portland-public-schools-budget-gap-deep-cuts/", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2026-05-13-contracts", series: "news", title: "OPB: purchased services +61.9% to $437M (2026-05-13)", org: "OPB", url: "https://www.opb.org/article/2026/05/13/portland-public-schools-spending-third-party-contracts-balloons-proposed-budget/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-05-06-reckoning", series: "news", title: "WW: one-time dollars reckoning / ESSER (2026-05-06)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/05/06/pps-spent-years-looking-to-one-time-dollars-for-budget-relief-it-now-faces-a-reckoning/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-05-14-cbrc", series: "news", title: "WW: CBRC's mountain of suggestions (2026-05-14)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/05/14/community-budget-committee-presents-pps-with-a-mountain-of-suggestions/", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2026-06-25-adoption", series: "news", title: "OPB: board passes $2.77B budget, 322 FTE cut (2026-06-25)", org: "OPB", url: "https://www.opb.org/article/2026/06/25/portland-public-schools-budget-painful-layoffs/", kind: "page", acquisition: "manual-browser" },
  { id: "news-katu-bond-overbudget", series: "news", title: "KATU: 2017 bond $190M over budget (BAC)", org: "KATU", url: "https://katu.com/news/local/report-shows-portland-public-schools-is-200-million-overbudget-for-work-within-2017-bond", kind: "page", acquisition: "manual-browser" },
  { id: "news-benson-litigation", series: "news", title: "PPS v. Andersen: Benson cost litigation (~$410M vs $269M)", org: "Construction Owners", url: "https://www.constructionowners.com/news/pps-andersen-clash-over-benson-high-costs", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-08-24-forecasts", series: "news", title: "WW: latest PSU forecasts, upper-grades trouble (2026-08-24)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/08/24/latest-pps-enrollment-forecasts-indicate-trouble-is-coming-for-its-upper-grades/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2026-08-26-20-schools", series: "news", title: "WW: up to 20 schools could close (2026-08-26)", org: "Willamette Week", url: "https://www.wweek.com/news/schools/2026/08/26/pps-superintendent-says-district-could-close-up-to-20-schools/", kind: "page", acquisition: "manual-browser" },
  { id: "news-kgw-verify-state-money", series: "news", title: "KGW Verify: 'PPS hides state money' claim needs context", org: "KGW", url: "https://www.kgw.com/article/news/verify/claims-portland-public-schools-budget-omits-state-funding-need-context/283-c80818ce-dc2a-490c-9682-6d73b3cffd58", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2023-11-29-strike-faq", series: "news", title: "OPB: what teachers got from the strike (2023-11-29)", org: "OPB", url: "https://www.opb.org/article/2023/11/29/portland-teachers-get-from-strike-faq/", kind: "page", acquisition: "manual-browser" },
  { id: "news-ww-2023-12-06-afford", series: "news", title: "WW: how can PPS afford the contract (2023-12-06)", org: "Willamette Week", url: "https://www.wweek.com/news/2023/12/06/how-can-portland-public-schools-afford-its-new-teacher-contract-with-these-taxes-and-layoffs/", kind: "page", acquisition: "manual-browser" },
  { id: "news-opb-2026-08-12-qem", series: "news", title: "OPB: QEM 2026 report, +$2.5B to stand still (2026-08-12)", org: "OPB", url: "https://www.opb.org/article/2026/08/12/oregon-committee-recommends-increase-school-spending/", kind: "page", acquisition: "manual-browser" },
];

export const DOCS: PpsDoc[] = [...(generated as PpsDoc[]), ...EXTRA];

export const ROOT = "runtime-data/pps-budget";
export const PDF_DIR = `${ROOT}/pdf`;
export const TEXT_DIR = `${ROOT}/text`;
export const XLSX_DIR = `${ROOT}/xlsx`;
export const LOCK_PATH = "ingest/pps-budget/checksums.lock.json";
/** Wayback snapshots live in their own lock so archive.ts and fetch.ts can run concurrently. */
export const ARCHIVE_LOCK_PATH = "ingest/pps-budget/archives.lock.json";

export interface LockEntry {
  sha256: string;
  bytes: number;
  pages: number | null;
  url: string;
  waybackUrl?: string;
  waybackTs?: string;
  fetchedAt: string;
}
export interface Lock {
  lockedAt: string;
  files: Record<string, LockEntry>;
}
