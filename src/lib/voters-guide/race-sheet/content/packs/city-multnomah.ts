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

export const pack: RacePack = { ...emptyPack(), analysis, lines, chips, deliveries, ownWords, contacts, roles, primary, ballots, districts, choice, portraits, missing };
