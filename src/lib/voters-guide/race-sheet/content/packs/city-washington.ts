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
  type IssueLine,
  type PrimaryStatement,
  type RacePack,
  type RoleOverride,
  type StanceChip,
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
          "Wants data-center growth weighed against neighborhood and infrastructure impacts and utility affordability, with measurable community benefit and public transparency as conditions.",
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
          "Would tie project decisions to reliable needs and cost estimates, deliver affordable core services and restore transparency about the failed bond measure’s true cost.",
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
      safety: { position: "Would improve facility conditions for police and emergency responders.", source: pamphlet(38) },
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
  line("cristian-salgado", "money", "Wants data-center growth conditioned on utility affordability and measurable community benefit."),
  line("cristian-salgado", "climate", "Would invest in safe streets, sidewalks, crossings, parks and reliable services."),
  /* Hillsboro Ward 2 */
  line("karim-delgado", "housing", "Would require rent-increase notice, eviction right to counsel and community land trusts."),
  line("karim-delgado", "safety", "Would fund mobile crisis response, legal aid and a Human Rights Office."),
  line("karim-delgado", "money", "Opposes corporate tax holidays without housing, living wages or community benefit."),
  line("karim-delgado", "climate", "Would tie subsidies to environmental compliance and invest in transit."),
  line("ivette-pantoja", "housing", "Wants more affordable homes, from missing-middle to multifamily, to reduce family displacement."),
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
  line("bill-monahan", "safety", "Would pursue cheaper police-facility options while maintaining public-safety service levels."),
  line("bill-monahan", "money", "Would tie projects to reliable cost estimates and deliver affordable core services."),
  /* Tigard City Council */
  line("yousef-k-allouzi", "housing", "Wants multigenerational affordable housing, paths to ownership and rent controls."),
  line("yousef-k-allouzi", "safety", "Objects to license-plate readers and ICE actions that disregard residents’ due process."),
  line("yousef-k-allouzi", "money", "Opposes disproportionate budget cuts to the library and city events."),
  line("yousef-k-allouzi", "climate", "Wants trails and paths to schools and parks that avoid major roads."),
  line("tom-anderson", "housing", "Would encourage entry-level and middle housing to improve affordability."),
  line("tom-anderson", "safety", "Would improve facilities for police and emergency responders."),
  line("tom-anderson", "money", "Would fill vacant industrial space with workforce partners and fund parks sustainably."),
  line("tom-anderson", "climate", "Would seek state transfer of Hall Boulevard to Tigard with corridor upgrades."),
  line("jeff-darland", "housing", "Would use public land and community land trusts for permanently affordable homes."),
  line("jeff-darland", "money", "Would explain utility rates and debt plainly and make growth pay its share."),
  line("jeff-darland", "climate", "Wants growth delivering walkable neighborhoods, natural areas, safe streets and public spaces."),
  line("sue-garino", "housing", "Would expand workforce housing and accessible housing for older residents."),
  line("sue-garino", "safety", "Would prioritize emergency services and responders."),
  line("sue-garino", "money", "Would limit taxes, fees and spending; no one-time money for ongoing programs."),
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
  line("gabriel-elijio-velasquez", "safety", "Would pursue one regional strategy so no one sleeps on Tigard’s streets."),
  line("gabriel-elijio-velasquez", "money", "Would rezone underused parking lots for small businesses and housing."),
  line("gabriel-elijio-velasquez", "climate", "Would build citywide protected bike lanes and continuous sidewalks."),
];

/* ── Chips: 2–4 words, ≤26 characters, same parent as the line ── */
const chips: StanceChip[] = [
  chip("evelyn-kocher", "housing", "Rent control, more homes"),
  chip("evelyn-kocher", "safety", "Ban Flock cameras"),
  chip("evelyn-kocher", "money", "Voters decide new taxes"),
  chip("evelyn-kocher", "climate", "Buses and transit density"),
  chip("rachel-philip", "housing", "More starter homes"),
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
  chip("cristian-salgado", "money", "Conditions on data centers"),
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
  chip("bill-monahan", "safety", "Cheaper police facility"),
  chip("bill-monahan", "money", "Costed core services"),
  chip("yousef-k-allouzi", "housing", "Multigenerational housing"),
  chip("yousef-k-allouzi", "safety", "Due process for residents"),
  chip("yousef-k-allouzi", "money", "Protect library funding"),
  chip("yousef-k-allouzi", "climate", "Paths avoiding major roads"),
  chip("tom-anderson", "housing", "Starter and middle housing"),
  chip("tom-anderson", "safety", "Fix police facilities"),
  chip("tom-anderson", "money", "Jobs in vacant facilities"),
  chip("tom-anderson", "climate", "Take over Hall Boulevard"),
  chip("jeff-darland", "housing", "Community land trusts"),
  chip("jeff-darland", "money", "Growth pays its share"),
  chip("jeff-darland", "climate", "Walkable neighborhoods"),
  chip("sue-garino", "housing", "Workforce housing"),
  chip("sue-garino", "safety", "Emergency services first"),
  chip("sue-garino", "money", "Limit taxes and spending"),
  chip("sue-garino", "climate", "Maintain streets, parks"),
  chip("john-goodhouse", "housing", "Streamline home building"),
  chip("john-goodhouse", "safety", "Back the police"),
  chip("john-goodhouse", "money", "Business-led growth"),
  chip("john-goodhouse", "climate", "Sidewalks and bike lanes"),
  chip("shawne-martinez", "housing", "Infill near transit"),
  chip("shawne-martinez", "climate", "Walkable, bikeable Tigard"),
  chip("kate-ristau", "housing", "Starter, workforce homes"),
  chip("kate-ristau", "money", "Fund library, recreation"),
  chip("kate-ristau", "climate", "Sidewalks on key corridors"),
  chip("gabriel-elijio-velasquez", "housing", "Ban corporate homebuyers"),
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
