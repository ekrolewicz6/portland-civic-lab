/**
 * Archive the district polygons that gate Portland small-business funding.
 *
 *   npx tsx ingest/business/fetch-boundaries.ts
 *
 * Why archive rather than query live: the City's open-data ArcGIS endpoint is
 * not dependable enough to sit in a user-facing request. Measured behaviour is
 * bimodal — 0.2s responses interleaved with 60-second waits ending in
 * "503 Wait timeout for the request exceeded." An address check that hangs for
 * a minute and then reports nothing is worse than one that never shipped,
 * because a business owner reads "no programmes" rather than "we broke."
 *
 * There are only 13 tax-increment districts and ~50 business districts, and
 * their boundaries change on the order of years. So we pull them once, commit
 * them, and run point-in-polygon locally: instant, reliable, and versioned —
 * if a district boundary moves, it shows up as a reviewable diff instead of
 * silently changing who qualifies for what.
 *
 * Same discipline as the budget books and the advisory-committee documents.
 */

import fs from "node:fs";
import path from "node:path";

const OD = "https://www.portlandmaps.com/od/rest/services/COP_OpenData_Boundary/MapServer";
const OUT_DIR = "src/data/business";

/** ~1 metre. Far finer than the boundaries themselves are surveyed. */
const COORD_PRECISION = 5;

interface LayerSpec {
  id: number;
  key: string;
  label: string;
  fields: string;
  /** Map raw ArcGIS attributes to the compact shape we store. */
  pick: (p: Record<string, unknown>) => Record<string, unknown> | null;
}

const LAYERS: LayerSpec[] = [
  {
    id: 1423,
    key: "tif-districts",
    label: "Tax Increment Finance districts",
    fields: "NAME,Acres",
    pick: (p) => {
      const name = typeof p.NAME === "string" ? p.NAME.trim() : "";
      return name ? { name, acres: Math.round(Number(p.Acres) || 0) } : null;
    },
  },
  {
    id: 11,
    key: "business-districts",
    label: "Business districts",
    fields: "NAME,MEMBER,WEBSITE",
    pick: (p) => {
      const name = typeof p.NAME === "string" ? p.NAME.trim() : "";
      if (!name) return null;
      const site = typeof p.WEBSITE === "string" ? p.WEBSITE.trim() : "";
      return {
        name,
        // Venture Portland grants flow through member associations, so this
        // single flag decides whether a district pathway is real or a dead end.
        member: String(p.MEMBER ?? "").trim().toLowerCase() === "yes",
        website: site && site !== "<Null>" ? site : null,
      };
    },
  },
];

function round(n: number): number {
  const f = 10 ** COORD_PRECISION;
  return Math.round(n * f) / f;
}

/** Recursively round every coordinate pair in a GeoJSON geometry. */
function roundCoords(c: unknown): unknown {
  if (Array.isArray(c)) {
    if (typeof c[0] === "number" && typeof c[1] === "number") {
      return [round(c[0] as number), round(c[1] as number)];
    }
    return c.map(roundCoords);
  }
  return c;
}

async function fetchLayer(spec: LayerSpec, tries = 8): Promise<GeoJSON.FeatureCollection> {
  for (let i = 0; i < tries; i++) {
    try {
      const url = new URL(`${OD}/${spec.id}/query`);
      Object.entries({
        where: "1=1",
        outFields: spec.fields,
        returnGeometry: "true",
        outSR: "4326",
        f: "geojson",
      }).forEach(([k, v]) => url.searchParams.set(k, v));

      const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
      const data = (await res.json()) as GeoJSON.FeatureCollection & {
        error?: { message?: string };
      };
      if (data.error) throw new Error(data.error.message ?? "ArcGIS error");
      if (!data.features?.length) throw new Error("no features returned");
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (i === tries - 1) throw new Error(`${spec.label}: ${msg}`);
      process.stdout.write(`  retry ${i + 1} (${msg}) … `);
      await new Promise((r) => setTimeout(r, 3_000));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const summary: Record<string, { label: string; count: number; kb: number }> = {};

  for (const spec of LAYERS) {
    process.stdout.write(`${spec.label} … `);
    const raw = await fetchLayer(spec);

    const features = raw.features
      .map((f) => {
        const props = spec.pick((f.properties ?? {}) as Record<string, unknown>);
        if (!props || !f.geometry) return null;
        return {
          type: "Feature" as const,
          properties: props,
          geometry: {
            ...f.geometry,
            coordinates: roundCoords(
              (f.geometry as { coordinates: unknown }).coordinates,
            ),
          },
        };
      })
      .filter(Boolean);

    const out = {
      source: `${OD}/${spec.id}`,
      label: spec.label,
      retrieved: new Date().toISOString().slice(0, 10),
      coordinatePrecision: COORD_PRECISION,
      type: "FeatureCollection" as const,
      features,
    };

    const file = path.join(OUT_DIR, `${spec.key}.json`);
    fs.writeFileSync(file, JSON.stringify(out));
    const kb = fs.statSync(file).size / 1024;
    summary[spec.key] = { label: spec.label, count: features.length, kb };
    console.log(`${features.length} districts, ${kb.toFixed(0)} KB`);
  }

  const total = Object.values(summary).reduce((s, v) => s + v.kb, 0);
  console.log(`\nTotal committed: ${total.toFixed(0)} KB`);
  console.log(`Written to ${OUT_DIR}/`);
}

main().catch((e) => {
  console.error(`\nFAILED: ${e.message}`);
  process.exit(1);
});
