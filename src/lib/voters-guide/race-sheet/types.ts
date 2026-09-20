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
