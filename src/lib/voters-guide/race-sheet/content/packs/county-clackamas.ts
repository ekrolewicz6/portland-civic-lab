import type { Evidence } from "../../../types";
import type {
  CandidateAnalysis,
  Delivery,
  DeliveryStep,
  ExtraTopic,
  IssueLine,
  RaceStakes,
  RaceTopics,
  StanceChip,
  TopicStance,
} from "../../types";
import type { IssueId } from "../../issues";
import type { OwnWords } from "../own-words";
import { emptyPack, type RacePack } from "../../types";

/**
 * Race pack: Clackamas County offices (Clerk, Treasurer, Sheriff, Commissioner
 * Positions 2 and 4). Filled by research on September 21, 2026 from the
 * November 2026 Clackamas County voters’ pamphlet (PDF pages 14–18, read with
 * pdftotext), each campaign site the statement prints, and the county’s
 * published candidate filings (SEL 101) for the two candidates whose
 * statement prints no channel. Every entry names its source; gaps stay gaps.
 *
 * Venues reviewed September 21, 2026:
 *   https://clackamasvoice.org/ (+ /priorities/, /getinvolved/, /meet-catherine/)
 *   https://www.markforcountyclerk.com/ (+ /solutions, /contact, /about)
 *   https://www.oneilforsheriff.com/ (+ /brads-priorities/, /vision/, /get-involved/)
 *   https://www.electsheriffrhodes.com/ (+ /theplan, /getinvolved, /meetyoursheriff)
 *   https://electpaulsavas.com/ (+ /issues/, three 2026 posts)
 *   https://friendsofremysmith.org/ (+ /policies/, /about/)
 *   https://www.votedianahelm.com/
 *   Nava and Shull print no site; their county filings were read instead.
 */

const PAMPHLET = "https://docs.clackamas.us/documents/drupal/03f4f9db-a1ab-4a1f-9ce1-16059d49a513";
const ELECTIONS = "https://www.clackamas.us/elections";
const REVIEWED_ON = "2026-09-21";
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const pamphlet = (page: number): Evidence => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 21, 2026",
  note: NOTE,
});

const site = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note: NOTE,
});

const filing = (label: string, url: string, date: string, note: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note,
});

const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

const line = (candidateId: string, issue: IssueId, text: string): IssueLine => ({
  candidateId,
  issue,
  line: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const chip = (candidateId: string, issue: IssueId, text: string): StanceChip => ({
  candidateId,
  issue,
  chip: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });

const delivery = (
  candidateId: string,
  issue: IssueId,
  rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {},
): Delivery => ({ candidateId, issue, ...rungs, ...reviewed });

const pamphletOpening = (page: number, note: string): OwnWords["source"] => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; extracted September 21, 2026",
  note: `${note} Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.`,
});

const portrait = (id: string, page: number) => ({
  src: `/images/voters-guide/2026/${id}.webp`,
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Clackamas County voters’ pamphlet",
  reviewed: REVIEWED_ON,
});

const electionsPage: Evidence = {
  label: "Clackamas County Elections · November 3, 2026 General Election",
  url: ELECTIONS,
  kind: "Election authority",
  date: "Checked September 21, 2026",
};

/* Sources reused across entries. */
const mcmullenPriorities = site("McMullen · priorities", "https://clackamasvoice.org/priorities/");
const reaksSolutions = site("Reaksecker · solutions", "https://www.markforcountyclerk.com/solutions");
const oneilPriorities = site("O’Neil · priorities", "https://www.oneilforsheriff.com/brads-priorities/");
const oneilVision = site("O’Neil · vision and first 100 days", "https://www.oneilforsheriff.com/vision/");
const rhodesPlan = site("Rhodes · the plan", "https://www.electsheriffrhodes.com/theplan");
const savasIssues = site("Savas · issues", "https://electpaulsavas.com/issues/");
const savasHousing = site(
  "Savas · 968 affordable housing units delivered (March 27, 2026)",
  "https://electpaulsavas.com/968-affordable-housing-units-delivered/",
);
const savasHomeless = site(
  "Savas · real solutions on homelessness and mental health (April 9, 2026)",
  "https://electpaulsavas.com/real-solutions-on-homelessness-and-mental-health/",
);
const savasDataCenters = site(
  "Savas · pausing data centers (September 18, 2026)",
  "https://electpaulsavas.com/pausing-data-centers/",
);
const smithPolicies = site("Smith · policies", "https://friendsofremysmith.org/policies/");
const smithHome = site("Smith · home page", "https://friendsofremysmith.org/");
const helmHome = site("Helm · home page", "https://www.votedianahelm.com/");
const helmEmail: Evidence = {
  label: "Helm · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#helm-2026-09-25",
  kind: "Candidate statement",
  date: "Received September 25, 2026",
  note: "Written by the candidate in reply to the Lab’s questions and kept on file; the answers are quoted on the brief. Receipt does not verify the claims.",
};

/* ── Topics, stances and stakes ─────────────────────────────────────── */
/*
 * Office-specific comparison topics for the five Clackamas races, each
 * candidate's explicit stance, and the sourced facts behind each office.
 * Researched September 21–22, 2026. County facts come from policy-session
 * worksheets and agendas on clackamas.us / docs.clackamas.us and the FY
 * 2026-27 budget document; questionnaire answers are the candidates' own
 * written replies to OPB (May 2026). A stance is recorded only where the
 * candidate's own material speaks to the choice the topic asks about.
 */
const DEPTH_REVIEWED = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;
const record = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Public record",
  date,
  ...(note ? { note } : {}),
});
const reporting = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Reporting",
  date,
  ...(note ? { note } : {}),
});
const questionnaire = (name: string, url: string): Evidence => ({
  label: `${name} · OPB candidate questionnaire (written answers, published May 2026)`,
  url,
  kind: "Candidate statement",
  date: "Published by OPB in May 2026; read September 21, 2026",
  note: "The candidate's own written answers to OPB's questions, published as a PDF alongside OPB's race preview.",
});
const stance = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chipText: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip: chipText, text, source, ...DEPTH_REVIEWED });

