import type { Candidate, CandidatePortrait, Evidence } from "../types";
import type { IssueId } from "./issues";
import type { OwnWords } from "./content/own-words";

/**
 * The Race Sheet overlay: short, reviewed presentation lines over the
 * unchanged research objects. Every entry names the parent field it was
 * shortened from (`from`) so reviewers can diff it and a test can fail if
 * the parent changes. Lines may omit; they never add.
 */

export type Review = {
  /** Who reviewed the line against its parent. "pending" until a human has. */
  reviewedBy: string;
  reviewedOn: string; // ISO date
};

export type IssueLine = Review & {
  candidateId: string;
  issue: IssueId;
  /** ≤14 words, active verb first, attribution verbs allowed, no vote language. */
  line: string;
  /** Parent field, e.g. "analysis.issues.housing.position". */
  from: string;
};

export type ChoiceParagraph = Review & {
  raceId: string;
  /** ≤45 words, no candidate names, no "X, or Y" dichotomies. */
  text: string;
  from: string; // "race.comparison"
};

/** A challenger's explicit statement about the exact choice a featured vote decided. */
export type SaidPlacement = Review & {
  candidateId: string;
  /** discovery.ts question id (camp-removal, water-rates, moda, ...). */
  questionId: string;
  /** ≤10 words, attributed paraphrase. */
  line: string;
  from: string;
  sourceUrl: string;
};

export type FeaturedVote = {
  raceId: string;
  /** discovery.ts question id; its decisionId links to councilDecisions. */
  questionId: string;
};

export type RoleOverride = {
  candidateId: string;
  /** ≤6 words. */
  role: string;
  from: "background";
};

export type MissingState = "filing-only" | "no-platform";

export type PrimaryStatement = {
  candidateId: string;
  /** URL of the source to cite on the card; must exist in candidate.sources or analysis.sources. */
  sourceUrl: string;
};

export type DistrictInfo = {
  raceId: string;
  /** One line of neighborhoods a resident recognises. */
  neighborhoods: string;
  /** Official district lookup or map page. */
  mapUrl: string;
  mapSource: Evidence;
};

export type BallotInstruction = {
  raceId: string;
  /** e.g. "You rank up to six candidates for three seats." */
  text: string;
  /** Second sentence of reassurance about ranking, if the method is ranked choice. */
  note?: string;
  source: Evidence;
};

export type CandidateAnswer = {
  candidateId: string;
  question: string;
  /** ≤60 words, the candidate's reply verbatim or lightly trimmed with ellipsis. */
  text: string;
  received: string; // ISO date
};

/** A 2–4 word stance for the grid, shortened from the same sourced position as the issue line. */
export type StanceChip = Review & {
  candidateId: string;
  issue: IssueId;
  /** ≤4 words, no verbs of attribution, plain nouns/adjectives: "Build public housing", "Police first", "No new taxes". */
  chip: string;
  from: string;
};

/* ── Promise ladder and extra topics ─────────────────────────────────── */

/** One rung of the ladder, always with its own source. */
export type DeliveryStep = { text: string; source: Evidence };

/**
 * What → how → measured by, per candidate per issue. `how` is the mechanism
 * the candidate names (money, rules, staffing, sequencing); `measure` is the
 * result or metric they say would show it worked. Missing rungs are gaps; if
 * the Lab has asked the candidate, `askedOn` records the date so the page can
 * say so instead of showing a bare dash.
 */
export type Delivery = Review & {
  candidateId: string;
  issue: IssueId;
  how?: DeliveryStep;
  measure?: DeliveryStep;
  askedOn?: string;
};

/** A concrete choice the office faces: one topic board beneath the four-issue grid. */
export type ExtraTopic = {
  id: string;
  label: string;
  short: string;
  /** The plain question, e.g. "Public money for the Moda Center deal?" */
  question: string;
  context: string;
  /** When the topic matches a Council decision, incumbents' votes render as pills. */
  decisionId?: string;
};

/**
 * A candidate's explicit, sourced stance on an extra topic. Never inferred.
 * "partial" records a statement that speaks to the topic but not to the exact
 * choice the topic asks (e.g. wants the arena modernized; public money unsaid),
 * so the reader sees what exists and what it leaves unanswered.
 */
