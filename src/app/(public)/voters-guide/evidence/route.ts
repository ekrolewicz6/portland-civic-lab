import { councilReaderCopy, councilReaderVersion } from "@/lib/voters-guide/council-reader-copy";
import {
  explorerVersion,
  explorerTopics,
  hasTopic,
} from "@/lib/voters-guide/explorer";
import { races } from "@/lib/voters-guide/published";
import { REVIEW_DATE } from "@/lib/voters-guide/types";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";
import { councilCoverageAudit } from "@/lib/voters-guide/council-coverage-map";
import {
  discoveryVersion,
  questionCoverage,
  questions,
  experienceOptions,
  discoveryEvidence,
} from "@/lib/voters-guide/discovery";
import {
  councilDisagreements,
  decisionAccounts,
} from "@/lib/voters-guide/council-record-accounts";
import { raceSheetVersion, issues as raceSheetIssues } from "@/lib/voters-guide/race-sheet";
import { featuredVotes } from "@/lib/voters-guide/race-sheet/featured";
import { issueLines } from "@/lib/voters-guide/race-sheet/content/lines";
import { stanceChips } from "@/lib/voters-guide/race-sheet/content/stances";
import { choiceParagraphs } from "@/lib/voters-guide/race-sheet/content/choice";
import { saidPlacements } from "@/lib/voters-guide/race-sheet/content/said";
import { missingStates, primaryStatements, roleOverrides } from "@/lib/voters-guide/race-sheet/content/roles";
import { ballotInstructions, districts } from "@/lib/voters-guide/race-sheet/content/districts";
import { answers } from "@/lib/voters-guide/race-sheet/content/answers";
import { deliveries } from "@/lib/voters-guide/race-sheet/content/delivery";
import { topicStances } from "@/lib/voters-guide/race-sheet/content/topic-stances";
import { extraTopics } from "@/lib/voters-guide/race-sheet/topics";
import { ownWords } from "@/lib/voters-guide/race-sheet/content/own-words";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      title: "Portland Civic Lab · November 2026 Council voters guide",
      reviewed: REVIEW_DATE,
      status:
        "Working research edition; separate human editorial review is incomplete.",
      methodology: "https://www.portlandciviclab.org/voters-guide/methodology",
      note: "Candidate statements, independent records and editorial interpretations are separate fields. Missing research is not evidence of a missing position. This is an editorial snapshot, not a live official ballot.",
      races,
      councilDecisions,
      decisionAccounts,
      councilDisagreements,
      councilReaderVersion,
      councilReaderCopy,
      councilCoverageAudit,
      raceSheet: {
        version: raceSheetVersion,
        status:
          "Current presentation layer. Short lines are shortened from the named parent field and carry a review status; 'pending' means separate human review has not yet occurred.",
        issues: raceSheetIssues,
        featuredVotes,
        choiceParagraphs,
        issueLines,
        stanceChips,
        saidPlacements,
        roleOverrides,
        missingStates,
        primaryStatements,
        districts,
        ballotInstructions,
        answers,
        extraTopics,
        topicStances,
        deliveries,
        ownWords,
        rules:
          "Every candidate on the checked roster, alphabetical, one line each. A line may omit, never add. A dash is a research gap, not a position. Featured votes are chosen editorially and disclosed; challengers appear beneath a vote only for an explicit statement about that exact choice. Extra topics are the same for every candidate: an incumbent's recorded vote where a topic matches a Council decision, otherwise only an explicit, sourced statement about that choice; nothing is inferred from silence, party or broad goals. Each brief opens with the verbatim opening of the candidate's own statement under one mechanical rule (ownWords), so the guide never chooses which sentence to feature. The ladder (what, how, measured by) shows only rungs the candidate has stated, each with its own source; a missing rung is a gap, and where the Lab has asked the candidate the date is recorded. The reader's list is never seeded, ordered, scored, shared or recorded.",
      },
      explorer: {
        status: "Retired September 19, 2026; replaced by the race sheet",
        version: explorerVersion,
        topics: explorerTopics,
        coverage: races.map((race) => ({
          raceId: race.id,
          topics: explorerTopics.map((topic) => ({
            id: topic.id,
            documented: race.candidates
              .filter((p) => hasTopic(p, topic.id))
              .map((p) => p.id),
            total: race.candidates.length,
          })),
        })),
        rules:
          "Alphabetical, source-backed topic comparison. No alignment scoring or experience filtering. Missing topic positions are listed separately; all candidates remain available at a glance. Selected candidates without a topic position retain their broader platform, explicitly labeled.",
      },
      discovery: {
        status: "Retired; not used by the current guide",
        retiredReason:
          "Sparse answers to exact proposals could not produce useful candidate alignment results.",
        version: discoveryVersion,
        questions,
        experienceOptions,
        coverage: races.map((r) => ({
          raceId: r.id,
          questions: questions.map((q) => ({
            id: q.id,
            ...questionCoverage(r.candidates, q),
          })),
        })),
        candidates: races.flatMap((r) =>
          r.candidates.map((c) => ({ id: c.id, ...discoveryEvidence(c) })),
        ),
        rules:
          "Exact recorded votes establish agreement or disagreement with that past proposal, not a complete current position. At least two documented votes and differing positions within the race are required for a question to affect groups. Conditions, absence and missing answers remain unknown. Broad campaign goals are not votes on specific proposals. Within policy groups, selected experience preferences precede alphabetical order. Requirements are never silently relaxed. No overall score or ballot ranking.",
      },
    },
    {
      headers: {
        "Content-Disposition":
          'attachment; filename="oregon-voters-guide-2026.json"',
      },
    },
  );
}