/* Shared public-record and reporting sources. */
const levyWorksheetJul23 = record(
  "Clackamas County · Public Safety Levy Research & Next Steps (policy session memorandum)",
  "https://docs.clackamas.us/documents/drupal/60e03697-d523-4d02-a260-bcfeeeed0b2c",
  "July 23, 2026",
  "Measure 3-633 failed 62.13% no to 37.87% yes on 44.86% turnout; the current levy expires at the end of 2026; options were a November 2026 or May 2027 referral.",
);
const dataCenterWorksheetAug11 = record(
  "Clackamas County · Data Center Potential Policy Options (Issues & Updates memorandum)",
  "https://docs.clackamas.us/documents/drupal/83d5a6c6-6bbe-492d-8458-1e179a92d53a",
  "August 11, 2026",
  "Staff recommended Option 5, waiting for the 2027 session; the memo sets out the moratorium process (45-day DLCD notice, 120-day limit, one six-month extension).",
);
const proposedBudget2627 = record(
  "Clackamas County · FY 2026-27 Proposed Budget (budget message and department summaries)",
  "https://docs.clackamas.us/documents/drupal/49cbf9fc-076e-4d24-afed-c05582f57b37",
  "May 2026; read September 21, 2026",
  "All-county total $1,996,903,715; General Fund Support $195.5 million; 2,495.3 FTE, down 20.5 from the FY 2025-26 adopted budget.",
);
const recoveryCampusNotice = record(
  "Clackamas County · Notice of public hearing on a financing for the Recovery Campus",
  "https://www.clackamas.us/news/2026-09-10/notice-of-public-hearing-with-respect-to-the-issuance-of-a-financing-by-clackamas-county-oregon",
  "September 10, 2026 (hearing September 17, 2026)",
);
const businessAug13 = record(
  "Clackamas County · Board of County Commissioners business meeting agenda, August 13, 2026",
  "https://www.clackamas.us/meetings/bcc/business/2026-08-13",
  "August 13, 2026",
);
const electionsNov2026 = record(
  "Clackamas County Elections · November 3, 2026 General Election (candidates and measures)",
  ELECTIONS + "/november-3-2026-general-election",
  "Checked September 21, 2026",
);
const sosSecurity = record(
  "Oregon Secretary of State · Election Integrity",
  "https://sos.oregon.gov/elections/Pages/security.aspx",
  "Checked September 21, 2026",
);
const treasurerPage = record("Clackamas County · Treasurer", "https://www.clackamas.us/treasurer", "Checked September 21, 2026");
const reviewMay2027 = reporting(
  "Milwaukie Review (Pamplin) · Clackamas County planning to wait until next May for public safety funding vote",
  "https://milwaukiereview.com/2026/07/29/clackamas-county-planning-to-wait-until-next-may-for-public-safety-funding-vote/",
  "July 29, 2026",
);
const yonLevyJune4 = reporting(
  "Your Oregon News (Pamplin) · After failure of public safety levy, Clackamas County goes back to the drawing board",
  "https://youroregonnews.com/2026/06/04/after-failure-of-public-safety-levy-clackamas-county-goes-back-to-the-drawing-board/",
  "June 4, 2026",
  "Reported statement; quotes as printed by Your Oregon News from the June 2, 2026 policy session.",
);
const opbSheriffAppointed = reporting(
  "OPB · Clackamas County appoints interim sheriff in wake of surprise mid-term resignation",
  "https://www.opb.org/article/2026/07/28/clackamas-county-sheriffs-office-rhodes/",
  "July 28, 2026",
);
const opbBallots2022 = reporting(
  "OPB · Clackamas County clerk blames multiple election mistakes on outside vendors",
  "https://www.opb.org/article/2022/08/11/clackamas-county-oregon-clerk-sherry-hall-election-mistakes-blame/",
  "August 11, 2022",
);
const dorDeferral = record(
  "Oregon Department of Revenue · Senior and Disabled Property Tax Deferral Program",
  "https://www.oregon.gov/dor/programs/property/pages/senior-and-disabled-property-tax-deferral-program.aspx",
  "Checked September 21, 2026",
);
const budgetAdoptedJun17 = record(
  "Clackamas County · Board of County Commissioners business meeting, June 17, 2026 (item 13.1, FY 2026-27 budget adoption; agenda, minutes and resolution)",
  "https://www.clackamas.us/meetings/bcc/business/2026-06-17",
  "June 17, 2026",
  "Minutes: Commissioner Savas moved, Commissioner Helm seconded, passed 5–0. Resolution: total budget $1,528,305,199, appropriations $1,401,336,042, General Fund Support $198,116,517.",
);
const courthousePage = record("Clackamas County · Courthouse (project budget and payments)", "https://www.clackamas.us/courthouse", "Checked September 21, 2026");
const recoveryGroundbreaking = record(
  "Clackamas County · Clackamas County Recovery Campus breaks ground",
  "https://www.clackamas.us/news/2026-07-29/clackamas-county-recovery-campus-breaks-ground",
  "July 29, 2026",
);
const clerkCertifies = record(
  "Clackamas County · Clerk McMullen certifies May 19, 2026 Primary Election",
  "https://www.clackamas.us/news/2026-06-12/clerk-mcmullen-certifies-may-19-2026-primary-election",
  "June 12, 2026",
);
const jailDashboard = record(
  "Clackamas County Sheriff's Office · Forced Release Dashboard",
  "https://www.clackcosheriff.us/forcedReleaseDashboard",
  "Checked September 21, 2026",
);
const acfr2025 = record(
  "Clackamas County · Annual Comprehensive Financial Report, fiscal year ended June 30, 2025 (notes 3 and on the courthouse financing)",
  "https://docs.clackamas.us/documents/drupal/0089609e-9d67-4cae-8afc-1bd63f079055",
  "Fiscal year ended June 30, 2025; read September 21, 2026",
);
const ocnLevyReferral = reporting(
  "Oregon City News (Pamplin) · Clackamas County to move forward with public safety levy for May election",
  "https://oregoncitynewsonline.com/2026/02/11/clackamas-county-to-move-forward-with-public-safety-levy-for-may-election/",
  "February 11, 2026",
  "Reported statement; quotes as printed by Oregon City News (Mac Larsen) from the February 10, 2026 session.",
);
const kptvLevy = reporting(
  "KPTV · Sheriff releases statement after Clackamas County public safety levy fails",
  "https://www.kptv.com/2026/05/20/sheriff-releases-statement-after-clackamas-county-public-safety-levy-fails/",
  "May 20, 2026",
);
const kxlMoratorium = reporting(
  "KXL · Clackamas County initiates process to enact moratorium on data centers",
  "https://www.kxl.com/home/clackamas-county-initiates-process-to-enact-moratorium-on-data-centers/",
  "August 11, 2026",
);

/* The boards. Commission topics first; the sheriff, clerk and treasurer get shorter lists their candidates have addressed. */
const commissionTopics: ExtraTopic[] = [
  {
    id: "clack-levy-2027",
    label: "Public safety levy retry",
    short: "Levy retry",
    question: "Ask voters again for a public safety levy in May 2027, and at what rate?",
    context:
      "Measure 3-633, which would have raised the levy from 36 to 53.4 cents per $1,000 of assessed value, failed 62.16% to 37.84% on May 19, 2026. The current levy, which funds 84 jail beds, 26 medical and mental-health beds, 36 jail deputies, 34 patrol deputies, five detectives and body cameras, expires December 31, 2026; on July 28 the Board chose a May 2027 referral over November 2026.",
  },
  {
    id: "clack-data-centers",
    label: "Data-center moratorium",
    short: "Data centers",
    question: "Adopt a county moratorium on data centers now, or wait for the 2027 Legislature as staff recommended?",
    context:
      "No data center has been built in unincorporated Clackamas County, where industrial and business-park zones allow them. On August 11, 2026 staff recommended waiting for the 2027 session; the Board voted unanimously to start a moratorium instead, which state law limits to 120 days plus one six-month extension after 45 days' notice to the state and a public hearing.",
  },
  {
    id: "clack-sanctuary",
    label: "Judicial-warrant rule",
    short: "Sanctuary",
    question: "Declare that county agencies will not help federal immigration enforcement without a judicial warrant?",
    context:
      "Oregon's 1987 sanctuary law and the 2021 Sanctuary Promise Act already bar public resources for immigration enforcement without a judicial warrant. In May 2026 OPB asked every Clackamas commission candidate whether the county should adopt its own declaration, as some Oregon counties have; the sheriff is separately elected and runs the jail.",
  },
  {
    id: "clack-senior-tax",
    label: "Senior tax relief",
    short: "Senior taxes",
    question: "Push for a property-tax freeze or new relief for older homeowners?",
    context:
      "The state's Senior and Disabled Property Tax Deferral program pays qualifying homeowners' county taxes each November 15 as a 6% lien, with a $70,000 household income limit for 2026; the county itself keeps about 18 cents of each property-tax dollar raised locally, and Oregon sets property-tax exemptions and deferrals in state law.",
  },
  {
    id: "clack-recovery-campus",
    label: "Recovery Campus",
    short: "Recovery Campus",
    question: "Back the Recovery Campus with county-issued bonds and operating money so it opens in fall 2027?",
    context:
      "The 76-bed Recovery Campus at 15301 SE 92nd Avenue broke ground July 29, 2026 for completion in late 2027, funded with $13.5 million from Metro's supportive housing services tax, $10 million directed by the governor, $5 million in state lottery bonds and $2.5 million in congressional spending. On September 17, 2026 the Board held the hearing on up to $10.3 million in tax-exempt bonds for two buildings that nonprofit Fora Health will operate.",
  },
];
const sheriffTopics: ExtraTopic[] = [
  {
    id: "clack-sheriff-levy",
    label: "Life after the levy",
    short: "Levy fallback",
    question: "If voters reject a levy again in May 2027, which levy-funded services go first?",
    context:
      "The public safety levy that funds 84 jail beds, 26 medical and mental-health beds, 36 jail deputies, 34 patrol deputies, five detectives, body cameras and two internal-affairs investigators expires December 31, 2026 after Measure 3-633 failed 62% to 38% in May 2026; the Board plans a new referral in May 2027, and the FY 2026-27 proposed budget books $28.4 million of levy money for 92 positions.",
  },
  {
    id: "clack-sheriff-cuts",
    label: "Cut administration first",
    short: "Cuts order",
    question: "When the Sheriff's Office budget shrinks, cut administration and programs before patrol and jail?",
    context:
      "The FY 2026-27 proposed budget gives the Sheriff's Office $155.8 million, including $28.4 million from the expiring levy, and $87.3 million in General Fund support, 44.7% of all such support countywide; it funds 607 positions, of which 73 were vacant, 16 of them on patrol.",
  },
  {
    id: "clack-sheriff-rural",
    label: "Rural response times",
    short: "Rural patrol",
    question: "Make response times in rural and unincorporated areas a measured priority?",
    context:
      "Patrol has 71.8 budgeted positions with 16 vacant in the FY 2026-27 proposed budget; another 45 deputies work under contract for Estacada, Happy Valley and Wilsonville, and the Enhanced Law Enforcement District pays for 36 positions in urban unincorporated areas.",
  },
];
const clerkTopics: ExtraTopic[] = [
  {
    id: "clack-hand-count",
    label: "Hand-count ballots",
    short: "Hand count",
    question: "Hand-count every ballot instead of machine tabulation?",
    context:
      "Oregon counts paper ballots on tabulators that are never connected to the internet, tests them three times per election and requires random-sample hand counts or risk-limiting audits after every primary, general and special election. In May 2022, under the previous clerk, more than half of Clackamas primary ballots were misprinted and had to be copied by hand at a cost of about $600,000.",
  },
  {
    id: "clack-voter-rolls",
    label: "County voter-roll checks",
    short: "Voter rolls",
    question: "Run county-level purges of voters who have moved or died, beyond the state's list maintenance?",
    context:
      "The Secretary of State maintains the statewide registration list through the ERIC data-sharing compact, postal change-of-address data, vital records and Oregon Motor Voter, removing people who have died or moved. Clackamas County had 318,500 registered voters for the May 2026 primary, and the clerk's Elections division has six positions in a $3.1 million FY 2026-27 budget.",
  },
  {
    id: "clack-watermark",
    label: "Watermarked ballots",
    short: "Watermarks",
    question: "Add watermarks to ballots to prove they are genuine?",
    context:
      "Oregon verifies each returned ballot by matching the envelope signature to the voter's signature on file; the Secretary of State says a ballot cast in a dead voter's name would be caught by that check. Ballots for November 3, 2026 go in the mail starting October 14.",
  },
];
const treasurerTopics: ExtraTopic[] = [
  {
    id: "clack-treasury-priorities",
    label: "Safety before yield",
    short: "Investing",
    question: "Keep safety and liquidity ahead of return when investing county cash?",
    context:
      "The treasurer is the county's chief investment officer over $827.5 million in cash and investments at June 30, 2025, including $163.1 million in the state's Local Government Investment Pool and $136.8 million in U.S. Treasuries, and distributes property taxes to more than 125 taxing districts; the FY 2026-27 proposed budget expects $15.3 million in interest income.",
  },
  {
    id: "clack-cash-controls",
    label: "Cash-control training",
    short: "Cash controls",
    question: "Keep offering free cash-control training to cities, districts and county staff?",
    context:
      "The Treasurer's Office draws $1.1 million in General Fund support in the FY 2026-27 proposed budget and its treasurer also serves as the county's internal audit administrator, with a channel for employees and volunteers to report suspected fraud, waste and abuse.",
  },
];
const topics: RaceTopics[] = [
  { raceIds: ["clackamas-position-2", "clackamas-position-4"], topics: commissionTopics },
  { raceIds: ["clackamas-sheriff"], topics: sheriffTopics },
  { raceIds: ["clackamas-clerk"], topics: clerkTopics },
  { raceIds: ["clackamas-treasurer"], topics: treasurerTopics },
];

