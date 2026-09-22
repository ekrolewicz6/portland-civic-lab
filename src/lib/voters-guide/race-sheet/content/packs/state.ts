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
  type ExtraTopic,
  type IssueLine,
  type RacePack,
  type RaceStakes,
  type RaceTopics,
  type StanceChip,
  type TopicStance,
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
 * For topics, stances and stakes (September 21, 2026), also the official
 * record: OLIS measure histories (HB 3991, HB 3546, HB 3644, SB 1599),
 * governor's office releases and executive orders 23-04, 26-01, 26-04 and
 * 26-06, the OEA September 2026 forecast, the CFO's 2027–29 budget guidance,
 * the OHNA 2026 report, the Census Building Permits Survey, the PERS 12/31/2024
 * valuation, the IBR cost page, and KATU/OPB interviews quoted by outlet.
 */

const STATEMENTS =
  "https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf";

const NOTE =
  "Campaign position. Claimed results and numerical premises have not automatically been independently verified.";

const REVIEWED_ON = "2026-09-21";
const reviewed = { reviewedBy: "pending", reviewedOn: REVIEWED_ON } as const;
/** Entries added in the September 22, 2026 topic sweep (research/voters-guide-2026/outreach-2026-09-22/topic-sweep-governor.md). */
const reviewed22 = { reviewedBy: "pending", reviewedOn: "2026-09-22" } as const;

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

/* ── Topics, stances and stakes: the official record ─────────────────── */

/**
 * The incumbent's record is read first: bills signed on OLIS, executive
 * orders and releases on oregon.gov, the state forecast and budget memos.
 * A legislator's recorded vote is her own action and is cited the same
 * way. Interview quotes name the outlet. Nothing is inferred from party,
 * endorsements or silence.
 */
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
const interview = (label: string, url: string, date: string, note: string = NOTE): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  note,
});

const OLIS = "https://olis.oregonlegislature.gov/liz";
const GOV_NEWS = "https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post";

