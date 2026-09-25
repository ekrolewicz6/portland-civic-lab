import type { Evidence } from "../../types";
import type { Delivery } from "../types";

/**
 * District 3: how each candidate says they would deliver, and how they would
 * measure it. Sourced; gaps stay gaps. One entry exists for every candidate ×
 * issue slot that has a documented position, so the page can show the gap
 * (and later "asked").
 *
 * Rules (research pass of September 20, 2026):
 * - `how` is a mechanism the candidate names: money, rule, staffing,
 *   sequencing or partnership. A broad goal ("more police", "a funding plan
 *   would be needed") never fills a rung.
 * - `measure` is a result, number, deadline or metric the candidate says
 *   would show it worked.
 * - Every rung cites the candidate's own venue: the same sources the brief
 *   already cites, plus pages of the candidate's own campaign site. Never
 *   third-party coverage.
 * - `from` records the venue used for the rungs (or, for an empty entry,
 *   the venue checked).
 *
 * Pages reviewed September 20, 2026 (beyond the evidence already cited):
 *   https://www.matthiashallett.com/ · /about · /contact · /press ·
 *   /press/matthias-hallett-endorses-safer-portland-initiative-calls-for-more-police-on-the-streets-to-restore-safety-and-accountability-in-portland ·
 *   /press/hallett-slams-dsa-and-peacock-caucus-for-turning-portlands-homeless-crisis-into-a-15-billion-grift-demands-forensic-audits-and-accountability-for-tax-dollars-funneled-to-political-allies ·
 *   /press/hallett-demands-good-faith-negotiations-to-keep-the-portland-trail-blazers-calls-out-angelita-morillo-and-dsa-socialists-for-bad-faith-tactics-risking-rip-city
 *   https://teachertiffanyforthepeople.com/
 *   https://www.cristalforportland.com/home · /your-priorities
 *   https://www.kellietorresforportland.com/about
 *   https://www.corcoranforportland.org · /priorities · /moda-center · /values
 *   https://patrickhilton4pdx.org · /take-action · /general-2 · /local-business-and-culture-preservation-and-curation
 *   https://www.angelitaforportland.com · /platform
 *   https://keir4pdx.com (headings only; /platform and /issues return 404)
 *   https://www.theprinceofpeace.net · /home/city-policy/economic-policies/homeless-relief ·
 *   /home/city-policy/economic-policies/affordable-housing · /home/city-policy/budget-cuts ·
 *   /home/city-policy/tax-cuts · /home/city-policy/other-policy ·
 *   /home/city-policy/economic-policies/lloyd-center-renewal-plan · /home/city-policy/police-reforms/other-police-reforms
 *   https://estherforportland.com/issues returned 404 (the platform lives on the home page).
 *   https://fightwithheartpdx.com/* pages are a JavaScript app; read in a browser.
 *   The pamphlet PDF was read as text (pages 53–60) and the McCormick filing as text.
 */

export type DeliveryVenue =
  | "campaign site"
  | "pamphlet"
  | "emailed response"
  | "candidate filing"
  | "Mercury questionnaire"
  | "LinkedIn announcement";

export type DeliveryEntry = Delivery & { from: DeliveryVenue };

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";
const REVIEWED = { reviewedBy: "pending", reviewedOn: "2026-09-20" } as const;
const SITE_DATE = "Website reviewed September 20, 2026";

const site = (label: string, url: string, date: string = SITE_DATE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note: NOTE,
});

const pamphlet = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 18, 2026",
  note: NOTE,
});