/* Candidate-statement sources used only for stances. */
const savasQuestionnaire = questionnaire("Savas", "https://www.opb.org/pdf/Savas_clackamas%20county%20position%202_1777999802794.pdf");
const shullQuestionnaire = questionnaire("Shull", "https://www.opb.org/pdf/Shull_clackamas%20county%20position%202_1777918550350.pdf");
const helmQuestionnaire = questionnaire("Helm", "https://www.opb.org/pdf/Helm_Clackamas%20County%20position%204_1777936583069.pdf");
const smithQuestionnaire = questionnaire("Smith", "https://www.opb.org/pdf/Smith_Clackamas%20County%20position%204_1777936706977.pdf");

const topicStances: TopicStance[] = [
  /* ── Diana Helm (Position 4, appointed commissioner) ────────────────── */
  stance("diana-helm", "clack-levy-2027", "supports", "Get out in front",
    "Told the June 2 policy session after the levy's defeat that there needs to be a real effort right now to get out in front of people before asking again; the rate is unsaid.",
    yonLevyJune4),
  stance("diana-helm", "clack-data-centers", "supports", "Led the pause",
    "Says she led the effort for a moratorium on large data centers after learning the county had no ordinances addressing them, to gather facts, analyze impacts and involve the public before deciding.",
    pamphlet(18)),
  stance("diana-helm", "clack-sanctuary", "partial", "Follow state law",
    "Says the county is following state law and defers to County Counsel on whether to adopt a judicial-warrant declaration.",
    helmQuestionnaire),
  stance("diana-helm", "clack-senior-tax", "supports", "Freeze for 65-plus",
    "Would get ahead of senior homelessness, potentially by freezing property taxes for homeowners 65 and older within a certain income range, paired with senior services.",
    helmQuestionnaire),
  stance("diana-helm", "clack-recovery-campus", "supports", "Open it by 2027",
    "Commits to addressing homelessness through completion and operation of the Recovery Campus by 2027.",
    helmHome),

  /* ── Catherine McMullen (Clerk, incumbent) ─────────────────────────── */
  stance("catherine-mcmullen", "clack-hand-count", "partial", "Replaced aging equipment",
    "Says she replaced aging equipment, secured ballot processes, trained staff and delivered timely, accurate results; hand counting itself is unsaid.",
    pamphlet(14)),
  stance("catherine-mcmullen", "clack-voter-rolls", "partial", "Records current, accurate",
    "Says she increased voter-registration staffing, ensured eligible citizens can access ballots and kept records current and accurate; a county-level purge beyond state maintenance is unsaid.",
    pamphlet(14)),

  /* ── Brian T Nava (Treasurer, incumbent) ───────────────────────────── */
  stance("brian-t-nava", "clack-treasury-priorities", "supports", "Safe, liquid, then return",
    "Would continue prudent investing that keeps county funds safe and liquid first while achieving the best return possible.",
    pamphlet(15)),
  stance("brian-t-nava", "clack-cash-controls", "supports", "Free training continues",
    "Says he set a strategy for good cash controls across the county by offering free training to all cities, districts and county employees, and would keep improving banking functions.",
    pamphlet(15)),

  /* ── Brad O'Neil (Sheriff) ─────────────────────────────────────────── */
  stance("brad-o-neil", "clack-sheriff-levy", "partial", "Core services first",
    "Says budget pressure is real and ongoing, and core public-safety services will be protected first with resources directed to the front line; which levy-funded services would go first is unsaid.",
    oneilPriorities),
  stance("brad-o-neil", "clack-sheriff-cuts", "supports", "Front line protected",
    "Would protect core public-safety services first, direct resources to the front line, guide staffing and spending with data and eliminate waste so the office runs leaner.",
    oneilPriorities),
  stance("brad-o-neil", "clack-sheriff-rural", "supports", "Measured rural priority",
    "Would make coverage and response times in rural and unincorporated communities a measured priority, saying families in outlying areas wait longer for a deputy than families in town.",
    oneilPriorities),

  /* ── Mark Reaksecker (Clerk) ───────────────────────────────────────── */
  stance("mark-reaksecker", "clack-hand-count", "supports", "Hand count everything",
    "Would hand-count ballots, calling it simple, accurate, expedient and cheaper than tabulating machines, with a provable paper trail.",
    reaksSolutions),
  stance("mark-reaksecker", "clack-voter-rolls", "supports", "County-level purge",
    "Would verify voter rolls at the county level, removing people who have moved or died so only Clackamas County citizens vote in local elections.",
    reaksSolutions),
  stance("mark-reaksecker", "clack-watermark", "supports", "Watermark every ballot",
    "Would watermark ballots so the clerk's office can tell genuine ballots from fraudulent ones.",
    reaksSolutions),
];

