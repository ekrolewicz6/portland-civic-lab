// City of Portland — Organizational Structure (mid-2026)
//
// Government form: Mayor–Council–Administrator (2022 charter reform, fully
// effective Jan 1, 2025). Operating structure: four service areas consolidated
// effective March 31, 2025, each led by a Deputy City Administrator (DCA)
// reporting to City Administrator Raymond C. Lee III. Reconciled against the
// FY2026-27 Current Service Level budget ("Core Realignment").
//
// This file is the canonical, version-controlled source of truth for the org
// chart. It is intentionally hand-curated reference data (not DB-backed): the
// structure changes a few times a year, every node carries a citation, and it
// must be reviewable in a pull request. Budget/FTE/salary attributes attach in
// later phases (see docs/org-chart-plan.md).
//
// Leaders / placements marked `unconfirmed: true` were NOT named on an official
// structural or leadership page as of the as-of date — treat with care and
// verify against the cited source before publishing as fact.

export const ORG_AS_OF = "2026-06-14";

export const ORG_SOURCES = {
  orgChart: "https://www.portland.gov/hello/org",
  leadership: "https://www.portland.gov/hello/city-leadership",
  serviceAreas: "https://www.portland.gov/service-areas",
  reorg2025:
    "https://www.portland.gov/hello/news/2025/3/31/portland-advances-centralized-organizational-structure-enhance-efficiency-and",
  budget: "https://www.portland.gov/budget",
  council: "https://www.portland.gov/council",
  auditor: "https://www.portland.gov/auditor/about",
} as const;

export type Branch = "elected" | "administration";

export type ServiceAreaSlug =
  | "elected"
  | "city-administrator"
  | "city-operations"
  | "community-economic-development"
  | "public-safety"
  | "public-works";

export type UnitType =
  | "root"
  | "branch"
  | "elected"
  | "council"
  | "district"
  | "administrator"
  | "service-area"
  | "bureau"
  | "office"
  | "division"
  | "program"
  | "board";

export type FundModel =
  | "general"
  | "enterprise"
  | "internal-service"
  | "levy"
  | "special-revenue"
  | "tif"
  | "mixed"
  | "unknown";

export interface OrgUnit {
  /** stable slug, unique across the whole tree */
  id: string;
  name: string;
  abbr?: string;
  type: UnitType;
  branch: Branch;
  /** which service area this node belongs to, for color + filtering */
  serviceArea: ServiceAreaSlug;
  leader?: string;
  leaderTitle?: string;
  fundModel?: FundModel;
  /** general descriptive note */
  notes?: string;
  /** what changed in the 2024/2025 reorganization, if anything */
  reorg2025?: string;
  /** leader and/or placement not confirmed on an official page */
  unconfirmed?: boolean;
  /** seat currently vacant */
  vacant?: boolean;
  /** authorized full-time-equivalent positions for THIS unit (budget Table 8) */
  fteAuthorized?: number;
  /** authorized FTE including all sub-units (computed at module load) */
  fteRollup?: number;
  /** official source URL for this node */
  source?: string;
  children?: OrgUnit[];
}

export interface ServiceAreaMeta {
  slug: ServiceAreaSlug;
  label: string;
  short: string;
  /** tailwind-friendly hex used for node accents + legend */
  color: string;
  blurb: string;
}

export const SERVICE_AREAS: ServiceAreaMeta[] = [
  {
    slug: "elected",
    label: "Elected Officials",
    short: "Elected",
    color: "#8a5a2b",
    blurb:
      "The Mayor, the 12-member City Council, and the independently elected City Auditor. Independent of the City Administrator.",
  },
  {
    slug: "city-administrator",
    label: "Office of the City Administrator",
    short: "City Admin",
    color: "#3f6f4e",
    blurb:
      "The City Administrator and executive-office direct reports — including the CFO/Bureau of Revenue & Financial Services, City Attorney, and citywide offices not housed in an operating service area.",
  },
  {
    slug: "city-operations",
    label: "City Operations",
    short: "Operations",
    color: "#2f6f8f",
    blurb:
      "The internal-services backbone: HR, technology, fleet & facilities, the City Budget Office, procurement, FPDR, and police accountability (OCPA).",
  },
  {
    slug: "community-economic-development",
    label: "Community & Economic Development",
    short: "CED",
    color: "#7a5aa0",
    blurb:
      "Housing, permitting, planning & sustainability, economic development (Prosper Portland), arts & culture, and the Children's Levy.",
  },
  {
    slug: "public-safety",
    label: "Public Safety",
    short: "Safety",
    color: "#b04a4a",
    blurb:
      "Police, Fire & Rescue, 9-1-1 (BOEC), emergency management, and the Community Safety office (violence prevention, Portland Street Response).",
  },
  {
    slug: "public-works",
    label: "Public Works",
    short: "Works",
    color: "#4a8a5a",
    blurb:
      "Transportation, the Water Bureau and Environmental Services (utility enterprise funds), and Parks & Recreation.",
  },
];

