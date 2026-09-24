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
 * Topic sweep September 22, 2026: see research/voters-guide-2026/outreach-2026-09-22/topic-sweep-d4.md.
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

/* September 22, 2026 topic sweep: the same eight topics searched for every
 * candidate across campaign sites, the pamphlet, questionnaires, social
 * posts and reported quotes. Method and gaps: research/voters-guide-2026/
 * outreach-2026-09-22/topic-sweep-d4.md. */
const reviewed22 = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;

const swept = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ ...stance(candidateId, topicId, s, chip, text, source), ...reviewed22 });

const site22 = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 22, 2026",
  note: NOTE,
});

/** The candidate's own public post (Bluesky), read at the linked URL. */
const post = (label: string, url: string, posted: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: `Posted ${posted}; reviewed September 22, 2026`,
  note: NOTE,
});

/** A quote reported by a news outlet, not the candidate's own page. */
const reported = (label: string, url: string, date: string, outlet: string): Evidence => ({
  label,
  url,
  kind: "Reporting",
  date,
  note: `Reported statement; quote as printed by ${outlet}. ${NOTE}`,
});

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

const andersonEmail2: Evidence = {
  label: "Anderson · second emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#anderson-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: NOTE,
};

const cronlundEmail: Evidence = {
  label: "Cronlund · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#cronlund-2026-09-23",
  kind: "Candidate statement",
  date: "Received September 23, 2026",
  note: NOTE,
};
const mcdonaldEmail: Evidence = {
  label: "McDonald · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#mcdonald-2026-09-23",
  kind: "Candidate statement",
  date: "Received September 23, 2026",
  note: NOTE,
};

/* Sources found in the September 22 sweep. */
const MERCURY_D4 = "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-4/";
const schulteQuestionnaire: Evidence = {
  label: "Schulte · Mercury candidate questionnaire, quoted in “Meet the Candidates for City Council District 4”",
  url: MERCURY_D4,
  kind: "Candidate statement",
  date: "Published September 11, 2026 (updated September 15); reviewed September 22, 2026",
  note: `His questionnaire answer as quoted by the Portland Mercury. ${NOTE}`,
};
const leakeMercury = reported(
  "Leake · priorities as summarized by the Portland Mercury from his questionnaire",
  MERCURY_D4,
  "September 11, 2026 (updated September 15)",
  "the Portland Mercury (paraphrase of his questionnaire answer)",
);
const arnoldNwExaminer = reported(
  "Arnold · “Eli Arnold stakes out campaign issues,” NW Examiner",
  "https://nwexaminer.com/p/eli-arnold-stakes-out-campaign-issues",
  "August 18, 2026",
  "the NW Examiner",
);
const schulteHomelessness = site22(
  "Schulte · Homelessness, the Last Mile, and ReBoot Portland",
  "https://mattschulte.wordpress.com/2026/09/10/homelessness-and-the-last-mile/",
);
const jbsWaterPost = post(
  "Beausoleil Smith · Bluesky post on the Bull Run filtration plant",
  "https://bsky.app/profile/jeremy4pdx.bsky.social/post/3mlmg4g7yfc23",
  "May 11, 2026",
);
const jbsTaxPost = post(
  "Beausoleil Smith · Bluesky post, “Should we Tax the Rich in Portland? Yes”",
  "https://bsky.app/profile/jeremy4pdx.bsky.social/post/3mnfery6dv22g",
  "June 3, 2026",
);
const evenstarModaPost = post(
  "Evenstar · Bluesky post on the Moda term sheet amendments",
  "https://bsky.app/profile/jameyevenstar.bsky.social/post/3msvpe6cdlc2t",
  "August 12, 2026",
);
const clarkStaffingPost = post(
  "Clark · Bluesky post on Police Bureau staffing (official councilor account)",
  "https://bsky.app/profile/councilorclark.bsky.social/post/3mjniuw7cuc2c",
  "April 16, 2026",
);

