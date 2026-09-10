import { BH_SOURCES } from "@/lib/homeless/behavioral-health";

export type Dimension = "capacity" | "workforce" | "funding" | "access" | "handoff" | "execution" | "outcomes";
export type EvidenceStatus = "documented" | "limit" | "question";
export const DIMENSIONS: { id: Dimension; label: string }[] = [
  { id: "capacity", label: "Places" }, { id: "workforce", label: "Workers" },
  { id: "funding", label: "Funding" }, { id: "access", label: "Access" },
  { id: "handoff", label: "Handoffs" }, { id: "execution", label: "Execution" },
  { id: "outcomes", label: "Outcomes" },
];

export const DIAGNOSIS_SOURCES = {
  council: { label: "Council behavioral-health presentation · September 9, 2026", href: BH_SOURCES.slides.url },
  shelter: { label: "County Adult Shelter Review · FY25", href: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf" },
  quarter: { label: "County SHS report · FY26 Q4, updated Aug 28, 2026", href: "https://hsd.multco.us/wp-content/uploads/2026/09/Q4-FY26-SHS-Report-FINAL-Updated-8.28.26.pdf" },
  access: { label: "County Coordinated Access policy · November 2025", href: "https://hsd.multco.us/wp-content/uploads/2025/12/1.0_CA_Policies_FINAL_2025.pdf" },
  outreach: { label: "County approach to unsheltered homelessness", href: "https://hsd.multco.us/unsheltered-homelessness/" },
  treatment: { label: "CCC treatment-transition analysis · published Nov 2024", href: "https://centralcityconcern.org/blog/meeting-our-regions-need-for-more-treatment-beds/" },
  burnside: { label: "CCC 16 x Burnside Recovery Center · current program page", href: "https://centralcityconcern.org/recovery-location/16-x-burnside-recovery-center/" },
  letty: { label: "CCC Letty Owings closure FAQ · updated Sept 1, 2026", href: "https://centralcityconcern.org/recovery-location/letty-owings-center/" },
  respite: { label: "CCC Recuperative Care · access criteria", href: "https://centralcityconcern.org/health-care-location/recuperative-care/" },
  sobering: { label: "County sobering services · reviewed July 2026", href: "https://multco.us/info/sobering-services" },
  conferencing: { label: "County Cross Sector Case Conferencing", href: "https://hsd.multco.us/cross-sector-case-conferencing/" },
  budget: { label: "County HSD adopted budget · FY27", href: "https://multco.us/file/homeless_services_department-0/download" },
  benefits: { label: "County adopted-budget release · June 5, 2026", href: "https://multco.us/news/news-release-multnomah-county-board-commissioners-closes-significant-spending-gap-adopts" },
  oversight: { label: "County Auditor memorandum · April 21, 2026", href: "https://multco.us/file/memorandum_to_board_of_county_commissioners:_request_for_advocacy_to_implement_auditor_recommendations/download" },
  retention: { label: "County budget follow-up · May 14, 2025, slide 11", href: "https://multco.us/file/fy_2026_homeless_services_department_budget_worksession_follow-up/download" },
} as const;

type SourceKey = keyof typeof DIAGNOSIS_SOURCES;
export type Diagnosis = {
  id: string; name: string; phase: string; headline: string; period: string;
  status: EvidenceStatus; cells: Partial<Record<Dimension, EvidenceStatus>>;
  evidence: string; consequence: string; question: string; records: string;
  owner: string; source: SourceKey; locator?: string; progress?: string;
  progressSource?: SourceKey; progressLocator?: string;
};

export const DIAGNOSES: Diagnosis[] = [
  {
    id: "prevention", name: "Keep the home", phase: "Prevention", headline: "Benefits funded. Delivery still needs proof.", period: "FY27 adopted budget",
    status: "question", cells: { funding: "question", execution: "question", outcomes: "question" },
    evidence: "The adopted budget adds $565,000 in one-time funding for a mobile eviction-prevention team serving Home Forward tenants. The expected $7.8 million in Medicaid rent vouchers is a forecast.",
    consequence: "Funding an enrollment team does not yet show how much rent was paid before households lost their homes.",
    question: "How many eligible households receive help in time to stay housed?",
    records: "Applications, eligibility decisions, rent payments, time to payment and housing follow-up; unserved eligible requests.",
    owner: "County Human Services · Home Forward · health plans", source: "benefits", locator: "Amendment for mobile eviction prevention",
  },
  {
    id: "diversion", name: "Resolve the housing crisis", phase: "Problem solving / diversion", headline: "The service exists. Its reach is not established here.", period: "November 2025 policy",
    status: "question", cells: { capacity: "question", funding: "question", outcomes: "question" },
    evidence: "Coordinated Access includes housing problem solving, mediation and limited financial help. The policy describes a process, not how many households get a durable solution.",
    consequence: "A conversation may identify a safe option that still needs cash, landlord agreement or follow-through.",
    question: "Where are suitable alternatives found but never funded or completed?",
    records: "Requests, assistance offered and paid, unresolved cases, time to resolution and later housing status.",
    owner: "County HSD · housing problem-solving providers", source: "access", locator: "pp. 7–8 · Housing Problem Solving",
  },
  {
    id: "outreach", name: "Reach people outside", phase: "Outreach and engagement", headline: "Contacts are counted. Coverage is harder to establish.", period: "April–June 2026 · SHS-funded outreach",
    status: "question", cells: { workforce: "question", handoff: "question", outcomes: "question" },
    evidence: "HSD reports 6,327 contacts and 212 newly engaged people in FY26 Q4. Its narrative uses ArcGIS because HMIS did not capture all outreach engagements.",
    consequence: "We cannot diagnose too few workers—or ineffective outreach—from contact totals alone.",
    question: "Are people missed, repeatedly contacted without an offer, or offered places they cannot use?",
    records: "Filled outreach roles, shift coverage, caseloads, unique people reached, suitable offers and confirmed arrivals, by team and area.",
    owner: "County HSD · City Street Services · outreach providers", source: "quarter", locator: "pp. 5–6 · Outreach reporting",
  },
  {
    id: "discharge", name: "Leave a hospital or institution", phase: "Discharge and in-reach", headline: "Coordination can meet without a housing resource.", period: "Published program scope · reviewed Sept 2026",
    status: "limit", cells: { capacity: "question", access: "limit", handoff: "question" },
    evidence: "County cross-sector case conferencing links housing, health and disability systems, but explicitly provides no housing resources itself.",
    consequence: "A care plan and a meeting do not guarantee a receiving place. This is a program boundary, not proof that every discharge fails.",
    question: "How often does someone leave without a suitable, confirmed place and continuing care?",
    records: "Discharge destinations, receiving-provider acceptance, arrivals, care continuity and delays by reason; separate hospital, jail and treatment routes.",
    owner: "Discharging institutions · County HSD and Health · receiving providers", source: "conferencing", locator: "Program scope and limitations",
  },
  {
    id: "crisis", name: "Enter crisis or sobering care", phase: "Crisis response / sobering", headline: "A 24/7 building is not a walk-in offer.", period: "County sobering rules · July 2026",
    status: "limit", cells: { capacity: "question", access: "limit", handoff: "question" },
    evidence: "County sobering has up to 13 stations and operates 24/7. Admission is voluntary and referral-only, with medical and behavioral criteria.",
    consequence: "A station may exist without being an appropriate or accessible destination for this person. Clinical criteria are not inherently a failure.",
    question: "Which appropriate referrals cannot enter, and where do excluded people go instead?",
    records: "Staffed capacity, occupancy, referrals by hour, declined admissions by reason and completed transfers to suitable care.",
    owner: "County Health · crisis responders · receiving clinical providers", source: "sobering", locator: "Access, eligibility and referral partners",
  },
  {
    id: "withdrawal", name: "Move from detox to treatment", phase: "Withdrawal management", headline: "264 placements after 1,554 recommendations.", period: "Hooper assessments · 2022 cohort",
    status: "documented", cells: { capacity: "documented", access: "documented", handoff: "documented", outcomes: "question" },
    evidence: "CCC reports 1,554 Hooper assessments recommended ASAM 3.5 residential care in 2022; 264 resulted in residential placement at discharge—about 17%.",
    consequence: "This documents a shortfall in recommended transfers. Assessments need not represent different people; it is not a current system-wide rate.",
    question: "After subsequent capacity additions, how many recommended transfers now happen without a gap?",
    records: "Updated recommendation-to-admission cohorts, waiting days and reasons no transfer occurred, split by required level of care.",
    owner: "Withdrawal and treatment providers · OHA · health plans", source: "treatment", locator: "What does the data show?", progress: "CCC’s 74-bed 16 x Burnside center opened in May 2025 and serves adults needing ASAM 3.5 or 3.7 care. Updated transfer outcomes are needed to measure improvement.", progressSource: "burnside",
  },
  {
    id: "psychiatric-inpatient", name: "Receive acute psychiatric care", phase: "Inpatient psychiatry", headline: "Preservation and break-even payment are proposed; the operating baseline needs records.", period: "Council briefing · September 9, 2026",
    status: "question", cells: { capacity: "question", workforce: "question", funding: "question", access: "question" },
    evidence: "The Council deck proposes preserving inpatient psychiatric capacity and achieving break-even reimbursement. It does not supply a dated facility-level baseline of staffed, accepting capacity or operating margins.",
    consequence: "A licensed bed can be unavailable because of staffing, payment, eligibility or a blocked onward placement.",
    question: "Which staffed services are accepting clinically appropriate referrals, and what would keep them operating?",
    records: "Capacity by status and service; closures; admission waits and denials; discharge-ready days; costs and reimbursement by payer.",
    owner: "OHA · hospitals · health plans · Legislature", source: "council", locator: "slides 4, 12–14",
  },
  {
    id: "psychiatric-stepdown", name: "Transfer to psychiatric support", phase: "Psychiatric subacute / respite", headline: "Specify the receiving care, then test the bottleneck.", period: "Council briefing · September 9, 2026",
    status: "question", cells: { capacity: "question", workforce: "question", access: "question", handoff: "question", outcomes: "question" },
    evidence: "The deck distinguishes subacute psychiatric supervision from psychiatric respite, and proposes expansion. These descriptions do not establish current licensed categories, available places or the number of blocked discharges.",
    consequence: "Someone ready to leave acute care may still need substantial psychiatric support; medical respite and bridge housing are not interchangeable substitutes.",
    question: "Which assessed care needs lack an accepting service, and how much delay comes from capacity, authorization or other barriers?",
    records: "Service definitions; staffed accepting capacity; authorization and receiving-provider decisions; transfer delays; confirmed arrivals; continuing care and housing follow-up.",
    owner: "Hospital · receiving provider · payer · OHA · County transition and housing teams", source: "council", locator: "slides 12–14",
  },
  {
    id: "treatment", name: "Find treatment that fits", phase: "Residential substance-use treatment", headline: "A family treatment program has stopped new admissions.", period: "Admissions paused July 2026 · closure announced for Oct 31",
    status: "documented", cells: { capacity: "documented", workforce: "documented", funding: "documented", access: "limit", handoff: "question" },
    evidence: "CCC paused Letty Owings admissions in July and announced an October 31 closure. Its September 1 FAQ cites complex care needs, workforce challenges and funding shortfalls.",
    consequence: "CCC’s 16 x Burnside can treat parents, but children and infants cannot live onsite. A treatment place may still leave the family without a suitable arrangement.",
    question: "Can families find appropriate treatment that meets both parent and child needs, without a gap in care?",
    records: "Aggregate transition outcomes and program continuity plans; declined referrals; family-compatible vacancies; funding and staffing analysis; successor-provider efforts.",
    owner: "CCC · OHA · health plans · child welfare and receiving providers", source: "letty", locator: "Why Now? · Timeline · Continuity of Services · Client Impact", progress: "CCC plans treatment completion or safe transfers for current clients and lists other Oregon programs, including CODA Gresham and LifeWorks Project Network. Available places and family eligibility still need confirmation.",
  },
  {
    id: "respite", name: "Recover after an illness", phase: "Medical respite / daily care", headline: "A respite bed may require more independence than someone has.", period: "Provider access rules · reviewed Sept 2026",
    status: "limit", cells: { capacity: "question", workforce: "question", access: "limit" },
    evidence: "CCC Recuperative Care requires independent daily activities and medication management. People needing more assistance require a different match.",
    consequence: "A standard respite referral cannot substitute for nursing, personal assistance or long-term care when those are needed.",
    question: "How many people are waiting because they need help eating, bathing, moving or managing care?",
    records: "Referrals denied for care needs, days waiting, appropriate staffed alternatives and successful follow-on placements.",
    owner: "Hospitals · care providers · health plans · County aging/disability services", source: "respite", locator: "Referral criteria",
  },
  {
    id: "shelter", name: "Use a shelter place", phase: "Emergency and alternative shelter", headline: "Short staffing kept a village below full capacity.", period: "Kenton Women’s Village · FY25–FY26",
    status: "documented", cells: { capacity: "documented", workforce: "documented", funding: "documented", outcomes: "documented" },
    evidence: "The County review links Kenton Women’s Village’s early-FY25 underuse to staffing shortages. Its profile also reports two Housing Transitions staff cut for FY26. Across the review, roughly half of exit destinations were unreported.",
    consequence: "Physical capacity, operating staff and housing-navigation capacity are separate resources. A shortage in any one can stop a placement.",
    question: "Which beds are unusable because of staffing—and which occupied beds lack a funded housing exit?",
    records: "Planned versus staffed beds by site and shift; funded/filled roles; navigation caseloads; attached housing assistance; exit destinations.",
    owner: "City and County shelter funders · operators", source: "shelter", locator: "pp. 13, 25, 35, 140 · dated findings, not current staffing", progress: "FY27 adopted program 30302B adds $7.13 million for placement services, including up to $2.1 million for recovery housing. Its 465 housing-placement target excludes recovery placements; funded targets still need delivery checks.", progressSource: "budget", progressLocator: "p. 80 · program 30302B",
  },
  {
    id: "bridge", name: "Have a place between services", phase: "Bridge / transitional housing", headline: "A funded line item is not an available place.", period: "FY27 adopted budget · program 30207",
    status: "question", cells: { capacity: "question", workforce: "question", handoff: "question" },
    evidence: "The County’s Bridge Housing program has a $2.95 million adopted budget and a 42-unit target. It is one program, not the whole transitional inventory.",
    consequence: "The budget establishes funded provision. It does not establish current vacancies or whether the program can meet a person's care needs.",
    question: "Which transitions have no suitable place to wait, and for how long?",
    records: "Actual staffed units, referral criteria, occupied and held spaces, declined referrals, length of stay and confirmed next placements.",
    owner: "County HSD · bridge providers · referring institutions", source: "budget", locator: "p. 65 · program 30207",
  },
  {
    id: "matching", name: "Turn an assessment into a match", phase: "Coordinated Access", headline: "The clock exists. Compliance needs to be shown.", period: "November 2025 policy",
    status: "question", cells: { funding: "question", access: "question", handoff: "question", execution: "question" },
    evidence: "County policy expects provider contact within 15 days of referral and enrollment within 30 days, with extensions communicated to HSD for exceptional circumstances. Compliance is a separate question.",
    consequence: "Assessment counts do not tell us how many people have a suitable funded match or how long unresolved cases have waited.",
    question: "Are delays before matching, after referral, or between enrollment and an actual move-in?",
    records: "Pending matches, referral/contact/enrollment/move-in dates, expired matches, provider denials, household declines and reasons.",
    owner: "County HSD · Coordinated Access partners · receiving housing providers", source: "access", locator: "pp. 15–16 · Housing Referral Outreach & Engagement",
  },
  {
    id: "rental", name: "Get rent assistance and move in", phase: "Rent assistance / housing slots", headline: "SHS Housing Only programs stopped new referrals.", period: "FY26 Q4 report · updated Aug 28, 2026",
    status: "documented", cells: { capacity: "documented", funding: "question", access: "documented" },
    evidence: "SHS-funded Housing Only programs reached capacity and stopped new referrals. HSD expects to sustain existing households but anticipates no new FY27 placements in these programs.",
    consequence: "An assessment or referral cannot create a slot in a program that is full. Other housing routes must be assessed separately.",
    question: "What funded alternatives are actually accepting people, and what limits new slots?",
    records: "Slots in use, new allocations, assistance issued and leased, closed referral routes and available alternatives by program.",
    owner: "County Human Services · HSD · participating housing providers", source: "quarter", locator: "p. 5 · Housing Only, not all rent assistance",
  },
  {
    id: "supportive", name: "Move into supportive housing", phase: "Permanent housing + services", headline: "Units sat vacant while veterans waited.", period: "FY26 Q4 report · updated Aug 28, 2026",
    status: "documented", cells: { capacity: "documented", workforce: "documented", funding: "documented", execution: "documented" },
    evidence: "HSD links inconsistent property management to delayed unit turnovers, vacancies and a veteran placement backlog. Some smaller supportive-housing sites also struggled to fund round-the-clock staffing and care.",
    consequence: "Here, the failure includes turning an existing unit into a ready, supported tenancy—not only building more units.",
    question: "How many units are held up by repairs, property management, staffing, matching or missing support funding?",
    records: "Vacant-unit days by reason; turnover deadlines; referrals waiting; funded/filled support roles; service cost and move-in dates.",
    owner: "Housing operators · County HSD · property managers · health partners", source: "quarter", locator: "pp. 7, 9", progress: "HSD reports reallocating resources and supporting higher-need sites, with a deeper review of actual operating costs planned for FY27. The next test is whether vacancies and waits fall.",
  },
  {
    id: "retention", name: "Keep the placement working", phase: "Tenancy support / retention", headline: "Missing follow-up obscures who is still housed.", period: "County follow-up presentation · May 2025",
    status: "documented", cells: { workforce: "question", handoff: "question", outcomes: "documented" },
    evidence: "A County presentation reported unknown housing status for 53% of a 2,436-person placement cohort because of missing data or loss of contact.",
    consequence: "A headline retention rate cannot describe everyone when follow-up is incomplete. Unknown status is not evidence of an eviction or a successful tenancy.",
    question: "Who is confirmed housed, who returned to homelessness, and whose support or follow-up was lost?",
    records: "Move-in cohorts with 6/12-month status, contact coverage, observed returns, support continuity and unknown outcomes shown separately.",
    owner: "County HSD · placing and support providers · health partners", source: "retention", progress: "The presentation’s separate 88% retention statistic uses a differently described measure. Do not combine it with this cohort to infer a whole-system success rate.",
  },
];
