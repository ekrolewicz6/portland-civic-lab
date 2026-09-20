import type { Evidence } from "../../types";
import type { TopicStance } from "../types";

/**
 * District 3: explicit, sourced stances on the extra topics. Never inferred
 * from silence, party, endorsements or general values.
 *
 * Rule (research pass of September 20, 2026): a cell exists only when the
 * candidate's own venue (the sources the brief already cites, or a page of
 * the candidate's own campaign site) contains an explicit statement about
 * that specific choice. "mixed" means the statement is conditional or points
 * both ways; it is never "unclear". Incumbents' votes render elsewhere; their
 * statements are still recorded here when their materials make one.
 *
 * Pages reviewed are listed in delivery-d3.ts.
 */

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";
const REVIEWED = { reviewedBy: "pending", reviewedOn: "2026-09-20" } as const;
const SITE_DATE = "Website reviewed September 20, 2026";

const site = (label: string, url: string, date: string = SITE_DATE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note: NOTE,
});

const pamphlet = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 18, 2026",
  note: NOTE,
});

const hallettRevision = site("Hallett · Re-Vision platform", "https://www.matthiashallett.com/revision");
const hallettBlazers = site(
  "Hallett · Trail Blazers press release (July 18, 2026)",
  "https://www.matthiashallett.com/press/hallett-demands-good-faith-negotiations-to-keep-the-portland-trail-blazers-calls-out-angelita-morillo-and-dsa-socialists-for-bad-faith-tactics-risking-rip-city",
);
const koyamaLane = site("Koyama Lane · policy and track record", "https://teachertiffanyforthepeople.com/policy-track-record/");
const koyamaLaneHome = site("Koyama Lane · campaign home page", "https://teachertiffanyforthepeople.com/");
const leon = site("León · issue platform", "https://EstherForPortland.com");
const morilloHome = site("Morillo · campaign home page", "https://www.angelitaforportland.com");
const morilloPlatform = site("Morillo · platform", "https://www.angelitaforportland.com/platform");
const novick = site("Novick · second-term priorities", "https://NovickForPortland.com");
const otero = site("Otero · policy platform", "https://www.cristalforportland.com/my-platform");
const phamEconomics = site("Pham · Tax base and spending", "https://fightwithheartpdx.com/economics");
const sollitt = site("Sollitt · platform and campaign case studies", "https://TomForPDX.com");
const torres = site("Torres · priorities", "https://www.KellieTorresForPortland.com/priorities");
const wardTaxes = site("Ward · tax cuts", "https://www.theprinceofpeace.net/home/city-policy/tax-cuts");
const mercury: Evidence = {
  label: "Mercury questionnaire · Frankenstein’s responses",
  url: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
  kind: "Candidate statement",
  date: "September 9, 2026",
  note: NOTE,
};
const mccormickFiling: Evidence = {
  label: "2026 candidate filing · policy language on PDF page 4",
  url: "https://www.portland.gov/auditor/elections/documents/mccormick-darren-2026-aud-120/download#page=4",
  kind: "Candidate statement",
  date: "Filed July 2026; reviewed September 18, 2026",
  note: NOTE,
};

const stance = (
  candidateId: string,
  topicId: string,
  value: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: value, chip, text, source, ...REVIEWED });

