/**
 * Homelessness deep-dive data.
 *
 * Headline figures come from an already-verified data spine (each read from a
 * fetched primary source). The qualitative framing (triage, the plan, the myths)
 * is distilled from a research synthesis. A focused citation pass (June 2026) sourced the
 * remaining national/gap claims and corrected several before publication — e.g.
 * the per-person street cost is an upper-typical figure, not a median; the SHS
 * "unspent" balance peaked near $431M (not $500M+); the pre-release Medicaid
 * benefit is authorized but paused. Approximate figures are labeled.
 */

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  kind: "primary" | "research" | "news" | "advocacy";
}

export const SOURCES: Record<string, Source> = {
  byName: { id: "byName", title: "Homeless Services Department Data Dashboard (by-name list)", org: "Multnomah County HSD", url: "https://hsd.multco.us/data-dashboard/", kind: "primary" },
  byNameRelease: { id: "byNameRelease", title: "For the first time, Multnomah County shares a monthly count of people experiencing homelessness", org: "Multnomah County", url: "https://multco.us/news/news-release-first-time-ever-multnomah-county-shares-monthly-count-people-homelessness-name", kind: "primary" },
  opbByName2026: { id: "opbByName2026", title: "Behind Portland's homelessness data, a familial, political fight emerges", org: "OPB", url: "https://www.opb.org/article/2026/04/01/behind-portlands-homelessness-data-familial-political-fight-emerges/", kind: "news" },
  pitHic: { id: "pitHic", title: "2025 Tri-County Point-in-Time Count Report", org: "PSU Homelessness Research & Action Collaborative", url: "https://hsd.multco.us/wp-content/uploads/2025/11/2025-Tri-County-PITC-Report-11.04.25.pdf", kind: "research" },
  pit2023: { id: "pit2023", title: "Chronic homelessness falls across tri-county region (2023 PIT)", org: "Multnomah County", url: "https://multco.us/news/news-release-chronic-homelessness-number-falls-across-tri-county-region-2023-point-time-count", kind: "primary" },
  shs: { id: "shs", title: "Supportive Housing Services — funding & financial reports", org: "Metro", url: "https://www.oregonmetro.gov/what-metro-does/housing-and-homelessness/supportive-housing-services/funding", kind: "primary" },
  shsRaised: { id: "shsRaised", title: "Metro-area homelessness persists despite $1.3 billion raised since 2021", org: "Willamette Week", url: "https://www.wweek.com/news/2025/11/06/metro-area-homelessness-persists-despite-13-billion-raised-since-2021-point-in-time-count-shows/", kind: "news" },
  shsUnspent: { id: "shsUnspent", title: "Counties, Metro surface major disagreement over homeless services tax", org: "Willamette Week", url: "https://www.wweek.com/news/2024/03/21/counties-metro-surface-major-disagreement-over-homeless-services-tax-as-second-meeting/", kind: "news" },
  shsHoused: { id: "shsHoused", title: "Counties report SHS measure has now housed 15,724 people", org: "Multnomah County", url: "https://multco.us/news/counties-report-supportive-housing-services-measure-has-now-housed-15724-people-across", kind: "primary" },
  evictions: { id: "evictions", title: "Evicted in Oregon — eviction filing data", org: "Portland State University (from OJD records)", url: "https://www.evictedinoregon.com/", kind: "research" },
  domicile: { id: "domicile", title: "Domicile Unknown — deaths of people experiencing homelessness", org: "Multnomah County Health Department / Street Roots", url: "https://multco.us/info/domicile-unknown", kind: "primary" },
  portlandSolutions: { id: "portlandSolutions", title: "Homelessness Assistance Guide", org: "City of Portland (Portland Solutions)", url: "https://www.portland.gov/portland-solutions/homelessness-assistance-guide", kind: "primary" },
  portlandSolutionsHome: { id: "portlandSolutionsHome", title: "Portland Solutions", org: "City of Portland", url: "https://portland.gov/portland-solutions", kind: "primary" },
  psr: { id: "psr", title: "Portland Street Response", org: "City of Portland", url: "https://portland.gov/streetresponse", kind: "primary" },
  chat: { id: "chat", title: "Community Health Assess & Treat (CHAT)", org: "Portland Fire & Rescue", url: "https://portland.gov/fire/community-health/chat", kind: "primary" },
  nwcc: { id: "nwcc", title: "Northwest Community Conservancy", org: "NWCC", url: "https://nwccpdx.org", kind: "primary" },
  impactRecovery: { id: "impactRecovery", title: "Recovery Navigation Program", org: "ImpactNW", url: "https://impactnw.org/programs/housing-and-safety-net/recovery-navigation-program", kind: "primary" },
  shelterDashboards: { id: "shelterDashboards", title: "Shelter Services Data Dashboards", org: "City of Portland", url: "https://portland.gov/shelter-services/shelter-services-data-dashboards", kind: "primary" },
  bybee: { id: "bybee", title: "Bybee Lakes Hope Center", org: "City of Portland", url: "https://portland.gov/united/bybee-lakes", kind: "primary" },
  deflectionProgram: { id: "deflectionProgram", title: "Deflection Program", org: "Multnomah County", url: "https://multco.us/info/deflection-program", kind: "primary" },
  deflectionAnnual: { id: "deflectionAnnual", title: "Deflection Program 2024-2025 Annual Report", org: "Multnomah County", url: "https://multco.us/file/deflection_program_2024-2025_annual_report/download", kind: "primary" },
  deflectionQ3: { id: "deflectionQ3", title: "Deflection Program FY26 Q3 Data Snapshot", org: "Multnomah County", url: "https://multco.us/file/deflection_program_fy26_q3_data_snapshot_(january_1,_2026_-_march_31,_2026)/download", kind: "primary" },

  // Cost of inaction
  naehCost: { id: "naehCost", title: "Ending Chronic Homelessness Saves Taxpayers Money ($35,578/yr)", org: "National Alliance to End Homelessness", url: "https://endhomelessness.org/resources/research-and-analysis/ending-chronic-homelessness-saves-taxpayers-money-2/", kind: "research" },
  economicRt: { id: "economicRt", title: "Where We Sleep: The Costs of Housing and Homelessness in Los Angeles", org: "Economic Roundtable", url: "https://economicrt.org/publication/where-we-sleep/", kind: "research" },
  utahNpr: { id: "utahNpr", title: "Utah Reduced Chronic Homelessness By 91 Percent; Here's How", org: "NPR", url: "https://www.npr.org/2015/12/10/459100751/utah-reduced-chronic-homelessness-by-91-percent-heres-how", kind: "news" },
  wayHome: { id: "wayHome", title: "Portland Way Home — plan & cost analysis", org: "Portland Way Home", url: "https://portlandwayhome.org", kind: "advocacy" },

  // Triage & Housing First
  naehTriageCost: { id: "naehTriageCost", title: "Cost to Provide Housing First to All Households in Shelters (RRH $8,486 / PSH $20,115)", org: "National Alliance to End Homelessness", url: "https://endhomelessness.org/wp-content/uploads/2025/03/3.11.25_Cost-to-Provide-Housing-First-to-All-Households-Staying-in-Shelters.pdf", kind: "research" },
  ahar2024: { id: "ahar2024", title: "2024 Annual Homelessness Assessment Report (AHAR) Part 1", org: "U.S. Department of Housing and Urban Development", url: "https://www.huduser.gov/portal/sites/default/files/pdf/2024-AHAR-Part-1.pdf", kind: "primary" },
  housingFirstNaeh: { id: "housingFirstNaeh", title: "The Truth About Housing First", org: "National Alliance to End Homelessness", url: "https://endhomelessness.org/blog/the-truth-about-housing-first/", kind: "research" },
  manhattanHF: { id: "manhattanHF", title: "Housing First and Homelessness: The Rhetoric and the Reality", org: "Manhattan Institute (Stephen Eide)", url: "https://manhattan.institute/article/housing-first-and-homelessness-the-rhetoric-and-the-reality", kind: "research" },

  // Treatment beds
  pcgBeds: { id: "pcgBeds", title: "Behavioral Health Residential Facility Study (gap of ~3,714 beds)", org: "OHA / Public Consulting Group", url: "https://www.oregon.gov/oha/HSD/AMH/DataReports/Behavioral-Health-Residential-Facility-Study-June-2024.pdf", kind: "research" },
  kotek465: { id: "kotek465", title: "Gov. Kotek & OHA announce 465 added treatment beds by end of 2026", org: "Oregon Governor's Office / OHA", url: "https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-oregon-health-authority-announce-465-added-treatment-beds-by-end-of-2026", kind: "primary" },
  obcc: { id: "obcc", title: "Millions in OHSU behavioral-health coordination center has aided few patients", org: "Willamette Week", url: "https://www.wweek.com/news/health/2026/01/28/millions-of-dollars-in-ohsu-behavioral-health-coordination-center-has-aided-few-actual-patients/", kind: "news" },

  // Medicaid 1115
  medicaidHousing: { id: "medicaidHousing", title: "OHP Health-Related Social Needs — housing benefits", org: "Oregon Health Authority", url: "https://www.oregon.gov/oha/hsd/ohp/pages/housing.aspx", kind: "primary" },
  medicaidOpb: { id: "medicaidOpb", title: "Oregon launches Medicaid program to help pay rent", org: "OPB", url: "https://www.opb.org/article/2024/10/28/oregon-health-authority-rental-assistance-program-medicaid-housing/", kind: "news" },

  // Intervention unit costs (for the cost model)
  shelterReview: { id: "shelterReview", title: "Adult Shelter Review FY25 (per-bed shelter costs)", org: "Multnomah County HSD", url: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf", kind: "primary" },
  masterLeaseNofa: { id: "masterLeaseNofa", title: "Master Leasing & Landlord Engagement NOFA (per-unit cost)", org: "Multnomah County JOHS", url: "https://multco.us/file/master_leasing_and_landlord_engagement_nofa_announcement/download", kind: "primary" },
  treatmentCost: { id: "treatmentCost", title: "Cost of residential substance-abuse treatment (per week)", org: "French, Popovici & Tapsell, J. Subst. Abuse Treat. (2008)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2614666/", kind: "research" },
};

// ── Headline figures (verified) ───────────────────────────────────

export const STATS = {
  byNameTotal: 18_000, // ~Jan 2026
  byNameUnsheltered: 8_800,
  byNameTotalJan2025: 14_361,
  monthlyInflow: 1_277,
  monthlyOutflow: 865,
  netMonthly: 412, // Jan 2025 specific
  regionalMonthlyInflow: 3_068, // FY25 tri-county, first-time seeking services
  regionalMonthlyOutflow: 1_001, // FY25 tri-county, exits to housing
  pitTotal: 10_526,
  pitSheltered: 3_614,
  pitUnsheltered: 6_912,
  pitChange2023to2025Pct: 0.67,
  chronicSharePct: 0.41, // Multnomah 2023 PIT: 2,610 of 6,297
  pshBeds: 6_973,
  rrhBeds: 2_663,
  esBeds: 3_350,
  // Costs (per adult household / year, 2022 dollars, NAEH)
  rrhCostPerYear: 8_486,
  pshCostPerYear: 20_115,
  // SHS tax
  shsRaisedSince2021: 1_300_000_000,
  shsUnspentPeak: 431_000_000, // FY2024 year-end projection
  shsCollectedFY25: 325_000_000,
  shsProjectedFY26: 351_000_000,
  regionalHousedSince2021: 15_724,
  evictionPreventionsFY25: 2_416,
  // Evictions
  evictionFilings2025: 12_094,
  evictionFilings2019: 5_957,
  // Treatment
  treatmentBedGap: 3_714,
  currentSudResidentialBeds: 1_629,
  kotekBedGoal: 465,
  // Medicaid
  medicaidHousingMembers: 4_490, // Nov 2024–June 2025
  // Deaths
  deaths2024: 372,
  deaths2023: 456,
  overdoseDeaths2024: 214,
  fentanylDeaths2024: 183,
  avgAgeAtDeath: 48,
  deflectionQ3LawEnforcementReferrals: 79,
  deflectionQ3Exited90DayWindow: 21,
  deflectionQ3Successful90DayCompletions: 9,
  deflectionQ3SuccessfulSUDOnly: 1,
  deflectionQ3SuccessfulSUDPlusCareCoordination: 7,
  deflectionQ3SuccessfulCareCoordinationOnly: 1,
} as const;

// ── Triage: the three populations ─────────────────────────────────
// Plain-language version of the transitional / episodic / chronic typology
// (Kuhn & Culhane, 1998). Costs are NAEH per-adult-household/year figures.

export interface TriageGroup {
  id: "economic" | "moderate" | "chronic";
  label: string;
  share: string;
  who: string;
  rightFix: string;
  cost: string;
  mismatch: string;
  color: string;
}

export const TRIAGE: TriageGroup[] = [
  {
    id: "economic",
    label: "Economic-only",
    share: "the largest group",
    who: "People pushed out by a rent hike, a lost job, a medical bill — no serious addiction or mental-illness barrier. Often homeless for the first time and not for long.",
    rightFix: "Rapid rehousing — a unit plus light, short-term help.",
    cost: "≈ $8,500 per household/year — the cheapest, fastest fix, for the majority.",
    mismatch: "Park them in expensive permanent supportive housing and you burn scarce, intensive resources on people who didn't need them.",
    color: "var(--color-fern)",
  },
  {
    id: "moderate",
    label: "Moderate / episodic",
    share: "the middle",
    who: "People who cycle in and out of homelessness, often with treatable mental-health or substance-use needs that flare under stress.",
    rightFix: "Stable housing plus moderate, ongoing support and treatment access.",
    cost: "Mid-range — housing plus case management.",
    mismatch: "Bare rapid rehousing without support and many cycle back; full PSH and you over-serve.",
    color: "var(--color-river)",
  },
  {
    id: "chronic",
    label: "Chronic / severe",
    share: "~4 in 10 of Multnomah's homeless",
    who: "Long-term homeless with serious, co-occurring disability — the most visible on the street, and by far the most costly to the public when left there.",
    rightFix: "Permanent Supportive Housing + treatment — housing with intensive, indefinite services.",
    cost: "≈ $20,000 per household/year — expensive, but cheaper than the street (see the calculator).",
    mismatch: "Bare rapid rehousing without services, and they cycle straight back to the street — the most expensive failure of all.",
    color: "var(--color-clay)",
  },
];

// ── The bed-visibility problem ────────────────────────────────────

export const BED_LAYERS = [
  { key: "licensed", label: "Licensed", desc: "the bed is legally allowed to exist", tracked: true },
  { key: "funded", label: "Funded", desc: "someone is paying for it", tracked: true },
  { key: "staffed", label: "Staffed", desc: "there are workers to run it", tracked: false },
  { key: "occupied", label: "Occupied", desc: "someone is in it right now", tracked: false },
  { key: "available", label: "Open tonight", desc: "a worker could place someone in it now", tracked: false },
] as const;

// -- Field triage: what a worker can actually do at first contact ----------

export const FIELD_TRIAGE = [
  {
    step: "Crime present",
    route: "Criminal justice route",
    reality: "Legal authority is clear, but the back end only helps if court, jail, deflection, or treatment creates an actual service path.",
  },
  {
    step: "Mental-health hold threshold",
    route: "Civil hold / hospital route",
    reality: "Only available when the person is a danger to self or others or cannot care for themselves. Many visible street crises fall below that threshold.",
  },
  {
    step: "No crime, no hold",
    route: "Voluntary shelter or treatment referral",
    reality: "This is the gap Bed Finder targets: if the person says yes now, the worker needs an eligible option, phone confirmation, hold, and transport before the window closes.",
  },
] as const;

export const OUTREACH_ACTORS = [
  { name: "Portland Street Response", source: "psr" },
  { name: "Portland Solutions", source: "portlandSolutionsHome" },
  { name: "Portland Fire CHAT", source: "chat" },
  { name: "Northwest Community Conservancy", source: "nwcc" },
  { name: "ImpactNW Recovery Navigation", source: "impactRecovery" },
] as const;

export const DEFLECTION_REALITY = [
  {
    label: "Law-enforcement referrals",
    value: STATS.deflectionQ3LawEnforcementReferrals,
    note: "FY26 Q3, Jan. 1-Mar. 31, 2026.",
  },
  {
    label: "Reached 90-day completion window",
    value: STATS.deflectionQ3Exited90DayWindow,
    note: "The denominator for Q3 90-day completions.",
  },
  {
    label: "Successful 90-day completions",
    value: STATS.deflectionQ3Successful90DayCompletions,
    note: "Under the January 2026 completion definition.",
  },
  {
    label: "SUD/recovery only",
    value: STATS.deflectionQ3SuccessfulSUDOnly,
    note: "One completion was in the SUD/recovery-only bucket.",
  },
  {
    label: "SUD/recovery + care coordination",
    value: STATS.deflectionQ3SuccessfulSUDPlusCareCoordination,
    note: "Seven combined SUD/recovery access with sustained PATH follow-up.",
  },
] as const;

export const SHELTER_CONTINUUM = [
  {
    model: "Overnight emergency shelter",
    job: "Immediate bed for the night",
    gap: "Daytime street exposure remains; live open-bed status is not universal.",
  },
  {
    model: "24-hour congregate shelter",
    job: "Stability, meals, daytime access, and service connection",
    gap: "Works best when structured activity and case management are real.",
  },
  {
    model: "Tiny village / alternative shelter",
    job: "Low-barrier private sleeping space",
    gap: "Can become a dead end without routine, treatment, work, or exit pathways.",
  },
  {
    model: "Detox / residential SUD / OTP",
    job: "Treat addiction as the binding constraint",
    gap: "Provider lists exist, but facility-level open bed counts are not public.",
  },
  {
    model: "Jail-discharge bridge",
    job: "Reentry, court, treatment, documents, work placement",
    gap: "Mostly a proposal locally; needs program and records-request validation.",
  },
  {
    model: "Hospital step-down shelter",
    job: "Safe discharge with medical knowledge on site",
    gap: "Could reduce street discharge and high-cost skilled nursing overuse; cost claims need verification.",
  },
  {
    model: "Housing First / supportive housing",
    job: "Stable housing with the right service intensity",
    gap: "Fails when used as the only answer or when isolated people return to encampment community.",
  },
] as const;

// ── The fastest-reduction plan (sequenced by speed) ───────────────

export const PLAN = [
  {
    n: 1,
    title: "Slam the inflow shut, precisely",
    body: "The cheapest 'reduction' is the person who never becomes homeless. Use time-limited eviction prevention for verified financial crises, paid directly to landlords, while preserving tools to remove dangerous or predatory tenants. Then stop institutions from releasing people from jail, hospital, or foster care straight to the street.",
  },
  {
    n: 2,
    title: "Make field triage immediate",
    body: "When someone says yes right now, a worker needs an eligible option in minutes: anonymous criteria, live or phone-confirmed availability, name check by phone, hold, transport, and outcome. That is the product gap Bed Finder is built to close.",
  },
  {
    n: 3,
    title: "Build the missing continuum",
    body: "Portland needs more than shelter vs. apartment: overnight beds, 24-hour shelters, detox, residential treatment, opioid treatment, jail-discharge shelters, hospital step-down shelters, structured recovery cohorts, and supportive housing. Each has a different job.",
  },
  {
    n: 4,
    title: "Measure treatment, not vibes",
    body: "Deflection, outreach, and shelter programs should report the real funnel: referral, engagement, service type, treatment admission, shelter arrival, housing exit, and retention. A contact is not a placement, and service access is not treatment completion.",
  },
  {
    n: 5,
    title: "Housing First — where it fits",
    body: "Scattered-site housing and permanent supportive housing remain essential. But housing is one tier in a continuum, not a substitute for treatment, reentry, hospital step-down care, or structured recovery community.",
  },
] as const;

// ── Myths that survive a hostile hearing ──────────────────────────

export const MYTHS = [
  {
    myth: "“Housing First means no rules — that's why it fails.”",
    truth: "Housing First removes the preconditions to *qualify* (you don't have to get sober first) — NOT the rules once you're housed. Tenants still sign standard leases and must meet ordinary obligations. The model sustains ~85–90% housing retention; the out-of-control-building failures are management and over-concentration problems, fixed by staffing and scattered-site placement.",
  },
  {
    myth: "“Housing the homeless pays for itself.”",
    truth: "Overclaimed locally. The biggest cost savings are *federal* Medicaid (ER and hospital care), not the city or county budget — Portland and the county are mostly on the hook for jail, EMS, sanitation, and the homelessness budget. The honest fix is pulling the federal payer in, not pretending it nets out for local taxpayers.",
  },
  {
    myth: "“Just force the addicts into treatment.”",
    truth: "You can't punish a status, can't force treatment without due process, and can't mandate people into beds that don't exist. The legal, effective version is a real treatment pathway: drug courts, deflection that actually reaches SUD care, pre-release planning, and narrow civil commitment where legally justified.",
  },
  {
    myth: "“We spend over a billion dollars and nothing changes.”",
    truth: "Spending is real — but a balance that peaked near $431 million sat unspent across fragmented budgets while the system couldn't see itself, so effort flowed to the visible lever (units built) instead of the binding one (closing the inflow, staffing beds). The highest-leverage fix is making the machine legible.",
  },
  {
    myth: "“Housing First is either the answer or the problem.”",
    truth: "Wrong frame. Housing First is a strong tool for people whose binding constraint is housing instability or chronic disability with services. It is not a detox bed, a jail-reentry plan, a hospital step-down unit, or a recovery community.",
  },
] as const;
