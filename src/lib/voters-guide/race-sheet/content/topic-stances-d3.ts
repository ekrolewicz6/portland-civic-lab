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

/* Topic sweep of September 22, 2026 (candidates K–Z): venues read that day. */
const REVIEWED_SWEEP = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;
const SWEEP_SITE_DATE = "Website reviewed September 22, 2026";
const hiltonAction = site("Hilton · Working class and unhoused housing first", "https://www.patrickhilton4pdx.org/take-action", SWEEP_SITE_DATE);
const tuckerIssues = site("Tucker · The other issues", "https://kimberlyforpdxd3.com/the-other-issues", SWEEP_SITE_DATE);
const wardBudget = site("Ward · budget cuts", "https://www.theprinceofpeace.net/home/city-policy/budget-cuts", SWEEP_SITE_DATE);
const sollittModaPost: Evidence = {
  label: "Sollitt · Bluesky post on the Moda Center (May 11, 2026)",
  url: "https://bsky.app/profile/tomforpdx.bsky.social/post/3mllrzludns2q",
  kind: "Candidate statement",
  date: "Posted May 11, 2026; read September 22, 2026",
  note: NOTE,
};
const landgraver350: Evidence = {
  label: "350PDX Climate Justice Voter Guide 2026 · Landgraver’s responses",
  url: "https://350pdx.org/kent-landgraver-2026/",
  kind: "Candidate statement",
  date: "2026 guide; read September 22, 2026",
  note: NOTE,
};
const cityClub2024 = (name: string): Evidence => ({
  label: `City Club of Portland 2024 council candidate survey · ${name}’s responses`,
  url: "https://pdxcityclub.org/2024-election-coverage-portland-council-candidate-survey/",
  kind: "Candidate statement",
  date: "Fall 2024 survey (the 2024 District 3 race); read September 22, 2026",
  note: NOTE,
});
const opb2024 = (name: string, url: string, date: string): Evidence => ({
  label: `OPB/Oregonian candidate questionnaire · ${name} (${date})`,
  url,
  kind: "Candidate statement",
  date: `${date}, the 2024 District 3 race; read September 22, 2026`,
  note: NOTE,
});
const opbHilton2024 = opb2024(
  "Hilton",
  "https://www.opb.org/article/2024/10/15/meet-patrick-hilton-candidate-for-portland-city-council-district-3/",
  "October 15, 2024",
);
const opbKoyamaLane2024 = opb2024(
  "Koyama Lane",
  "https://www.opb.org/article/2024/09/30/portland-oregon-city-council-tiffany-koyama-politics-government-district-3/",
  "September 30, 2024",
);
const opbParker2024 = opb2024(
  "Parker",
  "https://www.opb.org/article/2024/09/30/meet-terry-parker-candidate-for-portland-city-council-district-3/",
  "September 30, 2024",
);
const mercuryStreetFee: Evidence = {
  label: "Portland Mercury · “Portland Moves To Shake Up Transportation Funding With New Utility Fee” (April 24, 2026)",
  url: "https://www.portlandmercury.com/news/after-years-of-false-starts-portland-moves-to-shake-up-transportation-funding/",
  kind: "Reporting",
  date: "April 24, 2026",
  note: "Reported statement; quote as printed by the Portland Mercury.",
};

