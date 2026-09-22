import type { Candidate, Evidence, Race } from "../types";
import { races } from "../published";
import { councilDecisions, type CouncilDecision } from "../council-decisions";
import { councilDisagreements, decisionAccounts, type DecisionAccount } from "../council-record-accounts";
import { councilReaderCopy } from "../council-reader-copy";
import { questions } from "../discovery";
import { ISSUE_IDS, issues, type Issue, type IssueId } from "./issues";
import { issuesFor } from "./issue-framing";
import { featuredVotes } from "./featured";
import { sourceChip, type SourceChip } from "./source-chip";
import { issueLines } from "./content/lines";
import { stanceChips } from "./content/stances";
import { deliveries } from "./content/delivery";
import { topicStances } from "./content/topic-stances";
import { extraTopics } from "./topics";
import { officeOf, type Office } from "./office";
import { packs } from "./content/packs";
import { choiceParagraphs } from "./content/choice";
import { saidPlacements } from "./content/said";
import { missingStates, primaryStatements, roleOverrides } from "./content/roles";
import { ballotInstructions, districts } from "./content/districts";
import { answers } from "./content/answers";
import { ownWords, type OwnWordsRule } from "./content/own-words";
import { contacts } from "./content/contacts";
import type { BallotInstruction, CandidateAnswer, ContactChannel, DistrictInfo, ExtraTopic, MissingState, RaceStakes, Review } from "./types";

export const raceSheetVersion = "2026-09-19.1";

/* ── View model ─────────────────────────────────────────────────────── */

export type IssueCell = {
  /** ≤4-word stance for the grid cell, or null. */
  chip: string | null;
  /** Reviewed ≤14-word line for the row, or null (renders "—"). */
  line: string | null;
  /** Full authored position for the card, with its source chip. */
  position: string | null;
  source: SourceChip | null;
  review: Review | null;
};

/** One rung of the promise ladder, ready to render. */
export type Rung = { text: string; source: SourceChip } | null;
export type Ladder = { how: Rung; measure: Rung; askedOn: string | null; review: Review | null };

/** A candidate’s row on a topic board: a recorded vote, an explicit stance, or a gap. */
export type TopicCell = {
  vote: VoteWord | null;
  stance: "supports" | "opposes" | "mixed" | "partial" | null;
  chip: string | null;
  text: string | null;
  source: SourceChip | null;
  askedOn: string | null;
};

export type SheetRow = {
  id: string;
  name: string;
  /** ≤6 words for the row. */
  role: string;
  background: string;
  incumbent: boolean;
  portrait: Candidate["portrait"];
  summary: string;
  priorities: string[];
  /** Our reading: value tags and the tradeoff sentence, always shown together. */
  values: string[];
  tradeoff: string;
  question: string;
  missing: MissingState | null;
  missingText: string | null;
  primarySource: SourceChip;
  cells: Record<IssueId, IssueCell>;
  ladder: Record<IssueId, Ladder>;
  topicCells: Record<string, TopicCell>;
  answers: CandidateAnswer[];
  /** The verbatim opening of their own statement, captured by one rule for everyone. */
  ownWords: { text: string; source: SourceChip; rule: OwnWordsRule } | null;
  /** Channels the candidate published for the campaign; `none` states why when there are none. */
  contact: { channels: ContactChannel[]; none: string | null; sources: SourceChip[] };
};

export type VoteWord = "Yes" | "No" | "Absent" | "Not on committee";

export type TopicDecision = { title: string; voteLabel: string | null; source: SourceChip };

export type FeaturedRow = {
  questionId: string;
  /** The plain question Council decided. */
  title: string;
  context: string;
  detail: string;
  decision: CouncilDecision;
  topicId: string | null;
  topicLabel: string | null;
  /** This district's incumbents, alphabetical, with their recorded vote. */
  votes: { id: string; name: string; vote: VoteWord; headline: string | null; account: DecisionAccount | null }[];
  /** Challengers with an explicit statement about this exact choice, alphabetical. */
  said: { id: string; name: string; line: string; sourceUrl: string; source: SourceChip | null }[];
  notAddressed: number;
  isModa: boolean;
};

