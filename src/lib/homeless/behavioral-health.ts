/** September 9 Council packet and corroborating research. Review dates are not observation dates. */
export const BH_REVIEW_DATE = "September 9, 2026";

export const BH_SOURCES = {
  memo: { title: "City Council briefing memo", date: "September 4, 2026", url: "/reports/behavioral-health-2026-09-09/council-memo.pdf" },
  slides: { title: "Council behavioral-health presentation", date: "September 9, 2026", url: "/reports/behavioral-health-2026-09-09/council-presentation.pdf" },
  kpi: { title: "County HRS KPI definitions", date: "November 2025 planning document", url: "https://multnomah.granicus.com/MetaViewer.php?clip_id=3334&meta_id=185308&view_id=2" },
  strategy: { title: "Health Share HABH strategy", date: "October 2025", url: "https://partners.healthshareoregon.org/s/HABH-Summary-of-Initiatives_October-2025.pdf" },
  study: { title: "Housing insecurity, behavioral health and acute care", date: "Published April 27, 2026 · 2023 observations", url: "https://link.springer.com/article/10.1007/s11524-026-01073-3" },
  programs: { title: "Health Share regional behavioral-health projects", date: "Program descriptions reviewed September 9, 2026", url: "https://partners.healthshareoregon.org/habh" },
  model: { title: "Health Share and partners’ investment announcement", date: "February 8, 2024", url: "https://unityhealthcenter.org/health-share-of-oregon-and-partners-announce-significant-behavioral-health-investments-in-portland-metro-area/" },
  roles: { title: "County original Homelessness Response Action Plan", date: "2024 plan · historical deadlines", url: "https://multco.us/file/2024_original_homelessness_response_action_plan/download" },
  monitor: { title: "Mink/Bowman court monitor’s third report", date: "March 16, 2026", url: "https://www.oregon.gov/oha/OSH/reports/Oregon_Mink-Bowman_3rd_Court_Monitor_Pinals_Report_2026.03.16.pdf" },
  docket: { title: "Mink case documents", date: "Listing reviewed September 9, 2026", url: "https://www.droregon.org/litigation-resources/oregon-advocacy-center-v-mink" },
  rates: { title: "OHA: OHP rate development", date: "Reviewed September 9, 2026", url: "https://www.oregon.gov/oha/FOD/Pages/OHP-Rates.aspx" },
  share: { title: "OHA: 2026 SHARE guidance", date: "2026 guidance", url: "https://www.oregon.gov/oha/HPA/dsi-tc/Documents/SHARE-Initiative-Guidance-Document.pdf" },
  investments: { title: "OHA behavioral-health capacity investments", date: "Dashboard reviewed September 9, 2026", url: "https://www.oregon.gov/oha/HSD/AMH/Pages/Housing-Dashboard.aspx" },
  medicalRespite: { title: "CCC Recuperative Care", date: "Provider criteria reviewed September 2026", url: "https://centralcityconcern.org/health-care-location/recuperative-care/" },
  budget: { title: "County HSD adopted budget", date: "FY2027", url: "https://multco.us/file/homeless_services_department-0/download" },
} as const;

export type BhSource = keyof typeof BH_SOURCES;
export type BhEvidence = {
  id: string;
  status: "Reported association" | "Source-reported description" | "Unresolved comparison";
  source: BhSource;
  locator: string;
  period: string;
  geography: string;
  population: string;
  limitation: string;
};

export const BH_COHORT = {
  id: "cohort", status: "Reported association", source: "slides", locator: "slide 7",
  period: "Observation period not supplied in the deck",
  geography: "Health Share serves Clackamas, Multnomah and Washington counties; analytic geography is not specified on the slide",
  population: "Claims-defined Health Share members; slide 7 says members, while slide 9 describes adults. Eligible-member count and exclusions are not supplied.",
  limitation: "A recorded diagnosis is not a current clinical assessment. These figures do not estimate the share of homeless people who need inpatient care.",
  definition: "A claims diagnosis of stimulant use disorder, opioid use disorder, psychosis, or unintentional substance-associated overdose.",
  memberShare: 9,
  spending: [
    { label: "Adult spending", percent: 29 },
    { label: "Emergency-department spending", percent: 33 },
    { label: "Medical inpatient spending", percent: 41 },
    { label: "Behavioral-health spending", percent: 49 },
  ],
  monthly: [
    { label: "Emergency department", cohort: 81, comparison: 16 },
    { label: "Medical inpatient", cohort: 389, comparison: 54 },
  ],
} satisfies BhEvidence & {
  definition: string; memberShare: number;
  spending: { label: string; percent: number }[];
  monthly: { label: string; cohort: number; comparison: number }[];
};

