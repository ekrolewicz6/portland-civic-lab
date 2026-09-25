import type { CandidatePortrait, Evidence } from "../../../types";
import type { IssueId } from "../../issues";
import {
  emptyPack,
  type BallotInstruction,
  type CandidateAnalysis,
  type CandidateContact,
  type ChoiceParagraph,
  type ContactChannel,
  type Delivery,
  type DeliveryStep,
  type DistrictInfo,
  type ExtraTopic,
  type IssueLine,
  type PrimaryStatement,
  type RacePack,
  type RaceStakes,
  type RaceTopics,
  type RoleOverride,
  type StanceChip,
  type TopicStance,
} from "../../types";
import type { OwnWords, OwnWordsRule } from "../own-words";

/**
 * Race pack: Washington County city races — Beaverton Council Position 1
 * (November runoff), Hillsboro Council Wards 1–3 (Position A) and Tigard
 * Mayor and City Council (three seats). Filled by research on September 21,
 * 2026 from the November 2026 Washington County voters’ pamphlet (PDF pages
 * 9, 15–18 and 35–39, read as text per column), each campaign site, and the
 * Tigard candidate filings (SEL 101) for candidates with no other channel.
 * Every entry names its source; gaps stay gaps. Positions are included only
 * where the candidate’s own material states one.
 *
 * Sites reviewed September 21, 2026: evelynforbeaverton.com, rachelforbeaverton.com,
 * maruggforhillsboro.com, dianaforhillsboro.com, ivettepantoja.com, karimdelgado.com,
 * titonianforhillsboro.com, votedorianrussell.com, kimberlyculbertson.org (her earlier
 * County Commission District 4 site), yikanghu.com, citizenstoelectbillmonahan.com,
 * suefortigard.com, gabevelasquez.com, tomandersontigard.com, yousefallouzi.com,
 * katefortigard.com, shawne4tigard.com. Salgado, Garcia, Goodhouse and Darland
 * print no site and none was found (cristiansalgado.com is parked; darland4tigard.com,
 * printed on Darland’s filing, has no web server).
 */
const PAMPHLET =
  "https://www.washingtoncountyor.gov/elections/documents/november-3-2026-voters-pamphlet/download?inline=";
const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const pamphlet = (page: number): Evidence => ({
  label: `Washington County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 21, 2026",
  note: NOTE,
});

const site = (label: string, url: string, note: string = NOTE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note,
});

const official = (label: string, url: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Election authority",
  date: "Checked September 21, 2026",
  ...(note ? { note } : {}),
});

const line = (candidateId: string, issue: IssueId, text: string): IssueLine => ({
  candidateId,
  issue,
  line: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const chip = (candidateId: string, issue: IssueId, text: string): StanceChip => ({
  candidateId,
  issue,
  chip: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });

const delivery = (
  candidateId: string,
  issue: IssueId,
  rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {},
): Delivery => ({ candidateId, issue, ...rungs, ...reviewed });

const countWords = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const own = (candidateId: string, text: string, rule: OwnWordsRule, source: OwnWords["source"]): OwnWords => ({
  candidateId,
  text,
  source,
  rule,
  words: countWords(text),
});

const pamphletOpening = (page: number, note?: string): OwnWords["source"] => ({
  label: `Washington County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; extracted September 21, 2026",
  note:
    note ??
    "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.",
});

type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});
const email = (address: string, from: From): ContactChannel => ({ url: `mailto:${address}`, label: address, kind: "email", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({ url, label, kind: "form", from });
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });

const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string): CandidateContact => ({
  candidateId,
  channels,
  ...(none ? { none } : {}),
  sources,
  reviewedOn: REVIEWED_ON,
});

const portrait = (page: number): CandidatePortrait => ({
  src: "",
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Washington County voters’ pamphlet",
  reviewed: REVIEWED_ON,
});
const portraits = (entries: [string, number][]): Record<string, CandidatePortrait> =>
  Object.fromEntries(entries.map(([id, page]) => [id, { ...portrait(page), src: `/images/voters-guide/2026/${id}.webp` }]));

/* ── Sources reused across entries ─────────────────────────────────── */
const kocherPriorities = site("Kocher · priorities", "https://evelynforbeaverton.com/priorities");
const jacksonPlatform = site("Jackson · priorities", "https://www.dianaforhillsboro.com/platform.html");
const maruggHome = site("Marugg · what Sarah will fight for (home page)", "https://www.maruggforhillsboro.com/");
const pantojaPriorities = site("Pantoja · priorities", "https://www.ivettepantoja.com/priorities-1");
const delgadoIssues = site("Delgado · platform, all nine positions", "https://www.karimdelgado.com/issues");
const wallacePriorities = site("Wallace · priorities", "https://titonianforhillsboro.com/priorities/");
const russellIssues = site("Russell · issues", "https://votedorianrussell.com/issues/");
const huPriorities = site("Hu · priorities", "https://www.yikanghu.com/priorities");
const monahanHome = site("Monahan · why I’m running (home page)", "https://www.citizenstoelectbillmonahan.com/");
const monahanFacilities = site("Monahan · comparing methods to plan for public facilities", "https://www.citizenstoelectbillmonahan.com/new-page");
const garinoHome = site("Garino · priorities (home page)", "https://www.suefortigard.com/");
const allouziPriorities = site("Allouzi · priorities", "https://www.yousefallouzi.com/priorities");
const martinezHome = site("Martinez · campaign site (home page)", "https://shawne4tigard.com/");

/* ── Analysis: Beaverton Council Position 1 ────────────────────────── */
const analysis: Record<string, CandidateAnalysis> = {
  "evelyn-kocher": {
    values: ["Renter protection", "Surveillance limits"],
    tradeoff:
      "Rent control and a data-center moratorium depend on powers the state limits or that need regional partners; her materials promise the outcome more than the legal path, and transit expansion is not the city’s alone.",
    issues: {
      housing: {
        position:
          "Supports local rent control with increases indexed to inflation, faster zoning and permitting for mixed-use and multifamily homes near MAX stations, and wraparound services for people losing housing.",
        source: kocherPriorities,
      },
      safety: {
        position:
          "Would introduce an ordinance banning Flock automated license-plate cameras from the city and use city powers to protect residents from ICE.",
        source: kocherPriorities,
      },
      money: {
        position:
          "Wants every new city tax proposal put to a public vote rather than adopted as flat fees on water bills, and supports corporate tax reform so big business pays more for infrastructure.",
        source: pamphlet(9),
      },
      climate: {
        position:
          "Wants bus lines in South Cooper Mountain, priority for the Beaverton Loop and TV Highway projects, transit-oriented density downtown and, longer term, WES commuter rail extended to Salem.",
        source: kocherPriorities,
      },
    },
    sources: [pamphlet(9), kocherPriorities],
  },
  "rachel-philip": {
    values: ["Housing choice", "Safe streets"],
    tradeoff:
      "She pairs more housing and safer streets with fiscal restraint; her materials name the priorities but not which street or housing investments would come first or how they would be paid for.",
    issues: {
      housing: {
        position:
          "Supports expanding housing choices, including apartments, townhomes and starter homes, so families, seniors and working people can stay in Beaverton.",
        source: pamphlet(9),
      },
      safety: {
        position:
          "Would defend the city from federal overreach and keep local resources focused on protecting neighbors and services.",
        source: pamphlet(9),
      },
      money: {
        position: "Wants essential services protected, clear priorities set and budget decisions made transparent.",
        source: pamphlet(9),
      },
      climate: {
        position:
          "Would prioritize safer routes to schools and calming dangerous streets, protect trees and green spaces, and prepare the city for extreme heat, wildfire smoke and other emergencies.",
        source: pamphlet(9),
      },
    },
    sources: [pamphlet(9), site("Philip · priorities", "https://www.rachelforbeaverton.com/priorities")],
  },
  /* ── Analysis: Hillsboro Ward 1 ────────────────────────────────────── */
  "luis-garcia": {
    values: ["Evidence-based decisions", "Resource stewardship"],
    tradeoff:
      "He asks for decisions grounded in science and data rather than a fixed stance on industrial growth; what evidence would lead him to approve or reject a project is not stated.",
    issues: {
      housing: {
        position: "Names affordable housing, with good roads and clean water, as a basic to prioritize; no housing tool is described.",
        source: pamphlet(15),
      },
      money: {
        position:
          "Would lead with stewardship and accountability and respect taxpayer dollars; no specific tax, fee or budget change is named.",
        source: pamphlet(15),
      },
      climate: {
        position: "Would protect farmland from the impacts of semiconductors and data centers, and put good roads and clean water among the basics.",
        source: pamphlet(15),
      },
    },
    sources: [pamphlet(15)],
  },
  "diana-jackson": {
    values: ["Renter affordability", "Economic diversification"],
    tradeoff:
      "She would end data-center tax breaks and treat housing as a right; her materials do not yet show what replaces the foregone investment or which housing financing she would use.",
    issues: {
      housing: {
        position:
          "Treats housing as a human right and wants people able to afford to live where they work; would build up downtown with workforce housing tied to small-business support.",
        source: jacksonPlatform,
      },
      safety: {
        position:
          "Wants dual-diagnosis treatment centers with housing and job-training wraparound services, possibly in the Health & Education District, and would keep building on the city’s codified sanctuary protections.",
        source: jacksonPlatform,
      },
      money: {
        position: "Would grow small businesses and diversify the economy rather than give tax breaks to data centers.",
        source: pamphlet(16),
      },
      climate: {
        position: "Would protect the urban growth boundary and farmland, and build up downtown reinforced by multimodal transportation.",
        source: jacksonPlatform,
      },
    },
    sources: [pamphlet(16), jacksonPlatform],
  },
  "sarah-marugg": {
    values: ["Cost recovery", "Environmental protection"],
    tradeoff:
      "Making data centers pay their full costs and stopping the buildout would change Hillsboro’s revenue and growth model; the charge level and the legal mechanism are not specified.",
    issues: {
      housing: {
        position:
          "Supports responsible housing growth, family-wage jobs and practical solutions for people who are precariously housed, with quality housing working people can afford.",
        source: pamphlet(16),
      },
      safety: {
        position: "Would defend civil rights and uphold Hillsboro’s sanctuary-city values.",
        source: pamphlet(16),
      },
      money: {
        position:
          "Would make data centers pay their fair share for the infrastructure and services they use and hold major polluters accountable; counts utility bills as part of affordability.",
        source: pamphlet(16),
      },
      climate: {
        position:
          "Would protect farmland, wetlands, clean air and water, stop further data-center buildout, oppose luxury private-jet expansion and make sidewalks, streets, bus stops and MAX platforms safer.",
        source: maruggHome,
      },
    },
    sources: [pamphlet(16), maruggHome],
  },
  "cristian-salgado": {
    values: ["Conditional growth", "Neighborhood services"],
    tradeoff:
      "He welcomes investment while asking that growth show measurable community benefit; the tests he would apply to a data center, and what would fail them, are not spelled out.",
    issues: {
      money: {
        position:
          "Says he has pushed for thoughtful data-center growth, stronger consideration of neighborhood and infrastructure impacts, utility affordability and public transparency, and wants growth to create measurable community benefit.",
        source: pamphlet(15),
      },
      climate: {
        position: "Would invest in safe streets, sidewalks, crossings, parks and reliable services.",
        source: pamphlet(15),
      },
    },
    sources: [pamphlet(15)],
  },
  /* ── Analysis: Hillsboro Ward 2 ────────────────────────────────────── */
  "karim-delgado": {
    values: ["Corporate accountability", "Immigrant protection"],
    tradeoff:
      "He would attach wage, benefit and housing conditions to every subsidy and fund new services; signed data-center contracts cannot be rewritten by the city alone, and the cost of a Human Rights Office and legal aid is not given.",
    issues: {
      housing: {
        position:
          "Would push mandatory notice before rent increases, a right to counsel in eviction court, anti-displacement protections and community land trusts, and require public support for business to produce housing people can afford.",
        source: delgadoIssues,
      },
      safety: {
        position:
          "Would fully fund mobile crisis response so counselors, not only police, answer mental-health calls, fund legal and emergency aid, enforce the sanctuary ordinance and establish a Human Rights Office.",
        source: pamphlet(17),
      },
      money: {
        position:
          "Opposes corporate tax holidays that do not deliver housing, living wages or community benefit; would raise the community-service and school-support fees on new data-center agreements and verify job commitments.",
        source: delgadoIssues,
      },
      climate: {
        position:
          "Would make environmental compliance a condition of future subsidy agreements, hold industrial polluters accountable and invest in the city’s transit infrastructure.",
        source: delgadoIssues,
      },
    },
    sources: [pamphlet(17), delgadoIssues],
  },
  "ivette-pantoja": {
    values: ["Family stability", "Workforce development"],
    tradeoff:
      "She frames housing and jobs through school-board and childcare experience; her site describes goals such as missing-middle housing and apprenticeships without the city funding or rule changes attached.",
    issues: {
      housing: {
        position:
          "Treats affordable homes as the backbone of community and wants housing options expanded, from missing-middle to multifamily, matched to neighborhood infrastructure to reduce family displacement.",
        source: pantojaPriorities,
      },
      money: {
        position:
          "Wants employers and jobs that let working-class families and small businesses thrive, with apprenticeships and career pathways aligned to local employers.",
        source: pantojaPriorities,
      },
    },
    sources: [pamphlet(17), pantojaPriorities],
  },
  /* ── Analysis: Hillsboro Ward 3 ────────────────────────────────────── */
  "dorian-russell": {
    values: ["Working-class economics", "Youth stability"],
    tradeoff:
      "They ask whether growth produces material security for residents; the site states commitments and beliefs rather than budget or ordinance mechanisms, so delivery would depend on council partners.",
    issues: {
      housing: {
        position:
          "Wants safe, stable housing and homelessness made a brief, one-time experience, with public and private efforts to prevent gentrification and evictions.",
        source: russellIssues,
      },
      safety: {
        position:
          "Would invest in trauma-informed care rather than police response to homelessness, and wants local government to follow community priorities rather than what they call illegal ICE actions.",
        source: russellIssues,
      },
      money: {
        position:
          "Wants major industries contributing to community wealth through education and workforce development, and business leaders paying living wages, benefits and stable retirement.",
        source: russellIssues,
      },
      climate: {
        position:
          "Would preserve family farms, natural areas and waterways and check data-center expansion they say makes the rich richer at the expense of air, water, land and jobs.",
        source: pamphlet(18),
      },
    },
    sources: [pamphlet(18), russellIssues],
  },
  "titonian-wallace-sr": {
    values: ["Economic diversification", "Housing stability"],
    tradeoff:
      "He wants growth that delivers jobs and homes residents can keep; his site names directions such as permitting predictability and missing-middle housing rather than a budget or ordinance.",
    issues: {
      housing: {
        position:
          "Would remove barriers slowing housing production, support missing-middle housing near jobs and transit, back renter and owner stability, first-time-buyer pathways and energy-efficiency retrofits that lower utility costs.",
        source: wallacePriorities,
      },
      safety: {
        position:
          "Sees safety as trust, prevention and coordination: transparency, listening sessions, referrals to services and safety planning, plus support for the city’s homeless shelter.",
        source: wallacePriorities,
      },
      money: {
        position:
          "Would diversify Hillsboro’s economy beyond semiconductors with clearer permitting guidance, predictable timelines and business-retention support.",
        source: wallacePriorities,
      },
      climate: {
        position: "Would invest in safe neighborhoods, transportation and public spaces.",
        source: pamphlet(18),
      },
    },
    sources: [pamphlet(18), wallacePriorities],
  },
  /* ── Analysis: Tigard Mayor ────────────────────────────────────────── */
  "yi-kang-hu": {
    values: ["Continuity", "Core services"],
    tradeoff:
      "He offers steadiness and regional relationships; his budget claims rest on the past two years, and the materials do not say which recurring choices would keep services funded without new shortfalls.",
    issues: {
      housing: { position: "Would expand housing options for every budget and stage of life.", source: pamphlet(35) },
      safety: {
        position:
          "Would keep public-safety services reliable, responsive and accountable, with emergency readiness and trust between residents and agencies.",
        source: huPriorities,
      },
      money: {
        position:
          "Would control residents’ costs through responsible budgeting; says he led efforts to close a $6.5 million shortfall while protecting essential services.",
        source: pamphlet(35),
      },
      climate: {
        position:
          "Would improve transportation safety for pedestrians, cyclists and motorists and fill gaps in sidewalks, trails and infrastructure with regional partners.",
        source: huPriorities,
      },
    },
    sources: [pamphlet(35), huPriorities],
  },
  "bill-monahan": {
    values: ["Facilities restraint", "Managerial experience"],
    tradeoff:
      "He argues for cheaper, better-analyzed facilities and core services voters can afford; the alternative police-facility plan and its full cost are not yet specified.",
    issues: {
      safety: {
        position:
          "Would develop what he calls reasonable police-facility solutions after voters rejected the $150 million bond, while maintaining the public-safety levels residents and businesses need.",
        source: monahanHome,
      },
      money: {
        position:
          "Would focus on core services residents need and can afford, and restore transparency and pursue affordable solutions to the city’s facility needs.",
        source: monahanHome,
      },
    },
    sources: [pamphlet(35), monahanHome, monahanFacilities],
  },
  /* ── Analysis: Tigard City Council ─────────────────────────────────── */
  "yousef-k-allouzi": {
    values: ["People-centered policy", "Safe routes"],
    tradeoff:
      "He wants multigenerational affordable housing and safer routes; the site names rent controls and paths to ownership as directions, without tools, targets or funding.",
    issues: {
      housing: {
        position:
          "Wants policies creating multigenerational affordable housing at every income level, including better paths to homeownership and rent controls.",
        source: allouziPriorities,
      },
      safety: {
        position: "Objects to automated license-plate readers and ICE actions that he says hunt residents and disregard due process.",
        source: allouziPriorities,
      },
      money: {
        position:
          "Opposes disproportionate budget cuts to the library and city events and wants evidence-based, accountable city decisions.",
        source: allouziPriorities,
      },
      climate: {
        position:
          "Wants dedicated trails and paths to schools, libraries and parks that avoid major roads, and sidewalks for safe walking, as safer and more sustainable street design.",
        source: allouziPriorities,
      },
    },
    sources: [pamphlet(38), allouziPriorities],
  },
  "tom-anderson": {
    values: ["Entry-level housing", "Capital investment"],
    tradeoff:
      "He ties growth to roads, facilities and parks funding; taking over Hall Boulevard and sustaining parks need money and agreements from other governments that his materials do not cost.",
    issues: {
      housing: { position: "Would encourage entry-level and middle housing to improve affordability.", source: pamphlet(38) },
      safety: { position: "Would improve facility conditions for emergency services and responders.", source: pamphlet(38) },
      money: {
        position:
          "Would partner workforce programs with industrial spaces to fill vacant facilities, address downtown parking needs and secure sustainable funding for parks, trails and ballfields.",
        source: pamphlet(38),
      },
      climate: { position: "Would seek state transfer of Hall Boulevard to the city with corridor upgrades.", source: pamphlet(38) },
    },
    sources: [pamphlet(38), site("Anderson · on the issues", "https://www.tomandersontigard.com/issues")],
  },
  "jeff-darland": {
    values: ["Fiscal transparency", "Lasting affordability"],
    tradeoff:
      "He separates lasting affordability from adding units and wants growth to pay its share; which public land and financing would support a land trust, and at what scale, are open.",
    issues: {
      housing: {
        position:
          "Supports thoughtful growth and would pursue partnerships using public land and community land trusts to create homes with lasting affordability.",
        source: pamphlet(37),
      },
      money: {
        position:
          "Would push plain-language explanations of utility rates, debt and major investments, and require new growth to pay its fair share of public costs.",
        source: pamphlet(37),
      },
      climate: {
        position: "Wants new growth to deliver walkable neighborhoods, protected natural areas, safe streets and public spaces.",
        source: pamphlet(37),
      },
    },
    sources: [pamphlet(37)],
  },
  "sue-garino": {
    values: ["Spending restraint", "Essential services"],
    tradeoff:
      "She would limit taxes, fees and spending while protecting emergency services and seniors; which spending would be reduced first is not identified.",
    issues: {
      housing: {
        position: "Would expand affordable workforce housing options and promote accessible housing for aging residents.",
        source: garinoHome,
      },
      safety: { position: "Would prioritize emergency services and responders to keep Tigard safe.", source: pamphlet(36) },
      money: {
        position:
          "Would limit growth of taxes, fees and spending, focus dollars on essential services, stop using one-time money for ongoing programs and require measurable results from new spending.",
        source: pamphlet(36),
      },
      climate: {
        position: "Would maintain streets, parks and infrastructure and promote accessible transportation options for older residents.",
        source: pamphlet(36),
      },
    },
    sources: [pamphlet(36), garinoHome],
  },
  "john-goodhouse": {
    values: ["Business activity", "Police support"],
    tradeoff:
      "He links business, events and streamlined homebuilding to affordability and city revenue; the permitting changes and their effect on infrastructure costs are not detailed.",
    issues: {
      housing: {
        position: "Would work with builders and city planning to streamline home building and make housing more affordable.",
        source: pamphlet(36),
      },
      safety: { position: "Would support the Police Department to make the community safer to live, get around and raise families.", source: pamphlet(36) },
      money: {
        position: "Would support new and existing businesses, more private events and downtown Tigard to drive economic growth.",
        source: pamphlet(36),
      },
      climate: {
        position: "Would improve transportation throughout Tigard: sidewalks, bike lanes, trails connecting neighborhoods and traffic congestion.",
        source: pamphlet(36),
      },
    },
    sources: [pamphlet(36)],
  },
  "shawne-martinez": {
    values: ["Climate urgency", "Active transportation"],
    tradeoff:
      "He wants Tigard walkable, bikeable and denser near transit; the site states the goals and names rezoning as the tool, without a budget, timeline or which areas would change.",
    issues: {
      housing: {
        position:
          "Would focus on infill housing and rezoning to allow more energy-efficient, dense housing near transit and services such as grocery stores and the library, building up rather than out.",
        source: martinezHome,
      },
      climate: {
        position:
          "Wants Tigard more walkable and bikeable so fewer people drive alone, pushing toward net-zero emissions as soon as possible.",
        source: martinezHome,
      },
    },
    sources: [martinezHome],
  },
  "kate-ristau": {
    values: ["Community services", "Planned growth"],
    tradeoff:
      "She would protect library and recreation services while adding housing and corridor upgrades; if revenue falls short, the order between services and capital projects is not stated.",
    issues: {
      housing: {
        position: "Would encourage starter homes, workforce housing and smart land-use decisions from the Tigard Triangle to River Terrace 2.0.",
        source: pamphlet(39),
      },
      money: {
        position:
          "Would make budget decisions that protect taxpayer dollars while investing in the library, recreation programs and child nutrition, and streamline business permitting.",
        source: pamphlet(39),
      },
      climate: {
        position:
          "Would improve transportation and sidewalks on Hall Boulevard, Highway 99W and SW 72nd Avenue and invest in parks, trails and public spaces.",
        source: pamphlet(39),
      },
    },
    sources: [pamphlet(39), site("Ristau · campaign site", "https://katefortigard.com/")],
  },
  "gabriel-elijio-velasquez": {
    values: ["Ownership limits", "Connected streets"],
    tradeoff:
      "Restricting corporate home purchases and rezoning parking lots for homes and businesses rely on legal authority and market responses his statement does not examine.",
    issues: {
      housing: {
        position: "Would extend the ban on corporate single-family home buyers and bridge the gap between renters and owners.",
        source: pamphlet(37),
      },
      safety: {
        position:
          "Would work with municipal, state and federal leaders on a single strategy so everyone has shelter and no one sleeps on Tigard’s streets.",
        source: pamphlet(37),
      },
      money: {
        position:
          "Would streamline zoning to turn underused parking lots into hubs for small businesses and housing, and partner with local businesses on community spaces expanding fresh-food access.",
        source: pamphlet(37),
      },
      climate: { position: "Would create a comprehensive citywide network of protected bike lanes and continuous sidewalks.", source: pamphlet(37) },
    },
    sources: [pamphlet(37)],
  },
};

