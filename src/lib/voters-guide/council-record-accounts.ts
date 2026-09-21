import type { Evidence } from "./types";
import { additionalAccounts, additionalTopics } from "./council-coverage";
import {
  historicalAccounts,
  budgetReadings,
  zenithReadings,
  zenithInvestigationOutcome,
  type TopicReading,
} from "./council-history";

export type DecisionAccount = {
  choice: string;
  action: string;
  actionSource?: Evidence;
  reason?: { label: string; text: string; source: Evidence };
};

const julyAgenda: Evidence = {
  label: "Both budget proposals · roll calls",
  url: "https://www.portland.gov/council/agenda/2026/7/22",
  kind: "Public record",
  date: "July 22, 2026",
};
const julyReporting: Evidence = {
  label: "OPB · budget debate",
  url: "https://www.opb.org/article/2026/07/22/portland-city-council-job-cuts-budget/",
  kind: "Reporting",
  date: "July 22, 2026",
};
const modaStatement: Evidence = {
  label: "Green and Morillo · explanations after the vote",
  url: "https://www.portland.gov/council/districts/4/mitch-green/news/2026/8/13/press-release-portland-city-councilors-green-morillo",
  kind: "Candidate statement",
  date: "August 13, 2026",
};
const modaRecord: Evidence = {
  label: "Moda amendments · roll calls",
  url: "https://www.portland.gov/council/documents/resolution/adopted/37750",
  kind: "Public record",
  date: "August 12, 2026",
};
const absent: DecisionAccount = {
  choice: "Absent from the final vote",
  action: "Absent on November 19. No yes or no vote on the final ordinance.",
};
const rentalSponsor: DecisionAccount = {
  choice: "Co-sponsored and voted for the ban",
  action:
    "Co-sponsored the restriction on software that coordinates rental prices between landlords, then voted to enact it.",
};
const dataCenterVote: DecisionAccount = {
  choice: "Backed disclosure and future restrictions",
  action:
    "Voted to disclose major data-center inquiries and pursue restrictions. The resolution did not itself enact a moratorium.",
};

// A recorded action is not labeled as a stated reason. Earlier statements keep
// their dates; they are context, not a claim about the speaker's final motive.
export const decisionAccounts: Record<
  string,
  Record<string, DecisionAccount>