export const BH_PROGRAMS = {
  id: "program-overlap", status: "Reported association", source: "slides", locator: "slide 8",
  period: "Observation period not supplied in the deck",
  geography: "Homelessness-response programs in the presentation; exact linked-data geography and coverage need confirmation",
  population: "People represented in each program category. A person can appear in more than one category; full denominators and linkage exclusions are not supplied.",
  limitation: "Do not sum categories, extrapolate to everyone outside, or interpret the percentages as need for institutional care. The transitional category is treatment housing; the slide notes alcohol-use disorder is outside this cohort definition.",
  rows: [
    { label: "Emergency shelter", percent: 56, count: 4184 },
    { label: "Permanent supportive housing", percent: 52, count: 886 },
    { label: "Street outreach", percent: 51, count: 1260 },
    { label: "Homelessness prevention", percent: 13, count: 1718 },
    { label: "Transitional / treatment housing", percent: 70, count: 1003 },
    { label: "Coordinated entry", percent: 44, count: 2815 },
    { label: "Supportive services only", percent: 40, count: 2253 },
    { label: "Rapid rehousing", percent: 37, count: 1631 },
    { label: "Other", percent: 35, count: 1043 },
    { label: "Permanent housing with services", percent: 45, count: 149 },
  ],
} satisfies BhEvidence & { rows: { label: string; percent: number; count: number }[] };

export const BH_COMPARISONS: { title: string; report: string; caution: string; source: BhSource; locator: string; comparison?: BhSource }[] = [
  { title: "Returns to homelessness: two published estimates", report: "Council slide 9 reports 3.5× greater likelihood. An earlier County KPI document reports preliminary returns of 9% versus 5% (about 1.8×), across rapid rehousing, PSH and other long-term placements with services.", caution: "Unresolved comparison: periods, definitions, adjustment and follow-up coverage may differ. Neither estimate establishes a housing model’s causal effect. Request the underlying cohorts; do not present this as a measured worsening.", source: "slides", locator: "slide 9; County KPI pp. 5–6", comparison: "kpi" },
  { title: "Membership and costs: versions, not a trend", report: "October 2025 Health Share guidance describes 8% of adult members and 24% of spending; the Council deck reports 9% and 29%.", caution: "The published definitions differ, and the deck omits its observation period. Do not plot a trend until the membership denominator and claims rules are reconciled.", source: "slides", locator: "slide 7; Health Share strategy pp. 1–2", comparison: "strategy" },
  { title: "Mortality: comparator not supplied", report: "Council slide 9 reports a fourfold mortality risk.", caution: "The slide does not specify the comparison population, period, absolute death rates or adjustment. Retain this as an attributed, unresolved claim rather than a headline or a forecast of deaths prevented.", source: "slides", locator: "slide 9" },
];

export const BH_CARE_SETTINGS: { id: string; name: string; purpose: string; boundary: string; measure: string; source: BhSource; locator: string }[] = [
  { id: "inpatient", name: "Inpatient psychiatry", purpose: "Hospital-level psychiatric assessment and treatment when clinically indicated.", boundary: "Admission needs clinical assessment, an accepting hospital and the applicable payment or legal pathway. A shelter vacancy cannot replace this care.", measure: "Staffed beds; admission waits and denials; discharge-ready days; completed receiving placements.", source: "slides", locator: "slides 4, 11–14" },
  { id: "subacute", name: "Psychiatric subacute care", purpose: "The presentation describes secure, round-the-clock psychiatric supervision for people who no longer meet full acute inpatient criteria but still need close monitoring and treatment.", boundary: "The proposed service description is not a verified local license category or an available bed. Required staffing and entry criteria need confirmation.", measure: "Appropriate referrals accepted; staffed capacity; time awaiting transfer; onward care and housing.", source: "slides", locator: "slide 13" },
  { id: "psychiatric-respite", name: "Psychiatric respite", purpose: "The presentation describes 24-hour support, peers, skill-building, medication management and coordination, as a step-down or an alternative to hospitalization.", boundary: "Clinical capabilities and entry rules vary. This psychiatric service is distinct from recovery after a physical illness and from ordinary bridge housing.", measure: "Access by referral source; support actually staffed; completed arrivals; repeat crises and continuing care.", source: "slides", locator: "slide 13" },
  { id: "sud", name: "Residential substance-use treatment", purpose: "Treatment for substance-use needs at an appropriate clinical level, with continuing treatment and housing planned together.", boundary: "Residential addiction treatment does not establish capacity for acute psychiatric illness; co-occurring needs require an explicit capability check.", measure: "Recommended level of care versus admitted level; waiting time; treatment continuity; discharge destination.", source: "slides", locator: "slides 6–7, 11" },
  { id: "medical-respite", name: "Medical respite", purpose: "Recovery after physical illness or injury for someone without an appropriate place to recuperate.", boundary: "CCC’s published criteria require independence in daily activities and medication management. People needing more assistance require another care arrangement.", measure: "Referrals declined for care needs; time to suitable care; readmissions and housing connections.", source: "medicalRespite", locator: "Referral criteria" },
  { id: "bridge", name: "Bridge housing", purpose: "An interim place while a longer-term housing and support arrangement is secured.", boundary: "A housing program’s name does not guarantee clinical staffing. Verify what the receiving program can provide.", measure: "Usable units; eligibility; time to a lasting placement; housing and care after exit.", source: "budget", locator: "p. 65 · program 30207" },
];