const kotekHb3991 = record(
  "OLIS · HB 3991 (2025 special session), signed by Governor Kotek",
  `${OLIS}/2025S1/Measures/Overview/HB3991`,
  "Passed September 29, 2025; signed November 7, 2025; reviewed September 21, 2026",
  "She called the special session that passed it. On January 7, 2026 she asked the Legislature to repeal it (KATU); after voters repealed its taxes on May 19, 2026 she said she is “committed to working in a bipartisan fashion” on a 2027 package (KATU, May 2026).",
);
const hb3546Record = record(
  "OLIS · HB 3546, the POWER Act (2025) measure history",
  `${OLIS}/2025R1/Measures/Overview/HB3546`,
  "Final House vote June 5, 2025; signed June 16, 2025; reviewed September 21, 2026",
  "Rep. Drazan is recorded among the 17 nays on final House passage. The governor’s September 8, 2026 release credits the law with a 29% rate increase on data-center corporations and decreases for other PGE customers.",
);
const drazanKatu = interview(
  "Drazan · KATU “Know Your Candidates” interview, transcript",
  "https://katu.com/news/know-your-candidates/2026-christine-drazan-oregon-governor-republican",
  "April 27, 2026; reviewed September 21, 2026",
  `${NOTE} Her House vote against HB 3991 on September 1, 2025 is on the OLIS record for the 2025 special session.`,
);
const opbKicker = reporting(
  "OPB · Kotek now supports withholding $1 billion of the kicker for wildfire costs",
  "https://www.opb.org/article/2025/05/19/gov-tina-kotek-1-one-billion-oregon-kicker-wildfire-costs/",
  "May 19, 2025; reviewed September 21, 2026",
  "Quotes the governor at a press briefing. In June 2025 she proposed $160 million from the Rainy Day Fund instead, and the Legislature left the kicker intact.",
);
const govDcPause = record(
  "Governor’s Office · Pauses work on requests for state land to support new data centers",
  `${GOV_NEWS}/governor-kotek-pauses-work-on-requests-for-state-land-to-support-new-data-centers`,
  "September 8, 2026; reviewed September 21, 2026",
);
const opbDcTranscript = interview(
  "Drazan · KATU interview of September 8, 2026, quoted in OPB’s Think Out Loud transcript",
  "https://www.opb.org/article/2026/09/14/think-out-loud-data-centers-oregon-gubernatorial-race/",
  "Interview September 8, 2026; transcript September 14, 2026; reviewed September 21, 2026",
  `${NOTE} Her plan page adds community benefit agreements, a ban on blanket NDAs and farmland protection but does not use the word moratorium.`,
);
const govHomelessEo = record(
  "Governor’s Office · Executive Order 26-01 extends the homelessness emergency",
  `${GOV_NEWS}/governor-kotek-issues-executive-order-to-extend-homelessness-emergency`,
  "January 9, 2026; reviewed September 21, 2026",
  "Order text at oregon.gov/gov/eo/eo-26-01.pdf; in force through January 10, 2027. Shelter funding: HB 3644 (2025), $204.9 million for 2025–27, signed July 17, 2025.",
);
const deqCpp = record(
  "DEQ · Environmental Quality Commission adopts the Climate Protection Program, with the governor’s statement",
  "https://apps.oregon.gov/oregon-newsroom/OR/DEQ/Posts/Post/EQC-adopts-climate-protection",
  "November 21, 2024; reviewed September 21, 2026",
);
const govImmBills = record(
  "Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities",
  `${GOV_NEWS}/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities`,
  "April 9, 2026; reviewed September 21, 2026",
  "Builds on Executive Order 26-04 (January 30, 2026), which created an interagency council on the state’s response to federal immigration enforcement.",
);
const govInstrEo = record(
  "Governor’s Office · Executive Order 26-06 to preserve student instructional time",
  `${GOV_NEWS}/governor-kotek-issues-executive-order-to-preserve-student-instructional-time`,
  "Order signed April 16, 2026; release posted April 23, 2026; reviewed September 21, 2026",
  "Order text at oregon.gov/gov/eo/eo-26-06.pdf.",
);
const waJoint = record(
  "Governors Kotek and Ferguson · joint statement on the Interstate Bridge Replacement Program",
  "https://governor.wa.gov/news/2026/interstate-bridge-replacement-program-joint-statement-governors-kotek-and-ferguson",
  "March 17, 2026; reviewed September 21, 2026",
);
const kotekSb1507Letter = record(
  "Governor Kotek · SB 1507 signing letter to the Secretary of State",
  "https://siliconflorist.com/wp-content/uploads/2026/04/2026.04.09_SB-1507-Signing-Letter-1.pdf",
  "April 9, 2026; reviewed September 22, 2026",
  "Scan of the signed two-page letter as posted by Silicon Florist; the Department of Revenue’s 2026 Summary of Legislation lists the letter by date, and OLIS records SB 1507 signed April 9, 2026 (Oregon Laws 2026, chapter 142). The letter also promises 2027 legislation to restore the small-business stock exemption. The Statesman Journal reported the disconnect is expected to raise more than $342 million; a referendum against it failed to qualify by the June 4, 2026 deadline.",
);

