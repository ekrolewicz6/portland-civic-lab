import type { CandidatePortrait, Evidence } from "../../../types";
import type { IssueId } from "../../issues";
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
  type PrimaryStatement,
  type RacePack,
  type RaceStakes,
  type RaceTopics,
  type RoleOverride,
  type StanceChip,
  type TopicStance,
} from "../../types";
import type { OwnWords, OwnWordsRule } from "../own-words";

/**
 * Race pack: Washington County Chair (at-large) and Commissioner District 4.
 * Filled by research on September 21, 2026 from the November 2026 Washington
 * County voters’ pamphlet (PDF pages 4–5, read as text per column) and each
 * campaign site. Every entry names its source; gaps stay gaps. Positions are
 * included only where the candidate’s own material states one; nothing is
 * inferred from endorsements, party or silence.
 *
 * Sites reviewed September 21, 2026:
 *   https://www.pamforwashingtoncounty.com/ (+ /priorities/, /pams-story/, /join/)
 *   https://www.nafisaforwashingtoncounty.com/ (+ /priorities, /about, /get-involved)
 *   https://www.kipperlynsinclair.com/ (+ /about, /data-center-moritorium, /volunteer)
 *   https://electstevecallaway.com/ (+ /issues/, /contact-us/, /meet-steve/)
 */

const PAMPHLET =
  "https://www.washingtoncountyor.gov/elections/documents/november-3-2026-voters-pamphlet/download?inline=";