export const topicStancesD3: TopicStance[] = [
  /* ── Moda Center deal ─────────────────────────────────────────────── */
  stance(
    "matthias-hallett",
    "moda",
    "mixed",
    "Fair deal, keep Blazers",
    "Wants a deal that keeps the Blazers long-term while protecting taxpayers; calls for good-faith, transparent negotiation.",
    hallettBlazers,
  ),
  stance(
    "tiffany-koyama-lane",
    "moda",
    "mixed",
    "Fair deal for taxpayers",
    "Says she fought for a fair deal for Portlanders in the Moda Center negotiations and will make sure it is fair for taxpayers.",
    pamphlet(54),
  ),
  stance(
    "esther-leon",
    "moda",
    "mixed",
    "Only with guaranteed return",
    "Calls the current proposal opaque; would require union local contractors, no Clean Energy Fund money, a larger ticket share, a significant rent and a guaranteed net return.",
    leon,
  ),
  stance(
    "angelita-morillo",
    "moda",
    "opposes",
    "Not on taxpayers’ tab",
    "Says she demanded transparency on proposed Moda Center changes and pushed back on taxpayers footing that bill.",
    morilloHome,
  ),
  stance(
    "steve-novick",
    "moda",
    "mixed",
    "City must break even",
    "Wants to keep the Blazers, but only under a deal where the city gets as much money out of the Moda Center as it puts in.",
    novick,
  ),
  stance(
    "john-sweeney",
    "moda",
    "opposes",
    "No money for Blazers",
    "Says the Blazers are leaving regardless and any money spent to keep them is money Portland will need later.",
    pamphlet(53),
  ),
  stance(
    "martin-ward",
    "moda",
    "opposes",
    "No Moda renovations",
    "States flatly: no renovations on the Moda Center, none.",
    pamphlet(55),
  ),

  /* ── New taxes or fees ────────────────────────────────────────────── */
  stance(
    "joel-corcoran",
    "new-taxes",
    "supports",
    "Tax billionaires",
    "His pamphlet values list includes taxing billionaires “to hell and back”; no instrument is named.",
    pamphlet(56),
  ),
  stance(
    "guy-frankenstein",
    "new-taxes",
    "supports",
    "Billion-dollar companies pay",
    "Says he would “bleed every billion dollar company operating within this city”; no instrument or amount is named.",
    mercury,
  ),
  stance(
    "matthias-hallett",
    "new-taxes",
    "opposes",
    "No new taxes",
    "Says Portland cannot tax its way out of a shrinking base and must grow it back; backs police funding with no new taxes.",
    pamphlet(58),
  ),
  stance(
    "patrick-hilton",
    "new-taxes",
    "supports",
    "Tax polluters, vacancies",
    "Would tax polluters and vacant units, and redirect consultant spending to core services.",
    pamphlet(57),
  ),
  stance(
    "tiffany-koyama-lane",
    "new-taxes",
    "supports",
    "Tax the rich",
    "Lists “Tax the Rich to Fund our Communities” as a goal while lowering the tax burden on working families.",
    koyamaLaneHome,
  ),
  stance(
    "esther-leon",
    "new-taxes",
    "supports",
    "Corporate vacancy taxes",
    "Proposes residential and commercial vacancy taxes on large corporate owners, a higher Clean Energy Fund surcharge and a shift to land-value taxation.",
    leon,
  ),
  stance(
    "angelita-morillo",
    "new-taxes",
    "supports",
    "Small ride-hail fee",
    "Says she secured new funding for potholes and streetlights with a small fee on Uber and Lyft rides.",
    morilloPlatform,
  ),
  stance(
    "steve-novick",
    "new-taxes",
    "opposes",
    "No Arts Tax increase",
    "Voted against increasing the Arts Tax and wants to replace it without cutting arts funding, possibly by folding it into the Children’s Levy.",
    novick,
  ),
  stance(
    "cristal-otero",
    "new-taxes",
    "mixed",
    "Wealthy first, if needed",
    "Says working households and small businesses should not be the automatic first source; when revenue is needed, asks more of the wealthiest households and largest corporations.",
    otero,
  ),
  stance(
    "heart-free-pham",
    "new-taxes",
    "mixed",
    "Cost-benefit before taxes",
    "Would demand honest cost-benefit accounting before raising taxes or expanding programs, citing outmigration of high earners.",
    phamEconomics,
  ),
  stance(
    "tom-sollitt",
    "new-taxes",
    "mixed",
    "Scrutinize contracts first",
    "Would strengthen oversight and scrutinize contracts before raising taxes or fees.",
    sollitt,
  ),
  stance(
    "martin-ward",
    "new-taxes",
    "opposes",
    "Cut most local taxes",
    "Would eliminate the Arts Tax, gas tax, lodging tax, heavy-vehicle tax, paid parking and the Clean Energy Fund, and restructure two others.",
    wardTaxes,
  ),

  /* ── Police staffing ──────────────────────────────────────────────── */
  stance(
    "matthias-hallett",
    "police-staffing",
    "supports",
    "Two officers per 1,000",
    "Backs the Safer Portland goal of two sworn officers per 1,000 residents, funded without raising taxes.",
    hallettRevision,
  ),
  stance(
    "keir-legree",
    "police-staffing",
    "supports",
    "More officers, dispatchers",
    "Would hire more police officers and 911 dispatchers to improve response times.",
    pamphlet(59),
  ),
  stance(
    "darren-mccormick",
    "police-staffing",
    "supports",
    "More cops",
    "His filing says “More cops” and calls for locking up people he describes as dangerously unstable and drug-affected.",
    mccormickFiling,
  ),
  stance(
    "steve-novick",
    "police-staffing",
    "supports",
    "Add detectives first",
    "Says that as Portland adds police officers it should prioritize detectives who follow through on reports.",
    novick,
  ),
  stance(
    "terry-parker",
    "police-staffing",
    "supports",
    "Add police officers",
    "Would increase funding to add police officers and fully staff every fire station.",
    pamphlet(55),
  ),
  stance(
    "tom-sollitt",
    "police-staffing",
    "mixed",
    "Needs, not a number",
    "If staffing must rise, would target investigations and specialized units; staffing should follow need, not a fixed officer total.",
    sollitt,
  ),
  stance(
    "kellie-torres",
    "police-staffing",
    "supports",
    "Staff for investigations",
    "Supports public safety staffing and resources that let police follow through on investigations and fix response times.",
    torres,
  ),
  stance(
    "martin-ward",
    "police-staffing",
    "supports",
    "More officers, cameras",
    "Would increase police officers, install cameras at every intersection and buy non-lethal equipment.",
    pamphlet(55),
  ),

  /* ── Clearing camps ───────────────────────────────────────────────── */
  stance(
    "esther-leon",
    "camp-removal",
    "opposes",
    "End sweeps",
    "Would redirect effort away from city sweeps and hostile architecture toward long-term housing with treatment.",
    leon,
  ),
  stance(
    "steve-novick",
    "camp-removal",
    "supports",
    "Fund hazardous-camp removal",
    "Says he protected funding for removing the most hazardous camps when others tried to cut it; opposes indiscriminate sweeps.",
    pamphlet(57),
  ),

  /* ── Data centers ─────────────────────────────────────────────────── */
  stance(
    "tiffany-koyama-lane",
    "data-centers",
    "supports",
    "Data-center moratorium",
    "Would champion a moratorium on data centers to protect the water supply and farmland and keep costs off households.",
    koyamaLane,
  ),
  stance(
    "esther-leon",
    "data-centers",
    "supports",
    "Moratorium on AI centers",
    "Would implement a moratorium on AI data centers to stop the takeover of natural resources.",
    leon,
  ),
  stance(
    "angelita-morillo",
    "data-centers",
    "supports",
    "Stop new data centers",
    "Lists “Stop new data centers” as a second-term priority; her pamphlet says she is working to shut down data center expansion.",
    morilloPlatform,
  ),

  /* ── Street Response ──────────────────────────────────────────────── */
  stance(
    "esther-leon",
    "street-response",
    "supports",
    "24/7 citywide coverage",
    "Commits to budget amendments and votes for full 24/7 citywide Street Response funding in every budget cycle.",
    leon,
  ),
  stance(
    "angelita-morillo",
    "street-response",
    "supports",
    "Expand to 24/7",
    "Would expand Portland Street Response to 24 hours a day, every day of the year.",
    morilloPlatform,
  ),
  stance(
    "steve-novick",
    "street-response",
    "supports",
    "Unarmed welfare checks",
    "Is working to move 911 welfare-check calls to unarmed responders and to get Medicaid to reimburse Street Response.",
    novick,
  ),

  /* ── Street repair fee ────────────────────────────────────────────── */
  stance(
    "tiffany-koyama-lane",
    "street-fee",
    "supports",
    "Fee with low-income relief",
    "Says she secured low-income relief under the new Transportation Utility Fee and directed 25 percent of it to Vision Zero and sidewalks.",
    koyamaLane,
  ),

  /* ── Water rates ──────────────────────────────────────────────────── */
  stance(
    "tiffany-koyama-lane",
    "water-rates",
    "mixed",
    "Reduced utility hikes",
    "Says she reduced utility hikes for working-class Portlanders.",
    pamphlet(54),
  ),
  stance(
    "keir-legree",
    "water-rates",
    "opposes",
    "Lower water bills",
    "Says water and sewer bills are over four times Las Vegas’s and rising; would cut project costs to lower bills.",
    pamphlet(59),
  ),
  stance(
    "angelita-morillo",
    "water-rates",
    "opposes",
    "Fought rate increases",
    "Lists “Fought water rate increases” among her first-term promises kept.",
    pamphlet(56),
  ),
  stance(
    "steve-novick",
    "water-rates",
    "mixed",
    "Offset with PCEF",
    "Would use Clean Energy Fund money to pay part of the water filtration plant and offset water-rate increases.",
    novick,
  ),
  stance(
    "cristal-otero",
    "water-rates",
    "mixed",
    "Judge by monthly bill",
    "Notes rates rose 8.1 percent and the Water Bureau pays about $100 million a year in debt service; would judge borrowing by monthly household cost.",
    pamphlet(59),
  ),
];