export type RaceSheet = {
  race: Race;
  /** What kind of seat this is, and which parts of the sheet apply. */
  office: Office;
  /** What is at stake this term, when research has written it. */
  stakes: RaceStakes | null;
  district: DistrictInfo | null;
  ballot: BallotInstruction | null;
  /** The reviewed choice paragraph, or the race's own comparison sentence. */
  choice: { text: string; reviewed: boolean };
  rows: SheetRow[];
  incumbents: { id: string; name: string }[];
  coverage: Record<IssueId, number>;
  featured: FeaturedRow[];
  otherRaces: { id: string; title: string; short: string }[];
  version: string;
};

/* ── Helpers ────────────────────────────────────────────────────────── */

export const isIncumbent = (person: Candidate) =>
  Boolean(person.record?.some((entry) => entry.decisionId));

export const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, "en");

export function shortRaceTitle(race: Race) {
  return officeOf(race).short;
}

/** The extra grid topics that apply to a race: the Council choices for council seats, a pack's office-specific set for others. */
export function topicsFor(race: Race): ExtraTopic[] {
  if (officeOf(race).group === "council") return extraTopics;
  return packs.flatMap((p) => p.topics).find((t) => t.raceIds.includes(race.id))?.topics ?? [];
}

/** Sourced facts about what the office decides right now, when research has written them. */
export function stakesFor(race: Race) {
  return packs.flatMap((p) => p.stakes).find((s) => s.raceId === race.id) ?? null;
}

function clampRole(background: string): string {
  // Fallback when no override exists: first clause, ≤6 words.
  const clause = background.split(/[;.]/)[0].trim();
  const words = clause.split(/\s+/);
  return words.length <= 6 ? clause : `${words.slice(0, 6).join(" ")}…`;
}

function primarySource(person: Candidate): SourceChip {
  const chosen = primaryStatements.find((p) => p.candidateId === person.id)?.sourceUrl;
  const pool = [...(person.sources ?? []), ...(person.analysis?.sources ?? [])];
  const byUrl = chosen && pool.find((s) => s.url === chosen);
  const statement = pool.find((s) => s.kind === "Candidate statement");
  return sourceChip(byUrl || statement || pool[0]);
}

function missingState(person: Candidate): MissingState | null {
  if (person.id in missingStates) return missingStates[person.id];
  if (!person.missing) return null;
  return person.priorities.length || person.analysis?.values?.length ? "filing-only" : "no-platform";
}