topicStances.push(
  /* ── James Rhodes (Sheriff, appointed July 28, 2026) ───────────────── */
  stance("james-rhodes", "clack-sheriff-levy", "partial", "Start at the top",
    "Says that when budgets are tight he starts with fourth-floor administration, discretionary spending and programs that must show value before cutting services residents depend on; which levy-funded services would go first is unsaid.",
    rhodesPlan),
  stance("james-rhodes", "clack-sheriff-cuts", "supports", "Fourth floor first",
    "Would find savings in top administration, discretionary spending and programs before touching patrol, corrections, detectives and parole and probation, with quarterly public budget reports.",
    rhodesPlan),
  stance("james-rhodes", "clack-sheriff-rural", "partial", "Faster response, more patrols",
    "Would improve response times with more visible patrols and restore traffic and DUII enforcement; rural and unincorporated areas are not singled out.",
    rhodesPlan),

  /* ── Paul Savas (Position 2, incumbent) ────────────────────────────── */
  stance("paul-savas", "clack-levy-2027", "supports", "Work aggressively, retry",
    "Told the June 2 policy session after the levy's defeat that the county has a lot of work to do and must do it aggressively before returning to voters; the rate is unsaid.",
    yonLevyJune4),
  stance("paul-savas", "clack-data-centers", "supports", "Helped advance pause",
    "Says he supported and helped advance a proactive approach, with the Board unanimously directing staff to begin establishing a moratorium on new data-center applications, doing the homework now rather than reacting later.",
    savasDataCenters),
  stance("paul-savas", "clack-sanctuary", "mixed", "Follow both laws",
    "Says the county should follow both state and federal law while sanctuary cases play out in court, noting the Sheriff's Office responds to judicial warrants after losing a past detainer lawsuit; a county declaration is not endorsed.",
    savasQuestionnaire),
  stance("paul-savas", "clack-senior-tax", "mixed", "Deferral, not county cuts",
    "Says the state does not allow counties to reduce property taxes for seniors on their own; would keep advocating for relief and steer struggling households to the state deferral program.",
    savasQuestionnaire),
  stance("paul-savas", "clack-recovery-campus", "supports", "Deal for $10 million",
    "Says the county reached a deal with Governor Kotek for $10 million in state resources to move the Recovery Campus forward so it can deliver treatment, stabilization and transitional housing under one system of care.",
    savasHomeless),

  /* ── Mark Shull (Position 2, former commissioner) ──────────────────── */
  stance("mark-shull", "clack-levy-2027", "mixed", "Renew, no rate hike",
    "Supports renewing the public safety levy at a responsible level to keep patrol, jail beds and body cameras, and would oppose unnecessary rate increases, funding core needs through disciplined budgeting instead.",
    shullQuestionnaire),
  stance("mark-shull", "clack-sanctuary", "opposes", "No county declaration",
    "Opposes a county sanctuary declaration or judicial-warrant rule, supports repealing Oregon's sanctuary law, and would encourage the Sheriff's Office to honor lawful federal detainers where possible.",
    shullQuestionnaire),
  stance("mark-shull", "clack-senior-tax", "supports", "Push for relief",
    "Would push for property-tax relief for seniors to offset annual increases so they can afford to stay in their homes.",
    pamphlet(17)),
  stance("mark-shull", "clack-recovery-campus", "partial", "Build on Stabilization Center",
    "Would pair permanent supportive housing with better coordination of mental-health and addiction services, building on the Stabilization Center and Clackamas Village; the Recovery Campus and its bonds are unsaid.",
    shullQuestionnaire),

  /* ── R W Smith (Position 4) ────────────────────────────────────────── */
  stance("r-w-smith", "clack-levy-2027", "partial", "Levy plus long-term plan",
    "Says a five-year levy can stabilize services but is not a complete solution, and any request must come with transparent budgeting, regular reporting and a long-term plan; May 2027 and a rate are unsaid.",
    smithQuestionnaire),
  stance("r-w-smith", "clack-data-centers", "supports", "Keep them out",
    "Opposes bringing large-scale data centers into the county at all, citing their electricity, water and land demands and the infrastructure they require; his position is a ban rather than a pause.",
    pamphlet(18)),
  stance("r-w-smith", "clack-sanctuary", "supports", "Judicial warrant only",
    "Says the county should be clear that local agencies do not participate in federal immigration enforcement without a judicial warrant, calling it a clean legal standard that keeps trust in public safety.",
    smithQuestionnaire),
  stance("r-w-smith", "clack-recovery-campus", "partial", "Treatment beds, outcomes",
    "Would expand addiction treatment and mental-health stabilization and add shelter capacity with case management, insisting on measurable outcomes; the Recovery Campus and its bonds are unsaid.",
    smithPolicies),
);

/* What's at stake: sourced facts, the same block for every candidate in a race. */
const helmAppointed = record(
  "Clackamas County · Diana Helm appointed Clackamas County Commissioner",
  "https://www.clackamas.us/news/2025-05-19/diana-helm-appointed-clackamas-county-commissioner",
  "May 19, 2025",
);
const stakeBudget = {
  label: "The adopted budget",
  text: "On June 17, 2026 the Board adopted the FY 2026-27 county budget 5–0 on Savas's motion, seconded by Helm: $1,528,305,199 in total, $1,401,336,042 appropriated and $198,116,517 in General Fund Support, plus eight district budgets that bring the all-county figure to about $2.0 billion.",
  source: budgetAdoptedJun17,
};
const stakePositions = {
  label: "Fewer positions, thin margins",
  text: "The FY 2026-27 budget funds 2,495.3 positions, 20.5 fewer than the adopted FY 2025-26 budget; Health, Housing and Human Services had already cut 38 as federal and state money fell, and the budget message says costs keep outpacing revenue while federal funds and Metro housing-tax dollars remain uncertain.",
  source: proposedBudget2627,
};
const stakeLevyFailed = {
  label: "Levy defeated, expiring",
  text: "Measure 3-633 failed 62.13% to 37.87% on May 19, 2026 with 44.86% turnout. The levy, renewed every five years since 2006, expires at the end of 2026, and the county's consultant recommended a May 2027 referral with clearer messaging and a defined lead.",
  source: levyWorksheetJul23,
};
const stakeLevyFunds = {
  label: "What the levy pays for",
  text: "Measure 3-633 would have set the levy at 53.4 cents per $1,000 and raised about $202.9 million over five years for 84 jail beds, 26 medical and mental-health beds, 36 jail deputies, 34 patrol deputies, five detectives, a drug-enforcement team, body cameras and two internal-affairs investigators; the current levy expires December 31, 2026.",
  source: kptvLevy,
};
const stakeLevyReferral = {
  label: "The February referral",
  text: "On February 10, 2026 the Board sent the 53.4-cent levy to the May ballot on Commissioner Helm's motion, with Commissioner Savas saying he supported it and calling the Sheriff's Office's pattern of understaffing problematic; the sheriff said the office could manage inside the levy for five years through vacancy savings.",
  source: ocnLevyReferral,
};
const stakeMay2027 = {
  label: "Retry set for May 2027",
  text: "On July 28, 2026 the Board chose to return to voters in May 2027 rather than November 2026; Chair Craig Roberts said the team is not quite ready, and the county's consultant noted the May electorate skews older and more skeptical of tax increases.",
  source: reviewMay2027,
};
const stakeSheriffTurnover = {
  label: "Sheriff resigned mid-term",
  text: "Sheriff Angela Brandenburg resigned July 23, 2026 with two years left in her term. On July 28 the Board appointed James Rhodes over Chair Roberts's objection that candidates should be solicited publicly; Undersheriff Brad O'Neil, whom Roberts named as also interested, now runs against him.",
  source: opbSheriffAppointed,
};
const stakeSheriffBudget = {
  label: "Sheriff's budget and vacancies",
  text: "The FY 2026-27 proposed budget gives the Sheriff's Office $155.8 million and 607 positions, 73 of them vacant, including 16 on patrol; the levy fund pays for 92 positions and the jail for 110, and the General Fund supplies $87.3 million, 56% of the office's budget.",
  source: proposedBudget2627,
};
const stakeJailCapacity = {
  label: "483 jail beds",
  text: "The county jail's housing capacity is 483 beds under the Board-approved Capacity Management Plan; when the population nears it the sheriff makes forced releases of eligible adults under state law, tracked on a public dashboard, and those released still owe court appearances.",
  source: jailDashboard,
};
const stakeDataCenters = {
  label: "Moratorium under way",
  text: "No data center has been built in unincorporated Clackamas County. Staff told the Board on August 11, 2026 that a moratorium needs 45 days' notice to the state, findings of compelling need and a correction program within 60 days, and that starting one would push other planning work off the two-year program.",
  source: dataCenterWorksheetAug11,
};
const stakeMoratoriumVote = {
  label: "Board overrode staff",
  text: "On August 11, 2026 the Board voted unanimously to direct staff to begin adopting a data-center moratorium and a plan for the issues commissioners raised, rejecting staff's recommendation to wait for the 2027 legislative session; public hearings were on the Board's September 15 agenda.",
  source: kxlMoratorium,
};
const stakeRecoveryCampus = {
  label: "Recovery Campus bonds",
  text: "The Board held a hearing September 17, 2026 on up to $10.3 million in tax-exempt bonds for two Recovery Campus buildings at 15301 SE 92nd Avenue, offering withdrawal management, residential treatment, transitional housing and outpatient care, to be run by nonprofit Fora Health with the county keeping ownership.",
  source: recoveryCampusNotice,
};
const stakeRecoveryBuild = {
  label: "76 beds by late 2027",
  text: "The Recovery Campus broke ground July 29, 2026 with 76 beds for detox, residential treatment, medication-assisted treatment, transitional housing and outpatient care, funded with $13.5 million of Metro housing-tax money, $10 million directed by the governor, $5 million in lottery bonds and $2.5 million in congressional spending; completion is set for late 2027.",
  source: recoveryGroundbreaking,
};
const stakeCourthouse = {
  label: "Courthouse payments begin",
  text: "The $345.1 million courthouse opened May 19, 2025 with 16 courtrooms; the state's share is capped at $139.1 million and the county's is $206 million, paid to Clackamas Progress Partners over 30 years at an average of about $15 million a year, roughly $620 million in all.",
  source: courthousePage,
};
const stakeCourthouseFund = {
  label: "Courthouse in the General Fund",
  text: "The FY 2026-27 proposed budget carries a $17.5 million courthouse payment, $17.0 million of it General Fund support and 8.7% of all such support, second only to the Sheriff's Office; county code now requires a 30-year General Fund forecast to show the payments can be met.",
  source: proposedBudget2627,
};
const stakeCourthouseLoan = {
  label: "A $328 million, no-interest loan",
  text: "The county's audited statements record the courthouse as a $327,812,939 loan from Clackamas Progress Partners repaid at $908,069 a month until April 2055 with no interest, after the state's $130 million was passed through; the partner's operations and renewal fee for FY 2026 was set at $3,495,374.",
  source: acfr2025,
};
const stakeShs = {
  label: "Housing tax money",
  text: "The county expects to spend $78 million of Metro's supportive housing services tax in FY 2026-27 plus $67 million in one-time carryover; through mid-FY 2025-26 the tax had created or sustained 246 shelter beds, helped 9,299 people avoid eviction and placed 3,146 in housing, and the budget flags SHS as an uncertain revenue source.",
  source: proposedBudget2627,
};
const stakeJailMedical = {
  label: "Jail medical contract",
  text: "The Board's August 13, 2026 consent agenda carried a five-year, $50.5 million contract with NaphCare for jail medical and mental-health care, funded partly by the public safety levy, alongside a $2.66 million state grant for shelter operations.",
  source: businessAug13,
};
const stakeClerkBudget = {
  label: "Clerk's office budget",
  text: "The FY 2026-27 proposed budget gives the Clerk $6.2 million and 21 positions: $3.1 million and six positions for Elections, about $1.0 million and seven for Recording, and $844,000 and five for Records Management, with $2.7 million of the total from the General Fund.",
  source: proposedBudget2627,
};
const stakeBallots2022 = {
  label: "The 2022 misprint",
  text: "In May 2022, under the previous clerk, more than half of the county's primary ballots were printed with blurry barcodes the tabulators could not read, costing about $600,000 and pulling hundreds of county employees into hand-copying votes; the Secretary of State faulted the office's lack of urgency.",
  source: opbBallots2022,
};
const stakeSosRules = {
  label: "State counting rules",
  text: "Oregon's voting equipment is never connected to the internet, is tested and certified three times around each election, and state law requires random-sample hand counts or risk-limiting audits in every county after primary, general and special elections; signature matching screens every returned envelope.",
  source: sosSecurity,
};
const stakeNovBallot = {
  label: "This election's workload",
  text: "The November 3, 2026 ballot carries five county races plus a justice of the peace, nine local measures from Estacada to Wilsonville, and the Portland charter measure for county voters inside that city; ballots go out starting October 14, and a voter without one by October 22 should call the office.",
  source: electionsNov2026,
};

