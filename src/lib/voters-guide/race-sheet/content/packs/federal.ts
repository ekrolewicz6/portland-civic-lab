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
  type IssueLine,
  type MissingState,
  type PrimaryStatement,
  type RacePack,
  type RoleOverride,
  type StanceChip,
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
  ...emptyPack(), analysis, lines, chips, deliveries, ownWords: ownWordsEntries, contacts, roles, primary, ballots, districts, choice, portraits, missing, profiles,
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
    climate: { position: "Would rapidly shift from fossil fuels to cheaper renewables, toward 100% clean energy with a Green New Deal that creates jobs in front-line communities.", source: merkleyStatement },
  },
  sources: [merkleyStatement, merkleyIssues],
};
analysis["david-brock-smith"] = {
  values: ["Spending restraint", "Enforcement with treatment"],
  tradeoff: "No new taxes plus more treatment capacity and forest work means paying through cuts or growth the reviewed materials do not itemize; camping enforcement is mostly local and state authority, not the Senate's.",
  issues: {
    safety: { position: "Wants drug and mental-health treatment paired with accountability, an end to permanent street camping, and support for law enforcement with consequences for repeat offenders.", source: dbsStatement },
    money: { position: "Wants no new taxes, more support for local businesses, elimination of fraud and less unnecessary government spending; cites fighting the state gas tax and stopping tax hikes.", source: dbsStatement },
    climate: { position: "Would hold data centers accountable for water, farmland and energy costs so those costs are not shifted onto households, and push active forest management, fuel reduction and landowner partnerships to cut wildfire risk.", source: dbsStatement },
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
  line("david-brock-smith", "climate", "Would keep data-center costs off households and expand forest fuel reduction against wildfire."),
  line("chris-henry", "money", "Would end billionaire tax breaks, tax oil windfalls, triple the federal minimum wage."),
  line("chris-henry", "climate", "Would expand local wind and solar and create a federal Cascadia earthquake fund."),
  line("jeff-merkley", "housing", "Would ban hedge funds from buying single-family homes."),
  line("jeff-merkley", "safety", "Wants no ICE operations at schools, no warrantless home raids, accountability for violations."),
  line("jeff-merkley", "money", "Wants the rich paying a fair share and an end to drug price gouging."),
  line("jeff-merkley", "climate", "Would rapidly shift from fossil fuels to cheaper renewables, toward 100% clean energy."),
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
  chip("jeff-merkley", "climate", "100% renewable energy"),
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
    safety: { position: "Is leading legislation requiring clear identification of every ICE agent making immigration arrests and limiting when federal law enforcement, the armed forces or the National Guard can be sent into cities; wants humane immigration reform.", source: bonamiciImmigration },
    money: { position: "Would repeal the Trump tax cuts in favor of progressive taxation, raise the federal minimum wage, enforce antitrust laws, end what she calls chaotic tariffs, and fight cuts to SNAP and Medicaid.", source: bonamiciEconomy },
    climate: { position: "Would defend Inflation Reduction Act clean-energy programs and pursue the Select Committee plan for net-zero emissions by mid-century; opposes data centers raising costs or exploiting natural resources.", source: bonamiciClimate },
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
  line("suzanne-bonamici", "safety", "Would require ICE agents to identify themselves and limit federal deployments into cities."),
  line("suzanne-bonamici", "money", "Would repeal Trump-era tax cuts, raise the federal minimum wage, end chaotic tariffs."),
  line("suzanne-bonamici", "climate", "Would defend clean-energy programs and pursue net-zero emissions by mid-century."),
);
chips.push(
  chip("barbara-j-kahl", "housing", "Supply at every price"), chip("barbara-j-kahl", "safety", "Fund local police"),
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
    climate: { position: "Would reverse the 40% cut to Forest Service wildfire prevention, pause new data-center construction, create a rural service corps in each county to restore forests and watersheds, and expand conservation easement programs.", source: beckStatement },
  },
  sources: [beckStatement, beckIssues],
};
analysis["cliff-bentz"] = {
  values: ["Resource use", "Border enforcement"],
  tradeoff: "More timber harvest, water storage and lower taxes with less regulation are a consistent program; the campaign's issue pages carry pandemic-era language, so which commitments are current for 2026 is the open question.",
  issues: {
    safety: { position: "Supports a secure border and stopping illegal immigration by improving border security and completing the wall.", source: bentzBorders },
    money: { position: "Supports lower taxes, reduced regulation and directing investment toward rural Oregon.", source: bentzStatement },
    climate: { position: "Wants more energy generation, reservoir storage, hydropower, retained dams, irrigation water and increased timber harvest; opposes carbon pricing and would reduce fuel loads on federal forests and change the Equal Access to Justice Act.", source: bentzStatement },
  },
  sources: [bentzStatement, bentzBorders, bentzForests],
};
lines.push(
  line("chris-beck", "housing", "Would trim vacation-home tax breaks to fund loans for first-time rural buyers."),
  line("chris-beck", "money", "Would restore Medicaid and food benefits, end tariffs, and balance the federal budget."),
  line("chris-beck", "climate", "Would restore wildfire-prevention funding, pause data centers, create rural forest service corps."),
  line("cliff-bentz", "safety", "Supports a secure border and completing the border wall."),
  line("cliff-bentz", "money", "Supports lower taxes, less regulation and investment directed to rural Oregon."),
  line("cliff-bentz", "climate", "Wants more hydropower, dams kept, more timber harvest; opposes carbon pricing."),
);
chips.push(
  chip("chris-beck", "housing", "Rural first-buyer loans"), chip("chris-beck", "money", "Restore Medicaid funding"), chip("chris-beck", "climate", "Restore wildfire funding"),
  chip("cliff-bentz", "safety", "Complete border wall"), chip("cliff-bentz", "money", "Lower taxes, fewer rules"), chip("cliff-bentz", "climate", "More timber and hydropower"),
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
    safety: { position: "Would abolish ICE, pass the CLEAR ID Act to end anonymous raids, oppose ICE and CBP funding until raids stop and due process is restored, and bring federal money for detox beds and treatment over punishment.", source: dexterImmigration },
    money: { position: "Would close corporate tax loopholes and make billionaires pay more, raise the federal minimum wage to $15 tied to inflation, and pass the PRO Act and nationwide paid leave.", source: dexterEconomy },
    climate: { position: "Would pass a Green New Deal, move to 100% clean electricity nationwide, ban new fossil-fuel infrastructure on public lands and offshore, bury power lines and expand EV charging.", source: dexterClimate },
  },
  sources: [dexterStatement, dexterHousing, dexterEconomy, dexterClimate, dexterImmigration, dexterAddiction],
};
lines.push(
  line("maxine-e-dexter", "housing", "Would expand federal housing tax credits and trust funds, plus rental and down-payment aid."),
  line("maxine-e-dexter", "safety", "Would abolish ICE and withhold its funding until raids stop; federal money for treatment."),
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
    money: { position: "Would restore the Affordable Care Act's enhanced premium tax credits and clean-energy tax credits, expand and protect Social Security and Medicare, take on drug and grocery price-fixing, and fight tariffs she calls illegal.", source: hoyleIssues },
    climate: { position: "Would push for billions in federal wildfire-risk investment, a constitutional amendment guaranteeing a right to a safe climate, new protections for Southwest Oregon rivers, and a transition off fossil fuels toward clean energy.", source: hoyleIssues },
  },
  sources: [hoyleStatement, hoyleIssues],
};
analysis["monique-despain"] = {
  values: ["Enforcement plus treatment", "Regulatory relief"],
  tradeoff: "Her immigration plan pairs tighter enforcement with a one-time route to legal status, and her homelessness plan pairs camping enforcement with more treatment; both need money her tax and spending cuts would have to leave in place.",
  issues: {
    housing: { position: "Would end permitting costs, building regulations, local codes and land-use restrictions she says stifle construction, with the federal government lifting housing restrictions and encouraging workforce housing.", source: despainIssues },
    safety: { position: "Would expand shelter, treatment and recovery housing with measured outcomes, enforce laws against public camping and drug use, fund border security with barriers, sensors and staffing, remove noncitizens who commit serious crimes, and offer long-settled noncriminal residents a one-time earned path to lawful status.", source: despainIssues },
    money: { position: "Would cut regulations, fix permitting systems and reduce what she calls punitive taxation, end tax-and-spend policies she says fuel inflation and the national debt, and root out fraud and failed programs.", source: despainIssues },
    climate: { position: "Would restore active forest management with thinning, salvage and prescribed fire, rescind the 2001 Roadless Rule, require rapid fire suppression, and pursue an all-of-the-above energy strategy without bans or forced transitions.", source: despainIssues },
  },
  sources: [despainStatement, despainIssues],
};
analysis["justin-filip"] = {
  values: ["Public ownership", "Demilitarized budgets"],
  tradeoff: "Nationalizing energy and rail, Medicare for All and a $25 minimum wage are financed in his plan by cutting the military budget by half or more; each is a major bill with no sequencing in the reviewed pages.",
  issues: {
    housing: { position: "Wants federal dollars brought back to the district for the housing and unhoused crisis, and involuntary homelessness abolished.", source: filipMeet },
    safety: { position: "Would abolish ICE and replace it with an Office of Citizenship, Refugees and Immigration Services, grant amnesty with a path to citizenship, ban private prisons, end qualified immunity and put policing under community oversight boards.", source: filipPlatform },
    money: { position: "Would cut tax burdens for families under $75,000, lift the Social Security contribution cap and extend it to capital gains, raise taxes on the ultra-wealthy, set a $25 minimum wage and cut military spending 50 to 75 percent.", source: filipPlatform },
    climate: { position: "Would declare a national climate emergency, pass a Green New Deal, ban fracking and fossil-fuel subsidies, nationalize energy and rail for renewable power and high-speed rail, and ban privately built data centers.", source: filipPlatform },
  },
  sources: [filipStatement, filipPlatform, filipMeet, filipHome],
};
lines.push(
  line("monique-despain", "housing", "Would cut permit costs, building rules and land-use limits to spur home construction."),
  line("monique-despain", "safety", "Would expand treatment, enforce camping laws, secure the border, and offer earned legal status."),
  line("monique-despain", "money", "Would reduce taxes and regulations, end funding for failed programs, root out fraud."),
  line("monique-despain", "climate", "Would thin and salvage federal forests, rescind the Roadless Rule, keep all energy options."),
  line("justin-filip", "housing", "Wants federal dollars for the district’s housing crisis and involuntary homelessness abolished."),
  line("justin-filip", "safety", "Would abolish ICE, ban private prisons, end qualified immunity (police liability shield)."),
  line("justin-filip", "money", "Would cut taxes under $75,000, tax the ultra-wealthy, cut military spending 50–75%."),
  line("justin-filip", "climate", "Would declare a climate emergency, ban fracking, nationalize energy and rail systems."),
  line("val-hoyle", "housing", "Would add housing vouchers, a renter tax credit and down-payment help for first-time buyers."),
  line("val-hoyle", "money", "Would restore health-insurance premium credits, protect Social Security and Medicare, fight tariffs."),
  line("val-hoyle", "climate", "Would fund wildfire-risk reduction, protect Southwest Oregon rivers, move off fossil fuels."),
);
chips.push(
  chip("monique-despain", "housing", "Fewer building rules"), chip("monique-despain", "safety", "Enforcement plus treatment"),
  chip("monique-despain", "money", "Lower taxes, cut fraud"), chip("monique-despain", "climate", "Active forest management"),
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
    housing: { position: "Would tackle housing shortages, construction-workforce gaps and financing barriers through legislation, expand pathways to homeownership and address youth homelessness.", source: bynumHousing },
    safety: { position: "Wants people off the streets through homelessness prevention, more shelter capacity and mental-health services, and opposes what she calls a federal takeover of communities by ICE.", source: bynumStatement },
    money: { position: "Would lower costs from groceries to housing to health care, protect Medicare, expand Medicaid, defend the Oregon Health Plan against federal cuts, and lower prescription prices.", source: bynumStatement },
    climate: { position: "Would generate more clean energy, transition away from fossil fuels and protect communities and land from wildfires.", source: bynumClimate },
  },
  sources: [bynumStatement, bynumHousing, bynumHomeless, bynumClimate],
};
analysis["patti-adair"] = {
  values: ["Fiscal oversight", "Law-enforcement support"],
  tradeoff: "Permanent no-tax-on-tips, overtime and Social Security plus a larger child tax credit reduce revenue while she promises to eliminate waste; the reviewed pages do not size either side.",
  issues: {
    safety: { position: "Would fully support law enforcement to keep communities safe; cites working with law enforcement and adding two circuit judges as a county commissioner.", source: adairPriorities },
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
  line("patti-adair", "safety", "Supports fully funding law enforcement to keep communities safe."),
  line("patti-adair", "money", "Would make no-tax-on-tips permanent, raise the child tax credit, ban congressional insider trading."),
  line("patti-adair", "climate", "Would require data-center disclosure of air, water and electricity impacts; sustainable resource management."),
  line("janelle-s-bynum", "housing", "Would target housing shortages, construction-workforce gaps and financing barriers, with ownership pathways."),
  line("janelle-s-bynum", "safety", "Wants more shelter capacity and mental-health services; opposes federal ICE takeover of communities."),
  line("janelle-s-bynum", "money", "Wants Medicare protected, Medicaid expanded and prescription prices lowered against federal cuts."),
  line("janelle-s-bynum", "climate", "Would expand clean energy, move off fossil fuels and protect communities from wildfire."),
  line("andrea-townsend", "housing", "Wants deeply affordable social housing (publicly owned) and tenant protections."),
  line("andrea-townsend", "money", "Wants war spending redirected to human and ecological needs."),
  line("andrea-townsend", "climate", "Wants climate action protecting land, water and biodiversity; transportation and energy within planetary limits."),
);
chips.push(
  chip("patti-adair", "safety", "Fully support police"), chip("patti-adair", "money", "No tax on tips"), chip("patti-adair", "climate", "Data-center disclosure"),
  chip("janelle-s-bynum", "housing", "Fix supply and financing"), chip("janelle-s-bynum", "safety", "Shelter and mental health"),
  chip("janelle-s-bynum", "money", "Protect Medicaid, Medicare"), chip("janelle-s-bynum", "climate", "Clean energy, wildfire"),
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
    safety: { position: "Would fund first responders and social services, keep working with police on fentanyl including stiffer trafficker penalties, invest in smart border security, streamline immigration courts and protect communities from what she calls ICE's violent overreach.", source: salinasIssues },
    money: { position: "Would cap prescription drug costs and let Medicare negotiate prices, seek middle-class tax relief instead of billionaire tax breaks, and bring living-wage jobs to Oregon.", source: salinasStatement },
    climate: { position: "Would put Oregon on a path to 100% green energy, stand up to corporate polluters, and protect air and waterways; prioritizes public infrastructure over corporate-owned data centers.", source: salinasIssues },
  },
  sources: [salinasStatement, salinasIssues],
};
analysis["david-russ"] = {
  values: ["Local control", "Smaller federal role"],
  tradeoff: "Returning lands, schools and utilities to state control and ending conditional federal grants would shift both authority and hundreds of billions of dollars; who funds those responsibilities afterward is not addressed in the reviewed pages.",
  issues: {
    safety: { position: "Would secure the border and remove people who entered illegally, make aiding illegal border crossers a federal felony, and require U.S. attorneys to take roughly 98% of referred cases to trial.", source: russHome },
    money: { position: "Would end subsidies that benefit only large corporations and federal subsidy or loan programs for noncitizens, strip conditions from federal grants to states through a No Strings Act, and end what he calls the IRS manhunt of 1099 employers.", source: russHome },
    climate: { position: "Would return federal public lands to state and local control, end federal control of local utilities and infrastructure, and support responsible forest and agricultural management, reliable infrastructure and affordable energy decided locally.", source: russStatement },
  },
  sources: [russStatement, russHome, russBills],
};
lines.push(
  line("david-russ", "safety", "Would secure the border, remove unauthorized entrants, make aiding illegal crossings a felony."),
  line("david-russ", "money", "Would end corporate subsidies and noncitizen loan programs, strip conditions from federal grants."),
  line("david-russ", "climate", "Would transfer federal public lands to state and local control; affordable energy decided locally."),
  line("andrea-salinas", "housing", "Would fund affordable housing and shelters, backing a two-million-home national plan."),
  line("andrea-salinas", "safety", "Would fund police and social services, tighten fentanyl penalties, streamline immigration courts."),
  line("andrea-salinas", "money", "Would cap prescription costs, seek middle-class tax relief over billionaire tax breaks."),
  line("andrea-salinas", "climate", "Would push toward 100% green energy and hold corporate polluters accountable."),
);
chips.push(
  chip("david-russ", "safety", "Secure border, removals"), chip("david-russ", "money", "End corporate subsidies"), chip("david-russ", "climate", "Local control of lands"),
  chip("andrea-salinas", "housing", "Two million homes"), chip("andrea-salinas", "safety", "Fund police and services"),
  chip("andrea-salinas", "money", "Cap drug prices"), chip("andrea-salinas", "climate", "100% green energy"),
);
deliveries.push(
  delivery("david-russ", "safety", {
    how: step("A Prosecutorial Requirements bill making U.S. attorneys try about 98% of cases referred by law enforcement or lose their jobs; a federal felony for aiding or abetting illegal border crossers.", russBills),
  }),
  delivery("david-russ", "money", {
    how: step("A No Strings Act voiding conditions on federal grants beyond a project’s scope and blocking federal funds to non-government agencies without audited contracts.", russBills),
    measure: step("Says the act would save hundreds of billions a year, possibly over $1 trillion, returned to local economies; no independent estimate is cited.", russBills),
  }),
  delivery("david-russ", "climate"),
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
