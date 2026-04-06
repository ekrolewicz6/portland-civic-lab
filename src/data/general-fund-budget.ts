// Portland General Fund Budget Data — FY 2026-27
// Source: City Budget Office, General Fund Forecast & CAL Tables (March 2026 Update)
// Program Offers: FY 26-27 Current Service Level Submissions by Service Area
// Reduction Scenarios: Budget Scenario Options FY 2026-27 (446-page document, Feb 2026)
// All figures in dollars unless noted

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RevenueSource {
  name: string;
  amount: number;
}

export interface ProgramAllocation {
  name: string;
  amount: number;
  priorYear?: number; // FY 2025-26
}

export interface ReductionScenario {
  magnitude: "3%" | "10%" | "CSL";
  title: string;
  amount: number;
  description: string;
  serviceImpact: string;
  fteImpact?: number;
}

export interface BureauAllocation {
  code: string;
  name: string;
  serviceArea: string;
  discretionary: number;
  overhead: number;
  total: number;
  category: "public-safety" | "community-dev" | "operations" | "public-works" | "elected" | "transfers" | "other";
  programs: ProgramAllocation[];
  reductionScenarios: ReductionScenario[];
}

export interface CashTransfer {
  name: string;
  amount: number;
}

export interface ForecastYear {
  year: string;
  revenue: number;
  expenses: number;
  gap: number;
}

export interface BudgetData {
  fiscalYear: string;
  totalCityBudget: number;
  dataSource: string;
  lastVerified: string;
  generalFund: {
    totalRevenue: number;
    totalExpenses: number;
    deficit: number;
    revenueSources: RevenueSource[];
    bureaus: BureauAllocation[];
    cashTransfers: CashTransfer[];
  };
  fiveYearForecast: ForecastYear[];
}

// ─── Revenue Sources ─────────────────────────────────────────────────────────
// From Table 1: Five-Year General Fund Revenues Forecast

const revenueSources: RevenueSource[] = [
  { name: "Property Taxes", amount: 365_500_000 },
  { name: "Business Licenses", amount: 217_800_000 },
  { name: "Utility License/Franchise", amount: 111_500_000 },
  { name: "Transient Lodging", amount: 26_000_000 },
  { name: "State Revenues", amount: 19_500_000 },
  { name: "Other Revenues", amount: 2_200_000 },
];

// ─── Bureau Allocations ──────────────────────────────────────────────────────
// From CAL Bureaus sheet — exact FY 2026-27 Current Appropriation Level

