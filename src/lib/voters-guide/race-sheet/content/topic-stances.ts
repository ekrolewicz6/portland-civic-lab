import { topicStancesD3 } from "./topic-stances-d3";
import { topicStancesD4 } from "./topic-stances-d4";
import { packs } from "./packs";
/** Explicit, sourced stances on the extra topics. Never inferred from party, silence or broad goals. */
export const topicStances = [...topicStancesD3, ...topicStancesD4, ...packs.flatMap((p) => p.topicStances)];
