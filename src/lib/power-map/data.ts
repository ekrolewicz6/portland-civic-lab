export type SourceLink = {
  label: string;
  href: string;
};

export type GovernanceActor = {
  id: string;
  layer: string;
  geography: string;
  budget: string;
  budgetNote: string;
  controls: string[];
  electedOrAppointed: string;
  moneySources: string[];
  constraints: string[];
  homelessnessHousingLevers: string[];
  sourceLinks: SourceLink[];
};

export type StreetToStabilityCohort = {
  cohort: string;
  firstPlacement: string;
  responsibleGovernments: string[];
  capacityNeeds: string[];
  deadline: string;
  metrics: string[];
};

export const governanceActors: GovernanceActor[] = [
  {
    id: "oregon",
    layer: "State of Oregon",
    geography: "Statewide",
    budget: "$138.9B for 2025-27",
    budgetNote:
      "The state budget is biennial and includes General Fund, Lottery Funds, Other Funds, and Federal Funds.",
    controls: [
      "State law",
      "Oregon Health Authority and Medicaid/OHP",
      "Behavioral-health licensing and investment",
      "Transportation funding",
      "Schools and statewide housing statutes",
      "Criminal law and court framework",
    ],
    electedOrAppointed:
      "Governor, statewide elected officials, Legislature, agency directors, boards and commissions",
    moneySources: ["Income taxes", "Lottery", "Federal funds", "Fees", "Dedicated state funds"],
    constraints: [
      "Two-year budget cycle",
      "Statewide political geography",
      "Federal Medicaid rules",
      "Statutory limits and court standards",
    ],
    homelessnessHousingLevers: [
      "Treatment-bed capital and licensing",
      "Medicaid/OHP payment policy",
      "Civil commitment and specialty-court law",
      "Statewide housing and land-use laws",
      "Transportation capital",
    ],
    sourceLinks: [
      {
        label: "Oregon LFO 2025-27 Adopted Budget Brief",
        href: "https://www.oregonlegislature.gov/lfo/Documents/2025-2%20LAB%20Summary%202025-27.pdf",
      },
    ],
  },
  {
    id: "multnomah-county",
    layer: "Multnomah County",
    geography: "Portland plus east-county and inner-suburban county geography",
    budget: "About $4B",
    budgetNote:
      "FY2026 adopted budget was $4B; the County Budget Office reports FY2027 was also adopted as a balanced $4B budget, with adopted documents due online after adoption.",
    controls: [
      "Health and public health",
      "Behavioral health",
      "Homeless services contracts",
      "County jail and corrections",
      "Elections",
      "Property assessment and tax collection",
    ],
    electedOrAppointed:
      "County chair and commissioners are elected; departments and service partners operate through county administration and contracts",
    moneySources: [
      "Property taxes",
      "State/federal health dollars",
      "Metro SHS allocations",
      "County taxes and fees",
      "Dedicated program funds",
    ],
    constraints: [
      "Service contracts are spread across many providers",
      "Behavioral-health capacity depends on state and provider systems",
      "Jail, courts, hospitals, and housing each have separate rules",
    ],
    homelessnessHousingLevers: [
      "Outreach and shelter contracts",
      "Behavioral-health and addiction pathways",
      "Jail release and reentry",
      "Health-related discharge coordination",
      "Countywide homelessness strategy",
    ],
    sourceLinks: [
      { label: "FY2026 Adopted Budget", href: "https://multco.us/info/fy-2026-adopted-budget" },
      { label: "Budget Office", href: "https://multco.us/departments/budget-office" },
      { label: "Homeless Services Department", href: "https://hsd.multco.us/" },
    ],
  },
  {
    id: "metro",
    layer: "Metro",
    geography: "Multnomah, Washington, and Clackamas counties",
    budget: "Use current budget book",
    budgetNote:
      "Do not publish a headline Metro dollar figure without pulling it from the current official adopted budget document.",
    controls: [
      "Urban Growth Boundary",
      "Regional planning",
      "Solid waste system",
      "Supportive Housing Services and regional housing measures",
      "Parks and natural areas",
      "Oregon Zoo, convention center, and expo facilities",
    ],
    electedOrAppointed:
      "Directly elected regional council and president; the Oregon Blue Book describes Metro as the only directly elected regional government in the United States",
    moneySources: [
      "SHS tax",
      "Bond measures",
      "Solid waste fees",
      "Venue and enterprise revenue",
      "Grants and dedicated funds",
    ],
    constraints: [
      "Works through county implementation partners for many homelessness programs",
      "Regional politics span three counties",
      "Some dollars are measure-restricted",
    ],
    homelessnessHousingLevers: [
      "Regional housing and homelessness funding",
      "SHS performance accountability",
      "Growth boundary and land supply",
      "Cross-county coordination",
    ],
    sourceLinks: [
      { label: "Oregon Blue Book: Metro", href: "https://sos.oregon.gov/blue-book/Pages/local/other-metro.aspx" },
      {
        label: "Metro budget page",
        href: "https://www.oregonmetro.gov/about-metro/structure-and-operations/finances-and-funding/metro-budget",
      },
    ],
  },
  {
    id: "portland",
    layer: "City of Portland",
    geography: "City limits",
    budget: "$8.64B total / $806.4M General Fund discretionary",
    budgetNote:
      "The total budget includes internal transfers and restricted enterprise funds; General Fund discretionary dollars are the more flexible city money.",
    controls: [
      "Police and fire",
      "Parks",
      "Streets and public right-of-way",
      "Permitting and planning implementation",
      "Water and sewer",
      "City-owned sites",
      "Bureau operations and city public-space response",
    ],
    electedOrAppointed:
      "Mayor and City Council are elected; city administrator and bureau directors run administration under the new charter structure",
    moneySources: [
      "Property taxes",
      "Business license tax",
      "Utility and franchise fees",
      "Charges for services",
      "Debt proceeds and restricted bureau funds",
    ],
    constraints: [
      "Most city dollars are legally restricted",
      "Homelessness services and behavioral health are not solely city-controlled",
      "Permitting, siting, and public-space actions depend on intergovernmental coordination",
    ],
    homelessnessHousingLevers: [
      "Public-space management",
      "Police, fire, and Portland Street Response coordination",
      "Shelter siting and permitting",
      "City-owned land and facilities",
      "Street services and sanitation",
    ],
    sourceLinks: [
      {
        label: "FY2025-26 Adopted Budget",
        href: "https://www.portland.gov/budget/2025-2026-budget/development/adopted",
      },
      {
        label: "Portland government structure",
        href: "https://www.portland.gov/auditor/council-clerk/learn",
      },
    ],
  },
  {
    id: "trimet",
    layer: "TriMet",
    geography: "Tri-county transit district",
    budget: "$1.75B FY2027 adopted budget",
    budgetNote:
      "TriMet says $1.14B is available for service, operations, capital and maintenance projects, and other requirements.",
    controls: ["MAX", "Bus service", "WES", "Transit operations", "Transit capital projects"],
    electedOrAppointed:
      "Board members are appointed by Oregon's governor and confirmed by the Oregon Senate",
    moneySources: ["Payroll tax", "Federal funds", "Fare revenue", "Grants", "Debt and reserves"],
    constraints: [
      "Independent district, not a city bureau",
      "Service and capital decisions are tied to regional commute patterns",
      "Transit safety and public-space impacts overlap with city and county responsibilities",
    ],
    homelessnessHousingLevers: [
      "Transit access to shelters, treatment, jobs, schools, and hospitals",
      "Corridor land-use politics",
      "Transit safety and rider experience",
      "Regional economic connectivity",
    ],
    sourceLinks: [{ label: "TriMet FY2027 budget", href: "https://trimet.org/budget/" }],
  },
  {
    id: "schools",
    layer: "School Districts",
    geography: "Local district boundaries",
    budget: "District-specific",
    budgetNote:
      "School districts are separate governments with their own boards, budgets, levies, bonds, and state/federal education funding.",
    controls: ["K-12 education", "School facilities", "Student services", "Local levies and bonds"],
    electedOrAppointed: "Locally elected school boards",
    moneySources: ["State School Fund", "Local property taxes", "Bonds", "Federal education funds"],
    constraints: [
      "Do not answer to City Hall",
      "Boundaries do not match city or county responsibilities",
      "Education dollars are legally and politically constrained",
    ],
    homelessnessHousingLevers: [
      "Youth and family homelessness identification",
      "School stability",
      "Workforce formation",
      "Early-warning signals for family instability",
    ],
    sourceLinks: [],
  },
  {
    id: "special-districts",
    layer: "Special Districts and Public Corporations",
    geography: "Varies by agency",
    budget: "Agency-specific",
    budgetNote:
      "Ports, drainage, fire, water, sanitation, economic-development, and facilities agencies each have separate governing structures and funds.",
    controls: [
      "Infrastructure",
      "Industrial land",
      "Emergency response in district boundaries",
      "Public facilities",
      "Economic development tools",
    ],
    electedOrAppointed: "Varies by district or public corporation",
    moneySources: ["Rates and fees", "Property taxes", "Bonds", "Grants", "Enterprise revenue"],
    constraints: [
      "Narrow missions",
      "Overlapping boundaries",
      "Dedicated revenue restrictions",
    ],
    homelessnessHousingLevers: [
      "Land and facilities",
      "Infrastructure capacity",
      "Economic development",
      "Emergency response and public works",
    ],
    sourceLinks: [],
  },
  {
    id: "health-systems",
    layer: "Hospitals, CCOs, and Providers",
    geography: "Service catchments, not political boundaries",
    budget: "Billions in regional health spending",
    budgetNote:
      "This is not one government budget; it is a network of hospitals, Medicaid/OHP administrators, treatment providers, nonprofits, and contractors.",
    controls: [
      "Emergency departments",
      "Discharge planning",
      "Medicaid/OHP care coordination",
      "Behavioral-health and medical networks",
      "Service delivery contracts",
    ],
    electedOrAppointed:
      "Mostly boards, executives, state contracts, county contracts, and regulated provider networks",
    moneySources: ["Medicaid/OHP", "Medicare", "Commercial insurance", "Contracts", "Grants", "Philanthropy"],
    constraints: [
      "Clinical rules",
      "Privacy and consent law",
      "Workforce shortages",
      "Facility licensing",
      "Payment rules",
    ],
    homelessnessHousingLevers: [
      "Medical respite",
      "Hospital discharge",
      "Psychiatric stabilization",
      "SUD treatment",
      "Medicaid-funded services",
    ],
    sourceLinks: [],
  },
  {
    id: "clark-vancouver",
    layer: "Clark County / Vancouver",
    geography: "Adjacent Washington metro area",
    budget: "Adjacent note, not v1 build target",
    budgetNote:
      "The labor market, homelessness geography, and service ecosystem are regional, but Washington law and funding differ.",
    controls: [
      "Vancouver city services",
      "Clark County services",
      "Washington health, housing, and criminal-justice systems",
      "Cross-river transportation politics",
    ],
    electedOrAppointed: "Washington local and state offices",
    moneySources: ["Washington state and local funds", "Federal funds", "Local taxes and fees"],
    constraints: [
      "Different state law",
      "Different Medicaid and housing systems",
      "Cross-border coordination friction",
    ],
    homelessnessHousingLevers: [
      "Regional inflow/outflow context",
      "Cross-river service geography",
      "Labor and housing-market relationship",
    ],
    sourceLinks: [],
  },
];

