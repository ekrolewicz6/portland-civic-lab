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
  sourceLinks: SourceLink[];
};

export type PowerMapIssue = {
  id: string;
  label: string;
  residentQuestion: string;
  visibleLayer: string;
  usuallyBlamed: string;
  betterQuestion: string;
  handoffFailure: string;
  actualOwners: {
    actorId: string;
    role: string;
    lever: string;
  }[];
  sequence: {
    label: string;
    actorId: string;
    failure?: string;
  }[];
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
      "Human services and homelessness services contracts",
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
    budget: "$1.63B FY2026-27 proposed total budget",
    budgetNote:
      "Metro's FY2026-27 proposed budget lists total resources/requirements of $1,630,516,204, including $804,887,896 in current revenues, $1,459,060,378 in appropriations, and $440,022,390 in Supportive Housing Services fund requirements.",
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
      "Works through county implementation partners for many housing and service programs",
      "Regional politics span three counties",
      "Some dollars are measure-restricted",
    ],
    sourceLinks: [
      { label: "Oregon Blue Book: Metro", href: "https://sos.oregon.gov/blue-book/Pages/local/other-metro.aspx" },
      {
        label: "FY2026-27 proposed budget",
        href: "https://www.oregonmetro.gov/sites/default/files/2026-04/fy-2026-27-proposed-budget-20260403.pdf",
      },
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
      "Human services and behavioral health are not solely city-controlled",
      "Permitting, siting, and public-space actions depend on intergovernmental coordination",
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
    sourceLinks: [],
  },
  {
    id: "clark-vancouver",
    layer: "Clark County / Vancouver",
    geography: "Adjacent Washington metro area",
    budget: "Adjacent regional context",
    budgetNote:
      "The labor market, housing geography, and service ecosystem are regional, but Washington law and funding differ.",
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
    sourceLinks: [],
  },
];

