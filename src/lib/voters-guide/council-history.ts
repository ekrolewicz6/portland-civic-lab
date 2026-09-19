import type { CouncilDecision } from "./council-decisions";
import type { DecisionAccount } from "./council-record-accounts";
import type { Evidence } from "./types";

const names = [
  "Tiffany Koyama Lane",
  "Angelita Morillo",
  "Steve Novick",
  "Mitch Green",
  "Olivia Clark",
  "Eric Zimmerman",
];
type Vote = "Yes" | "No" | "Absent";
const votes = (...choices: Vote[]): Record<string, Vote> =>
  Object.fromEntries(names.map((name, i) => [name, choices[i]]));
const record = (label: string, url: string, date: string): Evidence => ({
  label,
  url,
  date,
  kind: "Public record",
});
const reporting = (label: string, url: string, date: string): Evidence => ({
  label,
  url,
  date,
  kind: "Reporting",
});
const budgetVotes = (page: number) =>
  record(
    `Clerk’s amendment roll call · PDF page ${page}`,
    `https://efiles.portlandoregon.gov/record/18024844/file/document/#page=${page}`,
    "June 10, 2026",
  );
const zenithRecord = record(
  "Zenith transfer · amendments and roll calls",
  "https://www.portland.gov/council/documents/ordinance/zenith-franchise-transfer-isq-holdings",
  "September 9–16, 2026; reviewed September 18",
);
const parksReporting = reporting(
  "Willamette Week · parks and police debate",
  "https://www.wweek.com/news/city/2025/05/22/just-before-midnight-the-city-council-votes-to-divert-19-million-in-new-funding-from-the-police-bureau-to-parks/",
  "May 22, 2025",
);
const campReporting = reporting(
  "OPB · camp-removal funding debate",
  "https://www.opb.org/article/2025/11/13/homeless-camp-removal-sweep-portland/",
  "November 13, 2025",
);
const detentionReporting = reporting(
  "OPB · detention facility debate",
  "https://www.opb.org/article/2025/12/03/portland-council-sanctions-detention-facilities/",
  "December 3, 2025; updated December 4",
);
export const zenithInvestigationOutcome = record(
  "City investigation and outside legal review · findings",
  "https://www.portland.gov/hello/news/2026/2/19/investigation-zenith-energy-franchise-agreement-finds-city-upheld-law-and",
  "February 19, 2026",
);

