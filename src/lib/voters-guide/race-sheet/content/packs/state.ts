import type { Evidence } from "../../../types";
import type { OwnWords } from "../own-words";
import {
  emptyPack,
  type BallotInstruction,
  type CandidateAnalysis,
  type CandidateContact,
  type ChoiceParagraph,
  type ContactChannel,
  type Delivery,
  type DeliveryStep,
  type IssueLine,
  type RacePack,
  type StanceChip,
} from "../../types";
import type { IssueId } from "../../issues";

/**
 * Race pack: state offices (Governor of Oregon). Researched September 21,
 * 2026 to the council standard; see the RacePack contract in ../../types.ts.
 *
 * Sources. The state voters' pamphlet is not published until September 29,
 * but the Secretary of State posted every candidate statement as filed on
 * September 9, 2026 (one PDF, "2026 General Election, Candidate Statements").
 * Those statements are each candidate's official own words and are cited by
 * PDF page; the campaign sites supply the detail behind them. Every position
 * below comes from the candidate's own statement or site, never from party,
 * endorsements or silence. Gaps are gaps.
 *
 * Venues reviewed September 21, 2026:
 *   https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf (pp. 31–36)
 *   https://www.tinafororegon.com/  ·  /oregons-future/  ·  /meet-tina/  ·  /get-involved/
 *   https://www.christinefororegon.com/  ·  /drazan-plan/  ·  /about/  ·  /get-involved/
 *   https://brett-smith.us/  (single page: plan, About me, contact)
 *   https://kepw-wholecommunity.news/2026/08/07/meet-the-candidate-brett-smith-for-oregon-governor/
 *   ORESTAR filing cfRsn=25615 (Smith; lists brett-smith.us)
 */

const STATEMENTS =
  "https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf";

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;

/** The candidate's voters' pamphlet statement as filed with the Secretary of State. */
const statement = (page: number, note: string = NOTE): Evidence => ({
  label: `Oregon voters’ pamphlet candidate statement · PDF page ${page}`,
  url: `${STATEMENTS}#page=${page}`,
  kind: "Candidate statement",
  date: "Filed for the November 2026 pamphlet; posted by the Secretary of State September 9, 2026; reviewed September 21, 2026",
  note,
});

const site = (label: string, url: string, note: string = NOTE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 21, 2026",
  note,
});

const step = (text: string, source: Evidence): DeliveryStep => ({ text, source });

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

const delivery = (
  candidateId: string,
  issue: IssueId,
  rungs: { how?: DeliveryStep; measure?: DeliveryStep } = {},
): Delivery => ({ candidateId, issue, ...rungs, ...reviewed });

type From = ContactChannel["from"];
const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});
const email = (address: string, from: From): ContactChannel => ({
  url: `mailto:${address}`,
  label: address,
  kind: "email",
  from,
});
const phone = (digits: string, label: string, from: From): ContactChannel => ({
  url: `tel:+1${digits}`,
  label,
  kind: "phone",
  from,
});
const form = (url: string, label: "Contact form" | "Volunteer form", from: From): ContactChannel => ({
  url,
  label,
  kind: "form",
  from,
});
const social = (label: string, url: string, from: From): ContactChannel => ({ url, label, kind: "social", from });
const contact = (
  candidateId: string,
  channels: ContactChannel[],
  sources: Evidence[],
  none?: string,
): CandidateContact => ({ candidateId, channels, ...(none ? { none } : {}), sources, reviewedOn: REVIEWED_ON });

const ownWords = (
  candidateId: string,
  text: string,
  source: OwnWords["source"],
  rule: OwnWords["rule"],
): OwnWords => ({
  candidateId,
  text,
  source,
  rule,
  words: text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length,
});

const statementOpening = (page: number, note: string): OwnWords["source"] => ({
  label: `Oregon voters’ pamphlet candidate statement · PDF page ${page}`,
  url: `${STATEMENTS}#page=${page}`,
  kind: "Candidate statement",
  date: "Filed for the November 2026 pamphlet; posted by the Secretary of State September 9, 2026; extracted September 21, 2026",
  note,
});

/* ── Sources reused across entries ───────────────────────────────────── */

