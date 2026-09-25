import type { CandidatePortrait, Evidence } from "../../../types";
import type { OwnWords } from "../own-words";
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
import type { IssueId } from "../../issues";

/**
 * Race pack: federal offices (U.S. Senate and U.S. House districts 1–6).
 * Researched September 21, 2026 to the council standard; see the RacePack
 * contract in ../../types.ts.
 *
 * Sources. The state voters' pamphlet is not published until September 29,
 * but the Secretary of State posted every candidate statement as filed on
 * September 9, 2026 (one PDF, "2026 General Election, Candidate Statements").
 * 15 of these 18 candidates filed one; Dye, Ayles and Townsend did not.
 * Statements are cited by PDF page; campaign sites supply the detail behind
 * them. Every position comes from the candidate's own statement, site or
 * questionnaire, never from party, endorsements or silence. Gaps are gaps.
 * Incumbents' `record` entries on the research objects are untouched.
 *
 * The file is built in sections, one race at a time; `pack` holds the arrays
 * by reference and every section appends to them.
 */

const STATEMENTS =
  "https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf";

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

/** The candidate's voters' pamphlet statement as filed with the Secretary of State. */
const statement = (page: number, note: string = NOTE): Evidence => ({
  label: `Oregon voters’ pamphlet candidate statement · PDF page ${page}`,
  url: `${STATEMENTS}#page=${page}`,
  kind: "Candidate statement",
  date: "Filed for the November 2026 pamphlet; posted by the Secretary of State September 9, 2026; reviewed September 21, 2026",
  note,
});
const site = (label: string, url: string, note: string = NOTE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note,
});
const filing = (label: string, cfRsn: number, note: string): Evidence => ({
  label,
  url: `https://secure.sos.state.or.us/orestar/cfDetail.do?page=search&cfRsn=${cfRsn}`,
  kind: "Election authority",
  date: "Checked September 21, 2026",
  note,
});
const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });
const line = (candidateId: string, issue: IssueId, text: string): IssueLine => ({
  candidateId, issue, line: text, from: `analysis.issues.${issue}.position`, ...reviewed,
});
const chip = (candidateId: string, issue: IssueId, text: string): StanceChip => ({
  candidateId, issue, chip: text, from: `analysis.issues.${issue}.position`, ...reviewed,
});
const delivery = (candidateId: string, issue: IssueId, rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {}): Delivery => ({
  candidateId, issue, ...rungs, ...reviewed,
});
type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url, label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), kind: "website", from,
});
const email = (address: string, from: From): ContactChannel => ({ url: `mailto:${address}`, label: address, kind: "email", from });
const phone = (digits: string, label: string, from: From): ContactChannel => ({ url: `tel:+1${digits}`, label, kind: "phone", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({ url, label, kind: "form", from });
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });
const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string): CandidateContact => ({
  candidateId, channels, ...(none ? { none } : {}), sources, reviewedOn: REVIEWED_ON,
});
const words = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const ownWords = (candidateId: string, text: string, source: OwnWords["source"], rule: OwnWords["rule"]): OwnWords => ({
  candidateId, text, source, rule, words: words(text),
});
const statementOpening = (page: number, note: string): OwnWords["source"] => ({
  label: `Oregon voters’ pamphlet candidate statement · PDF page ${page}`,
  url: `${STATEMENTS}#page=${page}`,
  kind: "Candidate statement",
  date: "Filed for the November 2026 pamphlet; posted by the Secretary of State September 9, 2026; extracted September 21, 2026",
  note,
});
const portrait = (id: string, sourceUrl: string, domain: string): CandidatePortrait => ({
  src: `/images/voters-guide/2026/${id}.webp`, sourceUrl, credit: `Campaign photo · ${domain}`, reviewed: REVIEWED_ON,
});
const votingPage: Evidence = {
  label: "Oregon Secretary of State · Voting in Oregon",
  url: "https://sos.oregon.gov/voting/Pages/default.aspx",
  kind: "Election authority",
  date: "Checked September 21, 2026",
};
const FIND_REP = "https://www.house.gov/representatives/find-your-representative";
const district = (raceId: string, neighborhoods: string): DistrictInfo => ({
  raceId,
  neighborhoods,
  mapUrl: FIND_REP,
  mapSource: { label: "U.S. House · Find Your Representative (ZIP lookup and district maps)", url: FIND_REP, kind: "Election authority", date: "Checked September 21, 2026" },
});
const ballot = (raceId: string): BallotInstruction => ({ raceId, text: "You vote for one candidate.", source: votingPage });
const choiceOf = (raceId: string, text: string): ChoiceParagraph => ({ raceId, text, from: "race.comparison", ...reviewed });

/* ── The pack: arrays by reference; each race section below appends to them. ── */
const analysis: Record<string, CandidateAnalysis> = {};
const lines: IssueLine[] = [];
const chips: StanceChip[] = [];
const deliveries: Delivery[] = [];
const ownWordsEntries: OwnWords[] = [];
const contacts: CandidateContact[] = [];
const roles: RoleOverride[] = [];
const primary: PrimaryStatement[] = [];
const ballots: BallotInstruction[] = [];
const districts: DistrictInfo[] = [];
const choice: ChoiceParagraph[] = [];
const portraits: Record<string, CandidatePortrait> = {};
const missing: Record<string, MissingState> = {};
const topics: RaceTopics[] = [];
const topicStances: TopicStance[] = [];
const stakes: RaceStakes[] = [];

/** Research gaps closed since September 18 by the candidate's own statement; see the research log. */
const profiles: RacePack["profiles"] = {
  "chris-henry": {
    background: "Pacific Green and Progressive nominee; his filed statement runs on working people, public education and campaign finance reform.",
    summary: "His filed candidate statement calls for ending tax breaks for billionaires, tripling the federal minimum wage, cutting military spending and expanding local wind and solar energy.",
    priorities: [
      "Triple the federal minimum wage and end tax breaks for billionaires and cryptocurrency.",
      "Cut military spending and close foreign bases.",
      "Expand local wind and solar energy and create a federal fund for Cascadia earthquake preparedness.",
    ],
    question: "Which of these changes would you introduce first in Congress, and how would the lost revenue or spending be replaced?",
  },
  "andrea-townsend": {
    background: "Pacific Green nominee; answered her party’s 2026 candidate questionnaire.",
    summary: "Her questionnaire answers put a Green alternative on the ballot: deeply affordable social housing, tenant protections, redirecting war spending to human and ecological needs, and climate action that protects land, water and biodiversity.",
    priorities: [
      "Deeply affordable social housing and tenant protections.",
      "Redirect war spending toward human and ecological needs.",
      "Confront climate change while protecting land, water and biodiversity.",
    ],
    question: "What federal bills or budget changes would carry these priorities, and what would each cost?",
  },
};

export const pack: RacePack = {
  ...emptyPack(), analysis, lines, chips, deliveries, ownWords: ownWordsEntries, contacts, roles, primary, ballots, districts, choice, portraits, missing, profiles, topics, topicStances, stakes,
};

/* ══ U.S. Senate ═══════════════════════════════════════════════════════ */
/* Venues: statements pp. 1–6; jeffmerkley.com (/issues/, /about/, /contact/, /2026/09/21/im-running/);
   davidbrocksmithfororegon.com (/issues, /about, /join); garydye2020.wordpress.com (/, /about/) — the site Dye
   lists on his 2026 filing is branded for 2020; henryforsenate.us and chrishenry.org did not resolve. */

const merkleyStatement = statement(3);
const merkleyIssues = site("Merkley · issues", "https://www.jeffmerkley.com/issues/");
const dbsStatement = statement(1);
const dbsIssues = site("David Brock Smith · issues", "https://www.davidbrocksmithfororegon.com/issues");
const henryStatement = statement(5);

analysis["jeff-merkley"] = {
  values: ["Public guarantees", "Checks on billionaire power"],
  tradeoff: "Medicare for All, a Green New Deal and debt-free college all need financing and Senate majorities; the reviewed pages name goals and a few specific bans but not the budget arithmetic.",
  issues: {
    housing: { position: "Would ban hedge funds from buying single-family homes and names housing, with affordable daycare, as one of four foundations for families to thrive.", source: merkleyStatement },
    safety: { position: "Wants an end to ICE agents operating as what he calls secret police: no operations at schools, no warrantless home raids, and full accountability for civil-rights violations.", source: merkleyStatement },
    money: { position: "Wants the rich to pay their fair share, an end to congressional stock trading and to drug-company price gouging; his site adds overturning Citizens United and ending secret campaign money.", source: merkleyStatement },
    climate: { position: "Would rapidly transition from dirty, expensive fossil fuels to cheaper, cleaner renewables.", source: merkleyStatement },
  },
  sources: [merkleyStatement, merkleyIssues],
};
analysis["david-brock-smith"] = {
  values: ["Spending restraint", "Enforcement with treatment"],
  tradeoff: "No new taxes plus more treatment capacity and forest work means paying through cuts or growth the reviewed materials do not itemize; camping enforcement is mostly local and state authority, not the Senate's.",
  issues: {
    safety: { position: "Wants drug and mental-health treatment paired with accountability, an end to permanent street camping, and support for law enforcement with consequences for repeat offenders.", source: dbsIssues},
    money: { position: "Wants no new taxes, more support for local businesses, elimination of fraud and less unnecessary government spending.", source: dbsIssues},
    climate: { position: "Would ensure data centers are accountable, protect natural resources and keep data-center costs for water, farmland and energy from being shifted onto Oregon households.", source: dbsStatement },
  },
  sources: [dbsStatement, dbsIssues],
};
analysis["chris-henry"] = {
  values: ["Anti-war budgets", "Worker wages"],
  tradeoff: "Closing foreign bases, tripling the minimum wage and public ownership of infrastructure are large federal shifts; the statement names targets and numbers but not the path through Congress or transition costs.",
  issues: {
    money: { position: "Would end tax breaks for billionaires and cryptocurrency, tax oil companies' excess profits, stop tariffs and trade deals that override labor rules, triple the $7.25 federal minimum wage, and cut military spending and foreign bases.", source: henryStatement },
    climate: { position: "Would increase local wind and solar energy and create a federal “Shaky Day Fund” to prepare for a Cascadia earthquake; names protecting the environment and climate as a priority.", source: henryStatement },
  },
  sources: [henryStatement],
};

lines.push(
  line("david-brock-smith", "safety", "Wants treatment with accountability, an end to permanent street camping, support for police."),
  line("david-brock-smith", "money", "Wants no new taxes, fraud eliminated and unnecessary government spending reduced."),
  line("david-brock-smith", "climate", "Would keep data-center costs off Oregon households and protect natural resources."),
  line("chris-henry", "money", "Would end billionaire tax breaks, tax oil windfalls, triple the federal minimum wage."),
  line("chris-henry", "climate", "Would expand local wind and solar and create a federal Cascadia earthquake fund."),
  line("jeff-merkley", "housing", "Would ban hedge funds from buying single-family homes."),
  line("jeff-merkley", "safety", "Wants no ICE operations at schools, no warrantless home raids, accountability for violations."),
  line("jeff-merkley", "money", "Wants the rich paying a fair share and an end to drug price gouging."),
  line("jeff-merkley", "climate", "Would rapidly shift from fossil fuels to cheaper, cleaner renewables."),
);
chips.push(
  chip("david-brock-smith", "safety", "End permanent camping"),
  chip("david-brock-smith", "money", "No new taxes"),
  chip("david-brock-smith", "climate", "Data centers pay costs"),
  chip("chris-henry", "money", "Triple minimum wage"),
  chip("chris-henry", "climate", "Local wind and solar"),
  chip("jeff-merkley", "housing", "No hedge-fund homebuying"),
  chip("jeff-merkley", "safety", "No warrantless ICE raids"),
  chip("jeff-merkley", "money", "Rich pay fair share"),
  chip("jeff-merkley", "climate", "Rapid shift to renewables"),
);
deliveries.push(
  delivery("david-brock-smith", "safety"),
  delivery("david-brock-smith", "money"),
  delivery("david-brock-smith", "climate", {
    how: step("Active forest management, fuel reduction and work with landowners to protect homes, with federal regulations shaped to local needs; the tool for holding data centers accountable is not specified.", dbsIssues),
  }),
  delivery("chris-henry", "money", {
    how: step("Enforce antitrust laws to lower prices; convert essential infrastructure from giant corporations into democratically accountable public utilities; cut military spending he says takes 50% of discretionary spending.", henryStatement),
    measure: step("A federal minimum wage of about $21.75, three times today's $7.25; no date or revenue figure is given.", henryStatement),
  }),
  delivery("chris-henry", "climate"),
  delivery("jeff-merkley", "housing"),
  delivery("jeff-merkley", "safety"),
  delivery("jeff-merkley", "money", {
    how: step("Ban drug companies from charging more in the U.S. than in Canada, Europe and Japan; overturn Citizens United and shut down dark money.", merkleyIssues),
  }),
  delivery("jeff-merkley", "climate", {
    how: step("A Green New Deal investing in the shift to 100% clean and renewable energy, with jobs and investment for front-line communities.", merkleyIssues),
    measure: step("100% clean and renewable energy as the end state; no date is given.", merkleyIssues),
  }),
);