export const historicalDecisions: CouncilDecision[] = [
  {
    id: "parks-police",
    title: "Move proposed new police funding to parks",
    voteLabel: "Budget amendment",
    summary:
      "Avalos 1 redirected about $1.9 million of proposed new police funding to parks maintenance. Passed 7–5 in the May 2025 preliminary budget process.",
    limit:
      "This was a choice about a proposed increase, not a vote to lay off existing officers. The police chief warned it would affect recruitment and services; supporters disputed the staffing impact.",
    source: record(
      "May 21 budget · clerk’s amendment roll calls",
      "https://efiles.portlandoregon.gov/record/17392841/file/document/",
      "May 21, 2025",
    ),
    votes: votes("Yes", "Yes", "Yes", "Yes", "No", "No"),
  },
  {
    id: "services-first",
    title: "Use climate-fund interest for broad service restoration",
    voteLabel: "Budget amendment",
    summary:
      "The Services First amendment used about $16 million in climate-fund interest, plus other funds, for parks, unarmed police support, fire rescue and core city staff. Failed 6–6.",
    limit:
      "The final amendment used $16,034,349 in PCEF interest. Early promotional material described a $16.5 million version. This package included public-safety services as well as other jobs.",
    source: budgetVotes(58),
    votes: votes("Yes", "Yes", "No", "Yes", "No", "No"),
  },
  {
    id: "oversight-funding",
    title: "Use expected police-oversight underspending for public safety",
    voteLabel: "Budget amendment",
    summary:
      "Clark 2 proposed $7.68 million for police support, training and fire rescue: draw contingency now, then replenish it with expected police-accountability office underspending in spring 2027. Failed 5–6, with one absent.",
    limit:
      "The tradeoff concerned using money allocated to the new oversight office. The proposal did not abolish that office, and expected underspending was a forecast.",
    source: budgetVotes(59),
    votes: votes("No", "No", "Yes", "No", "Yes", "Yes"),
  },
  {
    id: "novick-restorations",
    title: "Use a smaller amount of climate interest for selected restorations",
    voteLabel: "Budget amendment",
    summary:
      "Pirtle-Guiney–Novick 4 proposed $8.42 million in climate-fund interest for selected restorations and a business-tax reserve, alongside other funding. Failed 3–8, with one absent.",
    limit:
      "This was a separate package from Services First and Clark 2. It included police training, 12 unarmed support positions, fire rescue, gardens, worker benefits and selected core staff.",
    source: budgetVotes(60),
    votes: votes("No", "No", "Yes", "No", "No", "No"),
  },
  {
    id: "annual-budget",
    title: "Adopt the 2026–27 annual budget",
    voteLabel: "Final adoption",
    summary:
      "After the competing restoration amendments failed, the annual budget passed 9–2, with one abstention. Zimmerman was the only no among these six incumbents.",
    limit:
      "Adopting the overall budget did not mean endorsing every cut. Council returned to service restorations in July.",
    source: record(
      "Ordinance 192195 · annual budget and final roll call",
      "https://www.portland.gov/council/documents/ordinance/passed/192195",
      "June 17, 2026",
    ),
    votes: votes("Yes", "Yes", "Yes", "Yes", "Yes", "No"),
  },
  {
    id: "zenith-investigation",
    title: "Demand an investigation of Zenith’s franchise",
    voteLabel: "Resolution vote",
    summary:
      "Resolution 37702 sought investigation of potential franchise violations and City permitting, with administrative pauses where legally available. Passed 11–1; Novick voted no.",
    limit:
      "In February 2026, the City’s investigation, reviewed by outside counsel, reported no basis for franchise revocation. The 2025 allegations are not findings of wrongdoing.",
    source: record(
      "Resolution 37702 · investigation and amendments",
      "https://www.portland.gov/council/documents/resolution/adopted/37702",
      "March 19, 2025",
    ),
    votes: votes("Yes", "Yes", "No", "Yes", "Yes", "Yes"),
  },
  {
    id: "zenith-enforcement",
    title: "Give residents a right to enforce Zenith’s franchise in court",
    voteLabel: "Amendment vote",
    summary:
      "Green–Morillo 1 would condition the transfer on allowing residents to sue to enforce the franchise. Failed 6–6.",
    limit:
      "A proposed additional enforcement mechanism for the pipeline franchise—not a vote on the state air permit or a citywide fossil-fuel ban.",
    source: { ...zenithRecord, date: "September 9, 2026" },
    votes: votes("Yes", "Yes", "No", "Yes", "No", "No"),
  },
  {
    id: "zenith-transfer",
    title: "Transfer Zenith’s pipeline franchise to the new owner",
    voteLabel: "September 16 vote",
    summary:
      "The transfer to ISQ Springer Holdings failed 5–6, with one absent. A motion to reconsider remained pending as of September 18, with the next discussion scheduled for September 23.",
    limit:
      "This is an unresolved decision. The proposal transfers the existing franchise obligations; it does not itself grant a new air permit or stop terminal operations.",
    source: zenithRecord,
    votes: votes("No", "No", "Yes", "No", "Yes", "Yes"),
  },
  {
    id: "camp-removal",
    title: "Shift funding away from homeless-camp removals",
    voteLabel: "Budget amendment",
    summary:
      "Morillo 1 proposed reducing the Impact Reduction Program by about $4.3 million within a package supporting personnel, housing, food and immigration services. Failed with five yes, three no and four absent.",
    limit:
      "This was a spending amendment, not a vote to repeal the criminal camping ban. Green’s related Ground Score amendment did not take effect because the parent proposal failed.",
    source: record(
      "Fall budget · Morillo 1 amendment roll call",
      "https://www.portland.gov/council/documents/ordinance/fy-2025-26-fall-supplemental-budget",
      "November 12, 2025",
    ),
    votes: votes("Yes", "Yes", "No", "Yes", "Absent", "Absent"),
  },
  {
    id: "detention-fees",
    title: "Create impact fees and nuisance rules for detention facilities",
    voteLabel: "Final ordinance vote",
    summary:
      "The detention-facility ordinance passed 9–2, with Zimmerman absent. Clark joined Koyama Lane, Morillo and Green in support; Novick opposed it.",
    limit:
      "The ordinance did not close ICE’s facility. The lease-related fee would apply on renewal; nuisance rules and fee implementation have separate requirements.",
    source: record(
      "Detention-facility ordinance · adopted text and roll call",
      "https://www.portland.gov/council/documents/ordinance/detention-facility-impact-fee-protect-taxpayers",
      "December 3, 2025",
    ),
    votes: votes("Yes", "Yes", "No", "Yes", "Yes", "Absent"),
  },
  {
    id: "housing-fees",
    title: "Temporarily waive infrastructure charges on new housing",
    voteLabel: "Final ordinance vote",
    summary:
      "Ordinance 192082 created a temporary waiver of infrastructure charges for qualifying housing, aimed at encouraging 5,000 new homes. Passed 10–0; Clark and Smith were absent.",
    limit:
      "A shared vote among the five incumbents present. Reducing development costs trades potential infrastructure revenue for an incentive to build; the vote does not establish how many homes it produced.",
    source: record(
      "Ordinance 192082 · housing fee waiver",
      "https://www.portland.gov/council/documents/ordinance/passed/192082",
      "July 16, 2025",
    ),
    votes: votes("Yes", "Yes", "Yes", "Yes", "Absent", "Yes"),
  },
  {
    id: "business-tax",
    title: "Expand the small-business tax exemption",
    voteLabel: "Final ordinance vote",
    summary:
      "Ordinance 192163 raised the gross-receipts exemption threshold from $50,000 to $75,000 for 2026 and $100,000 for 2027. Passed 11–0, including all six incumbents.",
    limit:
      "The threshold concerns gross receipts, not a tax-free profit allowance. The City forecast reduced revenue; unanimous support does not settle how to replace that revenue.",
    source: record(
      "Ordinance 192163 · exemption thresholds and roll call",
      "https://www.portland.gov/council/documents/ordinance/passed/192163",
      "April 8, 2026",
    ),
    votes: votes("Yes", "Yes", "Yes", "Yes", "Yes", "Yes"),
  },
  {
    id: "performing-arts",
    title: "Advance PSU and Keller performing-arts planning",
    voteLabel: "Resolution vote",
    summary:
      "Resolution 37752 advanced a new Broadway-capable venue at PSU and planning for a smaller Keller Auditorium. Passed 8–4; Green joined Clark, Novick and Zimmerman in support.",
    limit:
      "This authorizes further planning and staff work, not the full construction budget or a final financing deal.",
    source: record(
      "Resolution 37752 · arts venues and roll call",
      "https://www.portland.gov/council/documents/resolution/adopted/37752",
      "September 9, 2026",
    ),
    votes: votes("No", "No", "Yes", "Yes", "Yes", "Yes"),
  },
];