const stakeTreasurerDuties = {
  label: "What the office holds",
  text: "The treasurer is the county's chief investment officer, reconciles 20 county bank accounts, keeps about 50 county and public-trust accounts, distributes property tax to more than 125 taxing districts and doubles as internal audit director.",
  source: treasurerPage,
};
const stakeTreasurerBudget = {
  label: "Interest and reserves",
  text: "The FY 2026-27 proposed budget expects $15.3 million in interest income and gives the Treasurer's Office $1.1 million in General Fund support; countywide contingency falls $10.4 million to $128.9 million after the courthouse payment, with General Fund contingency at $23.6 million and reserves at $21.3 million.",
  source: proposedBudget2627,
};
const stakePortfolio = {
  label: "$827 million in cash and investments",
  text: "At June 30, 2025 the county held $827,470,054 in cash and investments: $302.1 million in money-market deposits, $163.1 million in the state's Local Government Investment Pool, $144.2 million in U.S. agency securities, $136.8 million in Treasuries, $19.3 million in municipal bonds and $37.5 million in demand deposits.",
  source: acfr2025,
};
const stakeTurnout = {
  label: "Record primary, one recount",
  text: "The May 19, 2026 primary drew 44.87% turnout and 142,908 ballots, the highest for a gubernatorial primary since all-mail voting began in 1998; the Secretary of State ordered a full recount of Circuit Court Position 13, which began June 15.",
  source: clerkCertifies,
};
const stakeHelmSeat = {
  label: "A seat filled by appointment",
  text: "Position 4 has been held by appointment since May 19, 2025, when the four sitting commissioners chose Diana Helm from 59 applicants to serve through December 2026; this election fills the rest of the term, January 2027 through December 2028.",
  source: helmAppointed,
};

const stakes: RaceStakes[] = [
  {
    raceId: "clackamas-position-2",
    intro:
      "Commissioners share a five-member board that adopts the county's roughly $2.0 billion budget, funds the sheriff and courts, sets land-use rules for unincorporated areas and decides what goes to voters. The next term opens with the public safety levy expiring, a May 2027 levy vote to shape, courthouse payments now due every month and a data-center moratorium in motion.",
    items: [stakeBudget, stakePositions, stakeLevyFailed, stakeLevyFunds, stakeMay2027, stakeCourthouse, stakeMoratoriumVote, stakeRecoveryBuild],
  },
  {
    raceId: "clackamas-position-4",
    intro:
      "Commissioners share a five-member board that adopts the county's roughly $2.0 billion budget, funds the sheriff and courts, sets land-use rules for unincorporated areas and decides what goes to voters. This seat has been held by appointment since May 2025 and the winner serves the rest of the term through 2028, starting with the levy retry, courthouse payments and the data-center moratorium.",
    items: [stakeHelmSeat, stakeBudget, stakeLevyReferral, stakeLevyFailed, stakeMay2027, stakeCourthouseFund, stakeDataCenters, stakeShs],
  },
  {
    raceId: "clackamas-sheriff",
    intro:
      "The sheriff runs a 483-bed jail, patrol for unincorporated areas and three contract cities, investigations, civil process and parole and probation on a budget of about $156 million that the Board funds but does not direct. The office lost its elected sheriff in July, loses its five-year levy at the end of 2026, and will make its case to voters again in May 2027.",
    items: [stakeSheriffTurnover, stakeSheriffBudget, stakeJailCapacity, stakeLevyFailed, stakeLevyFunds, stakeMay2027, stakeJailMedical],
  },
  {
    raceId: "clackamas-clerk",
    intro:
      "The clerk runs every election in the county, keeps property records and marriage licenses, and certifies results to the Secretary of State under state rules on equipment, audits and signature checks. The next term includes the May 2027 public safety levy election and the 2028 presidential cycle, on a $6.2 million office budget.",
    items: [stakeClerkBudget, stakeTurnout, stakeSosRules, stakeBallots2022, stakeNovBallot, stakeMay2027],
  },
  {
    raceId: "clackamas-treasurer",
    intro:
      "The treasurer safeguards and invests county cash, runs the county's banking and distributes property taxes to more than 125 taxing districts; the Board sets appropriations. The next term manages reserves drawn down by courthouse payments and new tax-exempt bonds for the Recovery Campus.",
    items: [stakePortfolio, stakeTreasurerDuties, stakeTreasurerBudget, stakeCourthouseLoan, stakeRecoveryCampus, stakeBudget],
  },
];

