import type { Evidence } from "../types";

/**
 * The scale of each body's power, for the hub's ladder of government:
 * what the seat's budget is, how many people it serves, how many members
 * decide, and what it actually controls. Every number carries its official
 * source; the hub draws budget bars from `budget` on a log scale so a
 * $7 trillion federal budget and a $60 million city budget can share a page.
 *
 * Filled by research. Budgets are the most recent ADOPTED total (all funds)
 * for the current fiscal year or biennium, stated in the label with the
 * period; population is the most recent official estimate.
 */
export type ScaleTier = "federal" | "state" | "county" | "city";

export type BodyScale = {
  /** Must match Office.body exactly ("Portland City Council" is listed as "City of Portland"). */
  body: string;
  tier: ScaleTier;
  /** Annual budget in U.S. dollars (a biennium divided by two), for the bar. */
  budget: number;
  /** e.g. "$8.5 billion adopted, FY 2025–26" */
  budgetLabel: string;
  budgetSource: Evidence;
  /** People served. */
  people: number;
  /** e.g. "652,000 residents" */
  peopleLabel: string;
  peopleSource: Evidence;
  /** e.g. "12 councilors and a mayor", "1 governor", "5 commissioners". */
  members: string;
  /** One sentence, plain words: what this body decides that touches a resident. */
  decides: string;
};