/* Topic sweep of September 22, 2026 (candidates A–K): venues read that day. */
/** The Mercury’s District 3 questionnaire, quoting the named candidate’s own written answers. */
const mercuryFor = (name: string): Evidence => ({ ...mercury, label: `Mercury questionnaire · ${name}’s responses` });
const corcoranValues = site("Corcoran · Values", "https://www.corcoranforportland.org/values", SWEEP_SITE_DATE);
const legreePlan = site("Legree · Homelessness plan", "https://www.keir4pdx.com/homelessness-plan", SWEEP_SITE_DATE);
const legreeSafer = site(
  "Legree · Safer Communities (Policy Platform section of the home page)",
  "https://www.keir4pdx.com/",
  SWEEP_SITE_DATE,
);
const morilloCouncil2026: Evidence = {
  label: "Morillo · Councilor Morillo’s Work in 2026 (City of Portland council page)",
  url: "https://www.portland.gov/council/districts/3/angelita-morillo/2026-morillo-work",
  kind: "Candidate statement",
  date: "Councilor’s own office page; read September 22, 2026",
  note: NOTE,
};
const opbOtero2024 = opb2024(
  "Otero",
  "https://www.opb.org/article/2024/09/30/meet-cristal-azul-otero-candidate-for-portland-city-council-district-3/",
  "September 30, 2024",
);
const opbPham2024 = opb2024(
  "Pham",
  "https://www.opb.org/article/2024/10/07/portland-oregon-city-council-district-3-politics-elections/",
  "October 8, 2024",
);
const opbSweeney2024 = opb2024(
  "Sweeney",
  "https://www.opb.org/article/2024/09/30/portland-oregon-city-council-john-sweeney-politics-government-district-3/",
  "September 30, 2024",
);

const stance = (
  candidateId: string,
  topicId: string,
  value: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: value, chip, text, source, ...REVIEWED });

/** Same shape as `stance`, reviewed in the September 22, 2026 sweep. */
const sweepStance = (
  candidateId: string,
  topicId: string,
  value: TopicStance["stance"],
  chip: string,
  text: string,
  source: Evidence,
): TopicStance => ({ ...stance(candidateId, topicId, value, chip, text, source), ...REVIEWED_SWEEP });

