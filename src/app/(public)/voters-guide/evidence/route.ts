import { races } from "@/lib/voters-guide/published";
import { REVIEW_DATE } from "@/lib/voters-guide/types";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";
import { councilCoverageAudit } from "@/lib/voters-guide/council-coverage-map";
import {
  discoveryVersion,
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
      councilCoverageAudit,
      discovery: {
        version: discoveryVersion,
        questions,
        experienceOptions,
        candidates: races.flatMap((r) =>
          r.candidates.map((c) => ({ id: c.id, ...discoveryEvidence(c) })),
        ),
        rules:
          "Explicit support establishes alignment. Only explicit opposition establishes disagreement. All other answers remain unknown. Within policy groups, selected experience preferences precede alphabetical order. Requirements are never silently relaxed. No overall score or ballot ranking.",
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
