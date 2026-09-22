import type { Evidence } from "../../../types";
import { emptyPack, type RacePack, type RaceStakes } from "../../types";

/**
 * Race pack: Portland City Council districts. The council races keep their
 * original content files (lines, chips, deliveries, topics, stances); this
 * pack carries only what those files never had, the "What's at stake" block
 * for each district, to the same standard as the governor's and the
 * county's (../../types.ts, RaceStakes).
 *
 * Every item is a fact from the City's own record (budget documents, Council
 * resolutions and ordinances with their roll calls, bureau reports and
 * dashboards) read on September 22, 2026; a note names the reporting that
 * carried the same number where it helps a reader. The same block serves
 * every candidate in the race; nothing here characterizes a candidate.
 */

const REVIEWED = "reviewed September 22, 2026";

const record = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Public record",
  date: `${date}; ${REVIEWED}`,
  ...(note ? { note } : {}),
});

const COUNCIL_DOCS = "https://www.portland.gov/council/documents";

/* ── Stakes sources: the City's record ───────────────────────────────── */

const fsrpReport = record(
  "City of Portland · Financial Stabilization & Recovery Plan Workgroup recommendations",
  "https://www.portland.gov/hello/documents/financial-stabilization-and-recovery-plan-workgroup-recommendations",
  "September 2026; Council work session September 23, 2026",
  "Appendix A cites the FY 2026–27 adopted budget ($8.55 billion total; $803.4 million General Fund discretionary) and finds assessed value growth below 2.2% for two consecutive years against a 4.1% long-run average, personnel at about 70% of ongoing General Fund bureau expenses, and more than $50 million of one-time General Fund money supporting programs in FY 2025–26. The June closure figures ($170 million gap, $47 million from reserves and contingency, $27 million of Clean Energy Fund interest, about 140 positions) are from the City’s June 18, 2026 release (portland.gov/hello/news/2026/6/18/portland-city-council-adopts-final-budget-2026-27); the July 22, 2026 supplemental budget (Ordinance 192207, 10–2) then drew $9.96 million more from contingency to keep 30 positions.",
);
const modaTerms = record(
  "Resolution 37750 · non-binding Moda Center term sheet, adopted text and roll call",
  `${COUNCIL_DOCS}/resolution/adopted/37750`,
  "August 12, 2026",
  "Passed 8–4: Novick, Clark, Zimmerman, Smith, Kanal, Pirtle-Guiney, Ryan and Dunphy yes; Koyama Lane, Morillo, Green and Avalos no. The term sheet is a negotiating framework; the definitive lease, operating and renovation agreements need further votes.",
);
const irpDashboard = record(
  "City of Portland · Impact Reduction Program data dashboard and performance measures",
  "https://www.portland.gov/homelessness-impact-reduction/impact-reduction-program-dashboard-and-performance-measures",
  "Updated August 7, 2026",
  "The camping rules are City Code 14A.50.150 and 14A.50.160 (portland.gov/code/14/a50/150). The November 12, 2025 amendment (Morillo 1) to move about $4.3 million from removals to services drew five votes and needed seven (OPB, November 13, 2025). Winter shelter counts are from City Shelter Services, “Changes for City shelter services,” July 21, 2026, updated August 24 (portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services).",
);
const psrFiveYears = record(
  "Portland Street Response · Five years on, PSR has become a pillar for public safety",
  "https://www.portland.gov/streetresponse/news/2026/2/17/five-years-portland-street-response-has-become-pillar-public-safety",
  "February 17, 2026",
  "Resolution 37709 (June 25, 2025; 10–2, Clark and Ryan no) set Council’s direction that PSR be an integrated branch of first response dispatched through 911. The FY 2026–27 amendment Morillo 1 (passed June 11, 2026) restored 4.0 FTE and $659,274 so peer support continues seven days a week (portland.gov/budget/2026-2027-budget/documents/fy-26-27-budget-amendments-only-passed-amendments).",
);
const streetFee = record(
  "Ordinance 192171 · Transportation Utility Fee, passed text and roll call",
  `${COUNCIL_DOCS}/ordinance/passed/192171`,
  "April 29, 2026",
  "Passed 9–3: Ryan, Zimmerman and Smith no. Water figures are from Ordinance 192183 (May 27, 2026; 8–4: Ryan, Koyama Lane, Morillo and Zimmerman no), which set FY 2026–27 water rates, and from the Water Bureau’s Bull Run filtration costs and funding page (portland.gov/water/bullruntreatment/filtration/filtration-costs-and-funding): program funding $2.58 billion after the FY 2026–27 budget, up from the 2024 estimate of $2.1 billion (OPB, February 20, 2026); compliance deadline extended to September 2029.",
);
const policeReport = record(
  "Office of the Deputy City Administrator for Public Safety · A report on police staff recruitment goals and costs",
  "https://www.portland.gov/community-safety/documents/report-police-staff-recruitment-goals-and-costs",
  "June 15, 2026",
  "Requested by Resolution 37738 (February 12, 2026, 7–5). The report counts 877 authorized sworn and 342 non-sworn positions; about 89 positions ($11.7 million) unfunded within a roughly $320 million budget; average high-priority response of 20.4 minutes in FY 2024–25 against 7.5 in FY 2015–16, with a seven-minute goal adopted April 2026; and, under its status-quo hiring scenario, about $37.3 million a year above current levels by FY 2035–36 plus an estimated $338 million in long-term capital needs.",
);
const dataCenters = record(
  "Resolution 37753 · data-center non-disclosure agreements, notice to Council and future restrictions",
  `${COUNCIL_DOCS}/resolution/adopted/37753`,
  "September 16, 2026",
  "Adopted 11–0 with Smith absent; all twelve councilors are listed as sponsors. A resolution states intent; a moratorium or zoning limit would need a code change and a further vote.",
);
const shelterChanges = record(
  "City Shelter Services · Changes for City shelter services, FY 2026–27",
  "https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services",
  "July 21, 2026; updated August 24, 2026",
  "The FY 2026–27 budget cut shelter services by $18 million (31%) to $40 million (City release, June 18, 2026). Site capacities are as the page lists them; the Clinton Triangle shelter is at 1490 SE Gideon St in Hosford-Abernethy, and SE Grand Recovery (636 SE Grand Ave, 140 beds) and CityTeam Grand (526 SE Grand Ave, 80 beds) are recovery-oriented overnight shelters in Buckman.",
);
const kellerPsu = record(
  "Resolution 37752 · a new PSU venue and the Keller Auditorium’s future, adopted text and roll call",
  `${COUNCIL_DOCS}/resolution/adopted/37752`,
  "September 9, 2026",
  "Passed 8–4: Koyama Lane, Morillo, Kanal and Ryan no. The resolution authorizes planning and pre-development, not a construction budget or a financing deal; staff must return with a detailed financial plan before any City financial commitment.",
);

