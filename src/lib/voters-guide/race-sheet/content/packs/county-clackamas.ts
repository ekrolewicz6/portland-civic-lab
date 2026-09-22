import type { Evidence } from "../../../types";
import type { CandidateAnalysis, Delivery, DeliveryStep, IssueLine, StanceChip } from "../../types";
import type { IssueId } from "../../issues";
import type { OwnWords } from "../own-words";
import { emptyPack, type RacePack } from "../../types";

/**
 * Race pack: Clackamas County offices (Clerk, Treasurer, Sheriff, Commissioner
 * Positions 2 and 4). Filled by research on September 21, 2026 from the
 * November 2026 Clackamas County voters’ pamphlet (PDF pages 14–18, read with
 * pdftotext), each campaign site the statement prints, and the county’s
 * published candidate filings (SEL 101) for the two candidates whose
 * statement prints no channel. Every entry names its source; gaps stay gaps.
 *
 * Venues reviewed September 21, 2026:
 *   https://clackamasvoice.org/ (+ /priorities/, /getinvolved/, /meet-catherine/)
 *   https://www.markforcountyclerk.com/ (+ /solutions, /contact, /about)
 *   https://www.oneilforsheriff.com/ (+ /brads-priorities/, /vision/, /get-involved/)
 *   https://www.electsheriffrhodes.com/ (+ /theplan, /getinvolved, /meetyoursheriff)
 *   https://electpaulsavas.com/ (+ /issues/, three 2026 posts)
 *   https://friendsofremysmith.org/ (+ /policies/, /about/)
 *   https://www.votedianahelm.com/
 *   Nava and Shull print no site; their county filings were read instead.
 */

const PAMPHLET = "https://docs.clackamas.us/documents/drupal/03f4f9db-a1ab-4a1f-9ce1-16059d49a513";
const ELECTIONS = "https://www.clackamas.us/elections";
const REVIEWED_ON = "2026-09-21";
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const pamphlet = (page: number): Evidence => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
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

const filing = (label: string, url: string, date: string, note: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note,
});

const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

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

const pamphletOpening = (page: number, note: string): OwnWords["source"] => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; extracted September 21, 2026",
  note: `${note} Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.`,
});

const portrait = (id: string, page: number) => ({
  src: `/images/voters-guide/2026/${id}.webp`,
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Clackamas County voters’ pamphlet",
  reviewed: REVIEWED_ON,
});

const electionsPage: Evidence = {
  label: "Clackamas County Elections · November 3, 2026 General Election",
  url: ELECTIONS,
  kind: "Election authority",
  date: "Checked September 21, 2026",
};

/* Sources reused across entries. */
const mcmullenPriorities = site("McMullen · priorities", "https://clackamasvoice.org/priorities/");
const reaksSolutions = site("Reaksecker · solutions", "https://www.markforcountyclerk.com/solutions");
const oneilPriorities = site("O’Neil · priorities", "https://www.oneilforsheriff.com/brads-priorities/");
const oneilVision = site("O’Neil · vision and first 100 days", "https://www.oneilforsheriff.com/vision/");
const rhodesPlan = site("Rhodes · the plan", "https://www.electsheriffrhodes.com/theplan");
const savasIssues = site("Savas · issues", "https://electpaulsavas.com/issues/");
const savasHousing = site(
  "Savas · 968 affordable housing units delivered (March 27, 2026)",
  "https://electpaulsavas.com/968-affordable-housing-units-delivered/",
);
const savasHomeless = site(
  "Savas · real solutions on homelessness and mental health (April 9, 2026)",
  "https://electpaulsavas.com/real-solutions-on-homelessness-and-mental-health/",
);
const savasDataCenters = site(
  "Savas · pausing data centers (September 18, 2026)",
  "https://electpaulsavas.com/pausing-data-centers/",
);
const smithPolicies = site("Smith · policies", "https://friendsofremysmith.org/policies/");
const smithHome = site("Smith · home page", "https://friendsofremysmith.org/");
const helmHome = site("Helm · home page", "https://www.votedianahelm.com/");

