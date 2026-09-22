import { emptyPack, type RacePack, type RaceStakes } from "../../types";

/**
 * Race pack: Portland City Council districts. The council races keep their
 * original content files (lines, chips, deliveries, topics, stances); this
 * pack carries only what those files never had, the "What's at stake" block
 * for each district, to the same standard as the governor's and the
 * county's (../../types.ts, RaceStakes).
 */

const stakes: RaceStakes[] = [];

export const pack: RacePack = {
  ...emptyPack(),
  stakes,
};