/* Sources reused from the briefs (URLs must match the published evidence). */
const hallettRevision = site("Hallett · Re-Vision platform", "https://www.matthiashallett.com/revision");
const hallettSafer = site(
  "Hallett · Safer Portland endorsement (press release, June 19, 2026)",
  "https://www.matthiashallett.com/press/matthias-hallett-endorses-safer-portland-initiative-calls-for-more-police-on-the-streets-to-restore-safety-and-accountability-in-portland",
);
const hallettAudit = site(
  "Hallett · homelessness spending press release (July 4, 2026)",
  "https://www.matthiashallett.com/press/hallett-slams-dsa-and-peacock-caucus-for-turning-portlands-homeless-crisis-into-a-15-billion-grift-demands-forensic-audits-and-accountability-for-tax-dollars-funneled-to-political-allies",
);
const hiltonAction = site("Hilton · Take action (housing)", "https://patrickhilton4pdx.org/take-action");
const koyamaLane = site("Koyama Lane · policy and track record", "https://teachertiffanyforthepeople.com/policy-track-record/");
const oteroEmail: Evidence = {
  label: "Otero · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#otero-2026-09-19",
  kind: "Candidate statement",
  date: "Received September 19, 2026",
  note: NOTE,
};
const oteroEmail2: Evidence = {
  label: "Otero · second emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#otero-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: NOTE,
};
const sollittEmail: Evidence = {
  label: "Sollitt · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#sollitt-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: NOTE,
};
const sweeneyEmail: Evidence = {
  label: "Sweeney · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#sweeney-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: NOTE,
};
const legreeEmail: Evidence = {
  label: "Legree · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#legree-2026-09-19",
  kind: "Candidate statement",
  date: "Received September 19, 2026",
  note: NOTE,
};
const beaudoinEmail: Evidence = {
  label: "Beaudoin · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#beaudoin-2026-09-23",
  kind: "Candidate statement",
  date: "Received September 23, 2026",
  note: NOTE,
};
const legreeEmail2: Evidence = {
  label: "Legree · second emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#legree-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: NOTE,
};
const leon = site("León · issue platform", "https://EstherForPortland.com");
const morilloPlatform = site("Morillo · platform", "https://www.angelitaforportland.com/platform");
const novick = site("Novick · second-term priorities", "https://NovickForPortland.com");
const phamHomelessness = site("Pham · Homelessness and recovery", "https://fightwithheartpdx.com/homelessness");
const phamEconomics = site("Pham · Tax base and spending", "https://fightwithheartpdx.com/economics");
const phamHousing = site("Pham · Housing construction", "https://fightwithheartpdx.com/housing");
const torres = site("Torres · priorities", "https://www.KellieTorresForPortland.com/priorities");
const wardHousing = site(
  "Ward · affordable housing policy",
  "https://www.theprinceofpeace.net/home/city-policy/economic-policies/affordable-housing",
);
const wardBudget = site("Ward · budget cuts", "https://www.theprinceofpeace.net/home/city-policy/budget-cuts");

const entry = (
  candidateId: string,
  issue: Delivery["issue"],
  from: DeliveryVenue,
  rungs: { how?: [string, Evidence]; measure?: [string, Evidence] } = {},
): DeliveryEntry => ({
  candidateId,
  issue,
  ...(rungs.how ? { how: { text: rungs.how[0], source: rungs.how[1] } } : {}),
  ...(rungs.measure ? { measure: { text: rungs.measure[0], source: rungs.measure[1] } } : {}),
  from,
  ...REVIEWED,
});

