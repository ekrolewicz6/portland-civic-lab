import type { Evidence } from "../types";
import type { IssueId } from "./issues";

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

/** A concrete choice readers can add as a grid column beyond the four issues. */
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

/** A candidate's explicit, sourced stance on an extra topic. Never inferred. */
export type TopicStance = Review & {
  candidateId: string;
  topicId: string;
  stance: "supports" | "opposes" | "mixed";
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
