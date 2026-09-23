import type { Evidence } from "../../types";
import type { Delivery, DeliveryStep } from "../types";
import type { IssueId } from "../issues";

/**
 * District 4: how each candidate says they would deliver, and how they
 * would measure it. Sourced; gaps stay gaps.
 *
 * One entry exists for every candidate × issue slot that carries a
 * published position (33 slots). A rung is filled only when the cited
 * source names a mechanism (money, rules, staffing, sequencing,
 * partnership) or a result, number, deadline or metric. A rung is never
 * filled from the position itself or from a broad goal; when the source
 * adds nothing beyond the published position, the entry has neither rung.
 *
 * Venues reviewed September 20, 2026 (campaign sites fetched directly;
 * pamphlet is the county PDF already cited on each brief):
 *   https://www.eliforportland.com/issues
 *   https://www.eliforportland.com/homelessness
 *   https://www.eliforportland.com/public-safety
 *   https://www.eliforportland.com/fareless-transit
 *   https://www.eliforportland.com/contact
 *   https://www.oliviaforportland.com/
 *   https://www.oliviaforportland.com/priorities
 *   https://www.oliviaforportland.com/accomplishments
 *   https://evenstarforportland.com/
 *   https://evenstarforportland.com/platform
 *   https://evenstarforportland.com/portland-community-housing-plan
 *   https://evenstarforportland.com/faq
 *   https://mitch4portland.com/
 *   https://mitch4portland.com/priorities
 *   https://mitch4portland.com/record
 *   https://mitch4portland.com/connect
 *   https://jeremy4pdx.com/
 *   https://jeremy4pdx.com/platform-and-issues/
 *   https://www.joshforportland.com/  (no policy text; priorities page is an empty embed)
 *   https://www.joshforportland.com/priorities
 *   https://www.joshforportland.com/contact
 *   https://ez4pdx.com/
 *   https://ez4pdx.com/issues/
 *   https://ez4pdx.com/issue/homelessness/
 *   https://ez4pdx.com/issue/housing/
 *   https://ez4pdx.com/issue/public-safety/
 *   https://ez4pdx.com/issue/drug-addiction/
 *   https://ez4pdx.com/issue/transportation/
 *   https://ez4pdx.com/issue/221/
 *   https://ez4pdx.com/issue/portland-parks/
 *   https://mattschulte.wordpress.com/  (pamphlet's Mattschulte.org redirects here)
 *   https://mattschulte.wordpress.com/initiatives-plans-ideas/
 *   https://mattschulte.wordpress.com/2026/09/02/the-grid-connected-core/
 *   https://mattschulte.wordpress.com/2026/09/10/homelessness-and-the-last-mile/
 *   https://mattschulte.wordpress.com/2026/09/10/data-centers-and-megawatts/
 *   https://mattschulte.wordpress.com/2026/09/11/the-cei-hub-a-dynamic-proposal/
 *   https://mattschulte.wordpress.com/2026/09/14/no-strategic-plan/
 *   https://mattschulte.wordpress.com/contact/
 *   https://www.jayneforaflourishingportland.com/  (pamphlet prints jayneforaflourishingfuture.com, which does not resolve)
 * Not fetched: McDonald, Anderson and Goldsmith list no campaign site.
 */

const PAMPHLET =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const site = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 20, 2026",
  note: NOTE,
});

const pamphlet = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 18, 2026",
  note: NOTE,
});

const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });

const reviewed = { reviewedBy: "pending", reviewedOn: "2026-09-20" } as const;

type Venue = "campaign site" | "pamphlet" | "emailed response";

const entry = (
  candidateId: string,
  issue: IssueId,
  from: Venue,
  rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {},
): Delivery & { from: Venue } => ({
  candidateId,
  issue,
  ...rungs,
  from,
  ...reviewed,
});

