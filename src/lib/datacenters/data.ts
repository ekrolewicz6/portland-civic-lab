/**
 * Data for the Oregon data centers deep-dive.
 *
 * Original sources assembled August 2026; selected primary claims rechecked September 29, 2026. Time-sensitive items to re-check:
 * - The Kotek Data Center Advisory Committee report (expected before the end of 2026)
 * - The 1000 Friends / OEA lawsuit against Hillsboro & Washington County (filed June 24, 2026)
 * - The HB 4084 enterprise-zone moratorium (runs until 90 days after the 2027 session adjourns)
 * - Pacific Power's data-center rate investigation at the PUC (opened spring 2026)
 * - PGE's implemented rate split (+29.7% data centers / −1.3% residential) as later rate cases land
 */

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  kind: "primary" | "news" | "analysis";
}

export const SOURCES = {
  klccCheapDate: {
    id: "klccCheapDate",
    title: "Oregon governor says state is a 'cheap date' for data centers",
    org: "KLCC",
    url: "https://www.klcc.org/economy-business/2026-07-03/oregon-governor-says-state-is-a-cheap-date-for-data-centers",
    kind: "news",
  },
  dwtMoratorium: {
    id: "dwtMoratorium",
    title: "New Oregon law bars new data centers from enterprise-zone tax breaks (HB 4084)",
    org: "Davis Wright Tremaine",
    url: "https://www.dwt.com/blogs/energy--environmental-law-blog/2026/06/oregon-data-center-tax-break-moratorium",
    kind: "analysis",
  },
  opbEzCut: {
    id: "opbEzCut",
    title: "Data centers are cut, for now, from a bill expanding Oregon tax breaks",
    org: "OPB",
    url: "https://www.opb.org/article/2026/03/02/data-centers-cut-bill-expanding-oregon-tax-breaks/",
    kind: "news",
  },
  ocppBoom: {
    id: "ocppBoom",
    title: "“We've been very foolish”: inside Oregon's data center boom",
    org: "Oregon Center for Public Policy",
    url: "https://www.ocpp.org/2026/03/12/oregons-data-center-boom/",
    kind: "analysis",
  },
  governingStudy: {
    id: "governingStudy",
    title: "Oregon's own incentive study: what data center tax breaks return",
    org: "Governing",
    url: "https://www.governing.com/finance/oregon-tax-breaks-to-big-tech-not-always-beneficial",
    kind: "analysis",
  },
  capitalChronicleLawsuit: {
    id: "capitalChronicleLawsuit",
    title: "Politicians, teachers union sue Hillsboro, Washington County over data center tax breaks",
    org: "Oregon Capital Chronicle",
    url: "https://oregoncapitalchronicle.com/2026/06/24/politicians-teachers-union-sue-hillsboro-washington-county-over-tax-breaks-to-data-centers/",
    kind: "news",
  },
  bakerCityAbatement: {
    id: "bakerCityAbatement",
    title: "Morrow County approves $1 billion in tax breaks for Amazon data centers",
    org: "Baker City Herald",
    url: "https://bakercityherald.com/2023/05/11/morrow-county-approves-1-billion-in-tax-breaks-for-amazon-data-centers/",
    kind: "news",
  },
  eastOregonianLeaders: {
    id: "eastOregonianLeaders",
    title: "Eastern Oregon leaders praise data centers, look to future",
    org: "East Oregonian",
    url: "https://eastoregonian.com/2025/05/30/local-leaders-praise-data-centers-look-to-future/",
    kind: "news",
  },
  opbPowerAct: {
    id: "opbPowerAct",
    title: "Oregon Legislature passes 'POWER Act,' targeting industrial energy users like data centers",
    org: "OPB",
    url: "https://www.opb.org/article/2025/06/05/oregon-data-centers-cryptocurrency-business-environment-power-electricity/",
    kind: "news",
  },
  oecGuardrails: {
    id: "oecGuardrails",
    title: "New PUC rules protect Oregonians from data center-caused rate increases",
    org: "Oregon Environmental Council",
    url: "https://oeconline.org/pge-guardrails-press-release/",
    kind: "primary",
  },
  tomsHardwareRates: {
    id: "tomsHardwareRates",
    title: "PGE data center bills rise 30%, residential rates fall 1.3% under POWER Act",
    org: "Tom's Hardware",
    url: "https://www.tomshardware.com/tech-industry/data-centers/power-company-hikes-data-center-bills-by-30-percent-cuts-residential-electricity-costs-by-1-3-percent-oregon-approves-change-through-power-act-pushes-developments-using-more-than-20-megawatts-of-power-to-pay-their-fair-share",
    kind: "news",
  },
  governingUec: {
    id: "governingUec",
    title: "Oregon's rural power utility has become a big polluter",
    org: "Governing",
    url: "https://www.governing.com/resilience/oregons-rural-power-utility-has-become-a-big-polluter",
    kind: "analysis",
  },
  capitalChronicleGas: {
    id: "capitalChronicleGas",
    title: "Data centers are driving demand for gas from Northwest utilities, reports find",
    org: "Oregon Capital Chronicle",
    url: "https://oregoncapitalchronicle.com/2026/06/04/data-centers-are-driving-demand-for-gas-from-northwest-utilities-reports-find/",
    kind: "news",
  },
  registerWater: {
    id: "registerWater",
    title: "Google's The Dalles water use revealed after city drops records suit",
    org: "The Register",
    url: "https://www.theregister.com/2022/12/19/google_datacenters_dalles/",
    kind: "news",
  },
  waterWatch: {
    id: "waterWatch",
    title: "Data centers are hogging The Dalles' water",
    org: "WaterWatch of Oregon",
    url: "https://waterwatch.org/data-centers-are-hogging-this-towns-water/",
    kind: "analysis",
  },
  rollingStoneWater: {
    id: "rollingStoneWater",
    title: "How Oregon's data center boom is supercharging a water crisis",
    org: "Rolling Stone",
    url: "https://www.rollingstone.com/culture/culture-features/data-center-water-pollution-amazon-oregon-1235466613/",
    kind: "news",
  },
  fortuneStudy: {
    id: "fortuneStudy",
    title: "Data centers boost jobs 4% in cities; rural economies barely feel a dent (Georgia Tech study)",
    org: "Fortune",
    url: "https://fortune.com/2026/07/14/data-centers-urban-rural-jobs-study/",
    kind: "analysis",
  },
  advisoryCommittee: {
    id: "advisoryCommittee",
    title: "Oregon Data Center Advisory Committee",
    org: "Oregon Dept. of Energy",
    url: "https://www.oregon.gov/energy/get-involved/pages/oregon-data-center-advisory-committee.aspx",
    kind: "primary",
  },
  lincolnAcres: {
    id: "lincolnAcres",
    title: "Oregon communities envision 9,100 acres for new data centers",
    org: "Lincoln Chronicle",
    url: "https://lincolnchronicle.org/oregon-communities-envision-9100-acres-for-new-data-centers-quadrupling-the-industrys-footprint/",
    kind: "news",
  },
  cubWhyOregon: {
    id: "cubWhyOregon",
    title: "Why is Oregon a hot spot for data centers?",
    org: "Oregon Citizens' Utility Board",
    url: "https://oregoncub.org/news/blog/why-is-oregon-a-hot-spot-for-data-centers/3277/",
    kind: "analysis",
  },
  dcacCharge: {
    id: "dcacCharge",
    title: "Data Center Advisory Committee charge from the Governor",
    org: "Governor's Office / ODOE",
    url: "https://www.oregon.gov/energy/get-involved/Documents/Data-Center-Advisory-Committee-Charge.pdf",
    kind: "primary",
  },
  dcacIncentives: {
    id: "dcacIncentives",
    title: "Session 5 facilitator summary — affordability, revenue & incentives",
    org: "DCAC (June 26, 2026)",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-06-26-DCAC-Facilitator-Meeting-Summary.pdf",
    kind: "primary",
  },
  businessOregonRoi: {
    id: "businessOregonRoi",
    title: "Data center incentive programs: investment, abatement & return",
    org: "Business Oregon",
    url: "https://www.oregon.gov/energy/get-involved/Documents/08-Alex-Albertine-Michael-Held-DCAC.pdf",
    kind: "primary",
  },
  morrowAssessor: {
    id: "morrowAssessor",
    title: "County assessor data on exempt value and in-lieu payments",
    org: "Morrow County Assessor",
    url: "https://www.oregon.gov/energy/get-involved/Documents/09-Mike-Gorman-DCAC.pdf",
    kind: "primary",
  },
  taxFairness: {
    id: "taxFairness",
    title: "The four stacked subsidies, and what to end in 2027",
    org: "Tax Fairness Oregon",
    url: "https://www.oregon.gov/energy/get-involved/Documents/11-Jody-Wiser-DCAC.pdf",
    kind: "primary",
  },
  econw: {
    id: "econw",
    title: "Understanding Oregon's data center industry (preliminary findings)",
    org: "ECONorthwest",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-07-31-ECONW-Understanding-Data-Center-Industry.pdf",
    kind: "analysis",
  },
  odeSchoolFunding: {
    id: "odeSchoolFunding",
    title: "How property tax abatements move through school funding",
    org: "Oregon Dept. of Education",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-07-31-OR-Dept-Education-Revenue-Impact-Presentation.pdf",
    kind: "primary",
  },
  deqAir: {
    id: "deqAir",
    title: "Air-quality permitting: data center backup generators",
    org: "Oregon DEQ",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-07-31-Oregon-DEQ-Air-Quality-Permitting-Presentation.pdf",
    kind: "primary",
  },
  dlcdLandUse: {
    id: "dlcdLandUse",
    title: "Data centers and Oregon's land-use system",
    org: "Dept. of Land Conservation & Development",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-04-24-1-Leigh-McIlvaine-DLCD-DCAC-LandUse.pdf",
    kind: "primary",
  },
  dcacWater: {
    id: "dcacWater",
    title: "Session 2 facilitator summary — water resources",
    org: "DCAC (March 27, 2026)",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-03-27-DCAC-Facilitators-Summary.pdf",
    kind: "primary",
  },
  awsWater: {
    id: "awsWater",
    title: "AWS water use and community water investment in Oregon",
    org: "Amazon Web Services",
    url: "https://www.oregon.gov/energy/get-involved/Documents/2026-03-27-Schilz-Amazon.pdf",
    kind: "primary",
  },
  harpelIncentives: {
    id: "harpelIncentives",
    title: "What other states do with data center incentives",
    org: "Smart Incentives",
    url: "https://www.oregon.gov/energy/get-involved/Documents/13-Ellen-Harpel-DCAC.pdf",
    kind: "analysis",
  },
  govCommittee: {
    id: "govCommittee",
    title: "Governor Kotek convenes statewide Data Center Advisory Committee",
    org: "Governor's Office",
    url: "https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-convenes-statewide-data-center-advisory-committee",
    kind: "primary",
  },
  salemWithdrawal: {
    id: "salemWithdrawal",
    title: "Governor Kotek directs state to withdraw land for proposed Salem data center site",
    org: "Governor's Office",
    url: "https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-directs-state-to-withdraw-land-for-proposed-salem-data-center-site",
    kind: "primary",
  },
  impactStudy: {"id":"impactStudy","title":"Property Tax Incentives Impact Study (February 2022), sections 6 and 9","org":"Applied Economics / Business Oregon","url":"https://www.oregon.gov/biz/Publications/Property_Tax_Incentivies_Impact_Study.pdf","kind":"primary"},
  pucImplementation: {"id":"pucImplementation","title":"POWER Act implementation, June 26, 2026","org":"Oregon PUC","url":"https://www.oregon.gov/energy/get-involved/Documents/01-Nolan-Moser-Bret-Stevens-DCAC.pdf","kind":"primary"},
  pgeRates: {"id":"pgeRates","title":"2026 second-quarter filing: July 8 rate implementation","org":"PGE / SEC","url":"https://www.sec.gov/Archives/edgar/data/784977/000119312526326379/por-20260630.htm","kind":"primary"},
  preliminary: {"id":"preliminary","title":"Preliminary Learnings and Questions, September 10, 2026","org":"Data Center Advisory Committee","url":"https://www.oregon.gov/energy/get-involved/Documents/2026-09-10-DCAC-Preliminary-Learnings.pdf","kind":"primary"},
  hillsboroResponse: {"id":"hillsboroResponse","title":"Data centers in Hillsboro: the city's account","org":"City of Hillsboro","url":"https://www.hillsboro-oregon.gov/Home/Components/News/News/17404/","kind":"primary"},
  wascoAgreement: {"id":"wascoAgreement","title":"2021 Design LLC SIP agreement, definitions and Exhibit A (copy hosted by OPB)","org":"The Dalles / Wasco County","url":"https://www.opb.org/pdf/AGR%202021%20Wasco%20County%20City%20of%20The%20Dalles%20SIP%20for%20Google%20Design%20LLC_1769200135514.pdf","kind":"primary"},
  morrowMinutes: {"id":"morrowMinutes","title":"April 5, 2023 SIP approval minutes, page 6","org":"Morrow County","url":"https://www.morrowcountyor.gov/sites/default/files/fileattachments/board_of_commissioners/meeting/16576/4-5-23_board_minutes_9-00_am.pdf","kind":"primary"},
  audit2016: {"id":"audit2016","title":"2016 audit comparison, as reported in February 2023","org":"Governing / The Oregonian","url":"https://www.governing.com/finance/oregon-tax-breaks-to-big-tech-not-always-beneficial","kind":"news"},
  hillsboroMoratorium: {"id":"hillsboroMoratorium","title":"July 27, 2026 land-use moratorium announcement","org":"City of Hillsboro","url":"https://www.hillsboro-oregon.gov/Home/Components/News/News/17551/","kind":"primary"},
  uecPresentation: {"id":"uecPresentation","title":"Consumer-owned utility perspective, June 26, 2026","org":"Umatilla Electric Cooperative","url":"https://www.oregon.gov/energy/get-involved/Documents/03-Robert-Echenrode-DCAC.pdf","kind":"primary"},
  tribalStatement: {"id":"tribalStatement","title":"Statement of Trustee Lisa Ganuelas, May 29, 2026","org":"CTUIR","url":"https://www.oregon.gov/energy/get-involved/Documents/11-Trustee-Lisa-Ganuelas-CTUIR-DCAC-05-29-2026.pdf","kind":"primary"},
} as const satisfies Record<string, Source>;