/* Stakes sources */
const cfoGuidance = record(
  "DAS Chief Financial Office · 2027–29 budget development, policy package guidance",
  "https://www.oregon.gov/das/Financial/Documents/2027-29%20Budget%20POP%20Guidance%20-%20CFO.pdf",
  "February 10, 2026; reviewed September 21, 2026",
  "Reserve, ending-balance and kicker figures are from the Office of Economic Analysis September 2026 forecast (oregon.gov/das/oea/Documents/revenue0926.pdf).",
);
const odotHb3991 = record(
  "ODOT · House Bill 3991 and the 2026 funding update",
  "https://www.oregon.gov/odot/pages/hb3991.aspx",
  "Reviewed September 21, 2026",
  "Referendum 120 result, May 19, 2026: 1,012,663 no (83%) to 207,066 yes (17%), per Ballotpedia’s certified totals.",
);
const censusBps = record(
  "U.S. Census Bureau · Building Permits Survey, state annual totals for 2025",
  "https://www2.census.gov/econ/bps/State/st2025a.txt",
  "2025 annual file; reviewed September 21, 2026",
  "Oregon 2025: 9,215 single-family, 480 two-unit, 219 three-to-four-unit and 4,925 five-plus units authorized (14,839). The target is from the Oregon Housing Needs Analysis 2026 report (oregon.gov/das/oea/Documents/OHNA-2026-Results-Report.pdf); the 36,000 goal from Executive Order 23-04.",
);
const jprDc = reporting(
  "Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more",
  "https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further",
  "September 9, 2026; reviewed September 21, 2026",
);
const persVal = record(
  "PERS · Milliman actuarial valuation as of December 31, 2024 (advisory for 2027–29 rates)",
  "https://www.oregon.gov/pers/Documents/Financials/Actuarial/2025/12312024-Actuarial-Valuation.pdf",
  "Issued 2025; reviewed September 21, 2026",
);
const ibrCost = record(
  "Interstate Bridge Replacement Program · Cost estimate and funding",
  "https://interstatebridge.org/CostEstimate",
  "2026 cost estimate; reviewed September 21, 2026",
);
const opbCpp = reporting(
  "OPB · Oregon’s greenhouse gas reduction program faces a fresh legal challenge",
  "https://www.opb.org/article/2026/04/16/oregon-climate-protection-program-lawsuit/",
  "April 16, 2026; reviewed September 21, 2026",
);

/* ── Topics: the choices the governor faces this term ────────────────── */

const governorTopics: ExtraTopic[] = [
  {
    id: "gov-transportation-taxes",
    label: "Transportation taxes",
    short: "Road taxes",
    question: "Raise the gas tax and vehicle fees again to fund roads, after voters repealed the 2025 package?",
    context:
      "HB 3991, signed November 7, 2025, would have raised the gas tax from 40 to 46 cents and doubled the transit payroll tax; voters repealed those sections 83% to 17% on May 19, 2026. Lawmakers redirected $297 million to keep ODOT running through June 2027, leaving a durable source to the 2027 session.",
  },
  {
    id: "gov-kicker",
    label: "Kicker refund",
    short: "Kicker",
    question: "Let the state hold back part of a kicker refund for other uses?",
    context:
      "The 2026 kicker returned about $1.4 billion to taxpayers. Holding any of it back takes a two-thirds vote of each chamber; the September 2026 forecast puts 2025–27 revenue $526 million under the threshold, so no kicker is due on 2028 returns.",
  },
  {
    id: "gov-data-center-moratorium",
    label: "Data-center moratorium",
    short: "Moratorium",
    question: "Pause new data centers statewide until standards are set?",
    context:
      "On September 8, 2026 the governor backed a moratorium and paused data-center deals on state land through July 1, 2027; her office says only the Legislature can pause private development. An advisory committee's recommendations are due by the end of 2026 for the 2027 session.",
  },
  {
    id: "gov-power-act",
    label: "Data-center power rates",
    short: "POWER Act",
    question: "Should data centers pay a separate, higher electricity rate (the 2025 POWER Act)?",
    context:
      "HB 3546, signed June 16, 2025, lets regulators put large-load customers in their own rate class; the governor's office says PGE's data-center rates rose 29% and other customers' fell. It passed the House 41–16 and the Senate 18–12.",
  },
  {
    id: "gov-homelessness-emergency",
    label: "Homelessness emergency",
    short: "Shelter",
    question: "Keep the state homelessness emergency and its state-funded shelter beds going?",
    context:
      "The emergency declared January 10, 2023 was extended by Executive Order 26-01 through January 10, 2027; the state counts 6,286 shelter beds added or kept and 25,942 households helped to stay housed through September 2025. HB 3644 funds shelters with $204.9 million through June 2027.",
  },
  {
    id: "gov-climate-protection",
    label: "Climate Protection Program",
    short: "Carbon cap",
    question: "Keep the Climate Protection Program's declining cap on fuel emissions?",
    context:
      "The Environmental Quality Commission re-adopted the program November 21, 2024: emissions 50% below baseline by 2035 and 90% by 2050, with the first compliance period 2025–27. Nearly 30 business, utility and labor groups asked the Court of Appeals on April 16, 2026 to strike it down.",
  },
  {
    id: "gov-immigration-enforcement",
    label: "Sanctuary law",
    short: "Sanctuary",
    question: "Keep Oregon's sanctuary-law limits on helping federal immigration enforcement?",
    context:
      "The 1987 sanctuary law and the 2021 Sanctuary Promise Act bar public resources for immigration enforcement without a judicial warrant. Executive Order 26-04 (January 30, 2026) created an interagency council on the state's response, and eight bills signed April 9, 2026 set rules for schools, hospitals and courts.",
  },
  {
    id: "gov-school-time",
    label: "School instructional time",
    short: "School hours",
    question: "Require districts to keep and add classroom hours even when budgets are short?",
    context:
      "Executive Order 26-06 (April 16, 2026) bars districts from cutting instructional time to close budget gaps, ends waivers below the minimum hours, and requires districts that cut time in 2025–26 or 2026–27 to restore it by 2027–28. Oregon students get fewer hours than those in all but a handful of states, per the order.",
  },
  {
    id: "gov-new-revenue",
    label: "New state taxes",
    short: "State taxes",
    question: "Raise new state taxes to cover the 2027–29 budget gap, or hold to cuts?",
    context:
      "The state's Chief Financial Office told agencies on February 10, 2026 that federal H.R. 1 is projected to open a gap between the cost of current programs and revenue, and that 2027–29 proposals must be revenue-neutral. The September 2026 forecast shows a $400 million 2025–27 ending balance and $3.46 billion in reserves.",
  },
  {
    id: "gov-interstate-bridge",
    label: "Interstate Bridge",
    short: "I-5 bridge",
    question: "Build the Interstate Bridge replacement as planned, with tolls, or scale it back?",
    context:
      "The program's 2026 estimate puts the five-mile corridor at $14.4 billion and a core first phase at $7.09 billion, with $5.7 billion committed, including $1 billion from Oregon and $1.5 billion in projected tolls. Tolling could begin as early as 2028.",
  },
];

