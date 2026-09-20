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
const legreeEmail: Evidence = {
  label: "Legree · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#legree-2026-09-19",
  kind: "Candidate statement",
  date: "Received September 19, 2026",
  note: NOTE,
};
const leon = site("León · issue platform", "https://EstherForPortland.com");
const morilloPlatform = site("Morillo · platform", "https://www.angelitaforportland.com/platform");
const novick = site("Novick · second-term priorities", "https://NovickForPortland.com");
const phamHomelessness = site("Pham · Homelessness and recovery", "https://fightwithheartpdx.com/homelessness");
const phamEconomics = site("Pham · Tax base and spending", "https://fightwithheartpdx.com/economics");
const phamHousing = site("Pham · Housing construction", "https://fightwithheartpdx.com/housing");
const sollitt = site("Sollitt · platform and campaign case studies", "https://TomForPDX.com");
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
  entry("ali-beaudoin", "money", "LinkedIn announcement"),

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
  entry("cristal-otero", "housing", "pamphlet", {
    how: [
      "Would transition some publicly supported apartment buildings to resident ownership and management, for predictable costs on fixed incomes.",
      pamphlet(59),
    ],
  }),
  entry("cristal-otero", "safety", "pamphlet", {
    measure: [
      "Sets a concrete goal: end homelessness for people with intellectual disabilities and brain injuries through stable housing rather than repeated moves.",
      pamphlet(59),
    ],
  }),
  entry("cristal-otero", "money", "pamphlet", {
    measure: [
      "Would judge major projects and borrowing by what they cost Portlanders each month, and change course when evidence shows a policy failing.",
      pamphlet(59),
    ],
  }),
  entry("cristal-otero", "climate", "pamphlet"),

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
  entry("tom-sollitt", "housing", "campaign site"),
  entry("tom-sollitt", "safety", "campaign site"),
  entry("tom-sollitt", "money", "campaign site", {
    how: [
      "Would give the Auditor’s Office capacity to find waste independently, scrutinize contracts before any tax or fee increase, and share costs or transfer services to better-placed agencies.",
      sollitt,
    ],
  }),

  /* ── John Sweeney ─────────────────────────────────────────────────── */
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
  entry("martin-ward", "money", "campaign site", {
    how: [
      "Lists the cuts: the Burnside Bridge replacement, the Keller Auditorium project, the police oversight system, the Council structure, the Design Commission and Moda Center renovations.",
      wardBudget,
    ],
    measure: ["An estimated $1 billion to $1.5 billion of budget cuts.", pamphlet(55)],
  }),
];