/** Updated editorial review date; historical observations retain their own dates. */
export const REVIEWED = "September 29, 2026";
export const RATE_SHIFT = [
  { who: "PGE data-center customer class", changePct: 29.7, detail: "Average rate change effective July 8, 2026; contract and cost-allocation protections apply in PGE territory." },
  { who: "PGE residential customers", changePct: -1.3, detail: "Average change from this tariff action, not a promise about future bills or all Oregon utilities." },
];

export type ConditionStatus = "partial" | "unproven";
export interface WinWinCondition {
  condition: string; status: ConditionStatus; evidence: string;
  authority: string; requirement: string; reporting: string; enforcement: string;
  sourceId: keyof typeof SOURCES;
}
/** Editorial standards for a proposal. Requirements below are recommendations, not current law. */
export const WIN_WIN_CONDITIONS: WinWinCondition[] = [
  {
    condition: "Electricity customers are protected from project costs and closure risk",
    status: "partial",
    evidence: "PGE has implemented dedicated tariffs and contract protections. Other utility proceedings and consumer-owned utility contracts require separate review.",
    authority: "PUC for investor-owned utilities; governing boards for consumer-owned utilities.",
    requirement: "Independent cost allocation, capacity commitments, collateral and an enforceable exit payment before connection.",
    reporting: "Annual project cost recovery and contract compliance, with public explanations of any confidentiality limits.",
    enforcement: "Collect collateral and exit charges; require a cure before further capacity is connected, within applicable authority.",
    sourceId: "pucImplementation",
  },
  {
    condition: "New power demand has a credible clean-energy and reliability plan",
    status: "partial",
    evidence: "PGE's connection test addresses HB 2021 compliance. It does not establish hourly clean supply or equivalent obligations for every Oregon utility.",
    authority: "PUC, utilities and lawmakers where additional authority is needed.",
    requirement: "Identify additional supply, its delivery date, transmission, emissions accounting and curtailment obligations.",
    reporting: "Annual emissions and delivery progress, plus seasonal reliability and hourly matching where claimed.",
    enforcement: "Condition connection or expansion on verified supply and apply contractual remedies for missed commitments.",
    sourceId: "pucImplementation",
  },
  {
    condition: "Water and local environmental limits are measurable",
    status: "unproven",
    evidence: "The committee's preliminary report identifies water information and cumulative impacts as continuing policy questions. A statewide pass cannot be inferred from individual efficiency claims.",
    authority: "Water Resources Department, DEQ, local water suppliers and land-use authorities; tribal consultation where applicable.",
    requirement: "Set site-specific seasonal withdrawal and consumption limits, drought triggers, water-quality limits, noise controls and backup-generator conditions.",
    reporting: "Monthly withdrawal, consumption, discharge and source data; peak-season availability and generator operating hours.",
    enforcement: "Use permit or contract remedies, corrective-action deadlines and curtailment triggers, with due process.",
    sourceId: "preliminary",
  },
  {
    condition: "The incentive has a positive, attributable fiscal case",
    status: "unproven",
    evidence: "Existing impact studies do not establish each project's build-without-incentive probability or full net fiscal return.",
    authority: "Zone sponsors, county assessors, Business Oregon and the bodies approving each program.",
    requirement: "Publish local and statewide cash flows, alternative land uses, valuation schedules, construction receipts and plausible build probabilities.",
    reporting: "Annual receipts, costs and performance against the approved agreement; independent review before renewal.",
    enforcement: "Tie lawful clawbacks, repayment or expiry to explicit investment and employment commitments.",
    sourceId: "impactStudy",
  },
  {
    condition: "Schools and public services can absorb the fiscal effects",
    status: "unproven",
    evidence: "School equalization spreads many operating-revenue changes statewide. Local-option levies, bonds and districts above formula funding need separate treatment.",
    authority: "ODE, school districts, taxing districts, sponsors and the Legislature.",
    requirement: "Identify affected budgets and fund incremental service costs without counting the same payment twice.",
    reporting: "Annual district-level and statewide operating impacts, with capital-bond effects shown separately.",
    enforcement: "Use enforceable make-whole provisions or adjust the incentive where the program permits.",
    sourceId: "odeSchoolFunding",
  },
  {
    condition: "The public can inspect the deal and hold decision-makers accountable",
    status: "unproven",
    evidence: "The Hillsboro dispute concerns allegations, not a finding that all Oregon approvals were unlawful. The appropriate procedure depends on the program.",
    authority: "The responsible sponsor or governing body, public-records officers and reviewing courts.",
    requirement: "Publish terms, analysis, conflicts disclosures and required notices before decisions; use a public vote where required or lawfully adopted.",
    reporting: "An accessible agreement, minutes, compliance reports and a record of changes, with specific reasons for lawful redactions.",
    enforcement: "Require procedural defects to be addressed through the applicable administrative or judicial process.",
    sourceId: "hillsboroResponse",
  },
];