const account = (
  choice: string,
  action: string,
  reason?: DecisionAccount["reason"],
): DecisionAccount => ({ choice, action, ...(reason ? { reason } : {}) });
const rows = (...items: DecisionAccount[]): Record<string, DecisionAccount> =>
  Object.fromEntries(names.map((name, i) => [name, items[i]]));
const reason = (text: string, source: Evidence): DecisionAccount["reason"] => ({
  label: "Their stated case",
  text,
  source,
});
const backServices = account(
  "Restore a broad set of services",
  "Backed Services First: climate-fund interest and other funds for parks, fire rescue, unarmed police support and core city staff.",
);
const rejectServices = account(
  "Rejected the larger climate-interest package",
  "Voted no on Services First. Compare the separate funding proposals below to see which alternatives this councilor supported.",
);
const protectOversight = account(
  "Keep the oversight funding in place",
  "Rejected using expected police-accountability office underspending to reimburse the public-safety restoration package.",
);
const useOversight = account(
  "Use expected oversight underspending",
  "Supported the $7.68 million plan for police support, training and fire rescue, backed by expected underspending in the oversight office.",
);
const investigate = account(
  "Backed the investigation",
  "Voted to request investigation of the franchise and City permitting process.",
);
const citizenEnforcement = account(
  "Add residents’ right to sue",
  "Supported making residents able to enforce the franchise in court as a condition of transfer.",
);
const rejectCitizen = account(
  "Rejected the resident-enforcement amendment",
  "Voted against adding the citizen-suit condition to the franchise transfer.",
);
const approveTransfer = account(
  "Approve the transfer",
  "Voted to transfer the existing pipeline franchise to ISQ Springer Holdings after the citizen-suit amendment failed.",
);
const rejectTransfer = account(
  "Reject the transfer as presented",
  "Voted against the transfer after supporting the failed citizen-suit amendment. Reconsideration remained pending.",
);
const shiftCamps = account(
  "Move money from removals to other services",
  "Backed Morillo’s spending shift away from the camp-removal program toward personnel and social-service support.",
);
const absentCamp = account(
  "Absent on the amendment",
  "Did not cast a yes or no vote on Morillo 1. Earlier discussion and the later overall budget vote are different actions.",
);
const supportFee = account(
  "Backed detention-facility fees",
  "Voted for the impact-fee and nuisance ordinance applying to qualifying private detention facilities.",
);
const waiveFees = account(
  "Backed the temporary housing fee waiver",
  "Voted to lower upfront development costs for qualifying new housing through a temporary waiver of infrastructure charges.",
);
const taxCut = account(
  "Backed the higher exemption threshold",
  "Voted to exempt more small businesses from the business license tax.",
);
const artsYes = account(
  "Advance the PSU/Keller plan",
  "Voted to advance PSU venue development work and planning for a smaller Keller Auditorium.",
);
const artsNo = account(
  "Rejected this planning direction",
  "Voted against the resolution advancing the PSU venue and smaller-Keller planning strategy.",
);
export const historicalAccounts: Record<
  string,
  Record<string, DecisionAccount>