/* ── Lines: one per documented position, alphabetical by displayed name within each race ── */
const lines: IssueLine[] = [
  /* Beaverton Position 1 */
  line("evelyn-kocher", "housing", "Supports rent control tied to inflation and faster approvals for multifamily homes near MAX."),
  line("evelyn-kocher", "safety", "Would ban Flock license-plate cameras and use city powers against ICE detentions."),
  line("evelyn-kocher", "money", "Wants new city taxes put to voters and big business paying more."),
  line("evelyn-kocher", "climate", "Wants South Cooper Mountain bus lines, downtown transit density and, later, WES to Salem."),
  line("rachel-philip", "housing", "Supports more apartments, townhomes and starter homes so people can stay in Beaverton."),
  line("rachel-philip", "safety", "Would defend the city from federal overreach and keep local resources protecting neighbors."),
  line("rachel-philip", "money", "Wants essential services protected, clear priorities and transparent budget decisions."),
  line("rachel-philip", "climate", "Wants safer school routes, calmer streets, protected trees and emergency-ready neighborhoods."),
  /* Hillsboro Ward 1 */
  line("luis-garcia", "housing", "Wants affordable housing treated as a basic, alongside good roads and clean water."),
  line("luis-garcia", "money", "Wants stewardship, accountability and respect for taxpayer dollars in city decisions."),
  line("luis-garcia", "climate", "Would protect farmland from semiconductor and data-center impacts, with roads and clean water first."),
  line("diana-jackson", "housing", "Wants housing treated as a human right, with workforce housing built up downtown."),
  line("diana-jackson", "safety", "Wants dual-diagnosis treatment centers with housing and job-training support; keeps sanctuary protections."),
  line("diana-jackson", "money", "Would grow small businesses instead of giving tax breaks to data centers."),
  line("diana-jackson", "climate", "Would protect the urban growth boundary and farmland; build up downtown with transit."),
  line("sarah-marugg", "housing", "Supports responsible housing growth and practical help for people precariously housed."),
  line("sarah-marugg", "safety", "Would defend civil rights and uphold Hillsboro’s sanctuary-city values."),
  line("sarah-marugg", "money", "Would make data centers pay for the infrastructure and services they use."),
  line("sarah-marugg", "climate", "Would protect farmland, wetlands, air and water, and make streets safer for walking."),
  line("cristian-salgado", "money", "Wants thoughtful data-center growth that weighs neighborhood impacts and brings measurable community benefit."),
  line("cristian-salgado", "climate", "Would invest in safe streets, sidewalks, crossings, parks and reliable services."),
  /* Hillsboro Ward 2 */
  line("karim-delgado", "housing", "Would push for rent-increase notice, eviction right to counsel and community land trusts."),
  line("karim-delgado", "safety", "Would fund mobile crisis response, legal aid and a Human Rights Office."),
  line("karim-delgado", "money", "Opposes corporate tax holidays without housing, living wages or community benefit."),
  line("karim-delgado", "climate", "Would tie subsidies to environmental compliance and invest in transit."),
  line("ivette-pantoja", "housing", "Wants balanced housing growth, missing-middle to multifamily, matched to neighborhood infrastructure."),
  line("ivette-pantoja", "money", "Wants employers, apprenticeships and career pathways that help working families and small businesses."),
  /* Hillsboro Ward 3 */
  line("dorian-russell", "housing", "Wants stable housing and homelessness made brief, with gentrification and evictions prevented."),
  line("dorian-russell", "safety", "Would invest in trauma-informed care over police response to homelessness; resists ICE."),
  line("dorian-russell", "money", "Wants major industries funding workforce development and paying living wages and benefits."),
  line("dorian-russell", "climate", "Would preserve family farms and natural areas and check data-center expansion."),
  line("titonian-wallace-sr", "housing", "Would remove barriers to housing production and back missing-middle homes near transit."),
  line("titonian-wallace-sr", "safety", "Sees safety as trust, prevention and coordination, including support for the homeless shelter."),
  line("titonian-wallace-sr", "money", "Would diversify the economy beyond semiconductors with clearer permitting (building approvals)."),
  line("titonian-wallace-sr", "climate", "Would invest in transportation and public spaces."),
  /* Tigard Mayor */
  line("yi-kang-hu", "housing", "Would expand housing options for every budget and stage of life."),
  line("yi-kang-hu", "safety", "Would keep public-safety services reliable, responsive and accountable, with emergency readiness."),
  line("yi-kang-hu", "money", "Would control residents’ costs through responsible budgeting while protecting essential services."),
  line("yi-kang-hu", "climate", "Would improve safety for pedestrians, cyclists and drivers and fill sidewalk gaps."),
  line("bill-monahan", "safety", "Would pursue affordable police-facility options while maintaining public-safety service levels."),
  line("bill-monahan", "money", "Would tie projects to reliable cost estimates and deliver affordable core services."),
  /* Tigard City Council */
  line("yousef-k-allouzi", "housing", "Wants multigenerational affordable housing, paths to ownership and rent controls."),
  line("yousef-k-allouzi", "safety", "Objects to license-plate readers and ICE actions that disregard residents’ due process."),
  line("yousef-k-allouzi", "money", "Opposes disproportionate budget cuts to the library and city events."),
  line("yousef-k-allouzi", "climate", "Wants trails and paths to schools and parks that avoid major roads."),
  line("tom-anderson", "housing", "Would encourage entry-level and middle housing to improve affordability."),
  line("tom-anderson", "safety", "Would improve facility conditions for emergency services and responders."),
  line("tom-anderson", "money", "Would fill vacant industrial space with workforce partners and fund parks sustainably."),
  line("tom-anderson", "climate", "Would seek state transfer of Hall Boulevard to Tigard with corridor upgrades."),
  line("jeff-darland", "housing", "Would use public land and community land trusts for permanently affordable homes."),
  line("jeff-darland", "money", "Would explain utility rates and debt plainly and make growth pay its share."),
  line("jeff-darland", "climate", "Wants growth delivering walkable neighborhoods, natural areas, safe streets and public spaces."),
  line("sue-garino", "housing", "Would expand workforce housing and accessible housing for older residents."),
  line("sue-garino", "safety", "Would prioritize emergency services and responders."),
  line("sue-garino", "money", "Would limit growth of taxes, fees and spending; no one-time money for ongoing programs."),
  line("sue-garino", "climate", "Would maintain streets, parks and infrastructure, with accessible transportation for seniors."),
  line("john-goodhouse", "housing", "Would streamline home building with builders and city planning to lower housing costs."),
  line("john-goodhouse", "safety", "Supports the Police Department to make the community safer."),
  line("john-goodhouse", "money", "Supports businesses, private events and downtown Tigard to drive economic growth."),
  line("john-goodhouse", "climate", "Would improve sidewalks, bike lanes, trails between neighborhoods and traffic congestion."),
  line("shawne-martinez", "housing", "Would rezone for infill and dense, energy-efficient housing near transit and services."),
  line("shawne-martinez", "climate", "Wants a more walkable, bikeable Tigard to cut emissions toward net zero."),
  line("kate-ristau", "housing", "Would encourage starter homes and workforce housing from the Tigard Triangle to River Terrace."),
  line("kate-ristau", "money", "Would protect taxpayer dollars while funding the library, recreation and child nutrition."),
  line("kate-ristau", "climate", "Would improve sidewalks on Hall Boulevard, Highway 99W and SW 72nd Avenue."),
  line("gabriel-elijio-velasquez", "housing", "Would extend the ban on corporate buyers of single-family homes."),
  line("gabriel-elijio-velasquez", "safety", "Would pursue one strategy with city, state and federal leaders so everyone has shelter."),
  line("gabriel-elijio-velasquez", "money", "Would rezone underused parking lots for small businesses and housing."),
  line("gabriel-elijio-velasquez", "climate", "Would build citywide protected bike lanes and continuous sidewalks."),
];