export const BH_RESPONSIBILITIES = [
  { role: "Authorize and pay for covered care", actor: "CCOs and health plans; OHA for applicable state-funded or direct services", question: "Which payer covers this service and person, what authorization is needed, and who resolves a denial?" },
  { role: "Fund and license the service", actor: "OHA; Legislature; relevant facility regulators", question: "Are capital, continuing operations and the required license all in place?" },
  { role: "Accept and deliver care", actor: "Hospital or receiving provider", question: "Can the staffed service meet this person’s assessed needs, and has it accepted the referral?" },
  { role: "Provide safety-net and transition support", actor: "County Health / community mental-health program; HSD and housing partners", question: "Who coordinates continuing care, benefits, the housing resource and follow-up?" },
  { role: "Enable local delivery and advocate", actor: "City permitting, program funders and Government Relations", question: "Which siting, permit, local funding or legislative action can the City actually take?" },
  { role: "Determine legal admission routes", actor: "Courts and state authorities under applicable law and orders", question: "Which civil or forensic route applies? A city policy cannot override a federal order." },
];

export const BH_ACTIONS = [
  { title: "Preserve acute care and add appropriate step-down", body: "The Council presentation proposes preserving inpatient psychiatric beds, backfilling closures and expanding psychiatric subacute and respite care.", owner: "OHA · Legislature · hospitals · health plans · operators", measure: "Dated staffed capacity by care level, net additions after closures, admission waits and completed transfers", evidence: "Facility-level needs assessment, model scenarios, workforce and ongoing operating commitments" },
  { title: "Make continuing operations financially viable", body: "The presentation calls for break-even inpatient reimbursement. Capital funding alone does not keep a clinical service operating.", owner: "OHA · health plans · hospitals · Legislature where funding or authority changes", measure: "Agreed payment mechanism, service-level revenue and cost coverage, staffed capacity retained and access delivered", evidence: "Costs and reimbursement by payer, authorization denials, staffing costs and recurring funding requirements" },
  { title: "Resolve siting, permitting and licensing barriers", body: "The presentation proposes faster local siting and permitting and separate licensing requirements for subacute and respite care. Specific rule changes and safeguards still need to be evaluated.", owner: "City permitting · OHA licensing · Legislature as needed", measure: "Project milestones, time lost by reason, approved service standards and actual opening dates", evidence: "Project-level delays and the proposed rule or statutory text, including staffing and patient protections" },
  { title: "Improve psychiatric access outside criminal proceedings", body: "The presentation proposes prioritized OSH access outside Aid & Assist and community alternatives. Civil access has existed; the proposal needs a current legal and capacity analysis.", owner: "OHA / OSH · Legislature · courts within their respective authority", measure: "Access and waiting time by legal pathway; community options; compliance and safe transitions", evidence: "Current orders and admission protocols, civil and forensic capacity, and effects on existing obligations" },
];