export const deliveriesD3: DeliveryEntry[] = [
  /* ── Ali Beaudoin ─────────────────────────────────────────────────── */
  // Housing, safety, climate and the money "how" come from his emailed reply of September 23, 2026.
  entry("ali-beaudoin", "housing", "emailed response", {
    how: [
      "Simplify permitting, cut unnecessary regulatory costs, reuse vacant or underused properties, and explore with the city and lenders temporary interest-rate help for first-time buyers while mortgage rates stay high.",
      beaudoinEmail,
    ],
  }),
  entry("ali-beaudoin", "safety", "emailed response"),
  entry("ali-beaudoin", "money", "emailed response", {
    how: [
      "Cut the commercial vacancy rate and bring businesses back downtown and to neighborhood corridors, growing the tax base without raising taxes, then reduce taxes and unnecessary fees as revenue improves.",
      beaudoinEmail,
    ],
  }),
  entry("ali-beaudoin", "climate", "emailed response"),

  /* ── Joel Corcoran ────────────────────────────────────────────────── */
  entry("joel-corcoran", "money", "pamphlet", {
    how: [
      "Would create independent Council legal and budget offices, hold monthly budget review sessions in place of unexpected mid-year adjustments, audit city contracts and set guidelines for work done in-house.",
      pamphlet(56),
    ],
  }),
  entry("joel-corcoran", "climate", "pamphlet"),

  /* ── Guy Frankenstein ─────────────────────────────────────────────── */
  entry("guy-frankenstein", "money", "Mercury questionnaire"),

  /* ── Matthias Hallett ─────────────────────────────────────────────── */
  entry("matthias-hallett", "housing", "pamphlet", {
    how: [
      "Would set strict permitting timelines with automatic escalation when a project stalls.",
      pamphlet(58),
    ],
  }),
  entry("matthias-hallett", "safety", "campaign site", {
    how: [
      "Backs the Safer Portland charter amendment: a minimum police staffing level funded by dedicating part of existing Clean Energy Fund revenue to recruitment and training, with no new taxes; would fund competitive pay.",
      hallettSafer,
    ],
    measure: [
      "Two sworn officers per 1,000 residents, against about 1.26 today.",
      hallettRevision,
    ],
  }),
  entry("matthias-hallett", "money", "campaign site", {
    how: [
      "Would order forensic audits of homelessness spending, with criminal investigations where evidence of waste or fraud exists, and right-size the business tax structure.",
      hallettAudit,
    ],
  }),

  /* ── Patrick Hilton ───────────────────────────────────────────────── */
  entry("patrick-hilton", "housing", "campaign site", {
    how: [
      "Would use existing federal grants to convert downtown commercial space to live-work homes, and put underused city street land into a land trust for lower-income ownership homes.",
      hiltonAction,
    ],
  }),
  entry("patrick-hilton", "safety", "campaign site", {
    how: [
      "Would create managed campgrounds as soon as possible, as an immediate option for getting people off the street.",
      hiltonAction,
    ],
  }),
  entry("patrick-hilton", "money", "pamphlet", {
    how: [
      "Names the money: taxes on polluters and vacant units, plus consultant spending redirected toward core services, the arts and neighborhood events.",
      pamphlet(57),
    ],
  }),

  /* ── Larry Kelly ──────────────────────────────────────────────────── */
  entry("larry-kelly", "housing", "pamphlet"),
  entry("larry-kelly", "safety", "pamphlet"),
  entry("larry-kelly", "money", "pamphlet"),

  /* ── Tiffany Koyama Lane ──────────────────────────────────────────── */
  entry("tiffany-koyama-lane", "housing", "campaign site", {
    how: [
      "Points to the Keep Portland Housed ordinance’s revolving loan and social housing fund, rent aid and eviction defense, and a city study of how social housing could be implemented.",
      koyamaLane,
    ],
  }),
  entry("tiffany-koyama-lane", "money", "campaign site", {
    how: [
      "Names income-threshold relief as the tool: a higher Arts Tax income threshold and low-income relief, including multi-family households, under the Transportation Utility Fee.",
      koyamaLane,
    ],
  }),
  entry("tiffany-koyama-lane", "climate", "campaign site", {
    how: [
      "Amended the Transportation Utility Fee ordinance so 25 percent of its funds go to Vision Zero safety and sidewalk projects; created a citywide Vision Zero position.",
      koyamaLane,
    ],
    measure: [
      "Says the yardstick is Vision Zero itself: eliminating traffic deaths and serious injuries.",
      koyamaLane,
    ],
  }),

  /* ── Kenneth (Kent) R Landgraver III ──────────────────────────────── */
  entry("kenneth-kent-r-landgraver-iii", "money", "pamphlet"),

  /* ── Keir Legree ──────────────────────────────────────────────────── */
  entry("keir-legree", "housing", "emailed response", {
    how: [
      "Would explore letting Clean Energy Fund money acquire, build or preserve affordable housing that meets strong energy-efficiency and carbon standards, and would buy existing apartment buildings when that is faster and cheaper than building.",
      legreeEmail2,
    ],
    measure: [
      "Would watch whether subsidized units are actually affordable to lower-income residents and whether existing vacant affordable units get occupied.",
      legreeEmail,
    ],
  }),
  entry("keir-legree", "safety", "emailed response", {
    how: [
      "Would expand shelter and mental-health and addiction treatment capacity, expect reasonable progress toward stability in exchange for publicly funded services, and seek state authorization for a one-year pause on cash bottle redemptions.",
      legreeEmail,
    ],
    measure: [
      "Says results should be measured by people moving from the street into shelter, treatment, housing and greater stability.",
      legreeEmail,
    ],
  }),
  entry("keir-legree", "money", "emailed response", {
    how: [
      "Stronger competitive bidding, independent cost estimates, tighter control of project scope and change orders, and a public-benefit test before major projects begin.",
      legreeEmail,
    ],
    measure: [
      "Would compare Portland’s infrastructure project costs with those of comparable cities.",
      legreeEmail,
    ],
  }),
  entry("keir-legree", "climate", "emailed response", {
    how: [
      "Would fund pedestrian and bicycle improvements where a safety or transportation need is demonstrated, and evaluate major projects for use, safety, cost and system impacts before building.",
      legreeEmail,
    ],
    measure: [
      "Fewer traffic deaths and serious injuries, with reasonable bus and car travel times and little diversion onto neighborhood streets; PBOT would publish before-and-after results for major redesigns and change projects that fall short.",
      legreeEmail2,
    ],
  }),

  /* ── Esther León ──────────────────────────────────────────────────── */
  entry("esther-leon", "housing", "campaign site", {
    how: [
      "A residential vacancy tax on corporate landlords would subsidize down payments for formerly unhoused tenants; a commercial vacancy tax on large corporations would fund small-business rent assistance; simplified zoning categories.",
      leon,
    ],
  }),
  entry("esther-leon", "safety", "campaign site", {
    how: [
      "Commits to introducing budget amendments and voting for full Street Response funding in every budget cycle, and to expanding the Police Bureau’s unarmed support specialists.",
      leon,
    ],
    measure: [
      "Says success would look like 24/7 citywide Street Response coverage and a falling number of lethally armed responses.",
      leon,
    ],
  }),
  entry("esther-leon", "money", "campaign site", {
    how: [
      "Would shift property tax toward a land-value tax, raise the annual impact fee on the ICE facility’s owner, fold the Arts Tax into other tax processes and audit city finances.",
      leon,
    ],
  }),
  entry("esther-leon", "climate", "campaign site", {
    how: [
      "Would raise the Clean Energy Fund surcharge for renewable projects, work with Metro on a regional TriMet funding mechanism, and expand the protected bike network on the 4th Avenue model.",
      leon,
    ],
  }),

  /* ── Darren McCormick ─────────────────────────────────────────────── */
  entry("darren-mccormick", "safety", "candidate filing"),

  /* ── Angelita Morillo ─────────────────────────────────────────────── */
  entry("angelita-morillo", "housing", "campaign site", {
    how: [
      "Points to a $17 million fund for the city to buy buildings and keep rents permanently low, and continued emergency rent help.",
      morilloPlatform,
    ],
  }),
  entry("angelita-morillo", "safety", "campaign site", {
    how: [
      "Moved over $2 million to hire unarmed crisis responders; would cut police overtime, audit police programs yearly, and merge crisis response and violence prevention into one team.",
      morilloPlatform,
    ],
    measure: [
      "Cites Street Response handling over 15,000 crisis calls last year with no police needed 94 percent of the time as the result to build on.",
      morilloPlatform,
    ],
  }),
  entry("angelita-morillo", "money", "campaign site"),
  entry("angelita-morillo", "climate", "campaign site", {
    how: [
      "Names a small fee on Uber and Lyft rides for potholes and streetlights, partnerships with other governments to keep transit funded, and blocking Zenith’s sale until safety is proven.",
      morilloPlatform,
    ],
  }),

  /* ── Steve Novick ─────────────────────────────────────────────────── */
  entry("steve-novick", "housing", "campaign site"),
  entry("steve-novick", "safety", "campaign site", {
    how: [
      "Would move 911 welfare-check calls from police to unarmed responders, and prioritize detectives as officers are added.",
      novick,
    ],
  }),
  entry("steve-novick", "money", "campaign site", {
    how: [
      "Would have Medicaid reimburse Street Response costs, and replace the Arts Tax possibly by folding it into the Children’s Levy; has returned Council office money to the city.",
      novick,
    ],
    measure: [
      "A Moda Center deal counts as fair only if the city gets at least as much money out as it puts in.",
      novick,
    ],
  }),
  entry("steve-novick", "climate", "campaign site", {
    how: [
      "Would use Clean Energy Fund money for transit and to pay part of the water filtration plant, offsetting water-rate increases.",
      novick,
    ],
  }),

  /* ── Cristal Otero ────────────────────────────────────────────────── */
  entry("cristal-otero", "housing", "emailed response", {
    how: [
      "Start with publicly owned or financed buildings whose residents want it; the co-op owns the property and carries the financing, residents buy a subsidized membership share, and City, County, Metro, Home Forward and State money shares the cost.",
      oteroEmail,
    ],
    measure: [
      "Roughly 5–20% of the Housing Bureau’s 19,000-plus regulated affordable units, about 950 to 3,800 homes, moved to limited-equity co-ops over time, with monthly costs affordable to income and no loss of housing assistance.",
      oteroEmail,
    ],
  }),
  // Safety, money and climate rungs come from her second emailed reply of September 22, 2026.
  entry("cristal-otero", "safety", "emailed response", {
    how: [
      "Street Response teams assigned to high-contact areas and stronger jail-release handoffs (peer support, transportation, dedicated shelter or treatment capacity), aimed at people repeatedly cycling through streets, shelters, ERs and jail, with hospitals, Health Share, the Sheriff and providers.",
      oteroEmail2,
    ],
    measure: [
      "Whether the people targeted spend fewer nights outside, cycle through jail and emergency rooms less often, and enter shelter, treatment and permanent housing at higher rates.",
      oteroEmail2,
    ],
  }),
  entry("cristal-otero", "money", "emailed response", {
    how: [
      "Scrutinize major water projects before costs are locked in, replace expensive borrowing with cheaper financing where available, pursue state and federal money, cut water loss, and review the fees and overhead the City charges the Water Bureau.",
      oteroEmail2,
    ],
    measure: [
      "A five-year goal: the inflation-adjusted cost of water service down at least 5%, with safe, reliable service and a yearly public account of the savings.",
      oteroEmail2,
    ],
  }),
  entry("cristal-otero", "climate", "emailed response", {
    how: [
      "Tie Clean Energy Fund project reporting to the city’s emissions goals, especially for transportation, and coordinate more clean-energy money with transit, biking and clean transportation to make them cheaper and easier to use.",
      oteroEmail2,
    ],
    measure: [
      "Measurable cuts in emissions, and what Portlanders experience in their transportation costs and choices.",
      oteroEmail2,
    ],
  }),

  /* ── Terry Parker ─────────────────────────────────────────────────── */
  entry("terry-parker", "safety", "pamphlet"),
  entry("terry-parker", "money", "pamphlet", {
    how: [
      "Would apply Comprehensive Plan Policy 8.28, sharing facility costs among those who benefit, and fund maintenance before new construction.",
      pamphlet(55),
    ],
  }),
  entry("terry-parker", "climate", "pamphlet"),

  /* ── Heart Free Pham ──────────────────────────────────────────────── */
  entry("heart-free-pham", "housing", "campaign site", {
    measure: [
      "Says the payoff would be homes built up to 80 percent faster than stick framing and heating and cooling costs up to 70 percent lower.",
      phamHousing,
    ],
  }),
  entry("heart-free-pham", "safety", "campaign site", {
    how: [
      "Would modernize civil commitment, create wellness farms with job training, attach consequences to refusing available services, and build treatment capacity before removing accountability.",
      phamHomelessness,
    ],
    measure: [
      "Would require pre-committed public metrics for any new homelessness policy; cites the county’s unsheltered count, nearly 9,000 and rising, as evidence the current strategy is failing.",
      phamHomelessness,
    ],
  }),
  entry("heart-free-pham", "money", "campaign site", {
    how: [
      "Would require cost-benefit accounting before any tax increase or program expansion.",
      phamEconomics,
    ],
  }),

  /* ── Tom Sollitt ──────────────────────────────────────────────────── */
  entry("tom-sollitt", "housing", "emailed response", {
    how: [
      "Use existing Housing Bureau staff; press Metro, the County, Home Forward, state, federal and private partners to share costs; a fiscal scorecard for major investments; targeted zoning and permitting fixes brought to Council.",
      sollittEmail,
    ],
    measure: [
      "Units preserved or created and occupied, time from completion to occupancy, City money per unit, outside dollars leveraged, permitting time, and actual versus projected cost and schedule.",
      sollittEmail,
    ],
  }),
  entry("tom-sollitt", "safety", "emailed response", {
    how: [
      "Within the first year, a response-allocation plan naming which calls go to police, Fire/EMS, Street Response, CHAT or County services, with the staffing, support and cost each requires; closer County work on follow-up care.",
      sollittEmail,
    ],
    measure: [
      "Response times, whether the right resource was sent, calls resolved in the field, connections to follow-up care, repeat calls, vacancies and turnover, and the cost of each response.",
      sollittEmail,
    ],
  }),
  entry("tom-sollitt", "money", "emailed response", {
    how: [
      "A budget amendment in his first budget restoring the Auditor’s performance-audit capacity reduced during the City’s financial crisis, aimed at high-risk contracts, programs and operations, with a quarterly public accounting of recommendations and results.",
      sollittEmail,
    ],
    measure: [
      "First-year benchmark: the lost audit capacity restored and a public process showing what happens to the Auditor’s findings; no fixed savings target, with savings and avoided costs reported quarterly.",
      sollittEmail,
    ],
  }),
  entry("tom-sollitt", "climate", "emailed response", {
    how: [
      "Within the first year, a regional transportation framework setting shared priorities, responsibilities, funding and measurable results, and work with the Clean Energy Fund committee on whether voter-approved climate money can go further toward transportation and air quality.",
      sollittEmail,
    ],
    measure: [
      "Street condition, transit reliability, traffic safety, air quality, user satisfaction, outside funding leveraged, and actual versus projected cost and schedule.",
      sollittEmail,
    ],
  }),

  /* ── John Sweeney ─────────────────────────────────────────────────── */
  entry("john-sweeney", "housing", "emailed response", {
    how: [
      "Start from the incomes of the people to be housed and what they can afford, then build to that price with low-cost designs such as Quonset-style houses.",
      sweeneyEmail,
    ],
  }),
  entry("john-sweeney", "safety", "pamphlet", {
    how: [
      "Would have the cities and Metro take back a third of the money given to Multnomah County, then leave homeless services to the County under the 1983 arrangement.",
      pamphlet(53),
    ],
  }),
  entry("john-sweeney", "money", "pamphlet"),

  /* ── Kellie Torres ────────────────────────────────────────────────── */
  entry("kellie-torres", "housing", "campaign site", {
    measure: ["Housing built at the rate of 4,000 units a year.", torres],
  }),
  entry("kellie-torres", "safety", "campaign site", {
    measure: [
      "Says the results to watch are emergency response times and whether police follow through on investigations.",
      torres,
    ],
  }),
  entry("kellie-torres", "money", "campaign site", {
    how: [
      "Would leverage philanthropic investment, sponsorships, volunteerism and private expertise to stretch taxpayer dollars, with performance measures and regular public reporting.",
      torres,
    ],
  }),
  entry("kellie-torres", "climate", "campaign site"),

  /* ── Kimberly Tucker ──────────────────────────────────────────────── */
  entry("kimberly-tucker", "safety", "campaign site"),
  entry("kimberly-tucker", "money", "Mercury questionnaire"),

  /* ── Martin Ward ──────────────────────────────────────────────────── */
  entry("martin-ward", "housing", "campaign site", {
    how: [
      "Would have the city buy apartment buildings gradually, starting with buildings housing low-income residents and making further purchases only after rents are shown to fall.",
      wardHousing,
    ],
    measure: [
      "Rents around 30 to 40 percent lower in government-owned buildings, and about $600 million of permanent shelter for all homeless residents.",
      pamphlet(55),
    ],
  }),
  entry("martin-ward", "safety", "pamphlet"),
  entry("martin-ward", "money", "campaign site", {
    how: [
      "Lists the cuts: the Burnside Bridge replacement, the Keller Auditorium project, the police oversight system, the Council structure, the Design Commission and Moda Center renovations.",
      wardBudget,
    ],
    measure: ["An estimated $1 billion to $1.5 billion of budget cuts.", pamphlet(55)],
  }),
];