const kotekStatement = statement(33);
const kotekPlatform = site("Kotek · second-term platform", "https://www.tinafororegon.com/oregons-future/");
const drazanStatement = statement(35);
const drazanPlan = site("Drazan · policy plan", "https://www.christinefororegon.com/drazan-plan/");
const smithStatement = statement(31);
const smithSite = site("Smith · the Oregon plan", "https://brett-smith.us/");
const smithInterview: Evidence = {
  label: "KEPW · interview with Brett Smith",
  url: "https://kepw-wholecommunity.news/2026/08/07/meet-the-candidate-brett-smith-for-oregon-governor/",
  kind: "Candidate statement",
  date: "August 7, 2026; reviewed September 21, 2026",
  note: NOTE,
};

/* ── Analysis ────────────────────────────────────────────────────────── */

const analysis: Record<string, CandidateAnalysis> = {
  "christine-drazan": {
    values: ["Lower state-imposed costs", "Results accountability"],
    tradeoff:
      "Vetoing taxes and repealing the Climate Protection Program lower costs the state imposes, but also revenue and emissions rules; the plan's projected savings and the outcomes it promises still need evidence.",
    issues: {
      housing: {
        position:
          "Would set a 120-day maximum decision period for qualifying housing projects, limit repetitive appeals, expand private plan review, simplify commercial-to-housing conversions, create a state Housing Permit Command Center, and expand first-time-buyer credits and down-payment help from existing funds.",
        source: drazanPlan,
      },
      safety: {
        position:
          "Would audit homelessness and addiction spending, shift state money to recovery-focused programs, end funding for programs she says enable addiction, fully fund state police, let local governments clear public spaces and raise penalties for drug traffickers.",
        source: drazanPlan,
      },
      money: {
        position:
          "Would order agencies on day one to repeal rules and fees that raise costs, veto new taxes and fees, raise the standard deduction, reform the corporate activity and estate taxes, cut property taxes for seniors and veterans, and protect the kicker.",
        source: drazanPlan,
      },
      climate: {
        position:
          "Would repeal the Climate Protection Program executive order, favor existing generation, more transmission and technology-neutral energy with commissioners focused on lowest-cost power, and require community benefit agreements and farmland protection for data centers.",
        source: drazanPlan,
      },
    },
    sources: [drazanStatement, drazanPlan],
  },
  "tina-kotek": {
    values: ["Expanded public services", "Guardrails on data centers"],
    tradeoff:
      "Universal preschool, more classroom time and faster housing production all need recurring money; the reviewed platform sets goals and conditions but not the budget that pays for them or what would be reduced.",
    issues: {
      housing: {
        position:
          "Would cut red tape to speed construction, expand options for renters and first-time buyers, and grow starter-home development and down-payment assistance; cites the housing emergency she declared and added shelter and treatment beds.",
        source: kotekStatement,
      },
      safety: {
        position:
          "Opposes ICE detention facilities in Oregon and the use of automated license-plate readers or cameras for immigration enforcement, cites blocking a National Guard deployment in Portland, and would keep expanding mental-health and addiction treatment capacity.",
        source: kotekPlatform,
      },
      money: {
        position:
          "Would ban pricing schemes that charge people differently based on personal data, crack down on hidden fees, stop AI-based insurance claim denials, keep data-center energy costs off residential bills, and fight federal tariffs and SNAP cuts.",
        source: kotekPlatform,
      },
      climate: {
        position:
          "Supports a moratorium on new data centers until statewide standards prevent rate hikes, require clean energy and protect air and water; would maintain the commitment to a clean-energy future and climate-resilience investment.",
        source: kotekPlatform,
      },
    },
    sources: [kotekStatement, kotekPlatform],
  },
  "brett-smith": {
    values: ["Anti-corruption", "Limits on federal war powers"],
    tradeoff:
      "His plans use state offices and the Port of Portland to constrain federal war policy and large employers; their legal reach and the revenue projections rest on the campaign's own modeling.",
    issues: {
      safety: {
        position:
          "Would bolster the volunteer Oregon Civil Defense Force, which he describes as a way to respond when federal agents act without a judge's warrant and to help with wildfires, and bars what he calls unconstitutional surveillance.",
        source: smithStatement,
      },
      money: {
        position:
          "Would impose a wage-gap surcharge on employers with 50 or more workers paying below a living wage and direct the revenue to the Oregon Health Plan and food assistance, order an independent audit of state systems and the tax code, and shift subsidies from corporations to local businesses and ranchers.",
        source: smithSite,
      },
      climate: {
        position: "Would impose a permanent moratorium on data centers.",
        source: smithStatement,
      },
    },
    sources: [smithStatement, smithSite, smithInterview],
  },
};