export const SERVICE_AREA_BY_SLUG: Record<ServiceAreaSlug, ServiceAreaMeta> =
  Object.fromEntries(SERVICE_AREAS.map((s) => [s.slug, s])) as Record<
    ServiceAreaSlug,
    ServiceAreaMeta
  >;

export const FUND_MODEL_LABELS: Record<FundModel, string> = {
  general: "General Fund",
  enterprise: "Enterprise (ratepayer)",
  "internal-service": "Internal service",
  levy: "Voter levy / charter fund",
  "special-revenue": "Special revenue",
  tif: "Tax-increment (urban renewal)",
  mixed: "Mixed funds",
  unknown: "Unknown",
};

// ─── The tree ────────────────────────────────────────────────────────────────

const electedBranch: OrgUnit = {
  id: "elected-officials",
  name: "Elected Officials",
  type: "branch",
  branch: "elected",
  serviceArea: "elected",
  notes:
    "The legislative and elected-executive branch, accountable directly to voters and independent of the City Administrator.",
  source: ORG_SOURCES.orgChart,
  children: [
    {
      id: "mayor",
      name: "Mayor",
      type: "elected",
      branch: "elected",
      serviceArea: "elected",
      leader: "Keith Wilson",
      leaderTitle: "Mayor",
      fundModel: "general",
      notes:
        "Chief executive under the new charter; not a Council member but breaks Council ties. Appoints and oversees the City Administrator.",
      source: ORG_SOURCES.orgChart,
    },
    {
      id: "city-council",
      name: "City Council",
      abbr: "Council",
      type: "council",
      branch: "elected",
      serviceArea: "elected",
      leader: "Jamie Dunphy (President, D1)",
      leaderTitle: "Council President; VP Olivia Clark (D4)",
      fundModel: "general",
      notes:
        "12-member legislative branch, three members from each of four geographic districts, elected by single transferable (ranked-choice) vote. President & VP elected Jan 14, 2026.",
      reorg2025:
        "New body created by the 2022 charter reform; first seated Jan 2, 2025, replacing the five-member commissioner council.",
      source: ORG_SOURCES.council,
      children: [
        {
          id: "council-d1",
          name: "District 1",
          type: "district",
          branch: "elected",
          serviceArea: "elected",
          notes: "Candace Avalos · Jamie Dunphy · Loretta Smith",
          source: ORG_SOURCES.council,
        },
        {
          id: "council-d2",
          name: "District 2",
          type: "district",
          branch: "elected",
          serviceArea: "elected",
          notes: "Dan Ryan · Elana Pirtle-Guiney · Sameer Kanal",
          source: ORG_SOURCES.council,
        },
        {
          id: "council-d3",
          name: "District 3",
          type: "district",
          branch: "elected",
          serviceArea: "elected",
          notes: "Angelita Morillo · Steve Novick · Tiffany Koyama Lane",
          source: ORG_SOURCES.council,
        },
        {
          id: "council-d4",
          name: "District 4",
          type: "district",
          branch: "elected",
          serviceArea: "elected",
          notes: "Olivia Clark · Mitch Green · Eric Zimmerman",
          source: ORG_SOURCES.council,
        },
      ],
    },
    {
      id: "city-auditor",
      name: "Office of the City Auditor",
      abbr: "Auditor",
      type: "elected",
      branch: "elected",
      serviceArea: "elected",
      leader: "Simone Rede",
      leaderTitle: "City Auditor",
      fundModel: "general",
      notes:
        "Independently elected citywide; structurally separate from both the Mayor and the City Administrator.",
      source: ORG_SOURCES.auditor,
      children: [
        {
          id: "audit-services",
          name: "Audit Services Division",
          type: "division",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "ombudsman",
          name: "Ombudsman",
          type: "office",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "elections-division",
          name: "Elections Division",
          type: "division",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "council-clerk",
          name: "Council Clerk",
          type: "office",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "hearings-office",
          name: "Hearings Office",
          type: "office",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "archives-records",
          name: "Archives & Records Management",
          type: "division",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
        {
          id: "fraud-hotline",
          name: "Fraud Hotline",
          type: "division",
          branch: "elected",
          serviceArea: "elected",
          unconfirmed: true,
          source: ORG_SOURCES.auditor,
        },
      ],
    },
  ],
};

const cfoOffice: OrgUnit = {
  id: "cfo-office",
  name: "Office of the CFO / Bureau of Revenue & Financial Services",
  abbr: "CFO / BRFS",
  type: "bureau",
  branch: "administration",
  serviceArea: "city-administrator",
  leader: "Jonas Biery",
  leaderTitle: "Chief Financial Officer & DCA, Budget & Finance",
  fundModel: "mixed",
  notes:
    "The CFO reports directly to the City Administrator rather than heading one of the four operating service areas.",
  reorg2025:
    "Core Realignment (FY2026-27): the CFO Office was realigned to reside within the City Administrator service area; Grants and the City Budget Office moved out to City Operations.",
  source: ORG_SOURCES.leadership,
  children: [
    {
      id: "accounting",
      name: "Accounting",
      type: "division",
      branch: "administration",
      serviceArea: "city-administrator",
      fundModel: "internal-service",
      unconfirmed: true,
      source: ORG_SOURCES.leadership,
    },
    {
      id: "revenue-division",
      name: "Revenue (Collections)",
      type: "division",
      branch: "administration",
      serviceArea: "city-administrator",
      fundModel: "general",
      notes: "Largest CFO program (~$124M); business license and other tax collection.",
      source: ORG_SOURCES.leadership,
    },
    {
      id: "public-finance-treasury",
      name: "Public Finance & Treasury",
      type: "division",
      branch: "administration",
      serviceArea: "city-administrator",
      fundModel: "internal-service",
      unconfirmed: true,
      source: ORG_SOURCES.leadership,
    },
    {
      id: "risk-management",
      name: "Risk Management",
      type: "division",
      branch: "administration",
      serviceArea: "city-administrator",
      fundModel: "internal-service",
      unconfirmed: true,
      source: ORG_SOURCES.leadership,
    },
  ],
};

const cityAdminDirectReports: OrgUnit[] = [
  cfoOffice,
  {
    id: "city-attorney",
    name: "Office of the City Attorney",
    type: "bureau",
    branch: "administration",
    serviceArea: "city-administrator",
    fundModel: "general",
    unconfirmed: true,
    source: ORG_SOURCES.budget,
  },
  {
    id: "office-equity",
    name: "Office of Equity & Human Rights",
    type: "office",
    branch: "administration",
    serviceArea: "city-administrator",
    fundModel: "general",
    unconfirmed: true,
    source: "https://www.portland.gov/officeofequity",
  },
  {
    id: "office-government-relations",
    name: "Office of Government Relations",
    type: "office",
    branch: "administration",
    serviceArea: "city-administrator",
    fundModel: "general",
    unconfirmed: true,
    source: ORG_SOURCES.leadership,
  },
  {
    id: "civic-life",
    name: "Office of Community & Civic Life",
    type: "office",
    branch: "administration",
    serviceArea: "city-administrator",
    fundModel: "general",
    unconfirmed: true,
    source: "https://www.portland.gov/transition/city-organization",
  },
  {
    id: "portland-solutions",
    name: "Portland Solutions",
    type: "program",
    branch: "administration",
    serviceArea: "city-administrator",
    fundModel: "general",
    notes:
      "Homelessness-response cluster (sheltering, impact reduction, PEMO, SSCC). Its ~$82M of programs and its staff are counted inside the Office of the City Administrator's budget line, not as a separate bureau — open that page to see them.",
    unconfirmed: true,
    source: ORG_SOURCES.leadership,
  },
];

const cityOperations: OrgUnit = {
  id: "sa-city-operations",
  name: "City Operations",
  type: "service-area",
  branch: "administration",
  serviceArea: "city-operations",
  leader: "Tracy Warren",
  leaderTitle: "Deputy City Administrator (also Chief HR Officer)",
  notes:
    "Internal-services service area. Tracy Warren is the Deputy City Administrator (and Chief Human Resources Officer); predecessor Sara Morrissey left in October 2025.",
  source: "https://www.portland.gov/service-areas/city-operations",
  children: [
    {
      id: "office-city-operations",
      name: "Office of City Operations (DCA office)",
      type: "office",
      branch: "administration",
      serviceArea: "city-operations",
      leader: "Tracy Warren",
      fundModel: "internal-service",
      notes:
        "Houses 311, Business Operations, Strategic/Special Projects, citywide Security, Asset Management, Grants, and enterprise Communications.",
      reorg2025: "Grants Division moved here from the CFO in the 2025 realignment.",
      source: ORG_SOURCES.leadership,
    },
    {
      id: "bhr",
      name: "Bureau of Human Resources",
      abbr: "BHR",
      type: "bureau",
      branch: "administration",
      serviceArea: "city-operations",
      leader: "Tracy Warren",
      leaderTitle: "Chief Human Resources Officer",
      fundModel: "internal-service",
      source: "https://www.portland.gov/bhr",
    },
    {
      id: "bts",
      name: "Bureau of Technology Services",
      abbr: "BTS",
      type: "bureau",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "internal-service",
      unconfirmed: true,
      source: "https://www.portland.gov/bts",
      children: [
        {
          id: "cgis",
          name: "Maps, GIS & Open Data (Corporate GIS)",
          type: "division",
          branch: "administration",
          serviceArea: "city-operations",
          fundModel: "internal-service",
          unconfirmed: true,
          source: "https://www.portland.gov/service-areas/city-operations",
        },
        {
          id: "printing-distribution",
          name: "Printing & Distribution",
          type: "division",
          branch: "administration",
          serviceArea: "city-operations",
          fundModel: "internal-service",
          unconfirmed: true,
          source: "https://www.portland.gov/service-areas/city-operations",
        },
      ],
    },
    {
      id: "bff",
      name: "Bureau of Fleet & Facilities",
      abbr: "BFF",
      type: "bureau",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "internal-service",
      notes: "Consolidated fleet (CityFleet) and facilities functions of the former Office of Management & Finance.",
      unconfirmed: true,
      source: "https://www.portland.gov/fleet-and-facilities",
      children: [
        {
          id: "facilities-services",
          name: "Facilities Services",
          type: "division",
          branch: "administration",
          serviceArea: "city-operations",
          fundModel: "internal-service",
          unconfirmed: true,
          source: "https://www.portland.gov/service-areas/city-operations",
        },
      ],
    },
    {
      id: "cbo",
      name: "City Budget Office",
      abbr: "CBO",
      type: "bureau",
      branch: "administration",
      serviceArea: "city-operations",
      leader: "Ruth Levine",
      fundModel: "general",
      reorg2025: "Moved to City Operations in the 2025 realignment.",
      source: ORG_SOURCES.budget,
    },
    {
      id: "fpdr",
      name: "Fire & Police Disability & Retirement",
      abbr: "FPDR",
      type: "bureau",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "levy",
      notes: "Charter-established, separately levied fund; the largest City Operations bureau (~$354M).",
      reorg2025: "Moved to City Operations in the 2025 realignment.",
      unconfirmed: true,
      source: "https://www.portland.gov/fpdr",
    },
    {
      id: "ocpa",
      name: "Office of Community-Based Police Accountability",
      abbr: "OCPA",
      type: "office",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "general",
      vacant: true,
      notes:
        "Director seat vacant / in active recruitment (June 2026). Includes the 21-member volunteer Community Board for Police Accountability (CBPA, first appointed Jun 2025). Charter-rooted independence; administratively in City Operations, NOT Public Safety.",
      reorg2025: "Replaces the sunset Independent Police Review (IPR).",
      source:
        "https://www.portland.gov/ocpa/news/2026/6/2/office-community-based-police-accountability-director-recruitment",
    },
    {
      id: "procurement",
      name: "Procurement & Business Opportunities",
      type: "office",
      branch: "administration",
      serviceArea: "city-operations",
      leader: "Sylvester Donelson, Jr.",
      leaderTitle: "Chief Procurement Officer",
      fundModel: "internal-service",
      source: "https://www.portland.gov/business-opportunities/about-us",
    },
    {
      id: "small-donor-elections",
      name: "Small Donor Elections",
      type: "office",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "general",
      notes: "Quasi-independent public campaign-financing program.",
      unconfirmed: true,
      source: "https://www.portland.gov/smalldonorelections",
    },
    {
      id: "communications",
      name: "Communications",
      type: "office",
      branch: "administration",
      serviceArea: "city-operations",
      fundModel: "general",
      notes:
        "Enterprise communications, consolidated citywide in the 2025 reorg; sits in the City Operations DCA portfolio.",
      source: ORG_SOURCES.leadership,
    },
  ],
};

const communityEconomicDevelopment: OrgUnit = {
  id: "sa-ced",
  name: "Community & Economic Development",
  abbr: "CED",
  type: "service-area",
  branch: "administration",
  serviceArea: "community-economic-development",
  leader: "Donnie Oliveira",
  leaderTitle: "Deputy City Administrator",
  source:
    "https://www.portland.gov/budget/2025-2026-budget/documents/community-economic-development-service-area-summary/download",
  children: [
    {
      id: "office-ced",
      name: "Office of Community & Economic Development (DCA office)",
      type: "office",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Donnie Oliveira",
      fundModel: "general",
      source: ORG_SOURCES.serviceAreas,
      children: [
        {
          id: "spectator-venues",
          name: "Spectator Venues & Visitor Activities",
          type: "program",
          branch: "administration",
          serviceArea: "community-economic-development",
          leader: "Karl Lisle",
          fundModel: "enterprise",
          notes: "Self-sustaining venue fund.",
          source: ORG_SOURCES.serviceAreas,
        },
      ],
    },
    {
      id: "ppd",
      name: "Portland Permitting & Development",
      abbr: "PP&D",
      type: "bureau",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Eric Kutch",
      fundModel: "enterprise",
      notes: "Permit-fee funded.",
      reorg2025: "Renamed/consolidated from the former Bureau of Development Services.",
      source: "https://www.portland.gov/ppd",
    },
    {
      id: "phb",
      name: "Portland Housing Bureau",
      abbr: "PHB",
      type: "bureau",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Quisha Light (Interim)",
      fundModel: "mixed",
      notes: "General Fund plus restricted housing funds.",
      source: "https://www.portland.gov/phb",
    },
    {
      id: "bps",
      name: "Bureau of Planning & Sustainability",
      abbr: "BPS",
      type: "bureau",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Eric Engstrom",
      fundModel: "mixed",
      notes: "General Fund plus the PCEF (Portland Clean Energy Fund) restricted fund.",
      source: "https://www.portland.gov/bps",
    },
    {
      id: "prosper-portland",
      name: "Prosper Portland",
      type: "bureau",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Lisa Abuaf (Interim ED)",
      fundModel: "tif",
      notes: "Semi-independent economic-development agency with its own Board of Commissioners; tax-increment + General Fund.",
      source: "https://www.prosperportland.us/",
    },
    {
      id: "childrens-levy",
      name: "Portland Children's Levy",
      abbr: "PCL",
      type: "office",
      branch: "administration",
      serviceArea: "community-economic-development",
      fundModel: "levy",
      unconfirmed: true,
      source: "https://www.portland.gov/childrenslevy",
    },
    {
      id: "arts-culture",
      name: "Office of Arts & Culture",
      type: "office",
      branch: "administration",
      serviceArea: "community-economic-development",
      leader: "Chariti Montez",
      fundModel: "general",
      notes: "Rolls into the CED DCA office in the budget rather than being a standalone budget line.",
      reorg2025: "Launched Jul 1, 2024, consolidating the former OMF arts program and Parks arts.",
      source: "https://www.portland.gov/arts",
    },
  ],
};

const publicSafety: OrgUnit = {
  id: "sa-public-safety",
  name: "Public Safety",
  type: "service-area",
  branch: "administration",
  serviceArea: "public-safety",
  leader: "Vacant",
  leaderTitle: "Deputy City Administrator (City Administrator Lee overseeing on interim)",
  vacant: true,
  notes: "DCA seat vacant after Bob Cozzie departed May 18, 2026; national search underway.",
  source: "https://www.portland.gov/community-safety",
  children: [
    {
      id: "community-safety",
      name: "Community Safety (Office of the Public Safety DCA)",
      type: "office",
      branch: "administration",
      serviceArea: "public-safety",
      fundModel: "general",
      reorg2025:
        "Created Jul 2024 as the Enterprise Services Division; renamed Community Safety Jan 2025.",
      unconfirmed: true,
      source: "https://www.portland.gov/community-safety",
      children: [
        {
          id: "ovp",
          name: "Office of Violence Prevention",
          abbr: "OVP",
          type: "program",
          branch: "administration",
          serviceArea: "public-safety",
          fundModel: "general",
          notes: "Programs: Ceasefire, Safe Blocks, Rose City Self-Defense, Community Peace Collaborative.",
          unconfirmed: true,
          source: "https://www.portland.gov/violenceprevention",
        },
        {
          id: "psr",
          name: "Portland Street Response",
          abbr: "PSR",
          type: "program",
          branch: "administration",
          serviceArea: "public-safety",
          fundModel: "general",
          notes: "Program manager position in active recruitment as of mid-2026.",
          reorg2025: "Moved here out of Portland Fire & Rescue in Jan 2025.",
          vacant: true,
          source: "https://www.portland.gov/streetresponse",
        },
      ],
    },
    {
      id: "ppb",
      name: "Portland Police Bureau",
      abbr: "PPB",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-safety",
      leader: "Bob Day",
      leaderTitle: "Chief of Police",
      fundModel: "general",
      source: "https://www.portland.gov/police",
    },
    {
      id: "pfr",
      name: "Portland Fire & Rescue",
      abbr: "PF&R",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-safety",
      fundModel: "general",
      unconfirmed: true,
      source: "https://www.portland.gov/fire",
    },
    {
      id: "boec",
      name: "Bureau of Emergency Communications (9-1-1)",
      abbr: "BOEC",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-safety",
      leader: "Steve Mawdsley",
      fundModel: "mixed",
      notes: "General Fund plus partner-jurisdiction revenue.",
      source: "https://www.portland.gov/911",
    },
    {
      id: "pbem",
      name: "Portland Bureau of Emergency Management",
      abbr: "PBEM",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-safety",
      fundModel: "general",
      unconfirmed: true,
      source: "https://www.portland.gov/pbem",
    },
  ],
};

const publicWorks: OrgUnit = {
  id: "sa-public-works",
  name: "Public Works",
  type: "service-area",
  branch: "administration",
  serviceArea: "public-works",
  leader: "Priya Dhanapal",
  leaderTitle: "Deputy City Administrator",
  source: "https://www.portland.gov/service-areas/public-works",
  children: [
    {
      id: "office-public-works",
      name: "Office of Public Works (DCA office)",
      type: "office",
      branch: "administration",
      serviceArea: "public-works",
      leader: "Priya Dhanapal",
      fundModel: "general",
      source: "https://www.portland.gov/service-areas/public-works",
    },
    {
      id: "pbot",
      name: "Portland Bureau of Transportation",
      abbr: "PBOT",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-works",
      fundModel: "special-revenue",
      notes: "Funded largely by the transportation/gas-tax special-revenue fund.",
      unconfirmed: true,
      source: "https://www.portland.gov/transportation",
    },
    {
      id: "water",
      name: "Portland Water Bureau",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-works",
      fundModel: "enterprise",
      notes: "Ratepayer-funded water utility; carries large capital + revenue-bond debt (e.g. Bull Run filtration).",
      unconfirmed: true,
      source: "https://www.portland.gov/water",
    },
    {
      id: "bes",
      name: "Bureau of Environmental Services",
      abbr: "BES",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-works",
      fundModel: "enterprise",
      notes: "Ratepayer-funded sewer & stormwater utility.",
      unconfirmed: true,
      source: "https://www.portland.gov/bes",
    },
    {
      id: "parks",
      name: "Portland Parks & Recreation",
      abbr: "PP&R",
      type: "bureau",
      branch: "administration",
      serviceArea: "public-works",
      fundModel: "mixed",
      notes: "General Fund plus the Parks Local Option Levy.",
      reorg2025: "Moved into Public Works from the dissolved Vibrant Communities service area.",
      unconfirmed: true,
      source: "https://www.portland.gov/parks",
    },
  ],
};

const administrationBranch: OrgUnit = {
  id: "office-city-administrator",
  name: "Office of the City Administrator",
  type: "administrator",
  branch: "administration",
  serviceArea: "city-administrator",
  leader: "Raymond C. Lee III",
  leaderTitle: "City Administrator",
  notes:
    "Appointed by and reporting to the Mayor; oversees all four service-area DCAs, the CFO, and the executive-office portfolio.",
  reorg2025:
    "Bureaus were moved under the City Administrator on Jul 1, 2024 (soft launch); the four-service-area model was consolidated Mar 31, 2025.",
  source: ORG_SOURCES.leadership,
  children: [
    ...cityAdminDirectReports,
    cityOperations,
    communityEconomicDevelopment,
    publicSafety,
    publicWorks,
  ],
};

export const ORG_TREE: OrgUnit = {
  id: "city-of-portland",
  name: "City of Portland",
  type: "root",
  branch: "administration",
  serviceArea: "elected",
  notes:
    "Mayor–Council–Administrator form of government (2022 charter reform, effective Jan 1, 2025). Voters elect the Mayor, the 12-member Council, and the Auditor; the Mayor appoints the City Administrator, who runs day-to-day operations through four service areas.",
  source: ORG_SOURCES.orgChart,
  children: [electedBranch, administrationBranch],
};

// Budget-aggregation constructs intentionally excluded from the operating org
// chart: "Fund and Debt Management" (City Administrator) and "Special
// Appropriations" (City Operations). Independent Police Review (IPR) is omitted
// as superseded by OCPA/CBPA.

// ─── Authorized headcount (FTE) ──────────────────────────────────────────────
//
// Source: FY2025-26 Adopted Budget, Volume 1, Table 8 "Summary of Authorized
// Positions" — regular permanent + limited-term full- and part-time FTE
// authorized in each bureau (temporary part-time excluded). These are
// AUTHORIZED positions, not filled headcount. Transcribed verbatim from the
// budget PDF; the citywide total below is the table's own Total row.
export const FTE_FISCAL_YEAR = "FY2025-26 Adopted";
export const TOTAL_AUTHORIZED_FTE = 7284.31;
export const FTE_SOURCE =
  "https://www.portland.gov/budget/documents/fy-2025-26-city-portland-adopted-budget-vol-1-city-summaries-and-bureau-budgets/download";

const AUTHORIZED_FTE: Record<string, number> = {
  // Elected
  mayor: 9.0,
  "city-council": 52.0,
  "city-auditor": 47.0,
  // City Administrator office + executive direct reports
  "office-city-administrator": 47.0,
  "cfo-office": 204.0,
  "city-attorney": 80.5,
  "office-equity": 16.0,
  "office-government-relations": 10.0,
  "civic-life": 9.9,
  // City Operations
  "office-city-operations": 164.0,
  bhr: 110.0,
  bts: 276.0,
  bff: 150.0,
  cbo: 18.0,
  fpdr: 18.0,
  ocpa: 6.0,
  // Community & Economic Development
  "office-ced": 12.0,
  ppd: 340.9,
  phb: 90.0,
  bps: 173.7,
  "childrens-levy": 7.8,
  // Public Safety
  "community-safety": 126.0,
  ppb: 1215.9,
  pfr: 782.4,
  boec: 169.9,
  pbem: 23.9,
  // Public Works
  "office-public-works": 10.0,
  pbot: 1044.0,
  water: 624.8,
  bes: 658.0,
  parks: 784.61,
  // Note: Prosper Portland (semi-independent agency), Arts & Culture, Spectator
  // Venues, Procurement, and Small Donor Elections are not separate lines in
  // Table 8 — their staff roll up into the parent office's count above.
};

// Attach own FTE and compute inclusive rollups once, at module load.
function attachFte(node: OrgUnit): number {
  const own = AUTHORIZED_FTE[node.id] ?? 0;
  let childRollup = 0;
  node.children?.forEach((c) => {
    childRollup += attachFte(c);
  });
  const rollup = own + childRollup;
  if (own) node.fteAuthorized = own;
  if (rollup) node.fteRollup = Math.round(rollup * 100) / 100;
  return rollup;
}
attachFte(ORG_TREE);

// ─── Confirmed leadership (mid-2026) ─────────────────────────────────────────
//
// Each leader below was verified on the cited official portland.gov page (a few
// via official city news releases). Applied at module load: sets the leader and
// clears the "unconfirmed" tag. Two are medium-confidence: Parks (Schmanski is
// interim; official Parks leadership pages are silent, name from city news) and
// Archives (name from a 2024 hire announcement). Genuinely vacant seats — the
// Public Safety DCA, OCPA director, and PSR program manager — are marked vacant
// in the tree above, not here.
function findById(node: OrgUnit, id: string): OrgUnit | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findById(child, id);
    if (found) return found;
  }
  return undefined;
}

