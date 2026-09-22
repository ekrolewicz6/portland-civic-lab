import type { ChoiceParagraph } from "../types";
import { packs } from "./packs";

/**
 * ≤45 words per race, no names, no forced binaries. Each paragraph is a
 * rewrite of `race.comparison` checked against the field of authored
 * positions in council-analysis.ts: it names the axes on which candidates
 * differ as "how far to rely on A versus B", never "A, or B", and it says
 * plainly that many candidates propose some of each. Claims are no stronger
 * than the parent sentence makes them.
 */
const councilChoice: ChoiceParagraph[] = [
  {
    raceId: "portland-district-3",
    text: "Candidates differ on how far to rely on building new homes versus protecting renters, on the mix of police and unarmed responders, and on how far to lean on taxes and utility bills versus trimming services. Many propose some of each.",
    from: "race.comparison",
    reviewedBy: "pending",
    reviewedOn: "2026-09-19",
  },
  {
    raceId: "portland-district-4",
    text: "Candidates differ on how far to fund recovery through public housing and new corporate contributions versus private development and restraint on taxes, on camp enforcement, and on public investment in Moda Center. Many propose some of each.",
    from: "race.comparison",
    reviewedBy: "pending",
    reviewedOn: "2026-09-19",
  },
];

export const choiceParagraphs: ChoiceParagraph[] = [...councilChoice, ...packs.flatMap((p) => p.choice)];