> = {
  "parks-police": rows(
    account(
      "Put the proposed increase into parks",
      "Voted to redirect the proposed new police allocation to parks maintenance.",
    ),
    account(
      "Put the proposed increase into parks",
      "Seconded and supported Avalos’ parks amendment.",
      reason(
        "Distinguished redirecting an increase from laying off officers and pointed to funded police vacancies.",
        parksReporting,
      ),
    ),
    account(
      "Put the proposed increase into parks",
      "Supported the parks amendment despite wanting a larger police budget.",
      reason(
        "Said he could not accept increasing police funding while parks maintenance faced deep cuts.",
        parksReporting,
      ),
    ),
    account(
      "Put the proposed increase into parks",
      "Voted to redirect the proposed new police allocation to parks maintenance.",
    ),
    account(
      "Keep the proposed police increase",
      "Voted against transferring the proposed police allocation to parks.",
      reason(
        "Said the transfer would send the wrong signal to Portlanders.",
        parksReporting,
      ),
    ),
    account(
      "Keep the proposed police increase",
      "Voted against transferring the proposed police allocation to parks.",
      reason(
        "Prioritized police staffing and argued that parks could be funded through other proposals.",
        parksReporting,
      ),
    ),
  ),
  "services-first": rows(
    backServices,
    {
      ...backServices,
      action:
        "Co-proposed Services First with Green and Avalos, then voted for it.",
    },
    rejectServices,
    {
      ...backServices,
      action: "Co-proposed and moved Services First, then voted for it.",
    },
    rejectServices,
    rejectServices,
  ),
  "oversight-funding": rows(
    protectOversight,
    protectOversight,
    useOversight,
    protectOversight,
    {
      ...useOversight,
      choice: "Proposed using oversight underspending",
      reason: reason(
        "Her amendment argued that projected unspent oversight funding could restore police and fire services while meeting the adopted-budget charter requirement.",
        record(
          "Clark 2 · amendment text, PDF page 9",
          "https://efiles.portlandoregon.gov/record/18024844/file/document/#page=9",
          "June 10, 2026",
        ),
      ),
    },
    useOversight,
  ),
  "novick-restorations": rows(
    account(
      "Rejected this smaller package",
      "Voted no on Pirtle-Guiney–Novick 4 after supporting Services First.",
    ),
    account(
      "Rejected this smaller package",
      "Voted no on Pirtle-Guiney–Novick 4 after supporting Services First.",
    ),
    account(
      "Proposed the smaller climate-interest plan",
      "Co-proposed and moved the $8.42 million climate-interest package after voting against Services First.",
    ),
    account(
      "Rejected this smaller package",
      "Voted no on Pirtle-Guiney–Novick 4 after supporting Services First.",
    ),
    account(
      "Rejected this climate-interest alternative",
      "Voted no on Pirtle-Guiney–Novick 4 after backing the oversight-funding proposal.",
    ),
    account(
      "Rejected this climate-interest alternative",
      "Voted no on Pirtle-Guiney–Novick 4 after backing the oversight-funding proposal.",
    ),
  ),
  "annual-budget": Object.fromEntries(
    names.map((name) => [
      name,
      name === "Eric Zimmerman"
        ? account(
            "Rejected the overall budget",
            "Voted no on the final annual budget; later supported the July service-restoration package.",
          )
        : account(
            "Adopted the overall budget",
            "Voted yes on the final annual budget after the competing restoration amendments failed.",
          ),
    ]),
  ),
  "zenith-investigation": rows(
    investigate,
    investigate,
    account(
      "Rejected the investigation resolution",
      "Supported removing disputed preamble language and attachments, then cast the sole no on the amended resolution.",
    ),
    investigate,
    account(
      "Requested revisions, then backed investigation",
      "Supported removing disputed preamble language and attachments. Those changes failed; she still voted for the final resolution.",
    ),
    account(
      "Requested revisions, then backed investigation",
      "Moved to remove disputed preamble language and attachments. Those changes failed; he still voted for the final resolution.",
    ),
  ),
  "zenith-enforcement": rows(
    citizenEnforcement,
    {
      ...citizenEnforcement,
      action:
        "Co-proposed and seconded the resident-enforcement amendment with Green.",
    },
    rejectCitizen,
    {
      ...citizenEnforcement,
      action:
        "Co-proposed and moved the resident-enforcement amendment with Morillo.",
    },
    rejectCitizen,
    rejectCitizen,
  ),
  "zenith-transfer": rows(
    rejectTransfer,
    rejectTransfer,
    approveTransfer,
    rejectTransfer,
    approveTransfer,
    approveTransfer,
  ),
  "camp-removal": rows(
    shiftCamps,
    {
      ...shiftCamps,
      choice: "Proposed the shift away from removals",
      reason: reason(
        "Argued that repeated removals and overnight shelter were insufficient and that the city should change its approach.",
        campReporting,
      ),
    },
    account(
      "Rejected the spending shift",
      "Voted no on Morillo 1.",
      reason(
        "Objected to making a major policy change with five days to review it; wanted a detailed policy discussion before cutting the program.",
        campReporting,
      ),
    ),
    {
      ...shiftCamps,
      reason: reason(
        "Argued that camp removals were ineffective and inflicted further harm on people living outside.",
        campReporting,
      ),
    },
    absentCamp,
    absentCamp,
  ),
  "detention-fees": rows(
    supportFee,
    {
      ...supportFee,
      choice: "Introduced the fees and nuisance rules",
      reason: reason(
        "Argued that Portland should use the limited tools available to local government to respond to detention facilities.",
        detentionReporting,
      ),
    },
    account(
      "Opposed the fee precedent",
      "Voted no on the ordinance.",
      reason(
        "Questioned penalizing landlords for protest-related costs and whether the same rule would be acceptable outside an abortion clinic.",
        detentionReporting,
      ),
    ),
    supportFee,
    supportFee,
    account(
      "Absent on the final ordinance",
      "Did not cast a vote on the adopted ordinance.",
    ),
  ),
  "housing-fees": rows(
    waiveFees,
    waiveFees,
    waiveFees,
    waiveFees,
    account(
      "Absent on the final ordinance",
      "Did not cast a vote on the adopted housing fee waiver.",
    ),
    waiveFees,
  ),
  "business-tax": rows(taxCut, taxCut, taxCut, taxCut, taxCut, {
    ...taxCut,
    choice: "Co-sponsored the higher exemption",
    action:
      "Co-sponsored the ordinance and moved an amendment before voting for the final exemption expansion.",
  }),
  "performing-arts": rows(
    artsNo,
    artsNo,
    artsYes,
    {
      ...artsYes,
      action:
        "Backed the PSU/Keller planning resolution after voting against the Moda negotiating framework in August.",
    },
    artsYes,
    artsYes,
  ),
};

