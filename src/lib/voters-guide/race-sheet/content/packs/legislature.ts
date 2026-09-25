import type { CandidatePortrait, Evidence } from "../../../types";
import type { IssueId } from "../../issues";
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

/**
 * Race pack: Oregon Legislature (Senate 13, 15, 16, 17, 19, 20, 24, 26; House 26, 29,
 * 40, 51, 52). Researched September 21, 2026. The state voters' pamphlet is not
 * published until September 29, so positions and ladders come from each campaign's
 * own site (fetched directly), the candidate's own questionnaire answers, and the
 * sources already on the research object. Openings in the candidates' own words come
 * from the statements they filed with the Secretary of State for the state pamphlet
 * (the Elections Division's "2026 General Election, Candidate Statements" PDF, printed
 * September 9, 2026), recorded under the pamphlet-opening rule; a candidate with no
 * filed statement uses the next rule in own-words.ts. Gaps stay gaps.
 */

const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";
const STATEMENTS = "https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf";
const SOS_VOTING = "https://sos.oregon.gov/elections/pages/default.aspx";

const site = (label: string, url: string, note = NOTE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note,
});
const questionnaire = (label: string, url: string, date: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note: `${NOTE} The candidate's own written answers, hosted by the questionnaire's publisher.`,
});
const reporting = (label: string, url: string, date: string): Evidence => ({
  label,
  url,
  kind: "Reporting",
  date,
  note: `${NOTE} Position taken from the candidate's quoted statements in this interview.`,
});
const statement = (page: number): Evidence => ({
  label: `Oregon Secretary of State · filed candidate statement · PDF page ${page}`,
  url: `${STATEMENTS}#page=${page}`,
  kind: "Candidate statement",
  date: "Filed for the November 2026 state voters’ pamphlet; PDF printed September 9, 2026; reviewed September 21, 2026",
  note: "Written by the candidate or campaign for the state voters’ pamphlet, which is not published until September 29, 2026.",
});
const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });
const line = (candidateId: string, issue: IssueId, text: string): IssueLine => ({
  candidateId, issue, line: text, from: `analysis.issues.${issue}.position`, ...reviewed,
});
const chip = (candidateId: string, issue: IssueId, text: string): StanceChip => ({
  candidateId, issue, chip: text, from: `analysis.issues.${issue}.position`, ...reviewed,
});
const ladder = (candidateId: string, issue: IssueId, rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {}): Delivery => ({
  candidateId, issue, ...rungs, ...reviewed,
});
type From = ContactChannel["from"];
const web = (url: string, from: From = "site"): ContactChannel => ({
  url, label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), kind: "website", from,
});
const email = (address: string, from: From = "site"): ContactChannel => ({ url: `mailto:${address}`, label: address, kind: "email", from });
const phone = (digits: string, label: string, from: From = "site"): ContactChannel => ({ url: `tel:+1${digits}`, label, kind: "phone", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From = "site"): ContactChannel => ({ url, label, kind: "form", from });
const social = (label: string, url: string, from: From = "site"): ContactChannel => ({ url, label, kind: "social", from });
const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string): CandidateContact => ({
  candidateId, channels, ...(none ? { none } : {}), sources, reviewedOn: REVIEWED_ON,
});
const own = (candidateId: string, text: string, page: number, note: string): OwnWords => ({
  candidateId, text, rule: "pamphlet-opening",
  source: { label: `Oregon Secretary of State · filed candidate statement · PDF page ${page}`, url: `${STATEMENTS}#page=${page}`, kind: "Candidate statement", date: "Filed for the November 2026 state voters’ pamphlet; extracted September 21, 2026", note },
  words: text.split(/\s+/).filter((t) => /[A-Za-z0-9]/.test(t)).length,
});
const ballot = (raceId: string): BallotInstruction => ({
  raceId, text: "You vote for one candidate.",
  source: { label: "Oregon Secretary of State · Elections", url: SOS_VOTING, kind: "Election authority", date: "Checked September 21, 2026" },
});
const district = (raceId: string, code: string, neighborhoods: string): DistrictInfo => ({
  raceId, neighborhoods, mapUrl: `https://www.oregonlegislature.gov/redistricting/adoptedmaps/${code}.pdf`,
  mapSource: { label: `Oregon Legislature · adopted district map · ${code}`, url: `https://www.oregonlegislature.gov/redistricting/adoptedmaps/${code}.pdf`, kind: "Public record", date: "SB 882 (2021) map; checked September 21, 2026" },
});
const choice = (raceId: string, text: string): ChoiceParagraph => ({ raceId, text, from: "race.comparison", ...reviewed });
const portrait = (id: string, sourceUrl: string, credit: string): CandidatePortrait => ({ src: `/images/voters-guide/2026/${id}.webp`, sourceUrl, credit, reviewed: REVIEWED_ON });

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
const choices: ChoiceParagraph[] = [];
const portraits: Record<string, CandidatePortrait> = {};
const missing: Record<string, MissingState> = {};
/** Topic boards and stakes (researched September 22, 2026) are filled at the end of the file; see the note there. */
const topics: RaceTopics[] = [];
const topicStances: TopicStance[] = [];
const stakes: RaceStakes[] = [];

/** The arrays above are filled by the district blocks below; module order keeps them in the export. */
/** Research gaps closed since September 18 by the candidate's own statement; see the research log. */
const profiles: RacePack["profiles"] = {
  "john-a-n-chee": {
    background: "Republican nominee raised in Portland’s Bethany neighborhood; answered the 2026 Ballotpedia candidate survey.",
    summary: "His survey answers pair sharp property- and inheritance-tax cuts with prosecuting vagrancy and open drug use, fewer rules on home builders and support for young men entering the trades.",
    priorities: [
      "Dramatically reduce property taxes and eliminate taxes on family inheritances.",
      "Prosecute vagrancy and open drug use.",
      "Cut regulations on home builders and small businesses.",
    ],
    question: "Which state services would shrink to pay for the property- and inheritance-tax cuts, and by how much?",
  },
  "brian-schimmel": {
    background: "City councilor; Republican and Independent nominee with a campaign site and a filed statement.",
    summary: "He runs on making state policy work in practice: careful use of public money, measurable results, and adjusting programs that are not working, drawn from local housing and public-safety administration.",
    priorities: [
      "Use public resources carefully and require measurable results.",
      "Align state policy with local implementation and funding realities.",
      "Adjust or end programs that are not working.",
    ],
    question: "Which state programs would you change first, and what result would show the change worked?",
  },
  "pat-hubbell": {
    background: "Pharmacist; Independent nominee with a campaign site and a filed statement.",
    summary: "A pharmacist’s platform: balance the state budget through audits and cuts without raising taxes, take on pharmacy benefit managers, and pair addiction and mental-health treatment with strict enforcement.",
    priorities: [
      "Balance the budget by auditing departments and cutting waste, without new taxes.",
      "Rein in pharmacy benefit managers to protect independent pharmacies.",
      "Pair mental-health and addiction recovery with strict enforcement of public-safety laws.",
    ],
    question: "Which departments and programs would the audits cut, and by how much?",
  },
};

export const pack: RacePack = { ...emptyPack(), analysis, lines, chips, deliveries, ownWords, contacts, roles, primary, ballots, districts, choice: choices, portraits, missing, profiles, topics, topicStances, stakes };

