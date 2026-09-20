import { districtShapes, type DistrictNumber } from "./district-shapes";

/**
 * Deterministic points inside a council district, for the hub's opening
 * composition: each candidate stands on the ground they want to represent.
 * Same seed, same picture on every render and every deploy.
 *
 * The district path is "M x y L x y … Z" rings (even-odd). The largest ring
 * is the mainland; a point counts as inside when it and four offsets of the
 * marker radius are all inside it, so a marker never crosses the border.
 */

type Ring = [number, number][];

function rings(path: string): Ring[] {
  return path
    .split("M")
    .filter(Boolean)
    .map((sub) =>
      sub
        .replace(/Z/g, "")
        .split("L")
        .map((pair) => pair.trim().split(/\s+/).map(Number) as [number, number])
        .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)),
    );
}

function area(ring: Ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(a / 2);
}

function inside([x, y]: [number, number], ring: Ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type ScatterPoint = { x: number; y: number };

/**
 * `count` points inside the district, at least `spacing` apart, each fully
 * inside by `radius`, and clear of the label anchor by `labelClearance`.
 * Falls back to looser spacing if the district cannot hold them.
 */
export function scatterInDistrict(
  district: DistrictNumber,
  count: number,
  { radius = 14, spacing = 34, labelClearance = 44, seed = 2026 } = {},
): ScatterPoint[] {
  const shape = districtShapes.find((s) => s.district === district);
  if (!shape) return [];
  const main = rings(shape.path).sort((a, b) => area(b) - area(a))[0];
  const xs = main.map((p) => p[0]);
  const ys = main.map((p) => p[1]);
  const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const [lx, ly] = shape.centroid;
  const rand = mulberry32(seed + district * 97);
  const fits = (p: [number, number]) =>
    inside(p, main) &&
    inside([p[0] - radius, p[1]], main) &&
    inside([p[0] + radius, p[1]], main) &&
    inside([p[0], p[1] - radius], main) &&
    inside([p[0], p[1] + radius], main);

  for (let gap = spacing; gap >= radius * 1.7; gap -= 2) {
    const points: ScatterPoint[] = [];
    for (let tries = 0; tries < 20000 && points.length < count; tries++) {
      const p: [number, number] = [box.x0 + rand() * (box.x1 - box.x0), box.y0 + rand() * (box.y1 - box.y0)];
      if (!fits(p)) continue;
      if (Math.hypot(p[0] - lx, p[1] - ly) < labelClearance) continue;
      if (points.some((q) => Math.hypot(q.x - p[0], q.y - p[1]) < gap)) continue;
      points.push({ x: p[0], y: p[1] });
    }
    if (points.length === count) return points;
  }
  return [];
}