/* ── Chips: 2–4 words, ≤26 characters, same parent as the line ── */
const chips: StanceChip[] = [
  chip("evelyn-kocher", "housing", "Rent control, more homes"),
  chip("evelyn-kocher", "safety", "Ban Flock cameras"),
  chip("evelyn-kocher", "money", "Voters decide new taxes"),
  chip("evelyn-kocher", "climate", "Buses and transit density"),
  chip("rachel-philip", "housing", "Expand housing choices"),
  chip("rachel-philip", "safety", "Resist federal overreach"),
  chip("rachel-philip", "money", "Protect essential services"),
  chip("rachel-philip", "climate", "Safer school routes"),
  chip("luis-garcia", "housing", "Housing as a basic"),
  chip("luis-garcia", "money", "Respect taxpayer dollars"),
  chip("luis-garcia", "climate", "Protect farmland"),
  chip("diana-jackson", "housing", "Affordable homes near work"),
  chip("diana-jackson", "safety", "Dual-diagnosis treatment"),
  chip("diana-jackson", "money", "No data-center tax breaks"),
  chip("diana-jackson", "climate", "Hold the growth boundary"),
  chip("sarah-marugg", "housing", "Responsible housing growth"),
  chip("sarah-marugg", "safety", "Uphold sanctuary values"),
  chip("sarah-marugg", "money", "Data centers pay costs"),
  chip("sarah-marugg", "climate", "Protect wetlands, farmland"),
  chip("cristian-salgado", "money", "Weigh data-center impacts"),
  chip("cristian-salgado", "climate", "Safe streets and parks"),
  chip("karim-delgado", "housing", "Renter protections"),
  chip("karim-delgado", "safety", "Crisis teams, legal aid"),
  chip("karim-delgado", "money", "No blank-check subsidies"),
  chip("karim-delgado", "climate", "Polluters held accountable"),
  chip("ivette-pantoja", "housing", "Missing-middle homes"),
  chip("ivette-pantoja", "money", "Jobs and apprenticeships"),
  chip("dorian-russell", "housing", "Stable housing for all"),
  chip("dorian-russell", "safety", "Trauma-informed care"),
  chip("dorian-russell", "money", "Living-wage employers"),
  chip("dorian-russell", "climate", "Check data-center growth"),
  chip("titonian-wallace-sr", "housing", "Homes near transit"),
  chip("titonian-wallace-sr", "safety", "Trust-based safety"),
  chip("titonian-wallace-sr", "money", "Diversify local economy"),
  chip("titonian-wallace-sr", "climate", "Streets and public spaces"),
  chip("yi-kang-hu", "housing", "Homes for every budget"),
  chip("yi-kang-hu", "safety", "Reliable public safety"),
  chip("yi-kang-hu", "money", "Responsible budgeting"),
  chip("yi-kang-hu", "climate", "Safer streets, sidewalks"),
  chip("bill-monahan", "safety", "Affordable police facility"),
  chip("bill-monahan", "money", "Costed core services"),
  chip("yousef-k-allouzi", "housing", "Multigenerational housing"),
  chip("yousef-k-allouzi", "safety", "Due process for residents"),
  chip("yousef-k-allouzi", "money", "Protect library funding"),
  chip("yousef-k-allouzi", "climate", "Paths avoiding major roads"),
  chip("tom-anderson", "housing", "Starter and middle housing"),
  chip("tom-anderson", "safety", "Fix responder facilities"),
  chip("tom-anderson", "money", "Jobs in vacant facilities"),
  chip("tom-anderson", "climate", "Take over Hall Boulevard"),
  chip("jeff-darland", "housing", "Community land trusts"),
  chip("jeff-darland", "money", "Growth pays its share"),
  chip("jeff-darland", "climate", "Walkable neighborhoods"),
  chip("sue-garino", "housing", "Workforce housing"),
  chip("sue-garino", "safety", "Emergency services first"),
  chip("sue-garino", "money", "Limit tax, spending growth"),
  chip("sue-garino", "climate", "Maintain streets, parks"),
  chip("john-goodhouse", "housing", "Streamline home building"),
  chip("john-goodhouse", "safety", "Support Tigard police"),
  chip("john-goodhouse", "money", "Business-led growth"),
  chip("john-goodhouse", "climate", "Sidewalks and bike lanes"),
  chip("shawne-martinez", "housing", "Infill near transit"),
  chip("shawne-martinez", "climate", "Walkable, bikeable Tigard"),
  chip("kate-ristau", "housing", "Starter, workforce homes"),
  chip("kate-ristau", "money", "Fund library, recreation"),
  chip("kate-ristau", "climate", "Sidewalks on key corridors"),
  chip("gabriel-elijio-velasquez", "housing", "Extend corporate-buyer ban"),
  chip("gabriel-elijio-velasquez", "safety", "Shelter for everyone"),
  chip("gabriel-elijio-velasquez", "money", "Parking lots to businesses"),
  chip("gabriel-elijio-velasquez", "climate", "Protected bike lanes"),
];

/* ── Promise ladder: rungs only where a source names a mechanism or a result ── */
const deliveries: Delivery[] = [
  delivery("evelyn-kocher", "housing", {
    how: step(
      "Index allowed rent increases to inflation, streamline zoning and permitting for mixed-use and multifamily homes, and work with Washington County to speed use of Metro supportive-housing (SHS) dollars for wraparound services.",
      kocherPriorities,
    ),
  }),
  delivery("evelyn-kocher", "safety", {
    how: step("Introduce a council ordinance modeled on Woodburn’s and Eugene’s that bans Flock from operating within the city.", kocherPriorities),
  }),
  delivery("evelyn-kocher", "money"),
  delivery("evelyn-kocher", "climate", {
    how: step(
      "Prioritize the Beaverton Loop and TV Highway redevelopment, add South Cooper Mountain bus lines, and pursue transit-oriented development linking Old Town, The Loop and Cedar Hills Crossing.",
      kocherPriorities,
    ),
  }),
  delivery("rachel-philip", "housing"),
  delivery("rachel-philip", "safety"),
  delivery("rachel-philip", "money"),
  delivery("rachel-philip", "climate"),
  delivery("luis-garcia", "housing"),
  delivery("luis-garcia", "money"),
  delivery("luis-garcia", "climate"),
  delivery("diana-jackson", "housing", {
    how: step(
      "Pair workforce housing with small-business support in the Downtown Hillsboro Urban Renewal Area and build up rather than out, reinforced by multimodal transportation.",
      jacksonPlatform,
    ),
  }),
  delivery("diana-jackson", "safety", {
    how: step(
      "Dual-diagnosis centers treating addiction and mental health together, with wraparound housing and job-training services, sited in the Health & Education District near TriMet stations.",
      jacksonPlatform,
    ),
  }),
  delivery("diana-jackson", "money"),
  delivery("diana-jackson", "climate"),
  delivery("sarah-marugg", "housing"),
  delivery("sarah-marugg", "safety"),
  delivery("sarah-marugg", "money"),
  delivery("sarah-marugg", "climate", {
    how: step(
      "Stop further data-center buildout; for permitted facilities require compliance with environmental standards, wastewater testing and public reporting; oppose luxury private-jet expansion with stronger oversight of corporate aviation land-use decisions.",
      maruggHome,
    ),
  }),
  delivery("cristian-salgado", "money"),
  delivery("cristian-salgado", "climate"),
  delivery("karim-delgado", "housing", {
    how: step(
      "Attach housing-affordability requirements to Enterprise Zone and SIP subsidy deals, alongside city rules on rent-increase notice, eviction counsel and anti-displacement protections.",
      delgadoIssues,
    ),
  }),
  delivery("karim-delgado", "safety", {
    how: step(
      "Fund mobile crisis response adequately (he contrasts it with the $70 million police-headquarters bond spend), finish the tabled Human Rights Office, and write judicial-warrant-only rules into every city policy.",
      delgadoIssues,
    ),
  }),
  delivery("karim-delgado", "money", {
    how: step(
      "Raise the Community Service Fee ceiling and move the school-support fee from the 15% floor toward 30% on new abatements; require community-benefit analysis, job and wage disclosure and a council briefing before any subsidy; claw back unmet commitments.",
      delgadoIssues,
    ),
  }),
  delivery("karim-delgado", "climate", {
    how: step(
      "Environmental-compliance conditions in all future subsidy agreements, capital investment in transit, and a study of a data-center electricity class within the city’s franchise fee.",
      delgadoIssues,
    ),
  }),
  delivery("ivette-pantoja", "housing"),
  delivery("ivette-pantoja", "money", {
    how: step(
      "Align education from early childhood through career-technical programs with local employer needs and expand apprenticeships in high-growth sectors such as advanced manufacturing.",
      pantojaPriorities,
    ),
  }),
  delivery("dorian-russell", "housing"),
  delivery("dorian-russell", "safety"),
  delivery("dorian-russell", "money"),
  delivery("dorian-russell", "climate"),
  delivery("titonian-wallace-sr", "housing", {
    how: step(
      "Remove barriers that slow production, support missing-middle housing near jobs, services and transit, and back energy-efficient buildings and retrofits to cut monthly utility bills.",
      wallacePriorities,
    ),
  }),
  delivery("titonian-wallace-sr", "safety", {
    how: step(
      "Clear communication, listening sessions, referrals to services and safety planning when communities face fear or disruption; support the success of Hillsboro’s homeless shelter and pathways from crisis to stability.",
      wallacePriorities,
    ),
  }),
  delivery("titonian-wallace-sr", "money", {
    how: step(
      "Recruit new sectors that fit Hillsboro, clearer permitting guidance and predictable timelines, business-retention support, fair access to city contracts and regional collaboration with neighboring cities and the county.",
      wallacePriorities,
    ),
  }),
  delivery("titonian-wallace-sr", "climate"),
  delivery("yi-kang-hu", "housing"),
  delivery("yi-kang-hu", "safety"),
  delivery("yi-kang-hu", "money"),
  delivery("yi-kang-hu", "climate"),
  delivery("bill-monahan", "safety", {
    how: step(
      "Follow the 2002 library-bond sequence: option land, fund a modest needs analysis and a project model before asking voters, rather than buying land and awarding design contracts first.",
      monahanFacilities,
    ),
  }),
  delivery("bill-monahan", "money", {
    how: step(
      "Account publicly for how consultant and land costs on the failed $150 million measure were paid and which utility-fund projects were delayed, before choosing between the 2024 site and alternatives.",
      monahanFacilities,
    ),
  }),
  delivery("yousef-k-allouzi", "housing"),
  delivery("yousef-k-allouzi", "safety"),
  delivery("yousef-k-allouzi", "money"),
  delivery("yousef-k-allouzi", "climate"),
  delivery("tom-anderson", "housing"),
  delivery("tom-anderson", "safety"),
  delivery("tom-anderson", "money"),
  delivery("tom-anderson", "climate"),
  delivery("jeff-darland", "housing"),
  delivery("jeff-darland", "money"),
  delivery("jeff-darland", "climate"),
  delivery("sue-garino", "housing"),
  delivery("sue-garino", "safety"),
  delivery("sue-garino", "money"),
  delivery("sue-garino", "climate"),
  delivery("john-goodhouse", "housing"),
  delivery("john-goodhouse", "safety"),
  delivery("john-goodhouse", "money"),
  delivery("john-goodhouse", "climate"),
  delivery("shawne-martinez", "housing"),
  delivery("shawne-martinez", "climate"),
  delivery("kate-ristau", "housing"),
  delivery("kate-ristau", "money"),
  delivery("kate-ristau", "climate"),
  delivery("gabriel-elijio-velasquez", "housing"),
  delivery("gabriel-elijio-velasquez", "safety"),
  delivery("gabriel-elijio-velasquez", "money"),
  delivery("gabriel-elijio-velasquez", "climate"),
];

