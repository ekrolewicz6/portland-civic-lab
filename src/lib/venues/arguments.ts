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
          body: "The venue fills seats and brings in more than half of Portland'5 earned revenue, inside a building that may cost more to keep standing, long term, than anyone can justify. A purpose-built hall fixes the actual problem instead of pouring $290M into walls and systems that will still be compromised.",
        },
        {
          claim: "The state money is real and time-limited",
          body: "A $137.5M state commitment is already on the books. Renovating Keller where it stands attracts no such partner; a new regional venue does.",
        },
        {
          claim: "A 2030 opening resets the market",
          body: "A modern Broadway-capable hall changes which tours come through Portland, instead of paying 2026 prices to keep 1917 limitations.",
        },
      ],
    },
    b: {
      label: "Keep and renovate Keller",
      points: [
        {
          claim: "You don't replace your best earner on a projection",
          body: "Keller is the one Portland'5 building that pays its own way. The PSU hall's operating model, labor plan, and booking agreements do not yet exist. Trading proven cash flow for a rendering is how cities end up subsidizing two halls.",
        },
        {
          claim: "$290M is real; 'up to $449M' rarely stays $449M",
          body: "Major venue projects run over budget. The renovation has a known ceiling, on a building the City already owns and understands.",
        },
        {
          claim: "The relationships live at Keller",
          body: "Resident organizations, unions, and audiences are built around Keller. Not all of them are guaranteed to follow to a new hall.",
        },
      ],
    },
    adjudication: {
      headline: "Replace it, don't duplicate it. And prove it before paying for it.",
      body: "The analysis lands where its sources do: treat the PSU hall as a possible replacement for Keller, never an extra hall added on top. Keep Keller running as a bridge, demand full financing and operating proof before the City commits to construction, and decide what to do with Keller only after a replacement is fully up and running. The one outcome the portfolio cannot afford is the middle path: building the new hall and drifting into running both.",
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
          claim: "Walk away, and the City still owns the problem",
          body: "Since 2024 the arena is City property. Walking away doesn't transfer the aging building's risk to someone else: the owner holds it either way. The question is whether renovation happens with a major tenant locked in or without one.",
        },
        {
          claim: "The City has leverage right now",
          body: "State bonds, county money, and a term sheet are all on the table at once. That combination has never come together before and may not again.",
        },
        {
          claim: "A busy district beats an empty one",
          body: "Rose Quarter land, the biggest long-term prize in the portfolio, is worth more beside a renovated, busy arena than a fading or dark one.",
        },
      ],
    },
    b: {
      label: "Refuse, or hold out for better",
      points: [
        {
          claim: "Public money keeps turning into private profit",
          body: "The operator controls much of what the arena earns. Unless the City can see audited numbers, cap its losses, and share in the gains, it risks paying for improvements whose profits flow to private parties. That is the classic arena-deal failure.",
        },
        {
          claim: "Relocation threats are the strongest card and the least tested",
          body: "A promise that the team stays, and that it binds whoever owns the team next, is only as strong as its enforcement terms. A deal signed against a deadline is a deal negotiated by the deadline.",
        },
        {
          claim: "The land can carry a district without the City paying for everything",
          body: "The Rose Quarter's real-estate value doesn't require the City to fund every eligible project on the list.",
        },
      ],
    },
    adjudication: {
      headline: "Conditional yes, and the conditions are the deal.",
      body: "Invest only if the City's exposure has a fixed cap anyone can audit, private partners guarantee completion and cover overruns, the stay-in-Portland promise is enforceable and binds future owners, the City gets the books and the right to audit them, the public shares in any major commercial windfall, repairs and replacements are funded from day one, and no land or development rights slip away quietly. The December 31, 2026 target must not override deal quality. If the conditions don't survive negotiation, neither should the deal.",
    },
    sourceIds: ["modaResolution", "modaTermSheetOpb", "sb1501", "countyModa", "pclAnalysis"],
  },

  hatfieldConsolidateVsPreserve: {
    id: "hatfield-consolidate-vs-preserve",
    title: "Consolidate Hatfield Hall, or preserve all three theaters as they are?",
    stakes: "One shared building with a big, uncertain construction bill, housing one strong theater and two weak ones.",
    a: {
      label: "Consolidate into fewer rooms",
      points: [
        {
          claim: "The numbers are not close",
          body: "Newmark drew about 85,400 people in FY2024–25; Winningstad about 13,800 across 100 events; Brunish about 5,400 across 67. Rebuilding all three exactly as they are means paying for three theaters' worth of costs to serve one theater's crowd.",
        },
        {
          claim: "Mission is portable; square footage is not",
          body: "Community and education programming can survive, even improve, in a smaller, smarter set of rooms. What can't survive is a capital plan that treats every room as sacred.",
        },
      ],
    },
    b: {
      label: "Keep all three as they are",
      points: [
        {
          claim: "Small stages are the pipeline",
          body: "Winningstad and Brunish serve school shows, community companies, and culturally specific programming that a commercial mid-size hall never will. Cut the small rooms and you cut the entry point.",
        },
        {
          claim: "Consolidation costs are real too",
          body: "Combining theaters is still construction: design fees, disruption, months of dark stages. Whatever it saves has to be weighed against the cost of the rebuild.",
        },
      ],
    },
    adjudication: {
      headline: "Ask the right question, then test it.",
      body: "The question is not which theater to kill. It is: what is the cheapest arrangement of buildings, counting decades of upkeep, that still delivers the cultural services Portland actually wants? Test whether Newmark can be run apart from the struggling rooms, and whether Winningstad and Brunish's missions can be delivered in leaner spaces. Consolidation is not abandonment if it protects the programming and cuts what the building costs over its life.",
    },
    sourceIds: ["pclAnalysis"],
  },

  garagesParkVsRedevelop: {
    id: "garages-park-vs-redevelop",
    title: "Rebuild the Rose Quarter garages as parking, or redevelop the land?",
    stakes: "Real parking money today versus the biggest long-term chance to build the district into something more.",
    a: {
      label: "Preserve parking capacity",
      points: [
        {
          claim: "Parking is present-tense money",
          body: "Rose Quarter parking is serious money for Spectator Venues, and it pays real bills now. Event patrons need somewhere to put cars tonight, not in a master plan's phase three.",
        },
        {
          claim: "Arena deals assume people can park",
          body: "Operators and promoters judge a venue partly on its parking; letting it degrade in the middle of negotiations lowers the value of the City's own arena.",
        },
      ],
    },
    b: {
      label: "Redevelop toward a district",
      points: [
        {
          claim: "Parking demand is not eternal",
          body: "Transit, rideshare, event habits, and city travel policy can all change how much parking people need in the long run. Rebuilding the garages just as they were bets decades of money on the shakiest assumption in the portfolio.",
        },
        {
          claim: "The land is the real prize",
          body: "Public land beside major transit lines is worth more as a full district built around the arenas than as arenas stranded in a sea of parking garages.",
        },
      ],
    },
    adjudication: {
      headline: "The goal is long-term public value, not saving every parking space.",
      body: "Finish the district master plan, study what the land is best used for, and let the garages' fate follow from that. No garage money spent on the assumption people will park forever, and no development rights handed over without an independent appraisal, competing bids, rent that rises with the project's success, hard deadlines, and the rights returning to the City if the builder doesn't deliver.",
    },
    sourceIds: ["rqPartnerResolution", "rqPartnerOpb", "pclAnalysis"],
  },

  subsidyVsCommercial: {
    id: "subsidy-vs-commercial",
    title: "Should cultural venues have to pay their way?",
    stakes: "The recurring fight underneath every venue vote, resolved only by keeping two ledgers honest at once.",
    a: {
      label: "The case for making it pay",
      points: [
        {
          claim: "Losses grow in the dark",
          body: "Once a deficit is accepted, nobody looks at it again. With no pressure to earn, costs creep up and repairs get skipped, until the bill arrives as an emergency.",
        },
        {
          claim: "If we're buying something, say what it is",
          body: "When the public covers a venue's losses, someone should be able to answer three questions: what did we get, who got it, and what did it cost per person in the seats?",
        },
      ],
    },
    b: {
      label: "The case for paying for it",
      points: [
        {
          claim: "The point was never profit",
          body: "What a concert hall produces includes school kids at their first symphony and local companies that could never pay commercial rent. Grading the Schnitzer on profit is like grading a library on late fees.",
        },
        {
          claim: "Charge full price and you lose the point",
          body: "If every group has to cover full cost, the first ones priced out are the school shows, the community groups, and the cultural events these buildings exist to host.",
        },
      ],
    },
    adjudication: {
      headline: "Pay for it in the open, never through the back door.",
      body: "Both sides are right about how the other goes wrong. The fix is two scorecards for every venue: one for the owner's money, one for the public good. Venues meant to make money must show a real public return and someone else holding the risk. Venues meant to serve must show, in numbers, what the public got, plus an upkeep plan the City can afford. What no venue gets is the middle fog, where a deficit is neither a price we agreed to pay nor a failure anyone is fixing, just a number nobody owns.",
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
          body: "Split the system and you pay for eight things more than once: ticketing, security, stage labor, finance, concessions, customer data, booking coordination, and management overhead.",
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
          body: "A Broadway house, a symphony hall, and small community stages are different businesses. An operator built for each could book, program, and price it better than one manager spreading attention across all five.",
        },
        {
          claim: "Competition keeps fees honest",
          body: "A single operator with no alternative is a monopolist with a management contract.",
        },
      ],
    },
    adjudication: {
      headline: "Run it as one, program each hall its own way, and make anyone who wants to split it show their math.",
      body: "The safest setup for 2027: one operator running shared systems and labor, each venue's finances reported on their own, programming and resident-organization agreements tailored hall by hall, a fixed fee with real performance incentives built in, the City keeping ownership of customer and performance data, and open books. Any proposal to split the five venues must put a number on what specialists would gain and weigh it against the eight operations they would duplicate.",
    },
    sourceIds: ["p5Transition", "p5Rfi", "pclAnalysis"],
  },
};
