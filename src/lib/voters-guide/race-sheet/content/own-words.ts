/**
 * Each published candidate introduced in their own words: the verbatim
 * opening of their official statement, captured under one mechanical rule
 * so the guide never chooses which of a candidate's sentences to feature.
 *
 * Rule: the first complete sentence of the candidate's statement text, not
 * the name / occupation / background header fields the pamphlet prints
 * above it. If that sentence is under 12 words, the first two sentences.
 * Capped at 60 words, ending at a sentence boundary. The candidate's own
 * punctuation and capitalization are kept; nothing is edited and nothing
 * is elided inside the excerpt.
 *
 * What "statement text" skips before the running prose begins: standalone
 * headings and slogans (lines with no terminal punctuation, or labels with
 * no predicate such as "Policy Expert. Lawyer. Scientist. Nerd. Fixer."),
 * quotations with an attribution, run-in section labels ("INFRASTRUCTURE:"),
 * bullet and numbered list items, salutations and greetings with no
 * predicate ("Dear Neighbors:", "Hi, Portland.", "Hello all!"), voting
 * instructions and contact lines. A "complete sentence" ends with terminal
 * punctuation and has a predicate; a slogan that meets both tests
 * ("LET’S MAKE LOCAL GOVERNMENT BORING.") counts as the first sentence.
 * One statement (Ward) contains no complete sentence before its labeled
 * fragments begin, so its first punctuated unit is used and noted.
 *
 * Source order for the six candidates without a Multnomah pamphlet
 * statement: the City filing statement when the published sources include
 * one (McCormick, Goldsmith), else the campaign site's About page (Pham,
 * Tucker), else the candidate's own written statement in the published
 * sources (Frankenstein: Mercury questionnaire; Beaudoin: LinkedIn campaign
 * announcement). Every `rule` names which of these was used.
 *
 * Words are counted as whitespace-separated tokens containing a letter or
 * digit, so a bare dash does not count. Extracted September 20, 2026 from
 * the November 2026 Multnomah County voters' pamphlet PDF (text extracted
 * per page with pdftotext) and the sources named on each entry.
 */

export type OwnWordsRule =
  | "pamphlet-opening"
  | "filing-opening"
  | "site-opening"
  | "questionnaire-opening"
  | "announcement-opening";

export type OwnWords = {
  candidateId: string;
  /** Verbatim opening, ≤60 words, ending at a sentence boundary. */
  text: string;
  source: {
    label: string;
    url: string;
    kind: "Candidate statement";
    date: string;
    note?: string;
  };
  rule: OwnWordsRule;
  words: number;
};

const PAMPHLET =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";

const pamphletOpening = (page: number) =>
  ({
    label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
    url: `${PAMPHLET}#page=${page}`,
    kind: "Candidate statement",
    date: "November 2026 edition; extracted September 20, 2026",
    note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.",
  }) as const;