/* ── Lines and chips (alphabetical by displayed name, then by issue) ──── */

const lines: IssueLine[] = [
  line("christine-drazan", "housing", "Would cap housing permit decisions at 120 days and allow private plan reviewers."),
  line("christine-drazan", "safety", "Would audit homelessness spending, fund recovery over low-barrier shelter, let cities clear public spaces."),
  line("christine-drazan", "money", "Would veto new taxes, raise the standard deduction, reform corporate and estate taxes."),
  line("christine-drazan", "climate", "Would repeal the Climate Protection Program (state carbon limits) and seek lowest-cost power."),

  line("tina-kotek", "housing", "Would cut red tape to build homes faster, with starter homes and down-payment help."),
  line("tina-kotek", "safety", "Opposes ICE detention sites in Oregon; more treatment beds for addiction and mental health."),
  line("tina-kotek", "money", "Would ban personal-data pricing and hidden fees, keep data-center power costs off household bills."),
  line("tina-kotek", "climate", "Would pause new data centers until statewide standards protect ratepayers and require clean energy."),

  line("brett-smith", "safety", "Would expand the volunteer Oregon Civil Defense Force and bar unconstitutional surveillance."),
  line("brett-smith", "money", "Would charge large employers paying below a living wage, funding health and food aid."),
  line("brett-smith", "climate", "Would permanently ban new data centers in Oregon."),
];

const chips: StanceChip[] = [
  chip("christine-drazan", "housing", "120-day permit limit"),
  chip("christine-drazan", "safety", "Recovery first, audits"),
  chip("christine-drazan", "money", "Veto new taxes"),
  chip("christine-drazan", "climate", "Repeal carbon program"),

  chip("tina-kotek", "housing", "Faster homebuilding"),
  chip("tina-kotek", "safety", "No ICE detention sites"),
  chip("tina-kotek", "money", "Ban hidden fees"),
  chip("tina-kotek", "climate", "Pause new data centers"),

  chip("brett-smith", "safety", "Civil Defense Force"),
  chip("brett-smith", "money", "Wage-gap surcharge"),
  chip("brett-smith", "climate", "Permanent data-center ban"),
];

/* ── Promise ladders ─────────────────────────────────────────────────── */