const analysis: Record<string, CandidateAnalysis> = {
  /* ── Clerk ─────────────────────────────────────────────────────────── */
  "catherine-mcmullen": {
    values: ["Election security", "Voter access"],
    tradeoff:
      "Her case is continuity: the office she runs now, run the same way. The performance figures in the statement (timely results, 50,000 ballot-tracking subscribers, 465 weddings) are the campaign’s own numbers.",
    issues: {
      money: {
        position:
          "Would keep marriage licenses and property recording cost-effective and hold convenient weekday hours for records and marriage services.",
        source: pamphlet(14),
      },
    },
    sources: [pamphlet(14), mcmullenPriorities],
  },
  "mark-reaksecker": {
    values: ["Hand-counted ballots", "Local voter-roll checks"],
    tradeoff:
      "The case turns on a factual premise about machine counting that the Secretary of State’s description of Oregon’s paper-ballot system and hand-count audits does not support; the staffing and cost of a countywide hand count are not estimated.",
    issues: {
      money: {
        position:
          "Would replace machine tabulation with hand counting, which he says costs less than buying tabulating machines, and add watermarked ballots.",
        source: reaksSolutions,
      },
    },
    sources: [pamphlet(14), reaksSolutions],
  },

  /* ── Treasurer ─────────────────────────────────────────────────────── */
  "brian-t-nava": {
    values: ["Safe, liquid investing", "Cash controls"],
    tradeoff:
      "An unopposed incumbent’s statement of continuity: safety, liquidity and return are named as goals without published benchmarks or risk measures.",
    issues: {
      money: {
        position:
          "Would keep county funds safe and liquid first while seeking the best return possible, and keep building cash controls across the county.",
        source: pamphlet(15),
      },
    },
    sources: [pamphlet(15)],
  },

  /* ── Sheriff ───────────────────────────────────────────────────────── */
  "brad-o-neil": {
    values: ["Rural response times", "Open books"],
    tradeoff:
      "His statement runs on management and accountability rather than named hires or cuts; the claim to be the only candidate with current Oregon police certification and no disciplinary action is the campaign’s own.",
    issues: {
      safety: {
        position:
          "Would make response times in rural and unincorporated areas a measured priority, keep search and rescue equipped, and pair deputies with behavioral-health partners on calls they cannot solve alone.",
        source: oneilPriorities,
      },
      money: {
        position:
          "Would protect core public-safety services first under budget pressure, guide staffing and spending with data, and show the public where the money goes.",
        source: oneilPriorities,
      },
    },
    sources: [pamphlet(16), oneilPriorities, oneilVision],
  },
  "james-rhodes": {
    values: ["Front line first", "Fourth floor first"],
    tradeoff:
      "The appointed incumbent names operational priorities more clearly than their cost; restoring traffic enforcement and adding property-crime follow-up implies staffing the statement does not quantify.",
    issues: {
      safety: {
        position:
          "Would protect patrol, jail and investigative services, restore traffic and DUII (impaired-driving) enforcement, follow up on property crimes and target fentanyl traffickers.",
        source: pamphlet(16),
      },
      money: {
        position:
          "Would start budget cuts at the top (administration, discretionary spending and programs) before front-line services, and report the budget publicly.",
        source: rhodesPlan,
      },
    },
    sources: [pamphlet(16), rhodesPlan],
  },

  /* ── Commissioner, Position 2 ──────────────────────────────────────── */
  "paul-savas": {
    values: ["Services without new taxes", "Delivered projects"],
    tradeoff:
      "He runs on a record of projects delivered inside a flat budget; the unit counts, recovery-campus timing and tolling claims are the campaign’s own figures.",
    issues: {
      housing: {
        position:
          "Would keep expanding affordable housing of varied types and move people from homelessness into treatment and transitional housing through the county’s Recovery Campus.",
        source: savasIssues,
      },
      safety: {
        position: "Would fully fund the Sheriff’s Office and emergency services.",
        source: savasIssues,
      },
      money: {
        position:
          "Would hold the line on the county budget, expanding essential services without raising taxes, and support property-tax deferral so seniors can stay in their homes.",
        source: pamphlet(17),
      },
      climate: {
        position:
          "Opposes ODOT tolling and would add road capacity through the Sunrise Project and I-205 widening, while protecting farmland and open space.",
        source: savasIssues,
      },
    },
    sources: [pamphlet(17), savasIssues, savasHousing, savasHomeless, savasDataCenters],
  },
  "mark-shull": {
    values: ["Tax restraint", "Local control"],
    tradeoff:
      "Tax relief, no tolls and program cuts are commitments; which programs would be cut and what senior relief would cost are not in the statement, and land-use reform depends on the Legislature.",
    issues: {
      housing: {
        position:
          "Would build affordable housing by pushing for state land-use reform, while strictly protecting rural character and property rights.",
        source: pamphlet(17),
      },
      money: {
        position:
          "Would seek property-tax relief for seniors, cut programs he calls unnecessary and oppose any new taxes.",
        source: pamphlet(17),
      },
      climate: {
        position: "Opposes tolls on I-205 and would fix roads without charging daily drivers.",
        source: pamphlet(17),
      },
    },
    sources: [pamphlet(17)],
  },

  /* ── Commissioner, Position 4 ──────────────────────────────────────── */
  "diana-helm": {
    values: ["Faster permitting", "Data-center time-out"],
    tradeoff:
      "Her data-center position is a pause with a decision still to come, and her housing targets (900 units by 2030, permitting reform by 2028) are dated goals the whole board, not one member, would deliver.",
    issues: {
      housing: {
        position:
          "Would increase affordable housing by cutting regulatory burdens and speeding up permitting, and keep shelter, recovery and support services available to people who are homeless.",
        source: pamphlet(18),
      },
      climate: {
        position:
          "Led a moratorium on large data centers so the county can gather facts and hear the public before deciding, and would advocate for the Sunrise Corridor freight route.",
        source: pamphlet(18),
      },
      safety: {
        position:
          "Says the deflection program is working, with the Milwaukie Stabilization Center taking people in mental-health, substance-use or other crises and the Recovery Campus opening in fall 2027; says the county needs a new jail and will study its cost and site.",
        source: helmEmail,
      },
      money: {
        position:
          "Every department must present a balanced budget each cycle, and with revenue trailing inflation some cuts are necessary; General Fund priority goes to public safety, health, housing and human services (including seniors and people with disabilities) and transportation.",
        source: helmEmail,
      },
    },
    sources: [pamphlet(18), helmHome, helmEmail],
  },
  "r-w-smith": {
    values: ["No large data centers", "Transparent contracts"],
    tradeoff:
      "His data-center stance is categorical rather than a pause; the treatment and shelter expansion he wants is not yet paired with a funding plan, though he pledges independent fiscal review of big projects.",
    issues: {
      housing: {
        position:
          "Would encourage housing working families can afford, streamline permitting for small builders, limit corporate purchases of homes, and add shelter beds paired with case management.",
        source: smithPolicies,
      },
      safety: {
        position:
          "Would give police and first responders the resources they need, expand treatment for addiction and mental illness, and insist on measurable outcomes.",
        source: pamphlet(18),
      },
      money: {
        position:
          "Would put major public projects and long-term contracts through independent fiscal review, report budgets and obligations openly, and end subsidies to large data centers.",
        source: smithPolicies,
      },
      climate: {
        position:
          "Opposes bringing large-scale data centers into the county, citing their electricity, water and land demands, and would build new clean-energy capacity.",
        source: pamphlet(18),
      },
    },
    sources: [pamphlet(18), smithPolicies, smithHome],
  },
};

