import type { Evidence } from "../../../types";
import type {
  CandidateAnalysis,
  CandidateContact,
  ContactChannel,
  Delivery,
  DeliveryStep,
  ExtraTopic,
  IssueLine,
  RaceStakes,
  RaceTopics,
  StanceChip,
  TopicStance,
} from "../../types";
import type { IssueId } from "../../issues";
import type { OwnWords } from "../own-words";
import { emptyPack, type RacePack } from "../../types";

/**
 * Race pack: Clackamas County city offices (Lake Oswego City Council, Oregon
 * City Mayor, Oregon City Commission). Filled by research on September 21,
 * 2026 from the November 2026 Clackamas County voters’ pamphlet (Lake Oswego
 * on PDF pages 29–32, Oregon City on 37–40, read with pdftotext), each
 * campaign site a statement prints, and the redacted candidate filings the
 * two cities publish for candidates whose statement prints no channel.
 *
 * The Lake Oswego statements also appear in the Multnomah County pamphlet
 * (pages 46–48), which the research briefs cite; Patrick Walsh’s statement
 * is printed only in the Clackamas pamphlet (page 30), so his brief’s
 * “missing” note predates this review and he is treated like the others.
 *
 * Venues reviewed September 21, 2026:
 *   https://www.bryanguiney.com/ (+ /priorities, /about-bryan)
 *   https://www.perentiemann.com/ (+ /issues, /about)
 *   https://tunmoreforlo.com/ (+ /priorities, /why, /about, /get-involved)
 *   https://www.heatherforlakeoswego.com/
 *   https://walsh4lo.com/ (+ /why-im-running/, /contact/, /about-me/)
 *   https://www.adammarl.com/ (+ /priorities, /meet-adam, /get-involved)
 *   https://gordonforoc.com/ (+ /meet-gordon/; not printed in the pamphlet)
 *   www.nicita4oc.com (printed in the pamphlet) serves a domain-parking page.
 *   Miles, Mabee, La Barr, Mumm and Espe print no site; filings were read.
 */

const PAMPHLET = "https://docs.clackamas.us/documents/drupal/03f4f9db-a1ab-4a1f-9ce1-16059d49a513";
const MULTNOMAH =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";
const ELECTIONS = "https://www.clackamas.us/elections";
const REVIEWED_ON = "2026-09-21";
const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const pamphlet = (page: number): Evidence => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 21, 2026",
  note: NOTE,
});

const multnomah = (page: number): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `${MULTNOMAH}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 21, 2026",
  note: `Same statement as the Clackamas pamphlet; the page the research brief cites. ${NOTE}`,
});

const site = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note: NOTE,
});

const filing = (label: string, url: string, note: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Published by the city; reviewed September 21, 2026",
  note,
});

const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

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

const pamphletOpening = (page: number, note: string): OwnWords["source"] => ({
  label: `Clackamas County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; extracted September 21, 2026",
  note: `${note} Verbatim opening of the candidate's own statement; publication by the county does not verify the claims.`,
});

type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});
const email = (a: string, from: From): ContactChannel => ({ url: `mailto:${a}`, label: a, kind: "email", from });
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({
  url,
  label,
  kind: "form",
  from,
});
const contact = (candidateId: string, channels: ContactChannel[], sources: Evidence[], none?: string): CandidateContact => ({
  candidateId,
  channels,
  ...(none ? { none } : {}),
  sources,
  reviewedOn: REVIEWED_ON,
});

const portrait = (id: string, page: number) => ({
  src: `/images/voters-guide/2026/${id}.webp`,
  sourceUrl: `${PAMPHLET}#page=${page}`,
  credit: "Candidate-submitted photo · 2026 Clackamas County voters’ pamphlet",
  reviewed: REVIEWED_ON,
});

const electionsPage: Evidence = {
  label: "Clackamas County Elections · November 3, 2026 General Election",
  url: ELECTIONS,
  kind: "Election authority",
  date: "Checked September 21, 2026",
};

/* Sources reused across entries. */
const guineyPriorities = site("Guiney · priorities", "https://www.bryanguiney.com/priorities");
const tiemannIssues = site("Tiemann · issues", "https://www.perentiemann.com/issues");
const tunmorePriorities = site("Tunmore · priorities", "https://tunmoreforlo.com/priorities");
const walshPlatform = site("Walsh · platform (“Why I’m running”)", "https://walsh4lo.com/why-im-running/");
const marlPriorities = site("Marl · priorities", "https://www.adammarl.com/priorities");
const lawrenceAbout = site("Lawrence · meet Gordon (April 2026 interview)", "https://gordonforoc.com/meet-gordon/");

/* ── Lake Oswego City Council ───────────────────────────────────────── */
const loAnalysis: Record<string, CandidateAnalysis> = {
  "bryan-guiney": {
    values: ["Fiscal discipline", "Growth in the right places"],
    tradeoff:
      "He offers public-finance experience as the tool for balancing growth against service costs; which projects come first and what limits would bind them are not yet named.",
    issues: {
      housing: {
        position:
          "Would meet the need for more housing by focusing density in centers and corridors rather than uniformly across established neighborhoods.",
        source: guineyPriorities,
      },
      money: {
        position:
          "Would keep the budget balanced with long-range financial planning and controlled project scope as infrastructure costs rise, without promises the city cannot afford.",
        source: guineyPriorities,
      },
      climate: {
        position:
          "Would invest in infrastructure and mobility to improve traffic, safety and connectivity, and grow smart and sustainably while protecting neighborhoods and the environment.",
        source: pamphlet(29),
      },
    },
    sources: [pamphlet(29), multnomah(46), guineyPriorities],
  },
  "suzanne-miles": {
    values: ["School partnerships", "Police and fire support"],
    tradeoff:
      "Her four commitments name partners and institutions rather than mechanisms; the school partnership she leads with depends on a separately elected board.",
    issues: {
      safety: {
        position: "Would support local police and firefighters to keep the community safe and welcoming.",
        source: pamphlet(30),
      },
      climate: {
        position: "Would nurture natural resources to keep Lake Oswego green.",
        source: pamphlet(30),
      },
    },
    sources: [pamphlet(30), multnomah(46)],
  },
  "peren-tiemann": {
    values: ["Accessibility", "Climate resilience"],
    tradeoff:
      "A broad program built on partnerships and exploration (subsidies, shuttles, scholarships) whose sequencing and financing are still open.",
    issues: {
      housing: {
        position:
          "Would add housing options for lower-wage earners, renters, seniors and first-time buyers, exploring subsidies, rental assistance and incentives for affordable homes.",
        source: tiemannIssues,
      },
      safety: {
        position:
          "Would keep prioritizing mental-health first responders, build on prior conversations about community policing, and expand access to emergency-preparedness resources.",
        source: tiemannIssues,
      },
      money: {
        position: "Would keep city budgeting realistic and sound for long-term stability, and keep costs of living low.",
        source: pamphlet(31),
      },
      climate: {
        position:
          "Would expand transit, bike and walking options, partnering with TriMet and exploring community shuttles, and adopt climate plans that cut the city’s environmental impact.",
        source: tiemannIssues,
      },
    },
    sources: [pamphlet(31), multnomah(47), tiemannIssues],
  },
  "neil-tunmore": {
    values: ["On budget, on time", "Local building standards"],
    tradeoff:
      "He puts project discipline and local discretion at the center; the city must still meet state housing law, and how his standards would differ from the mandates is not spelled out.",
    issues: {
      housing: {
        position:
          "Says Salem oversteps and would manage the state’s housing orders so they conform to Lake Oswego’s building standards and maintain neighborhood character.",
        source: pamphlet(31),
      },
      money: {
        position:
          "Would spend tax dollars only where they add value and manage taxpayer money so the North Anchor, fire station and sewer treatment facility land on budget and on time.",
        source: pamphlet(31),
      },
      climate: {
        position:
          "Would make walking routes and intersections around schools safer and plan ahead for population growth, more cars and new transportation technology.",
        source: tunmorePriorities,
      },
    },
    sources: [pamphlet(31), multnomah(47), tunmorePriorities],
  },
  "heather-ramsey": {
    values: ["Execution", "Balanced growth"],
    tradeoff:
      "Her program stresses delivery and balance; the specific housing and budget choices behind those words are not yet detailed.",
    issues: {
      housing: {
        position: "Would balance state housing mandates with local needs while preserving the community’s character.",
        source: pamphlet(32),
      },
      safety: {
        position: "Would support police, fire and emergency preparedness so residents feel secure.",
        source: pamphlet(32),
      },
      money: {
        position:
          "Would keep infrastructure improvements on time and on budget and guide fiscally responsible plans for the Foothills, the library and other major efforts.",
        source: pamphlet(32),
      },
      climate: {
        position: "Would safeguard parks and waterways through committed environmental stewardship.",
        source: pamphlet(32),
      },
    },
    sources: [pamphlet(32), multnomah(48), site("Ramsey · home page", "https://www.heatherforlakeoswego.com/")],
  },
  "patrick-walsh": {
    values: ["Calm leadership", "Infrastructure first"],
    tradeoff:
      "A platform of process (transparency, sequencing, predictable costs) more than of named projects; what he would cut or defer if costs rise is not said.",
    issues: {
      housing: {
        position:
          "Would meet state housing requirements by directing new homes to areas with existing infrastructure and services, with design standards and tree preservation.",
        source: walshPlatform,
      },
      safety: {
        position: "Would give police, fire and medical teams the training, staffing and equipment needed for rapid response.",
        source: walshPlatform,
      },
      money: {
        position:
          "Wants balanced budgets and predictable costs, investment in roads, water systems, wastewater and emergency services, and clear explanations for fees, bonds and levies.",
        source: walshPlatform,
      },
      climate: {
        position:
          "Would protect tree canopy and watersheds and make forward-looking investments in sustainable local infrastructure.",
        source: pamphlet(30),
      },
    },
    sources: [pamphlet(30), walshPlatform],
  },
};