export const powerMapIssues: PowerMapIssue[] = [
  {
    id: "pothole-street",
    label: "My street is falling apart",
    residentQuestion: "Who is responsible for fixing this road?",
    visibleLayer: "Street, curb, sidewalk, or bridge",
    usuallyBlamed: "The City of Portland",
    betterQuestion:
      "Is this a city street, county road, state highway, transit corridor, or privately maintained access point?",
    handoffFailure:
      "Residents see pavement. Government sees jurisdiction, right-of-way ownership, capital funding, utility conflicts, and construction schedules.",
    actualOwners: [
      {
        actorId: "portland",
        role: "Local streets and right-of-way",
        lever: "PBOT operations, maintenance prioritization, local transportation revenue, street permits",
      },
      {
        actorId: "oregon",
        role: "State highways and transportation law",
        lever: "ODOT corridors, state transportation funding, highway safety rules",
      },
      {
        actorId: "metro",
        role: "Regional transportation planning",
        lever: "Regional transportation plans, project prioritization, growth and corridor strategy",
      },
      {
        actorId: "special-districts",
        role: "Utilities and infrastructure conflicts",
        lever: "Water, sewer, drainage, ports, and other infrastructure work that changes timing",
      },
    ],
    sequence: [
      { label: "Resident reports road condition", actorId: "portland" },
      { label: "Check jurisdiction and right-of-way", actorId: "oregon" },
      { label: "Fit regional project priority", actorId: "metro" },
      { label: "Coordinate utilities and construction", actorId: "special-districts", failure: "Wrong owner or unfunded queue" },
    ],
  },
  {
    id: "property-tax",
    label: "My property tax bill went up",
    residentQuestion: "Who decided I owe this much?",
    visibleLayer: "Tax bill in the mailbox",
    usuallyBlamed: "City Hall or whoever is in office now",
    betterQuestion:
      "Which line item changed: county assessment, school bond, city levy, Metro measure, urban-renewal district, or special district?",
    handoffFailure:
      "The county sends and collects the bill, but the bill combines taxes approved or imposed by many separate governments.",
    actualOwners: [
      {
        actorId: "multnomah-county",
        role: "Assessment and collection",
        lever: "Property assessment, tax administration, bill collection and distribution",
      },
      {
        actorId: "schools",
        role: "School levies and bonds",
        lever: "Local education taxes, bonds, and district budgets",
      },
      {
        actorId: "portland",
        role: "City levies and urban services",
        lever: "City property-tax components, local measures, urban-renewal impacts",
      },
      {
        actorId: "metro",
        role: "Regional measures",
        lever: "Regional housing, parks, and other voter-approved measures",
      },
      {
        actorId: "special-districts",
        role: "District-specific charges",
        lever: "Fire, water, sanitation, port, library, and other special-district taxes where applicable",
      },
    ],
    sequence: [
      { label: "County assesses and mails bill", actorId: "multnomah-county" },
      { label: "School district line items apply", actorId: "schools" },
      { label: "City and urban service lines apply", actorId: "portland" },
      { label: "Regional measure lines apply", actorId: "metro" },
      { label: "Special districts add their lines", actorId: "special-districts", failure: "One bill, many taxing authorities" },
    ],
  },
  {
    id: "housing-permit",
    label: "Housing is too expensive",
    residentQuestion: "Who can make it easier to build homes?",
    visibleLayer: "Rent, listings, construction sites, vacant lots",
    usuallyBlamed: "The city planning bureau or City Council",
    betterQuestion:
      "Who controls zoning implementation, land supply, state housing law, infrastructure capacity, funding, and school/transportation access?",
    handoffFailure:
      "A housing project needs legal permission, land, infrastructure, financing, permits, inspections, and political acceptance from different layers.",
    actualOwners: [
      {
        actorId: "portland",
        role: "Permitting and local implementation",
        lever: "Zoning implementation, permits, inspections, city-owned sites, local fees",
      },
      {
        actorId: "metro",
        role: "Regional growth and housing funds",
        lever: "Urban Growth Boundary, regional housing bonds, land-use coordination",
      },
      {
        actorId: "oregon",
        role: "Statewide housing law",
        lever: "Land-use statutes, housing mandates, capital programs, building-code framework",
      },
      {
        actorId: "special-districts",
        role: "Infrastructure capacity",
        lever: "Water, sewer, drainage, roads, ports, and utility constraints",
      },
      {
        actorId: "schools",
        role: "Facilities and neighborhood capacity",
        lever: "School boundaries, bonds, facilities planning, student-growth impacts",
      },
    ],
    sequence: [
      { label: "Project proposed", actorId: "portland" },
      { label: "Land supply and regional fit", actorId: "metro" },
      { label: "State housing rules apply", actorId: "oregon" },
      { label: "Infrastructure capacity checked", actorId: "special-districts" },
      { label: "Public facilities absorb growth", actorId: "schools", failure: "Many veto points" },
    ],
  },
  {
    id: "transit-safety",
    label: "A MAX stop feels unsafe",
    residentQuestion: "Is this a transit problem or a public safety problem?",
    visibleLayer: "Station, platform, train, bus stop",
    usuallyBlamed: "TriMet or Portland police",
    betterQuestion:
      "Is the issue transit operations, adjacent public space, emergency response, behavioral health, or corridor design?",
    handoffFailure:
      "Transit property, city right-of-way, public safety response, health services, and regional corridor planning overlap at the same stop.",
    actualOwners: [
      {
        actorId: "trimet",
        role: "Transit operations and security",
        lever: "Stations, vehicles, service levels, transit security, capital projects",
      },
      {
        actorId: "portland",
        role: "Adjacent public space and emergency response",
        lever: "Police/fire response, streets, public right-of-way, local public-space management",
      },
      {
        actorId: "multnomah-county",
        role: "Health and human-service response",
        lever: "Behavioral health, crisis systems, outreach, county-contracted services",
      },
      {
        actorId: "metro",
        role: "Regional corridor planning",
        lever: "Growth, housing, regional transportation and land-use coordination",
      },
    ],
    sequence: [
      { label: "Incident appears on transit property", actorId: "trimet" },
      { label: "Adjacent right-of-way response", actorId: "portland" },
      { label: "Health or service need", actorId: "multnomah-county" },
      { label: "Corridor growth and access", actorId: "metro", failure: "Jurisdictional blur" },
    ],
  },
  {
    id: "student-support",
    label: "A student needs help",
    residentQuestion: "Who is responsible when a child needs more than classroom instruction?",
    visibleLayer: "Classroom, school office, family crisis",
    usuallyBlamed: "The school district",
    betterQuestion:
      "Is the need education, food, housing stability, disability services, mental health, child welfare, or transportation?",
    handoffFailure:
      "Schools see many problems first, but health care, benefits, child welfare, transportation, and family support sit outside the school district.",
    actualOwners: [
      {
        actorId: "schools",
        role: "Education and student services",
        lever: "Instruction, school stability, special education, counselors, family outreach",
      },
      {
        actorId: "oregon",
        role: "Education funding and statewide rules",
        lever: "State School Fund, graduation rules, child welfare, disability and education statutes",
      },
      {
        actorId: "multnomah-county",
        role: "Public health and family services",
        lever: "Health, mental health, family support, public health programs",
      },
      {
        actorId: "trimet",
        role: "Access and transportation",
        lever: "Student access to school, jobs, services, and activities",
      },
    ],
    sequence: [
      { label: "School identifies need", actorId: "schools" },
      { label: "State rules and funding apply", actorId: "oregon" },
      { label: "Family or health service needed", actorId: "multnomah-county" },
      { label: "Access depends on transportation", actorId: "trimet", failure: "School cannot solve every non-school barrier" },
    ],
  },
  {
    id: "hospital-public-health",
    label: "A health crisis spills into public life",
    residentQuestion: "Why does a medical or behavioral-health crisis become a public-space problem?",
    visibleLayer: "Emergency room, street, jail, shelter, transit, business district",
    usuallyBlamed: "The city, police, hospital, or county depending on where the crisis appears",
    betterQuestion:
      "Which layer controls clinical care, insurance payment, crisis response, public health, public safety, and discharge planning?",
    handoffFailure:
      "Health systems, Medicaid rules, county health, city emergency response, courts, and providers each own part of the path.",
    actualOwners: [
      {
        actorId: "health-systems",
        role: "Clinical care and discharge",
        lever: "Emergency departments, CCO coordination, providers, discharge planning",
      },
      {
        actorId: "oregon",
        role: "Medicaid and regulatory framework",
        lever: "OHA, OHP payment policy, licensing, civil commitment and court standards",
      },
      {
        actorId: "multnomah-county",
        role: "Public health and behavioral health",
        lever: "County health, crisis systems, behavioral-health contracts, jail health",
      },
      {
        actorId: "portland",
        role: "Emergency response and public space",
        lever: "Police, fire, Portland Street Response, public right-of-way impacts",
      },
    ],
    sequence: [
      { label: "Clinical crisis appears", actorId: "health-systems" },
      { label: "Payment and legal frame applies", actorId: "oregon" },
      { label: "County health response needed", actorId: "multnomah-county" },
      { label: "Visible public-space response", actorId: "portland", failure: "Health problem becomes civic disorder" },
    ],
  },
];
