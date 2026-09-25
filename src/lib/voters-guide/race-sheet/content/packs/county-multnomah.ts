import type { CandidatePortrait, Evidence } from "../../../types";
import type { IssueId } from "../../issues";
import type { OwnWords, OwnWordsRule } from "../own-words";
import {
  emptyPack,
  type BallotInstruction,
  type CandidateAnalysis,
  type CandidateContact,
  type ChoiceParagraph,
  type ContactChannel,
  type Delivery,
  type DeliveryStep,
  type DistrictInfo,
  type ExtraTopic,
  type IssueLine,
  type MissingState,
  type PrimaryStatement,
  type RacePack,
  type RaceStakes,
  type RaceTopics,
  type RoleOverride,
  type StanceChip,
  type TopicStance,
} from "../../types";

/**
 * Race pack: Multnomah County Chair, Commissioner District 2, Auditor and
 * Sheriff. Researched September 21, 2026 from the November 2026 Multnomah
 * County voters' pamphlet (PDF pages 32–38, text extracted with pdftotext)
 * and each campaign site the statement prints (fetched directly; Cruz's
 * issues page was read in a browser because its sections load by script).
 * Broussard prints no site; his County filing lists broussardpdx.com, which
 * was read. Positions come only from the candidate's own material; a
 * missing issue is a research gap, never a position. Every entry names its
 * source; publication by the county does not verify any claim.
 */

const PAMPHLET =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";
const REVIEWED_ON = "2026-09-21";
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

const pamphlet = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
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
const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });

/* Contact channel helpers, matching content/contacts.ts. */
type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});
const email = (address: string, from: From): ContactChannel => ({ url: `mailto:${address}`, label: address, kind: "email", from });
const phone = (digits: string, label: string, from: From): ContactChannel => ({ url: `tel:+1${digits}`, label, kind: "phone", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({ url, label, kind: "form", from });
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });

const portrait = (id: string, page: number): CandidatePortrait => ({
  src: `/images/voters-guide/2026/${id}.webp`,
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Multnomah voters’ pamphlet",
  reviewed: REVIEWED_ON,
});
const opening = (candidateId: string, page: number, text: string, words: number, skipped?: string): OwnWords => ({
  candidateId,
  text,
  source: {
    label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
    url: `${PAMPHLET}#page=${page}`,
    kind: "Candidate statement",
    date: "November 2026 edition; extracted September 21, 2026",
    note: `Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.${skipped ? ` ${skipped}` : ""}`,
  },
  rule: "pamphlet-opening" satisfies OwnWordsRule,
  words,
});

/* One candidate's analysis, line, chip and ladder rung per documented issue, in one place for review. */
type IssueSpec = { position: string; source: Evidence; line: string; chip: string; how?: DeliveryStep; measure?: DeliveryStep };
type CandidateSpec = { values: [string, string]; tradeoff: string; sources: Evidence[]; issues: Partial<Record<IssueId, IssueSpec>> };

const analysis: Record<string, CandidateAnalysis> = {};
const lines: IssueLine[] = [];
const chips: StanceChip[] = [];
const deliveries: Delivery[] = [];
const ownWords: OwnWords[] = [];
const contacts: CandidateContact[] = [];
const roles: RoleOverride[] = [];
const primary: PrimaryStatement[] = [];
const ballots: BallotInstruction[] = [];
const districts: DistrictInfo[] = [];
const choice: ChoiceParagraph[] = [];
const portraits: Record<string, CandidatePortrait> = {};
const missing: Record<string, MissingState> = {};

function candidate(candidateId: string, spec: CandidateSpec) {
  const issues: CandidateAnalysis["issues"] = {};
  for (const [issue, s] of Object.entries(spec.issues) as [IssueId, IssueSpec][]) {
    issues[issue] = { position: s.position, source: s.source };
    const from = `analysis.issues.${issue}.position`;
    lines.push({ candidateId, issue, line: s.line, from, ...reviewed });
    chips.push({ candidateId, issue, chip: s.chip, from, ...reviewed });
    deliveries.push({ candidateId, issue, ...(s.how ? { how: s.how } : {}), ...(s.measure ? { measure: s.measure } : {}), ...reviewed });
  }
  analysis[candidateId] = { values: spec.values, tradeoff: spec.tradeoff, issues, sources: spec.sources };
}
const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string) =>
  contacts.push({ candidateId, channels, ...(none ? { none } : {}), sources, reviewedOn: REVIEWED_ON });

/* RACES */

/* Plain references for contact sources and race-level pages (no campaign-claim note). */
const ref = (label: string, url: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Reviewed September 21, 2026",
  ...(note ? { note } : {}),
});
const countyRcv: Evidence = {
  label: "Multnomah County Elections · Ranked Choice Voting (RCV)",
  url: "https://multco.us/info/ranked-choice-voting-rcv",
  kind: "Election authority",
  date: "Checked September 21, 2026",
  note: "States that voters “can rank up to 6 candidates” and that the County Chair, Auditor, Sheriff and District 2 Commissioner contests use single-winner ranked choice voting in November 2026.",
};
const RANKED_NOTE =
  "Ranking more people never hurts your first choice. Later choices count only if an earlier one is eliminated.";
const ranked = (raceId: string): BallotInstruction => ({
  raceId,
  text: "You rank up to six candidates for one seat.",
  note: RANKED_NOTE,
  source: countyRcv,
});

