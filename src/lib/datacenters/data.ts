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
  { who: "Data centers served by PGE", changePct: 29.7, detail: "The new rates raised this group’s average electricity rate by 29.7% on July 8, 2026. The rules also use contracts to help keep data-center costs from falling on other PGE customers." },
  { who: "PGE residential customers", changePct: -1.3, detail: "This change lowered PGE’s average residential rate by 1.3%. A household’s bill still depends on how much electricity it uses and any other rate changes. These figures do not apply to every Oregon utility." },
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
    evidence: "PGE has introduced separate data-center rates and contracts intended to protect other customers. Other power companies have different rules and agreements that need their own review.",
    authority: "The Oregon Public Utility Commission regulates companies owned by investors. Utilities owned by their customers or local governments answer to their own governing boards.",
    requirement: "Before connecting a project, have an independent reviewer check which electricity costs it creates and who will pay them. Require commitments about power use and financial security, such as a deposit, to cover unpaid costs if the project closes.",
    reporting: "Report each year whether project payments cover its costs and whether the company follows its contract. Explain any limits on what information can legally be shared.",
    enforcement: "Use the agreed financial security and closure charges to cover unpaid costs. Where the law allows, require the company to fix a violation before receiving more electricity.",
    sourceId: "pucImplementation",
  },
  {
    condition: "New power demand has a credible clean-energy and reliability plan",
    status: "partial",
    evidence: "PGE checks whether a new connection can meet Oregon’s clean-electricity requirements under House Bill 2021. That check does not show that clean power will be available every hour or that other utilities face the same requirements.",
    authority: "The Oregon Public Utility Commission and power companies oversee electricity service. Lawmakers may need to grant additional powers for new requirements.",
    requirement: "Identify the new electricity sources, when they will be ready, and which power lines will carry the electricity. Explain the resulting emissions and when the data center must reduce its power use to protect the system.",
    reporting: "Report emissions and progress on promised electricity supplies each year. Show whether enough power will be available during seasonal peaks. If a company claims clean power every hour, provide hourly evidence.",
    enforcement: "Require proof that the promised electricity supply is ready before allowing a connection or expansion. State in the contract what happens if the company misses a commitment.",
    sourceId: "pucImplementation",
  },
  {
    condition: "Water and local environmental limits are measurable",
    status: "unproven",
    evidence: "The committee still has questions about water use and the combined effects of several facilities in the same area. One company’s claim that it uses water efficiently cannot answer those questions for the whole state.",
    authority: "The Oregon Water Resources Department, Department of Environmental Quality, local water suppliers and officials who approve development each have a role. Formal consultation with tribal governments may also be needed.",
    requirement: "Set limits on how much water each site takes and uses up in each season. Specify when drought restrictions begin, along with water-quality standards, noise limits and rules for backup generators.",
    reporting: "Report the source of the water and the amounts taken, used up and returned each month. Include water availability during the driest months and the hours that backup generators run.",
    enforcement: "State how violations must be fixed, the deadlines for doing so, and when water or electricity use must be reduced. Enforce those terms through permits and contracts, following the required legal process.",
    sourceId: "preliminary",
  },
  {
    condition: "The tax break brings in more public money than it costs",
    status: "unproven",
    evidence: "Existing studies do not tell us how likely each project is to be built without a tax break. They also do not count every public payment and cost needed to judge a project’s financial benefit.",
    authority: "The local governments offering the tax break, county officials who assess property values, Business Oregon and the other bodies that approve the program.",
    requirement: "Publish the expected taxes, fees and public costs for both local governments and the state. Show how property values may change, what construction adds, and how likely the project is with and without a tax break. Compare other realistic uses of the land.",
    reporting: "Report actual public payments and costs each year, along with whether the company met its promises. Require an independent review before renewing a deal.",
    enforcement: "Make investment and hiring promises specific. Where the law allows, require repayment or end the tax break if the company does not meet them.",
    sourceId: "impactStudy",
  },
  {
    condition: "Schools and other public services can cover the added costs",
    status: "unproven",
    evidence: "Oregon’s school-funding rules can spread the cost of a local tax break across the state. Some voter-approved taxes, school construction debt and districts with unusually high local revenue follow different rules.",
    authority: "The Oregon Department of Education, school districts, other local bodies that collect taxes, governments offering the tax break and state lawmakers.",
    requirement: "Identify which public budgets gain or lose money and how added service costs will be paid. Count each company payment only once.",
    reporting: "Report the effect on day-to-day school budgets locally and statewide each year. Show separately any effect on money used to repay school construction debt.",
    enforcement: "Where the program allows, require payments that cover agreed losses to public budgets or change the tax break to address those losses.",
    sourceId: "odeSchoolFunding",
  },
  {
    condition: "The public can inspect the deal and hold decision-makers accountable",
    status: "unproven",
    evidence: "The Hillsboro lawsuit alleges problems with particular approvals. It does not establish that all Oregon tax-break approvals were unlawful. Each program has its own approval rules.",
    authority: "The public body approving the deal, staff responsible for public records, and courts reviewing a challenge.",
    requirement: "Before a decision, publish the proposed terms, supporting analysis and any financial or personal interests that officials must disclose. Give required public notice and hold a public vote when the rules require or allow one.",
    reporting: "Publish the agreement, meeting notes, reports showing whether promises were met, and later changes. Explain the legal reason for any information that is withheld.",
    enforcement: "If officials skip a required step, use the relevant agency review or court process to correct the problem.",
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
    "Examine where data centers should be built and how they affect local economies, including rural communities.",
    "Examine effects on the climate, energy supplies and natural resources.",
    "Consider how to keep electricity reliable and prevent data-center costs from falling on other customers.",
    "Examine water supplies and the water needed to cool data-center equipment.",
    "Recommend rules and policies for Oregon.",
  ],
  schedule: [
    { date: "Feb–Jun 2026", topic: "Economic development, water, land use, energy and incentives" },
    { date: "Jul 31 & Aug 4", topic: "More evidence and committee discussion" },
    { date: "Sep 10, 2026", topic: "Early findings released and written comments invited" },
    { date: "Oct 24, 2026", topic: "Written comments close at 5 p.m.; check the Department of Energy’s website for updates" },
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
    question: "Does a site with existing internet connections and customers still need a tax break?",
    evidenceNeeded: "Compare similar projects built without tax breaks. Examine the application, available electricity and other industrial uses of the site. Good internet connections may help attract a project, but they do not tell us how much tax relief it needs.",
    sourceId: "hillsboroResponse" },
  { id: "gorge", name: "The Dalles / Columbia Gorge", towns: "The Dalles", x: 148, y: 72,
    question: "Where would an expansion get its water, and how would its payments be calculated?",
    evidenceNeeded: "Check water supply and demand by season, then read the signed agreement. The 2021 Strategic Investment Program agreement sets minimum payments and shares of what the full tax bill would be. A single flat fee would not describe it accurately.",
    sourceId: "wascoAgreement" },
  { id: "columbia-east", name: "Columbia River East", towns: "Boardman", x: 262, y: 62,
    question: "Would the project’s public payments cover its costs, and who would pay for its electricity needs?",
    evidenceNeeded: "Review the project’s contract, plans to buy electricity and water-quality limits. Compare those terms with realistic alternative locations and uses of the land.",
    sourceId: "morrowAssessor" },
  { id: "central", name: "Central Oregon", towns: "Prineville", x: 196, y: 150,
    question: "Does an expansion need the same tax break as the original facility?",
    evidenceNeeded: "Ask for evidence about the expansion’s costs and possible locations. Check the legal right to use water and the power company’s current rates and service rules.",
    sourceId: "preliminary" },
  { id: "willamette", name: "Willamette Valley", towns: "Salem", x: 72, y: 128,
    question: "What else could use this land, water supply and electricity connection?",
    evidenceNeeded: "Compare industrial, farming and other uses allowed on the particular site. A state decision about one property does not settle whether data centers belong elsewhere in the valley.",
    sourceId: "salemWithdrawal" },
  { id: "southeast", name: "South & Southeast Oregon", towns: "Burns", x: 300, y: 215,
    question: "Can electricity, high-speed internet and water actually reach the proposed site?",
    evidenceNeeded: "Ask for utility studies, connection costs, access to fiber-optic internet lines and evidence of local water supplies. These are needed before concluding that the site can support a data center.",
    sourceId: "preliminary" },
];

export const fmtNum = (n: number) => n.toLocaleString("en-US");