/* ── In their own words: first complete sentence of the statement (own-words.ts rule) ── */
const VERBATIM = "Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.";
const ownWords: OwnWords[] = [
  own("evelyn-kocher", "I am focused on building a Beaverton that is safe and affordable for everyone.", "pamphlet-opening", pamphletOpening(9, `${VERBATIM} Skips the label line “Immigrant | Trans Woman | Lifelong Beavertonian”.`)),
  own("rachel-philip", "Beaverton is home. It is where my husband and I are raising our two children.", "pamphlet-opening", pamphletOpening(9, `${VERBATIM} Skips the label line “EXPERIENCED. PROVEN. READY.”; the first sentence is under 12 words, so two are used.`)),
  own("luis-garcia", "Hillsboro is full of potential, and our future depends on how well we prepare for the challenges ahead.", "pamphlet-opening", pamphletOpening(15, `${VERBATIM} Skips the slogan “Hillsboro - For the People - For the Future”.`)),
  own("diana-jackson", "Diana is a nine-year resident of Hillsboro, working downtown for a nonprofit public defense law firm, a proud member of Oregon AFSCME Local 3668, and she currently serves on the Hillsboro Planning Commission.", "pamphlet-opening", pamphletOpening(16, `${VERBATIM} Skips the label line “A neighbor. A mom. A fighter for Hillsboro.” (fragments with no predicate).`)),
  own("sarah-marugg", "Affordability is more than the price of housing, it includes food and the Hillutility bills families pay every month.", "pamphlet-opening", pamphletOpening(16, `${VERBATIM} Skips the website line and the run-in label “Affordability & Housing”. “Hillutility” is printed that way in the pamphlet and is kept verbatim.`)),
  own("cristian-salgado", "Public service should be practical, accountable, and rooted in the people we serve.", "pamphlet-opening", pamphletOpening(15)),
  own("karim-delgado", "Hillsboro’s growth should serve the people who live here, not just the corporations that profit here.", "pamphlet-opening", pamphletOpening(17)),
  own("ivette-pantoja", "Ivette is the proud daughter of Mexican immigrants and the granddaughter of migrant farmworkers.", "pamphlet-opening", pamphletOpening(17, `${VERBATIM} Skips the heading “Born and Raised in Hillsboro”.`)),
  // Culbertson: no statement for this race; her site still presents her earlier County Commission run, so no opening is quoted.
  own("dorian-russell", "As a teen in Hillsboro, Dorian got food from church pantries and showers at the Shute Park pool.", "pamphlet-opening", pamphletOpening(18, `${VERBATIM} Skips the heading “Make Our Government Work for the Working Class”.`)),
  own("titonian-wallace-sr", "As a father of four and small business owner, I’ll never stop working to uplift Hillsboro and support my family.", "pamphlet-opening", pamphletOpening(18, `${VERBATIM} Skips the run-in label “Statement:”.`)),
  own("yi-kang-hu", "Yi-Kang Hu is a tireless advocate for Tigard. He puts community voices first, brings people together, and solves problems.", "pamphlet-opening", pamphletOpening(35, `${VERBATIM} The first sentence is under 12 words, so two are used.`)),
  own("bill-monahan", "I have lived in Tigard since 1982, serving as Planning Director until 1988 and City Manager from 1994 to 2005.", "pamphlet-opening", pamphletOpening(35, `${VERBATIM} Skips the heading “About Bill Monahan”.`)),
  own("yousef-k-allouzi", "As the federal administration attacks local communities, Tigard needs bold leaders who will protect neighbors and ensure residents have the resources they need to thrive.", "pamphlet-opening", pamphletOpening(38, `${VERBATIM} Skips the heading “Building a Tigard That Delivers for Everyone”.`)),
  own("tom-anderson", "Tom wants Tigard to remain a community where people can afford to live, businesses can succeed, and families can put down roots.", "pamphlet-opening", pamphletOpening(38, `${VERBATIM} Skips the label lines “ELECT TOM ANDERSON” and “PROVEN LEADERSHIP. LOCAL PRIORITIES.”.`)),
  own("jeff-darland", "Follow the Money. Plan for the Future.", "pamphlet-opening", pamphletOpening(37, `${VERBATIM} The statement opens with three imperative slogans that each end with a period and carry a predicate, so under the rule the first counts as a sentence; it is under 12 words, so the first two are used. The running prose begins “My path to public service began with a water bill.”`)),
  own("sue-garino", "Sue knows Tigard. She’s served our community, supported public safety, and represented working people.", "pamphlet-opening", pamphletOpening(36, `${VERBATIM} Skips the heading “ELECT SUE GARINO” and the label line “Experience. Accountability. Integrity.”; the first sentence is under 12 words, so two are used.`)),
  own("john-goodhouse", "As a lifelong Tigard resident, my greatest honor has been serving as a former city councilor in the community where I grew up and where I’ve raised my kids.", "pamphlet-opening", pamphletOpening(36, `${VERBATIM} Skips the header fields (committee appointments, family) and the run-in label “Keeping Community First:”. This sentence is printed inside quotation marks attributed to “John Goodhouse for Tigard City Council”, that is, to the candidate himself, so it is treated as his statement text rather than an endorsement quote.`)),
  own("shawne-martinez", "We’ve seen firsthand how human caused climate change has affected the Pacific Northwest.", "site-opening", {
    label: "Martinez · campaign site (home page)",
    url: "https://shawne4tigard.com/",
    kind: "Candidate statement",
    date: "Website reviewed September 21, 2026",
    note: "Verbatim opening of the candidate's own site text, after the fragment “Hotter Summers, wildfire smoke, low snowpack.” (no predicate). No pamphlet statement; the site was found by search and is not printed on his City filing.",
  }),
  own("kate-ristau", "Kate is a nonprofit executive, community leader, 20+ year Tigard resident, and a mom.", "pamphlet-opening", pamphletOpening(39, `${VERBATIM} Skips the heading “A BETTER FUTURE TOGETHER”.`)),
  own("gabriel-elijio-velasquez", "I am a healthcare worker and a local civic leader, currently serving as Chair of Tigard’s Town Center Advisory Commission and as a member of the City Center Grant Approval Committee.", "pamphlet-opening", pamphletOpening(37, `${VERBATIM} Skips the label line “Experienced | Dedicated | Lifelong Neighbor”.`)),
];

/* ── Reaching the campaign: only channels the candidate published ── */
const filing = (label: string, url: string, note: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Filed 2026; read September 21, 2026",
  note,
});

const contacts: CandidateContact[] = [
  contact(
    "evelyn-kocher",
    [
      web("https://evelynforbeaverton.com/", "pamphlet"),
      email("evelynforbeaverton@gmail.com", "site"),
      form("https://evelynforbeaverton.com/", "Contact form", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61585504307974", "site"),
      social("Instagram", "https://www.instagram.com/evelynforbeaverton/", "site"),
      social("Bluesky", "https://bsky.app/profile/evelynforbeaverton.bsky.social", "site"),
    ],
    [pamphlet(9), site("Kocher · get involved (email) and home page (contact form, footer profiles)", "https://evelynforbeaverton.com/get-involved")],
  ),
  contact(
    "rachel-philip",
    [web("https://www.rachelforbeaverton.com/", "pamphlet"), form("https://www.rachelforbeaverton.com/support", "Volunteer form", "site")],
    [pamphlet(9), site("Philip · support the campaign (volunteer form; the site lists no email, phone or profiles)", "https://www.rachelforbeaverton.com/support")],
  ),
  contact(
    "luis-garcia",
    [],
    [pamphlet(15)],
    "His pamphlet statement prints no website, email or phone, and no campaign site or campaign profile was found by search on September 21, 2026.",
  ),
  contact(
    "diana-jackson",
    [
      web("https://www.dianaforhillsboro.com/", "pamphlet"),
      email("DianaForHillsboro@gmail.com", "site"),
      form("https://www.dianaforhillsboro.com/volunteer.html", "Volunteer form", "site"),
    ],
    [pamphlet(16), site("Jackson · volunteer page (email in the site footer)", "https://www.dianaforhillsboro.com/volunteer.html")],
  ),
  contact(
    "sarah-marugg",
    [
      web("https://www.maruggforhillsboro.com/", "pamphlet"),
      email("maruggforhillsboro@gmail.com", "site"),
      form("https://docs.google.com/forms/d/e/1FAIpQLSe_0TkZf2lG4gPMFI7FDTglGl7pQAuGvLKSGo-CI67UXX_tlA/viewform", "Volunteer form", "site"),
    ],
    [pamphlet(16), site("Marugg · home page (email in the footer; the Volunteer link opens a Google form)", "https://www.maruggforhillsboro.com/")],
  ),
  contact(
    "cristian-salgado",
    [],
    [pamphlet(15)],
    "His pamphlet statement prints no website, email or phone; cristiansalgado.com is a parked domain and no campaign site or campaign profile was found by search on September 21, 2026.",
  ),
  contact(
    "karim-delgado",
    [
      web("https://www.karimdelgado.com/", "pamphlet"),
      form("https://www.karimdelgado.com/join", "Volunteer form", "site"),
      social("Facebook", "https://www.facebook.com/karimforhillsboro", "site"),
      social("Instagram", "https://www.instagram.com/karimforhillsboro", "site"),
      social("TikTok", "https://www.tiktok.com/@karimforhillsboro", "site"),
    ],
    [pamphlet(17), site("Delgado · join the team (volunteer form; profiles in the site footer; no email is published)", "https://www.karimdelgado.com/join")],
  ),
  contact(
    "ivette-pantoja",
    [
      web("https://www.ivettepantoja.com/", "pamphlet"),
      form("https://www.ivettepantoja.com/contact", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/ivetteforhillsboro/", "site"),
    ],
    [pamphlet(17), site("Pantoja · contact page (“Join our campaign” form; no email or phone is published)", "https://www.ivettepantoja.com/contact")],
  ),
  contact(
    "kimberly-culbertson",
    [web("https://www.kimberlyculbertson.org/", "site")],
    [
      site(
        "Culbertson · campaign site (home page)",
        "https://www.kimberlyculbertson.org/",
        "No pamphlet statement for this race. The site is her own campaign site but still presents her earlier 2026 County Commission District 4 candidacy; it lists no email, phone, form or profiles. Third-party listings name a Facebook page, which is not recorded because she has not linked it from her own material.",
      ),
    ],
  ),
  contact(
    "dorian-russell",
    [
      web("https://votedorianrussell.com/", "pamphlet"),
      form("https://votedorianrussell.com/volunteer/", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/votedorianrussell/", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61592819801158", "site"),
    ],
    [pamphlet(18), site("Russell · volunteer page (embedded form; profiles in the site header; no email is published)", "https://votedorianrussell.com/volunteer/")],
  ),
  contact(
    "titonian-wallace-sr",
    [
      web("https://titonianforhillsboro.com/", "site"),
      email("titonianforhillsboro@gmail.com", "site"),
      form("https://titonianforhillsboro.com/get-involved/", "Volunteer form", "site"),
      social("Facebook", "https://www.facebook.com/titonianforhillsboro", "site"),
      social("Instagram", "https://www.instagram.com/titonianforhillsboro", "site"),
      social("TikTok", "https://www.tiktok.com/@titonianforhillsboro", "site"),
    ],
    [pamphlet(18), site("Wallace · get involved (embedded volunteer form; email and profiles in the site footer). The pamphlet prints no site; this one was found by search.", "https://titonianforhillsboro.com/get-involved/")],
  ),
  contact(
    "yi-kang-hu",
    [
      web("https://www.yikanghu.com/", "pamphlet"),
      form("https://www.yikanghu.com/get-involved", "Volunteer form", "site"),
      social("Facebook", "https://www.facebook.com/yifortigard", "site"),
      social("Instagram", "https://www.instagram.com/yifortigard", "site"),
      social("Threads", "https://www.threads.com/yifortigard", "site"),
    ],
    [pamphlet(35), site("Hu · get involved (“Join Team Yi” form; profiles in the site footer; no email is published)", "https://www.yikanghu.com/get-involved")],
  ),
  contact(
    "bill-monahan",
    [
      web("https://www.citizenstoelectbillmonahan.com/", "pamphlet"),
      email("bmonahan20@comcast.net", "site"),
      { url: "tel:+15038053268", label: "503-805-3268", kind: "phone", from: "site" },
      form("https://www.citizenstoelectbillmonahan.com/contact", "Contact form", "site"),
      social("Facebook", "https://www.facebook.com/citizenstoelectbillmonahan", "site"),
    ],
    [pamphlet(35), site("Monahan · contact & donations (email, phone and form; Facebook in the site footer)", "https://www.citizenstoelectbillmonahan.com/contact")],
  ),
  contact(
    "yousef-k-allouzi",
    [
      web("https://www.yousefallouzi.com/", "pamphlet"),
      email("info@yousefallouzi.com", "site"),
      social("Instagram", "https://www.instagram.com/yousef.allouzi.tigard", "site"),
      social("Facebook", "https://www.facebook.com/share/1EgVaGSFAD/", "site"),
      social("YouTube", "https://youtube.com/playlist?list=PLMs4T0uiAcvKrP7TGmvqktyP00a0_HwSy", "site"),
    ],
    [pamphlet(38), site("Allouzi · home page (“Contact Us” email and profile links in the footer)", "https://www.yousefallouzi.com/")],
  ),
  contact(
    "tom-anderson",
    [web("https://www.tomandersontigard.com/", "pamphlet")],
    [pamphlet(38), site("Anderson · campaign site (home, issues, meet Tom and contribute pages list no email, phone, form or profiles)", "https://www.tomandersontigard.com/")],
  ),
  contact(
    "jeff-darland",
    [email("jeff@darland4tigard.com", "filing")],
    [
      pamphlet(37),
      filing(
        "Darland · SEL 101 candidate filing · contact fields on page 1",
        "https://www.tigard-or.gov/home/showpublisheddocument/6832/639232684634000000",
        "The pamphlet statement prints no website, email or phone. The City filing (linked from the City of Tigard election page) gives this email and lists darland4tigard.com as the website, which had no web server on September 21, 2026 (the domain resolves only for mail). The filing’s cell-phone field is not recorded.",
      ),
    ],
  ),
  contact(
    "sue-garino",
    [
      web("https://www.suefortigard.com/", "pamphlet"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61593990399874", "site"),
      social("Instagram", "https://www.instagram.com/suefortigard/", "site"),
    ],
    [pamphlet(36), site("Garino · home page (profile links in the footer; no email, phone or form is published)", "https://www.suefortigard.com/")],
  ),
  contact(
    "john-goodhouse",
    [email("JGoodhouse@Choicesins.com", "filing")],
    [
      pamphlet(36),
      filing(
        "Goodhouse · SEL 101 candidate filing · contact fields on page 1",
        "https://www.tigard-or.gov/home/showpublisheddocument/6854/639232691014970000",
        "The pamphlet statement prints no website, email or phone; it points to a Facebook page named “John Goodhouse for Tigard City Councilor” without a URL, which could not be resolved without a Facebook login. The City filing gives this email and no website; its cell-phone field is not recorded.",
      ),
    ],
  ),
  contact(
    "shawne-martinez",
    [
      web("https://shawne4tigard.com/", "site"),
      email("Shawne.Martinez@SBCGlobal.net", "filing"),
      social("Bluesky", "https://bsky.app/profile/shawne4tigard.bsky.social", "announcement"),
    ],
    [
      site("Martinez · campaign site (found by search; it has a subscribe box and no email, phone, form or profile links)", "https://shawne4tigard.com/"),
      filing(
        "Martinez · SEL 101 candidate filing · contact fields on page 1",
        "https://www.tigard-or.gov/home/showpublisheddocument/6882/639232714041030000",
        "No pamphlet statement. The handwritten filing gives this email and no website; its cell-phone field is not recorded.",
      ),
      {
        label: "Martinez · Bluesky profile (@shawne4tigard.bsky.social)",
        url: "https://bsky.app/profile/shawne4tigard.bsky.social",
        kind: "Candidate statement",
        date: "Profile created August 22, 2026; read September 21, 2026",
        note: "His own campaign profile, whose bio announces the candidacy and invites residents to reach out; neither the site nor the filing links it.",
      },
    ],
  ),
  contact(
    "kate-ristau",
    [web("https://katefortigard.com/", "pamphlet")],
    [pamphlet(39), site("Ristau · campaign site (a newsletter sign-up only; no email, phone, contact form or profiles are published)", "https://katefortigard.com/")],
  ),
  contact(
    "gabriel-elijio-velasquez",
    [
      web("https://www.gabevelasquez.com/", "pamphlet"),
      email("info@gabevelasquez.com", "site"),
      social("Facebook", "https://www.facebook.com/velasquez.gabe", "site"),
      social("Instagram", "https://www.instagram.com/gabe._.velasquez/", "site"),
      social("TikTok", "https://www.tiktok.com/@gevforyou", "site"),
      social("X", "https://x.com/VelasquezGabe", "site"),
    ],
    [pamphlet(37), site("Velásquez · campaign site (email and profile links in the footer). The footer also carries a template disclaimer calling the site a sample; the contact channels are recorded as printed.", "https://www.gabevelasquez.com/")],
  ),
];

/* ── Roles (≤6 words, clipped from background), primary sources ── */
const roles: RoleOverride[] = [
  { candidateId: "luis-garcia", role: "Health-information systems designer", from: "background" },
  { candidateId: "shawne-martinez", role: "Tigard resident; climate advocate", from: "background" },
  { candidateId: "sarah-marugg", role: "Revenue and tax specialist", from: "background" },
  { candidateId: "ivette-pantoja", role: "Preschool owner; former school-board chair", from: "background" },
  { candidateId: "karim-delgado", role: "Business owner; Marine veteran", from: "background" },
  { candidateId: "titonian-wallace-sr", role: "Small-business owner and rideshare driver", from: "background" },
  { candidateId: "sue-garino", role: "Retired Tigard police-department employee", from: "background" },
  { candidateId: "gabriel-elijio-velasquez", role: "Healthcare worker; advisory commission chair", from: "background" },
  { candidateId: "jeff-darland", role: "Former engineering leader; budget-committee member", from: "background" },
  { candidateId: "yousef-k-allouzi", role: "Data analyst with budget-committee experience", from: "background" },
];

const primary: PrimaryStatement[] = [
  { candidateId: "evelyn-kocher", sourceUrl: `${PAMPHLET}#page=9` },
  { candidateId: "rachel-philip", sourceUrl: `${PAMPHLET}#page=9` },
  { candidateId: "luis-garcia", sourceUrl: `${PAMPHLET}#page=15` },
  { candidateId: "diana-jackson", sourceUrl: `${PAMPHLET}#page=16` },
  { candidateId: "sarah-marugg", sourceUrl: `${PAMPHLET}#page=16` },
  { candidateId: "cristian-salgado", sourceUrl: `${PAMPHLET}#page=15` },
  { candidateId: "karim-delgado", sourceUrl: `${PAMPHLET}#page=17` },
  { candidateId: "ivette-pantoja", sourceUrl: `${PAMPHLET}#page=17` },
  { candidateId: "dorian-russell", sourceUrl: `${PAMPHLET}#page=18` },
  { candidateId: "titonian-wallace-sr", sourceUrl: `${PAMPHLET}#page=18` },
  { candidateId: "yi-kang-hu", sourceUrl: `${PAMPHLET}#page=35` },
  { candidateId: "bill-monahan", sourceUrl: `${PAMPHLET}#page=35` },
  { candidateId: "yousef-k-allouzi", sourceUrl: `${PAMPHLET}#page=38` },
  { candidateId: "tom-anderson", sourceUrl: `${PAMPHLET}#page=38` },
  { candidateId: "jeff-darland", sourceUrl: `${PAMPHLET}#page=37` },
  { candidateId: "sue-garino", sourceUrl: `${PAMPHLET}#page=36` },
  { candidateId: "john-goodhouse", sourceUrl: `${PAMPHLET}#page=36` },
  // Martinez has no pamphlet statement; his campaign site is the only candidate statement in his pool.
  { candidateId: "shawne-martinez", sourceUrl: "https://shawne4tigard.com/" },
  { candidateId: "kate-ristau", sourceUrl: `${PAMPHLET}#page=39` },
  { candidateId: "gabriel-elijio-velasquez", sourceUrl: `${PAMPHLET}#page=37` },
  // Culbertson: no candidate statement in her evidence pool (see missing), so no primary source is set.
];

/* ── Ballots: from race.method and the elections authorities, never the seat count ── */
const countyElection = official(
  "Washington County Elections · November 3, 2026 General Election · candidate positions",
  "https://www.washingtoncountyor.gov/elections/current-election",
  "Lists “City of Beaverton Council Member, Position 1: Evelyn Kocher, Rachel Philip (Runoff Election)”.",
);
const hillsboroCertified = official(
  "City of Hillsboro · certified candidates for the November 3, 2026 ballot",
  "https://www.washingtoncountyor.gov/elections/documents/city-hillsboro-certified-candidates-nov-2026/download?inline",
  "One four-year seat per ward position, each with its own candidate list.",
);
const tigardCertified = official(
  "City of Tigard · certification of candidates for the November 3, 2026 ballot",
  "https://www.washingtoncountyor.gov/elections/documents/city-tigard-certified-candidates-nov-2026/download?inline",
  "Prints “Mayor (4-yr. Term) Vote for one” and “City Councilor (4-yr. Term) Vote for three”.",
);
const tigardElection = official(
  "City of Tigard · Election Information · November 3, 2026",
  "https://www.tigard-or.gov/your-government/council/election",
  "States “Councilors: Three 4-year terms” and “The top three Councilor candidates will be elected.”",
);
const ONE = "You vote for one candidate.";
const ballots: BallotInstruction[] = [
  { raceId: "beaverton-position-1", text: ONE, note: "The county elections office lists this seat as a runoff election.", source: countyElection },
  { raceId: "hillsboro-ward-1", text: ONE, source: hillsboroCertified },
  { raceId: "hillsboro-ward-2", text: ONE, source: hillsboroCertified },
  { raceId: "hillsboro-ward-3", text: ONE, source: hillsboroCertified },
  { raceId: "tigard-mayor", text: ONE, source: tigardCertified },
  { raceId: "tigard-council", text: "You vote for up to three candidates for three seats.", note: "The three candidates with the most votes are elected.", source: tigardElection },
];

/**
 * Hillsboro wards are residency districts: the city’s ward page says two
 * councilors who reside in each ward are elected and that, once elected, all
 * councilors represent the entire city. The line repeats only what that page
 * says; the ward map carries the address lookup.
 */
const wardSource = official(
  "City of Hillsboro · City Council Wards",
  "https://www.hillsboro-oregon.gov/our-city/departments/city-manager-s-office/hillsboro-101/city-council-wards",
  "Says the city is divided into three wards, that two councilors who reside in each ward are elected, and that all council members represent the entire city once elected. Ward boundaries adopted January 3, 2023 (Ordinance 6411).",
);
const WARD_LINE =
  "Hillsboro’s three wards are where councilors must live; every councilor represents the whole city. Find your ward on the city’s map.";
const districts: DistrictInfo[] = [
  { raceId: "hillsboro-ward-1", neighborhoods: WARD_LINE, mapUrl: "https://gis.hillsboro-oregon.gov/councilwards/", mapSource: wardSource },
  { raceId: "hillsboro-ward-2", neighborhoods: WARD_LINE, mapUrl: "https://gis.hillsboro-oregon.gov/councilwards/", mapSource: wardSource },
  { raceId: "hillsboro-ward-3", neighborhoods: WARD_LINE, mapUrl: "https://gis.hillsboro-oregon.gov/councilwards/", mapSource: wardSource },
];

const paragraph = (raceId: string, text: string): ChoiceParagraph => ({ raceId, text, from: "race.comparison", ...reviewed });
const choice: ChoiceParagraph[] = [
  paragraph(
    "beaverton-position-1",
    "Both candidates want more housing choices and safer streets. One adds specific limits: public votes on new taxes and removing Flock cameras. The other leads with budget oversight and infrastructure ready for heat, smoke and storms. Ask which first-year actions each would take.",
  ),
  paragraph(
    "hillsboro-ward-1",
    "The dividing line is how each candidate would condition industrial growth: measurable community benefits, decisions grounded in evidence and stewardship, full cost recovery from data centers, and ending data-center tax breaks altogether. Ask what each would require before approving the next project.",
  ),
  paragraph(
    "hillsboro-ward-2",
    "One candidate emphasizes schools, employers and family stability, offering childcare and school-board experience. The other proposes specific changes: tighter conditions on corporate incentives, expanded immigrant services and weekly town halls. Ask what each would cost and which council votes would change.",
  ),
  paragraph(
    "hillsboro-ward-3",
    "One candidate emphasizes jobs, housing and infrastructure delivered through practical growth. Another foregrounds youth stability, worker benefits and limits on industrial impacts. A third has filed without a published platform for this seat. Ask what each would require of the next data-center proposal.",
  ),
  paragraph(
    "tigard-mayor",
    "One candidate offers continuity after leadership and budget turmoil, with regional relationships as the tool. The other argues facilities planning and affordability need a different approach, starting with a cheaper police-facility plan. Ask each for the full cost of their facility answer.",
  ),
  paragraph(
    "tigard-council",
    "Look past shared affordability language: candidates propose different mixes of spending limits, housing rules, public-land partnerships, street investments and service protection. You choose three, so ask which of those mixes you want represented together and what each candidate would cut first.",
  ),
];

/* ── Topics, stances and stakes: the official record (September 22, 2026) ── */

/**
 * Live choices for each city, each candidate's explicit stance on them, and
 * what the seat decides this term. A sitting official's recorded vote or
 * official action is "Public record" (cited to the agenda or minutes and
 * dated); a news outlet's quote is "Reporting"; the candidate's own words
 * are "Candidate statement". Nothing is inferred from party, endorsements
 * or silence; a missing cell is a research gap.
 */
const TOPICS_REVIEWED = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;
const record = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Public record",
  date,
  ...(note ? { note } : {}),
});
const reporting = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Reporting",
  date,
  ...(note ? { note } : {}),
});
const stance = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chipText: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip: chipText, text, source, ...TOPICS_REVIEWED });

