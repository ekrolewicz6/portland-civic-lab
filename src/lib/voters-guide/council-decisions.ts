import type { Candidate, Evidence } from "./types";
import { historicalDecisions } from "./council-history";
import { decisionAccounts } from "./council-record-accounts";
export type CouncilDecision = {
  id: string;
  title: string;
  voteLabel?: string;
  summary: string;
  limit: string;
  source: Evidence;
  votes: Record<string, "Yes" | "No" | "Absent">;
};
export const councilDecisions: CouncilDecision[] = [
  ...historicalDecisions,
  {
    id: "rental-pricing",
    title: "Restrict algorithmic rent coordination",
    summary:
      "Ordinance 192122 restricted certain rental-pricing coordination software. Passed 8–2, with two absent.",
    limit:
      "An enacted regulation, not evidence that rents subsequently fell. Absence is not a vote against the ordinance.",
    source: {
      label: "Ordinance 192122 · final roll call",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192122",
      kind: "Public record",
      date: "November 19, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Absent",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "Absent",
    },
  },
  {
    id: "supplemental-budget",
    title: "Restore services using one-time funds",
    summary:
      "Ordinance 192207 used about $12.2 million, including contingency reserves, to preserve 30 positions and restore services. Passed 10–2.",
    limit:
      "One-time funding did not resolve the recurring budget gap. The final package differed from amendments; a no vote does not prove opposition to every funded service.",
    source: {
      label: "Ordinance 192207 · amended budget and final roll call",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192207",
      kind: "Public record",
      date: "July 22, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "moda",
    title: "Approve the Moda negotiating framework",
    summary:
      "Resolution 37750 approved the amended, non-binding Moda Center term sheet. Passed 8–4.",
    limit:
      "A negotiating framework, not a final construction contract. Support or opposition to this package is not a complete position on retaining the Trail Blazers.",
    source: {
      label: "Resolution 37750 · final roll call and amendments",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37750",
      kind: "Public record",
      date: "August 12, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "data-centers",
    title: "Seek transparency and future data-center restrictions",
    summary:
      "Resolution 37753 sought disclosure of major data-center inquiries and expressed intent to pursue restrictions. Passed 11–0, with one absent.",
    limit:
      "This resolution did not itself enact a moratorium. All six incumbents in these races voted yes on the final text, despite differences over an amendment.",
    source: {
      label: "Resolution 37753 · adopted text and final roll call",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37753",
      kind: "Public record",
      date: "September 16, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
];

export function withCouncilDecisions(person: Candidate): Candidate {
  const decisions = councilDecisions.filter((d) => d.votes[person.name]);
  if (!decisions.length) return person;
  return {
    ...person,
    record: [
      ...decisions.map((d) => ({
        decisionId: d.id,
        text: `${d.votes[person.name]} · ${d.title}. ${decisionAccounts[d.id]?.[person.name]?.action ?? d.summary}`,
        source: d.source,
      })),
      ...(person.record ?? []).filter(
        (r) => !decisions.some((d) => d.source.url === r.source.url),
      ),
    ],
  };
}
