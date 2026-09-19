import { races } from "@/lib/voters-guide/published";
import { REVIEW_DATE } from "@/lib/voters-guide/types";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";

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
    },
    {
      headers: {
        "Content-Disposition":
          'attachment; filename="oregon-voters-guide-2026.json"',
      },
    },
  );
}