/* Sources reused across entries. */
const andersonEmail: Evidence = {
  label: "Anderson · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#anderson-2026-09-19",
  kind: "Candidate statement",
  date: "Received September 19, 2026",
  note: NOTE,
};
const arnoldIssues = site("Arnold · detailed issue platform", "https://www.eliforportland.com/issues");
const arnoldSafety = site("Arnold · public safety plan", "https://www.eliforportland.com/public-safety");
const arnoldTransit = site("Arnold · fareless transit plan", "https://www.eliforportland.com/fareless-transit");
const clarkAccomplishments = site("Clark · first-year accomplishments", "https://www.oliviaforportland.com/accomplishments");
const evenstarHousingPlan = site("Evenstar · Portland Community Housing Plan", "https://evenstarforportland.com/portland-community-housing-plan");
const evenstarFaq = site("Evenstar · campaign FAQ", "https://evenstarforportland.com/faq");
const greenPriorities = site("Green · priorities", "https://mitch4portland.com/priorities");
const greenRecord = site("Green · record", "https://mitch4portland.com/record");
const schulteGrid = site("Schulte · the Grid-Connected Core", "https://mattschulte.wordpress.com/2026/09/02/the-grid-connected-core/");
const jbsPlatform = site("Beausoleil Smith · platform and issues", "https://jeremy4pdx.com/platform-and-issues/");
const zimmermanHousing = site("Zimmerman · housing", "https://ez4pdx.com/issue/housing/");
const zimmermanHomelessness = site("Zimmerman · homelessness", "https://ez4pdx.com/issue/homelessness/");
const zimmermanSafety = site("Zimmerman · public safety", "https://ez4pdx.com/issue/public-safety/");

