/**
 * Portland FPDR (Fire & Police Disability and Retirement) deep-dive data.
 *
 * Every figure here is sourced. Headline and budget figures were rechecked September 16, 2026 against
 * the FY2024-25 audit, FY2026-27 adopted budget and levy ordinance.
 * Beneficiary detail remains explicitly dated June 30, 2024. Where a figure is an estimate,
 * a reconstruction, or an illustrative interpolation, it is labeled as such.
 *
 * Plain-language note: this dataset is intentionally written so the explainer
 * page can stay readable for a general audience while remaining defensible.
 */

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  kind: "primary" | "actuarial" | "news" | "opinion" | "analysis";
}

export const SOURCES: Record<string, Source> = {
  councilSeptember2026: {
    id: "councilSeptember2026",
    title:
      "September 16, 2026 FPDR financing discussion (agenda and presentations)",
    org: "Finance and Governance Committee of the Whole",
    url: "https://www.portland.gov/council/documents/presentation/fpdr-financing-discussion",
    kind: "primary",
  },
  cityFinancing2026: {
    id: "cityFinancing2026",
    title:
      "FPDR Financing: Structural Overview and Funding Mechanics · September 16, 2026",
    org: "City of Portland",
    url: "https://www.portland.gov/sites/default/files/council-documents/2026/9.16.26-FPDR-Financing_COTW-Presentation.pdf",
    kind: "primary",
  },
  pewFunding2026: {
    id: "pewFunding2026",
    title:
      "Public Pension Funding Practices: Considerations for Portland · September 16, 2026",
    org: "David Draine / The Pew Charitable Trusts",
    url: "https://www.portland.gov/sites/default/files/council-documents/2026/Public-Pension-Funding-Practices.pdf",
    kind: "analysis",
  },
  legalFunding2026: {
    id: "legalFunding2026",
    title:
      "FPDR Funding: Charter and Legal Overview · September 16, 2026 packet",
    org: "City of Portland",
    url: "https://www.portland.gov/sites/default/files/council-documents/2026/Funding-Slides-PDF.pdf",
    kind: "primary",
  },
  millimanPresentation2025: {
    id: "millimanPresentation2025",
    title:
      "Actuarial Valuation & Levy Adequacy Analysis · January 28, 2025 (June 2024 data)",
    org: "Milliman",
    url: "https://www.portland.gov/sites/default/files/council-documents/2026/FINAL-Milliman-Board-Presentation---Valuation-and-Levy-Analysis.PDF",
    kind: "actuarial",
  },
  oregonCompression: {
    id: "oregonCompression",
    title: "Property assessment and taxation: compression and tax limits",
    org: "Oregon Department of Revenue",
    url: "https://www.oregon.gov/dor/programs/property/pages/personal-property.aspx",
    kind: "primary",
  },
  audit2025: {
    id: "audit2025",
    title: "FPDR FY2024–25 audited financial statements, pp. 10–12 and 25",
    org: "FPDR / Moss Adams",
    url: "https://efiles.portlandoregon.gov/record/17529594/file/document",
    kind: "primary",
  },
  adopted2027: {
    id: "adopted2027",
    title: "FY2026–27 adopted FPDR budget, program operating expenses",
    org: "City of Portland",
    url: "https://efiles.portlandoregon.gov/record/17988007/file/document",
    kind: "primary",
  },
  levy2027: {
    id: "levy2027",
    title: "Ordinance 192196: FY2026–27 property-tax levies",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/ordinance/passed/192196",
    kind: "primary",
  },
  oregonAssessment: {
    id: "oregonAssessment",
    title: "Real property assessment and taxation: AV, MAV and exceptions",
    org: "Oregon Department of Revenue",
    url: "https://www.oregon.gov/dor/forms/FormsPubs/real-property-assessment_303-670.pdf",
    kind: "primary",
  },
  gfoaBonds: {
    id: "gfoaBonds",
    title: "Pension obligation bonds: recommendation against issuance",
    org: "Government Finance Officers Association",
    url: "https://www.gfoa.org/materials/pension-obligation-bonds",
    kind: "analysis",
  },
  charterLevy: {
    id: "charterLevy",
    title: "Charter §5-103: how the annual levy is set",
    org: "City of Portland",
    url: "https://www.portland.gov/charter/5/1/103",
    kind: "primary",
  },
  milliman2024: {
    id: "milliman2024",
    title: "FPDR Pension Actuarial Valuation as of June 30, 2024",
    org: "Milliman, Inc.",
    url: "https://efiles.portlandoregon.gov/record/17165020/file/document",
    kind: "actuarial",
  },
  millimanLevy2025: {
    id: "millimanLevy2025",
    title: "FPDR Levy Adequacy Analysis (presented Jan 28, 2025)",
    org: "Milliman, Inc.",
    url: "https://efiles.portlandoregon.gov/record/17165019/file/document",
    kind: "actuarial",
  },
  fiveYearPlan: {
    id: "fiveYearPlan",
    title: "FPDR FYE 2025–29 Five-Year Plan",
    org: "City of Portland",
    url: "https://www.portland.gov/budget/2024-2025-budget/documents/fire-police-disability-retirement-fund-5-yr-fy24-25/download",
    kind: "primary",
  },
  charter5: {
    id: "charter5",
    title: "Portland City Charter, Chapter 5",
    org: "City of Portland",
    url: "https://www.portland.gov/charter/5",
    kind: "primary",
  },
  county2526: {
    id: "county2526",
    title: "Summary of Assessments and Taxes 2025–2026",
    org: "Multnomah County",
    url: "https://multco.us/file/2025-2026-summary-of-assessments-and-taxes/download",
    kind: "primary",
  },
  fin377: {
    id: "fin377",
    title: "FIN-3.77 — Fire & Police Disability & Retirement Fund (Fund 800)",
    org: "City of Portland",
    url: "https://www.portland.gov/charter-code-policies/documents/fin-377-fire-police-disability-retirement-fund-fund-800/download",
    kind: "primary",
  },
  measure2686: {
    id: "measure2686",
    title: "November 7, 2006 Election Abstracts (Measure 26-86)",
    org: "Multnomah County",
    url: "https://multco.us/info/november-7-2006-abstracts",
    kind: "primary",
  },
  moro: {
    id: "moro",
    title: "Moro v. State of Oregon (2015)",
    org: "Oregon Supreme Court",
    url: "https://caselaw.findlaw.com/or-supreme-court/1699571.html",
    kind: "primary",
  },
  machizDeck: {
    id: "machizDeck",
    title: "FPDR Funding Policy (analysis filed with the City)",
    org: "Kevin Machiz, CFA, FRM",
    url: "https://efiles.portlandoregon.gov/Record/16246455/File/Document/",
    kind: "analysis",
  },
  machizOpEd: {
    id: "machizOpEd",
    title:
      "Opinion: Growing pension burden on Portland property tax bills shows need for leaders to step in",
    org: "Kevin Machiz / OregonLive",
    url: "https://www.oregonlive.com/opinion/2024/11/opinion-growing-pension-burden-on-portland-property-tax-bills-shows-need-for-leaders-to-step-in.html",
    kind: "opinion",
  },
  wweek2023: {
    id: "wweek2023",
    title:
      "Financial Analyst New to Portland Lobbies Against Costly, Antiquated Pension System",
    org: "Willamette Week",
    url: "https://www.wweek.com/news/2023/10/25/financial-analyst-new-to-portland-lobbies-against-costly-antiquated-pension-system/",
    kind: "news",
  },
  streetRoots2022: {
    id: "streetRoots2022",
    title: "One of the most expensive pensions in the country",
    org: "Street Roots",
    url: "https://www.streetroots.org/news/2022/08/25/pensions",
    kind: "news",
  },
  publicPlansData: {
    id: "publicPlansData",
    title: "Public Plans Database — plan comparison",
    org: "Center for Retirement Research, Boston College",
    url: "https://publicplansdata.org/quick-facts/by-pension-plan/plan/?ppd_id=140",
    kind: "analysis",
  },
  moodys2024: {
    id: "moodys2024",
    title: "City of Portland retains Aaa credit rating (March 2024)",
    org: "City of Portland / Moody's",
    url: "https://www.portland.gov/wheeler/news/2024/3/13/city-portland-retains-aaa-credit-rating",
    kind: "news",
  },
  spGlobal2026: {
    id: "spGlobal2026",
    title:
      "Portland, OR 2026A/B Limited Tax Bonds — 'AA' Rating, Stable Outlook",
    org: "S&P Global Ratings",
    url: "https://www.portland.gov/debt/documents/sp-global-ratings-most-recent-credit-opinion/download",
    kind: "primary",
  },
  fiveYearPlan2731: {
    id: "fiveYearPlan2731",
    title:
      "FPDR FYE 2027–31 Five-Year Plan (levy-rate & assessed-value forecast)",
    org: "City of Portland",
    url: "https://efiles.portlandoregon.gov/record/17862793/file/document",
    kind: "primary",
  },
};

