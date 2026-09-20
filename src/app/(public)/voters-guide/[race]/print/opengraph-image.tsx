/**
 * The print edition shares the race's card: same artwork, same alt, so a
 * shared "Print everything" link renders the district card instead of a bare
 * one. The route config is declared here explicitly because Next reads it by
 * static analysis, not through a re-export.
 */
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/voters-guide/race-sheet/og-fonts";

export { default, alt } from "../opengraph-image";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
