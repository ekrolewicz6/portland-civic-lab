/**
 * Asset-by-asset analysis (§7, §9.1, §17 of the source analysis).
 * Grades and directives are Portland Civic Lab analysis (`pclAnalysis`).
 * `liveSlug` links an asset to its live record in the CED initiative
 * registry, rendered by <LiveStatus/>.
 */

import type { SourceId } from "./data";

export interface AssetGrade {
  label: string;
  value: string;
  tone: "good" | "warn" | "bad" | "na";
}

export interface SubVenue {
  name: string;
  body: string;
}

export interface VenueAsset {
  id: string;
  name: string;
  kicker: string;
  /** Narrative role: the story of what this asset is. */
  role: string;
  strengths: string[];
  risks: string[];
  grades: AssetGrade[];
  /** §17 directive. */
  directive: { headline: string; detail: string };
  subVenues?: SubVenue[];
  keyQuestion?: string;
  liveSlug?: string;
  sourceIds?: SourceId[];
}

export const ASSETS: VenueAsset[] = [
  {
    id: "moda",
    name: "Moda Center",
    kicker: "The flagship, bought for a dollar",
    role: "Paul Allen opened it in October 1995 as the Rose Garden: $262 million, of which the City put in $34.5 million and Allen and his lenders carried the rest. The financing didn't survive: Allen's Oregon Arena Corporation went bankrupt in 2004, creditors took the building, Allen bought it back in 2007, and Moda Health's name went up in 2013. Then, in 2024, the whole arc ended in a single line item: the arena transferred to the City of Portland for one dollar. The dollar bought roughly 1.5 million annual visitors, a major-league anchor tenant, and enormous strategic control. It also bought the largest capital question the City has ever faced in this portfolio.",
    strengths: [
      "≈1.5 million annual visitors",
      "Major-league anchor tenant",
      "Strong concert and event market",
      "Valuable surrounding real estate",
      "A major parking and ticket-fee ecosystem",
    ],
    risks: [
      "An aging 1995 building with a very large identified renovation need",
      "A private operator controlling important economics",
      "A complex division of revenue and capital obligations",
      "Public financing that can drift loose of public return",
      "Rose Quarter land and development rights undervalued inside a broader arena negotiation",
    ],
    grades: [
      { label: "Demand", value: "A", tone: "good" },
      { label: "Strategic importance", value: "A", tone: "good" },
      { label: "Owner economics", value: "Incomplete", tone: "na" },
      { label: "Capital risk", value: "Very high", tone: "bad" },
    ],
    directive: {
      headline: "Proceed only conditionally.",
      detail: "Preserve the NBA, modernize the arena, use dedicated venue resources, but only with a hard exposure cap, private completion and overrun protection, owner data and audit rights, meaningful public upside, and no hidden conveyance of development rights.",
    },
    keyQuestion: "Not whether the building has users, but whether the public owner captures enough value and transfers enough risk under its contracts.",
    liveSlug: "moda-center-renovation-blazers-lease",
    sourceIds: ["wikiModa", "wikiRoseGardenBk", "pdxModaCenter", "svAnnualReport", "modaTermSheetOpb", "pclAnalysis"],
  },
  {
    id: "vmc",
    name: "Veterans Memorial Coliseum",
    kicker: "The complement, not the copy",
    role: "Skidmore, Owings & Merrill finished it in 1960: a gray glass-and-aluminum curtain wall around a free-floating concrete bowl, the roof carried on four seventy-foot piers. Portlanders called it the Glass Palace, and in 1961 the city dedicated it to veterans who made the supreme sacrifice. It has survived a demolition proposal (2009), earned a National Register listing the same year, and become the National Trust's first Portland National Treasure (2016). Its strategic value is highest when it is treated as complementary to Moda, not as a smaller copy of it. The renovation is financed and underway; what comes next should be decided by evidence, not by another rendering.",
    strengths: [
      "Credible demand despite years of partial closure",
      "A genuine mid-size niche Moda cannot serve",
      "Renovation already substantially financed",
    ],
    risks: [
      "Remaining capital backlog beyond the current work",
      "The temptation to follow this renovation with another aspirational one",
    ],
    grades: [
      { label: "Demand", value: "Credible", tone: "good" },
      { label: "Owner economics", value: "Incomplete", tone: "na" },
      { label: "Condition", value: "Improving", tone: "warn" },
    ],
    directive: {
      headline: "Complete the current work. Maximize the complementary role.",
      detail: "After reopening, measure: event mix, attendance, owner contribution, displaced-versus-incremental Moda events, maintenance, remaining backlog. The next decision should rest on observed post-renovation performance, not on a concept.",
    },
    sourceIds: ["wikiVmc", "ntVmc", "svAnnualReport", "pclAnalysis"],
  },
  {
    id: "rose-quarter-land",
    name: "Rose Quarter land, garages & development rights",
    kicker: "The most underappreciated asset in the portfolio",
    role: "The Rose Quarter is not two arenas. It is a public real-estate platform beside high-capacity transit: parcels, garages, plazas, air rights, reversion clauses. And it sits on ground with a memory. This is lower Albina: in 1956 voters approved the Coliseum's construction, and building it destroyed 476 homes, roughly half of them inhabited by Black families, the first of the clearance waves that I-5 and the Emanuel Hospital expansion would continue. Land like this is exactly what gets quietly undervalued inside an arena negotiation, one schedule-B exhibit at a time. It is also exactly where the district's future carries obligations older than any lease.",
    strengths: [
      "Strong event-linked demand",
      "Material cash flow and major option value",
      "Adjacency to transit and the central city",
    ],
    risks: [
      "Development rights disposed of without independent valuation",
      "Garage reinvestment that assumes parking demand is eternal",
      "Arenas remaining islands in parking infrastructure instead of anchors of a district",
    ],
    grades: [
      { label: "Demand", value: "Strong", tone: "good" },
      { label: "Owner economics", value: "Cash + option value", tone: "good" },
      { label: "Condition & highest use", value: "Needs analysis", tone: "warn" },
    ],
    directive: {
      headline: "Make district strategy a coequal priority with arena strategy.",
      detail: "Maintain a parcel-level register: ownership, ground leases, easements, parking capacity, garage condition, appraised value, development rights, air rights, reversions. Public valuation and master planning before any additional long-term commitment. Preserve optionality.",
    },
    liveSlug: "rose-quarter-district-development-partner",
    sourceIds: ["gibsonAlbina", "rqPartnerResolution", "pclAnalysis"],
  },
  {
    id: "providence",
    name: "Providence Park",
    kicker: "The strongest asset, with an unknown attached",
    role: "Sport has been played on this block since 1893, when the Multnomah Amateur Athletic Club raised a grandstand over what had been a Chinese vegetable garden supplying much of the city's produce. The stadium itself went up in 1926 for $502,000 and has cycled through five names on its way to the loudest proof in the portfolio: every Timbers MLS home match has sold out since 2011, and the 2019 eastside expansion added capacity on roughly $75 million of private money. That is the financing model this analysis keeps asking for, already working. What the owner lacks is a current, comprehensive picture of the building's condition and lifecycle cost, tied to the operator agreement.",
    strengths: [
      "Capacity above 25,000; ~150 events annually",
      "Strong professional soccer demand",
      "$75M of private financing for the 2019 expansion: the financing model working as intended",
    ],
    risks: [
      "No publicly reconciled facility-condition assessment",
      "A 2035 contract horizon that will arrive faster than it appears",
    ],
    grades: [
      { label: "Demand", value: "Exceptional", tone: "good" },
      { label: "Owner economics", value: "Likely favorable", tone: "good" },
      { label: "Capital visibility", value: "Incomplete", tone: "warn" },
      { label: "Overall", value: "A−", tone: "good" },
    ],
    directive: {
      headline: "Protect and professionally underwrite the asset.",
      detail: "Complete the facility-condition assessment, clarify every City and operator obligation, build the lifecycle reserve, value every commercial right, and start the 2035 negotiation process years before it becomes urgent.",
    },
    sourceIds: ["wikiProvidence", "pdxProvidence", "pdxProvidencePark", "pclAnalysis"],
  },
  {
    id: "keller",
    name: "Keller Auditorium",
    kicker: "A successful venue in an unsustainable building",
    role: "It opened on the Fourth of July, 1917, as the Public Auditorium. A 1968 modernization kept only seventeen percent of the original structure (mostly two walls) and produced what the critic Ada Louise Huxtable called \"a building of unrelieved blandness.\" The blandness works: Keller is the economic engine of Portland'5, with 179 events, 395,255 attendees, and $10.7 million in charges-for-services revenue in FY2024–25 (more than half the system's earned revenue), inside a building with major long-term capital needs. That is the crucial distinction the debate keeps missing: Keller is not an unsuccessful venue. It is a successful venue in a building whose long-term physical economics may be unsustainable.",
    strengths: [
      "Strongest commercial performance in Portland'5",
      "179 events, 395,255 attendees (FY2024–25)",
      "Over half of Portland'5 charges-for-services revenue",
    ],
    risks: [
      "Poor physical condition; major long-term capital needs",
      "$290M renovation estimate in Resolution 2026-270 materials",
      "The risk of drifting into duplicative Broadway-scale capacity if a PSU hall proceeds",
    ],
    grades: [
      { label: "Commercial performance", value: "A", tone: "good" },
      { label: "Demand", value: "A", tone: "good" },
      { label: "Physical sustainability", value: "D / C−", tone: "bad" },
    ],
    directive: {
      headline: "Maintain as a bridge, not as an open-ended second Broadway commitment.",
      detail: "No premature closure; no indefinite duplication. If a new Broadway-capable PSU venue proceeds, Keller becomes a replacement-and-repurposing question, decided only after the replacement is fully operational.",
    },
    liveSlug: "keller-psu-performing-arts-decision",
    sourceIds: ["wikiKeller", "res2026270", "sazanFca", "p5RevenueDoc", "pclAnalysis"],
  },
  {
    id: "schnitzer",
    name: "Arlene Schnitzer Concert Hall",
    kicker: "Subsidy, stated plainly",
    role: "It opened in 1928 as a movie palace (the Portland Publix, renamed the Paramount two years later), and by 1982 it was deteriorated enough that the city condemned it, paid the owner $4.1 million, spent $10 million restoring it, and relit a replica of the original rooftop sign: PORTLAND, in five-foot neon. Today it is culturally central and heavily used (199 events, 294,058 attendees in FY2024–25), and its earned revenue does not cover its fully allocated operating expense. Call that what it is: public cultural subsidy, deliberately purchased, not managerial failure. The discipline is in pricing the purchase.",
    strengths: [
      "Strong cultural demand; the resident organizations' home",
      "Historic building with civic identity",
    ],
    risks: [
      "Substantial earned operating deficit",
      "Major long-term capital need",
      "Attendance still below FY2019",
    ],
    grades: [
      { label: "Cultural demand", value: "Strong", tone: "good" },
      { label: "Earned economics", value: "Deficit", tone: "warn" },
      { label: "Capital need", value: "Major", tone: "bad" },
    ],
    directive: {
      headline: "Retain, but as explicitly subsidized cultural infrastructure.",
      detail: "The correct questions: what cultural outcomes is the subsidy buying, what capital preserves the building, how much do resident organizations contribute, what philanthropy can be raised, and does the subsidy per attendee remain reasonable? Phase the capital program and finance it explicitly.",
    },
    liveSlug: "portland5-management-transition",
    sourceIds: ["wikiSchnitzer", "sazanFca", "p5RevenueDoc", "pclAnalysis"],
  },
  {
    id: "hatfield",
    name: "Antoinette Hatfield Hall",
    kicker: "Three theaters, one building, three different answers",
    role: "Built in 1987 as the New Theatre Building and renamed for Oregon's former First Lady in 2007, it holds three theaters under one roof and one capital liability. The three do not share a demand profile. The relevant question is not which theater to kill. It is: what is the lowest-lifecycle-cost physical configuration that preserves the cultural services Portland actually wants?",
    strengths: ["A useful mid-sized niche (Newmark)", "Small-scale community and education programming (Winningstad, Brunish)"],
    risks: [
      "A significant shared-building capital liability",
      "Winningstad attendance fallen sharply from FY2019",
      "Mission used to justify every building-level expense automatically",
    ],
    grades: [
      { label: "Newmark", value: "Retain & modernize", tone: "good" },
      { label: "Winningstad", value: "Test consolidation", tone: "warn" },
      { label: "Brunish", value: "Mission over building", tone: "warn" },
    ],
    subVenues: [
      {
        name: "Newmark Theatre: the strongest case",
        body: "About 85,400 attendees across 148 events in FY2024–25. A genuine mid-sized theater niche, with a credible long-term role, possibly in a reconfigured building.",
      },
      {
        name: "Winningstad Theatre: events without audiences",
        body: "100 events, roughly 13,800 attendees. The clearest demonstration in the portfolio that event count is not utilization.",
      },
      {
        name: "Brunish Theatre: small utility, big building bill",
        body: "67 events, about 5,400 attendees. Real community utility. But the mission should not automatically underwrite every future building-level capital expense.",
      },
    ],
    directive: {
      headline: "Preserve the services. Test the configuration.",
      detail: "Determine whether Newmark can be physically and financially separated from lower-performing functions, and whether Winningstad and Brunish's public-service missions can be delivered through a more efficient physical arrangement. Consolidation is not abandonment if it protects programming and cuts lifecycle expense.",
    },
    liveSlug: "portland5-management-transition",
    sourceIds: ["wikiHatfield", "sazanFca", "p5RevenueDoc", "pclAnalysis"],
  },
  {
    id: "pir",
    name: "Portland International Raceway",
    kicker: "An enterprise hiding inside a parks bureau",
    role: "The raceway sits on the grave of a city. Vanport was wartime housing for Kaiser shipyard workers, nearly 40,000 people, Oregon's second-largest city. It drowned on Memorial Day 1948 when a railroad berm gave way; fifteen people died and eighteen thousand lost their homes by nightfall. Portland acquired the emptied site in 1960 with an intact street grid and little else, and the first races ran on Vanport's own streets (Cottonwood, Lake, Victory Boulevard), with leftover foundations as trackside hazards into the 1970s. Today PIR is a specialized City enterprise inside Parks: ticketed events, an established user community, direct operating revenue. Its danger is the oldest one in public enterprise: treating this year's positive cash flow as surplus while the asset quietly consumes itself.",
    strengths: [
      "Distinctive regional niche with an established user community",
      "Ticketed events, sponsorship and commercial potential",
      "Direct positive operating contribution",
    ],
    risks: [
      "No complete public lifecycle plan",
      "Reserve concern: apparent surplus measured before true lifecycle cost",
    ],
    grades: [
      { label: "Niche demand", value: "Strong", tone: "good" },
      { label: "Operating contribution", value: "Positive", tone: "good" },
      { label: "Lifecycle funding", value: "Reserve concern", tone: "bad" },
    ],
    directive: {
      headline: "Retain as an enterprise asset. Protect the surplus for lifecycle needs.",
      detail: "Enterprise discipline, in order: (1) calculate normalized operating contribution; (2) complete a component-level 20–30 year capital plan; (3) establish a mandatory lifecycle reserve; (4) retain asset-generated cash to fund it; (5) only then evaluate commercial expansion. Positive cash is not surplus until future capital is funded.",
    },
    sourceIds: ["wikiVanport", "pirHistory", "pclAnalysis"],
  },
  {
    id: "pioneer",
    name: "Pioneer Courthouse Square",
    kicker: "Civic infrastructure, not a profit center",
    role: "For sixty years this block was the Portland Hotel; for thirty more it was the parking lot a department store razed it for. The square that replaced the parking lot in 1984 was paid for partly by fifty thousand Portlanders buying inscribed bricks at $750,000 total, and the hotel's wrought-iron gate still stands on the eastern edge. \"Portland's living room\" is the rare cliché that is simply accurate: free public use, civic assembly, festivals, vigils, corporate rentals. It runs on a blended model of City support (≈$470,000 a year under the 2022–25 agreement), event fees, sponsorship, and donations. Profit is the wrong primary metric. Making the commercial and the civic legible, separately, is the right one.",
    strengths: [
      "Civic and symbolic value: A",
      "Programming potential: A−",
      "Downtown identity, tourism activation, media visibility",
    ],
    risks: [
      "Commercial performance B−/incomplete; financial transparency C",
      "Commercial uses that quietly displace ordinary public access",
      "The successor management agreement's operative terms not yet publicly reconciled",
    ],
    grades: [
      { label: "Civic value", value: "A", tone: "good" },
      { label: "Programming", value: "A−", tone: "good" },
      { label: "Transparency", value: "C", tone: "warn" },
      { label: "Overall", value: "B−", tone: "warn" },
    ],
    directive: {
      headline: "Keep professional management, but under a performance-based agreement.",
      detail: "Score it on what it exists for: free-programming hours, genuinely open public days, unique attendance, subsidy per programmed public hour, maintenance, safety, community participation, and the share of programming accessible without charge. Report commercial statements separately, so a corporate rental and a civic vigil stop hiding inside one undifferentiated event count.",
    },
    sourceIds: ["wikiPioneer", "pdxPioneer", "pioneerOrd", "pclAnalysis"],
  },
  {
    id: "smaller",
    name: "The smaller venues",
    kicker: "The best return nobody measures",
    role: "Walker, Erv Lind, and Sckavone stadiums; East Delta's fields; the Interstate Firehouse Cultural Center; the Community Music Center; Multnomah Arts Center; the amphitheaters and Waterfront Park. This is the least visible ring of the portfolio, and possibly its highest public value per dollar. Walker Stadium shows the model: a 1956 ballpark in Lents Park, named for the Parks Bureau's first Sports Director, that the Portland Pickles took over in 2016 under an agreement allocating rent, cleaning, security, and maintenance. It seats about 1,500 and has squeezed in 4,387: the kind of over-capacity night no spreadsheet in the city currently records.",
    strengths: [
      "Locally valuable, often heavily used",
      "Small capital dollars buy visible improvements: lights, restrooms, seating, accessibility, sound, field condition",
    ],
    risks: [
      "No unified public statement of events, attendance, revenue, expense, deferred capital, or outcomes",
      "Easy to neglect precisely because the price tags aren't dramatic",
    ],
    grades: [
      { label: "Utilization", value: "Uneven", tone: "warn" },
      { label: "Documentation", value: "Poor", tone: "bad" },
      { label: "Marginal return", value: "Potentially highest", tone: "good" },
    ],
    directive: {
      headline: "Inventory, triage, and fund a targeted small-capital program.",
      detail: "Group them as a Community & Civic Venues Program with three standards: revenue-generating neighborhood venues (leases recover operating and wear costs), cultural-service venues (subsidy warranted, measured), and programmable public realm (never made inaccessible just to maximize private rental revenue). A modest annual fund here may outperform some much larger prestige projects in public benefit per dollar.",
    },
    sourceIds: ["wikiWalker", "pdxWalker", "walkerOrd", "pclAnalysis"],
  },
  {
    id: "psu",
    name: "The proposed PSU venue",
    kicker: "A prospective asset, not yet an entitlement",
    role: "A new ~3,000-seat Broadway-capable hall at Portland State (estimated at up to $449 million in concept materials, $447 million in Resolution 2026-270's), recommended by the steering process in June 2026 and referred toward the full council in August. Its correct classification today is a potential replacement strategy for Keller, and everything about its evaluation follows from refusing to treat it as anything more until the proof arrives.",
    strengths: [
      "Would resolve Keller's physical unsustainability with a purpose-built modern hall",
      "A $137.5M state funding commitment in the current record",
    ],
    risks: [
      "Construction funding is not an operating model",
      "Labor plan, booking agreements, resident-company commitments, and capital reserve all unproven",
      "The additive trap: building it and keeping Keller too",
    ],
    grades: [
      { label: "Concept demand", value: "Credible", tone: "good" },
      { label: "Financing proof", value: "Incomplete", tone: "warn" },
      { label: "Operating proof", value: "Absent", tone: "bad" },
    ],
    directive: {
      headline: "Require complete financing and operating proof.",
      detail: "No City-backed construction financing until there is a complete budget, committed capital stack, operator, labor plan, annual operating model, booking and resident-company agreements, a binding limit on City operating exposure, and a replacement strategy for Keller.",
    },
    liveSlug: "keller-psu-performing-arts-decision",
    sourceIds: ["res2026270", "flspaProgram", "artswatchPsu", "pclAnalysis"],
  },
];