/* ── Items shared by both districts ──────────────────────────────────── */

type StakeItem = RaceStakes["items"][number];

const stakeBudget: StakeItem = {
  label: "Next budget gap",
  text:
    "Council balanced the $8.55 billion FY 2026–27 budget (about $803.4 million of it discretionary) against a $170 million General Fund gap with roughly 140 positions cut, $47 million from reserves and contingency and $27 million of Clean Energy Fund interest. A September 2026 workgroup report before Council on September 23 finds citywide assessed value growth below 2.2% for two years running and personnel at about 70% of ongoing General Fund bureau costs, and recommends biennial budgets, a defined list of core services and a new revenue strategy.",
  source: fsrpReport,
};
const stakeModa: StakeItem = {
  label: "Moda Center deal",
  text:
    "Resolution 37750 (8–4, August 12, 2026) approved a non-binding term sheet for a roughly $500 million arena renovation with a $573 million public budget: up to $365 million in state bonds, $120 million from the City “from sources yet to be confirmed” and $88 million from the county, plus $275 million in City payments over 20 years from the ticket- and parking-funded Spectator Venues fund. Definitive agreements are due before Council by December 31, 2026.",
  source: modaTerms,
};
const stakeCamping: StakeItem = {
  label: "Camping and removals",
  text:
    "City code bars camping on public property when reasonable shelter is available and restricts how people may camp; the Impact Reduction Program removed 7,480 campsites in FY 2025–26 on 105,180 reports, with removal costs of $8.52 million. A November 2025 amendment to move about $4.3 million from removals to services drew five votes and needed seven, and the City expects 580 adult overnight shelter beds this winter, down from 876.",
  source: irpDashboard,
};
const stakeStreetResponse: StakeItem = {
  label: "Street Response",
  text:
    "Portland Street Response runs on about $10 million a year with 52 staff, answering calls seven days a week but not around the clock; it took 15,353 calls in 2025, and 6% needed police or ambulance co-response. Council’s June 2025 resolution (10–2) made it an integrated branch of first response dispatched through 911, and the FY 2026–27 budget restored four peer-support positions ($659,274) the proposed budget had cut.",
  source: psrFiveYears,
};
const stakeBills: StakeItem = {
  label: "Street fee, water bills",
  text:
    "A street repair fee passed 9–3 in April 2026 adds $12 a month for a single-family home and $8.40 per apartment unit from January 1, 2027, an estimated $46 million a year with 75% for maintenance; the May 2026 water ordinance (8–4) raised the typical monthly water charge from $65.57 to $70.89. Water bills carry the Bull Run filtration project, whose budget rose about $450 million in February 2026 to $2.56 billion ($2.58 billion program-wide after the FY 2026–27 budget), with the state deadline moved to September 2029.",
  source: streetFee,
};
const stakePolice: StakeItem = {
  label: "Police staffing",
  text:
    "The June 2026 staffing report Council requested (7–5) counts 877 authorized sworn positions, about 89 of them ($11.7 million) unfunded within a roughly $320 million budget, and high-priority response times averaging 20.4 minutes in FY 2024–25 against 7.5 in FY 2015–16. Growing the sworn ranks at current hiring rates would cost about $37.3 million a year more by FY 2035–36, before an estimated $338 million in facilities.",
  source: policeReport,
};
const stakeDataCenters: StakeItem = {
  label: "Data centers",
  text:
    "Resolution 37753 (11–0, September 16, 2026) asks the City Administrator not to sign data-center non-disclosure agreements, to notify Council of any inquiry for a facility drawing 20 megawatts or more, and states Council’s intent to pursue a moratorium or zoning limits on hyperscale data centers. Any actual restriction needs a code change and a further vote; the resolution notes data centers now use 5.6% of Oregon’s electricity.",
  source: dataCenters,
};