const loLines: IssueLine[] = [
  line("bryan-guiney", "housing", "Would focus density in centers and corridors, not uniformly across established neighborhoods."),
  line("bryan-guiney", "money", "Keeps the budget balanced with long-range planning and controlled project scope."),
  line("bryan-guiney", "climate", "Would invest in infrastructure and mobility to improve traffic, safety and connectivity."),
  line("suzanne-miles", "safety", "Supports local police and firefighters to keep the community safe."),
  line("suzanne-miles", "climate", "Nurtures natural resources to keep Lake Oswego green."),
  line("peren-tiemann", "housing", "Would explore subsidies, rental assistance and incentives for renters, seniors and first-time buyers."),
  line("peren-tiemann", "safety", "Would keep mental-health first responders a priority and build on community-policing conversations."),
  line("peren-tiemann", "money", "Keeps city budgeting realistic and sound; keeps costs of living low."),
  line("peren-tiemann", "climate", "Would expand transit, bike and walking options with TriMet and explore community shuttles."),
  line("neil-tunmore", "housing", "Would manage Salem’s housing orders to fit Lake Oswego building standards and character."),
  line("neil-tunmore", "money", "Would keep North Anchor, fire station and sewer plant on budget, on time."),
  line("neil-tunmore", "climate", "Makes school walking routes safer; plans for growth, cars and new transportation."),
  line("heather-ramsey", "housing", "Balances state housing mandates with local needs and community character."),
  line("heather-ramsey", "safety", "Supports police, fire and emergency preparedness."),
  line("heather-ramsey", "money", "Keeps infrastructure projects on time and on budget; guides Foothills and library plans."),
  line("heather-ramsey", "climate", "Safeguards parks and waterways through environmental stewardship."),
  line("patrick-walsh", "housing", "Directs new homes to areas with existing infrastructure; keeps design standards, trees."),
  line("patrick-walsh", "safety", "Gives police, fire and medical teams the staffing and equipment for rapid response."),
  line("patrick-walsh", "money", "Wants balanced budgets, predictable costs and clear explanations of fees, bonds and levies."),
  line("patrick-walsh", "climate", "Would protect tree canopy and watersheds and invest in sustainable local infrastructure."),
];

const loChips: StanceChip[] = [
  chip("bryan-guiney", "housing", "Density in centers"),
  chip("bryan-guiney", "money", "Budget in the black"),
  chip("bryan-guiney", "climate", "Mobility, clean energy"),
  chip("suzanne-miles", "safety", "Support police and fire"),
  chip("suzanne-miles", "climate", "Keep LO green"),
  chip("peren-tiemann", "housing", "Renter, senior options"),
  chip("peren-tiemann", "safety", "Mental-health responders"),
  chip("peren-tiemann", "money", "Sound long-term budgets"),
  chip("peren-tiemann", "climate", "Transit, bikes, shuttles"),
  chip("neil-tunmore", "housing", "Mandates, local standards"),
  chip("neil-tunmore", "money", "Projects on budget"),
  chip("neil-tunmore", "climate", "Safer school routes"),
  chip("heather-ramsey", "housing", "Balance state mandates"),
  chip("heather-ramsey", "safety", "Police, fire, preparedness"),
  chip("heather-ramsey", "money", "Projects on time, budget"),
  chip("heather-ramsey", "climate", "Parks and waterways"),
  chip("patrick-walsh", "housing", "Homes where services are"),
  chip("patrick-walsh", "safety", "Staff emergency services"),
  chip("patrick-walsh", "money", "Predictable costs"),
  chip("patrick-walsh", "climate", "Tree canopy, watersheds"),
];

const loDeliveries: Delivery[] = [
  delivery("bryan-guiney", "housing", {
    how: step(
      "Adaptive reuse and mixed-use redevelopment where older office inventory is struggling; density directed to centers and corridors.",
      guineyPriorities,
    ),
  }),
  delivery("bryan-guiney", "money", {
    how: step(
      "Clear priorities, controlled project scope and costs, and aligned funding sources for long-term capital investments.",
      guineyPriorities,
    ),
  }),
  delivery("bryan-guiney", "climate"),
  delivery("suzanne-miles", "safety"),
  delivery("suzanne-miles", "climate"),
  delivery("peren-tiemann", "housing", {
    how: step(
      "Subsidized programs, rental-assistance methods, partnerships with community organizations and incentives for affordable housing, all still to be explored.",
      tiemannIssues,
    ),
  }),
  delivery("peren-tiemann", "safety", {
    how: step(
      "Support for firefighters, emergency-maintenance and road-clearing staff; pathways for emergency workers to afford living in the city.",
      tiemannIssues,
    ),
  }),
  delivery("peren-tiemann", "money"),
  delivery("peren-tiemann", "climate", {
    how: step(
      "Partnerships with TriMet, community shuttles or services like the library’s home delivery; more pathways with crosswalk and speed enforcement; programs with environmental experts for landscaping, commuting and home.",
      tiemannIssues,
    ),
    measure: step("Collision data tracked as roads and pathways are improved; no target set.", tiemannIssues),
  }),
  delivery("neil-tunmore", "housing"),
  delivery("neil-tunmore", "money"),
  delivery("neil-tunmore", "climate", {
    how: step("Replace grass with turf on public sports fields to increase usability in winter.", tunmorePriorities),
  }),
  delivery("heather-ramsey", "housing"),
  delivery("heather-ramsey", "safety"),
  delivery("heather-ramsey", "money"),
  delivery("heather-ramsey", "climate"),
  delivery("patrick-walsh", "housing", {
    how: step(
      "Infrastructure (roads, water, wastewater, emergency services) solid before density expands; transparent planning so residents know what is coming and why.",
      walshPlatform,
    ),
  }),
  delivery("patrick-walsh", "safety"),
  delivery("patrick-walsh", "money", {
    how: step("Long-term capital planning with clear timelines and accountability for major infrastructure projects.", walshPlatform),
  }),
  delivery("patrick-walsh", "climate", {
    how: step(
      "Data-driven traffic calming; pedestrian and bike safety near schools, parks and pathways; tree-canopy and urban-forestry protections.",
      walshPlatform,
    ),
  }),
];

const loOwnWords: OwnWords[] = [
  {
    candidateId: "bryan-guiney",
    text: "Public service is my life’s work. In the Marines, at the State, and in the Federal government, I’ve spent my career bringing people together, managing public resources, solving problems, and delivering results.",
    source: pamphletOpening(29, "Skipped the “Community Service:” header field; the first sentence is under 12 words, so two are given."),
    rule: "pamphlet-opening",
    words: 32,
  },
  {
    candidateId: "suzanne-miles",
    text: "Lake Oswego is where I’m raising my daughters. As a mom to two middle schoolers and a lifelong public servant, our schools, safe neighborhoods and greenspace are my top priorities.",
    source: pamphletOpening(30, "Skipped the “Personal:” label; the first sentence is under 12 words, so two are given."),
    rule: "pamphlet-opening",
    words: 30,
  },
  {
    candidateId: "peren-tiemann",
    text: "I grew up in Lake Oswego and have been a community advocate and organizer since my time at Lakeridge High School.",
    source: pamphletOpening(
      31,
      "Skipped “Building a safe, accessible, and welcoming future for all.”, a slogan with a period but no finite predicate.",
    ),
    rule: "pamphlet-opening",
    words: 21,
  },
  {
    candidateId: "neil-tunmore",
    text: "We must make responsible decisions, strengthening our community today & wisely preparing for our future.",
    source: pamphletOpening(
      31,
      "Skipped the unpunctuated “PERSONAL:” line and the “RESPECTING OUR PAST. SHAPING OUR FUTURE TOGETHER” slogan; the ampersand is the candidate’s.",
    ),
    rule: "pamphlet-opening",
    words: 14,
  },
  {
    candidateId: "heather-ramsey",
    text: "We moved to Lake Oswego for the schools and stayed for the community.",
    source: pamphletOpening(32, "Skipped the run-in “Personal:” label that precedes this sentence."),
    rule: "pamphlet-opening",
    words: 13,
  },
  {
    candidateId: "patrick-walsh",
    text: "Good local governance isn’t about political speeches. It’s about listening first, managing resources responsibly, and doing the quiet, steady work that keeps a city thriving.",
    source: pamphletOpening(
      30,
      "Skipped the “PATRICK WALSH: Calm Leadership. Transparent Governance. Vibrant Community.” labels; the first sentence is under 12 words, so two are given. Not printed in the Multnomah pamphlet.",
    ),
    rule: "pamphlet-opening",
    words: 25,
  },
];

