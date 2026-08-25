/**
 * The six contested choices, steelmanned (§7–§13 of the source analysis).
 * Each debate gives both sides their strongest case, then states where the
 * analysis lands and why. Adjudications are Portland Civic Lab analysis.
 */

import type { SourceId } from "./data";

export interface DebatePoint {
  claim: string;
  body: string;
}

export interface DebateSide {
  label: string;
  points: DebatePoint[];
}

export interface Debate {
  id: string;
  title: string;
  stakes: string;
  a: DebateSide;
  b: DebateSide;
  adjudication: { headline: string; body: string };
  sourceIds: SourceId[];
}

export const DEBATES: Record<string, Debate> = {
  psuVsKeller: {
    id: "psu-vs-keller",
    title: "Build the PSU hall, or rebuild Keller?",
    stakes: "Roughly $447–449M for a new hall versus $290M for a renovation, and the risk of paying for both.",
    a: {
      label: "Build new at PSU",
      points: [
        {
          claim: "Keller's building is the problem, not its business",
          body: "The venue fills seats and generates more than half of Portland'5 earned revenue, inside a structure whose long-term physical economics may be unsustainable. A purpose-built hall solves the actual problem instead of pouring $290M into a compromised envelope.",
        },
        {
          claim: "The state money is real and time-limited",
          body: "A $137.5M state commitment sits in the current record. Renovation-in-place attracts no such partner; a new regional venue does.",
        },
        {
          claim: "A 2030 opening resets the market",
          body: "A modern Broadway-capable hall changes what tours route through Portland, rather than preserving 1917 constraints at 2026 prices.",
        },
      ],
    },
    b: {
      label: "Keep and renovate Keller",
      points: [
        {
          claim: "You don't replace your best earner on a projection",
          body: "Keller is the one Portland'5 building with a positive earned contribution. The PSU hall's operating model, labor plan, and booking agreements do not yet exist. Trading proven cash flow for a rendering is how cities end up subsidizing two halls.",
        },
        {
          claim: "$290M is real; 'up to $449M' rarely stays $449M",
          body: "Major venue projects overrun. The renovation is the bounded option on a building the City already owns and understands.",
        },
        {
          claim: "Sunk relationships matter",
          body: "Resident organizations, unions, and audiences are calibrated to Keller. Migration risk is never zero.",
        },
      ],
    },
    adjudication: {
      headline: "Replacement, not duplication. And proof before financing.",
      body: "The analysis lands with the source doctrine: treat the PSU hall as a potential replacement strategy, never an additive entitlement. Maintain Keller as a bridge, demand the complete financing and operating proof before any City-backed construction commitment, and decide Keller's reuse only after a replacement is fully operational. The one outcome the portfolio cannot afford is the middle path: building the new hall and drifting into running both.",
    },
    sourceIds: ["res2026270", "flspaProgram", "pclAnalysis"],
  },

  modaInvestVsWalk: {
    id: "moda-invest-vs-walk",
    title: "Invest in Moda under conditions, or refuse the deal?",
    stakes: "$120M City upfront, up to $275M more in City-controlled venue resources over 20 years, against the risk of losing an NBA anchor.",
    a: {
      label: "Invest, with hard protections",
      points: [
        {
          claim: "The City already owns the downside",
          body: "Since 2024 the arena is City property. Walking away doesn't transfer the aging building's risk to someone else: the owner holds it either way. The question is whether renovation happens with a major tenant locked in or without one.",
        },
        {
          claim: "The leverage window is now",
          body: "State bonds, county money, and a term sheet exist simultaneously. That stack has never assembled before and may not assemble again.",
        },
        {
          claim: "An anchored district beats an empty one",
          body: "Rose Quarter land value (the portfolio's biggest option) is worth more beside a renovated, occupied arena than a declining or dark one.",
        },
      ],
    },
    b: {
      label: "Refuse, or hold out for better",
      points: [
        {
          claim: "Public financing keeps drifting from public return",
          body: "The operator controls important economics. Without audited owner data, capped exposure, and upside participation, the City risks financing improvements whose returns accrue to private parties. That is the classic arena-deal failure.",
        },
        {
          claim: "Relocation threats are the strongest card and the least tested",
          body: "Non-relocation and successor protections are only as good as their enforcement terms. A deal signed against a deadline is a deal negotiated by the deadline.",
        },
        {
          claim: "The land can anchor a district without a maximal arena package",
          body: "The Rose Quarter's real-estate value doesn't require the City to fund every eligible project on the list.",
        },
      ],
    },
    adjudication: {
      headline: "Conditional yes, and the conditions are the deal.",
      body: "Invest only with a fixed and auditable exposure cap, private completion and overrun protection, enforceable non-relocation and successor terms, owner data and audit rights, public participation in major commercial upside, a funded lifecycle system, and no quiet conveyance of land or development rights. The December 31, 2026 target must not override deal quality. If the conditions don't survive negotiation, neither should the deal.",
    },
    sourceIds: ["modaResolution", "modaTermSheetOpb", "sb1501", "countyModa", "pclAnalysis"],
  },

  hatfieldConsolidateVsPreserve: {
    id: "hatfield-consolidate-vs-preserve",
    title: "Consolidate Hatfield Hall, or preserve all three theaters as they are?",
    stakes: "A shared building with a serious capital range, housing one strong theater and two weak ones.",
    a: {
      label: "Consolidate and reconfigure",
      points: [
        {
          claim: "The numbers are not close",
          body: "Newmark drew about 85,400 people in FY2024–25; Winningstad about 13,800 across 100 events; Brunish about 5,400 across 67. Full replacement-in-kind rebuilds all three cost structures to serve one theater's demand.",
        },
        {
          claim: "Mission is portable; square footage is not",
          body: "Community and education programming can survive, even improve, in a more efficient configuration. What can't survive is a capital plan that treats every room as sacred.",
        },
      ],
    },
    b: {
      label: "Preserve the full configuration",
      points: [
        {
          claim: "Small stages are the pipeline",
          body: "Winningstad and Brunish serve school shows, community companies, and culturally specific programming that a commercial mid-size hall never will. Cut the small rooms and you cut the entry point.",
        },
        {
          claim: "Consolidation costs are real too",
          body: "Reconfiguration is construction: design, disruption, dark months. The savings must be netted against the rebuild.",
        },
      ],
    },
    adjudication: {
      headline: "Ask the right question, then test it.",
      body: "The question is not which theater to kill. It is: what is the lowest-lifecycle-cost physical configuration that preserves the cultural services Portland actually wants? Test whether Newmark can be separated from lower-performing functions and whether Winningstad and Brunish's missions can be delivered through a leaner arrangement. Consolidation is not abandonment if it protects programming and reduces lifecycle expense.",
    },
    sourceIds: ["pclAnalysis"],
  },

  garagesParkVsRedevelop: {
    id: "garages-park-vs-redevelop",
    title: "Rebuild the Rose Quarter garages as parking, or redevelop the land?",
    stakes: "Material parking revenue today versus the district's largest long-term development option.",
    a: {
      label: "Preserve parking capacity",
      points: [
        {
          claim: "Parking is present-tense money",
          body: "Rose Quarter parking is a material Spectator Venues revenue stream funding real obligations now. Event patrons need somewhere to put cars tonight, not in a master plan's phase three.",
        },
        {
          claim: "Arena deals assume access",
          body: "Operators and promoters price venues partly on parking; degrading it mid-negotiation weakens the City's own asset.",
        },
      ],
    },
    b: {
      label: "Redevelop toward a district",
      points: [
        {
          claim: "Parking demand is not eternal",
          body: "Transit use, rideshare, event patterns, and mobility policy can all change long-term demand. Rebuilding garages in-kind bets decades of capital on the most fragile assumption in the portfolio.",
        },
        {
          claim: "The land is the option",
          body: "A public real-estate platform beside high-capacity transit is worth more as a mixed-use district anchored by arenas than as arenas islanded in parking structures.",
        },
      ],
    },
    adjudication: {
      headline: "Highest long-term public value, not automatic preservation of current capacity.",
      body: "Complete the district master plan, run the land-use analysis, and let garage renewal or replacement follow from it. No garage reinvestment that assumes indefinite parking demand, and no disposition of development rights without independent valuation, competitive testing, participation rent, deadlines, and reversion.",
    },
    sourceIds: ["rqPartnerResolution", "rqPartnerOpb", "pclAnalysis"],
  },

  subsidyVsCommercial: {
    id: "subsidy-vs-commercial",
    title: "Should cultural venues have to pay their way?",
    stakes: "The recurring fight underneath every venue vote, resolved only by keeping two ledgers honest at once.",
    a: {
      label: "Commercial discipline",
      points: [
        {
          claim: "Deficits compound quietly",
          body: "An 'accepted' operating gap becomes an unexamined one. Without earned-revenue pressure, costs drift and capital backlogs grow behind the curtain until they arrive as emergencies.",
        },
        {
          claim: "Subsidy without measurement is just spending",
          body: "If the public is buying cultural outcomes, someone has to be able to say what was bought, for whom, at what cost per attendee.",
        },
      ],
    },
    b: {
      label: "Public-service subsidy",
      points: [
        {
          claim: "The mission is the return",
          body: "A concert hall's product includes school kids at their first symphony and companies that could never pay commercial rent. Grading the Schnitzer on margin is grading a library on late fees.",
        },
        {
          claim: "Commercial screens exclude by design",
          body: "Pure cost-recovery pricing pushes out exactly the community and culturally specific programming the public owns these buildings to host.",
        },
      ],
    },
    adjudication: {
      headline: "Explicit subsidy, never hidden cross-subsidy.",
      body: "Both sides are right about the other's failure mode. The resolution is structural: every venue gets an owner-financial scorecard and a public-value scorecard. Commercial assets must demonstrate public financial return and risk transfer. Cultural assets must demonstrate measured public outcomes and affordable lifecycle plans. What no asset gets is the middle fog, where a deficit is neither a priced purchase nor a fixable failure, just a number nobody owns.",
    },
    sourceIds: ["pclAnalysis"],
  },

  integratedVsFragmented: {
    id: "integrated-vs-fragmented",
    title: "One Portland'5 operator, or specialized operators per venue?",
    stakes: "The 2027 handoff from Metro is the one moment this choice is genuinely open.",
    a: {
      label: "One integrated operator",
      points: [
        {
          claim: "Five venues, one back office",
          body: "Fragmenting the system duplicates all eight cost centers: ticketing, security, stage labor, finance, concessions, customer data, booking coordination, and management overhead.",
        },
        {
          claim: "Booking is a portfolio game",
          body: "Routing a tour across Keller, the Schnitzer, and Newmark requires one calendar and one negotiator, not three competitors bidding against the City's own buildings.",
        },
      ],
    },
    b: {
      label: "Specialized operators",
      points: [
        {
          claim: "Specialists outperform generalists",
          body: "A Broadway house, a symphony hall, and small community stages are different businesses. Purpose-matched operators could book, program, and price each better than one manager averaging across all five.",
        },
        {
          claim: "Competition disciplines fees",
          body: "A single operator with no alternative is a monopolist with a management contract.",
        },
      ],
    },
    adjudication: {
      headline: "Integrate operations; specialize programming; make fragmenters show their math.",
      body: "The safest 2027 structure: one integrated operator for shared systems and labor, venue-level financial reporting, specialized programming and resident-organization agreements inside it, a fixed fee with designed performance incentives, City ownership of customer and performance data, and open-book accounting. Any proposal to fragment the five venues must quantify its claimed specialization benefit against the eight duplicated cost centers.",
    },
    sourceIds: ["p5Transition", "p5Rfi", "pclAnalysis"],
  },
};
