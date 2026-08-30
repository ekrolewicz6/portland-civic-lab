/**
 * The PPS budget deep dive — data layer.
 *
 * House rule (venue-dive convention): every load-bearing number lives in
 * HEADLINE or a typed const below, with its corpus citation (docId p.N) in a
 * comment. The corpus is research/pps-budget/ (120 checksummed documents);
 * the two published analyses this page renders are document.md ("Where the
 * Next Dollar Goes") and recommendations.md ("The Movable Dollar Plan"),
 * both adversarially fact-checked before publication. Judgments cite
 * pclAnalysis. Figures that exist only in press reporting are flagged
 * `press: true` wherever they appear.
 */

export interface Source {
  title: string;
  org: string;
  url: string;
  kind: "primary" | "analysis" | "news" | "statute";
  year?: string;
}

const RM = "https://www.pps.net/fs/resource-manager/view";

export const SOURCES = {
  budgetFy27Vol1: {
    title: "FY2026-27 Adopted Budget, Volume 1",
    org: "Portland Public Schools",
    url: `${RM}/0defe213-e66e-4416-adaf-97add47ed00f`,
    kind: "primary",
    year: "2026",
  },
  budgetFy26Vol1: {
    title: "FY2025-26 Adopted Budget, Volume 1",
    org: "Portland Public Schools",
    url: `${RM}/a4e960fb-e321-4297-bd2e-587394969d50`,
    kind: "primary",
    year: "2025",
  },
  suptMessageFy27: {
    title: "Superintendent's FY2026-27 Proposed Budget Message",
    org: "Portland Public Schools",
    url: `${RM}/51380314-e6ee-4177-a0e8-b8d5e17964ee`,
    kind: "primary",
    year: "2026",
  },
  acfrFy2025: {
    title: "Annual Comprehensive Financial Report, FY2025",
    org: "Portland Public Schools (audited)",
    url: `${RM}/341b8773-a285-4c2b-ba40-103391aed82b`,
    kind: "primary",
    year: "2026",
  },
  acfrFy2020: {
    title: "Annual Comprehensive Financial Report, FY2020",
    org: "Portland Public Schools (audited)",
    url: `${RM}/d4be7e6c-02b4-448e-97c1-c04f7b73c12f`,
    kind: "primary",
    year: "2020",
  },
  tsccFy26: {
    title: "Budget Review 2025-26: Portland Public Schools",
    org: "Tax Supervising & Conservation Commission",
    url: "https://www.tsccmultco.com/wp-content/uploads/Portland-Public-School-District-FY-26-Budget-Review.pdf",
    kind: "primary",
    year: "2025",
  },
  tsccFy25: {
    title: "Budget Review 2024-25: Portland Public Schools",
    org: "Tax Supervising & Conservation Commission",
    url: "https://www.tsccmultco.com/wp-content/uploads/PPS-A-FY25-Budget-Review.pdf",
    kind: "primary",
    year: "2024",
  },
  tsccFy24: {
    title: "Budget Review 2023-24: Portland Public Schools",
    org: "Tax Supervising & Conservation Commission",
    url: "https://www.tsccmultco.com/wp-content/uploads/FY24-Portland-Public-Schools-Budget-Review.pdf",
    kind: "primary",
    year: "2023",
  },
  tsccAnnual2425: {
    title: "TSCC Annual Report 2024-25, General Information",
    org: "Tax Supervising & Conservation Commission",
    url: "https://www.tsccmultco.com/wp-content/uploads/2024-25-General-Information-Section-Annual-Report.pdf",
    kind: "primary",
    year: "2025",
  },
  tsccBond2025: {
    title: "Tax Measure Review: Measure 26-259 (2025 bond)",
    org: "Tax Supervising & Conservation Commission",
    url: "https://www.tsccmultco.com/wp-content/uploads/PPS-Bond-Levy-Review-May-2025.pdf",
    kind: "primary",
    year: "2025",
  },
  cbrcFy27: {
    title: "CBRC Annual Budget Review, FY2026-27",
    org: "PPS Community Budget Review Committee",
    url: `${RM}/206a8db4-5c9e-45e8-95d4-4b58c73377ad`,
    kind: "primary",
    year: "2026",
  },
  cbrcFy26: {
    title: "CBRC Annual Budget Review, FY2025-26",
    org: "PPS Community Budget Review Committee",
    url: `${RM}/23241aa1-3847-4834-8acf-272cd4e67d41`,
    kind: "primary",
    year: "2025",
  },
  cbrcFy25: {
    title: "CBRC Annual Budget Review, FY2024-25",
    org: "PPS Community Budget Review Committee",
    url: `${RM}/5781c947-8fba-4045-977c-450cf0b4736d`,
    kind: "primary",
    year: "2024",
  },
  cbrcFy24: {
    title: "CBRC Annual Budget Review, FY2023-24",
    org: "PPS Community Budget Review Committee",
    url: `${RM}/35dfd5e7-5661-4385-a132-8a3a55bec4c9`,
    kind: "primary",
    year: "2023",
  },
  cbrcLevy2025: {
    title: "CBRC Local Option Levy Review, FY2024-25",
    org: "PPS Community Budget Review Committee",
    url: `${RM}/7531ee3f-8d6a-4ed1-a100-73d66d519d61`,
    kind: "primary",
    year: "2025",
  },
  bondAuditY6: {
    title: "Bond Performance Audit, Year 6 (FY2023-24)",
    org: "Sjoberg Evashenk Consulting",
    url: `${RM}/360be54d-7d9e-4919-9bbc-50a519481c2c`,
    kind: "primary",
    year: "2025",
  },
  bondAuditY4: {
    title: "Bond Performance Audit, Year 4 (FY2021-22)",
    org: "Sjoberg Evashenk Consulting",
    url: `${RM}/69866af5-9563-4541-ba81-e11df7a40587`,
    kind: "primary",
    year: "2023",
  },
  bondAuditY1P1: {
    title: "Bond Performance Audit, Year 1 Phase 1",
    org: "Sjoberg Evashenk Consulting",
    url: `${RM}/3bed472c-29a8-4aa8-a084-283f16a34610`,
    kind: "primary",
    year: "2019",
  },
  sosAudit2019: {
    title: "Audit 2019-01: ODE and PPS spending and oversight",
    org: "Oregon Secretary of State",
    url: `${RM}/f1b59ce8-400f-4784-aabb-812676ac0ab3`,
    kind: "primary",
    year: "2019",
  },
  sosFollowUp: {
    title: "2019 audit recommendation follow-up report",
    org: "Oregon Secretary of State",
    url: `${RM}/afc593a0-112e-442a-815e-751a32b8197c`,
    kind: "primary",
    year: "2022",
  },
  financeInterim: {
    title: "Quarterly and period financial reports (FY2023-24 to present)",
    org: "Portland Public Schools",
    url: "https://www.pps.net/departments/finance/finance",
    kind: "primary",
    year: "2026",
  },
  fy25AuditMemo: {
    title: "FY2025 audit communications (findings memo)",
    org: "Talbot, Korvola & Warwick / PPS",
    url: `${RM}/11756a72-66a0-4faa-a425-2cc1bbc8bc65`,
    kind: "primary",
    year: "2026",
  },
  patCba: {
    title: "PAT Collective Bargaining Agreement 2023-2026",
    org: "PPS / Portland Association of Teachers",
    url: `${RM}/70c9aeed-2057-4603-bbef-d0f72360dbee`,
    kind: "primary",
    year: "2024",
  },
  lro524: {
    title: "Research Report 5-24: K-12 School Funding Equalization",
    org: "Oregon Legislative Revenue Office",
    url: "https://www.oregonlegislature.gov/lro/Documents/K-12%20and%20ESD%20Finance%20RR%20August%2024%20Final.pdf",
    kind: "primary",
    year: "2024",
  },
  ors294423: {
    title: "ORS 294.423: governing body as budget committee",
    org: "Oregon Revised Statutes",
    url: "https://oregon.public.law/statutes/ors_294.423",
    kind: "statute",
  },
  ors294414: {
    title: "ORS 294.414: budget committee composition",
    org: "Oregon Revised Statutes",
    url: "https://oregon.public.law/statutes/ors_294.414",
    kind: "statute",
  },
  ors327011: {
    title: "ORS 327.011: local revenues offset",
    org: "Oregon Revised Statutes",
    url: "https://oregon.public.law/statutes/ors_327.011",
    kind: "statute",
  },
  opbAdoption: {
    title: "PPS board passes $2.77B budget with painful layoffs",
    org: "OPB",
    url: "https://www.opb.org/article/2026/06/25/portland-public-schools-budget-painful-layoffs/",
    kind: "news",
    year: "2026",
  },
  opbStrikeFaq: {
    title: "What Portland teachers got from the strike",
    org: "OPB",
    url: "https://www.opb.org/article/2023/11/29/portland-teachers-get-from-strike-faq/",
    kind: "news",
    year: "2023",
  },
  wwTwentySchools: {
    title: "Superintendent says district could close up to 20 schools",
    org: "Willamette Week",
    url: "https://www.wweek.com/news/schools/2026/08/26/pps-superintendent-says-district-could-close-up-to-20-schools/",
    kind: "news",
    year: "2026",
  },
  researchDoc: {
    title: "Where the Next Dollar Goes (full research document)",
    org: "Portland Civic Lab",
    url: "https://github.com/ekrolewicz6/portland-civic-lab/blob/main/research/pps-budget/document.md",
    kind: "analysis",
    year: "2026",
  },
  planDoc: {
    title: "The Movable Dollar Plan (full recommendations)",
    org: "Portland Civic Lab",
    url: "https://github.com/ekrolewicz6/portland-civic-lab/blob/main/research/pps-budget/recommendations.md",
    kind: "analysis",
    year: "2026",
  },
  pclAnalysis: {
    title: "Portland Civic Lab analysis (methods and corpus)",
    org: "Portland Civic Lab",
    url: "https://github.com/ekrolewicz6/portland-civic-lab/tree/main/research/pps-budget",
    kind: "analysis",
    year: "2026",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/** Every prose-level load-bearing number, transcribed from the fact-checked documents. */
export const HEADLINE = {
  allFundsFy27: 2_768_590_878, // Resolution 7326 [budget-fy2026-27-vol1 p317]
  gfFy27K: 862_112, // [budget-fy2026-27-vol1 p108]
  gfFy26K: 868_580, // [budget-fy2026-27-vol1 p108]
  gfDeltaK: -6_468,
  capitalDeltaK: 738_735, // waterfall [budget-fy2026-27-vol1 p173]
  fy28GapM: 65, // "more than 65 million" [budget-fy2026-27-vol1 p11]
  compressionFy27M: 53.4, // [budget-fy2026-27-vol1 p28]
  compressionFy20M: 20.9, // [tscc-review-fy2024 p3]
  levyVotedRate: 1.99,
  levyEffectiveRate: 1.5142, // FY2024-25 [tscc-annual-report-2024-25-general p50]
  levyPositionsFy25: 744, // [cbrc-2024-25-cbrc-local-option-levy-review p1]
  levyPositionsFy20: 916, // "more than 916" [same]
  enrollmentFy26Forecast: 42_304, // TSCC series [tscc-review-fy2025 p4]
  enrollmentFy20: 49_478, // ACFR headcount [acfr-fy2020 p140]
  enrollmentDropPct: 12.2, // district's own count [budget-fy2026-27-supt-message]
  fteFy27: 5_513, // [budget-fy2026-27-vol1 p92]
  fteFy22Actual: 6_274, // [tscc-review-fy2026 p3]
  debtOutstandingK: 2_130_788, // at 6/30/26 [budget-fy2026-27-vol1 p232]
  personnelShareFy27: 78.9, // of GF, $680.5M [budget-fy2026-27-vol1 p107]
  absenteeismPct: 36, // "over 36 percent" [cbrc-2025-26 p1]
  instructionalShare: 53, // vs 61 national [cbrc-2026-27 p5]
  cbrcWorkingDays: 9, // [cbrc-2026-27 p2]
  cbseAllocatedM: 60, // zero spent through Feb 2025 [bond-audit-year-6 p21, p33-34]
  bensonBallotM: 202, // [bond-audit-year-6 p13-14]
  bensonEacM: 421.2,
  centralFteCut: 96, // FY2025-26 [budget-fy2026-27-supt-message]
  positionsCutFy27: 322, // adopted, of 336 proposed [supt message; press]
  reservesM: 41, // 5% floor [budget-fy2026-27-vol1 p36]
} as const;

/** The four ledger tags — the organizing device of both documents. */
export const LEDGER_TAGS = [
  {
    id: "locked",
    label: "Locked",
    definition:
      "Legally cannot move. Bond proceeds, bond debt service, restricted grants. Wasting it is real waste, but it was never teacher money.",
    tone: "clay",
  },
  {
    id: "committed",
    label: "Committed",
    definition:
      "Legally movable but pinned by contracts and mandates: bargaining agreements, pensions, special education obligations, the lights.",
    tone: "ember",
  },
  {
    id: "movable",
    label: "Movable",
    definition: "The slice where board choices actually bite.",
    tone: "fern",
  },
  {
    id: "unknown",
    label: "Unknown",
    definition: "The public record cannot tell. That is a finding, not a footnote.",
    tone: "sage",
  },
] as const;

/** FY26 -> FY27 adopted requirements by fund type, $K. [budget-fy2026-27-vol1 p108, p122, p157, p173, p205; budget-fy2025-26-vol1] */
export const WATERFALL = [
  { fund: "General Fund", fy26: 868_580, fy27: 862_112, tag: "movable+committed" },
  { fund: "Special Revenue", fy26: 224_805, fy27: 223_936, tag: "mostly locked" },
  { fund: "Debt Service", fy26: 272_690, fy27: 278_876, tag: "locked" },
  { fund: "Capital Projects", fy26: 643_773, fy27: 1_382_508, tag: "locked" },
  { fund: "Internal Service", fy26: 25_269, fy27: 21_159, tag: "committed" },
] as const;

/**
 * The decade spine: adopted GF, all funds, enrollment, real GF (calendar-2026
 * dollars). Transcribed from research/pps-budget/data/derived/gf_series.csv and
 * per_pupil_gf.csv; each figure cites its book in the corpus. Enrollment is
 * the ACFR October headcount series through 2024-25 (2022-23 substituted from
 * the TSCC series where the ACFR prints an apparent misprint), TSCC forecasts
 * after (a slightly different series; flagged).
 */
export const DECADE = [
  { fy: "2016-17", gfK: 592_600, allFundsK: 1_155_905, enrollment: 49_189, realGfK: 824_475, forecast: false },
  { fy: "2017-18", gfK: 617_287, allFundsK: 1_587_755, enrollment: 49_557, realGfK: 840_907, forecast: false },
  { fy: "2018-19", gfK: 655_002, allFundsK: 1_506_992, enrollment: 49_550, realGfK: 871_012, forecast: false },
  { fy: "2019-20", gfK: 691_767, allFundsK: 1_379_456, enrollment: 49_478, realGfK: 903_529, forecast: false },
  { fy: "2020-21", gfK: 729_654, allFundsK: 2_725_778, enrollment: 47_314, realGfK: 941_400, forecast: false, note: "All-funds includes a $1.0B placeholder for the not-yet-passed November 2020 bond" },
  { fy: "2021-22", gfK: 771_963, allFundsK: 2_058_410, enrollment: 45_497, realGfK: 951_295, forecast: false, note: "Real General Fund peak" },
  { fy: "2022-23", gfK: 804_062, allFundsK: 1_883_261, enrollment: 44_548, realGfK: 917_431, forecast: false },
  { fy: "2023-24", gfK: 833_774, allFundsK: 2_182_057, enrollment: 44_771, realGfK: 913_719, forecast: false },
  { fy: "2024-25", gfK: 854_394, allFundsK: 2_393_878, enrollment: 44_086, realGfK: 909_492, forecast: false },
  { fy: "2025-26", gfK: 868_580, allFundsK: 2_035_117, enrollment: 42_304, realGfK: 900_888, forecast: true },
  { fy: "2026-27", gfK: 862_112, allFundsK: 2_768_591, enrollment: 41_341, realGfK: 862_112, forecast: true, note: "First year-over-year General Fund decline in the series" },
] as const;

/** Total Measure 5 loss across all PPS tax lines, $M. Most lands on the levy (~80-88%). [tscc-review-fy2024 p3; tscc-review-fy2025 p3; tscc-annual-report-2024-25-general p50; budget-fy2026-27-vol1 p28] */
export const COMPRESSION_SERIES = [
  { fy: "2019-20", lossM: 20.9 },
  { fy: "2020-21", lossM: 23.0 },
  { fy: "2021-22", lossM: 24.8 },
  { fy: "2022-23", lossM: 25.2 },
  { fy: "2023-24", lossM: 35.7 },
  { fy: "2024-25", lossM: 42.6 },
  { fy: "2026-27", lossM: 53.4, projected: true },
] as const;

/** The teachers levy: receipts, positions, cost. [cbrc levy reviews] */
export const LEVY_SERIES = [
  { fy: "2019-20", receiptsM: 97.4, positions: 916, avgCost: 106_000 },
  { fy: "2022-23", receiptsM: 106.5, positions: 851, avgCost: 125_161, note: "The following year's review says 922 for this same year; neither document explains the gap" },
  { fy: "2023-24", receiptsM: 108.8, positions: 802, avgCost: 135_739 },
  { fy: "2024-25", receiptsM: 104.6, positions: 744, avgCost: 141_000 },
  { fy: "2025-26", receiptsM: 109.2, positions: 718, avgCost: 152_000, projected: true },
] as const;

/** One-time money in, cuts out. [tscc reviews; cbrc-2026-27 p9; budget-fy2023-24-vol1] */
export const ESSER_TIMELINE = {
  esserTotalM: 115, // "almost $115 million" awarded to district and partners [budget-fy2023-24-vol1]
  cuts: [
    { fy: "2023-24", gapM: null as number | null, label: "~281 positions, patched with one-time money" },
    { fy: "2024-25", gapM: 30, label: "$15M central office, $15M schools" },
    { fy: "2025-26", gapM: 40, label: "$17M central, $23M schools; PERS reserve drained" },
    { fy: "2026-27", gapM: 56.3, label: "322 positions eliminated" },
    { fy: "2027-28", gapM: 65, label: "projected, 'more than'", projected: true },
  ],
  cliffNote:
    "ESSER money was braided into ongoing programs; the district's own citizen committee wrote in spring 2023 that the funding was 'hiding the looming shortfall ... from the general public.'", // [cbrc-2023-24 p3]
};

/** FTE by function, FY2021-22 actual to FY2025-26 adopted. [budget-fy2025-26-vol1 p231] */
export const FTE_BY_FUNCTION = [
  { group: "Regular instruction", fy22: 2_467.62, fy26: 2_166.69, pct: -12.2 },
  { group: "Special programs", fy22: 1_059.26, fy26: 1_094.09, pct: 3.3 },
  { group: "School administration", fy22: 451.62, fy26: 416.01, pct: -7.9 },
  { group: "Central business support", fy22: 715.45, fy26: 676.15, pct: -5.5 },
] as const;

/** The bond ledger: ballot promise vs latest estimate, $M. [bond audit exhibits as noted] */
export const BOND_LEDGER = [
  { project: "Benson Polytechnic", bond: "2017", ballotM: 202, latestM: 421.2, status: "over", note: "+108% vs ballot; auditors named a $14M 'budgeting error' inside the jump" }, // [y6 p13-14; y4 p14]
  { project: "Jefferson HS", bond: "2020", ballotM: 311, latestM: 491, status: "paused", note: "Design paused at the $491M schematic estimate; opening slipped two years" }, // [y6 p21-22]
  { project: "Grant HS", bond: "2012", ballotM: 88.3, latestM: 158.7, status: "over", note: "+80%; the 2012 program finished only because $115.8M of non-bond money absorbed overruns" }, // [2012 audit 4; y1p2 p14]
  { project: "Lincoln HS", bond: "2017", ballotM: 187, latestM: 223.6, status: "under-revised", note: "Finished $16.9M UNDER its revised budget. The machine can hit honest numbers" }, // [y6 p13]
  { project: "McDaniel HS", bond: "2017", ballotM: 146, latestM: 200.5, status: "near-revised", note: "Completed near its revised target" }, // [y6 p13]
  { project: "Center for Black Student Excellence", bond: "2020", ballotM: 60, latestM: 0, status: "unspent", note: "$60M allocated in 2020; zero dollars spent through February 2025; flagged by auditors three years running" }, // [y6 p21, p33-34]
] as const;

/** The waste examination, W1-W5, from document.md section 10. */
export const WASTE_VERDICTS = [
  {
    id: "W1",
    title: "Bond overruns",
    ledger: "locked",
    verdict: "Shown, on the locked ledger",
    evidence:
      "Benson $202M at ballot to $421M at completion including an auditor-named $14M budgeting error; the 2017 program built by cutting ~$100M from the district's own cost model before the ballot; a $60M commitment to Black Portland unspent for four years.",
    defense:
      "Construction inflation 2020-2023 was violent and national; seismic scope grew for real reasons; Lincoln finished under budget, so the machine can hit honest numbers.",
    bottomLine:
      "The controllable residual is smaller than the headlines and still very large. What it cost was never teachers. It was bond capacity and trust, which is what the next bond runs on.",
  },
  {
    id: "W2",
    title: "The carrying cost of the footprint",
    ledger: "movable",
    verdict: "A cost of delay",
    evidence:
      "Enrollment forecasts were public and unambiguous by 2021-22; consolidation began fall 2026; every year between, the General Fund paid full fixed costs on emptying buildings while cutting classroom positions.",
    defense:
      "Small schools are a purchase, not waste. Communities are allowed to buy walkability and belonging, and closures have historically landed on Black and brown Portland.",
    bottomLine:
      "The schools are not the waste. The years of drift are, and they were paid for out of classrooms.",
  },
  {
    id: "W3",
    title: "Central office and contracts",
    ledger: "movable",
    verdict: "Unexplained overhead",
    evidence:
      "Instruction FTE cut more than twice as fast as central business support; a paid assessment contract largely duplicating a free state service, flagged three years running, still in the budget; management-services lines up 199% in one proposed year.",
    defense:
      "Mandates grew; some 'support' spending is counselors and coaches; contracting can beat hiring once the pension tail is counted; two-thirds of the contract surge is bond construction.",
    bottomLine:
      "Not proven waste. But the district publishes no benchmarking that would let anyone check, and the absence of the explanation is itself the finding. The 2019 state audit said exactly this.",
  },
  {
    id: "W4",
    title: "Information waste",
    ledger: "movable",
    verdict: "Shown, and the largest",
    evidence:
      "The district's own quarterly reports show its FY2025-26 year-end forecast swinging from $41.3M to $17.7M to $26.8M to $34.6M within one year, with a mid-year deficit its citizen committee confirmed; a pension reserve spent in one year against a scheduled cliff; nine days for citizen review; audit recommendations still only 'partially implemented' at the state's follow-up. (Correction: an earlier version said no interim reports existed. They do, and they documented the swing while nothing forced a response.)",
    defense:
      "State revenue is genuinely hard to forecast; the budget office itself has been cut; the December report explained its own drivers; mid-year correction is at least responsiveness.",
    bottomLine:
      "The failure is not darkness. It is forecast quality, position control, and follow-through: the reports were public while the forecast whipsawed and staffing assumptions broke. If one thing changes, make the books decision-grade and act on them.",
  },
  {
    id: "W5",
    title: "One-time money on ongoing things",
    ledger: "committed",
    verdict: "A choice, not waste; the disclosure failure files under W4",
    evidence:
      "Almost $115M of ESSER braided into continuing programs; the cut sequence afterward tracks the withdrawal nearly dollar for dollar.",
    defense:
      "The money was designed for recovery services, which means people; children in crisis needed help immediately; a district that banked it would have been pilloried.",
    bottomLine:
      "The bet was defensible. Hiding the cliff was not. The citizen committee said the funding was 'hiding the looming shortfall' a full year before the strike.",
  },
] as const;

/** What the public record cannot answer, and the drafted (unsent) asks. */
export const GAPS = [
  { gap: "Corrected: interim reports DO exist", why: "An earlier version of this page said none existed. PPS publishes quarterly reports back to FY2023-24 and monthly period reports for FY2025-26, on a finance page our census missed. The real gap: no forecast-accuracy standard, no revision log, and nothing forcing action when the forecast swings $24M in a quarter", ask: "R1 withdrawn as written; the ask becomes forecast-accuracy scoring and public reconciliation of material changes", struck: true },
  { gap: "No bond disclosures on any PPS site; official statements live only on the municipal bond market's EMMA system", why: "The district's risk disclosures to investors are more candid than anything it publishes to voters", ask: "Post them" },
  { gap: "No state performance audit since January 2019", why: "A strike, an ESSER cycle, and five cut years with no state-level look", ask: "R8 to TSCC; the SoS decides its own docket" },
  { gap: "No published cost model for the ~$175M strike settlement (a press-carried district figure)", why: "The most charged causal claim in the city cannot be evaluated by anyone", ask: "R3: the model. The signed contract is public; the arithmetic is not" },
  { gap: "No position-control reports public", why: "The central-office growth fight runs on dueling unverifiable claims", ask: "R4: FTE by function and location, FY2018-19 forward" },
  { gap: "The closure savings model is not public", why: "Communities are asked to trust arithmetic nobody can check", ask: "R5: the model, before any list" },
  { gap: "R2, withdrawn", why: "We asked for a 'missing' FY2021-22 bond audit and then found it in our own corpus under another name. The real finding: no audit was issued during sixteen months of active construction in calendar 2022", ask: "Withdrawn, with the correction on the record", struck: true },
] as const;

/** Six tripwires for the decade ahead (document.md section 12). */
export const TRIPWIRES = [
  { what: "FY2027-28 budget, spring 2027", tripwire: "Does the General Fund fall a second consecutive year, and can the district state one gap number per cycle" },
  { what: "The closure decision", tripwire: "Savings model published before the vote; a resolution tying named savings to named classroom reinvestment" },
  { what: "February 2027", tripwire: "Any mid-year 'discovery' confirms the blackout is a policy, not an accident" },
  { what: "The 2025 bond's first audit cycle", tripwire: "Jefferson's estimate-at-completion vs the reduced target; the first CBSE dollar actually spent" },
  { what: "PERS 2027-29 rates", tripwire: "The school-pool rate adoption, with the stabilization reserve already gone" },
  { what: "The 2029 levy renewal", tripwire: "Whether the campaign prints the effective rate, near $1.51 and falling, next to the $1.99" },
] as const;

/** The doctrine (document.md section 14). */
export const DOCTRINE = {
  sentence:
    "Count every dollar in the open, say plainly which ones can move, and make every dollar that can move prove, in public, every spring, that nothing else it could buy would do more for a student who is here now.",
  annualQuestion: "Does the next dollar reach a student, and can you show me?",
  commitments: [
    "Make the interim statements decision-grade: forecast-accuracy scoring, revision logs, public reconciliation. No new money required.",
    "Publish the one-page budget: operating, capital, debt, side by side.",
    "Publish the trend table in every budget book. The state asked in 2019.",
    "Sort every dollar by ledger before arguing about it.",
    "Give citizen reviewers the weeks the work needs, and answer them in writing.",
    "Benchmark central costs against peers annually, or accept that others will.",
    "When spending one-time money on ongoing things, print the cliff beside the promise.",
    "Publish the closure savings model before asking any community to accept a closure.",
    "Treat an unremediated audit finding as a standing debt with a date on it.",
    "Put the levy's effective rate next to its nominal rate, everywhere.",
  ],
} as const;