const mcdonaldEmail: Evidence = {
  label: "McDonald · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#mcdonald-2026-09-23",
  kind: "Candidate statement",
  date: "Received September 23, 2026",
  note: NOTE,
};
export const deliveriesD4: Delivery[] = [
  /* ── Timothy (TJ) Anderson ──────────────────────────────────────────── */
  entry("timothy-tj-anderson", "housing", "emailed response", {
    how: step(
      "Reuse city assets at lower cost for short-term help; longer term, make the city more approachable and investable for large accounts and for people who want to make Portland home.",
      andersonEmail,
    ),
  }),
  entry("timothy-tj-anderson", "safety", "emailed response", {
    how: step(
      "More officers, with calls that do not need the most highly trained officers handed to a combination of cadets, volunteers and other programs as appropriate.",
      andersonEmail,
    ),
    measure: step("Police response times coming down.", andersonEmail),
  }),
  entry("timothy-tj-anderson", "money", "emailed response", {
    how: step(
      "A value-based audit of where city money went over three years, a public list of city assets, no new taxes or fees until it is done, and a Council pay freeze until salaries and jobs grow for two years.",
      andersonEmail,
    ),
    measure: step(
      "Puts the audit at no more than $5 million; would test average salary and job growth every six months, lifting the pay freeze only after two full years of growth.",
      andersonEmail,
    ),
  }),
  entry("timothy-tj-anderson", "climate", "emailed response", {
    how: step(
      "Favor climate measures that also help business investability, and add public transit and better train systems while leaving cars to those who want or need them.",
      andersonEmail,
    ),
  }),
  /* ── Eli Arnold ─────────────────────────────────────────────────────── */
  entry("eli-arnold", "housing", "campaign site", {
    how: step(
      "Would set a 120-day maximum for residential permits, with fees reduced or refunded if missed, defer system development charges until occupancy or sale, and require subsidized vacancies filled within 60 days.",
      arnoldIssues,
    ),
    measure: step(
      "Vacant subsidized units (about 1,900 today, he says) filled within 60 days, residential permits decided within 120 days, and public vacancy reporting from every subsidized provider.",
      arnoldIssues,
    ),
  }),
  entry("eli-arnold", "safety", "campaign site", {
    how: step(
      "Would create four police behavioral-health units pairing crisis-trained officers with clinicians, hire incrementally, restore three-person fire staffing and modernize dispatch triage, phased from 2027 through 2032 and beyond.",
      arnoldSafety,
    ),
    measure: step(
      "A phased path toward about 1.5 officers per 1,000 residents (from 1.27), with faster response and shorter queue times reported publicly; cites a roughly $37M-a-year cost estimate by 2035.",
      arnoldSafety,
    ),
  }),
  entry("eli-arnold", "money", "campaign site", {
    how: step(
      "Would raise the small-business income exemption from $100,000 to $150,000, make it permanent and inflation-indexed, seek County alignment, and offer a three-to-five-year tax holiday to new small businesses.",
      arnoldIssues,
    ),
  }),
  entry("eli-arnold", "climate", "campaign site", {
    how: step(
      "Would fund fareless transit from a portion of Portland Clean Energy Fund revenue (he cites about $200M a year against $63.65M in TriMet fares), through a City–TriMet–PCEF task force in the first 100 days.",
      arnoldTransit,
    ),
    measure: step(
      "Tracks ridership growth, emissions and vehicle miles reduced, cost per added rider and rider satisfaction, with fares gone systemwide by year two; cites 20%-plus ridership gains elsewhere.",
      arnoldTransit,
    ),
  }),

  /* ── Olivia Clark ───────────────────────────────────────────────────── */
  entry("olivia-clark", "housing", "campaign site"),
  entry("olivia-clark", "safety", "pamphlet", {
    measure: step(
      "Names improved 9-1-1 response times as the visible result; no target time or date is given.",
      pamphlet(62),
    ),
  }),
  entry("olivia-clark", "money", "pamphlet"),
  entry("olivia-clark", "climate", "campaign site", {
    how: step(
      "Points to the citywide asset-management (maintenance) strategy she passed as the vehicle for keeping water, sewer and street systems maintained; no climate-specific funding is named.",
      clarkAccomplishments,
    ),
  }),

  /* ── Jayne Cronlund ─────────────────────────────────────────────────── */
  entry("jayne-cronlund", "money", "pamphlet"),
  entry("jayne-cronlund", "climate", "pamphlet"),

  /* ── Jamey Evenstar ─────────────────────────────────────────────────── */
  entry("jamey-evenstar", "housing", "campaign site", {
    how: step(
      "Would seed a Portland Community Housing Fund with the existing $17.5M plus a new Housing Supply Impact Fee on non-primary residences, raise urban-renewal housing share from 45% to 75%, and use PCEF dollars.",
      evenstarHousingPlan,
    ),
  }),
  entry("jamey-evenstar", "safety", "campaign site"),
  entry("jamey-evenstar", "money", "campaign site", {
    how: step(
      "Would give Council independent staff capacity for budget oversight, address top-heavy management and executive pay, and back the participatory-budgeting initiative for a share of general-fund spending.",
      evenstarFaq,
    ),
  }),
  entry("jamey-evenstar", "climate", "campaign site"),

  /* ── Mitch Green ────────────────────────────────────────────────────── */
  entry("mitch-green", "housing", "campaign site", {
    how: step(
      "Points to the Keep Portland Housed ordinance’s $17.5M for buying commercial buildings to convert and a revolving loan fund, plus a Housing Bureau study of alternative financing models.",
      greenRecord,
    ),
    measure: step(
      "Rent tied to income: someone earning $10,000 a year would pay no more than $3,000 in rent.",
      greenPriorities,
    ),
  }),
  entry("mitch-green", "safety", "campaign site", {
    how: step(
      "Secured FY 2025–26 funding to restart an independent evaluation of Street Response and created a public-safety set-aside fund to add staff as the program moves to a 24/7 model.",
      greenRecord,
    ),
  }),
  entry("mitch-green", "money", "pamphlet", {
    how: step(
      "Names larger contributions from the biggest corporations as the revenue source; no rate or amount is given.",
      pamphlet(62),
    ),
  }),
  entry("mitch-green", "climate", "campaign site"),

  /* ── Josh Leake ─────────────────────────────────────────────────────── */
  entry("josh-leake", "housing", "pamphlet", {
    measure: step(
      "Says the result would be “thousands” of accessible homes on underused land; no count, timeline or site is given.",
      pamphlet(66),
    ),
  }),
  entry("josh-leake", "safety", "pamphlet"),
  entry("josh-leake", "money", "pamphlet"),

  /* ── John McDonald ──────────────────────────────────────────────────── */
  entry("john-mcdonald", "safety", "pamphlet"),
  entry("john-mcdonald", "money", "emailed response", {
    how: step("The City’s current proposal: $120 million up front and $275 million in ongoing maintenance over a 20-year lease, with other revenue expected to follow the teams’ success.", mcdonaldEmail),
  }),
  entry("john-mcdonald", "climate", "pamphlet"),

  /* ── Matt Schulte ───────────────────────────────────────────────────── */
  entry("matt-schulte", "safety", "campaign site"),
  entry("matt-schulte", "money", "campaign site", {
    how: step(
      "Would finance building upgrades through PropertyFit, PCEF loans, Energy Trust and state and federal programs, not the General Fund, with PGE demand-response payments repaying PCEF; NSF’s FAST consortium as anchor tenant.",
      schulteGrid,
    ),
  }),
  entry("matt-schulte", "climate", "campaign site", {
    how: step(
      "Would have PGE and Prosper Portland identify buildings and measure capacity, financing energy work through PropertyFit, PCEF, Energy Trust and state and federal programs rather than the General Fund.",
      schulteGrid,
    ),
  }),

  /* ── Jeremy Beausoleil Smith ────────────────────────────────────────── */
  entry("jeremy-beausoleil-smith", "housing", "campaign site", {
    how: step(
      "Renters’ protections would be rule changes: no rent increases while code violations exist, six months’ notice, eviction limits during the school year and extreme weather, right to counsel; social-housing funding is not named.",
      jbsPlatform,
    ),
  }),
  entry("jeremy-beausoleil-smith", "safety", "campaign site", {
    how: step(
      "Would expand Portland Street Response to 24/7 citywide coverage by adding staff and transport capacity; no funding source is named.",
      jbsPlatform,
    ),
  }),
  entry("jeremy-beausoleil-smith", "money", "pamphlet"),
  entry("jeremy-beausoleil-smith", "climate", "campaign site", {
    how: step(
      "Would stop further CEI Hub expansion and develop a full tank draw-down plan; the data-center moratorium would be a four-year rule; no funding source is named for walking and cycling.",
      jbsPlatform,
    ),
    measure: step(
      "Points to Portland’s net-zero carbon commitment by 2050 as the target every major transportation, energy and building decision would be measured against.",
      jbsPlatform,
    ),
  }),

  /* ── Eric Zimmerman ─────────────────────────────────────────────────── */
  entry("eric-zimmerman", "housing", "campaign site", {
    how: step(
      "Would add a five-year SDC grant program, 10-year tax abatements for ownership units sold at 125% MFI, “permit upon review” for proven developers, and open more TASS and pod shelter sites.",
      zimmermanHousing,
    ),
    measure: step(
      "Permanently affordable projects over 50 units permitted in 90 days or less; unsanctioned camping ended “as quickly as possible,” with no date.",
      zimmermanHomelessness,
    ),
  }),
  entry("eric-zimmerman", "safety", "campaign site", {
    how: step(
      "Would expand patrol and detective units, trimming other support roles until fully staffed; let Street Response transport people to sobering and psychiatric care; add a 24/7 drop-off sobering center; seek SHS dollars for treatment.",
      zimmermanSafety,
    ),
    measure: step(
      "A Police Bureau of 1,000 sworn officers and an end to unsanctioned camping; no dates are given.",
      zimmermanSafety,
    ),
  }),
  entry("eric-zimmerman", "money", "pamphlet"),
];