/* ------------------------------------------------ §9.1: the ranking */

export interface RankingRow {
  asset: string;
  demand: string;
  ownerEconomics: string;
  condition: string;
  recommendation: string;
}

export const RANKING: RankingRow[] = [
  { asset: "Moda Center", demand: "Very strong", ownerEconomics: "Incomplete, contract-dependent", condition: "Large identified liability", recommendation: "Invest only under strong public protections" },
  { asset: "Providence Park", demand: "Exceptional", ownerEconomics: "Incomplete but likely favorable", condition: "Exposure unresolved", recommendation: "Preserve; complete FCA; negotiate early" },
  { asset: "Keller Auditorium", demand: "Strongest P5 commercial", ownerEconomics: "Positive earned contribution", condition: "Poor", recommendation: "Maintain as bridge; replace or fundamentally repurpose" },
  { asset: "Portland Int'l Raceway", demand: "Strong niche", ownerEconomics: "Positive direct contribution", condition: "Reserve concern", recommendation: "Retain; build lifecycle reserve" },
  { asset: "Veterans Memorial Coliseum", demand: "Credible despite closure", ownerEconomics: "Incomplete", condition: "Improving through renovation", recommendation: "Finish; position as complementary arena" },
  { asset: "Newmark Theatre", demand: "Good", ownerEconomics: "Likely subsidized", condition: "Shared-building liability", recommendation: "Retain and modernize" },
  { asset: "Schnitzer Concert Hall", demand: "Strong cultural", ownerEconomics: "Significant earned deficit", condition: "Major capital need", recommendation: "Retain with explicit cultural compact" },
  { asset: "Pioneer Courthouse Square", demand: "Strong civic use", ownerEconomics: "Mixed public/commercial", condition: "Ongoing public-realm need", recommendation: "Retain with performance agreement" },
  { asset: "Winningstad Theatre", demand: "Moderate-to-low", ownerEconomics: "Subsidized", condition: "Shared major liability", recommendation: "Test consolidation and reconfiguration" },
  { asset: "Brunish Theatre", demand: "Low commercial", ownerEconomics: "Subsidized", condition: "Shared major liability", recommendation: "Preserve mission only if space strategy is justified" },
  { asset: "Rose Quarter land & garages", demand: "Strong event-linked", ownerEconomics: "Material cash + option value", condition: "Highest-use analysis needed", recommendation: "Treat as real-estate platform" },
  { asset: "Neighborhood venues", demand: "Uneven, locally valuable", ownerEconomics: "Poorly documented", condition: "Poorly documented", recommendation: "Inventory, triage, target small high-return investments" },
];
