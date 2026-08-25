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
  "Each building's cash flow",
  "Attendance, event by event",
  "Whether operators hold up their end",
  "How long the major systems have left",
  "Land and development value",
  "What else the money could do, for every project proposed",
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
    title: "It should make money, and doesn't",
    body: "This venue exists to earn. If it isn't earning enough for the public that owns it, the answer is to negotiate like an owner and insist on a fair deal.",
    assets: "Moda Center and Providence Park. Both should be making real money for their owner.",
  },
  {
    n: 2,
    title: "We're paying for it on purpose",
    body: "The city is buying something tickets alone can't pay for: symphonies, school shows, community stages. That's a purchase, not a failure. But we should say what it costs and what we get.",
    assets: "The Schnitzer, on purpose. Winningstad and Brunish maybe, though nobody has ever said what that subsidy buys.",
  },
  {
    n: 3,
    title: "Good venue, failing building",
    body: "The shows are strong; the structure is the problem. Keeping this exact building standing will eventually cost more than it's worth. The operation deserves a future. The building may not.",
    assets: "Keller is the textbook case: a moneymaker inside a building that's wearing out. Hatfield Hall may be next.",
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
    qualification: "Nothing is signed yet; the term sheet is non-binding.",
  },
  {
    id: "moda-eligible",
    label: "Moda additional eligible projects (20 years)",
    kind: "range",
    low: 0,
    high: 288_600_000,
    qualification: "Up to $275M in venue money the City controls, plus $13.6M from the County. Some of it may be paid by ticket and user fees rather than money the City could spend on anything.",
    overlapsWith: ["moda-framework"],
  },
  {
    id: "vmc",
    label: "Veterans Memorial Coliseum renovation",
    kind: "committed",
    high: 56_000_000,
    qualification: "Mostly paid for and already under construction: a decision already made, not one still ahead.",
  },
  {
    id: "p5-near",
    label: "Portland'5 work, roughly 2026–30",
    kind: "range",
    low: 29_000_000,
    high: 54_500_000,
    qualification: "Rough combined estimates for Keller, Schnitzer, and Hatfield Hall.",
    overlapsWith: ["p5-mid", "p5-all"],
  },
  {
    id: "p5-mid",
    label: "Portland'5 work through roughly 2035",
    kind: "range",
    low: 115_000_000,
    high: 214_000_000,
    qualification: "No money is attached to this yet, and it may not cover a full fix for Keller.",
    overlapsWith: ["p5-near", "p5-all"],
  },
  {
    id: "p5-all",
    label: "Portland'5, all identified horizons",
    kind: "range",
    low: 180_000_000,
    high: 334_500_000,
    qualification: "Adds up studies that cover different spans of years: the same buildings counted more than once.",
    overlapsWith: ["p5-near", "p5-mid"],
  },
  {
    id: "psu",
    label: "Proposed PSU performance venue",
    kind: "range",
    low: 447_000_000,
    high: 449_000_000,
    qualification: "This would replace Keller, not add to it; never stack the two costs. ($449M concept estimate; $447M in Resolution 2026-270 materials.)",
    overlapsWith: ["p5-mid", "p5-all"],
  },
  {
    id: "providence",
    label: "Providence Park",
    kind: "unknown",
    qualification: "No one has published a full tally of what repairs this building needs.",
  },
  {
    id: "pir",
    label: "Portland International Raceway",
    kind: "unknown",
    qualification: "The reserves are known to be thin; we found no published long-term repair plan.",
  },
  {
    id: "pioneer-smaller",
    label: "Pioneer Square & smaller venues",
    kind: "unknown",
    qualification: "No single report covers what these venues need or what it would cost.",
  },
];

export const DANGER_SCENARIO: string[] = [
  "Build a new PSU Broadway hall",
  "Keep Keller running forever as a second big performance hall",
  "Fully rehab both the Schnitzer and Hatfield Hall right where they stand",
  "Complete the full Moda package and all additional eligible projects",
  "Swallow a Providence Park repair bill nobody has counted",
  "Keep funding VMC, PIR, the garages, and the smaller venues with nothing saved for their repairs",
];