/* Beaverton: council packets on the city's Diligent Community portal, the Beaverton Valley Times and the candidates' own pages */
const BVT_DOC = "https://beaverton.community.highbond.com/document";
const bvtJul7 = record(
  "Beaverton City Council · July 7, 2026 agenda packet (Agenda Bills 26134 and 26135: General Services Fee and Street Maintenance Fee; January 20, February 3 and May 5, 2026 minutes)",
  `${BVT_DOC}/20914`,
  "July 7, 2026; read September 22, 2026",
  "Ordinance 4881: $9.50 a month per single-family equivalent, rising 8% a year, about $5.3 million a year; staff’s alternative was “the elimination of 22-40 positions.” Ordinance 4882: a street fee ramping up $5 a year over three years. Both billed from August 1, 2026.",
);
const bvtSep8 = record(
  "Beaverton City Council · September 8, 2026 agenda packet (Agenda Bill 26151: Fiscal Sustainability update)",
  `${BVT_DOC}/22148`,
  "September 8, 2026; read September 22, 2026",
  "FY 2026–27 closed a $16.2 million general-fund gap with $13.5 million in new revenue, $2.7 million in cuts (6.6 positions) and $2.5 million one-time; FY 2027–28 potential deficit $6–9 million; two $1.8 million reduction packages; levy and no-levy scenarios.",
);
const bvtJun16 = record(
  "Beaverton City Council · June 16, 2026 agenda packet (Agenda Bill 26110, Resolution 4957 adopting the FY 2026–27 budget)",
  `${BVT_DOC}/20040`,
  "June 16, 2026; read September 22, 2026",
  "Total budget $514,218,807; tax levy at the $4.6180 permanent rate.",
);
const bvtBura = record(
  "Beaverton Urban Redevelopment Agency · September 22, 2026 packet (project updates: the Loop, Beaverdam Road, BUILD grant)",
  `${BVT_DOC}/22523`,
  "September 22, 2026; read September 22, 2026",
);
const bvtSep15 = record(
  "Beaverton City Council · September 15, 2026 agenda packet (Agenda Bill 26154: city manager recruitment; May 5, 2026 minutes)",
  `${BVT_DOC}/22310`,
  "September 15, 2026; read September 22, 2026",
);
const bvtShelter = record(
  "City of Beaverton · The Beaverton Shelter",
  "https://beavertonoregon.gov/the-beaverton-shelter",
  "City page; read September 22, 2026",
);
const vtKocher = reporting(
  "Beaverton Valley Times · Evelyn Kocher seeks Beaverton City Council Position 1 seat",
  "https://beavertonvalleytimes.com/2026/04/16/evelyn-kocher-seeks-beaverton-city-council-position-1-seat/",
  "April 16, 2026; read September 22, 2026",
  "Reported statement; quote as printed by the Beaverton Valley Times.",
);
const philipAbout = site("Philip · about Rachel", "https://www.rachelforbeaverton.com/about-rachel");
const philipSurvey = site(
  "Philip · Ballotpedia Candidate Connection survey (her own answers)",
  "https://ballotpedia.org/Rachel_Philip_(Beaverton_City_Council_Position_1,_Oregon,_candidate_2026)",
);

const beavertonTopics: ExtraTopic[] = [
  {
    id: "beaverton-utility-fees",
    label: "Utility-bill fees",
    short: "New fees",
    question: "Keep the new $14.50-a-month general-services and street fees on utility bills, or repeal them or send them to voters?",
    context:
      "On July 7, 2026 the council adopted a $9.50-a-month general services fee rising 8% a year (about $5.3 million a year for the general fund, 6–1) and a street maintenance fee starting at $5 a month and rising $5 a year for three years (7–0), both billed from August 1; staff’s alternative was cutting 22–40 positions. The rate resolutions can be changed by future councils, and the city’s permanent tax rate is already at its $4.6180 maximum.",
  },
  {
    id: "beaverton-levy-or-cuts",
    label: "Levy or cuts",
    short: "Safety levy",
    question: "Refer a $0.40-per-$1,000 public-safety levy in May 2027, cut $1.8 million more from services, or both?",
    context:
      "The FY 2026–27 budget closed a $16.2 million general-fund gap with $13.5 million in new revenue, $2.7 million in cuts and $2.5 million one-time; in February 2026 the council delayed a $0.40 levy (about $5.3 million a year, 42% support in polling) to May 2027. On September 8, 2026 staff previewed a $6–9 million deficit for FY 2027–28 and two $1.8 million cut packages: the mediation center and downpayment aid, or police victim services and five officers.",
  },
  {
    id: "beaverton-flock-ban",
    label: "Flock camera ban",
    short: "Flock ban",
    question: "Adopt an ordinance banning Flock-style license-plate readers in Beaverton?",
    context:
      "No council item exists. Beaverton police told The Oregonian in November 2025 they do not use Flock, while the Washington County Sheriff runs seven Flock cameras bought with a $396,000 grant; a resident asked the council for a surveillance policy January 20, 2026. Oregon’s SB 1516, signed March 31, 2026, limits plate-reader data retention to 30 days statewide.",
  },
  {
    id: "beaverton-ice-response",
    label: "ICE response",
    short: "ICE response",
    question: "Go further than the July 2026 sanctuary resolution: bar ICE staging on city property, publish a log, let police stop federal vehicles?",
    context:
      "Ordinance 4877 codified the Sanctuary Promise on January 20, 2026, 7–0; the same night an amendment package letting police pull over federal vehicles, publishing a monthly log and referring excessive force failed 2–5 and a subcommittee was formed. On July 7, 2026 Resolution 4967 set identity checks of suspected impersonators and body-camera rules; the mayor called it “not final work.”",
  },
  {
    id: "beaverton-loop",
    label: "Downtown Loop",
    short: "The Loop",
    question: "Keep funding the downtown Loop, including a $20 million federal grant bid in 2027, and put the agency’s Beaverdam sites out to developers?",
    context:
      "The Hall Boulevard 1st-to-3rd segment is estimated at $11.6 million with $5.6 million in federal earmarks and bids in December 2026; BUILD grant applications lost in 2025 and 2026, so the city must decide on a $20 million request in 2027 with a $13 million county match. The redevelopment agency closed on 12775 SW Beaverdam Road (5.38 acres) on August 31, 2026 and was told to seek a developer by year’s end.",
  },
  {
    id: "beaverton-transportation-plan",
    label: "Transportation priorities",
    short: "TSP",
    question: "What should the 20-year Transportation System Plan fund first, and how do South Cooper Mountain residents get transit?",
    context:
      "The council reviewed draft plan policies July 7, 2026; investment scenarios come in December 2026 and adoption in December 2027. On February 3, 2026 it adopted an $11,800 supplemental transportation charge per new Cooper Mountain house, and an on-demand SPOT bus for South Cooper Mountain launched January 29, 2026 with county and state money through the 2027 school year; the nearest TriMet stop to Mountainside High is about two miles away.",
  },
];

