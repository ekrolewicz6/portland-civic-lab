import type { Evidence } from "./types";

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

export const councilDisagreements = [
  {
    id: "supplemental-budget",
    label: "Saving city jobs",
    contrast:
      "A 55-job restoration plan versus a smaller, 30-position package.",
    question: "How much to restore—and which funding to use?",
    context:
      "The larger plan would save 55 jobs using climate-fund interest and other money. It failed after the mayor broke a 6–6 tie. A smaller package preserving 30 positions then passed 10–2, using contingency reserves and other funds.",
    takeaway:
      "The final yes/no hides the choice between the two packages. Read both votes together.",
    sources: [julyAgenda, julyReporting],
  },
  {
    id: "moda",
    label: "The Moda deal",
    contrast:
      "A split over public cost, proposed rent and financial safeguards.",
    question: "What should Portland demand for its investment?",
    context:
      "Council approved a non-binding negotiating framework: $120 million for renovation plus $275 million for future capital needs over 20 years. The split also ran through amendments on rent and financial oversight.",
    takeaway:
      "Supporting negotiations did not mean agreeing on the price. Rejecting this framework did not mean wanting the Blazers to leave.",
    sources: [modaRecord],
  },
  {
    id: "rental-pricing",
    label: "Rent-setting software",
    contrast: "A ban on software that coordinates landlords’ rental prices.",
    question: "Regulate coordinated rent-setting?",
    context:
      "Council restricted software that coordinates rental pricing among landlords. The ordinance passed 8–2 on November 19, 2025. Two councilors were absent.",
    takeaway:
      "This is a split over a specific housing regulation. An absence is shown separately from opposition.",
    sources: [],
  },
];