export type TopicReading = { headline: string; text: string };
const reading = (headline: string, text: string): TopicReading => ({
  headline,
  text,
});
export const budgetReadings: Record<string, TopicReading> = Object.fromEntries(
  names.map((name, i) => [
    name,
    [
      reading(
        "Broad service restoration; rejected July’s fallback",
        "Backed parks over the proposed police increase in 2025 and the larger climate-interest plan in 2026. Rejected using oversight funds. Unlike Morillo and Green, voted no on July’s smaller restoration package.",
      ),
      reading(
        "Broad restorations, with oversight funds protected",
        "Backed parks over the proposed police increase, co-proposed Services First and rejected using oversight funds. After the larger July plan failed, accepted the smaller package while warning against later tapping oversight money.",
      ),
      reading(
        "Different funding routes for selected services",
        "Joined the parks shift in 2025. In June 2026, rejected Services First but proposed a smaller climate-interest package and supported the oversight-funding option. Backed July’s smaller restoration plan.",
      ),
      reading(
        "Broad restorations, then a smaller compromise",
        "Backed the parks shift, co-proposed Services First and rejected using oversight funds. In July, backed the larger restoration plan, then the smaller fallback when the larger plan failed.",
      ),
      reading(
        "Police and fire restorations; oversight money available",
        "Opposed shifting the proposed police increase to parks. Proposed using expected oversight underspending for police and fire services. Rejected both June climate-interest packages; backed the smaller July restoration plan.",
      ),
      reading(
        "Protect police funding; reject the annual budget",
        "Opposed shifting the proposed police increase to parks. Backed using expected oversight underspending and rejected both June climate-interest packages. Voted no on the annual budget, then yes on July’s smaller restoration plan.",
      ),
    ][i],
  ]),
);
export const zenithReadings: Record<string, TopicReading> = Object.fromEntries(
  names.map((name, i) => [
    name,
    [
      reading(
        "Investigation + resident enforcement",
        "Backed the 2025 investigation and the 2026 citizen-suit amendment. Rejected the transfer after that amendment failed.",
      ),
      reading(
        "Co-proposed resident enforcement",
        "Backed the investigation, co-proposed the citizen-suit condition and rejected the transfer without it.",
      ),
      reading(
        "No on investigation; yes on transfer",
        "Tried to remove disputed language in 2025, then rejected the investigation resolution. Opposed citizen-suit enforcement and supported the 2026 transfer.",
      ),
      reading(
        "Co-proposed resident enforcement",
        "Backed the investigation, co-proposed the citizen-suit condition and rejected the transfer without it.",
      ),
      reading(
        "Investigation yes; citizen-suit condition no",
        "Sought revisions but backed the 2025 investigation. Opposed the resident-enforcement amendment and supported the 2026 transfer.",
      ),
      reading(
        "Investigation yes; citizen-suit condition no",
        "Sought revisions but backed the 2025 investigation. Opposed the resident-enforcement amendment and supported the 2026 transfer.",
      ),
    ][i],
  ]),
);