export type TopicStance = Review & {
  candidateId: string;
  topicId: string;
  stance: "supports" | "opposes" | "mixed" | "partial";
  /** ≤4 words for the cell. */
  chip: string;
  /** The sentence behind the chip, our paraphrase. */
  text: string;
  source: Evidence;
  askedOn?: string;
};

/* ── Reaching the campaign ───────────────────────────────────────────── */

/**
 * The channels a candidate has published for their campaign, and nothing
 * else: what their pamphlet statement prints, what their campaign site's
 * contact page or footer lists, or the campaign email on their own public
 * filing or announcement. Every channel names where it was found. No
 * personal numbers or addresses that the candidate did not publish for the
 * campaign, and nothing scraped from third parties.
 */
export type ContactChannel = {
  /** e.g. "https://…", "mailto:…", "tel:+1971…", or a social profile URL. */
  url: string;
  /** Short visible label: "eliforportland.com", "info@…", "971-…", "Instagram". */
  label: string;
  kind: "website" | "email" | "phone" | "form" | "social";
  /** Where the candidate published it. */
  from: "pamphlet" | "site" | "filing" | "announcement" | "questionnaire";
};

export type CandidateContact = {
  candidateId: string;
  channels: ContactChannel[];
  /** When none: the plain reason, e.g. "No campaign site or email in the pamphlet or the City filing." */
  none?: string;
  /** The page(s) these were read from. */
  sources: Evidence[];
  reviewedOn: string;
};

/* ── Race packs: everything the race sheet needs for one group of offices ── */

/** The analysis layer for one candidate: the same shape the council research carries. */
export type CandidateAnalysis = NonNullable<Candidate["analysis"]>;

/**
 * One file per office group, written by research, read by the aggregators
 * in `content/`. Every field is optional so a pack can land in stages, but
 * the rule tests hold a published candidate to the full council standard:
 * a line and a chip per documented position, an opening in their own words,
 * a contact entry, and a portrait or a stated reason for none.
 */
export type RacePack = {
  analysis: Record<string, CandidateAnalysis>;
  lines: IssueLine[];
  chips: StanceChip[];
  deliveries: Delivery[];
  ownWords: OwnWords[];
  contacts: CandidateContact[];
  roles: RoleOverride[];
  primary: PrimaryStatement[];
  ballots: BallotInstruction[];
  districts: DistrictInfo[];
  choice: ChoiceParagraph[];
  portraits: Record<string, CandidatePortrait>;
  /** Candidates whose research object is a filing only, by id, with the state the row should show. */
  missing: Record<string, MissingState>;
  /**
   * Closes a research gap: the September 18 research object marked the
   * candidate `missing`, and research since found their own statement
   * (a pamphlet page, their site, their questionnaire). The profile replaces
   * the placeholder background, summary and priorities and clears `missing`;
   * the research log records each one.
   */
  profiles: Record<string, { background: string; summary: string; priorities: string[]; question?: string }>;
  /** Office-specific topics (the boards beneath the grid) for the listed races, and each candidate's explicit stance. */
  topics: RaceTopics[];
  topicStances: TopicStance[];
  /** What is at stake in a race right now: sourced facts about the office's biggest current problems. */
  stakes: RaceStakes[];
};

/** A set of extra topics shared by the listed races (e.g. one set for the governor, one for Multnomah County seats). */
export type RaceTopics = { raceIds: string[]; topics: ExtraTopic[] };

/**
 * The office's biggest current problems, each a fact with a source: a
 * budget gap, a deadline, a program's results, a decision pending. Facts,
 * not characterizations; the same block for every candidate in the race.
 */
export type RaceStakes = {
  raceId: string;
  /** One or two sentences: what this office decides that matters most this term. */
  intro: string;
  items: { label: string; text: string; source: Evidence }[];
};

export const emptyPack = (): RacePack => ({
  analysis: {},
  lines: [],
  chips: [],
  deliveries: [],
  ownWords: [],
  contacts: [],
  roles: [],
  primary: [],
  ballots: [],
  districts: [],
  choice: [],
  portraits: {},
  missing: {},
  profiles: {},
  topics: [],
  topicStances: [],
  stakes: [],
});
