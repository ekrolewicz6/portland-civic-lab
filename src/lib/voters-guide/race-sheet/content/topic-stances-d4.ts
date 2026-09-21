import type { Evidence } from "../../types";
import type { TopicStance } from "../types";

/**
 * District 4: explicit, sourced stances on the extra topics. Never inferred.
 *
 * A stance is recorded only where the candidate's own site or pamphlet
 * statement speaks to the specific choice in topics.ts. Silence, party,
 * endorsements and general values are not stances. Incumbents' votes are
 * handled by the decision pills; their statements are recorded here only
 * where their sites or pamphlet statements make one.
 *
 * Venues reviewed September 20, 2026: the same list as delivery-d4.ts.
 */

const PAMPHLET =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const site = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 20, 2026",
  note: NOTE,
});

const pamphlet = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 18, 2026",
  note: NOTE,
});

const reviewed = { reviewedBy: "pending", reviewedOn: "2026-09-20" } as const;

const stance = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip, text, source, ...reviewed });

const arnoldSafety = site("Arnold · public safety plan", "https://www.eliforportland.com/public-safety");
const clarkPriorities = site("Clark · priorities", "https://www.oliviaforportland.com/priorities");
const evenstarHousingPlan = site("Evenstar · Portland Community Housing Plan", "https://evenstarforportland.com/portland-community-housing-plan");
const evenstarFaq = site("Evenstar · campaign FAQ", "https://evenstarforportland.com/faq");
const greenRecord = site("Green · record", "https://mitch4portland.com/record");
const jbsPlatform = site("Beausoleil Smith · platform and issues", "https://jeremy4pdx.com/platform-and-issues/");
const schulteDataCenters = site("Schulte · data centers and megawatts", "https://mattschulte.wordpress.com/2026/09/10/data-centers-and-megawatts/");
const zimmermanHomelessness = site("Zimmerman · homelessness", "https://ez4pdx.com/issue/homelessness/");
const zimmermanSafety = site("Zimmerman · public safety", "https://ez4pdx.com/issue/public-safety/");

const arnoldEmail: Evidence = {
  label: "Arnold · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#arnold-2026-09-20",
  kind: "Candidate statement",
  date: "Received September 20, 2026",
  note: NOTE,
};
const andersonEmail: Evidence = {
  label: "Anderson · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#anderson-2026-09-19",
  kind: "Candidate statement",
  date: "Received September 19, 2026",
  note: NOTE,
};

