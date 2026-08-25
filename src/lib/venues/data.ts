/**
 * The factual spine of the venue-portfolio deep-dive.
 *
 * House rules (same as rose-quarter): every load-bearing number lives in
 * HEADLINE and carries a source; frameworks, grades, and judgments are
 * Portland Civic Lab analysis and cite `pclAnalysis`; any figure we could
 * not trace to a primary source is flagged in the page's Method section,
 * never silently cited.
 */

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  kind: "primary" | "news" | "analysis" | "book";
  year?: number;
}

export const SOURCES = {
  pclAnalysis: {
    id: "pclAnalysis",
    title: "Portland's Public Entertainment Venue Portfolio — analysis, grades, and framework",
    org: "Portland Civic Lab",
    url: "/methodology",
    kind: "analysis",
    year: 2026,
  },
  res2026270: {
    id: "res2026270",
    title: "Resolution 2026-270: Accept the Future of Large-Scale Performing Arts recommendations",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/resolution/accept-future-large-scale-performing-arts-recommendations",
    kind: "primary",
    year: 2026,
  },
  flspaProgram: {
    id: "flspaProgram",
    title: "Future of Large-Scale Performing Arts program",
    org: "City of Portland, Office of Arts & Culture",
    url: "https://www.portland.gov/arts/keller/future-large-scale-performing-arts",
    kind: "primary",
    year: 2026,
  },
  modaTermSheetOpb: {
    id: "modaTermSheetOpb",
    title: "Portland City Council approves term sheet for Moda Center renovations",
    org: "OPB",
    url: "https://www.opb.org/article/2026/08/12/portland-city-council-approves-moda-center-renovations-term-sheet/",
    kind: "news",
    year: 2026,
  },
  modaTermSheetWw: {
    id: "modaTermSheetWw",
    title: "Council approves Moda Center term sheet to kick off negotiations with Blazers",
    org: "Willamette Week",
    url: "https://www.wweek.com/news/city/2026/08/12/council-approves-moda-center-term-sheet-to-kick-off-negotiations-with-blazers/",
    kind: "news",
    year: 2026,
  },
  modaResolution: {
    id: "modaResolution",
    title: "Resolution 2026-280: Moda Center term sheet",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/resolution/moda-term-sheet-0",
    kind: "primary",
    year: 2026,
  },
  countyModa: {
    id: "countyModa",
    title: "As county passes funding for Moda Center renovation, city tussles over term sheet",
    org: "Willamette Week",
    url: "https://www.wweek.com/news/city/2026/08/06/as-county-passes-funding-for-moda-center-renovation-city-tussles-over-term-sheet/",
    kind: "news",
    year: 2026,
  },
  sb1501: {
    id: "sb1501",
    title: "Oregon lawmakers pass $365M funding bill for Moda Center renovations (SB 1501)",
    org: "KGW",
    url: "https://www.kgw.com/article/news/politics/oregon-house-legislature-pass-moda-center-fund-bill-365-million/283-3cbda423-a745-4d0a-86df-b0de2d8d8d4f",
    kind: "news",
    year: 2026,
  },
  p5Transition: {
    id: "p5Transition",
    title: "Metro and City of Portland announce next steps in Portland'5 management transition",
    org: "City of Portland",
    url: "https://www.portland.gov/community-economic-dev/news/2026/1/5/metro-and-city-portland-announce-next-steps-portland5",
    kind: "primary",
    year: 2026,
  },
  p5Rfi: {
    id: "p5Rfi",
    title: "Request for Information: venue operations for Portland'5 Centers for the Arts",
    org: "City of Portland",
    url: "https://www.portland.gov/arts/portland5-request-information",
    kind: "primary",
    year: 2026,
  },
  rqPartnerResolution: {
    id: "rqPartnerResolution",
    title: "Resolution 2026-285: development partner for city-owned properties adjacent to Moda Center",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/resolution/moda-center-development-partner-resolution",
    kind: "primary",
    year: 2026,
  },
  rqPartnerOpb: {
    id: "rqPartnerOpb",
    title: "Portland councilors advance plan to develop city land adjacent to Moda Center",
    org: "OPB",
    url: "https://www.opb.org/article/2026/08/12/portland-councilors-land-plan-moda-center/",
    kind: "news",
    year: 2026,
  },
  gibsonAlbina: {
    id: "gibsonAlbina",
    title: "Bleeding Albina: A History of Community Disinvestment, 1940–2000",
    org: "Karen J. Gibson (hosted by City of Portland)",
    url: "https://www.portland.gov/bps/documents/bleeding-albina-history-community-disinvestment/download",
    kind: "book",
    year: 2007,
  },
  wikiVanport: {
    id: "wikiVanport",
    title: "Vanport, Oregon",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Vanport,_Oregon",
    kind: "analysis",
  },
  pirHistory: {
    id: "pirHistory",
    title: "Portland International Raceway: history",
    org: "Portland International Raceway",
    url: "https://portlandraceway.com/?%2Fabout%2Fhistory=",
    kind: "primary",
  },
  wikiVmc: {
    id: "wikiVmc",
    title: "Veterans Memorial Coliseum (Portland, Oregon)",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Veterans_Memorial_Coliseum_(Portland,_Oregon)",
    kind: "analysis",
  },
  ntVmc: {
    id: "ntVmc",
    title: "Portland's modernist civic landmark named city's first National Treasure",
    org: "National Trust for Historic Preservation",
    url: "https://savingplaces.org/press-center/media-resources/portlands-modernist-civic-landmark-named-citys-first-national-treasure",
    kind: "primary",
    year: 2016,
  },
  wikiKeller: {
    id: "wikiKeller",
    title: "Keller Auditorium",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Keller_Auditorium",
    kind: "analysis",
  },
  wikiSchnitzer: {
    id: "wikiSchnitzer",
    title: "Arlene Schnitzer Concert Hall",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Arlene_Schnitzer_Concert_Hall",
    kind: "analysis",
  },
  wikiProvidence: {
    id: "wikiProvidence",
    title: "Providence Park",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Providence_Park",
    kind: "analysis",
  },
  pdxProvidence: {
    id: "pdxProvidence",
    title: "Providence Park turns 95",
    org: "City of Portland",
    url: "https://www.portland.gov/venues/news/2021/10/28/providence-park-turns-95",
    kind: "primary",
    year: 2021,
  },
  wikiPioneer: {
    id: "wikiPioneer",
    title: "Pioneer Courthouse Square",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Pioneer_Courthouse_Square",
    kind: "analysis",
  },
  pdxPioneer: {
    id: "pdxPioneer",
    title: "Pioneer Courthouse Square",
    org: "Portland Parks & Recreation",
    url: "https://www.portland.gov/parks/pioneer-courthouse-square",
    kind: "primary",
  },
  wikiModa: {
    id: "wikiModa",
    title: "Moda Center",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Moda_Center",
    kind: "analysis",
  },
  wikiRoseGardenBk: {
    id: "wikiRoseGardenBk",
    title: "Rose Garden arena bankruptcy",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Rose_Garden_arena_bankruptcy",
    kind: "analysis",
  },
  wikiHatfield: {
    id: "wikiHatfield",
    title: "Antoinette Hatfield Hall",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Antoinette_Hatfield_Hall",
    kind: "analysis",
  },
  wikiWalker: {
    id: "wikiWalker",
    title: "Walker Stadium",
    org: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Walker_Stadium_(baseball)",
    kind: "analysis",
  },
  pdxWalker: {
    id: "pdxWalker",
    title: "Lents Park: Walker Stadium",
    org: "Portland Parks & Recreation",
    url: "https://www.portland.gov/parks/lents-park-walker-stadium",
    kind: "primary",
  },
  ord191857: {
    id: "ord191857",
    title: "Ordinance 191857 — Rose Quarter bridge agreements",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/ordinance/passed/191857",
    kind: "primary",
    year: 2024,
  },
  bridgeFactSheet: {
    id: "bridgeFactSheet",
    title: "Moda Center bridge agreement fact sheet",
    org: "City of Portland, Office of the Mayor",
    url: "https://www.portland.gov/wheeler/documents/moda-center-bridge-agreement-fact-sheet/download",
    kind: "primary",
    year: 2024,
  },
  svAnnualReport: {
    id: "svAnnualReport",
    title: "Spectator Venues & Visitor Activities 2024–25 annual report",
    org: "City of Portland",
    url: "https://www.portland.gov/venues/overview/2024-2025-annual-report",
    kind: "primary",
    year: 2025,
  },
  p5RevenueDoc: {
    id: "p5RevenueDoc",
    title: "Portland'5 revenue and attendance by venue, FY2023–24 and FY2024–25",
    org: "City of Portland / Portland'5",
    url: "https://www.portland.gov/arts/documents/portland5-centers-arts-revenue-and-attendance/download",
    kind: "primary",
    year: 2026,
  },
  p5Financials: {
    id: "p5Financials",
    title: "Portland'5 financial statement, FY2024 and FY2025 actuals",
    org: "City of Portland / Portland'5",
    url: "https://www.portland.gov/arts/documents/portland5-centers-arts-financial-statements/download",
    kind: "primary",
    year: 2026,
  },
  sazanFca: {
    id: "sazanFca",
    title: "Facility condition assessment executive summaries (Keller, Schnitzer, Hatfield Hall)",
    org: "Säzän Group / Portland'5",
    url: "https://www.portland5.com/news/facility-condition-assessment-executive-summaries-released",
    kind: "primary",
    year: 2026,
  },
  artswatchFca: {
    id: "artswatchFca",
    title: "Downtown Portland arts centers need $336 million in deferred maintenance",
    org: "Oregon ArtsWatch",
    url: "https://www.orartswatch.org/downtown-portland-arts-centers-need-336-million-in-deferred-maintenance/",
    kind: "news",
    year: 2026,
  },
  artswatchPsu: {
    id: "artswatchPsu",
    title: "Clock is ticking for Portland to fund Moda Center, PSU-related performing arts center",
    org: "Oregon ArtsWatch",
    url: "https://www.orartswatch.org/clock-is-ticking-for-portland-to-fund-moda-center-psu-related-performing-arts-center/",
    kind: "news",
    year: 2026,
  },
  pdxProvidencePark: {
    id: "pdxProvidencePark",
    title: "Providence Park",
    org: "City of Portland, Spectator Venues",
    url: "https://www.portland.gov/venues/providence-park",
    kind: "primary",
  },
  pdxModaCenter: {
    id: "pdxModaCenter",
    title: "Moda Center",
    org: "City of Portland, Spectator Venues",
    url: "https://www.portland.gov/venues/moda-center",
    kind: "primary",
  },
  fin358: {
    id: "fin358",
    title: "FIN-3.58: Spectator Venues & Visitor Activities Fund statement (Fund 607)",
    org: "City of Portland, Finance",
    url: "https://www.portland.gov/policies/finance/fund-statements-purpose/fin-358-spectator-venues-visitor-activities-fund-fund-607",
    kind: "primary",
  },
  pioneerOrd: {
    id: "pioneerOrd",
    title: "Ordinance 190912 — Pioneer Courthouse Square management agreement, 2022–25",
    org: "Portland City Council",
    url: "https://www.portland.gov/council/documents/ordinance/passed/190912",
    kind: "primary",
    year: 2022,
  },
  walkerOrd: {
    id: "walkerOrd",
    title: "City Council approves Lents Park ordinance, brings baseball back to Portland in 2016",
    org: "Portland Parks & Recreation",
    url: "https://www.portland.gov/parks/news/2015/3/26/city-council-approves-lents-park-ordinance-brings-baseball-back-portland-2016",
    kind: "primary",
    year: 2015,
  },
  multcoTlt: {
    id: "multcoTlt",
    title: "Multnomah County transient lodging tax",
    org: "Multnomah County",
    url: "https://multco.us/info/multnomah-county-transient-lodging-tax",
    kind: "primary",
  },
  multcoRental: {
    id: "multcoRental",
    title: "Multnomah County motor vehicle rental tax",
    org: "Multnomah County",
    url: "https://multco.us/info/multnomah-county-motor-vehicle-rental-tax",
    kind: "primary",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/* ------------------------------------------------------------- headline */

export const HEADLINE = {
  ownerGrade: "C",
  modaFramework: 573_000_000,
  modaState: 365_000_000,
  modaCounty: 88_000_000,
  modaCity: 120_000_000,
  modaEligible: 288_600_000,
  modaEligibleCity: 275_000_000,
  modaEligibleCounty: 13_600_000,
  vmcRenovation: 56_000_000,
  p5NearLow: 29_000_000,
  p5NearHigh: 54_500_000,
  p5MidLow: 115_000_000,
  p5MidHigh: 214_000_000,
  p5AllLow: 180_000_000,
  p5AllHigh: 334_500_000,
  psuConcept: 449_000_000,
  psuResolution: 447_000_000,
  kellerRenoResolution: 290_000_000,
  p5Shortfall: 4_510_000,
  p5FnbNet: 1_700_000,
  bridgeArenaPrice: 1,
  bridgeLandPrice: 7_130_000,
  providencePrivate: 75_000_000,
  pioneerSubsidy: 470_000,
  p5EventsFy25: 710,
  p5AttendanceFy25: 798_347,
  p5RevenueFy25: 20_965_000,
  modaVisitors: 1_500_000,
  modaCapacity: 19_000,
  providenceCapacity: 25_000,
  providenceEvents: 150,
  walkerSeats: 1_500,
  onePercentOfModa: 5_730_000,
  p5TransitionDate: "July 1, 2027",
} as const;

/* ------------------------------------------------- §2: the perimeter */

export interface PerimeterRing {
  id: string;
  title: string;
  oversight: string;
  venues: string[];
  note?: string;
}

export const PERIMETER: PerimeterRing[] = [
  {
    id: "spectator",
    title: "Spectator Venues & Visitor Activities",
    oversight: "City program within Community & Economic Development",
    venues: [
      "Moda Center",
      "Veterans Memorial Coliseum",
      "Providence Park",
      "Rose Quarter garages, plazas & land",
    ],
    note: "Funded by ticket and user fees, Rose Quarter parking, agreement revenues, and allocations from the Multnomah County Visitor Facilities Trust Account (lodging and rental-car taxes).",
  },
  {
    id: "p5",
    title: "Portland'5: five theaters, three City-owned buildings",
    oversight: "Arts & Culture oversight; Metro/MERC operates through June 30, 2027",
    venues: [
      "Keller Auditorium",
      "Arlene Schnitzer Concert Hall",
      "Newmark Theatre",
      "Winningstad Theatre",
      "Brunish Theatre",
    ],
    note: "Management returns to the City on July 1, 2027, the largest operational handoff in the portfolio's history.",
  },
  {
    id: "parks",
    title: "Parks & civic-event assets",
    oversight: "Portland Parks & Recreation, nonprofit managers, tenants",
    venues: [
      "Portland International Raceway",
      "Pioneer Courthouse Square",
      "Walker Stadium",
      "Erv Lind Stadium",
      "Sckavone Stadium",
      "East Delta fields",
      "Interstate Firehouse Cultural Center",
      "Community Music Center",
      "Multnomah Arts Center",
      "Waterfront Park & programmable public spaces",
    ],
    note: "Not all are managed identically, but all belong in the same public asset register. The Oregon Convention Center and Expo Center are Metro assets: comparables and complements, not City holdings.",
  },
];

/* ---------------------------------------------- §3: governance table */

export interface GovernanceRow {
  asset: string;
  owner: string;
  operator: string;
  oversight: string;
}

export const GOVERNANCE_ROWS: GovernanceRow[] = [
  { asset: "Moda Center", owner: "City of Portland", operator: "Rip City Management", oversight: "Spectator Venues" },
  { asset: "Veterans Memorial Coliseum", owner: "City of Portland", operator: "Rose Quarter operating structure", oversight: "Spectator Venues" },
  { asset: "Providence Park", owner: "City of Portland", operator: "Peregrine Sports / team operator", oversight: "Spectator Venues" },
  { asset: "Portland'5 buildings", owner: "City of Portland", operator: "Metro/MERC through June 2027", oversight: "Arts & Culture" },
  { asset: "Portland International Raceway", owner: "City of Portland", operator: "City / Parks", oversight: "Parks & Recreation" },
  { asset: "Pioneer Courthouse Square", owner: "Public asset", operator: "Nonprofit manager", oversight: "City agreement oversight" },
  { asset: "Smaller Parks venues", owner: "City", operator: "Parks, tenants, permittees", oversight: "Parks & Recreation" },
];

export interface ManagementGrade {
  dimension: string;
  grade: string;
  tone: "good" | "warn" | "bad";
}

export const MANAGEMENT_GRADES: ManagementGrade[] = [
  { dimension: "Operational continuity", grade: "B+", tone: "good" },
  { dimension: "Financial transparency", grade: "C−", tone: "warn" },
  { dimension: "Capital planning", grade: "C−", tone: "warn" },
  { dimension: "Contract & commercial-right management", grade: "C", tone: "warn" },
  { dimension: "Data & performance management", grade: "D+", tone: "bad" },
  { dimension: "Portfolio strategy", grade: "D+", tone: "bad" },
];

export const OWNER_QUESTIONS: string[] = [
  "Every revenue right",
  "Every maintenance obligation",
  "Every capital obligation",
  "Asset-level cash flow",
  "Event-level utilization",
  "Operator compliance",
  "Remaining useful life of major systems",
  "Land and development value",
  "The opportunity cost of every proposed capital commitment",
];

/* ------------------------------------------- §4: four kinds of money */

export interface EconomicsLayer {
  n: number;
  title: string;
  body: string;
}

export const FOUR_ECONOMICS: EconomicsLayer[] = [
  {
    n: 1,
    title: "Gross venue activity",
    body: "Tickets, concessions, hotels, restaurants, visitor spending: the big number that shows up in press releases. It measures the party, not who paid for the room.",
  },
  {
    n: 2,
    title: "Operator economics",
    body: "The cash actually captured by teams, promoters, concessionaires, and managers. This is where most of the money in a busy building goes.",
  },
  {
    n: 3,
    title: "Public-owner economics",
    body: "What the City itself receives or pays. A venue can fill every seat and still hand its owner a loss. This is the ledger Portland cannot currently produce building by building.",
  },
  {
    n: 4,
    title: "Regional economic & fiscal impact",
    body: "Incremental activity and tax revenue across the region. Real, but never a substitute for the owner's own books, and never to be mixed with them.",
  },
];

export interface PerformanceCondition {
  n: number;
  title: string;
  body: string;
  assets: string;
}

export const THREE_CONDITIONS: PerformanceCondition[] = [
  {
    n: 1,
    title: "Commercial underperformance",
    body: "An asset that should generate cash but fails to. The owner is entitled to insist on a fair return.",
    assets: "Moda Center and Providence Park live here: they should generate substantial commercial value for their owner.",
  },
  {
    n: 2,
    title: "Public-service subsidy",
    body: "An asset that knowingly provides benefits users cannot or should not fully finance. This is a purchase, not a failure. But it must be priced and named.",
    assets: "The Schnitzer is primarily this. Winningstad and Brunish may be, with a serious question attached.",
  },
  {
    n: 3,
    title: "Capital unsustainability",
    body: "A valuable operation inside a building whose future cost exceeds the value of preserving that exact physical configuration.",
    assets: "Keller is the rare pure case: a commercially productive venue in a physically unsustainable building. Hatfield Hall's capital range raises the same question.",
  },
];

/* -------------------------------------------- §5: Portland'5 FY24-25 */

export interface P5VenueRow {
  venue: string;
  events: number;
  attendance: number;
  revenue: number;
  recovery: string;
  recoveryTone: "good" | "warn" | "bad";
}

export const P5_UTILIZATION: P5VenueRow[] = [
  { venue: "Keller Auditorium", events: 179, attendance: 395_255, revenue: 10_734_000, recovery: "Essentially recovered from the pandemic", recoveryTone: "good" },
  { venue: "Arlene Schnitzer Concert Hall", events: 199, attendance: 294_058, revenue: 7_304_000, recovery: "Still below FY2019 attendance", recoveryTone: "warn" },
  { venue: "Newmark Theatre", events: 148, attendance: 85_424, revenue: 2_353_000, recovery: "Materially below FY2019", recoveryTone: "warn" },
  { venue: "Winningstad Theatre", events: 100, attendance: 13_805, revenue: 444_000, recovery: "Fallen particularly sharply", recoveryTone: "bad" },
  { venue: "Brunish Theatre", events: 67, attendance: 5_359, revenue: 109_000, recovery: "Small-scale community utility", recoveryTone: "warn" },
  { venue: "Lobby / other", events: 17, attendance: 4_446, revenue: 20_000, recovery: "—", recoveryTone: "warn" },
];

/* --------------------------------------------- §8.1: capital cliff */

export type ExposureKind = "committed" | "framework" | "range" | "unknown";

export interface CapitalExposure {
  id: string;
  label: string;
  kind: ExposureKind;
  low?: number;
  high?: number;
  split?: { label: string; amount: number }[];
  qualification: string;
  overlapsWith?: string[];
}

export const CAPITAL_EXPOSURES: CapitalExposure[] = [
  {
    id: "moda-framework",
    label: "Moda Center initial renovation framework",
    kind: "framework",
    high: 573_000_000,
    split: [
      { label: "State", amount: 365_000_000 },
      { label: "County", amount: 88_000_000 },
      { label: "City", amount: 120_000_000 },
    ],
    qualification: "Subject to definitive agreements; the term sheet is non-binding.",
  },
  {
    id: "moda-eligible",
    label: "Moda additional eligible projects (20 years)",
    kind: "range",
    low: 0,
    high: 288_600_000,
    qualification: "Up to $275M City-controlled venue resources plus $13.6M County. Some may be funded by venue-generated user fees rather than unrestricted City revenue.",
    overlapsWith: ["moda-framework"],
  },
  {
    id: "vmc",
    label: "Veterans Memorial Coliseum renovation",
    kind: "committed",
    high: 56_000_000,
    qualification: "Already substantially financed and underway: a done decision, not a prospective one.",
  },
  {
    id: "p5-near",
    label: "Portland'5 work, roughly 2026–30",
    kind: "range",
    low: 29_000_000,
    high: 54_500_000,
    qualification: "Combined indicative ranges for Keller, Schnitzer, and Hatfield Hall.",
    overlapsWith: ["p5-mid", "p5-all"],
  },
  {
    id: "p5-mid",
    label: "Portland'5 work through roughly 2035",
    kind: "range",
    low: 115_000_000,
    high: 214_000_000,
    qualification: "Not a funded plan; may exclude a comprehensive Keller solution.",
    overlapsWith: ["p5-near", "p5-all"],
  },
  {
    id: "p5-all",
    label: "Portland'5, all identified horizons",
    kind: "range",
    low: 180_000_000,
    high: 334_500_000,
    qualification: "Combines different building studies and planning horizons: the same buildings counted across windows.",
    overlapsWith: ["p5-near", "p5-mid"],
  },
  {
    id: "psu",
    label: "Proposed PSU performance venue",
    kind: "range",
    low: 447_000_000,
    high: 449_000_000,
    qualification: "A potential replacement strategy for Keller, not an additive entitlement. ($449M concept estimate; $447M in Resolution 2026-270 materials.)",
    overlapsWith: ["p5-mid", "p5-all"],
  },
  {
    id: "providence",
    label: "Providence Park",
    kind: "unknown",
    qualification: "No current comprehensive facility-condition exposure has been publicly reconciled.",
  },
  {
    id: "pir",
    label: "Portland International Raceway",
    kind: "unknown",
    qualification: "Known reserve concern; no complete public lifecycle plan located.",
  },
  {
    id: "pioneer-smaller",
    label: "Pioneer Square & smaller venues",
    kind: "unknown",
    qualification: "No consolidated portfolio-level condition and capital report exists.",
  },
];

export const DANGER_SCENARIO: string[] = [
  "Build a new PSU Broadway hall",
  "Retain Keller indefinitely as another large-scale performance hall",
  "Comprehensively rehabilitate all of Schnitzer and Hatfield Hall in place",
  "Complete the full Moda package and all additional eligible projects",
  "Absorb an unidentified Providence Park backlog",
  "Keep funding VMC, PIR, the garages, and smaller facilities with no dedicated lifecycle reserves",
];

export const DISCIPLINE_PRINCIPLES: string[] = [
  "Replacement rather than duplication",
  "Explicit subsidy rather than hidden cross-subsidy",
  "Private capital for private commercial upside",
  "Land value for district infrastructure",
  "Lifecycle preservation before optional enhancement",
];

/* ----------------------------------------------- §10.1: five gates */

export interface Gate {
  id: string;
  n: number;
  title: string;
  question: string;
  items: string[];
}

export const GATES: Gate[] = [
  {
    id: "necessity",
    n: 1,
    title: "Legal and structural necessity",
    question: "Is the project required for continued lawful, safe operation?",
    items: ["Life safety", "Seismic risk", "ADA compliance", "Code", "Water intrusion", "Insurance", "Critical structural integrity"],
  },
  {
    id: "ownership",
    n: 2,
    title: "Complete ownership economics",
    question: "Does the City know exactly who gets what, who pays what, and who eats the downside?",
    items: [
      "Who owns the improvement",
      "Who receives every revenue stream",
      "Who pays operating expense and maintenance",
      "Who pays overruns and bears demand risk",
      "What happens on default",
      "What the City receives if the asset appreciates",
    ],
  },
  {
    id: "portfolio",
    n: 3,
    title: "Portfolio consistency",
    question: "Does the proposal duplicate another publicly supported facility?",
    items: [
      "A new Broadway hall cannot be evaluated without Keller",
      "Moda improvements cannot be evaluated without VMC and Rose Quarter land",
      "Providence Park expansion cannot be evaluated without its lease and 2035 strategy",
    ],
  },
  {
    id: "lifecycle",
    n: 4,
    title: "Funded lifecycle plan",
    question: "A grand opening is not a capital plan.",
    items: [
      "30-year component replacement",
      "Inflation and operating expense",
      "Reserve funding and debt service",
      "A responsible party named for every future obligation",
    ],
  },
  {
    id: "downside",
    n: 5,
    title: "Independent downside case",
    question: "Does the project survive the bad year?",
    items: [
      "Construction inflation and a 15–20% overrun",
      "Lower attendance and recession",
      "Operator default and team sale",
      "Reduced parking, lower visitor taxes, delayed opening",
    ],
  },
];

export interface PriorityTier {
  title: string;
  tone: "good" | "warn" | "bad";
  items: string[];
}

export const PRIORITY_TIERS: PriorityTier[] = [
  {
    title: "High priority",
    tone: "good",
    items: [
      "Critical structural, accessibility, and water-intrusion work",
      "Completing already committed VMC construction",
      "Life-preserving work at Keller until replacement",
      "Urgent Schnitzer systems",
      "Providence Park work protecting a heavily used asset",
      "Asset-management data and condition assessments",
      "Investments unlocking Rose Quarter land value",
    ],
  },
  {
    title: "Conditional priority",
    tone: "warn",
    items: [
      "Moda renovation elements with private match and enforceable City return",
      "Revenue-producing Providence Park improvements",
      "Newmark modernization",
      "Rose Quarter public-realm work tied to development value",
      "PIR work supported by enterprise revenue",
    ],
  },
  {
    title: "Low priority unless redesigned",
    tone: "bad",
    items: [
      "Duplicative operation of two Broadway-scale halls",
      "Full replacement-in-kind of Hatfield Hall without consolidation analysis",
      "Premium upgrades whose returns accrue principally to private operators",
      "Garage reinvestment assuming indefinite parking demand, without a land-use analysis",
      "Projects justified primarily by gross regional economic-impact estimates",
    ],
  },
];

/* ------------------------------------------------ §11: four phases */

export interface PhaseWorkstream {
  heading: string;
  items: string[];
}

export interface StrategyPhase {
  id: string;
  n: string;
  dates: string;
  title: string;
  intro?: string;
  workstreams: PhaseWorkstream[];
}

export const PHASES: StrategyPhase[] = [
  {
    id: "phase-1",
    n: "I",
    dates: "Aug 2026 – Jun 2027",
    title: "Establish owner control",
    intro: "The most consequential twelve-month period in the portfolio's modern history.",
    workstreams: [
      {
        heading: "Moda Center: sign only a deal worth signing",
        items: [
          "Fixed and auditable City exposure",
          "Full private construction completion and overrun protection",
          "Enforceable non-relocation, successor and assignment protections",
          "Owner data and audit rights",
          "Public participation in major commercial upside",
          "A funded lifecycle system",
          "The December 31, 2026 target must not override deal quality",
        ],
      },
      {
        heading: "Portland'5 transition: a high-risk business migration, not a procurement",
        items: [
          "Select the successor operating structure",
          "Preserve booking continuity; map every union and workforce obligation",
          "Transfer or replace ticketing, concessions, insurance, finance, IT",
          "Reconcile event deposits and future bookings; inventory IP and customer data",
          "Establish opening working capital",
          "Create an independent City owner function, separate from the operator",
        ],
      },
      {
        heading: "The portfolio data room (by June 2027)",
        items: [
          "Legal asset register and parcel/ground-lease map",
          "Contract-rights matrix and debt ledger",
          "Asset-level historical cash flow and operator-revenue-rights matrix",
          "Component-level capital plan and current condition assessment for every major asset",
        ],
      },
      {
        heading: "Close the assessment gaps",
        items: [
          "Providence Park", "Rose Quarter garages and plaza", "Remaining VMC systems", "PIR", "Pioneer Courthouse Square", "The smaller community venues",
        ],
      },
    ],
  },
  {
    id: "phase-2",
    n: "II",
    dates: "Jul 2027 – Jun 2030",
    title: "Stabilize and redesign",
    workstreams: [
      {
        heading: "Portland'5 under City control",
        items: [
          "Separate building P&Ls; track paid attendance and scans",
          "Sponsorship and commercial-rights reform; measure dark days and lost bookings",
          "Implement urgent 2026–30 facility work",
          "Test whether Newmark can be physically and financially separated from lower-performing Hatfield functions",
          "Formal capital compacts with major resident organizations",
        ],
      },
      {
        heading: "Rose Quarter: a district master plan",
        items: [
          "Arenas, garages, City parcels, ground leases, plaza, transit, street connections",
          "Mixed-use development and Albina-related commitments",
          "No irreversible conveyance of development rights without public valuation and a portfolio-level plan",
        ],
      },
      {
        heading: "Providence Park: start the 2035 clock now",
        items: [
          "Complete the facility-condition assessment",
          "Determine annual City and operator obligations; value all commercial rights",
          "Model extension, rebid, and alternatives; build the lifecycle reserve before urgency arrives",
        ],
      },
      {
        heading: "PSU venue: proof before financing",
        items: [
          "Complete budget, committed capital stack, operator, labor plan",
          "Annual operating model, booking and resident-company agreements",
          "A replacement strategy for Keller and a binding limit on City operating exposure",
        ],
      },
    ],
  },
  {
    id: "phase-3",
    n: "III",
    dates: "Jul 2030 – Jun 2033",
    title: "Make the major physical choices",
    intro: "By now Portland should know what the PSU project really is, how the new operator performs, and what Moda and VMC improvements actually produced.",
    workstreams: [
      {
        heading: "Keller: choose",
        items: ["Closure and adaptive reuse after PSU opens", "Right-sized conversion", "Redevelopment partnership", "Selective preservation", "Continued operation only if PSU does not proceed"],
      },
      {
        heading: "Hatfield Hall: choose",
        items: ["Full preservation", "Newmark-focused modernization", "Physical consolidation", "Institutional partnership", "Partial replacement"],
      },
      {
        heading: "Schnitzer: commit to a phased plan",
        items: ["Historic value, acoustics, accessibility", "Resident-organization participation and philanthropy", "Measured public cultural outcomes"],
      },
      {
        heading: "Rose Quarter garages and land",
        items: ["Redevelopment or major renewal by highest long-term public value, not automatic preservation of current parking capacity"],
      },
    ],
  },
  {
    id: "phase-4",
    n: "IV",
    dates: "Jul 2033 – Jun 2036",
    title: "Renew, rebid, and rebalance",
    workstreams: [
      {
        heading: "The portfolio runs like a portfolio",
        items: [
          "Providence Park extension or competitive process",
          "Assess the new Portland'5 operating model's first years",
          "Moda performance review; VMC market-position review",
          "PIR long-term capital renewal; Pioneer Square agreement renewal",
          "Reassign capital based on measured results",
        ],
      },
      {
        heading: "The 2036 test",
        items: [
          "Portland should no longer possess an entertainment-venue portfolio whose economics have to be reconstructed through disconnected public records",
        ],
      },
    ],
  },
];

/* --------------------------------------- §12: ten kinds of capital */

export interface FinancingSource {
  id: string;
  n: string;
  name: string;
  bestFor: string[];
  advantages?: string[];
  risks: string[];
  guardrails?: string[];
}

export const FINANCING_SOURCES: FinancingSource[] = [
  {
    id: "private",
    n: "12.1",
    name: "Private operator and tenant capital",
    bestFor: ["Tenant-specific improvements", "Premium areas and team facilities", "Concessions, sponsorship-producing improvements, merchandising", "Operator technology"],
    risks: ["The public financing a revenue-producing improvement while the operator keeps all incremental revenue"],
  },
  {
    id: "fees",
    n: "12.2",
    name: "Ticket and facility user fees",
    bestFor: ["Lifecycle reserves", "Customer-facing facility renewal", "Debt tied directly to the venue"],
    advantages: ["Beneficiary-pays logic", "Direct connection to use", "Predictable collection"],
    risks: ["Cyclical attendance", "Affordability and price sensitivity", "The temptation to pledge decades of future fees to one asset"],
    guardrails: ["Every fee gets a published forecast: gross collections, exemptions, administration, debt pledge, capital use, and the effect on ticket prices"],
  },
  {
    id: "parking",
    n: "12.3",
    name: "Parking revenue",
    bestFor: ["Garage maintenance", "Transportation and district infrastructure", "Flexible portfolio reserves"],
    risks: ["Not an eternal growth stream: transit, rideshare, redevelopment, event patterns, and mobility policy can all change long-term demand"],
  },
  {
    id: "land",
    n: "12.4",
    name: "Ground leases, air rights, and development value",
    bestFor: ["Rose Quarter infrastructure", "Public-realm improvements", "Garage replacement or conversion", "Capital that unlocks land value"],
    advantages: ["Potentially Portland's most attractive source: it converts underused public real estate into durable value"],
    risks: ["Development rights quietly transferred below market inside a larger venue negotiation"],
    guardrails: [
      "Independent appraisal",
      "Competitive market testing unless clearly infeasible",
      "Minimum rent plus participation rent or appreciation sharing",
      "Development deadlines and reversion",
      "Public-realm standards and remedies for nonperformance",
    ],
  },
  {
    id: "commercial",
    n: "12.5",
    name: "Naming rights, sponsorship, advertising, premium revenue",
    bestFor: ["Commercial improvements", "Capital reserves"],
    risks: ["Letting an operator retain rights the City never valued"],
    guardrails: ["Inventory every right (buildings, plazas, entrances, concourses, clubs, garages, transit-facing signage, digital platforms, event series) before allowing anyone to keep them"],
  },
  {
    id: "visitor",
    n: "12.6",
    name: "Visitor and lodging taxes",
    bestFor: ["Assets and programs that demonstrably attract nonlocal visitors"],
    advantages: ["Regional beneficiary base", "Nexus to tourism", "Avoids routine General Fund dependence"],
    risks: ["Economic cyclicality", "Competition among Convention Center, Expo, Travel Portland, arts, and sports", "Treating tourism projections as guaranteed revenue"],
    guardrails: ["Publish one unified visitor-facilities forecast showing every claim on these revenues under base, recession, and severe-downside cases"],
  },
  {
    id: "regional",
    n: "12.7",
    name: "State and County funding",
    bestFor: ["Facilities whose benefits and tax receipts extend beyond Portland: Moda, Providence Park, major performing-arts venues"],
    risks: ["Treating regional facilities as solely municipal obligations"],
    guardrails: ["Regional contribution proportional to geographic attendance, tax benefit, economic exposure, governance, and share of control or public return"],
  },
  {
    id: "philanthropy",
    n: "12.8",
    name: "Philanthropy",
    bestFor: ["Cultural capital", "Donor-visible public spaces", "Accessibility, education, historic preservation", "Programming endowments"],
    risks: ["Donors fund lobbies before they fund chillers, roofs, insurance, and backstage labor. The public model must survive after the campaign ends"],
  },
  {
    id: "debt",
    n: "12.9",
    name: "Debt",
    bestFor: ["Projects matched to durable repayment capacity or an explicit public obligation"],
    risks: ["Backloaded balloon structures that hide present cost", "Uncapped public overrun exposure"],
    guardrails: [
      "Downside debt-service coverage of at least 1.5×",
      "Construction contingency of at least 15–20% for complex renovations",
      "No uncapped public overrun exposure; no balloon structures",
      "Reserve requirements and full present-value disclosure",
      "Sensitivity tests for attendance, parking, visitor-tax, interest-rate, and construction risk",
    ],
  },
  {
    id: "general",
    n: "12.10",
    name: "General Fund: the final source, never the automatic one",
    bestFor: ["Life safety and legal accessibility", "Essential public cultural service", "Civic public space", "Broad citywide benefits that cannot fairly be charged to users"],
    risks: ["Becoming the residual payer for private commercial enhancements, avoidable overruns, operator underinvestment, or deals where the public absorbs downside while private parties keep upside"],
  },
];

/* ------------------------------------------ §13: the owner function */

export const TEAM_ROLES: { role: string; charge: string }[] = [
  { role: "Portfolio director", charge: "Accountable executive and Council liaison" },
  { role: "Chief venue financial officer", charge: "Consolidated model, debt, reserves, operator statements" },
  { role: "Moda / VMC / Rose Quarter asset manager", charge: "The arena complex and its land" },
  { role: "Providence Park / PIR asset manager", charge: "Stadium and raceway enterprises" },
  { role: "Performing-arts asset manager", charge: "The Portland'5 buildings" },
  { role: "Capital and facilities director", charge: "Condition, components, reserves, delivery" },
  { role: "Commercial rights and real-estate director", charge: "Every right, valued before it's given away" },
  { role: "Data and performance analyst", charge: "The event ledger and the KPIs" },
  { role: "Public access and cultural-outcomes lead", charge: "What the subsidy buys" },
  { role: "Contract administration / program support", charge: "Compliance and enforcement" },
];

export const NOT_INTERNALIZED: string[] = [
  "Concert booking",
  "Concession operations",
  "Event production",
  "Box-office technology",
  "Touring relationships",
  "Sports operations",
];

export const P5_OPERATING_MODEL: string[] = [
  "One integrated operator for shared systems and labor",
  "Venue-level financial reporting",
  "Specialized programming or resident-organization agreements",
  "Fixed management fee plus carefully designed performance incentives",
  "City ownership of customer and performance data",
  "Open-book accounting",
  "Clear separation between operator incentives and public subsidy",
];

export const FRAGMENTATION_COSTS: string[] = [
  "Ticketing", "Security", "Stage labor", "Finance", "Concessions", "Customer data", "Booking coordination", "Management overhead",
];

export const OPERATOR_INCENTIVES: string[] = [
  "Owner net cash",
  "Attendance and paid occupancy",
  "Event diversity",
  "Nonprofit and community access",
  "Customer experience",
  "Preventive maintenance",
  "Capital-project delivery",
  "Workforce stability",
  "Accessibility",
  "Energy efficiency",
  "Compliance with reporting deadlines",
];

/* -------------------------------------- §14–16: the owner's system */

export interface Ledger {
  name: string;
  holds: string;
  fields: string[];
}

export const LEDGERS: Ledger[] = [
  {
    name: "Asset register",
    holds: "One row per building, venue, parcel, garage, or plaza",
    fields: ["Asset ID, address, parcel", "Legal ownership; assessed, appraised, and replacement values", "Operator, lease term, options, ground leases", "Revenue rights, maintenance and capital obligations", "Debt, insurance, development rights, disposition restrictions"],
  },
  {
    name: "Event ledger",
    holds: "One row per event, plus holds, lost bookings, cancellations, dark days, rehearsals, conflicts",
    fields: ["Venue, configuration, promoter, event type, classification", "Capacity, paid tickets, scans, comps, no-shows", "Gross ticket sales, City fees, rent, parking, concessions", "Incremental public-safety cost, labor, utilities", "Owner net contribution"],
  },
  {
    name: "Operating ledger",
    holds: "By asset and month",
    fields: ["Earned revenue and public subsidy", "Rent, user fees, parking, sponsorship, concessions", "Utilities, insurance, security, cleaning, repairs", "Operator payments and central overhead, allocated by a disclosed formula", "Net owner cash"],
  },
  {
    name: "Capital ledger",
    holds: "One row per building component",
    fields: ["System, installation date, expected and remaining life", "Condition, replacement cost, urgency, failure consequence", "Project status, funding source, responsible party", "Producing: facility-condition index, backlog ÷ replacement value, 5/10/30-year needs, required annual reserve"],
  },
  {
    name: "Public-value ledger",
    holds: "For cultural and civic venues",
    fields: ["Free events, discounted admissions, nonprofit share", "Local artists, school participation, geographic origin", "ADA access, community partnerships, culturally specific programming", "Subsidy per public-purpose attendance"],
  },
];

export const PORTFOLIO_KPIS: string[] = [
  "Owner net cash per event",
  "Public subsidy per attendee",
  "Revenue per available seat",
  "Paid occupancy",
  "Scanned-to-sold ratio",
  "Event-day and dark-day utilization",
  "Private dollars per public capital dollar",
  "Capital backlog ÷ replacement value",
  "Preventive-maintenance completion",
  "Energy per attendee",
  "Customer satisfaction",
  "Share of commercial rights retained by the public",
  "Share of projected capital need backed by an identified source",
];

export const DATA_TABLES: { table: string; row: string }[] = [
  { table: "assets", row: "One row per building, venue, parcel, garage, plaza, or capital asset" },
  { table: "contracts", row: "One row per agreement, amendment, side letter, guarantee, or lease, with structured rights" },
  { table: "events", row: "One row per performance, game, rental, rehearsal, or activation" },
  { table: "cash_flows", row: "One row per transaction, linked to asset, event, operator, contract, period, and funding source" },
  { table: "capital_components", row: "One row per roof, chiller, structural element, seating system, or accessibility element" },
  { table: "debt_and_subsidies", row: "One row per bond, tax source, contribution, exemption, guarantee, or contingent commitment" },
  { table: "operators_and_entities", row: "One row per team, operator, promoter, resident organization, or contractor" },
];

export const ANSWERABLE_QUESTIONS: string[] = [
  "Which events create the largest owner cash contribution?",
  "Which venues receive the most subsidy per attendee?",
  "What capital liability rides on each dollar of annual revenue?",
  "Which operators meet their maintenance obligations?",
  "What share of every commercial revenue stream does the City retain?",
  "Which asset produces the best public value per incremental capital dollar?",
  "What happens to the portfolio in a recession or a closure?",
  "How much capacity is truly redundant?",
];

export const RECORDS_PLAN: { group: string; items: string }[] = [
  { group: "Financial records (10 fiscal years)", items: "General-ledger and revenue transactions, journal entries, transfers, encumbrances, purchase orders, project and grant codes, cost-center mappings, overhead allocations (as CSV or native exports, not image PDFs)" },
  { group: "Operator reporting", items: "Monthly statements, annual financials, event settlements, management-fee calculations, compliance reports, budgets, capital reports, and every underlying schedule delivered to the City" },
  { group: "Contracts and rights", items: "Originals, amendments, side letters, waivers, MOUs, assignment consents, concession/ticketing/resident-company/sponsorship/parking agreements, ground leases, guarantees, and default notices, plus a structured rights matrix per contract" },
  { group: "Event and attendance data", items: "Event-level: title, category, dates, configuration, sellable capacity, sold, scans, comps, gross revenue, cancellations, holds, lost bookings, load-in/out, rehearsals, private events, promoter" },
  { group: "Parking and transportation", items: "Garage transactions, rate schedules, occupancy by event, validations, operator fees, non-event revenue, maintenance, structural assessments, long-range parking assumptions" },
  { group: "Capital and maintenance", items: "Facility-condition assessments, component inventories, CMMS exports, work orders, preventive schedules, inspections, seismic studies, ADA transition plans, utility audits, change orders, claims, closeouts, warranties" },
  { group: "Debt and public support", items: "Debt schedules, official statements, coverage calculations, reserves, pledged revenue, tax allocations, visitor-facility distributions, General Fund transfers, exemptions, land contributions, and guarantees, each converted to nominal and present value" },
  { group: "Property and real estate", items: "Title reports, parcel maps, appraisals, environmental assessments, ground leases, easements, development-rights agreements, air-rights studies, highest-and-best-use analyses" },
  { group: "Workforce (aggregate)", items: "Positions, classifications, vacancies, compensation, union, overtime, event and temporary labor, transition obligations (organizational analysis, not personal detail)" },
  { group: "Recipients", items: "Spectator Venues, Arts & Culture, Parks, City Budget Office, Finance, City Attorney, real-estate/facilities functions, and Metro/MERC, each asked to identify responsive data held by contractors, not just on City servers" },
];

/* -------------------------------------------- §18–19: the verdict */

export const VERDICT: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: "The City is not accounting like an owner",
    body: "A city that cannot readily produce venue-by-venue income statements, complete rights inventories, or component-level capital forecasts is not equipped to allocate hundreds of millions of dollars optimally.",
  },
  {
    n: 2,
    title: "Capital decisions are driven by lease cliffs and political urgency",
    body: "VMC, Moda, Keller/PSU, the Portland'5 transition, and Providence Park run through separate processes. That rewards whichever asset has the most urgent deadline, the most powerful operator, the strongest relocation narrative, the most organized constituency, or the most developed funding proposal, not necessarily the highest public return.",
  },
  {
    n: 3,
    title: "Commercial and cultural assets are judged through incompatible narratives",
    body: "Commercial proponents cite economic impact without sufficient owner economics. Cultural advocates cite public value without a disciplined capital plan. A mature strategy demands both: commercial assets prove public financial return and risk transfer; cultural assets prove measured outcomes and affordable lifecycle plans.",
  },
  {
    n: 4,
    title: "The real financing challenge is portfolio sequencing",
    body: "Portland may be able to finance Moda. It may be able to finance a PSU hall, preserve the Schnitzer and Newmark, renew Providence Park, and develop the Rose Quarter. Whether it can do all of them on their current trajectories, while maintaining basic public assets, has not been demonstrated.",
  },
];

export const DOCTRINE_SENTENCE =
  "One owner strategy, multiple specialized operators, common data, explicit subsidy, funded lifecycle reserves, and portfolio-wide capital allocation.";

export const DOCTRINE_POINTS: string[] = [
  "One owner strategy across all venues",
  "Multiple specialized operators",
  "Asset-level financial and capital accounting",
  "Explicit separation of commercial return from public-service subsidy",
  "Replacement instead of duplicative expansion",
  "Private funding wherever private upside is created",
  "Public funding where public goods are genuinely being purchased",
  "Land and commercial-rights monetization before broad taxes",
  "Lifecycle reserves before discretionary enhancement",
  "A transparent ranking of every proposed capital dollar",
];

export const ANNUAL_QUESTION =
  "Given the next dollar available, which investment in this portfolio produces the greatest durable public benefit, after accounting for risk, capital cost, operating subsidy, commercial return, cultural value, and the alternatives that dollar displaces?";
