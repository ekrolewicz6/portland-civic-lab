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
 * Race pack: Portland City Auditor and the Gresham Mayor and Council
 * (Positions 2, 4 and 6). Researched September 21, 2026 from the November
 * 2026 Multnomah County voters' pamphlet (Portland Auditor on PDF page 52,
 * Gresham on 41–45, text extracted with pdftotext) and each campaign site
 * the statement prints (fetched directly; Coleman-Cox's site was read in a
 * browser because it renders by script). Schroeder, Gladfelter and Miller
 * print no site; their City of Gresham filing packets were read. Miller has
 * no pamphlet statement and is a filing-only row. Positions come only from
 * the candidate's own material; a missing issue is a research gap, never a
 * position. Every entry names its source; publication by the county does
 * not verify any claim.
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
const cityRcv: Evidence = {
  label: "City of Portland · How does Ranked Choice Voting work?",
  url: "https://www.portland.gov/vote/ranked-choice-voting",
  kind: "Election authority",
  date: "Checked September 21, 2026",
  note: "States that the auditor is elected citywide by single-winner ranked choice voting and that voters may rank up to six candidates.",
};
const greshamElections: Evidence = {
  label: "City of Gresham · Elections",
  url: "https://www.greshamoregon.gov/government/elections/",
  kind: "Election authority",
  date: "Checked September 21, 2026",
  note: "Lists the Mayor and Council Positions 2, 4 and 6 as single seats on the November 3, 2026 ballot. Ranked choice voting applies only to County and City of Portland contests (Multnomah County Elections, multco.us/info/ranked-choice-voting-rcv), so each Gresham seat is a vote for one.",
};
const voteForOne = (raceId: string): BallotInstruction => ({ raceId, text: "You vote for one candidate.", source: greshamElections });
const RANKED_NOTE =
  "Ranking more people never hurts your first choice. Later choices count only if an earlier one is eliminated.";
const ranked = (raceId: string): BallotInstruction => ({ raceId, text: "You rank up to six candidates for one seat.", note: RANKED_NOTE, source: cityRcv });
/* Gresham filing packets: the City posts each candidate's SEL 101 and 100-word statement. */
const packet = (slug: string): string => `https://www.greshamoregon.gov/globalassets/government/candidate-${slug}.pdf`;