export const topicStancesD4: TopicStance[] = [
  /* ── Timothy (TJ) Anderson ──────────────────────────────────────────── */
  stance("timothy-tj-anderson", "new-taxes", "opposes", "None until audit done",
    "Says no additional taxes or fees would be passed until a value-based audit shows where the city’s money has gone.",
    andersonEmail),
  stance("timothy-tj-anderson", "police-staffing", "supports", "More officers, plus cadets",
    "Says more officers are “pretty much a given” to get response times down, with cadets, volunteers and other programs handling calls that do not need the most highly trained officers.",
    andersonEmail),

  /* ── Eli Arnold ─────────────────────────────────────────────────────── */
  stance("eli-arnold", "new-taxes", "opposes", "No new taxes, fees",
    "Says he will not support raising taxes and fees; his transit plan is framed as using existing PCEF revenue without new taxes.",
    pamphlet(65)),
  stance("eli-arnold", "police-staffing", "supports", "Fill vacancies, then grow",
    "Says there would be no immediate increase to police funding; once vacancies are filled he would seek more authorized positions if the budget can accommodate it, toward the roughly 1.5 officers per 1,000 residents on his site.",
    arnoldEmail),
  stance("eli-arnold", "street-response", "supports", "Scale PSR citywide",
    "Would expand Street Response scope in 2027–2028 and citywide by 2029–2031 so calls go to the right responder; 24/7 is not stated.",
    arnoldSafety),

  /* ── Olivia Clark ───────────────────────────────────────────────────── */
  stance("olivia-clark", "camp-removal", "supports", "Remove street camping",
    "Would make the city safe by removing street camping and public drug use while adding shelter beds, sobering stations and treatment.",
    clarkPriorities),

  /* ── Jamey Evenstar ─────────────────────────────────────────────────── */
  stance("jamey-evenstar", "new-taxes", "supports", "Fee on empty homes",
    "Proposes a Housing Supply Impact Fee on homes not used as a primary residence, with revenue building permanently affordable homes.",
    evenstarHousingPlan),
  // Not a stance: her FAQ backs "unarmed crisis response" without naming Street Response or its 24/7 role.
  // Left as a gap and asked in the September 20 outreach draft.

  /* ── Mitch Green ────────────────────────────────────────────────────── */
  stance("mitch-green", "moda", "opposes", "Owners pay, not taxpayers",
    "Says Portlanders should not cover the cost of remodeling the Moda Center and the Blazers' ownership will pay their fair share; refused an NDA to negotiate.",
    greenRecord),
  stance("mitch-green", "new-taxes", "supports", "Big corporations pay more",
    "Plans to make the biggest corporations pay their fair share; no rate or instrument is named.",
    pamphlet(62)),
  stance("mitch-green", "street-response", "supports", "Fund PSR toward 24/7",
    "Created a public-safety set-aside fund to add Street Response staff as the program moves to a 24/7 model, and funded an independent evaluation.",
    greenRecord),
  stance("mitch-green", "water-rates", "mixed", "Bull Run cost controls",
    "Says he pushed for cost controls on the Bull Run project to prevent water rates from doubling; does not oppose the project itself.",
    pamphlet(62)),

  /* ── John McDonald ──────────────────────────────────────────────────── */
  // Not a stance: his pamphlet statement wants the Blazers kept and the arena modernized but says nothing about public money,
  // which is the question this column asks. Left as a gap and asked in the September 20 outreach draft.

  /* ── Matt Schulte ───────────────────────────────────────────────────── */
  stance("matt-schulte", "data-centers", "supports", "Ban until value standard",
    "Supports a ban on data centers until a Load-Value Standard measures public return per megawatt in jobs, tax revenue, infrastructure cost and environmental effects.",
    schulteDataCenters),

  /* ── Jeremy Beausoleil Smith ────────────────────────────────────────── */
  stance("jeremy-beausoleil-smith", "data-centers", "supports", "Four-year moratorium",
    "Supports a four-year moratorium on new data-center development, citing electricity rates, water use, pollution and grid reliability.",
    jbsPlatform),
  stance("jeremy-beausoleil-smith", "street-response", "supports", "PSR 24/7 citywide",
    "Supports expanding Portland Street Response to 24/7 citywide coverage with more staff and transport capacity.",
    jbsPlatform),
  stance("jeremy-beausoleil-smith", "police-staffing", "mixed", "Audit before more money",
    "Calls for a City Auditor review of police response times, staffing and overtime; says the answer cannot be more money for PPB without understanding the problem.",
    jbsPlatform),

  /* ── Eric Zimmerman ─────────────────────────────────────────────────── */
  stance("eric-zimmerman", "new-taxes", "opposes", "No tax increases",
    "Says he passed tax cuts and voted against increases, and is focused on lowering housing costs rather than raising taxes.",
    pamphlet(64)),
  stance("eric-zimmerman", "street-fee", "opposes", "Voted against street fee",
    "Cites his vote against the new street fee as part of a record of opposing tax increases.",
    pamphlet(64)),
  stance("eric-zimmerman", "police-staffing", "supports", "1,000 sworn officers",
    "Would expand the Police Bureau to 1,000 sworn officers, growing patrol and investigations and trimming other support roles until fully staffed.",
    zimmermanSafety),
  stance("eric-zimmerman", "camp-removal", "supports", "End unsanctioned camping",
    "Calls ending unsanctioned camping a must, with an enforceable time-place-manner ordinance, camp cleanups and more TASS shelter sites.",
    zimmermanHomelessness),
  stance("eric-zimmerman", "street-response", "supports", "PSR may transport patients",
    "Would let Street Response transport people to sobering centers and psychiatric emergency care; 24/7 coverage is not addressed.",
    zimmermanSafety),
];