const deliveries: Delivery[] = [
  delivery("christine-drazan", "housing", {
    how: step(
      "A 120-day maximum decision period, limits on repetitive appeals, private plan reviewers when backlogs grow, a Housing Permit Command Center for concurrent agency reviews, a statewide library of pre-approved plans, and first-time-buyer credits from existing funds.",
      drazanPlan,
    ),
    measure: step(
      "Says success is measured by actual units built, not by money spent or projects announced; no unit number or date is given.",
      drazanPlan,
    ),
  }),
  delivery("christine-drazan", "safety", {
    how: step(
      "A full audit of homeless and addiction spending, rule and grant changes shifting money to recovery programs, fully funded state police, higher trafficker penalties and a declared addiction and mental-health emergency.",
      drazanPlan,
    ),
    measure: step(
      "Success measured by how many people move from homelessness into recovery, treatment and permanent stability rather than by dollars spent; no number or date is given.",
      drazanPlan,
    ),
  }),
  delivery("christine-drazan", "money", {
    how: step(
      "A day-one executive order directing every agency to identify rules and fees that raise costs, an affordability review with published findings before new rules, vetoes of tax and fee increases, and tax changes through the Legislature.",
      drazanPlan,
    ),
    measure: step(
      "An annual Cost of Government Report and a public scorecard tracking permit timelines, energy costs, housing production and job growth; no savings figure is stated.",
      drazanPlan,
    ),
  }),
  delivery("christine-drazan", "climate", {
    how: step(
      "Rescind the Climate Protection Program executive order, appoint utility commissioners focused on reliability and lowest-cost power, expand transmission, and require data centers to sign community benefit agreements.",
      drazanPlan,
    ),
  }),

  delivery("tina-kotek", "housing", {
    how: step(
      "Cut red tape to expedite construction, expand starter-home development and down-payment assistance programs, and set enforceable statewide permitting timelines.",
      kotekPlatform,
    ),
    measure: step(
      "Points to housing starts up 11.3% (outpacing the nation, she says), more than 6,200 shelter beds and nearly 26,000 households kept housed as the results so far; no second-term target is stated.",
      kotekPlatform,
    ),
  }),
  delivery("tina-kotek", "safety", {
    how: step(
      "Bar automated license-plate readers and cameras from immigration enforcement, oppose ICE detention facilities, direct state agencies to uphold sanctuary protections, and grow the behavioral-health workforce.",
      kotekPlatform,
    ),
    measure: step(
      "Cites more than 1,660 new treatment beds, a 45% increase in adult treatment capacity, as the result so far; no target for the next term is named.",
      kotekPlatform,
    ),
  }),
  delivery("tina-kotek", "money", {
    how: step(
      "Legislation banning data-based price discrimination and hidden fees and prohibiting AI-driven insurance denials; cites the POWER Act she signed to make data centers pay their share of energy costs.",
      kotekPlatform,
    ),
  }),
  delivery("tina-kotek", "climate", {
    how: step(
      "A statewide prohibition on new data-center development until standards prevent rate hikes, require clean-energy production and protect air and water; a Climate Resilience Investment Act she cites as signed.",
      kotekPlatform,
    ),
    measure: step(
      "A goal to protect 10% more of Oregon's most climate-resilient lands and waters over the next decade; no emissions or rate target is stated.",
      kotekPlatform,
    ),
  }),

  delivery("brett-smith", "safety", {
    how: step(
      "Grow the volunteer force so the state has a realistic way to respond when federal agents act without a judge's warrant, and use it for wildfire and evacuation help.",
      smithInterview,
    ),
  }),
  delivery("brett-smith", "money", {
    how: step(
      "A surcharge on employers with 50-plus workers, scaled from 0% at the living wage to 100% at the minimum wage and phased in over four years; 50% of revenue to the Oregon Health Plan, 30% to SNAP.",
      smithSite,
    ),
    measure: step(
      "Campaign modeling projects $700 million to $3.4 billion a year recovered, with the full rate across all employer tiers by year four.",
      smithSite,
    ),
  }),
  delivery("brett-smith", "climate"),
];

/* ── In their words ──────────────────────────────────────────────────── */

const ownWordsEntries: OwnWords[] = [
  ownWords(
    "christine-drazan",
    "Christine Drazan will make government work for the people of Oregon so our state is a place where families can afford to put down roots, find a good-paying job, receive a world-class education and feel safe in their neighborhoods.",
    statementOpening(
      35,
      "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the heading “OREGONIANS DESERVE LEADERSHIP THAT PUTS THEM FIRST”, a quotation attributed “–Christine Drazan”, and the heading “DELIVERING ACCOUNTABILITY AND RESULTS”.",
    ),
    "pamphlet-opening",
  ),
  ownWords(
    "tina-kotek",
    "Tina Kotek has never been satisfied with the status quo. She started her career at Oregon Food Bank because she believes no one should go hungry.",
    statementOpening(
      33,
      "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the slogan “Fighting for Us. Always.” (no predicate). The first sentence is under 12 words, so the first two are shown.",
    ),
    "pamphlet-opening",
  ),
  ownWords(
    "brett-smith",
    "It’s you that will make or break this race. It’s you that will challenge the status quo.",
    statementOpening(
      31,
      "Verbatim opening of the candidate's own statement; publication by the state does not verify the claims. Skipped before it: the headings “The Protest Vote”, “Protest”, “Vote” and the salutation “To Independents, third-party and unaffiliated.” (no predicate). The first sentence is under 12 words, so the first two are shown.",
    ),
    "pamphlet-opening",
  ),
];

/* ── Reaching the campaign ───────────────────────────────────────────── */

