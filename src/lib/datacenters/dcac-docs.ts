/**
 * The public record of Governor Kotek's Data Center Advisory Committee —
 * every document and recording posted to the Oregon Dept. of Energy's
 * committee page, indexed August 3, 2026:
 * https://www.oregon.gov/energy/get-involved/pages/oregon-data-center-advisory-committee.aspx
 *
 * Titles identify the presenter and organization; URLs are ODOE's own.
 */

const D = "https://www.oregon.gov/energy/get-involved/Documents/";

export interface DcacDoc {
  title: string;
  org: string;
  url: string;
  kind: "agenda" | "summary" | "presentation" | "recording" | "foundational";
}

export interface DcacSession {
  id: string;
  date: string;
  topic: string;
  recording?: string;
  docs: DcacDoc[];
}

export const DCAC_FOUNDATIONAL: DcacDoc[] = [
  {
    title: "Committee charge from Governor Kotek",
    org: "Governor's Office",
    url: `${D}Data-Center-Advisory-Committee-Charge.pdf`,
    kind: "foundational",
  },
  {
    title: "Member roster & biographies",
    org: "ODOE",
    url: `${D}Oregon-Statewide-Data-Center-Advisory-Committee-Members.pdf`,
    kind: "foundational",
  },
];

export const DCAC_SESSIONS: DcacSession[] = [
  {
    id: "s1",
    date: "Feb 27, 2026",
    topic: "Economic development & workforce",
    recording: "https://www.youtube.com/watch?v=c-RZiMyRu00",
    docs: [
      { title: "Agenda & speakers", org: "ODOE", url: `${D}2026-02-27-DCAC-Agenda-Speakers.pdf`, kind: "agenda" },
      { title: "Committee kickoff presentation", org: "ODOE", url: `${D}2026-02-27-DCAC-Presentation.pdf`, kind: "presentation" },
      { title: "Data centers in Oregon: overview", org: "ODOE", url: `${D}2026-02-27-Data-Centers-Overview-Presentation.pdf`, kind: "presentation" },
      { title: "Industry panel presentation", org: "Data center industry panel", url: `${D}2026-02-27-Data-Center-Panel-Presentation.pdf`, kind: "presentation" },
      { title: "Facilitator summary, Session 1", org: "Facilitation team", url: `${D}2-27-2026-DCAC-Session-1-Facilitator-Summary.pdf`, kind: "summary" },
    ],
  },
  {
    id: "s2",
    date: "Mar 27, 2026",
    topic: "Water resources",
    recording: "https://www.youtube.com/watch?v=pZLtjrYDf3M",
    docs: [
      { title: "Agenda: data centers & water", org: "ODOE", url: `${D}2026-03-27-Data-Center-AC-Agenda-Water.pdf`, kind: "agenda" },
      { title: "Data centers & water dialogue (draft)", org: "ODOE", url: `${D}2026-03-27-Data-Centers-and-Water-Dialogue-Draft.pdf`, kind: "presentation" },
      { title: "Ivan Gall — water rights & supply", org: "Oregon Water Resources Dept", url: `${D}2026-03-27-Ivan-Gall-DataCenter-PPT.pdf`, kind: "presentation" },
      { title: "Josh Hatch — data center water use", org: "Consultant", url: `${D}2026-03-27-Josh-Hatch-DataCenter-WaterUse-PPT.pdf`, kind: "presentation" },
      { title: "Mike Kucinski — water-quality permitting", org: "Oregon DEQ", url: `${D}2026-03-27-Mike%20Kucinski-DataCenter-WQPermitting-PPT.pdf`, kind: "presentation" },
      { title: "Iverson & Dias — Hillsboro's water system", org: "City of Hillsboro", url: `${D}2026-03-27-Iverson-Dias-Hillsboro.pdf`, kind: "presentation" },
      { title: "Klebes & Anderson — The Dalles' water deal", org: "City of The Dalles", url: `${D}2026-03-27-Klebes-Anderson-The-Dalles.pdf`, kind: "presentation" },
      { title: "Morgan — Hermiston's perspective", org: "City of Hermiston", url: `${D}2026-03-27-Morgan-City-of-Hermiston.pdf`, kind: "presentation" },
      { title: "Cochran, Maille, Travor & Hildebrand", org: "Panel", url: `${D}2026-03-27-Cochran-Maille-Travor-Hildebrand.pdf`, kind: "presentation" },
      { title: "Schilz — Amazon's water stewardship", org: "Amazon", url: `${D}2026-03-27-Schilz-Amazon.pdf`, kind: "presentation" },
      { title: "Shin — Google in The Dalles", org: "Google", url: `${D}2026-03-27-Shin-Google-The-Dalles.pdf`, kind: "presentation" },
      { title: "Campbell — river & water advocacy", org: "Columbia Riverkeeper", url: `${D}2026-03-27-Campbell-Columbia-Riverkeeper.pdf`, kind: "presentation" },
      { title: "Carter & Cetas — tribal fisheries", org: "CRITFC", url: `${D}2026-03-27-Carter-Cetas-CRITFC.pdf`, kind: "presentation" },
      { title: "Quaempts — First Foods & water", org: "CTUIR", url: `${D}2026-03-27-Quaempts-CTUIR.pdf`, kind: "presentation" },
      { title: "Means & Gray — coldwater fisheries", org: "Trout Unlimited", url: `${D}2026-03-27-Means-Gray-Trout-Unlimited.pdf`, kind: "presentation" },
      { title: "O'Connor — water & climate", org: "Environmental Defense Fund", url: `${D}2026-03-27-OConnor-Environmental-Defense-Fund.pdf`, kind: "presentation" },
      { title: "Poton — environmental justice", org: "Verde", url: `${D}2026-03-27-Poton-Verde.pdf`, kind: "presentation" },
      { title: "Smith — farms & parks", org: "RII", url: `${D}2026-03-27-Smith-RII-Farm-Parks.pdf`, kind: "presentation" },
      { title: "Facilitator summary, Session 2", org: "Facilitation team", url: `${D}2026-03-27-DCAC-Facilitators-Summary.pdf`, kind: "summary" },
    ],
  },
  {
    id: "listening",
    date: "Apr 17, 2026",
    topic: "Public listening session",
    recording: "https://youtu.be/9iVNxR0hRfo",
    docs: [],
  },
  {
    id: "s3",
    date: "Apr 24, 2026",
    topic: "Land use",
    recording: "https://youtu.be/8EBCILcVgHQ",
    docs: [
      { title: "Agenda & speakers", org: "ODOE", url: `${D}2026-04-24-DCAC-Agenda-Speakers.pdf`, kind: "agenda" },
      { title: "McIlvaine — what Oregon land-use law allows", org: "DLCD", url: `${D}2026-04-24-1-Leigh-McIlvaine-DLCD-DCAC-LandUse.pdf`, kind: "presentation" },
      { title: "Mabbott — Morrow County's experience", org: "Morrow County", url: `${D}2026-04-24-2-Tamra-Mabbott-Morrow-County-DCAC-Presentation.pdf`, kind: "presentation" },
      { title: "Dias — Hillsboro's experience", org: "City of Hillsboro", url: `${D}2026-04-24-3-Dan-Dias-City-of-Hillsboro-OR-DCAC-Land-Use-Presentation.pdf`, kind: "presentation" },
      { title: "Hoagland — how data centers get sited", org: "Mackenzie Inc.", url: `${D}2026-04-24-4-Alison-Hoagland-Mackenzie-Inc-DCAC-Presentation.pdf`, kind: "presentation" },
      { title: "Diaz — statewide siting guardrails", org: "1000 Friends of Oregon", url: `${D}2026-04-24-6-Sam-Diaz-1000-Friends-of-Oregon-Presentation-to-DCAC.pdf`, kind: "presentation" },
      { title: "Gordon — high desert siting", org: "Central Oregon LandWatch", url: `${D}2026-04-24-7-Ben-Gordon-Central-Oregon-LandWatch-Data-Centers-Deck.pdf`, kind: "presentation" },
      { title: "Brandt — co-siting with renewables", org: "Renewable Northwest", url: `${D}2026-04-24-8-Diane-Brandt-Renewable-Northwest-DCAC-Land-Use-Session.pdf`, kind: "presentation" },
      { title: "Facilitator summary, Session 3", org: "Facilitation team", url: `${D}2026-04-24-DCAC-Facilitator-Summary.pdf`, kind: "summary" },
    ],
  },
  {
    id: "s4",
    date: "May 29, 2026",
    topic: "Energy",
    recording: "https://youtu.be/X0AIcsBitgs",
    docs: [
      { title: "Agenda", org: "ODOE", url: `${D}2026-5-29-DCAC-Agenda.pdf`, kind: "agenda" },
      { title: "Bayer — Oregon's energy landscape", org: "ODOE", url: `${D}01-Edith-Bayer-ODOE-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Hart — load growth analytics", org: "Sylvan Energy Analytics", url: `${D}02-Elaine-Hart-Sylvan-Energy-Analytics-DCAC-5-29-26.pdf`, kind: "presentation" },
      { title: "Wyckoff — how Minnesota does it", org: "State of Minnesota", url: `${D}03-Pete-Wyckoff-State-of-Minnesota-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Zuckerman — Google's energy approach", org: "Google", url: `${D}04-Ellen-Zuckeman-Google-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Hindi — federal power & transmission", org: "Bonneville Power Administration", url: `${D}05-Hamody-Hindi-BPA-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "McFarland — serving large loads", org: "Portland General Electric", url: `${D}06-John-McFarland-PGE-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Falkenberg — a PUD's view", org: "Northern Wasco County PUD", url: `${D}07-Humaira-Falkenberg-NWCPUD-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Hathaway — efficiency programs", org: "Energy Trust of Oregon", url: `${D}08-Natalie-Hathaway-Energy-Trust-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Basofin — climate guardrails", org: "Climate Solutions", url: `${D}09-Joshua-Basofin-Climate-Solutions-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Tabak — flexible data centers", org: "Verrus Data", url: `${D}10-Gabe-Tabak-Verrus-Data-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Ganuelas — tribal energy priorities", org: "CTUIR", url: `${D}11-Trustee-Lisa-Ganuelas-CTUIR-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Golightly & Sheets — hydro & fish", org: "CRITFC", url: `${D}12-Christine-Golightly-Ed-Sheets-CRITFC-DCAC-05-29-2026.pdf`, kind: "presentation" },
      { title: "Facilitator summary, Session 4", org: "Facilitation team", url: `${D}2026-05-29-DCAC-Facilitator-Meeting-Summary.pdf`, kind: "summary" },
    ],
  },
  {
    id: "s5",
    date: "Jun 26, 2026",
    topic: "Energy affordability, revenue & incentives",
    recording: "https://youtu.be/HdzD8a37EsQ",
    docs: [
      { title: "Agenda", org: "ODOE", url: `${D}2026-06-26-DCAC-Agenda.pdf`, kind: "agenda" },
      { title: "Moser & Stevens", org: "Session presenters", url: `${D}01-Nolan-Moser-Bret-Stevens-DCAC.pdf`, kind: "presentation" },
      { title: "Gray", org: "Session presenter", url: `${D}02-Roger-Gray-DCAC.pdf`, kind: "presentation" },
      { title: "Echenrode", org: "Umatilla Electric Cooperative", url: `${D}03-Robert-Echenrode-DCAC.pdf`, kind: "presentation" },
      { title: "Jenk", org: "Session presenter", url: `${D}04-Bob-Jenk-DCAC.pdf`, kind: "presentation" },
      { title: "Rodriguez", org: "Session presenter", url: `${D}05-Anahi-Rodriguez-DCAC.pdf`, kind: "presentation" },
      { title: "LeBel, Eberle & Griffin", org: "Session presenters", url: `${D}06-Mark-LeBel-Luisa-Eberle-Jay-Griffin-DCAC.pdf`, kind: "presentation" },
      { title: "Saladino", org: "Session presenter", url: `${D}07-Michael-Saladino-DCAC%20Slides.pdf`, kind: "presentation" },
      { title: "Albertine & Held", org: "Session presenters", url: `${D}08-Alex-Albertine-Michael-Held-DCAC.pdf`, kind: "presentation" },
      { title: "Gorman", org: "Session presenter", url: `${D}09-Mike-Gorman-DCAC.pdf`, kind: "presentation" },
      { title: "Philippi Griggs", org: "Boardman Chamber of Commerce", url: `${D}10-Torrie-Philippi-Griggs-DCAC.pdf`, kind: "presentation" },
      { title: "Wiser", org: "Tax Fairness Oregon", url: `${D}11-Jody-Wiser-DCAC.pdf`, kind: "presentation" },
      { title: "Mooney", org: "Session presenter", url: `${D}12-Tricia-Mooney-DCAC.pdf`, kind: "presentation" },
      { title: "Harpel", org: "Smart Incentives", url: `${D}13-Ellen-Harpel-DCAC.pdf`, kind: "presentation" },
      { title: "Facilitator summary, Session 5", org: "Facilitation team", url: `${D}2026-06-26-DCAC-Facilitator-Meeting-Summary.pdf`, kind: "summary" },
    ],
  },
  {
    id: "s6",
    date: "Jul 31, 2026",
    topic: "Additional considerations & deliberations",
    recording: "https://www.youtube.com/watch?v=xqjbHmjHg-8",
    docs: [
      { title: "Agenda & meeting notice", org: "ODOE", url: `${D}2026-07-31-DCAC-Session-6.pdf`, kind: "agenda" },
      { title: "Process overview & report path", org: "ODOE", url: `${D}2026-07-31-DCAC-Process-Overview-Presentation.pdf`, kind: "presentation" },
      { title: "Understanding the data center industry", org: "ECONorthwest", url: `${D}2026-07-31-ECONW-Understanding-Data-Center-Industry.pdf`, kind: "presentation" },
      { title: "Property tax abatements & school funding", org: "Oregon Dept. of Education", url: `${D}2026-07-31-OR-Dept-Education-Revenue-Impact-Presentation.pdf`, kind: "presentation" },
      { title: "Air-quality permitting for data centers", org: "Oregon DEQ", url: `${D}2026-07-31-Oregon-DEQ-Air-Quality-Permitting-Presentation.pdf`, kind: "presentation" },
    ],
  },
  {
    id: "s7",
    date: "Aug 4, 2026",
    topic: "Deliberations, continued",
    docs: [
      { title: "Agenda", org: "ODOE", url: `${D}2026-08-04-DCAC-Agenda.pdf`, kind: "agenda" },
    ],
  },
];

export const DCAC_DOC_COUNT =
  DCAC_FOUNDATIONAL.length +
  DCAC_SESSIONS.reduce((n, s) => n + s.docs.length + (s.recording ? 1 : 0), 0);