export const topicStancesD3: TopicStance[] = [
  /* ── Ali Beaudoin ───────────────────────────────────────────────────── */
  sweepStance(
    "ali-beaudoin",
    "moda",
    "mixed",
    "Deals must benefit residents",
    "Calls the packages the city offered a billionaire while cutting funds a lack of courage; would fight for deals where citizens and communities really benefit.",
    mercuryFor("Beaudoin"),
  ),

  /* ── Joel Corcoran ──────────────────────────────────────────────────── */
  sweepStance(
    "joel-corcoran",
    "moda",
    "mixed",
    "Nothing without team commitment",
    "Says that if the new Blazers ownership will not commit to keeping the team in Portland, the city need not commit anything to them in return.",
    corcoranValues,
  ),
  stance(
    "joel-corcoran",
    "new-taxes",
    "supports",
    "Tax billionaires",
    "His pamphlet values list includes taxing billionaires “to hell and back”; no instrument is named.",
    pamphlet(56),
  ),
  sweepStance(
    "joel-corcoran",
    "police-staffing",
    "partial",
    "Data over officer counts",
    "Would address public safety with data-driven, holistic solutions rather than debating the number of sworn officers; his answer does not say whether to hire more.",
    mercuryFor("Corcoran"),
  ),

  /* ── Guy Frankenstein ───────────────────────────────────────────────── */
  stance(
    "guy-frankenstein",
    "new-taxes",
    "supports",
    "Billion-dollar companies pay",
    "Says he would “bleed every billion dollar company operating within this city”; no instrument or amount is named.",
    mercury,
  ),

  /* ── Matthias Hallett ───────────────────────────────────────────────── */
  stance(
    "matthias-hallett",
    "moda",
    "mixed",
    "Fair deal, keep Blazers",
    "Wants a deal that keeps the Blazers long-term while protecting taxpayers; calls for good-faith, transparent negotiation.",
    hallettBlazers,
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
    "matthias-hallett",
    "police-staffing",
    "supports",
    "Two officers per 1,000",
    "Backs the Safer Portland goal of two sworn officers per 1,000 residents, funded without raising taxes.",
    hallettRevision,
  ),

  /* ── Patrick Hilton ─────────────────────────────────────────────────── */
  stance(
    "patrick-hilton",
    "new-taxes",
    "supports",
    "Tax polluters, vacancies",
    "Would tax polluters and vacant units, and redirect consultant spending to core services.",
    pamphlet(57),
  ),
  sweepStance(
    "patrick-hilton",
    "police-staffing",
    "mixed",
    "Fund PSR, add police",
    "Told OPB in 2024 he would fully fund Street Response and CHAT and use police sparingly, but that more police and budget are needed for officers who are well-trained and not over-stressed.",
    opbHilton2024,
  ),
  sweepStance(
    "patrick-hilton",
    "camp-removal",
    "partial",
    "No sidewalk camping",
    "Says the city cannot allow camping on sidewalks anymore and must create managed campgrounds as soon as possible as the immediate alternative; his page does not say whether removal funding should stay at current levels.",
    hiltonAction,
  ),
  sweepStance(
    "patrick-hilton",
    "street-response",
    "partial",
    "Fully fund PSR",
    "Told OPB in 2024 he would vote to fully fund Portland Street Response and CHAT; his answer does not say whether Street Response should expand to a 24/7 role.",
    opbHilton2024,
  ),

  /* ── Larry Kelly ────────────────────────────────────────────────────── */
  sweepStance(
    "larry-kelly",
    "street-response",
    "partial",
    "Support street response",
    "Says Portland needs to expand mental health and addiction services and support the street response team; his statement does not say whether Street Response should expand to a 24/7 role.",
    pamphlet(54),
  ),

  /* ── Tiffany Koyama Lane ────────────────────────────────────────────── */
  stance(
    "tiffany-koyama-lane",
    "moda",
    "mixed",
    "Fair deal for taxpayers",
    "Says she fought for a fair deal for Portlanders in the Moda Center negotiations and will make sure it is fair for taxpayers.",
    pamphlet(54),
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
    "tiffany-koyama-lane",
    "data-centers",
    "supports",
    "Data-center moratorium",
    "Would champion a moratorium on data centers to protect the water supply and farmland and keep costs off households.",
    koyamaLane,
  ),
  stance(
    "tiffany-koyama-lane",
    "street-fee",
    "supports",
    "Fee with low-income relief",
    "Says she secured low-income relief under the new Transportation Utility Fee and directed 25 percent of it to Vision Zero and sidewalks.",
    koyamaLane,
  ),
  stance(
    "tiffany-koyama-lane",
    "water-rates",
    "mixed",
    "Reduced utility hikes",
    "Says she reduced utility hikes for working-class Portlanders.",
    pamphlet(54),
  ),
  sweepStance(
    "tiffany-koyama-lane",
    "police-staffing",
    "partial",
    "Free police for policing",
    "Told OPB in 2024 she wants to free police to do the job they were trained for, not fill safety-net holes, and supports expanding Street Response; her answer does not say whether to hire more officers.",
    opbKoyamaLane2024,
  ),

  /* ── Kenneth (Kent) R Landgraver III ────────────────────────────────── */
  sweepStance(
    "kenneth-kent-r-landgraver-iii",
    "moda",
    "partial",
    "No PCEF for Moda",
    "Told 350PDX the Moda Center is not within the Clean Energy Fund’s mandate and proposes covering the arena and parking structures with solar and wind; his statement does not say whether other public money should pay.",
    landgraver350,
  ),
  sweepStance(
    "kenneth-kent-r-landgraver-iii",
    "police-staffing",
    "supports",
    "Police at peer-city levels",
    "Told City Club in 2024 he would increase the police force to at least on par with other cities of Portland’s size, with first responders handling non-violent, low-risk calls.",
    cityClub2024("Landgraver"),
  ),
  sweepStance(
    "kenneth-kent-r-landgraver-iii",
    "street-response",
    "supports",
    "Street Response 24/7",
    "Told City Club in 2024 he would increase Portland Street Response and similar services and move them to 24/7 staffing so police can respond to calls requiring a sworn officer.",
    cityClub2024("Landgraver"),
  ),

  /* ── Keir Legree ────────────────────────────────────────────────────── */
  stance(
    "keir-legree",
    "police-staffing",
    "supports",
    "More officers, dispatchers",
    "Would hire more police officers and 911 dispatchers to improve response times.",
    pamphlet(59),
  ),
  sweepStance(
    "keir-legree",
    "camp-removal",
    "supports",
    "Consistent camping enforcement",
    "Would consistently enforce clear boundaries citywide: when shelter is available, camping should not be allowed indefinitely in rights-of-way, parks or on private property, with camps near schools first.",
    legreePlan,
  ),
  sweepStance(
    "keir-legree",
    "street-response",
    "partial",
    "Scale PSR, add specialists",
    "Would fully support and scale Street Response for non-violent behavioral-health crises and expand unarmed Public Safety Support Specialists; his platform does not say whether Street Response should run 24/7.",
    legreeSafer,
  ),
  stance(
    "keir-legree",
    "water-rates",
    "opposes",
    "Lower water bills",
    "Says water and sewer bills are over four times Las Vegas’s and rising; would cut project costs to lower bills.",
    pamphlet(59),
  ),

  /* ── Esther León ────────────────────────────────────────────────────── */
  stance(
    "esther-leon",
    "moda",
    "mixed",
    "Only with guaranteed return",
    "Calls the current proposal opaque; would require union local contractors, no Clean Energy Fund money, a larger ticket share, a significant rent and a guaranteed net return.",
    leon,
  ),
  stance(
    "esther-leon",
    "new-taxes",
    "supports",
    "Corporate vacancy taxes",
    "Proposes residential and commercial vacancy taxes on large corporate owners, a higher Clean Energy Fund surcharge and a shift to land-value taxation.",
    leon,
  ),
  sweepStance(
    "esther-leon",
    "police-staffing",
    "partial",
    "Unarmed responders first",
    "Says a policing approach does not make Portland safer; would expand Street Response and the bureau’s unarmed support specialists to reduce lethally armed responses. Her platform does not say whether to hire more sworn officers.",
    leon,
  ),
  stance(
    "esther-leon",
    "camp-removal",
    "opposes",
    "End sweeps",
    "Would redirect effort away from city sweeps and hostile architecture toward long-term housing with treatment.",
    leon,
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
    "esther-leon",
    "street-response",
    "supports",
    "24/7 citywide coverage",
    "Commits to budget amendments and votes for full 24/7 citywide Street Response funding in every budget cycle.",
    leon,
  ),

  /* ── Darren McCormick ───────────────────────────────────────────────── */
  stance(
    "darren-mccormick",
    "police-staffing",
    "supports",
    "More cops",
    "His filing says “More cops” and calls for locking up people he describes as dangerously unstable and drug-affected.",
    mccormickFiling,
  ),

  /* ── Angelita Morillo ───────────────────────────────────────────────── */
  stance(
    "angelita-morillo",
    "moda",
    "opposes",
    "Not on taxpayers’ tab",
    "Says she demanded transparency on proposed Moda Center changes and pushed back on taxpayers footing that bill.",
    morilloHome,
  ),
  stance(
    "angelita-morillo",
    "new-taxes",
    "supports",
    "Small ride-hail fee",
    "Says she secured new funding for potholes and streetlights with a small fee on Uber and Lyft rides.",
    morilloPlatform,
  ),
  sweepStance(
    "angelita-morillo",
    "police-staffing",
    "partial",
    "Unarmed responders, overtime cuts",
    "Moved over $2 million to hire unarmed crisis responders, cut police overtime and would audit police programs yearly; her platform does not say whether to hire more sworn officers.",
    morilloPlatform,
  ),
  sweepStance(
    "angelita-morillo",
    "camp-removal",
    "opposes",
    "Shift away from sweeps",
    "Says she prepared legislation supporting a shift away from costly homeless camp sweeps toward public bathrooms, sanitation and low-barrier jobs.",
    morilloCouncil2026,
  ),
  stance(
    "angelita-morillo",
    "data-centers",
    "supports",
    "Stop new data centers",
    "Lists “Stop new data centers” as a second-term priority; her pamphlet says she is working to shut down data center expansion.",
    morilloPlatform,
  ),
  stance(
    "angelita-morillo",
    "street-response",
    "supports",
    "Expand to 24/7",
    "Would expand Portland Street Response to 24 hours a day, every day of the year.",
    morilloPlatform,
  ),
  sweepStance(
    "angelita-morillo",
    "street-fee",
    "partial",
    "Affordability protections first",
    "Says she improved the proposed transportation utility fee by requiring the City to study fairer options and add affordability protections before it takes effect; the page does not say whether to keep the fee.",
    morilloCouncil2026,
  ),
  stance(
    "angelita-morillo",
    "water-rates",
    "opposes",
    "Fought rate increases",
    "Lists “Fought water rate increases” among her first-term promises kept.",
    pamphlet(56),
  ),

  /* ── Steve Novick ───────────────────────────────────────────────────── */
  stance(
    "steve-novick",
    "moda",
    "mixed",
    "City must break even",
    "Wants to keep the Blazers, but only under a deal where the city gets as much money out of the Moda Center as it puts in.",
    novick,
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
    "steve-novick",
    "police-staffing",
    "supports",
    "Add detectives first",
    "Says that as Portland adds police officers it should prioritize detectives who follow through on reports.",
    novick,
  ),
  stance(
    "steve-novick",
    "camp-removal",
    "supports",
    "Fund hazardous-camp removal",
    "Says he protected funding for removing the most hazardous camps when others tried to cut it; opposes indiscriminate sweeps.",
    pamphlet(57),
  ),
  stance(
    "steve-novick",
    "street-response",
    "supports",
    "Unarmed welfare checks",
    "Is working to move 911 welfare-check calls to unarmed responders and to get Medicaid to reimburse Street Response.",
    novick,
  ),
  stance(
    "steve-novick",
    "water-rates",
    "mixed",
    "Offset with PCEF",
    "Would use Clean Energy Fund money to pay part of the water filtration plant and offset water-rate increases.",
    novick,
  ),
  sweepStance(
    "steve-novick",
    "street-fee",
    "supports",
    "Fees stop further decay",
    "Says Council should tell voters that at best the fees keep major streets from getting worse, and that the alternative is to let the city die.",
    mercuryStreetFee,
  ),

  /* ── Cristal Otero ──────────────────────────────────────────────────── */
  stance(
    "cristal-otero",
    "new-taxes",
    "mixed",
    "Wealthy first, if needed",
    "Says working households and small businesses should not be the automatic first source; when revenue is needed, asks more of the wealthiest households and largest corporations.",
    otero,
  ),
  sweepStance(
    "cristal-otero",
    "police-staffing",
    "opposes",
    "Outreach teams, not officers",
    "Told the 2024 OPB/Oregonian questionnaire she would not vote to fund hundreds more police officers, preferring clinical outreach teams with behavioral-health expertise and community-based safety.",
    opbOtero2024,
  ),
  stance(
    "cristal-otero",
    "water-rates",
    "mixed",
    "Judge by monthly bill",
    "Notes rates rose 8.1 percent and the Water Bureau pays about $100 million a year in debt service; would judge borrowing by monthly household cost.",
    pamphlet(59),
  ),

  /* ── Terry Parker ───────────────────────────────────────────────────── */
  stance(
    "terry-parker",
    "police-staffing",
    "supports",
    "Add police officers",
    "Would increase funding to add police officers and fully staff every fire station.",
    pamphlet(55),
  ),
  sweepStance(
    "terry-parker",
    "new-taxes",
    "opposes",
    "Eliminate the Arts Tax",
    "Told OPB in 2024 he would eliminate the $35 Arts Tax on individuals, which charges low and high earners the same amount; he named no tax or levy he would create.",
    opbParker2024,
  ),
  sweepStance(
    "terry-parker",
    "camp-removal",
    "partial",
    "Enforce camping ban",
    "Told OPB in 2024 he favors arresting and jailing campers who refuse repeated shelter offers, with compassionate camping ban enforcement and wrap-around services; the answer does not address current removal funding.",
    opbParker2024,
  ),
  sweepStance(
    "terry-parker",
    "street-response",
    "supports",
    "PSR 24-hour service",
    "Told City Club in 2024 the city must add shelter beds and make Portland Street Response a 24-hour service by adding personnel.",
    cityClub2024("Parker"),
  ),
  sweepStance(
    "terry-parker",
    "street-fee",
    "partial",
    "Costs shared by beneficiaries",
    "Wants Comprehensive Plan Policy 8.28, sharing facility costs among those who benefit, applied more broadly to transportation; his statement does not say whether to keep the monthly street repair fee.",
    pamphlet(55),
  ),

  /* ── Heart Free Pham ────────────────────────────────────────────────── */
  stance(
    "heart-free-pham",
    "new-taxes",
    "mixed",
    "Cost-benefit before taxes",
    "Would demand honest cost-benefit accounting before raising taxes or expanding programs, citing outmigration of high earners.",
    phamEconomics,
  ),
  sweepStance(
    "heart-free-pham",
    "police-staffing",
    "supports",
    "More police, cultural change",
    "Told the 2024 OPB/Oregonian questionnaire he supports hiring more police with stipulations: a cultural change, including no longer disqualifying applicants for past marijuana use.",
    opbPham2024,
  ),

  /* ── Tom Sollitt ────────────────────────────────────────────────────── */
  stance(
    "tom-sollitt",
    "new-taxes",
    "mixed",
    "Scrutinize contracts first",
    "Would strengthen oversight and scrutinize contracts before raising taxes or fees.",
    sollitt,
  ),
  stance(
    "tom-sollitt",
    "police-staffing",
    "mixed",
    "Needs, not a number",
    "If staffing must rise, would target investigations and specialized units; staffing should follow need, not a fixed officer total.",
    sollitt,
  ),
  sweepStance(
    "tom-sollitt",
    "moda",
    "partial",
    "Public say on Moda",
    "Posted that Portlanders deserve a direct say in if, when and how tax dollars are used to renovate the Moda Center, negotiating from confidence rather than fear; the post does not say whether he supports public money.",
    sollittModaPost,
  ),

  /* ── John Sweeney ───────────────────────────────────────────────────── */
  stance(
    "john-sweeney",
    "moda",
    "opposes",
    "No money for Blazers",
    "Says the Blazers are leaving regardless and any money spent to keep them is money Portland will need later.",
    pamphlet(53),
  ),
  sweepStance(
    "john-sweeney",
    "police-staffing",
    "supports",
    "Increase police, reserve",
    "Told the 2024 OPB/Oregonian questionnaire his first priority would be to increase and refresh the Portland Police and the Police Reserve, the reserve serving as a stepping stone to full-time officers.",
    opbSweeney2024,
  ),

  /* ── Kellie Torres ──────────────────────────────────────────────────── */
  stance(
    "kellie-torres",
    "police-staffing",
    "supports",
    "Staff for investigations",
    "Supports public safety staffing and resources that let police follow through on investigations and fix response times.",
    torres,
  ),

  /* ── Kimberly Tucker ────────────────────────────────────────────────── */
  sweepStance(
    "kimberly-tucker",
    "police-staffing",
    "supports",
    "More officers, more specialists",
    "Says Portland needs additional armed officers and additional specialists to respond to non-criminal calls, with the police budget published jargon-free with a cost-benefit analysis.",
    tuckerIssues,
  ),

  /* ── Martin Ward ────────────────────────────────────────────────────── */
  stance(
    "martin-ward",
    "moda",
    "opposes",
    "No Moda renovations",
    "States flatly: no renovations on the Moda Center, none.",
    pamphlet(55),
  ),
  stance(
    "martin-ward",
    "new-taxes",
    "opposes",
    "Cut most local taxes",
    "Would eliminate the Arts Tax, gas tax, lodging tax, heavy-vehicle tax, paid parking and the Clean Energy Fund, and restructure two others.",
    wardTaxes,
  ),
  stance(
    "martin-ward",
    "police-staffing",
    "supports",
    "More officers, cameras",
    "Would increase police officers, install cameras at every intersection and buy non-lethal equipment.",
    pamphlet(55),
  ),
  sweepStance(
    "martin-ward",
    "camp-removal",
    "partial",
    "Camps stay until shelters",
    "Says that until new shelters are built, people reported camping would return to their camp or a shelter as they prefer, then be moved into shelters; his page does not address current removal funding.",
    wardBudget,
  ),
];
