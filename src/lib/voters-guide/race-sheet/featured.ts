import type { FeaturedVote } from "./types";

/**
 * The four Council votes featured on each race sheet: the most reported and
 * most divided decisions among that district's sitting councilors, phrased
 * as the question Council decided (discovery.ts). The rule is printed in
 * the About strip; the full 29-topic record is one tap away. A computed
 * "most split" rule was tested and rejected because alphabetical tie-breaks
 * surfaced office-budget procedure over camps and the arena.
 */
export const featuredVotes: FeaturedVote[] = [
  { raceId: "portland-district-3", questionId: "camp-removal" },
  { raceId: "portland-district-3", questionId: "water-rates" },
  { raceId: "portland-district-3", questionId: "oversight-funding" },
  { raceId: "portland-district-3", questionId: "moda" },
  { raceId: "portland-district-4", questionId: "water-rates" },
  { raceId: "portland-district-4", questionId: "street-fee" },
  { raceId: "portland-district-4", questionId: "oversight-funding" },
  { raceId: "portland-district-4", questionId: "moda" },
];
