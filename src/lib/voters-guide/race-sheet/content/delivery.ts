import { deliveriesD3 } from "./delivery-d3";
import { deliveriesD4 } from "./delivery-d4";
import { packs } from "./packs";
/** How each candidate says they would deliver an issue promise, and how they would measure it. */
export const deliveries = [...deliveriesD3, ...deliveriesD4, ...packs.flatMap((p) => p.deliveries)];