function buildRow(person: Candidate, topics: ExtraTopic[]): SheetRow {
  const cells = Object.fromEntries(
    ISSUE_IDS.map((issue) => {
      const authored = issueLines.find((l) => l.candidateId === person.id && l.issue === issue);
      const stance = stanceChips.find((c) => c.candidateId === person.id && c.issue === issue);
      const position = person.analysis?.issues[issue];
      return [
        issue,
        {
          chip: stance?.chip ?? null,
          line: authored?.line ?? null,
          position: position?.position ?? null,
          source: position ? sourceChip(position.source) : null,
          review: authored ? { reviewedBy: authored.reviewedBy, reviewedOn: authored.reviewedOn } : null,
        } satisfies IssueCell,
      ];
    }),
  ) as Record<IssueId, IssueCell>;
  const ladder = Object.fromEntries(
    ISSUE_IDS.map((issue) => {
      const d = deliveries.find((x) => x.candidateId === person.id && x.issue === issue);
      const rung = (step?: { text: string; source: Evidence }): Rung => (step ? { text: step.text, source: sourceChip(step.source) } : null);
      return [
        issue,
        {
          how: rung(d?.how),
          measure: rung(d?.measure),
          askedOn: d?.askedOn ?? null,
          review: d ? { reviewedBy: d.reviewedBy, reviewedOn: d.reviewedOn } : null,
        } satisfies Ladder,
      ];
    }),
  ) as Record<IssueId, Ladder>;
  const topicCells = Object.fromEntries(
    topics.map((topic) => {
      const decision = topic.decisionId ? councilDecisions.find((d) => d.id === topic.decisionId) : undefined;
      const vote = decision && isIncumbent(person) ? (decision.votes[person.name] ?? null) : null;
      const st = topicStances.find((x) => x.candidateId === person.id && x.topicId === topic.id);
      return [
        topic.id,
        {
          vote: (vote as VoteWord | null) ?? null,
          stance: st?.stance ?? null,
          chip: st?.chip ?? null,
          text: st?.text ?? null,
          source: st ? sourceChip(st.source) : null,
          askedOn: st?.askedOn ?? null,
        } satisfies TopicCell,
      ];
    }),
  ) as Record<string, TopicCell>;
  const override = roleOverrides.find((r) => r.candidateId === person.id)?.role;
  return {
    id: person.id,
    name: person.name,
    role: override ?? clampRole(person.background),
    background: person.background,
    incumbent: isIncumbent(person),
    portrait: person.portrait,
    summary: person.summary,
    priorities: person.priorities,
    values: person.analysis?.values ?? [],
    tradeoff: person.analysis?.tradeoff ?? person.interpretation,
    question: person.question,
    missing: missingState(person),
    missingText: person.missing ?? null,
    primarySource: primarySource(person),
    cells,
    ladder,
    topicCells,
    answers: answers.filter((a) => a.candidateId === person.id),
    ownWords: (() => {
      const own = ownWords.find((o) => o.candidateId === person.id);
      return own ? { text: own.text, source: sourceChip(own.source), rule: own.rule } : null;
    })(),
    contact: (() => {
      const found = contacts.find((x) => x.candidateId === person.id);
      return found
        ? { channels: found.channels, none: found.none ?? null, sources: found.sources.map(sourceChip) }
        : { channels: [], none: "Contact research for this candidate is not complete yet.", sources: [] };
    })(),
  };
}