/* ── Items specific to one district ──────────────────────────────────── */

const stakeShelterD3: StakeItem = {
  label: "Shelter in District 3",
  text:
    "The district holds the 160-unit Clinton Triangle alternative shelter at 1490 SE Gideon St (205 people) and 220 recovery-oriented overnight beds at two shelters on SE Grand Avenue, all listed as open in the City’s FY 2026–27 shelter plan. Citywide, the City expects capacity for 718 people at its 24/7 and alternative sites this year against 867 last year, after the budget cut shelter services by $18 million (31%).",
  source: shelterChanges,
};
const stakeKellerD4: StakeItem = {
  label: "Keller and PSU venue",
  text:
    "Resolution 37752 (8–4, September 9, 2026) backed planning for a City-owned, roughly 3,000-seat Broadway-capable venue at Portland State with a 2030 opening goal and a $137.5 million state funding commitment, and started planning for a smaller 1,200- to 1,800-seat Keller Auditorium, which needs $8.5 million to $17.5 million of maintenance over ten years. Staff owe a project commitment agreement with PSU by December 1, 2026 and a detailed financial plan before any City money is committed.",
  source: kellerPsu,
};

/* ── Stakes: what a district councilor decides this term ─────────────── */

/**
 * The office, per the City Charter (Sections 2-101, 2-102, 3-101, amended
 * November 8, 2022, effective January 1, 2025): twelve councilors, four
 * districts of three, legislative and quasi-judicial authority in the
 * Council, executive and administrative authority in the mayor, who runs
 * the bureaus through the city administrator. The 2024 winners in
 * Districts 3 and 4 drew initial two-year terms; from this election the
 * seats carry four years. Budget totals are the City Budget Office's FY
 * 2026–27 Adopted Budget page (portland.gov/budget/2026-2027-budget/development/adopted),
 * read September 22, 2026. Neighborhood lists are the City's district pages.
 */
const ROLE =
  "A district councilor is one of twelve under the 2025 charter: four districts, three seats each, a Council that passes the budget, ordinances and resolutions while the mayor and city administrator run the bureaus.";
const TERM =
  "The 2024 winners here drew two-year terms; this election fills four-year seats, so the next three councilors vote on four budgets in a City that spends $8.55 billion a year with about $803 million of it discretionary.";

const stakes: RaceStakes[] = [
  {
    raceId: "portland-district-3",
    intro: `${ROLE} District 3 covers inner Southeast and a slice of inner Northeast, from Buckman and Kerns to Montavilla and Woodstock. ${TERM}`,
    items: [stakeBudget, stakeModa, stakeCamping, stakeShelterD3, stakeStreetResponse, stakeBills, stakePolice, stakeDataCenters],
  },
  {
    raceId: "portland-district-4",
    intro: `${ROLE} District 4 covers the west side, from Downtown, Old Town and the Pearl through Northwest and the Southwest hills to Multnomah, plus Sellwood-Moreland and Eastmoreland across the river. ${TERM}`,
    items: [stakeBudget, stakeModa, stakeCamping, stakeStreetResponse, stakeBills, stakePolice, stakeDataCenters, stakeKellerD4],
  },
];

export const pack: RacePack = {
  ...emptyPack(),
  stakes,
};