const topics: RaceTopics[] = [{ raceIds: ["oregon-governor"], topics: governorTopics }];

/* ── Topic stances: explicit, sourced, never inferred ────────────────── */

const stance = (
  candidateId: string,
  topicId: string,
  s: TopicStance["stance"],
  chipText: string,
  text: string,
  source: Evidence,
): TopicStance => ({ candidateId, topicId, stance: s, chip: chipText, text, source, ...reviewed });

const topicStances: TopicStance[] = [
  /* ── Tina Kotek (incumbent: the record first) ─────────────────────── */
  stance("tina-kotek", "gov-transportation-taxes", "mixed", "Signed taxes, sought repeal",
    "Called the 2025 special session and signed HB 3991’s gas-tax and fee increases; in January 2026 asked lawmakers to repeal it, and after voters did she pledged bipartisan work on a 2027 package.",
    kotekHb3991),
  stance("tina-kotek", "gov-kicker", "supports", "One-time wildfire hold-back",
    "Told reporters in May 2025 she would support withholding about $1 billion of the $1.64 billion kicker, one time and from high earners, for wildfire costs; her office later proposed Rainy Day Fund money instead.",
    opbKicker),
  stance("tina-kotek", "gov-data-center-moratorium", "supports", "Moratorium, via Legislature",
    "Said September 8, 2026 she supports a moratorium until development is “done on our terms,” paused state-land deals through July 1, 2027, and will bring the Legislature a statewide framework in 2027.",
    govDcPause),
  stance("tina-kotek", "gov-power-act", "supports", "Signed the POWER Act",
    "Signed HB 3546 on June 16, 2025; her office credits it with a 29% rate increase on data-center corporations and rate decreases for other PGE customers.",
    hb3546Record),
  stance("tina-kotek", "gov-homelessness-emergency", "supports", "Extended emergency to 2027",
    "Extended the homelessness emergency by Executive Order 26-01 through January 10, 2027, with goals of rehousing 1,400 more households and preventing homelessness for 8,000, after signing HB 3644’s $204.9 million shelter program.",
    govHomelessEo),
  stance("tina-kotek", "gov-climate-protection", "supports", "Keep the carbon cap",
    "Backed the Environmental Quality Commission’s re-adoption of the program on November 21, 2024, saying it “will keep polluters accountable and fund community investments” that cut emissions.",
    deqCpp),
  stance("tina-kotek", "gov-immigration-enforcement", "supports", "Keep sanctuary limits",
    "Created an interagency council on the state’s response to federal enforcement (EO 26-04, January 30, 2026), signed eight immigrant-protection bills April 9, 2026, and opposes ICE detention facilities in Oregon.",
    govImmBills),
  stance("tina-kotek", "gov-school-time", "supports", "No cuts to hours",
    "Executive Order 26-06 bars districts from cutting instructional time for budget reasons and ends waivers below the minimum; her platform sets a goal of reaching the national average by the end of a second term.",
    govInstrEo),
  {
    ...stance("tina-kotek", "gov-new-revenue", "partial", "Signed H.R. 1 disconnect",
      "Signed SB 1507 in April 2026, disconnecting Oregon from several H.R. 1 tax breaks because copying them was “neither fair nor responsible,” while keeping tips and overtime untaxed; she has not said whether she would seek new taxes for 2027–29.",
      kotekSb1507Letter),
    ...reviewed22,
  },
  stance("tina-kotek", "gov-interstate-bridge", "supports", "Build the core bridge",
    "With Washington’s governor, said March 17, 2026 the states remain “fully committed” to replacing the bridge, starting with a core set of projects funded by committed federal, state and toll money.",
    waJoint),

  /* ── Christine Drazan ─────────────────────────────────────────────── */
  stance("christine-drazan", "gov-transportation-taxes", "opposes", "No new road taxes",
    "Voted no on HB 3991 in the House on September 1, 2025, and told KATU in April 2026 she would “balance the budget without new taxes,” putting potholes, maintenance and preservation first.",
    drazanKatu),
  stance("christine-drazan", "gov-kicker", "opposes", "Veto kicker grabs",
    "Would “protect Oregon’s kicker” by vetoing legislative attempts to take it from taxpayers.",
    drazanPlan),
  stance("christine-drazan", "gov-data-center-moratorium", "supports", "Immediate moratorium",
    "Told KATU on September 8, 2026 that the governor “should issue a moratorium immediately” and that Oregon should have an immediate statewide moratorium; her plan adds community benefit agreements and a ban on blanket NDAs.",
    opbDcTranscript),
  stance("christine-drazan", "gov-power-act", "opposes", "Voted no",
    "Voted no on HB 3546’s final House passage on June 5, 2025; her plan does not say whether she would repeal the law.",
    hb3546Record),
  stance("christine-drazan", "gov-homelessness-emergency", "mixed", "Audit, shift to recovery",
    "Would declare an emergency on addiction and mental health instead, audit homeless and addiction spending, and shift state money to recovery programs; says success should not be measured by low-barrier shelter beds.",
    drazanPlan),
  stance("christine-drazan", "gov-climate-protection", "opposes", "Repeal the program",
    "Would repeal the Climate Protection Program, which she calls a costly executive order that raised utility and gas prices and threatened jobs.",
    drazanPlan),
  stance("christine-drazan", "gov-immigration-enforcement", "opposes", "Sanctuary law too far",
    "Told KATU in April 2026 that Oregon’s sanctuary laws “have gone too far,” citing Corrections declining a U.S. attorney’s request about 30 people, and wants law enforcement able to work with federal law enforcement.",
    drazanKatu),
  stance("christine-drazan", "gov-school-time", "supports", "School-day standard",
    "Would increase classroom time by moving Oregon from an instructional-hours system to a school-day system with statewide standards for what counts as a school day.",
    drazanPlan),
  stance("christine-drazan", "gov-new-revenue", "opposes", "Veto new taxes",
    "Would veto new tax and fee increases and cut taxes instead: a higher standard deduction, estate and Corporate Activity Tax reform, and property tax relief for seniors and veterans.",
    drazanPlan),
  stance("christine-drazan", "gov-interstate-bridge", "mixed", "A cheaper bridge",
    "Says the state “can’t afford the I-5 bridge that they’re proposing,” objecting to the share of deck for biking, walking and transit, and would build a bridge Oregon can afford.",
    drazanKatu),

  /* ── Brett Smith ──────────────────────────────────────────────────── */
  stance("brett-smith", "gov-data-center-moratorium", "supports", "Permanent ban",
    "Pledges a permanent moratorium on data centers and calls himself the only anti-data-center candidate.",
    smithStatement),
  stance("brett-smith", "gov-new-revenue", "supports", "Wage-gap surcharge",
    "Would impose a surcharge on employers with 50 or more workers paying below a living wage, which his campaign models at $700 million to $3.4 billion a year for the Oregon Health Plan and food aid.",
    smithSite),
];

