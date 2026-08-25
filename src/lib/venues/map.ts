/**
 * Geometry for the venue map: an abstracted Portland, drawn as inline SVG.
 *
 * Coordinates are hand-placed on a 100 × 120 canvas (x: west to east,
 * y: north to south) to match the venues' real relative geography, not a
 * projection. The point of the map is recognition: the river, the grid,
 * and the realization that the dots cover the whole city.
 */

export type VenueRing = "spectator" | "arts" | "civic";

export interface VenuePoint {
  id: string;
  name: string;
  short: string;
  x: number;
  y: number;
  /** 1 = major (arena/stadium scale), 2 = mid (theater scale), 3 = neighborhood */
  tier: 1 | 2 | 3;
  ring: VenueRing;
  /** Which side the desktop label sits on. */
  side: "left" | "right";
  note?: string;
}

export const MAP_VIEWBOX = { w: 100, h: 120 };

/** The Columbia, across the top. */
export const COLUMBIA_PATH = "M 0 7 C 20 5.5, 45 8, 62 6.5 C 78 5.2, 90 7, 100 6";

/** The Willamette, south to north, meeting the Columbia at the top left. */
export const WILLAMETTE_PATH =
  "M 55 120 C 53 105, 49 92, 49.5 82 C 50 72, 47 64, 47.5 56 C 48 47, 45 38, 43.5 28 C 42 19, 39 12, 35 7.5";

/** Two bridge strokes across the downtown reach, for texture. */
export const BRIDGE_PATHS = [
  "M 44.2 51.5 L 51.8 50.2",
  "M 44.8 58.5 L 52.2 57.6",
  "M 43.4 44.6 L 50.6 43.4",
];

export const VENUE_POINTS: VenuePoint[] = [
  { id: "pir", name: "Portland International Raceway", short: "PIR", x: 29, y: 13, tier: 1, ring: "civic", side: "left", note: "on the site of Vanport" },
  { id: "delta", name: "East Delta fields", short: "East Delta", x: 41, y: 15.5, tier: 3, ring: "civic", side: "right" },
  { id: "ifcc", name: "Interstate Firehouse Cultural Center", short: "IFCC", x: 46.5, y: 38, tier: 3, ring: "arts", side: "left" },
  { id: "vmc", name: "Veterans Memorial Coliseum", short: "Coliseum", x: 50, y: 43, tier: 1, ring: "spectator", side: "right" },
  { id: "moda", name: "Moda Center", short: "Moda Center", x: 53.6, y: 47.6, tier: 1, ring: "spectator", side: "right" },
  { id: "erv", name: "Erv Lind Stadium", short: "Erv Lind", x: 66, y: 40, tier: 3, ring: "civic", side: "right" },
  { id: "providence", name: "Providence Park", short: "Providence Park", x: 37.5, y: 55.5, tier: 1, ring: "spectator", side: "left" },
  { id: "schnitzer", name: "Arlene Schnitzer Concert Hall", short: "Schnitzer", x: 42.8, y: 56.2, tier: 2, ring: "arts", side: "left" },
  { id: "hatfield", name: "Antoinette Hatfield Hall", short: "Hatfield", x: 43.4, y: 58.4, tier: 2, ring: "arts", side: "left" },
  { id: "pioneer", name: "Pioneer Courthouse Square", short: "Pioneer Square", x: 44.6, y: 54.2, tier: 2, ring: "civic", side: "right" },
  { id: "waterfront", name: "Tom McCall Waterfront Park", short: "Waterfront", x: 46.6, y: 57.2, tier: 3, ring: "civic", side: "right" },
  { id: "keller", name: "Keller Auditorium", short: "Keller", x: 45.4, y: 60.5, tier: 2, ring: "arts", side: "right" },
  { id: "cmc", name: "Community Music Center", short: "Music Center", x: 58, y: 66, tier: 3, ring: "arts", side: "right" },
  { id: "walker", name: "Walker Stadium", short: "Walker Stadium", x: 72, y: 68, tier: 3, ring: "civic", side: "right", note: "the Pickles' park" },
  { id: "sckavone", name: "Sckavone Stadium", short: "Sckavone", x: 52, y: 77.5, tier: 3, ring: "civic", side: "right" },
  { id: "mac", name: "Multnomah Arts Center", short: "Arts Center", x: 35, y: 82, tier: 3, ring: "arts", side: "left" },
];

