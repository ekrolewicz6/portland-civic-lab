/**
 * Homelessness deep-dive data.
 *
 * Headline figures come from the founder's already-verified data spine
 * (bed-finder/src/data/spine — each read from a fetched primary source). The
 * qualitative framing (triage, the plan, the myths) is distilled from
 * housing-research/KEY-IDEAS.md. A focused citation pass (June 2026) sourced the
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

// ── The fastest-reduction plan (sequenced by speed) ───────────────

export const PLAN = [
  {
    n: 1,
    title: "Slam the inflow shut",
    body: "The cheapest 'reduction' is the person who never becomes homeless. Time-limited eviction prevention (one-time arrears, verified crisis, landlord paid directly) plus a ban on discharging people from jail, hospital, and foster care straight onto the street. Close the inflow/outflow gap and homelessness stops growing before you house anyone new.",
  },
  {
    n: 2,
    title: "Pull in the federal money already authorized",
    body: "Oregon's Medicaid waiver now covers tenancy supports, case management, and addiction treatment, plus up to six months of rent for eligible members (4,490 got help in the first eight months). It's found money that relieves local budgets — though the related 90-day-pre-release-from-jail benefit is authorized but currently paused.",
  },
  {
    n: 3,
    title: "Build — and staff — beds, addiction first",
    body: "Oregon is short roughly 3,700 residential treatment beds. But workforce is the real rate-limiter: a bed you can't staff is a press release, and the state doesn't even publicly report how many beds are actually staffed and occupied. Acquire-and-renovate beats the two-year construction clock; the cheapest bed is often the empty one you already own.",
  },
  {
    n: 4,
    title: "Fix the coordination failure",
    body: "The regional tax has raised about $1.3 billion since 2021, with a balance that peaked near $431 million sitting unspent while services were cut — a governance failure, not a funding one. The money is split across Metro, three counties, and the city; pool it against one by-name list so effort flows to the binding constraint, not the visible one.",
  },
  {
    n: 5,
    title: "Housing First — with triage and active management",
    body: "Scattered-site by default, with conduct standards (not sobriety requirements), acuity-matched placement, and the ability to relocate disruptive tenants. Master-lease existing units with a landlord-guarantee fund to get homes now, not in construction-years.",
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
    truth: "You can't punish a status, can't force treatment without due process, and can't mandate people into beds that don't exist. The legal, effective version is deflection ('treatment instead of charges'), drug courts, pre-release Medicaid, and narrow civil commitment — all billed to Medicaid. Jail produces sobriety without recovery and spikes overdose deaths on release.",
  },
  {
    myth: "“We spend over a billion dollars and nothing changes.”",
    truth: "Spending is real — but a balance that peaked near $431 million sat unspent across fragmented budgets while the system couldn't see itself, so effort flowed to the visible lever (units built) instead of the binding one (closing the inflow, staffing beds). The highest-leverage fix is making the machine legible.",
  },
] as const;