const beavertonStances: TopicStance[] = [
  /* ── Evelyn Kocher ─────────────────────────────────────────────── */
  stance("evelyn-kocher", "beaverton-utility-fees", "opposes", "Voters decide, not fees",
    "Says raising taxes as a flat fee is inequitable and “undemocratic–and un-Oregonian,” and that if politicians want to raise taxes “they have to put it up to a vote”; testified May 5, 2026 on the proposed transportation fee.",
    kocherPriorities),
  stance("evelyn-kocher", "beaverton-levy-or-cuts", "partial", "Public vote, corporate reform",
    "Wants every new tax proposal voted on by the people and corporate tax reform so big business pays more for infrastructure; whether she would back the May 2027 levy or which cut package she would accept is unsaid.",
    pamphlet(9)),
  stance("evelyn-kocher", "beaverton-flock-ban", "supports", "Ordinance banning Flock",
    "Would introduce an ordinance mirroring Woodburn’s and Eugene’s to ban Flock from operating in the city, calling the cameras data-harvesting.",
    kocherPriorities),
  stance("evelyn-kocher", "beaverton-ice-response", "supports", "Log calls, film ICE",
    "Told the Valley Times she wants 911 calls about enforcement tracked and labeled and officers sent to film interactions, and would codify protections in local ordinance; testified for the sanctuary ordinance and amendments January 20, 2026.",
    vtKocher),
  stance("evelyn-kocher", "beaverton-loop", "partial", "Prioritize the Loop",
    "Would prioritize projects in progress such as the Beaverton Loop and the TV Highway redevelopment, with transit-oriented density downtown; the Beaverdam developer solicitation and the 2027 BUILD bid are unsaid.",
    kocherPriorities),
  stance("evelyn-kocher", "beaverton-transportation-plan", "partial", "Buses for Cooper Mountain",
    "Would expand bus lines in South Cooper Mountain and wants to “build our MAX stations” so everyone can live in walkable neighborhoods; which plan projects come first is unsaid.",
    pamphlet(9)),

  /* ── Rachel Philip ─────────────────────────────────────────────── */
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("rachel-philip", "beaverton-ice-response", "partial", "Defend from overreach",
    "Would defend the city from federal overreach and keep local resources focused on protecting neighbors and services; the staging ban, public log and traffic stops are unsaid.",
    pamphlet(9)),
  stance("rachel-philip", "beaverton-loop", "partial", "Walkable downtown crossings",
    "On the Loop’s community advisory committee she pushed to improve the downtown walking experience, citing the difficulty of crossing Farmington and Canyon with children; the Beaverdam solicitation and the BUILD bid are unsaid.",
    philipAbout),
  stance("rachel-philip", "beaverton-transportation-plan", "partial", "Safety first, slower streets",
    "Says the city is about to set 20-year transportation priorities and wants that plan to put safety first, slowing traffic near schools and parks; South Cooper Mountain transit is unsaid.",
    philipSurvey),
];

const beavertonStakes: RaceStakes[] = [
  {
    raceId: "beaverton-position-1",
    intro:
      "A Beaverton councilor is one of six votes beside the mayor on the budget, on the fees the council now bills through utility accounts, on whether to send a public-safety levy to voters, on police policy toward federal agents and cameras, and on the redevelopment agency’s downtown projects. The FY 2026–27 budget is $514,218,807; the term opens with a structural general-fund gap, a levy decision due by May 2027 and a city manager to hire.",
    items: [
      {
        label: "Structural gap",
        text:
          "FY 2026–27 closed a $16.2 million general-fund gap with $13.5 million in new revenue, $2.7 million in cuts (6.6 positions) and $2.5 million one-time; staff’s September 8, 2026 preview puts the FY 2027–28 deficit at $6–9 million and lists $1.8 million cut packages. Since 2022 the city has cut $11 million and 42 positions, including police officers, the bike team and crisis response.",
        source: bvtSep8,
      },
      {
        label: "$514 million budget",
        text:
          "Resolution 4957 adopted the FY 2026–27 budget at $514,218,807 on June 16, 2026 with the tax levy at the $4.6180 permanent rate, the maximum; the general fund is $124.3 million with 333.72 positions, down from 340.15 the year before.",
        source: bvtJun16,
      },
      {
        label: "Fees and a levy",
        text:
          "The general services fee ($9.50 a month, rising 8% a year) is budgeted at about $5.3 million and the street fee at about $3.3 million in its first year; on February 3, 2026 the council supported delaying a $0.40-per-$1,000 public-safety levy, projected at $5.3 million a year, from May 2026 to May 2027 after polling “does not show support” for a May 2026 vote.",
        source: bvtJul7,
      },
      {
        label: "Downtown Loop",
        text:
          "Hall Boulevard from 1st to 3rd is estimated at $11.6 million with $5.6 million in federal earmarks and construction in 2027; the promenade planning project is $2.67 million with $2 million federal; after losing BUILD grants in 2025 and 2026, the city must decide whether to ask for $20 million in 2027 with a $13 million county match.",
        source: bvtBura,
      },
      {
        label: "The shelter",
        text:
          "The Beaverton Shelter at 11390 SW Beaverton-Hillsdale Highway has 60 beds and opened in November 2024, built with about $4.8 million in regional supportive-housing money and $9 million in state and federal funds; operations are paid by Metro’s supportive housing tax through Washington County, not the city general fund.",
        source: bvtShelter,
      },
      {
        label: "City manager to hire",
        text:
          "The council adopted a city-manager recruitment process on September 15, 2026 (Resolution 4971) with Elizabeth Coffey serving as interim; the winner of this seat will join a council choosing the administrator who writes the FY 2027–28 budget.",
        source: bvtSep15,
      },
    ],
  },
];

/* Hillsboro: council packets on CivicWeb (which carry the approved minutes), the city’s data-center page and the Hillsboro News-Times */
const HB_DOC = "https://hillsboro-oregon.civicweb.net/document";
const hbSep1 = record(
  "Hillsboro City Council · September 1, 2026 agenda packet (approved minutes of June 23, July 7, July 21 and July 27, 2026)",
  `${HB_DOC}/263233/City%20Council%20-%2001%20Sep%202026.pdf?handle=5718828DA0784DE4AF2E7E9D192013E3`,
  "September 1, 2026; read September 22, 2026",
  "July 27: Resolution 2932 (data-center moratorium) carried 6–0. July 7: Ordinance 6519 and Order 33 (Synopsys East) carried 4–2, Alcaire and Salgado no; Order 35 initiating the data-storage code amendment 6–0. June 23: Ordinance 6518 carried 4–1; Resolution 2923 (solid-waste rates) 6–0.",
);
const hbTestimony: Evidence = {
  label: "Hillsboro City Council · approved minutes of June 23 and July 27, 2026 (public testimony summaries), in the September 1, 2026 packet",
  url: `${HB_DOC}/263233/City%20Council%20-%2001%20Sep%202026.pdf?handle=5718828DA0784DE4AF2E7E9D192013E3`,
  kind: "Candidate statement",
  date: "June 23 and July 27, 2026; read September 22, 2026",
  note: "The candidate’s own testimony to the council, as summarized in the approved minutes.",
};
const hbJul27 = record(
  "Hillsboro City Council · July 27, 2026 special meeting packet (Resolution 2932 and the data-center inventory)",
  `${HB_DOC}/262111/City%20Council%20Special%20Meeting%20-%2027%20Jul%202026.pdf?handle=24C9E75157324A69B363BB7B1252D317`,
  "July 27, 2026; read September 22, 2026",
  "Inventory as of July 21, 2026: 23 data-center sites on about 570 acres, 16 built on 346 acres; the moratorium must be reviewed within 120 days.",
);
const hbJul21 = record(
  "Hillsboro City Council · July 21, 2026 agenda packet (June 9, 2026 work-session minutes on enterprise-zone policy)",
  `${HB_DOC}/261816/City%20Council%20-%2021%20Jul%202026.pdf?handle=BE2874B9337342C89DB963EFEA432535`,
  "July 21, 2026; read September 22, 2026",
  "Staff: the Enterprise Zone fund balance had grown to about $55 million.",
);
const hbFeb3 = record(
  "Hillsboro City Council · February 3, 2026 agenda packet (January 20, 2026 work-session minutes on a Human Rights Office)",
  `${HB_DOC}/256303/City%20Council%20-%2003%20Feb%202026.pdf?handle=36759EE862DB4E29AEA9C3550A076239`,
  "February 3, 2026; read September 22, 2026",
  "Estimated annual cost $321,000–$553,000; “Councilors Salgado and Sinclair strongly supported creating the HRO,” others favored a phased approach starting with an advisory committee.",
);
const hbOct6 = record(
  "Hillsboro City Council · October 6, 2026 agenda packet (Planning Commission minutes of May 27, 2026 on DR-044-25, Sky Harbour hangars)",
  `${HB_DOC}/263202/City%20Council%20-%2006%20Oct%202026.pdf?handle=17CB86AA13134C009338773C1DEB5F97`,
  "Posted September 2026; read September 22, 2026",
  "The commission approved 5–0 with Jackson abstaining; the item is marked withdrawn on the October 6 agenda.",
);
const hbJun2025 = record(
  "Hillsboro City Council · June 17, 2025 agenda packet (Ordinance 6503, police headquarters borrowing)",
  `${HB_DOC}/249562/City%20Council%20-%2017%20Jun%202025.pdf?handle=0AF9CECBDEED4D5287C5E7FEB5C97670`,
  "June 17, 2025; read September 22, 2026",
);
const hbJun16 = record(
  "Hillsboro City Council · June 16, 2026 agenda packet (Ordinance 6520, supplemental budget staff report)",
  `${HB_DOC}/260655/City%20Council%20-%2016%20Jun%202026.pdf?handle=A97384567AA34F81B341B86B146B448C`,
  "June 16, 2026; adopted June 23, 2026, 6–0; read September 22, 2026",
  "Revised 2025–27 budget excluding the economic-development council funds: $1,851,790,204 plus $25,419,230, for $1,877,209,434.",
);
const hbDataCenters = record(
  "City of Hillsboro · Data centers in Hillsboro (moratorium status, tax and water facts)",
  "https://www.hillsboro-oregon.gov/community/data-centers",
  "Updated September 10, 2026; read in a browser September 22, 2026",
  "12 abated data-center entities held about $7.2 billion of exempt real market value in 2025 and paid about $61.1 million in taxes; data centers used about 111 million gallons, 1.76% of the city’s water, in 2025.",
);
const hbBudget = record(
  "City of Hillsboro · 2025–2027 Adopted Biennial Budget, p. 51: total city requirements $1,946,850,001",
  "https://www.hillsboro-oregon.gov/home/showpublisheddocument/31919/639102077343430000",
  "Adopted June 17, 2025; document checked September 21, 2026",
);
const ntShelter = reporting(
  "Hillsboro News-Times · Hillsboro opens doors to first year-round shelter",
  "https://hillsboronewstimes.com/2025/11/14/hillsboro-opens-doors-to-first-year-round-shelter/",
  "November 14, 2025; read September 22, 2026",
);

const hillsboroTopics: ExtraTopic[] = [
  {
    id: "hillsboro-dc-moratorium",
    label: "Data-center moratorium",
    short: "Moratorium",
    question: "Adopt the new data-center zoning limits on October 6 and extend the 120-day moratorium past November 24?",
    context:
      "On July 27, 2026 the council adopted Resolution 2932, a 120-day moratorium on new or expanded data-center and battery-storage applications, 6–0; it must be reviewed by November 24. The city counts 23 data-center sites on about 570 acres, 16 of them built. On September 9 the Planning Commission approved a code amendment limiting data centers to two industrial zones and 1,000 feet from schools and capping accessory data centers at 25% of a site; the council hearing is October 6.",
  },
  {
    id: "hillsboro-dc-tax-breaks",
    label: "Data-center tax breaks",
    short: "Abatements",
    question: "Raise the fees data centers pay on abated taxes and set stricter terms on new abatements?",
    context:
      "The council sets the enterprise-zone community service fee (up to 33% of abated tax in years one to three, 50% in years four and five) and, with the school district, the 15% school support fee. Twelve abated data-center companies held about $7.2 billion of exempt property value in 2025 and still paid about $61.1 million in taxes; the enterprise-zone fund holds about $55 million. On July 21, 2026 the council paused new Strategic Investment Program deals with stand-alone data centers for 180 days, 4–0, a month after a lawsuit over 17 applications.",
  },
  {
    id: "hillsboro-utility-fees",
    label: "Utility fees",
    short: "Utility fees",
    question: "Raise the transportation utility fee to $11.64 a month and sewer and stormwater rates about 5% from January 1?",
    context:
      "On July 21, 2026 staff recommended raising the transportation utility fee to $11.64 a month for a home: the pavement program needs about $8.5 million a year and revenue allows about $4.5 million. On July 7 staff proposed roughly 5% sewer and stormwater increases, about $4.18 a month in the first year. Hearings are set for November with new rates January 1, 2027; drinking-water rates are set separately by the Utilities Commission, which is weighing 4–4.5% for 2027.",
  },
  {
    id: "hillsboro-human-rights-office",
    label: "Human Rights Office",
    short: "Rights office",
    question: "Fund a Human Rights Office ($321,000–$553,000 a year) and more legal aid on top of the sanctuary ordinance?",
    context:
      "The council declared a local emergency over federal immigration enforcement November 18, 2025 (5–0) and codified the Sanctuary Promise Act as Ordinance 6513 on March 3, 2026 (6–0). On January 20, 2026 staff costed a Human Rights Office at $321,000–$553,000 a year; the council chose to form a community advisory committee first and lists the office as “to be revisited.” The June 23 supplemental budget carried $726,000 for immigration-response programs already approved.",
  },
  {
    id: "hillsboro-housing-displacement",
    label: "Housing and displacement",
    short: "Displacement",
    question: "Add local tenant protections and a downtown anti-displacement strategy, or focus on loosening rules to build more?",
    context:
      "On June 23, 2026 the council updated its code to match new state housing-application laws, 4–1; on July 7 it redesignated 4.54 industrial acres (Synopsys East) for medium-density housing, 4–2. On August 18 staff presented the draft Avenida Diez equitable development strategy for the downtown urban-renewal area, 20 actions including a preference policy for long-time renters and tailored tax exemptions; adoption is pending, and the 398-home SoHi Central subdivision is before the council.",
  },
  {
    id: "hillsboro-jet-hangars",
    label: "Private-jet hangars",
    short: "Jet hangars",
    question: "Approve Sky Harbour’s seven private-jet hangars at the airport when it refiles?",
    context:
      "The Planning Commission approved seven hangars (about 189,000 square feet on 13.7 acres, room for about 30 jets) on May 27, 2026, 5–0 with one abstention. Two appeals brought the case to the council on August 18 with a decision set for October 6, until Sky Harbour withdrew on September 9 saying it needs time to address comments and plans to resubmit; a refiling restarts review before the next council.",
  },
];