// ── Headline figures (verified) ───────────────────────────────────

/** The numbers that anchor the whole story. */
export const HEADLINE = {
  /** GASB total pension liability at June 30, 2025; audit p. 25. */
  liability: 3_363_287_824,
  /** Plan fiduciary net position at June 30, 2025; includes operating assets. */
  assets: 27_686_552,
  /** assets / liability */
  fundedRatio: 27_686_552 / 3_363_287_824,
  /** FY2025-26 levy certified by Multnomah County. */
  annualLevyFY26: 251_613_821,
  /** FY2026-27 levy just approved by Council. */
  annualLevyFY27: 279_235_522,
  /** FY2025-26 FPDR rate, per $1,000 of *assessed* value. */
  ratePer1000AV_FY26: 2.9874,
  /** Charter cap, per $1,000 of *real market* value. */
  capPer1000RMV: 2.8,
  /** FY2026-27 gross levy share. Ordinance 192196: $279,235,522 / $868,476,000.
   * City levies only; excludes other taxing districts and urban renewal.
   * This is not an individual property's share of its full tax bill. */
  shareOfCityLine: 279_235_522 / 868_476_000,
  /** 2006 reform vote — share voting YES. */
  measure2686YesPct: 0.8161,
  measure2686Yes: 160_230,
  measure2686No: 36_095,
  /** Actual benefit payments, FY2023-24. */
  benefitPaymentsFY24: 160_600_000,
  /** Projected nominal peak of annual benefit payments. */
  peakBenefitPayments: 234_800_000,
  peakBenefitYear: 2037,
  /** PERS contributions paid by the Fund for post-2006 (FPDR Three) hires, FY2025-26. */
  persContributionsFY26: 59_870_000,
  /** Machiz's undiscounted lifetime cash-cost estimate for the closed group. */
  lifetimeCashEstimate: 8_000_000_000,
  /** GASB discount rate used in the 2024 valuation. */
  discountRate2024: 0.0393,
} as const;