/** Freeways, drawn faint: recognition, not navigation. */
export const FREEWAY_PATHS = [
  { id: "i5", d: "M 56 5 C 55 20, 53.8 34, 53.8 46 C 53.8 58, 55.5 74, 56.5 90 C 57 100, 57.5 110, 58 118", label: "I-5", lx: 57.2, ly: 24 },
  { id: "i405", d: "M 53.8 49 C 46 50, 39.5 51.5, 38 55 C 36.5 58.5, 39 62.5, 45 63.5 C 49 64.2, 52.5 63.5, 54.3 61.5", label: "", lx: 0, ly: 0 },
  { id: "i84", d: "M 54.2 47.5 C 65 46.5, 80 45.5, 100 44.5", label: "I-84", lx: 88, ly: 43.6 },
];

/** The dense downtown cluster gets a magnified inset. */
export const DOWNTOWN_IDS = new Set([
  "providence",
  "schnitzer",
  "hatfield",
  "pioneer",
  "waterfront",
  "keller",
]);

export const DOWNTOWN_REGION = { x: 36, y: 52, w: 12.5, h: 10 };
export const INSET_FRAME = { x: 4, y: 90, w: 34, h: 26 };

export function insetProject(x: number, y: number) {
  return {
    x: INSET_FRAME.x + ((x - DOWNTOWN_REGION.x) / DOWNTOWN_REGION.w) * INSET_FRAME.w,
    y: INSET_FRAME.y + ((y - DOWNTOWN_REGION.y) / DOWNTOWN_REGION.h) * INSET_FRAME.h,
  };
}

export const RING_META: Record<VenueRing, { label: string; colorVar: string }> = {
  spectator: { label: "Spectator venues", colorVar: "--color-ember" },
  arts: { label: "Performing arts & culture", colorVar: "--color-clay" },
  civic: { label: "Parks & civic spaces", colorVar: "--color-fern" },
};

export const TIER_RADIUS: Record<1 | 2 | 3, number> = { 1: 2.6, 2: 1.7, 3: 1.1 };

/**
 * Schematic positions for the portfolio quadrant: demand (y, up is stronger)
 * versus how much the owner actually knows about the economics (x, right is
 * clearer). Positions are drawn from our grades in the ranking table; they
 * are placements, not measurements.
 */
export interface QuadrantPoint {
  id: string;
  label: string;
  x: number; // 0..100, owner clarity
  y: number; // 0..100, demand
  ring: VenueRing;
}

export const QUADRANT_POINTS: QuadrantPoint[] = [
  { id: "moda", label: "Moda Center", x: 22, y: 92, ring: "spectator" },
  { id: "providence", label: "Providence Park", x: 38, y: 96, ring: "spectator" },
  { id: "keller", label: "Keller", x: 68, y: 84, ring: "arts" },
  { id: "pir", label: "PIR", x: 62, y: 66, ring: "civic" },
  { id: "vmc", label: "Coliseum", x: 30, y: 58, ring: "spectator" },
  { id: "newmark", label: "Newmark", x: 48, y: 55, ring: "arts" },
  { id: "schnitzer", label: "Schnitzer", x: 55, y: 74, ring: "arts" },
  { id: "pioneer", label: "Pioneer Square", x: 40, y: 70, ring: "civic" },
  { id: "winningstad", label: "Winningstad", x: 44, y: 28, ring: "arts" },
  { id: "brunish", label: "Brunish", x: 42, y: 16, ring: "arts" },
  { id: "rqland", label: "RQ land & garages", x: 26, y: 76, ring: "spectator" },
  { id: "smaller", label: "Neighborhood venues", x: 14, y: 40, ring: "civic" },
];
