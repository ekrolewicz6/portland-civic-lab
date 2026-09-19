import type { Race } from "../types";
import { councilDecisions, type CouncilDecision } from "../council-decisions";
import { councilDisagreements } from "../council-record-accounts";

/**
 * The split-sorted matrix for `/voters-guide/{race}/votes`. A topic is
 * "split" for a district when, on at least one of its decisions, one of the
 * district's sitting councilors voted Yes and another voted No. Absences and
 * "Not on committee" never count as a split: missing a roll call is not a
 * position. Topics with zero splits are listed as agreed, not hidden.
 *
 * Restricted to this race's incumbents (candidates whose record carries a
 * `decisionId`), so a District 3 reader never sees District 4 votes here.
 */

export type VoteWord = CouncilDecision["votes"][string];

export type SplitVote = { name: string; vote: VoteWord };

export type SplitDecision = {
  decision: CouncilDecision;
  /** This district's incumbents, alphabetical by displayed name. */
  votes: SplitVote[];
  /** True when at least one Yes and one No sit among these votes. */
  split: boolean;
};

export type SplitTopic = {
  id: string;
  label: string;
  question: string;
  /** Describes all six councilors, not only this district's; prefix it when rendering. */
  contrast: string;
  decisions: SplitDecision[];
  splitCount: number;
};

export type AgreedTopic = { id: string; label: string; decisions: number };

export type SplitIssues = {
  topics: SplitTopic[];
  agreed: AgreedTopic[];
  /** Alphabetical incumbents, for column headers. */
  incumbents: { id: string; name: string }[];
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "en");

/**
 * The name a phone-width vote cell shows above the word: everything after
 * the given name, so a two-word surname ("Koyama Lane") stays whole. The
 * full name is always carried to assistive technology by the pill itself.
 */
export function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : name;
}

export function raceIncumbents(race: Race): { id: string; name: string }[] {
  return race.candidates
    .filter((person) => person.record?.some((entry) => entry.decisionId))
    .map((person) => ({ id: person.id, name: person.name }))
    .sort(byName);
}

export function isSplit(votes: SplitVote[]): boolean {
  let yes = false;
  let no = false;
  for (const { vote } of votes) {
    if (vote === "Yes") yes = true;
    else if (vote === "No") no = true;
  }
  return yes && no;
}

export function splitIssues(race: Race): SplitIssues {
  const incumbents = raceIncumbents(race);
  const all = councilDisagreements.map((topic): SplitTopic => {
    const decisions = topic.decisionIds
      .map((id) => councilDecisions.find((d) => d.id === id))
      .filter((d): d is CouncilDecision => Boolean(d))
      .map((decision): SplitDecision => {
        const votes = incumbents.map(({ name }) => ({
          name,
          vote: decision.votes[name] ?? ("Not on committee" as const),
        }));
        return { decision, votes, split: isSplit(votes) };
      });
    return {
      id: topic.id,
      label: topic.label,
      question: topic.question,
      contrast: topic.contrast,
      decisions,
      splitCount: decisions.filter((d) => d.split).length,
    };
  });
  const topics = all
    .filter((t) => t.splitCount > 0)
    .sort(
      (a, b) =>
        b.splitCount - a.splitCount ||
        b.decisions.length - a.decisions.length ||
        a.label.localeCompare(b.label, "en"),
    );
  const agreed = all
    .filter((t) => t.splitCount === 0)
    .sort((a, b) => a.label.localeCompare(b.label, "en"))
    .map((t) => ({ id: t.id, label: t.label, decisions: t.decisions.length }));
  return { topics, agreed, incumbents };
}