const bureaus: BureauAllocation[] = [
  {
    code: "PPB",
    name: "Portland Police Bureau",
    serviceArea: "Public Safety",
    discretionary: 265_729_057,
    overhead: 0,
    total: 265_729_057,
    category: "public-safety",
    programs: [
      { name: "Precinct Patrol", amount: 105_167_999, priorYear: 119_308_992 },
      { name: "Enterprise Support", amount: 39_919_021, priorYear: 38_351_753 },
      { name: "Person Crimes Investigation", amount: 26_932_504, priorYear: 22_323_769 },
      { name: "Chief & Staff", amount: 18_491_538, priorYear: 5_104_550 },
      { name: "Records", amount: 15_964_823, priorYear: 15_331_037 },
      { name: "Information Technology", amount: 12_810_631, priorYear: 11_525_080 },
      { name: "Forensic Evidence", amount: 8_828_027, priorYear: 9_010_166 },
      { name: "Standards & Accountability", amount: 7_047_083, priorYear: 6_338_713 },
      { name: "Child Abuse Services", amount: 6_630_249, priorYear: 2_062_512 },
      { name: "Personnel", amount: 6_011_519, priorYear: 6_155_647 },
      { name: "Public Safety Support Specialist", amount: 5_449_273, priorYear: 0 },
      { name: "Behavioral Health Unit", amount: 4_200_314, priorYear: 3_683_705 },
      { name: "Focused Intervention Team (FIT)", amount: 3_640_754, priorYear: 2_919_317 },
      { name: "Property Evidence", amount: 3_106_199, priorYear: 2_971_790 },
      { name: "Community Engagement", amount: 1_197_922, priorYear: 1_401_468 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Eliminate Advanced Academy + reduce fleet + cut admin staff",
        amount: 7_962_000,
        description:
          "Eliminates the 10-week Advanced Academy training program for recruits, reduces patrol vehicles, and removes administrative support and desk clerks at North and East Precincts.",
        serviceImpact:
          "New officers enter patrol with less training. Fewer vehicles reduce deployment flexibility and increase response times during peak demand. Administrative duties shift to sworn officers, pulling them off patrol.",
        fteImpact: 5,
      },
      {
        magnitude: "10%",
        title: "Halt officer hiring + $6M overtime cut + eliminate PS3 & Victim Services",
        amount: 26_573_000,
        description:
          "Halts all officer hiring for FY 2026-27 (losing 68 FTE through attrition), cuts $6M in backfill overtime (65,000 hours), eliminates the Public Safety Support Specialist program and Victim Services Unit.",
        serviceImpact:
          "Patrol staffing falls significantly. Low-acuity calls currently handled by PS3s return to sworn officers or go unanswered. Crime victims of sexual assault, trafficking, and bias crimes lose dedicated support. Long-term staffing recovery takes 3+ years due to 18-36 month hiring pipeline.",
        fteImpact: 68,
      },
    ],
  },
  {
    code: "PFR",
    name: "Portland Fire & Rescue",
    serviceArea: "Public Safety",
    discretionary: 163_834_487,
    overhead: 0,
    total: 163_834_487,
    category: "public-safety",
    // Note: PF&R GF programs total $213.7M but includes grant-funded CHAT positions.
    // $163.8M is the direct CAL allocation. Programs below scaled to CAL proportions.
    programs: [
      { name: "Emergency Operations", amount: 116_400_000 },
      { name: "Logistics", amount: 15_370_000 },
      { name: "Management Services", amount: 10_930_000 },
      { name: "Prevention", amount: 10_250_000 },
      { name: "Training and Safety", amount: 8_680_000 },
      { name: "Community Health (CHAT)", amount: 1_620_000 },
      { name: "Chief's Office", amount: 584_487 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Reduce apparatus replacement + cut turnout gear inventory",
        amount: 4_915_000,
        description:
          "Reduces the apparatus replacement budget and turnout gear inventory. Also proposes fee increases to improve cost recovery for permitting programs.",
        serviceImpact:
          "Increased apparatus downtime as aging equipment stays in service longer. Reduced redundancy in protective equipment for firefighters. Higher fees for fire permits and inspections passed to the public.",
      },
      {
        magnitude: "10%",
        title: "Reduce on-duty firefighter staffing + brown out stations",
        amount: 16_383_000,
        description:
          "Reduces on-duty firefighter staffing levels, potentially browning out fire stations. Combined with apparatus cuts, this significantly reduces geographic coverage.",
        serviceImpact:
          "Longer response times for fires and medical emergencies. Reduced geographic coverage — some neighborhoods lose their nearest fire station. Risk of lower Insurance Services Office (ISO) ratings, potentially raising homeowner insurance premiums citywide.",
        fteImpact: 40,
      },
    ],
  },
  {
    code: "PARKS",
    name: "Portland Parks & Recreation",
    serviceArea: "Public Works",
    discretionary: 81_326_099,
    overhead: 0,
    total: 81_326_099,
    category: "public-works",
    // Note: Parks total program spending is $185M (GF + Parks Levy + fees).
    // The $81.3M below is only the General Fund discretionary portion.
    // Programs shown are GF-only estimates proportional to the $81.3M allocation.
    programs: [
      { name: "Parks Maintenance", amount: 13_350_000 },
      { name: "Facility/Amenity Maintenance", amount: 8_650_000 },
      { name: "Community & Socialization", amount: 7_325_000 },
      { name: "Recreation Facility Operations", amount: 5_360_000 },
      { name: "Aquatics", amount: 5_120_000 },
      { name: "Visitor Services", amount: 4_110_000 },
      { name: "Business Services", amount: 22_280_000 },
      { name: "Sports and Games", amount: 3_110_000 },
      { name: "Natural Area Maintenance", amount: 2_930_000 },
      { name: "Community Engagement", amount: 2_660_000 },
      { name: "Other (Arts, Forestry, Planning, etc.)", amount: 6_431_099 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Revenue optimization + reduce non-core functions",
        amount: 2_440_000,
        description:
          "Generates new revenue through fee adjustments and optimizes existing capacity. Reduces investments classified as 'important' rather than 'critical' or 'core.'",
        serviceImpact:
          "Higher fees for some recreational programs. Reduced programming in areas classified as supporting broader City goals rather than core Parks functions.",
      },
      {
        magnitude: "10%",
        title: "Cut daily maintenance + reduce community centers + program reductions",
        amount: 8_133_000,
        description:
          "Impacts services solely delivered by Parks: daily maintenance and care of parks and natural areas, availability of community centers, and programming for some underserved populations.",
        serviceImpact:
          "Visibly dirtier parks, less frequent mowing and litter pickup. Some community centers reduce hours or close. Programming cuts to underserved populations — youth, seniors, and low-income communities who rely on free/low-cost recreation.",
        fteImpact: 25,
      },
    ],
  },
  {
    code: "BOEC",
    name: "Bureau of Emergency Communications",
    serviceArea: "Public Safety",
    discretionary: 25_229_267,
    overhead: 0,
    total: 25_229_267,
    category: "public-safety",
    // Note: BOEC total budget is $41.9M (GF + intergovernmental). $25.2M is GF portion.
    programs: [
      { name: "9-1-1 Operations", amount: 20_550_000 },
      { name: "Technology Systems", amount: 3_320_000 },
      { name: "Administration & Support", amount: 1_359_267 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Eliminate night security + reduce overtime + cut training",
        amount: 892_000,
        description:
          "Eliminates overnight security at the BOEC facility, reduces operational overtime for 6 months of the year (~860 hours/month), and cuts training and travel budget by 60%.",
        serviceImpact:
          "Delayed 911 call-answer times during non-summer months. Fewer staff attend professional development. Reduced quality assurance reviews for call handling.",
      },
      {
        magnitude: "10%",
        title: "Cut 4 admin staff + 6 dispatchers + reduce QA",
        amount: 2_082_000,
        description:
          "Eliminates 4 administrative support positions (20% of non-responder staff) and 6 dispatcher positions. Reduces quality assurance reviews and in-service training.",
        serviceImpact:
          "Longer 911 hold times. Reduced capacity to answer calls during surges. 3-year pipeline to replace dispatchers means cuts take years to recover from. Disproportionately impacts communities with higher violent crime rates.",
        fteImpact: 10,
      },
    ],
  },
  {
    code: "DCA-PS",
    name: "Office of Public Safety",
    serviceArea: "Public Safety",
    discretionary: 21_685_328,
    overhead: 658_900,
    total: 22_344_228,
    category: "public-safety",
    programs: [
      { name: "Portland Street Response", amount: 11_106_427, priorYear: 9_452_602 },
      { name: "CAO Public Safety", amount: 9_930_550, priorYear: 8_831_814 },
      { name: "Ceasefire", amount: 7_369_453, priorYear: 7_733_040 },
      { name: "Office of Violence Prevention", amount: 4_693_148, priorYear: 4_523_385 },
      { name: "Special Appropriations COCL/PCCEP", amount: 651_901, priorYear: 787_996 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Reduce PSR responder teams + cut OVP capacity",
        amount: 670_000,
        description:
          "Eliminates PSR responder and aftercare teams and reduces Office of Violence Prevention and Ceasefire capacity.",
        serviceImpact:
          "Reduced access to non-police crisis response for behavioral health calls. Weakened Portland's violence prevention infrastructure. Nearly all programmatic resources rely on expiring one-time funds.",
      },
      {
        magnitude: "10%",
        title: "Eliminate multiple PSR teams + scale back EMS resources",
        amount: 2_234_000,
        description:
          "Eliminates several PSR responder and aftercare teams, further reduces OVP and Ceasefire, and scales back EMS resources.",
        serviceImpact:
          "Significant reduction in alternative-to-police crisis response. Portland Street Response — which handles behavioral health calls that don't require sworn officers — loses substantial capacity. Violence prevention outreach curtailed.",
        fteImpact: 8,
      },
    ],
  },
  {
    code: "PBEM",
    name: "Portland Bureau of Emergency Management",
    serviceArea: "Public Safety",
    discretionary: 0,
    overhead: 5_185_237,
    total: 5_185_237,
    category: "public-safety",
    // Note: PBEM total GF programs = $7.9M; the $5.2M here is the CAL overhead allocation.
    programs: [],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Reclassify vacant positions + eliminate vehicles",
        amount: 155_000,
        description:
          "Reclassifies four vacant positions to lower classifications and eliminates five bureau vehicles.",
        serviceImpact:
          "Limits ability to recruit experienced staff. Reduces flexibility for fieldwork and partner coordination. Core emergency management functions continue.",
      },
    ],
  },
  {
    code: "CA",
    name: "City Administrator's Office",
    serviceArea: "City Administrator",
    discretionary: 9_724_686,
    overhead: 1_057_408,
    total: 10_782_094,
    category: "operations",
    // Note: City Admin oversees $79.7M in GF programs (shelters, IRP, PEMO) but
    // most is funded through transfers and PCEF, not the bureau's direct $10.8M CAL allocation.
    // The shelter programs ($35M alt + $19.8M overnight) are funded by GF transfers from PHB,
    // PCEF, opioid funds, and state resources — not from this bureau's CAL.
    programs: [
      { name: "Administration & Support", amount: 987_003 },
      { name: "Assistant City Administrator", amount: 875_580 },
      { name: "Portland Solutions Operations", amount: 1_095_232 },
      { name: "Other direct CAL programs", amount: 7_824_279 },
    ],
    reductionScenarios: [
      {
        magnitude: "CSL",
        title: "Shelter funding gap — close 2 sites without new revenue",
        amount: 3_350_000,
        description:
          "The Alternative Shelter program's $35M CSL leaves a ~$3.35M budget shortfall. Without funding from the state, county, or another intergovernmental source, the program will close 2 Alternative Shelter sites.",
        serviceImpact:
          "Two shelter sites close, removing approximately 200 beds from the system. Remaining 8 sites continue operating.",
      },
      {
        magnitude: "10%",
        title: "IRP cuts — 1,800 fewer campsite removals",
        amount: 639_000,
        description:
          "Cuts Impact Reduction Program budget by $639K, resulting in approximately 1,800 fewer campsite removals next year (5,879 vs. 7,670 CSL target).",
        serviceImpact:
          "Visible increase in unsanctioned campsites. Slower response to campsite reports from residents and businesses.",
      },
    ],
  },
  {
    code: "BPS",
    name: "Bureau of Planning & Sustainability",
    serviceArea: "Community & Economic Development",
    discretionary: 14_765_515,
    overhead: 0,
    total: 14_765_515,
    category: "community-dev",
    programs: [
      { name: "Business Services", amount: 4_504_363, priorYear: 3_124_213 },
      { name: "Smart Cities Program", amount: 2_263_251, priorYear: 2_778_449 },
      { name: "General Planning", amount: 2_210_848, priorYear: 2_126_388 },
      { name: "Urban Design", amount: 1_640_830, priorYear: 1_535_825 },
      { name: "District Planning", amount: 1_332_857, priorYear: 1_182_111 },
      { name: "Neighborhood Livability", amount: 970_330, priorYear: 0 },
      { name: "Equity", amount: 966_121, priorYear: 490_593 },
      { name: "Graffiti Reduction", amount: 926_566, priorYear: 3_026_295 },
      { name: "Portland & Comprehensive Plan", amount: 850_728, priorYear: 1_158_475 },
      { name: "Utility License & Franchise", amount: 823_993, priorYear: 778_092 },
      { name: "River & Environmental", amount: 599_902, priorYear: 735_531 },
      { name: "Climate, Energy & Sustainable Dev", amount: 443_533, priorYear: 230_000 },
      { name: "Mt. Hood Cable Regulatory Commission", amount: 436_000, priorYear: 1_528_642 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Cut FTE across planning divisions",
        amount: 406_000,
        description:
          "Cuts positions in Planning, Climate, Community Technology, and Internal Services divisions.",
        serviceImpact:
          "Slower processing of land use applications. Reduced capacity for long-range planning and climate policy development.",
      },
      {
        magnitude: "10%",
        title: "Deeper cuts + backfill with grants",
        amount: 1_507_000,
        description:
          "Deeper cuts totaling $1.5M across all divisions that receive general fund. Some gaps backfilled with grant funding where available.",
        serviceImpact:
          "Significant delays in planning reviews. Graffiti program reduced to base funding level. Reduced smart cities and broadband digital inclusion work.",
        fteImpact: 6,
      },
    ],
  },
  {
    code: "PHB",
    name: "Portland Housing Bureau",
    serviceArea: "Community & Economic Development",
    discretionary: 12_246_668,
    overhead: 0,
    total: 12_246_668,
    category: "community-dev",
    // Note: PHB total GF programs = $42.8M, but most is funded through tax increment,
    // bonds, and federal grants. The $12.2M CAL is the direct GF discretionary portion.
    programs: [
      { name: "Administration & Support", amount: 4_200_000 },
      { name: "Homelessness Diversion", amount: 3_500_000 },
      { name: "Supportive Housing", amount: 2_200_000 },
      { name: "Homeowner Access & Retention", amount: 1_600_000 },
      { name: "Other programs", amount: 746_668 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Reduce administrative and operational functions",
        amount: 391_000,
        description:
          "Targets administrative and operational functions, with support from other funding sources where available. No current service level funding gaps identified.",
        serviceImpact:
          "Minor impact on administrative capacity. Core housing programs maintained.",
      },
      {
        magnitude: "10%",
        title: "Deeper administrative cuts",
        amount: 1_224_000,
        description:
          "Further reductions to administrative and operational areas. Note: PHB disclosed ~$106M in previously unbudgeted housing funds — Council deliberations on these funds ongoing.",
        serviceImpact:
          "Reduced bureau capacity for contract management and program oversight. The $106M in unbudgeted funds remains a significant political question.",
      },
    ],
  },
  {
    code: "PROSPER",
    name: "Prosper Portland",
    serviceArea: "Community & Economic Development",
    discretionary: 11_330_550,
    overhead: 0,
    total: 11_330_550,
    category: "community-dev",
    programs: [
      { name: "Business Advancement", amount: 2_718_033, priorYear: 3_267_662 },
      { name: "Inclusive Entrepreneurship", amount: 2_600_822, priorYear: 3_303_787 },
      { name: "Small Biz & Housing Finance", amount: 2_083_221, priorYear: 2_512_795 },
      { name: "Workforce Development", amount: 1_633_923, priorYear: 2_038_823 },
      { name: "Neighborhood Business Dev", amount: 1_404_365, priorYear: 1_952_530 },
      { name: "Office of Events and Film", amount: 1_181_615, priorYear: 1_370_462 },
      { name: "Office of Small Business", amount: 1_116_088, priorYear: 1_910_632 },
      { name: "Small Business Tenanting & Leasing", amount: 707_754, priorYear: 687_140 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Reduce workforce partner funding",
        amount: 340_000,
        description:
          "Reduces current service levels for workforce partner funding and Inclusive Business Resource program, following 22% ongoing GF cut in FY 2025-26.",
        serviceImpact:
          "Reduced grant support for workforce development partners and inclusive business programming.",
      },
      {
        magnitude: "10%",
        title: "Further program reductions on top of $2M one-time expiration",
        amount: 1_100_000,
        description:
          "Combined with the expiration of $2M in one-time funding, substantially reduces workforce and inclusive business programs.",
        serviceImpact:
          "Significant reduction in economic development services for small businesses and underserved communities. Storefront Support Program at risk.",
      },
    ],
  },
  {
    code: "COUNCIL",
    name: "City Council",
    serviceArea: "Elected Officials",
    discretionary: 0,
    overhead: 20_644_116,
    total: 20_644_116,
    category: "elected",
    programs: [
      { name: "Commissioner's Offices (12)", amount: 17_402_508, priorYear: 16_310_087 },
      { name: "Council Operations", amount: 3_241_608, priorYear: 3_238_367 },
    ],
    reductionScenarios: [],
  },
  {
    code: "COSA",
    name: "Office of City Operations",
    serviceArea: "City Operations",
    discretionary: 3_779_641,
    overhead: 16_982_111,
    total: 20_761_752,
    category: "operations",
    // Note: COSA GF programs total $36.9M but includes Special Appropriations
    // and OCPA funded by separate code-mandated allocations. $20.8M is the direct CAL.
    programs: [
      { name: "Administration & Support", amount: 5_100_000 },
      { name: "Information & Referral (311)", amount: 4_050_000 },
      { name: "Procurement Services", amount: 6_100_000 },
      { name: "Independent Review", amount: 1_910_000 },
      { name: "Grants Management", amount: 1_190_000 },
      { name: "Other (Unified Comms, CAO)", amount: 2_411_752 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Cut 1 CSR + reduce weekend 311 hours",
        amount: 144_000,
        description:
          "Cuts one Customer Service Representative I and reduces 311 weekend hours from 8PM to 6PM.",
        serviceImpact:
          "311 weekend service ends 2 hours earlier. Residents calling after 6PM on weekends get no answer.",
      },
      {
        magnitude: "10%",
        title: "Cut 3 CSRs + 1 dispatcher + reduce evening hours",
        amount: 335_000,
        description:
          "Cuts two Customer Service Representatives, one Dispatcher. Evening 311 service reduced from 8PM to 6PM every day, cutting approximately 72,000 annual contacts.",
        serviceImpact:
          "No 311 service after 6PM any day of the week. 72,000 fewer annual contacts handled. Longer hold times during operating hours.",
        fteImpact: 3,
      },
    ],
  },
  {
    code: "BHR",
    name: "Bureau of Human Resources",
    serviceArea: "City Operations",
    discretionary: 0,
    overhead: 16_295_080,
    total: 16_295_080,
    category: "operations",
    programs: [
      { name: "Workforce Recruitment & Training", amount: 4_312_187, priorYear: 3_759_952 },
      { name: "Employee & Labor Relations", amount: 5_834_498, priorYear: 5_142_902 },
      { name: "Operations & Strategic Support", amount: 6_783_651, priorYear: 8_855_324 },
      { name: "Classification, Comp & Pay Equity", amount: 1_756_029, priorYear: 2_342_058 },
      { name: "Total Rewards", amount: 987_529, priorYear: 928_693 },
      { name: "Professional Development", amount: 615_000, priorYear: 165_000 },
      { name: "Well-Being & Occupational Health", amount: 239_985, priorYear: 0 },
    ],
    reductionScenarios: [],
  },
  {
    code: "AUDITOR",
    name: "Office of the City Auditor",
    serviceArea: "Elected Officials",
    discretionary: 0,
    overhead: 14_327_679,
    total: 14_327_679,
    category: "elected",
    programs: [
      { name: "Administration & Support", amount: 3_803_603, priorYear: 3_548_721 },
      { name: "Archives & Records Management", amount: 3_624_148, priorYear: 3_359_708 },
      { name: "Audit Services", amount: 2_764_350, priorYear: 2_650_031 },
      { name: "Elections", amount: 1_458_827, priorYear: 1_386_964 },
      { name: "Council Clerk & Contracts", amount: 1_338_459, priorYear: 1_480_587 },
      { name: "Hearings Office", amount: 1_273_413, priorYear: 1_149_347 },
      { name: "Ombudsman Office", amount: 697_941, priorYear: 647_468 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Eliminate 2 FTE + cut outreach + draw on reserves",
        amount: 800_000,
        description:
          "Eliminates one Performance Auditor II and one Administrative Specialist II. Cuts materials and services including equity trainings and outreach. Draws $217K from Auditor's Reserve Fund.",
        serviceImpact:
          "One fewer performance audit completed per year. Reduced administrative independence. Limited outreach and community engagement capacity. Reserve fund draw risks perceived independence.",
        fteImpact: 2,
      },
    ],
  },
  {
    code: "OCFO",
    name: "Office of Budget & Finance",
    serviceArea: "City Administrator",
    discretionary: 9_144_448,
    overhead: 4_188_138,
    total: 13_332_586,
    category: "operations",
    // Note: OCFO manages $124M in GF programs but most is fund/debt management
    // pass-through. The $13.3M CAL is the direct allocation for bureau operations.
    programs: [
      { name: "Accounting", amount: 4_101_182 },
      { name: "Revenue Division", amount: 3_891_613 },
      { name: "Debt Management", amount: 1_418_183 },
      { name: "CAO's Office", amount: 858_844 },
      { name: "Other operations", amount: 3_062_764 },
    ],
    reductionScenarios: [],
  },
  {
    code: "ATTORNEY",
    name: "Office of the City Attorney",
    serviceArea: "City Administrator",
    discretionary: 0,
    overhead: 11_125_700,
    total: 11_125_700,
    category: "operations",
    programs: [],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Eliminate 1 Chief Deputy City Attorney",
        amount: 325_780,
        description:
          "Eliminates one Chief Deputy City Attorney position. The office already cut 3 attorney positions last year and reduced external materials 15%.",
        serviceImpact:
          "Reduced legal capacity. Attorneys already worked 2,200+ extra hours last year. Some legal work may take longer.",
        fteImpact: 1,
      },
      {
        magnitude: "10%",
        title: "Eliminate 4 positions total — would cost $2.3M to replace with outside counsel",
        amount: 1_086_000,
        description:
          "Eliminates one Chief Deputy, one Senior Deputy, one Deputy City Attorney, and one Paralegal. Equivalent to 5,500 hours of attorney work that would cost $2.3M in outside counsel.",
        serviceImpact:
          "Significant reduction in legal capacity. City would likely need to spend more on outside counsel than saved. Every bureau would experience slower legal support.",
        fteImpact: 4,
      },
    ],
  },
  {
    code: "CIVICLIFE",
    name: "Office of Community & Civic Life",
    serviceArea: "City Administrator",
    discretionary: 4_757_670,
    overhead: 434_845,
    total: 5_192_515,
    category: "operations",
    programs: [
      { name: "Neighborhood Outreach & Support", amount: 3_268_446, priorYear: 2_845_733 },
      { name: "Adapt to Impact", amount: 423_006, priorYear: 383_903 },
      { name: "Administration & Support", amount: 550_316, priorYear: 880_835 },
      { name: "Immigrant & Refugee", amount: 329_587, priorYear: 430_985 },
      { name: "Diversity Civic Leaders", amount: 393_712, priorYear: 459_109 },
      { name: "Youth Outreach", amount: 386_448, priorYear: 365_211 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Space rent savings from downsizing",
        amount: 97_000,
        description:
          "Eliminates $96K of space rent savings from staff reductions over past budget cycles. Civic Life moved from the Portland Building 1st floor (33 staff capacity) to 5th floor (10 FTE).",
        serviceImpact:
          "Minimal direct service impact — reflects prior downsizing already absorbed.",
      },
    ],
  },
  {
    code: "OCPA",
    name: "Office of Community-Based Police Accountability",
    serviceArea: "City Operations",
    discretionary: 4_734_348,
    overhead: 0,
    total: 4_734_348,
    category: "operations",
    // Note: OCPA has code-mandated funding floor of 5% of PPB budget ($8.1M total).
    // The $4.7M CAL is the current GF discretionary allocation; balance from other sources.
    programs: [],
    reductionScenarios: [],
  },
  {
    code: "OCED",
    name: "Office of Community & Economic Dev",
    serviceArea: "Community & Economic Development",
    discretionary: 4_208_112,
    overhead: 662_963,
    total: 4_871_075,
    category: "community-dev",
    programs: [
      { name: "Special Appropriations - Arts Program", amount: 4_148_074, priorYear: 4_364_388 },
      { name: "CAO's Office", amount: 1_301_757, priorYear: 2_415_057 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Cut 5-10 arts & culture event sponsorships",
        amount: 112_000,
        description:
          "Reduces arts and culture event sponsorships by $112K, eliminating approximately 5-10 community event sponsorships ranging from $10K-$25K each.",
        serviceImpact:
          "5-10 fewer community arts events. Reduced access to free/low-cost cultural programming. Less foot traffic to local business districts.",
      },
      {
        magnitude: "10%",
        title: "Cut 45-55 small grants + 5-10 sponsorships",
        amount: 373_000,
        description:
          "7% decrease in small grants ($261K, eliminating 45-55 grants) plus 3% decrease in sponsorships ($112K). Grants range from $500-$5,000.",
        serviceImpact:
          "45-55 fewer publicly accessible performances, exhibits, or works of art. Disproportionately affects artists and communities that rely on small-scale funding.",
      },
    ],
  },
  {
    code: "CBO",
    name: "City Budget Office",
    serviceArea: "City Operations",
    discretionary: 0,
    overhead: 4_043_413,
    total: 4_043_413,
    category: "operations",
    programs: [
      { name: "Budget & Economics", amount: 4_526_749, priorYear: 4_529_641 },
      { name: "Public Utility Board Support", amount: 448_812, priorYear: 0 },
    ],
    reductionScenarios: [],
  },
  {
    code: "MAYOR",
    name: "Office of the Mayor",
    serviceArea: "Elected Officials",
    discretionary: 0,
    overhead: 3_673_131,
    total: 3_673_131,
    category: "elected",
    programs: [
      { name: "Administration & Support", amount: 3_673_131, priorYear: 3_496_592 },
    ],
    reductionScenarios: [],
  },
  {
    code: "EQUITY",
    name: "Office of Equity & Human Rights",
    serviceArea: "City Administrator",
    discretionary: 0,
    overhead: 3_383_117,
    total: 3_383_117,
    category: "operations",
    programs: [
      { name: "Administration", amount: 1_462_024, priorYear: 0 },
      { name: "ADA Title II & Disability Equity", amount: 788_343, priorYear: 0 },
      { name: "Title VI Compliance", amount: 398_305, priorYear: 0 },
      { name: "Citywide Language Access", amount: 218_946, priorYear: 0 },
      { name: "LGBTQIA2S+ Program", amount: 219_596, priorYear: 0 },
      { name: "Tech Support & Consulting", amount: 164_119, priorYear: 0 },
      { name: "Training & Education", amount: 81_038, priorYear: 0 },
      { name: "DEEP Program", amount: 23_074, priorYear: 0 },
      { name: "Equity Communications", amount: 27_672, priorYear: 0 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Eliminate 1 Analyst III equity policy position",
        amount: 101_000,
        description:
          "Eliminates 1.0 Analyst III position that provides equity policy, implementation, and strategy Citywide.",
        serviceImpact:
          "Reduced capacity for citywide equity policy development and implementation support.",
        fteImpact: 1,
      },
      {
        magnitude: "10%",
        title: "Reclass + reduce equity training position",
        amount: 137_000,
        description:
          "Combined with 3% cut: reclasses Analyst III Training Manager to part-time Analyst II.",
        serviceImpact:
          "Part-time equity training capacity. Reduced citywide training and strategic equity support.",
      },
    ],
  },
  {
    code: "OGR",
    name: "Office of Government Relations",
    serviceArea: "City Administrator",
    discretionary: 0,
    overhead: 2_856_851,
    total: 2_856_851,
    category: "operations",
    programs: [
      { name: "State Relations", amount: 1_227_282, priorYear: 1_082_102 },
      { name: "Federal Relations", amount: 660_197, priorYear: 646_071 },
      { name: "Tribal Relations", amount: 496_499, priorYear: 624_140 },
      { name: "International Relations", amount: 448_835, priorYear: 440_375 },
      { name: "Regional Relations", amount: 232_172, priorYear: 276_628 },
    ],
    reductionScenarios: [
      {
        magnitude: "3%",
        title: "Cut temporary staffing + close Salem office",
        amount: 116_000,
        description:
          "Reduces State Relations temporary staffing and eliminates the lease for office space in the Local Government Building in Salem.",
        serviceImpact:
          "Higher-paid lobbyists must handle administrative tasks during legislative session. No dedicated Salem office space for City advocacy.",
      },
    ],
  },
  {
    code: "OPWKS",
    name: "Office of Public Works",
    serviceArea: "Public Works",
    discretionary: 0,
    overhead: 634_471,
    total: 634_471,
    category: "public-works",
    // Note: Office of Public Works' programs total $3.1M GF but the bureau's
    // direct CAL allocation is only $634K (all overhead). Balance funded through
    // service area transfers. Programs omitted to avoid confusion.
    programs: [],
    reductionScenarios: [],
  },
];