/* ── Oregon Senate · District 13 ─────────────────────────────────────────── */
const neronPriorities = site("Neron Misslin · priorities", "https://www.courtneyfororegon.com/priorities");
const lancasterIssues = site("Lancaster · Fix What’s Broken (priorities)", "https://glennlancaster.com/issues2/");
Object.assign(analysis, {
  "courtney-neron-misslin": {
    values: ["Public investment", "Tenant protections"],
    tradeoff: "She pairs building more homes with protecting the affordable homes that exist, and funds prevention-first safety and healthcare through state investment; the site lists past appropriations and bills rather than a costed next-term plan.",
    issues: {
      housing: { position: "Build more homes and protect existing affordable ones: eviction prevention, housing-first strategies, stronger tenant protections and rent-increase transparency (her HB 3042), and state money for sewer and water lines so towns can build.", source: neronPriorities },
      safety: { position: "Prevention-focused safety: expanded mental-health resources, full funding for the 9-8-8 crisis line, domestic-violence legislation, gun-safety measures such as the 2022 Reduction of Gun Violence Act (IP 17), and police accountability, alongside money for Tigard’s police facility.", source: neronPriorities },
      money: { position: "Make Oregon more affordable: she pushed to remove tolling from the I-5 bridge in Wilsonville, backs universal school meals as a family-budget saving, and wants lower prescription-drug costs.", source: neronPriorities },
      climate: { position: "Stronger toxics standards, clean-energy job training, sustainable transportation, responsible land use and climate resilience, with district money for the Sherwood pedestrian bridge and transit-oriented workforce housing.", source: neronPriorities },
    },
    sources: [neronPriorities, site("Neron Misslin · Meet Courtney", "https://www.courtneyfororegon.com/meet-courtney"), statement(64)],
  },
  "glenn-lancaster": {
    values: ["Tax restraint", "Enforcement first"],
    tradeoff: "He blames rising costs on state policy and would stop tax increases, loosen housing and land-use rules and enforce existing laws; the site does not name which rules would change or how roads and services would be funded instead.",
    issues: {
      housing: { position: "Change the housing and land-use policies he says restrict supply and drive up rent and home prices.", source: lancasterIssues },
      safety: { position: "Restore public order and enforce the law, and demand what he calls real solutions to addiction and homelessness rather than treating them as permanent.", source: lancasterIssues },
      money: { position: "Stop the gas tax and stop tax increases; demand accountability for what actually works, since he says programs grow even when they fail.", source: lancasterIssues },
    },
    sources: [lancasterIssues, site("Lancaster · about", "https://glennlancaster.com/about/"), statement(66)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("courtney-neron-misslin", "housing", "Supports building more homes while protecting existing affordable ones and preventing evictions."),
  line("courtney-neron-misslin", "safety", "Supports mental-health care, 9-8-8 funding and the 2022 Reduction of Gun Violence Act."),
  line("courtney-neron-misslin", "money", "Opposes tolling Wilsonville’s I-5 bridge; backs school meals and lower drug costs."),
  line("courtney-neron-misslin", "climate", "Supports stronger toxics rules, clean-energy training, sustainable transportation and climate resilience."),
  line("glenn-lancaster", "housing", "Would change housing and land-use rules he says restrict supply."),
  line("glenn-lancaster", "safety", "Would restore order, enforce the law and demand real solutions to addiction and homelessness."),
  line("glenn-lancaster", "money", "Opposes the gas tax and tax increases; wants results-based accountability."),
);
chips.push(
  chip("courtney-neron-misslin", "housing", "Build and protect homes"),
  chip("courtney-neron-misslin", "safety", "Prevention-first safety"),
  chip("courtney-neron-misslin", "money", "No I-5 bridge tolls"),
  chip("courtney-neron-misslin", "climate", "Toxics rules, clean energy"),
  chip("glenn-lancaster", "housing", "Loosen land-use rules"),
  chip("glenn-lancaster", "safety", "Enforce existing laws"),
  chip("glenn-lancaster", "money", "No tax increases"),
);
deliveries.push(
  ladder("courtney-neron-misslin", "housing", { how: step("Passed HB 3042 for tenant protections and rent-increase transparency; backs housing-first strategies and state investment in sewer and water infrastructure so communities can build.", neronPriorities) }),
  ladder("courtney-neron-misslin", "safety", { how: step("Voted to fully fund the 9-8-8 crisis line, introduced domestic-violence legislation, and secured $3 million toward Tigard’s police and public-works facility.", neronPriorities) }),
  ladder("courtney-neron-misslin", "money", { measure: step("Puts the school-meal saving at an average of $1,400 a year per family.", neronPriorities) }),
  ladder("courtney-neron-misslin", "climate", { how: step("$4 million for the Sherwood pedestrian bridge over Highway 99W and $1.9 million for transit-oriented workforce housing near the Wilsonville Transit Center; updated the Toxic Free Kids Act.", neronPriorities) }),
  ladder("glenn-lancaster", "housing"),
  ladder("glenn-lancaster", "safety"),
  ladder("glenn-lancaster", "money"),
);
ownWords.push(
  own("courtney-neron-misslin", "As your State Senator, I'm pushing back against federal overreach and policies that benefit only the ultra-wealthy.", 64, "First sentence of the filed statement; the name, party, occupation and background header fields above it are skipped."),
  own("glenn-lancaster", "I love this district and state. Anna and I built our life here and proudly call Wilsonville home.", 66, "First two sentences of the filed statement (the first is under 12 words); header fields skipped."),
);
contacts.push(
  contact("courtney-neron-misslin", [web("https://www.courtneyfororegon.com/"), email("info@courtneyfororegon.com"), form("https://www.courtneyfororegon.com/contact", "Contact form"), social("Instagram", "https://www.instagram.com/courtney_for_oregon/"), social("Facebook", "https://www.facebook.com/CourtneyForOregon/")],
    [site("Neron Misslin · contact page", "https://www.courtneyfororegon.com/contact", "The page holds a contact form; the email and profile links are in the site footer.")]),
  contact("glenn-lancaster", [web("https://glennlancaster.com/"), email("Glenn@GlennLancaster.com"), phone("9713966610", "971.396.6610 (call or text)"), form("https://glennlancaster.com/contact-page/", "Contact form"), social("X", "https://x.com/Lancaster4Or"), social("Facebook", "https://www.facebook.com/people/Glenn-Lancaster-for-Mayor/61561177884105/"), social("Instagram", "https://www.instagram.com/glennlancasterfororegon/"), social("LinkedIn", "https://www.linkedin.com/company/glennlancaster/")],
    [site("Lancaster · contact page", "https://glennlancaster.com/contact-page/", "The page holds a contact form; the site footer prints the email, a phone number labeled “Glenn’s Personal Phone” for calls or texts, and the profile links.")]),
  contact("tim-e-nelson", [], [{ label: "Oregon Secretary of State · qualified 2026 general-election filings", url: "https://secure.sos.state.or.us/orestar/cfFilings.do?cfSearchButtonName=currentElection", kind: "Election authority", date: "Checked September 21, 2026" }],
    "No campaign site, filed pamphlet statement, questionnaire or campaign email was found; the ORESTAR filing page refuses automated requests, so any contact it lists could not be read."),
);
primary.push({ candidateId: "courtney-neron-misslin", sourceUrl: neronPriorities.url }, { candidateId: "glenn-lancaster", sourceUrl: lancasterIssues.url });
roles.push({ candidateId: "courtney-neron-misslin", role: "Incumbent senator; educator", from: "background" }, { candidateId: "glenn-lancaster", role: "Electrical-engineering entrepreneur", from: "background" }, { candidateId: "tim-e-nelson", role: "Qualified general-election candidate", from: "background" });
ballots.push(ballot("oregon-state-senate-13"));
districts.push(district("oregon-state-senate-13", "SD13", "Tigard, King City, Bull Mountain, Sherwood, Durham and Wilsonville, plus the farm and vineyard country between them and Newberg in Washington, Yamhill and Clackamas counties."));
choices.push(choice("oregon-state-senate-13", "One candidate would keep the state investing in schools, tenant protections and family services; another would stop tax increases, loosen housing rules and enforce existing laws. A third has no published brief, so party alone says nothing about his positions."));
Object.assign(portraits, {
  "courtney-neron-misslin": portrait("courtney-neron-misslin", "https://www.courtneyfororegon.com/", "Campaign photo · courtneyfororegon.com"),
  "glenn-lancaster": portrait("glenn-lancaster", "https://glennlancaster.com/", "Campaign photo · glennlancaster.com"),
});
missing["tim-e-nelson"] = "no-platform";

/* ── Oregon Senate · District 15 ─────────────────────────────────────────── */
const munozIssues = site("Muñoz · platform", "https://myrnaforsenate.com/issues");
const munozAbout = site("Muñoz · about", "https://myrnaforsenate.com/about");
const hutchisonSite = site("Hutchison · campaign page", "https://haroldhutchison.carrd.co/");
const hutchisonOAA = questionnaire("Hutchison · Oregon Abigail Adams Project candidate questionnaire", "https://survey.oregonabigailadams.org/AAP/candidate-survey-answer.cfm?State=OR&Q=state26&K=SS15-06", "2026 general-election questionnaire; reviewed September 21, 2026");
Object.assign(analysis, {
  "myrna-a-munoz": {
    values: ["Land-use protection", "Civil rights"],
    tradeoff: "She would put conditions on growth (data-center transparency and safeguards) while expanding housing, healthcare and worker protections through state investment; the site does not say how that investment would be financed.",
    issues: {
      housing: { position: "Invest state money in affordable housing and reassess the systems that leave the most vulnerable unhoused, with a strategic plan to house all Oregonians.", source: munozIssues },
      safety: { position: "State laws that strengthen due process and prevent racial profiling, keeping local resources focused on community safety rather than federal immigration enforcement; her About page calls for abolishing ICE.", source: munozIssues },
      money: { position: "Lower prescription-drug costs, and more transparency, community input and environmental safeguards on the AI data-center build-out she says is driving up electricity bills.", source: munozIssues },
      climate: { position: "Defend Oregon’s land-use system for farms and forests, with transparency, community input and environmental safeguards on data centers.", source: munozIssues },
    },
    sources: [munozIssues, munozAbout, statement(68)],
  },
  "harold-hutchison": {
    values: ["Deregulation", "Property-tax repeal"],
    tradeoff: "He would end assessment-based property taxes, cut regulation and building codes, and reject climate and electric-vehicle mandates; his questionnaire names no replacement revenue for the services property taxes fund.",
    issues: {
      housing: { position: "Cut regulations and simplify building codes to address the housing shortage, even over community objections.", source: hutchisonOAA },
      safety: { position: "Repeal Oregon’s sanctuary-state law and let police ask about immigration status outside criminal investigations.", source: hutchisonOAA },
      money: { position: "Keep the kicker with taxpayers and oppose a sales tax and automatic property-tax base increases, calling property tax immoral; supports a mortgage-interest deduction.", source: hutchisonOAA },
      climate: { position: "Voter approval for highway tolls and no gas-tax increases; opposes reaching the 2040 emissions target before an adequate power grid is built, electric-vehicle sales mandates and 100% carbon-free electricity standards, and favors another look at nuclear power.", source: hutchisonOAA },
    },
    sources: [hutchisonSite, hutchisonOAA, statement(70)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("myrna-a-munoz", "housing", "Supports state investment in affordable housing and a plan to house everyone."),
  line("myrna-a-munoz", "safety", "Supports due-process and anti-profiling laws; local resources for community safety, not ICE."),
  line("myrna-a-munoz", "money", "Wants lower prescription costs and safeguards on data centers she says raise power bills."),
  line("myrna-a-munoz", "climate", "Supports land-use protections for farms and forests, with safeguards on data centers."),
  line("harold-hutchison", "housing", "Supports cutting regulations and simplifying building codes to add housing."),
  line("harold-hutchison", "safety", "Supports repealing the sanctuary-state law and letting police ask about immigration status."),
  line("harold-hutchison", "money", "Would keep the kicker and oppose a sales tax; calls property tax immoral."),
  line("harold-hutchison", "climate", "Opposes electric-vehicle mandates and the 2040 emissions target; would take another look at nuclear."),
);
chips.push(
  chip("myrna-a-munoz", "housing", "Fund affordable housing"),
  chip("myrna-a-munoz", "safety", "Due process, no profiling"),
  chip("myrna-a-munoz", "money", "Curb data-center bills"),
  chip("myrna-a-munoz", "climate", "Protect farms and forests"),
  chip("harold-hutchison", "housing", "Simplify building codes"),
  chip("harold-hutchison", "safety", "Repeal sanctuary law"),
  chip("harold-hutchison", "money", "Against property tax"),
  chip("harold-hutchison", "climate", "No EV, power mandates"),
);
deliveries.push(
  ladder("myrna-a-munoz", "housing"), ladder("myrna-a-munoz", "safety"), ladder("myrna-a-munoz", "money"), ladder("myrna-a-munoz", "climate"),
  ladder("harold-hutchison", "housing"), ladder("harold-hutchison", "safety"), ladder("harold-hutchison", "money"),
  ladder("harold-hutchison", "climate", { how: step("Fund transportation without gas-tax or fee increases by shrinking the administration responsible for DEQ and licensing.", hutchisonOAA) }),
);
ownWords.push(
  own("myrna-a-munoz", "As your Senator, I will represent you in the ideas I bring forward.", 68, "First sentence of the filed statement; header fields skipped."),
  own("harold-hutchison", "I cannot abide what has happened to Oregon. I am done sitting on my hands as people with a far different view of what our society should look like are elevated by default to positions of authority.", 70, "First two sentences of the filed statement (the first is under 12 words); header fields skipped."),
);
contacts.push(
  contact("myrna-a-munoz", [web("https://myrnaforsenate.com/"), email("myrna.arely.munoz@gmail.com"), form("https://myrnaforsenate.com/contact", "Contact form"), social("Instagram", "https://www.instagram.com/myrnafororegon"), social("TikTok", "https://www.tiktok.com/@myrnafororegon"), social("Facebook", "https://www.facebook.com/share/14VFiBKvmTT/?mibextid=wwXIfr")],
    [site("Muñoz · contact page", "https://myrnaforsenate.com/contact", "The page prints the campaign email and holds a contact form; profile links are in the footer.")]),
  contact("harold-hutchison", [web("https://haroldhutchison.carrd.co/"), email("hhutch@juno.com"), social("Facebook", "https://www.facebook.com/profile.php?id=61580656994575"), social("X", "https://x.com/HaroldHhutch"), social("Substack", "https://voteforharold.substack.com/")],
    [site("Hutchison · campaign page", "https://haroldhutchison.carrd.co/", "The one-page site links an Email button (address decoded from the page’s email-protection markup), Facebook, X and Substack.")]),
);
primary.push({ candidateId: "myrna-a-munoz", sourceUrl: munozIssues.url }, { candidateId: "harold-hutchison", sourceUrl: hutchisonSite.url });
roles.push({ candidateId: "myrna-a-munoz", role: "Candidate; education specialist", from: "background" }, { candidateId: "harold-hutchison", role: "Retired Forest Grove resident", from: "background" });
ballots.push(ballot("oregon-state-senate-15"));
districts.push(district("oregon-state-senate-15", "SD15", "Forest Grove, Cornelius, Dilley and west and central Hillsboro, including the airport area, plus the farmland south toward Gaston."));
choices.push(choice("oregon-state-senate-15", "One candidate would condition growth on land-use and data-center safeguards while investing in housing and healthcare; the other would cut regulation, raise academic standards and replace property-tax funding. Look for the financing behind each."));
Object.assign(portraits, {
  "myrna-a-munoz": portrait("myrna-a-munoz", "https://myrnaforsenate.com/", "Campaign photo · myrnaforsenate.com"),
  "harold-hutchison": portrait("harold-hutchison", "https://haroldhutchison.carrd.co/", "Campaign photo · haroldhutchison.carrd.co"),
});

/* ── Oregon Senate · District 16 ─────────────────────────────────────────── */
const bangsPriorities = site("Bangs · priorities", "https://www.courtneybangs.com/priorities");
const armitageInterview = reporting("Tillamook Headlight Herald · Armitage interview", "https://bloximages.chicago2.vip.townnews.com/tillamookheadlightherald.com/content/tncms/assets/v3/editorial/b/5e/b5e85786-7bcd-4dfd-8653-96868d0c2f25/69e6cc94c66a0.pdf.pdf", "April 21, 2026 (primary-season interview); reviewed September 21, 2026");
const armitageSite = site("Armitage · campaign site", "https://www.senatedistrict16.com/", `${NOTE} The site carries a biography and contact details but no policy text.`);
const finkleProfile: Evidence = { label: "Tillamook County Pioneer · Finkle campaign profile", url: "https://www.tillamookcountypioneer.net/independent-candidate-takes-unconventional-path-in-oregon-senate-district-16/", kind: "Reporting", date: "August 18, 2026; reviewed September 21, 2026", note: "A campaign profile with no position on housing, safety, taxes or transportation." };
Object.assign(analysis, {
  "courtney-bangs": {
    values: ["Tax restraint", "Local control"],
    tradeoff: "She ties public services to timber revenue and existing tax dollars, would cut state housing rules in favor of local control, and back law enforcement; the site names no cost for the road and levee commitments.",
    issues: {
      housing: { position: "Cut state-level red tape that makes home building slower and costlier, protect local control over how communities grow, and expand childcare providers as she did in Clatsop County.", source: bangsPriorities },
      safety: { position: "Fully back deputies, police and sheriffs with support and resources, and encourage school resource officers.", source: bangsPriorities },
      money: { position: "Stop new tax hikes and hidden fees, cut regulatory burdens that raise fuel and energy costs, and demand accountability for state spending; she cites helping defeat the $4.3 billion gas-tax package.", source: bangsPriorities },
      climate: { position: "Fight for the district’s share of existing tax dollars for Highways 30, 6 and 101, oppose tax schemes that hit commuters without fixing roads, and get levees studied, accredited and upgraded.", source: bangsPriorities },
    },
    sources: [bangsPriorities, site("Bangs · about", "https://www.courtneybangs.com/about"), statement(72)],
  },
  "rachel-armitage": {
    values: ["Lower fees", "Rules review"],
    tradeoff: "Her April interview promises lower costs through reviewing old rules and programs, more housing through faster permitting, and roads funded by the gas taxes rural drivers already pay; it is a direction, not a costed plan.",
    issues: {
      housing: { position: "More housing to support north-coast growth: review permitting to cut wait times for builders, fund water and wastewater upgrades, and prepare for the expected land-use debate.", source: armitageInterview },
      money: { position: "Cut costs for taxpayers: generally opposes the gas-tax and DMV-fee increases, and wants a legislative system to review whether passed bills and pandemic-era programs still work.", source: armitageInterview },
      climate: { position: "More oversight and spending transparency at ODOT, with rural gas-tax dollars maintaining the roads rural commuters drive, since they lack the metro area’s alternatives to cars.", source: armitageInterview },
    },
    sources: [armitageInterview, armitageSite, statement(74)],
  },
  "melisa-finkle": {
    values: ["Oversight", "Party independence"],
    tradeoff: "She runs on direct accountability to residents, declining endorsements and donor networks, with bills planned on care safety and rural preparedness; neither the profile nor her filed statement takes a position on the four issues here.",
    issues: {},
    sources: [finkleProfile, statement(76)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("courtney-bangs", "housing", "Would cut state housing red tape and protect local control over growth."),
  line("courtney-bangs", "safety", "Supports full backing for deputies, police and sheriffs, plus school resource officers."),
  line("courtney-bangs", "money", "Opposes new taxes and hidden fees; cites helping defeat the gas-tax package."),
  line("courtney-bangs", "climate", "Wants existing tax dollars for coastal highways and levee upgrades."),
  line("rachel-armitage", "housing", "Would speed building approvals for builders and fund water and wastewater upgrades."),
  line("rachel-armitage", "money", "Would generally oppose gas-tax and DMV-fee increases; would review old rules and programs."),
  line("rachel-armitage", "climate", "Wants ODOT spending scrutiny and rural drivers' gas taxes spent on roads they use."),
);
chips.push(
  chip("courtney-bangs", "housing", "Cut state red tape"), chip("courtney-bangs", "safety", "Police and school officers"), chip("courtney-bangs", "money", "Stop hikes, hidden fees"), chip("courtney-bangs", "climate", "Roads and levees"),
  chip("rachel-armitage", "housing", "Permits and water lines"), chip("rachel-armitage", "money", "Review rules, hold fees"), chip("rachel-armitage", "climate", "ODOT scrutiny, rural roads"),
);
deliveries.push(
  ladder("courtney-bangs", "housing"), ladder("courtney-bangs", "safety"), ladder("courtney-bangs", "money"),
  ladder("courtney-bangs", "climate", { how: step("Work with the Army Corps, the federal delegation and local partners to get levees studied, accredited and upgraded, and fund roads from the district’s share of existing tax dollars.", bangsPriorities) }),
  ladder("rachel-armitage", "housing", { how: step("Evaluate permitting processes for efficiency and shorter waits for developers; fight for funding for water and wastewater infrastructure across the district.", armitageInterview) }),
  ladder("rachel-armitage", "money", { how: step("Build a legislative system to review the outcomes of passed bills, focused first on programs started during the pandemic, and streamline rules that no longer make sense.", armitageInterview) }),
  ladder("rachel-armitage", "climate", { how: step("Increase oversight and accountability at ODOT and advocate for systems that make its spending more transparent.", armitageInterview) }),
);
ownWords.push(
  own("courtney-bangs", "Portland Politicians always seem to find another way to threaten our values.", 72, "First complete sentence of the filed statement; an opening quotation attributed to Betsy Johnson and a heading are skipped."),
  own("rachel-armitage", "Rachel grew up helping her single mom raise her three siblings. She understands the struggles rural working families like ours face, and she’s tired of Salem politicians who talk a big game but don’t deliver.", 74, "First two sentences of the filed statement (the first is under 12 words); the heading “RACHEL GETS RESULTS” is skipped."),
  own("melisa-finkle", "After a decade in public service, I’ve learned that real work doesn’t happen under bright lights or behind a podium.", 76, "First sentence of the filed statement; header fields skipped."),
);
contacts.push(
  contact("courtney-bangs", [web("https://www.courtneybangs.com/"), form("https://www.courtneybangs.com/contact", "Contact form"), social("Facebook", "https://www.facebook.com/courtneyforsenate"), social("Instagram", "https://www.instagram.com/CourtneyBangs")],
    [site("Bangs · contact page", "https://www.courtneybangs.com/contact", "The page holds a contact form; profile links are in the site header. No email or phone is printed.")]),
  contact("rachel-armitage", [web("https://www.senatedistrict16.com/"), email("campaign@senatedistrict16.com"), phone("5033950119", "503/395-0119"), social("Facebook", "https://www.facebook.com/share/1CsjyZXi5s/"), social("Instagram", "https://www.instagram.com/rachelforsenatedistrict16")],
    [site("Armitage · campaign site footer", "https://www.senatedistrict16.com/", "The footer prints the phone, the campaign email and the profile links.")]),
  contact("melisa-finkle", [], [finkleProfile, statement(76)], "No campaign site, email or phone was found; the campaign profile and her filed statement print no contact channel, and the ORESTAR filing page refuses automated requests."),
);
primary.push({ candidateId: "courtney-bangs", sourceUrl: bangsPriorities.url }, { candidateId: "rachel-armitage", sourceUrl: armitageInterview.url }, { candidateId: "melisa-finkle", sourceUrl: finkleProfile.url });
roles.push({ candidateId: "courtney-bangs", role: "Clatsop County commissioner; educator", from: "background" }, { candidateId: "melisa-finkle", role: "State-government investigator", from: "background" });
ballots.push(ballot("oregon-state-senate-16"));
districts.push(district("oregon-state-senate-16", "SD16", "The North Coast and lower Columbia: Astoria, Warrenton, Seaside, Cannon Beach, Tillamook, Rockaway Beach, Pacific City, Vernonia, Clatskanie, Rainier, St. Helens and Scappoose."));
choices.push(choice("oregon-state-senate-16", "One candidate leads with tax restraint, timber and local control; another with household costs, faster permitting and road funding; a third with oversight and independence from party networks. Compare the concrete legislation behind each."));
Object.assign(portraits, {
  "courtney-bangs": portrait("courtney-bangs", "https://www.courtneybangs.com/", "Campaign photo · courtneybangs.com"),
  "rachel-armitage": portrait("rachel-armitage", "https://www.senatedistrict16.com/", "Campaign photo · senatedistrict16.com"),
});

/* ── Oregon Senate · District 17 ─────────────────────────────────────────── */
const reynoldsPriorities = site("Reynolds · priorities", "https://www.lisafororegon.com/priorities");
const reynoldsAbout = site("Reynolds · about", "https://www.lisafororegon.com/about");
const cheeSurvey = questionnaire("Chee · Ballotpedia Candidate Connection survey", "https://ballotpedia.org/John_Chee", "2026 survey; reviewed September 21, 2026");
Object.assign(analysis, {
  "lisa-reynolds": {
    values: ["Child poverty", "Gun-violence prevention"],
    tradeoff: "A pediatrician’s prevention agenda: upstream spending against child poverty, gun-safety laws, and treatment plus supply interruption on fentanyl; the site sets a poverty target but not a next-term budget.",
    issues: {
      housing: { position: "Housing as a basic right: she voted for record shelter and housing funding and supported rent relief and eviction moratoriums to keep families housed.", source: reynoldsPriorities },
      safety: { position: "Gun-violence prevention (safe-storage and ghost-gun laws, community-violence grants, expanded extreme-risk orders, a purchase age of 21 with a few exceptions for hunting rifles) plus more addiction treatment and interrupting the fentanyl supply.", source: reynoldsPriorities },
      money: { position: "Upstream investment against child poverty (hunger, housing insecurity, childcare), including the refundable Child Tax Credit she helped pass.", source: reynoldsPriorities },
    },
    sources: [reynoldsPriorities, reynoldsAbout, statement(78)],
  },
  "john-a-n-chee": {
    values: ["Lower taxes", "Traditional family"],
    tradeoff: "His survey pairs sharp property- and inheritance-tax cuts with prosecuting vagrancy and open drug use and support for young men entering the trades; it does not say what state services would shrink to pay for the tax cuts.",
    issues: {
      housing: { position: "Cut burdensome regulations he says punish home builders, and remove barriers for local builders and first-time buyers.", source: cheeSurvey },
      safety: { position: "Prosecute vagrancy and open drug use.", source: cheeSurvey },
      money: { position: "Dramatically reduce property taxes, eliminate taxes on family inheritances, and cut regulations on small businesses.", source: cheeSurvey },
    },
    sources: [cheeSurvey],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("lisa-reynolds", "housing", "Supports record shelter and housing funding, rent relief and eviction moratoriums."),
  line("lisa-reynolds", "safety", "Supports safe-storage and ghost-gun laws, more addiction treatment, fentanyl interdiction."),
  line("lisa-reynolds", "money", "Wants upstream spending against child poverty, including the Child Tax Credit."),
  line("john-a-n-chee", "housing", "Would cut regulations on home builders and barriers for first-time buyers."),
  line("john-a-n-chee", "safety", "Would prosecute vagrancy and open drug use."),
  line("john-a-n-chee", "money", "Would cut property taxes sharply and eliminate inheritance taxes."),
);
chips.push(
  chip("lisa-reynolds", "housing", "Fund shelter and housing"), chip("lisa-reynolds", "safety", "Gun safety, treatment"), chip("lisa-reynolds", "money", "Child tax credit"),
  chip("john-a-n-chee", "housing", "Deregulate home building"), chip("john-a-n-chee", "safety", "Prosecute open drug use"), chip("john-a-n-chee", "money", "Cut property taxes"),
);
deliveries.push(
  ladder("lisa-reynolds", "housing"),
  ladder("lisa-reynolds", "safety", { how: step("Expand Extreme Risk Protection Orders, raise the firearm purchase age to 21 with hunting-rifle exceptions, fund youth prevention programs; cites $25 million secured for community-violence groups.", reynoldsPriorities) }),
  ladder("lisa-reynolds", "money", { how: step("The 2023 Child Tax Credit (HB 3235): a refundable $1,000 a year per young child for low-income families, plus a maternal-child health package.", reynoldsPriorities), measure: step("Has called for a 50% reduction in child poverty over four years.", reynoldsAbout) }),
  ladder("john-a-n-chee", "housing"), ladder("john-a-n-chee", "safety"), ladder("john-a-n-chee", "money"),
);
ownWords.push(
  own("lisa-reynolds", "Oregon State Senator Dr. Lisa Reynolds never stops working for her patients, her constituents, and her community.", 78, "First sentence of the filed statement; header fields, including a Community Involvement line, are skipped."),
  { candidateId: "john-a-n-chee", text: "Born and raised in the Bethany neighborhood of Portland, Oregon, John lives in the same house he grew up in.", rule: "questionnaire-opening", words: 20,
    source: { label: "Chee · Ballotpedia Candidate Connection survey", url: "https://ballotpedia.org/John_Chee", kind: "Candidate statement", date: "2026 survey; extracted September 21, 2026", note: "No filed pamphlet statement or campaign site was found; this is the first sentence of his own biography answer in the survey." } },
);
contacts.push(
  contact("lisa-reynolds", [web("https://www.lisafororegon.com/"), email("lisa@lisafororegon.com"), social("Facebook", "https://www.facebook.com/lisafororegon"), social("Instagram", "https://www.instagram.com/lisafororegon"), social("YouTube", "https://www.youtube.com/channel/UCJO4CLEIz67bNi8O4QhDNfg")],
    [site("Reynolds · site footer", "https://www.lisafororegon.com/", "The footer prints the campaign email and profile links; the site’s contact page returns 404.")]),
  contact("john-a-n-chee", [], [cheeSurvey], "No campaign site, filed pamphlet statement or campaign email was found; his Ballotpedia survey lists no website, and the ORESTAR filing page refuses automated requests."),
);
primary.push({ candidateId: "lisa-reynolds", sourceUrl: reynoldsPriorities.url }, { candidateId: "john-a-n-chee", sourceUrl: cheeSurvey.url });
roles.push({ candidateId: "lisa-reynolds", role: "Incumbent senator; pediatrician", from: "background" }, { candidateId: "john-a-n-chee", role: "Qualified general-election candidate", from: "background" });
ballots.push(ballot("oregon-state-senate-17"));
districts.push(district("oregon-state-senate-17", "SD17", "Bethany, Oak Hills, Cedar Mill, Forest Park, Linnton and Northwest Portland, including the Pearl District and the Northwest District."));
choices.push(choice("oregon-state-senate-17", "One candidate frames the term around child poverty, healthcare access and gun-violence prevention; the other around lower property and inheritance taxes, prosecuting street disorder and support for young men in the trades. His fuller brief is still open."));
Object.assign(portraits, { "lisa-reynolds": portrait("lisa-reynolds", "https://www.lisafororegon.com/", "Campaign photo · lisafororegon.com") });

/* ── Oregon Senate · District 19 ─────────────────────────────────────────── */
const wagnerPriorities = site("Wagner · priorities", "https://www.robwagnerfororegon.com/priorities/");
const dirksenHome = site("Dirksen · priorities", "https://www.marydirksen.com/");
Object.assign(analysis, {
  "rob-wagner": {
    values: ["Housing production", "Rights protections"],
    tradeoff: "He presents continued state investment and protections (schools, housing, healthcare, gun safety) as the answer to federal pressure and costs; his claims of enacted results still need separate record checks.",
    issues: {
      housing: { position: "Build more housing to close the shortage: supported legislation that eases construction and wants public, private and nonprofit partnerships that deliver results.", source: wagnerPriorities },
      safety: { position: "Gun safety as public safety: keep firearms out of schools, strong safe-storage standards, and a task force on community safety and firearm suicide; defend due process and immigrant neighbors’ rights.", source: wagnerPriorities },
      money: { position: "Make data centers pay their fair share of energy costs; opposes across-the-board tariffs that raise prices.", source: wagnerPriorities },
      climate: { position: "Defend the environment and natural resources in a changing climate, with permanent ongoing funding for conservation.", source: wagnerPriorities },
    },
    sources: [wagnerPriorities, site("Wagner · about", "https://www.robwagnerfororegon.com/about/"), statement(80)],
  },
  "mary-dirksen": {
    values: ["Tax relief", "Public safety"],
    tradeoff: "She promises tax relief and spending scrutiny alongside stronger consequences for repeat offenders and parental involvement in schools; the site does not name the tax changes or program cuts that would balance the budget.",
    issues: {
      safety: { position: "Support law enforcement, strengthen consequences for repeat offenders and put victims first, with accountability and appropriate remedies to address crime, addiction and hazards on the streets.", source: dirksenHome },
      money: { position: "Rein in wasteful spending, demand transparency for every tax dollar and pursue meaningful tax relief.", source: dirksenHome },
    },
    sources: [dirksenHome, site("Dirksen · about", "https://www.marydirksen.com/about"), statement(82)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("rob-wagner", "housing", "Supports more housing through eased construction rules and public-private-nonprofit partnerships."),
  line("rob-wagner", "safety", "Supports safe-storage rules, no guns in schools, and immigrant due process."),
  line("rob-wagner", "money", "Wants data centers to pay their share of energy costs; opposes tariffs."),
  line("rob-wagner", "climate", "Supports permanent conservation funding and environmental protection in a changing climate."),
  line("mary-dirksen", "safety", "Supports law enforcement, stronger consequences for repeat offenders and victims first."),
  line("mary-dirksen", "money", "Wants wasteful spending cut, tax-dollar transparency and tax relief."),
);
chips.push(
  chip("rob-wagner", "housing", "Build through partnerships"), chip("rob-wagner", "safety", "Gun safety, due process"), chip("rob-wagner", "money", "Data centers pay share"), chip("rob-wagner", "climate", "Ongoing conservation money"),
  chip("mary-dirksen", "safety", "Back police, victims first"), chip("mary-dirksen", "money", "Tax relief, less waste"),
);
deliveries.push(
  ladder("rob-wagner", "housing"),
  ladder("rob-wagner", "safety", { how: step("Chief author and sponsor of the legislation creating the Task Force on Community Safety and Firearm Suicide Prevention.", wagnerPriorities) }),
  ladder("rob-wagner", "money"),
  ladder("rob-wagner", "climate", { how: step("Passed new permanent, ongoing funding for conservation and a requirement that data centers pay their fair share of energy costs.", wagnerPriorities) }),
  ladder("mary-dirksen", "safety"), ladder("mary-dirksen", "money"),
);
ownWords.push(
  own("rob-wagner", "Having grown up in Oregon and raised my four kids here, our state’s future is personal for me.", 80, "First sentence of the filed statement; the heading “Our State, Our Future” is skipped."),
  own("mary-dirksen", "Oregon families deserve better. As a mother who adopted children from foster care, protecting kids and strengthening families is personal.", 82, "First two sentences of the filed statement (the first is under 12 words); header fields skipped."),
);
contacts.push(
  contact("rob-wagner", [web("https://www.robwagnerfororegon.com/")], [site("Wagner · campaign site", "https://www.robwagnerfororegon.com/", "The site prints a mailing box and an updates sign-up form but no email, phone, contact form or profile links.")]),
  contact("mary-dirksen", [web("https://www.marydirksen.com/"), form("https://www.marydirksen.com/", "Volunteer form")], [site("Dirksen · campaign site", "https://www.marydirksen.com/", "The home page holds a “Join my team” volunteer sign-up form; no email, phone or profile links are printed.")]),
);
primary.push({ candidateId: "rob-wagner", sourceUrl: wagnerPriorities.url }, { candidateId: "mary-dirksen", sourceUrl: dirksenHome.url });
roles.push({ candidateId: "mary-dirksen", role: "Former state senior policy analyst", from: "background" });
ballots.push(ballot("oregon-state-senate-19"));
districts.push(district("oregon-state-senate-19", "SD19", "Lake Oswego, West Linn, Tualatin, Durham, Rivergrove, Stafford, Dunthorpe and part of Southwest Portland."));
choices.push(choice("oregon-state-senate-19", "One candidate would keep the state investing in housing production, schools and rights protections; the other leads with lower taxes, spending scrutiny, public safety and parental involvement. Both call it affordability with different tools."));
Object.assign(portraits, {
  "rob-wagner": portrait("rob-wagner", "https://www.robwagnerfororegon.com/", "Campaign photo · robwagnerfororegon.com"),
  "mary-dirksen": portrait("mary-dirksen", "https://www.marydirksen.com/about", "Campaign photo · marydirksen.com"),
});

/* ── Oregon Senate · District 20 ─────────────────────────────────────────── */
const meekHome = site("Meek · campaign site", "https://www.votemarkmeek.com/");
const strohHome = site("Stroh · campaign site", "https://votestroh.com/");
Object.assign(analysis, {
  "mark-meek": {
    values: ["No tolls", "Services and enforcement"],
    tradeoff: "He combines a no-tolls stance and household cost relief with more housing, shelter, treatment and police resources; his account of past wins is a campaign claim, and the site does not say how the added services would be funded.",
    issues: {
      housing: { position: "Build more housing people can afford and expand shelter capacity and treatment programs to reduce homelessness.", source: meekHome },
      safety: { position: "Give law enforcement the resources to fight crime and hold offenders accountable, alongside gun-safety measures to keep weapons from violent criminals.", source: meekHome },
      money: { position: "Keep tolls off I-205 and lower household costs through Oregon’s Child Tax Credit and lower prices for housing, healthcare, prescriptions and childcare.", source: meekHome },
    },
    sources: [meekHome, statement(86)],
  },
  "michele-stroh": {
    values: ["No new taxes", "Enforcement and treatment"],
    tradeoff: "She would vote no on new taxes until Salem shows accountability for the money it has, staff police fully and cut red tape on shelters and housing; what evidence would satisfy her condition, and what she would cut first, remain open.",
    issues: {
      housing: { position: "Cut the red tape she says blocks shelter and housing from getting built, paired with addiction treatment and accountability for homelessness spending.", source: strohHome },
      safety: { position: "Fully staffed local police, real consequences for repeat offenders and stronger tools to stop fentanyl dealers.", source: strohHome },
      money: { position: "Vote no on new taxes until Salem shows it can spend the money it already has, with accountability.", source: strohHome },
    },
    sources: [strohHome, site("Stroh · record", "https://votestroh.com/micheles-record/"), statement(84)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("mark-meek", "housing", "Supports more affordable housing plus expanded shelter and treatment capacity."),
  line("mark-meek", "safety", "Supports police resources, offender accountability and gun-safety measures."),
  line("mark-meek", "money", "Opposes I-205 tolls; backs the Child Tax Credit and lower drug prices."),
  line("michele-stroh", "housing", "Would cut red tape blocking shelters and housing; pair treatment with spending accountability."),
  line("michele-stroh", "safety", "Wants fully staffed police, repeat-offender consequences and tools against fentanyl dealers."),
  line("michele-stroh", "money", "Would vote no on new taxes until Salem proves accountable spending."),
);
chips.push(
  chip("mark-meek", "housing", "Homes, shelter, treatment"), chip("mark-meek", "safety", "Police plus gun safety"), chip("mark-meek", "money", "No I-205 tolls"),
  chip("michele-stroh", "housing", "Cut shelter red tape"), chip("michele-stroh", "safety", "Fully staffed police"), chip("michele-stroh", "money", "No taxes until accountable"),
);
deliveries.push(
  ladder("mark-meek", "housing"), ladder("mark-meek", "safety"),
  ladder("mark-meek", "money", { how: step("Passed Oregon’s Child Tax Credit; keeps taking on pharmaceutical companies to lower prescription prices; says he ended ODOT’s I-205 tolling plans.", meekHome), measure: step("Says ending I-205 tolling saves families thousands of dollars a year.", meekHome) }),
  ladder("michele-stroh", "housing"), ladder("michele-stroh", "safety"), ladder("michele-stroh", "money"),
);
ownWords.push(
  own("mark-meek", "Senator Mark Meek is a father, veteran, and small business owner dedicated to our community.", 86, "First sentence of the filed statement; header fields, including a Military Experience line, are skipped."),
  own("michele-stroh", "My husband and I have raised five children in this state we love.", 84, "First sentence of the filed statement; the slogan “Vote Stroh=Sanity for Oregon” is skipped."),
);
contacts.push(
  contact("mark-meek", [web("https://www.votemarkmeek.com/"), email("info@votemarkmeek.com")], [site("Meek · site footer", "https://www.votemarkmeek.com/", "The footer prints the campaign email and a mailing address; there is an updates sign-up form but no profile links.")]),
  contact("michele-stroh", [web("https://votestroh.com/"), form("https://votestroh.com/", "Volunteer form"), social("Facebook", "https://www.facebook.com/VoteStroh"), social("Instagram", "https://www.instagram.com/votestroh2026"), social("YouTube", "https://www.youtube.com/@votestroh")],
    [site("Stroh · campaign site", "https://votestroh.com/", "The site holds a connect-and-volunteer pop-up form and links Facebook, Instagram and YouTube; no email or phone is printed.")]),
);
primary.push({ candidateId: "mark-meek", sourceUrl: meekHome.url }, { candidateId: "michele-stroh", sourceUrl: strohHome.url });
roles.push({ candidateId: "mark-meek", role: "Incumbent senator; business owner", from: "background" }, { candidateId: "michele-stroh", role: "School board member; childcare owner", from: "background" });
ballots.push(ballot("oregon-state-senate-20"));
districts.push(district("oregon-state-senate-20", "SD20", "Oregon City, Gladstone, Johnson City, Oatfield, Jennings Lodge and Happy Valley, with unincorporated Clackamas County toward Damascus and Clackamas Community College."));
choices.push(choice("oregon-state-senate-20", "Both candidates promise affordability and public safety. One pairs those goals with housing, healthcare and school investment; the other with a no-new-taxes pledge conditioned on accountability, stronger enforcement and relief for childcare providers."));
Object.assign(portraits, {
  "mark-meek": portrait("mark-meek", "https://www.votemarkmeek.com/", "Campaign photo · votemarkmeek.com"),
  "michele-stroh": portrait("michele-stroh", "https://votestroh.com/", "Campaign photo · votestroh.com"),
});

/* ── Oregon Senate · District 24 ─────────────────────────────────────────── */
const jamaHousing = site("Jama · housing and homelessness", "https://www.kaysejama.com/homelessness");
const jamaChildcare = site("Jama · childcare", "https://www.kaysejama.com/childcare");
const jamaEnvironment = site("Jama · environment and climate", "https://www.kaysejama.com/environment");
Object.assign(analysis, {
  "kayse-jama": {
    values: ["Housing investment", "Climate action"],
    tradeoff: "An investment-centered record: billions steered to housing, a childcare package and clean-electricity mandates; dollar amounts are not themselves evidence of homes built or homelessness reduced.",
    issues: {
      housing: { position: "Keep the state investing in housing production, rental assistance, eviction prevention and homeownership, and ease approvals for dense affordable housing.", source: jamaHousing },
      money: { position: "A refundable Oregon Kids Credit of up to $1,000 per young child for low-income families, plus state money to build and expand childcare.", source: jamaChildcare },
      climate: { position: "Bold climate action centered on the most affected communities: 100% clean electricity by 2040, a renters’ right to cooling, and heat and smoke protections for farmworkers.", source: jamaEnvironment },
    },
    sources: [site("Jama · accomplishments", "https://www.kaysejama.com/accomplishments"), jamaHousing, jamaChildcare, jamaEnvironment, statement(88)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("kayse-jama", "housing", "Supports continued state housing investment and easier approvals for dense affordable housing."),
  line("kayse-jama", "money", "Supports an Oregon Kids Credit of up to $1,000 and childcare construction money."),
  line("kayse-jama", "climate", "Supports 100% clean electricity by 2040 and a renters’ right to cooling."),
);
chips.push(chip("kayse-jama", "housing", "Keep funding housing"), chip("kayse-jama", "money", "Oregon Kids Credit"), chip("kayse-jama", "climate", "Clean power by 2040"));
deliveries.push(
  ladder("kayse-jama", "housing", { how: step("SB 1537 (2024) eases cities’ costs, streamlines approvals and creates a revolving loan fund for moderate-income housing; SB 1530 targets stability, homeownership and recovery housing.", jamaHousing), measure: step("Cites over $4.5 billion invested in housing solutions over three years as committee chair.", jamaHousing) }),
  ladder("kayse-jama", "money", { how: step("$75 million for the Oregon Kids Credit and $50 million for a Child Care Infrastructure Fund in the early-childhood budget package he supported.", jamaChildcare) }),
  ladder("kayse-jama", "climate", { how: step("Led a renters’ right-to-cooling law, helped distribute 3,000 air conditioners to low-income residents, and passed farmworker protections for wildfire smoke and heat.", jamaEnvironment), measure: step("Voted to mandate a 100% clean electricity system by 2040.", jamaEnvironment) }),
);
ownWords.push(own("kayse-jama", "For more than twenty years, I’ve worked alongside East Portland and Clackamas County communities as an organizer, advocate, nonprofit leader, and now as your State Senator.", 88, "First sentence of the filed statement; the heading “Kayse Jama: Delivering Opportunity for All” is skipped."));
contacts.push(contact("kayse-jama", [web("https://www.kaysejama.com/"), email("sen.jama@kaysejama.com"), form("https://www.kaysejama.com/get_involved", "Volunteer form"), social("Facebook", "https://www.facebook.com/kaysesolutions"), social("X", "https://twitter.com/kaysejama"), social("Instagram", "https://www.instagram.com/jamakayse/")],
  [site("Jama · site footer and Get Involved page", "https://www.kaysejama.com/get_involved", "The footer prints the email (decoded from the page’s email-protection markup) and profile links; the Get Involved page holds a volunteer form.")]));
primary.push({ candidateId: "kayse-jama", sourceUrl: "https://www.kaysejama.com/accomplishments" });
ballots.push(ballot("oregon-state-senate-24"));
districts.push(district("oregon-state-senate-24", "SD24", "East Portland east of I-205, Gresham, Wood Village, Fairview, Troutdale, the east side of Happy Valley, Damascus and Boring."));
choices.push(choice("oregon-state-senate-24", "One named candidate appears in the checked filings. Judge the priorities, the mechanisms behind them and what he says would show they worked, even without a listed opponent."));

/* ── Oregon Senate · District 26 ─────────────────────────────────────────── */
const bassettHome = site("Bassett · priorities", "https://www.bassettfororegon.com/");
const helfrichPriorities = site("Helfrich · priorities", "https://www.helfrichfororegon.com/priorities");
Object.assign(analysis, {
  "nicole-bassett": {
    values: ["Rural livability", "Clean-energy economy"],
    tradeoff: "She treats land-use protection and economic development as one project; the test is how the housing and energy growth she wants fits inside the farm and forest protections she would uphold.",
    issues: {
      housing: { position: "Fight for housing working people can afford while upholding the land-use laws that preserve farms and forests, even as housing and energy demand grow.", source: bassettHome },
      money: { position: "Address the rent, grocery and prescription costs stretching families, and prioritize a tax system that funds schools.", source: bassettHome },
      climate: { position: "Invest in wildfire prevention, home hardening and emergency preparedness, protect watersheds, and build a clean energy grid with local manufacturing, recycling and reuse jobs.", source: bassettHome },
    },
    sources: [bassettHome, site("Bassett · about", "https://www.bassettfororegon.com/about"), statement(90)],
  },
  "jeff-helfrich": {
    values: ["Limited government", "Police funding"],
    tradeoff: "Broad commitments to tax relief, a balanced budget and police funding, with conservative positions on abortion and guns; the site does not specify which taxes, services or abortion laws would change.",
    issues: {
      safety: { position: "Properly fund and support law enforcement so officers can serve and protect communities.", source: helfrichPriorities },
      money: { position: "Balance the state budget and provide tax relief for families; government should live within a budget as families do.", source: helfrichPriorities },
    },
    sources: [helfrichPriorities, site("Helfrich · Meet Jeff", "https://www.helfrichfororegon.com/meet-jeff"), statement(92)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("nicole-bassett", "housing", "Wants housing working people can afford within existing farm and forest protections."),
  line("nicole-bassett", "money", "Wants lower rent, grocery and prescription costs and a tax system funding schools."),
  line("nicole-bassett", "climate", "Supports wildfire prevention, home hardening, watershed protection and a clean energy grid."),
  line("jeff-helfrich", "safety", "Supports properly funding law enforcement."),
  line("jeff-helfrich", "money", "Would balance the budget and provide tax relief for families."),
);
chips.push(
  chip("nicole-bassett", "housing", "Homes within land-use law"), chip("nicole-bassett", "money", "Lower everyday costs"), chip("nicole-bassett", "climate", "Wildfire, clean grid"),
  chip("jeff-helfrich", "safety", "Fund law enforcement"), chip("jeff-helfrich", "money", "Balance budget, tax relief"),
);
deliveries.push(ladder("nicole-bassett", "housing"), ladder("nicole-bassett", "money"), ladder("nicole-bassett", "climate"), ladder("jeff-helfrich", "safety"), ladder("jeff-helfrich", "money"));
ownWords.push(
  own("nicole-bassett", "Families, workers, and small businesses are being crushed by rising prices, tariffs, and taxes.", 90, "First sentence of the filed statement; header fields skipped."),
  own("jeff-helfrich", "Salem has lost focus on the basics. Too many political experiments have made life harder and more expensive for Oregon families.", 92, "First two sentences of the filed statement (the first is under 12 words); the heading “GETTING OREGON BACK TO BASICS” is skipped."),
);
contacts.push(
  contact("nicole-bassett", [web("https://www.bassettfororegon.com/"), form("https://www.bassettfororegon.com/contact", "Volunteer form"), social("Instagram", "https://www.instagram.com/bassettfororegon/"), social("Facebook", "https://www.facebook.com/people/Nicole-Bassett/61577481882736/")],
    [site("Bassett · volunteer page", "https://www.bassettfororegon.com/contact", "The page holds a volunteer form; profile links are in the footer. No email or phone is printed.")]),
  contact("jeff-helfrich", [web("https://www.helfrichfororegon.com/"), email("info@jeffhelfrich.com"), social("Facebook", "https://www.facebook.com/JeffHelfrichfororegon"), social("Instagram", "https://www.instagram.com/jeffhelfrichfororegon"), social("YouTube", "https://www.youtube.com/@JeffHelfrichforOR"), social("X", "https://x.com/JeffHelfrichOR")],
    [site("Helfrich · site footer", "https://www.helfrichfororegon.com/", "The footer prints a Hood River mailing address, the campaign email and the profile links.")]),
);
primary.push({ candidateId: "nicole-bassett", sourceUrl: bassettHome.url }, { candidateId: "jeff-helfrich", sourceUrl: helfrichPriorities.url });
roles.push({ candidateId: "nicole-bassett", role: "Sustainable-manufacturing business founder", from: "background" }, { candidateId: "jeff-helfrich", role: "State representative; former officer", from: "background" });
ballots.push(ballot("oregon-state-senate-26"));
districts.push(district("oregon-state-senate-26", "SD26", "The Columbia Gorge and Mount Hood country: Hood River, Cascade Locks, Mosier, The Dalles, Parkdale, Sandy, Estacada, Beavercreek, Mulino, Canby and Mount Hood Villages."));
choices.push(choice("oregon-state-senate-26", "One candidate leads with rural services, land-use protection and clean-energy investment; the other with tax relief, policing and conservative positions on abortion and firearms. Both name jobs and local opportunity as priorities."));
Object.assign(portraits, {
  "nicole-bassett": portrait("nicole-bassett", "https://www.bassettfororegon.com/", "Campaign photo · bassettfororegon.com"),
  "jeff-helfrich": portrait("jeff-helfrich", "https://www.helfrichfororegon.com/", "Campaign photo · helfrichfororegon.com"),
});

/* ── Oregon House · District 26 ──────────────────────────────────────────── */
const rsPlan = site("Rieke Smith · A Plan for Action", "https://www.votesueriekesmith.com/a-plan-for-action");
const carkinIssues = site("Carkin · issues", "https://www.stephaniefororegon.com/issues");
const terrioPolicy = site("Terrio · policy", "https://www.terrioforus.com/policy");
Object.assign(analysis, {
  "sue-r-rieke-smith": {
    values: ["Public services", "Rights protections"],
    tradeoff: "Public investment and protections for schools, tenants and patients, funded by the state; her past graduation-rate claims need independent review, and the site does not rank which expansion comes first.",
    issues: {
      housing: { position: "Expand affordable housing, protect tenants and prevent homelessness through locally informed policy, partnering with cities and nonprofits on mental illness, addiction and economic instability.", source: rsPlan },
      safety: { position: "Transparent, community-based public safety: address gun violence, give law enforcement training and tools, reduce crime and support victims with resources matched to suburban needs.", source: rsPlan },
      money: { position: "Priority on increased state investment in public schools (opposing private-school vouchers) and on lowering health-care premiums and out-of-pocket costs.", source: rsPlan },
      climate: { position: "Science-based climate policy: a transition to 100% clean and renewable energy and sustainable infrastructure, plus fixing roads and easing congestion locally.", source: rsPlan },
    },
    sources: [rsPlan, site("Rieke Smith · about", "https://www.votesueriekesmith.com/about-rep-sue"), statement(179)],
  },
  "stephanie-carkin": {
    values: ["Business climate", "Performance budgeting"],
    tradeoff: "She would grow the tax base through a friendlier business climate and cut administrative cost before asking taxpayers for more; the site does not quantify savings or list the regulations to remove.",
    issues: {
      money: { position: "No new burdens until government proves it spends existing money well: audits of underperforming programs, performance-based budgeting and more agency oversight, with a bigger tax base from a business-friendly Oregon.", source: carkinIssues },
      climate: { position: "Focus transportation dollars on maintaining roads, bridges and critical infrastructure, cutting administrative overhead rather than raising the gas tax.", source: carkinIssues },
    },
    sources: [carkinIssues, site("Carkin · about", "https://www.stephaniefororegon.com/about"), statement(175)],
  },
  "steph-terrio": {
    values: ["Human dignity", "Anti-corporate"],
    tradeoff: "A philosophy of representation (dignity, plain legislation, naming manipulation) with a few concrete proposals, several federal; the policy page names ideas rather than state bills or costs.",
    issues: {
      housing: { position: "Every citizen should be afforded a place to live. She would support a program to boost building-supply production, which could require timber companies to supply renewable plant material for temporary housing.", source: terrioPolicy },
      money: { position: "Expansive social programs and publicly funded health care, financed in part by a 1.5% corporate tax increase and drug-price negotiation.", source: terrioPolicy },
      climate: { position: "Treat the climate crisis as an emergency now, and regulate AI immediately, citing data centers’ fresh-water use and unchecked surveillance.", source: terrioPolicy },
    },
    sources: [terrioPolicy, site("Terrio · about", "https://www.terrioforus.com/about"), statement(177)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("sue-r-rieke-smith", "housing", "Supports expanding affordable housing, protecting tenants and partnering with cities on root causes."),
  line("sue-r-rieke-smith", "safety", "Supports community-based safety, gun-violence prevention and trained, equipped police."),
  line("sue-r-rieke-smith", "money", "Wants more state school investment, no vouchers, and lower health-care costs."),
  line("sue-r-rieke-smith", "climate", "Supports 100% clean energy, sustainable infrastructure and local road fixes."),
  line("stephanie-carkin", "money", "Wants audits and performance budgeting before any new taxpayer burdens."),
  line("stephanie-carkin", "climate", "Would put transportation money into roads and bridges, not a higher gas tax."),
  line("steph-terrio", "housing", "Wants housing guaranteed; timber companies supplying material for temporary homes."),
  line("steph-terrio", "money", "Supports public health care funded partly by a 1.5% corporate tax increase."),
  line("steph-terrio", "climate", "Wants the climate crisis treated as an emergency and AI regulated now."),
);
chips.push(
  chip("sue-r-rieke-smith", "housing", "Protect tenants, partners"), chip("sue-r-rieke-smith", "safety", "Community-based safety"), chip("sue-r-rieke-smith", "money", "Fund schools, no vouchers"), chip("sue-r-rieke-smith", "climate", "100% clean energy"),
  chip("stephanie-carkin", "money", "Audit before taxing"), chip("stephanie-carkin", "climate", "Roads, not gas tax"),
  chip("steph-terrio", "housing", "Housing as a guarantee"), chip("steph-terrio", "money", "Corporate tax for care"), chip("steph-terrio", "climate", "Climate crisis, AI rules"),
);
deliveries.push(
  ladder("sue-r-rieke-smith", "housing", { how: step("Partner with cities and nonprofits to address root causes such as mental illness, addiction and economic instability.", rsPlan) }),
  ladder("sue-r-rieke-smith", "safety"), ladder("sue-r-rieke-smith", "money"), ladder("sue-r-rieke-smith", "climate"),
  ladder("stephanie-carkin", "money", { how: step("Audits of underperforming programs, performance-based budgeting and greater oversight of state agencies; cut red tape and streamline regulations for employers.", carkinIssues) }),
  ladder("stephanie-carkin", "climate", { how: step("Reduce administrative overhead and improve project management, and favor practical road and bridge maintenance over costly projects with limited public use.", carkinIssues) }),
  ladder("steph-terrio", "housing", { how: step("A minimum requirement for timber companies and corporations to supply renewable plant material for temporary housing or research.", terrioPolicy) }),
  ladder("steph-terrio", "money", { how: step("A 1.5% corporate tax increase and drug-company price negotiations to fund coverage for uninsured and lower-income people.", terrioPolicy) }),
  ladder("steph-terrio", "climate"),
);
ownWords.push(
  own("sue-r-rieke-smith", "Dr. Sue Rieke Smith has spent her life serving Oregonians, first as an emergency room trauma nurse, then as a teacher, principal, and Tigard-Tualatin School District Superintendent.", 179, "First sentence of the filed statement; the label line “Nurse. Teacher. Advocate.” is skipped."),
  own("stephanie-carkin", "I was born and raised in Oregon, and learned the value of hard work and personal responsibility.", 175, "First sentence of the filed statement; header fields skipped."),
  own("steph-terrio", "Oregon's working class must feel represented. I'm running for House District 26 because we the people deserve legislators who do more than listen.", 177, "First two sentences of the filed statement (the first is under 12 words); header fields skipped."),
);
contacts.push(
  contact("sue-r-rieke-smith", [web("https://www.votesueriekesmith.com/"), email("sue@votesueriekesmith.com"), form("https://docs.google.com/forms/d/e/1FAIpQLSe9Ukp_yHXRYXirsFGoYYdHDPi7yKN6hr89la33_Ykf-tZY5Q/viewform", "Volunteer form"), social("Instagram", "https://www.instagram.com/sueriekesmithforhd26"), social("Facebook", "https://www.facebook.com/sueriekesmithforhd26")],
    [site("Rieke Smith · site footer", "https://www.votesueriekesmith.com/", "The footer prints the campaign email and Instagram handle; the “Fight with Rep Sue” link opens a Google volunteer form.")]),
  contact("stephanie-carkin", [web("https://www.stephaniefororegon.com/"), form("https://www.stephaniefororegon.com/join", "Volunteer form"), social("Facebook", "https://www.facebook.com/share/1CD7gz4QZb/"), social("Instagram", "https://www.instagram.com/stephaniecarkinhd26")],
    [site("Carkin · Get Involved page", "https://www.stephaniefororegon.com/join", "The page holds a volunteer sign-up form and profile links; no email or phone is printed.")]),
  contact("steph-terrio", [web("https://www.terrioforus.com/"), form("https://www.terrioforus.com/contact", "Contact form")], [site("Terrio · contact page", "https://www.terrioforus.com/contact", "The page holds a contact form; no email, phone or profile links are printed.")]),
);
primary.push({ candidateId: "sue-r-rieke-smith", sourceUrl: rsPlan.url }, { candidateId: "stephanie-carkin", sourceUrl: carkinIssues.url }, { candidateId: "steph-terrio", sourceUrl: terrioPolicy.url });
roles.push({ candidateId: "sue-r-rieke-smith", role: "Incumbent representative; former superintendent", from: "background" });
ballots.push(ballot("oregon-state-house-26"));
districts.push(district("oregon-state-house-26", "HD26", "Sherwood, Wilsonville, King City and Bull Mountain, with the rural Washington and Yamhill County land between them and Newberg."));
choices.push(choice("oregon-state-house-26", "One candidate leads with public services and rights protections, another with business conditions and performance budgeting, and a third with a dignity-centered critique of shareholder-first capitalism that carries less policy detail."));

/* ── Oregon House · District 29 ──────────────────────────────────────────── */
const mclainPriorities = site("McLain · priorities", "https://www.susanmclain.org/priorities/");
const schimmelSurvey = questionnaire("Schimmel · Ballotpedia Candidate Connection survey", "https://ballotpedia.org/Brian_Schimmel", "2026 survey; reviewed September 21, 2026");
const schimmelHome = site("Schimmel · campaign site", "https://brianschimmel.org/", `${NOTE} The platform section lists six headings (education, housing, local economy, infrastructure, land stewardship, civil liberties and public safety) without policy text.`);
Object.assign(analysis, {
  "susan-mclain": {
    values: ["Public education", "Infrastructure"],
    tradeoff: "Large infrastructure commitments (a new Columbia River bridge, transit, road maintenance) alongside conservation, schools and tax credits; funding and cost-overrun risk remain the central questions.",
    issues: {
      housing: { position: "Major state investment in housing production to bring prices down, and accessible pathways to homeownership.", source: mclainPriorities },
      safety: { position: "Hold ICE and law-enforcement agents accountable, strengthen civil-rights protections and support gun-safety laws.", source: mclainPriorities },
      money: { position: "Lower taxes for low- and moderate-income families through the Earned Income Tax Credit, and stop data centers from passing energy costs to consumers.", source: mclainPriorities },
      climate: { position: "More public transit, bike and pedestrian facilities, safety improvements and road maintenance; a new earthquake-ready Columbia River bridge; protect farmland, clean air and water.", source: mclainPriorities },
    },
    sources: [mclainPriorities, site("McLain · Susan’s Story", "https://www.susanmclain.org/susans-story/"), statement(192)],
  },
  "brian-schimmel": {
    values: ["Implementation", "Fiscal discipline"],
    tradeoff: "He runs on making state policy work in practice (funding, coordination, measurable results) from housing and public-safety administration experience; his site lists platform headings without positions, so most issues stay open.",
    issues: {
      money: { position: "Public resources should be used carefully and produce measurable results, with transparency, oversight and a willingness to adjust programs that are not working.", source: schimmelSurvey },
    },
    sources: [schimmelSurvey, schimmelHome, site("Schimmel · about", "https://brianschimmel.org/about-brian/"), statement(190)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("susan-mclain", "housing", "Supports major state investment in housing production and homeownership pathways."),
  line("susan-mclain", "safety", "Supports ICE and police accountability, civil-rights protections and gun-safety laws."),
  line("susan-mclain", "money", "Supports the Earned Income Tax Credit; opposes data centers shifting energy costs."),
  line("susan-mclain", "climate", "Supports transit, bike-pedestrian facilities, road maintenance and a new Columbia bridge."),
  line("brian-schimmel", "money", "Wants public money tied to measurable results, transparency and scrutiny."),
);
chips.push(
  chip("susan-mclain", "housing", "Invest in production"), chip("susan-mclain", "safety", "ICE, police accountability"), chip("susan-mclain", "money", "Earned Income Tax Credit"), chip("susan-mclain", "climate", "Transit and new bridge"),
  chip("brian-schimmel", "money", "Measurable results"),
);
deliveries.push(
  ladder("susan-mclain", "housing"), ladder("susan-mclain", "safety"),
  ladder("susan-mclain", "money", { how: step("Voted for the largest Earned Income Tax Credit increase in state history and sponsored a bill banning data centers from passing energy costs to consumers.", mclainPriorities), measure: step("Says the credit increase lowered taxes for more than 200,000 low- and moderate-income families.", mclainPriorities) }),
  ladder("susan-mclain", "climate"),
  ladder("brian-schimmel", "money"),
);
ownWords.push(
  own("susan-mclain", "Representative Susan McLain spent 42 years teaching students and raising her family in our community.", 192, "First sentence of the filed statement; two heading lines are skipped."),
  own("brian-schimmel", "Government should work as well as the people it serves. As a Councilor, I see firsthand where state policy impacts people’s lives—and where implementation, funding, and local realities do not align.", 190, "First two sentences of the filed statement (the first is under 12 words); header fields, including a Community & Professional Experience line, are skipped."),
);
contacts.push(
  contact("susan-mclain", [web("https://www.susanmclain.org/"), email("info@susanmclain.org"), form("https://forms.gle/HPSY4xzSeVCk4bNk9", "Volunteer form"), social("Facebook", "https://www.facebook.com/SusanMcLainforOregon"), social("YouTube", "https://www.youtube.com/channel/UCBdxjCCNoj8vtRVEv0KUUgQ")],
    [site("McLain · site footer", "https://www.susanmclain.org/", "The footer prints “E-mail: info@susanmclain.org” and a Hillsboro mailing box; the header’s email icon links info@susanmclain.com instead, so the printed address is recorded and the discrepancy noted.")]),
  contact("brian-schimmel", [web("https://brianschimmel.org/"), email("brian@brianschimmel.org"), social("Facebook", "https://www.facebook.com/brian.schimmel.35"), social("X", "https://x.com/BrianSchim19211"), social("LinkedIn", "https://www.linkedin.com/in/brianschimmel/"), social("TikTok", "https://www.tiktok.com/@brianhschimmel"), social("Instagram", "https://www.instagram.com/brian.schimmel.35/")],
    [site("Schimmel · campaign site", "https://brianschimmel.org/", "The “Get In Touch” button opens the campaign email; the header links five profiles.")]),
);
primary.push({ candidateId: "susan-mclain", sourceUrl: mclainPriorities.url }, { candidateId: "brian-schimmel", sourceUrl: schimmelSurvey.url });
roles.push({ candidateId: "susan-mclain", role: "Incumbent representative; former teacher", from: "background" }, { candidateId: "brian-schimmel", role: "Qualified general-election candidate", from: "background" });
ballots.push(ballot("oregon-state-house-29"));
districts.push(district("oregon-state-house-29", "HD29", "Forest Grove, Cornelius, Dilley, Gaston and the western edge of Hillsboro."));
choices.push(choice("oregon-state-house-29", "One candidate leads with public education, infrastructure, civil rights and housing investment; the other with implementation, fiscal discipline and measurable results. His fuller brief is still open, so compare what each has actually published."));

/* ── Oregon House · District 40 ──────────────────────────────────────────── */
const bakerIssues = site("Baker · issues", "https://voteadambaker.com/issues/");
const sugarPriorities = site("Sugar · priorities", "https://www.sugarfororegon.com/priorities");
const hubbellPlatform = site("Hubbell · platform", "https://hubbell4health.com/platform");
const hubbellHome = site("Hubbell · three pillars", "https://hubbell4health.com/");
Object.assign(analysis, {
  "adam-baker": {
    values: ["Audit before taxing", "Enforcement with treatment"],
    tradeoff: "Cost restraint (no new taxes without proven results, no tolls) alongside more treatment, inpatient mental-health capacity and police resources; the added services and the savings are separate commitments whose budgets need reconciling.",
    issues: {
      housing: { position: "Cut the excessive fees, permitting delays and red tape he says government adds to a home’s price, and support development that increases supply of all housing types, especially starter homes.", source: bakerIssues },
      safety: { position: "Back police and first responders with resources and training, hold chronic offenders accountable and reduce encampments, while expanding recovery programs and evidence-based mental-health care including inpatient capacity.", source: bakerIssues },
      money: { position: "No new taxes without proven efficiency and results, keep tolls off I-205, and protect ratepayers from utility bills that shift big users’ costs onto households.", source: bakerIssues },
    },
    sources: [bakerIssues, site("Baker · Meet Adam", "https://voteadambaker.com/meet/"), statement(226)],
  },
  "michael-w-sugar": {
    values: ["Lower costs", "Public services"],
    tradeoff: "Tax reform that shifts burden toward the wealthiest, plus stronger services and housing help; the site sets priorities and a delivery standard for transportation projects but not a fiscal balance.",
    issues: {
      housing: { position: "Make homeownership more affordable with housing options for first-time buyers and working families, bringing local input to statewide housing decisions.", source: sugarPriorities },
      safety: { position: "Support police, firefighters and emergency responders, expand mental-health supports and strengthen crime prevention.", source: sugarPriorities },
      money: { position: "Major tax reform so billionaires and the wealthiest corporations pay their fair share while working families’ burden falls, with responsible budgeting.", source: sugarPriorities },
      climate: { position: "Toll-free roads with transportation projects delivered on time and on budget, plus wildfire brush clearing and earthquake-resistant bridges, water systems and emergency centers.", source: sugarPriorities },
    },
    sources: [sugarPriorities, site("Sugar · about", "https://www.sugarfororegon.com/about"), statement(224)],
  },
  "pat-hubbell": {
    values: ["Fiscal discipline", "Pharmacy access"],
    tradeoff: "A pharmacist’s platform: balance the budget through audits and program cuts without raising taxes, fight pharmacy benefit managers, and pair treatment with strict enforcement; the site names local projects but no housing policy.",
    issues: {
      safety: { position: "Couple compassionate mental-health and addiction recovery with strict enforcement of public-safety laws.", source: hubbellHome },
      money: { position: "Balance the state budget without raising taxes on working families by auditing departments, eliminating waste and redundant programs, and simplifying regulations, without slashing vital services.", source: hubbellPlatform },
      climate: { position: "A new Clackamas River pedestrian bridge linking Oregon City and Gladstone, and Gladstone’s Town Center streetscape work with state climate-friendly-communities money confirmed.", source: hubbellHome },
    },
    sources: [hubbellHome, hubbellPlatform, site("Hubbell · about", "https://hubbell4health.com/about"), statement(228)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("adam-baker", "housing", "Would cut excessive fees, approval delays and red tape; supports more starter homes."),
  line("adam-baker", "safety", "Supports police resources and offender accountability paired with treatment and inpatient care."),
  line("adam-baker", "money", "Opposes new taxes without proven results and I-205 tolls; wants ratepayer protection."),
  line("michael-w-sugar", "housing", "Supports housing options for first-time buyers with local input on state decisions."),
  line("michael-w-sugar", "safety", "Supports police, firefighters, mental-health supports and crime prevention."),
  line("michael-w-sugar", "money", "Wants tax reform shifting burden to billionaires and large corporations."),
  line("michael-w-sugar", "climate", "Supports toll-free roads, on-time projects, wildfire clearing and earthquake-ready infrastructure."),
  line("pat-hubbell", "safety", "Wants mental-health and addiction recovery paired with strict enforcement."),
  line("pat-hubbell", "money", "Would balance the budget through audits and program cuts, without raising working families' taxes."),
  line("pat-hubbell", "climate", "Supports a Clackamas River pedestrian bridge and Gladstone streetscape work."),
);
chips.push(
  chip("adam-baker", "housing", "Cut fees and delays"), chip("adam-baker", "safety", "Enforcement plus treatment"), chip("adam-baker", "money", "Audit before taxing"),
  chip("michael-w-sugar", "housing", "First-time buyer options"), chip("michael-w-sugar", "safety", "Responders, prevention"), chip("michael-w-sugar", "money", "Wealthy pay fair share"), chip("michael-w-sugar", "climate", "Toll-free, on-time roads"),
  chip("pat-hubbell", "safety", "Recovery plus enforcement"), chip("pat-hubbell", "money", "Audits, cut waste"), chip("pat-hubbell", "climate", "Clackamas River footbridge"),
);
deliveries.push(
  ladder("adam-baker", "housing", { how: step("Cut excessive fees, permitting delays and red tape that he says can add six figures to a new home, and back responsible development across housing types.", bakerIssues) }),
  ladder("adam-baker", "safety", { how: step("Fund evidence-based mental-health care including prevention and inpatient capacity, expand recovery programs that work, and measure outcomes, ending programs that fail.", bakerIssues) }),
  ladder("adam-baker", "money", { how: step("Audit before asking: every agency shows measurable results before requesting more money; push ratepayer protection so big users’ costs are not shifted onto families and seniors.", bakerIssues) }),
  ladder("michael-w-sugar", "housing"), ladder("michael-w-sugar", "safety"), ladder("michael-w-sugar", "money"),
  ladder("michael-w-sugar", "climate", { how: step("Brush clearing for wildfire prevention and investment now in earthquake-resistant bridges, buildings, water systems and emergency response centers.", sugarPriorities), measure: step("Transportation projects delivered on time and on budget.", sugarPriorities) }),
  ladder("pat-hubbell", "safety"),
  ladder("pat-hubbell", "money", { how: step("Audit departments to eliminate administrative bloat and hold department heads accountable for measurable, efficient outcomes, while keeping vital services.", hubbellPlatform) }),
  ladder("pat-hubbell", "climate", { how: step("Verify that state appropriations to Gladstone under Climate Friendly and Equitable Communities rules are received, and support the OC 2040 comprehensive plan.", hubbellHome) }),
);
ownWords.push(
  own("adam-baker", "\"As a 26-year police officer, detective, and hostage negotiator, I'm running for State Representative because our communities deserve leadership that understands the real challenges families face every day, not more of the same Salem status quo.\"", 226, "The filed statement opens with this sentence in quotation marks, printed without an attribution line; header fields skipped."),
  own("michael-w-sugar", "It’s time to work together to solve problems for our community and demand that Salem actually solve problems for our state.", 224, "First sentence of the filed statement; the heading “MICHAEL SUGAR: UNITING COMMUNITIES TO SOLVE PROBLEMS” is skipped."),
  own("pat-hubbell", "Private equity groups have no place in healthcare. Pharmacy Benefit Managers are destroying independent pharmacies across the nation refusing to offer fair contracts and act as fiduciaries to the residents of Oregon.", 228, "First two sentences of the filed statement (the first is under 12 words); the run-in labels “3 pillar plan…” and “Pillar 1: …” are skipped."),
);
contacts.push(
  contact("adam-baker", [web("https://voteadambaker.com/"), form("https://voteadambaker.com/volunteer/", "Contact form"), social("Facebook", "https://www.facebook.com/share/1CPJ8Hm8Do/?mibextid=wwXIfr"), social("Instagram", "https://www.instagram.com/voteadambaker/")],
    [site("Baker · contact and volunteer page", "https://voteadambaker.com/volunteer/", "The page holds the site’s contact/volunteer form; profile links are in the footer. No email or phone is printed.")]),
  contact("michael-w-sugar", [web("https://www.sugarfororegon.com/"), email("Info@SugarforOregon.com"), form("https://www.sugarfororegon.com/contact", "Contact form"), social("Facebook", "https://www.facebook.com/sugarfororegon"), social("Instagram", "https://www.instagram.com/sugarfororegon"), social("TikTok", "https://www.tiktok.com/@sugar.for.oregon")],
    [site("Sugar · contact page", "https://www.sugarfororegon.com/contact", "The page holds a contact form; the footer prints the campaign email and profile links.")]),
  contact("pat-hubbell", [web("https://hubbell4health.com/"), form("https://hubbell4health.com/get-involved", "Volunteer form")], [site("Hubbell · Get Involved page", "https://hubbell4health.com/get-involved", "The page holds a volunteer form; no email, phone or profile links are printed anywhere on the site.")]),
);
primary.push({ candidateId: "adam-baker", sourceUrl: bakerIssues.url }, { candidateId: "michael-w-sugar", sourceUrl: sugarPriorities.url }, { candidateId: "pat-hubbell", sourceUrl: hubbellPlatform.url });
roles.push({ candidateId: "adam-baker", role: "Retired police officer; real estate", from: "background" }, { candidateId: "michael-w-sugar", role: "Teacher, debate coach, union leader", from: "background" }, { candidateId: "pat-hubbell", role: "Qualified general-election candidate", from: "background" });
ballots.push(ballot("oregon-state-house-40"));
districts.push(district("oregon-state-house-40", "HD40", "Oregon City, Gladstone, Jennings Lodge, Oatfield and Johnson City."));
choices.push(choice("oregon-state-house-40", "Two candidates oppose tolls and stress affordability and safety: one specifies audits, permitting cuts and enforcement paired with treatment; another stresses services, housing help and reproductive rights. A third runs on budget discipline and pharmacy access."));

/* ── Oregon House · District 51 ──────────────────────────────────────────── */
const meadHome = site("Mead · priorities", "https://www.darlameadfororegon.com/");
const meadEcon = site("Mead · creating local economic opportunity", "https://www.darlameadfororegon.com/issues/creating-local-economic-opportunity");
const meadEnv = site("Mead · enforcing environmental protections", "https://www.darlameadfororegon.com/issues/enforcing-environmental-protections");
const bunchIssues = site("Bunch · issues", "https://www.mattbunch51.com/issues");
Object.assign(analysis, {
  "darla-mead": {
    values: ["Healthcare access", "Rural opportunity"],
    tradeoff: "Expanded care and rural development with environmental protection; separating health coverage from employment needs a financing and delivery model the site does not yet give.",
    issues: {
      housing: { position: "New construction that fits the community's affordability standards, not just profitability for developers; striving to stay within existing urban growth boundaries by balancing new construction with reusing buildings; upgrading infrastructure; and pathways from subsidized housing to stable homes.", source: meadEcon },
      money: { position: "Lower household health costs by making insurance access independent of employment.", source: meadHome },
      climate: { position: "Support Oregon’s clean-energy goals, preserve and expand incentives for the shift to clean-energy transportation, protect forests and watersheds, and reduce wildfire risk; she says existing rules are insufficient to manage data centers that deplete fresh water.", source: meadEnv },
    },
    sources: [meadHome, meadEcon, meadEnv, site("Mead · Meet Darla", "https://www.darlameadfororegon.com/meet_darla"), statement(263)],
  },
  "matt-bunch": {
    values: ["Local control", "Police support"],
    tradeoff: "Local discretion over growth, police support and no transportation-tax increases; the site does not say how housing demand or road needs would be met without new revenue, and it describes him as the sitting representative while the research object lists him as a candidate.",
    issues: {
      housing: { position: "Let residents and local leaders decide housing, growth and land use rather than state-required high-density development.", source: bunchIssues },
      safety: { position: "Give law-enforcement officers the tools, training and support they need, with community-based solutions rather than new bureaucracy.", source: bunchIssues },
      money: { position: "Opposes the transportation package’s gas-tax, vehicle-fee and payroll-tax increases; cut waste instead of adding taxes.", source: bunchIssues },
      climate: { position: "Prioritize road maintenance and safety improvements over new transportation taxes.", source: bunchIssues },
    },
    sources: [bunchIssues, site("Bunch · about", "https://www.mattbunch51.com/about"), statement(261)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("darla-mead", "housing", "Wants new homes built to community affordability standards, ideally inside existing growth boundaries."),
  line("darla-mead", "money", "Wants health coverage independent of employment."),
  line("darla-mead", "climate", "Supports clean-energy goals, forest and watershed protection, and stronger data-center rules."),
  line("matt-bunch", "housing", "Would let local communities decide housing and growth, not state density rules."),
  line("matt-bunch", "safety", "Supports tools, training and support for law enforcement."),
  line("matt-bunch", "money", "Opposes the gas-tax, vehicle-fee and payroll-tax increases; cut waste first."),
  line("matt-bunch", "climate", "Would prioritize road maintenance and safety over new transportation taxes."),
);
chips.push(
  chip("darla-mead", "housing", "Community-affordable homes"), chip("darla-mead", "money", "Coverage regardless of job"), chip("darla-mead", "climate", "Clean energy, forests"),
  chip("matt-bunch", "housing", "Local control of growth"), chip("matt-bunch", "safety", "Tools for police"), chip("matt-bunch", "money", "No transportation taxes"), chip("matt-bunch", "climate", "Maintain roads first"),
);
deliveries.push(
  ladder("darla-mead", "housing", { how: step("Stay within existing urban growth boundaries, repurpose existing buildings where possible, upgrade outdated infrastructure to support development, and limit corporate short-term rentals.", meadEcon) }),
  ladder("darla-mead", "money"),
  ladder("darla-mead", "climate", { how: step("Preserve and expand incentives for clean-energy transportation, expand transmission from remote to populated areas, and enforce existing environmental laws.", meadEnv) }),
  ladder("matt-bunch", "housing"), ladder("matt-bunch", "safety"),
  ladder("matt-bunch", "money", { how: step("Cut waste and prioritize essential infrastructure, road maintenance and safety improvements, instead of adding new taxes.", bunchIssues) }),
  ladder("matt-bunch", "climate"),
);
ownWords.push(
  own("darla-mead", "As a lifelong Clackamas County resident and registered nurse, I’ve dedicated my life to serving our communities.", 263, "First sentence of the filed statement; the heading “CARING FOR OUR COMMUNITY, STRENGTHENING OUR FUTURE” is skipped."),
  own("matt-bunch", "It has been a true honor to serve as your State Representative.", 261, "First sentence of the filed statement (exactly 12 words, so one sentence); header fields skipped."),
);
contacts.push(
  contact("darla-mead", [web("https://www.darlameadfororegon.com/"), form("https://www.darlameadfororegon.com/contact", "Contact form"), social("Facebook", "https://www.facebook.com/people/Darla-Mead-for-Oregon-HD51/61587617819580/"), social("Instagram", "https://www.instagram.com/darlamead4oregon/")],
    [site("Mead · contact page", "https://www.darlameadfororegon.com/contact", "The page holds a contact form; profile links are in the footer. No email or phone is printed.")]),
  contact("matt-bunch", [web("https://www.mattbunch51.com/"), form("https://www.mattbunch51.com/contact", "Contact form"), social("Facebook", "https://www.facebook.com/mattbunch51"), social("Instagram", "https://www.instagram.com/mattbunchfordistrict51/")],
    [site("Bunch · contact page", "https://www.mattbunch51.com/contact", "The page holds a contact form and a mailing box for checks; profile links are in the footer. No email or phone is printed.")]),
);
primary.push({ candidateId: "darla-mead", sourceUrl: meadHome.url }, { candidateId: "matt-bunch", sourceUrl: bunchIssues.url });
roles.push({ candidateId: "darla-mead", role: "Oncology nurse and foster parent", from: "background" });
ballots.push(ballot("oregon-state-house-51"));
districts.push(district("oregon-state-house-51", "HD51", "Rural Clackamas County: Sandy, Estacada, Beavercreek, Mulino and Canby, and the countryside between Oregon City and Mount Hood Villages."));
choices.push(choice("oregon-state-house-51", "One candidate leads with healthcare access, rural opportunity and environmental protection; the other with local development control, policing, tax restraint and parental rights. Compare how each would fund services and accommodate needed housing."));

/* ── Oregon House · District 52 ──────────────────────────────────────────── */
const sandersDataCenters = site("Sanders · no new data centers", "https://www.hankfororegon.com/issues/restrictions-on-data-centers");
const sandersWildfire = site("Sanders · reduce wildfire risks and costs", "https://www.hankfororegon.com/issues/wildfire");
const sandersChildcare = site("Sanders · childcare tax credits", "https://www.hankfororegon.com/issues/childcare-g3wbr");
const hegePriorities = site("Hege · priorities", "https://www.hegefororegon.com/priorities");
const hegeInterview = reporting("Columbia Community Connection · Hege interview", "https://columbiacommunityconnection.com/the-dalles/hege-puts-experience-at-center-of-house-district-52-campaign", "September 16, 2026; reviewed September 21, 2026");
Object.assign(analysis, {
  "hank-sanders": {
    values: ["No new data centers", "Targeted programs"],
    tradeoff: "New programs and targeted credits aimed at specific rural cost pressures, plus a hard line on data centers; the claimed savings and insurance effects need evidence and cost estimates.",
    issues: {
      housing: { position: "Keep housing affordable by lowering what homeowners pay, starting with wildfire home-hardening to bring down insurance costs.", source: sandersWildfire },
      money: { position: "Calls $50 million and $100 million data-center tax breaks unfair and wants an end to NDAs and clarity on what data centers use and provide.", source: sandersDataCenters },
      climate: { position: "No new data centers, and far more state spending on wildfire prevention, including a home-hardening task force that teaches rural families how to harden their homes.", source: sandersWildfire },
    },
    sources: [site("Sanders · issues", "https://www.hankfororegon.com/issues"), sandersDataCenters, sandersWildfire, sandersChildcare, site("Sanders · about", "https://www.hankfororegon.com/about"), statement(265)],
  },
  "scott-c-hege": {
    values: ["Local control", "Cost scrutiny"],
    tradeoff: "Local discretion over data centers and a hard look at why publicly subsidized housing costs more, rather than a statewide pause or new spending; his account of data-center benefits is not an independent audit.",
    issues: {
      housing: { position: "Reduce the unnecessary costs and regulations that drive up the price of housing.", source: hegePriorities },
      safety: { position: "Give law enforcement the resources and tools to protect communities, and give local responders the equipment and flexibility to handle wildfires, floods and other emergencies.", source: hegePriorities },
      money: { position: "Stop relying on higher taxes; prioritize essential services, eliminate waste and make sure taxpayer dollars deliver results.", source: hegePriorities },
      climate: { position: "Maintain existing roads and bridges and improve rural water and sewer systems through state infrastructure programs.", source: hegePriorities },
    },
    sources: [hegePriorities, site("Hege · about", "https://www.hegefororegon.com/about"), hegeInterview, questionnaire("Hege · Ballotpedia Candidate Connection survey", "https://ballotpedia.org/Scott_Hege", "2026 survey; reviewed September 21, 2026"), statement(267)],
  },
} satisfies Record<string, CandidateAnalysis>);
lines.push(
  line("hank-sanders", "housing", "Wants homeowner costs cut, starting with wildfire home-hardening to lower insurance."),
  line("hank-sanders", "money", "Calls data-center tax breaks unfair; wants an end to NDAs and use disclosure."),
  line("hank-sanders", "climate", "Opposes new data centers; wants far more wildfire-prevention spending."),
  line("scott-c-hege", "housing", "Would cut unnecessary costs and regulations that drive up housing prices."),
  line("scott-c-hege", "safety", "Supports resources for law enforcement and local emergency responders."),
  line("scott-c-hege", "money", "Wants results from existing spending rather than higher taxes."),
  line("scott-c-hege", "climate", "Would maintain roads and bridges and improve rural water and sewer systems."),
);
chips.push(
  chip("hank-sanders", "housing", "Home hardening, insurance"), chip("hank-sanders", "money", "Data-center breaks unfair"), chip("hank-sanders", "climate", "No new data centers"),
  chip("scott-c-hege", "housing", "Cut building costs"), chip("scott-c-hege", "safety", "Police and responders"), chip("scott-c-hege", "money", "Results before taxes"), chip("scott-c-hege", "climate", "Roads, water and sewer"),
);
deliveries.push(
  ladder("hank-sanders", "housing", { how: step("Institute Oregon’s first home-hardening team to teach rural families defensible space, ladder fuels and vent coverings.", sandersWildfire), measure: step("Points to insurance-rate decreases after similar programs in California and Colorado, against home-insurance increases he puts at 30–40% a year.", sandersWildfire) }),
  ladder("hank-sanders", "money", { how: step("Sponsor tax credits worth up to $5,000 for rural childcare workers, modeled on the Rural Practitioner Tax Credit; end tax breaks and non-disclosure agreements for data centers.", sandersChildcare) }),
  ladder("hank-sanders", "climate", { measure: step("Says Oregon should spend 10 to 20 times more on fire prevention.", sandersWildfire) }),
  ladder("scott-c-hege", "housing", { how: step("Examine urban growth boundaries, zoning, construction regulations, procurement and prevailing-wage costs to learn why subsidized units cost more.", hegeInterview) }),
  ladder("scott-c-hege", "safety"), ladder("scott-c-hege", "money"),
  ladder("scott-c-hege", "climate", { how: step("Focus state infrastructure programs and funding on the most critical needs with fair rural access; leave data-center decisions to local communities with public information on resource use.", hegePriorities) }),
);
ownWords.push(
  own("hank-sanders", "Hank Sanders learned at a young age that there are people and corporations that stand to gain from destroying rural Oregon.", 265, "First complete sentence of the filed statement; header fields and the slogan line “Fighting corruption. Fighting for our future.” are skipped."),
  own("scott-c-hege", "My wife Betsy and I have called The Dalles home for 30+ years.", 267, "First sentence of the filed statement; header fields skipped."),
);
contacts.push(
  contact("hank-sanders", [web("https://www.hankfororegon.com/"), email("hank@hankfororegon.com"), social("Instagram", "https://www.instagram.com/hankfororegon/"), social("Facebook", "https://www.facebook.com/profile.php?id=61585720725322"), social("TikTok", "https://www.tiktok.com/@hankfororegon"), social("X", "https://twitter.com/hankfororegon")],
    [site("Sanders · site footer", "https://www.hankfororegon.com/", "The footer prints the campaign email and a mailing box; profile links are in the header.")]),
  contact("scott-c-hege", [web("https://www.hegefororegon.com/"), email("Hegefororegon@gmail.com"), phone("5412881616", "541-288-1616"), social("Instagram", "https://www.instagram.com/hegefororegon"), social("Facebook", "https://www.facebook.com/hegefororegon")],
    [site("Hege · site footer", "https://www.hegefororegon.com/", "The footer prints “Reach out to Scott” with a mailing box, phone and email; profile links are in the footer.")]),
);
primary.push({ candidateId: "hank-sanders", sourceUrl: "https://www.hankfororegon.com/issues/restrictions-on-data-centers" }, { candidateId: "scott-c-hege", sourceUrl: hegePriorities.url });
roles.push({ candidateId: "hank-sanders", role: "Former reporter; Senate staffer", from: "background" }, { candidateId: "scott-c-hege", role: "Wasco County commissioner", from: "background" });
ballots.push(ballot("oregon-state-house-52"));
districts.push(district("oregon-state-house-52", "HD52", "Hood River, Cascade Locks, Mosier, Odell, Parkdale, The Dalles, Mount Hood Villages, Rhododendron and Government Camp, plus Corbett and the Multnomah County side of the Gorge."));
choices.push(choice("oregon-state-house-52", "The concrete disagreement is data centers: one candidate would allow no new ones, the other would leave the decision to local communities. Both back more housing and wildfire prevention, but differ on the state tools and fiscal limits they favor."));

/* ── Portraits added after the district blocks (campaign-site photos, converted September 21, 2026) ── */
Object.assign(portraits, {
  "kayse-jama": portrait("kayse-jama", "https://www.kaysejama.com/meet_kayse", "Campaign photo · kaysejama.com"),
  "sue-r-rieke-smith": portrait("sue-r-rieke-smith", "https://www.votesueriekesmith.com/", "Campaign photo · votesueriekesmith.com"),
  "stephanie-carkin": portrait("stephanie-carkin", "https://www.stephaniefororegon.com/about", "Campaign photo · stephaniefororegon.com"),
  "steph-terrio": portrait("steph-terrio", "https://www.terrioforus.com/", "Campaign photo · terrioforus.com"),
  "susan-mclain": portrait("susan-mclain", "https://www.susanmclain.org/", "Campaign photo · susanmclain.org"),
  "brian-schimmel": portrait("brian-schimmel", "https://brianschimmel.org/", "Campaign photo · brianschimmel.org"),
  "adam-baker": portrait("adam-baker", "https://voteadambaker.com/meet/", "Campaign photo · voteadambaker.com"),
  "michael-w-sugar": portrait("michael-w-sugar", "https://www.sugarfororegon.com/", "Campaign photo · sugarfororegon.com"),
  "pat-hubbell": portrait("pat-hubbell", "https://hubbell4health.com/about", "Campaign photo · hubbell4health.com"),
  "darla-mead": portrait("darla-mead", "https://www.darlameadfororegon.com/", "Campaign photo · darlameadfororegon.com"),
  "matt-bunch": portrait("matt-bunch", "https://www.mattbunch51.com/about", "Campaign photo · mattbunch51.com"),
  "hank-sanders": portrait("hank-sanders", "https://www.hankfororegon.com/", "Campaign photo · hankfororegon.com"),
  "scott-c-hege": portrait("scott-c-hege", "https://www.hegefororegon.com/about", "Campaign photo · hegefororegon.com"),
});

/* ══════════════════════════════════════════════════════════════════════════
 * Topic boards and stakes for all thirteen races (researched September 22, 2026).
 * Incumbents' cells are their recorded floor votes on OLIS (kind "Public record",
 * the bill and date named); challengers' cells are their own published words or a
 * quote as printed by a named outlet. Nothing is inferred from party, endorsements
 * or silence; a candidate with no explicit statement on a topic has no cell.
 * ══════════════════════════════════════════════════════════════════════════ */
const TOPICS_REVIEWED_ON = "2026-09-22";
const topicReviewed = { reviewedBy: "pending", reviewedOn: TOPICS_REVIEWED_ON } as const;
const OLIS = "https://olis.oregonlegislature.gov/liz";
const record = (label: string, url: string, date: string, note?: string): Evidence => ({
  label, url, kind: "Public record", date, ...(note ? { note } : {}),
});
const reported = (label: string, url: string, date: string, outlet: string): Evidence => ({
  label, url, kind: "Reporting", date, note: `Reported statement; quote as printed by ${outlet}.`,
});
const stance = (candidateId: string, topicId: string, s: TopicStance["stance"], chipText: string, text: string, source: Evidence): TopicStance =>
  ({ candidateId, topicId, stance: s, chip: chipText, text, source, ...topicReviewed });

/* Roll calls (OLIS measure histories, reviewed September 22, 2026) */
const hb3991Senate = record("OLIS · HB 3991 (2025 special session) · Senate third reading", `${OLIS}/2025S1/Measures/Overview/HB3991`,
  "September 29, 2025; signed November 7, 2025; reviewed September 22, 2026",
  "Passed 18–11. The gas-tax and fee increases were repealed by voters as Measure 120 on May 19, 2026; the enrolled bill also repealed the mandatory toll program.");
const hb3991House = record("OLIS · HB 3991 (2025 special session) · House third reading", `${OLIS}/2025S1/Measures/Overview/HB3991`,
  "September 1, 2025; signed November 7, 2025; reviewed September 22, 2026",
  "Passed 36–12, carried by McLain; Helfrich was excused. Rieke Smith filed a vote explanation. Voters repealed the tax and fee increases as Measure 120 on May 19, 2026.");
const hb3546Senate = record("OLIS · HB 3546, the POWER Act (2025) · Senate third reading", `${OLIS}/2025R1/Measures/Overview/HB3546`,
  "June 3, 2025; signed June 16, 2025; reviewed September 22, 2026",
  "Passed 18–12. The law lets regulators put large-load customers such as data centers in their own electricity rate class.");
const hb3546House = record("OLIS · HB 3546, the POWER Act (2025) · House votes", `${OLIS}/2025R1/Measures/Overview/HB3546`,
  "April 22 and June 5, 2025; signed June 16, 2025; reviewed September 22, 2026",
  "Third reading passed 41–16; the House concurred in Senate amendments 37–17. Helfrich is among the nays both times; McLain is among the ayes.");
const hb3644Senate = record("OLIS · HB 3644, statewide shelter program (2025) · Senate third reading", `${OLIS}/2025R1/Measures/Overview/HB3644`,
  "June 26, 2025; signed July 17, 2025; reviewed September 22, 2026",
  "Passed 19–10, carried by Neron Misslin. The program is funded with $204,918,652 General Fund for 2025–27 in HB 5011, half of it one-time.");
const hb3644House = record("OLIS · HB 3644, statewide shelter program (2025) · House third reading", `${OLIS}/2025R1/Measures/Overview/HB3644`,
  "June 23, 2025; signed July 17, 2025; reviewed September 22, 2026",
  "Passed 33–11. Helfrich is among the nays; McLain and Rieke Smith are among the ayes.");
const hb4002Senate = record("OLIS · HB 4002, Measure 110 changes (2024) · Senate third reading", `${OLIS}/2024R1/Measures/Overview/HB4002`,
  "March 1, 2024; signed April 1, 2024; reviewed September 22, 2026",
  "Passed 21–8. Jama is among the nays and filed a vote explanation; Wagner and Meek are among the ayes.");
const hb4002House = record("OLIS · HB 4002, Measure 110 changes (2024) · House third reading", `${OLIS}/2024R1/Measures/Overview/HB4002`,
  "February 29, 2024; signed April 1, 2024; reviewed September 22, 2026",
  "Passed 51–7. Helfrich, McLain, Neron and Reynolds (then House members) are among the ayes.");
const hb3940Senate = record("OLIS · HB 3940, wildfire funding (2025) · Senate third reading", `${OLIS}/2025R1/Measures/Overview/HB3940`,
  "June 26, 2025; signed July 24, 2025; reviewed September 22, 2026",
  "Passed 20–8. Reynolds is among the nays; Meek was absent. The Legislative Revenue Office put the bill's wildfire funds at about $43 million for 2025–27 and $63 million for 2027–29.");
const hb3940House = record("OLIS · HB 3940, wildfire funding (2025) · House third reading", `${OLIS}/2025R1/Measures/Overview/HB3940`,
  "June 23, 2025; signed July 24, 2025; reviewed September 22, 2026",
  "Passed 37–8. Helfrich is among the nays; McLain and Rieke Smith are among the ayes.");
const sb1507Senate = record("OLIS · SB 1507, federal tax disconnect and Earned Income Tax Credit (2026) · Senate third reading", `${OLIS}/2026R1/Measures/Overview/SB1507`,
  "February 16, 2026; signed April 9, 2026; reviewed September 22, 2026",
  "Passed 17–13; Meek is the one Democrat among the nays. The Legislative Revenue Office estimated a net General Fund gain of $313.9 million in 2027–29.");
const sb1507House = record("OLIS · SB 1507, federal tax disconnect and Earned Income Tax Credit (2026) · House third reading", `${OLIS}/2026R1/Measures/Overview/SB1507`,
  "February 25, 2026; signed April 9, 2026; reviewed September 22, 2026",
  "Passed 34–21. Bunch and Helfrich are among the nays; McLain and Rieke Smith are among the ayes.");
const hb4138Senate = record("OLIS · HB 4138, officer identification and masks (2026) · Senate third reading", `${OLIS}/2026R1/Measures/Overview/HB4138`,
  "March 5, 2026; signed March 31, 2026; reviewed September 22, 2026",
  "Passed 18–10. One of eight immigrant-protection bills signed April 9, 2026.");
const hb4138House = record("OLIS · HB 4138, officer identification and masks (2026) · House votes", `${OLIS}/2026R1/Measures/Overview/HB4138`,
  "February 24 and March 6, 2026; signed March 31, 2026; reviewed September 22, 2026",
  "Third reading passed 36–19; the House concurred 34–18. Bunch and Helfrich are among the nays both times; McLain and Rieke Smith are among the ayes.");

/* Reported statements and remaining candidate pages used only by the boards */
const armitageReported = reported("Tillamook Headlight Herald · Armitage interview", armitageInterview.url, "April 21, 2026; reviewed September 22, 2026", "the Tillamook Headlight Herald");
const hegeReported = reported("Columbia Community Connection · Hege interview", hegeInterview.url, "September 16, 2026; reviewed September 22, 2026", "Columbia Community Connection");
const strohRecordPage = site("Stroh · Michele’s Record", "https://votestroh.com/micheles-record/");
const helfrichStatement: Evidence = { ...statement(92), note: `${statement(92).note} He was excused for the House vote on HB 3991 on September 1, 2025 (OLIS).` };

/* ── Topics: the choices the 2027 Legislature will vote on ─────────────── */
const LEG_RACES = [
  "oregon-state-senate-13", "oregon-state-senate-15", "oregon-state-senate-16", "oregon-state-senate-17", "oregon-state-senate-19",
  "oregon-state-senate-20", "oregon-state-senate-24", "oregon-state-senate-26",
  "oregon-state-house-26", "oregon-state-house-29", "oregon-state-house-40", "oregon-state-house-51", "oregon-state-house-52",
];
const legislatureTopics: ExtraTopic[] = [
  {
    id: "leg-transportation-package",
    label: "2027 road package",
    short: "Road taxes",
    question: "Vote for a 2027 transportation package that raises the gas tax and vehicle fees again?",
    context:
      "HB 3991, passed in a September 2025 special session, raised the gas tax and vehicle fees; voters repealed those increases as Measure 120 on May 19, 2026, 83% to 17%. The 2026 session redirected existing funds to close ODOT's $297 million gap through June 2027, and ODOT says it faces a $200 million gap and nearly 200 maintenance-job cuts in 2027–29.",
  },
  {
    id: "leg-kicker",
    label: "Kicker refund",
    short: "Kicker",
    question: "Let the state keep part of a future kicker refund for wildfire or other one-time needs?",
    context:
      "The 2026 kicker returned about $1.4 billion; holding any of it back takes a two-thirds vote of each chamber. The September 2026 forecast puts 2025–27 personal income taxes $526 million under the kicker threshold, so no refund is due on 2028 returns; a 2026 bill to change how the kicker is calculated (HB 4125) had a hearing February 2 and died in committee.",
  },
  {
    id: "leg-new-revenue",
    label: "Budget gap: taxes?",
    short: "Budget gap",
    question: "Close the 2027–29 budget gap with new revenue, or with cuts alone?",
    context:
      "The state's Chief Financial Office told agencies on February 10, 2026 that federal H.R. 1 opens a gap between current programs and revenue, and that 2027–29 requests must be revenue-neutral. In February 2026 the Legislature passed SB 1507, disconnecting from H.R. 1 business tax breaks to raise about $314 million for 2027–29 while enlarging the Earned Income Tax Credit; reserves stand at $3.46 billion.",
  },
  {
    id: "leg-data-centers",
    label: "Data-center limits",
    short: "Data centers",
    question: "Make data centers pay their own way: separate power rates, an end to tax breaks, or a pause on new ones?",
    context:
      "Oregon has about 144 data centers and roughly $450 million a year in property-tax breaks, a figure the Legislative Revenue Office called “pretty close” on September 8, 2026. The 2025 POWER Act (HB 3546) put them in their own electricity rate class; the governor paused data-center deals on state land through July 1, 2027 and will bring the 2027 session a statewide framework.",
  },
  {
    id: "leg-shelter-funding",
    label: "Shelter funding",
    short: "Shelter",
    question: "Keep paying for state-funded shelter beds and the homelessness emergency after June 2027?",
    context:
      "The statewide shelter program created by HB 3644 (2025) has $204.9 million for 2025–27, half of it one-time money that expires June 30, 2027; Executive Order 26-01 extends the homelessness emergency through January 10, 2027. The state counts 6,286 shelter beds added or kept and 5,539 people rehoused from January 2023 through September 2025.",
  },
  {
    id: "leg-deflection",
    label: "Drugs: deflection",
    short: "Deflection",
    question: "Keep the 2024 approach of recriminalized possession plus county deflection programs, and fund them in 2027–29?",
    context:
      "HB 4002 (2024) made drug possession a misdemeanor again on September 1, 2024 and created county deflection programs, run by 28 counties and six tribes in the first cycle and funded with $40 million for 2025–27. Through August 4, 2025 the state logged 2,096 deflection events: 1,308 people entered a program, 277 completed one and 630 did not.",
  },
  {
    id: "leg-wildfire-funding",
    label: "Wildfire money",
    short: "Wildfire",
    question: "Spend more state money on wildfire prevention and firefighting?",
    context:
      "Fires burned a record 2.5 million acres in Oregon in summer 2026. HB 3940 (2025) taxes oral nicotine and moves 20% of Rainy Day Fund interest into two wildfire funds, which the Legislative Revenue Office put at about $43 million for 2025–27 and $63 million for 2027–29, and raises the timber harvest tax; SB 83 (2025) repealed the statewide wildfire hazard map.",
  },
  {
    id: "leg-sanctuary",
    label: "Sanctuary law",
    short: "Sanctuary",
    question: "Keep adding state limits on federal immigration enforcement, on top of Oregon's sanctuary law?",
    context:
      "Oregon's 1987 sanctuary law and the 2021 Sanctuary Promise Act bar public resources for immigration enforcement without a judicial warrant. The 2026 session passed eight more bills, signed April 9, 2026, including HB 4138, which requires officers to identify themselves and limits masks (House 36–19, Senate 18–10), and SB 1570, which requires hospitals to set policies for law-enforcement visits.",
  },
];
topics.push({ raceIds: LEG_RACES, topics: legislatureTopics });

/* ── Topic stances: explicit and sourced; the record first for incumbents ── */
topicStances.push(
  /* Senate 13 */
  stance("courtney-neron-misslin", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the Senate on September 29, 2025, the gas-tax and fee package voters later repealed; the enrolled bill also repealed the mandatory toll program.", hb3991Senate),
  stance("courtney-neron-misslin", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 16, 2026, which disconnects Oregon from federal H.R. 1 business tax breaks, raising about $314 million for 2027–29, and enlarges the Earned Income Tax Credit.", sb1507Senate),
  stance("courtney-neron-misslin", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546, the POWER Act, in the Senate on June 3, 2025; it directs regulators to put data centers in their own electricity rate class.", hb3546Senate),
  stance("courtney-neron-misslin", "leg-shelter-funding", "supports", "Carried shelter bill",
    "Carried HB 3644 on the Senate floor and voted yes on June 26, 2025; the law creates the statewide shelter program funded with $204.9 million through June 2027.", hb3644Senate),
  stance("courtney-neron-misslin", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 in the House on February 29, 2024, which recriminalized possession and created county deflection programs.", hb4002House),
  stance("courtney-neron-misslin", "leg-wildfire-funding", "supports", "Voted for HB 3940",
    "Voted yes on HB 3940 on June 26, 2025, which taxes oral nicotine, raises the timber harvest tax and moves Rainy Day Fund interest to wildfire funds.", hb3940Senate),
  stance("courtney-neron-misslin", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on March 5, 2026, requiring officers to identify themselves and limiting masks; her site says she has worked to strengthen Oregon’s sanctuary protections.", hb4138Senate),
  stance("glenn-lancaster", "leg-transportation-package", "opposes", "Stop the gas tax",
    "Says his opponent voted for HB 3991’s six-cent gas tax and higher fees, which voters rejected by more than four to one, and that he will stop the next tax increase.", statement(66)),
  stance("glenn-lancaster", "leg-kicker", "opposes", "Protect the kicker",
    "Says he will stop the next tax increase and protect your kicker refund.", statement(67)),
  stance("glenn-lancaster", "leg-new-revenue", "opposes", "Stop tax increases",
    "Says Oregon passed the largest tax increase in state history; he would stop tax increases and demand accountability for what actually works.", lancasterIssues),
  stance("glenn-lancaster", "leg-shelter-funding", "partial", "Demand real solutions",
    "Says addiction and homelessness are treated as permanent and demands real solutions with accountability and results; he does not say whether to keep funding state shelter beds.", lancasterIssues),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  /* Senate 15 */
  stance("myrna-a-munoz", "leg-new-revenue", "supports", "Close corporate loopholes",
    "Would close tax loopholes and make large corporations pay their fair share to invest in schools, healthcare and affordable housing.", statement(68)),
  stance("myrna-a-munoz", "leg-data-centers", "partial", "Safeguards, transparency",
    "Calls the AI data-center build-out reckless and says it is driving up electricity bills; she commits to transparency, community input and environmental safeguards and does not say whether she backs separate rates, ending tax breaks or a pause.", munozIssues),
  stance("myrna-a-munoz", "leg-shelter-funding", "partial", "Plan to house all",
    "Wants a strategic plan to house all Oregonians and state investment in affordable housing; she does not address shelter funding or the emergency order.", munozAbout),
  stance("myrna-a-munoz", "leg-sanctuary", "supports", "Due process, no ICE",
    "Would fight for laws that strengthen due process, prevent racial profiling and keep local resources on community safety; her About page calls for abolishing ICE.", munozIssues),
  stance("harold-hutchison", "leg-transportation-package", "opposes", "No gas-tax increase",
    "Told the Abigail Adams questionnaire that roads can be funded without gas-tax or fee increases by shrinking the administration behind DEQ and licensing, and backs voter approval of tolls.", hutchisonOAA),
  stance("harold-hutchison", "leg-kicker", "opposes", "Kicker belongs to taxpayers",
    "Answered the questionnaire’s kicker-repeal question with “The kicker belongs to the taxpayers.”", hutchisonOAA),
  stance("harold-hutchison", "leg-new-revenue", "partial", "End property tax",
    "Calls property tax immoral, opposes a sales tax and calls income tax the fairest way to raise needed revenue; he does not say how to close the 2027–29 gap.", hutchisonOAA),
  stance("harold-hutchison", "leg-wildfire-funding", "partial", "No routine prescribed burns",
    "Told the questionnaire he does not support the Forestry Department doing prescribed burns every five years; he does not address wildfire funding.", hutchisonOAA),
  stance("harold-hutchison", "leg-sanctuary", "opposes", "Repeal sanctuary law",
    "Told the questionnaire he supports repealing Oregon’s sanctuary law and letting police ask about immigration status outside criminal investigations.", hutchisonOAA),
  /* Senate 16 */
  stance("courtney-bangs", "leg-transportation-package", "opposes", "Existing dollars, no hikes",
    "Says she helped defeat the $4.3 billion gas-tax package and will fight new taxes and hidden fees, seeking the district’s share of existing dollars for Highways 30, 6 and 101.", bangsPriorities),
  stance("courtney-bangs", "leg-new-revenue", "opposes", "Stop hikes, hidden fees",
    "Will fight to stop new tax hikes and hidden fees and demand accountability for state spending.", bangsPriorities),
  stance("rachel-armitage", "leg-transportation-package", "opposes", "Against gas-tax hike",
    "Told the Headlight Herald in April 2026 she is generally opposed to raising the gas tax and DMV fees, and wants more ODOT oversight and rural drivers' gas taxes spent maintaining the roads they rely on.", armitageReported),
  stance("rachel-armitage", "leg-new-revenue", "opposes", "No new costs now",
    "Told the Headlight Herald that now is not the time for the state to talk about increasing costs, and that she would review whether old bills and pandemic-era programs still work.", armitageReported),
  stance("melisa-finkle", "leg-transportation-package", "partial", "Roads beyond patches",
    "Her filed statement calls for safer travel and roads that need more than another temporary patch; it does not say whether she would raise the gas tax or fees to pay for them.", statement(76)),
  /* Senate 17 */
  stance("lisa-reynolds", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the Senate on September 29, 2025, the gas-tax and fee package voters later repealed.", hb3991Senate),
  stance("lisa-reynolds", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 16, 2026, which disconnects Oregon from federal H.R. 1 business tax breaks, raising about $314 million for 2027–29, and enlarges the Earned Income Tax Credit.", sb1507Senate),
  stance("lisa-reynolds", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546, the POWER Act, in the Senate on June 3, 2025; it directs regulators to put data centers in their own electricity rate class.", hb3546Senate),
  stance("lisa-reynolds", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 26, 2025; her site says she voted for record shelter and housing funding and supported rent relief and eviction moratoriums.", hb3644Senate),
  stance("lisa-reynolds", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 in the House on February 29, 2024; her site calls for markedly more treatment and interrupting the fentanyl supply.", hb4002House),
  stance("lisa-reynolds", "leg-wildfire-funding", "opposes", "Voted no: HB 3940",
    "Voted no on HB 3940 on June 26, 2025, the bill that taxes oral nicotine products, raises the timber harvest tax and moves Rainy Day Fund interest to wildfire prevention funds.", hb3940Senate),
  stance("lisa-reynolds", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on March 5, 2026; her statement cites policies protecting patients in hospitals, children in schools and people in their homes from the Trump administration.", hb4138Senate),
  stance("john-a-n-chee", "leg-new-revenue", "opposes", "Cut taxes, no increases",
    "Says Oregon families are devastated by endless broad-based tax increases; he would dramatically reduce property taxes and eliminate taxes on family inheritances.", cheeSurvey),
  stance("john-a-n-chee", "leg-shelter-funding", "partial", "Prosecute vagrancy",
    "Would prosecute vagrancy and open drug use; he does not say whether the state should keep funding shelter beds.", cheeSurvey),
  stance("john-a-n-chee", "leg-deflection", "partial", "Prosecute open drug use",
    "Would prosecute open drug use; he does not say whether counties should keep deflecting people to treatment before charges.", cheeSurvey),
);
topicStances.push(
  /* Senate 19 */
  stance("rob-wagner", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the Senate on September 29, 2025, the gas-tax and fee package voters later repealed.", hb3991Senate),
  stance("rob-wagner", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 16, 2026, which disconnects Oregon from federal H.R. 1 business tax breaks, raising about $314 million for 2027–29, and enlarges the Earned Income Tax Credit.", sb1507Senate),
  stance("rob-wagner", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546 on June 3, 2025, putting data centers in their own electricity rate class; his site says he made data centers pay their fair share of energy costs.", hb3546Senate),
  stance("rob-wagner", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 26, 2025, creating the statewide shelter program funded with $204.9 million through June 2027.", hb3644Senate),
  stance("rob-wagner", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 in the Senate on March 1, 2024, which recriminalized possession and created county deflection programs.", hb4002Senate),
  stance("rob-wagner", "leg-wildfire-funding", "supports", "Voted for HB 3940",
    "Voted yes on HB 3940 on June 26, 2025; his statement says Oregon must build resilience amid wildfires and heat waves.", hb3940Senate),
  stance("rob-wagner", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on March 5, 2026; his site says he strongly supported new laws protecting the constitutional rights of immigrant and refugee neighbors.", hb4138Senate),
  stance("mary-dirksen", "leg-new-revenue", "opposes", "Tax relief, less waste",
    "Would rein in wasteful spending, demand transparency for every tax dollar and pursue meaningful tax relief; her statement says taxes and the cost of living have soared under current Senate leadership.", dirksenHome),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  /* Senate 20 */
  stance("mark-meek", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the Senate on September 29, 2025, the gas-tax and fee package voters later rejected; the bill also repealed the mandatory toll program, and his site says he ended ODOT’s I-205 tolling plans.", hb3991Senate),
  stance("mark-meek", "leg-new-revenue", "opposes", "Voted no on disconnect",
    "Voted no on SB 1507 on February 16, 2026, the bill that disconnects Oregon from federal H.R. 1 business tax breaks to raise about $314 million for 2027–29 and enlarge the Earned Income Tax Credit.", sb1507Senate),
  stance("mark-meek", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546, the POWER Act, in the Senate on June 3, 2025; it directs regulators to put data centers in their own electricity rate class.", hb3546Senate),
  stance("mark-meek", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 26, 2025; his site says he is working to expand shelter capacity and treatment programs.", hb3644Senate),
  stance("mark-meek", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 in the Senate on March 1, 2024; his site backs resources for police, offender accountability and expanded treatment.", hb4002Senate),
  stance("mark-meek", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on March 5, 2026; his site says he stood firm against reckless federal policies.", hb4138Senate),
  stance("michele-stroh", "leg-transportation-package", "opposes", "Voters said no",
    "Her filed statement says the incumbent voted yes on a package to raise taxes that voters then rejected by more than 80 percent.", statement(85)),
  stance("michele-stroh", "leg-new-revenue", "opposes", "No new taxes",
    "Her filed statement pledges no new taxes, saying Oregon is among the highest-taxed states and has a spending problem, not a revenue problem.", statement(84)),
  stance("michele-stroh", "leg-shelter-funding", "partial", "Accountability for spending",
    "Says Oregon has spent billions while the crisis grew; wants treatment, accountability for spending and less red tape blocking shelters and housing, without saying whether to renew state shelter money.", strohHome),
  stance("michele-stroh", "leg-deflection", "supports", "Backed Fix M110",
    "Says she worked with the Fix M110 coalition on the bipartisan amendment giving police tools against dealers while getting people with addiction into treatment; wants prevention, treatment and consequences for dealers.", strohRecordPage),
  /* Senate 24 */
  stance("kayse-jama", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the Senate on September 29, 2025, the gas-tax and fee package voters later repealed.", hb3991Senate),
  stance("kayse-jama", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 16, 2026, which disconnects Oregon from federal H.R. 1 business tax breaks, raising about $314 million for 2027–29, and enlarges the Earned Income Tax Credit.", sb1507Senate),
  stance("kayse-jama", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546 on June 3, 2025, putting data centers in their own electricity rate class; his statement says he fought to lower energy costs for Oregon families.", hb3546Senate),
  stance("kayse-jama", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 26, 2025; as Senate housing chair he says he led over $4.5 billion in housing investment over three years.", hb3644Senate),
  stance("kayse-jama", "leg-deflection", "opposes", "Voted no: HB 4002",
    "Voted no on HB 4002 in the Senate on March 1, 2024, the bill that recriminalized possession and created county deflection programs, and filed a vote explanation.", hb4002Senate),
  stance("kayse-jama", "leg-wildfire-funding", "supports", "Voted for HB 3940",
    "Voted yes on HB 3940 on June 26, 2025; his site cites a 2022 law protecting farmworkers during wildfire smoke and heat waves.", hb3940Senate),
  stance("kayse-jama", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on March 5, 2026; his statement says he protected immigrant and refugee communities from federal overreach.", hb4138Senate),
  /* Senate 26 */
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("nicole-bassett", "leg-wildfire-funding", "supports", "Prioritize prevention",
    "Would prioritize wildfire prevention, support first responders and invest in proven solutions that keep people, land and homes safe.", statement(91)),
  stance("jeff-helfrich", "leg-transportation-package", "opposes", "Opposed the gas tax",
    "Says he opposed major tax increases including the gas tax and fought policies that raise costs for working families; he was excused for the House vote on HB 3991.", helfrichStatement),
  stance("jeff-helfrich", "leg-new-revenue", "opposes", "Voted no on disconnect",
    "Voted no on SB 1507, which disconnected Oregon from several federal tax breaks, in the House on February 25, 2026.", sb1507House),
  stance("jeff-helfrich", "leg-data-centers", "opposes", "Voted no: POWER Act",
    "Voted no on HB 3546 on April 22 and June 5, 2025; his statement calls for balanced energy policies that lower costs and provide the power Oregon needs to grow.", hb3546House),
  stance("jeff-helfrich", "leg-shelter-funding", "opposes", "Voted no: shelter bill",
    "Voted no on HB 3644 in the House on June 23, 2025, the bill creating the statewide shelter program.", hb3644House),
  stance("jeff-helfrich", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 on February 29, 2024; his statement says he helped lead the bipartisan effort to recriminalize hard drugs and restore accountability.", hb4002House),
  stance("jeff-helfrich", "leg-wildfire-funding", "opposes", "Voted no: HB 3940",
    "Voted no on HB 3940 in the House on June 23, 2025, the bill that taxes oral nicotine, raises the timber harvest tax and moves Rainy Day Fund interest to wildfire funds.", hb3940House),
  stance("jeff-helfrich", "leg-sanctuary", "opposes", "Voted no: HB 4138",
    "Voted no on HB 4138 on February 24 and March 6, 2026, the bill requiring officers to identify themselves and limiting masks.", hb4138House),
);
topicStances.push(
  /* House 26 */
  stance("sue-r-rieke-smith", "leg-transportation-package", "supports", "Voted for HB 3991",
    "Voted yes on HB 3991 in the House on September 1, 2025; her vote explanation called it far from perfect and voiced concern about another tax burden. Voters later repealed its gas-tax and fee increases.", hb3991House),
  stance("sue-r-rieke-smith", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 25, 2026; her statement describes it as standing up to Trump’s tax loopholes for the ultra wealthy and cutting taxes for over 200,000 working families.", sb1507House),
  stance("sue-r-rieke-smith", "leg-data-centers", "partial", "Regulate data centers",
    "Opposes the unchecked growth of AI data centers that use up water and raise utility costs; she does not say whether she favors separate rates, ending tax breaks or a pause, and joined the House after the POWER Act votes.", statement(179)),
  stance("sue-r-rieke-smith", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 23, 2025, two weeks after taking office; her plan would partner with cities and nonprofits on root causes like mental illness and addiction.", hb3644House),
  stance("sue-r-rieke-smith", "leg-deflection", "partial", "Integrate treatment",
    "Would fully integrate mental-health and addiction treatment into the healthcare system; she was not in office for HB 4002 and does not address deflection funding.", rsPlan),
  stance("sue-r-rieke-smith", "leg-wildfire-funding", "supports", "Voted for HB 3940",
    "Voted yes on HB 3940 on June 23, 2025, the bill that taxes oral nicotine, raises the timber harvest tax and moves Rainy Day Fund interest to wildfire funds.", hb3940House),
  stance("sue-r-rieke-smith", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on February 24 and March 6, 2026, the bill requiring officers to identify themselves and limiting masks.", hb4138House),
  stance("stephanie-carkin", "leg-transportation-package", "opposes", "Families paying enough",
    "Her statement welcomes the defeat of the transportation tax referendum, which she notes her opponent voted for, because families are already paying enough; she would spend existing dollars on essential infrastructure.", statement(175)),
  stance("stephanie-carkin", "leg-new-revenue", "mixed", "Audit before taxing",
    "Before asking taxpayers for more, government should show it uses existing money well: audits of underperforming programs, performance-based budgeting and a bigger tax base from a business-friendly Oregon.", carkinIssues),
  stance("steph-terrio", "leg-new-revenue", "partial", "Corporate tax increase",
    "Backs a 1.5% corporate tax increase and drug-price negotiation to fund coverage for uninsured and lower-income people; she frames it as Medicare reform and does not address the state’s 2027–29 gap.", terrioPolicy),
  stance("steph-terrio", "leg-data-centers", "partial", "Regulate AI now",
    "Wants AI regulated immediately, citing data centers’ fresh-water use and unchecked surveillance; she does not address tax breaks, rates or a pause.", terrioPolicy),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  /* House 29 */
  stance("susan-mclain", "leg-transportation-package", "supports", "Carried HB 3991",
    "Carried HB 3991 on the House floor and voted yes on September 1, 2025; her site backs transit, road maintenance and a new earthquake-ready Columbia River bridge.", hb3991House),
  stance("susan-mclain", "leg-new-revenue", "supports", "Voted to disconnect",
    "Voted yes on SB 1507 on February 25, 2026; her site says she voted for the largest Earned Income Tax Credit increase in state history.", sb1507House),
  stance("susan-mclain", "leg-data-centers", "supports", "Voted for POWER Act",
    "Voted yes on HB 3546 on April 22 and June 5, 2025, and co-sponsored it; the bill has the utility commission assign the cost of serving large energy users to those users.", hb3546House),
  stance("susan-mclain", "leg-shelter-funding", "supports", "Voted for shelter bill",
    "Voted yes on HB 3644 on June 23, 2025, the bill creating the statewide shelter program.", hb3644House),
  stance("susan-mclain", "leg-deflection", "supports", "Voted for HB 4002",
    "Voted yes on HB 4002 on February 29, 2024, which recriminalized possession and created county deflection programs.", hb4002House),
  stance("susan-mclain", "leg-wildfire-funding", "supports", "Voted for HB 3940",
    "Voted yes on HB 3940 on June 23, 2025, the bill that taxes oral nicotine, raises the timber harvest tax and moves Rainy Day Fund interest to wildfire funds.", hb3940House),
  stance("susan-mclain", "leg-sanctuary", "supports", "Voted for HB 4138",
    "Voted yes on HB 4138 on February 24 and March 6, 2026; her site says she fought this year to hold ICE and law-enforcement agents accountable.", hb4138House),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  /* House 40 */
  stance("adam-baker", "leg-transportation-package", "opposes", "Respect the vote",
    "Would respect the May 2026 vote rejecting the gas-tax, payroll-tax and vehicle-fee increases: no new taxes without proof of efficiency and results, and no tolls on I-205.", bakerIssues),
  stance("adam-baker", "leg-new-revenue", "opposes", "Audit before taxing",
    "No new taxes until agencies prove efficiency and results; every agency should show measurable results before asking taxpayers for another dime.", bakerIssues),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("adam-baker", "leg-shelter-funding", "partial", "Compassion with accountability",
    "Wants compassion with accountability: reduce encampments, expand recovery programs and fund inpatient mental-health capacity; he does not say whether to keep state shelter funding.", bakerIssues),
  stance("adam-baker", "leg-deflection", "partial", "Enforcement plus treatment",
    "Wants firm enforcement plus proven intervention: treat the opioid crisis as an emergency, expand recovery programs that work and pair treatment with responsibility; he does not name deflection.", bakerIssues),
  stance("michael-w-sugar", "leg-transportation-package", "partial", "No tolls, on-time projects",
    "Opposes tolling and wants projects delivered on time and on budget with union labor; he does not say whether he would vote for a gas-tax or fee increase.", sugarPriorities),
  stance("michael-w-sugar", "leg-new-revenue", "partial", "Wealthy pay fair share",
    "Would push major tax reform so billionaires and the wealthiest corporations pay their fair share while reducing the burden on working families; he lists it under cutting taxes and does not address the 2027–29 budget gap.", sugarPriorities),
  stance("michael-w-sugar", "leg-shelter-funding", "partial", "Get people off streets",
    "Would expand mental-health and addiction services, address homelessness and get people off the streets; he does not say how shelter beds would be funded.", statement(225)),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("michael-w-sugar", "leg-wildfire-funding", "supports", "Fund brush clearing",
    "Would increase support for proactive wildfire prevention, including brush clearing, and invest now in earthquake-resistant bridges, water systems and emergency centers.", sugarPriorities),
  stance("michael-w-sugar", "leg-sanctuary", "partial", "Protect from overreach",
    "Would protect Oregonians and immigrants from federal overreach and ensure a justice system that treats everyone equally; he does not say whether he would add new state limits on federal immigration enforcement.", sugarPriorities),
  stance("pat-hubbell", "leg-new-revenue", "opposes", "No family tax hikes",
    "Would balance the state budget without raising taxes on working families by auditing departments and eliminating waste and redundant programs.", hubbellPlatform),
  stance("pat-hubbell", "leg-deflection", "partial", "Recovery plus enforcement",
    "Would couple compassionate mental-health and addiction recovery with strict enforcement of public-safety laws; he does not address deflection funding.", hubbellHome),
);
topicStances.push(
  /* House 51 */
  stance("darla-mead", "leg-transportation-package", "partial", "Road budgets insufficient",
    "Says rural roads are in disrepair and the budgets to fix them are insufficient; she does not say how she would raise the money.", meadEcon),
  stance("darla-mead", "leg-new-revenue", "partial", "Find budget improvements",
    "Would bring accounting skills to finding budget improvements and wants schools funded beyond federal dollars; she does not say whether she would raise revenue.", meadEcon),
  stance("darla-mead", "leg-data-centers", "partial", "Rules insufficient now",
    "Says data centers are being built in rural neighborhoods where they deplete fresh water and that existing regulations are insufficient to manage them; she does not address power rates, tax breaks or a pause.", meadEnv),
  stance("darla-mead", "leg-shelter-funding", "partial", "Pathways to stable housing",
    "Wants pathways from subsidized housing and rental assistance to long-term stable housing; she does not address shelter funding.", meadEcon),
  stance("darla-mead", "leg-wildfire-funding", "partial", "Mitigate disasters",
    "Says she will fight for solutions that mitigate natural disasters; she does not say how much the state should spend or how to pay.", meadHome),
  stance("matt-bunch", "leg-transportation-package", "opposes", "No transportation taxes",
    "Opposes the transportation package’s gas-tax, vehicle-fee and payroll-tax increases; would cut waste and prioritize road maintenance and safety instead of new taxes.", bunchIssues),
  stance("matt-bunch", "leg-new-revenue", "opposes", "Voted no on disconnect",
    "Voted no on SB 1507 on February 25, 2026; his statement says he is fighting to protect tax relief, including eliminating state taxes on tips and overtime.", sb1507House),
  stance("matt-bunch", "leg-shelter-funding", "partial", "Community-based, no bureaucracy",
    "Calls growing homelessness a serious concern and wants community-based solutions without new bureaucracy; he does not say whether to renew state shelter money.", bunchIssues),
  stance("matt-bunch", "leg-sanctuary", "opposes", "Voted no: HB 4138",
    "Voted no on HB 4138 on February 24 and March 6, 2026, the bill requiring officers to identify themselves and limiting masks.", hb4138House),
  /* House 52 */
  stance("hank-sanders", "leg-data-centers", "supports", "No new data centers",
    "Will not support any new data centers, calls $50 million and $100 million tax breaks unfair, and wants an end to NDAs and clarity on what data centers use and provide.", sandersDataCenters),
  stance("hank-sanders", "leg-wildfire-funding", "supports", "10–20× more prevention",
    "Says Oregon should spend 10 to 20 times more on fire prevention and would create a home-hardening team to lower insurance costs.", sandersWildfire),
  stance("scott-c-hege", "leg-transportation-package", "partial", "Maintain what exists",
    "Wants state infrastructure programs focused on maintaining existing roads and bridges with fair rural access; he does not say whether he would raise the gas tax or fees.", hegePriorities),
  stance("scott-c-hege", "leg-new-revenue", "opposes", "Hard look at spending",
    "Says Oregon should stop relying on higher taxes and take a hard look at how government spends the money it already has, prioritizing essential services and eliminating waste.", hegePriorities),
  stance("scott-c-hege", "leg-data-centers", "mixed", "Local choice, transparency",
    "Opposes a statewide moratorium and says local communities should decide; told Columbia Community Connection that Google's confidential water use damaged public trust and that he doesn't necessarily want more data centers in The Dalles.", hegeReported),
  stance("scott-c-hege", "leg-wildfire-funding", "supports", "Invest in initial attack",
    "Told Columbia Community Connection that investing far more in initial attack and forest treatment can avoid enormously expensive fires; backs prescribed burning and says homeowners must harden their own homes.", hegeReported),
);

/* ── Stakes: what the 2027 session decides, in sourced facts ─────────────── */
const oeaForecast = record("Oregon Office of Economic Analysis · September 2026 revenue forecast", "https://www.oregon.gov/das/oea/Documents/revenue0926.pdf",
  "September 2026; reviewed September 22, 2026",
  "The revenue-neutral instruction is the Chief Financial Office's 2027–29 policy-package guidance of February 10, 2026 (oregon.gov/das/Financial/Documents/2027-29 Budget POP Guidance - CFO.pdf).");
const lroSb1507 = record("Legislative Revenue Office · revenue impact of SB 1507 A", `${OLIS}/2026R1/Downloads/CommitteeMeetingDocument/314766`, "February 9, 2026; reviewed September 22, 2026");
const opbOdotCuts = { label: "OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance", url: "https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/", kind: "Reporting" as const, date: "August 21, 2026; reviewed September 22, 2026",
  note: "ODOT's own HB 3991 page (oregon.gov/odot/pages/hb3991.aspx) puts the 2025–27 gap closed by two 2026 bills at $297 million; KATU reported the Measure 120 result as 83% no on May 20, 2026." };
const hb5011Report = record("Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27", `${OLIS}/2025R1/Downloads/CommitteeMeetingDocument/308817`,
  "June 2025; reviewed September 22, 2026",
  "Bed, rehousing and prevention counts are from the governor's January 9, 2026 release on Executive Order 26-01 (apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-issues-executive-order-to-extend-homelessness-emergency).");
const jprDc = { label: "Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more", url: "https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further", kind: "Reporting" as const, date: "September 9, 2026; reviewed September 22, 2026",
  note: "The pause and the advisory committee's year-end deadline are in the governor's September 8, 2026 release (apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-pauses-work-on-requests-for-state-land-to-support-new-data-centers)." };
const cjcReport = record("Oregon Criminal Justice Commission · Behavioral Health Initiatives Report", "https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf", "November 1, 2025; reviewed September 22, 2026");
const lroHb3940 = record("Legislative Revenue Office · revenue impact of HB 3940 -A24", `${OLIS}/2025R1/Downloads/CommitteeMeetingDocument/309208`,
  "June 19, 2025; reviewed September 22, 2026",
  "The 2.5 million acres figure is OPB's, from the Oregon Capital Chronicle, August 21, 2026 (opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); SB 83's repeal of the hazard map is on OLIS (2025R1, SB 83).");
const govImmBills = record("Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities", "https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities", "April 9, 2026; reviewed September 22, 2026");
const sb83Record = record("OLIS · SB 83 (2025), wildfire hazard map and building-code repeal", `${OLIS}/2025R1/Measures/Overview/SB83`, "Passed the Senate 29–0 on April 22, 2025 and the House 50–1 on June 24, 2025; signed July 24, 2025; reviewed September 22, 2026");
const occOdotFeb = { label: "Oregon Capital Chronicle, via The Outlook · Layoffs or redirecting funding: lawmakers grapple with ODOT budget gap again", url: "https://theoutlookonline.com/2026/02/12/layoffs-or-redirecting-funding-oregon-lawmakers-grapple-with-odot-budget-gap-again/", kind: "Reporting" as const, date: "February 12, 2026; reviewed September 22, 2026" };
const katuOdotUpdate = { label: "KATU · ODOT leaders provide an update on agency projects and finances", url: "https://katu.com/news/local/odot-leaders-provide-an-update-on-agency-projects-and-finances", kind: "Reporting" as const, date: "October 1, 2025; reviewed September 22, 2026", note: "HB 3991's repeal of the mandatory toll program is in its OLIS digest (2025S1, HB 3991)." };
const opbHoodRiver = { label: "OPB · Oregon matches Washington’s $125 million to replace the Hood River–White Salmon bridge", url: "https://www.opb.org/article/2025/07/08/oregon-matches-washington-125-million-replace-hood-river-white-salmon-bridge/", kind: "Reporting" as const, date: "July 8, 2025; reviewed September 22, 2026",
  note: "The $1.12 billion program cost, the November 2025 federal Record of Decision and the 2027 construction target are on the Bridge Authority's project page (hoodriverbridge.org/project-overview)." };
const opbGrasshopper = { label: "OPB · The Grasshopper Fire destroyed homes and tested firefighters", url: "https://www.opb.org/article/2026/08/17/grasshopper-fire-what-comes-next/", kind: "Reporting" as const, date: "August 17, 2026; reviewed September 22, 2026" };
const opbHillsboroDc = { label: "OPB · Hillsboro mayor’s absence looms large in heated data center discussions", url: "https://www.opb.org/article/2026/06/18/hillsboro-mayor-absence-looms-large-heated-data-center-discussions/", kind: "Reporting" as const, date: "June 18, 2026; reviewed September 22, 2026",
  note: "The failed 2026 industrial-land bill is OPB's March 3, 2026 report (opb.org/article/2026/03/03/hillsboro-will-not-get-more-industrial-land-for-high-tech-data-centers/)." };
const opbWlwv = { label: "OPB · After school closure vote, West Linn-Wilsonville school board faces recall", url: "https://www.opb.org/article/2026/03/09/school-closure-vote-west-linn-wilsonville-recall/", kind: "Reporting" as const, date: "March 9, 2026; reviewed September 22, 2026" };
const opbBeaverton = { label: "OPB · Oregon’s second largest school district has a new leader", url: "https://www.opb.org/article/2026/07/09/beaverton-school-district-new-superintendent/", kind: "Reporting" as const, date: "July 9, 2026; reviewed September 22, 2026",
  note: "Executive Order 26-06 (April 16, 2026) bars districts from cutting instructional time for budget reasons: apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-issues-executive-order-to-preserve-student-instructional-time." };
const opbAstoria = { label: "KMUN, via OPB · ICE operations at Port of Astoria spark concerns", url: "https://www.opb.org/article/2026/06/08/astoria-oregon-ice-operations-spark-concerns-sanctuary-law/", kind: "Reporting" as const, date: "June 8, 2026; reviewed September 22, 2026" };
const opbGresham = { label: "OPB · Gresham family detained by immigration officers while seeking medical care for their 7-year-old", url: "https://www.opb.org/article/2026/01/23/gresham-family-seeking-medical-care-child-detained-immigration-officers/", kind: "Reporting" as const, date: "January 23, 2026; reviewed September 22, 2026",
  note: "SB 1570's hospital-policy requirement is described in the governor's April 9, 2026 release." };

type StakeItem = RaceStakes["items"][number];
const budgetGapItem: StakeItem = { label: "2027–29 budget gap", source: oeaForecast,
  text: "Federal H.R. 1 is projected to open a gap between the cost of current programs and revenue, so the Chief Financial Office told agencies on February 10, 2026 that 2027–29 requests must be revenue-neutral. September’s forecast shows a $400 million 2025–27 ending balance, $3.46 billion in reserves (9.7% of the general fund) and no kicker due on 2028 returns." };
const disconnectItem: StakeItem = { label: "Tax disconnect", source: lroSb1507,
  text: "SB 1507 (2026) disconnected Oregon from federal H.R. 1 business tax breaks and enlarged the Earned Income Tax Credit, a net $314 million for the 2027–29 general fund by the Legislative Revenue Office’s estimate. Whether to go further, or to cut instead, is the 2027 session’s call." };
const roadFundingItem: StakeItem = { label: "Road funding", source: opbOdotCuts,
  text: "Voters repealed HB 3991’s gas-tax and fee increases in May 2026, and the 2026 session redirected existing money to close ODOT’s $297 million gap through June 2027. ODOT now projects a $200 million gap for 2027–29 and nearly 200 maintenance-job cuts; the governor’s workgroup owes recommendations for a 2027 package by year’s end." };
const shelterCliffItem: StakeItem = { label: "Shelter money cliff", source: hb5011Report,
  text: "The statewide shelter program has $204.9 million for 2025–27, $102.5 million of it one-time money that ends June 30, 2027, and the homelessness emergency runs through January 10, 2027. The state counts 6,286 shelter beds added or kept, 5,539 people rehoused and 25,942 households kept housed since January 2023." };
const dataCenterItem: StakeItem = { label: "Data centers", source: jprDc,
  text: "About 144 data centers get roughly $450 million a year in property-tax breaks, a figure the Legislative Revenue Office called “pretty close” on September 8, 2026. Data-center deals on state land are paused through July 1, 2027, and the governor’s advisory committee owes recommendations for a 2027 bill by the end of 2026." };
const deflectionItem: StakeItem = { label: "Deflection funding", source: cjcReport,
  text: "HB 4002’s county deflection programs, run by 28 counties and six tribes in the first cycle, have $40 million for 2025–27; through August 4, 2025 the state logged 2,096 deflection events, 1,308 program entries and 277 completions. The 2027–29 budget decides whether the grants continue." };
const wildfireItem: StakeItem = { label: "Wildfire costs", source: lroHb3940,
  text: "Fires burned a record 2.5 million acres in summer 2026. HB 3940’s nicotine tax and Rainy Day Fund interest put about $63 million into two wildfire funds in 2027–29 by the Legislative Revenue Office’s estimate, and SB 83 (2025) repealed the statewide hazard map that would have driven building and defensible-space rules." };
const federalEnforcementItem: StakeItem = { label: "Federal enforcement", source: govImmBills,
  text: "Eight immigrant-protection bills signed April 9, 2026 set rules for schools, hospitals, courts and data brokers and require officers to identify themselves; an interagency council created by Executive Order 26-04 coordinates the state’s response. The 2027 session decides what comes next." };
const wlwvItem: StakeItem = { label: "West Linn-Wilsonville schools", source: opbWlwv,
  text: "The West Linn-Wilsonville board voted December 18, 2025 to close Bolton and Stafford primary schools to help fill a $10 million gap as enrollment falls, two weeks after voters passed a $190 million bond. State school money follows enrollment per pupil, and the 2027–29 State School Fund sets the base." };
const booneItem: StakeItem = { label: "Boone Bridge money", source: occOdotFeb,
  text: "To avoid layoffs in February 2026, ODOT proposed redirecting $30 million designated for the Rose Quarter, Abernethy Bridge and I-5 Boone Bridge projects toward maintenance, along with $194 million for bridge and seismic work and $15 million for Safe Routes to School." };
const hillsboroDcItem: StakeItem = { label: "Hillsboro data centers", source: opbHillsboroDc,
  text: "Hillsboro has 34 data centers, more than any Oregon city, and in 2026 signed off on enterprise-zone tax exemptions for 15 developments tied to new or existing ones. A 2026 bill to add 373 acres to Hillsboro’s growth boundary for high-tech industry died after objections that it would allow more data centers." };
const coastCrewsItem: StakeItem = { label: "Coastal road crews", source: occOdotFeb,
  text: "An ODOT employee from the Astoria area told lawmakers in February 2026 that funding uncertainty had cut his crew in half, leaving eight people for 304 shoulder miles; the agency said closing a $242 million gap without new revenue meant up to 400 layoffs or redirecting money from bridges, Safe Routes to School and transit." };
const astoriaIceItem: StakeItem = { label: "ICE at the Port", source: opbAstoria,
  text: "On June 7, 2026 federal immigration officers staged an operation from fenced Port of Astoria property in which three people are believed to have been detained; advocates said it may have violated Oregon’s sanctuary law and planned a complaint to the Oregon Department of Justice." };
const beavertonItem: StakeItem = { label: "Beaverton schools", source: opbBeaverton,
  text: "The Beaverton School District closed McKay Elementary and cut 159 full-time positions to fill a $37 million gap, using $16.6 million in reserves for the rest. Executive Order 26-06 now bars districts from cutting instructional time to balance budgets and requires districts that did to restore it by 2027–28." };
const abernethyItem: StakeItem = { label: "Abernethy Bridge", source: katuOdotUpdate,
  text: "The I-205 Abernethy Bridge between West Linn and Oregon City is costing $672 million against an original $495 million authorization, ODOT reported in October 2025, with completion expected in 2026. HB 3991 repealed the mandatory toll program that had been planned for I-205." };
const greshamItem: StakeItem = { label: "Hospital detention", source: opbGresham,
  text: "On January 16, 2026 immigration officers detained a Gresham family, including a 7-year-old Alder Elementary student, in the parking lot of Portland Adventist Health as they sought care. SB 1570, signed April 9, 2026, now requires hospitals to set policies for law-enforcement visits and designate non-public areas." };
const hoodRiverItem: StakeItem = { label: "Hood River bridge", source: opbHoodRiver,
  text: "Replacing the 1924 Hood River–White Salmon bridge is estimated at $1.12 billion; SB 5531 (2025) committed $105 million from Oregon over six years, including $30 million the 2027–29 budget must deliver, and the Bridge Authority is seeking the last federal piece to start construction in 2027." };
const grasshopperItem: StakeItem = { label: "Grasshopper Fire", source: opbGrasshopper,
  text: "The Grasshopper Fire east of Mount Hood burned nearly 90,000 acres of Wasco County and destroyed six homes by August 16, 2026, with 12,000 acres burning in a single hour on August 10 as it ran through the community of Friend." };
const sb83Item: StakeItem = { label: "Wildfire map repeal", source: sb83Record,
  text: "SB 83 (2025), passed 29–0 in the Senate and 50–1 in the House, repealed the statewide wildfire hazard map and the building-code and defensible-space requirements tied to it. Any replacement rules for homes in the wildland-urban interface would have to come from the Legislature." };

const senateIntro = (where: string, tail: string) =>
  `${where} A state senator is one of 30 votes on the two-year budget, on any tax increase (three-fifths) and on holding back a kicker (two-thirds), and confirms the governor’s appointees. ${tail}`;
const houseIntro = (where: string, tail: string) =>
  `${where} A state representative is one of 60 votes on the two-year budget, on any tax increase (three-fifths) and on holding back a kicker (two-thirds). ${tail}`;
const TAIL = "The 2027 session opens in January with a budget gap, no durable road-funding source and shelter money that runs out in June 2027.";
stakes.push(
  { raceId: "oregon-state-senate-13", intro: senateIntro("Senate District 13 runs from Tigard, King City and Sherwood through Wilsonville and the farm country toward Newberg.", TAIL),
    items: [budgetGapItem, roadFundingItem, booneItem, wlwvItem, shelterCliffItem, dataCenterItem, deflectionItem] },
  { raceId: "oregon-state-senate-15", intro: senateIntro("Senate District 15 covers Forest Grove, Cornelius and west and central Hillsboro, the center of Oregon’s data-center industry.", TAIL),
    items: [budgetGapItem, hillsboroDcItem, dataCenterItem, roadFundingItem, shelterCliffItem, federalEnforcementItem, deflectionItem] },
  { raceId: "oregon-state-senate-16", intro: senateIntro("Senate District 16 is the North Coast and lower Columbia, from Astoria and Tillamook to St. Helens and Scappoose.", TAIL),
    items: [budgetGapItem, roadFundingItem, coastCrewsItem, astoriaIceItem, wildfireItem, shelterCliffItem, deflectionItem] },
  { raceId: "oregon-state-senate-17", intro: senateIntro("Senate District 17 covers Bethany, Oak Hills and Cedar Mill in the Beaverton School District, plus Forest Park, Linnton and Northwest Portland.", TAIL),
    items: [budgetGapItem, beavertonItem, roadFundingItem, shelterCliffItem, dataCenterItem, deflectionItem, federalEnforcementItem] },
  { raceId: "oregon-state-senate-19", intro: senateIntro("Senate District 19 covers Lake Oswego, West Linn, Tualatin, Durham, Rivergrove, Stafford and part of Southwest Portland; its senator is the Senate President.", TAIL),
    items: [budgetGapItem, disconnectItem, roadFundingItem, abernethyItem, wlwvItem, shelterCliffItem, dataCenterItem] },
  { raceId: "oregon-state-senate-20", intro: senateIntro("Senate District 20 covers Oregon City, Gladstone, Johnson City, Happy Valley and unincorporated Clackamas County toward Damascus.", TAIL),
    items: [budgetGapItem, disconnectItem, roadFundingItem, abernethyItem, shelterCliffItem, deflectionItem, dataCenterItem] },
  { raceId: "oregon-state-senate-24", intro: senateIntro("Senate District 24 covers East Portland east of I-205, Gresham, Wood Village, Fairview and Troutdale.", TAIL),
    items: [budgetGapItem, shelterCliffItem, roadFundingItem, greshamItem, federalEnforcementItem, dataCenterItem, deflectionItem] },
  { raceId: "oregon-state-senate-26", intro: senateIntro("Senate District 26 runs from Hood River and The Dalles through Mount Hood country to Sandy, Estacada and Canby.", TAIL),
    items: [budgetGapItem, hoodRiverItem, grasshopperItem, wildfireItem, roadFundingItem, dataCenterItem, shelterCliffItem] },
  { raceId: "oregon-state-house-26", intro: houseIntro("House District 26 covers Sherwood, Wilsonville, King City and Bull Mountain, with rural Washington and Yamhill County land toward Newberg.", TAIL),
    items: [budgetGapItem, roadFundingItem, booneItem, wlwvItem, shelterCliffItem, dataCenterItem, deflectionItem] },
  { raceId: "oregon-state-house-29", intro: houseIntro("House District 29 covers Forest Grove, Cornelius, Dilley, Gaston and the western edge of Hillsboro.", TAIL),
    items: [budgetGapItem, hillsboroDcItem, dataCenterItem, roadFundingItem, shelterCliffItem, federalEnforcementItem, deflectionItem] },
  { raceId: "oregon-state-house-40", intro: houseIntro("House District 40 covers Oregon City, Gladstone, Jennings Lodge, Oatfield and Johnson City, at the Clackamas County end of the Abernethy Bridge.", TAIL),
    items: [budgetGapItem, roadFundingItem, abernethyItem, shelterCliffItem, deflectionItem, dataCenterItem, disconnectItem] },
  { raceId: "oregon-state-house-51", intro: houseIntro("House District 51 is rural Clackamas County: Sandy, Estacada, Beavercreek, Mulino and Canby, much of it in the wildland-urban interface.", TAIL),
    items: [budgetGapItem, wildfireItem, sb83Item, roadFundingItem, shelterCliffItem, dataCenterItem, disconnectItem] },
  { raceId: "oregon-state-house-52", intro: houseIntro("House District 52 runs from Hood River and The Dalles through Mount Hood Villages to Corbett and the Multnomah County side of the Gorge.", TAIL),
    items: [budgetGapItem, hoodRiverItem, grasshopperItem, wildfireItem, dataCenterItem, roadFundingItem, shelterCliffItem] },
);