const contacts: CandidateContact[] = [
  contact(
    "christine-drazan",
    [
      web("https://www.christinefororegon.com/", "pamphlet"),
      email("info@christinefororegon.com", "site"),
      phone("5034068329", "(503) 406-8329", "site"),
      social("Facebook", "https://www.facebook.com/ChristineforOregon/", "site"),
      social("X", "https://x.com/ChristineDrazan", "site"),
      social("Instagram", "https://www.instagram.com/christine4oregon/", "site"),
      social("YouTube", "https://www.youtube.com/channel/UCzj0___2WruvJsMn3KZkCDw", "site"),
      social("TikTok", "https://www.tiktok.com/@christine.drazan", "site"),
    ],
    [
      statement(35, "Prints www.ChristineForOregon.com and www.TheDrazanPlan.com."),
      site(
        "Drazan · site footer and header",
        "https://www.christinefororegon.com/",
        "The footer prints the email (behind a scraper shield) and “Phone: (503) 406-8329”; the phone link behind that printed number dials 503-908-9694, so the printed number is recorded. Profile links are in the header.",
      ),
    ],
  ),
  contact(
    "tina-kotek",
    [
      web("https://www.tinafororegon.com/", "pamphlet"),
      email("info@tinafororegon.com", "site"),
      phone("9713850565", "(971) 385-0565", "site"),
      social("Facebook", "https://www.facebook.com/Tina4Oregon/", "site"),
      social("X", "https://twitter.com/TinaKotek", "site"),
      social("Instagram", "https://www.instagram.com/tina4oregon/", "site"),
    ],
    [
      statement(33, "Prints TinaforOregon.com."),
      site(
        "Kotek · site footer",
        "https://www.tinafororegon.com/",
        "The footer prints the campaign email, a PO box and the phone; profile links are in the header. The site returned 403 to plain curl and was read with a browser user agent.",
      ),
    ],
  ),
  contact(
    "brett-smith",
    [
      web("https://brett-smith.us/", "pamphlet"),
      email("contact@brett-smith.us", "site"),
      phone("5038263412", "(503) 826-3412", "site"),
      form("https://brett-smith.us/", "Contact form", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61561686027648", "site"),
      social("X", "https://x.com/Brett_Smith_D5", "site"),
    ],
    [
      statement(31, "Prints brett-smith.us."),
      site(
        "Smith · single-page site, contact section",
        "https://brett-smith.us/",
        "The contact section holds a form, a PO box, “P: (503) 826-3412” and contact@brett-smith.us. The Instagram and TikTok icons link to those platforms' home pages, not a profile, so they are not listed. His state filing lists bsmith@brett-smith.us; the address the site prints is recorded.",
      ),
    ],
  ),
];

/* ── Race-level entries ──────────────────────────────────────────────── */

const votingPage: Evidence = {
  label: "Oregon Secretary of State · Voting in Oregon",
  url: "https://sos.oregon.gov/voting/Pages/default.aspx",
  kind: "Election authority",
  date: "Checked September 21, 2026",
};

const ballots: BallotInstruction[] = [
  { raceId: "oregon-governor", text: "You vote for one candidate.", source: votingPage },
];

const choice: ChoiceParagraph[] = [
  {
    raceId: "oregon-governor",
    text: "Compare the mechanisms as well as the goals: expanded childcare, preschool and housing production with new data-center standards; tax, fee and regulatory cuts with stricter accountability for services; and state limits on participation in unauthorized wars. Ask what each would cost and who pays.",
    from: "race.comparison",
    ...reviewed,
  },
];

export const pack: RacePack = {
  ...emptyPack(),
  analysis,
  lines,
  chips,
  deliveries,
  ownWords: ownWordsEntries,
  contacts,
  roles: [],
  primary: [
    { candidateId: "christine-drazan", sourceUrl: `${STATEMENTS}#page=35` },
    { candidateId: "tina-kotek", sourceUrl: `${STATEMENTS}#page=33` },
    { candidateId: "brett-smith", sourceUrl: `${STATEMENTS}#page=31` },
  ],
  ballots,
  districts: [],
  choice,
  portraits: {
    "christine-drazan": {
      src: "/images/voters-guide/2026/christine-drazan.webp",
      sourceUrl: "https://www.christinefororegon.com/about/",
      credit: "Campaign photo · christinefororegon.com",
      reviewed: REVIEWED_ON,
    },
    "tina-kotek": {
      src: "/images/voters-guide/2026/tina-kotek.webp",
      sourceUrl: "https://www.tinafororegon.com/meet-tina/",
      credit: "Campaign photo · tinafororegon.com",
      reviewed: REVIEWED_ON,
    },
    "brett-smith": {
      src: "/images/voters-guide/2026/brett-smith.webp",
      sourceUrl: "https://brett-smith.us/",
      credit: "Campaign photo · brett-smith.us",
      reviewed: REVIEWED_ON,
    },
  },
  missing: {},
};