const analysis: Record<string, CandidateAnalysis> = {
  /* ── Clerk ─────────────────────────────────────────────────────────── */
  "catherine-mcmullen": {
    values: ["Election security", "Voter access"],
    tradeoff:
      "Her case is continuity: the office she runs now, run the same way. The performance figures in the statement (timely results, 50,000 ballot-tracking subscribers, 465 weddings) are the campaign’s own numbers.",
    issues: {
      money: {
        position:
          "Would keep marriage licenses and property recording cost-effective and hold convenient weekday hours for records and marriage services.",
        source: pamphlet(14),
      },
    },
    sources: [pamphlet(14), mcmullenPriorities],
  },
  "mark-reaksecker": {
    values: ["Hand-counted ballots", "Local voter-roll checks"],
    tradeoff:
      "The case turns on a factual premise about machine counting that the Secretary of State’s description of Oregon’s paper-ballot system and hand-count audits does not support; the staffing and cost of a countywide hand count are not estimated.",
    issues: {
      money: {
        position:
          "Would replace machine tabulation with hand counting, which he says costs less than buying tabulating machines, and add watermarked ballots.",
        source: reaksSolutions,
      },
    },
    sources: [pamphlet(14), reaksSolutions],
  },

  /* ── Treasurer ─────────────────────────────────────────────────────── */
  "brian-t-nava": {
    values: ["Safe, liquid investing", "Cash controls"],
    tradeoff:
      "An unopposed incumbent’s statement of continuity: safety, liquidity and return are named as goals without published benchmarks or risk measures.",
    issues: {
      money: {
        position:
          "Would keep county funds safe and liquid first while seeking the best return possible, and keep building cash controls across the county.",
        source: pamphlet(15),
      },
    },
    sources: [pamphlet(15)],
  },

  /* ── Sheriff ───────────────────────────────────────────────────────── */
  "brad-o-neil": {
    values: ["Rural response times", "Open books"],
    tradeoff:
      "His statement runs on management and accountability rather than named hires or cuts; the claim to be the only candidate with current Oregon police certification and no disciplinary action is the campaign’s own.",
    issues: {
      safety: {
        position:
          "Would make response times in rural and unincorporated areas a measured priority, keep search and rescue equipped, and pair deputies with behavioral-health partners on calls they cannot solve alone.",
        source: oneilPriorities,
      },
      money: {
        position:
          "Would protect core public-safety services first under budget pressure, guide staffing and spending with data, and show the public where the money goes.",
        source: oneilPriorities,
      },
    },
    sources: [pamphlet(16), oneilPriorities, oneilVision],
  },
  "james-rhodes": {
    values: ["Front line first", "Fourth floor first"],
    tradeoff:
      "The appointed incumbent names operational priorities more clearly than their cost; restoring traffic enforcement and adding property-crime follow-up implies staffing the statement does not quantify.",
    issues: {
      safety: {
        position:
          "Would protect patrol, jail and investigative services, restore traffic and DUII (impaired-driving) enforcement, follow up on property crimes and target fentanyl traffickers.",
        source: pamphlet(16),
      },
      money: {
        position:
          "Would start budget cuts at the top (administration, discretionary spending and programs) before front-line services, and report the budget publicly.",
        source: rhodesPlan,
      },
    },
    sources: [pamphlet(16), rhodesPlan],
  },

  /* ── Commissioner, Position 2 ──────────────────────────────────────── */
  "paul-savas": {
    values: ["Services without new taxes", "Delivered projects"],
    tradeoff:
      "He runs on a record of projects delivered inside a flat budget; the unit counts, recovery-campus timing and tolling claims are the campaign’s own figures.",
    issues: {
      housing: {
        position:
          "Would keep expanding affordable housing of varied types and move people from homelessness into treatment and transitional housing through the county’s Recovery Campus.",
        source: savasIssues,
      },
      safety: {
        position: "Would fully fund the Sheriff’s Office and emergency services.",
        source: savasIssues,
      },
      money: {
        position:
          "Would hold the line on the county budget, expanding essential services without raising taxes, and support property-tax deferral so seniors can stay in their homes.",
        source: pamphlet(17),
      },
      climate: {
        position:
          "Opposes ODOT tolling and would add road capacity through the Sunrise Project and I-205 widening, while protecting farmland and open space.",
        source: savasIssues,
      },
    },
    sources: [pamphlet(17), savasIssues, savasHousing, savasHomeless, savasDataCenters],
  },
  "mark-shull": {
    values: ["Tax restraint", "Local control"],
    tradeoff:
      "Tax relief, no tolls and program cuts are commitments; which programs would be cut and what senior relief would cost are not in the statement, and land-use reform depends on the Legislature.",
    issues: {
      housing: {
        position:
          "Would build affordable housing by pushing for state land-use reform, while strictly protecting rural character and property rights.",
        source: pamphlet(17),
      },
      money: {
        position:
          "Would seek property-tax relief for seniors, cut programs he calls unnecessary and oppose any new taxes.",
        source: pamphlet(17),
      },
      climate: {
        position: "Opposes tolls on I-205 and would fix roads without charging daily drivers.",
        source: pamphlet(17),
      },
    },
    sources: [pamphlet(17)],
  },

  /* ── Commissioner, Position 4 ──────────────────────────────────────── */
  "diana-helm": {
    values: ["Faster permitting", "Data-center time-out"],
    tradeoff:
      "Her data-center position is a pause with a decision still to come, and her housing targets (900 units by 2030, permitting reform by 2028) are dated goals the whole board, not one member, would deliver.",
    issues: {
      housing: {
        position:
          "Would increase affordable housing by cutting regulatory burdens and speeding up permitting, and keep shelter, recovery and support services available to people who are homeless.",
        source: pamphlet(18),
      },
      climate: {
        position:
          "Led a moratorium on large data centers so the county can gather facts and hear the public before deciding, and would advocate for the Sunrise Corridor freight route.",
        source: pamphlet(18),
      },
    },
    sources: [pamphlet(18), helmHome],
  },
  "r-w-smith": {
    values: ["No large data centers", "Transparent contracts"],
    tradeoff:
      "His data-center stance is categorical rather than a pause; the treatment and shelter expansion he wants is not yet paired with a funding plan, though he pledges independent fiscal review of big projects.",
    issues: {
      housing: {
        position:
          "Would encourage housing working families can afford, streamline permitting for small builders, limit corporate purchases of homes, and add shelter beds paired with case management.",
        source: smithPolicies,
      },
      safety: {
        position:
          "Would give police and first responders the resources they need, expand treatment for addiction and mental illness, and insist on measurable outcomes.",
        source: pamphlet(18),
      },
      money: {
        position:
          "Would put major public projects and long-term contracts through independent fiscal review, report budgets and obligations openly, and end subsidies to large data centers.",
        source: smithPolicies,
      },
      climate: {
        position:
          "Opposes bringing large-scale data centers into the county, citing their electricity, water and land demands, and would build new clean-energy capacity.",
        source: pamphlet(18),
      },
    },
    sources: [pamphlet(18), smithPolicies, smithHome],
  },
};