export const bodyScales: BodyScale[] = [
  {
    body: "U.S. Congress",
    tier: "federal",
    budget: 7_009_974_000_000,
    budgetLabel: "$7.0 trillion in outlays, FY 2025 (final Treasury statement)",
    budgetSource: {
      label: "U.S. Treasury · Final Monthly Treasury Statement for Fiscal Year 2025, Table 2: total outlays $7,009,974 million",
      url: "https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202509.pdf",
      kind: "Public record",
      date: "Statement through September 30, 2025; checked September 21, 2026",
    },
    people: 341_784_857,
    peopleLabel: "340 million residents",
    peopleSource: {
      label: "U.S. Census Bureau · Vintage 2025 population estimates, table NST-EST2025-POP: United States 341,784,857 on July 1, 2025",
      url: "https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html",
      kind: "Public record",
      date: "Released January 27, 2026; checked September 21, 2026",
    },
    members: "435 representatives and 100 senators",
    decides: "Federal taxes, Social Security and Medicare, defense, immigration law, and the federal money that flows to Oregon housing, transit and health care.",
  },
  {
    body: "State of Oregon",
    tier: "state",
    budget: 69_442_664_726,
    budgetLabel: "$69 billion a year: $140 billion adopted for the 2025–27 biennium, $39 billion of it General Fund and Lottery",
    budgetSource: {
      label: "Legislative Fiscal Office · Budget Information Brief 2025-2, 2025–27 Legislatively Adopted Budget: $138,885,329,451 total funds, $39,137,857,867 General Fund and Lottery",
      url: "https://www.oregonlegislature.gov/lfo/Documents/2025-2%20LAB%20Summary%202025-27.pdf",
      kind: "Public record",
      date: "Budget adopted June 27, 2025; brief checked September 21, 2026",
      note: "The May 2026 LFO Budget Highlights Update puts the legislatively approved budget after the 2026 session at $141 billion.",
    },
    people: 4_301_164,
    peopleLabel: "4.3 million residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Oregon 4,301,164",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "1 governor",
    decides: "Signs or vetoes every state law, proposes the budget, runs the state agencies for housing, health, corrections and transportation, and appoints agency heads and judges.",
  },
  {
    body: "Oregon Legislature",
    tier: "state",
    budget: 69_442_664_726,
    budgetLabel: "$69 billion a year: $140 billion adopted for the 2025–27 biennium, $39 billion of it General Fund and Lottery",
    budgetSource: {
      label: "Legislative Fiscal Office · Budget Information Brief 2025-2, 2025–27 Legislatively Adopted Budget: $138,885,329,451 total funds, $39,137,857,867 General Fund and Lottery",
      url: "https://www.oregonlegislature.gov/lfo/Documents/2025-2%20LAB%20Summary%202025-27.pdf",
      kind: "Public record",
      date: "Budget adopted June 27, 2025; brief checked September 21, 2026",
      note: "The May 2026 LFO Budget Highlights Update puts the legislatively approved budget after the 2026 session at $141 billion.",
    },
    people: 4_301_164,
    peopleLabel: "4.3 million residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Oregon 4,301,164",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "30 senators and 60 representatives",
    decides: "Writes state law and the state budget, sets state taxes, and decides what counties and cities must do.",
  },
  {
    body: "Multnomah County",
    tier: "county",
    budget: 4_025_342_446,
    budgetLabel: "$4.0 billion adopted, FY 2025–26",
    budgetSource: {
      label: "Multnomah County · FY 2026 Adopted Budget, Budget Director's Message, p. 49: total budget $4,025,342,446",
      url: "https://multco.us/file/budget_director's_message/download",
      kind: "Public record",
      date: "Budget adopted June 12, 2025; document checked September 21, 2026",
      note: "The Board adopted a $4 billion FY 2027 budget on June 5, 2026.",
    },
    people: 805_583,
    peopleLabel: "810,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Multnomah County 805,583",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "1 chair and 4 commissioners",
    decides: "Homeless services and shelters, public health and behavioral health, the jail and sheriff, elections, libraries, the Willamette bridges, and county roads.",
  },
  {
    body: "Washington County",
    tier: "county",
    budget: 2_068_353_983,
    budgetLabel: "$2.1 billion adopted, FY 2025–26",
    budgetSource: {
      label: "Washington County · FY 2025–26 Adopted Budget Summary, Total Requirements by Functional Area: grand total $2,068,353,983 (county funds; service districts budgeted separately)",
      url: "https://www.washingtoncountyor.gov/finance/documents/adopted-budget-summary-1/download?inline",
      kind: "Public record",
      date: "FY 2025–26 adopted budget document; checked September 21, 2026",
    },
    people: 618_737,
    peopleLabel: "620,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Washington County 618,737",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "1 chair and 4 commissioners",
    decides: "The sheriff and jail, public health and homeless services, elections, county roads and land use outside city limits, and the cooperative library system.",
  },
  {
    body: "Clackamas County",
    tier: "county",
    budget: 1_506_510_895,
    budgetLabel: "$1.5 billion adopted, FY 2025–26",
    budgetSource: {
      label: "Clackamas County · Adopted Budget, Fiscal Year 2025–26, p. 19: total requirements $1,506,510,895 (county only, excluding districts and agencies)",
      url: "https://docs.clackamas.us/documents/drupal/358e6b70-b324-4bf8-a61f-76ffa488b4dd",
      kind: "Public record",
      date: "FY 2025–26 adopted budget book; checked September 21, 2026",
    },
    people: 432_473,
    peopleLabel: "430,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Clackamas County 432,473",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "1 chair and 4 commissioners",
    decides: "The sheriff and jail, public health and behavioral health, housing and homeless services, elections, juvenile services, county roads and land use outside city limits.",
  },
  {
    body: "City of Portland",
    tier: "city",
    budget: 8_638_585_121,
    budgetLabel: "$8.6 billion adopted, FY 2025–26",
    budgetSource: {
      label: "Portland City Council · Ordinance 192070, adopting the FY 2025–26 budget in the total amount of $8,638,585,121",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192070",
      kind: "Public record",
      date: "Passed June 18, 2025; checked September 21, 2026",
      note: "Ordinance 192195, passed June 17, 2026, adopted the FY 2026–27 budget at $8,537,051,372.",
    },
    people: 640_623,
    peopleLabel: "640,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Portland 640,623",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "12 councilors (3 per district) and a mayor",
    decides: "Police and fire, streets and transit lanes, water and sewer rates, permits and zoning, parks, and the city's own homelessness spending.",
  },
  {
    body: "City of Gresham",
    tier: "city",
    budget: 897_266_615,
    budgetLabel: "$900 million adopted, FY 2025–26",
    budgetSource: {
      label: "City of Gresham · Fiscal Year 2025/26 Adopted Budget, p. 11, Resources and Requirements – All Funds: total requirements $897,266,615 (City Council adopted)",
      url: "https://www.greshamoregon.gov/globalassets/city-departments/budget-and-finance/budget-documents/fy-2025-26-adopted-budget.pdf",
      kind: "Public record",
      date: "FY 2025/26 adopted budget document; checked September 21, 2026",
      note: "The FY 2026/27 adopted budget totals $924,981,292.",
    },
    people: 115_739,
    peopleLabel: "120,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Gresham 115,739",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "6 councilors and a mayor",
    decides: "Police, its own fire department, streets, water and sewer, parks, and permits and zoning; the library is Multnomah County's.",
  },
  {
    body: "City of Beaverton",
    tier: "city",
    budget: 454_698_783,
    budgetLabel: "$450 million adopted, FY 2025–26 (city funds, without the urban renewal agency)",
    budgetSource: {
      label: "City of Beaverton · Annual Budget Document FY 2025–26 (adopted by Resolution No. 4914), LB-1 financial summary: total requirements $454,698,783; $495,302,278 with the Beaverton Urban Redevelopment Agency",
      url: "https://www.beavertonoregon.gov/budget-fy-2025-2026",
      kind: "Public record",
      date: "Adopted June 3, 2025; budget page and Budget Book checked September 21, 2026",
    },
    people: 100_778,
    peopleLabel: "100,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Beaverton 100,778",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "6 councilors and a mayor",
    decides: "Police, streets, water, local sewer and storm lines, permits and zoning, and the library; fire is Tualatin Valley Fire & Rescue's and parks are the Tualatin Hills park district's.",
  },
  {
    body: "City of Hillsboro",
    tier: "city",
    budget: 973_425_001,
    budgetLabel: "$970 million a year: $1.9 billion adopted for the 2025–27 biennium",
    budgetSource: {
      label: "City of Hillsboro · 2025–2027 Adopted Biennial Budget, p. 51, Total City Budget Requirements by Category: $1,946,850,001 for the biennium",
      url: "https://www.hillsboro-oregon.gov/home/showpublisheddocument/31919/639102077343430000",
      kind: "Public record",
      date: "Adopted June 17, 2025; document checked September 21, 2026",
    },
    people: 112_735,
    peopleLabel: "110,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Hillsboro 112,735",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "6 councilors (2 per ward) and a mayor",
    decides: "Police, its own fire department, streets, water, sewer and storm lines, parks, the library, and permits and zoning.",
  },
  {
    body: "City of Tigard",
    tier: "city",
    budget: 454_539_248,
    budgetLabel: "$450 million adopted, FY 2025–26",
    budgetSource: {
      label: "City of Tigard · Adopted Budget FY 2025–26, Budget in Brief p. 23 and Summary of All Funds p. 311: total requirements $454,539,248, of which $240,516,266 appropriated",
      url: "https://www.tigard-or.gov/your-government/city-budget",
      kind: "Public record",
      date: "Adopted by Resolution No. 25-23 on June 17, 2025; budget book checked September 21, 2026",
      note: "The adoption resolution stated total requirements of $432,661,445 with the same appropriations; the published budget book's reserves are higher. The FY 2026–27 adopted budget totals $471,938,721.",
    },
    people: 57_091,
    peopleLabel: "57,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Tigard 57,091",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "6 councilors and a mayor",
    decides: "Police, streets, water, sewer and storm lines, parks, the library, and permits and zoning; fire is Tualatin Valley Fire & Rescue's.",
  },
  {
    body: "City of Lake Oswego",
    tier: "city",
    budget: 230_830_987,
    budgetLabel: "$230 million a year: $460 million adopted for the 2025–27 biennium",
    budgetSource: {
      label: "City of Lake Oswego · Adopted Budget 2025–27, Resolution 25-13: budget for the 2025–27 biennium adopted in the sum of $461,661,974",
      url: "https://www.ci.oswego.or.us/sites/default/files/fileattachments/Full%20Budget.pdf",
      kind: "Public record",
      date: "Adopted June 3, 2025; document checked September 21, 2026",
    },
    people: 41_474,
    peopleLabel: "41,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Lake Oswego 41,474",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "6 councilors and a mayor",
    decides: "Police, its own fire department, streets, water, sewer and storm lines, parks, the library, and permits and zoning.",
  },
  {
    body: "City of Oregon City",
    tier: "city",
    budget: 159_509_500,
    budgetLabel: "$160 million a year: $320 million adopted for the 2025–27 biennium",
    budgetSource: {
      label: "City of Oregon City · 2025–2027 Adopted Biennial Budget, Budget Summary – All Funds Combined: total requirements $319,019,000 (adopted column)",
      url: "https://orcity.org/DocumentCenter/View/16698/2025-2027-Budget-Book---Adopted-Final-PDF",
      kind: "Public record",
      date: "2025–27 adopted budget book; checked September 21, 2026",
    },
    people: 38_387,
    peopleLabel: "38,000 residents",
    peopleSource: {
      label: "Portland State University Population Research Center · Certified Population Estimates, July 1, 2025: Oregon City 38,387",
      url: "https://www.pdx.edu/population-research/population-estimate-reports",
      kind: "Public record",
      date: "Certified December 15, 2025, revised April 15, 2026; checked September 21, 2026",
    },
    members: "4 commissioners and a mayor",
    decides: "Police, streets, water, sewer and storm lines, parks, the library, and permits and zoning; fire is Clackamas Fire District 1's.",
  },
];

export const scaleFor = (body: string) => bodyScales.find((b) => b.body === body || (body === "Portland City Council" && b.body === "City of Portland")) ?? null;