> = {
  ...historicalAccounts,
  ...additionalAccounts,
  "rental-pricing": {
    "Tiffany Koyama Lane": rentalSponsor,
    "Angelita Morillo": {
      ...rentalSponsor,
      action:
        "Introduced the ban and revised it after legal objections. The final ordinance exempted affordable housing and landlords with fewer than six units.",
      actionSource: {
        label: "OPB · development of the ordinance",
        url: "https://www.opb.org/article/2025/11/19/portland-city-council-proposal-ban-rent-setting-software/",
        kind: "Reporting",
        date: "November 19, 2025",
      },
      reason: {
        label: "Her stated case",
        text: "Argued that protecting tenants from coordinated price-setting and building more housing should happen together.",
        source: {
          label:
            "Morillo’s office · November 19 remarks reported by the Mercury",
          url: "https://www.portland.gov/council/districts/3/angelita-morillo/morillo-news",
          kind: "Candidate statement",
          date: "November 19, 2025 remarks; reviewed September 18, 2026",
        },
      },
    },
    "Mitch Green": rentalSponsor,
    "Steve Novick": absent,
    "Eric Zimmerman": absent,
    "Olivia Clark": {
      choice: "Opposed the ban",
      action: "Voted against the ordinance; it passed 8–2.",
      reason: {
        label: "Her stated concern · November 12",
        text: "Said another restriction would discourage needed housing investment and raised the risk of a lawsuit.",
        source: {
          label: "OPB · Clark’s objections",
          url: "https://www.opb.org/article/2025/11/19/portland-city-council-proposal-ban-rent-setting-software/",
          kind: "Reporting",
          date: "November 19, 2025",
        },
      },
    },
  },
  "supplemental-budget": {
    "Tiffany Koyama Lane": {
      choice: "Larger plan only",
      action:
        "Co-sponsored and backed the larger restoration plan using climate-fund interest. After it failed, voted no on the smaller package.",
      actionSource: julyAgenda,
    },
    "Angelita Morillo": {
      choice: "Larger plan, then smaller fallback",
      action:
        "Co-sponsored and backed the larger plan. After it failed, voted for the smaller package.",
      actionSource: julyAgenda,
      reason: {
        label: "Her stated condition",
        text: "Warned that she would fight any subsequent move to pay for it from the police-accountability office’s budget.",
        source: julyReporting,
      },
    },
    "Mitch Green": {
      choice: "Larger plan, then smaller fallback",
      action:
        "Co-sponsored and backed the larger plan using climate-fund interest. After it failed, voted for the smaller package.",
      actionSource: julyAgenda,
    },
    "Steve Novick": {
      choice: "Smaller package only",
      action:
        "Co-sponsored the smaller service-restoration package. Voted against the larger alternative, then for the smaller package.",
      actionSource: julyAgenda,
      reason: {
        label: "Why he opposed the larger plan",
        text: "Said Services First spent money the city should be counting on to balance next year’s already tough budget, and that restoring cuts to police training, such as de-escalation and emergency driving, was essential.",
        source: {
          label: "Novick · emailed response to the Lab’s questions",
          url: "https://www.portlandciviclab.org/voters-guide/research-log#novick-2026-09-21",
          kind: "Candidate statement",
          date: "Received September 21, 2026",
          note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on his brief. Receipt does not verify the claims.",
        },
      },
    },
    "Olivia Clark": {
      choice: "Smaller package only",
      action:
        "Co-sponsored the smaller service-restoration package. Voted against the larger alternative, then for the smaller package.",
      actionSource: julyAgenda,
      reason: {
        label: "Why she backed the smaller plan",
        text: "Said it restored critical positions identified with labor unions and was the more fiscally responsible option.",
        source: {
          label: "Portland Mercury · Clark on the two budget plans",
          url: "https://www.portlandmercury.com/news/a-budget-fix-a-mayors-influence-and-the-subtext-of-that-unsavory-banter-among-councilors/",
          kind: "Reporting",
          date: "July 24, 2026; updated July 27",
        },
      },
    },
    "Eric Zimmerman": {
      choice: "Smaller package only",
      action:
        "Voted against the larger restoration plan and for the smaller package funded from contingency reserves and other funds.",
      actionSource: julyAgenda,
    },
  },
  moda: {
    "Tiffany Koyama Lane": {
      choice: "Rejected the framework",
      action:
        "Backed higher rent and a required opportunity-cost report, then voted no on the amended term sheet.",
      reason: {
        label: "Her earlier stated concern · July 13",
        text: "Said she needed to know whether and how the deal would use the voter-approved climate fund before approving a term sheet.",
        source: {
          label: "OPB · Koyama Lane on the funding question",
          url: "https://www.opb.org/article/2026/07/13/portland-oregon-moda-center-sports-basketball/",
          kind: "Reporting",
          date: "July 13, 2026",
        },
      },
    },
    "Angelita Morillo": {
      choice: "Required more financial safeguards",
      action:
        "Co-proposed an opportunity-cost report before a financial vote. That amendment failed 6–6; she voted no on the framework.",
      reason: {
        label: "Why she said no",
        text: "Wanted the Blazers to stay, but said Council needed to know the funding source, what services would lose out and the public’s return before committing.",
        source: modaStatement,
      },
    },
    "Mitch Green": {
      choice: "Rejected the public cost",
      action:
        "Tried to remove the additional $275 million commitment for future capital needs. That amendment failed; he voted no on the framework.",
      reason: {
        label: "Why he said no",
        text: "Argued that the city was cutting basic services while offering a costly arena deal whose necessity and promised economic benefits had not been established.",
        source: modaStatement,
      },
    },
    "Steve Novick": {
      choice: "Raised the rent, then approved",
      action:
        "Won an amendment raising proposed annual rent from $2 million to $3.17 million, then voted for the framework.",
      reason: {
        label: "Why he said yes",
        text: "Called it a strong opening offer for negotiations and said he could accept a less demanding final deal.",
        source: {
          label: "Willamette Week · Novick’s explanation",
          url: "https://www.wweek.com/news/city/2026/08/12/council-approves-moda-center-term-sheet-to-kick-off-negotiations-with-blazers/",
          kind: "Reporting",
          date: "August 12, 2026",
        },
      },
    },
    "Olivia Clark": {
      choice: "Approved; opposed the rent increase",
      action:
        "Opposed Novick’s increase in proposed annual rent from $2 million to $3.17 million, then voted for the amended framework.",
      reason: {
        label: "Why she said yes",
        text: "Emphasized the state’s matching investment and said she did not want the city to lose that opportunity.",
        source: {
          label: "Portland Mercury · Clark’s explanation",
          url: "https://www.portlandmercury.com/news/portland-offers-blazers-a-fully-funded-arena-renovation-but-will-it-be-enough/",
          kind: "Reporting",
          date: "August 13, 2026; updated August 14",
        },
      },
    },
    "Eric Zimmerman": {
      choice: "Approved; opposed the rent increase",
      action:
        "Opposed Novick’s increase in proposed annual rent from $2 million to $3.17 million, then voted for the amended framework.",
      reason: {
        label: "His earlier stated case · April 30",
        text: "Argued that Portland should follow through on the state investment to support arena jobs, events, tourism and union construction work.",
        source: {
          label: "Zimmerman · April newsletter",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/4/30/april-newsletter-budget-season-moda-center",
          kind: "Candidate statement",
          date: "April 30, 2026",
        },
      },
    },
  },
  "data-centers": Object.fromEntries(
    [
      "Tiffany Koyama Lane",
      "Angelita Morillo",
      "Steve Novick",
      "Mitch Green",
      "Olivia Clark",
      "Eric Zimmerman",
    ].map((name) => [name, dataCenterVote]),
  ),
};