/* ── Portland City Auditor ──────────────────────────────────────────── */
const redeAbout = site("Rede · about", "https://www.simoneforauditor.com/about");
const redeValues = site("Rede · values", "https://www.simoneforauditor.com/values");
candidate("simone-rede", {
  values: ["Independent oversight", "Tax-dollar effectiveness"],
  tradeoff:
    "Audits can identify problems and track recommendations but do not implement bureau fixes; her case rests on follow-through she credits to her first term.",
  sources: [pamphlet(52), site("Rede · campaign home", "https://www.simoneforauditor.com/"), redeAbout, redeValues],
  issues: {
    safety: {
      position: "Sustain the improvements to 911 call wait times that she says her office’s work helped produce.",
      source: pamphlet(52),
      line: "Wants 911 call wait-time improvements sustained.",
      chip: "Sustain 911 gains",
      how: step(
        "Select audit topics Portlanders raise, such as gun violence, and follow up on recommendations; she cites releasing the first city audit of the Joint Office of Homeless Services.",
        redeAbout,
      ),
    },
    money: {
      position:
        "Apply professional auditing standards independently to ensure fair opportunities and effective use of tax dollars; she cites strengthening oversight of the Arts Access Fund and calling attention to roads, parks and asset-maintenance backlogs.",
      source: pamphlet(52),
      line: "Wants independent audits that ensure effective use of tax dollars.",
      chip: "Independent audits",
      how: step(
        "Keep distance from the bureaus under review and control over the office’s own budget and decisions; she cites proposing a city transparency-advocate position.",
        redeValues,
      ),
    },
    climate: {
      position: "Ensure the city follows through on its climate commitments, an audit area she says she chose because Portlanders raised it.",
      source: pamphlet(52),
      line: "Wants the city held to its climate commitments through audit follow-up.",
      chip: "Audit climate promises",
    },
  },
});
ownWords.push(
  opening(
    "simone-rede",
    52,
    "Portland deserves an auditor who sees the promise of our people and our city and will use the office to get the best possible outcomes for all of us.",
    29,
  ),
);
contact(
  "simone-rede",
  [
    web("https://www.simoneforauditor.com/", "pamphlet"),
    email("simoneforauditor@gmail.com", "site"),
    form("https://www.simoneforauditor.com/get-involved", "Volunteer form", "site"),
    social("Facebook", "https://www.facebook.com/simoneforauditor/", "site"),
    social("Instagram", "https://www.instagram.com/simoneforauditor/", "site"),
    social("X", "https://twitter.com/simone_rede", "site"),
    social("LinkedIn", "https://www.linkedin.com/in/simonerede", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 52", `${PAMPHLET}#page=52`, "Prints www.simoneforauditor.com."),
    ref("Rede · Get Involved", "https://www.simoneforauditor.com/get-involved", "Holds a ways-to-help form; the email, a P.O. box and profile links are in the site footer. No phone is published."),
  ],
);
primary.push({ candidateId: "simone-rede", sourceUrl: `${PAMPHLET}#page=52` });
portraits["simone-rede"] = portrait("simone-rede", 52);
ballots.push(ranked("portland-auditor"));
choice.push({
  raceId: "portland-auditor",
  text: "One candidate appears on the city’s checked register. Even uncontested, the office’s choices matter: which audits come first, whether recommendations get done, and how the auditor keeps independence from the bureaus it reviews.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Gresham Mayor ──────────────────────────────────────────────────── */
const piazzaSite = site("Piazza · campaign home", "https://votepiazza.com/");
candidate("sue-piazza", {
  values: ["Spending discipline", "Leadership change"],
  tradeoff:
    "Her program puts management change and cost control first; the statement does not say which fees would fall, what they raise now or which services would absorb the difference.",
  sources: [pamphlet(41), piazzaSite],
  issues: {
    housing: {
      position:
        "Bring a wider range of housing to Gresham, including what she calls next-level and executive housing, so people who succeed do not have to leave the city; address homelessness in a way that is both compassionate and accountable.",
      source: piazzaSite,
      line: "Wants a wider range of housing, including higher-end homes, so residents stay.",
      chip: "Wider housing range",
    },
    safety: {
      position:
        "Keep public safety the top priority: reduce crime and address homelessness without allowing tents and encampments to take over streets and parks; she cites championing the Public Safety Levy that put more police officers and firefighters on the streets.",
      source: pamphlet(41),
      line: "Wants crime reduced and no encampments in streets and parks, building on the levy.",
      chip: "Police first, no tents",
      how: step(
        "Build on the police and fire levy she says she led, with smart investments in police and fire and drug addiction managed so neighborhoods are safe enough for businesses to invest.",
        piazzaSite,
      ),
    },
    money: {
      position:
        "Hold City Hall accountable for efficient, transparent government, lower unnecessary costs and fees, and prioritize tax dollars on critical services; she says government can do more with less.",
      source: pamphlet(41),
      line: "Wants unnecessary costs and fees cut and tax dollars focused on critical services.",
      chip: "Cut fees and costs",
    },
  },
});
ownWords.push(
  opening(
    "sue-piazza",
    41,
    "You work hard to build a good life in Gresham. City government should work just as hard for you.",
    19,
    "The opening line “But this isn’t about me, it’s about you...” trails off with an ellipsis rather than terminal punctuation and the tagline “YOUR CITY. YOUR SAFETY. YOUR MONEY. YOUR FUTURE.” has no predicate; both are skipped. The first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "sue-piazza",
  [web("https://votepiazza.com/", "pamphlet"), email("VotePiazza@gmail.com", "filing"), social("Facebook", "https://facebook.com/votepiazza", "site")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 41", `${PAMPHLET}#page=41`, "Prints VotePiazza.com."),
    ref("Piazza · campaign home", "https://votepiazza.com/", "The profile link is in the footer; the site has a newsletter sign-up but no email, phone or contact form."),
    ref("Sue Piazza · City of Gresham candidate filing packet", packet("sue-piazza-mayor"), "The SEL 101 email field gives VotePiazza@gmail.com and the website field VotePiazza.com; its phone fields are not reproduced."),
  ],
);
roles.push({ candidateId: "sue-piazza", role: "City councilor and business coach", from: "background" });
primary.push({ candidateId: "sue-piazza", sourceUrl: `${PAMPHLET}#page=41` });
portraits["sue-piazza"] = portrait("sue-piazza", 41);

const stovallSite = site("Stovall · Gresham Together (results and next four years)", "https://greshamtogether.org/");
candidate("travis-stovall", {
  values: ["Continuity", "Public-safety investment"],
  tradeoff:
    "He asks for four more years of the same investments, crediting his term with new officers, new employers and a 30% drop in poverty; those attributions need independent checks before assigning credit.",
  sources: [pamphlet(41), stovallSite],
  issues: {
    housing: {
      position:
        "Expand compassionate, accountability-focused homelessness responses that connect people with shelter, mental-health care and support while keeping public spaces clean and safe; his site adds permanent supportive housing and regional mental-health partnerships.",
      source: pamphlet(41),
      line: "Wants outreach and shelter connections expanded while public spaces stay clean and safe.",
      chip: "Shelter plus clean spaces",
      how: step(
        "Expanded outreach teams reaching people where they are, transitional-housing beds to move people from tents to stability, and permanent supportive housing with regional mental-health partnerships.",
        stovallSite,
      ),
    },
    safety: {
      position:
        "Continue supporting the police and fire departments to maintain fast response times and keep every neighborhood safe; he cites funding 9 new sworn officers and 12 firefighters and restoring specialty units.",
      source: pamphlet(41),
      line: "Wants continued police and fire funding to keep response times fast.",
      chip: "Fund police and fire",
      how: step("Sustained funding for first responders and neighborhood safety initiatives, with youth programs (EMOPI) as positive pathways.", stovallSite),
      measure: step("Cites 9 new sworn officers and 12 firefighters funded, faster emergency response times and restored specialty units.", pamphlet(41)),
    },
    money: {
      position:
        "Secure Gresham’s long-term financial health through transparent budgeting and efficient city operations, and bring taxpayers’ dollars back from Salem and Washington, D.C., to fund roads, pipes and parks.",
      source: stovallSite,
      line: "Wants transparent budgeting and state and federal grants funding roads, pipes, parks.",
      chip: "Grants for roads, pipes",
    },
  },
});
ownWords.push(
  opening(
    "travis-stovall",
    41,
    "When you elected me as Mayor, I promised to build upon the Gresham Foundation, deliver essential services, and put Gresham on a sustainable financial path.",
    25,
    "The tagline “PROVEN LEADERSHIP. REAL RESULTS FOR GRESHAM.” (no predicate) is skipped.",
  ),
);
contact(
  "travis-stovall",
  [web("https://greshamtogether.org/", "pamphlet"), email("travis@greshamtogether.com", "filing"), form("https://greshamtogether.org/", "Volunteer form", "site")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 41", `${PAMPHLET}#page=41`, "Prints www.GreshamTogether.org."),
    ref("Stovall · Gresham Together", "https://greshamtogether.org/", "The home page holds volunteer and yard-sign forms; no email, phone or social profile is published on the site."),
    ref("Travis Stovall · City of Gresham candidate filing packet", packet("travis-stovall-mayor"), "The SEL 101 email field gives travis@greshamtogether.com; its phone fields are not reproduced."),
  ],
);
primary.push({ candidateId: "travis-stovall", sourceUrl: `${PAMPHLET}#page=41` });
portraits["travis-stovall"] = portrait("travis-stovall", 41);
ballots.push(voteForOne("gresham-mayor"));
choice.push({
  raceId: "gresham-mayor",
  text: "Both put police, fire and business growth first. One case rests on continuing current investments and youth programs; the other on new leadership, spending scrutiny and lower fees. Ask each which budget lines would actually move.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Gresham Council, Position 2 ────────────────────────────────────── */
const hccPriorities = site("Coleman-Cox · campaign priorities", "https://togetherwithheather.org/campaign-priorities");
const hccEmail: Evidence = {
  label: "Coleman-Cox · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#coleman-cox-2026-09-23",
  kind: "Candidate statement",
  date: "Received September 23, 2026",
  note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on her brief. Receipt does not verify the claims.",
};
candidate("heather-coleman-cox", {
  values: ["Neighborhood revitalization", "Safety with trust"],
  tradeoff:
    "She connects housing, infrastructure and safety investment to economic opportunity; delivering all four priorities means choosing among competing capital needs she has not ranked.",
  sources: [pamphlet(42), site("Coleman-Cox · campaign home", "https://togetherwithheather.org/"), hccPriorities],
  issues: {
    housing: {
      position:
        "Put vacant properties back to productive use, expand housing opportunities and plan responsibly for growth; her platform adds affordable-homeownership pathways, home repairs and weatherization, preserving existing affordable housing and preventing displacement.",
      source: pamphlet(42),
      line: "Wants vacant properties reused, housing choices expanded, existing affordable homes preserved.",
      chip: "Reuse vacant properties",
      how: step(
        "Build on programs the city’s Community Development and Housing Committee already runs: home-repair, accessibility and weatherization help, homeownership pathways and responsible development offering a range of housing choices.",
        hccPriorities,
      ),
    },
    safety: {
      position:
        "Support firefighters, police officers and community-based approaches that make every neighborhood safer, with transparent reporting on public-safety funding and results.",
      source: pamphlet(42),
      line: "Supports police, fire and community-based safety with transparent reporting on results.",
      chip: "Police plus community",
      how: step(
        "Neighborhood-based violence-prevention programs, expanded behavioral-health and crisis-response partnerships, and transparent reporting on how public-safety levy dollars are spent, drawing on her levy-subcommittee chairmanship.",
        hccPriorities,
      ),
    },
    money: {
      position:
        "Protect taxpayer dollars by bringing accountability, transparency and sound decision-making to city government, and invest in utilities and parks.",
      source: pamphlet(42),
      line: "Wants accountability and transparency for taxpayer dollars, with investment in utilities and parks.",
      chip: "Accountable spending",
      how: step(
        "As chair of the Public Safety Levy Committee: quarterly meetings with city staff and police and fire leaders, public reports, and a check that each levy dollar matches the ballot language voters passed.",
        hccEmail,
      ),
    },
    climate: {
      position: "Growth should improve infrastructure, protect natural resources and promote environmentally responsible development.",
      source: hccPriorities,
      line: "Wants growth that protects natural resources and environmentally responsible development.",
      chip: "Green responsible growth",
    },
  },
});
ownWords.push(
  opening(
    "heather-coleman-cox",
    42,
    "Heather Coleman-Cox has spent years serving Gresham listening to residents, bringing people together, and solving problems affecting Gresham families every day.",
    21,
    "The tagline “EXPERIENCED LEADERSHIP. PRACTICAL SOLUTIONS. A STRONGER GRESHAM.” (no predicate) is skipped.",
  ),
);
contact(
  "heather-coleman-cox",
  [
    web("https://togetherwithheather.org/", "pamphlet"),
    email("heatherforgresham@gmail.com", "site"),
    phone("5039746548", "503-974-6548", "site"),
    form("https://togetherwithheather.org/contact", "Contact form", "site"),
    social("Facebook", "https://www.facebook.com/HeatherForGresham", "site"),
    social("Instagram", "https://www.instagram.com/HeatherForGresham", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 42", `${PAMPHLET}#page=42`, "Prints TogetherWithHeather.org."),
    ref("Coleman-Cox · contact page", "https://togetherwithheather.org/contact", "Prints the campaign phone, email and a P.O. box beside a message form; profile links are in the footer. Read in a browser; the site renders by script."),
  ],
);
primary.push({ candidateId: "heather-coleman-cox", sourceUrl: `${PAMPHLET}#page=42` });
portraits["heather-coleman-cox"] = portrait("heather-coleman-cox", 42);

const delplatoSite = site("DelPlato · campaign home and issues", "https://votedelplato.com/");
candidate("will-delplato", {
  values: ["Early budget fixes", "Streamlined permitting"],
  tradeoff:
    "His premise is that small, early budget changes prevent painful cuts later; the statement does not quantify those changes or name the programs it would review.",
  sources: [pamphlet(42), delplatoSite],
  issues: {
    housing: {
      position: "Promote smart development and efficient city management to help keep housing and daily living more affordable.",
      source: delplatoSite,
      line: "Wants smart development and efficient management to keep housing more affordable.",
      chip: "Smart development",
    },
    safety: {
      position:
        "Support the police and first responders, strengthen partnerships between law enforcement and neighborhoods, and invest in prevention programs to keep families safe.",
      source: pamphlet(42),
      line: "Supports police and first responders plus neighborhood partnerships and prevention programs.",
      chip: "Police plus prevention",
    },
    money: {
      position:
        "Gresham’s budget shortfall is growing; act now with small, early changes rather than waiting for painful ones, review city spending for efficiencies, hold programs accountable, and streamline permitting so red tape does not deter entrepreneurs.",
      source: pamphlet(42),
      line: "Wants small, early budget changes now, spending reviewed, permitting (building approvals) streamlined.",
      chip: "Small cuts early",
    },
    climate: {
      position: "Focus on road maintenance, public spaces and long-term planning to ensure safe and sustainable neighborhoods.",
      source: delplatoSite,
      line: "Wants road maintenance, public spaces and long-term planning prioritized.",
      chip: "Maintain roads",
    },
  },
});
ownWords.push(
  opening(
    "will-delplato",
    42,
    "I have spent my life serving others. As a U.S. Army veteran, registered nurse, and hospital leader, I’ve learned that leadership is about listening, solving problems, and putting people first.",
    30,
    "The first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "will-delplato",
  [
    web("https://votedelplato.com/", "pamphlet"),
    email("will@votedelplato.com", "site"),
    phone("5036831763", "503.683.1763", "site"),
    form("https://votedelplato.com/contact/", "Contact form", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 42", `${PAMPHLET}#page=42`, "Prints votedelplato.com."),
    ref("DelPlato · contact page", "https://votedelplato.com/contact/", "Email and phone are printed on the contact page and in the site footer beside a message form; no social profile is linked."),
  ],
);
roles.push({ candidateId: "will-delplato", role: "Retired nurse and Army veteran", from: "background" });
primary.push({ candidateId: "will-delplato", sourceUrl: `${PAMPHLET}#page=42` });
portraits["will-delplato"] = portrait("will-delplato", 42);
ballots.push(voteForOne("gresham-position-2"));
choice.push({
  raceId: "gresham-position-2",
  text: "Compare how each candidate would combine public-safety spending, housing development and budget discipline, and which of the three would give way when they compete for the same dollars.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Gresham Council, Position 4 ────────────────────────────────────── */
const aljaouniHome = site("Al-jaouni · campaign home and priorities", "https://www.joshuaforgresham.com/");
candidate("joshua-al-jaouni", {
  values: ["Second chances", "Fewer fees"],
  tradeoff:
    "The program combines growth and enforcement with treatment and recovery services; how expanded services would be paid for while keeping fees off households is not established.",
  sources: [pamphlet(44), aljaouniHome, site("Al-jaouni · about", "https://www.joshuaforgresham.com/about")],
  issues: {
    housing: {
      position:
        "Encourage responsible growth, expand housing opportunities and reduce unnecessary barriers that drive up costs; connect people to treatment, recovery, mental-health resources and pathways to stable housing.",
      source: aljaouniHome,
      line: "Wants housing opportunities expanded and cost-driving barriers reduced.",
      chip: "Cut housing barriers",
    },
    safety: {
      position:
        "Support police and first responders so every family feels safe, expand access to treatment and recovery with clear expectations for public safety, and back restorative-justice programs that help people break destructive cycles and make amends.",
      source: pamphlet(44),
      line: "Supports fully funded police and first responders alongside restorative-justice programs.",
      chip: "Enforcement plus recovery",
    },
    money: {
      position:
        "Keep unnecessary fees and costs off residents while encouraging responsible growth, and make transparency, fiscal responsibility and accountability priorities so taxpayer dollars are spent wisely.",
      source: pamphlet(44),
      line: "Wants unnecessary fees kept off residents and taxpayer dollars spent wisely.",
      chip: "Keep fees off residents",
    },
  },
});
ownWords.push(
  opening(
    "joshua-al-jaouni",
    44,
    "I am a husband, father, pastor, entrepreneur, and community leader who believes in the power of hope, personal responsibility, and serving others.",
    22,
  ),
);
contact(
  "joshua-al-jaouni",
  [web("https://www.joshuaforgresham.com/", "pamphlet"), email("joshuaaljaouni0@gmail.com", "filing")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 44", `${PAMPHLET}#page=44`, "Prints JoshuaForGresham.com."),
    ref("Al-jaouni · campaign home", "https://www.joshuaforgresham.com/", "The site has a newsletter sign-up (“Join Team Joshua”) but publishes no email, phone, contact form or social profile."),
    ref("Joshua Al-jaouni · City of Gresham candidate filing packet", packet("joshua-al-jaouni-seat-4"), "The SEL 101 email field gives joshuaaljaouni0@gmail.com; its phone field is not reproduced."),
  ],
);
roles.push({ candidateId: "joshua-al-jaouni", role: "Pastor and small-business owner", from: "background" });
primary.push({ candidateId: "joshua-al-jaouni", sourceUrl: `${PAMPHLET}#page=44` });
portraits["joshua-al-jaouni"] = portrait("joshua-al-jaouni", 44);

const azizHome = site("Aziz · campaign home", "https://www.azizforgresham.com/");
candidate("krestina-aziz", {
  values: ["Emergency resilience", "Transparent information"],
  tradeoff:
    "Her statement makes resilience and communication the tests of city performance; which preparedness gaps she would close first, and at what cost, is not specified.",
  sources: [pamphlet(43), azizHome],
  issues: {
    housing: {
      position: "Support smooth development of projects that enhance the city, at the right pace, scale and time.",
      source: pamphlet(43),
      line: "Supports development at the right pace, scale and time.",
      chip: "Paced, sensible growth",
    },
    money: {
      position:
        "Ensure Gresham receives its fair share of public resources, with timely information for residents and accountability in city decisions, including the transition to water wells.",
      source: azizHome,
      line: "Wants Gresham’s fair share of public resources and accountable decisions.",
      chip: "Fair share of resources",
    },
    climate: {
      position:
        "Strengthen hazardous-material emergency response, earthquake preparedness and infrastructure resilience, reduce harmful exposures, and give residents timely information and accountability on the transition to water wells.",
      source: pamphlet(43),
      line: "Wants hazardous-material response, earthquake readiness and water-well transition transparency.",
      chip: "Hazmat and quake readiness",
    },
  },
});
ownWords.push(
  opening(
    "krestina-aziz",
    43,
    "Gresham is at a crossroads. We need proactive leadership that listens to residents, solves problems before they become emergencies, and brings our community together.",
    24,
    "The salutation “Fellow citizen,” is skipped; the first sentence is under 12 words, so two are shown.",
  ),
);
contact(
  "krestina-aziz",
  [
    web("https://www.azizforgresham.com/", "pamphlet"),
    email("Unite@AzizforGresham.com", "site"),
    social("Instagram", "https://www.instagram.com/azizforgresham/", "site"),
    social("Facebook", "https://www.facebook.com/people/Krestina-Aziz/61591696326064/", "site"),
    social("TikTok", "https://www.tiktok.com/@krestina.aziz", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 43", `${PAMPHLET}#page=43`, "Prints AzizforGresham.com."),
    ref("Aziz · contact page", "https://www.azizforgresham.com/contact", "Prints the campaign email; profile links are in the site header. No phone or contact form is published."),
  ],
);
roles.push({ candidateId: "krestina-aziz", role: "Court interpreter and business owner", from: "background" });
primary.push({ candidateId: "krestina-aziz", sourceUrl: `${PAMPHLET}#page=43` });
portraits["krestina-aziz"] = portrait("krestina-aziz", 43);

const ramirezAbout = site("Ramirez · about the campaign and key issues", "https://teoforgresham.com/about-the-campaign/");
candidate("teo-ramirez", {
  values: ["Workforce pathways", "Measured follow-through"],
  tradeoff:
    "He treats employment access and accountable implementation as connected parts of economic stability; which program he would expand first, and its cost, is not stated.",
  sources: [pamphlet(44), site("Ramirez · campaign home", "https://teoforgresham.com/"), ramirezAbout],
  issues: {
    housing: {
      position:
        "Housing stability for working families, seniors and young people as well as people in crisis: connect people to addiction and mental-health support, shelter, services and long-term housing pathways, with regional coordination and more routes to stable housing and homeownership.",
      source: ramirezAbout,
      line: "Wants regional coordination from crisis to stable housing, plus homeownership pathways.",
      chip: "Crisis to homeownership",
    },
    safety: {
      position:
        "Public safety must include strong emergency response plus prevention and intervention: support first responders, invest in youth before they are in crisis, and connect people to treatment and stability.",
      source: ramirezAbout,
      line: "Supports first responders plus youth investment and treatment before crises.",
      chip: "Response plus prevention",
    },
    money: {
      position:
        "Bring residents to the table early, communicate clearly and measure whether public dollars and city programs deliver results, with responsible local investment.",
      source: pamphlet(44),
      line: "Wants city programs measured for results and residents consulted before decisions.",
      chip: "Measure program results",
    },
  },
});
ownWords.push(
  opening(
    "teo-ramirez",
    44,
    "GRESHAM RAISED ME. NOW I AM READY TO LEAD.",
    9,
    "The two all-caps sentences that open the statement each have a predicate and terminal punctuation, so they count as its first sentences.",
  ),
);
contact(
  "teo-ramirez",
  [
    web("https://teoforgresham.com/", "pamphlet"),
    form("https://teoforgresham.com/contact-us/", "Contact form", "site"),
    social("Facebook", "https://www.facebook.com/teoforgresham", "site"),
    social("Instagram", "https://www.instagram.com/teoforgresham", "site"),
    social("LinkedIn", "https://www.linkedin.com/in/teo-b-ramirez/", "site"),
  ],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 44", `${PAMPHLET}#page=44`, "Prints www.TeoForGresham.com."),
    ref("Ramirez · contact page", "https://teoforgresham.com/contact-us/", "Holds a contact form; profile links are in the site header (“Connect with us”). No email or phone is published."),
  ],
);
roles.push({ candidateId: "teo-ramirez", role: "Local-government analyst", from: "background" });
primary.push({ candidateId: "teo-ramirez", sourceUrl: `${PAMPHLET}#page=44` });
portraits["teo-ramirez"] = portrait("teo-ramirez", 44);

candidate("gregory-schroeder", {
  values: ["Systems thinking", "Long-term planning"],
  tradeoff:
    "He emphasizes coordination across housing, transportation, parks and jobs and the twenty-year consequences of development decisions; the statement names no first investment or funding source.",
  sources: [pamphlet(43)],
  issues: {
    housing: {
      position:
        "Provide housing choices while investing in safe neighborhoods, transportation, parks, recreation and natural spaces; thoughtful planning can accommodate growth while protecting what makes Gresham desirable.",
      source: pamphlet(43),
      line: "Wants housing choices paired with investment in neighborhoods, transportation and parks.",
      chip: "Housing with planning",
    },
    climate: {
      position:
        "Housing, transportation, jobs, parks, infrastructure and the environment are interconnected; growth should come with investment in transportation, parks, recreation and natural spaces, judged by how today’s choices shape Gresham twenty years from now.",
      source: pamphlet(43),
      line: "Wants growth planned with transportation, parks and natural spaces, twenty years out.",
      chip: "Plan twenty years out",
    },
  },
});
ownWords.push(
  opening(
    "gregory-schroeder",
    43,
    "Gresham is a community that has helped me grow, build a career, continue my education, and find opportunities to serve.",
    20,
    "The heading “CREATING OPPORTUNITY FOR GRESHAM FAMILIES” is skipped.",
  ),
);
contact(
  "gregory-schroeder",
  [email("pers.gregs@gmail.com", "filing")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 43", `${PAMPHLET}#page=43`, "Prints no website, email or phone."),
    ref(
      "Gregory Schroeder · City of Gresham candidate filing packet",
      packet("gregory-schroeder-seat-4"),
      "The handwritten SEL 101 email field reads pers.gregs@gmail.com (the reading of the handwriting is not certain); its website field is blank and its phone field is not reproduced. No campaign site was found.",
    ),
  ],
);
primary.push({ candidateId: "gregory-schroeder", sourceUrl: `${PAMPHLET}#page=43` });
portraits["gregory-schroeder"] = portrait("gregory-schroeder", 43);
ballots.push(voteForOne("gresham-position-4"));
choice.push({
  raceId: "gresham-position-4",
  text: "All four share broad affordability goals but reach for different tools: long-term infrastructure planning, emergency resilience, recovery services, and workforce pathways. Ask which tool comes first and what it would cost.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Gresham Council, Position 6 ────────────────────────────────────── */
candidate("janine-gladfelter", {
  values: ["Continuity", "Public safety first"],
  tradeoff:
    "Her case is continuity through a new city manager and council turnover, built on levy-funded staffing she claims credit for; the statement names no measure for the outreach-plus-enforcement approach.",
  sources: [
    pamphlet(45),
    ref("Janine Gladfelter · City of Gresham candidate filing packet", packet("janine-gladfelter---seat-6"), "The packet’s 100-word statement lists her priorities as public safety, financial stability, livability and housing for all."),
  ],
  issues: {
    housing: {
      position: "Strengthen the seven-day housing-focused outreach team that moves people into housing while enforcing codes so streets and sidewalks stay clean and safe.",
      source: pamphlet(45),
      line: "Wants seven-day housing-focused outreach strengthened, with code enforcement on streets.",
      chip: "Outreach with enforcement",
    },
    safety: {
      position:
        "Public safety first: restore specialty teams and continue strong community engagement; she cites fighting for the local-option levy that fully funded 40 police positions and added 33 fire positions.",
      source: pamphlet(45),
      line: "Wants specialty police teams restored, building on the levy that funded 40 officers.",
      chip: "Restore specialty teams",
      measure: step("Cites the local-option levy fully funding 40 police positions and adding 33 fire positions, preventing the loss of 18.", pamphlet(45)),
    },
    climate: {
      position: "Grow in a way that protects Gresham’s Tree City identity while activating underused areas such as the former Kmart lot.",
      source: pamphlet(45),
      line: "Wants growth that protects Gresham’s tree canopy and reuses underused sites.",
      chip: "Protect Tree City identity",
    },
  },
});
ownWords.push(
  opening(
    "janine-gladfelter",
    45,
    "Gresham is dear to my heart. I am proud to call this wonderful city home and remain committed to serving experienced, honest neighbor who delivers steady, common-sense leadership for families.",
    30,
    "The label “Personal Statement:” is skipped; the first sentence is under 12 words, so two are shown, with the second sentence’s wording exactly as printed.",
  ),
);
contact(
  "janine-gladfelter",
  [email("janine.gladfelter@gmail.com", "filing")],
  [
    ref("Multnomah County voters’ pamphlet · PDF page 45", `${PAMPHLET}#page=45`, "Prints no website, email or phone."),
    ref(
      "Janine Gladfelter · City of Gresham candidate filing packet",
      packet("janine-gladfelter---seat-6"),
      "The handwritten SEL 101 email field reads janine.gladfelter@gmail.com; its website and phone fields are blank. No campaign site was found.",
    ),
  ],
);
primary.push({ candidateId: "janine-gladfelter", sourceUrl: `${PAMPHLET}#page=45` });
portraits["janine-gladfelter"] = portrait("janine-gladfelter", 45);

/* Dan Miller filed no pamphlet statement and has no campaign site; his row is a filing only. */
missing["daniel-miller"] = "filing-only";
ownWords.push({
  candidateId: "daniel-miller",
  text: "Dan Miller moved to Gresham in February 2025 and currently works as a truck driver.",
  source: {
    label: "City of Gresham candidate filing packet · candidate statement (PDF page 3)",
    url: `${packet("dan-miller-seat-6")}#page=3`,
    kind: "Candidate statement",
    date: "Filed August 17, 2026; extracted September 21, 2026",
    note: "Verbatim opening of the 100-word background statement in the City filing packet, the only candidate statement found. No pamphlet statement (the pamphlet index marks him with an asterisk); no campaign site (the domain in the filing’s email address, danmiller.xyz, showed an under-construction page on September 21, 2026).",
  },
  rule: "filing-opening",
  words: 15,
});
contact(
  "daniel-miller",
  [email("hello@danmiller.xyz", "filing")],
  [
    ref("Multnomah County voters’ pamphlet · candidate index, PDF page 30", `${PAMPHLET}#page=30`, "Lists Dan Miller with an asterisk: no pamphlet statement filed."),
    ref(
      "Dan Miller · City of Gresham candidate filing packet",
      packet("dan-miller-seat-6"),
      "The SEL 101 email field gives hello@danmiller.xyz; its website field is blank and its phone field is not reproduced. danmiller.xyz served an under-construction page, so no website is listed.",
    ),
  ],
);
/* No primary statement: the only source on his research object is the election register. */
ballots.push(voteForOne("gresham-position-6"));
choice.push({
  raceId: "gresham-position-6",
  text: "One candidate’s case is continuity in public safety, housing-focused outreach and economic development; the other has no reviewed platform yet, which is a research gap rather than a position. Ask both what they would change first.",
  from: "race.comparison",
  ...reviewed,
});

/* ── Topics, stances and stakes: the official record (September 22, 2026) ── */

/**
 * Live choices for each office, each candidate's explicit stance on them,
 * and what the office decides this term. The incumbent's own official
 * actions (a council vote in the minutes, an auditor's memo or release)
 * are "Public record"; a news outlet's quote is "Reporting"; the
 * candidate's own words are "Candidate statement". Nothing is inferred
 * from party, endorsements or silence.
 */
const TOPICS_REVIEWED = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;
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
  chipText: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip: chipText, text, source, ...TOPICS_REVIEWED });

/* Portland City Auditor: the office's own record */
const AUDITOR = "https://www.portland.gov/auditor";
const audSchedule = record(
  "City Auditor · memo to City leaders: Audit Schedule for Fiscal Year 2026-27",
  `${AUDITOR}/audit-services/documents/audit-schedule-2026-27/download`,
  "June 18, 2026; read September 22, 2026",
  "Nine topics by service area; “I have sole authority to select areas for review.” One fewer topic than last year after her requested budget cut a performance auditor position.",
);
const audBudget = record(
  "City of Portland · FY 2026-27 Adopted Budget, Auditor’s Office extract (pp. 616–618)",
  `${AUDITOR}/documents/auditors-office-adopted-budget-fy-2026-27/download`,
  "Adopted June 2026; posted August 4, 2026; read September 22, 2026",
  "Grand total $14,599,982 and 45.00 positions (47.00 in FY 2025-26 revised). Summary of budget decisions: −$367,479 for two eliminated positions, −$215,090 materials and services, $217,356 drawn from the Auditor’s Reserve Fund.",
);
const audCutsCommentary = record(
  "City Auditor Simone Rede · “Unspent housing funds show accountability isn’t optional”",
  `${AUDITOR}/news/2026/3/25/unspent-housing-funds-show-accountability-isnt-optional-portlands-next`,
  "March 25, 2026; read September 22, 2026",
);
const audPetitionRebuttal = record(
  "Auditor’s Office · Portland City Elections debunks inaccurate claims about the 1PDX2026 petition",
  `${AUDITOR}/news/2026/7/29/portland-city-elections-debunks-inaccurate-claims-about-1pdx2026-petition`,
  "July 29, 2026 (updated July 30); read September 22, 2026",
  "The August 4, 2026 release (…/initiative-petition-1pdx2026-does-not-qualify-portlands-november-ballot) gives the final count: 63,315 submitted, 34,130 valid, 40,437 needed.",
);
const audZenith = record(
  "Auditor’s Office · Response to City Council’s Zenith Energy resolution passed March 19, 2025",
  `${AUDITOR}/news/2025/4/30/response-portland-city-councils-zenith-energy-resolution-passed-march-19`,
  "April 30, 2025; read September 22, 2026",
);
const audImpact = record(
  "Audit Services · 2024 Audit Impact Report: prioritization needed to implement outstanding audit recommendations",
  `${AUDITOR}/audit-services/news/2025/10/1/2024-audit-impact-report-prioritization-needed-implement`,
  "October 1, 2025; read September 22, 2026",
);
const aud911 = record(
  "Audit Services · Emergency Communications has dramatically improved 911 staffing and wait times",
  `${AUDITOR}/audit-services/news/2026/6/24/emergency-communications-has-dramatically-improved-911`,
  "June 24, 2026; read September 22, 2026",
);
const iprReport = record(
  "Independent Police Review · 2025 Annual Report",
  "https://www.portland.gov/ipr/news/2026/8/12/2025-annual-report",
  "August 12, 2026; read September 22, 2026",
  "IPR is listed under City Operations, not the Auditor; the Auditor’s budget shows $0 for IPR from FY 2025-26.",
);

const auditorTopics: ExtraTopic[] = [
  {
    id: "aud-audit-picks",
    label: "Which audits first",
    short: "Audit picks",
    question: "Which city programs should the auditor’s nine performance auditors examine this year?",
    context:
      "The auditor alone picks audit topics. Her June 18, 2026 schedule for FY 2026–27 lists nine: Portland Solutions, citywide equity, fund management, cybersecurity, Prosper Portland grants, gun-violence prevention, emergency management, police body-worn cameras and utility rates, one fewer than last year after a performance auditor position was cut.",
  },
  {
    id: "aud-office-cuts",
    label: "Auditor’s office cuts",
    short: "Office cuts",
    question: "Should the Auditor’s Office take the same budget cut as the rest of the city?",
    context:
      "With citywide cuts of up to 10% on the table, the auditor asked in March 2026 that her office’s cut be held to 3%. The FY 2026–27 adopted budget gives the office $14,599,982 and 45 positions, two fewer: a performance auditor and an administrative specialist ($367,479), plus $215,090 less for materials and a $217,356 draw on the Auditor’s Reserve Fund.",
  },
  {
    id: "aud-petition-verification",
    label: "Petition verification",
    short: "Petitions",
    question: "Stand by the Elections Division’s ruling that the community-safety initiative fell short of the ballot?",
    context:
      "The auditor’s Elections Division runs city elections. On August 4, 2026 it ruled Initiative Petition 1PDX2026, the “Portland Enhanced Community Safety Initiative,” did not qualify: 63,315 signatures submitted, 34,130 projected valid, 40,437 needed. Chief petitioners alleged changed totals, lost records and bias; the division answered each claim on July 29.",
  },
  {
    id: "aud-council-requests",
    label: "Council-requested investigations",
    short: "Council requests",
    question: "Take on investigations the City Council asks for, as it did over Zenith Energy?",
    context:
      "Council Resolution 37702 (March 19, 2025) urged the auditor to investigate the city’s handling of Zenith Energy’s land-use compatibility statements. She declined on April 30, 2025: the Ombudsman investigates unfair treatment of individuals, and the Council has its own charter power to compel testimony or can seek a performance audit.",
  },
];

const auditorStances: TopicStance[] = [
  stance("simone-rede", "aud-audit-picks", "supports", "Portland Solutions, body cameras",
    "Chose the FY 2026–27 schedule herself on June 18, 2026: Portland Solutions, citywide equity, fund management, cybersecurity, Prosper Portland grants, gun-violence prevention, emergency management, police body-worn cameras and utility rates, one fewer topic after cutting an auditor position.",
    audSchedule),
  stance("simone-rede", "aud-office-cuts", "opposes", "Hold cut to 3%",
    "Asked the mayor in March 2026 to hold her office’s cut to 3% while citywide cuts of up to 10% were weighed, writing that transparency and accountability are not optional; her own requested budget cut one performance auditor.",
    audCutsCommentary),
  stance("simone-rede", "aud-petition-verification", "supports", "Ruling stands",
    "Said July 29, 2026 that “independent election administration cannot bend to political pressure — from petitioners, opponents, or elected officials,” and that her division administers elections with integrity and by the law.",
    audPetitionRebuttal),
  stance("simone-rede", "aud-council-requests", "opposes", "Declined Zenith request",
    "Declined the Council’s March 2025 Zenith request, writing it was unclear how a report on past land-use decisions “will remedy harm or result in fairer treatment,” and pointed to the Council’s own powers or a performance audit.",
    audZenith),
];

const auditorStakes: RaceStakes = {
  raceId: "portland-auditor",
  intro:
    "The auditor is elected citywide and works independently of the mayor and council: she alone picks which city programs get performance audits, runs the ombudsman, hearings office, archives, council clerk and city elections, and manages the outside audit of the city’s financial statements. The next term starts with a smaller office, a city cutting budgets, and half of past audit recommendations still undone.",
  items: [
    {
      label: "A smaller office",
      text:
        "The FY 2026–27 adopted budget gives the Auditor’s Office $14,599,982 and 45 positions, down from 47: a performance auditor and an administrative specialist were eliminated ($367,479), materials and services cut $215,090, and $217,356 drawn from the Auditor’s Reserve Fund created for emergencies.",
      source: audBudget,
    },
    {
      label: "Nine audits, one fewer",
      text:
        "The FY 2026–27 schedule names nine audits, including Portland Solutions, police body-worn cameras and utility rates, one fewer than last year to match the office’s reduced capacity. The auditor has sole authority over the list and can swap topics if higher-priority issues emerge.",
      source: audSchedule,
    },
    {
      label: "Recommendations undone",
      text:
        "Of 204 recommendations from 33 audits in FY 2019–24, 49% were implemented by the 2024 impact report, against a 64% average among peer cities; the report names prioritization by the administration and Council as the main obstacle.",
      source: audImpact,
    },
    {
      label: "Unbudgeted housing funds",
      text:
        "In February 2026 the City Administrator disclosed that over $100 million in housing funds had gone unbudgeted. The auditor’s financial audit verifies the city’s statements but does not assess how funds are used; her office had audited shelters and inclusionary housing and found monitoring gaps.",
      source: audCutsCommentary,
    },
    {
      label: "911 follow-through",
      text:
        "A June 24, 2026 audit found the average 911 wait fell from 77 seconds in July 2022 to 18 seconds in January 2026, with 91 senior dispatchers and 6 vacancies, but the bureau still missed the standard of answering 90% of calls within 15 seconds; 46% of trainees left or were let go.",
      source: aud911,
    },
    {
      label: "Police oversight moved out",
      text:
        "Independent Police Review, once the auditor’s division, now sits under City Operations with $0 in the auditor’s budget since FY 2025–26; it took 213 community complaints in 2025, up 19%, and will run until the 21-member Community Board for Police Accountability’s new office replaces it.",
      source: iprReport,
    },
  ],
};

/* Gresham: council minutes on PrimeGov (scanned; read September 22, 2026), the FY 2026/27 adopted budget and The Outlook */
const GRESHAM_MIN = "https://gresham.primegov.com/Public/CompiledDocument";
const GRESHAM_BUDGET =
  "https://www.greshamoregon.gov/globalassets/city-departments/budget-and-finance/budget-committee/fy26-27-adopted-budget-document.pdf";
const greshamBudget = record(
  "City of Gresham · Fiscal Year 2026/27 Adopted Budget (Resolution 3713, June 9, 2026)",
  GRESHAM_BUDGET,
  "Adopted June 9, 2026; read September 22, 2026",
  "All-funds total $924,981,292 (p. 13); general-fund gap of about $10 million filled from fund balance and the $13.6 million levy (p. 13); levy renewal and the East County Fire Service Taskforce in the budget message (p. 5); police and fire staffing ratios (p. 310). The signed resolution (pp. 352–353) records Yes: Stovall, Brown, Gladfelter, Hinton; No: Keathley, Piazza; Absent: Morales.",
);
const greshamForecast = record(
  "Gresham Budget Committee · April 16, 2026 meeting 1 presentation (general-fund forecast, slides 70–73)",
  "https://www.greshamoregon.gov/globalassets/city-departments/budget-and-finance/budget-committee/2026-04-16-budget-committee-meeting-1-presentation.pdf",
  "April 16, 2026; read September 22, 2026",
);
const minFeb17 = record(
  "Gresham City Council · minutes, February 17, 2026 (consent: enactment of Council Bill 03-26 and Resolution 3684 setting the Police, Fire and Parks Fee at $15)",
  `${GRESHAM_MIN}/5955`,
  "February 17, 2026; read September 22, 2026",
  "Passed 6–0 with Hinton absent; Gladfelter moved the consent agenda. First reading February 3, 2026 (minutes /5892) passed 7–0 on Stovall’s motion, seconded by Gladfelter.",
);
const minMay5 = record(
  "Gresham City Council · minutes, May 5, 2026 (future of fire services: district models)",
  `${GRESHAM_MIN}/6199`,
  "May 5, 2026; read September 22, 2026",
);
const minJun9 = record(
  "Gresham City Council · minutes, June 9, 2026 (Resolution 3713 adopting the FY 2026/27 budget, 4–2)",
  `${GRESHAM_MIN}/6383`,
  "June 9, 2026; read September 22, 2026",
  "Yes: Stovall, Brown, Gladfelter, Hinton; No: Keathley, Piazza; Morales absent. The minutes record no stated reason for the no votes.",
);
const minJun2 = record(
  "Gresham City Council · minutes, June 2, 2026 (Resolutions 3716–3718: wastewater, water and stormwater rates for 2028–2032; Lusted Water District agreement)",
  `${GRESHAM_MIN}/6317`,
  "June 2, 2026; read September 22, 2026",
  "Consent, 6–0, Morales absent; Piazza moved. Percentages and monthly amounts are in the June 2 packet (/6251).",
);
const minSep1 = record(
  "Gresham City Council · minutes, September 1, 2026 (water quality report)",
  `${GRESHAM_MIN}/6619`,
  "September 1, 2026; read September 22, 2026",
);
const minFeb3 = record(
  "Gresham City Council · minutes, February 3, 2026 (first reading of Council Bill 02-26, temporary emergency shelter code)",
  `${GRESHAM_MIN}/5892`,
  "February 3, 2026; read September 22, 2026",
  "Passed 7–0 on Piazza’s motion; enacted unanimously March 3, 2026 (action summary /5954), effective April 1, 2026.",
);
const minJan20 = record(
  "Gresham City Council · minutes, January 20, 2026 (Resolution 3681 on the rule of law, public safety and federal immigration reform)",
  `${GRESHAM_MIN}/5826`,
  "January 20, 2026; read September 22, 2026",
  "Adopted 7–0 in place of the emergency declaration residents requested on December 9, 2025 and January 6, 2026 (minutes /5686 and /5772).",
);
const outlookRamirez = reporting(
  "The Outlook · Former Gresham employee seeks testimony on ICE encounters",
  "https://theoutlookonline.com/2025/11/15/former-gresham-employee-seeks-testimony-on-ice-encounters/",
  "November 15, 2025; read September 22, 2026",
  "Reported statement; quote as printed by The Outlook.",
);
const outlookLevy = reporting(
  "The Outlook · Gresham spotlights safety levy successes",
  "https://theoutlookonline.com/2026/03/20/gresham-spotlights-safety-levy-successes/",
  "March 20, 2026; read September 22, 2026",
);
const outlookUra = reporting(
  "The Outlook · Gresham City Council approves $380 million urban renewal plan",
  "https://theoutlookonline.com/2025/09/09/gresham-city-council-approves-380-million-urban-renewal-plan/",
  "September 9, 2025; read September 22, 2026",
  "Adopted September 2, 2025 (minutes /5337): Stovall, Piazza and Gladfelter yes, Brown abstaining, Hinton absent.",
);
const shelterReport = record(
  "Gresham City Council · February 3, 2026 packet, Council Bill 02-26 staff report (Temporary Emergency Shelter code)",
  `${GRESHAM_MIN}/5818`,
  "February 3, 2026; read September 22, 2026",
  "“Currently there are eight permanent shelters for people experiencing homelessness located in the City of Gresham and there are not currently any Temporary Emergency Shelter (pod-style shelters).”",
);
const greshamTopics: ExtraTopic[] = [
  {
    id: "gresham-safety-fee",
    label: "Public-safety fee",
    short: "Safety fee",
    question: "Keep the Police, Fire and Parks Fee at $15 a month, now that the council can change it by resolution?",
    context:
      "The fee is $15 a month per home or business unit, 95% to police and fire and 5% to parks, budgeted at $8,507,000 for FY 2026/27. On February 17, 2026 the council moved the amount out of city code (Council Bill 03-26) so it can be changed by resolution rather than ordinance, and set it at $15 by Resolution 3684. No change has been proposed since.",
  },
  {
    id: "gresham-levy-fire",
    label: "Levy and fire district",
    short: "Fire levy",
    question: "Renew the $1.35 public-safety levy before it expires in 2029, and keep Gresham’s own fire department rather than join a district?",
    context:
      "Measure 26-247 (May 2024, 56% yes) levies $1.35 per $1,000 of assessed value through June 30, 2029, about $13.6 million in FY 2026/27, funding 40 police and 33 fire positions. The June 2026 budget message says the levy “will need to be renewed by the voters”; the East County Fire Service Taskforce is weighing district models, and on May 5, 2026 the council leaned against a Clackamas Fire District 1 model.",
  },
  {
    id: "gresham-budget-gap",
    label: "General-fund gap",
    short: "Budget gap",
    question: "Keep drawing reserves to cover a $10 million general-fund gap, or cut services or raise revenue?",
    context:
      "Resolution 3713 adopted the FY 2026/27 budget at $924,981,292 on June 9, 2026 by a 4–2 vote. General-fund spending exceeds revenue by about $10 million, covered from fund balance, and the April 2026 forecast shows the structural gap growing from $8.2 million to $30.8 million a year by FY 2030/31 even with the levy extended. Police and fire take more than 90% of general-fund revenue.",
  },
  {
    id: "gresham-groundwater",
    label: "Groundwater and rates",
    short: "Water",
    question: "Stay on the new groundwater system and fix the taste and hardness complaints, with water rates rising 5% a year from 2028?",
    context:
      "Gresham and Rockwood Water switched to 100% groundwater on March 30, 2026, ending Bull Run purchases, with Gresham’s roughly $34 million share financed by federal WIFIA loans. Chlorine-taste and hardness complaints followed, and on September 1 the city said it was hiring a water-quality consultant. On June 2, 2026 the council set water rates to rise 5% each January from 2028 to 2032, wastewater 6% and stormwater 6.75%.",
  },
  {
    id: "gresham-camping-shelter",
    label: "Camping and shelters",
    short: "Shelters",
    question: "Keep the camping ban with housing-focused outreach, and allow pod shelters only under the new permit code?",
    context:
      "City code bars camping on public property, with no penalty for a homeless person unless shelter was offered first. Council Bill 02-26, adopted unanimously March 3, 2026 and effective April 1, sets rules for pod-style shelters: up to 30 units, no tents, not within 1,000 feet of schools or parks. The city counts eight permanent shelters and no pod shelters; its outreach team housed 155 people last year.",
  },
  {
    id: "gresham-ice-response",
    label: "Immigration enforcement",
    short: "ICE response",
    question: "Go beyond the January 2026 rule-of-law resolution and declare an immigration-enforcement emergency, as residents asked?",
    context:
      "After 26 speakers on December 9, 2025 and 10 on January 6, 2026 asked for an emergency declaration, the council on January 20, 2026 unanimously adopted Resolution 3681 reaffirming the rule of law and calling for federal immigration reform instead. In February 2026 the mayor signed the Oregon mayors’ letter asking for a pause in federal enforcement.",
  },
];

const greshamStances: TopicStance[] = [
  /* ── Travis Stovall (mayor; the record first) ─────────────────────── */
  stance("travis-stovall", "gresham-safety-fee", "supports", "Voted to keep $15",
    "Moved the first reading of Council Bill 03-26 on February 3, 2026 and voted yes February 17 to move the fee into a resolution and keep it at $15 a month; his campaign is silent on changing it.",
    minFeb17),
  stance("travis-stovall", "gresham-levy-fire", "partial", "Levy results, no district",
    "Says the levy funded 9 new officers and 12 firefighters and would keep supporting police and fire; said May 5, 2026 a Clackamas Fire District 1 model “does not appear to be a strong consideration for Gresham.” Renewal unsaid.",
    minMay5),
  stance("travis-stovall", "gresham-budget-gap", "supports", "Voted for budget",
    "Voted yes June 9, 2026 to adopt the $924,981,292 budget, which covers a roughly $10 million general-fund gap from fund balance; told a September chamber forum the city must operate “at the speed of business.”",
    minJun9),
  stance("travis-stovall", "gresham-groundwater", "supports", "Groundwater, rates set",
    "Voted yes June 2, 2026 on the 2028–32 rate schedule; said in April the groundwater project was “on time and on budget” and would bring “smaller rate increases, not larger ones,” and led July’s town hall on complaints.",
    minJun2),
  stance("travis-stovall", "gresham-camping-shelter", "supports", "Pod code, accountability",
    "Voted for the pod-shelter code February 3 and March 3, 2026; would expand “compassionate, accountability-focused solutions” that connect people with shelter and mental-health care while keeping public spaces clean and safe.",
    minFeb3),
  stance("travis-stovall", "gresham-ice-response", "mixed", "Resolution plus pause letter",
    "Recommended on January 6, 2026 that the council consider a resolution aligned with residents’ requests, voted for Resolution 3681 on January 20 rather than an emergency declaration, and in February signed the mayors’ letter seeking a pause in enforcement.",
    minJan20),

  /* ── Sue Piazza (councilor; the record first) ─────────────────────── */
  stance("sue-piazza", "gresham-safety-fee", "mixed", "Kept $15, cut fees",
    "Voted yes February 3 and 17, 2026 to move the fee into a resolution and keep it at $15; her campaign promises to lower “unnecessary costs and fees” without naming which ones.",
    minFeb17),
  stance("sue-piazza", "gresham-levy-fire", "partial", "Championed the levy",
    "Says she championed the 2024 levy that put more officers and firefighters on the streets; nothing on renewal or a fire district, and the May 5, 2026 minutes do not record her speaking on the district models.",
    pamphlet(41)),
  stance("sue-piazza", "gresham-budget-gap", "opposes", "Voted no on budget",
    "Voted no June 9, 2026 on Resolution 3713 adopting the FY 2026/27 budget (4–2); the minutes record no reason. Told a September chamber forum the city should operate with a responsible fiscal mindset.",
    minJun9),
  stance("sue-piazza", "gresham-groundwater", "mixed", "Rates yes, fix taste",
    "Moved and voted for the 2028–32 rate increases June 2, 2026; on September 1 asked staff about chlorine odor, a return to chloramine and treatment costs, and has held listening sessions on water quality.",
    minSep1),
  stance("sue-piazza", "gresham-camping-shelter", "supports", "No tents, permitted pods",
    "Moved the first reading of the pod-shelter code February 3, 2026 and voted for it; says she would address homelessness “without allowing tents and encampments to take over our streets and parks.”",
    minFeb3),
  stance("sue-piazza", "gresham-ice-response", "opposes", "Resolution, not emergency",
    "Voted for Resolution 3681 January 20, 2026 after urging “careful consideration to avoid causing additional harm” and constructive talks with federal partners; in October 2025 asked whether sanctuary status could cost federal grants.",
    minJan20),

  /* ── Janine Gladfelter (councilor; the record first) ──────────────── */
  stance("janine-gladfelter", "gresham-safety-fee", "supports", "Voted to keep $15",
    "Seconded the first reading February 3, 2026 and moved the February 17 consent vote that kept the fee at $15 and made it changeable by resolution; no campaign statement on changing it.",
    minFeb17),
  stance("janine-gladfelter", "gresham-levy-fire", "partial", "Levy, no Clackamas model",
    "Says she fought for the levy that funded 40 police and 33 fire positions and wants specialty teams restored; on May 5, 2026 opposed “any option that could reduce public safety,” including the Clackamas district model. Renewal unsaid.",
    minMay5),
  stance("janine-gladfelter", "gresham-budget-gap", "supports", "Moved the budget",
    "Moved and voted for Resolution 3713 adopting the FY 2026/27 budget June 9, 2026, with its roughly $10 million draw on general-fund balance.",
    minJun9),
  stance("janine-gladfelter", "gresham-groundwater", "supports", "Voted for rates",
    "Voted yes June 2, 2026 on the water, wastewater and stormwater rate schedule for 2028–32 and the Lusted Water District wholesale agreement; no statement found on the taste and hardness complaints.",
    minJun2),
  stance("janine-gladfelter", "gresham-camping-shelter", "supports", "Pod code, outreach",
    "Voted for the pod-shelter code February 3 and March 3, 2026; wants the seven-day housing-focused outreach team strengthened “while enforcing codes so our streets and sidewalks stay clean and safe.”",
    minFeb3),
  stance("janine-gladfelter", "gresham-ice-response", "opposes", "Resolution, not emergency",
    "Said January 6, 2026 she supported moving forward with a resolution, then seconded and voted for Resolution 3681 on January 20 in place of an emergency declaration.",
    minJan20),

  /* ── Challengers: only explicit statements; Schroeder and Miller have none on these choices ── */
  // Her emailed reply of September 23, 2026 answers five choices and replaces the partial levy and groundwater readings.
  stance("heather-coleman-cox", "gresham-levy-fire", "supports", "Renew the levy",
    "Wholeheartedly supports renewing the levy and making the case to residents now for why it needs continued funding; she did not address joining a fire district.",
    hccEmail),
  stance("heather-coleman-cox", "gresham-groundwater", "supports", "Stay on groundwater",
    "Says the investment in moving from Bull Run to groundwater is too great to reverse and the switch looks logical on cost; wants residents to report sight, smell or taste problems, and says the switch needed louder notice.",
    hccEmail),
  stance("heather-coleman-cox", "gresham-safety-fee", "supports", "Keep fee at $15",
    "Supports keeping the Police, Fire and Parks Fee at $15 a month; if Council considers changing it, residents should get a say and see how it would affect bills and services.",
    hccEmail),
  stance("heather-coleman-cox", "gresham-budget-gap", "opposes", "Stop drawing reserves",
    "Would not keep using reserves for a gap that returns every year, nor jump to cutting services; wants staff to lay out the causes, savings and revenue options, then decide in public.",
    hccEmail),
  stance("heather-coleman-cox", "gresham-camping-shelter", "mixed", "Pods, with conditions",
    "Supports keeping parks and public spaces safe and available with continued outreach toward shelter and housing; open to pod shelters under the new permit code once operator, siting, neighbor impact and housing results are clear.",
    hccEmail),
  stance("heather-coleman-cox", "gresham-ice-response", "mixed", "Open to an emergency",
    "Was part of a community group that backed the rule-of-law resolution; open to an emergency declaration if it would give the City a practical way to better protect residents.",
    hccEmail),
  stance("will-delplato", "gresham-budget-gap", "opposes", "Small cuts now",
    "Says the budget shortfall is growing and the city should “act now with small, early changes rather than waiting until we’re forced into painful ones,” reviewing spending for efficiencies rather than relying on reserves.",
    pamphlet(42)),
  stance("will-delplato", "gresham-groundwater", "partial", "Water a challenge",
    "Calls “the current water issue” one of Gresham’s real challenges in his pamphlet statement; does not say whether to keep the groundwater system, change treatment or accept the 2028–32 rate schedule.",
    pamphlet(42)),
  stance("joshua-al-jaouni", "gresham-safety-fee", "partial", "Fees off residents",
    "Would keep “unnecessary fees and costs off residents” while encouraging responsible growth; does not name the $15 Police, Fire and Parks Fee or say whether it should change.",
    pamphlet(44)),
  stance("joshua-al-jaouni", "gresham-groundwater", "partial", "Listen on water",
    "Says he will always listen when issues arise, “like the current water concerns,” and work with the community on practical solutions; no position on the system, treatment or rates.",
    pamphlet(44)),
  stance("joshua-al-jaouni", "gresham-camping-shelter", "partial", "Treatment with expectations",
    "Says compassion and accountability must go together: connect people to treatment, recovery, mental-health resources and stable housing “while maintaining clear expectations.” The camping code and pod-shelter permits are unsaid.",
    aljaouniHome),
  stance("krestina-aziz", "gresham-groundwater", "partial", "Accountability on wells",
    "Lists accountability in city decisions, “including the transition to water wells,” under transparent government; no position on keeping the system, changing treatment or the 2028–32 rates.",
    pamphlet(43)),
  stance("teo-ramirez", "gresham-camping-shelter", "partial", "Regional housing pathways",
    "Would connect people to addiction and mental-health support, shelter and long-term housing pathways with regional coordination and clear accountability; the camping code and pod-shelter permits are unsaid.",
    ramirezAbout),
  stance("teo-ramirez", "gresham-ice-response", "partial", "Reaffirm sanctuary promise",
    "Organized residents’ testimony and asked the council to publicly reaffirm the Sanctuary Promise Act, fund bilingual rights education, expand staff training and set a communication process for federal operations; an emergency declaration is unsaid.",
    outlookRamirez),
];

const greshamItems: RaceStakes["items"] = [
  {
    label: "General-fund gap",
    text:
      "FY 2026/27 general-fund spending exceeds revenue by about $10 million, covered from fund balance, which the April 2026 forecast shows falling from $30.4 million to $20.4 million this year; the structural gap grows from $8.2 million to $30.8 million a year by FY 2030/31 even if the levy is extended. Police and fire take more than 90% of general-fund revenue.",
    source: greshamForecast,
  },
  {
    label: "Levy expires 2029",
    text:
      "The five-year public-safety levy of $1.35 per $1,000 (about $13.6 million in FY 2026/27) sunsets June 30, 2029 unless voters renew it; it funds 40 of the city’s 183 budgeted police positions and 33 fire positions. The budget message says renewal must be decided “over the next couple of years,” while a regional task force weighs fire-district models.",
    source: greshamBudget,
  },
  {
    label: "Thin staffing",
    text:
      "Gresham budgets 134 sworn officers for 115,739 residents, 1.16 per 1,000, the lowest of its comparison cities except Salem, and 130 sworn firefighters serving 148,268 people. Fire’s 90th-percentile response time was 11 minutes 20 seconds against an 8-minute standard when the council reviewed fire-service options in October 2025.",
    source: greshamBudget,
  },
  {
    label: "Utility rates locked in",
    text:
      "On June 2, 2026 the council set water rates to rise 5% each January from 2028 through 2032, wastewater 6% and stormwater 6.75%, about $8.12 a month more combined for a typical single-family home in 2028, after the March 30 switch to groundwater financed by roughly $34 million in federal loans.",
    source: minJun2,
  },
  {
    label: "Eight shelters, no pods",
    text:
      "The city counts eight permanent homeless shelters and no pod-style shelters; the code adopted March 3, 2026 caps a pod site at 30 units and keeps it 1,000 feet from schools and parks. The outreach team housed 155 people last year and the latest point-in-time count found 20 people unsheltered in Gresham.",
    source: shelterReport,
  },
  {
    label: "$381 million urban renewal",
    text:
      "The council adopted a roughly 900-acre Downtown/Civic urban renewal area on September 2, 2025 that plans about $381 million of investment over 30 years from property-tax growth that would otherwise reach the general fund; the next council appoints the agency’s board and picks its first projects.",
    source: outlookUra,
  },
];
const GRESHAM_COUNCIL_INTRO =
  "A Gresham councilor is one of seven votes on the budget, the $15 public-safety fee, utility rates, the camping and shelter codes and whether to send the police-and-fire levy back to voters, and the council hires and directs the city manager. The FY 2026/27 budget is $924,981,292; the term runs through the levy’s 2029 expiry, a widening general-fund gap and a decision on the fire department’s future.";
const greshamStakes: RaceStakes[] = [
  {
    raceId: "gresham-mayor",
    intro:
      "Gresham’s mayor presides over the seven-member council that adopts the budget, sets the $15 public-safety fee and utility rates, writes the camping and shelter codes and decides whether to send the police-and-fire levy back to voters, and directs the new city manager. The FY 2026/27 budget is $924,981,292; the term runs through the levy’s 2029 expiry, a widening general-fund gap and a decision on the fire department’s future.",
    items: greshamItems,
  },
  { raceId: "gresham-position-2", intro: GRESHAM_COUNCIL_INTRO, items: greshamItems },
  { raceId: "gresham-position-4", intro: GRESHAM_COUNCIL_INTRO, items: greshamItems },
  { raceId: "gresham-position-6", intro: GRESHAM_COUNCIL_INTRO, items: greshamItems },
];

const topics: RaceTopics[] = [
  { raceIds: ["portland-auditor"], topics: auditorTopics },
  { raceIds: ["gresham-mayor", "gresham-position-2", "gresham-position-4", "gresham-position-6"], topics: greshamTopics },
];
const topicStances: TopicStance[] = [...auditorStances, ...greshamStances];
const stakes: RaceStakes[] = [auditorStakes, ...greshamStakes];

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
