import type { Evidence } from "../../../types";
import type {
  CandidateAnalysis,
  CandidateContact,
  ContactChannel,
  Delivery,
  DeliveryStep,
  IssueLine,
  StanceChip,
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
          "Would invest in infrastructure and mobility to improve traffic, safety and connectivity, with clean energy and environmental stewardship built into major decisions.",
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
          "Would keep prioritizing mental-health first responders, build on community policing, and expand emergency preparedness.",
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
          "Would implement state housing mandates in ways that conform to Lake Oswego’s building standards and keep neighborhood character.",
        source: pamphlet(31),
      },
      money: {
        position:
          "Would spend tax dollars only where they add value and manage the money for the North Anchor, fire station, sewer plant and library so they land on budget and on time.",
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
          "Would keep budgets balanced and costs predictable, prioritize core infrastructure, and explain every fee, bond and levy clearly.",
        source: pamphlet(30),
      },
      climate: {
        position:
          "Would protect tree canopy and watersheds, invest in sustainable infrastructure, and calm cut-through traffic and speeding with data-driven fixes.",
        source: pamphlet(30),
      },
    },
    sources: [pamphlet(30), walshPlatform],
  },
};

const loLines: IssueLine[] = [
  line("bryan-guiney", "housing", "Focuses new density in centers and corridors, not across established neighborhoods."),
  line("bryan-guiney", "money", "Keeps the budget balanced with long-range planning and controlled project scope."),
  line("bryan-guiney", "climate", "Invests in mobility and infrastructure, with clean energy built into major decisions."),
  line("suzanne-miles", "safety", "Supports local police and firefighters to keep the community safe."),
  line("suzanne-miles", "climate", "Nurtures natural resources to keep Lake Oswego green."),
  line("peren-tiemann", "housing", "Adds housing options for renters, seniors and first-time buyers via subsidies, incentives."),
  line("peren-tiemann", "safety", "Keeps mental-health first responders a priority; builds on community policing."),
  line("peren-tiemann", "money", "Keeps city budgeting realistic and sound; keeps costs of living low."),
  line("peren-tiemann", "climate", "Expands transit, bike and walking options with TriMet and community shuttles."),
  line("neil-tunmore", "housing", "Implements state housing mandates within Lake Oswego’s building standards and character."),
  line("neil-tunmore", "money", "Holds North Anchor, fire station, sewer plant and library to budget and schedule."),
  line("neil-tunmore", "climate", "Makes school walking routes safer; plans for growth, cars and new transportation."),
  line("heather-ramsey", "housing", "Balances state housing mandates with local needs and community character."),
  line("heather-ramsey", "safety", "Supports police, fire and emergency preparedness."),
  line("heather-ramsey", "money", "Keeps infrastructure projects on time and on budget; guides Foothills and library plans."),
  line("heather-ramsey", "climate", "Safeguards parks and waterways through environmental stewardship."),
  line("patrick-walsh", "housing", "Directs new homes to areas with existing infrastructure; keeps design standards, trees."),
  line("patrick-walsh", "safety", "Gives police, fire and medical teams the staffing and equipment for rapid response."),
  line("patrick-walsh", "money", "Keeps budgets balanced, costs predictable; explains every fee, bond and levy."),
  line("patrick-walsh", "climate", "Protects tree canopy and watersheds; calms cut-through traffic with data."),
];

const loChips: StanceChip[] = [
  chip("bryan-guiney", "housing", "Density in centers"),
  chip("bryan-guiney", "money", "Budget in the black"),
  chip("bryan-guiney", "climate", "Mobility, clean energy"),
  chip("suzanne-miles", "safety", "Back police and fire"),
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
  chip("patrick-walsh", "climate", "Tree canopy, calm traffic"),
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
          "Would take a hard look at the city budget to find money to fix the park system, through cost savings rather than new revenue.",
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
          "Would create affordable housing by cutting permits, fees and regulations so builders can produce homes of all types, from ADUs (backyard cottages) to apartments.",
        source: pamphlet(38),
      },
      safety: {
        position:
          "Would reduce crime and homelessness through economic growth: active areas deter crime, and growth revenue funds services and transitional housing.",
        source: pamphlet(38),
      },
      money: {
        position:
          "Would cut permit and business fees, and fund parks from the growth revenue that follows, without raising taxes.",
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
  line("damon-mabee", "money", "Finds money for parks through budget cost savings, not new revenue."),
  line("adam-marl", "housing", "Encourages starter homes for homeownership; works regionally to connect homeless people with services."),
  line("adam-marl", "safety", "Funds police, behavioral health and youth substance-abuse programs; keeps public spaces clean."),
  line("adam-marl", "money", "Holds the line on property taxes; pushes lower residential utility fees."),
  line("adam-marl", "climate", "Fixes potholes, builds safe routes to school, opposes tolling."),
  line("rodney-la-barr", "housing", "Cuts permits, fees and regulations so builders produce homes of all types."),
  line("rodney-la-barr", "safety", "Reduces crime and homelessness through growth: active areas, revenue for services."),
  line("rodney-la-barr", "money", "Cuts permit and business fees; funds parks from growth revenue, no tax increase."),
  line("rodney-la-barr", "climate", "Opposes any tolling of I-205."),
];

const ocMayorChips: StanceChip[] = [
  chip("damon-mabee", "safety", "Active, maintained parks"),
  chip("damon-mabee", "money", "Budget savings for parks"),
  chip("adam-marl", "housing", "Starter homes"),
  chip("adam-marl", "safety", "Police, behavioral health"),
  chip("adam-marl", "money", "No property-tax increase"),
  chip("adam-marl", "climate", "Potholes, safe routes"),
  chip("rodney-la-barr", "housing", "Cut fees and permits"),
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
          "Would redirect urban-renewal tax dollars to police or to small citizen-designed projects, and keep residents’ right to vote on urban renewal.",
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
          "Would fund services by growing the tax base, removing barriers to business and welcoming development rather than blocking it.",
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
  line("james-nicita", "money", "Redirects urban-renewal money to police or small citizen-designed projects."),
  line("james-nicita", "climate", "Opposes data centers; creates a North End solar district; builds Holly Lane Connector."),
  line("paul-espe", "safety", "Strengthens the city’s existing disaster-preparedness program."),
  line("paul-espe", "money", "Grows the tax base with business incentives; fills vacant buildings with taxpaying businesses."),
  line("paul-espe", "climate", "Protects the city’s natural resources."),
  line("gordon-j-lawrence", "housing", "Pursues more housing opportunities and stronger services for homeless people."),
  line("gordon-j-lawrence", "money", "Funds services by growing the tax base; removes barriers to business."),
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

/* ── Assembly ───────────────────────────────────────────────────────── */
export const pack: RacePack = {
  ...emptyPack(),
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