const loContacts: CandidateContact[] = [
  contact(
    "bryan-guiney",
    [
      web("https://www.bryanguiney.com/", "pamphlet"),
      email("info@bryanguiney.com", "site"),
      form("https://www.bryanguiney.com/signon", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/bryanforlakeoswego", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61589819465274", "site"),
    ],
    [pamphlet(29), site("Guiney · home page footer and “Join the team” form", "https://www.bryanguiney.com/")],
  ),
  contact(
    "suzanne-miles",
    [email("sbratis@gmail.com", "filing")],
    [
      pamphlet(30),
      filing(
        "Miles · city candidate filing (SEL 101), contact fields",
        "https://www.ci.oswego.or.us/sites/default/files/fileattachments/SEL%20101_Suzanne%20Miles_Redacted.pdf",
        "The pamphlet statement prints no website, email or phone, and no campaign site was found. The city’s redacted filing leaves the Email Address field visible; its Web Site field is blank and its only phone is in the cell field, so none is listed.",
      ),
    ],
  ),
  contact(
    "peren-tiemann",
    [
      web("https://www.perentiemann.com/", "pamphlet"),
      email("PerenforLakeOswego@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/perenforlakeoswego", "site"),
      social("Facebook", "https://www.facebook.com/61589549296047", "site"),
    ],
    [pamphlet(31), site("Tiemann · issues page (“Reach out!”) and site footer", "https://www.perentiemann.com/issues")],
  ),
  contact(
    "neil-tunmore",
    [
      web("https://tunmoreforlo.com/", "pamphlet"),
      email("tunmoreforlo@gmail.com", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61592892720764", "site"),
      social("Instagram", "https://www.instagram.com/tunmoren/", "site"),
      social("X", "https://x.com/Tunmoreforlo", "site"),
    ],
    [pamphlet(31), site("Tunmore · home page (“Questions? Connect with us.”)", "https://tunmoreforlo.com/")],
  ),
  contact(
    "heather-ramsey",
    [
      web("https://www.heatherforlakeoswego.com/", "pamphlet"),
      email("info@heatherforlakeoswego.com", "site"),
      social("Facebook", "https://www.facebook.com/heatherforlakeoswego", "site"),
      social("Instagram", "https://www.instagram.com/heatherforlakeoswego/", "site"),
      social("LinkedIn", "https://www.linkedin.com/in/heatherramsey1/", "site"),
    ],
    [pamphlet(32), site("Ramsey · home page (“Get Involved” and sign-request sections)", "https://www.heatherforlakeoswego.com/")],
  ),
  contact(
    "patrick-walsh",
    [
      web("https://walsh4lo.com/", "pamphlet"),
      form("https://walsh4lo.com/contact/", "Contact form", "site"),
      social("Instagram", "https://www.instagram.com/walsh4lo/", "pamphlet"),
    ],
    [
      pamphlet(30),
      site("Walsh · contact page (form only; no email or phone on the site)", "https://walsh4lo.com/contact/"),
    ],
  ),
];

const loRoles = [
  { candidateId: "patrick-walsh", role: "Nonprofit executive, library board chair", from: "background" as const },
  { candidateId: "peren-tiemann", role: "Law clerk; city advisory-board chair", from: "background" as const },
  { candidateId: "adam-marl", role: "City commissioner; state legislative coordinator", from: "background" as const },
  { candidateId: "james-nicita", role: "Historian; retired attorney", from: "background" as const },
  { candidateId: "suzanne-miles", role: "Attorney; former federal prosecutor", from: "background" as const },
];

const loPrimary = [
  { candidateId: "bryan-guiney", sourceUrl: `${PAMPHLET}#page=29` },
  { candidateId: "suzanne-miles", sourceUrl: `${PAMPHLET}#page=30` },
  { candidateId: "peren-tiemann", sourceUrl: `${PAMPHLET}#page=31` },
  { candidateId: "neil-tunmore", sourceUrl: `${PAMPHLET}#page=31` },
  { candidateId: "heather-ramsey", sourceUrl: `${PAMPHLET}#page=32` },
  { candidateId: "patrick-walsh", sourceUrl: `${PAMPHLET}#page=30` },
];

/* ── Oregon City Mayor ──────────────────────────────────────────────── */
const ocMayorAnalysis: Record<string, CandidateAnalysis> = {
  "damon-mabee": {
    values: ["Parks first", "Budget review"],
    tradeoff:
      "Parks come first by reallocating within the existing budget; what would be reduced to pay for them, and by how much, is not stated.",
    issues: {
      safety: {
        position:
          "Would keep parks safe by keeping them active and maintained, so they do not become homeless camps or places where drug users gather.",
        source: pamphlet(37),
      },
      money: {
        position:
          "Would take a hard look at the city budget to find the money to fix the park system, as deliberate cost savings kept the pool open in 2004.",
        source: pamphlet(37),
      },
    },
    sources: [pamphlet(37)],
  },
  "adam-marl": {
    values: ["Hold the line on taxes", "Roads and safe routes"],
    tradeoff:
      "His plan pairs infrastructure and small-business growth with a no-new-property-tax stance; the $4 million and past-vote claims are the campaign’s own account.",
    issues: {
      housing: {
        position:
          "Would expand homeownership by encouraging starter-home development, and work with regional partners to connect people who are homeless with services.",
        source: marlPriorities,
      },
      safety: {
        position:
          "Would fund the Oregon City police, invest in behavioral health and youth substance-abuse programs, and keep public spaces clean.",
        source: marlPriorities,
      },
      money: {
        position:
          "Would hold the line on property taxes, push for lower residential utility fees and hold private utilities accountable for ratepayers.",
        source: marlPriorities,
      },
      climate: {
        position:
          "Would fix potholes and build safe routes to school, oppose tolling, and keep local road projects at the front of ODOT’s queue.",
        source: marlPriorities,
      },
    },
    sources: [pamphlet(37), marlPriorities],
  },
  "rodney-la-barr": {
    values: ["Fewer fees and permits", "Growth pays for services"],
    tradeoff:
      "The chain runs lower costs, more building, more revenue, then services and parks; the size and timing of that revenue are assumed rather than shown.",
    issues: {
      housing: {
        position:
          "Would create affordable housing by reducing or eliminating unnecessary regulations, permits and fees so builders can produce homes of all types, from ADUs (backyard cottages) to apartments.",
        source: pamphlet(38),
      },
      safety: {
        position:
          "Would reduce crime and homelessness through economic growth: active areas deter crime, and growth revenue funds services and transitional housing.",
        source: pamphlet(38),
      },
      money: {
        position:
          "Would reduce or eliminate unnecessary permits and fees, and fund parks from the new revenue that follows, without raising taxes.",
        source: pamphlet(38),
      },
      climate: {
        position: "Opposes any tolling of I-205.",
        source: pamphlet(38),
      },
    },
    sources: [pamphlet(38)],
  },
};

const ocMayorLines: IssueLine[] = [
  line("damon-mabee", "safety", "Keeps parks active and maintained so they do not become camps."),
  line("damon-mabee", "money", "Would take a hard look at the budget to find money to fix parks."),
  line("adam-marl", "housing", "Encourages starter homes for homeownership; works regionally to connect homeless people with services."),
  line("adam-marl", "safety", "Funds police, behavioral health and youth substance-abuse programs; keeps public spaces clean."),
  line("adam-marl", "money", "Holds the line on property taxes; pushes lower residential utility fees."),
  line("adam-marl", "climate", "Fixes potholes, builds safe routes to school, opposes tolling."),
  line("rodney-la-barr", "housing", "Would cut unnecessary permits, fees and regulations so builders produce homes of all types."),
  line("rodney-la-barr", "safety", "Reduces crime and homelessness through growth: active areas, revenue for services."),
  line("rodney-la-barr", "money", "Would cut unnecessary permits and fees; funds parks from new revenue, no tax increase."),
  line("rodney-la-barr", "climate", "Opposes any tolling of I-205."),
];

const ocMayorChips: StanceChip[] = [
  chip("damon-mabee", "safety", "Active, maintained parks"),
  chip("damon-mabee", "money", "Budget savings for parks"),
  chip("adam-marl", "housing", "Starter homes"),
  chip("adam-marl", "safety", "Police, behavioral health"),
  chip("adam-marl", "money", "No property-tax increase"),
  chip("adam-marl", "climate", "Potholes, safe routes"),
  chip("rodney-la-barr", "housing", "Cut unneeded fees, permits"),
  chip("rodney-la-barr", "safety", "Growth deters crime"),
  chip("rodney-la-barr", "money", "Growth funds parks"),
  chip("rodney-la-barr", "climate", "No I-205 tolls"),
];

const ocMayorDeliveries: Delivery[] = [
  delivery("damon-mabee", "safety"),
  delivery("damon-mabee", "money", {
    how: step(
      "Deliberate cost savings across the budget, the approach he credits with keeping the pool open in 2004; no specific reductions named.",
      pamphlet(37),
    ),
  }),
  delivery("adam-marl", "housing"),
  delivery("adam-marl", "safety"),
  delivery("adam-marl", "money"),
  delivery("adam-marl", "climate", {
    how: step(
      "Federal money through the congressional delegation for local roads; leverage over ODOT after the Abernethy Bridge delay; a proposed data-center moratorium to protect employment land.",
      marlPriorities,
    ),
    measure: step("$4 million in federal road funding, which the campaign says is already secured.", marlPriorities),
  }),
  delivery("rodney-la-barr", "housing"),
  delivery("rodney-la-barr", "safety"),
  delivery("rodney-la-barr", "money"),
  delivery("rodney-la-barr", "climate"),
];

const ocMayorOwnWords: OwnWords[] = [
  {
    candidateId: "damon-mabee",
    text: "I have lived my whole life in Oregon City and in the more than 20 years since I became active in Oregon City government, the Parks have been the lowest budget priority.",
    source: pamphletOpening(37, "Nothing skipped: the statement opens with running prose."),
    rule: "pamphlet-opening",
    words: 32,
  },
  {
    candidateId: "adam-marl",
    text: "As a lifelong OC resident, I know that with our rich history and pioneering spirit, we have everything we need to reach our community’s full potential.",
    source: pamphletOpening(37, "Skipped the “A New Day in the First City” heading."),
    rule: "pamphlet-opening",
    words: 26,
  },
  {
    candidateId: "rodney-la-barr",
    text: "For nearly 20 years I have worked in trades across Alameda and Multnomah Counties.",
    source: pamphletOpening(38, "Nothing skipped: the statement opens with running prose."),
    rule: "pamphlet-opening",
    words: 14,
  },
];

const OC_FILINGS = "https://www.orcity.org/DocumentCenter/View";
const ocFilingNote = (extra: string) =>
  `The pamphlet statement prints no website, email or phone, and no campaign site was found. The city publishes the candidate’s redacted filing (SEL 101) with the Email Address field visible; its phone fields are labelled work, home and cell rather than campaign, so none is listed. ${extra}`;

const ocMayorContacts: CandidateContact[] = [
  contact(
    "damon-mabee",
    [email("damonmabee@comcast.net", "filing")],
    [
      pamphlet(37),
      filing(
        "Mabee · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19357/2026-08-14-Damon-Mabee-Election-Documents_Redactedpdf`,
        ocFilingNote("The address is typed; the Web Site field is blank."),
      ),
    ],
  ),
  contact(
    "adam-marl",
    [
      web("https://www.adammarl.com/", "pamphlet"),
      email("info@adammarl.com", "site"),
      form("https://www.adammarl.com/get-involved", "Volunteer form", "site"),
      social("Facebook", "https://www.facebook.com/AdamMarlforMayor", "site"),
    ],
    [pamphlet(37), site("Marl · get involved (form and email) and site footer", "https://www.adammarl.com/get-involved")],
  ),
  contact(
    "rodney-la-barr",
    [email("R.LaBarr@proton.me", "filing")],
    [
      pamphlet(38),
      filing(
        "La Barr · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19363/2026-08-17-Rodney-La-Barr-Election-Documents_Redactedpdf`,
        ocFilingNote("The address is handwritten and read as “R.LaBarr@proton.me”; the Web Site field is blank."),
      ),
    ],
  ),
];

const ocMayorPrimary = [
  { candidateId: "damon-mabee", sourceUrl: `${PAMPHLET}#page=37` },
  { candidateId: "adam-marl", sourceUrl: `${PAMPHLET}#page=37` },
  { candidateId: "rodney-la-barr", sourceUrl: `${PAMPHLET}#page=38` },
];

/* ── Oregon City Commission ─────────────────────────────────────────── */
const ocCommAnalysis: Record<string, CandidateAnalysis> = {
  "betty-mumm": {
    values: ["Core services", "Careful with residents’ costs"],
    tradeoff:
      "Prudent budgeting and growth carry the plan; no incentive package or service trade-off is specified.",
    issues: {
      safety: {
        position: "Would keep public safety a budget priority alongside parks, streets, sewers and the library.",
        source: pamphlet(39),
      },
      money: {
        position:
          "Would review carefully any proposal that raises residents’ costs, protect essential services, and grow the tax base, starting with another hotel.",
        source: pamphlet(39),
      },
    },
    sources: [pamphlet(39)],
  },
  "james-nicita": {
    values: ["Right to vote on urban renewal", "Historic preservation"],
    tradeoff:
      "His agenda changes both spending priorities and governance; charter changes, a Metro partnership and redirecting urban-renewal money need votes beyond one commissioner.",
    issues: {
      housing: {
        position:
          "Would defend the Park Place Concept Plan and develop its North Village, the planned neighborhood area on the city’s edge.",
        source: pamphlet(39),
      },
      safety: {
        position:
          "Would fully fund police by restoring tax dollars now diverted to urban renewal (a district that keeps part of property-tax growth for development projects).",
        source: pamphlet(39),
      },
      money: {
        position:
          "Would restore urban-renewal tax dollars to police and, if urban renewal continues, prioritize small projects citizens help design and build; defends residents’ right to vote on urban renewal.",
        source: pamphlet(39),
      },
      climate: {
        position:
          "Opposes data centers, would create a solar-generation district in the North End and build the Holly Lane Connector road.",
        source: pamphlet(39),
      },
    },
    sources: [pamphlet(39)],
  },
  "paul-espe": {
    values: ["Get stuff done", "Business growth"],
    tradeoff:
      "He expects business growth to carry service capacity; the cost of the incentives and the revenue they would return are not estimated.",
    issues: {
      safety: {
        position: "Would strengthen the city’s existing disaster-preparedness program.",
        source: pamphlet(40),
      },
      money: {
        position:
          "Would grow the tax base with incentives to attract and keep businesses, and fill vacant buildings with taxpaying businesses rather than government services.",
        source: pamphlet(40),
      },
      climate: {
        position: "Would protect the city’s natural resources.",
        source: pamphlet(40),
      },
    },
    sources: [pamphlet(40)],
  },
  "gordon-j-lawrence": {
    values: ["Fresh perspective", "Regional partnerships"],
    tradeoff:
      "A collaborative growth agenda; the regulatory and financing choices behind it are left open.",
    issues: {
      housing: {
        position: "Would pursue more housing opportunities and stronger services for people who are homeless.",
        source: pamphlet(40),
      },
      money: {
        position:
          "Would fund services by growing a tax base, which he says the city cannot build if it blocks every development opportunity.",
        source: lawrenceAbout,
      },
      climate: {
        position: "Would give more attention to parks, recreation and the city’s natural assets.",
        source: pamphlet(40),
      },
    },
    sources: [pamphlet(40), lawrenceAbout],
  },
};

const ocCommLines: IssueLine[] = [
  line("betty-mumm", "safety", "Keeps public safety a budget priority with parks, streets, sewers, library."),
  line("betty-mumm", "money", "Reviews any proposal that raises residents’ costs; grows the tax base."),
  line("james-nicita", "housing", "Defends the Park Place Concept Plan; develops its North Village neighborhood."),
  line("james-nicita", "safety", "Fully funds police by restoring tax dollars diverted to urban renewal."),
  line("james-nicita", "money", "Would return urban-renewal money to police; if renewal continues, favors small citizen-designed projects."),
  line("james-nicita", "climate", "Opposes data centers; creates a North End solar district; builds Holly Lane Connector."),
  line("paul-espe", "safety", "Strengthens the city’s existing disaster-preparedness program."),
  line("paul-espe", "money", "Grows the tax base with business incentives; fills vacant buildings with taxpaying businesses."),
  line("paul-espe", "climate", "Protects the city’s natural resources."),
  line("gordon-j-lawrence", "housing", "Pursues more housing opportunities and stronger services for homeless people."),
  line("gordon-j-lawrence", "money", "Would fund services by growing the tax base and not blocking every development opportunity."),
  line("gordon-j-lawrence", "climate", "Gives more attention to parks, recreation and natural assets."),
];

const ocCommChips: StanceChip[] = [
  chip("betty-mumm", "safety", "Public safety a priority"),
  chip("betty-mumm", "money", "Careful with new costs"),
  chip("james-nicita", "housing", "Park Place, North Village"),
  chip("james-nicita", "safety", "Renewal money to police"),
  chip("james-nicita", "money", "Vote on urban renewal"),
  chip("james-nicita", "climate", "No data centers, solar"),
  chip("paul-espe", "safety", "Disaster preparedness"),
  chip("paul-espe", "money", "Incentives for tax base"),
  chip("paul-espe", "climate", "Protect natural resources"),
  chip("gordon-j-lawrence", "housing", "More housing, services"),
  chip("gordon-j-lawrence", "money", "Grow the tax base"),
  chip("gordon-j-lawrence", "climate", "Parks and natural assets"),
];

const ocCommDeliveries: Delivery[] = [
  delivery("betty-mumm", "safety"),
  delivery("betty-mumm", "money", {
    how: step("Attract another hotel to welcome visitors and support the local economy and tax base.", pamphlet(39)),
  }),
  delivery("james-nicita", "housing"),
  delivery("james-nicita", "safety"),
  delivery("james-nicita", "money"),
  delivery("james-nicita", "climate"),
  delivery("paul-espe", "safety"),
  delivery("paul-espe", "money"),
  delivery("paul-espe", "climate"),
  delivery("gordon-j-lawrence", "housing"),
  delivery("gordon-j-lawrence", "money"),
  delivery("gordon-j-lawrence", "climate"),
];

const ocCommOwnWords: OwnWords[] = [
  {
    candidateId: "betty-mumm",
    text: "As a resident of Oregon City for more than 45 years, I have watched our community grow and change.",
    source: pamphletOpening(39, "Skipped the “Committed to Serving the Citizens of Oregon City” heading."),
    rule: "pamphlet-opening",
    words: 19,
  },
  {
    candidateId: "james-nicita",
    text: "In respectfully submitting my candidacy, I offer policy and design thinking informed by an historian’s long view of Oregon City’s remarkable history.",
    source: pamphletOpening(39, "Nothing skipped: the statement opens with running prose."),
    rule: "pamphlet-opening",
    words: 22,
  },
  {
    candidateId: "paul-espe",
    text: "I have been very fortunate to raise my family in Oregon City and I want to maintain our quality of life and keep our city livable!",
    source: pamphletOpening(40, "Nothing skipped: the statement opens with running prose."),
    rule: "pamphlet-opening",
    words: 26,
  },
  {
    candidateId: "gordon-j-lawrence",
    text: "Oregon City is at a crossroads. We face challenges, but we also have tremendous opportunities.",
    source: pamphletOpening(
      40,
      "Skipped the “A Fresh Perspective for Oregon City” heading; the first sentence is under 12 words, so two are given.",
    ),
    rule: "pamphlet-opening",
    words: 15,
  },
];

const ocCommContacts: CandidateContact[] = [
  contact(
    "betty-mumm",
    [email("BMumm@comcast.net", "filing")],
    [
      pamphlet(39),
      filing(
        "Mumm · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19070/2026-06-12-Betty-Mumm-Election-Documents_Redactedpdf`,
        ocFilingNote("The address is handwritten and read as “BMumm@comcast.net”; the Web Site field is blank."),
      ),
    ],
  ),
  contact(
    "james-nicita",
    [email("james.nicita@gmail.com", "filing")],
    [
      pamphlet(39),
      filing(
        "Nicita · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19362/2026-08-17-James-Nicita-Election-Documents_Redactedpdf`,
        "The pamphlet prints www.nicita4oc.com, which resolved on September 21, 2026 to a domain-parking page with no campaign content, so no website is listed. The city’s redacted filing leaves the typed Email Address visible; its phone is in the cell field rather than a campaign field, so none is listed.",
      ),
    ],
  ),
  contact(
    "paul-espe",
    [email("Commissionerespe@gmail.com", "filing")],
    [
      pamphlet(40),
      filing(
        "Espe · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19352/2026-08-13-Paul-Espe-Election-Documents_Redactedpdf`,
        ocFilingNote(
          "The pamphlet’s “FOLLOW ME AT: PAUL ESPE 4 OC” names no platform or address, so it is not listed as a channel. The filing’s address is typed; its Web Site field is blank.",
        ),
      ),
    ],
  ),
  contact(
    "gordon-j-lawrence",
    [web("https://gordonforoc.com/", "site"), email("lawrgj@gmail.com", "filing")],
    [
      pamphlet(40),
      site(
        "Lawrence · home page (“Paid for by Gordon For Oregon City”; no email, phone, form or profile links)",
        "https://gordonforoc.com/",
      ),
      filing(
        "Lawrence · city candidate filing (SEL 101), contact fields",
        `${OC_FILINGS}/19068/2026-06-11-Lawrence-Election-Documents_Redactedpdf`,
        "The pamphlet prints no channel; the campaign site was found by search and matches the committee named on the statement. The city’s redacted filing leaves the typed Email Address visible; its Web Site field is blank and its phone is in the cell field, so none is listed.",
      ),
    ],
  ),
];

const ocCommPrimary = [
  { candidateId: "betty-mumm", sourceUrl: `${PAMPHLET}#page=39` },
  { candidateId: "james-nicita", sourceUrl: `${PAMPHLET}#page=39` },
  { candidateId: "paul-espe", sourceUrl: `${PAMPHLET}#page=40` },
  { candidateId: "gordon-j-lawrence", sourceUrl: `${PAMPHLET}#page=40` },
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

/* Lake Oswego: council and Planning Commission records in the city's Laserfiche portal, the Lake Oswego Review, and the 2025–27 budget */
const LO_DOC = (id: number) => `https://apps.lakeoswego.city/WebLink/ElectronicFile.aspx?docid=${id}&dbid=0&repo=CityOfLakeOswego`;
const loWwtf = record(
  "Lake Oswego City Council · September 1, 2026 study session: overview of the cost proposal for the Wastewater Treatment Facility",
  LO_DOC(3396487),
  "September 1, 2026; read September 22, 2026",
  "Fixed design-build price $369,621,065 plus a $15,000,000 owner-controlled account; WIFIA loan of $123.5 million secured September 2025; rate options of 28% once on July 1, 2027 or 8% a year for ten years on a typical $96.83 monthly bill.",
);
const loLibrary = record(
  "Lake Oswego City Council · July 7, 2026 staff report: future library site criteria and task forces",
  LO_DOC(3367257),
  "July 7, 2026; read September 22, 2026",
  "A 50,000–70,000-square-foot building on 2.5–3.5 acres; the existing 27,100-square-foot library on 1.1 acres needs about $10 million in repairs (2024 estimate). Resolutions 26-41, 26-42 and 26-43 followed on July 21, 2026.",
);
const loHousing = record(
  "Lake Oswego City Council · February 17, 2026 staff report on the Oregon Housing Needs Analysis allocation, with DLCD’s December 4, 2025 letter",
  LO_DOC(3268433),
  "February 17, 2026; read September 22, 2026",
  "2026 allocation 4,850 units over 20 years, about 2.5 times the 1,968 in the 2023 analysis; the 2025 allocation of 4,620 included 1,009 units for households at 0–30% of area median income and a six-year target of 1,794.",
);
const loFireBond = record(
  "City of Lake Oswego · 2026 Declaration of the Vote, Measure 3-635 (South Shore fire station bond)",
  LO_DOC(3359635),
  "Approved by the council June 16, 2026; read September 22, 2026",
  "10,179 yes to 4,636 no, 68.71%; the $20.6 million bond was referred February 17, 2026 by Resolution 26-08.",
);
const loPcDec8 = record(
  "Lake Oswego Planning Commission · minutes, December 8, 2025 (LU 25-0029, 4000 Kruse Way Place rezoning)",
  LO_DOC(3200158),
  "December 8, 2025; read September 22, 2026",
  "Recommendation to approve carried 7–0; the council enacted Ordinance 2971 on February 17, 2026, now under LUBA appeal.",
);
const loPcJun8 = record(
  "Lake Oswego Planning Commission · minutes, June 8, 2026 (LU 26-0014, clear-and-objective tree code)",
  LO_DOC(3377377),
  "June 8, 2026; read September 22, 2026",
  "Recommendation carried 5–2; findings adopted June 22, 2026 (minutes docid 3377393), 3–1.",
);
const loMinJan20 = record(
  "Lake Oswego City Council · minutes, January 20, 2026 (Library Advisory Board annual update, item 9.1)",
  LO_DOC(3293014),
  "January 20, 2026; read September 22, 2026",
  "Presented by the board chair: “an emphasis on the need to build a new library on a larger site in a more amenable location.”",
);
const loMinMay28: Evidence = {
  label: "Lake Oswego City Council · minutes, May 28, 2026 special meeting (council vacancy interviews)",
  url: LO_DOC(3401095),
  kind: "Candidate statement",
  date: "May 28, 2026; read September 22, 2026",
  note: "Her remarks to the council as an applicant for the vacant seat, as summarized in the approved minutes.",
};
const loCityManager = record(
  "Lake Oswego City Council · September 1, 2026, Resolutions 26-47 and 26-48 (city manager appointment)",
  LO_DOC(3396454),
  "September 1, 2026; read September 22, 2026",
);
const loBudget = record(
  "City of Lake Oswego · Adopted Budget 2025–27 (Resolution 25-13, $461,661,974)",
  "https://www.ci.oswego.or.us/sites/default/files/fileattachments/Full%20Budget.pdf",
  "Adopted June 3, 2025; read September 22, 2026",
);
const reviewGuiney = reporting(
  "Lake Oswego Review · Candidate profile: Bryan Guiney aims to lead with respect",
  "https://lakeoswegoreview.com/2026/09/05/candidate-profile-bryan-guiney-aims-to-lead-with-respect-in-lake-oswego/",
  "September 5, 2026; read September 22, 2026",
  "Reported statement; quote as printed by the Lake Oswego Review.",
);
const loTopics: ExtraTopic[] = [
  {
    id: "lo-sewer-rates",
    label: "Sewer plant rates",
    short: "Sewer rates",
    question: "Raise sewer bills 28% at once in July 2027, or 8% a year for ten years, to pay for the $370 million wastewater plant?",
    context:
      "On September 1, 2026 the council reviewed Jacobs’ final offer to design, build and run the new plant: a fixed price of $369,621,065 plus a $15 million owner’s account, with a $123.5 million federal WIFIA loan secured in 2025. Staff’s model needs either a one-time 28% sewer increase on July 1, 2027 or 8% a year for ten years on a typical $96.83 monthly bill; rates are to be set in October and construction starts in December 2026.",
  },
  {
    id: "lo-library",
    label: "New library",
    short: "Library",
    question: "Build a new 50,000–70,000-square-foot library on a larger west-side site and sell the current one, or repair the 1983 building?",
    context:
      "The council’s 2026 goal is an expanded, modern library on the west side with urban-renewal funding; on July 21, 2026 it adopted site criteria and created a task force. Staff’s study calls for 50,000–70,000 square feet on 2.5–3.5 acres; the current 27,100-square-foot library on 1.1 acres needs about $10 million in repairs by a 2024 estimate. A bond vote would be needed, and the site decision runs into 2027.",
  },
  {
    id: "lo-housing-mandate",
    label: "State housing target",
    short: "Housing target",
    question: "Where should Lake Oswego put the 4,850 homes the state now expects: rezoned office land like Kruse Way and Foothills, or also inside single-family neighborhoods?",
    context:
      "The state told the city in December 2025 that its 2026 housing allocation is 4,850 units over 20 years, about 2.5 times the 1,968 in the city’s 2023 analysis, with a progress report due by the end of 2027. Council policy since September 2025 is to rezone commercial land, not neighborhoods; Ordinance 2971 (February 17, 2026) rezoned 12.87 acres on Kruse Way for high-density housing and is under appeal, and the code audit’s amendments reach the next council in 2027–28.",
  },
  {
    id: "lo-tree-code",
    label: "Tree code fee",
    short: "Tree fee",
    question: "Keep the new rule that new homes retain 45% of large trees or pay $300–$400 an inch?",
    context:
      "To meet the state’s requirement for clear and objective housing standards (HB 2138), the council enacted Ordinances 2974 and 2978 on September 1, 2026: new dwellings and lots must keep 45% of trees over 15 inches in diameter or pay a deficit fee. On September 15 Resolution 26-34 set the fee at $300 an inch for a deficit up to six inches and $400 beyond, with affordable housing exempt. Who pays to remove dead trees was postponed.",
  },
  {
    id: "lo-north-anchor",
    label: "North Anchor hotel",
    short: "North Anchor",
    question: "Give the North Anchor developer until March 2027 to finance an 88-room hotel, or pivot that downtown parcel to another use?",
    context:
      "Sitting as the redevelopment agency board, the council approved the sixth amendment to the North Anchor agreement on June 2, 2026: the developer must show financing for the 88-room hotel or present alternative uses by December 30, 2026, and the agency may end its rights to that parcel if there is no agreement by March 1, 2027; demolition for the 66-apartment building must begin by December 31, 2026. It is the fifth delay in six years.",
  },
  {
    id: "lo-school-pathways",
    label: "School pathways",
    short: "Sidewalks",
    question: "Fund the next five school-pathway projects, about $3.75–4.5 million, including two the First Addition neighborhood opposed?",
    context:
      "The 50% street-maintenance-fee increase of July 2023 yields nearly $1.5 million a year for pedestrian projects, and $8 million has been spent in six years. On August 4, 2026 staff recommended five projects for the 2027–29 capital plan: Quarry, Sunningdale, 10th Street, Bryant Road and Westlake Drive, of which Sunningdale and 10th were not supported by the First Addition neighborhood association. The next council adopts that plan in spring 2027.",
  },
];

const loStances: TopicStance[] = [
  /* ── Bryan Guiney (Planning Commission votes are his recorded actions) ── */
  stance("bryan-guiney", "lo-sewer-rates", "partial", "Plant has long-term benefits",
    "Points to the new wastewater plant as a long-term project with benefits and wants the city to budget for upkeep so there isn’t a lot of deferred maintenance; the 28% or 8%-a-year choice is unsaid.",
    reviewGuiney),
  stance("bryan-guiney", "lo-housing-mandate", "supports", "Density in centers, corridors",
    "Says density belongs in centers and corridors, “not imposed uniformly across established neighborhoods,” and backs reuse of struggling office land; as a planning commissioner voted December 8, 2025 to recommend the Kruse Way office-to-housing rezoning, 7–0.",
    loPcDec8),
  stance("bryan-guiney", "lo-tree-code", "supports", "Voted for tree rules",
    "As a planning commissioner voted June 8 and June 22, 2026 to recommend the clear-and-objective tree rules, saying he did not want the city drawn into neighborhood disputes over dead trees; the fee amounts set in September are unsaid.",
    loPcJun8),
  stance("bryan-guiney", "lo-north-anchor", "partial", "Names North Anchor",
    "Lists North Anchor and Foothills among major projects the city will see move forward in the next few years; whether to hold the developer to the March 2027 hotel deadline or pivot the parcel is unsaid.",
    site("Guiney · campaign home", "https://www.bryanguiney.com/")),
  stance("bryan-guiney", "lo-school-pathways", "partial", "Sidewalks on thoroughfares",
    "Says many of the city’s large thoroughfares lack sidewalks, which directly affects how children get to school, and would invest in mobility and connectivity; the five recommended projects are unsaid.",
    reviewGuiney),

  /* ── Suzanne Miles ─────────────────────────────────────────────── */
  stance("suzanne-miles", "lo-library", "partial", "Library a priority",
    "Told the council at her May 28, 2026 vacancy interview that the library planning process and the tree-code rewrite were of particular interest to her; whether to build new on a larger site or repair is unsaid.",
    loMinMay28),

  /* ── Heather Ramsey ────────────────────────────────────────────── */
  stance("heather-ramsey", "lo-library", "partial", "Community-driven library vision",
    "Would guide fiscally responsible, sustainable, community-driven visions for the Foothills, the library and other major efforts; a new site versus repair is unsaid.",
    pamphlet(32)),
  stance("heather-ramsey", "lo-housing-mandate", "partial", "Balance mandates, character",
    "Would balance state housing mandates with local needs while preserving the community’s character; where the 4,850 homes should go is unsaid.",
    pamphlet(32)),

  /* ── Peren Tiemann ─────────────────────────────────────────────── */
  stance("peren-tiemann", "lo-library", "partial", "Library as third space",
    "Says that as opportunities like a new library come into view the city should prioritize spaces where people gather, and wants longer library hours; site versus repair is unsaid.",
    tiemannIssues),
  stance("peren-tiemann", "lo-housing-mandate", "partial", "More affordable options",
    "Wants more housing options for lower-wage earners, renters, seniors and first-time buyers and would look into subsidies, rental assistance and incentives; where the 4,850 homes should go is unsaid.",
    tiemannIssues),
  stance("peren-tiemann", "lo-school-pathways", "partial", "Build pathways, enforce",
    "Would keep expanding bike access, building pathways and enforcing crosswalk laws and speed limits, tracking collision data; the five recommended projects are unsaid.",
    tiemannIssues),

  /* ── Neil Tunmore ──────────────────────────────────────────────── */
  stance("neil-tunmore", "lo-sewer-rates", "partial", "Plant on budget",
    "Names the sewer treatment facility among the projects he would manage so they land on budget and on time; whether to raise sewer bills 28% at once or 8% a year is unsaid.",
    pamphlet(31)),
  stance("neil-tunmore", "lo-library", "partial", "Manage library spending",
    "Names “the new library” among projects whose taxpayer money must be managed for future financial stability; a larger site versus repair is unsaid.",
    tunmorePriorities),
  stance("neil-tunmore", "lo-housing-mandate", "partial", "Salem oversteps, local standards",
    "Says Salem oversteps with housing mandates and the city should manage the state’s orders to conform to Lake Oswego’s building standards and keep neighborhood character; which land takes the 4,850 homes is unsaid.",
    tunmorePriorities),
  stance("neil-tunmore", "lo-north-anchor", "partial", "North Anchor on budget",
    "Names North Anchor among the projects to keep on budget and on time; the hotel deadline is unsaid.",
    pamphlet(31)),
  stance("neil-tunmore", "lo-school-pathways", "partial", "Safer school walks",
    "Would keep identifying pathways and intersections around schools to create safer ways to walk; the five recommended projects are unsaid.",
    tunmorePriorities),

  /* ── Patrick Walsh ─────────────────────────────────────────────── */
  stance("patrick-walsh", "lo-sewer-rates", "partial", "Invest, explain fees",
    "Would invest in roads, water systems, wastewater and emergency services and give clear explanations for fees, bonds and levies; whether to raise sewer bills 28% at once or 8% a year is unsaid.",
    walshPlatform),
  stance("patrick-walsh", "lo-library", "supports", "New library, larger site",
    "As library board chair, co-presented the board’s January 20, 2026 update to the council, which stressed the need for a new library on a larger site and a scope that fits fiscal realities. Selling the current site is unsaid.",
    loMinJan20),
  stance("patrick-walsh", "lo-housing-mandate", "partial", "Homes where infrastructure is",
    "Says the city must comply with state housing law but “how we comply matters,” directing new housing to areas with existing infrastructure and services; whether that means office land or single-family neighborhoods is unsaid.",
    walshPlatform),
  stance("patrick-walsh", "lo-tree-code", "partial", "Strong canopy protections",
    "Wants strong tree-canopy and urban-forestry protections and tree preservation with new housing; the 45% rule and the per-inch fee are unsaid.",
    walshPlatform),
  stance("patrick-walsh", "lo-school-pathways", "partial", "Safe routes every school",
    "Would prioritize sidewalks, safe crosswalks, traffic calming and bike pathways around every Lake Oswego school; the five recommended projects, including the two First Addition opposed, are unsaid.",
    walshPlatform),
];

const loStakes: RaceStakes[] = [
  {
    raceId: "lake-oswego-council",
    intro:
      "Lake Oswego’s council of six councilors and a mayor adopts a two-year budget ($461,661,974 for 2025–27), sets sewer, water and street fees, writes the housing and tree codes the state now requires, and sits as the redevelopment agency board for downtown projects. The four seats filled this November will set the sewer rate for a $370 million treatment plant, decide the library’s site, and answer a state housing target 2.5 times the last one.",
    items: [
      {
        label: "$370 million sewer plant",
        text:
          "Jacobs’ final offer to design, build and operate the new wastewater plant is a fixed $369,621,065 plus a $15 million owner’s account and $5.06 million a year to run it, financed with a $123.5 million federal loan and bonds. Paying for it means either a one-time 28% sewer increase in July 2027 or 8% a year for a decade on a typical $96.83 monthly bill; construction starts December 2026 and finishes in 2031.",
        source: loWwtf,
      },
      {
        label: "Fire station bond passed",
        text:
          "Voters approved Measure 3-635 on May 19, 2026, 10,179 to 4,636 (68.71%): a $20.6 million bond to rebuild the South Shore fire station at about $0.19 per $1,000 of assessed value, roughly $114 a year on a $600,000 home. The council sells the bonds in December 2026 and oversees construction.",
        source: loFireBond,
      },
      {
        label: "Housing target 2.5×",
        text:
          "The state’s 2026 allocation asks Lake Oswego to plan for 4,850 homes over 20 years, against 1,968 in its 2023 analysis; the 2025 allocation included 1,009 units for households earning up to 30% of area median income and a six-year production target of 1,794. A progress report is due to the state by the end of 2027.",
        source: loHousing,
      },
      {
        label: "Library decision",
        text:
          "The 1983 library is 27,100 square feet on 1.1 acres, 23% smaller than voters approved in 1974, and needs about $10 million in repairs. Staff’s target is 50,000–70,000 square feet on 2.5–3.5 acres, prioritizing the west side; the site decision runs into 2027 and building it would take a bond vote.",
        source: loLibrary,
      },
      {
        label: "Two-year budget",
        text:
          "The 2025–27 budget totals $461,661,974; the general fund’s $206.9 million holds $22.1 million in contingency and a $12.1 million unappropriated ending balance under a policy of reserving 30% of operating costs, makes no contribution to the capital reserve this biennium because excess funds went to the recreation center, and transfers $3 million a year to the street fund for a $4 million paving program.",
        source: loBudget,
      },
      {
        label: "New city manager",
        text:
          "Denzel Maxwell starts as city manager October 5, 2026 under Resolution 26-47, after Martha Bennett’s February 2026 separation and seven months with a pro tem manager; the new council inherits the wastewater contract, the library and the code audit with an administration weeks old.",
        source: loCityManager,
      },
    ],
  },
];

/* Oregon City: commission packets and minutes on CivicClerk (minutes are published through late 2025; some 2026 votes appear only as draft minutes inside later packets), the 2025–27 budget book, and campaign pages */
const OC_FILE = (id: number) => `https://oregoncityor.api.civicclerk.com/v1/Meetings/GetMeetingFileStream(fileId=${id},plainText=false)`;
const ocBudget = record(
  "City of Oregon City · 2025–2027 Adopted Biennial Budget (tax rate, general-fund forecast, police staffing)",
  "https://orcity.org/DocumentCenter/View/16698/2025-2027-Budget-Book---Adopted-Final-PDF",
  "Adopted June 4, 2025; read September 22, 2026",
  "Total requirements $319,019,000; tax rate $4.489 per $1,000 (an $0.08 increase worth $657,000); general-fund forecast shows net deficits of $624,400 in FY 2026 and $848,100 in FY 2027 growing to $1.5 million by FY 2031, with the ending balance falling from $15,191,400 to $7,781,800; 46 sworn officers; police $30.0 million, 44% of the general fund.",
);
const ocMinJun4 = record(
  "Oregon City Commission · minutes, June 4, 2025 (Resolution 25-15 adopting the 2025–27 budget at $4.489 per $1,000)",
  OC_FILE(8845),
  "June 4, 2025; read September 22, 2026",
  "Motion by Commissioner Marl, seconded by Mayor McGriff; passed 5–0. His May 8, 2025 “Budget Stabilization Framework” to the Budget Committee proposed keeping the current rate by trimming DEI, adaptive-reuse and business-promotion budgets.",
);
const ocFee = record(
  "Oregon City Commission · February 10, 2026 packet: Community Safety Advancement Fee review",
  OC_FILE(8700),
  "February 10, 2026; read September 22, 2026",
  "The fee is $6.50 a month (Ordinance 15-1005), about $1.27 million a year; staff: “Future discussion may focus on generating new revenue.”",
);
const ocDec3 = record(
  "Oregon City Commission · draft minutes of December 3, 2025 (Ordinance 25-1016, downtown civil exclusion zone), in the August 5, 2026 packet",
  OC_FILE(9201),
  "December 3, 2025; read September 22, 2026",
  "Second reading passed 5–0 with Marl voting yes. On September 17, 2025 (minutes fileId 9149) he said the Caring Place had not made formal requests of the city and he had “a hard time” with it asking to collaborate past the point where meaningful changes could be made.",
);
const ocCaringPlace = record(
  "Oregon City Commission · October 15, 2025 work-session packet: Caring Place partnership",
  OC_FILE(8369),
  "October 15, 2025; read September 22, 2026",
  "A $28 million project at 1516 Main Street housing The Father’s Heart, LoveOne, county Coordinated Housing Access and the city’s Caring Court; city system-development-charge estimate $613,793.75. The May 20, 2026 packet (fileId 9042) carried the co-location memorandum.",
);
const ocMummTestimony: Evidence = {
  label: "Oregon City Commission · minutes, October 15, 2025 (citizen comments)",
  url: OC_FILE(9151),
  kind: "Candidate statement",
  date: "October 15, 2025; read September 22, 2026",
  note: "Her own comment to the commission as recorded in the approved minutes.",
};
const ocRiverwalk = record(
  "Oregon City Commission · April 15, 2026 packet: intergovernmental agreement with the Confederated Tribes of Grand Ronde for the Riverwalk at tumwata village",
  OC_FILE(8873),
  "April 15, 2026; read September 22, 2026",
  "$12,500,000 in state lottery-bond grant funds for the segment between 3rd and 4th streets; if a public-access easement ends and the state claws back funds, the parties “shall be jointly responsible for sharing in the repayment on an equal basis.” Groundbreaking May 28, 2026 (September 8, 2026 update, fileId 9245).",
);
const ocUrbanRenewal = record(
  "Oregon City Urban Renewal Commission · February 11, 2025 packet: options after the Court of Appeals ruling and the 2023 vote",
  OC_FILE(7652),
  "February 11, 2025; read September 22, 2026",
  "About $3.2 million a year in tax increment; closing the district would send about $900,000 a year to the general fund; options included a new ballot measure, repealing Charter Section 59, closing the district or litigation. Voters rejected Measure 3-597 ($44 million of borrowing) on May 16, 2023.",
);
const ocJan7 = record(
  "Oregon City Commission · draft minutes of January 7, 2026 (tolling motion; Ordinance 26-1003 rezoning agency-owned houses for sale), in the August 19, 2026 packet",
  OC_FILE(9232),
  "January 7, 2026; read September 22, 2026",
  "Marl moved “to affirm the City Commission’s position that tolling language should be permanently stricken from the statutes,” passed 5–0; Ordinance 26-1003 passed 5–0.",
);

const ocTopics: ExtraTopic[] = [
  {
    id: "oc-data-center-moratorium",
    label: "Data-center moratorium",
    short: "Moratorium",
    question: "Adopt a temporary moratorium on data centers while the city rewrites its code?",
    context:
      "At the September 8, 2026 work session Commissioner Marl proposed a data-center moratorium and reported unanimous support from colleagues for moving forward; no ordinance has been published and none is on the September 16 or October agendas. State law allows a 120-day moratorium only on a finding of compelling need, and Clackamas County held its own moratorium hearing September 15, 2026. No data center operates in the county.",
  },
  {
    id: "oc-budget-gap",
    label: "Budget and tax rate",
    short: "Budget gap",
    question: "Close the general fund’s structural gap by raising the property-tax rate or the $6.50-a-month public-safety fee, or by cutting?",
    context:
      "The 2025–27 budget ($319,019,000) was adopted June 4, 2025 with the tax rate raised 8 cents to $4.489 per $1,000, the first increase since 2013, worth about $657,000 for a police officer and a code officer. The general-fund forecast still shows spending outrunning revenue every year through 2031, with the ending balance falling from $15.2 million to $7.8 million; the Community Safety Advancement Fee is $6.50 a month, about $1.27 million a year, and the commission reviewed restructuring it in February 2026.",
  },
  {
    id: "oc-caring-place",
    label: "Caring Place and exclusions",
    short: "Shelter hub",
    question: "Move the city’s Caring Court into the Caring Place services hub, and keep the downtown civil-exclusion zone?",
    context:
      "The Homeless Solutions Coalition’s Caring Place at 1516 Main Street, a $28–30 million hub for The Father’s Heart, LoveOne and county housing services, broke ground September 8, 2025; on May 20, 2026 the commission took up a memorandum to co-locate the city’s Caring Court there. On December 3, 2025 the commission adopted Ordinance 25-1016 creating a downtown civil exclusion zone, 5–0. The police budget holds 46 sworn officers.",
  },
  {
    id: "oc-urban-renewal",
    label: "Urban renewal’s future",
    short: "Urban renewal",
    question: "Keep the urban-renewal district (about $3.2 million a year in tax increment) and try again to loosen the charter’s voter-approval rule, or wind it down?",
    context:
      "Charter Section 59, adopted by voters in 2012, requires voter approval before the urban renewal agency borrows; voters rejected $44 million of borrowing in May 2023. In 2025 the agency, chaired by Commissioner Marl, weighed a new measure, repeal, closing the district (about $900,000 a year to the general fund) or a lawsuit, then set a 25% collection rate for 2026–27 and began selling agency-owned houses. A citizen petition for a charter office of city attorney got a ballot title in February 2026 but is not on this ballot.",
  },
  {
    id: "oc-abernethy-tolling",
    label: "Abernethy Bridge and tolls",
    short: "Bridge, tolls",
    question: "Give ODOT five more years, to 2031, to stage I-205 bridge work in two riverfront parks, and keep pressing the state to strike tolling from statute?",
    context:
      "Voters approved four years of temporary ODOT use of parts of Jon Storm Park and Sportcraft Landing in November 2018 (over 78% yes); that expires in September 2026, and ODOT asked in March for an extension to September 15, 2031, which the commission weighed May 20, 2026 with a letter of agreement on quarterly check-ins and local projects. On January 7, 2026 the commission voted 5–0 that tolling language should be permanently stricken from state statute.",
  },
  {
    id: "oc-pool-parks-bond",
    label: "Pool and parks bond",
    short: "Parks bond",
    question: "Ask voters for a parks bond to build a new aquatic center and rebuild the End of the Oregon Trail center?",
    context:
      "On February 18, 2026 the commission approved a $399,932 architecture contract for concept plans for both facilities, drawing $99,932 from an $8.6 million parks system-development-charge contingency; open houses ran in June 2026, and the 2027 community survey will ask which funding methods residents support. The commission’s budget chair listed a potential parks bond as a coming-biennium topic in May 2025; the pool is about 60 years old.",
  },
];

const ocStances: TopicStance[] = [
  /* ── Adam Marl (sitting commissioner running for mayor; the record first) ── */
  stance("adam-marl", "oc-data-center-moratorium", "supports", "Proposed the moratorium",
    "His site says he proposed a data-center moratorium so the city has strong protections that prioritize living-wage jobs on its remaining employment land; no moratorium ordinance has yet been published.",
    marlPriorities),
  stance("adam-marl", "oc-budget-gap", "mixed", "Moved budget, opposed rate",
    "Proposed a May 2025 framework to keep the tax rate flat by trimming DEI, adaptive-reuse and business-promotion budgets, then moved adoption of the budget at the higher $4.489 rate on June 4, 2025; his campaign says he opposed the increase.",
    ocMinJun4),
  stance("adam-marl", "oc-caring-place", "mixed", "Exclusion zone yes",
    "Voted yes December 3, 2025 on the downtown civil exclusion zone; in September 2025 said he was open to the city supporting the Caring Place but had “a hard time” with it seeking collaboration so late. Caring Court move unsaid.",
    ocDec3),
  stance("adam-marl", "oc-urban-renewal", "partial", "Sell agency houses",
    "Chairs the Urban Renewal Commission and voted January 7, 2026 to rezone two agency-owned houses so they can be sold; his site describes the agency’s focus as redeveloping underused public property. Charter Section 59 and closing the district are unsaid.",
    ocJan7),
  stance("adam-marl", "oc-abernethy-tolling", "supports", "Strike tolling, leverage ODOT",
    "Moved the January 7, 2026 motion that tolling language be permanently stricken from statute, passed 5–0; says that when ODOT sought five more years in the parks he made local projects relying on ODOT a condition.",
    ocJan7),
  stance("adam-marl", "oc-pool-parks-bond", "partial", "Community-led pool plan",
    "Says he will champion community involvement as the city decides upgrades to the pool and the End of the Oregon Trail center; his May 2025 budget framework listed a potential parks bond as a coming topic, without endorsing one.",
    marlPriorities),

  /* ── Damon Mabee ───────────────────────────────────────────────── */
  stance("damon-mabee", "oc-budget-gap", "partial", "Hard look at budget",
    "Says he feels tax and fee changes as a retiree on a fixed income and would take a hard look at the budget to find money for parks; raising the rate or fee, or what to cut, is unsaid.",
    pamphlet(37)),
  stance("damon-mabee", "oc-caring-place", "partial", "Active parks, no camps",
    "Says safe parks are active parks that do not become homeless camps or places where drug users congregate; the Caring Court move and the exclusion zone are unsaid.",
    pamphlet(37)),
  stance("damon-mabee", "oc-pool-parks-bond", "partial", "Parks top priority",
    "Calls parks his top priority and recalls helping keep the pool open in 2004 through budget savings; whether to ask voters for a parks bond is unsaid.",
    pamphlet(37)),

  /* ── Rodney La Barr ────────────────────────────────────────────── */
  stance("rodney-la-barr", "oc-budget-gap", "partial", "Parks without tax hikes",
    "Would reduce or eliminate unnecessary permits, fees and regulations and fund parks from new growth revenue “without raising taxes”; the property-tax rate, the $6.50 public-safety fee and any cuts are unsaid.",
    pamphlet(38)),
  stance("rodney-la-barr", "oc-caring-place", "partial", "Growth funds services",
    "Says economic growth funds the services and transitional housing needed to reduce homelessness; the Caring Court move and the exclusion zone are unsaid.",
    pamphlet(38)),
  stance("rodney-la-barr", "oc-abernethy-tolling", "partial", "Against I-205 tolling",
    "Says everyone on both ends of I-5, in Oregon or Washington, should be against “any I-205 tolling nonsense”; the five-year park extension is unsaid.",
    pamphlet(38)),
  stance("rodney-la-barr", "oc-pool-parks-bond", "partial", "Fund parks, no taxes",
    "Would create funding to reinvigorate city parks from growth revenue without raising taxes; a parks bond is unsaid.",
    pamphlet(38)),

  /* ── Betty Mumm ────────────────────────────────────────────────── */
  stance("betty-mumm", "oc-budget-gap", "partial", "Careful review of costs",
    "Says proposals that increase residents’ financial burden deserve careful review and taxpayer dollars must be spent wisely while protecting essential services; the rate, the fee and any cuts are unsaid.",
    pamphlet(39)),
  stance("betty-mumm", "oc-caring-place", "partial", "Report Father’s Heart costs",
    "Asked the commission October 15, 2025 to report the police hours spent on calls at The Father’s Heart so the Caring Place could see how much has been spent; the Caring Court move and the exclusion zone are unsaid.",
    ocMummTestimony),

  /* ── James Nicita ──────────────────────────────────────────────── */
  stance("james-nicita", "oc-data-center-moratorium", "partial", "No to data centers",
    "Says “No to data centers” alongside yes to historic preservation, and would make the North End a solar-generation district; a temporary moratorium while the code is rewritten is unsaid.",
    pamphlet(39)),
  stance("james-nicita", "oc-budget-gap", "partial", "Restore renewal dollars",
    "Would fully fund police by restoring tax dollars diverted to urban renewal; the tax rate, the $6.50 fee and any cuts are unsaid.",
    pamphlet(39)),
  stance("james-nicita", "oc-urban-renewal", "opposes", "Keep voter approval",
    "Wrote the 2012 right-to-vote amendment and says he led the 2023 and 2025 opposition to agency plans to extinguish it; if urban renewal continues, would prioritize small citizen-designed projects. Closing the district is unsaid.",
    pamphlet(39)),
  stance("james-nicita", "oc-pool-parks-bond", "partial", "Metro partnership for parks",
    "Wants first-rate parks and a partnership with Metro to make Water Board Park a regional park; a bond for the pool and the trail center is unsaid.",
    pamphlet(39)),

  /* ── Paul Espe ─────────────────────────────────────────────────── */
  // Not a stance: a general value or goal that does not reach this choice; left as a gap.
  stance("paul-espe", "oc-pool-parks-bond", "partial", "Improve parks services",
    "Would maintain, improve and increase existing services including public parks; a bond for the pool and the trail center is unsaid.",
    pamphlet(40)),

  /* ── Gordon J Lawrence ─────────────────────────────────────────── */
  stance("gordon-j-lawrence", "oc-budget-gap", "partial", "Tax base through development",
    "Says the city cannot fund services without a tax base and cannot build one by blocking development; the rate, the fee and any cuts are unsaid.",
    lawrenceAbout),
  stance("gordon-j-lawrence", "oc-caring-place", "partial", "Strengthen services",
    "Would pursue solutions that improve housing opportunities and strengthen services and community resources for people who are homeless; the Caring Court move and the exclusion zone are unsaid.",
    pamphlet(40)),
  stance("gordon-j-lawrence", "oc-pool-parks-bond", "partial", "More attention to parks",
    "Would give more attention to parks, recreation and the city’s natural assets; a bond for the pool and the trail center is unsaid.",
    pamphlet(40)),
];

const ocItems: RaceStakes["items"] = [
  {
    label: "Deficits every year",
    text:
      "The 2025–27 budget’s general-fund forecast shows spending exceeding revenue in every year from FY 2026 ($624,400) through FY 2031 ($1.5 million), with the ending balance falling from $15,191,400 to $7,781,800; the Budget Committee heard in April 2025 that the fund was “structurally imbalanced regardless” and that a hiring freeze was in place.",
    source: ocBudget,
  },
  {
    label: "Tax rate and fee",
    text:
      "The 2025–27 rate is $4.489 per $1,000, an $0.08 increase worth about $657,000 that paid for one police officer and one code officer, the first increase since 2013; each 10 cents raises about $500,000 a year. The $6.50-a-month Community Safety Advancement Fee brings in about $1.27 million a year, and staff flagged new revenue as a future discussion in February 2026.",
    source: ocFee,
  },
  {
    label: "46 sworn officers",
    text:
      "Police is the general fund’s largest department at $30.0 million, 44% of spending, with 46 sworn and 15 non-sworn positions; the police union told the Budget Committee in April 2025 that no full-time patrol position had been added since 2017.",
    source: ocBudget,
  },
  {
    label: "$12.5 million riverwalk",
    text:
      "The city holds a $12.5 million state lottery-bond grant for a riverwalk the Confederated Tribes of Grand Ronde design and build on their 23-acre former Blue Heron mill site, with the first segment between 3rd and 4th streets under way since a May 28, 2026 groundbreaking; if public access ever lapses and the state claws back money, the city and tribe repay equally.",
    source: ocRiverwalk,
  },
  {
    label: "Urban renewal’s future",
    text:
      "The urban-renewal district takes in about $3.2 million a year in tax increment; closing it would return about $900,000 a year to the general fund. Voters rejected $44 million of agency borrowing in May 2023 under Charter Section 59, and in 2025 the agency weighed a new measure, repeal, closure or litigation before settling on a 25% collection rate and property sales.",
    source: ocUrbanRenewal,
  },
  {
    label: "Caring Place opens",
    text:
      "The Homeless Solutions Coalition’s $28 million Caring Place at 1516 Main Street will house The Father’s Heart, LoveOne and county housing access; the city estimated $613,793.75 in development charges, and on May 20, 2026 the commission considered a memorandum to move its Caring Court there. The outcome is not yet in published minutes.",
    source: ocCaringPlace,
  },
];
const ocStakes: RaceStakes[] = [
  {
    raceId: "oregon-city-mayor",
    intro:
      "Oregon City’s mayor presides over a five-member commission that adopts a two-year budget ($319,019,000 for 2025–27), sets the tax rate within the charter limit and the public-safety fee, sits as the urban renewal agency, and directs the city manager. The next term must close a general fund that runs a deficit every year of the forecast, decide the urban-renewal district’s future and whether to ask voters for a parks bond, and see the Willamette Falls riverwalk built.",
    items: ocItems,
  },
  {
    raceId: "oregon-city-commission",
    intro:
      "An Oregon City commissioner is one of five votes on a two-year budget ($319,019,000 for 2025–27), the tax rate and the $6.50 public-safety fee, urban renewal and downtown rules, and the hiring of the city manager. Two seats are open at once; the winners join a commission whose general fund runs a deficit every year of the forecast, with the urban-renewal district’s future, a possible parks bond and the Willamette Falls riverwalk ahead.",
    items: ocItems,
  },
];

const topics: RaceTopics[] = [
  { raceIds: ["lake-oswego-council"], topics: loTopics },
  { raceIds: ["oregon-city-mayor", "oregon-city-commission"], topics: ocTopics },
];
const topicStances: TopicStance[] = [...loStances, ...ocStances];
const stakes: RaceStakes[] = [...loStakes, ...ocStakes];

/* ── Assembly ───────────────────────────────────────────────────────── */
export const pack: RacePack = {
  ...emptyPack(),
  topics,
  topicStances,
  stakes,
  analysis: { ...loAnalysis, ...ocMayorAnalysis, ...ocCommAnalysis },
  lines: [...loLines, ...ocMayorLines, ...ocCommLines],
  chips: [...loChips, ...ocMayorChips, ...ocCommChips],
  deliveries: [...loDeliveries, ...ocMayorDeliveries, ...ocCommDeliveries],
  ownWords: [...loOwnWords, ...ocMayorOwnWords, ...ocCommOwnWords],
  contacts: [...loContacts, ...ocMayorContacts, ...ocCommContacts],
  roles: loRoles,
  primary: [...loPrimary, ...ocMayorPrimary, ...ocCommPrimary],
  ballots: [
    {
      raceId: "lake-oswego-council",
      text: "You vote for up to four candidates for four seats; the top three receive four-year terms and the fourth a two-year term.",
      source: electionsPage,
    },
    { raceId: "oregon-city-mayor", text: "You vote for one candidate.", source: electionsPage },
    {
      raceId: "oregon-city-commission",
      text: "Two seats; follow the instruction printed on your ballot.",
      source: electionsPage,
    },
  ],
  /* City-wide seats: the city name is enough, so no district line. */
  districts: [],
  choice: [
    {
      raceId: "lake-oswego-council",
      text: "Six candidates for four seats with different term lengths. Compare how each would meet state housing requirements, hold infrastructure costs, keep neighborhood character and widen access to city services.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "oregon-city-mayor",
      text: "Three approaches: parks funded by reworking the current budget; housing, safety and roads with property taxes held flat; and lower permit and fee costs so growth pays for services. Compare each plan’s funding source.",
      from: "race.comparison",
      ...reviewed,
    },
    {
      raceId: "oregon-city-commission",
      text: "Two seats. The candidates differ on urban renewal, business incentives, parks and how City Hall is run. Compare the mechanism and the funding behind each promise.",
      from: "race.comparison",
      ...reviewed,
    },
  ],
  portraits: {
    "bryan-guiney": portrait("bryan-guiney", 29),
    "suzanne-miles": portrait("suzanne-miles", 30),
    "peren-tiemann": portrait("peren-tiemann", 31),
    "neil-tunmore": portrait("neil-tunmore", 31),
    "heather-ramsey": portrait("heather-ramsey", 32),
    "patrick-walsh": portrait("patrick-walsh", 30),
    "damon-mabee": portrait("damon-mabee", 37),
    "adam-marl": portrait("adam-marl", 37),
    "rodney-la-barr": portrait("rodney-la-barr", 38),
    "betty-mumm": portrait("betty-mumm", 39),
    "james-nicita": portrait("james-nicita", 39),
    "paul-espe": portrait("paul-espe", 40),
    "gordon-j-lawrence": portrait("gordon-j-lawrence", 40),
  },
  /* Walsh’s brief carries a “missing” note from the Multnomah-only review; his Clackamas statement is used above, so no row state is set. */
  missing: {},
  /** Research gap closed since September 18 by the candidate's pamphlet statement; see the research log. */
  profiles: {
    "patrick-walsh": {
      background: "Nonprofit executive and library board chair; his statement appears in the Clackamas County pamphlet.",
      summary: "His pamphlet statement runs on quiet, steady governance: balanced budgets with predictable costs, new homes directed to areas with existing infrastructure, well-equipped emergency services and protected tree canopy and watersheds.",
      priorities: [
        "Meet state housing requirements where infrastructure already exists, with design standards and tree preservation.",
        "Keep budgets balanced, costs predictable and every fee, bond and levy explained.",
        "Protect tree canopy and watersheds and calm cut-through traffic with data-driven fixes.",
      ],
      question: "What would you cut or defer if costs rise faster than revenue?",
    },
  },
};
