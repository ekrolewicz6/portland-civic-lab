/** Plain definitions rendered inline as <dfn> on first use. */
export const glossary: Record<string, { term: string; definition: string }> = {
  amendment: {
    term: "Amendment",
    definition: "A proposed change to a measure before the final vote. Voting for an amendment is not the same as voting for the whole measure.",
  },
  "supplemental-budget": {
    term: "Supplemental budget",
    definition: "A mid-year change to the city budget after the main budget is adopted.",
  },
  appropriation: {
    term: "Appropriation",
    definition: "Permission to spend money on something. It does not mean the money has been spent or the result achieved.",
  },
  pcef: {
    term: "PCEF",
    definition: "The Portland Clean Energy Fund: a tax on large retailers that pays for climate projects. Council has debated using its interest for other services.",
  },
  "term-sheet": {
    term: "Term sheet",
    definition: "Starting terms for a negotiation. Approving one is not a final contract.",
  },
  "social-housing": {
    term: "Social housing",
    definition: "Housing owned by the public or a nonprofit and rented at controlled prices.",
  },
  "cei-hub": {
    term: "CEI Hub",
    definition: "The fuel-storage area along the Willamette in Northwest Portland, where Zenith Energy operates.",
  },
  "ranked-choice": {
    term: "Ranked choice",
    definition: "You rank candidates in order. If your first choice is eliminated or already elected, your vote counts toward your next choice.",
  },
};
export type GlossaryKey = keyof typeof glossary;