export const DISCIPLINE_PRINCIPLES: string[] = [
  "Replace buildings; don't duplicate them",
  "Subsidize in the open, not through hidden cross-subsidy",
  "Private money pays for private profit",
  "Land value pays for district infrastructure",
  "Fix what we have before buying nice-to-haves",
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
    title: "Do we have to?",
    question: "Is this required to keep the building safe, accessible, and legal to operate?",
    items: ["Life safety", "Seismic risk", "ADA compliance", "Code", "Water intrusion", "Insurance", "Critical structural integrity"],
  },
  {
    id: "ownership",
    n: 2,
    title: "Who gets what?",
    question: "Before a dollar moves, do we know who earns, who pays, who covers overruns, and who eats the downside?",
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
    title: "Do we already own one?",
    question: "Would this duplicate another building the public already pays for?",
    items: [
      "A new Broadway hall cannot be evaluated without Keller",
      "Moda improvements cannot be evaluated without VMC and Rose Quarter land",
      "Providence Park expansion cannot be evaluated without its lease and 2035 strategy",
    ],
  },
  {
    id: "lifecycle",
    n: 4,
    title: "Can we keep it up?",
    question: "A grand opening is not a capital plan: who pays for the next thirty years of upkeep?",
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
    title: "What if it goes badly?",
    question: "Does it still work in a recession, with a cost overrun, in a bad year at the box office?",
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
      "Critical structural repairs, accessibility work, and stopping leaks",
      "Finishing the VMC work already paid for and underway",
      "Keeping Keller alive until its replacement opens",
      "Urgent Schnitzer system repairs",
      "Providence Park repairs that protect a heavily used stadium",
      "Basic records of what we own and what condition it's in",
      "Work that makes the Rose Quarter land worth building on",
    ],
  },
  {
    title: "Conditional priority",
    tone: "warn",
    items: [
      "Moda renovation pieces where private money matches ours and the City's return is in writing",
      "Providence Park improvements that earn money",
      "Newmark modernization",
      "Rose Quarter streets and plazas, where they raise the land's value",
      "PIR work the raceway's own revenue can pay for",
    ],
  },
  {
    title: "Low priority unless redesigned",
    tone: "bad",
    items: [
      "Running two Broadway-size halls that do the same job",
      "Rebuilding Hatfield Hall as-is without first asking whether to consolidate",
      "Premium upgrades whose profits mostly flow to private operators",
      "Garage spending that bets parking demand lasts forever, without studying other uses for the land",
      "Projects sold mainly on big regional economic-impact numbers",
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
          "A fixed City cost, open to audit",
          "The private side finishes construction and eats any overruns",
          "Binding promises that the team stays, and that they survive a sale",
          "Owner data and audit rights",
          "The public shares in the big commercial wins",
          "Funded reserves for future repairs",
          "The December 31, 2026 target must not override deal quality",
        ],
      },
      {
        heading: "Portland'5 handoff: moving a whole business, not signing a contract",
        items: [
          "Choose who runs the theaters next, and how",
          "Keep the shows booked; map every union and staffing obligation",
          "Transfer or replace ticketing, concessions, insurance, finance, IT",
          "Square up event deposits and future bookings; list the intellectual property and customer data",
          "Have cash in the bank on day one",
          "Stand up the City's own owner team, separate from the operator",
        ],
      },
      {
        heading: "One complete file on everything we own (by June 2027)",
        items: [
          "The legal asset register and a map of every parcel and ground lease",
          "A table of every contract right, plus a debt ledger",
          "Each building's cash-flow history, and who keeps which revenue stream",
          "A repair plan and a current condition assessment for every major building, component by component",
        ],
      },
      {
        heading: "Fill the inspection gaps",
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
          "Separate profit and loss for each building; track paid attendance and scans",
          "Sponsorship and commercial-rights reform; measure dark days and lost bookings",
          "Do the urgent 2026–30 building repairs",
          "Test whether the Newmark can be split off, physically and financially, from the weaker parts of Hatfield Hall",
          "Written agreements on capital costs with the major resident companies",
        ],
      },
      {
        heading: "Rose Quarter: a district master plan",
        items: [
          "Arenas, garages, City parcels, ground leases, plaza, transit, street connections",
          "Mixed-use development and Albina-related commitments",
          "Don't give away development rights for good until the public knows what the land is worth and how it fits the whole portfolio",
        ],
      },
      {
        heading: "Providence Park: start the 2035 clock now",
        items: [
          "Complete the facility-condition assessment",
          "Pin down what the City and the operator each owe every year; put a value on every commercial right",
          "Price out extending, rebidding, and the alternatives; start saving for repairs before the deadline forces it",
        ],
      },
      {
        heading: "PSU venue: proof before financing",
        items: [
          "A complete budget, money actually committed, an operator, a labor plan",
          "A yearly operating budget, plus booking and resident-company agreements",
          "A plan for what replaces Keller, and a hard cap on what the City pays to operate it",
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
        items: ["Close it and give the building a new use once PSU opens", "Shrink it into a smaller hall", "Redevelopment partnership", "Keep only the parts worth keeping", "Keep operating it only if PSU falls through"],
      },
      {
        heading: "Hatfield Hall: choose",
        items: ["Full preservation", "Newmark-focused modernization", "Physical consolidation", "Institutional partnership", "Partial replacement"],
      },
      {
        heading: "Schnitzer: commit to a phased plan",
        items: ["Historic value, acoustics, accessibility", "Resident companies chip in, and donors help", "Cultural benefits we actually measure"],
      },
      {
        heading: "Rose Quarter garages and land",
        items: ["Redevelop or rebuild based on what serves the public most in the long run, not on keeping every parking space by default"],
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
          "Extend Providence Park's deal, or put it out to bid",
          "Judge the new Portland'5 setup on its first years",
          "Review how Moda performed; review where VMC stands in the market",
          "PIR long-term capital renewal; Pioneer Square agreement renewal",
          "Shift money toward what measurably works",
        ],
      },
      {
        heading: "The 2036 test",
        items: [
          "Portland should no longer own a venue portfolio whose finances have to be pieced together from scattered public records",
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
    bestFor: ["Improvements a tenant wants for itself", "Premium areas and team facilities", "Concessions, merchandising, and upgrades that sell sponsorships", "Operator technology"],
    risks: ["The public pays for an upgrade that makes money, and the operator keeps every new dollar"],
  },
  {
    id: "fees",
    n: "12.2",
    name: "Ticket and facility user fees",
    bestFor: ["Savings for future repairs", "Fixing up what customers see and touch", "Debt tied directly to the venue"],
    advantages: ["The people who use it pay for it", "Direct connection to use", "Predictable collection"],
    risks: ["Attendance rises and falls", "Higher fees price people out", "The temptation to pledge decades of future fees to one building"],
    guardrails: ["Every fee gets a published forecast: gross collections, exemptions, administration, debt pledge, capital use, and the effect on ticket prices"],
  },
  {
    id: "parking",
    n: "12.3",
    name: "Parking revenue",
    bestFor: ["Garage maintenance", "Transportation and district infrastructure", "Flexible portfolio reserves"],
    risks: ["Parking money won't grow forever: transit, rideshare, redevelopment, event patterns, and city transportation choices can all shrink demand"],
  },
  {
    id: "land",
    n: "12.4",
    name: "Ground leases, air rights, and development value",
    bestFor: ["Rose Quarter infrastructure", "Streets, plazas, and public spaces", "Garage replacement or conversion", "Capital that unlocks land value"],
    advantages: ["Potentially Portland's best source: it turns underused public land into lasting value"],
    risks: ["Development rights quietly handed over for less than they're worth, buried inside a bigger venue deal"],
    guardrails: [
      "Independent appraisal",
      "Put it out to the market unless that clearly can't work",
      "A guaranteed minimum rent, plus a share of profits or rising value",
      "Build-by deadlines, or the land comes back",
      "Standards for the public spaces, with penalties if they're not met",
    ],
  },
  {
    id: "commercial",
    n: "12.5",
    name: "Naming rights, sponsorship, advertising, premium revenue",
    bestFor: ["Commercial improvements", "Capital reserves"],
    risks: ["Letting an operator retain rights the City never valued"],
    guardrails: ["List every right (buildings, plazas, entrances, concourses, clubs, garages, transit-facing signage, digital platforms, event series) before letting anyone keep them"],
  },
  {
    id: "visitor",
    n: "12.6",
    name: "Visitor and lodging taxes",
    bestFor: ["Venues and programs that provably draw visitors from out of town"],
    advantages: ["Benefits reach the whole region", "Tied directly to tourism", "Doesn't lean on the General Fund"],
    risks: ["Falls in every downturn", "Competition among Convention Center, Expo, Travel Portland, arts, and sports", "Treating tourism projections as guaranteed revenue"],
    guardrails: ["Publish one forecast for all visitor-tax money showing every claim on it in a normal year, a recession, and a worst case"],
  },
  {
    id: "regional",
    n: "12.7",
    name: "State and County funding",
    bestFor: ["Facilities whose benefits and tax receipts extend beyond Portland: Moda, Providence Park, major performing-arts venues"],
    risks: ["Making Portland pay alone for buildings the whole region uses"],
    guardrails: ["Each government pays in proportion to who attends, who gains the tax revenue, who bears the risk, and who holds control and return"],
  },
  {
    id: "philanthropy",
    n: "12.8",
    name: "Philanthropy",
    bestFor: ["Capital projects for the arts", "Public spaces a donor can put a name on", "Accessibility, education, historic preservation", "Programming endowments"],
    risks: ["Donors fund lobbies before they fund chillers, roofs, insurance, and backstage labor. The finances still have to work after the campaign ends"],
  },
  {
    id: "debt",
    n: "12.9",
    name: "Debt",
    bestFor: ["Projects with a reliable way to pay the loan back, or a public duty we've named out loud"],
    risks: ["Payment plans that start small and balloon later, hiding the real cost", "No limit on what overruns cost the public"],
    guardrails: [
      "Even in a bad year, income at least 1.5× the debt payment",
      "Construction contingency of at least 15–20% for complex renovations",
      "No blank check for overruns; no balloon payment schedules",
      "Required reserves, and the full cost disclosed in today's dollars",
      "Stress-test the numbers for attendance, parking, visitor taxes, interest rates, and construction costs",
    ],
  },
  {
    id: "general",
    n: "12.10",
    name: "General Fund: the final source, never the automatic one",
    bestFor: ["Life safety and legal accessibility", "Essential public cultural service", "Civic public space", "Broad citywide benefits that cannot fairly be charged to users"],
    risks: ["Becoming the payer of last resort for private upgrades, avoidable overruns, operators who skimp on upkeep, or deals where the public eats the losses while private parties keep the profits"],
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
    fields: ["Venue, configuration, promoter, event type, classification", "Capacity, paid tickets, scans, comps, no-shows", "Gross ticket sales, City fees, rent, parking, concessions", "Extra public-safety, labor, and utility costs", "Owner net contribution"],
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
    body: "A city that cannot produce an income statement for each venue, a list of the rights it has kept or given away, or a forecast of what each building will need is in no position to spend hundreds of millions of dollars well.",
  },
  {
    n: 2,
    title: "Capital decisions are driven by lease cliffs and political urgency",
    body: "VMC, Moda, Keller/PSU, the Portland'5 transition, and Providence Park run through separate processes. That rewards whichever asset has the most urgent deadline, the most powerful operator, the strongest relocation narrative, the most organized constituency, or the most developed funding proposal, not necessarily the highest public return.",
  },
  {
    n: 3,
    title: "Commercial and cultural assets are judged through incompatible narratives",
    body: "Boosters of the commercial venues cite economic impact and skip what the owner actually earns. Advocates for the cultural venues cite public value and skip the hard capital plan. A mature strategy demands both: the moneymakers must show a real public return with risk moved off the City, and the cultural venues must show measured benefits and a repair plan they can afford.",
  },
  {
    n: 4,
    title: "The real financing challenge is portfolio sequencing",
    body: "Portland may be able to finance Moda. It may be able to finance a PSU hall, preserve the Schnitzer and Newmark, renew Providence Park, and develop the Rose Quarter. Whether it can do all of them on their current paths, while keeping basic public assets in repair, has never been shown.",
  },
];

export const DOCTRINE_SENTENCE =
  "Act like one owner, let specialists run the shows, keep one set of books, subsidize on purpose and in the open, save for repairs before they come due, and make every project compete for the same public dollar.";

export const DOCTRINE_POINTS: string[] = [
  "Run every venue as one collection, with one strategy",
  "Let specialists keep running the shows",
  "Keep a real set of books for every building: what it earns, what it costs, what it needs",
  "Never blur the venues that should make money with the ones we support on purpose",
  "When we build new, we replace the old; we don't pay for two of the same thing",
  "If a project mostly profits a private operator, private money pays for it",
  "Public money buys public benefits, and we name the benefit we're buying",
  "Before raising taxes, get fair value from the land, parking, and naming rights we already own",
  "Fund the roof and the boiler before the nice-to-haves",
  "Rank every proposed project in public, so everyone can see what beat what",
];

export const ANNUAL_QUESTION_SHORT =
  "Where does the next public dollar do the most lasting good?";

export const ANNUAL_QUESTION =
  "Of everything we could do with the next public dollar, which choice gives Portlanders the most lasting benefit, once you count the risk, the upkeep, the subsidy it will need, the money it can earn, its cultural value, and everything else that dollar could have done instead?";