export const pack: RacePack = {
  ...emptyPack(),
  analysis,

  lines: [
    line("catherine-mcmullen", "money", "Keeps marriage-license and property-recording fees cost-effective, with weekday hours."),
    line("mark-reaksecker", "money", "Replaces machine tabulation with hand counting, which he says costs less."),
    line("brian-t-nava", "money", "Keeps county funds safe and liquid first, then seeks the best return."),
    line("brad-o-neil", "safety", "Makes rural response times a measured priority; pairs deputies with behavioral-health partners."),
    line("brad-o-neil", "money", "Protects core public-safety services first; guides spending with data; opens the books."),
    line("james-rhodes", "safety", "Restores traffic and DUII (impaired-driving) enforcement; targets fentanyl traffickers."),
    line("james-rhodes", "money", "Cuts administration and discretionary spending before front-line services; reports budgets publicly."),
    line("paul-savas", "housing", "Expands affordable housing and moves people into treatment through the Recovery Campus."),
    line("paul-savas", "safety", "Fully funds the Sheriff’s Office and emergency services."),
    line("paul-savas", "money", "Expands essential services without raising taxes; backs senior property-tax deferral."),
    line("paul-savas", "climate", "Opposes tolling; widens I-205 and builds the Sunrise Project; protects farmland."),
    line("mark-shull", "housing", "Seeks state land-use reform for affordable housing while protecting rural character."),
    line("mark-shull", "money", "Seeks senior property-tax relief, cuts unnecessary programs, opposes any new taxes."),
    line("mark-shull", "climate", "Opposes I-205 tolls; fixes roads without charging daily drivers."),
    line("diana-helm", "housing", "Speeds permitting (building approvals) and cuts rules to build affordable homes; keeps shelters."),
    line("diana-helm", "climate", "Pauses large data centers to study impacts; backs the Sunrise Corridor freight route."),
    line("r-w-smith", "housing", "Faster permitting (building approvals), limits on corporate home buying, more shelter beds."),
    line("r-w-smith", "safety", "Resources police and first responders; expands treatment with measurable outcomes."),
    line("r-w-smith", "money", "Puts major projects through independent fiscal review; ends data-center subsidies."),
    line("r-w-smith", "climate", "Opposes large data centers over electricity, water and land; builds clean energy."),
  ],

  chips: [
    chip("catherine-mcmullen", "money", "Affordable clerk fees"),
    chip("mark-reaksecker", "money", "Hand counts, no tabulators"),
    chip("brian-t-nava", "money", "Safe, liquid investing"),
    chip("brad-o-neil", "safety", "Rural response times"),
    chip("brad-o-neil", "money", "Data-driven, open books"),
    chip("james-rhodes", "safety", "Traffic and fentanyl focus"),
    chip("james-rhodes", "money", "Cut administration first"),
    chip("paul-savas", "housing", "Recovery Campus, units"),
    chip("paul-savas", "safety", "Fully fund the sheriff"),
    chip("paul-savas", "money", "Services, no new taxes"),
    chip("paul-savas", "climate", "No tolls, widen I-205"),
    chip("mark-shull", "housing", "State land-use reform"),
    chip("mark-shull", "money", "Senior tax relief, cuts"),
    chip("mark-shull", "climate", "No I-205 tolls"),
    chip("diana-helm", "housing", "Faster permitting"),
    chip("diana-helm", "climate", "Data-center pause"),
    chip("r-w-smith", "housing", "Permitting, shelter beds"),
    chip("r-w-smith", "safety", "Treatment with outcomes"),
    chip("r-w-smith", "money", "Independent fiscal review"),
    chip("r-w-smith", "climate", "No large data centers"),
  ],

  deliveries: [
    delivery("catherine-mcmullen", "money"),
    delivery("mark-reaksecker", "money"),
    delivery("brian-t-nava", "money", {
      how: step(
        "Free cash-control training offered to all cities, districts and county employees; new and improved banking functions at the Treasurer’s office.",
        pamphlet(15),
      ),
    }),
    delivery("brad-o-neil", "safety", {
      how: step(
        "Recruitment and retention as a sustained priority, since every vacancy stretches response times; data to guide staffing and patrol; partnerships with local police and behavioral-health providers.",
        oneilPriorities,
      ),
      measure: step(
        "Help arriving faster in the places that wait longest today, set as a measured goal after a first-100-days review of response times and coverage; no numeric target published.",
        oneilVision,
      ),
    }),
    delivery("brad-o-neil", "money", {
      how: step(
        "Data-driven staffing, patrol and spending decisions; modernized operations and technology; cutting what wastes time and money; books open to residents.",
        oneilPriorities,
      ),
    }),
    delivery("james-rhodes", "safety", {
      how: step(
        "Budget savings found in fourth-floor administration, discretionary spending and programs before front-line services; partnerships with the District Attorney, courts, contract cities, schools and emergency-management partners.",
        rhodesPlan,
      ),
    }),
    delivery("james-rhodes", "money", {
      how: step(
        "Every dollar examined against one question, whether it helps the office conserve the peace and serve residents, starting with administrative overhead.",
        rhodesPlan,
      ),
      measure: step(
        "Regular public budget reporting with quarterly updates so taxpayers can see whether the office is staying on track.",
        rhodesPlan,
      ),
    }),
    delivery("paul-savas", "housing", {
      how: step(
        "A monthly Affordable Housing Implementation Team; $10 million in state money for the Recovery Campus, which combines treatment, stabilization and transitional housing; preserving affordable units at risk of expiring.",
        savasHomeless,
      ),
      measure: step(
        "968 affordable units complete or scheduled against a goal of 900 by 2030; Clackamas Village’s 24 transitional-shelter spaces opened May 2025.",
        savasHousing,
      ),
    }),
    delivery("paul-savas", "safety"),
    delivery("paul-savas", "money"),
    delivery("paul-savas", "climate", {
      how: step(
        "Backs the Sunrise Project and I-205 expansion to add capacity; helped advance a moratorium on new data-center applications while the county studies electricity, water and road impacts.",
        savasDataCenters,
      ),
    }),
    delivery("mark-shull", "housing"),
    delivery("mark-shull", "money"),
    delivery("mark-shull", "climate"),
    delivery("diana-helm", "housing", {
      how: step(
        "A more customer-service-friendly permit process; completion and operation of the county Recovery Campus.",
        helmHome,
      ),
      measure: step(
        "900 more affordable units by 2030; regulatory burden reduced by 2028; the Recovery Campus completed and operating by 2027.",
        helmHome,
      ),
    }),
    delivery("diana-helm", "climate"),
    delivery("r-w-smith", "housing", {
      how: step(
        "Streamlined permitting so builders avoid repeated design revisions; limits on speculative corporate ownership; shelter capacity paired with case management; partnerships with nonprofits and Community Action Board programs.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "safety", {
      how: step(
        "Strategic planning to hold emergency response times as the county grows; cooperation among county agencies, cities and service districts; prevention programs for young people.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "money", {
      how: step(
        "Independent fiscal review of major projects and long-term financial agreements; public review of major structural decisions; new clean-energy capacity to stabilize utility costs.",
        smithPolicies,
      ),
    }),
    delivery("r-w-smith", "climate"),
  ],

  ownWords: [
    {
      candidateId: "catherine-mcmullen",
      text: "Clerk McMullen is a nonpartisan, nationally recognized elections official. She has devoted her career to public service; conducting 25 elections since 2015, nine for Clackamas County.",
      source: pamphletOpening(
        14,
        "Skipped the “Re-elect …” heading, a quotation attributed to a former Secretary of State and the “ACCOUNTABLE • FAIR • EXPERIENCED” slogan; first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 26,
    },
    {
      candidateId: "mark-reaksecker",
      text: "Mark is a 3rd generation Oregonian, whose grandfather was sheriff of Clackamas County.",
      source: pamphletOpening(14, "Nothing skipped: the statement opens with running prose."),
      rule: "pamphlet-opening",
      words: 13,
    },
    {
      candidateId: "brian-t-nava",
      text: "As your County’s Treasurer, Brian oversees the county’s cash and investment portfolio.",
      source: pamphletOpening(
        15,
        "Skipped a quotation attributed to a former county treasurer and the “SOUND FINANCIAL MANAGEMENT” section label.",
      ),
      rule: "pamphlet-opening",
      words: 12,
    },
    {
      candidateId: "brad-o-neil",
      text: "Clackamas County deserves a Sheriff who is experienced, accountable, and ready to lead on day one.",
      source: pamphletOpening(
        16,
        "Skipped the “Brad O’Neil for Clackamas County Sheriff” heading and the “Trusted. Qualified. A New Direction” labels.",
      ),
      rule: "pamphlet-opening",
      words: 16,
    },
    {
      candidateId: "james-rhodes",
      text: "I was born and raised in Clackamas County, where Patti and I raised our daughter and owned a small business.",
      source: pamphletOpening(
        16,
        "Skipped the “SHERIFF JAMES RHODES” heading and the “Proven. Local. Trusted.” labels.",
      ),
      rule: "pamphlet-opening",
      words: 20,
    },
    {
      candidateId: "paul-savas",
      text: "I am honored to serve as your County Commissioner. Together we fought for fair access to parks, natural areas, libraries, and services for veterans and seniors.",
      source: pamphletOpening(
        17,
        "Nothing skipped; the first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 26,
    },
    {
      candidateId: "mark-shull",
      text: "As your Commissioner, I always put residents first with fiscal discipline and common sense.",
      source: pamphletOpening(
        17,
        "Skipped the “THE PEOPLE’S COMMISSIONER” heading and the unpunctuated “For the People; a More Affordable Clackamas County” line.",
      ),
      rule: "pamphlet-opening",
      words: 14,
    },
    {
      candidateId: "diana-helm",
      text: "Commissioner Diana Helm has proven to be a strong voice for the citizens of Clackamas County by advocating for affordable housing, leading the effort to pause mega-sized data centers, addressing homelessness and addiction, and supporting safe communities.",
      source: pamphletOpening(18, "Skipped the “LEADERSHIP • TRANSPARENCY • INTEGRITY” labels."),
      rule: "pamphlet-opening",
      words: 37,
    },
    {
      candidateId: "r-w-smith",
      text: "Clackamas County is my home. My wife and I are raising our three children here.",
      source: pamphletOpening(
        18,
        "Skipped the “CLACKAMAS VALUES. BIPARTISAN SOLUTIONS.” slogan (labels with no predicate); the first sentence is under 12 words, so two are given.",
      ),
      rule: "pamphlet-opening",
      words: 15,
    },
  ],

  contacts: [
    {
      candidateId: "catherine-mcmullen",
      channels: [
        { url: "https://clackamasvoice.org/", label: "clackamasvoice.org", kind: "website", from: "pamphlet" },
        { url: "mailto:ClackamasVoice@gmail.com", label: "ClackamasVoice@gmail.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/catherinetheclerk/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/ClackamasVoice", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.linkedin.com/in/catherinecmcmullen/", label: "LinkedIn", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(14),
        site("McMullen · priorities (prints the campaign email)", "https://clackamasvoice.org/priorities/"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "mark-reaksecker",
      channels: [
        { url: "https://www.markforcountyclerk.com/", label: "markforcountyclerk.com", kind: "website", from: "pamphlet" },
        { url: "https://www.markforcountyclerk.com/contact", label: "Contact form", kind: "form", from: "site" },
        { url: "https://www.instagram.com/markreaksecker", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61575462016802", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(14),
        site("Reaksecker · contact page (form; header links the profiles)", "https://www.markforcountyclerk.com/contact"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "brian-t-nava",
      channels: [
        { url: "mailto:bnava30@hotmail.com", label: "bnava30@hotmail.com", kind: "email", from: "filing" },
        { url: "https://fb.me/Brian4ClackamasCountyTreasurer", label: "Facebook", kind: "social", from: "filing" },
      ],
      sources: [
        filing(
          "Nava · county candidate filing (SEL 101), contact fields",
          "https://docs.clackamas.us/documents/drupal/86ef06a3-6ab5-4387-b273-90b0a45b7d70",
          "Published by Clackamas County Elections; reviewed September 21, 2026",
          "The pamphlet statement prints no website, email or phone. The filing’s Email Address and Web Site fields give this address and the Facebook short link; its phone fields are labelled work, home and cell rather than campaign, so none is listed.",
        ),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "brad-o-neil",
      channels: [
        { url: "https://www.oneilforsheriff.com/", label: "oneilforsheriff.com", kind: "website", from: "pamphlet" },
        { url: "mailto:brad@oneilforsheriff.com", label: "brad@oneilforsheriff.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/oneilforsheriff/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61592705333158", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.linkedin.com/in/brad-oneil/", label: "LinkedIn", kind: "social", from: "site" },
      ],
      sources: [pamphlet(16), site("O’Neil · home page footer", "https://www.oneilforsheriff.com/")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "james-rhodes",
      channels: [
        { url: "https://www.electsheriffrhodes.com/", label: "electsheriffrhodes.com", kind: "website", from: "pamphlet" },
        { url: "mailto:info@electsheriffrhodes.com", label: "info@electsheriffrhodes.com", kind: "email", from: "site" },
        { url: "tel:+15036733973", label: "(503) 673-3973", kind: "phone", from: "site" },
        { url: "https://www.electsheriffrhodes.com/getinvolved", label: "Volunteer form", kind: "form", from: "site" },
        { url: "https://www.instagram.com/electsheriffrhodes/", label: "Instagram", kind: "social", from: "site" },
        { url: "https://www.facebook.com/profile.php?id=61592582740159", label: "Facebook", kind: "social", from: "site" },
        { url: "https://www.youtube.com/channel/UCV_t_UfIJN8ivgrLLVA_bsw", label: "YouTube", kind: "social", from: "site" },
      ],
      sources: [pamphlet(16), site("Rhodes · get involved (form, email, phone, profiles)", "https://www.electsheriffrhodes.com/getinvolved")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "paul-savas",
      channels: [
        { url: "https://electpaulsavas.com/", label: "electpaulsavas.com", kind: "website", from: "pamphlet" },
        { url: "mailto:paul@electpaulsavas.com", label: "paul@electpaulsavas.com", kind: "email", from: "pamphlet" },
        { url: "tel:+15033121379", label: "503-312-1379", kind: "phone", from: "site" },
        { url: "https://www.facebook.com/electpaulsavas", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [
        pamphlet(17),
        site("Savas · home page footer (“Paul wants to hear from you!”)", "https://electpaulsavas.com/"),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "mark-shull",
      channels: [{ url: "mailto:markshullusa@mail.com", label: "markshullusa@mail.com", kind: "email", from: "filing" }],
      sources: [
        filing(
          "Shull · county candidate filing (SEL 101), contact fields",
          "https://docs.clackamas.us/documents/drupal/cd979d28-a5a7-4abc-9e7b-53049da4a439",
          "Published by Clackamas County Elections; reviewed September 21, 2026",
          "The pamphlet statement prints no website, email or phone, and no campaign site was found. The filing’s handwritten Email Address field reads “MARKSHULLUSA@mail.com”; its Web Site field is blank and its only phone is in the cell field, so none is listed.",
        ),
      ],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "diana-helm",
      channels: [
        { url: "https://www.votedianahelm.com/", label: "votedianahelm.com", kind: "website", from: "pamphlet" },
        { url: "mailto:campaign@votedianahelm.com", label: "campaign@votedianahelm.com", kind: "email", from: "site" },
        { url: "tel:+15035226305", label: "503-522-6305", kind: "phone", from: "site" },
        { url: "https://www.facebook.com/votedianahelm", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [pamphlet(18), site("Helm · home page footer", "https://www.votedianahelm.com/")],
      reviewedOn: REVIEWED_ON,
    },
    {
      candidateId: "r-w-smith",
      channels: [
        { url: "https://friendsofremysmith.org/", label: "friendsofremysmith.org", kind: "website", from: "pamphlet" },
        { url: "mailto:friendsofremysmith@gmail.com", label: "friendsofremysmith@gmail.com", kind: "email", from: "site" },
        { url: "https://www.instagram.com/rwsmith4clackamas/", label: "Instagram", kind: "social", from: "pamphlet" },
        { url: "https://www.facebook.com/profile.php?id=61577455397605", label: "Facebook", kind: "social", from: "site" },
      ],
      sources: [pamphlet(18), site("Smith · about page (“Say Hello!”)", "https://friendsofremysmith.org/about/")],
      reviewedOn: REVIEWED_ON,
    },
  ],

  roles: [
    { candidateId: "brad-o-neil", role: "Clackamas County undersheriff", from: "background" },
    { candidateId: "r-w-smith", role: "Environmental consultant", from: "background" },
    { candidateId: "mark-shull", role: "Former commissioner; retired officer", from: "background" },
    { candidateId: "diana-helm", role: "County commissioner; former Damascus mayor", from: "background" },
    { candidateId: "brian-t-nava", role: "Incumbent treasurer; former auditor", from: "background" },
    { candidateId: "paul-savas", role: "Incumbent county commissioner", from: "background" },
  ],

  primary: [
    { candidateId: "catherine-mcmullen", sourceUrl: `${PAMPHLET}#page=14` },
    { candidateId: "mark-reaksecker", sourceUrl: `${PAMPHLET}#page=14` },
    { candidateId: "brian-t-nava", sourceUrl: `${PAMPHLET}#page=15` },
    { candidateId: "brad-o-neil", sourceUrl: `${PAMPHLET}#page=16` },
    { candidateId: "james-rhodes", sourceUrl: `${PAMPHLET}#page=16` },
    { candidateId: "paul-savas", sourceUrl: `${PAMPHLET}#page=17` },
    { candidateId: "mark-shull", sourceUrl: `${PAMPHLET}#page=17` },
    { candidateId: "diana-helm", sourceUrl: `${PAMPHLET}#page=18` },
    { candidateId: "r-w-smith", sourceUrl: `${PAMPHLET}#page=18` },
  ],

  ballots: [
    { raceId: "clackamas-clerk", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-treasurer", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-sheriff", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-position-2", text: "You vote for one candidate.", source: electionsPage },
    { raceId: "clackamas-position-4", text: "You vote for one candidate.", source: electionsPage },
  ],

  /* County positions are elected at large; no district line. */
  districts: [],

  choice: [
    {
      raceId: "clackamas-clerk",
      text: "One case is continuity: professional administration and wider voter access. The other would replace machine tabulation with hand counting. The factual premise behind changing the counting system deserves scrutiny.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-treasurer",
      text: "One candidate is on the ballot. The question left is how safety, liquidity and return will be balanced, and which benchmarks and risk measures the office will publish.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-sheriff",
      text: "Both run on experience and careful spending. Compare an accountability-and-management case, with rural response times as its measured goal, against a list of operational priorities: traffic and impaired-driving enforcement, property-crime follow-up and fentanyl investigations.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-position-2",
      text: "Both oppose I-205 tolls and lead with affordability. One case rests on services and capital projects delivered inside the current budget; the other on limiting county government, cutting programs and resisting Metro mandates.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "clackamas-position-4",
      text: "Both would limit large data centers, one as a pause while the county writes rules, the other as outright opposition. Beyond that, compare faster permitting against independent fiscal review as the route to affordability.",
      from: "race.comparison",
      ...reviewed,
    },
  ],

  portraits: {
    "catherine-mcmullen": portrait("catherine-mcmullen", 14),
    "mark-reaksecker": portrait("mark-reaksecker", 14),
    "brian-t-nava": portrait("brian-t-nava", 15),
    "brad-o-neil": portrait("brad-o-neil", 16),
    "james-rhodes": portrait("james-rhodes", 16),
    "mark-shull": portrait("mark-shull", 17),
    "paul-savas": portrait("paul-savas", 17),
    "r-w-smith": portrait("r-w-smith", 18),
    "diana-helm": portrait("diana-helm", 18),
  },

  missing: {},
};