const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const pamphlet = (page: number): Evidence => ({
  label: `Washington County voters’ pamphlet · PDF page ${page}`,
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

const official = (label: string, url: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Election authority",
  date: "Checked September 21, 2026",
  ...(note ? { note } : {}),
});

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

const countWords = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const own = (candidateId: string, text: string, rule: OwnWordsRule, source: OwnWords["source"]): OwnWords => ({
  candidateId,
  text,
  source,
  rule,
  words: countWords(text),
});

const pamphletOpening = (page: number, note?: string): OwnWords["source"] => ({
  label: `Washington County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; extracted September 21, 2026",
  note:
    note ??
    "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.",
});

type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});
const email = (address: string, from: From): ContactChannel => ({ url: `mailto:${address}`, label: address, kind: "email", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({ url, label, kind: "form", from });
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });

const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string): CandidateContact => ({
  candidateId,
  channels,
  ...(none ? { none } : {}),
  sources,
  reviewedOn: REVIEWED_ON,
});

const portrait = (page: number): CandidatePortrait => ({
  src: "",
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Washington County voters’ pamphlet",
  reviewed: REVIEWED_ON,
});
const portraits = (entries: [string, number][]): Record<string, CandidatePortrait> =>
  Object.fromEntries(entries.map(([id, page]) => [id, { ...portrait(page), src: `/images/voters-guide/2026/${id}.webp` }]));

/* ── Sources reused across entries ─────────────────────────────────── */
const treecePriorities = site("Treece · priorities", "https://www.pamforwashingtoncounty.com/priorities/");
const faiHome = site("Fai · platform (home page)", "https://www.nafisaforwashingtoncounty.com/");
const faiPriorities = site("Fai · priorities", "https://www.nafisaforwashingtoncounty.com/priorities");
const sinclairHome = site("Sinclair · priorities (home page)", "https://www.kipperlynsinclair.com/");
const sinclairPetition = site("Sinclair · data-center moratorium petition", "https://www.kipperlynsinclair.com/data-center-moritorium");
const callawayIssues = site("Callaway · what I’ll focus on", "https://electstevecallaway.com/issues/");

/* ── Analysis: Washington County Chair ─────────────────────────────── */
const analysis: Record<string, CandidateAnalysis> = {
  "nafisa-fai": {
    values: ["Housing investment", "Corporate contribution"],
    tradeoff:
      "Larger data-center contributions, updated fees and possible levies would fund the services she wants protected; her materials name the tools but not the amounts, and a local option levy needs voter approval.",
    issues: {
      housing: {
        position:
          "Wants more affordable homes and paths to ownership: public land turned into community-driven housing, faster permitting for affordable development, down-payment help for first-time buyers, more workforce housing and utility assistance to lower bills.",
        source: faiPriorities,
      },
      safety: {
        position:
          "Wants the county to fund community safety teams of mental-health professionals, medics and peer responders for calls she says are better handled by them than by police, so law enforcement can focus on serious crime.",
        source: faiHome,
      },
      money: {
        position:
          "Wants data centers to pay a fair share and would close the county’s budget gap by updating service fees and considering local option levies for public safety and libraries, while protecting funding for housing, transit and health care.",
        source: faiPriorities,
      },
      climate: {
        position:
          "Wants safer roads and sidewalks, fixed bottlenecks and more bus routes, plus a countywide Climate Action Task Force, clean-energy investment and a larger tree canopy.",
        source: faiHome,
      },
    },
    sources: [pamphlet(4), faiHome, faiPriorities],
  },
  "pam-treece": {
    values: ["Economic growth", "Tax restraint"],
    tradeoff:
      "Holding off new taxes while adding housing and public-safety investment draws on the same county budget; her materials do not say which services would give way if revenue falls short.",
    issues: {
      housing: {
        position:
          "Wants the county to hit the gas on building housing while braking on taxes; her site backs a range of housing types for all ages and incomes and preserving existing affordable homes.",
        source: pamphlet(4),
      },
      safety: {
        position:
          "Wants real investment in public safety, naming safe schools, parks and trails, and wants the county to protect residents from ICE.",
        source: pamphlet(4),
      },
      money: {
        position:
          "Would put the brakes on taxing residents and keep county operations stable, accountable and effective; no cuts or fee changes are named.",
        source: pamphlet(4),
      },
      climate: {
        position: "Wants transportation infrastructure investment aimed at reducing traffic congestion.",
        source: pamphlet(4),
      },
    },
    sources: [pamphlet(4), treecePriorities],
  },
  /* ── Analysis: Commissioner District 4 ─────────────────────────────── */
  "steve-callaway": {
    values: ["Fiscal caution", "Experience"],
    tradeoff:
      "He promises careful evaluation of data centers and protection for taxpayers rather than fixed rules; a resident cannot tell from his materials which projects he would reject or what he would defer under a tight budget.",
    issues: {
      housing: {
        position:
          "Supports encouraging what he calls thoughtful housing opportunities as part of keeping the county affordable; his materials name no specific housing program or rule.",
        source: callawayIssues,
      },
      safety: {
        position:
          "Would support police, firefighters, emergency responders and behavioral-health professionals, and address homelessness, addiction and mental health with solutions he calls compassionate and accountable.",
        source: callawayIssues,
      },
      money: {
        position:
          "Wants taxes kept in check and taxpayer dollars protected through responsible budgeting and accountability; no specific fee or tax change is named.",
        source: pamphlet(5),
      },
      climate: {
        position:
          "Would protect farmland and natural resources and carefully evaluate major developments such as data centers for their impacts on residents and quality of life.",
        source: pamphlet(5),
      },
    },
    sources: [pamphlet(5), callawayIssues],
  },
  "kipperlyn-sinclair": {
    values: ["Farmland protection", "Corporate accountability"],
    tradeoff:
      "Ending data-center tax breaks and taxing existing facilities would change county revenue and land use; her materials say deficits would shrink but do not show the revenue math or which incentives the county can legally alter.",
    issues: {
      housing: {
        position: "Supports transit-oriented, affordable workforce housing, alongside backing independent businesses on main streets.",
        source: sinclairHome,
      },
      safety: {
        position:
          "Would uphold due process, safeguard privacy from surveillance, protect public data and deliver what she calls transparent public safety.",
        source: pamphlet(5),
      },
      money: {
        position:
          "Would end data-center tax breaks and tax existing facilities to reduce the county deficit, protect the power grid, lower utility costs and fund schools.",
        source: pamphlet(5),
      },
      climate: {
        position:
          "Would halt data-center expansion onto farmland, backs a county moratorium on new data centers until their full costs are known, and would invest in farm-to-market hubs and a local food supply.",
        source: sinclairPetition,
      },
    },
    sources: [pamphlet(5), sinclairHome, sinclairPetition],
  },
};

/* ── Lines and chips (alphabetical by displayed name) ───────────────── */
const lines: IssueLine[] = [
  line("steve-callaway", "housing", "Supports thoughtful housing opportunities as part of keeping the county affordable."),
  line("steve-callaway", "safety", "Supports police, firefighters and behavioral-health workers, with compassionate, accountable homelessness solutions."),
  line("steve-callaway", "money", "Wants taxes kept in check and budgets responsible and accountable."),
  line("steve-callaway", "climate", "Would protect farmland and natural resources and evaluate data-center impacts carefully."),
  line("nafisa-fai", "housing", "Wants public land for housing, faster affordable-housing permits and down-payment help."),
  line("nafisa-fai", "safety", "Supports county community-safety teams of mental-health workers, medics and peer responders."),
  line("nafisa-fai", "money", "Wants data centers paying more, plus updated fees and possible levies for services."),
  line("nafisa-fai", "climate", "Wants safer roads, more bus routes and a countywide climate task force."),
  line("kipperlyn-sinclair", "housing", "Supports transit-oriented, affordable workforce housing."),
  line("kipperlyn-sinclair", "safety", "Would uphold due process, limit surveillance, protect public data, keep public safety transparent."),
  line("kipperlyn-sinclair", "money", "Would end data-center tax breaks and tax existing facilities to cut deficits."),
  line("kipperlyn-sinclair", "climate", "Would halt data-center growth onto farmland and back a county moratorium."),
  line("pam-treece", "housing", "Wants the county to speed up housing building while holding off new resident taxes."),
  line("pam-treece", "safety", "Supports more public-safety investment, including safe schools, parks and trails, and protection from ICE."),
  line("pam-treece", "money", "Opposes new taxes on residents; wants county operations stable, accountable and effective."),
  line("pam-treece", "climate", "Wants transportation infrastructure that reduces traffic congestion."),
];

const chips: StanceChip[] = [
  chip("steve-callaway", "housing", "Thoughtful housing growth"),
  chip("steve-callaway", "safety", "Police and treatment"),
  chip("steve-callaway", "money", "Keep taxes in check"),
  chip("steve-callaway", "climate", "Protect farmland"),
  chip("nafisa-fai", "housing", "Public land for housing"),
  chip("nafisa-fai", "safety", "Crisis response teams"),
  chip("nafisa-fai", "money", "Data centers pay more"),
  chip("nafisa-fai", "climate", "Buses, roads, climate plan"),
  chip("kipperlyn-sinclair", "housing", "Transit-oriented housing"),
  chip("kipperlyn-sinclair", "safety", "Privacy and due process"),
  chip("kipperlyn-sinclair", "money", "End data-center tax breaks"),
  chip("kipperlyn-sinclair", "climate", "Data-center moratorium"),
  chip("pam-treece", "housing", "Faster housing building"),
  chip("pam-treece", "safety", "Fund public safety"),
  chip("pam-treece", "money", "No new resident taxes"),
  chip("pam-treece", "climate", "Cut traffic congestion"),
];

/* ── Promise ladder: how and measured by, never filled from the position ── */
const deliveries: Delivery[] = [
  delivery("steve-callaway", "housing"),
  delivery("steve-callaway", "safety"),
  delivery("steve-callaway", "money"),
  delivery("steve-callaway", "climate"),
  delivery("nafisa-fai", "housing", {
    how: step(
      "Transform public land into community-driven housing, fast-track permitting for affordable development, invest in down-payment support for first-time buyers, expand workforce housing and fund energy-efficiency and utility assistance.",
      faiPriorities,
    ),
  }),
  delivery("nafisa-fai", "safety", {
    how: step(
      "County investment in community safety teams of trained mental-health professionals, medics and peer responders who de-escalate and connect people to care.",
      faiHome,
    ),
  }),
  delivery("nafisa-fai", "money", {
    how: step(
      "Update service fees, consider local option levies for public safety and libraries, protect essential-service funding and strengthen oversight and public access to budget information.",
      faiPriorities,
    ),
    measure: step("Names the county’s latest $20.5 million budget gap as the shortfall to close; no revenue figure per tool is given.", faiPriorities),
  }),
  delivery("nafisa-fai", "climate", {
    how: step(
      "Establish a countywide Climate Action Task Force, invest in clean energy and tree canopy, expand bus routes and fix bottlenecks and sidewalks.",
      faiHome,
    ),
  }),
  delivery("kipperlyn-sinclair", "housing", {
    how: step(
      "Activate Economic Improvement Districts along main streets, give tax credits to independent businesses and advocate for transit-oriented, affordable workforce housing.",
      sinclairHome,
    ),
  }),
  delivery("kipperlyn-sinclair", "safety"),
  delivery("kipperlyn-sinclair", "money", {
    measure: step("Reducing the county’s $20.5 million deficit and lowering utility bills; no revenue estimate for taxing existing facilities is given.", sinclairHome),
  }),
  delivery("kipperlyn-sinclair", "climate", {
    how: step(
      "A county moratorium on new data-center development until full economic, social and environmental costs are accounted for, plus county-backed farm-to-market distribution hubs.",
      sinclairPetition,
    ),
  }),
  delivery("pam-treece", "housing", {
    how: step(
      "Partnerships with local affordable-housing providers and preservation of existing affordable homes; cites The Opal, a church–County–developer collaboration she says produced over 50 affordable residences for people 55 and older.",
      treecePriorities,
    ),
  }),
  delivery("pam-treece", "safety", {
    how: step(
      "Stable funding for first responders with accountability and transparency, and closer coordination between the county’s mental-health team and public-safety providers, including the Center for Addictions Triage and Treatment.",
      treecePriorities,
    ),
  }),
  delivery("pam-treece", "money"),
  delivery("pam-treece", "climate"),
];

/* ── In their own words: first complete sentence of the pamphlet statement ── */
const ownWords: OwnWords[] = [
  own(
    "steve-callaway",
    "THE DECISIONS WE MAKE NOW WILL SHAPE WESTERN WASHINGTON COUNTY FOR YEARS TO COME.",
    "pamphlet-opening",
    pamphletOpening(
      5,
      "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The statement opens with this capitalised headline, which ends with a period and has a predicate, so it counts as the first sentence under the rule.",
    ),
  ),
  own("nafisa-fai", "Thirty years ago, I came to Oregon as an immigrant and a refugee.", "pamphlet-opening", pamphletOpening(4, "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. Skips the heading “A Leader Who Works for You-Not for the Status Quo”.")),
  own(
    "kipperlyn-sinclair",
    "Elect a leader for People. Local government is about people, place, and policy.",
    "pamphlet-opening",
    pamphletOpening(5, "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The first sentence (an imperative slogan with terminal punctuation) is under 12 words, so the first two sentences are used."),
  ),
  own(
    "pam-treece",
    "As your Chair, in this time of national insecurity, I will guarantee county operations are stable, accountable, effective, and equitable so we can provide the services we all deserve and too many desperately need.",
    "pamphlet-opening",
    pamphletOpening(4, "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. Skips the salutation “Dear Neighbors,”."),
  ),
];

/* ── Reaching the campaign: only channels the candidate published ── */
const contacts: CandidateContact[] = [
  contact(
    "steve-callaway",
    [
      web("https://electstevecallaway.com/", "pamphlet"),
      form("https://electstevecallaway.com/contact-us/", "Contact form", "site"),
      social("Facebook", "https://www.facebook.com/CallawayForMayor", "site"),
      social("Instagram", "https://www.instagram.com/stevecallaway4washingtoncounty", "site"),
      social("Threads", "https://www.threads.com/@stevecallaway4washingtoncounty", "site"),
    ],
    [pamphlet(5), site("Callaway · contact page", "https://electstevecallaway.com/contact-us/")],
  ),
  contact(
    "nafisa-fai",
    [
      web("https://www.nafisaforwashingtoncounty.com/", "pamphlet"),
      email("team@nafisaforwashingtoncounty.com", "site"),
      social("Facebook", "https://www.facebook.com/nafisafaiwashco", "site"),
      social("Instagram", "https://www.instagram.com/nafisafaiwashcochair/", "site"),
    ],
    [pamphlet(4), site("Fai · get involved (email in the site footer)", "https://www.nafisaforwashingtoncounty.com/get-involved")],
  ),
  contact(
    "kipperlyn-sinclair",
    [
      web("https://www.kipperlynsinclair.com/", "pamphlet"),
      email("vote@kipperlynsinclair.com", "site"),
      form("https://www.kipperlynsinclair.com/volunteer", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/kipperlyn_forcommunity/", "site"),
      social("Facebook", "https://www.facebook.com/kipperlyn.sinclair.54", "site"),
    ],
    [pamphlet(5), site("Sinclair · volunteer page (email and profiles in the site footer)", "https://www.kipperlynsinclair.com/volunteer")],
  ),
  contact(
    "pam-treece",
    [
      web("https://www.pamforwashingtoncounty.com/", "pamphlet"),
      email("info@pamforwashingtoncounty.com", "site"),
      email("team@pamforwashingtoncounty.com", "site"),
      form("https://www.pamforwashingtoncounty.com/join/", "Volunteer form", "site"),
      social("Facebook", "https://www.facebook.com/pamforwashingtoncounty/", "site"),
      social("Instagram", "https://www.instagram.com/pamforwashingtoncounty/", "site"),
      social("Bluesky", "https://bsky.app/profile/pamtreece.bsky.social", "site"),
    ],
    [pamphlet(4), site("Treece · join the team (info@ for media and questions; team@ behind “Ask Pam a Question”)", "https://www.pamforwashingtoncounty.com/join/")],
  ),
];

/* ── Roles, primary sources, ballots, districts, choice, portraits ── */
const roles: RoleOverride[] = [
  { candidateId: "steve-callaway", role: "Former Hillsboro mayor and principal", from: "background" },
  { candidateId: "nafisa-fai", role: "County commissioner; public-health background", from: "background" },
  { candidateId: "pam-treece", role: "County commissioner; economic-development background", from: "background" },
];

const primary: PrimaryStatement[] = [
  { candidateId: "steve-callaway", sourceUrl: `${PAMPHLET}#page=5` },
  { candidateId: "nafisa-fai", sourceUrl: `${PAMPHLET}#page=4` },
  { candidateId: "kipperlyn-sinclair", sourceUrl: `${PAMPHLET}#page=5` },
  { candidateId: "pam-treece", sourceUrl: `${PAMPHLET}#page=4` },
];

/**
 * Ballot instructions come from race.method ("Vote for one") and the county
 * elections page, which lists both seats as runoff elections; never from the
 * seat count.
 */
const countyElection = official(
  "Washington County Elections · November 3, 2026 General Election · candidate positions",
  "https://www.washingtoncountyor.gov/elections/current-election",
  "Lists “Washington County At-Large: Nafisa Fai, Pam Treece (Runoff Election)” and “District 4: Kipperlyn Sinclair, Steve Callaway (Runoff)”.",
);

const ballots: BallotInstruction[] = [
  { raceId: "washington-chair", text: "You vote for one candidate.", note: "The county elections office lists this seat as a runoff election.", source: countyElection },
  { raceId: "washington-district-4", text: "You vote for one candidate.", note: "The county elections office lists this seat as a runoff election.", source: countyElection },
];

/**
 * The District 4 line uses only the places the county’s own commissioner page
 * names for the district; the lookup link covers the rest.
 */
const districts: DistrictInfo[] = [
  {
    raceId: "washington-district-4",
    neighborhoods:
      "Western Washington County: Banks, North Plains, Forest Grove, Cornelius, Gaston and much of the county’s rural area. Some cities are split between districts; use the lookup link.",
    mapUrl: "https://www.washingtoncountyor.gov/elections/election-map",
    mapSource: official(
      "Washington County · Board of Commissioners · District 4 description",
      "https://washingtoncounty.civicweb.net/portal/members.aspx?id=10",
      "The county’s commissioners page says District 4 “includes a large portion of the rural area of Washington County including Banks, North Plains, Forest Grove, Cornelius and Gaston.” The elections map page carries the commissioner-district layer and address lookup.",
    ),
  },
];

const choice: ChoiceParagraph[] = [
  {
    raceId: "washington-chair",
    text:
      "Both candidates promise affordability and safety. The difference is the route: one leans on tax restraint and business growth, the other on housing and treatment investment funded partly by larger contributions from data centers. Ask which services each would protect first.",
    from: "race.comparison",
    ...reviewed,
  },
  {
    raceId: "washington-district-4",
    text:
      "One candidate would end data-center tax breaks and halt expansion onto farmland outright; the other promises careful, project-by-project evaluation without a categorical commitment. The choice is between a fixed rule and case-by-case judgment on the county’s biggest land-use question.",
    from: "race.comparison",
    ...reviewed,
  },
];

/* ── Topics, stances and stakes ─────────────────────────────────────── */
/*
 * Office-specific comparison topics for the two Washington County races,
 * each candidate's explicit stance, and the sourced facts behind the office.
 * Researched September 21–22, 2026. Board votes are read from the Clerk's
 * minutes packets on washingtoncounty.civicweb.net; questionnaire answers
 * are the candidates' own written replies to OPB (May 2026). A stance is
 * recorded only where the candidate's own material or recorded vote speaks
 * to the choice the topic asks about; everything else stays a gap.
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
const minutesAug25 = record(
  "Board of County Commissioners · minutes packet, August 25, 2026 (Ordinance 917, vehicle registration fee)",
  "https://washingtoncounty.civicweb.net/document/335538",
  "Meeting of August 25, 2026; read September 21, 2026",
  "Roll call on Ordinance 917: ayes Treece, Snider and Willey; nay Fai; Chair Harrington abstained, having declared a conflict; result 3–1.",
);
const minutesNov4 = record(
  "Board of County Commissioners · minutes packet, November 4, 2025 (RO 25-72, emergency over federal immigration enforcement)",
  "https://washingtoncounty.civicweb.net/document/317404",
  "Meeting of November 4, 2025; read September 21, 2026",
  "Adopted 5–0 on a motion by Fai, seconded by Willey; authorizes $200,000 from contingency, to be replenished in the FY 2026-27 budget.",
);
const workSessionSep1 = record(
  "Board of County Commissioners · work session packet, September 1, 2026 (Data Center Moratorium Discussion)",
  "https://washingtoncounty.civicweb.net/document/335765",
  "Work session of September 1, 2026; read September 21, 2026",
  "Staff report: no large standalone data centers and no pending applications in unincorporated Washington County; rural rules do not allow them; a moratorium may run 120 days with one six-month extension.",
);
const budgetFy27 = record(
  "Washington County · Adopted budget preserves critical services amid uncertainty (FY 2026-27)",
  "https://www.washingtoncountyor.gov/home/news/2026/04/27/washington-county-adopted-budget-preserves-critical-services-amid-uncertainty",
  "Budget approved June 16, 2026; read September 21, 2026",
);
const budgetGapFy26 = record(
  "Washington County · Board adopts $2 billion balanced budget, closing $20.5 million general fund gap",
  "https://www.washingtoncountyor.gov/finance/news/2025/06/18/board-county-commissioners-adopts-2-billion-balanced-budget-closing-205-million-general-fund-gap-and",
  "June 18, 2025",
);
const budgetQa = record(
  "Washington County · Budget Questions and Answers, FY 2026-27 proposed budget (May 18, 2026)",
  "https://www.washingtoncountyor.gov/finance/documents/washington-county-budget-questions-and-answers-fy-2026-27-may-18/download?inline",
  "May 18, 2026",
  "Answers on the replacement Public Safety Levy approved November 2025 and on the vehicle registration fee under study.",
);
const harringtonResigns = record(
  "Washington County · Board Chair Kathryn Harrington announces resignation",
  "https://www.washingtoncountyor.gov/home/news/2026/09/21/board-chair-kathryn-harrington-announces-resignation",
  "September 21, 2026",
);
const vrfPage = record(
  "Washington County · Vehicle Registration Fee (phased rates)",
  "https://www.washingtoncountyor.gov/lut/vehicle-registration-fee",
  "Checked September 21, 2026",
);
const hillsboroDataCenters = record(
  "City of Hillsboro · Data Centers in Hillsboro (moratorium, site counts and enterprise-zone FAQ)",
  "https://www.hillsboro-oregon.gov/community/data-centers",
  "Page updated September 10, 2026; read September 21, 2026",
);
const opbSb1586 = reporting(
  "OPB · Hillsboro will not get more industrial land for high tech, data centers",
  "https://www.opb.org/article/2026/03/03/hillsboro-will-not-get-more-industrial-land-for-high-tech-data-centers/",
  "March 3, 2026",
);
const opbIceEmergency = reporting(
  "OPB · Washington County declares emergency over increased ICE activity",
  "https://www.opb.org/article/2025/11/05/washington-county-emergency-increased-ice-activity/",
  "November 5, 2025",
);
const katuLawsuit = reporting(
  "KATU · Lawsuit filed against Hillsboro, Washington County over data center tax breaks",
  "https://katu.com/news/local/lawsuit-filed-against-hillsboro-washington-county-over-data-center-tax-breaks-billionaire-environment-company-fortune-500-oregon-portland-salem-politics-business-jobs-water-privacy",
  "June 2026",
);
const tidingsNoPause = reporting(
  "Daily Tidings · Washington County will not pause new data center projects for now despite Oregon-wide concerns",
  "https://www.dailytidings.com/washington-county-will-not-pause-new-data-center-projects-for-now-despite-oregon-wide-concerns/",
  "September 2026, on the Board's September 1 work session",
);

/* The boards: concrete choices the Board has made or faces this term. */
const washingtonTopics: ExtraTopic[] = [
  {
    id: "wash-data-center-pause",
    label: "Data-center pause",
    short: "Data pause",
    question: "Pause new data-center permits under the county's own authority until their impacts are studied?",
    context:
      "Commissioner Fai proposed a county pause on August 25, 2026. Staff told the Board's September 1 work session that unincorporated Washington County has no large standalone data centers, no pending applications and rural rules that already bar them; Hillsboro, which counts 23 data-center sites on about 570 acres, enacted its own 120-day moratorium on July 27, 2026.",
  },
  {
    id: "wash-enterprise-zone",
    label: "Data-center tax breaks",
    short: "Tax breaks",
    question: "End the enterprise-zone property-tax exemptions for Hillsboro data centers, which the county assessor co-authorizes?",
    context:
      "Hillsboro counted 33 data-center sites among its 50 active enterprise-zone agreements as of March 2025, and says 15 more data-center applications were approved after March 2026, before the Legislature's HB 4084 pause took effect June 6, 2026. A June 2026 lawsuit by 1000 Friends of Oregon, the Oregon Education Association and Councilor Kipperlyn Sinclair names both the city and the county.",
  },
  {
    id: "wash-vehicle-fee",
    label: "Vehicle fee increase",
    short: "Vehicle fee",
    question: "Double the county vehicle registration fee, from $30 to $60 a year by 2031, to pay for roads?",
    context:
      "Ordinance 917, adopted 3–1 on August 25, 2026 with the chair abstaining, raises the fee to $40 in July 2027, $50 in 2029 and $60 in 2031; the county keeps 60% and cities share 40%, and the county's share is projected to reach $20.6 million a year at the full rate.",
  },
  {
    id: "wash-budget-gap",
    label: "Budget gap",
    short: "Budget gap",
    question: "Close the county's recurring General Fund gap with new fees or levies rather than cuts alone?",
    context:
      "The county closed a $20.5 million General Fund gap in FY 2025-26 after five straight years of reductions. The $2.1 billion FY 2026-27 budget adopted June 16, 2026 needed only minimal cuts, helped by one-time 11% assessed-value growth from Hillsboro industrial property that the county expects to fall back to about 4.5%.",
  },
  {
    id: "wash-ice-emergency",
    label: "ICE emergency response",
    short: "ICE response",
    question: "Keep declaring emergencies and spending county reserves to help families hit by federal immigration enforcement?",
    context:
      "On November 4, 2025 the Board voted 5–0 for Resolution and Order 25-72, declaring an emergency over federal immigration enforcement and taking $200,000 from contingency for community aid, after more than 135 ICE arrests in the county in October 2025; the reserve must be refilled in the FY 2026-27 budget.",
  },
  {
    id: "wash-ugb-farmland",
    label: "Farmland for industry",
    short: "Farmland",
    question: "Bring farmland north of Hillsboro into the urban growth boundary for industry, as Senate Bill 1586 proposed?",
    context:
      "SB 1586 would have added 373 acres to Hillsboro's urban growth boundary and lined up about 1,400 more acres for future industrial use, with data centers allowed as accessory uses; Sen. Janeen Sollman shelved it in early March 2026 after farmers, residents and land-use groups objected. Metro and the cities, not the county alone, set the boundary.",
  },
];
const topics: RaceTopics[] = [{ raceIds: ["washington-chair", "washington-district-4"], topics: washingtonTopics }];

/* Candidate-statement and reporting sources used only for stances. */
const faiQuestionnaire = questionnaire("Fai", "https://www.opb.org/pdf/Fai_washington%20county%20chair_1778091025891.pdf");
const treeceQuestionnaire = questionnaire("Treece", "https://www.opb.org/pdf/Treece_washington%20county%20chair_1778090986566.pdf");
const callawayQuestionnaire = questionnaire("Callaway", "https://www.opb.org/pdf/Callaway_washington%20county%20district%204_1778194261861.pdf");
const sinclairAbout = site("Sinclair · about (SB 1586 testimony)", "https://www.kipperlynsinclair.com/about");
const kxlFaiPause = reporting(
  "KXL · Washington County commissioner to propose temporary pause on new data center development",
  "https://www.kxl.com/washington-county-commissioner-to-propose-temporary-pause-on-new-data-center-development/",
  "August 25, 2026",
  "Reported statement; quotes as printed by KXL from Fai's announcement.",
);
const kgwTreeceChair = reporting(
  "KGW (via Yahoo News) · Data centers, ICE and budget issues shape race for Washington County chair",
  "https://www.yahoo.com/news/politics/articles/data-centers-ice-budget-issues-201204914.html",
  "September 17, 2026",
  "Reported statement; quote as printed by KGW (Blair Best), syndicated on Yahoo News.",
);
const valleyTimesForum = reporting(
  "Beaverton Valley Times · Washington County District 4 candidates weigh data centers, public services at forum",
  "https://valleytimes.news/2026/04/28/washington-county-district-4-candidates-weigh-data-centers-public-services-at-forum/",
  "April 28, 2026, on the April 24 League of Women Voters forum",
  "Reported statement; quotes as printed by the Valley Times (Nick LaMora).",
);

const topicStances: TopicStance[] = [
  /* ── Steve Callaway (District 4) ───────────────────────────────────── */
  stance("steve-callaway", "wash-data-center-pause", "partial", "Case-by-case evaluation",
    "Would carefully evaluate major developments like data centers for their impacts on residents, communities and quality of life; a pause on permits is not mentioned.",
    pamphlet(5)),
  stance("steve-callaway", "wash-enterprise-zone", "partial", "Abatements are city-level",
    "Told the April 24 forum the key tax abatements are controlled at the city level, with the county responsible for infrastructure costs, zoning and broader impacts; whether to end them is unsaid.",
    valleyTimesForum),
  stance("steve-callaway", "wash-budget-gap", "mixed", "Cuts and revenue both",
    "Would consider both incremental and large cuts, weighing programs due to sunset, and would consider raising revenue but does not yet know by which means.",
    callawayQuestionnaire),
  stance("steve-callaway", "wash-ice-emergency", "supports", "Supports the declaration",
    "Supports the county's emergency declaration and its accompanying actions, and as commissioner would seek assurances that county staff adhere to Oregon's sanctuary law.",
    callawayQuestionnaire),
  stance("steve-callaway", "wash-ugb-farmland", "partial", "State-level reform first",
    "Says 2014 legislation removed chunks of the county's urban reserves and a broader state-level conversation on modernizing land use must come before the county changes its approach; SB 1586 is unnamed.",
    callawayQuestionnaire),

  /* ── Nafisa Fai (District 1 commissioner; the record where it exists) ── */
  stance("nafisa-fai", "wash-data-center-pause", "supports", "Proposed county pause",
    "Announced on August 25, 2026 a proposal to pause new data-center and AI-facility permits under county and Clean Water Services authority, saying the county should understand the complete picture before approving more.",
    kxlFaiPause),
  stance("nafisa-fai", "wash-enterprise-zone", "partial", "Data centers pay more",
    "Says as chair she will make data centers pay their fair share and safeguard tax dollars; whether the enterprise-zone exemptions should end is unsaid.",
    pamphlet(4)),
  stance("nafisa-fai", "wash-vehicle-fee", "opposes", "Voted no on fee",
    "Cast the only no vote on August 25, 2026 against Ordinance 917, which phases the county fee from $30 to $60 a year by 2031; Treece, Snider and Willey voted yes and the chair abstained.",
    minutesAug25),
  stance("nafisa-fai", "wash-budget-gap", "supports", "Fees and levies",
    "Would update service fees and consider local option levies for public safety and libraries to close a gap she puts at $20.5 million, while protecting funding for housing, transit and health care.",
    faiPriorities),
  stance("nafisa-fai", "wash-ice-emergency", "supports", "Moved the declaration",
    "Moved and voted for the November 4, 2025 emergency declaration and $200,000 in contingency aid, telling the Board the amounts are not enough and she will keep pushing for additional measures.",
    minutesNov4),
  stance("nafisa-fai", "wash-ugb-farmland", "partial", "Grow inside the UGB",
    "Says the county is not yet striking the right balance; would focus development inside existing urban growth boundaries, build on industrial land already zoned and push for a statewide industrial-land inventory. SB 1586 is unnamed.",
    faiQuestionnaire),

  /* ── Kipperlyn Sinclair (District 4) ───────────────────────────────── */
  stance("kipperlyn-sinclair", "wash-data-center-pause", "supports", "Moratorium petition",
    "Petitions the county Board, city councils and legislators for a moratorium on new data centers, citing residential power rates, school revenue lost to abatements and water use.",
    sinclairPetition),
  stance("kipperlyn-sinclair", "wash-enterprise-zone", "supports", "End the tax breaks",
    "Would end data-center tax breaks and tax existing facilities; says she called for a moratorium and took legal action with the teachers' association after administrators granted breaks to 17 data centers.",
    pamphlet(5)),
  stance("kipperlyn-sinclair", "wash-budget-gap", "mixed", "Tax data centers instead",
    "Would tax existing data-center facilities and end their abatements to shrink a deficit she puts at $20.5 million, saying working families should not bear the burden; other fees or levies are unsaid.",
    pamphlet(5)),
  stance("kipperlyn-sinclair", "wash-ice-emergency", "partial", "Codify sanctuary locally",
    "Told the April 24 forum she supports codifying Oregon's sanctuary policies locally and more transparency about immigration enforcement activity; the emergency declaration and county aid are unsaid.",
    valleyTimesForum),
  stance("kipperlyn-sinclair", "wash-ugb-farmland", "opposes", "Testified against SB 1586",
    "Says she was the only city councilor in the county to testify in Salem against SB 1586, and would protect prime farmland from corporate sprawl.",
    sinclairAbout),

  /* ── Pam Treece (District 2 commissioner; the record where it exists) ── */
  stance("pam-treece", "wash-data-center-pause", "mixed", "No more, if avoidable",
    "Told KGW she is not in favor of any more data centers in the county if that can be avoided, while noting the commission's land-use reach is unincorporated land and the major projects sit in Hillsboro.",
    kgwTreeceChair),
  stance("pam-treece", "wash-vehicle-fee", "supports", "Voted for fee increase",
    "Voted on August 25, 2026 for Ordinance 917, phasing the county fee from $30 to $60 a year by 2031 for road projects, after declaring the fee would also apply to her own vehicles; Fai voted no.",
    minutesAug25),
  stance("pam-treece", "wash-budget-gap", "mixed", "Taxes a last resort",
    "Says new taxes would be a last resort given economic strain, to be weighed against critical services that may have to be cut; puts past General Fund cuts at $98 million and would lean on economic development.",
    treeceQuestionnaire),
  stance("pam-treece", "wash-ice-emergency", "supports", "Voted for declaration",
    "Voted for the November 4, 2025 declaration and $200,000 in aid, thanking the colleagues who drafted it and criticizing federal enforcement actions in the county.",
    minutesNov4),
  stance("pam-treece", "wash-ugb-farmland", "partial", "Careful planning with Metro",
    "Says county land is precious and attracting high-paying jobs while protecting farms and forests will take careful planning with Metro and the cities, which set the boundary; takes no position on SB 1586's acreage.",
    treeceQuestionnaire),
];

/* What's at stake: sourced facts, the same block for every candidate in a race. */
const stakeBudget = {
  label: "Balanced on one-time growth",
  text: "The $2.1 billion FY 2026-27 budget approved June 16, 2026 needed only minimal cuts after five straight years of reductions, helped by about $6.2 million in General Fund savings and one-time 11% assessed-value growth from Hillsboro industrial property; the county expects growth to return to about 4.5%.",
  source: budgetFy27,
};
const stakeGap = {
  label: "Five years of cuts",
  text: "In June 2025 the Board closed a $20.5 million General Fund gap for FY 2025-26, the fifth straight year of reductions; the county says the temporary balancing tools of earlier years are used up and Oregon's 1990s property-tax limits keep the structural gap in place.",
  source: budgetGapFy26,
};
const stakeChairVacancy = {
  label: "Vacant chair's office",
  text: "Chair Kathryn Harrington resigns effective October 2, 2026 and will no longer facilitate Board meetings; Vice Chair Jerry Willey presides, with Jason Snider as chair pro tem, until the chair elected November 3 is sworn in on January 3, 2027.",
  source: harringtonResigns,
};
const stakeDataPause = {
  label: "Data centers outside cities",
  text: "Staff told the Board on September 1, 2026 that unincorporated Washington County has no large standalone data centers, no pending applications and rural rules that already bar them, and that a state-law moratorium can run 120 days plus one six-month extension.",
  source: workSessionSep1,
};
const stakeNoPause = {
  label: "No county pause adopted",
  text: "Reporting on the September 1 session says the Board declined a formal moratorium, agreed to draft a resolution acknowledging public concern and called the result a de facto moratorium; only eight parcels met the industrial criteria and all are already developed.",
  source: tidingsNoPause,
};
const stakeHillsboro = {
  label: "Hillsboro's moratorium",
  text: "Hillsboro counts 23 data-center sites, 16 built on 346 acres and 7 in permitting or construction on 224 acres, and as of March 2025 had 33 data-center sites among 50 active enterprise-zone agreements; it enacted a 120-day moratorium on new applications July 27, 2026 and takes a first code amendment to its council October 6.",
  source: hillsboroDataCenters,
};
const stakeLawsuit = {
  label: "Tax-break lawsuit",
  text: "1000 Friends of Oregon, the Oregon Education Association and Hillsboro Councilor Kipperlyn Sinclair sued the city and the county in June 2026 over spring approvals of enterprise-zone exemptions for data centers tied to NVIDIA, CoreWeave, Adobe, Dropbox, QTS and Flexential, granted before the statewide pause took effect June 6.",
  source: katuLawsuit,
};
const stakeVrf = {
  label: "Vehicle fee doubles",
  text: "Ordinance 917, adopted 3–1 on August 25, 2026 with the chair abstaining, phases the county vehicle registration fee from $30 to $40 in July 2027, $50 in 2029 and $60 in 2031 for road projects; Fai cast the no vote and cities share 40% of the money.",
  source: minutesAug25,
};
const stakeIce = {
  label: "Emergency reserves spent",
  text: "On November 4, 2025 the Board declared two emergencies 5–0, taking $200,000 from contingency for residents affected by federal immigration enforcement and $250,000 for food banks during the SNAP disruption; both draws must be replenished in the FY 2026-27 budget.",
  source: minutesNov4,
};
const stakeLevy = {
  label: "Public safety levy",
  text: "Voters approved a replacement Public Safety Levy in November 2025 whose first year began July 1, 2026; the FY 2026-27 budget uses it to restore 11 Sheriff's Office positions cut from the General Fund and to fund 8 District Attorney positions, while the General Fund still supplies about 68% of public-safety spending.",
  source: budgetQa,
};
const stakeSb1586 = {
  label: "Farmland bill shelved",
  text: "SB 1586 would have put 373 acres of rural land south of U.S. 26 inside Hillsboro's urban growth boundary and designated about 1,400 acres for future industry, with data centers as accessory uses; Sen. Janeen Sollman dropped it in March 2026 after extended testimony from farmers, residents and land-use groups.",
  source: opbSb1586,
};

const stakes: RaceStakes[] = [
  {
    raceId: "washington-chair",
    intro:
      "The chair is elected countywide and presides over the five-member Board, which adopts the $2.1 billion budget, writes land-use rules for unincorporated areas and funds the sheriff, public health and housing programs. The next chair takes an office left vacant in October, a General Fund balanced with one-time growth, and unfinished fights over data centers, immigration enforcement and road money.",
    items: [stakeChairVacancy, stakeBudget, stakeDataPause, stakeNoPause, stakeLawsuit, stakeVrf, stakeIce, stakeLevy],
  },
  {
    raceId: "washington-district-4",
    intro:
      "District 4 covers Banks, North Plains, Forest Grove, Cornelius, Gaston and much of the county's rural area, and its commissioner casts one of five votes on the $2.1 billion budget, the land-use code for unincorporated areas and any data-center moratorium. The seat is open, and the term starts with the urban-growth and enterprise-zone questions that Hillsboro's fights have pushed onto the county.",
    items: [stakeBudget, stakeGap, stakeDataPause, stakeNoPause, stakeHillsboro, stakeLawsuit, stakeSb1586, stakeVrf],
  },
];

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
  portraits: portraits([
    ["steve-callaway", 5],
    ["nafisa-fai", 4],
    ["kipperlyn-sinclair", 5],
    ["pam-treece", 4],
  ]),
  missing: {},
  topics,
  topicStances,
  stakes,
};