// Certified FY26 rate followed by the City's FYE2027–31 forecast, p. 6.
// Citywide tax-base growth (3.9% in FY27) is NOT household growth. The engine
// applies a separate explicit household assumption, default 3%, after FY26.
export const FPDR_RATE_FORECAST = [
  { fy: "2025–26", ratePer1000AV: 2.9874, projected: false },
  { fy: "2026–27", ratePer1000AV: 3.1906, projected: true },
  { fy: "2027–28", ratePer1000AV: 3.28, projected: true },
  { fy: "2028–29", ratePer1000AV: 3.3897, projected: true },
  { fy: "2029–30", ratePer1000AV: 3.503, projected: true },
  { fy: "2030–31", ratePer1000AV: 3.6082, projected: true },
] as const;

// ── Annual levy history (levy credited, $ millions) ───────────────
// Verified anchor years. Not every intervening year is shown.

export const LEVY_HISTORY: {
  fy: string;
  year: number;
  levy: number;
  projected?: boolean;
}[] = [
  { fy: "FY20", year: 2020, levy: 168.8 },
  { fy: "FY24", year: 2024, levy: 210.0 },
  { fy: "FY25", year: 2025, levy: 243.4 },
  { fy: "FY26", year: 2026, levy: 251.6 },
  { fy: "FY27", year: 2027, levy: 279.2 },
];