export const pack: RacePack = {
  ...emptyPack(),
  analysis,

  lines: [
    line("catherine-mcmullen", "money", "Keeps marriage-license and property-recording fees cost-effective, with weekday hours."),
    line("mark-reaksecker", "money", "Replaces machine tabulation with hand counting, which he says costs less."),
    line("brian-t-nava", "money", "Keeps county funds safe and liquid first, then seeks the best return."),
    line("brad-o-neil", "safety", "Makes rural response times a measured priority; pairs deputies with behavioral-health partners."),
    line("brad-o-neil", "money", "Protects core public-safety services first; guides spending with data; opens the books."),
    line("james-rhodes", "safety", "Restores traffic and DUII (impaired-driving) enforcement; targets fentanyl traffickers."),
    line("james-rhodes", "money", "Cuts administration and discretionary spending before front-line services; reports budgets publicly."),
    line("paul-savas", "housing", "Expands affordable housing and moves people into treatment through the Recovery Campus."),
    line("paul-savas", "safety", "Fully funds the Sheriff’s Office and emergency services."),
    line("paul-savas", "money", "Expands essential services without raising taxes; backs senior property-tax deferral."),
    line("paul-savas", "climate", "Opposes tolling; widens I-205 and builds the Sunrise Project; protects farmland."),
    line("mark-shull", "housing", "Seeks state land-use reform for affordable housing while protecting rural character."),
    line("mark-shull", "money", "Seeks senior property-tax relief, cuts unnecessary programs, opposes any new taxes."),
    line("mark-shull", "climate", "Opposes I-205 tolls; fixes roads without charging daily drivers."),
    line("diana-helm", "housing", "Speeds permitting (building approvals) and cuts rules to build affordable homes; keeps shelters."),
    line("diana-helm", "safety", "Deflection and a stabilization center now; recovery campus in 2027; new jail studied."),
    line("diana-helm", "money", "Balanced department budgets; General Fund goes first to safety, health, housing, services."),
    line("diana-helm", "climate", "Pauses large data centers to study impacts; backs the Sunrise Corridor freight route."),
    line("r-w-smith", "housing", "Faster permitting (building approvals), limits on corporate home buying, more shelter beds."),
    line("r-w-smith", "safety", "Resources police and first responders; expands treatment with measurable outcomes."),
    line("r-w-smith", "money", "Puts major projects through independent fiscal review; ends data-center subsidies."),
    line("r-w-smith", "climate", "Opposes large data centers over electricity, water and land; builds clean energy."),
  ],

  chips: [
    chip("catherine-mcmullen", "money", "Affordable clerk fees"),
    chip("mark-reaksecker", "money", "Hand counts, no tabulators"),
    chip("brian-t-nava", "money", "Safe, liquid investing"),
    chip("brad-o-neil", "safety", "Rural response times"),
    chip("brad-o-neil", "money", "Data-driven, open books"),
    chip("james-rhodes", "safety", "Traffic and fentanyl focus"),
    chip("james-rhodes", "money", "Cut administration first"),
    chip("paul-savas", "housing", "Recovery Campus, units"),
    chip("paul-savas", "safety", "Fully fund the sheriff"),
    chip("paul-savas", "money", "Services, no new taxes"),
    chip("paul-savas", "climate", "No tolls, widen I-205"),
    chip("mark-shull", "housing", "State land-use reform"),
    chip("mark-shull", "money", "Senior tax relief, cuts"),
    chip("mark-shull", "climate", "No I-205 tolls"),
    chip("diana-helm", "housing", "Faster permitting"),
    chip("diana-helm", "safety", "Deflection, recovery"),
    chip("diana-helm", "money", "Balanced, safety first"),
    chip("diana-helm", "climate", "Data-center pause"),
    chip("r-w-smith", "housing", "Permitting, shelter beds"),
    chip("r-w-smith", "safety", "Treatment with outcomes"),
    chip("r-w-smith", "money", "Independent fiscal review"),
    chip("r-w-smith", "climate", "No large data centers"),
  ],

  deliveries: [
    delivery("catherine-mcmullen", "money"),
    delivery("mark-reaksecker", "money"),
    delivery("brian-t-nava", "money", {
      how: step(
        "Free cash-control training offered to all cities, districts and county employees; new and improved banking functions at the Treasurer’s office.",
        pamphlet(15),
      ),
    }),
    delivery("brad-o-neil", "safety", {
      how: step(
        "Recruitment and retention as a sustained priority, since every vacancy stretches response times; data to guide staffing and patrol; partnerships with local police and behavioral-health providers.",
        oneilPriorities,
      ),
      measure: step(
        "Help arriving faster in the places that wait longest today, set as a measured goal after a first-100-days review of response times and coverage; no numeric target published.",
        oneilVision,
      ),
    }),
    delivery("brad-o-neil", "money", {
      how: step(
        "Data-driven staffing, patrol and spending decisions; modernized operations and technology; cutting what wastes time and money; books open to residents.",
        oneilPriorities,
      ),
    }),
    delivery("james-rhodes", "safety", {
      how: step(
        "Budget savings found in fourth-floor administration, discretionary spending and programs before front-line services; partnerships with the District Attorney, courts, contract cities, schools and emergency-management partners.",
        rhodesPlan,
      ),
    }),
    delivery("james-rhodes", "money", {
      how: step(
        "Every dollar examined against one question, whether it helps the office conserve the peace and serve residents, starting with administrative overhead.",
        rhodesPlan,
      ),
      measure: step(
        "Regular public budget reporting with quarterly updates so taxpayers can see whether the office is staying on track.",
        rhodesPlan,
      ),
    }),
    delivery("paul-savas", "housing", {
      how: step(
        "A monthly Affordable Housing Implementation Team; $10 million in state money for the Recovery Campus, which combines treatment, stabilization and transitional housing; preserving affordable units at risk of expiring.",
        savasHomeless,
      ),
      measure: step(
        "968 affordable units complete or scheduled against a goal of 900 by 2030; Clackamas Village’s 24 transitional-shelter spaces opened May 2025.",
        savasHousing,
      ),
    }),
    delivery("paul-savas", "safety"),
    delivery("paul-savas", "money"),
    delivery("paul-savas", "climate", {
      how: step(
        "Backs the Sunrise Project and I-205 expansion to add capacity; helped advance a moratorium on new data-center applications while the county studies electricity, water and road impacts.",
        savasDataCenters,
      ),
    }),
    delivery("mark-shull", "housing"),
    delivery("mark-shull", "money"),
    delivery("mark-shull", "climate"),
    delivery("diana-helm", "housing", {
      how: step(
        "A more customer-service-friendly permit process; completion and operation of the county Recovery Campus.",
        helmHome,
      ),
      measure: step(
        "900 more affordable units by 2030; regulatory burden reduced by 2028; the Recovery Campus completed and operating by 2027.",
        helmHome,
      ),
    }),
    delivery("diana-helm", "safety", {
      how: step(
        "The Stabilization Center in Milwaukie for people in crisis, the Recovery Campus (fall 2027) for substance use, mental health, homelessness, job training and transitional housing, and a Strategic Plan study of a new jail’s cost and site.",
        helmEmail,
      ),
    }),
    delivery("diana-helm", "money", {
      how: step("Each department presents a balanced budget every cycle, with cuts where revenue trails inflation.", helmEmail),
    }),
    delivery("diana-helm", "climate", {
      how: step(
        "Keep the moratorium in unincorporated Clackamas County until the county codifies a policy on water use, energy use, sound and air quality; cities set their own.",
        helmEmail,
      ),
    }),
    delivery("r-w-smith", "housing", {
      how: step(
        "Streamlined permitting so builders avoid repeated design revisions; limits on speculative corporate ownership; shelter capacity paired with case management; partnerships with nonprofits and Community Action Board programs.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "safety", {
      how: step(
        "Strategic planning to hold emergency response times as the county grows; cooperation among county agencies, cities and service districts; prevention programs for young people.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "money", {
      how: step(
        "Independent fiscal review of major projects and long-term financial agreements; public review of major structural decisions; new clean-energy capacity to stabilize utility costs.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "climate"),
  ],

  ownWords: [
    {
      candidateId: "catherine-mcmullen",
      text: "Clerk McMullen is a nonpartisan, nationally recognized elections official. She has devoted her career to public service; conducting 25 elections since 2015, nine for Clackamas County.",
      source: pamphletOpening(
        14,
        "Skipped the “Re-elect …” heading, a quotation attributed to a former Secretary of State and the “ACCOUNTABLE • FAIR • EXPERIENCED” slogan; first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 26,
    },
    {
      candidateId: "mark-reaksecker",
      text: "Mark is a 3rd generation Oregonian, whose grandfather was sheriff of Clackamas County.",
      source: pamphletOpening(14, "Nothing skipped: the statement opens with running prose."),
      rule: "pamphlet-opening",
      words: 13,
    },
    {
      candidateId: "brian-t-nava",
      text: "As your County’s Treasurer, Brian oversees the county’s cash and investment portfolio.",
      source: pamphletOpening(
        15,
        "Skipped a quotation attributed to a former county treasurer and the “SOUND FINANCIAL MANAGEMENT” section label.",
      ),
      rule: "pamphlet-opening",
      words: 12,
    },
    {
      candidateId: "brad-o-neil",
      text: "Clackamas County deserves a Sheriff who is experienced, accountable, and ready to lead on day one.",
      source: pamphletOpening(
        16,
        "Skipped the “Brad O’Neil for Clackamas County Sheriff” heading and the “Trusted. Qualified. A New Direction” labels.",
      ),
      rule: "pamphlet-opening",
      words: 16,
    },
    {
      candidateId: "james-rhodes",
      text: "I was born and raised in Clackamas County, where Patti and I raised our daughter and owned a small business.",
      source: pamphletOpening(
        16,
        "Skipped the “SHERIFF JAMES RHODES” heading and the “Proven. Local. Trusted.” labels.",
      ),
      rule: "pamphlet-opening",
      words: 20,
    },
    {
      candidateId: "paul-savas",
      text: "I am honored to serve as your County Commissioner. Together we fought for fair access to parks, natural areas, libraries, and services for veterans and seniors.",
      source: pamphletOpening(
        17,
        "Nothing skipped; the first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 26,
    },
    {
      candidateId: "mark-shull",
      text: "As your Commissioner, I always put residents first with fiscal discipline and common sense.",
      source: pamphletOpening(
        17,
        "Skipped the “THE PEOPLE’S COMMISSIONER” heading and the unpunctuated “For the People; a More Affordable Clackamas County” line.",
      ),
      rule: "pamphlet-opening",
      words: 14,
    },
    {
      candidateId: "diana-helm",
      text: "Commissioner Diana Helm has proven to be a strong voice for the citizens of Clackamas County by advocating for affordable housing, leading the effort to pause mega-sized data centers, addressing homelessness and addiction, and supporting safe communities.",
      source: pamphletOpening(18, "Skipped the “LEADERSHIP • TRANSPARENCY • INTEGRITY” labels."),
      rule: "pamphlet-opening",
      words: 37,
    },
    {
      candidateId: "r-w-smith",
      text: "Clackamas County is my home. My wife and I are raising our three children here.",
      source: pamphletOpening(
        18,
        "Skipped the “CLACKAMAS VALUES. BIPARTISAN SOLUTIONS.” slogan (labels with no predicate); the first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 15,
    },
  ],

  contacts: [
    {
      candidateId: "catherine-mcmullen",
      channels: [
        { url: "https://clackamasvoice.org/", label: "clackamasvoice.org", kind: "website", from: "pamphlet" },
        { url: "mailto:ClackamasVoice@gmail.com", label: "ClackamasVoice@gmail.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/catherinetheclerk/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/ClackamasVoice", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.linkedin.com/in/catherinecmcmullen/", label: "LinkedIn", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(14),
        site("McMullen · priorities (prints the campaign email)", "https://clackamasvoice.org/priorities/"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "mark-reaksecker",
      channels: [
        { url: "https://www.markforcountyclerk.com/", label: "markforcountyclerk.com", kind: "website", from: "pamphlet" },
        { url: "https://www.markforcountyclerk.com/contact", label: "Contact form", kind: "form", from: "site" },
        { url: "https://www.instagram.com/markreaksecker", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61575462016802", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(14),
        site("Reaksecker · contact page (form; header links the profiles)", "https://www.markforcountyclerk.com/contact"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "brian-t-nava",
      channels: [
        { url: "mailto:bnava30@hotmail.com", label: "bnava30@hotmail.com", kind: "email", from: "filing" },
        { url: "https://fb.me/Brian4ClackamasCountyTreasurer", label: "Facebook", kind: "social", from: "filing" },
      ],
      sources: [
        filing(
          "Nava · county candidate filing (SEL 101), contact fields",
          "https://docs.clackamas.us/documents/drupal/86ef06a3-6ab5-4387-b273-90b0a45b7d70",
          "Published by Clackamas County Elections; reviewed September 21, 2026",
          "The pamphlet statement prints no website, email or phone. The filing’s Email Address and Web Site fields give this address and the Facebook short link; its phone fields are labelled work, home and cell rather than campaign, so none is listed.",
        ),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "brad-o-neil",
      channels: [
        { url: "https://www.oneilforsheriff.com/", label: "oneilforsheriff.com", kind: "website", from: "pamphlet" },
        { url: "mailto:brad@oneilforsheriff.com", label: "brad@oneilforsheriff.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/oneilforsheriff/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61592705333158", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.linkedin.com/in/brad-oneil/", label: "LinkedIn", kind: "social", from: "site" },
      ],
      sources: [pamphlet(16), site("O’Neil · home page footer", "https://www.oneilforsheriff.com/")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "james-rhodes",
      channels: [
        { url: "https://www.electsheriffrhodes.com/", label: "electsheriffrhodes.com", kind: "website", from: "pamphlet" },
        { url: "mailto:info@electsheriffrhodes.com", label: "info@electsheriffrhodes.com", kind: "email", from: "site" },
        { url: "tel:+15036733973", label: "(503) 673-3973", kind: "phone", from: "site" },
        { url: "https://www.electsheriffrhodes.com/getinvolved", label: "Volunteer form", kind: "form", from: "site" },
        { url: "https://www.instagram.com/electsheriffrhodes/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61592582740159", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.youtube.com/channel/UCV_t_UfIJN8ivgrLLVA_bsw", label: "YouTube", kind: "social", from: "site" },
      ],
      sources: [pamphlet(16), site("Rhodes · get involved (form, email, phone, profiles)", "https://www.electsheriffrhodes.com/getinvolved")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "paul-savas",
      channels: [
        { url: "https://electpaulsavas.com/", label: "electpaulsavas.com", kind: "website", from: "pamphlet" },
        { url: "mailto:paul@electpaulsavas.com", label: "paul@electpaulsavas.com", kind: "email", from: "pamphlet" },
        { url: "tel:+15033121379", label: "503-312-1379", kind: "phone", from: "site" },
        { url: "https://www.facebook.com/electpaulsavas", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(17),
        site("Savas · home page footer (“Paul wants to hear from you!”)", "https://electpaulsavas.com/"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "mark-shull",
      channels: [{ url: "mailto:markshullusa@mail.com", label: "markshullusa@mail.com", kind: "email", from: "filing" }],
      sources: [
        filing(
          "Shull · county candidate filing (SEL 101), contact fields",
          "https://docs.clackamas.us/documents/drupal/cd979d28-a5a7-4abc-9e7b-53049da4a439",
          "Published by Clackamas County Elections; reviewed September 21, 2026",
          "The pamphlet statement prints no website, email or phone, and no campaign site was found. The filing’s handwritten Email Address field reads “MARKSHULLUSA@mail.com”; its Web Site field is blank and its only phone is in the cell field, so none is listed.",
        ),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "diana-helm",
      channels: [
        { url: "https://www.votedianahelm.com/", label: "votedianahelm.com", kind: "website", from: "pamphlet" },
        { url: "mailto:campaign@votedianahelm.com", label: "campaign@votedianahelm.com", kind: "email", from: "site" },
        { url: "tel:+15035226305", label: "503-522-6305", kind: "phone", from: "site" },
        { url: "https://www.facebook.com/votedianahelm", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [pamphlet(18), site("Helm · home page footer", "https://www.votedianahelm.com/")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "r-w-smith",
      channels: [
        { url: "https://friendsofremysmith.org/", label: "friendsofremysmith.org", kind: "website", from: "pamphlet" },
        { url: "mailto:friendsofremysmith@gmail.com", label: "friendsofremysmith@gmail.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/rwsmith4clackamas/", label: "Instagram", kind: "social", from: "pamphlet" },
        { url: "https://www.facebook.com/profile.php?id=61577455397605", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [pamphlet(18), site("Smith · about page (“Say Hello!”)", "https://friendsofremysmith.org/about/")],
      reviewedOn: REVIEWED_ON,
    },
  ],

  roles: [
    { candidateId: "brad-o-neil", role: "Clackamas County undersheriff", from: "background" },
    { candidateId: "r-w-smith", role: "Environmental consultant", from: "background" },
    { candidateId: "mark-shull", role: "Former commissioner; retired officer", from: "background" },
    { candidateId: "diana-helm", role: "County commissioner; former Damascus mayor", from: "background" },
    { candidateId: "brian-t-nava", role: "Incumbent treasurer; former auditor", from: "background" },
    { candidateId: "paul-savas", role: "Incumbent county commissioner", from: "background" },
  ],

  primary: [
    { candidateId: "catherine-mcmullen", sourceUrl: `${PAMPHLET}#page=14` },
    { candidateId: "mark-reaksecker", sourceUrl: `${PAMPHLET}#page=14` },
    { candidateId: "brian-t-nava", sourceUrl: `${PAMPHLET}#page=15` },
    { candidateId: "brad-o-neil", sourceUrl: `${PAMPHLET}#page=16` },
    { candidateId: "james-rhodes", sourceUrl: `${PAMPHLET}#page=16` },
    { candidateId: "paul-savas", sourceUrl: `${PAMPHLET}#page=17` },
    { candidateId: "mark-shull", sourceUrl: `${PAMPHLET}#page=17` },
    { candidateId: "diana-helm", sourceUrl: `${PAMPHLET}#page=18` },
    { candidateId: "r-w-smith", sourceUrl: `${PAMPHLET}#page=18` },
  ],

  ballots: [
    { raceId: "clackamas-clerk", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-treasurer", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-sheriff", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-position-2", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-position-4", text: "You vote for one candidate.", source: electionsPage },
  ],

  /* County positions are elected at large; no district line. */
  districts: [],

  choice: [
    {
      raceId: "clackamas-clerk",
      text: "One case is continuity: professional administration and wider voter access. The other would replace machine tabulation with hand counting. The factual premise behind changing the counting system deserves scrutiny.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-treasurer",
      text: "One candidate is on the ballot. The question left is how safety, liquidity and return will be balanced, and which benchmarks and risk measures the office will publish.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-sheriff",
      text: "Both run on experience and careful spending. Compare an accountability-and-management case, with rural response times as its measured goal, against a list of operational priorities: traffic and impaired-driving enforcement, property-crime follow-up and fentanyl investigations.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-position-2",
      text: "Both oppose I-205 tolls and lead with affordability. One case rests on services and capital projects delivered inside the current budget; the other on limiting county government, cutting programs and resisting Metro mandates.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-position-4",
      text: "Both would limit large data centers, one as a pause while the county writes rules, the other as outright opposition. Beyond that, compare faster permitting against independent fiscal review as the route to affordability.",
      from: "race.comparison",
      ...reviewed,
    },
  ],

  portraits: {
    "catherine-mcmullen": portrait("catherine-mcmullen", 14),
    "mark-reaksecker": portrait("mark-reaksecker", 14),
    "brian-t-nava": portrait("brian-t-nava", 15),
    "brad-o-neil": portrait("brad-o-neil", 16),
    "james-rhodes": portrait("james-rhodes", 16),
    "mark-shull": portrait("mark-shull", 17),
    "paul-savas": portrait("paul-savas", 17),
    "r-w-smith": portrait("r-w-smith", 18),
    "diana-helm": portrait("diana-helm", 18),
  },

  missing: {},
  topics,
  topicStances,
  stakes,
};