// ─── Cash Transfers ──────────────────────────────────────────────────────────
// From CAL Cash Transfers sheet

const cashTransfers: CashTransfer[] = [
  { name: "General Fund Overhead Charge", amount: 45_760_467 },
  { name: "Joint Office of Homeless Services", amount: 30_516_405 },
  { name: "Parks Construction", amount: 4_719_294 },
  { name: "ADU Ramp Bond", amount: 3_484_971 },
  { name: "Pension Debt Cash Transfer", amount: 2_490_209 },
  { name: "OMF ITS Transfer", amount: 1_761_894 },
  { name: "PBOT", amount: 1_338_378 },
  { name: "Public Elections Fund", amount: 1_342_701 },
  { name: "PP&D Neighborhood Quality", amount: 1_133_158 },
  { name: "Habitat Remediation", amount: 1_058_411 },
  { name: "PP&D Liquor Licensing", amount: 656_946 },
  { name: "Council Protection Services", amount: 675_104 },
  { name: "Facilities - Charter Transition Loan", amount: 545_364 },
  { name: "HIF CAL Target", amount: 398_984 },
  { name: "HIF Bond Interest", amount: 127_500 },
  { name: "HIF Bond Principal", amount: 810_000 },
  { name: "PP&D Noise", amount: 207_753 },
  { name: "Water-Parks", amount: 208_110 },
  { name: "Portland Harbor", amount: 165_000 },
  { name: "Facilities - Westside Staging", amount: 84_344 },
  { name: "Parks Memorial Trust", amount: 76_553 },
  { name: "Facilities - Council Security", amount: 51_652 },
  { name: "Facilities - McCall's Building O&M", amount: 11_494 },
];