/* ── Multnomah County Chair ─────────────────────────────────────────── */
const jbeHome = site("Brim-Edwards · campaign home", "https://www.juliabrim-edwards.com/");
const jbeMeet = site("Brim-Edwards · Meet Julia", "https://www.juliabrim-edwards.com/meet-julia");
candidate("julia-brim-edwards", {
  values: ["Results and accountability", "Lower local taxes"],
  tradeoff:
    "Her program pairs wider access to treatment, shelter and housing with fewer layers of local taxes and fees; the statement does not say which taxes or which services would give way.",
  sources: [pamphlet(32), jbeHome, jbeMeet],
  issues: {
    housing: {
      position:
        "Act with urgency to connect more people struggling with mental health and addiction to treatment, services and housing; she cites expanded shelter beds and recovery housing as part of her record.",
      source: pamphlet(32),
      line: "Wants more people connected to treatment, services and housing, with urgency.",
      chip: "Treatment to housing",
      how: step(
        "Expand and diversify shelter so people have basic services, safety and stability, with pathways off the streets to recovery and stable housing; County facilities must negotiate Good Neighbor agreements.",
        jbeMeet,
      ),
    },
    safety: {
      position:
        "Give people in mental-health or addiction crisis treatment instead of jail or the ER through a rebuilt 24/7 Sobering Center; she cites securing funding aimed at auto theft, property crime and burglaries hitting local businesses.",
      source: pamphlet(32),
      line: "Supports treatment instead of jail or ER, plus funding against property crime.",
      chip: "Sobering center, not jail",
      how: step(
        "A replacement 24/7 Sobering and Crisis Stabilization Center planned with health-care, law-enforcement and treatment leaders; she says the funds are secured and it is under construction.",
        jbeMeet,
      ),
    },
    money: {
      position:
        "Reduce layers of local taxes and fees to make life more affordable, restore essential services by cutting administration, and require County-funded contractors to report their results and how taxpayer dollars are spent.",
      source: pamphlet(32),
      line: "Wants fewer layers of local taxes and fees, and contractors reporting results.",
      chip: "Fewer local taxes, fees",
    },
  },
});
ownWords.push(
  opening(
    "julia-brim-edwards",
    32,
    "It’s great to say you have a plan. But it doesn’t matter unless you can turn it into action, and results.",
    21,
    "The heading “WE’VE GOT PROBLEMS – TIME FOR REAL CHANGE” and an attributed Oregonian quotation are skipped; the first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "julia-brim-edwards",
  [
    web("https://www.juliabrim-edwards.com/", "pamphlet"),
    email("JuliaforCountyChair@gmail.com", "site"),
    form("https://www.juliabrim-edwards.com/get-involved", "Volunteer form", "site"),
    social("Facebook", "https://www.facebook.com/profile.php?id=61587517720936", "site"),
    social("Instagram", "https://www.instagram.com/juliabrimedwardsforcountychair", "site"),
    social("X", "https://twitter.com/brimjulia?lang=en", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 32", `${PAMPHLET}#page=32`, "Prints JuliaBrim-Edwards.com."),
    ref(
      "Brim-Edwards · Get Involved",
      "https://www.juliabrim-edwards.com/get-involved",
      "The page holds a sign-up form; the email link and profile links are in the site header and footer. No phone is published.",
    ),
  ],
);
primary.push({ candidateId: "julia-brim-edwards", sourceUrl: `${PAMPHLET}#page=32` });
portraits["julia-brim-edwards"] = portrait("julia-brim-edwards", 32);

const meieranHome = site("Meieran · campaign home", "https://www.sharonforchair.com/");
const meieranPlan = site("Meieran · the plan", "https://www.sharonforchair.com/the-plan");
candidate("sharon-meieran", {
  values: ["Structural reset", "Budget for results"],
  tradeoff:
    "She would restructure county governance, budgeting and contracting around measured outcomes and spend less doing it; the plan’s one- and two-year targets depend on authority a chair shares with the board.",
  sources: [pamphlet(33), meieranHome, meieranPlan, site("Meieran · Fixing Multnomah County", "https://fix-multco.com/")],
  issues: {
    housing: {
      position:
        "Replace what she calls a layered “nonsystem” of homeless services with one coordinated homelessness-to-housing continuum under a clear chain of command, judged by verified placement and retention outcomes.",
      source: meieranPlan,
      line: "Proposes one coordinated homelessness-to-housing system judged by verified placement and retention.",
      chip: "One coordinated system",
      how: step(
        "Within one year: a clear chain of command and integrated operational structure, a validated baseline of need, budgets aligned to measurable outcomes and funding redirected from ineffective programs.",
        meieranPlan,
      ),
      measure: step(
        "Within two years, a functioning homelessness-to-housing continuum with verified placement and retention outcomes and fewer returns to shelters, emergency rooms and jails.",
        meieranPlan,
      ),
    },
    safety: {
      position:
        "Get people with serious addiction and mental illness off the streets through an actual plan implemented by a leader driven to act.",
      source: meieranHome,
      line: "Wants a plan moving people with serious addiction and mental illness off streets.",
      chip: "Crisis-system reset",
      how: step(
        "Extend the homeless-services turnaround approach to behavioral health, public safety and human services by restructuring governance, budgeting, contracting and performance management.",
        meieranPlan,
      ),
      measure: step("Reduced returns to crisis systems such as shelters, emergency rooms and jails within two years.", meieranPlan),
    },
    money: {
      position:
        "She says the county spends $4 billion a year while its systems fail; she would budget for results, account for every dollar and redirect funding from ineffective programs, improving results by doing its core work well instead of spending more.",
      source: meieranPlan,
      line: "Wants budgets tied to results, every dollar tracked, and money moved from ineffective programs.",
      chip: "Budget for results",
      how: step(
        "A real-time, validated baseline of need across departments and budgets aligned with measurable outcomes, with ineffective programs identified and their funding redirected.",
        meieranPlan,
      ),
      measure: step("Transparent performance dashboards published within one year of taking office.", meieranPlan),
    },
  },
});
ownWords.push(
  opening(
    "sharon-meieran",
    33,
    "Multnomah County is broken. As an emergency room doctor, every day I’d treat people with addiction, mental illness, abuse and neglect – the very problems the county is responsible for addressing.",
    30,
    "The first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "sharon-meieran",
  [
    web("https://www.sharonforchair.com/", "site"),
    email("info@sharonforchair.com", "site"),
    phone("9712020982", "(971) 202-0982", "site"),
    form("https://www.sharonforchair.com/getinvolved", "Volunteer form", "site"),
    social("Instagram", "https://www.instagram.com/sharonforchair/", "site"),
    social("Facebook", "https://www.facebook.com/SharonMeieran/", "site"),
    social("X", "https://x.com/SMeieran", "site"),
    social("LinkedIn", "https://www.linkedin.com/in/sharon-meieran-8908b030/", "site"),
  ],
  [
    ref(
      "Multnomah County voters’ pamphlet · PDF page 33",
      `${PAMPHLET}#page=33`,
      "Prints fixmultco.com, which redirects to fix-multco.com (her policy site); that site links the campaign site sharonforchair.com, listed here as the website.",
    ),
    ref("Meieran · campaign home", "https://www.sharonforchair.com/", "Email, phone and profile links are in the site footer; the Get Involved page holds sign-up forms."),
  ],
);
roles.push({ candidateId: "sharon-meieran", role: "Physician; former county commissioner", from: "background" });
primary.push({ candidateId: "sharon-meieran", sourceUrl: `${PAMPHLET}#page=33` });
portraits["sharon-meieran"] = portrait("sharon-meieran", 33);

const singletonMeet = site("Singleton · Meet Shannon", "https://www.shannonsingleton.org/meet-shannon");
const singletonRecord = site("Singleton · record of reforms", "https://www.shannonsingleton.org/reformrecord");
candidate("shannon-singleton", {
  values: ["Frontline experience", "Collaboration"],
  tradeoff:
    "She would redesign services with providers, business owners and neighbors at the table, backed by a record she describes as realigning funds to core services; her statement names no deadlines or costs.",
  sources: [pamphlet(32), site("Singleton · campaign home", "https://www.shannonsingleton.org/"), singletonMeet, singletonRecord],
  issues: {
    housing: {
      position:
        "Find real, lasting solutions to the homelessness crisis by building better systems with the people closest to the problem: service providers, small business owners, neighbors and people who disagree with her.",
      source: pamphlet(32),
      line: "Wants homelessness systems rebuilt with providers, businesses and neighbors at the table.",
      chip: "Rebuild homeless services",
      how: step(
        "Realign county funds to core services that end homelessness (shelter, outreach and housing) and reduce service duplication with tighter oversight of the Homeless Services Department, as she says she pushed for.",
        singletonRecord,
      ),
    },
    safety: {
      position:
        "Reform the Deflection Center (the police alternative to arrest for drug use) so it connects addiction, housing and behavioral-health services, saves money and drives outcomes; she also cites strengthening safety-net protections in response to ICE actions.",
      source: singletonRecord,
      line: "Supports Deflection Center (arrest alternative) reforms linking addiction, housing and health services.",
      chip: "Reform Deflection Center",
    },
    money: {
      position:
        "Push for more effective use of taxpayers’ dollars; she cites coauthoring the county’s first lobbyist disclosure rules and Deflection Center reforms meant to save money.",
      source: singletonRecord,
      line: "Wants taxpayer dollars used more effectively; cites coauthoring lobbyist disclosure rules.",
      chip: "Effective use of dollars",
    },
    climate: {
      position:
        "She cites facilitating the compromise on the Rose Quarter Improvement Project, putting it in line for federal infrastructure investment, and leading the community-benefits process for the Interstate Bridge Replacement.",
      source: singletonMeet,
      line: "Backed the Rose Quarter project compromise and Interstate Bridge community benefits.",
      chip: "Rose Quarter compromise",
    },
  },
});
ownWords.push(
  opening(
    "shannon-singleton",
    32,
    "I’ve spent my career taking on the toughest fights: supporting sexual assault survivors, foster youth, and people experiencing homelessness.",
    19,
  ),
);
contact(
  "shannon-singleton",
  [
    web("https://www.shannonsingleton.org/", "pamphlet"),
    email("info@shannonsingleton.org", "site"),
    form("https://www.shannonsingleton.org/volunteer-with-shannon", "Volunteer form", "site"),
    social("Facebook", "https://www.facebook.com/profile.php?id=61557834951157", "site"),
    social("Instagram", "https://www.instagram.com/electshannonsingleton/", "site"),
    social("X", "https://twitter.com/ElectSingleton", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 32", `${PAMPHLET}#page=32`, "Prints www.shannonsingleton.org."),
    ref(
      "Singleton · Volunteer With Shannon",
      "https://www.shannonsingleton.org/volunteer-with-shannon",
      "The page holds a sign-up form; profile links are in the site footer. The campaign email is published in the site’s business-contact metadata rather than on a visible page; no phone is shown on any page.",
    ),
  ],
);
primary.push({ candidateId: "shannon-singleton", sourceUrl: `${PAMPHLET}#page=32` });
portraits["shannon-singleton"] = portrait("shannon-singleton", 32);
ballots.push(ranked("multnomah-chair"));
choice.push({
  raceId: "multnomah-chair",
  text: "All three criticize current county outcomes. The differences are in the remedy: one stresses service-system experience and collaboration, one implementation, contract accountability and tax relief, and one a more fundamental reset of how the county is managed.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Multnomah County Commissioner, District 2 ──────────────────────── */
const broussardSite = site("Broussard · campaign site (listed on his County filing)", "https://www.broussardpdx.com/");
candidate("bruce-broussard", {
  values: ["Resource management", "Veterans and seniors"],
  tradeoff:
    "His statement offers broad priorities, a long service history and a promise to meet residents in person; it names no specific program change, cost or measure.",
  sources: [pamphlet(34), broussardSite],
  issues: {
    housing: {
      position:
        "Solve the county’s homeless-veteran problem by addressing veterans’ benefits, housing, mental-health care and access to medical care, continuing work he says he already does one veteran at a time.",
      source: broussardSite,
      line: "Wants homeless veterans’ benefits, housing, mental-health and medical care addressed.",
      chip: "House homeless veterans",
    },
    safety: {
      position:
        "Manage the right resources properly to address homeless camps, people with mental illness and drug-affected individuals.",
      source: pamphlet(34),
      line: "Wants resources managed properly to address camps, mental illness and drug use.",
      chip: "Manage resources for camps",
    },
    money: {
      position:
        "Living costs have greatly outpaced wage increases, and low-income residents need better resources.",
      source: pamphlet(34),
      line: "Wants better resources for low-income residents as living costs outpace wages.",
      chip: "Resources for low-income",
    },
  },
});
ownWords.push(
  opening(
    "bruce-broussard",
    34,
    "Together we can implement real solutions that improve the quality of living in our communities.",
    15,
    "The “COMMUNITY SERVICE:” list and the run-in label “TOGETHER WE CAN DO BETTER:” that precede it are skipped.",
  ),
);
contact(
  "bruce-broussard",
  [web("https://www.broussardpdx.com/", "filing"), phone("5037010457", "503-701-0457", "site"), email("hebertbroussard@gmail.com", "site")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 34", `${PAMPHLET}#page=34`, "Prints no website, email or phone."),
    ref(
      "Bruce Broussard · County candidate filing (SEL 101)",
      "https://multco.us/file/bruce_broussard_candidate_filing/download",
      "The handwritten website field gives www.broussardpdx.com and a second address, brucebroussardmultco2.com, that does not resolve. The form’s phone fields are not reproduced; the same number is printed on the campaign site.",
    ),
    ref(
      "Broussard · campaign site",
      "https://www.broussardpdx.com/",
      "The phone and email are printed under “CONTACT ME” on the home page. Parts of the site’s text predate the 2024 change in Portland’s form of government.",
    ),
  ],
);
roles.push({ candidateId: "bruce-broussard", role: "Retired veterans-service nonprofit administrator", from: "background" });
primary.push({ candidateId: "bruce-broussard", sourceUrl: `${PAMPHLET}#page=34` });
portraits["bruce-broussard"] = portrait("bruce-broussard", 34);

const cruzIssues = site("Cruz · issues", "https://www.serenacruz.com/issues");
candidate("serena-cruz", {
  values: ["Operational experience", "Integrated services"],
  tradeoff:
    "She presents county operating experience as the way to align housing, treatment and preschool delivery; much of her plan runs through partners the county does not control (the City, Metro, the Legislature, a charter change).",
  sources: [pamphlet(35), site("Cruz · campaign home", "https://www.serenacruz.com/"), cruzIssues],
  issues: {
    housing: {
      position:
        "Align the County, City and Metro so the highest-need neighbors get behavioral-health support that connects crisis stabilization to recovery housing to a home of their own; she cites leading Bridges to Housing across four counties and building land-trust homes.",
      source: cruzIssues,
      line: "Wants County, City and Metro aligned from crisis stabilization to recovery housing to homes.",
      chip: "Crisis to housing pipeline",
      how: step(
        "Advocate higher-density zoning where transit already runs (North Interstate, for example) through the 2027 legislative session, and align County, City and Metro around one response instead of finger-pointing.",
        cruzIssues,
      ),
      measure: step(
        "Points to 11,000 people housed in four years with 83% still housed two years later, and to her Bridges to Housing record: domestic-violence reports down from 36% to under 10% over five years.",
        cruzIssues,
      ),
    },
    safety: {
      position:
        "Stop highest-need neighbors cycling through emergency rooms, jails, shelters and the streets by connecting crisis stabilization to recovery housing; she says about 9% of the Medicaid population is homeless with untreated illness and drives 40% of system costs.",
      source: cruzIssues,
      line: "Wants people out of the ER–jail–shelter–street cycle through connected crisis care.",
      chip: "End ER–jail–street cycle",
    },
    money: {
      position:
        "The county cannot cut or tax its way out of a structural deficit she puts at $33 million by 2030; grow the tax base by partnering in Portland’s economy, require project labor and community benefits agreements on County-funded projects, and seek an annual payment in lieu of taxes in the Moda Center deal.",
      source: cruzIssues,
      line: "Wants the county to grow its tax base rather than cut or tax more.",
      chip: "Grow the tax base",
      how: step(
        "Treat the Moda Center renovation as economic development: public dollars tied to a project labor agreement, a community benefits agreement naming Albina Vision Trust, a 20-year Blazers commitment and an annual payment in lieu of taxes.",
        cruzIssues,
      ),
      measure: step(
        "Names the gap to close: property and business income taxes are 72% of the General Fund, an $11 million hole was closed this summer and the structural deficit grows to $33 million by 2030.",
        cruzIssues,
      ),
    },
    climate: {
      position:
        "Give every Climate Justice Plan goal a named owner, a cost and milestones; protect rent assistance, expand renter access to heat pumps, send cooling and clean-air money first to low-canopy neighborhoods, hold the county to its fossil-fuel-free building resolution, press DEQ to keep permitted emissions low in Cully, Sumner and Parkrose, and hold Zenith to its 2027 deadline to stop handling crude oil while opposing any fuel-hub expansion.",
      source: cruzIssues,
      line: "Wants Climate Justice Plan goals owned, costed and scheduled, and heat pumps for renters.",
      chip: "Costed climate plan",
      how: step(
        "Lower the threshold for the county’s Clean Air Construction Standard, extend the fossil-fuel-free building resolution to resilience standards for emergency shelters, and file formal comment on DEQ’s seismic review of the fuel hub.",
        cruzIssues,
      ),
      measure: step(
        "Zenith’s October 2027 deadline to end crude-oil handling enforced by the City and DEQ; cooling and clean-air investments reaching Parkrose and Argay Terrace first.",
        cruzIssues,
      ),
    },
  },
});
ownWords.push(opening("serena-cruz", 35, "Local government CAN work better for people in North and Northeast Portland.", 12));
contact(
  "serena-cruz",
  [
    web("https://www.serenacruz.com/", "pamphlet"),
    email("info@serenacruz.com", "site"),
    form("https://www.serenacruz.com/get-involved", "Volunteer form", "site"),
    social("Facebook", "https://www.facebook.com/people/Cruz-for-Commissioner/61591460686353/", "site"),
    social("Instagram", "https://www.instagram.com/Cruzforcommissioner", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 35", `${PAMPHLET}#page=35`, "Prints serenacruz.com."),
    ref("Cruz · Get Involved", "https://www.serenacruz.com/get-involved", "Holds a get-involved form; the email and profile links are in the site footer. No phone is published."),
  ],
);
roles.push({ candidateId: "serena-cruz", role: "Former county commissioner and COO", from: "background" });
primary.push({ candidateId: "serena-cruz", sourceUrl: `${PAMPHLET}#page=35` });
portraits["serena-cruz"] = portrait("serena-cruz", 35);

const greenePriorities = site("Greene · priorities", "https://www.hermangreene.com/priorities");
candidate("herman-greene", {
  values: ["Measured results", "Jobs as housing policy"],
  tradeoff:
    "His accountability tools (retention targets, performance-based contracts, published timelines and outcomes) are more specific than a general promise of transparency; their bite depends on targets and consequences he has not set.",
  sources: [pamphlet(34), site("Greene · campaign home", "https://www.hermangreene.com/"), greenePriorities],
  issues: {
    housing: {
      position:
        "Set measurable housing-retention goals, use performance-based contracts, and publish timelines, spending and results.",
      source: pamphlet(34),
      line: "Wants measurable housing-retention goals and performance-based contracts, with results published.",
      chip: "Housing-retention targets",
      how: step(
        "Connect housing programs with mental-health, addiction-recovery and workforce services and tighten coordination between providers and county agencies to reduce repeat homelessness.",
        greenePriorities,
      ),
      measure: step("Fewer people returning to the streets and more families regaining stability, judged against published housing-retention goals; no target number is given.", greenePriorities),
    },
    safety: {
      position:
        "Coordinate crisis response, treatment and housing, intervene earlier to reduce repeat crises, support frontline workers with better systems, and publicly report safety outcomes.",
      source: pamphlet(34),
      line: "Wants crisis response, treatment and housing coordinated, with safety outcomes reported publicly.",
      chip: "Coordinate crisis response",
      how: step(
        "Strengthen coordination between crisis-response teams and service providers and improve access to mental-health and addiction treatment, addressing the root causes of crisis.",
        greenePriorities,
      ),
      measure: step("Fewer repeat emergency calls and repeated emergencies, with safety outcomes reported publicly.", greenePriorities),
    },
    money: {
      position:
        "Government must be accountable to the people it serves: measurable results, performance-based contracts, published timelines and spending, and county investments connected to job creation and living-wage careers.",
      source: pamphlet(34),
      line: "Wants performance-based contracts, published spending and county investments tied to jobs.",
      chip: "Pay contracts for results",
      how: step(
        "Partner with employers, labor and apprenticeship programs, expand workforce-training partnerships and remove barriers to work so county investments create jobs.",
        greenePriorities,
      ),
    },
  },
});
ownWords.push(
  opening(
    "herman-greene",
    34,
    "District 2 deserves a county government that delivers. I am a father, pastor, small business owner, community leader and longtime District 2 resident.",
    23,
    "The first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "herman-greene",
  [web("https://www.hermangreene.com/", "pamphlet"), form("https://www.hermangreene.com/get-involved", "Volunteer form", "site")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 34", `${PAMPHLET}#page=34`, "Prints HermanGreene.com."),
    ref(
      "Greene · Get Involved",
      "https://www.hermangreene.com/get-involved",
      "Holds a volunteer form and a newsletter sign-up; no email, phone or social profile is published on the site (the footer gives a P.O. box only).",
    ),
  ],
);
roles.push({ candidateId: "herman-greene", role: "Pastor and former school-board member", from: "background" });
primary.push({ candidateId: "herman-greene", sourceUrl: `${PAMPHLET}#page=34` });
portraits["herman-greene"] = portrait("herman-greene", 34);

const norrisPlatform = site("Ong Norris · platform", "https://www.nathanongnorris.com/platform");
candidate("nathan-ong-norris", {
  values: ["Democratic socialist", "Climate justice"],
  tradeoff:
    "He treats public services and climate protection as promises society keeps to each other; his platform lists what to expand (preschool, social housing, libraries) without naming the recurring revenue.",
  sources: [pamphlet(36), site("Ong Norris · campaign home", "https://www.nathanongnorris.com/"), norrisPlatform],
  issues: {
    housing: {
      position:
        "Safe and stable housing is one of society’s promises: eviction prevention, anti-displacement and housing-stability measures, regional social housing (publicly owned, mixed-income homes) and community benefits agreements.",
      source: norrisPlatform,
      line: "Supports social housing (publicly owned), eviction prevention and anti-displacement measures.",
      chip: "Social housing",
    },
    money: {
      position:
        "The county cuts services while giving money and land to billionaires, which must stop; expand the common good instead: Preschool for All, social housing, public libraries and critical infrastructure, with affordable utilities.",
      source: pamphlet(36),
      line: "Wants county service cuts and money and land for billionaires stopped; more public services.",
      chip: "Expand public services",
    },
    climate: {
      position:
        "Implement the county’s Climate Justice Plan, hold polluters accountable, keep utilities affordable, support clean energy, and mitigate the risks of the CEI Hub (the riverside fuel-tank hub) while preventing its expansion.",
      source: pamphlet(36),
      line: "Wants the Climate Justice Plan implemented, polluters held accountable, no CEI Hub expansion.",
      chip: "Climate Justice Plan",
      how: step(
        "Oversight of private utility companies and reductions in greenhouse-gas emissions, alongside emergency management, community resilience and critical-infrastructure improvements.",
        norrisPlatform,
      ),
    },
  },
});
ownWords.push(
  opening(
    "nathan-ong-norris",
    36,
    "I’m a third generation Asian-American, union member, and community organizer. My parents raised my sister and I in Portland on one income.",
    22,
    "The slogan “A Democratic Socialist standing up for you, and your neighbors” (no terminal punctuation) is skipped; the first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "nathan-ong-norris",
  [
    web("https://www.nathanongnorris.com/", "pamphlet"),
    email("info@nathanongnorris.com", "site"),
    form("https://www.nathanongnorris.com/get-involved", "Volunteer form", "site"),
    social("Instagram", "https://www.instagram.com/nathanongnorris", "site"),
    social("Bluesky", "https://bsky.app/profile/nathanongnorris.bsky.social", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 36", `${PAMPHLET}#page=36`, "Prints www.nathanongnorris.com."),
    ref("Ong Norris · Get Involved", "https://www.nathanongnorris.com/get-involved", "Holds a volunteer form; the email and profile links are in the site footer. No phone is published."),
  ],
);
roles.push({ candidateId: "nathan-ong-norris", role: "Hazardous-waste technician and organizer", from: "background" });
primary.push({ candidateId: "nathan-ong-norris", sourceUrl: `${PAMPHLET}#page=36` });
portraits["nathan-ong-norris"] = portrait("nathan-ong-norris", 36);

const robertsonHome = site("Robertson · campaign home", "https://www.tonyrobertson.org/");
const robertsonPriorities = site("Robertson · priorities", "https://www.tonyrobertson.org/priorities");
candidate("tony-robertson", {
  values: ["Cross-agency coordination", "Fiscal transparency"],
  tradeoff:
    "He would make the county, city and state work as one system and open the county’s books; his priorities page commits to exploring, evaluating and partnering more than to any costed program.",
  sources: [pamphlet(37), robertsonHome, robertsonPriorities],
  issues: {
    housing: {
      position:
        "Partner with property owners so housing is not left empty while neighbors are on the street, evaluate county rules that may be getting in the way of help, and protect money for rent assistance, street outreach and housing placement.",
      source: robertsonPriorities,
      line: "Wants vacant units filled through property-owner partnerships and rent-assistance money protected.",
      chip: "Fill vacant units",
      how: step(
        "Expand technical assistance to contracted providers, evaluate county rules that get in the way of help, and protect dollars for rent assistance, street outreach and housing placement.",
        robertsonPriorities,
      ),
    },
    safety: {
      position:
        "Preserve and creatively expand behavioral-health services so people get care when they are ready, with coordination across health, housing, insurers and community providers, and fair wages and safe staffing for the mental-health workforce.",
      source: robertsonHome,
      line: "Wants behavioral-health access sped up through provider, insurer and health-system partnerships.",
      chip: "Faster behavioral care",
      how: step(
        "Partnerships with mental-health providers, insurers and health systems to speed access, stronger rates and safe conditions for providers, and referral and exit-plan fixes with the state and city.",
        robertsonPriorities,
      ),
    },
    money: {
      position:
        "Demand clear spending plans, measurable outcomes and real transparency for every program the county funds, including the Preschool for All reserve (he puts it at $610 million) and housing contracts where placements lag; explore local tax relief across jurisdictions.",
      source: robertsonHome,
      line: "Wants clear spending plans, measurable outcomes and options for local tax relief.",
      chip: "Open the county books",
      how: step(
        "More frequent public spending dashboards and budget information, earlier public input in the budget process, and a cross-jurisdiction review of the local tax structure for relief options.",
        robertsonPriorities,
      ),
    },
  },
});
ownWords.push(
  opening(
    "tony-robertson",
    37,
    "Born in North Portland and raised in NE Portland, Tony is deeply connected to our community.",
    16,
    "The heading “ROOTED HERE, READY TO SERVE N/NE PORTLAND” is skipped.",
  ),
);
contact(
  "tony-robertson",
  [web("https://www.tonyrobertson.org/", "pamphlet"), email("info@tonyrobertson.org", "site"), form("https://www.tonyrobertson.org/", "Volunteer form", "site")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 37", `${PAMPHLET}#page=37`, "Prints www.tonyrobertson.org."),
    ref("Robertson · campaign home", "https://www.tonyrobertson.org/", "The email is in the site footer; the home page holds endorse and volunteer forms. No phone or social profile is published."),
  ],
);
roles.push({ candidateId: "tony-robertson", role: "State civil-rights division manager", from: "background" });
primary.push({ candidateId: "tony-robertson", sourceUrl: `${PAMPHLET}#page=37` });
portraits["tony-robertson"] = portrait("tony-robertson", 37);

candidate("bri-williams", {
  values: ["Prevention", "Community-designed services"],
  tradeoff:
    "Her safety approach emphasizes preventing harm and stabilizing families through culturally specific services; the statement lists commitments without costs or the order in which they would be funded.",
  sources: [pamphlet(35), site("Williams · campaign home", "https://voteforbri.com/"), site("Williams · Meet Bri", "https://voteforbri.com/meet-bri/")],
  issues: {
    housing: {
      position:
        "Affordable housing with stronger eviction prevention so families aren’t pushed out, and solutions that prevent displacement and support renters and homeowners staying rooted in their neighborhoods.",
      source: pamphlet(35),
      line: "Supports affordable housing with stronger eviction prevention so families aren’t displaced.",
      chip: "Prevent evictions",
    },
    safety: {
      position:
        "Safer neighborhoods through investment in restorative justice, holistic health, prevention, youth, community-based solutions and services for survivors, plus behavioral-health and culturally specific services that meet people where they are.",
      source: pamphlet(35),
      line: "Supports prevention, restorative justice, youth investment and survivor services for safer neighborhoods.",
      chip: "Community-based safety",
    },
    money: {
      position:
        "Responsible budgeting that prioritizes essential services and programs that deliver measurable results, in a government that is transparent, accountable and accessible to every community.",
      source: pamphlet(35),
      line: "Wants budgets that put essential services and measurable results first.",
      chip: "Essential services first",
    },
  },
});
ownWords.push(
  opening(
    "bri-williams",
    35,
    "I’m a lifelong District 2 resident, social worker, and community advocate. I believe our County works best when the people most affected are in decision-making positions.",
    26,
    "The first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "bri-williams",
  [
    web("https://voteforbri.com/", "pamphlet"),
    form("https://voteforbri.com/#volunteer", "Volunteer form", "site"),
    social("Facebook", "https://www.facebook.com/people/Vote-for-Bri-Williams/61589512261034/", "site"),
    social("Instagram", "https://www.instagram.com/briformultnomah/", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 35", `${PAMPHLET}#page=35`, "Prints “www/voteforbri.com”, read as voteforbri.com."),
    ref("Williams · campaign home", "https://voteforbri.com/", "Holds a volunteer form; profile links are in the footer. No email or phone is published."),
  ],
);
primary.push({ candidateId: "bri-williams", sourceUrl: `${PAMPHLET}#page=35` });
portraits["bri-williams"] = portrait("bri-williams", 35);

const zHomelessness = site("Zaghloul · homelessness", "https://electnabil.com/issues/homelessness");
const zBehavioral = site("Zaghloul · behavioral health", "https://electnabil.com/issues/behavioral-health");
const zSafety = site("Zaghloul · public safety", "https://electnabil.com/issues/public-safety");
candidate("nabil-zaghloul", {
  values: ["Prevention first", "Retention tracking"],
  tradeoff:
    "He makes continued stability, not initial placement, the test of success and would tie contracts to it; the program results he cites are his own claims pending independent checks.",
  sources: [pamphlet(36), site("Zaghloul · campaign home", "https://electnabil.com/"), zHomelessness, zBehavioral, zSafety],
  issues: {
    housing: {
      position:
        "Introduce a Multnomah County Homelessness Reduction Act that puts prevention first, and publicly report housing retention at three, six, nine and twelve months for every County-funded program.",
      source: pamphlet(36),
      line: "Wants housing retention reported at 3, 6, 9 and 12 months for every program.",
      chip: "Track housing retention",
      how: step(
        "Require quarterly retention reporting in every nonprofit contract, expand the Supportive Housing Alliance (the county master-leases blocks of units and chooses the tenants), and fund prevention as a frontline strategy.",
        zHomelessness,
      ),
      measure: step(
        "Retention at three, six, nine and twelve months; he cites a prevention program that kept 2,800 households housed with over 90% still housed a year later, and 75 families rehoused last year, all still housed.",
        zHomelessness,
      ),
    },
    safety: {
      position:
        "Track whether people leaving the justice system actually reintegrate (find work, stay housed, stay out), invest in what Cully residents asked for (cameras, community safety networks, youth programs), and have enough behavioral-health professionals that police are not left handling mental-health crises they are not trained for.",
      source: zSafety,
      line: "Wants reintegration tracked, neighborhood safety networks funded, more behavioral-health staff for crises.",
      chip: "Track reentry, fund youth",
      how: step(
        "Rebuild addiction treatment around 12-to-24-month programs combining housing, treatment and employment, and expand youth programs like the one he says he runs in Cully on redirected funds and volunteers.",
        zBehavioral,
      ),
      measure: step("Treatment completion, housing stability and movement toward self-sufficiency measured for every program; reintegration after release tracked as standard.", pamphlet(36)),
    },
    money: {
      position:
        "Introduce a Multnomah County Accountability and Results Act: a public County Report Card showing what the county spends, what works, what doesn’t and where it must improve.",
      source: pamphlet(36),
      line: "Proposes a public county report card on what the county spends and what works.",
      chip: "Public report card",
      how: step("Prioritize and, when the budget permits, expand programs with strong retention rates; require quarterly outcome reporting in every nonprofit contract.", zHomelessness),
    },
  },
});
ownWords.push(
  opening(
    "nabil-zaghloul",
    36,
    "I’ve spent 32 years serving Multnomah County residents on the frontlines.",
    11,
    "The heading “A COUNTY THAT WORKS FOR EVERYONE” is skipped. The first sentence is under 12 words, but the section label “HOW TO FIX IT:” follows it directly, so a second sentence cannot be added without eliding the label; the excerpt stops at one sentence.",
  ),
);
contact(
  "nabil-zaghloul",
  [
    web("https://electnabil.com/", "pamphlet"),
    email("info@electnabil.com", "site"),
    phone("5038286075", "(503) 828-6075", "site"),
    social("Instagram", "https://www.instagram.com/electnabil", "site"),
    social("Facebook", "https://www.facebook.com/61561100093523/", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 36", `${PAMPHLET}#page=36`, "Prints www.electnabil.com."),
    ref("Zaghloul · campaign home", "https://electnabil.com/", "Email and phone are in the site footer with the profile links; the site has a newsletter sign-up but no contact form."),
  ],
);
roles.push({ candidateId: "nabil-zaghloul", role: "County human-services program director", from: "background" });
primary.push({ candidateId: "nabil-zaghloul", sourceUrl: `${PAMPHLET}#page=36` });
portraits["nabil-zaghloul"] = portrait("nabil-zaghloul", 36);

ballots.push(ranked("multnomah-district-2"));
districts.push({
  raceId: "multnomah-district-2",
  neighborhoods:
    "North and Northeast Portland: everything north of I-84 between the Willamette and the Columbia, from St. Johns east to NE 148th Avenue (Kenton, Cully, Parkrose and Argay included), plus a strip south of I-84 to Burnside between NE 44th and 82nd.",
  mapUrl: "https://multco.us/info/find-your-multnomah-county-district",
  mapSource: {
    label: "Multnomah County · Commissioner district boundaries",
    url: "https://multco.us/info/current-proposed-commissioner-district-boundaries",
    kind: "Election authority",
    date: "Checked September 21, 2026",
    note: "The county describes the district by streets and rivers, not neighborhoods; the named places are read off the county’s District 2 precinct map (2024). The lookup link resolves any address.",
  },
});
choice.push({
  raceId: "multnomah-district-2",
  text: "Compare the concrete mechanisms each names: performance-based contracts, housing-retention reporting, publicly owned housing, culturally specific care and coordination with employers. Broad promises of accountability are common; the differences are in what would be measured.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Multnomah County Auditor ───────────────────────────────────────── */
const pextonAbout = site("Pexton · about and priorities", "https://www.pextonforauditor.com/about");
candidate("nicole-pexton", {
  values: ["Quicker audits", "Public report card"],
  tradeoff:
    "Speed and breadth trade against depth; her advisory service would help departments early but needs safeguards so auditors never review their own advice.",
  sources: [pamphlet(38), site("Pexton · campaign home", "https://www.pextonforauditor.com/"), pextonAbout],
  issues: {
    money: {
      position:
        "Residents should see results and know their tax dollars are well spent: quicker audits with shorter reports that target key risks, and a public report card showing what was audited, what the results were and which recommendations remain outstanding.",
      source: pamphlet(38),
      line: "Proposes quicker, shorter audits and a public report card of open recommendations.",
      chip: "Audit report card",
      how: step("Advisory services that county departments can request from the auditors, developed alongside the audit program, so problems are caught early.", pextonAbout),
    },
  },
});
ownWords.push(
  opening(
    "nicole-pexton",
    38,
    "Growing up in East County, I realized I am a problem solver with a strong passion for improving government.",
    19,
    "The heading “Proven Problem Solver and Audit Leader” is skipped.",
  ),
);
contact(
  "nicole-pexton",
  [
    web("https://www.pextonforauditor.com/", "pamphlet"),
    email("nicole@pextonforauditor.com", "site"),
    form("https://www.pextonforauditor.com/contact", "Contact form", "site"),
    social("Facebook", "https://www.facebook.com/profile.php?id=61583462980374", "site"),
    social("Instagram", "https://www.instagram.com/pextonforauditor", "site"),
    social("LinkedIn", "https://www.linkedin.com/in/nicole-pexton-b6b48314/", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 38", `${PAMPHLET}#page=38`, "Prints www.pextonforauditor.com."),
    ref("Pexton · contact page", "https://www.pextonforauditor.com/contact", "Prints the email and a P.O. box beside a contact form; profile links are in the footer. No phone is published."),
  ],
);
roles.push({ candidateId: "nicole-pexton", role: "Chief audit executive", from: "background" });
primary.push({ candidateId: "nicole-pexton", sourceUrl: `${PAMPHLET}#page=38` });
portraits["nicole-pexton"] = portrait("nicole-pexton", 38);
ballots.push(ranked("multnomah-auditor"));
choice.push({
  raceId: "multnomah-auditor",
  text: "One candidate appears on the county’s checked filing list. An uncontested race still deserves a look at what the office would audit first, how fast reports would arrive and how open recommendations would be tracked.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Multnomah County Sheriff ───────────────────────────────────────── */
const sheriffSite = site("Morrisey O’Donnell · campaign home and priorities", "https://www.nicoleforsheriff2026.com/");
candidate("nicole-morrisey-o-donnell", {
  values: ["Visible presence", "Corrections oversight"],
  tradeoff:
    "She attributes falling gun violence, property crime and vacancies to her first term and asks to continue; crime trends and staffing outcomes deserve evaluation apart from campaign attribution.",
  sources: [pamphlet(38), sheriffSite],
  issues: {
    safety: {
      position:
        "Keep reducing crime through visible, proactive presence focused on violent crime and repeat offenders; run a safe, accountable corrections system with behavioral-health, education and job-readiness services; and expand behavioral-health and reentry work so law enforcement is not the only response.",
      source: sheriffSite,
      line: "Wants visible policing, accountable jails and expanded behavioral-health and reentry services.",
      chip: "Visible presence, reentry",
      how: step(
        "A public Corrections Recommendations Project dashboard tracking independent expert reviews, Sheriff’s Office staff assigned to a treatment-readiness program in the jails, and a Transit Police presence along MAX corridors.",
        sheriffSite,
      ),
      measure: step(
        "Cites gun-violence incidents and property crime down and person crime trending downward, accreditation in both law enforcement and corrections, and an agency vacancy rate cut by nearly 40%.",
        pamphlet(38),
      ),
    },
    money: {
      position:
        "Sustain core public-safety funding and build a stable workforce through recruiting, retention, training, wellness and modern tools; she credits county budget investments and a modernized hiring process for hiring 50% more employees in 2025 than in 2024.",
      source: sheriffSite,
      line: "Wants core public-safety funding maintained and hiring, training and technology funded.",
      chip: "Sustain safety funding",
      how: step("Investments in the Human Resources Unit for a faster, more responsive hiring process, plus training, leadership development and wellness programs.", sheriffSite),
      measure: step("Over 50% more employees hired in 2025 than in 2024 (114 hires, the first year since 2022 that hires exceeded separations), she says.", sheriffSite),
    },
  },
});
ownWords.push(
  opening(
    "nicole-morrisey-o-donnell",
    38,
    "Building on 30 years of service, I have spent the last four years as Sheriff working to make the Sheriff’s Office more responsive, accountable, transparent, and effective.",
    27,
    "The tagline “Proven Leadership. Real Results. Safer Communities.” (no predicate) and the salutation “Dear Neighbors,” are skipped.",
  ),
);
contact(
  "nicole-morrisey-o-donnell",
  [
    web("https://www.nicoleforsheriff2026.com/", "pamphlet"),
    email("nicoleforsheriff@gmail.com", "site"),
    social("Facebook", "https://www.facebook.com/nicoleforsheriff", "site"),
    social("Instagram", "https://www.instagram.com/nicoleforsheriff/", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 38", `${PAMPHLET}#page=38`, "Prints NicoleforSheriff2026.com."),
    ref("Morrisey O’Donnell · campaign home", "https://www.nicoleforsheriff2026.com/", "The email (“Contact:”) and profile links are in the site footer; no phone or contact form is published."),
  ],
);
primary.push({ candidateId: "nicole-morrisey-o-donnell", sourceUrl: `${PAMPHLET}#page=38` });
portraits["nicole-morrisey-o-donnell"] = portrait("nicole-morrisey-o-donnell", 38);
ballots.push(ranked("multnomah-sheriff"));
choice.push({
  raceId: "multnomah-sheriff",
  text: "One candidate appears on the county’s checked filing list. An uncontested race still warrants scrutiny: which independent jail-review recommendations remain open, how staffing and crime trends are measured, and what the next term would change.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Topics, stances and stakes ─────────────────────────────────────── */
/*
 * Office-specific comparison topics for the four Multnomah races, each
 * candidate's explicit stance on them, and the sourced facts behind each
 * office. Researched September 21, 2026. Board votes are read from the
 * Board Clerk's minutes on multnomah.granicus.com and the county's own
 * releases; a stance is recorded only where the candidate's own material
 * or recorded action speaks to the exact choice the column asks about.
 * Auditor and sheriff candidates are mostly gaps on county-board topics,
 * which is the honest state of their material.
 */
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
const stance = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip, text, source, ...reviewed });

/* Shared public-record sources. */
const minutesAug27 = record(
  "Board of County Commissioners · minutes, August 27, 2026 (R.2, Preschool for All ordinance)",
  "https://multnomah.granicus.com/MinutesViewer.php?view_id=3&clip_id=3575&doc_id=9a3cebd8-a303-11f1-a028-005056a89546",
  "Meeting of August 27, 2026; read September 21, 2026",
  "Second reading adopted 5–0 as amended; the transcript records the chair describing the one-year delay as the Singleton–Moyer amendment.",
);
const budgetFy27 = record(
  "Multnomah County · Board adopts balanced $4 billion budget for Fiscal Year 2027",
  "https://multco.us/news/news-release-multnomah-county-board-commissioners-closes-significant-spending-gap-adopts",
  "June 5, 2026",
  "Adopted 4–1; the release carries each commissioner's statement and the roll of amendments.",
);
const budgetModOct2025 = record(
  "Multnomah County · Board approves budget modification to partially fill homeless services funding gap",
  "https://multco.us/news/board-approves-budget-modification-partially-fill-homeless-services-funding-gap",
  "November 20, 2025",
  "Vote of October 30, 2025, 3–2; Commissioners Moyer and Brim-Edwards voted no.",
);
const deflectionResolution = record(
  "Multnomah County · Board adopts resolution recommending policies to strengthen drug deflection program",
  "https://multco.us/news/multnomah-county-board-adopts-resolution-recommending-policies-aim-strengthen-drug-deflection",
  "March 2, 2026",
  "Adopted unanimously February 26, 2026; co-sponsored by Commissioners Brim-Edwards and Singleton.",
);
const deflectionReport = record(
  "Multnomah County · Deflection Program 2024–2025 Annual Report",
  "https://multco.us/file/deflection_program_2024-2025_annual_report/download",
  "Program year September 1, 2024 – August 31, 2025",
);
const modaResolution = record(
  "Multnomah County · Board advances framework for regional investment in Moda Center renovation",
  "https://multco.us/news/news-release-board-commissioners-advances-framework-regional-investment-moda-center-renovation",
  "August 6, 2026",
  "Adopted 4–1 by the five-member Board; Commissioner Moyer cast the no vote, so the other four, Brim-Edwards and Singleton among them, voted aye.",
);
const emsBriefing = record(
  "Multnomah County · Board receives briefing on future of County's Emergency Medical Services",
  "https://multco.us/news/board-receives-briefing-future-countys-emergency-medical-services",
  "April 22, 2026",
);
const mcsoLetter = record(
  "Multnomah County Sheriff's Office · FY 2027 Requested Budget Transmittal Letter",
  "https://multco.us/file/fy_2027_mcso_transmittal_letter_-_requested/download",
  "February 6, 2026",
);
const forecastFy27 = record(
  "Multnomah County Budget Office · projects $10.5 million shortfall for the FY 2026-27 budget",
  "https://multco.us/news/budget-office-projects-105-million-shortfall-multnomah-countys-fy-2026-27-budget",
  "November 14, 2025",
);
const charterFaq = record(
  "Multnomah County · Charter Review Committee FAQs",
  "https://multco.us/info/charter-review-committee-faqs",
  "Checked September 21, 2026",
);

/*
 * The picker's extra columns: concrete choices the Board has made or faces
 * this term, ordered homelessness first (the choices the county alone makes
 * and the chair race turns on), then behavioral health, then money, then the
 * rest. Reordered and widened September 22, 2026; every id is stable because
 * deep links use them. Context facts are from the sources logged in
 * research/voters-guide-2026/outreach-2026-09-22/topic-sweep-multnomah.md.
 */
const multnomahTopics: ExtraTopic[] = [
  {
    id: "mult-shelter-cuts",
    label: "Shelter cuts",
    short: "Shelter cuts",
    question: "Close shelter beds to keep people in housing as homeless-services money falls?",
    context:
      "The FY 2027 budget, adopted 4–1 in June 2026, phases out 605 adult shelter units and 90 family vouchers so that about 9,000 formerly homeless people keep their rent assistance; the Homeless Services Department faced a $67 million gap.",
  },
  {
    id: "mult-city-county",
    label: "City-county agreement",
    short: "City deal",
    question: "Rewrite the city-county homelessness agreement so one government runs shelters?",
    context:
      "The agreement expires in July 2027. The city owes the county about $31 million a year, says the county owes it about $38 million for village shelters, and each government runs its own shelter system.",
  },
  {
    id: "mult-shs-tax",
    label: "Homeless-services tax",
    short: "SHS tax",
    question: "Back extending Metro's homeless-services tax past 2030 at a lower rate, with tighter spending rules?",
    context:
      "Metro's 1% tax on high incomes and business profits pays 61% of the county's homeless-services budget and expires in 2030. Metro shelved a 2025 draft that would have extended it to 2050 at 0.75% after polling 53% yes; the next chance is the 2028 ballot.",
  },
  {
    id: "mult-hsd-oversight",
    label: "Homeless Services oversight",
    short: "HSD oversight",
    question: "Tighter contract monitoring and outside audits of the Homeless Services Department after Sunstone Way?",
    context:
      "A county review found shelter contractor Sunstone Way billed $3.6 million in unallowable costs from July 2024 to February 2026, four years after an audit flagged $525,000 in overbilling by the same nonprofit; on April 9, 2026 the Board confirmed a new department director 3–2.",
  },
  {
    id: "mult-deflection",
    label: "Deflection center",
    short: "Deflection",
    question: "Keep and tighten the drug deflection center, or halt it?",
    context:
      "In its first year police made 606 referrals and 113 people completed deflection; 81% of those served at the center were homeless. A February 2026 Board resolution added stricter 90-day completion rules, and 78 people were referred in the first quarter of 2026.",
  },
  {
    id: "mult-sobering",
    label: "Sobering and treatment",
    short: "Sobering",
    question: "Keep the 2027 Recovery Pathways Center on schedule and fund more detox and treatment beds around it?",
    context:
      "On March 12, 2026 the Board voted 5–0 for the $29.8 million Recovery Pathways Center at 440 SE Stephens: 18 sobering stations and 29 withdrawal beds, $14.2 million from the General Fund, move-in October 1, 2027. Thirteen temporary sobering stations have run at the deflection center since April 2025.",
  },
  {
    id: "mult-budget-gap",
    label: "Closing the gap",
    short: "Budget gap",
    question: "Close the county's structural budget gap by cutting administration before services?",
    context:
      "The Budget Office projected a $10.5 million General Fund shortfall for FY 2027 growing to $33.8 million by FY 2030; the adopted FY 2027 budget eliminated at least 158 positions.",
  },
  {
    id: "mult-pfa-delay",
    label: "Preschool tax delay",
    short: "Preschool tax",
    question: "Keep delaying the Preschool for All tax increase, now set for 2028?",
    context:
      "On August 27, 2026 the Board voted 5–0 to push the scheduled 0.8-point increase on high earners from January 2027 to January 2028, its second delay; the program reported a $610 million fund balance and 7,100 seats for 2026–27.",
  },
  {
    id: "mult-moda",
    label: "Moda Center money",
    short: "Moda",
    question: "Up to $101.6 million in county money for the Moda Center renovation?",
    context:
      "On August 6, 2026 the Board voted 4–1 to set terms for a contribution of up to $101.6 million, drawn first from rental-car and tourism taxes; a vote on the final agreement is expected in December 2026.",
  },
  {
    id: "mult-jail-capacity",
    label: "Jail capacity",
    short: "Jails",
    question: "Keep both jails at their current funded capacity as the General Fund shrinks?",
    context:
      "The sheriff's required 5% cut option would have removed 38.9 corrections deputies, about 300 of roughly 1,130 funded beds; the FY 2027 budget kept capacity while bookings in February 2026 ran 22% above a year earlier.",
  },
  {
    id: "mult-sanctuary",
    label: "Sanctuary under pressure",
    short: "Sanctuary",
    question: "Keep the county's sanctuary code and refuse ICE detainers under federal pressure?",
    context:
      "On April 9, 2026 the Board voted 5–0 to write sanctuary rules into county code, barring immigration agents from non-public county space without a judicial warrant; on June 23, 2026 the U.S. House Judiciary Committee demanded the sheriff's detainer records by July 7, calling the policy a threat to public safety.",
  },
  {
    id: "mult-ambulance",
    label: "Ambulance staffing",
    short: "Ambulances",
    question: "Drop the two-paramedic ambulance rule for good?",
    context:
      "AMR has missed the county's eight-minute response target every month since March 2022; a 2024 settlement let some ambulances run with one paramedic and one EMT. A new Ambulance Service Plan goes to the Board in late 2026, before the AMR contract ends in 2028.",
  },
  {
    id: "mult-county-administrator",
    label: "Appointed administrator",
    short: "Administrator",
    question: "Move day-to-day county management from the elected chair to an appointed administrator?",
    context:
      "The charter makes the chair both a board member and the chief executive who proposes the $4 billion budget and hires department heads. A Charter Review Committee convenes in March 2027 and any change it proposes goes to voters in 2028.",
  },
];
/* The Board's choices go to the Board seats in full; the sheriff and the auditor get the ones their office acts on. */
const byId = (ids: string[]) => ids.map((id) => multnomahTopics.find((t) => t.id === id)!).filter(Boolean);
const topics: RaceTopics[] = [
  { raceIds: ["multnomah-chair", "multnomah-district-2"], topics: multnomahTopics },
  { raceIds: ["multnomah-sheriff"], topics: byId(["mult-jail-capacity", "mult-sanctuary", "mult-deflection", "mult-sobering", "mult-budget-gap", "mult-ambulance"]) },
  { raceIds: ["multnomah-auditor"], topics: byId(["mult-hsd-oversight", "mult-shs-tax", "mult-pfa-delay", "mult-budget-gap"]) },
];

/* Candidate-statement sources used only for stances. */
const meieranBudgetPost = site("Meieran · “When Too Much Is Not Enough” (newsletter, June 3, 2026)", "https://www.sharonforchair.com/newsletter/1h48ur4ba3mp3ylokn7o5gaho21mbn");
const meieranDeflectionPost = site("Meieran · “Multnomah County: Deflecting Responsibility” (newsletter, July 17, 2026)", "https://www.sharonforchair.com/newsletter/bxk3w0qbinlahsogwey6nkqvpvtaob");
const meieranPlanPdf = site("Meieran · Comprehensive Multnomah County Turnaround Plan (February 6, 2026 update), section IV, Governance Reset", "https://www.sharonforchair.com/s/Comprehensive-Multnomah-County-Turnaround-Plan-2-6-26-update.pdf");
const opbAmbulance2024 = reporting(
  "OPB · Multnomah County officials reject vote on ambulance staffing as AMR mediation comes to an end",
  "https://www.opb.org/article/2024/07/26/multnomah-county-officials-amr-mediation/",
  "July 26, 2024",
  "Reports the July 25, 2024 vote: Meieran's resolution, as amended, failed 3–1 with Brim-Edwards the only vote in support.",
);
const opbCityCounty = reporting(
  "OPB · Behind Portland's homelessness data, a familiar political fight emerges",
  "https://www.opb.org/article/2026/04/01/behind-portlands-homelessness-data-familial-political-fight-emerges/",
  "April 1, 2026",
);
const singletonShsRelease = record(
  "Commissioner Singleton · press release: proposes SHS reform; reallocation of $22 million",
  "https://multco.us/file/march_2025_singleton-shs-press-release.pdf/download",
  "March 3, 2025",
  "Published by her county office; the proposals are hers, not Board actions.",
);

/* Sources added in the September 22, 2026 sweep (see research/voters-guide-2026/outreach-2026-09-22/topic-sweep-multnomah.md). */
const REPORTED = (outlet: string) => `Reported statement; quote as printed by ${outlet}.`;
const jbeRaceInfo = site("Brim-Edwards · “Information About the Race” (media-resources PDF)", "https://www.juliabrim-edwards.com/s/Information-About-The-Race.pdf");
const jbeLaunchRelease = site("Brim-Edwards · campaign launch release (May 5, 2026, PDF)", "https://www.juliabrim-edwards.com/s/Julia-Brim-Edwards-Press-Release-050526.pdf");
const meieranSunstonePost = site("Meieran · “Sunstone scandal: Building accountability in Multnomah County” (June 30, 2026)", "https://www.sharonforchair.com/translating-the-news/sunstone");
const meieranModaPodcast: Evidence = {
  label: "NW Fresh Podcast · “Multnomah County CHOPPED | Chairmaxxing with Dr. Sharon Meieran on MODA Renovation” (YouTube)",
  url: "https://www.youtube.com/watch?v=YCSJ3o_ZgdE",
  kind: "Candidate statement",
  date: "Premiered July 20, 2026 (per her campaign's media page); captions read September 22, 2026",
  note: "Her own remarks on a podcast, read from YouTube's auto-generated captions (Moda from 07:18, Preschool for All from 22:58); not audited against the audio.",
};
const sanctuaryOrdinance = record(
  "Multnomah County · Board unanimously approves enshrining sanctuary policies into County code",
  "https://multco.us/news/news-release-multnomah-county-board-unanimously-approves-enshrining-sanctuary-policies-county",
  "April 9, 2026",
  "Adopted unanimously on April 9, 2026; co-sponsored by Chair Vega Pederson and Commissioner Singleton; carries statements from Singleton and Brim-Edwards.",
);
const soberingPlan = record(
  "Multnomah County · Board approves construction plan for 24/7 Sobering and Crisis Stabilization Center",
  "https://multco.us/news/board-approves-construction-plan-247-sobering-and-crisis-stabilization-center-facility-track",
  "March 13, 2026",
  "Project plan approved 5–0 on March 12, 2026 (Board minutes); carries statements from Brim-Edwards and Singleton.",
);
const soberingBriefing2024 = record(
  "Multnomah County · Board briefed on plans to develop a 24/7 dropoff sobering center",
  "https://multco.us/news/board-briefed-plans-develop-247-dropoff-sobering-center-new-center-would-fill-five-year-gap",
  "April 18, 2024",
  "Carries statements from then-Commissioner Meieran and Commissioner Brim-Edwards at the briefing.",
);
const vergowVote = reporting(
  "KPTV · Commissioners divided on new Multnomah County Homeless Services director",
  "https://www.kptv.com/2026/04/10/commissioners-divided-new-multnomah-county-homeless-services-director/",
  "April 10, 2026",
  "Reports the 3–2 confirmation vote of Thursday, April 9, 2026, naming Singleton and Jones-Dixon as the no votes on the five-member Board and her stated reason.",
);
const wwSunstone = reporting(
  "Willamette Week · Homeless Services Nonprofit Misspent $3.6 Million of Public Money, Report Finds",
  "https://www.wweek.com/news/county/2026/06/18/homeless-services-nonprofit-misspent-36-million-of-public-money-report-finds/",
  "June 18, 2026",
  REPORTED("Willamette Week"),
);
const katuShs2025 = reporting(
  "KATU · Multnomah County proposes funding changes to build more homeless housing, faster",
  "https://katu.com/news/local/multnomah-county-proposes-funding-changes-to-build-more-homeless-housing-faster",
  "January 9, 2025",
  `On Metro's January 2025 draft to extend the tax to 2050 and let it fund housing construction. ${REPORTED("KATU")}`,
);
const sheriffGrandJuryLetter = record(
  "Multnomah County Sheriff's Office · response to the 2025 Corrections Grand Jury report (letter to the District Attorney)",
  "https://katu.com/resources/pdf/d7ed45eb-4ac9-4bc7-8a13-effa1605fc46-2025CorrectionsGrandJury_SheriffResponseLetter.pdf",
  "January 9, 2026",
  "Signed by the sheriff; the PDF is hosted by KATU with its January 29, 2026 report on the grand jury.",
);
const katuSanctuaryInquiry = reporting(
  "KATU · Congressional inquiry into sanctuary laws seeks records from Multnomah County leaders",
  "https://katu.com/news/local/congressional-inquiry-into-sanctuary-laws-seeks-records-from-multnomah-county-leaders-ice-trump-administration-local-portland",
  "June 24, 2026",
  `Statement issued by the Sheriff's Office through its communications director, in response to the House Judiciary Committee's June 23, 2026 letter to the sheriff. ${REPORTED("KATU")}`,
);

const topicStances: TopicStance[] = [
  /* ── Julia Brim-Edwards (sitting commissioner, District 3) ─────────── */
  stance("julia-brim-edwards", "mult-pfa-delay", "supports", "Voted for 2028 delay",
    "Voted with the full Board on August 27, 2026 to push the scheduled 0.8-point increase to January 1, 2028, the ordinance's second reading.",
    minutesAug27),
  stance("julia-brim-edwards", "mult-shelter-cuts", "partial", "Voted no on budget",
    "Cast the lone no vote on the FY 2027 budget, saying it leaves too many gaps and will not reduce homelessness; she did not name the shelter closures as a reason and co-sponsored money to house people from closing shelters.",
    budgetFy27),
  stance("julia-brim-edwards", "mult-deflection", "supports", "Keep it, tighten rules",
    "Co-sponsored the February 26, 2026 resolution that keeps the center with stricter 90-day completion rules and housing links, saying deflection cannot be a revolving door back to the streets.",
    deflectionResolution),
  stance("julia-brim-edwards", "mult-moda", "supports", "Voted for $101.6M terms",
    "Voted for the August 6, 2026 resolution setting terms for up to $101.6 million, with a clawback, a 20-year Blazers commitment and a payment in lieu of taxes; Commissioner Moyer cast the only no vote.",
    modaResolution),
  stance("julia-brim-edwards", "mult-ambulance", "supports", "Backed one-paramedic model",
    "Cast the only vote for Meieran's July 2024 ambulance-staffing resolution, as amended to temporarily adopt the county's final offer to AMR if mediation did not end by August 1.",
    opbAmbulance2024),
  stance("julia-brim-edwards", "mult-budget-gap", "supports", "Cut administrative layers",
    "Says she voted against the FY 2027 budget because it missed the chance to reduce outgrown layers of administrative leadership and prioritize direct services with demonstrated results.",
    budgetFy27),
  stance("julia-brim-edwards", "mult-shs-tax", "partial", "Wary of Metro's timing",
    "Told KATU in January 2025 she was really concerned about the timing of Metro's draft to extend and broaden the tax, saying the county spends it as taxpayers want; she has not said whether to extend it past 2030.",
    katuShs2025),
  stance("julia-brim-edwards", "mult-hsd-oversight", "supports", "Heed the auditor",
    "Said after the Sunstone Way findings that the public and Commission should not have to rely on whistleblowers to expose misused taxpayer dollars, faulting the chair for not heeding the auditor's earlier warnings.",
    wwSunstone),
  stance("julia-brim-edwards", "mult-sobering", "partial", "Led sobering-center effort",
    "Her campaign says she led the effort to rebuild the 24/7 Sobering and Crisis Stabilization Center to provide addiction treatment instead of jail or the ER; it does not say whether to fund more detox and treatment beds around it.",
    jbeRaceInfo),
  stance("julia-brim-edwards", "mult-jail-capacity", "partial", "No emergency jail releases",
    "Her launch release says she offered budget amendments to fund public-safety positions and keep enough jail beds for serious crimes without emergency releases; it does not say whether both jails should keep their current funded capacity.",
    jbeLaunchRelease),
  stance("julia-brim-edwards", "mult-sanctuary", "supports", "Voted for sanctuary code",
    "Voted for the April 9, 2026 ordinance writing sanctuary rules into county code, saying the action sends a message that immigrants belong here and the county will keep protecting civil rights.",
    sanctuaryOrdinance),

  /* ── Shannon Singleton (sitting commissioner, District 2) ──────────── */
  stance("shannon-singleton", "mult-pfa-delay", "supports", "One-year delay, hers",
    "Moved the ordinance delaying the increase to January 2028 and voted for it on August 27, 2026; she and Commissioner Moyer had proposed the one-year delay in place of the chair's two-year plan.",
    minutesAug27),
  stance("shannon-singleton", "mult-shelter-cuts", "supports", "Voted for the budget",
    "Voted for the FY 2027 budget and said she is proud that housing stability and placement out of shelter are now part of the county's commitment, while noting District 2's voices did not prevail on every vote.",
    budgetFy27),
  stance("shannon-singleton", "mult-city-county", "supports", "One shelter system",
    "Told OPB she wants an end to both governments running shelters and other programs, saying the plan was written without a budget or clear roles and has too much duplication.",
    opbCityCounty),
  stance("shannon-singleton", "mult-deflection", "supports", "Link to housing, keep",
    "Issued a November 2025 reform proposal for the deflection program, then co-sponsored the February 2026 resolution adopting stricter completion rules, saying behavioral health and homeless services must break down silos.",
    deflectionResolution),
  stance("shannon-singleton", "mult-moda", "supports", "Voted for $101.6M terms",
    "Voted for the August 6, 2026 resolution setting terms for up to $101.6 million, with a clawback, a 20-year Blazers commitment and a payment in lieu of taxes; Commissioner Moyer cast the only no vote.",
    modaResolution),
  stance("shannon-singleton", "mult-budget-gap", "supports", "Admin review, core services",
    "In March 2025 proposed moving $22 million in homeless-services tax dollars out of administrative and other programs outside the Homeless Services Department, plus a review of that department's administrative structure to prioritize service dollars.",
    singletonShsRelease),
  stance("shannon-singleton", "mult-shs-tax", "partial", "Let it build housing",
    "In January 2025 backed Metro's proposal to let the tax buy and build housing, saying it would spare the city and state from finding gap financing; she has not said whether to extend the tax past 2030.",
    katuShs2025),
  stance("shannon-singleton", "mult-hsd-oversight", "partial", "No on new director",
    "Voted no on confirming director Nathaniel VerGow on April 9, 2026, preferring to wait for the chair election, after proposing commissioner-led reviews of the department in 2025; she has not said whether outside audits should follow Sunstone Way.",
    vergowVote),
  stance("shannon-singleton", "mult-sobering", "partial", "Voted for center plan",
    "Voted for the center's construction plan on March 12, 2026, saying she wants every opportunity for warm handoffs rather than referrals so care continues; she has not said whether to fund more detox beds beyond it.",
    soberingPlan),
  stance("shannon-singleton", "mult-jail-capacity", "partial", "Voted for the budget",
    "Voted for the FY 2027 budget that keeps both jails at full funded capacity; her budget statement speaks to housing stability and immigrant services, not to the jails.",
    budgetFy27),
  stance("shannon-singleton", "mult-sanctuary", "supports", "Co-sponsored sanctuary code",
    "Co-sponsored the April 9, 2026 ordinance writing sanctuary rules into county code, saying the county will stand up to bullies for immigrant and refugee neighbors and that the rules cover all county facilities.",
    sanctuaryOrdinance),

  /* ── Sharon Meieran (commissioner 2017–2024) ───────────────────────── */
  stance("sharon-meieran", "mult-shelter-cuts", "opposes", "No closures without plan",
    "Called the FY 2027 budget's closure of hundreds of shelter beds with no plan for the people affected a profound moral failure that will push costs onto emergency rooms, crisis services and jails.",
    meieranBudgetPost),
  stance("sharon-meieran", "mult-city-county", "partial", "Evaluate consolidation",
    "Her turnaround plan would lay the groundwork and evaluate mechanisms for city-county consolidation to address redundancies in overlapping functions; it does not say whether one government should run shelters.",
    meieranPlanPdf),
  stance("sharon-meieran", "mult-deflection", "opposes", "Halt current program",
    "Would halt the deflection program in its current form and replace the system that produced it, defining success by treatment completion and stable housing; says after more than $20 million the county cannot point to one such case.",
    meieranDeflectionPost),
  stance("sharon-meieran", "mult-ambulance", "supports", "One paramedic, one EMT",
    "As a commissioner introduced the July 2024 resolution pressing the chair to let ambulances run with one paramedic and one EMT, saying speed to the emergency room matters most for survival.",
    opbAmbulance2024),
  stance("sharon-meieran", "mult-county-administrator", "mixed", "Charter reform; maybe manager",
    "Her plan calls the chair's power outsized and proposes charter reform to redefine the chair's and commissioners' roles, potentially hiring a county manager or administrator, after immediate team-based governance changes.",
    meieranPlanPdf),
  stance("sharon-meieran", "mult-budget-gap", "supports", "Zero-based budgeting",
    "Would adopt zero-based budgeting so every program justifies its cost, and redirect money from ineffective structures and redundant contracts while preserving essential services.",
    meieranBudgetPost),
  stance("sharon-meieran", "mult-shs-tax", "partial", "Track every SHS dollar",
    "Her plan says the county got nearly $1 billion in Metro homeless-services tax money over four years with no way to tell where it went, and would redraft the SHS implementation plan; it does not address extending the tax.",
    meieranPlanPdf),
  stance("sharon-meieran", "mult-hsd-oversight", "supports", "Independent forensic review",
    "Would launch a public, independent performance and forensic review of county contracting on day one and adopt results-driven contracts, calling Sunstone Way a symptom of a system that spends first and asks questions later.",
    meieranSunstonePost),
  stance("sharon-meieran", "mult-sobering", "partial", "Center can stand alone",
    "Told the Board in April 2024 that a sobering center can stand alone and make a difference from the day it opens; she has not said whether the 2027 center should add more detox and treatment beds.",
    soberingBriefing2024),
  stance("sharon-meieran", "mult-moda", "partial", "Economic decision, negotiate",
    "On a July 2026 podcast called the Moda question an economic decision, said the Blazers' benefit is incontrovertible and the county should negotiate on costs and goals instead of a reset; she did not say whether to commit $101.6 million.",
    meieranModaPodcast),
  stance("sharon-meieran", "mult-pfa-delay", "partial", "Define goals before taxing",
    "On a July 2026 podcast said Preschool for All must define its goal and forecast its money, asking whether to raise taxes as promised when it has more than expected; she did not say whether the 2028 delay should stand.",
    meieranModaPodcast),
];

const norrisPledges = site("Ong Norris · pledges taken (Preschool for All pledge, July 2, 2026)", "https://www.nathanongnorris.com/pledges");
const norrisModaTestimony = site("Ong Norris · testimony on the Climate Justice Plan and Moda Center (July 23, 2026)", "https://www.nathanongnorris.com/news-updates/testimony-climate-justice-plan-moda");
topicStances.push(
  /* ── District 2 ────────────────────────────────────────────────────── */
  // Broussard and Williams: no statement on any of the thirteen choices in the pamphlet, on their sites or in the
  // venues logged in the September 22, 2026 sweep report. Ong Norris's pamphlet line on "resisting authoritarian
  // attacks on our immigrant neighbors" is a value, not a position on the sanctuary code; left as a gap.
  stance("serena-cruz", "mult-pfa-delay", "partial", "Full, stable funding",
    "Would fight for full, stable funding and universal access by 2030, citing over 7,400 seats for 2026–27; her issues page does not say whether the scheduled tax increase should stay delayed to 2028.",
    cruzIssues),
  stance("serena-cruz", "mult-city-county", "partial", "Align County, City, Metro",
    "Wants the County, City and Metro aligned around one coordinated response instead of finger-pointing; she does not say whether one government should run all shelters when the agreement expires.",
    cruzIssues),
  // Not a stance: her governance answer (budget notes, briefings, auditor findings) names no department and no
  // homeless-services choice, so it is a general value and stays a gap here.
  stance("serena-cruz", "mult-sobering", "partial", "Crisis to recovery housing",
    "Wants behavioral-health support that connects crisis stabilization to recovery housing so the highest-need Medicaid patients stop cycling through ERs and jails; she does not mention the 2027 center or detox beds.",
    cruzIssues),
  stance("serena-cruz", "mult-moda", "supports", "Yes, would seek terms",
    "Supports public dollars to keep the Blazers and the Fire and would seek a project labor agreement, a community benefits agreement naming Albina Vision Trust, at least a 20-year commitment and an annual payment in lieu of taxes.",
    cruzIssues),
  stance("serena-cruz", "mult-county-administrator", "supports", "Appointed administrator",
    "Supports a charter amendment creating an appointed county administrator, hired by the full Board through an open search, to run daily operations against performance measures while the elected chair and commissioners set policy.",
    cruzIssues),
  stance("serena-cruz", "mult-budget-gap", "partial", "Grow the tax base",
    "Says the county cannot cut or tax its way out of a structural deficit she puts at $33 million by 2030 and should partner in Portland's economy; she does not say whether to cut administration before services.",
    cruzIssues),
  stance("nathan-ong-norris", "mult-pfa-delay", "opposes", "No more delays",
    "Signed a pledge to reject any further delays in fully funding Preschool for All, support the full voter-approved tax rate and vote against any action that limits or reduces the program.",
    norrisPledges),
  stance("nathan-ong-norris", "mult-moda", "opposes", "No deal without guarantees",
    "Testified in July 2026 that the county should not throw dollars at a billionaire-owned franchise without guarantees, backing AFSCME Local 88's call to stop the vote and hire a professional negotiator.",
    norrisModaTestimony),
  stance("nabil-zaghloul", "mult-shelter-cuts", "partial", "Treatment, not more shelters",
    "Notes many of the 600 beds being cut were already empty and says the answer for people who refuse shelter is sustained behavioral-health and addiction treatment, not more shelters; he does not say whether the beds should close.",
    zHomelessness),
  stance("nabil-zaghloul", "mult-hsd-oversight", "partial", "Retention in every contract",
    "Would require quarterly housing-retention reporting in every nonprofit contract and publish it; he does not address fiscal monitoring, outside audits or the department's leadership after Sunstone Way.",
    zHomelessness),
  stance("nabil-zaghloul", "mult-sobering", "partial", "Fund long-term rehab",
    "Wants multi-year funding for 12-to-24-month programs combining housing, treatment and employment as the standard for people with overlapping needs; he does not mention the 2027 center or detox beds.",
    zBehavioral),
  stance("herman-greene", "mult-hsd-oversight", "partial", "Performance-based contracts",
    "Wants performance-based contracts and published timelines, spending and results for housing programs; his pamphlet does not mention the Homeless Services Department's leadership, Sunstone Way or outside audits.",
    pamphlet(34)),
  stance("tony-robertson", "mult-pfa-delay", "partial", "Plan for $610M reserve",
    "Demands a clear spending plan and measurable outcomes for the Preschool for All reserve, which he puts at $610 million; his site does not say whether the tax increase should stay delayed to 2028.",
    robertsonHome),
  stance("tony-robertson", "mult-city-county", "partial", "Clarify shared agreements",
    "Would evaluate the county's shared formal agreements to clarify roles and responsibilities and rebuild fractured relationships with other governments; he does not say whether one government should run shelters.",
    robertsonPriorities),
  stance("tony-robertson", "mult-hsd-oversight", "partial", "Outcomes for every contract",
    "Demands clear spending plans, measurable outcomes and transparency for every program the county funds, including housing contracts where placements lag; he does not mention outside audits or Sunstone Way.",
    robertsonHome),

  /* ── Auditor and Sheriff ───────────────────────────────────────────── */
  // Pexton: her material is about audit practice, not the Board's choices; no stance on any column.
  stance("nicole-morrisey-o-donnell", "mult-jail-capacity", "supports", "Preserve jail capacity",
    "Her FY 2027 budget letter urges the chair and Board to preserve current jail capacity and the HR hiring unit, warning a 5% cut would remove about 300 beds and could force releases.",
    mcsoLetter),
  stance("nicole-morrisey-o-donnell", "mult-deflection", "supports", "Fund the center more",
    "Wrote the District Attorney in January 2026 that her office fully agrees more support should go to the deflection center, adding that MCSO cannot be the county's default treatment provider.",
    sheriffGrandJuryLetter),
  stance("nicole-morrisey-o-donnell", "mult-sanctuary", "partial", "No detainer-only holds",
    "Her office told KATU in June 2026 it cannot hold people solely on ICE detainers and does not use its resources for civil immigration enforcement; it has not said whether the county's sanctuary code should stand.",
    katuSanctuaryInquiry),
  stance("nicole-morrisey-o-donnell", "mult-budget-gap", "partial", "Protect core services",
    "Her FY 2027 budget letter says she does not support reductions that would affect core services and that budget decisions should not come at the expense of community safety; it does not address cutting administration first.",
    mcsoLetter),
);

/* Stakes: the office's biggest current problems, each a fact with a source. Shared items are defined once. */
type StakeItem = RaceStakes["items"][number];
const stakeGeneralFund: StakeItem = {
  label: "General Fund gap",
  text: "The Budget Office projected a $10.5 million General Fund shortfall for FY 2027, growing to $33.8 million by FY 2030 as downtown property values fall and personnel costs rise; each one-point pay increase costs $4.1 million.",
  source: forecastFy27,
};
const stakeHomelessCuts: StakeItem = {
  label: "Homeless-services cuts",
  text: "The FY 2027 budget closed a $67 million Homeless Services gap by phasing out 605 adult shelter units and 90 family vouchers, leaving 1,667 county-funded units, and eliminated at least 158 positions countywide.",
  source: budgetFy27,
};
const stakeShelterResults: StakeItem = {
  label: "Shelter results",
  text: "The county's FY 2025 review of 31 adult shelters found they cost $98 million, about $47,000 per bed, served 6,731 people and sent 16% of those leaving to permanent housing.",
  source: record(
    "Multnomah County Homeless Services Department · Adult Shelter Review FY25",
    "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf",
    "January 2026",
  ),
};
const stakeShsRevenue: StakeItem = {
  label: "Homeless-services tax",
  text: "Metro's supportive housing tax sent the county $560 million from July 2021 to June 2025 and was forecast at $145.9 million for FY 2026, held back by weak Multnomah County employment; the tax expires in 2030.",
  source: reporting(
    "Willamette Week · Weakness in Multnomah County economy will hold back homeless services tax collections, Metro says",
    "https://www.wweek.com/news/2025/12/27/weakness-in-multnomah-county-economy-will-hold-back-homeless-service-tax-collections-metro-says/",
    "December 27, 2025",
    "The 2030 expiration is reported by OPB (July 1, 2025), when Metro decided not to seek renewal that year.",
  ),
};
const stakeCityCounty: StakeItem = {
  label: "City-county agreement",
  text: "The city-county homeless services agreement expires in July 2027 amid a dispute over $31 million the city owes the county and $38 million the city says it is owed; the county counted about 18,000 people homeless, 8,800 unsheltered, in early 2026.",
  source: opbCityCounty,
};
const stakePreschool: StakeItem = {
  label: "Preschool for All",
  text: "Preschool for All reported a $610 million fund balance and 7,100 seats for 2026–27 against more than 6,000 applications; on August 20, 2026 the Board unanimously advanced a second one-year delay of the scheduled 0.8-point tax increase, to January 2028.",
  source: reporting(
    "Willamette Week · County commissioners are on track to delay scheduled tax increase for Preschool for All",
    "https://www.wweek.com/news/schools/2026/08/20/county-commission-on-track-to-delay-scheduled-tax-increase-for-preschool-for-all/",
    "August 20, 2026",
    "The second reading was adopted 5–0 on August 27, 2026 (Board minutes).",
  ),
};
const stakeDeflection: StakeItem = {
  label: "Deflection results",
  text: "In the deflection program's first year, September 2024 to August 2025, police made 606 referrals for 520 people and 113 completed deflection; 81% of the 354 people served at the center were homeless.",
  source: deflectionReport,
};
const stakeAmbulance: StakeItem = {
  label: "Ambulance plan due",
  text: "The AMR contract ends in 2028 and a new Ambulance Service Plan is due for a Board vote in late 2026; the county pays no direct subsidy, 77% of patients are on Medicare or Medicaid, and staff call the funding model fragile.",
  source: emsBriefing,
};
const stakeBurnside: StakeItem = {
  label: "Burnside Bridge cost",
  text: "The Earthquake Ready Burnside Bridge is now estimated at $1.6 billion to $1.8 billion, with about $740 million secured and only $7 million federal; in October 2025 the county pushed construction past 2028 with no new date.",
  source: reporting(
    "OPB · Construction delayed again for earthquake-ready Burnside Bridge in Portland",
    "https://www.opb.org/article/2025/10/20/burnside-bridge-portland-oregon-infrastructure-cascadia-big-one-earthquake/",
    "October 21, 2025",
  ),
};
const stakeModa: StakeItem = {
  label: "Moda Center deal",
  text: "The Board's August 6, 2026 resolution sets a county contribution of up to $101.6 million, paid first from rental-car and tourism taxes with no cost-overrun liability; a final agreement vote is expected in December 2026 and budget adoptions in June 2027 and 2028.",
  source: modaResolution,
};
const stakeSobering: StakeItem = {
  label: "Sobering center",
  text: "The $29.8 million 24/7 Sobering and Crisis Stabilization Center, 47 stations and beds, uses $15.6 million in state money and $14.2 million from the General Fund over two budgets; move-in is targeted for October 1, 2027.",
  source: record(
    "Multnomah County · Board approves construction plan for 24/7 Sobering and Crisis Stabilization Center",
    "https://multco.us/news/board-approves-construction-plan-247-sobering-and-crisis-stabilization-center-facility-track",
    "March 13, 2026",
    "Project plan approved 5–0 on March 12, 2026 (Board minutes).",
  ),
};

const stakeContractor: StakeItem = {
  label: "Contractor oversight",
  text: "A county fiscal review released June 2026 found shelter contractor Sunstone Way billed $3.6 million in unallowable costs from July 2024 to February 2026, $1.6 million of it recommended for recovery; the auditor had flagged $525,000 in overbilling by the same nonprofit in 2022 and says her monitoring recommendations were not followed.",
  source: reporting(
    "Willamette Week · Homeless Services Nonprofit Misspent $3.6 Million of Public Money, Report Finds",
    "https://www.wweek.com/news/county/2026/06/18/homeless-services-nonprofit-misspent-36-million-of-public-money-report-finds/",
    "June 18, 2026",
    "The 2022 overbilling figure and the unfollowed monitoring recommendations are from Willamette Week, May 11, 2026, on the auditor's April 21 memorandum.",
  ),
};

const stakes: RaceStakes[] = [
  {
    raceId: "multnomah-chair",
    intro:
      "The chair proposes the county's $4 billion budget, hires every department head and runs the homeless, health and human-services systems. The next chair inherits shelter closures already in the budget, a city partnership that expires in 2027, a homeless-services tax that expires in 2030 and a shrinking General Fund.",
    items: [stakeHomelessCuts, stakeCityCounty, stakeShsRevenue, stakeContractor, stakeGeneralFund, stakeDeflection, stakePreschool, stakeAmbulance, stakeBurnside],
  },
  {
    raceId: "multnomah-district-2",
    intro:
      "Commissioners adopt and amend the chair's budget, set policy and hold departments to account by vote and budget note. This seat covers North and Northeast Portland, including the Rose Quarter, and it decides the same shelter, budget and Moda Center questions as the chair.",
    items: [stakeHomelessCuts, stakeCityCounty, stakeShelterResults, stakeContractor, stakeGeneralFund, stakeDeflection, stakeSobering, stakePreschool, stakeModa],
  },
];

const jailFollowUp = record(
  "Multnomah County Auditor · Recommendation Status Evaluation: Jail Conditions",
  "https://multco.us/info/recommendation-status-evaluation-jail-conditions",
  "July 2026",
);
stakes.push(
  {
    raceId: "multnomah-auditor",
    intro:
      "The auditor is independently elected, sets the office's own audit schedule and reports publicly on whether departments carry out its recommendations. Its findings are the Board's main outside check on a $4 billion budget.",
    items: [
      {
        label: "Real estate overpayments",
        text: "An August 2026 audit found no policy requiring Board approval to buy land or buildings and potential overpayments of $1.18 million on four properties, out of $50.4 million the county spent on real estate from 2019 to 2025.",
        source: record("Multnomah County Auditor · Multnomah County Real Estate Purchases", "https://multco.us/info/multnomah-county-real-estate-purchases", "August 2026"),
      },
      {
        label: "Jail recommendations open",
        text: "A July 2026 follow-up found the Sheriff's Office had implemented five of the 2022 jail-conditions recommendations and not four, including ending isolation as discipline for people with mental illness; an independent jail-review function remains unimplemented by the Sheriff and Board.",
        source: jailFollowUp,
      },
      {
        label: "Contractor oversight",
        text: "In April 2026 the auditor asked the Board to press for 2022 recommendations on monitoring county-funded startups after Sunstone Way, which the county advanced $377,456 and then gave another $1.1 million despite overbilling findings, announced it was closing.",
        source: record(
          "Multnomah County Auditor · Memorandum to the Board: request for advocacy to implement Auditor recommendations",
          "https://multco.us/file/memorandum_to_board_of_county_commissioners:_request_for_advocacy_to_implement_auditor_recommendations/download",
          "April 21, 2026",
        ),
      },
      {
        label: "Audits underway",
        text: "As of September 9, 2026 the office lists five audits in progress: bridges, Corrections Health, gift cards, jail visits and supportive housing services.",
        source: record("Multnomah County Auditor · Audits in Progress", "https://multco.us/info/audits-progress", "Last reviewed September 9, 2026"),
      },
      {
        label: "Money flows to watch",
        text: "The auditor's 2026 financial condition report notes FY 2025 Supportive Housing Fund spending rose more than $71 million, Preschool for All community-services spending more than $39 million, and the Health Department took in over $15 million in state deflection money.",
        source: record("Multnomah County Auditor · Financial Condition Report 2026", "https://multco.us/info/financial-condition-report-2026", "May 2026"),
      },
      stakeGeneralFund,
    ],
  },
  {
    raceId: "multnomah-sheriff",
    intro:
      "The sheriff runs two jails funded for about 1,130 beds, patrols unincorporated areas, contract cities and transit, and manages roughly 800 employees on a $225 million budget that the Board funds but does not direct.",
    items: [
      {
        label: "Jail beds at risk",
        text: "The sheriff's FY 2027 budget letter said the required 5% General Fund cut of $9.7 million would include eliminating 38.9 corrections deputies, about 300 jail beds or 27% of budgeted capacity; the General Fund supplies 87% of the office's $225 million budget.",
        source: mcsoLetter,
      },
      {
        label: "Bookings and hiring",
        text: "MCSO processed 1,721 standard jail bookings in February 2026, 22% more than a year earlier; it hired 114 people in 2025 for a net gain of 32 staff, the first year since 2022 that hires exceeded separations, while corrections deputies remain the highest-vacancy job.",
        source: record(
          "Multnomah County Sheriff's Office · Sheriff reports 50% increase in hiring; applauds county investments",
          "https://www.mcso.us/public-information/sheriff-nicole-morrisey-odonnell-reports-50-increase-hiring-applauds-county",
          "March 19, 2026",
        ),
      },
      {
        label: "Programs ending",
        text: "The chair's FY 2027 proposal kept jail capacity, but the sheriff is ending the Close Street pretrial program and eliminated the two-deputy HOPE homeless outreach team to staff investigations, civil backlogs and gun dispossession; her request for more courthouse deputies went unfunded.",
        source: record(
          "Multnomah County Sheriff's Office · Sheriff shares community letter following release of Chair's proposed budget for FY 2027",
          "https://www.mcso.us/public-information/multnomah-county-sheriff-nicole-morrisey-odonnell-shares-community-letter",
          "April 20, 2026",
        ),
      },
      {
        label: "Pretrial shift",
        text: "The adopted FY 2027 budget adds $728,000 in ongoing money to a $1 million plan moving pretrial monitoring from the Sheriff's Office and Department of Community Justice to the circuit court system.",
        source: budgetFy27,
      },
      {
        label: "In-custody deaths",
        text: "Two adults in custody died in one week in August 2026: a 71-year-old at the Detention Center on August 18 and a 48-year-old at Inverness Jail on August 20, each under an ongoing death investigation.",
        source: record("Multnomah County Sheriff's Office · News releases", "https://www.mcso.us/news-information", "Releases of August 18 and 20, 2026; checked September 21, 2026"),
      },
      { label: "Jail audit follow-up", text: "The county auditor's July 2026 follow-up found four 2022 jail-conditions recommendations not implemented, including ending isolation as a disciplinary sanction, and an independent jail-review function still unexplored by the Sheriff and Board.", source: jailFollowUp },
      {
        label: "Independent reviews",
        text: "The Corrections Recommendations Project tracks findings from seven 2022–2024 reviews (National Institute of Corrections reports on contraband and suicide prevention, an Oregon State Police review of death investigations, jail standards inspections, the grand jury and the auditor) on a dashboard updated at least monthly.",
        source: record("Multnomah County Sheriff's Office · Corrections Recommendations Project", "https://www.mcso.us/corrections-facilities-division/corrections-recommendations-project", "Checked September 21, 2026"),
      },
    ],
  },
);

export const pack: RacePack = {
  ...emptyPack(),
  analysis,
  lines,
  chips,
  deliveries,
  ownWords,
  contacts,
  roles,
  primary,
  ballots,
  districts,
  choice,
  portraits,
  missing,
  topics,
  topicStances,
  stakes,
};
