/**
 * The Portland Portfolio Brief — weekly, public-source, free.
 *
 * Same provenance rules as the CED portfolio view: every claim traces to a
 * public source. Items are factual — what happened, what it's waiting on,
 * what's on the calendar — never editorial risk ratings.
 */

export interface BriefSource {
  label: string;
  url: string;
}

export interface BriefItem {
  title: string;
  body: string;
  source?: BriefSource;
}

export interface BriefDecision {
  what: string;
  who: string;
  due: string;
}

export interface BriefIssue {
  number: number;
  /** Display date, e.g. "August 21, 2026" */
  date: string;
  slug: string;
  intro: string;
  /** The five things that need attention this week — exactly five. */
  attention: BriefItem[];
  decisionsDue: BriefDecision[];
  watching: string[];
}

export const BRIEF_ISSUES: BriefIssue[] = [
  {
    number: 1,
    date: "August 21, 2026",
    slug: "2026-08-21",
    intro:
      "Portland's development portfolio had its biggest week of the year on August 11–12: the council adopted the Moda Center term sheet, advanced the performing-arts decision, and opened a development-partner process for the Rose Quarter. This first issue reads the whole Community & Economic Development portfolio — sixteen initiatives, thirty unresolved decisions — and pulls out what actually needs attention between now and December.",
    attention: [
      {
        title: "The Moda Center clock is now running — without a funding plan",
        body: "Council adopted the term sheet 8–4 on August 12 (Resolution 2026-280): $120 million upfront plus up to $275 million over a 20-year lease, with binding agreements due by December 31. But the city has not chosen where its $120 million comes from — PCEF and Prosper Portland are on the record saying they need detailed renovation plans the team has not yet provided. A half-billion-dollar public package now depends on paperwork that doesn't exist yet.",
        source: {
          label: "OPB, Aug 12, 2026",
          url: "https://www.opb.org/article/2026/08/12/portland-city-council-approves-moda-center-renovations-term-sheet/",
        },
      },
      {
        title: "September 1: the next dated decision on the calendar",
        body: "The council's Housing and Permitting Committee votes September 1 on whether to advance the Climate and Health Standards for Existing Buildings — annual energy reporting for buildings of 20,000+ square feet and emissions cuts of 20% every five years toward zero by 2050. It is the portfolio's nearest firm decision date, and it would touch nearly every large apartment and commercial building in the city.",
        source: {
          label: "Portland.gov building standards",
          url: "https://www.portland.gov/bps/climate-action/building-standards",
        },
      },
      {
        title: "The performing-arts decision reached the full council with bigger numbers",
        body: "The City Life Committee voted 4–1 on August 11 to send Resolution 2026-270 to the full council: advance a ~3,000-seat venue at PSU and plan a downsized Keller. The estimates moved — $447 million for the PSU venue and $290 million for a Keller renovation, up from the $358M/$236M figures published during the study. A Project Commitment Agreement with PSU is due December 1; the city's own dollar commitment is still undefined.",
        source: {
          label: "Resolution 2026-270 (Portland.gov)",
          url: "https://www.portland.gov/council/documents/resolution/accept-future-large-scale-performing-arts-recommendations",
        },
      },
      {
        title: "The Rose Quarter land question is moving on the same clock as the lease",
        body: "Resolution 2026-285 — a development-partner process for ten city-owned parcels around the arena, with negotiations prioritized with Albina Vision Trust — cleared committee 5–0 on August 11 and awaits a full council date. The process is designed to run concurrent with the Moda lease talks, and one councilor has already raised on-record concerns about sole preference for a single nonprofit.",
        source: {
          label: "OPB, Aug 12, 2026",
          url: "https://www.opb.org/article/2026/08/12/portland-councilors-land-plan-moda-center/",
        },
      },
      {
        title: "The housing-funds audit is still open",
        body: "After roughly $106 million in unspent Housing Bureau balances surfaced last winter, council allocated $56 million in April and the City Administrator commissioned an independent third-party audit. The audit's findings — and whether a second oversight hearing happens — remain the portfolio's biggest unresolved accountability question. No report date has been published.",
        source: {
          label: "OPB, Apr 8, 2026",
          url: "https://www.opb.org/article/2026/04/08/portland-56-million-unbudgeted-housing-funds/",
        },
      },
    ],
    decisionsDue: [
      {
        what: "Advance building performance standards to full council",
        who: "Housing & Permitting Committee",
        due: "Sep 1, 2026",
      },
      {
        what: "Project Commitment Agreement with PSU (performing arts)",
        who: "CED Deputy City Administrator / PSU",
        due: "Dec 1, 2026",
      },
      {
        what: "Binding Moda Center lease, renovation, and operating agreements",
        who: "Portland City Council",
        due: "Dec 31, 2026",
      },
      {
        what: "First 5-Year Action Plans for the East Portland TIF districts",
        who: "Portland City Council",
        due: "End of 2026",
      },
      {
        what: "Design review reform — two-year suspension recommendation",
        who: "Portland City Council",
        due: "Expected late 2026",
      },
      {
        what: "Portland'5 operating model — new operator identified",
        who: "Office of Arts & Culture",
        due: "December 2026 (per RFI timeline)",
      },
    ],
    watching: [
      "PCEF's 2026 Community Grants — up to $60 million, award notifications expected this fall.",
      "The OMSI District's revised construction timeline, promised after the New Water Avenue groundbreaking slipped past 2025.",
      "Metro-bond housing delivery: 73Foster opened August 17 with 64 homes; 104 more bond-funded units are expected to open during 2026.",
      "Whether the invalidated PCEF-diversion ballot initiative returns in revised form.",
      "PP&D's cost-recovery test: new fees took effect July 10 — FY 2026-27 is the year the bureau is supposed to stop drawing on reserves.",
    ],
  },
];

export function latestIssue(): BriefIssue | null {
  return BRIEF_ISSUES.length > 0 ? BRIEF_ISSUES[0] : null;
}