// ─── Five-Year Forecast ──────────────────────────────────────────────────────
// From Table 2: Five-Year Balanced General Fund Forecast

const fiveYearForecast: ForecastYear[] = [
  { year: "FY 26-27", revenue: 725.4, expenses: 793.2, gap: -67.8 },
  { year: "FY 27-28", revenue: 767.4, expenses: 804.0, gap: -36.7 },
  { year: "FY 28-29", revenue: 790.7, expenses: 826.7, gap: -36.0 },
  { year: "FY 29-30", revenue: 814.6, expenses: 826.1, gap: -11.5 },
  { year: "FY 30-31", revenue: 838.5, expenses: 842.1, gap: -3.6 },
];

// ─── Export ──────────────────────────────────────────────────────────────────

export const budgetData: BudgetData = {
  fiscalYear: "FY 2026-27",
  totalCityBudget: 8_640_000_000,
  dataSource: "City Budget Office — General Fund Forecast & CAL Tables, March 2026 Update; Budget Scenario Options FY 2026-27",
  lastVerified: "2026-04-06",
  generalFund: {
    totalRevenue: 725_400_000,
    totalExpenses: 793_122_397,
    deficit: 67_722_397,
    revenueSources,
    bureaus,
    cashTransfers,
  },
  fiveYearForecast,
};