ownWordsEntries.push(
  ownWords("david-brock-smith",
    "As a third-generation resident and small businessman from Southwest Oregon, David has spent his life serving his community and standing up for the people who live and work here.",
    statementOpening(1, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the slogans “Working For You! Serving Oregon First!” (no predicate)."),
    "pamphlet-opening"),
  ownWords("gary-lyndon-dye",
    "Grandfather’s farm was seized by the Soviet government, and family sent to the Gulag to atone for their sins of being farmers.",
    { label: "Dye · About page (2020 campaign site listed on his 2026 filing)", url: "https://garydye2020.wordpress.com/about/", kind: "Candidate statement",
      date: "Posted October 2020; extracted September 21, 2026",
      note: "Verbatim opening of the candidate's About page on the website his 2026 state filing lists; the site is branded for his 2020 Senate run and no 2026 statement was found. Skipped before it: the label “About me:”. No pamphlet statement was filed." },
    "site-opening"),
  ownWords("chris-henry",
    "I support working people, publicly-funded education from pre-K to trade guilds and higher education, strong workplace safety, real campaign finance reform, and protecting the environment and climate.",
    statementOpening(5, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the header fields, including a “Civic Leadership:” list."),
    "pamphlet-opening"),
  ownWords("jeff-merkley",
    "Jeff is the son of a union mechanic, attended public schools, was the first in his family to go to college, and lives in the same blue-collar neighborhood he grew up in.",
    statementOpening(3, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
);

contacts.push(
  contact("david-brock-smith",
    [web("https://www.davidbrocksmithfororegon.com/", "pamphlet"), email("info@davidbrocksmithfororegon.com", "site"),
     form("https://www.davidbrocksmithfororegon.com/join", "Volunteer form", "site"),
     social("Facebook", "https://www.facebook.com/StateSenatorDavidBrockSmith", "site"), social("X", "https://x.com/DavidBrockSmith", "site"),
     social("Instagram", "https://www.instagram.com/davidbrocksmith01", "site"), social("YouTube", "https://www.youtube.com/@DavidBrockSmith", "site")],
    [statement(1, "Prints www.DavidBrockSmithforOregon.com."), site("David Brock Smith · site footer and header", "https://www.davidbrocksmithfororegon.com/", "The footer’s Contact Us link is the campaign email; profile links are in the header; the Join page is a volunteer sign-up form.")]),
  contact("gary-lyndon-dye",
    [web("https://garydye2020.wordpress.com/", "filing"), email("GaryLDye@hotmail.com", "filing")],
    [filing("Dye · 2026 state candidate filing (Libertarian)", 25840, "Lists GaryLDye@hotmail.com and GaryDye2020.wordpress.com as the campaign email and website. The filing’s home telephone is not a campaign channel and is not recorded."),
     site("Dye · 2020 campaign site", "https://garydye2020.wordpress.com/", "The site is branded “Gary Dye for US Senate 2020”; its Contact page prints a different Gmail address and a phone from that campaign, which are not recorded as current channels.")]),
  contact("chris-henry",
    [email("chris@progparty.org", "pamphlet"), phone("5034435801", "(503) 443-5801", "pamphlet")],
    [statement(5, "Prints “chrishenry.org - chris@progparty.org - (503) 443-5801”. chrishenry.org did not resolve on September 21, 2026, and henryforsenate.us, the site on his state filing, has no DNS record, so no website is listed."),
     filing("Henry · 2026 state candidate filing (Progressive)", 25635, "Lists emailme@chrishenry.org and henryforsenate.us; the address the pamphlet statement prints is recorded instead.")]),
  contact("jeff-merkley",
    [web("https://www.jeffmerkley.com/", "pamphlet"), phone("5032005518", "503-200-5518", "site"), form("https://www.jeffmerkley.com/contact/", "Contact form", "site"),
     social("Facebook", "https://www.facebook.com/JeffMerkleyOregon", "site"), social("X", "https://twitter.com/JeffMerkley", "site"), social("Instagram", "https://www.instagram.com/jeffmerkley/", "site")],
    [statement(3, "Prints jeffmerkley.com."), site("Merkley · contact page", "https://www.jeffmerkley.com/contact/", "Prints a PO box, the phone and a contact form; no campaign email is published. Profile links are footer redirects (/facebook/, /twitter/, /instagram/).")]),
);
roles.push(
  { candidateId: "david-brock-smith", role: "Oregon state senator; small-business owner", from: "background" },
  { candidateId: "gary-lyndon-dye", role: "Qualified candidate in state filings", from: "background" },
  { candidateId: "chris-henry", role: "Qualified candidate in state filings", from: "background" },
);
primary.push(
  { candidateId: "david-brock-smith", sourceUrl: `${STATEMENTS}#page=1` },
  { candidateId: "chris-henry", sourceUrl: `${STATEMENTS}#page=5` },
  { candidateId: "jeff-merkley", sourceUrl: `${STATEMENTS}#page=3` },
);
missing["gary-lyndon-dye"] = "no-platform";
ballots.push(ballot("oregon-us-senate"));
choice.push(choiceOf("oregon-us-senate",
  "One candidate favors expanded federal social guarantees and climate action; another emphasizes spending restraint, public safety and resource industries. Research on the other two remains incomplete; do not treat that gap as agreement with either major-party candidate."));
portraits["jeff-merkley"] = portrait("jeff-merkley", "https://www.jeffmerkley.com/", "jeffmerkley.com");

/* ══ U.S. House · District 1 ═══════════════════════════════════════════ */
/* Venues: statements pp. 7–10; bonamiciforcongress.com (/priorities/ and its sub-pages affordable-housing, economy,
   climate-crisis, immigration, working-families, gun-violence; /about/; /contact/); drkahlforcongress.com (/, /about, /contact). */

const bonamiciStatement = statement(9);
const bonamiciHousing = site("Bonamici · affordable housing", "https://www.bonamiciforcongress.com/priorities/affordable-housing/");
const bonamiciEconomy = site("Bonamici · economy", "https://www.bonamiciforcongress.com/priorities/economy/");
const bonamiciClimate = site("Bonamici · climate crisis", "https://www.bonamiciforcongress.com/priorities/climate-crisis/");
const bonamiciImmigration = site("Bonamici · immigration", "https://www.bonamiciforcongress.com/priorities/immigration/");
const kahlStatement = statement(7);
const kahlHome = site("Kahl · platform (home page)", "https://www.drkahlforcongress.com/");

analysis["suzanne-bonamici"] = {
  values: ["Public investment", "Rights protections"],
  tradeoff: "Expanding the housing tax credit, Medicare for All and debt-free college depend on repealing the 2017 tax cuts and on new majorities; the reviewed pages give direction and bills introduced, not a costed sequence.",
  issues: {
    housing: { position: "Would increase Low-Income Housing Tax Credit funding, convert unused buildings into affordable housing, fund housing paired with child-care centers, and expand transitional housing for people in recovery.", source: bonamiciHousing },
    safety: { position: "Is leading legislation requiring clear identification of every ICE agent making immigration arrests and limiting when federal law enforcement, the armed forces or the National Guard can be sent into cities to carry out immigration policy; wants humane immigration reform.", source: bonamiciImmigration },
    money: { position: "Would repeal the Trump tax cuts in favor of progressive taxation, raise the federal minimum wage, enforce antitrust laws and end what she calls chaotic and nonsensical trade policies.", source: bonamiciEconomy },
    climate: { position: "Would defend Inflation Reduction Act clean-energy programs and pursue the Select Committee plan for net-zero emissions by mid-century.", source: bonamiciClimate },
  },
  sources: [bonamiciStatement, bonamiciHousing, bonamiciEconomy, bonamiciClimate, bonamiciImmigration],
};
analysis["barbara-j-kahl"] = {
  values: ["Regulatory relief", "Fiscal accountability"],
  tradeoff: "Cutting federal regulations and taxes while restoring housing, timber and maritime industries relies on growth to replace revenue; the reviewed materials name directions, not the rules or dollars involved.",
  issues: {
    housing: { position: "Would expand housing supply at every price point, streamline permitting, and use federal incentives to reduce financing barriers for first-time buyers and working families.", source: kahlHome },
    safety: { position: "Supports local law enforcement with funding and accountability.", source: kahlHome },
    money: { position: "Would cut redundant federal regulations and taxes, track taxpayer dollars with no blank checks for NGOs or special interests, and revive the timber, tech, agriculture and maritime industries.", source: kahlStatement },
    climate: { position: "Wants forest and land management that sustains both the environment and timber-dependent communities.", source: kahlHome },
  },
  sources: [kahlStatement, kahlHome],
};
lines.push(
  line("barbara-j-kahl", "housing", "Would expand housing supply at every price and ease financing for first-time buyers."),
  line("barbara-j-kahl", "safety", "Supports funding local law enforcement, paired with accountability."),
  line("barbara-j-kahl", "money", "Would cut redundant federal regulations and taxes; no blank checks for special interests."),
  line("barbara-j-kahl", "climate", "Wants forest management that sustains both the environment and timber communities."),
  line("suzanne-bonamici", "housing", "Would expand the low-income housing tax credit and convert unused buildings into homes."),
  line("suzanne-bonamici", "safety", "Would require ICE agents to identify themselves and limit deployments for immigration enforcement."),
  line("suzanne-bonamici", "money", "Would repeal Trump-era tax cuts, raise the federal minimum wage, end chaotic tariffs."),
  line("suzanne-bonamici", "climate", "Would defend clean-energy programs and pursue net-zero emissions by mid-century."),
);
chips.push(
  chip("barbara-j-kahl", "housing", "Supply at every price"), chip("barbara-j-kahl", "safety", "Funded, accountable police"),
  chip("barbara-j-kahl", "money", "Cut regulations and taxes"), chip("barbara-j-kahl", "climate", "Timber and environment"),
  chip("suzanne-bonamici", "housing", "Expand housing tax credit"), chip("suzanne-bonamici", "safety", "ICE agent identification"),
  chip("suzanne-bonamici", "money", "Repeal Trump tax cuts"), chip("suzanne-bonamici", "climate", "Net-zero by mid-century"),
);
deliveries.push(
  delivery("barbara-j-kahl", "housing"), delivery("barbara-j-kahl", "safety"), delivery("barbara-j-kahl", "money"), delivery("barbara-j-kahl", "climate"),
  delivery("suzanne-bonamici", "housing", {
    how: step("Legislation to increase LIHTC funding, convert unused buildings into affordable housing, create funding for housing paired with child-care centers, and increase transitional housing for people in recovery.", bonamiciHousing),
    measure: step("Points to $6.25 million secured to build hundreds of affordable units in NW Oregon as the result so far; no target for the next term is given.", bonamiciHousing),
  }),
  delivery("suzanne-bonamici", "safety"),
  delivery("suzanne-bonamici", "money"),
  delivery("suzanne-bonamici", "climate", {
    how: step("Defend Inflation Reduction Act programs for a just transition to renewable energy, and use the Select Committee's 500-plus-page Climate Action Plan as the sector-by-sector roadmap.", bonamiciClimate),
    measure: step("Net-zero emissions no later than mid-century and net-negative thereafter.", bonamiciClimate),
  }),
);
ownWordsEntries.push(
  ownWords("suzanne-bonamici",
    "Suzanne worked her way through community college, university, and law school, so she knows what it’s like to struggle to make ends meet.",
    statementOpening(9, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the headings “Suzanne Bonamici” and “Strong Leadership, Oregon Values”."),
    "pamphlet-opening"),
  ownWords("barbara-j-kahl",
    "My family has been in NW Oregon over a century; this is my home.",
    statementOpening(7, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
);
contacts.push(
  contact("suzanne-bonamici",
    [web("https://www.bonamiciforcongress.com/", "pamphlet"), phone("5032081228", "503-208-1228", "site"), form("https://www.bonamiciforcongress.com/contact/", "Contact form", "site"),
     social("Facebook", "https://www.facebook.com/suzannebonamici", "site"), social("Instagram", "https://www.instagram.com/suzanne.bonamici/", "site")],
    [statement(9, "Prints www.BonamiciForCongress.com."), site("Bonamici · contact page", "https://www.bonamiciforcongress.com/contact/", "Prints a PO box, the phone and a contact form; no campaign email is published. Profile links are footer redirects.")]),
  contact("barbara-j-kahl",
    [web("https://www.drkahlforcongress.com/", "pamphlet"), email("info@drkahlforcongress.com", "site"), phone("9714591058", "(971) 459-1058", "site"), form("https://www.drkahlforcongress.com/contact", "Contact form", "site")],
    [statement(7, "Prints Drkahlforcongress.com."), site("Kahl · contact page", "https://www.drkahlforcongress.com/contact", "Prints the phone, email, a PO box and a contact form; the site links no social profiles.")]),
);
primary.push({ candidateId: "suzanne-bonamici", sourceUrl: `${STATEMENTS}#page=9` }, { candidateId: "barbara-j-kahl", sourceUrl: `${STATEMENTS}#page=7` });
ballots.push(ballot("oregon-house-1"));
districts.push(district("oregon-house-1", "Northwest Oregon: Clatsop, Columbia, Tillamook and Washington counties (Hillsboro, Beaverton, Tigard's north), plus northwest Portland and part of Multnomah County. Edges are split by ZIP; use the lookup."));
choice.push(choiceOf("oregon-house-1", "One emphasizes public investment and rights protections; the other, business costs, school choice and regulatory changes. Both identify housing and workforce needs; compare how each would pay for and deliver the changes."));
portraits["suzanne-bonamici"] = portrait("suzanne-bonamici", "https://www.bonamiciforcongress.com/", "bonamiciforcongress.com");
portraits["barbara-j-kahl"] = portrait("barbara-j-kahl", "https://www.drkahlforcongress.com/", "drkahlforcongress.com");

/* ══ U.S. House · District 2 ═══════════════════════════════════════════ */
/* Venues: statements pp. 11–14; chrisbeckforcongress.com (/, /district2issues, /aboutchris, /contact);
   cliffbentz.com (/issues/ and its 2023-dated sub-pages, /meet-cliff/, /contact/). */

const beckStatement = statement(11);
const beckIssues = site("Beck · district issues", "https://chrisbeckforcongress.com/district2issues");
const bentzStatement = statement(13);
const bentzBorders = site("Bentz · secure our borders (undated issue page)", "https://cliffbentz.com/2023/06/secure-our-borders/");
const bentzForests = site("Bentz · fire and federal forest management (undated issue page)", "https://cliffbentz.com/2023/06/fire-federal-forest-management/");

analysis["chris-beck"] = {
  values: ["Rural public investment", "Fiscal balance"],
  tradeoff: "He would restore Medicaid, food and wildfire funding while also balancing the federal budget; the reviewed materials name a vacation-home tax change but not enough revenue to do both.",
  issues: {
    housing: { position: "Would trim tax breaks on vacation and luxury homes to fund low-interest loans for first-time rural buyers, steer USDA rural housing programs toward small-town Main Streets rather than sprawl, and pilot senior housing on public university campuses.", source: beckIssues },
    money: { position: "Would repeal H.R. 1 to restore Medicaid and SNAP funding, end tariffs and the Iran war, balance the federal budget and reduce the national debt, and fortify Social Security and Medicare.", source: beckStatement },
    climate: { position: "Would reverse cuts to wildfire prevention and forest management, pause new data-center construction, create rural service corps jobs in each county and rehabilitate Oregon’s public lands, rivers and forests.", source: beckStatement },
  },
  sources: [beckStatement, beckIssues],
};
analysis["cliff-bentz"] = {
  values: ["Resource use", "Border enforcement"],
  tradeoff: "More timber harvest, water storage and lower taxes with less regulation are a consistent program; the campaign's issue pages carry pandemic-era language, so which commitments are current for 2026 is the open question.",
  issues: {
    safety: { position: "Supports a secure border and stopping illegal immigration by improving border security and completing the wall.", source: bentzBorders },
    money: { position: "Supports lower taxes; his statement names no specific tax or spending change.", source: bentzStatement },
    climate: { position: "Wants more energy generation, reservoir storage, hydropower, retained dams, irrigation water and increased timber harvest.", source: bentzStatement },
  },
  sources: [bentzStatement, bentzBorders, bentzForests],
};
lines.push(
  line("chris-beck", "housing", "Would trim vacation-home tax breaks to fund loans for first-time rural buyers."),
  line("chris-beck", "money", "Would restore Medicaid and food benefits, end tariffs, and balance the federal budget."),
  line("chris-beck", "climate", "Would restore wildfire-prevention funding, pause data centers, create rural forest service corps."),
  line("cliff-bentz", "safety", "Supports a secure border and completing the border wall."),
  line("cliff-bentz", "money", "Supports lower taxes."),
  line("cliff-bentz", "climate", "Wants more hydropower, dams kept, irrigation water and more timber harvest."),
);
chips.push(
  chip("chris-beck", "housing", "Rural first-buyer loans"), chip("chris-beck", "money", "Restore Medicaid funding"), chip("chris-beck", "climate", "Restore wildfire funding"),
  chip("cliff-bentz", "safety", "Complete border wall"), chip("cliff-bentz", "money", "Lower taxes"), chip("cliff-bentz", "climate", "More timber and hydropower"),
);
deliveries.push(
  delivery("chris-beck", "housing", {
    how: step("Adjust excessive tax breaks on vacation and luxury homes, reform USDA Community Facilities and Rural Housing Services lending toward Main Street districts, and let land-grant universities fund senior housing on campus.", beckIssues),
    measure: step("Pilot senior housing at Eastern Oregon University, Southern Oregon University and one community college; no unit count or date is given.", beckIssues),
  }),
  delivery("chris-beck", "money"),
  delivery("chris-beck", "climate", {
    how: step("Restore the 40% cut and the staff lost at the U.S. Forest Service in 2025; expand the Agricultural Conservation Easement Program and Land and Water Conservation Fund; fund county-based service corps jobs with benefits.", beckIssues),
  }),
  delivery("cliff-bentz", "safety"),
  delivery("cliff-bentz", "money"),
  delivery("cliff-bentz", "climate", {
    how: step("Reduce fuel loads, enhance salvage logging and sustained-yield harvests on federal forests, and repeal or change the Equal Access to Justice Act he says funds litigation against the government.", bentzForests),
  }),
);
ownWordsEntries.push(
  ownWords("chris-beck",
    "I pledge to always be there for my constituents, in person, as often as possible, and to always remember who I work for – YOU.",
    statementOpening(11, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
  ownWords("cliff-bentz",
    "Cliff Bentz: as a member of the House Water and Wildlife Fisheries Subcommittee, is fighting for reservoir storage, additional hydropower, retention of dams, water for irrigation, delisting of the wolf, and increased timber harvest.",
    statementOpening(13, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the run-in label “Cliff Bentz: PRO-Trump, PRO-2nd Amendment, PRO-Life, PRO-Business, & PRO-Veteran.” (no predicate). The candidate’s run-in name and colon are kept."),
    "pamphlet-opening"),
);
contacts.push(
  contact("chris-beck",
    [web("https://chrisbeckforcongress.com/", "pamphlet"), email("info@chrisbeckforcongress.com", "site"), phone("5415310563", "(541) 531-0563", "site"),
     social("Facebook", "https://www.facebook.com/ChrisBeckforCongress", "site"), social("Instagram", "https://www.instagram.com/chrisbeckforcongress", "site"), social("YouTube", "https://www.youtube.com/@ChrisBeckforCongress/videos", "site")],
    [statement(11, "Prints ChrisBeckforCongress.com (resolves without www)."), site("Beck · contact page", "https://chrisbeckforcongress.com/contact", "Prints info@ and a media@ address and the phone; profile links are in the footer.")]),
  contact("cliff-bentz",
    [web("https://cliffbentz.com/", "site"), form("https://cliffbentz.com/contact/", "Contact form", "site"), social("Facebook", "https://www.facebook.com/bentzfororegon/", "site")],
    [statement(13, "Prints no website, email or phone."), site("Bentz · contact page", "https://cliffbentz.com/contact/", "Holds a contact form and a PO box; no email or phone is published. The footer links Facebook only and points official business to bentz.house.gov.")]),
);
primary.push({ candidateId: "chris-beck", sourceUrl: `${STATEMENTS}#page=11` }, { candidateId: "cliff-bentz", sourceUrl: `${STATEMENTS}#page=13` });
ballots.push(ballot("oregon-house-2"));
districts.push(district("oregon-house-2", "Eastern Oregon and the southern Cascades: Medford, Grants Pass, Klamath Falls, Pendleton, Hermiston, Ontario, La Grande and Baker City. Bend itself is in District 5; use the lookup near county lines."));
choice.push(choiceOf("oregon-house-2", "One proposes restoring services and revising federal rural programs; the other emphasizes resource use, less regulation and border enforcement. The incumbent’s online issue pages contain older material, which his brief discloses."));
portraits["chris-beck"] = portrait("chris-beck", "https://chrisbeckforcongress.com/", "chrisbeckforcongress.com");

/* ══ U.S. House · District 3 ═══════════════════════════════════════════ */
/* Venues: statement pp. 15–16; maxinefororegon.com (/issues/ and the housing, healthcare, economic-opportunity,
   climate, immigration and addiction issue pages; /about/); Ayles: ORESTAR cfRsn=25472 (no website listed),
   ballotpedia and vote-usa entries checked for a statement — none. */

const dexterStatement = statement(15);
const dexterHousing = site("Dexter · housing", "https://maxinefororegon.com/issue/housing-and-homelessness/");
const dexterEconomy = site("Dexter · economic opportunity", "https://maxinefororegon.com/issue/economic-opportunity/");
const dexterClimate = site("Dexter · climate and environment", "https://maxinefororegon.com/issue/fight-climate-change-and-protect-our-environment/");
const dexterImmigration = site("Dexter · immigration", "https://maxinefororegon.com/issue/immigration/");
const dexterAddiction = site("Dexter · addiction and mental health", "https://maxinefororegon.com/issue/addiction-and-mental-health/");

analysis["maxine-e-dexter"] = {
  values: ["Public financing", "Healthcare regulation"],
  tradeoff: "Expanding housing tax credits, a single-payer path and 100% clean electricity all rely on federal money and majorities; the reviewed pages set the direction and some bills, not the order or the cost.",
  issues: {
    housing: { position: "Would expand the Low-Income Housing Tax Credit, the HOME program and the National Housing Trust Fund, fund innovative and green construction, and support rental assistance and down-payment help for first-time buyers.", source: dexterHousing },
    safety: { position: "Would work to dismantle and abolish ICE, pass the CLEAR ID Act to end anonymous raids, and vote no on ICE and CBP funding until both agencies end unconstitutional raids and fully restore due process.", source: dexterImmigration },
    money: { position: "Would close corporate tax loopholes and make billionaires pay more, raise the federal minimum wage to $15 tied to inflation, and pass the PRO Act and nationwide paid leave.", source: dexterEconomy },
    climate: { position: "Would pass a Green New Deal, move to 100% clean electricity nationwide, ban new fossil-fuel infrastructure on public lands and offshore, bury power lines and expand EV charging.", source: dexterClimate },
  },
  sources: [dexterStatement, dexterHousing, dexterEconomy, dexterClimate, dexterImmigration, dexterAddiction],
};
lines.push(
  line("maxine-e-dexter", "housing", "Would expand federal housing tax credits and trust funds, plus rental and down-payment aid."),
  line("maxine-e-dexter", "safety", "Would abolish ICE and vote no on its funding until unconstitutional raids end."),
  line("maxine-e-dexter", "money", "Would close corporate loopholes, tax billionaires more, raise the minimum wage to $15."),
  line("maxine-e-dexter", "climate", "Would move to 100% clean electricity and ban new fossil-fuel projects on public lands."),
);
chips.push(
  chip("maxine-e-dexter", "housing", "Expand housing tax credits"), chip("maxine-e-dexter", "safety", "Abolish ICE"),
  chip("maxine-e-dexter", "money", "Close corporate loopholes"), chip("maxine-e-dexter", "climate", "100% clean electricity"),
);
deliveries.push(
  delivery("maxine-e-dexter", "housing"),
  delivery("maxine-e-dexter", "safety", {
    how: step("The CLEAR ID Act and Restoring Access for Detainees Act to end anonymous raids and guarantee counsel; unannounced oversight visits to detention centers; federal investment in detox beds and medication-assisted treatment.", dexterAddiction),
  }),
  delivery("maxine-e-dexter", "money", {
    measure: step("A $15 federal minimum wage indexed to inflation, with the tipped sub-minimum eliminated.", dexterEconomy),
  }),
  delivery("maxine-e-dexter", "climate", {
    how: step("Invest in smart transmission grids, bury lines to prevent wildfires, expand EV charging, ban new fossil-fuel infrastructure on public lands and offshore, and grow clean domestic manufacturing.", dexterClimate),
    measure: step("100% clean electricity nationwide; no date is given.", dexterClimate),
  }),
);
ownWordsEntries.push(
  ownWords("maxine-e-dexter",
    "My working-class family had access to good public schools, reliable transit, union jobs and affordable housing.",
    statementOpening(15, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
);
contacts.push(
  contact("maxine-e-dexter",
    [web("https://maxinefororegon.com/", "pamphlet"), email("info@maxinefororegon.com", "site"),
     social("Facebook", "https://www.facebook.com/maxinefororegon", "site"), social("X", "https://x.com/doctormaxine", "site"),
     social("Instagram", "https://www.instagram.com/maxinefororegon/", "site"), social("Bluesky", "https://bsky.app/profile/maxinefororegon.bsky.social", "site")],
    [statement(15, "Prints www.MaxineforOregon.com."), site("Dexter · site footer", "https://maxinefororegon.com/", "The footer prints info@ and press@ addresses (behind a scraper shield) and profile redirects; no phone or contact form is published.")]),
  contact("loran-ayles",
    [email("GOPsHood@gmail.com", "filing")],
    [filing("Ayles · 2026 state candidate filing (Republican)", 25472, "Lists GOPsHood@gmail.com as the email, a Hood River PO box and no website. No pamphlet statement was filed and no campaign site was found.")]),
);
roles.push({ candidateId: "loran-ayles", role: "Qualified candidate in state filings", from: "background" });
primary.push({ candidateId: "maxine-e-dexter", sourceUrl: `${STATEMENTS}#page=15` });
missing["loran-ayles"] = "no-platform";
ballots.push(ballot("oregon-house-3"));
districts.push(district("oregon-house-3", "Portland east of the Willamette River, Gresham, Troutdale and Fairview, Hood River County and part of Clackamas County. Neighborhood edges are split by ZIP; use the lookup."));
choice.push(choiceOf("oregon-house-3", "The incumbent’s published program details federal housing and healthcare tools. A current policy brief for the challenger is still missing; do not infer his positions from his party alone."));
portraits["maxine-e-dexter"] = portrait("maxine-e-dexter", "https://maxinefororegon.com/", "maxinefororegon.com");

/* ══ U.S. House · District 4 ═══════════════════════════════════════════ */
/* Venues: statements pp. 17–22; valhoyle.com (/issues/, /about/, /contact/, /media-resources/);
   moniqueforcongress.com (/issues/, /meet-monique/); justin4congress.com (/our-platform, /meet-justin, /). */

const hoyleStatement = statement(19);
const hoyleIssues = site("Hoyle · priorities", "https://www.valhoyle.com/issues/");
const despainStatement = statement(17);
const despainIssues = site("DeSpain · priorities", "https://www.moniqueforcongress.com/issues/");
const filipStatement = statement(21);
const filipPlatform = site("Filip · platform", "https://www.justin4congress.com/our-platform");
const filipMeet = site("Filip · Meet Justin", "https://www.justin4congress.com/meet-justin");
const filipHome = site("Filip · home page (data centers, homelessness)", "https://www.justin4congress.com/");

analysis["val-hoyle"] = {
  values: ["Labor protections", "Household cost relief"],
  tradeoff: "Vouchers, a renter tax credit and restored premium credits all cost recurring money; the reviewed pages list the supports and past wins, not how the continuing costs would be paid.",
  issues: {
    housing: { position: "Would invest in affordable and workforce housing, create a renter tax credit for high-cost areas, expand down-payment assistance for first-time buyers and public servants, and increase Housing Choice Vouchers.", source: hoyleIssues },
    money: { position: "Would restore the Affordable Care Act's enhanced premium tax credits and clean-energy tax credits, expand and protect Social Security and Medicare, force lower drug prices, crack down on grocery price-fixing and refund small businesses for tariffs she calls illegal.", source: hoyleIssues },
    climate: { position: "Would push for billions in federal wildfire-risk investment, a constitutional amendment guaranteeing a right to a safe climate, new protections for Southwest Oregon rivers, and a transition off fossil fuels toward clean energy.", source: hoyleIssues },
  },
  sources: [hoyleStatement, hoyleIssues],
};
analysis["monique-despain"] = {
  values: ["Enforcement plus treatment", "Regulatory relief"],
  tradeoff: "Her immigration plan pairs tighter enforcement with a one-time route to legal status, and her homelessness plan pairs camping enforcement with more treatment; both need money her tax and spending cuts would have to leave in place.",
  issues: {
    housing: { position: "Would end what she calls prohibitive, inflationary policies that stifle construction, including excessive permitting costs, building regulations, local codes and outdated land-use restrictions, with the federal government lifting housing restrictions and encouraging workforce housing.", source: despainIssues },
    safety: { position: "Would expand shelter, treatment and recovery housing with measured outcomes, enforce laws against public camping and drug use, fund border security with barriers, sensors and staffing, remove noncitizens who commit serious crimes, and offer long-settled noncriminal residents a one-time earned path to lawful status.", source: despainIssues },
    money: { position: "Would cut excessive regulations, fix broken permitting systems and reduce what she calls punitive taxation, and end tax-and-spend policies she says fuel inflation and the national debt.", source: despainIssues },
    climate: { position: "Would restore active forest management with thinning, salvage and prescribed fire, rescind the 2001 Roadless Rule, require rapid fire suppression, and pursue an all-of-the-above energy strategy without bans or forced transitions.", source: despainIssues },
  },
  sources: [despainStatement, despainIssues],
};
analysis["justin-filip"] = {
  values: ["Public ownership", "Demilitarized budgets"],
  tradeoff: "Nationalizing energy and rail, Medicare for All and a $25 minimum wage are financed in his plan by cutting the military budget by half or more; each is a major bill with no sequencing in the reviewed pages.",
  issues: {
    housing: { position: "Wants federal dollars brought back to the district to help address the housing and unhoused crisis.", source: filipMeet },
    safety: { position: "Would abolish ICE and replace it with an Office of Citizenship, Refugees and Immigration Services, grant amnesty with a path to citizenship, ban private prisons, end qualified immunity and put policing under community oversight boards.", source: filipPlatform },
    money: { position: "Would cut tax burdens for families under $75,000, lift the Social Security contribution cap and extend it to capital gains, raise taxes on the ultra-wealthy, set a $25 minimum wage and cut military spending 50 to 75 percent.", source: filipPlatform },
    climate: { position: "Would declare a national climate emergency, pass a Green New Deal, ban fracking, eliminate fossil-fuel subsidies and nationalize energy and rail for renewable power and high-speed rail.", source: filipPlatform },
  },
  sources: [filipStatement, filipPlatform, filipMeet, filipHome],
};
lines.push(
  line("monique-despain", "housing", "Would cut permit costs, building rules and land-use limits to spur home construction."),
  line("monique-despain", "safety", "Would expand treatment, enforce camping laws, secure the border, and offer earned legal status."),
  line("monique-despain", "money", "Would cut excessive regulations, reduce taxes and end what she calls tax-and-spend policies."),
  line("monique-despain", "climate", "Would thin and salvage federal forests, rescind the Roadless Rule, keep all energy options."),
  line("justin-filip", "housing", "Wants federal dollars brought back to the district for the housing and unhoused crisis."),
  line("justin-filip", "safety", "Would abolish ICE, ban private prisons, end qualified immunity (police liability shield)."),
  line("justin-filip", "money", "Would cut taxes under $75,000, tax the ultra-wealthy, cut military spending 50–75%."),
  line("justin-filip", "climate", "Would declare a climate emergency, ban fracking, nationalize energy and rail systems."),
  line("val-hoyle", "housing", "Would add housing vouchers, a renter tax credit and down-payment help for first-time buyers."),
  line("val-hoyle", "money", "Would restore health-insurance premium credits, protect Social Security and Medicare, refund tariff costs."),
  line("val-hoyle", "climate", "Would fund wildfire-risk reduction, protect Southwest Oregon rivers, move off fossil fuels."),
);
chips.push(
  chip("monique-despain", "housing", "Fewer building rules"), chip("monique-despain", "safety", "Enforcement plus treatment"),
  chip("monique-despain", "money", "Cut taxes and regulation"), chip("monique-despain", "climate", "Active forest management"),
  chip("justin-filip", "housing", "Federal housing dollars"), chip("justin-filip", "safety", "Abolish ICE"),
  chip("justin-filip", "money", "Cut military 50–75%"), chip("justin-filip", "climate", "Nationalize energy, rail"),
  chip("val-hoyle", "housing", "Vouchers and renter credit"), chip("val-hoyle", "money", "Restore premium credits"), chip("val-hoyle", "climate", "Fund wildfire prevention"),
);
deliveries.push(
  delivery("monique-despain", "housing"),
  delivery("monique-despain", "safety", {
    how: step("Deflection and diversion programs before the justice system, outcome-measured funding for homelessness programs, an all-of-the-above border toolkit, national employment verification, and a registration-and-background-check route to lawful status for long-settled residents.", despainIssues),
    measure: step("Judge every homelessness program by whether people recover, become self-sufficient and return to stable housing, and stop funding those that do not; no numeric target or date is given.", despainIssues),
  }),
  delivery("monique-despain", "money"),
  delivery("monique-despain", "climate", {
    how: step("Thinning, sustainable-yield and salvage harvests, prescribed and tribal burning, road and evacuation-route maintenance, rapid initial attack by federal, state, tribal and private crews, and public comment already filed for rescinding the Roadless Rule.", despainIssues),
    measure: step("Ending what she calls the smoke season; no acreage or date is given.", despainIssues),
  }),
  delivery("justin-filip", "housing"),
  delivery("justin-filip", "safety", {
    how: step("Replace ICE with an Office of Citizenship, Refugees and Immigration Services; fully staff immigration courts and hire asylum officers; independent oversight boards for police; halt “cop city” expansion.", filipPlatform),
  }),
  delivery("justin-filip", "money", {
    how: step("Remove the cap on Social Security contributions for high earners and extend the tax to capital gains and dividends; break up monopolies and ban stock buybacks.", filipPlatform),
    measure: step("A $25 minimum wage indexed to inflation and productivity; military spending down 50 to 75 percent.", filipPlatform),
  }),
  delivery("justin-filip", "climate", {
    how: step("Redirect 50 to 75 percent of the military budget to climate resilience; public ownership of energy and railroads to drive renewable power and coast-to-coast high-speed rail; climate reparations for frontline communities.", filipPlatform),
  }),
  delivery("val-hoyle", "housing", {
    how: step("Cites the bipartisan 21st Century Road to Housing Act she helped pass as the vehicle for lowering costs, alongside new investment in affordable and workforce housing.", hoyleIssues),
  }),
  delivery("val-hoyle", "money", {
    how: step("Restore the enhanced premium tax credits Republicans let expire, legislation making it easier to go after grocery conglomerates, and refunds to small businesses for the costs of illegal tariffs.", hoyleIssues),
    measure: step("Cites more than 21,000 people in Southwest Oregon facing higher costs after the credits expired as the group restoration would reach.", hoyleIssues),
  }),
  delivery("val-hoyle", "climate", {
    how: step("Billions in new federal investment to reduce catastrophic wildfire risk, a constitutional amendment on a safe climate, federal protections for Southwest Oregon watersheds and restored clean-energy tax credits.", hoyleIssues),
  }),
);
ownWordsEntries.push(
  ownWords("val-hoyle",
    "Val is working to expand Social Security and Medicare and protect them from devastating cuts by the Trump administration and Congressional Republicans.",
    statementOpening(19, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: a quotation attributed to Brett Deedon, the heading “Leadership That Gets Things Done”, the list lead-in “For 40 years as an elected and community leader, Val Hoyle has delivered:” with its bulleted items, and the heading “Protecting Social Security and Medicare”."),
    "pamphlet-opening"),
  ownWords("monique-despain",
    "Monique is running for Congress because we deserve leaders with commonsense solutions.",
    statementOpening(17, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: unpunctuated headings, an endorsement list lead-in and the labels “REAL LEADERSHIP. NOT A CAREER POLITICIAN.” (no predicate). The first sentence is exactly 12 words, so it stands alone."),
    "pamphlet-opening"),
  ownWords("justin-filip",
    "I will be a voice in Congress for those whose interests are often neglected by our government.",
    statementOpening(21, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
);
contacts.push(
  contact("val-hoyle",
    [web("https://www.valhoyle.com/", "site"), form("https://www.valhoyle.com/contact/", "Contact form", "site"),
     social("Facebook", "https://www.facebook.com/ValHoyleForCongress/", "site"), social("Instagram", "https://www.instagram.com/valhoyle", "site"), social("X", "https://twitter.com/ValHoyle", "site")],
    [statement(19, "Prints no website, email or phone."), site("Hoyle · contact page", "https://www.valhoyle.com/contact/", "Holds a contact form and a PO box; no campaign email or phone is published on the contact or media-resources pages. Profile links are footer redirects.")]),
  contact("monique-despain",
    [web("https://www.moniqueforcongress.com/", "pamphlet"), email("info@moniqueforcongress.com", "site"), phone("5413216016", "541-321-6016", "site"),
     social("Facebook", "https://www.facebook.com/MoniqueforCongress", "site"), social("X", "https://twitter.com/MoniqueforOR", "site"), social("Instagram", "https://www.instagram.com/monique4congress/", "site"),
     social("YouTube", "https://www.youtube.com/channel/UCxE0_vJbRL8XH8Jg3R6uw1A", "site"), social("TikTok", "https://www.tiktok.com/@moniqueforcongress", "site")],
    [statement(17, "Prints www.moniqueforcongress.com."), site("DeSpain · site footer", "https://www.moniqueforcongress.com/", "The footer prints a PO box, the email and the phone; profile links are in the header.")]),
  contact("justin-filip",
    [web("https://www.justin4congress.com/", "pamphlet"), email("justin4congress@gmail.com", "site"),
     social("Instagram", "https://www.instagram.com/justin4congress/", "site"), social("X", "https://x.com/justin4OR", "site"),
     social("Facebook", "https://www.facebook.com/profile.php?id=61562334326542", "site"), social("YouTube", "https://www.youtube.com/@justin4congress", "site")],
    [statement(21, "Prints https://www.justin4congress.com/."), site("Filip · platform page footer", "https://www.justin4congress.com/our-platform", "The footer prints justin4congress@gmail.com and profile links; no phone is published.")]),
);
primary.push(
  { candidateId: "val-hoyle", sourceUrl: `${STATEMENTS}#page=19` },
  { candidateId: "monique-despain", sourceUrl: `${STATEMENTS}#page=17` },
  { candidateId: "justin-filip", sourceUrl: `${STATEMENTS}#page=21` },
);
ballots.push(ballot("oregon-house-4"));
districts.push(district("oregon-house-4", "The south coast and southern Willamette Valley: Eugene, Springfield, Corvallis, Roseburg, Coos Bay, Florence and Newport. County edges are split; use the lookup."));
choice.push(choiceOf("oregon-house-4", "One emphasizes public investment and labor protections; another combines enforcement and regulatory relief with a conditional immigration-status proposal; a third proposes much larger changes to ownership, social provision and military spending."));
portraits["val-hoyle"] = portrait("val-hoyle", "https://www.valhoyle.com/", "valhoyle.com");
portraits["monique-despain"] = portrait("monique-despain", "https://www.moniqueforcongress.com/", "moniqueforcongress.com");

/* ══ U.S. House · District 5 ═══════════════════════════════════════════ */
/* Venues: statements pp. 23–26; janellebynum.com (/issues and its housing, healthcare, homelessness, economy and
   climate pages; /meet-janelle); pattiforcongress.com (/priorities, /about, /volunteer); Townsend: the Pacific Green
   Party's published nomination questionnaire (July 17, 2026) and ORESTAR cfRsn=25632 (no website listed). */

const bynumStatement = statement(23);
const bynumHousing = site("Bynum · lowering the cost of housing", "https://www.janellebynum.com/issues/lowering-the-cost-of-housing");
const bynumHomeless = site("Bynum · ending homelessness", "https://www.janellebynum.com/issues/ending-homelessness");
const bynumClimate = site("Bynum · taking climate action", "https://www.janellebynum.com/issues/taking-climate-action");
const adairStatement = statement(25);
const adairPriorities = site("Adair · record and priorities", "https://www.pattiforcongress.com/priorities");
const townsendQuestionnaire: Evidence = {
  label: "Pacific Green Party · nomination questionnaire, Townsend’s answers",
  url: "https://www.pacificgreens.org/meet_the_candidates_for_nomination_andrea_townsend",
  kind: "Candidate statement",
  date: "Posted July 17, 2026; reviewed September 21, 2026",
  note: NOTE,
};

analysis["janelle-s-bynum"] = {
  values: ["Housing supply", "Health-coverage protection"],
  tradeoff: "Her pages describe bills introduced and money brought home rather than a costed program; lowering housing and health costs through Congress depends on which of those bills can pass.",
  issues: {
    housing: { position: "Has introduced legislation to tackle housing shortages, workforce gaps and affordability barriers, expand pathways to homeownership and address youth homelessness.", source: bynumHousing },
    safety: { position: "Opposes what she calls a federal takeover of communities by Trump’s ICE, which she accuses of rounding up people based on the color of their skin.", source: bynumStatement },
    money: { position: "Would lower costs from groceries to housing to health care and push back against what she calls Trump administration efforts to gut the Oregon Health Plan.", source: bynumStatement },
    climate: { position: "Supports efforts to generate more clean energy, transition away from fossil fuels and protect communities, property and land from wildfires.", source: bynumClimate },
  },
  sources: [bynumStatement, bynumHousing, bynumHomeless, bynumClimate],
};
analysis["patti-adair"] = {
  values: ["Fiscal oversight", "Law-enforcement support"],
  tradeoff: "Permanent no-tax-on-tips, overtime and Social Security plus a larger child tax credit reduce revenue while she promises to eliminate waste; the reviewed pages do not size either side.",
  issues: {
    safety: { position: "Would fully support law enforcement to keep communities safe; cites increasing law-enforcement funding and delivering new judgeships as a county commissioner.", source: adairPriorities },
    money: { position: "Would make no tax on tips, overtime and Social Security permanent and raise the limits, increase the child tax credit, ban congressional insider trading and pay during shutdowns, and eliminate wasteful spending.", source: adairStatement },
    climate: { position: "Would require Big Tech to disclose data centers' effects on air, water and electricity costs, address rising electricity costs, and support sustainable management of natural resources.", source: adairStatement },
  },
  sources: [adairStatement, adairPriorities],
};
analysis["andrea-townsend"] = {
  values: ["Peace dividend", "Ecological limits"],
  tradeoff: "Redirecting war spending to social housing and climate work is a direction, not a bill; the questionnaire names the priorities and none of the amounts or mechanisms.",
  issues: {
    housing: { position: "Would address the housing crisis through deeply affordable social housing and tenant protections.", source: townsendQuestionnaire },
    money: { position: "Would end war and redirect resources toward human and ecological needs, and build an economy that supports working people, young people and communities excluded from political power.", source: townsendQuestionnaire },
    climate: { position: "Would confront climate change while protecting land, water and biodiversity, with housing, transportation, food and energy systems built to work with planetary processes.", source: townsendQuestionnaire },
  },
  sources: [townsendQuestionnaire],
};
lines.push(
  line("patti-adair", "safety", "Would fully support law enforcement to keep communities safe."),
  line("patti-adair", "money", "Would make no-tax-on-tips permanent, raise the child tax credit, ban congressional insider trading."),
  line("patti-adair", "climate", "Would require data-center disclosure of air, water and electricity impacts; sustainable resource management."),
  line("janelle-s-bynum", "housing", "Would target housing shortages, workforce gaps and affordability barriers, with ownership pathways."),
  line("janelle-s-bynum", "safety", "Opposes what she calls a federal takeover of communities by ICE."),
  line("janelle-s-bynum", "money", "Would lower grocery, housing and health costs and defend the Oregon Health Plan."),
  line("janelle-s-bynum", "climate", "Supports efforts to expand clean energy, move off fossil fuels and protect against wildfire."),
  line("andrea-townsend", "housing", "Wants deeply affordable social housing (publicly owned) and tenant protections."),
  line("andrea-townsend", "money", "Wants war spending redirected to human and ecological needs."),
  line("andrea-townsend", "climate", "Wants climate action protecting land, water and biodiversity; transportation and energy within planetary limits."),
);
chips.push(
  chip("patti-adair", "safety", "Fully support police"), chip("patti-adair", "money", "No tax on tips"), chip("patti-adair", "climate", "Data-center disclosure"),
  chip("janelle-s-bynum", "housing", "Supply and affordability"), chip("janelle-s-bynum", "safety", "Oppose ICE takeover"),
  chip("janelle-s-bynum", "money", "Defend Oregon Health Plan"), chip("janelle-s-bynum", "climate", "Clean energy, wildfire"),
  chip("andrea-townsend", "housing", "Deeply affordable housing"), chip("andrea-townsend", "money", "Redirect war spending"), chip("andrea-townsend", "climate", "Protect land and water"),
);
deliveries.push(
  delivery("patti-adair", "safety"), delivery("patti-adair", "money"), delivery("patti-adair", "climate"),
  delivery("janelle-s-bynum", "housing"), delivery("janelle-s-bynum", "safety"), delivery("janelle-s-bynum", "money"), delivery("janelle-s-bynum", "climate"),
  delivery("andrea-townsend", "housing"), delivery("andrea-townsend", "money"), delivery("andrea-townsend", "climate"),
);
ownWordsEntries.push(
  ownWords("patti-adair",
    "I am running for Congress to help make healthcare more accessible and affordable for working-class families, to support sustainable management of our natural resources, address rising electricity costs, and to support policies that help businesses and families thrive in Oregon.",
    statementOpening(25, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the heading “AN OREGON-FIRST FIGHTER”. The statement sets this passage in quotation marks with no attribution line, so it counts as the first sentence; the marks are not reproduced."),
    "pamphlet-opening"),
  ownWords("janelle-s-bynum",
    "A mom of four and local businesswoman, Congresswoman Janelle Bynum knows what Oregon’s families are up against, because she’s living it too.",
    statementOpening(23, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
  ownWords("andrea-townsend",
    "I want to pursue this role to ensure that voters in Oregon’s Fifth Congressional District have a Green candidate on the ballot and a meaningful alternative grounded in peace, ecological responsibility, social justice, and care for future generations.",
    { label: "Pacific Green Party · nomination questionnaire, Townsend’s answers", url: "https://www.pacificgreens.org/meet_the_candidates_for_nomination_andrea_townsend", kind: "Candidate statement",
      date: "Posted July 17, 2026; extracted September 21, 2026",
      note: "Verbatim opening of the candidate's written answer to the party's first question (“Why do you want to pursue this role?…”), the only candidate statement found. No pamphlet statement was filed; her state filing lists no website." },
    "questionnaire-opening"),
);
contacts.push(
  contact("janelle-s-bynum",
    [web("https://www.janellebynum.com/", "pamphlet"), email("info@janellebynum.com", "site"),
     social("Facebook", "https://www.facebook.com/janelle.bynum", "site"), social("Instagram", "https://www.instagram.com/bynum4thewin", "site"), social("X", "https://twitter.com/bynum4thewin", "site")],
    [statement(23, "Prints www.JanelleBynum.com."), site("Bynum · site footer", "https://www.janellebynum.com/", "The footer prints info@ and press@ addresses and profile links; no phone or contact form is published.")]),
  contact("patti-adair",
    [web("https://www.pattiforcongress.com/", "pamphlet"), email("info@pattiforcongress.com", "site"), form("https://www.pattiforcongress.com/volunteer", "Volunteer form", "site"),
     social("X", "https://x.com/pattiadairor", "site"), social("Facebook", "https://www.facebook.com/profile.php?id=61583499556979", "site"), social("Instagram", "https://www.instagram.com/pattiadairor", "site")],
    [statement(25, "Prints www.PattiForCongress.com."), site("Adair · site footer", "https://www.pattiforcongress.com/", "The footer’s Contact link is the campaign email, with a PO box for mail; profile links are in the header; the Join page is a volunteer form. No phone is published.")]),
  contact("andrea-townsend",
    [email("andreaportlandrea@gmail.com", "filing")],
    [filing("Townsend · 2026 state candidate filing (Pacific Green)", 25632, "Lists andreaportlandrea@gmail.com as the email and no website. No pamphlet statement was filed; the party questionnaire prints no contact.")]),
);
roles.push({ candidateId: "andrea-townsend", role: "Qualified candidate in state filings", from: "background" });
primary.push(
  { candidateId: "janelle-s-bynum", sourceUrl: `${STATEMENTS}#page=23` },
  { candidateId: "patti-adair", sourceUrl: `${STATEMENTS}#page=25` },
  { candidateId: "andrea-townsend", sourceUrl: "https://www.pacificgreens.org/meet_the_candidates_for_nomination_andrea_townsend" },
);
ballots.push(ballot("oregon-house-5"));
districts.push(district("oregon-house-5", "Clackamas County suburbs such as Oregon City, Lake Oswego, West Linn and Happy Valley, part of southeast Portland, Bend and Redmond in Central Oregon, and parts of Marion and Linn counties along I-5. Use the lookup."));
choice.push(choiceOf("oregon-house-5", "One emphasizes housing access and health coverage; another emphasizes affordability, law enforcement and congressional ethics. A current profile for the third candidate remains a research gap."));
portraits["janelle-s-bynum"] = portrait("janelle-s-bynum", "https://www.janellebynum.com/", "janellebynum.com");
portraits["patti-adair"] = portrait("patti-adair", "https://www.pattiforcongress.com/", "pattiforcongress.com");

/* ══ U.S. House · District 6 ═══════════════════════════════════════════ */
/* Venues: statements pp. 27–30; andreasalinasfororegon.com (/issues/, /about/, /contact/);
   russisforus.com (/, /about-me/, /immigration, /proposed-bills). */

const salinasStatement = statement(27);
const salinasIssues = site("Salinas · issues", "https://www.andreasalinasfororegon.com/issues/");
const russStatement = statement(29);
const russHome = site("Russ · campaign platform (home page)", "https://russisforus.com/");
const russBills = site("Russ · proposed bills", "https://russisforus.com/proposed-bills");

analysis["andrea-salinas"] = {
  values: ["Targeted federal investment", "Health-care access"],
  tradeoff: "Federal housing money, mental-health bills and drug-price caps are incremental and bipartisan by design; the reviewed pages show bills and grants, not which would come first under a tight budget.",
  issues: {
    housing: { position: "Would invest in affordable housing and emergency shelters, support legislation for two million affordable homes over a decade, and prioritize housing for unhoused people and unaccompanied homeless youth.", source: salinasIssues },
    safety: { position: "Would fund first responders and social services, keep working with police on fentanyl including stiffer trafficker penalties, invest in smart border security, streamline immigration courts and deliver certainty for immigrants already living here.", source: salinasIssues },
    money: { position: "Would cap prescription drug costs and strengthen hospital price transparency, and seeks middle-class tax relief instead of billionaire tax breaks.", source: salinasStatement },
    climate: { position: "Would put Oregon on a path to 100% green energy, stand up to corporate polluters and protect air and waterways.", source: salinasIssues },
  },
  sources: [salinasStatement, salinasIssues],
};
const russEmail: Evidence = {
  label: "Russ · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#russ-2026-09-24",
  kind: "Candidate statement",
  date: "Received September 24, 2026",
  note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on the brief. Receipt does not verify the claims.",
};
analysis["david-russ"] = {
  values: ["Local control", "Smaller federal role"],
  tradeoff: "Returning lands, schools and utilities to state control and ending conditional federal grants would shift both authority and hundreds of billions of dollars; who funds those responsibilities afterward is not addressed in the reviewed pages.",
  issues: {
    housing: { position: "Says nearly all his proposals would reduce homelessness by strengthening the economy, and opposes giving federal money to nonprofit organizations he says overpay their staff.", source: russEmail },
    safety: { position: "Would make it a federal felony to aid or abet illegal border crossers.", source: russHome },
    money: { position: "Would end subsidies that benefit only large corporations and federal subsidy or loan programs for noncitizens, and end what he calls the IRS manhunt of 1099 employers.", source: russHome },
    climate: { position: "Would return federal public lands to state and local control and end federal control of local schools, utilities, businesses and infrastructure.", source: russHome},
  },
  sources: [russStatement, russHome, russBills],
};
lines.push(
  line("david-russ", "housing", "Economic growth to cut homelessness; opposes funding nonprofits he says overpay staff."),
  line("david-russ", "safety", "Would make aiding or abetting illegal border crossers a federal felony."),
  line("david-russ", "money", "Would end subsidies benefiting only large corporations and federal loan programs targeting noncitizens."),
  line("david-russ", "climate", "Would return federal public lands to state and local control; end federal utility control."),
  line("andrea-salinas", "housing", "Would fund affordable housing and shelters, backing a two-million-home national plan."),
  line("andrea-salinas", "safety", "Would fund police and social services, tighten fentanyl penalties, streamline immigration courts."),
  line("andrea-salinas", "money", "Would cap prescription costs, seek middle-class tax relief over billionaire tax breaks."),
  line("andrea-salinas", "climate", "Would push toward 100% green energy and hold corporate polluters accountable."),
);
chips.push(
  chip("david-russ", "housing", "Growth, not NGO funding"), chip("david-russ", "safety", "Aiding crossings a felony"), chip("david-russ", "money", "End big-firm subsidies"), chip("david-russ", "climate", "Local control of lands"),
  chip("andrea-salinas", "housing", "Two million homes"), chip("andrea-salinas", "safety", "Fund police and services"),
  chip("andrea-salinas", "money", "Cap drug prices"), chip("andrea-salinas", "climate", "100% green energy"),
);
deliveries.push(
  delivery("david-russ", "housing"),
  delivery("david-russ", "safety", {
    measure: step("Says the measure is a stronger economy and higher wages for citizens, which he attributes to fewer people in the country illegally.", russEmail),
    how: step("A Prosecutorial Requirements bill making U.S. attorneys try about 98% of cases referred by law enforcement or lose their jobs; a federal felony for aiding or abetting illegal border crossers.", russBills),
  }),
  delivery("david-russ", "money", {
    how: step("A No Strings Act voiding conditions on federal grants beyond a project’s scope and blocking federal funds to non-government agencies without audited contracts.", russBills),
    measure: step("Says the act would save hundreds of billions a year, possibly over $1 trillion, returned to local economies; no independent estimate is cited.", russBills),
  }),
  delivery("david-russ", "climate", {
    how: step("Says he has no specific process yet; returning federal lands other than national parks to the states would, he says, also reduce the federal budget.", russEmail),
  }),
  delivery("andrea-salinas", "housing", {
    how: step("Federal funding for affordable-housing projects (she cites Tigard and Newberg) and the Housing for the 21st Century Act, plus additional emergency-shelter funding for Oregon.", salinasIssues),
    measure: step("Two million affordable homes built nationally in the next decade under the legislation she supports.", salinasIssues),
  }),
  delivery("andrea-salinas", "safety", {
    how: step("Federal grants for community service officers and rural fentanyl enforcement, a bill on firefighter mental health, and Border Security Task Force work pushing smart border investment and faster immigration courts.", salinasIssues),
  }),
  delivery("andrea-salinas", "money", {
    how: step("Medicare drug-price negotiation and hospital and insurer price transparency; three free behavioral-health visits a year for Medicare and Medicaid recipients under her HOPE and Mental Wellbeing Act.", salinasIssues),
  }),
  delivery("andrea-salinas", "climate", {
    measure: step("100% green energy for Oregon; no date is given.", salinasIssues),
  }),
);
ownWordsEntries.push(
  ownWords("david-russ",
    "Oregon deserves representation that works for the people, not the system. Our government has continuously grown more powerful while families, businesses, and rural communities have been pushed aside.",
    statementOpening(29, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it. The first sentence is under 12 words, so the first two are shown."),
    "pamphlet-opening"),
  ownWords("andrea-salinas",
    "As the daughter of a Mexican immigrant whose father worked in the fields before serving in the military, Andrea knows that change can happen in a generation through hard work.",
    statementOpening(27, "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Nothing was skipped before it."),
    "pamphlet-opening"),
);
contacts.push(
  contact("andrea-salinas",
    [web("https://www.andreasalinasfororegon.com/", "pamphlet"), email("campaign@andreasalinasfororegon.com", "site"), form("https://www.andreasalinasfororegon.com/contact/", "Contact form", "site"),
     social("Facebook", "https://www.facebook.com/andreasalinasoregon/", "site"), social("Instagram", "https://www.instagram.com/salinasfororegon/", "site"), social("X", "https://twitter.com/AndreaRSalinas", "site")],
    [statement(27, "Prints AndreaSalinasForOregon.com."), site("Salinas · contact page", "https://www.andreasalinasfororegon.com/contact/", "Prints a PO box, the campaign@ and press@ addresses (behind a scraper shield) and a contact form; no phone is published. Profile links are footer redirects.")]),
  contact("david-russ",
    [web("https://russisforus.com/", "pamphlet"), email("info@RussIsForUS.com", "site"), phone("5037148086", "+1 (503) 714-8086", "site"),
     social("Facebook", "https://www.facebook.com/russisforus", "site"), social("X", "https://x.com/realRUSSISFORUS", "site"), social("YouTube", "https://www.youtube.com/@russisforus-virtualrally9186", "site")],
    [statement(29, "Prints RussIsForUS.com (resolves without www)."), site("Russ · site footer", "https://russisforus.com/", "The footer prints the phone, the email and a PO box, with profile links; the Instagram icon links no profile and is not listed.")]),
);
primary.push({ candidateId: "andrea-salinas", sourceUrl: `${STATEMENTS}#page=27` }, { candidateId: "david-russ", sourceUrl: `${STATEMENTS}#page=29` });
ballots.push(ballot("oregon-house-6"));
districts.push(district("oregon-house-6", "Salem and Keizer, Yamhill County (McMinnville, Newberg, Dundee), Polk County, Tigard and Tualatin in Washington County, and part of Marion County including Woodburn. Use the lookup at the edges."));
choice.push(choiceOf("oregon-house-6", "One favors targeted federal investment and healthcare protections. The other proposes a much smaller federal role in several policy areas and stricter immigration enforcement."));
portraits["andrea-salinas"] = portrait("andrea-salinas", "https://www.andreasalinasfororegon.com/", "andreasalinasfororegon.com");
portraits["david-russ"] = portrait("david-russ", "https://russisforus.com/about-me/", "russisforus.com");

/* ══ Topics, stances and stakes: the congressional record first ═══════════ */
/*
 * Researched September 22, 2026. Eight choices Oregon's members of Congress
 * voted on or that candidates addressed in September 2026, shared by all seven
 * federal races. An incumbent's recorded vote is cited from the House Clerk or
 * the Senate's roll-call pages and is the stance ("Public record"); challengers'
 * stances come from their own filed statement, site or questionnaire. Nothing
 * is inferred from party, endorsements or silence; a gap is a gap.
 */

const TOPIC_REVIEWED_ON = "2026-09-22";
const topicReviewed = { reviewedBy: "pending", reviewedOn: TOPIC_REVIEWED_ON } as const;
const record = (label: string, url: string, date: string, note?: string): Evidence => ({
  label, url, kind: "Public record", date, ...(note ? { note } : {}),
});
const reporting = (label: string, url: string, date: string, note?: string): Evidence => ({
  label, url, kind: "Reporting", date, ...(note ? { note } : {}),
});
const stance = (candidateId: string, topicId: string, s: TopicStance["stance"], chipText: string, text: string, source: Evidence): TopicStance => ({
  candidateId, topicId, stance: s, chip: chipText, text, source, ...topicReviewed,
});
const houseRoll = (year: number, roll: number, label: string, date: string, note: string): Evidence =>
  record(`House Clerk · roll call ${roll} (${year}), ${label}`, `https://clerk.house.gov/Votes/${year}${roll}`, `${date}; reviewed September 22, 2026`, note);
const senateRoll = (session: 1 | 2, vote: number, label: string, date: string, note: string): Evidence =>
  record(`U.S. Senate · roll call vote ${vote} (${session === 1 ? "2025" : "2026"}), ${label}`,
    `https://www.senate.gov/legislative/LIS/roll_call_votes/vote119${session}/vote_119_${session}_${String(vote).padStart(5, "0")}.htm`,
    `${date}; reviewed September 22, 2026`, note);

/* The votes. One package vote records a position on the whole bill, not on each provision. */
const hr1House = houseRoll(2025, 190, "final House passage of H.R. 1 (motion to concur in the Senate amendment)", "July 3, 2025",
  "Passed 218–214. H.R. 1 carried the tax cuts, the Medicaid work rules and six-month renewals, the SNAP changes and $75 billion for immigration enforcement together; this is a vote on the whole package.");
const hr1Senate = senateRoll(1, 372, "passage of H.R. 1 as amended", "July 1, 2025",
  "Passed 50–50 with the vice president breaking the tie. A vote on the whole package, not on each provision.");
const acaHouse = houseRoll(2026, 11, "passage of H.R. 1834, a three-year restoration of the enhanced ACA premium tax credits", "January 8, 2026",
  "Passed 230–196 after a discharge petition; 17 Republicans joined every Democrat. The Senate had not taken the bill up as of September 22, 2026 (GovTrack).");
const acaSenate = senateRoll(1, 644, "cloture on S. 3385, the Democrats’ three-year premium tax credit extension", "December 11, 2025",
  "Cloture failed 51–48 (60 needed); the enhanced credits expired December 31, 2025.");
const tariffHouse = houseRoll(2026, 65, "passage of H.J.Res. 72, ending the national emergency behind the Canada tariffs", "February 11, 2026",
  "Passed 219–211; six Republicans joined all but one Democrat. Nine days later the Supreme Court held the emergency-powers tariffs unlawful (Learning Resources v. Trump, 6–3).");
const tariffSenate = senateRoll(1, 600, "passage of S.J.Res. 88, ending the national emergency behind the global tariffs", "October 30, 2025",
  "Passed 51–47. The Senate also voted to end the Brazil (S.J.Res. 81, October 28) and Canada (S.J.Res. 77, October 29) tariff emergencies that week.");
const iceHouse = houseRoll(2026, 214, "passage of S. 2, the Secure America Act", "June 9, 2026",
  "Passed 214–212; signed June 10, 2026 (Public Law 119-98). About $70 billion through September 2029: $38.5 billion for ICE, $26 billion for Customs and Border Protection and $5 billion for the department, per the CRS summary and the American Immigration Council.");
const iceSenate = senateRoll(2, 163, "passage of S. 2, the Secure America Act, as amended", "June 5, 2026",
  "Passed 52–47 under budget reconciliation after an overnight amendment series.");
const iranHouse = houseRoll(2026, 282, "agreeing to H.Con.Res. 89, directing the removal of U.S. forces from hostilities with Iran", "July 23, 2026",
  "Passed 214–208, thirteen days after the president notified Congress that fighting had resumed. The same members voted the same way on H.Con.Res. 86 (roll call 199, June 3, 2026, 215–208).");
const iranSenate = senateRoll(2, 184, "agreeing to H.Con.Res. 86, directing the removal of U.S. forces from hostilities with Iran", "June 23, 2026",
  "Agreed to 50–48, the first Iran war-powers measure adopted by both chambers. A binding joint resolution (S.J.Res. 180) failed 47–49 on July 23, 2026.");
const fofaHouse = houseRoll(2025, 25, "passage of H.R. 471, the Fix Our Forests Act", "January 23, 2025",
  "Passed 279–141 with 64 Democrats. The Senate Agriculture Committee advanced its version (S. 1462) 18–5 in October 2025; the full Senate had not voted as of September 22, 2026.");
const housingHouse = houseRoll(2026, 224, "final passage of H.R. 6644, the 21st Century ROAD to Housing Act", "June 23, 2026",
  "Passed 358–32; became Public Law 119-101 on July 11, 2026. The first House vote (roll call 57, February 9, 2026) was 390–9.");
const housingSenate = senateRoll(2, 182, "final passage of H.R. 6644, the 21st Century ROAD to Housing Act", "June 22, 2026",
  "Agreed to 85–5; became Public Law 119-101 on July 11, 2026.");
const crHouse = houseRoll(2026, 286, "concurring in the Senate amendment to H.R. 6500, the stopgap funding bill through December 11, 2026", "September 1, 2026",
  "Passed 370–48; signed September 2, 2026 (Public Law 119-103). Five of Oregon's six representatives voted yes; Rep. Dexter voted no.");
const crSenate = senateRoll(2, 228, "passage of H.R. 6500, the stopgap funding bill through December 11, 2026", "August 8, 2026",
  "Passed 90–6.");

/* Candidates' own words beyond the pamphlet, and incumbents' official actions short of a vote. */
const merkleyDataCenters: Evidence = {
  label: "Sen. Merkley · letter with Sen. Wyden to Oregon’s data center advisory committee",
  url: "https://www.merkley.senate.gov/wyden-merkley-ask-state-data-center-advisory-committee-to-consider-multiple-issues-raised-by-oregonians/",
  kind: "Candidate statement", date: "July 2, 2026; reviewed September 22, 2026", note: NOTE,
};
const merkleyBiomass: Evidence = {
  label: "Sen. Merkley · Wildfire Reduction Market Expansion Act, introduced with Rep. Bentz",
  url: "https://www.merkley.senate.gov/merkley-hyde-smith-bentz-thompson-launch-new-bipartisan-effort-to-promote-renewable-fuels-boost-wildfire-resiliency/",
  kind: "Candidate statement", date: "July 22, 2026; reviewed September 22, 2026", note: NOTE,
};
const bynumBillDrivers: Evidence = {
  label: "Rep. Bynum · BILL Drivers Act press release (electricity price transparency)",
  url: "https://bynum.house.gov/media/press-releases/congresswoman-bynum-introduces-legislation-improve-electricity-price",
  kind: "Candidate statement", date: "July 10, 2026; reviewed September 22, 2026", note: NOTE,
};
const adairShutdown = site("Adair · statement on the February 3, 2026 funding vote", "https://www.pattiforcongress.com/post/patti-adair-denounces-janelle-bynum-s-vote-to-shutdown-the-government");
const kahlSurvey: Evidence = {
  label: "Kahl · Ballotpedia Candidate Connection survey, 2026",
  url: "https://ballotpedia.org/Barbara_Kahl", kind: "Candidate statement", date: "2026 survey; reviewed September 22, 2026", note: NOTE,
};

/* Context and stakes sources: official pages and reporting read September 22, 2026. */
const ohaFederalChanges = record("Oregon Health Authority · OHP work or activity rules and federal changes to the Oregon Health Plan",
  "https://www.oregon.gov/oha/hsd/ohp/pages/federal-changes.aspx", "Reviewed September 22, 2026",
  "Work or activity rules for adults 19–64 start in 2027 (80 hours a month or $580 a month in earnings); six-month renewals begin in late 2027. Coverage-loss and funding estimates are from OHA officials as reported by OPB (July 29, 2026) and Willamette Week (September 14, 2026).");
const opbOhp = reporting("OPB · Big changes coming for people on Oregon Health Plan", "https://www.opb.org/article/2026/07/29/think-out-loud-oregon-health-plan/", "July 29, 2026; reviewed September 22, 2026",
  "OHA: about 600,000 adults will be checked against the new rules from January 2027; 100,000 to 200,000 could lose coverage; $718 million to $1.4 billion a year in federal funds at the upper estimate.");
const kffMarketplace = reporting("KFF State Health Facts · marketplace plan selections by state, 2014–2026 (CMS open-enrollment files)",
  "https://www.kff.org/affordable-care-act/state-indicator/marketplace-enrollment/", "2026 open enrollment; reviewed September 22, 2026",
  "Oregon: 139,688 plan selections for 2025 and 118,372 for 2026, the first year without the enhanced credits.");
const scotusTariffs = reporting("Wikipedia · Learning Resources, Inc. v. Trump (decision and the tariffs that followed)", "https://en.wikipedia.org/wiki/Learning_Resources,_Inc._v._Trump", "Decided February 20, 2026; reviewed September 22, 2026",
  "6–3: the International Emergency Economic Powers Act does not authorize tariffs. IEEPA tariffs ended February 24; a 10% Section 122 surcharge ran to July 24, 2026; Section 301 duties of 10–12.5% on about 60 countries followed.");
const aicSecureAmerica = reporting("American Immigration Council · What’s in the Secure America Act?", "https://www.americanimmigrationcouncil.org/fact-sheet/whats-in-the-secure-america-act/", "June 10, 2026; reviewed September 22, 2026",
  "$69.5 billion through September 30, 2029: $38.5 billion for ICE (about four times its 2025 budget), $26 billion for CBP, $5 billion for DHS.");
const dhsShutdown = reporting("Wikipedia · 2026 United States federal government shutdowns", "https://en.wikipedia.org/wiki/2026_United_States_federal_government_shutdowns", "Reviewed September 22, 2026",
  "A four-day lapse January 31–February 3, 2026, then a 76-day lapse in Homeland Security funding February 14–April 30, 2026, over immigration-enforcement rules.");
const portlandTroops = record("City of Portland · Portland and federal troops", "https://www.portland.gov/federal/federal-troops", "Reviewed September 22, 2026",
  "Judge Immergut permanently blocked the Portland deployment on November 7, 2025; the president announced troop withdrawals from Portland and other cities December 31, 2025.");
const rollCallIran = reporting("Roll Call · Congress splits on two war powers resolution votes", "https://rollcall.com/2026/07/23/23warpowersvote/", "July 23, 2026; reviewed September 22, 2026",
  "House adopted H.Con.Res. 89 214–208; a binding S.J.Res. 180 failed 47–49. The president notified Congress July 10 that fighting had resumed.");
const fofaWiki = reporting("Wikipedia · Fix Our Forests Act (provisions and status)", "https://en.wikipedia.org/wiki/Fix_Our_Forests_Act", "Reviewed September 22, 2026",
  "Raises the categorical exclusion for fireshed projects to 10,000 acres and sets a 120-day limit on lawsuits (150 in the Senate bill); no Senate floor vote as of the page’s July 2026 update.");
const roadAct = record("GovTrack · H.R. 6644, the 21st Century ROAD to Housing Act (status and CRS summary)", "https://www.govtrack.us/congress/bills/119/hr6644", "Enacted July 11, 2026; reviewed September 22, 2026",
  "Public Law 119-101. Permitting and NEPA changes for housing, a permanent Rental Assistance Demonstration with a 555,000-unit cap, HOME conversions of vacant buildings (FY2027–31); it authorizes programs but appropriates no money.");
const dcOrder = record("White House · Executive Order 14318, Accelerating Federal Permitting of Data Center Infrastructure", "https://www.whitehouse.gov/presidential-actions/2025/07/accelerating-federal-permitting-of-data-center-infrastructure/", "July 23, 2025; reviewed September 22, 2026",
  "Expedited reviews, categorical exclusions, federal and military land, and loans, grants and tax incentives for AI data centers over 100 megawatts or $500 million.");
const jprDataCenters = reporting("Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land", "https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further", "September 9, 2026; reviewed September 22, 2026",
  "An estimated 144 data centers in Oregon; at least $450 million in property tax breaks this year; state-land deals paused through July 1, 2027.");
const ibrCost = record("Interstate Bridge Replacement Program · Cost estimate and funding", "https://interstatebridge.org/CostEstimate", "2026 estimate; reviewed September 22, 2026",
  "$14.4 billion likely corridor cost; $7.09 billion first phase; $5.7 billion committed including $2.1 billion in federal grants and $650 million of Washington’s federal money; $1 billion FTA Capital Investment Grant still sought; tolling as early as 2028.");
const ballotpediaResults = (district: number, note: string): Evidence => reporting(
  `Ballotpedia · Oregon’s ${district}${district === 1 ? "st" : district === 2 ? "nd" : district === 3 ? "rd" : "th"} Congressional District (certified 2024 results)`,
  `https://ballotpedia.org/Oregon%27s_${district}${district === 1 ? "st" : district === 2 ? "nd" : district === 3 ? "rd" : "th"}_Congressional_District`,
  "Reviewed September 22, 2026", note);

/* ── Topics: the choices Congress faces this term, shared by all seven races ── */

const federalTopics: ExtraTopic[] = [
  {
    id: "fed-hr1-medicaid",
    label: "Medicaid and SNAP cuts",
    short: "H.R. 1",
    question: "Keep H.R. 1’s Medicaid work rules, six-month renewals and SNAP cuts, or repeal them?",
    context:
      "H.R. 1, signed July 4, 2025, requires adults 19–64 on the Oregon Health Plan to show 80 hours a month of work, school or volunteering from 2027 and to renew every six months. The Oregon Health Authority expects to check about 600,000 adults, says 100,000 to 200,000 could lose coverage, and puts the federal funding loss at $718 million to $1.4 billion a year.",
  },
  {
    id: "fed-aca-credits",
    label: "ACA premium credits",
    short: "ACA credits",
    question: "Restore the enhanced Affordable Care Act premium tax credits that expired December 31, 2025?",
    context:
      "The House passed a three-year restoration (H.R. 1834) 230–196 on January 8, 2026; the Senate has not taken it up, after a 51–48 cloture vote on the Democrats’ S. 3385 failed on December 11, 2025. Oregon marketplace plan selections fell from 139,688 for 2025 to 118,372 for 2026, the first year without the enhanced credits.",
  },
  {
    id: "fed-tariffs",
    label: "Tariffs",
    short: "Tariffs",
    question: "End the tariffs and take tariff power back from the president?",
    context:
      "The Supreme Court held 6–3 on February 20, 2026 that the emergency-powers law does not authorize tariffs; the administration ended those tariffs February 24, ran a 10% surcharge to July 24, then set 10–12.5% duties on about 60 countries. The House voted 219–211 on February 11, 2026 to end the Canada tariff emergency; the Senate voted 51–47 on October 30, 2025 to end the global one.",
  },
  {
    id: "fed-ice-funding",
    label: "ICE and border money",
    short: "ICE funding",
    question: "Fund the $70 billion expansion of ICE and Border Patrol through 2029 (the Secure America Act)?",
    context:
      "The Secure America Act, signed June 10, 2026, adds $38.5 billion for ICE and $26 billion for Customs and Border Protection through September 2029, on top of H.R. 1’s 2025 money; it passed 52–47 and 214–212. It followed a 76-day lapse in Homeland Security funding (February 14–April 30, 2026) over enforcement rules, and a judge’s November 7, 2025 order blocking federal troops in Portland.",
  },
  {
    id: "fed-iran-war",
    label: "Iran war powers",
    short: "Iran war",
    question: "Direct the president to end U.S. military involvement in the war with Iran?",
    context:
      "U.S. strikes on Iran began February 28, 2026. Both chambers adopted H.Con.Res. 86 directing withdrawal (House 215–208 on June 3; Senate 50–48 on June 23). After the president told Congress on July 10 that fighting had resumed, the House passed H.Con.Res. 89 214–208 on July 23 and a binding Senate resolution failed 47–49 the same day.",
  },
  {
    id: "fed-fix-our-forests",
    label: "Fix Our Forests Act",
    short: "Forests",
    question: "Pass the Fix Our Forests Act: faster thinning and logging on federal forests with shorter windows to sue?",
    context:
      "H.R. 471 passed the House 279–141 on January 23, 2025; it lets fireshed projects up to 10,000 acres skip full environmental review and gives challengers 120 days to sue. The Senate Agriculture Committee advanced S. 1462 18–5 in October 2025, but the full Senate has not voted. The administration separately repealed the 2001 Roadless Rule in August 2026, covering 58.5 million acres.",
  },
  {
    id: "fed-housing-aid",
    label: "Federal housing programs",
    short: "Housing aid",
    question: "Expand the federal role in housing, from the new ROAD to Housing law to more vouchers and tax credits?",
    context:
      "The 21st Century ROAD to Housing Act became law July 11, 2026 (Public Law 119-101) after votes of 358–32 and 85–5; it changes permitting and environmental review, makes the voucher-conversion program permanent and authorizes new grants, but money still depends on the annual HUD budget, now on a stopgap through December 11, 2026. Oregon permitted 14,839 homes in 2025 against a state target of 29,359.",
  },
  {
    id: "fed-data-centers",
    label: "Data-center costs",
    short: "Data centers",
    question: "Should federal policy rein in data centers’ power, water and cost impacts, or keep fast-tracking them?",
    context:
      "Executive Order 14318 (July 23, 2025) fast-tracks federal permits, land and financing for AI data centers over 100 megawatts. Oregon has an estimated 144 data centers receiving at least $450 million in property tax breaks this year,, and the governor paused data-center deals on state land through July 1, 2027 while a state advisory committee writes recommendations for the 2027 session.",
  },
];

topics.push({
  raceIds: ["oregon-us-senate", "oregon-house-1", "oregon-house-2", "oregon-house-3", "oregon-house-4", "oregon-house-5", "oregon-house-6"],
  topics: federalTopics,
});

/* ── Topic stances: explicit, sourced, never inferred; alphabetical within each race ── */

/* The incumbents' package votes read the same way on every board: a vote on the whole bill. */
const HR1_HOUSE_NO = "Voted no on final House passage of H.R. 1 on July 3, 2025 (218–214), a vote on the whole package, including the Medicaid work rules, six-month renewals and SNAP cuts.";
const ACA_HOUSE_YES = "Voted yes on January 8, 2026 on H.R. 1834, a three-year restoration of the enhanced premium tax credits; it passed 230–196 and awaits the Senate.";
const TARIFF_HOUSE_YES = "Voted yes on February 11, 2026 on H.J.Res. 72 to end the national emergency behind the Canada tariffs; it passed 219–211.";
const ICE_HOUSE_NO = "Voted no on June 9, 2026 on the Secure America Act’s $70 billion for ICE and Border Patrol through 2029; it passed 214–212.";
const IRAN_HOUSE_YES = "Voted yes on July 23, 2026 on H.Con.Res. 89 directing the president to remove U.S. forces from hostilities with Iran (214–208), as on June 3.";
const FOFA_HOUSE_NO = "Voted no on January 23, 2025 on the Fix Our Forests Act (H.R. 471), which passed 279–141.";
const FOFA_HOUSE_YES = "Voted yes on January 23, 2025 on the Fix Our Forests Act (H.R. 471), which passed 279–141.";
const ROAD_HOUSE_YES = "Voted yes on June 23, 2026 on final passage of the 21st Century ROAD to Housing Act (358–32), now Public Law 119-101.";

topicStances.push(
  /* ── U.S. Senate ── */
  stance("david-brock-smith", "fed-fix-our-forests", "partial", "Active forest management",
    "Says he has led and will keep leading on active forest management, fuel reduction and landowner partnerships; he does not say whether he would vote for the Fix Our Forests Act.", dbsIssues),
  stance("david-brock-smith", "fed-data-centers", "supports", "Data centers pay costs",
    "Would ensure data centers are accountable, protect natural resources and prevent their costs from being shifted onto Oregon households, citing strain on water, farmland and energy costs.", dbsStatement),
  stance("chris-henry", "fed-hr1-medicaid", "partial", "End billionaire tax breaks",
    "Would end what he calls amazing tax breaks for billionaires, saying 40% of the latest Trump tax breaks go to the top 1%; he does not address H.R. 1’s Medicaid or SNAP changes.", henryStatement),
  stance("chris-henry", "fed-aca-credits", "partial", "Medicare for All",
    "Backs Medicare for All, noting over 30 million Americans have no insurance; he does not say whether he would restore the expired premium tax credits in the meantime.", henryStatement),
  stance("chris-henry", "fed-tariffs", "supports", "Stop ludicrous tariffs",
    "Would stop what he calls ludicrous tariffs and the free-trade deals that let corporations override labor, consumer and environmental protections.", henryStatement),
  stance("chris-henry", "fed-iran-war", "partial", "End pointless wars",
    "Calls for ending pointless wars and cutting a military he says takes 50% of discretionary spending, and would tax oil companies’ excess profits from the Iran war; he does not address the war-powers resolutions.", henryStatement),
  stance("jeff-merkley", "fed-hr1-medicaid", "opposes", "Voted no",
    "Voted no on passage of H.R. 1 on July 1, 2025 (50–50, tie broken by the vice president), a vote on the whole package, including the Medicaid work rules and SNAP cuts.", hr1Senate),
  stance("jeff-merkley", "fed-aca-credits", "supports", "Voted to extend",
    "Voted yes on December 11, 2025 to advance S. 3385, a three-year extension of the enhanced premium tax credits; cloture failed 51–48.", acaSenate),
  stance("jeff-merkley", "fed-tariffs", "supports", "Voted to end tariffs",
    "Voted yes on October 30, 2025 on S.J.Res. 88 to end the national emergency behind the global tariffs; it passed 51–47.", tariffSenate),
  stance("jeff-merkley", "fed-ice-funding", "opposes", "Voted no",
    "Voted no on June 5, 2026 on the Secure America Act’s $70 billion for ICE and Border Patrol through 2029; it passed 52–47.", iceSenate),
  stance("jeff-merkley", "fed-iran-war", "supports", "Voted to end involvement",
    "Voted yes on June 23, 2026 on H.Con.Res. 86 directing the president to remove U.S. forces from hostilities with Iran; it was agreed to 50–48.", iranSenate),
  stance("jeff-merkley", "fed-fix-our-forests", "partial", "Biomass markets bill",
    "Introduced the Wildfire Reduction Market Expansion Act with Rep. Bentz on July 22, 2026, paying for hazardous-fuel removal through the Renewable Fuel Standard; the Senate has not voted on the Fix Our Forests Act.", merkleyBiomass),
  stance("jeff-merkley", "fed-housing-aid", "supports", "Voted for ROAD Act",
    "Voted yes on June 22, 2026 to concur, with a further amendment, in the House changes to the 21st Century ROAD to Housing Act (85–5); it became law July 11, 2026.", housingSenate),
  stance("jeff-merkley", "fed-data-centers", "partial", "Asked state to weigh",
    "With Sen. Wyden, asked Oregon’s data center advisory committee on July 2, 2026 to weigh rising electricity costs, water use, farmland rezoning and tribal rights alongside data centers’ benefits; the letter proposes no federal action.", merkleyDataCenters),

  /* ── District 1 ── */
  stance("barbara-j-kahl", "fed-hr1-medicaid", "partial", "Spending constraints",
    "Wants real spending constraints, cuts to redundant federal offices and removal from benefits of people who do not qualify; she does not say whether she would keep or repeal H.R. 1’s Medicaid and SNAP changes.", kahlSurvey),
    // Not a stance: general stewardship language that names no bill; left as a gap.
  stance("barbara-j-kahl", "fed-housing-aid", "partial", "Federal buyer incentives",
    "Would use federal incentives to reduce financing barriers for first-time buyers and working families and streamline permitting; she does not address vouchers or the housing tax credit.", kahlHome),
  stance("suzanne-bonamici", "fed-hr1-medicaid", "opposes", "Voted no", HR1_HOUSE_NO, hr1House),
  stance("suzanne-bonamici", "fed-aca-credits", "supports", "Voted to restore", ACA_HOUSE_YES, acaHouse),
  stance("suzanne-bonamici", "fed-tariffs", "supports", "Voted: end Canada tariffs", TARIFF_HOUSE_YES, tariffHouse),
  stance("suzanne-bonamici", "fed-ice-funding", "opposes", "Voted no", ICE_HOUSE_NO, iceHouse),
  stance("suzanne-bonamici", "fed-iran-war", "supports", "Voted to end involvement", IRAN_HOUSE_YES, iranHouse),
  stance("suzanne-bonamici", "fed-fix-our-forests", "opposes", "Voted no", FOFA_HOUSE_NO, fofaHouse),
  stance("suzanne-bonamici", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),
  stance("suzanne-bonamici", "fed-data-centers", "supports", "No cost-shifting",
    "Says data centers should not be able to raise costs or exploit Oregon’s natural resources for profit, and will keep fighting for clean, renewable energy; she names no federal bill.", bonamiciStatement),

  /* ── District 2 ── */
  stance("chris-beck", "fed-hr1-medicaid", "opposes", "Repeal H.R. 1",
    "Would repeal H.R. 1 to restore what he calls the mountain of funding it stripped from Medicaid and SNAP, saying Medicaid covers nearly 40% of District 2 residents and 55% of its children.", beckIssues),
  stance("chris-beck", "fed-aca-credits", "partial", "Premiums skyrocketing",
    "Says premiums for everybody with Marketplace plans have skyrocketed and would expand rural health-care access; he does not say whether he would restore the expired enhanced premium tax credits.", beckIssues),
  stance("chris-beck", "fed-tariffs", "supports", "End the tariffs",
    "Would repeal the tariffs, which he says cost rural Oregon wheat and fruit markets abroad, and seek a sensible, bipartisan approach to legal immigration.", beckIssues),
  stance("chris-beck", "fed-iran-war", "supports", "End the Iran war",
    "Would end the Iran war, counting 18 American lives lost, 600-plus wounded and more than $100 billion spent, and blames it for high gas and diesel prices; he does not name the war-powers resolutions.", beckIssues),
  stance("chris-beck", "fed-fix-our-forests", "partial", "Restore Forest Service cuts",
    "Would reverse what he calls the 40% cut to Forest Service wildfire prevention and restore the thousands of staff lost in 2025; he does not say whether he would vote for the Fix Our Forests Act.", beckIssues),
  stance("chris-beck", "fed-housing-aid", "partial", "Rural housing programs",
    "Would steer USDA rural housing and Community Facilities lending toward Main Street districts and fund low-interest loans for first-time rural buyers by trimming vacation-home tax breaks; vouchers and the housing tax credit go unmentioned.", beckIssues),
  stance("chris-beck", "fed-data-centers", "supports", "Pause new data centers",
    "Lists pausing new data-center construction among the things he will fight for in Congress.", beckStatement),
  stance("cliff-bentz", "fed-hr1-medicaid", "supports", "Voted yes",
    "Voted yes on final House passage of H.R. 1 on July 3, 2025 (218–214), a vote on the whole package, including the Medicaid work rules, six-month renewals and SNAP cuts.", hr1House),
  stance("cliff-bentz", "fed-aca-credits", "opposes", "Voted no",
    "Voted no on January 8, 2026 on H.R. 1834, the three-year restoration of the enhanced premium tax credits, which passed 230–196.", acaHouse),
  stance("cliff-bentz", "fed-tariffs", "opposes", "Voted: keep Canada tariffs",
    "Voted no on February 11, 2026 on H.J.Res. 72 to end the national emergency behind the Canada tariffs; it passed the House 219–211.", tariffHouse),
  stance("cliff-bentz", "fed-ice-funding", "supports", "Voted yes",
    "Voted yes on June 9, 2026 on the Secure America Act’s $70 billion for ICE and Border Patrol through 2029; it passed 214–212.", iceHouse),
  stance("cliff-bentz", "fed-iran-war", "opposes", "Voted no",
    "Voted no on July 23, 2026 on H.Con.Res. 89 directing the president to remove U.S. forces from hostilities with Iran (214–208), as on June 3.", iranHouse),
  stance("cliff-bentz", "fed-fix-our-forests", "supports", "Voted yes", FOFA_HOUSE_YES, fofaHouse),
  stance("cliff-bentz", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),
);

topicStances.push(
  /* ── District 3 ── */
  stance("maxine-e-dexter", "fed-hr1-medicaid", "opposes", "Voted no", HR1_HOUSE_NO, hr1House),
  stance("maxine-e-dexter", "fed-aca-credits", "supports", "Voted to restore", ACA_HOUSE_YES, acaHouse),
  stance("maxine-e-dexter", "fed-tariffs", "supports", "Voted: end Canada tariffs", TARIFF_HOUSE_YES, tariffHouse),
  stance("maxine-e-dexter", "fed-ice-funding", "opposes", "Voted no", ICE_HOUSE_NO, iceHouse),
  stance("maxine-e-dexter", "fed-iran-war", "supports", "Voted to end involvement", IRAN_HOUSE_YES, iranHouse),
  stance("maxine-e-dexter", "fed-fix-our-forests", "opposes", "Voted no", FOFA_HOUSE_NO, fofaHouse),
  stance("maxine-e-dexter", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),

  /* ── District 4 ── */
  stance("monique-despain", "fed-ice-funding", "partial", "Fund border security",
    "Would fund an all-of-the-above border toolkit of barriers, sensors and drones and remove noncitizens who commit serious crimes, with a one-time earned path for long-settled residents; she does not address the $70 billion ICE package.", despainIssues),
  stance("monique-despain", "fed-fix-our-forests", "supports", "Supported from the start",
    "Says she supported the Fix Our Forests Act from the beginning and has filed public comment backing rescission of the 2001 Roadless Rule; wants thinning, salvage harvests and rapid fire suppression.", despainIssues),
  stance("monique-despain", "fed-housing-aid", "partial", "Lift federal restrictions",
    "Would have the federal government lift housing restrictions and encourage workforce housing, ending excessive permitting costs and outdated land-use rules she says stifle construction; she does not address vouchers or tax credits.", despainIssues),
  stance("justin-filip", "fed-aca-credits", "partial", "Medicare for All",
    "Would implement a national improved Medicare for All program guaranteeing universal access; he does not say whether he would restore the expired premium tax credits in the meantime.", filipPlatform),
  stance("justin-filip", "fed-tariffs", "partial", "Fair trade agreements",
    "Would establish global fair-trade agreements to protect workers and communities; he does not say whether the current tariffs should end.", filipPlatform),
  stance("justin-filip", "fed-ice-funding", "opposes", "Abolish ICE",
    "Would abolish ICE and replace it with an Office of Citizenship, Refugees and Immigration Services, with amnesty and a path to citizenship.", filipPlatform),
    // Not a stance: a military-spending goal that names neither the war nor the resolutions; left as a gap.
  stance("justin-filip", "fed-fix-our-forests", "opposes", "Faults Hoyle’s yes vote",
    "Faults Rep. Hoyle’s yes vote on the Fix Our Forests Act, against the advice of more than 80 environmental groups, and quotes Earthjustice calling it a trojan horse for gutting bedrock environmental laws.", filipHome),
  stance("justin-filip", "fed-housing-aid", "partial", "Federal housing dollars",
    "Wants federal dollars brought back to the district for the housing and unhoused crisis; he does not address the ROAD Act, vouchers or tax credits.", filipMeet),
  stance("justin-filip", "fed-data-centers", "supports", "Ban private data centers",
    "Would ban privately built data centers, saying they strain the grid, drive up rates and consume massive amounts of water, and calls for public ownership of such infrastructure.", filipHome),
  stance("val-hoyle", "fed-hr1-medicaid", "opposes", "Voted no", HR1_HOUSE_NO, hr1House),
  stance("val-hoyle", "fed-aca-credits", "supports", "Voted to restore", ACA_HOUSE_YES, acaHouse),
  stance("val-hoyle", "fed-tariffs", "supports", "Voted: end Canada tariffs", TARIFF_HOUSE_YES, tariffHouse),
  stance("val-hoyle", "fed-ice-funding", "opposes", "Voted no", ICE_HOUSE_NO, iceHouse),
  stance("val-hoyle", "fed-iran-war", "supports", "Voted to end involvement", IRAN_HOUSE_YES, iranHouse),
  stance("val-hoyle", "fed-fix-our-forests", "supports", "Voted yes", FOFA_HOUSE_YES, fofaHouse),
  stance("val-hoyle", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),

  /* ── District 5 ── */
  stance("patti-adair", "fed-hr1-medicaid", "partial", "Keep tips, overtime breaks",
    "Would make no tax on tips, overtime and Social Security permanent and raise the child tax credit; she faults Bynum for voting against SNAP funding but does not address H.R. 1’s Medicaid or SNAP changes.", adairStatement),
  stance("patti-adair", "fed-ice-funding", "partial", "Backed funding compromise",
    "Criticized Rep. Bynum’s February 3, 2026 vote against a bipartisan funding package that included a short Homeland Security extension; she has not said whether she would fund the $70 billion ICE expansion.", adairShutdown),
  stance("patti-adair", "fed-data-centers", "partial", "Data-center disclosure",
    "Would propose legislation requiring Big Tech to be transparent about data centers’ impacts on air quality, water quality and electricity costs; she does not say whether to limit or fast-track them.", adairStatement),
  stance("janelle-s-bynum", "fed-hr1-medicaid", "opposes", "Voted no", HR1_HOUSE_NO, hr1House),
  stance("janelle-s-bynum", "fed-aca-credits", "supports", "Voted to restore", ACA_HOUSE_YES, acaHouse),
  stance("janelle-s-bynum", "fed-tariffs", "supports", "Voted: end Canada tariffs", TARIFF_HOUSE_YES, tariffHouse),
  stance("janelle-s-bynum", "fed-ice-funding", "opposes", "Voted no", ICE_HOUSE_NO, iceHouse),
  stance("janelle-s-bynum", "fed-iran-war", "supports", "Voted to end involvement", IRAN_HOUSE_YES, iranHouse),
  stance("janelle-s-bynum", "fed-fix-our-forests", "supports", "Voted yes", FOFA_HOUSE_YES, fofaHouse),
  stance("janelle-s-bynum", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),
  stance("janelle-s-bynum", "fed-data-centers", "partial", "Study bill drivers",
    "Introduced the BILL Drivers Act on July 9, 2026 to have the Energy Information Administration report what is driving electricity bills, including data centers; it takes no position on fast-tracking or who pays.", bynumBillDrivers),
  stance("andrea-townsend", "fed-iran-war", "partial", "End war spending",
    "Would end war and redirect resources toward human and ecological needs; her questionnaire does not name the Iran war or the war-powers resolutions.", townsendQuestionnaire),
  stance("andrea-townsend", "fed-housing-aid", "partial", "Social housing",
    "Would address the housing crisis through deeply affordable social housing and tenant protections; she does not address the ROAD Act, vouchers or tax credits.", townsendQuestionnaire),

  /* ── District 6 ── */
  // From his emailed reply of September 24, 2026; ICE funding and Fix Our Forests replace partial readings.
  stance("david-russ", "fed-ice-funding", "partial", "Fund enforcement",
    "Fully supports giving federal law enforcement sufficient funding to do its job efficiently and says the border is currently secured; he does not say whether the $70 billion package is that amount.", russEmail),
  stance("david-russ", "fed-fix-our-forests", "mixed", "Stopgap only",
    "Calls the Fix Our Forests Act “OK” but a bureaucratic maze; would support it only as a stopgap, saying the states could run the same program for less after federal lands are returned.", russEmail),
  stance("david-russ", "fed-hr1-medicaid", "supports", "Keep the rules",
    "Would keep H.R. 1’s Medicaid and SNAP rules as long as the federal government is involved.", russEmail),
  stance("david-russ", "fed-aca-credits", "opposes", "Unwind the ACA",
    "Says the Affordable Care Act has damaged affordability and is federal overreach; would support another option while it is unwound rather than restoring the credits.", russEmail),
  stance("david-russ", "fed-tariffs", "opposes", "Keep tariffs",
    "Does not support ending the tariffs, noting the country funded itself largely through tariffs before the 1913 income tax.", russEmail),
  stance("david-russ", "fed-iran-war", "partial", "Defers to briefings",
    "Says only people in the highest-level national-security meetings can make this call and he has not been in one; he does not say whether to end U.S. involvement.", russEmail),
  stance("david-russ", "fed-housing-aid", "opposes", "Leave it to states",
    "Says current federal involvement in housing already violates the 10th Amendment; states that want such programs should run them.", russEmail),
  stance("david-russ", "fed-data-centers", "opposes", "Local deals, not federal",
    "Opposes federal involvement, saying lobbying would tilt deals toward data centers; local officials should negotiate terms, as he says some cities have done to secure benefits such as free power.", russEmail),
  stance("andrea-salinas", "fed-hr1-medicaid", "opposes", "Voted no", HR1_HOUSE_NO, hr1House),
  stance("andrea-salinas", "fed-aca-credits", "supports", "Voted to restore", ACA_HOUSE_YES, acaHouse),
  stance("andrea-salinas", "fed-tariffs", "supports", "Voted: end Canada tariffs", TARIFF_HOUSE_YES, tariffHouse),
  stance("andrea-salinas", "fed-ice-funding", "opposes", "Voted no", ICE_HOUSE_NO, iceHouse),
  stance("andrea-salinas", "fed-iran-war", "supports", "Voted to end involvement", IRAN_HOUSE_YES, iranHouse),
  stance("andrea-salinas", "fed-fix-our-forests", "opposes", "Voted no", FOFA_HOUSE_NO, fofaHouse),
  stance("andrea-salinas", "fed-housing-aid", "supports", "Voted for ROAD Act", ROAD_HOUSE_YES, housingHouse),
  stance("andrea-salinas", "fed-data-centers", "partial", "Public infrastructure first",
    "Says she prioritized public infrastructure over corporate-owned data centers; her statement does not say what federal rule or funding choice that involved.", salinasStatement),
);

/* ── Stakes: what Congress decides this term, in sourced facts ─────────── */

type StakeItem = RaceStakes["items"][number];
const medicaidItem: StakeItem = {
  label: "Medicaid work rules",
  text: "H.R. 1’s work-or-activity rules for adults 19–64 on the Oregon Health Plan start in 2027, with renewals every six months. OHA expects to check about 600,000 adults, says 100,000 to 200,000 could lose coverage, and puts the federal funding loss at $718 million to $1.4 billion a year.",
  source: opbOhp,
};
const acaItem: StakeItem = {
  label: "ACA premium credits",
  text: "The enhanced premium tax credits expired December 31, 2025; the House-passed three-year restoration (230–196 on January 8, 2026) awaits the Senate. Oregon marketplace plan selections fell from 139,688 for 2025 to 118,372 for 2026.",
  source: kffMarketplace,
};
const fundingItem: StakeItem = {
  label: "December 11 deadline",
  text: "The stopgap signed September 2, 2026 funds the government only through December 11 (House 370–48, Senate 90–6). The full-year 2027 bills for HUD, the Forest Service and Homeland Security, and any shutdown, fall to the members elected in November.",
  source: crHouse,
};
const iceItem: StakeItem = {
  label: "ICE expansion",
  text: "The Secure America Act, signed June 10, 2026, gives ICE $38.5 billion and Customs and Border Protection $26 billion through September 2029, without the detention and oversight conditions carried in annual spending bills. It followed a 76-day lapse in Homeland Security funding over enforcement rules.",
  source: aicSecureAmerica,
};
const iranItem: StakeItem = {
  label: "Iran war",
  text: "U.S. strikes on Iran began February 28, 2026. Both chambers adopted a withdrawal resolution in June; the president told Congress on July 10 that fighting had resumed, the House passed a second resolution 214–208 on July 23, and a binding Senate measure failed 47–49. Any authorization or funding vote comes to the next Congress.",
  source: rollCallIran,
};
const tariffItem: StakeItem = {
  label: "Tariff power",
  text: "The Supreme Court ruled 6–3 on February 20, 2026 that the emergency-powers law does not authorize tariffs. The administration ran a 10% surcharge to July 24 and then set 10–12.5% duties on about 60 countries under trade law; Congress can end, extend or rewrite those tariffs itself.",
  source: scotusTariffs,
};
const forestsItem: StakeItem = {
  label: "Fix Our Forests Act",
  text: "The bill passed the House 279–141 in January 2025 and a Senate committee 18–5 in October 2025 but has had no Senate floor vote; it would let 10,000-acre fireshed projects skip full review and give challengers 120 days to sue. The 2001 Roadless Rule was repealed in August 2026.",
  source: fofaWiki,
};
const housingItem: StakeItem = {
  label: "Housing law to fund",
  text: "The 21st Century ROAD to Housing Act (Public Law 119-101, July 11, 2026) rewrites permitting and environmental-review rules, makes the voucher-conversion program permanent with a 555,000-unit cap and authorizes new grants, but appropriates no money; the next Congress decides what it funds.",
  source: roadAct,
};
const dataCenterItem: StakeItem = {
  label: "Data centers",
  text: "Oregon has an estimated 144 data centers receiving at least $450 million in property tax breaks this year. The governor paused data-center deals on state land through July 1, 2027, while federal policy since July 2025 fast-tracks permits and financing for large AI data centers.",
  source: jprDataCenters,
};
const bridgeItem: StakeItem = {
  label: "Interstate Bridge",
  text: "The 2026 estimate puts the I-5 corridor at $14.4 billion and the first phase at $7.09 billion, with $5.7 billion committed, including $2.1 billion in federal grants. The program still seeks a $1 billion federal transit grant, and tolling could start in 2028.",
  source: ibrCost,
};
const portlandItem: StakeItem = {
  label: "Federal troops in Portland",
  text: "A federal judge permanently blocked the National Guard deployment to Portland on November 7, 2025, and the president announced withdrawals December 31. The South Portland ICE facility was the focus of protests from September 2025; the city says it plays no role in immigration enforcement.",
  source: portlandTroops,
};
const HOUSE_ROLE = "A representative votes on federal taxes, spending, war powers and every bill the House takes up, and the two-year term puts the winner in the Congress that faces the December 11 funding deadline and the 2027 budget.";

stakes.push(
  {
    raceId: "oregon-us-senate",
    intro:
      "A senator votes on every federal law, budget and treaty, confirms judges and cabinet officers, and under the Senate’s 60-vote rules can hold or move bills the House has passed. The seat is statewide for a six-year term running to January 2033. The next Senate decides whether the House-passed premium-credit restoration, the Fix Our Forests Act and any Iran authorization get a vote, and writes the 2027 spending bills after the December 11 stopgap runs out.",
    items: [medicaidItem, acaItem, fundingItem, iceItem, iranItem, tariffItem, forestsItem, dataCenterItem],
  },
  {
    raceId: "oregon-house-1",
    intro:
      `${HOUSE_ROLE} District 1 covers Clatsop, Columbia, Tillamook and Washington counties and northwest Portland, including Hillsboro’s data-center corridor and the Oregon side of the Interstate Bridge’s I-5 traffic. The seat was decided 68.6% to 28.1% in 2024.`,
    items: [medicaidItem, acaItem, fundingItem, iceItem, portlandItem, tariffItem, bridgeItem, dataCenterItem],
  },
  {
    raceId: "oregon-house-2",
    intro:
      `${HOUSE_ROLE} District 2 is eastern Oregon and the southern Cascades, from Medford, Grants Pass and Klamath Falls to Pendleton, Hermiston, Ontario and Baker City, the state’s most federal-forest-dependent and Medicaid-dependent district. The seat was decided 63.9% to 32.8% in 2024.`,
    items: [medicaidItem, acaItem, fundingItem, forestsItem, tariffItem, iranItem, iceItem, dataCenterItem],
  },
  {
    raceId: "oregon-house-3",
    intro:
      `${HOUSE_ROLE} District 3 is Portland east of the Willamette, Gresham, Troutdale and Fairview, Hood River County and part of Clackamas County, and it holds the South Portland ICE facility. The open seat was decided 67.7% to 25.2% in 2024.`,
    items: [medicaidItem, acaItem, fundingItem, iceItem, portlandItem, iranItem, tariffItem, bridgeItem],
  },
  {
    raceId: "oregon-house-4",
    intro:
      `${HOUSE_ROLE} District 4 is the south coast and southern Willamette Valley: Eugene, Springfield, Corvallis, Roseburg, Coos Bay, Florence and Newport, with federal forests and O&C lands across its southern counties. The seat was decided 51.7% to 43.9% in 2024, with 2.7% to a third candidate.`,
    items: [medicaidItem, acaItem, fundingItem, forestsItem, iceItem, iranItem, tariffItem, housingItem],
  },
  {
    raceId: "oregon-house-5",
    intro:
      `${HOUSE_ROLE} District 5 runs from the Clackamas County suburbs and part of southeast Portland over the Cascades to Bend and Redmond, with parts of Marion and Linn counties along I-5. The seat was decided 47.7% to 45.0% in 2024, with 7.2% split among three other candidates.`,
    items: [medicaidItem, acaItem, fundingItem, iceItem, iranItem, forestsItem, tariffItem, dataCenterItem],
  },
  {
    raceId: "oregon-house-6",
    intro:
      `${HOUSE_ROLE} District 6 is Salem and Keizer, Yamhill and Polk counties, Tigard and Tualatin, and part of Marion County including Woodburn, a district of farms, nurseries and state workers. The seat was decided 53.3% to 46.5% in 2024.`,
    items: [medicaidItem, acaItem, fundingItem, iceItem, iranItem, tariffItem, housingItem, forestsItem],
  },
);