export const streetToStabilityCohorts: StreetToStabilityCohort[] = [
  {
    cohort: "Recently homeless / economic shock",
    firstPlacement: "Motel bridge, prevention payment, landlord mediation, rapid rehousing",
    responsibleGovernments: ["County", "City", "Metro", "State"],
    capacityNeeds: ["Flexible rent fund", "Motel bridge rooms", "Landlord guarantees", "Rapid rehousing slots"],
    deadline: "30-60 days",
    metrics: ["Days homeless", "Cost per prevention", "Return rate"],
  },
  {
    cohort: "Car/RV homeless / working poor",
    firstPlacement: "Safe parking plus housing navigation",
    responsibleGovernments: ["City", "County", "Metro"],
    capacityNeeds: ["Safe parking sites", "RV disposal/repair fund", "Sanitation", "Credit/legal help"],
    deadline: "30-90 days",
    metrics: ["Unmanaged vehicles reduced", "Housing exits", "Sanitation incidents"],
  },
  {
    cohort: "Families with children",
    firstPlacement: "Family motel or family shelter",
    responsibleGovernments: ["County", "Schools", "State"],
    capacityNeeds: ["Family rooms", "Childcare", "School continuity", "Family-sized units"],
    deadline: "Same day",
    metrics: ["Unsheltered family nights", "School continuity", "Housing placement"],
  },
  {
    cohort: "Youth and young adults",
    firstPlacement: "Youth shelter, host home, or transitional living",
    responsibleGovernments: ["County", "Schools", "State"],
    capacityNeeds: ["Youth-specific beds", "Host homes", "Transitional housing", "Behavioral-health support"],
    deadline: "24-72 hours",
    metrics: ["Adult-system exposure", "School/work path", "Stable exits"],
  },
  {
    cohort: "DV / trafficking survivors",
    firstPlacement: "Confidential hotel or safe shelter",
    responsibleGovernments: ["County", "State", "Courts"],
    capacityNeeds: ["Confidential hotel fund", "DV shelter beds", "Legal aid", "Relocation funds"],
    deadline: "Same day",
    metrics: ["Safe placement", "Legal protection", "Confidential housing exits"],
  },
  {
    cohort: "Severe substance use disorder",
    firstPlacement: "Sobering, withdrawal management, residential SUD, recovery housing",
    responsibleGovernments: ["County", "OHA/State", "Providers", "Courts"],
    capacityNeeds: ["Sobering beds", "Withdrawal management", "Residential SUD", "Recovery housing"],
    deadline: "Same day to 72 hours when willing",
    metrics: ["Treatment access", "Retention", "Overdose/ER/jail reduction"],
  },
  {
    cohort: "Serious mental illness",
    firstPlacement: "Crisis stabilization, inpatient/residential psychiatric care, ACT, PSH",
    responsibleGovernments: ["County", "OHA/State", "Hospitals", "Courts"],
    capacityNeeds: ["Crisis beds", "Inpatient psych", "Secure residential", "ACT teams"],
    deadline: "Same day for crisis",
    metrics: ["Stabilization", "Medication continuity", "Street returns"],
  },
  {
    cohort: "Co-occurring SMI + SUD",
    firstPlacement: "Dual-diagnosis stabilization and integrated treatment",
    responsibleGovernments: ["County", "OHA/State", "Hospitals", "Courts"],
    capacityNeeds: ["Dual-diagnosis beds", "Integrated residential care", "Recovery PSH", "Peer support"],
    deadline: "Same day to 72 hours",
    metrics: ["Dual-diagnosis access", "Retention", "Crisis events"],
  },
  {
    cohort: "Medically fragile / elderly / disabled",
    firstPlacement: "Medical respite, accessible shelter, adult foster/supportive housing",
    responsibleGovernments: ["Hospitals", "CCOs", "County", "State"],
    capacityNeeds: ["Medical respite", "Accessible units", "Medicaid coordination", "Adult foster slots"],
    deadline: "Before discharge",
    metrics: ["Discharge-to-street avoided", "Readmission", "SNF/respite costs"],
  },
  {
    cohort: "Chronically homeless but relatively stable",
    firstPlacement: "Low-barrier shelter/village to PSH",
    responsibleGovernments: ["County", "Metro", "Providers", "Landlords"],
    capacityNeeds: ["PSH slots", "Low-barrier interim beds", "Landlord pool", "Case managers"],
    deadline: "90-180 days",
    metrics: ["PSH placement", "6/12-month retention", "Returns to homelessness"],
  },
  {
    cohort: "Justice-involved / repeat public-safety contacts",
    firstPlacement: "Specialty court, supervised diversion, jail-release bridge, treatment/housing",
    responsibleGovernments: ["Courts", "County jail", "DA", "City police", "Providers"],
    capacityNeeds: ["Jail-release bridge beds", "Specialty court slots", "Treatment beds", "Compliance monitoring"],
    deadline: "Before release or next court event",
    metrics: ["Jail-street-jail interruptions", "Treatment access", "Compliance and retention"],
  },
  {
    cohort: "Service-refusing / unsafe encampment",
    firstPlacement: "Barrier-specific offer, alternative placement, repeat documentation",
    responsibleGovernments: ["City", "County", "Courts", "Outreach providers"],
    capacityNeeds: ["Pet/partner/storage options", "Behavioral-health shelter", "Transport", "Legal escalation path"],
    deadline: "Repeated, documented",
    metrics: ["Real offers made", "Refusal reasons", "Public-space resolution"],
  },
];