function buildFeatured(race: Race, people: Candidate[]): FeaturedRow[] {
  const incumbents = people.filter(isIncumbent).sort(byName);
  const challengers = people.filter((p) => !isIncumbent(p));
  return featuredVotes
    .filter((f) => f.raceId === race.id)
    .map((f): FeaturedRow | null => {
      const q = questions.find((x) => x.id === f.questionId);
      const decision = q && councilDecisions.find((d) => d.id === q.decisionId);
      if (!q || !decision) return null;
      const topic = councilDisagreements.find((t) => t.decisionIds.includes(decision.id)) ?? null;
      const reader = topic ? councilReaderCopy[topic.id] : undefined;
      const said = saidPlacements
        .filter((s) => s.questionId === q.id)
        .map((s) => {
          const person = challengers.find((p) => p.id === s.candidateId);
          if (!person) return null;
          const pool = [...(person.sources ?? []), ...(person.analysis?.sources ?? []), ...Object.values(person.analysis?.issues ?? {}).map((i) => i.source)];
          const evidence = pool.find((e) => e.url === s.sourceUrl) ?? null;
          return { id: person.id, name: person.name, line: s.line, sourceUrl: s.sourceUrl, source: evidence ? sourceChip(evidence) : null };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .sort(byName);
      return {
        questionId: q.id,
        title: q.title,
        context: q.context,
        detail: q.detail,
        decision,
        topicId: topic?.id ?? null,
        topicLabel: topic?.label ?? null,
        votes: incumbents.map((p) => ({
          id: p.id,
          name: p.name,
          vote: decision.votes[p.name] ?? "Not on committee",
          headline: reader?.readings[p.name]?.headline ?? null,
          account: (decisionAccounts[decision.id]?.[p.name] as DecisionAccount | undefined) ?? null,
        })),
        said,
        notAddressed: challengers.length - said.length,
        isModa: decision.id === "moda",
      };
    })
    .filter((x): x is FeaturedRow => x !== null);
}

/* ── Client view ────────────────────────────────────────────────────── */

/**
 * What the interactive list needs, and nothing else. Passing the full sheet
 * to the client component would serialize every research object (including
 * each incumbent's 73 decisions) into the page twice.
 */
export type ClientSheet = {
  raceId: string;
  raceTitle: string;
  office: Office;
  /** True when the ballot ranks candidates; the reader's list then reads as an order, otherwise as a shortlist. */
  ranked: boolean;
  district: string;
  candidateIds: string[];
  rows: SheetRow[];
  /** The four issues as this office frames them (labels, questions); ids are shared by every race. */
  issues: Issue[];
  coverage: Record<IssueId, number>;
  topics: ExtraTopic[];
  topicCoverage: Record<string, number>;
  /** For topics that match a Council decision: what was decided, for the vote card. */
  topicDecisions: Record<string, TopicDecision>;
  featured: { questionId: string; title: string; votes: { id: string; name: string; vote: VoteWord }[] }[];
};

export function clientSheet(sheet: RaceSheet): ClientSheet {
  return {
    raceId: sheet.race.id,
    raceTitle: sheet.race.title,
    office: sheet.office,
    ranked: /rank/i.test(sheet.race.method) || /rank/i.test(sheet.ballot?.text ?? ""),
    district: shortRaceTitle(sheet.race),
    candidateIds: sheet.rows.map((r) => r.id),
    rows: sheet.rows,
    issues: issuesFor(sheet.office.group),
    coverage: sheet.coverage,
    topics: topicsFor(sheet.race),
    topicCoverage: Object.fromEntries(
      topicsFor(sheet.race).map((t) => [t.id, sheet.rows.filter((r) => r.topicCells[t.id]?.vote || r.topicCells[t.id]?.chip).length]),
    ),
    topicDecisions: Object.fromEntries(
      topicsFor(sheet.race).flatMap((t) => {
        const d = t.decisionId ? councilDecisions.find((x) => x.id === t.decisionId) : undefined;
        return d ? [[t.id, { title: d.title, voteLabel: d.voteLabel ?? null, source: sourceChip(d.source) } satisfies TopicDecision]] : [];
      }),
    ),
    featured: sheet.featured.map((f) => ({
      questionId: f.questionId,
      title: f.title,
      votes: f.votes.map(({ id, name, vote }) => ({ id, name, vote })),
    })),
  };
}

/* ── Builder ────────────────────────────────────────────────────────── */

export function buildRaceSheet(race: Race): RaceSheet {
  const office = officeOf(race);
  const people = [...race.candidates].sort(byName);
  const topics = topicsFor(race);
  const rows = people.map((p) => buildRow(p, topics));
  const paragraph = choiceParagraphs.find((c) => c.raceId === race.id);
  const coverage = Object.fromEntries(
    ISSUE_IDS.map((issue) => [issue, people.filter((p) => p.analysis?.issues[issue]).length]),
  ) as Record<IssueId, number>;
  return {
    race,
    office,
    stakes: stakesFor(race),
    district: districts.find((d) => d.raceId === race.id) ?? null,
    ballot: ballotInstructions.find((b) => b.raceId === race.id) ?? null,
    choice: paragraph
      ? { text: paragraph.text, reviewed: paragraph.reviewedBy !== "pending" }
      : { text: race.comparison, reviewed: true },
    rows,
    incumbents: people.filter(isIncumbent).sort(byName).map((p) => ({ id: p.id, name: p.name })),
    coverage,
    featured: buildFeatured(race, people),
    otherRaces: races
      .filter((r) => r.id !== race.id && officeOf(r).group === office.group)
      .map((r) => ({ id: r.id, title: r.title, short: shortRaceTitle(r) })),
    version: raceSheetVersion,
  };
}

export { issues, ISSUE_IDS };
export { issuesFor } from "./issue-framing";
export type { IssueId };