export const topicStancesD4: TopicStance[] = [
  /* ── Timothy (TJ) Anderson ──────────────────────────────────────────── */
  stance("timothy-tj-anderson", "new-taxes", "opposes", "None until audit done",
    "Says no additional taxes or fees would be passed until a value-based audit shows where the city’s money has gone.",
    andersonEmail),
  stance("timothy-tj-anderson", "police-staffing", "supports", "More officers, plus cadets",
    "Says more officers are “pretty much a given” to get response times down, with cadets, volunteers and other programs handling calls that do not need the most highly trained officers.",
    andersonEmail),
  // Short answers from his second emailed reply of September 22, 2026; he asked to give a longer answer on the street fee.
  swept("timothy-tj-anderson", "moda", "supports", "Yes, capped at $60M",
    "Answered yes to public money for the Moda Center renovation, at no more than $60 million.",
    andersonEmail2),
  swept("timothy-tj-anderson", "camp-removal", "supports", "Keep current funding",
    "Answered yes when asked whether to keep funding camp removals at current levels.",
    andersonEmail2),
  swept("timothy-tj-anderson", "data-centers", "supports", "Restrict new data centers",
    "Answered yes when asked whether to restrict new AI data centers in the city.",
    andersonEmail2),
  swept("timothy-tj-anderson", "street-response", "mixed", "Not without additions",
    "Answered no to a full 24/7 Street Response “not without additions,” without yet saying what those additions would be.",
    andersonEmail2),
  swept("timothy-tj-anderson", "water-rates", "opposes", "No rate increases",
    "Answered no when asked whether to raise water bills to pay for the Bull Run filtration plant and system repairs.",
    andersonEmail2),

  /* ── Jayne Cronlund (emailed reply of September 23, 2026) ───────────── */
  swept("jayne-cronlund", "moda", "supports", "Renovate for jobs",
    "Lists Moda Center renovations among spending she would prioritize, for short-term prevailing-wage construction jobs and as a centerpiece for the Albina Vision Trust’s restorative development.",
    cronlundEmail),
  swept("jayne-cronlund", "police-staffing", "supports", "Modest, tied to response",
    "Supports a modest increase in police if it is tied to decreasing response times.",
    cronlundEmail),

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
  swept("eli-arnold", "moda", "supports", "Best deal, but proceed",
    "Told the NW Examiner that securing the best possible deal with public funds is important but moving forward on the renovation is also crucial, to keep Moda’s economic activity, tourism and jobs.",
    arnoldNwExaminer),

  /* ── Olivia Clark ───────────────────────────────────────────────────── */
  stance("olivia-clark", "camp-removal", "supports", "Remove street camping",
    "Would make the city safe by removing street camping and public drug use while adding shelter beds, sobering stations and treatment.",
    clarkPriorities),
  swept("olivia-clark", "police-staffing", "supports", "Understaffed police unacceptable",
    "Says the Police Bureau is one of the nation’s most understaffed and calls that unacceptable; her site says she acted to protect core police funding against proposed cuts.",
    clarkStaffingPost),

  /* ── Jamey Evenstar ─────────────────────────────────────────────────── */
  stance("jamey-evenstar", "new-taxes", "supports", "Fee on empty homes",
    "Proposes a Housing Supply Impact Fee on homes not used as a primary residence, with revenue building permanently affordable homes.",
    evenstarHousingPlan),
  swept("jamey-evenstar", "moda", "partial", "Terrible deal; amendments better",
    "Called the original Moda term sheet a terrible deal and the August 12 amendments a big improvement; other posts ask for Albina community benefits and escalating rent; she does not say whether public money should go in.",
    evenstarModaPost),
  swept("jamey-evenstar", "street-response", "partial", "Unarmed response; 24/7 unsaid",
    "Would expand unarmed crisis response for behavioral-health and quality-of-life calls and, in a July post, backed approving a lease for Portland Street Response; she does not say whether it should run 24/7 citywide.",
    evenstarFaq),

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

  /* ── Josh Leake ─────────────────────────────────────────────────────── */
  swept("josh-leake", "street-response", "supports", "Street Response 24/7",
    "Told the Mercury’s candidate questionnaire that expanding Portland Street Response to 24/7 service is one of his priorities; staffing or funding details are not given.",
    leakeMercury),

  /* ── John McDonald ──────────────────────────────────────────────────── */
  // From his emailed reply of September 23, 2026; it replaces a partial reading of his pamphlet statement.
  swept("john-mcdonald", "moda", "supports", "Backs the $120M plan",
    "Fully supports the City’s current proposal of $120 million up front and $275 million in ongoing maintenance over a 20-year lease, and expects other revenue to come with the teams’ success.",
    mcdonaldEmail),

  /* ── Matt Schulte ───────────────────────────────────────────────────── */
  stance("matt-schulte", "data-centers", "supports", "Ban until value standard",
    "Supports a ban on data centers until a Load-Value Standard measures public return per megawatt in jobs, tax revenue, infrastructure cost and environmental effects.",
    schulteDataCenters),
  swept("matt-schulte", "moda", "partial", "Blazers’ turn; money unsaid",
    "Says the city should not concede any more leverage to Dundon and the Blazers and its stance should be “it’s your turn to compromise”; he does not say whether public money should pay.",
    schulteQuestionnaire),
  swept("matt-schulte", "street-response", "supports", "24/7 Street Response coverage",
    "Would institute 24/7 Street Response coverage and implement the 911 Call Allocation Working Group’s recommendations within one year, per his Mercury questionnaire answer.",
    schulteQuestionnaire),
  swept("matt-schulte", "camp-removal", "partial", "Sweeps disrupt; funding unsaid",
    "Says when the city causes a disruption, as in a camp sweep, it has an obligation to fix it through continuous navigation; he does not say whether removal funding should stay at current levels.",
    schulteHomelessness),

  /* ── Jeremy Beausoleil Smith ────────────────────────────────────────── */
  stance("jeremy-beausoleil-smith", "data-centers", "supports", "Four-year moratorium",
    "Supports a four-year moratorium on new data-center development, citing electricity rates, water use, pollution and grid reliability.",
    jbsPlatform),
  swept("jeremy-beausoleil-smith", "water-rates", "opposes", "Pursue Bull Run alternatives",
    "Says the $3 billion Bull Run filtration project will double water bills over a decade; asks Council for affordability, accountability and pursuit of alternatives to the plant.",
    jbsWaterPost),
  swept("jeremy-beausoleil-smith", "new-taxes", "supports", "Tax the rich",
    "Answers “Yes” to “Should we Tax the Rich in Portland?” in a campaign post; his platform expects large corporations to contribute their fair share, with no specific tax named.",
    jbsTaxPost),
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