// Adopted FY2026–27 Bureau Expense by program, dollars converted to millions.
// Sum = $258,656,860. Excludes fund expenses (including short-term borrowing
// repayment and contingency) and unappropriated funds; not a split of gross levy.
export const SPENDING_FY27 = [
  {
    key: "pension",
    label: "Old-plan pensions",
    amount: 180.513905,
    color: "var(--color-canopy)",
    note: "FPDR One & Two benefits and program operations",
  },
  {
    key: "pers",
    label: "PERS contributions",
    amount: 63.94,
    color: "var(--color-river)",
    note: "Prefunding retirement for post-2006 hires",
  },
  {
    key: "disability",
    label: "Disability & death",
    amount: 10.750612,
    color: "var(--color-ember)",
    note: "Benefits and program operations",
  },
  {
    key: "admin",
    label: "Administration",
    amount: 3.452343,
    color: "var(--color-storm)",
    note: "Administration & Support operating expenses",
  },
];

// ── The pay-as-you-go projection (illustrative) ───────────────────
// Anchor points are from Milliman: FY2024 actual ($160.6M), the nominal
// peak (~$234.8M around FY2037), and the FY2054 published figure
// ($176.1M). The long decline to the 2080s is interpolated for
// illustration — the *shape* (rise, peak ~mid-2030s, long tail) is what
// matters, not any single intermediate year.

export const PAYGO_ANCHORS: { year: number; payments: number }[] = [
  { year: 2024, payments: 160.6 },
  { year: 2028, payments: 192 },
  { year: 2031, payments: 215 },
  { year: 2034, payments: 230 },
  { year: 2037, payments: 234.8 },
  { year: 2040, payments: 229 },
  { year: 2044, payments: 212 },
  { year: 2048, payments: 196 },
  { year: 2054, payments: 176.1 },
  { year: 2062, payments: 128 },
  { year: 2070, payments: 64 },
  { year: 2078, payments: 18 },
  { year: 2082, payments: 4 },
];

export const SIM_START_YEAR = 2025;
export const SIM_END_YEAR = 2082;

// ── Reform options (for the trade-off menu) ───────────────────────

/** Milliman January 28, 2025 presentation, printed slides 28 and 30.
 * Selected annual medians, not a single simulated path or household bill.
 * Nominal levy dollars in millions; RMV rate per $1,000 market value. */
export const LEVY_MEDIAN_COMPARISON = [
  { year: 2033, fy: "2032–33", levy: 374.1, rmvRate: 1.69 },
  { year: 2041, fy: "2040–41", levy: 412.7, rmvRate: 1.36 },
] as const;

// Editorial comparison of the status quo and the City's four mechanisms (slide 16).
// These are policy options, not adopted policies or quantified funding proposals.
export const REFORM_OPTIONS = [
  {
    id: "status-quo",
    name: "Keep paying year by year",
    tag: "Current approach",
    when: "Extra saving would strain households or services, but annual benefit payments remain manageable.",
    ask: "What would make saving affordable? Set a review date; waiting leaves less time to invest.",
    now: "No extra contribution to build savings. Existing bills can still rise.",
    later: "Future taxpayers keep paying benefits from taxes.",
    risk: "Little investment cushion for the old pension.",
  },
  {
    id: "cash",
    name: "Use existing cash",
    tag: "Save a lump sum",
    when: "A windfall or unrestricted surplus remains after protecting reserves and essential needs.",
    ask: "What else could this cash fund? Compare the value of those alternatives.",
    now: "Commit available money that could serve other needs.",
    later: "Investment earnings could reduce future taxes.",
    risk: "Less cash for other priorities; returns can disappoint.",
  },
  {
    id: "rapid",
    name: "Raise taxes quickly",
    tag: "Build savings sooner",
    when: "Households can afford the increase and earlier investment justifies the tax and service impacts.",
    ask: "Who pays more or loses services? Does the plan hold up after early investment losses?",
    now: "A sharp bill increase; other levies may lose revenue.",
    later: "More money invested earlier could lower later taxes.",
    risk: "Abrupt tax increases and pressure on other services.",
  },
  {
    id: "gradual",
    name: "Raise taxes gradually",
    tag: "Spread the transition",
    when: "Modest contributions are sustainable, with manageable tax and service impacts.",
    ask: "Can contributions survive a recession? Compare starting small now with starting larger later.",
    now: "Smaller initial increases, spread over more years.",
    later: "Savings build more slowly; relief could arrive later.",
    risk: "Still adds tax and service pressure; needs sustained contributions.",
  },
  {
    id: "pob",
    name: "Borrow to invest",
    tag: "Add debt",
    when: "Borrowing costs are favorable and the City can repay even after poor investment results.",
    ask: "Who covers investment losses and debt payments? GFOA recommends against these bonds.",
    now: "Invest borrowed money and start repaying the loan.",
    later: "Taxpayers benefit if returns beat interest and fees.",
    risk: "Debt stays due after losses. GFOA advises against these bonds.",
  },
] as const;

