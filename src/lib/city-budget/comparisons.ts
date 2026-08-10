/**
 * Peer-city comparison data.
 *
 * Cross-city budget comparison is the single most abused number in local
 * government reporting. The spread between cities is mostly a question of
 * which functions sit inside the corporate boundary — schools, county health,
 * transit, electricity — not how much government anyone is buying. Every
 * figure here is therefore paired with what it does and doesn't include.
 *
 * Population: U.S. Census Bureau Vintage 2025 estimates (July 1, 2025).
 */

export interface PeerCity {
  city: string;
  fy: string;
  total: number;
  population: number;
  /** What sits inside that total but not inside Portland's, or vice versa. */
  includes: string;
  water: "in" | "out";
  electric: "in" | "out";
  schools: "in" | "out";
  county: "in" | "out";
  source: string;
  highlight?: boolean;
}

export const PEERS: PeerCity[] = [
  {
    city: "San Francisco",
    fy: "FY2026-27",
    total: 16_850_000_000,
    population: 826_079,
    includes: "A consolidated city-and-county: a $3.6B public health system, the sheriff, the airport and the transit agency are all inside this number.",
    water: "in",
    electric: "in",
    schools: "out",
    county: "in",
    source: "https://media.api.sf.gov/documents/Mayors_June_1st_Proposed_FY27_and_FY28_Budget_Budget_Book.pdf",
  },
  {
    city: "Portland",
    fy: "FY2026-27",
    total: 8_546_060_062,
    population: 635_109,
    includes: "City functions only. Schools are a separate $2.77B district; health, jail and courts belong to Multnomah County and are not here.",
    water: "in",
    electric: "out",
    schools: "out",
    county: "out",
    source: "https://www.portland.gov/budget/2026-2027-budget/development/adopted",
    highlight: true,
  },
  {
    city: "Seattle",
    fy: "2026 proposed",
    total: 8_538_000_000,
    population: 784_777,
    includes: "Includes City Light, a $1.8B municipal electric utility Portland does not have. Utilities are 41% of Seattle's budget — a larger share than Portland's.",
    water: "in",
    electric: "in",
    schools: "out",
    county: "out",
    source: "https://www.seattle.gov/documents/departments/financedepartment/2526proposedbudget/charts_and_tables.pdf",
  },
  {
    city: "Austin",
    fy: "FY2026-27 proposed",
    total: 6_600_000_000,
    population: 1_002_632,
    includes: "Includes Austin Energy and Austin Water — roughly 30% of the total — for 370,000 more residents than Portland.",
    water: "in",
    electric: "in",
    schools: "out",
    county: "out",
    source: "https://www.austintexas.gov/communications/news/austins-66-billion-proposed-budget-focused-fiscal-sustainability-enable-high",
  },
  {
    city: "Boston",
    fy: "FY2027",
    total: 4_942_000_000,
    population: 672_973,
    includes: "Includes $1.73B of public schools — 35% of the budget — but no water or sewer: those sit in a separate state-chartered commission.",
    water: "out",
    electric: "out",
    schools: "in",
    county: "out",
    source: "https://www.boston.gov/sites/default/files/file/2026/04/3-Volume%201%20-%20Operating%20Budget_0.pdf",
  },
  {
    city: "Sacramento",
    fy: "FY2026-27",
    total: 1_723_000_000,
    population: 536_449,
    includes: "Water collection only — sewer treatment and electricity are both separate regional agencies. The smallest scope of government on this list.",
    water: "in",
    electric: "out",
    schools: "out",
    county: "out",
    source: "https://www.cityofsacramento.gov/content/dam/portal/finance/Budget/26-27-proposed/FY2026_27_Proposed_Operating_Budget_Web_v2.pdf",
  },
];

/** Police as a share of the general fund — the most misread table in local news. */
export interface PoliceShare {
  city: string;
  fy: string;
  police: number;
  generalFund: number;
  denominator: string;
  comparable: boolean;
}

export const POLICE_SHARE: PoliceShare[] = [
  {
    city: "Sacramento",
    fy: "FY2026-27",
    police: 249_100_000,
    generalFund: 747_300_000,
    denominator: "General Fund",
    comparable: true,
  },
  {
    city: "Portland",
    fy: "FY2025-26",
    police: 265_600_000,
    generalFund: 806_400_000,
    denominator: "General Fund discretionary",
    comparable: true,
  },
  {
    city: "Austin",
    fy: "FY2026-27",
    police: 496_300_000,
    generalFund: 1_540_000_000,
    denominator: "General Fund",
    comparable: true,
  },
  {
    city: "Seattle",
    fy: "2026",
    police: 457_500_000,
    generalFund: 1_912_000_000,
    denominator: "General Fund",
    comparable: true,
  },
  {
    city: "Denver",
    fy: "2026",
    police: 281_000_000,
    generalFund: 1_660_000_000,
    denominator: "City-and-county General Fund, excludes the separate Sheriff",
    comparable: false,
  },
  {
    city: "Boston",
    fy: "FY2027",
    police: 484_500_000,
    generalFund: 4_942_000_000,
    denominator: "General Fund including a $1.7B school district",
    comparable: false,
  },
  {
    city: "San Francisco",
    fy: "FY2026-27",
    police: 702_100_000,
    generalFund: 7_598_000_000,
    denominator: "General Fund including county health",
    comparable: false,
  },
];

/** The City's own three different totals for the same budget. */
export const COMPETING_TOTALS = [
  {
    label: "The adoption ordinance",
    value: 8_537_051_372,
    what: "Ordinance 192195, passed June 17 2026 — the legally adopted amount.",
    url: "https://www.portland.gov/council/documents/ordinance/passed/192195",
  },
  {
    label: "Requirements by major object",
    value: 8_546_060_062,
    what: "Budget book Vol 1, Figure 6. This is the figure our parsed fund detail reproduces to the dollar, so it is the one this page uses.",
    url: "https://www.portland.gov/budget/2026-2027-budget/development/adopted",
  },
  {
    label: "The fund summary table",
    value: 8_546_262_736,
    what: "Budget book Vol 1, citywide fund summary. Its prior-year column also matches our parse exactly.",
    url: "https://www.portland.gov/budget/2026-2027-budget/development/adopted",
  },
] as const;

export const LINCOLN_FISC =
  "https://www.lincolninst.edu/data/fiscally-standardized-cities/explanation-of-fiscally-standardized-cities/";