/* ── Stakes: what the office decides this term, in sourced facts ─────── */

const stakes: RaceStakes[] = [
  {
    raceId: "oregon-governor",
    intro:
      "The governor writes the 2027–29 budget the Legislature takes up in January 2027, signs or vetoes what it passes, and runs the agencies behind housing, shelter, roads, schools and the state’s response to federal actions. The term opens with a budget gap, a transportation fund voters declined to refill, and a housing target the state is missing by half.",
    items: [
      {
        label: "2027–29 budget gap",
        text:
          "Federal H.R. 1 is projected to open a gap between the cost of current programs and state revenue, so the Chief Financial Office told agencies on February 10, 2026 that 2027–29 proposals must be revenue-neutral. September’s forecast shows $3.46 billion in reserves (9.7% of the general fund) and no kicker due on 2028 returns.",
        source: cfoGuidance,
      },
      {
        label: "Transportation funding",
        text:
          "Voters rejected most of HB 3991’s gas-tax and fee increases in May 2026; lawmakers then redirected existing funds to cover a $297 million ODOT maintenance shortfall through June 2027. ODOT has cut more than $500 million since 2019, and the governor’s workgroup is due to recommend a 2027 package by year’s end.",
        source: odotHb3991,
      },
      {
        label: "Housing production",
        text:
          "Oregon issued permits for 14,839 homes in 2025, against the state’s own annual production target of 29,359 and the 36,000-a-year goal set by Executive Order 23-04 in January 2023.",
        source: censusBps,
      },
      {
        label: "Shelter funding cliff",
        text:
          "The homelessness emergency runs through January 10, 2027 and the statewide shelter program is funded with $204.9 million through June 2027; the state counts 6,286 shelter beds added or kept and 5,539 people rehoused through September 2025. Both come up for renewal in the next budget.",
        source: govHomelessEo,
      },
      {
        label: "Data centers",
        text:
          "The state has about 144 data centers; at a September 8, 2026 hearing the Legislative Revenue Office called reporting of at least $450 million in property tax breaks this year “pretty close.” State-land deals are paused through July 1, 2027, and the governor’s advisory committee owes recommendations by the end of 2026.",
        source: jprDc,
      },
      {
        label: "PERS",
        text:
          "PERS held $79.5 billion in assets against $108.7 billion in liabilities at December 31, 2024, 73.1% funded with a $29.2 billion unfunded liability; employer rates for 2027–29 are projected to rise as more than 180 side accounts run out in 2027.",
        source: persVal,
      },
      {
        label: "Interstate Bridge",
        text:
          "The 2026 estimate puts the five-mile I-5 corridor at $14.4 billion and a core first phase at $7.09 billion; $5.7 billion is committed, including $1 billion from Oregon and $1.5 billion in projected tolls that could start as early as 2028. Completion has slipped from 2034 to 2045.",
        source: ibrCost,
      },
      {
        label: "Carbon cap lawsuit",
        text:
          "Nearly 30 business, utility and labor groups petitioned the Court of Appeals on April 16, 2026 to void the Climate Protection Program, which caps fuel emissions toward a 90% cut by 2050 and prices compliance credits at $136 a ton; its first compliance period runs 2025–27.",
        source: opbCpp,
      },
    ],
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
  topics,
  topicStances,
  stakes,
};