export type CouncilDisagreement = {
  id: string;
  label: string;
  decisionIds: string[];
  contrast: string;
  question: string;
  context: string;
  takeaway: string;
  sources: Evidence[];
  readings?: Record<string, TopicReading>;
};

export const councilDisagreements: CouncilDisagreement[] = [
  {
    id: "supplemental-budget",
    label: "Budget priorities",
    decisionIds: [
      "parks-police",
      "services-first",
      "oversight-funding",
      "novick-restorations",
      "annual-budget",
      "supplemental-budget",
    ],
    contrast:
      "They differed over which services to protect, how many jobs to restore and whether to use climate-fund interest, police-oversight funds or reserves.",
    question: "What did they protect when money ran short?",
    context:
      "Portland faced service cuts as the cost of maintaining its operations outpaced available revenue. The budget fights were about both what to preserve and how to pay for it. The broad Services First proposal used interest from the voter-created climate fund to restore police support, fire rescue, parks and other staff. Clark offered an alternative using expected police-oversight underspending; Novick offered a smaller climate-interest package. All three failed in June. Council revisited restorations in July and passed a smaller package using one-time funds.",
    takeaway:
      "Our reading: the dividing line was how broadly to restore services and which funds were available—not a simple choice between public safety and other services. Novick’s smaller climate-interest proposal and Koyama Lane’s rejection of July’s fallback are important exceptions.",
    sources: [julyAgenda, julyReporting],
    readings: budgetReadings,
  },
  {
    id: "zenith",
    label: "Zenith & climate oversight",
    decisionIds: [
      "zenith-investigation",
      "zenith-enforcement",
      "zenith-transfer",
    ],
    contrast:
      "Three distinct choices: investigate the old agreement, add public enforcement, and approve a transfer to the new owner.",
    question: "Who should enforce Zenith’s obligations?",
    context:
      "Zenith’s Northwest Portland fuel terminal uses pipelines in City streets under a franchise agreement. Council first debated whether the agreement had been properly granted, then whether to transfer it to a new owner and give residents a right to sue to enforce its terms. After the 2025 investigation request, City staff and an outside legal review reported in February 2026 that they found no basis to revoke the franchise. Green and Morillo’s later resident-enforcement amendment failed 6–6; the transfer failed 5–6. As of September 18, reconsideration was scheduled for September 23.",
    takeaway:
      "Our reading: supporting an investigation did not imply supporting citizen-suit enforcement. Clark and Zimmerman voted for the investigation but against that condition. The transfer remains unresolved; this was not a vote to close the terminal.",
    sources: [zenithInvestigationOutcome],
    readings: zenithReadings,
  },
  {
    id: "camp-removal",
    label: "Homelessness & removals",
    decisionIds: ["camp-removal", "housing-strategy", "homelessness-plan"],
    contrast:
      "A proposed $4.3 million shift from camp removals to personnel and social-service support.",
    question: "Shift spending away from clearing camps?",
    context:
      "The City funds both services for people without housing and operations that clear encampments. Morillo’s November 2025 amendment proposed moving $4.3 million from camp removals to personnel and social-service support. Koyama Lane and Green backed it; Novick opposed it; Clark and Zimmerman were absent. The amendment failed. All six nevertheless supported the broader unified housing strategy and the updated City–County homelessness plan, showing that agreement on overall goals did not resolve the choice about removals.",
    takeaway:
      "Our reading: this vote tests the role of camp removals in the homelessness response. Novick’s recorded objection focused on the rushed process and need for a policy debate. An absence supplies no yes/no position.",
    sources: [],
  },
  {
    id: "rental-pricing",
    label: "Housing & development",
    decisionIds: ["rental-pricing", "housing-fees", "homebuyer-income"],
    contrast:
      "A split over rent-setting regulation, alongside broad support for lowering upfront housing-development costs.",
    question: "Which rules help housing—and which discourage it?",
    context:
      "Council considered several ways to change the housing market: restrict software that coordinates rents, waive upfront infrastructure charges on new construction, and remove a buyer-income test for certain previously permitted homes receiving affordable-housing fee exemptions. These choices affect different people and different costs. The 2026 income-test change drew a new coalition: Morillo, Novick, Green and Clark supported it, while Koyama Lane and Zimmerman opposed it.",
    takeaway:
      "Our reading: support for building incentives does not predict every housing vote. Morillo and Green joined Koyama Lane on the rent-software ban, but split from her when Council removed the buyer-income test for a defined group of fee-exempt homes.",
    sources: [],
  },
  {
    id: "moda",
    label: "Moda & arts venues",
    decisionIds: ["moda", "performing-arts"],
    contrast:
      "Different coalitions on the arena negotiating framework and the PSU/Keller planning strategy.",
    question: "Which big projects—and on what terms?",
    context:
      "Council approved the non-binding Moda framework with a $120 million renovation commitment and $275 million for future capital needs over 20 years. A later resolution advanced PSU/Keller planning, without approving a full construction budget. Green opposed the arena framework but backed the arts planning resolution.",
    takeaway:
      "Our reading: votes against a particular deal do not establish opposition to all large public projects. Compare the size and stage of the commitment, the proposed rent, and the financial safeguards.",
    sources: [modaRecord],
  },
  {
    id: "detention-fees",
    label: "ICE & local authority",
    decisionIds: ["detention-fees"],
    contrast:
      "Clark joined Morillo, Green and Koyama Lane; Novick objected to the precedent; Zimmerman was absent.",
    question: "Charge detention-facility owners for local impacts?",
    context:
      "The ordinance created impact fees and nuisance rules for qualifying privately owned detention facilities. It did not close ICE’s facility. The lease-related fee applies on renewal; the separate nuisance provisions address harms such as chemical contamination.",
    takeaway:
      "Our reading: this split concerns which local tools to use against detention-related harms. Novick’s objection was about the precedent for charging landlords for protest impacts, not an endorsement of ICE operations.",
    sources: [],
  },
  {
    id: "shared-ground",
    label: "Where they agreed",
    decisionIds: ["business-tax", "data-centers"],
    contrast:
      "All six backed a larger small-business tax exemption and data-center disclosure with a call for future restrictions.",
    question: "What disappears if we show only conflict?",
    context:
      "In April 2026, all six supported expanding the business-license-tax exemption. In September, all six supported the final data-center resolution. The latter expressed intent to pursue restrictions; it did not itself enact a moratorium.",
    takeaway:
      "Agreement matters too. These actions do not distinguish the six incumbents on their final votes; differences elsewhere should not erase this shared ground.",
    sources: [],
  },
  ...additionalTopics,
];
