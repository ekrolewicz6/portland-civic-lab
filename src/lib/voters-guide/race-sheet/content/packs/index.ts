import type { RacePack } from "../../types";
import { pack as countyMultnomah } from "./county-multnomah";
import { pack as countyWashington } from "./county-washington";
import { pack as countyClackamas } from "./county-clackamas";
import { pack as state } from "./state";
import { pack as federal } from "./federal";
import { pack as legislature } from "./legislature";
import { pack as cityMultnomah } from "./city-multnomah";
import { pack as cityWashington } from "./city-washington";
import { pack as cityClackamas } from "./city-clackamas";
import { pack as council } from "./council";

/** Every pack, in hub order. The council races keep their original content files; their pack carries only the stakes block. */
export const packs: RacePack[] = [council, countyMultnomah, countyWashington, countyClackamas, state, federal, legislature, cityMultnomah, cityWashington, cityClackamas];