export const ownWords: OwnWords[] = [
  /* ── District 3 ─────────────────────────────────────────────────────── */
  {
    candidateId: "ali-beaudoin",
    text: "I’m excited to share that I’m running for Portland City Council in District 3.",
    source: {
      label: "Beaudoin’s campaign announcement and priorities",
      url: "https://www.linkedin.com/posts/ali-beaudoin-75b9558_meet-the-candidates-for-city-council-district-activity-7503657810526846979-aEnb",
      kind: "Candidate statement",
      date: "September 2026; extracted September 20, 2026",
      note: "Verbatim opening of the candidate's LinkedIn campaign announcement, the only candidate statement in the published sources. No pamphlet statement; no statement in a City filing among the published sources; PortlandVotes recorded no campaign website as of August 16, 2026.",
    },
    rule: "announcement-opening",
    words: 14,
  },
  {
    candidateId: "joel-corcoran",
    text: "When City Council members spend their energy fighting rather than collaborating, public services suffer and community trust erodes.",
    source: pamphletOpening(56),
    rule: "pamphlet-opening",
    words: 18,
  },
  {
    candidateId: "guy-frankenstein",
    text: "Federal agents of a fascist state patrol our streets, gas our neighbors, and terrorize our immigrant community, while City Council and state government offer empty words accompanied by zero action.",
    source: {
      label: "Mercury questionnaire · Frankenstein’s responses",
      url: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
      kind: "Candidate statement",
      date: "September 9, 2026; extracted September 20, 2026",
      note: "Verbatim opening of the candidate's written questionnaire response as quoted by the Portland Mercury; the paper's comma before its attribution is rendered as the sentence's period. No pamphlet statement; no statement in a City filing among the published sources; the campaign site guyfrankenstein.com showed only “Website under deconstruction.” on September 20, 2026.",
    },
    rule: "questionnaire-opening",
    words: 30,
  },
  {
    candidateId: "matthias-hallett",
    text: "Police should be present, visible, and known in the neighborhoods they serve, officers walking a beat, not just responding to 911 calls after the fact.",
    source: pamphletOpening(58),
    rule: "pamphlet-opening",
    words: 25,
  },
  {
    candidateId: "patrick-hilton",
    text: "This is our Goonies moment, Portland. Developers and well-funded lobbyists want to rezone our neighborhoods for maximum return.",
    source: pamphletOpening(57),
    rule: "pamphlet-opening",
    words: 18,
  },
  {
    candidateId: "larry-kelly",
    text: "I’m a chef by trade and a biochemist by education. One taught me to ask better questions, analyze data, and avoid jumping to conclusions, while the other taught me how to work with others to solve problems.",
    source: pamphletOpening(54),
    rule: "pamphlet-opening",
    words: 37,
  },
  {
    candidateId: "tiffany-koyama-lane",
    text: "I’m Teacher Tiffany, a Japanese American public school teacher, union organizer, and mom raising two kids in Southeast Portland.",
    source: pamphletOpening(54),
    rule: "pamphlet-opening",
    words: 19,
  },
  {
    candidateId: "kenneth-kent-r-landgraver-iii",
    text: "My goal is to ensure every tax dollar goes to doing the people’s work.",
    source: {
      ...pamphletOpening(60),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The statement opens with two bulleted lists (“3rd District experience:” and “What do i bring to the Council:”); this is its first sentence of running prose.",
    },
    rule: "pamphlet-opening",
    words: 14,
  },
  {
    candidateId: "keir-legree",
    text: "I will bring a new approach focused on practical solutions and leadership that listens, analyzes, and brings our community together.",
    source: pamphletOpening(59),
    rule: "pamphlet-opening",
    words: 20,
  },
  {
    candidateId: "esther-leon",
    text: "As a healthcare provider who has worked directly in-home with Portlanders, and currently with inmates, I have a unique perspective on how societal structure impacts personal wellbeing.",
    source: pamphletOpening(60),
    rule: "pamphlet-opening",
    words: 27,
  },
  {
    candidateId: "darren-mccormick",
    text: "More cops. Lock up the dangerously unstable drug zombies.",
    source: {
      label: "2026 candidate filing · policy language on PDF page 4",
      url: "https://www.portland.gov/auditor/elections/documents/mccormick-darren-2026-aud-120/download#page=4",
      kind: "Candidate statement",
      date: "Filed July 15, 2026; extracted September 20, 2026",
      note: "Verbatim opening of the candidate's City filing. The form has no statement field; this text is what he entered in its occupation and background fields. No pamphlet statement.",
    },
    rule: "filing-opening",
    words: 9,
  },
  {
    candidateId: "angelita-morillo",
    text: "As the youngest person ever elected to Portland City Council, Angelita is the only immigrant, renter and transit-dependent leader who’s experienced homelessness serving Portland.",
    source: pamphletOpening(56),
    rule: "pamphlet-opening",
    words: 24,
  },
  {
    candidateId: "steve-novick",
    text: "Steve Novick has fought to cut the bloated budgets - $1.45 million apiece! - the Council voted itself for their personal offices.",
    source: {
      ...pamphletOpening(57),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The statement opens with an attributed quotation from Earl Blumenauer and the heading “Responsible with our money:”, both skipped.",
    },
    rule: "pamphlet-opening",
    words: 20,
  },
  {
    candidateId: "cristal-otero",
    text: "Portland has difficult choices ahead. Costs are rising, budgets are tight, and residents need public services that actually work.",
    source: pamphletOpening(59),
    rule: "pamphlet-opening",
    words: 19,
  },
  {
    candidateId: "terry-parker",
    text: "City streets and parks should be maintained before new projects are undertaken.",
    source: {
      ...pamphletOpening(55),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The sentence follows the run-in section label “INFRASTRUCTURE:”, which is skipped.",
    },
    rule: "pamphlet-opening",
    words: 12,
  },
  {
    candidateId: "heart-free-pham",
    text: "There is no candidate in this race whose roots in the Rose City go deeper than mine.",
    source: {
      label: "Pham · About Me",
      url: "https://fightwithheartpdx.com/about",
      kind: "Candidate statement",
      date: "Current campaign website; extracted September 20, 2026",
      note: "Verbatim opening of the campaign site's About page, read from the rendered page. No pamphlet statement, and the candidate's City filing contains no statement text.",
    },
    rule: "site-opening",
    words: 17,
  },
  {
    candidateId: "tom-sollitt",
    text: "LET’S MAKE LOCAL GOVERNMENT BORING. That means permits get processed, streets and parks are maintained, calls and emails get answered, and when something starts going wrong, the city steps in before it becomes a bigger problem.",
    source: pamphletOpening(53),
    rule: "pamphlet-opening",
    words: 36,
  },
  {
    candidateId: "john-sweeney",
    text: "The property values of a great many down town properties have dropped by as much as 70%.",
    source: {
      ...pamphletOpening(53),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The statement opens with an all-caps heading, the lead-in “JOHN SWEENEY’s top three priorities are:” and the numbered item “1. Save as many city services as possible.”, all skipped.",
    },
    rule: "pamphlet-opening",
    words: 17,
  },
  {
    candidateId: "kellie-torres",
    text: "PORTLAND HAS BIG CHALLENGES. KELLIE TORRES CAN TURN THEM INTO OPPORTUNITIES.",
    source: {
      ...pamphletOpening(58),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The two all-caps sentences follow a tagline with no predicate (“THE VALUES TO BRING PEOPLE TOGETHER. THE EXPERIENCE TO GET THINGS DONE.”), which is skipped.",
    },
    rule: "pamphlet-opening",
    words: 11,
  },
  {
    candidateId: "kimberly-tucker",
    text: "My name is Kimberly Tucker, and, as I tend to have to tell people, I do actually go by Kimberly.",
    source: {
      label: "Tucker · About the Candidate",
      url: "https://kimberlyforpdxd3.com/about-the-candidate",
      kind: "Candidate statement",
      date: "Current campaign website; extracted September 20, 2026",
      note: "Verbatim opening of the campaign site's About page after the greeting “Hello all!”. No pamphlet statement; no statement in a City filing among the published sources.",
    },
    rule: "site-opening",
    words: 20,
  },
  {
    candidateId: "martin-ward",
    text: "A Progressive Republican along the lines of Abraham Lincoln, Ulysses S. Grant, Susan B. Anthony, Fredrick Douglas, Booker T. Washington, and Harriet Tubman.",
    source: {
      ...pamphletOpening(55),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The statement has no complete sentence before its labeled fragments begin: an unpunctuated pointer to his website is followed by this self-description, the first punctuated unit.",
    },
    rule: "pamphlet-opening",
    words: 23,
  },

  /* ── District 4 ─────────────────────────────────────────────────────── */
  {
    candidateId: "timothy-tj-anderson",
    text: "Portland is at a crossroads, and many people are unhappy with the direction our city is taking.",
    source: pamphletOpening(65),
    rule: "pamphlet-opening",
    words: 17,
  },
  {
    candidateId: "eli-arnold",
    text: "I’ve dedicated my life to hard work and serving others: As a community police officer, Army combat veteran, progressive Democrat and father of four.",
    source: pamphletOpening(65),
    rule: "pamphlet-opening",
    words: 24,
  },
  {
    candidateId: "olivia-clark",
    text: "It has been a privilege to serve as your City Councilor these last two years.",
    source: {
      ...pamphletOpening(62),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The heading “VOTE OLIVIA CLARK #1” and the salutation “Dear Neighbors:” are skipped.",
    },
    rule: "pamphlet-opening",
    words: 15,
  },
  {
    candidateId: "jayne-cronlund",
    text: "I am a listener and an experienced coach that helps people find solutions to their toughest challenges.",
    source: pamphletOpening(63),
    rule: "pamphlet-opening",
    words: 17,
  },
  {
    candidateId: "jamey-evenstar",
    text: "It’s time we had a City Council that believes in Portland. We need more working-class voices on Council to stand up to a fascist regime, have a backbone against special monied interests, and refuse to accept the status quo.",
    source: pamphletOpening(64),
    rule: "pamphlet-opening",
    words: 39,
  },
  {
    candidateId: "john-j-goldsmith",
    text: "I am a licensed (DPSST) Central City unionized Security Officer for an International private security firm.",
    source: {
      label: "Amended 2026 candidate filing · occupation field on PDF page 4",
      url: "https://www.portland.gov/auditor/elections/documents/goldsmith-john-2026-aud-120-amendment-redacted/download#page=4",
      kind: "Candidate statement",
      date: "Filed August 24, 2026; extracted September 20, 2026",
      note: "Verbatim opening of the candidate's amended City filing. The form has no statement field; this is the first sentence he wrote in its occupation field. No pamphlet statement; the campaign site listed in the filing (johngoldsmith4pdx.net) refused connections on September 20, 2026.",
    },
    rule: "filing-opening",
    words: 16,
  },
  {
    candidateId: "mitch-green",
    text: "I’m Mitch Green, a PhD economist, a US Army veteran, a democratic socialist, and a Portland City Councilor representing District 4.",
    source: {
      ...pamphletOpening(62),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The greeting “Hi, Portland.” that precedes it is skipped.",
    },
    rule: "pamphlet-opening",
    words: 21,
  },
  {
    candidateId: "josh-leake",
    text: "I’m Josh. Portland native, housing-finance expert, film producer, and former Portland Police Bureau Explorer Scout.",
    source: {
      ...pamphletOpening(66),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The ranking instructions and contact lines that open the statement are skipped.",
    },
    rule: "pamphlet-opening",
    words: 15,
  },
  {
    candidateId: "john-mcdonald",
    text: "My ask is simple: your vote. Your vote if you believe Portland can once again be a city that works — a city with clean, safe streets, thriving neighborhoods, reliable transportation, affordable housing and an economy that creates opportunity.",
    source: {
      ...pamphletOpening(63),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The heading “Portland Is Ready for a Comeback” is skipped.",
    },
    rule: "pamphlet-opening",
    words: 38,
  },
  {
    candidateId: "matt-schulte",
    text: "Portland has long been all process and no vision, all consensus and no conviction, and our downtown has paid the price for that.",
    source: pamphletOpening(61),
    rule: "pamphlet-opening",
    words: 23,
  },
  {
    candidateId: "jeremy-beausoleil-smith",
    text: "Portland is way too expensive. I’ll fight to lower costs and make life easier.",
    source: {
      ...pamphletOpening(61),
      note: "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims. The heading “PORTLAND’S BEST DAYS ARE AHEAD OF US” is skipped.",
    },
    rule: "pamphlet-opening",
    words: 14,
  },
  {
    candidateId: "eric-zimmerman",
    text: "It’s time to get Positive about Portland! Portland should be the City that says YES.",
    source: pamphletOpening(64),
    rule: "pamphlet-opening",
    words: 15,
  },
];

export const findOwnWords = (candidateId: string) =>
  ownWords.find((entry) => entry.candidateId === candidateId);