const hillsboroStances: TopicStance[] = [
  /* ── Cristian Salgado (sitting Ward 1 councilor, appointed January 2025; the record first) ── */
  stance("cristian-salgado", "hillsboro-dc-moratorium", "partial", "Voted for moratorium",
    "Voted yes July 27, 2026 on Resolution 2932, calling the moratorium a needed pause to develop structure and understanding, and yes July 7 to start the data-storage code amendment; extending the moratorium past November 24 is unsaid.",
    hbSep1),
  stance("cristian-salgado", "hillsboro-dc-tax-breaks", "partial", "Categories by impact",
    "At the June 9, 2026 work session raised concerns that phased abatements advantage companies already in Hillsboro and asked for data-center categories by size and environmental impact; was excused from the July 21 vote pausing new agreements. Fee levels unsaid.",
    hbJul21),
  stance("cristian-salgado", "hillsboro-utility-fees", "partial", "Who pays, affordability",
    "Voted yes June 23, 2026 on the 5.1% solid-waste increase; at the July 7 session asked about commercial, industrial and data-center customers and who pays for infrastructure; excused from the July 21 transportation-fee session. Names utility affordability in his statement.",
    hbSep1),
  stance("cristian-salgado", "hillsboro-human-rights-office", "supports", "Strongly backed the office",
    "Strongly supported creating the Human Rights Office at the January 20, 2026 work session, voted for the emergency declaration November 18, 2025, the sanctuary ordinance March 3, 2026 and the June 23 supplemental budget with $726,000 for immigration response.",
    hbFeb3),
  stance("cristian-salgado", "hillsboro-housing-displacement", "mixed", "Yes code, no rezone",
    "Voted yes June 23, 2026 on the state-conformance housing code (4–1) and no July 7 on redesignating 4.54 industrial acres at Synopsys East for housing (4–2); the minutes record no reason, and tenant protections are unsaid.",
    hbSep1),

  /* ── Kimberly Culbertson ───────────────────────────────────────── */
  stance("kimberly-culbertson", "hillsboro-dc-moratorium", "supports", "Longer moratoria",
    "Told the council July 27, 2026 she supported the moratorium but that 120 days is insufficient, calling for multiple consecutive moratoria to study the impacts properly.",
    hbTestimony),

  /* ── Karim Delgado ─────────────────────────────────────────────── */
  stance("karim-delgado", "hillsboro-dc-moratorium", "partial", "Backed the moratorium",
    "Testified July 27, 2026 in support of the moratorium, arguing Hillsboro is overly dependent on one industry; on June 23 criticized enterprise-zone tax breaks. Extension past November 24 is unsaid.",
    hbTestimony),
  stance("karim-delgado", "hillsboro-dc-tax-breaks", "supports", "School fee toward 30%",
    "Would move the school support fee from the 15% floor toward 30% and raise the community service fee ceiling on new abatements, require job and wage disclosure and a council briefing before any subsidy, and claw back unmet commitments.",
    delgadoIssues),
  stance("karim-delgado", "hillsboro-utility-fees", "partial", "Data-center power class",
    "Would have the city study a data-center electricity class within its franchise fee so the load it zoned pays; the transportation-fee and sewer proposals are unsaid.",
    delgadoIssues),
  stance("karim-delgado", "hillsboro-human-rights-office", "supports", "Establish the office",
    "Would fund legal and emergency aid, enforce the sanctuary law and establish a Human Rights Office, finishing what he says the council tabled in January 2026.",
    pamphlet(17)),
  stance("karim-delgado", "hillsboro-housing-displacement", "supports", "Notice, counsel, land trusts",
    "Would push mandatory notice before rent increases, a right to counsel in eviction court, anti-displacement protections and community land trusts, and tie public support for business to housing people can afford.",
    delgadoIssues),

  /* ── Luis Garcia ───────────────────────────────────────────────── */
  stance("luis-garcia", "hillsboro-dc-moratorium", "partial", "Farmland over data centers",
    "Would protect farmland from the impacts of semiconductors and data centers and make decisions on science and data; the moratorium and the October code amendment are unsaid.",
    pamphlet(15)),

  /* ── Diana Jackson (Planning Commission member) ────────────────── */
  stance("diana-jackson", "hillsboro-dc-moratorium", "partial", "Concern near schools",
    "Told the council June 23, 2026 she questioned whether proposed data centers support local economic goals and worried about data centers near schools, asking what protections the city will adopt; the moratorium’s extension is unsaid.",
    hbTestimony),
  stance("diana-jackson", "hillsboro-dc-tax-breaks", "supports", "No data-center breaks",
    "Says the city should grow small businesses rather than give tax breaks to data centers, and that being singularly focused on one industry is detrimental.",
    pamphlet(16)),
  stance("diana-jackson", "hillsboro-human-rights-office", "partial", "ICE out, continue work",
    "Says “ICE out of Hillsboro” and would continue the work Councilor Sinclair started to protect vulnerable neighbors; the Human Rights Office and its cost are unsaid.",
    jacksonPlatform),
  stance("diana-jackson", "hillsboro-housing-displacement", "partial", "Build up downtown",
    "Says Hillsboro cannot keep building out and should build up its downtown corridor with workforce housing tied to small-business support; tenant protections and the Avenida Diez preference policy are unsaid.",
    jacksonPlatform),
  stance("diana-jackson", "hillsboro-jet-hangars", "partial", "Abstained, neighbor concerns",
    "Abstained on the hangars May 27, 2026 as a planning commissioner, citing uncertainty about one approval criterion and saying 3,800 added operations a year seemed like a lot for nearby residents; how she would vote on a refiling is unsaid.",
    hbOct6),

  /* ── Sarah Marugg ──────────────────────────────────────────────── */
  stance("sarah-marugg", "hillsboro-dc-moratorium", "supports", "Stop the buildout",
    "Says Hillsboro should not continue expanding data centers at the expense of land, water, power, neighborhoods and quality of life, with strict oversight and wastewater testing for permitted facilities.",
    maruggHome),
  stance("sarah-marugg", "hillsboro-dc-tax-breaks", "partial", "Pay fair share",
    "Would make data centers pay their fair share for the infrastructure and services they use and hold major polluters accountable; abatement fees and terms are unsaid.",
    pamphlet(16)),
  stance("sarah-marugg", "hillsboro-utility-fees", "partial", "Utility bills count",
    "Says affordability includes the utility bills families pay every month; the transportation-fee and sewer proposals are unsaid.",
    pamphlet(16)),
  stance("sarah-marugg", "hillsboro-human-rights-office", "partial", "Civil rights, sanctuary",
    "Would defend civil rights and uphold Hillsboro’s sanctuary-city values; the Human Rights Office and legal-aid funding are unsaid.",
    pamphlet(16)),
  stance("sarah-marugg", "hillsboro-jet-hangars", "opposes", "No luxury jet hub",
    "Opposes turning Hillsboro into a luxury private-jet hub at the expense of nearby neighborhoods, clean air, quiet open spaces, wetlands and wildlife.",
    maruggHome),

  /* ── Ivette Pantoja ────────────────────────────────────────────── */
  stance("ivette-pantoja", "hillsboro-housing-displacement", "partial", "Missing-middle to multifamily",
    "Wants balanced development from missing-middle to multifamily housing matched to neighborhood infrastructure so residents are not priced out; tenant protections and the downtown strategy are unsaid.",
    pantojaPriorities),

  /* ── Dorian Russell ────────────────────────────────────────────── */
  stance("dorian-russell", "hillsboro-dc-moratorium", "partial", "Expansion harms air, water",
    "Says unchecked data-center expansion makes the rich richer at the expense of air, water, land and jobs; the moratorium’s extension and the October code amendment are unsaid.",
    pamphlet(18)),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("dorian-russell", "hillsboro-human-rights-office", "partial", "Resist ICE actions",
    "Says local governments must follow community priorities rather than what they call illegal ICE kidnappings and unconstitutional executive orders; the Human Rights Office is unsaid.",
    pamphlet(18)),
  stance("dorian-russell", "hillsboro-housing-displacement", "partial", "Prevent evictions, gentrification",
    "Wants safe, stable housing with public and private efforts to prevent gentrification and evictions; the specific tenant rules and the Avenida Diez strategy are unsaid.",
    russellIssues),

  /* ── Titonian Wallace Sr. ──────────────────────────────────────── */
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("titonian-wallace-sr", "hillsboro-housing-displacement", "mixed", "Supply and stability",
    "Says Hillsboro needs more housing supply and would remove barriers that slow production, but growth must deliver affordability, stability and protection from displacement for renters and owners alike.",
    wallacePriorities),
];

const HILLSBORO_INTRO = (ward: string) =>
  `Hillsboro’s Ward ${ward} councilor is one of six votes beside the mayor on the two-year budget ($1.95 billion for 2025–27), the enterprise-zone fees data centers pay, the moratorium and zoning that govern where they go, utility fees, the sanctuary ordinance’s follow-through and downtown housing rules. The term opens with the moratorium up for review in November, an October zoning hearing, fee hearings in November and a $90 million police headquarters under construction.`;
const hillsboroItems: RaceStakes["items"] = [
  {
    label: "$1.95 billion biennium",
    text:
      "The 2025–27 adopted budget totals $1,946,850,001 for two years across the city’s funds; the next council writes the 2027–29 budget in spring 2027, with the enterprise-zone and Strategic Investment Program funds that data-center agreements feed among its largest discretionary sources.",
    source: hbBudget,
  },
  {
    label: "Intel abatement windfall",
    text:
      "The June 23, 2026 supplemental budget added $25.4 million, including $10.2 million in unexpected property tax as Intel’s 2005 abatement expired; $9.5 million of it went to a Strategic Investment Program reserve and $726,000 to immigration-response programs the council had approved without budgeting.",
    source: hbJun16,
  },
  {
    label: "Data-center tax base",
    text:
      "Twelve abated data-center companies held about $7.2 billion in exempt property value in 2025 and still paid about $61.1 million in taxes; 33 of the city’s 50 enterprise-zone agreements are data-center sites, the enterprise-zone fund holds about $55 million, and data centers used 111 million gallons of water in 2025, 1.76% of the city’s total.",
    source: hbDataCenters,
  },
  {
    label: "Moratorium clock",
    text:
      "Resolution 2932 (July 27, 2026, 6–0) bars new or expanded data-center and battery-storage applications for 120 days and must be reviewed for extension or repeal by November 24; the city counts 23 data-center sites on about 570 acres, and the governor’s task-force report is due in October.",
    source: hbJul27,
  },
  {
    label: "$90 million police HQ",
    text:
      "A new police headquarters consolidating the East and West precincts is estimated at about $90 million; in June 2025 the council raised its authorized full-faith-and-credit borrowing from $70 million to $95 million (Ordinance 6503), with debt service paid from the Strategic Investment Program fund rather than the general fund.",
    source: hbJun2025,
  },
  {
    label: "Streets short $4 million",
    text:
      "The pavement program needs about $8.5 million a year but the transportation utility fee yields about $4.5 million, and transportation spending outruns revenue by about $2 million a year; staff recommend raising the fee to $11.64 a month for a home, with a public hearing in November and new rates January 1, 2027.",
    source: hbSep1,
  },
  {
    label: "First year-round shelter",
    text:
      "The city’s first year-round shelter at 345 SW 17th Avenue opened November 14, 2025 with 75 sleeping spaces (35 congregate beds and 40 pods), built for $17 million including $8.3 million of Metro supportive-housing money through the county and run by Project Homeless Connect.",
    source: ntShelter,
  },
];
const hillsboroStakes: RaceStakes[] = [
  { raceId: "hillsboro-ward-1", intro: HILLSBORO_INTRO("1"), items: hillsboroItems },
  { raceId: "hillsboro-ward-2", intro: HILLSBORO_INTRO("2"), items: hillsboroItems },
  { raceId: "hillsboro-ward-3", intro: HILLSBORO_INTRO("3"), items: hillsboroItems },
];

/* Tigard: staff memos and minutes on the city's Destiny Hosted meeting portal, the county's certified results, Tigard Life and the Valley Times */
const TG_MEMO = (seq: number) => `https://public.destinyhosted.com/agenda_publish.cfm?dsp=agm&seq=${seq}&rev=0&id=84427&form_type=AG_MEMO&mt=ALL`;
const tgFacility = record(
  "Tigard City Council · July 28, 2026 staff memo: facilities next steps after Measure 34-349",
  TG_MEMO(6203),
  "July 28, 2026; read September 22, 2026",
  "The 9.5-acre Wall Street site “will not be large enough to accommodate two separate Public Works and Police facilities”; public works could be built with revenue bonds (council rate decision July 2027, construction by August 2029); a $0.32-per-$1,000 bond “could raise $48M”; the police levy must be renewed by the end of 2029; evidence storage is about 160 square feet against roughly 4,500 needed.",
);
const tgMinFeb17 = record(
  "Tigard City Council · minutes, February 17, 2026 (Resolution 26-08 referring the $150 million public-safety bond)",
  "https://public.destinyhosted.com/tigardocs/2026/CCBSNS/20260324_2626/6124%5F260217%5FMeeting%5FMinutes%5F%2D%5FDraft%2Epdf",
  "February 17, 2026; read September 22, 2026",
  "Passed unanimously: Robbins, Schlack, Shaw, Wolf, Anderson, Ghoddusi and Hu all yes.",
);
const tgMinJun9 = record(
  "Tigard City Council · minutes, June 9, 2026 (Resolution 26-22 adopting the FY 2026–27 budget)",
  "https://public.destinyhosted.com/tigardocs/2026/CCBSNS/20260811_2700/6264%5F260609%5FMeeting%5FMinutes%5F%2D%5FDraft%2Epdf",
  "June 9, 2026; read September 22, 2026",
  "Passed 5–1: Schlack, Shaw, Wolf, Robbins and Hu yes; Ghoddusi no; Anderson absent. The mayor said the budget preserves library hours “while responding to a General Fund shortfall of more than $6M.”",
);
const tgParks = record(
  "Tigard City Council · April 21, 2026 staff memo: Parks Utility Fund outlook",
  TG_MEMO(6111),
  "April 21, 2026; read September 22, 2026",
  "“The fund’s forecast shows that it will go negative in FY28 under current revenue streams”; it needs about $1,000,000 more a year.",
);
const tgSdc = record(
  "Tigard City Council · September 1, 2026 staff memo: River Terrace 2.0 and citywide system development charge policy",
  TG_MEMO(6230),
  "September 1, 2026; read September 22, 2026",
);
const tgPolice = record(
  "Tigard City Council · September 22, 2026 staff memo: police levy and levels of service report",
  TG_MEMO(6277),
  "September 22, 2026; read September 22, 2026",
  "42,461 calls for service in 2025, up 20.2% in five years; the levy renewed in May 2024 funds 11.0 positions.",
);
const tgBudget = record(
  "City of Tigard · Adopted Budget FY 2026–27 (budget book), Budget in Brief and General Fund forecast",
  "https://tigard-or.openbook.questica.com/#/budget-book/FY2027ADOPTED",
  "Adopted June 9, 2026; read September 22, 2026",
  "Total requirements $471,938,721; general-fund reserves of about $30.9 million (67% of operating) forecast to fall to about $23.6 million by FY 2031 as revenue grows 2.5% a year against 4% expense growth.",
);
const tlHu = reporting(
  "Tigard Life · Mayor Hu: “They are just like my neighbors”",
  "https://tigardlife.com/featured/mayor-hu-they-are-just-like-my-neighbors/",
  "July 8, 2026; read September 22, 2026",
  "Reported statement; quote as printed by Tigard Life.",
);
const tlParks = reporting(
  "Tigard Life · Council triages Tigard parks’ looming shortfall",
  "https://tigardlife.com/featured/council-triages-tigard-parks-looming-shortfall/",
  "April 29, 2026; read September 22, 2026",
  "Reported statement; quote as printed by Tigard Life.",
);
const tlField = reporting(
  "Tigard Life · Field of eight vies for three Tigard City Council seats (candidate questionnaire)",
  "https://tigardlife.com/local-news/field-of-eight-vies-for-three-tigard-city-council-seats/",
  "September 12, 2026; read September 22, 2026",
  "Reported statement; quote as printed by Tigard Life.",
);
const vtHu = reporting(
  "Valley Times · As Tigard’s first Asian American mayor, Yi-Kang Hu joins ranks of continuing diverse council",
  "https://valleytimes.news/2025/10/08/as-tigards-first-asian-american-mayor-yi-kang-hu-joins-ranks-of-continuing-diverse-council/",
  "October 8, 2025; read September 22, 2026",
);
const velasquezOpEd = site(
  "Velásquez · op-ed, “Plan ahead for the future of Tigard: approve public safety levy” (Valley Times)",
  "https://valleytimes.news/2026/04/20/opinion-plan-ahead-for-the-future-of-tigard-approve-public-safety-levy/",
  `${NOTE} His own op-ed, published April 20, 2026.`,
);
const monahanOpEd = site(
  "Monahan · op-ed, “Vote no on Tigard Measure 34-349, avoid a huge mistake” (Valley Times)",
  "https://valleytimes.news/2026/05/12/opinion-vote-no-on-tigard-measure-34-349-avoid-a-huge-mistake/",
  `${NOTE} His own op-ed, published May 12, 2026.`,
);
const andersonIssues = site("Anderson · on the issues", "https://www.tomandersontigard.com/issues");

