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
  type IssueLine,
  type MissingState,
  type PrimaryStatement,
  type RacePack,
  type RoleOverride,
  type StanceChip,
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
        "Get people with serious addiction and mental illness off the streets through an actual plan implemented by a chief executive who acts; she cites ending the county’s ambulance-response crisis as a commissioner.",
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
        "The county spends more per person than almost anywhere yet gets the worst results; she would budget for results, account for every dollar, redirect money from ineffective programs and deliver more while spending less.",
      source: pamphlet(33),
      line: "Wants budgets tied to results, every dollar accounted for, less spending overall.",
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
        "Find lasting solutions to the homelessness crisis by building better systems with the people closest to the problem; she says she realigned county funds toward shelter, outreach and housing and cut duplicated services in the Homeless Services Department.",
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
        "Lower costs and make more effective use of taxpayers’ dollars; she cites coauthoring the county’s first lobbyist disclosure rules and finding money in the budget to close a homeless-services shortfall while pushing for sustainable funding.",
      source: singletonRecord,
      line: "Wants taxpayer dollars used more effectively, with lobbyist disclosure and sustainable funding.",
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
        "Living costs have greatly outpaced wages and low-income residents need better resources; he says owning businesses and volunteering gave him a different perspective on spending tax dollars, which are the public’s money.",
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
        "The county cannot cut or tax its way out of a structural deficit she puts at $33 million by 2030; grow the tax base by partnering in Portland’s economy, require project labor and community benefits agreements on County-funded projects, and condition Moda Center money on a payment in lieu of taxes.",
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
        "Give every Climate Justice Plan goal a named owner, a cost and milestones; protect rental assistance, expand renter access to heat pumps, send cooling and clean-air money first to low-canopy neighborhoods, hold the county to its fossil-fuel-free building resolution, and press DEQ and the City on the fuel hub and Zenith’s 2027 deadline.",
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
        "Set measurable housing-retention goals, use performance-based contracts, publish timelines, spending and results, and connect housing placements to mental-health, addiction-recovery and workforce services so fewer people return to the streets.",
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
      line: "Wants service cuts and giveaways to billionaires stopped, public services expanded.",
      chip: "Expand public services",
    },
    climate: {
      position:
        "Implement the county’s Climate Justice Plan, hold polluters accountable, keep utilities affordable with oversight of private utility companies, cut greenhouse-gas emissions, and mitigate the risks of the CEI Hub (the riverside fuel-tank hub) while preventing its expansion.",
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
        "Partner with property owners so vacant housing is not left empty while neighbors are on the street, remove barriers that slow placements, protect money for rent assistance, outreach and placement, and hold housing programs accountable for results rather than processes.",
      source: robertsonPriorities,
      line: "Wants vacant units filled through property-owner partnerships and faster housing placements.",
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
      line: "Wants public spending dashboards, clear spending plans and options for local tax relief.",
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
      chip: "Prevention-first safety",
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
        "Introduce a Multnomah County Homelessness Reduction Act that puts prevention first, publicly report housing retention at three, six, nine and twelve months for every County-funded program, and expand the county’s master-lease model with landlords.",
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
        "Track whether people leaving the justice system actually reintegrate (find work, stay housed, stay out), invest in what Cully residents asked for (cameras, community safety networks, youth programs), and add behavioral-health professionals so police stop responding to mental-health crises.",
      source: zSafety,
      line: "Wants reintegration tracked, neighborhood safety networks funded, clinicians instead of police for crises.",
      chip: "Track reentry, fund youth",
      how: step(
        "Rebuild addiction treatment around 12-to-24-month programs combining housing, treatment and employment, and expand youth programs like the one he says he runs in Cully on redirected funds and volunteers.",
        zBehavioral,
      ),
      measure: step("Treatment completion, housing stability and movement toward self-sufficiency measured for every program; reintegration after release tracked as standard.", pamphlet(36)),
    },
    money: {
      position:
        "Introduce a Multnomah County Accountability and Results Act: a public County Report Card showing what the county spends, what works, what doesn’t and where it must improve, with programs funded by measured outcomes and county wages that keep up with Portland’s cost of living.",
      source: pamphlet(36),
      line: "Proposes a public county report card on spending and results, outcome-based funding.",
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
      source: pamphlet(38),
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

export const pack: RacePack = { ...emptyPack(), analysis, lines, chips, deliveries, ownWords, contacts, roles, primary, ballots, districts, choice, portraits, missing };
