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
  type IssueLine,
  type PrimaryStatement,
  type RacePack,
  type RoleOverride,
  type StanceChip,
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
};