const tigardTopics: ExtraTopic[] = [
  {
    id: "tigard-facility",
    label: "Police facility next",
    short: "Police facility",
    question: "After voters rejected the $150 million bond, build a public-works building first with rate-backed bonds and a smaller police bond later, or sell the Wall Street site?",
    context:
      "Measure 34-349, a $150 million bond at about $0.77 per $1,000 (about $263 a year on the average home), failed May 19, 2026, 62% to 38%. The city bought the 9.5-acre SW Wall Street site in 2024 for $13,950,848 from utility funds. On July 28, 2026 staff told the council the site cannot hold two separate buildings and proposed public works first, financed by utility-rate-backed bonds with a rate decision in July 2027, and a smaller police bond later; a $0.32 levy could raise $48 million. No measure was filed for November.",
  },
  {
    id: "tigard-budget-gap",
    label: "General-fund gap",
    short: "Budget gap",
    question: "Close a general-fund shortfall of more than $6 million by cutting library staff and city events and drawing reserves, or raise new revenue?",
    context:
      "Resolution 26-22 adopted the FY 2026–27 budget June 9, 2026, 5–1, balancing the general fund with a one-time draw on reserves of about $30.9 million that are forecast to fall to $23.6 million by 2031 as revenue grows 2.5% a year against 4% costs. The budget left two library positions unfunded (about $400,000) while preserving hours, cut positions 3% citywide, and ends city-run events such as the Fourth of July and Pride from 2027.",
  },
  {
    id: "tigard-parks-funding",
    label: "Parks funding",
    short: "Parks money",
    question: "Cover a $1 million-a-year parks shortfall by raising the parks fee, shifting general-fund money, or asking voters for a parks levy?",
    context:
      "On April 21, 2026 staff told the council the Parks Utility Fund goes negative in FY 2028 without about $1 million more a year, listing the parks and recreation fee, general-fund support or a parks operations and maintenance levy as options. The FY 2026–27 budget used the last $2.2 million of parks-bond balance, and the 2010 parks bond’s debt levy ends this year, dropping the city’s rate from $3.1361 to $2.8031.",
  },
  {
    id: "tigard-rt2-sdcs",
    label: "River Terrace charges",
    short: "SDCs",
    question: "Tier development charges by home size, discounting smaller and middle homes, for River Terrace 2.0 and citywide, with a decision October 13?",
    context:
      "On September 1, 2026 the council supported a tiered system-development-charge structure with a redistributed discount citywide and a flat option for apartments; dollar figures come October 13. River Terrace 2.0, up to 4,000 homes, is planned at an average of 18 units an acre with community-plan adoption targeted for May 2027, and the budget forecast counts on its development revenue.",
  },
  {
    id: "tigard-surveillance",
    label: "Police cameras",
    short: "Cameras",
    question: "Approve activating Axon’s Fusus live-camera network for police and expand red-light photo enforcement?",
    context:
      "On September 23, 2025 the council awarded Axon a $1,986,780 five-year contract for body cameras, tasers and evidence storage; activating the Fusus module, which lets police view live public and private camera feeds (about $100,000 a year from asset forfeiture), was conditioned on a later council vote that has not come. On September 8, 2026 police recommended expanding the three-intersection red-light program, which is $715,000 behind its revenue projections.",
  },
  {
    id: "tigard-camping-buffer",
    label: "Camping buffer",
    short: "Camping",
    question: "Expand the no-camping buffer around shelters and service sites from 500 to 1,000 feet and restrict vehicle camping?",
    context:
      "A public hearing set for September 22, 2026 takes up amendments to city code chapter 7.80, with staff recommending approval; the council tightened camping hours and sidewalk clearance in December 2025 and barred leaving camp materials on city property in April 2026. Washington County’s first homeless access center, run by Just Compassion, opened in Tigard in 2026.",
  },
];

const tigardStances: TopicStance[] = [
  /* ── Yi-Kang Hu (mayor; the record first) ──────────────────────── */
  stance("yi-kang-hu", "tigard-facility", "mixed", "Bond yes, now listen",
    "Voted February 17, 2026 to refer the $150 million bond; after its defeat told Tigard Life “I’m not going to support anything until we have a robust engagement process,” wanting a citizens committee and a plan for the existing buildings.",
    tlHu),
  stance("yi-kang-hu", "tigard-budget-gap", "supports", "Voted for budget",
    "Voted yes June 9, 2026 on Resolution 26-22, the budget, saying it focuses on core services and preserves library hours while responding to a general-fund shortfall of more than $6 million.",
    tgMinJun9),
  stance("yi-kang-hu", "tigard-parks-funding", "partial", "Levy later, maybe",
    "Said at the April 21, 2026 council work session, “Down the road, we may look at a levy for extra, but we’re not there yet”; a fee increase or general-fund shift is unsaid.",
    tlParks),

  /* ── Tom Anderson (appointed councilor; the record first) ──────── */
  stance("tom-anderson", "tigard-facility", "partial", "Voted to refer bond",
    "Voted February 17, 2026 to refer the $150 million bond and would improve facility conditions for police and emergency responders; what to build first, or whether to sell the site, is unsaid.",
    tgMinFeb17),
  stance("tom-anderson", "tigard-budget-gap", "partial", "Balanced budgeting",
    "Was absent for the June 9, 2026 budget vote; told Tigard Life he would protect essential city services through balanced budgeting. Which cuts or revenue he would choose is unsaid.",
    tlField),
  stance("tom-anderson", "tigard-parks-funding", "partial", "Sustainable parks funding",
    "Would maintain service levels and secure sustainable funding for parks, trails and ballfields; whether by fee, general fund or levy is unsaid.",
    andersonIssues),
  stance("tom-anderson", "tigard-rt2-sdcs", "partial", "Guide River Terrace",
    "Says he would guide the River Terrace 2.0 development; tiered development charges are unsaid.",
    tlField),

  /* ── Challengers, alphabetical ─────────────────────────────────── */
  stance("yousef-k-allouzi", "tigard-budget-gap", "opposes", "No library cuts",
    "Says the library and city events keep taking disproportionate budget cuts and that as a budget committee member he “voted no on these cuts to the library”; new revenue is unsaid.",
    allouziPriorities),
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("yousef-k-allouzi", "tigard-surveillance", "partial", "Against plate readers",
    "Says automated license-plate readers and ICE hunt residents and disregard due process; the Fusus camera network and photo enforcement are unsaid.",
    allouziPriorities),
  stance("jeff-darland", "tigard-rt2-sdcs", "partial", "Updated SDCs, no subsidy",
    "Would ensure development pays for itself through updated system development charges so existing ratepayers do not subsidize pipes, roads, water and sewer; discounts for smaller homes are unsaid.",
    tlField),
  stance("sue-garino", "tigard-budget-gap", "partial", "No one-time money",
    "Would limit the growth of taxes, fees and spending, stop using one-time money for ongoing programs and require measurable results from new spending; which cuts, and whether to draw reserves, are unsaid.",
    pamphlet(36)),
  stance("john-goodhouse", "tigard-budget-gap", "partial", "More private events",
    "Would support the process for more private events in Tigard to drive economic growth; the library cuts, the city’s own event cuts and new revenue are unsaid.",
    pamphlet(36)),
  stance("john-goodhouse", "tigard-rt2-sdcs", "partial", "Streamline for builders",
    "Would work with builders and city planning to streamline the process and make housing more affordable; tiered development charges are unsaid.",
    pamphlet(36)),
  stance("shawne-martinez", "tigard-rt2-sdcs", "partial", "Build up, not out",
    "Wants Tigard to build up rather than out, with infill housing and rezoning near existing services; charges for River Terrace 2.0 are unsaid.",
    martinezHome),
  stance("bill-monahan", "tigard-facility", "partial", "Separate sites, overpaid",
    "Wrote in May 2026 that “there is no need for placing both police and public works on the same site” and that the city “already overpaid for a site more suitable for commercial use”; whether to sell it is unsaid.",
    monahanOpEd),
  stance("bill-monahan", "tigard-budget-gap", "partial", "Restore library services",
    "Would restore and retain library services and focus on core services residents need and can afford; which cuts to reverse and any new revenue are unsaid.",
    monahanHome),
  stance("bill-monahan", "tigard-parks-funding", "partial", "Parkland outran funding",
    "Says the parks bond added parkland the city now recognizes cannot be maintained without more funds; a fee, general-fund shift or levy is unsaid.",
    monahanOpEd),
  stance("kate-ristau", "tigard-budget-gap", "partial", "Invest in library",
    "Would protect community services by investing in the library, recreation programs and child nutrition; the FY 2026–27 cuts and new revenue are unsaid.",
    pamphlet(39)),
  stance("kate-ristau", "tigard-parks-funding", "partial", "Invest in parks",
    "Would invest in parks, trails and public spaces; whether by fee, general fund or levy is unsaid.",
    pamphlet(39)),
  stance("kate-ristau", "tigard-rt2-sdcs", "partial", "Growth pays its way",
    "Wants smart land-use decisions from the Tigard Triangle to River Terrace 2.0 and new growth that pays its own way; tiered charges are unsaid.",
    tlField),
  stance("gabriel-elijio-velasquez", "tigard-facility", "partial", "Backed bond, new plan",
    "Wrote in April 2026 he would vote yes on the $150 million bond, calling it responsible and proactive; his site now calls for an alternative public-safety building plan with in-house evidence storage. Sequencing or selling the site is unsaid.",
    velasquezOpEd),
  stance("gabriel-elijio-velasquez", "tigard-camping-buffer", "partial", "Regional shelter strategy",
    "Would work with municipal, state and federal leaders on a single strategy so everyone has shelter and no one sleeps on Tigard’s streets; the 1,000-foot buffer and vehicle-camping rules are unsaid.",
    pamphlet(37)),
];

const tigardItems: RaceStakes["items"] = [
  {
    label: "Facilities after the bond",
    text:
      "Voters rejected the $150 million police and public-works bond 9,959 to 6,039 on May 19, 2026. The city already owns the 9.5-acre Wall Street site ($13,950,848, paid from utility funds); staff’s fallback is a public-works building financed by utility-rate bonds, with a rate decision in July 2027, and a smaller police bond later, while police evidence storage sits at about 160 square feet against roughly 4,500 needed.",
    source: tgFacility,
  },
  {
    label: "Reserves running down",
    text:
      "The FY 2026–27 budget of $471,938,721 is balanced in the general fund by a one-time draw on reserves of about $30.9 million (67% of operating costs), which the forecast takes to about $23.6 million by FY 2031 as revenue grows 2.5% a year against 4% for expenses; a moderate recession would cut revenue by about $2 million in a year.",
    source: tgBudget,
  },
  {
    label: "Levy renewal by 2029",
    text:
      "Police answered 42,461 calls for service in 2025, up 20.2% in five years. The $0.29-per-$1,000 police levy voters renewed in May 2024 funds 11 positions, eight of them patrol officers, and must go back to voters by the end of 2029, the same window in which the city would ask for any new facility bond.",
    source: tgPolice,
  },
  {
    label: "Parks fund goes negative",
    text:
      "The Parks Utility Fund is forecast to go negative in FY 2028 without about $1 million more a year; the options staff listed on April 21, 2026 are a higher parks and recreation fee, general-fund support or a parks operations and maintenance levy, and the last $2.2 million of parks-bond balance was spent in this year’s budget.",
    source: tgParks,
  },
  {
    label: "River Terrace 2.0",
    text:
      "Up to 4,000 homes are planned at an average of 18 units an acre; the council set housing policy direction September 1, 2026, decides system-development-charge tiers on October 13, and targets community-plan adoption in May 2027, with the budget forecast counting on the development revenue.",
    source: tgSdc,
  },
  {
    label: "Leadership turnover",
    text:
      "Mayor Heidi Lueb resigned in September 2025 after an investigation substantiated claims she bullied colleagues; the council appointed Yi-Kang Hu mayor 5–1 on October 7, 2025, then filled his council seat with Tom Anderson in December, and named a permanent city manager, Brian Rager, only in July 2026 after the previous manager left in November.",
    source: vtHu,
  },
];
const tigardStakes: RaceStakes[] = [
  {
    raceId: "tigard-mayor",
    intro:
      "Tigard’s mayor presides over a seven-member council that adopts the budget ($471,938,721 for FY 2026–27), sets utility and parks fees, refers bonds and levies to voters, writes the camping and development codes and directs the city manager. The next term must find a way to house police and public works after voters said no to $150 million, renew the police levy by 2029, and stop drawing down general-fund reserves.",
    items: tigardItems,
  },
  {
    raceId: "tigard-council",
    intro:
      "A Tigard councilor is one of six votes beside the mayor on the budget ($471,938,721 for FY 2026–27), utility and parks fees, bond and levy referrals, the camping and development codes and the city manager. Three seats are open at once, so the winners will decide together how to house police and public works after voters rejected $150 million, whether to renew the police levy by 2029, and how to stop drawing down general-fund reserves.",
    items: tigardItems,
  },
];

const topics: RaceTopics[] = [
  { raceIds: ["beaverton-position-1"], topics: beavertonTopics },
  { raceIds: ["hillsboro-ward-1", "hillsboro-ward-2", "hillsboro-ward-3"], topics: hillsboroTopics },
  { raceIds: ["tigard-mayor", "tigard-council"], topics: tigardTopics },
];
const topicStances: TopicStance[] = [...beavertonStances, ...hillsboroStances, ...tigardStances];
const stakes: RaceStakes[] = [...beavertonStakes, ...hillsboroStakes, ...tigardStakes];

export const pack: RacePack = {
  ...emptyPack(),
  analysis,
  lines,
  chips,
  deliveries,
  ownWords,
  contacts,
  roles,
  primary,
  ballots,
  districts,
  choice,
  topics,
  topicStances,
  stakes,
  portraits: portraits([
    ["evelyn-kocher", 9],
    ["rachel-philip", 9],
    ["luis-garcia", 15],
    ["diana-jackson", 16],
    ["sarah-marugg", 16],
    ["cristian-salgado", 15],
    ["karim-delgado", 17],
    ["ivette-pantoja", 17],
    ["dorian-russell", 18],
    ["titonian-wallace-sr", 18],
    ["yi-kang-hu", 35],
    ["bill-monahan", 35],
    ["yousef-k-allouzi", 38],
    ["tom-anderson", 38],
    ["jeff-darland", 37],
    ["sue-garino", 36],
    ["john-goodhouse", 36],
    ["kate-ristau", 39],
    ["gabriel-elijio-velasquez", 37],
  ]),
  // Culbertson: no statement for this seat anywhere. Martinez: no pamphlet statement, but his
  // campaign site states positions (captured above); the research object still carries `missing`.
  missing: { "kimberly-culbertson": "no-platform" },
  /** Research gap closed since September 18 by the candidate's own site; see the research log. */
  profiles: {
    "shawne-martinez": {
      background: "Tigard resident running on climate and active transportation, with a campaign site.",
      summary: "His site wants Tigard walkable, bikeable and denser near transit: infill housing and rezoning for energy-efficient homes near services, and fewer people driving alone on the way to net-zero emissions.",
      priorities: [
        "Infill housing and rezoning for dense, energy-efficient homes near transit and services.",
        "A more walkable and bikeable Tigard so fewer people drive alone.",
        "Net-zero emissions as soon as possible.",
      ],
      question: "Which areas would be rezoned first, and what would the changes cost the city?",
    },
  },
};