export type EvidenceRequest = { id: string; label: string; question: string; holder: string; answers: string; records: string[] };
export const BH_REQUESTS: EvidenceRequest[] = [
  { id: "bh-cohort", label: "BH cohort evidence", question: "Which people and periods do the high-acuity figures describe?", holder: "Health Share analytics; County HSD and Health, for records each holds", answers: "Reconciles the Council slides with earlier membership, spending and retention estimates.", records: [
    "Source tables, methodology and revisions underlying slides 7–9 of the September 9, 2026 Council presentation: observation periods, geography, eligible adults/members, claims definitions, exclusions, linkage coverage and denominators. Include the monthly spending chart’s units and cost definitions.",
    "Existing aggregate move-in and return cohorts underlying 3.5× likelihood and the earlier 9% versus 5% KPI estimate; housing categories, counts, adjustment, follow-up windows, repeat placements, deaths, other outcomes and missing status. Include any reconciliation already prepared.",
    "The comparison group, absolute rates, period and analysis behind the fourfold mortality claim; the October 2025 8%/24% and September 2026 9%/29% membership/cost versions; program overlap and deduplication rules for slide 8."
  ] },
  { id: "bh-model", label: "Regional care model", question: "What does the existing regional capacity model actually predict?", holder: "Health Share; CareOregon; OHSU modeling team; County for model records held", answers: "Tests whether the commissioned model supports the proposed care mix without importing assumptions into our educational simulator.", records: [
    "The final report, methods, model documentation and available scenario outputs for the Portland Tri-County Area Mental Health Crisis Investment Decision Support Simulation Model announced in February 2024 and assigned a December 2025 deadline. Records identifying whether it is the model cited on Council slide 12.",
    "Inputs and source dates for geography, capacity by care level, staffing, admission and discharge processes, waiting times, lengths of stay, repeat use and housing destinations; validation, calibration, uncertainty and sensitivity analyses.",
    "Existing comparisons of acute, subacute, respite, outpatient and housing investments; costs, projected outcomes, closures and funded additions; completion status, implementation decisions and limitations."
  ] },
  { id: "bh-capacity", label: "Psychiatric capacity", question: "Which clinical services are staffed and accepting appropriate referrals?", holder: "OHA; County Health; hospitals and providers through their public funders, for records held", answers: "Separates acute psychiatry, psychiatric step-down, addiction treatment, medical respite and bridge housing.", records: [
    "Existing facility-level inventories distinguishing licensed/design, funded, staffed, occupied, reserved and accepting capacity by service and date; temporary and permanent closures, funded additions, expected opening dates and referral eligibility.",
    "Aggregate admission denials and waits, authorization delays, discharge-ready days by reason, accepted transfers and confirmed arrivals, with inpatient psychiatry, psychiatric subacute/respite, residential SUD and medical respite reported separately.",
    "Existing records reconciling the Council’s 79 Unity inpatient beds with the earlier 80-adult-bed inventory; the 2025 investment categories (~160 and ~175 beds); current OSH civil/forensic admission protocols and aggregate access by pathway."
  ] },
  { id: "bh-finance", label: "Clinical operating finance", question: "What payment and staffing would keep the needed care open?", holder: "OHA; health plans; public hospital or service funders, for records held", answers: "Distinguishes one-time construction funding, recurring reimbursement and verified operating capacity.", records: [
    "Existing aggregate service-level operating-cost, staffing-cost and reimbursement analyses for inpatient psychiatric care and proposed subacute/respite services, by payer and fiscal year; amounts paid, denied, pending and uncovered, with capital separated.",
    "The proposed break-even reimbursement mechanism, responsible payer, budget estimate, authority needed and expected access or staffing commitments; existing analyses of payment and authorization barriers.",
    "Existing relevant SHARE designations and spending plans, their financial eligibility and housing commitments; risk-sharing arrangements and analyses supporting any claimed reinvestable or public-budget savings."
  ] },
  { id: "bh-council", label: "Council follow-through", question: "What did Council direct, and what happens next?", holder: "City Office of Government Relations; Council Clerk; relevant City permitting offices", answers: "Separates the September 9 briefing proposal from adopted policy and subsequent implementation.", records: [
    "Final September 9, 2026 behavioral-health work-session presentation, supplements, recording/transcript if maintained, minutes and written Council direction; distinguish the attached briefing version from later revisions.",
    "Existing proposed 2027 legislative language, coalition positions, assigned leads, decision records and milestones addressing capacity, reimbursement, licensing and OSH access.",
    "Existing project-level siting and permitting timelines and delay summaries for funded behavioral-health facilities; proposed local changes, responsible offices and current status."
  ] },
];
