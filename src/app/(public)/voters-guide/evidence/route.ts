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
      explorer: {
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