export const COMMITTEE = {
  reportDue: "before the end of 2026 (September preliminary report)",
  email: "datacenter.ac@oregon.gov",
  commentDeadline: "5 p.m. October 24, 2026",
  members: [
    { name: "Margaret Hoffman", role: "Northwest Power and Conservation Council", coChair: true },
    { name: "Michael Jung", role: "Energy and climate policy professional", coChair: true },
    { name: "Dan Dorran", role: "Umatilla County Commission chair", coChair: false },
    { name: "Greg Dotson", role: "University of Oregon law professor", coChair: false },
    { name: "Bill Edmonds", role: "University of Portland adjunct professor", coChair: false },
    { name: "Tim Miller", role: "Oregon Business for Climate director", coChair: false },
    { name: "Jean Wilson", role: "Sandbrook Capital operating partner", coChair: false },
  ],
  charge: [
    "Assess siting and economic development, including rural communities",
    "Consider climate, energy and natural-resource effects",
    "Protect other customers while ensuring reliable electricity",
    "Address water supply and cooling demand",
    "Recommend an Oregon policy framework",
  ],
  schedule: [
    { date: "Feb–Jun 2026", topic: "Economic development, water, land use, energy and incentives" },
    { date: "Jul 31 & Aug 4", topic: "Additional evidence and deliberations" },
    { date: "Sep 10, 2026", topic: "Preliminary learnings released; written comment period opened" },
    { date: "Oct 24, 2026", topic: "Written comments close at 5 p.m.; check ODOE for updates" },
  ],
} as const;