const LEADER_CONFIRMATIONS: Record<
  string,
  { leader: string; leaderTitle: string; source: string }
> = {
  "city-attorney": { leader: "Robert L. Taylor", leaderTitle: "City Attorney", source: "https://www.portland.gov/attorney/general-information-and-staff" },
  "office-equity": { leader: "Latricia Tillman", leaderTitle: "Chief Equity Officer", source: "https://www.portland.gov/hello/news/2026/4/29/diversity-champion-be-portlands-first-chief-equity-officer" },
  "office-government-relations": { leader: "Sam Chase", leaderTitle: "Director", source: "https://www.portland.gov/ogr/meet-staff" },
  "portland-solutions": { leader: "Skyler Brocker-Knapp", leaderTitle: "Director", source: "https://www.portland.gov/shelter-services/about-portland-solutions" },
  bts: { leader: "Elyse Rosenberg", leaderTitle: "Chief Information Officer", source: "https://www.portland.gov/bts/news/2025/7/18/city-portland-names-elyse-rosenberg-new-chief-information-officer" },
  bff: { leader: "Maty Sauter", leaderTitle: "Director", source: "https://www.portland.gov/fleet-and-facilities" },
  fpdr: { leader: "Sam Hutchison", leaderTitle: "Director & Fund Administrator", source: "https://www.portland.gov/fpdr" },
  "small-donor-elections": { leader: "Susan Mottet", leaderTitle: "Director", source: "https://www.portland.gov/smalldonorelections" },
  "community-safety": { leader: "Stephanie Howard", leaderTitle: "Director of Community Safety", source: "https://www.portland.gov/community-safety" },
  ovp: { leader: "Jamie Evans-Butler", leaderTitle: "Program Manager", source: "https://www.portland.gov/community-safety/ovp/ovp-team" },
  pfr: { leader: "Lauren Johnson", leaderTitle: "Fire Chief", source: "https://www.portland.gov/fire/organization-portland-fire-rescue" },
  pbem: { leader: "Elisabeth Perez", leaderTitle: "Interim Director", source: "https://www.portland.gov/community-safety/news/2026/2/9/city-portland-announces-leadership-transition-emergency-management" },
  pbot: { leader: "Millicent D. Williams", leaderTitle: "Director", source: "https://www.portland.gov/transportation/director" },
  water: { leader: "Ting Lu", leaderTitle: "Director of Public Utilities", source: "https://www.portland.gov/water/about-us" },
  bes: { leader: "Ting Lu", leaderTitle: "Director of Public Utilities", source: "https://www.portland.gov/bes/about" },
  parks: { leader: "Sonia Schmanski", leaderTitle: "Interim Director", source: "https://www.portland.gov/parks" },
  "childrens-levy": { leader: "Meg McElroy", leaderTitle: "Interim Director", source: "https://portlandchildrenslevy.org/about/staff/" },
  phb: { leader: "Quisha Light", leaderTitle: "Interim Bureau Director", source: "https://www.portland.gov/phb/about/executive-team" },
  ppd: { leader: "Eric Kutch", leaderTitle: "Director", source: "https://www.portland.gov/ppd/about-portland-permitting-development" },
  "audit-services": { leader: "KC Jones", leaderTitle: "Director, Audit Services", source: "https://www.portland.gov/auditor/audit-services/about-us/meet-staff" },
  ombudsman: { leader: "Jennifer Croft", leaderTitle: "City Ombudsman", source: "https://www.portland.gov/auditor/ombudsman/about-us" },
  "elections-division": { leader: "Deborah Scroggin", leaderTitle: "Elections Division Manager", source: "https://www.portland.gov/auditor/elections/about-us" },
  "council-clerk": { leader: "Keelan McClymont", leaderTitle: "Council Clerk", source: "https://www.portland.gov/council" },
  "hearings-office": { leader: "Charles Koutras", leaderTitle: "Chief Hearings Officer", source: "https://www.portland.gov/auditor/news/2025/8/5/portland-city-auditor-hires-new-chief-hearings-officer" },
  "archives-records": { leader: "Madeline Moya", leaderTitle: "City Archivist", source: "https://www.portland.gov/auditor/news/2024/1/8/city-portland-auditor-hires-new-city-archivist" },
};

for (const [id, c] of Object.entries(LEADER_CONFIRMATIONS)) {
  const node = findById(ORG_TREE, id);
  if (node) {
    node.leader = c.leader;
    node.leaderTitle = c.leaderTitle;
    node.source = c.source;
    delete node.unconfirmed;
  }
}

// Units whose placement is certain but which have no published individual lead
// (or whose lead role is administered elsewhere): clear the "unconfirmed" tag.
// It should signal structural uncertainty, not merely a missing name.
const CLEAR_UNCONFIRMED: Record<string, string | null> = {
  accounting: null,
  "public-finance-treasury": null,
  "risk-management": null,
  cgis: null,
  "printing-distribution": null,
  "facilities-services": null,
  "fraud-hotline":
    "Administered by Audit Services (Director KC Jones); no separate hotline lead.",
  "civic-life":
    "Leadership in transition (2026); no director currently named on portland.gov.",
};

for (const [id, note] of Object.entries(CLEAR_UNCONFIRMED)) {
  const node = findById(ORG_TREE, id);
  if (node) {
    delete node.unconfirmed;
    if (note) node.notes = note;
  }
}
