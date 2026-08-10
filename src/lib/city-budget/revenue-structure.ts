/**
 * How Portland raises money, and why that is structurally different from peers.
 *
 * The short version: Oregon has no sales tax and no local sales tax option, so
 * the revenue tool every peer city leans on simply does not exist here.
 * Portland fills the gap with a tax on business profits — a far narrower and
 * more volatile base than consumption.
 */

export interface SalesTaxPeer {
  city: string;
  fy: string;
  rate: string;
  revenue: number | null;
  shareOfGf: number | null;
  note: string;
  source: string;
}

export const SALES_TAX: SalesTaxPeer[] = [
  {
    city: "Denver",
    fy: "2026",
    rate: "5.15% city, of 9.15% total",
    revenue: 928_400_000,
    shareOfGf: 55.8,
    note: "More than half the general fund comes from a consumption tax. Only 3.50 points go to the general fund; the rest is voter-dedicated.",
    source:
      "https://www.denvergov.org/files/assets/public/v/2/finance/documents/budget/2026/final-sept_2026-proposed-budget_on-line-version_9-15-25-small.pdf",
  },
  {
    city: "Sacramento",
    fy: "FY2025-26",
    rate: "2.00% city, of 8.75% total",
    revenue: 236_800_000,
    shareOfGf: 28,
    note: "12% general plus 16% from the voter-approved Measure U rate.",
    source:
      "https://www.cityofsacramento.gov/content/dam/portal/finance/Budget/fy2025-26-approved/FY2025_26%20Approved%20Operating%20Budget.pdf",
  },
  {
    city: "Austin",
    fy: "FY2025-26",
    rate: "1.00% city, of 8.25% total",
    revenue: 359_400_000,
    shareOfGf: 22.8,
    note: "A single point of sales tax raises more than Portland's entire business licence tax.",
    source: "https://austin.widen.net/content/gvs5vuvc3l/pdf/FY2025-2026_Approved_Budget.pdf",
  },
  {
    city: "Seattle",
    fy: "2026",
    rate: "1.10% city, of 10.55% total",
    revenue: 401_900_000,
    shareOfGf: 19.9,
    note: "Seattle also has no income tax, so it leans on a business & occupation tax on gross receipts — $479.1M, 23.7% of its general fund, out-earning even its sales tax.",
    source:
      "https://seattle.gov/documents/Departments/FinanceDepartment/26adoptedbudget/GFRevenueOverview.pdf",
  },
  {
    city: "Portland",
    fy: "FY2026-27",
    rate: "None — Oregon has no sales tax at any level",
    revenue: null,
    shareOfGf: null,
    note: "Oregon is one of five states with no statewide sales tax, and one of three that also bar local sales taxes. The tool every peer uses is unavailable here.",
    source: "https://taxfoundation.org/data/all/state/sales-tax-rates/",
  },
];

/** What Portland leans on instead, and how concentrated that base is. */
export const BLT = {
  rate: "2.6% of net business income",
  fy2526: 220_000_000,
  fy2627Forecast: 212_500_000,
  forecastCutFrom: 232_500_000,
  /** Share of BLT paid by the largest filers, Tax Year 2023. */
  top10Share: 15,
  top1000Share: 67,
  totalPayers: 50_000,
  /** Effect of federal bonus-depreciation permanence flowing through Oregon's rolling reconnect. */
  federalHit: 32_600_000,
  combinedLocalRate: 5.6,
  source:
    "https://www.portland.gov/budget/2026-2027-budget/documents/fy-2026-27-general-fund-forecast/download",
  rateSource: "https://www.portland.gov/revenue/business-tax",
} as const;

/** Measure 5 and Measure 50 — why property tax grows slowly here. */
export const PROPERTY_LIMITS = {
  permanentRate: 4.577,
  avToRmv: 42.0,
  assessedValue: 86_200_000_000,
  realMarketValue: 205_150_000_000,
  compressionCountywide: 147_994_886,
  compressionPortlandPermanent: 33_800_000,
  levyLossPct: 27.3,
  avGrowthAssumed: 2.2,
  officeVacancy: 33,
  top20Before: 3_000_000_000,
  top20After: 986_000_000,
  sourceValues: "https://multco.us/file/2025-2026-taxing-district-values.xlsx/download",
  sourceCompression:
    "https://multco.us/file/2025-2026-summary-of-assessments-and-taxes/download",
  sourceOffice:
    "https://katu.com/news/investigations/combined-market-value-of-top-20-office-buildings-down-70-in-portland-since-2019-downtown-covid-market-real-estate-money-taxes-budget-oregon-local-community",
  sourceMeasures:
    "https://www.oregonlegislature.gov/lro/documents/rr4-10h_inequitiesundermeasure50_092210.pdf",
} as const;

/** The December 2025 forecast revisions that opened the gap. */
export const FORECAST_CUTS = [
  { label: "Business licence taxes", value: -20_000_000, why: "Federal bonus depreciation, passed through by Oregon's rolling reconnect to the federal code." },
  { label: "Projected underspending", value: -14_000_000, why: "Less money expected to go unspent than previously assumed." },
  { label: "Utility licence & franchise fees", value: -9_000_000, why: "Largely an accounting artifact of how prior years were accrued." },
  { label: "Property taxes", value: -7_700_000, why: "Assessed value growing at 2.2% — among the weakest since Measures 5 and 50 passed." },
  { label: "Transient lodging taxes", value: -6_000_000, why: "Still around 65% of the pre-pandemic peak." },
  { label: "Other revenue", value: -1_400_000, why: "State-shared revenue, including shrinking liquor distributions." },
] as const;

export const REVENUE_SOURCES = {
  taxFoundationPortland: "https://taxfoundation.org/research/all/state/portland-taxes/",
  streetRootsRebuttal:
    "https://www.streetroots.org/opinion/2024/01/17/opinion-portland-does-not-have-highest-taxes-country/",
  utilityFee: "https://www.portland.gov/code/7/14",
  seattleUtility:
    "https://www.seattle.gov/documents/Departments/FinanceDepartment/2026proposedbudget/GF_Revenue.pdf",
  appa: "https://www.publicpower.org/resource/public-power-pays-back",
} as const;