export const WHATS_NEXT = [
  { when: "October 24, 2026", what: "Written comments close", why: "Use the form linked from ODOE's committee page. Address the preliminary questions and identify the place or agreement your evidence concerns." },
  { when: "2027 Legislature", what: "Standard-zone restrictions return for debate", why: "The authorization pause runs until 90 days after the 2027 session adjourns. Other incentive programs need their own policy decisions." },
  { when: "Utility proceedings", what: "Check the utility serving the site", why: "The June PUC schedule anticipated a PacifiCorp order in October and compliance filing in November. Verify the docket before treating those milestones as completed." },
];

export interface Region {
  id: string; name: string; towns: string; x: number; y: number;
  question: string; evidenceNeeded: string; sourceId: keyof typeof SOURCES;
}
/** Geographic prompts, never estimated probabilities or project approvals. */
export const REGIONS: Region[] = [
  { id: "hillsboro", name: "Hillsboro / Washington County", towns: "Hillsboro", x: 78, y: 78,
    question: "How much incentive is needed for a site with established connectivity and customers?",
    evidenceNeeded: "Comparable unsubsidized projects, the actual application, utility capacity and alternative industrial uses. Connectivity alone does not quantify bargaining power.",
    sourceId: "hillsboroResponse" },
  { id: "gorge", name: "The Dalles / Columbia Gorge", towns: "The Dalles", x: 148, y: 72,
    question: "Which water source and payment formula does this expansion actually use?",
    evidenceNeeded: "Seasonal water balances and the signed agreement. The 2021 SIP uses payment floors and shares of hypothetical taxes, not a single generic annual fee.",
    sourceId: "wascoAgreement" },
  { id: "columbia-east", name: "Columbia River East", towns: "Boardman", x: 262, y: 62,
    question: "How do receipts, service costs and utility protections compare with the alternatives?",
    evidenceNeeded: "Project-specific contract terms, generation purchases, water-quality constraints and evidence of credible competing sites.",
    sourceId: "morrowAssessor" },
  { id: "central", name: "Central Oregon", towns: "Prineville", x: 196, y: 150,
    question: "Does an expansion need the same incentive as the original campus?",
    evidenceNeeded: "Expansion-specific cost and location evidence, water rights and the serving utility's current tariff.",
    sourceId: "preliminary" },
  { id: "willamette", name: "Willamette Valley", towns: "Salem", x: 72, y: 128,
    question: "What alternative use of the parcel and infrastructure would be displaced?",
    evidenceNeeded: "A site-level comparison of industrial, agricultural or other lawful uses. A decision on one state-owned parcel cannot establish a verdict for the entire valley.",
    sourceId: "salemWithdrawal" },
  { id: "southeast", name: "South & Southeast Oregon", towns: "Burns", x: 300, y: 215,
    question: "Can the proposed location demonstrate deliverable power, connectivity and water?",
    evidenceNeeded: "Utility studies, connection costs, fiber access and basin-specific availability before any feasibility claim.",
    sourceId: "preliminary" },
];

export const fmtNum = (n: number) => n.toLocaleString("en-US");