// ── Who receives benefits (Milliman valuation, as of June 30, 2024) ──
// All figures from the Milliman June 30, 2024 valuation (Appendix A) unless
// noted; the average pension is the actuarial average, not the higher
// outlay-per-retiree figure that has circulated in the press.

export const BENEFICIARIES = {
  /** Living retirees + surviving spouses/beneficiaries drawing a pension. */
  retireesAndSurvivors: 2014,
  retireesPolice: 1274,
  retireesFire: 740,
  /** Plus disabled members in pay and ex-spouse alternate payees. */
  disabledInPay: 23,
  alternatePayees: 142,
  /** Active members still earning the old pay-go pension (closed group). */
  activeFpdrTwo: 552,
  activeFpdrTwoPolice: 260,
  activeFpdrTwoFire: 292,
  /** Active members hired since 2007, in Oregon PERS (FPDR covers only disability). */
  activeFpdrThree: 853,
  activeTotal: 1405,
  /** Average pension (actuarial), $/year — all retirees & beneficiaries (Milliman 6/30/24, Appendix A). */
  avgAnnualPension: 78_000,
  /** Same all-retiree average, split by force ($6,318/mo police, $6,813/mo fire × 12). */
  avgAnnualPensionPolice: 75_800,
  avgAnnualPensionFire: 81_800,
  /** FPDR Two tier only (the larger closed tier) — kept for reference, not shown. */
  avgAnnualPensionFireTwo: 87_000,
  avgAnnualPensionPoliceTwo: 79_000,
  /** Typical retirement profile. */
  avgRetireAge: 52,
  avgYearsService: 25,
  /** Average age of current retirees. */
  avgRetireeAge: 69,
  /** Annual cost-of-living adjustment cap. */
  colaPct: 0.02,
  /** Record retirements in a single year (FYE2021), driven by pay-period spiking. */
  recordRetirements: 106,
  /** Oldest beneficiaries still drawing checks. */
  oldestBeneficiaryBand: "95+",
  /** Share of the active workforce that is FPDR Three (mid-2024), and projected. */
  fpdrThreeShareNow: 0.61,
  fpdrThreeShare2029: 0.83,
} as const;

// ── Plain-language reference values for the page ──────────────────

export const FACTS = {
  cityFY26ShortfallLow: 160_000_000,
  cityFY26ShortfallHigh: 172_000_000,
  /** Combined City-of-Portland rate per $1,000 AV (permanent + FPDR), FY2025-26. */
  cityComboRatePer1000AV: 7.5644,
  /** City permanent rate per $1,000 AV. */
  cityPermanentRatePer1000AV: 4.577,
  /** Effective RMV rate path (what actually shows up against market value). */
  rmvRateFY24: 1.18,
  rmvRateFY30: 1.84,
  /** Milliman stochastic result: chance of hitting the cap before 2044. */
  capBreachOddsThru2044: 0.02,
  medianRatePeak: 1.69,
  medianRatePeakYear: 2033,
} as const;
