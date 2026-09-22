import type { BallotInstruction, DistrictInfo } from "../types";
import { packs } from "./packs";

const CHECKED = "Checked September 19, 2026";

/**
 * Neighborhood lines come from the City's own district pages
 * (portland.gov/council/districts/N), which list every neighborhood
 * association in each district. The line names a recognisable subset using
 * the page's own names, lightly shortened ("Downtown" for "Portland
 * Downtown"); nothing is listed that the page does not. The District 3 page
 * lists 21 neighborhoods A–Z without a compass grouping; its list spans
 * Southeast and inner Northeast (Laurelhurst, Rose City Park, Roseway,
 * Beaumont-Wilshire, Madison South), so the heading says so rather than
 * "Inner Southeast", which misplaced the Northeast names.
 * Three neighborhoods (Ardenwald-Johnson Creek, Brooklyn, Woodstock) appear
 * on both the District 3 and District 4 pages because the boundary splits
 * them; each is listed only under the district whose page lists it first
 * by geography, and the lookup link covers the rest.
 */
const councilDistricts: DistrictInfo[] = [
  {
    raceId: "portland-district-3",
    neighborhoods:
      "Southeast and inner Northeast: Buckman, Kerns, Hosford-Abernethy, Richmond, Sunnyside, Mt. Tabor, Laurelhurst, Rose City Park, Roseway, Montavilla, Brooklyn, Creston-Kenilworth, Foster-Powell, Mt. Scott-Arleta, Woodstock and Brentwood-Darlington.",
    mapUrl: "https://www.portland.gov/council/districts/3",
    mapSource: {
      label: "City of Portland · District 3 · neighborhoods in the district",
      url: "https://www.portland.gov/council/districts/3",
      kind: "Election authority",
      date: CHECKED,
    },
  },
  {
    raceId: "portland-district-4",
    neighborhoods:
      "The west side plus a slice of Southeast: Downtown, Pearl District, Old Town, Northwest District, Goose Hollow, Southwest Hills, Hillsdale, Multnomah, Forest Park, Linnton, South Portland, Sellwood-Moreland and Eastmoreland. Some neighborhoods are split between districts; use the lookup link.",
    mapUrl: "https://www.portland.gov/council/districts/4",
    mapSource: {
      label: "City of Portland · District 4 · neighborhoods in the district",
      url: "https://www.portland.gov/council/districts/4",
      kind: "Election authority",
      date: CHECKED,
    },
  },
];

/**
 * The ranking limit is never derived from seat counts. The City's official
 * ranked-choice page states that for City Council a voter "can continue
 * ranking up to six candidates" and that "Ranking other candidates does not
 * impact your first choice."
 */
const rankedChoicePage = {
  label: "City of Portland · How does Ranked Choice Voting work?",
  url: "https://www.portland.gov/vote/ranked-choice-voting",
  kind: "Election authority" as const,
  date: CHECKED,
};

const RANKED_CHOICE_NOTE =
  "Ranking more people never hurts your first choice. Later choices count only if an earlier one is eliminated or already elected.";

const councilBallots: BallotInstruction[] = [
  {
    raceId: "portland-district-3",
    text: "You rank up to six candidates for three seats.",
    note: RANKED_CHOICE_NOTE,
    source: rankedChoicePage,
  },
  {
    raceId: "portland-district-4",
    text: "You rank up to six candidates for three seats.",
    note: RANKED_CHOICE_NOTE,
    source: rankedChoicePage,
  },
];

export const districts: DistrictInfo[] = [...councilDistricts, ...packs.flatMap((p) => p.districts)];
export const ballotInstructions: BallotInstruction[] = [...councilBallots, ...packs.flatMap((p) => p.ballots)];
