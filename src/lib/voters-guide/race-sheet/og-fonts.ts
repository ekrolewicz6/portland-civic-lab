/**
 * Shared pieces for the Race Sheet share images (race, candidate, votes).
 *
 * Fonts are fetched the same way `voters-guide/share/[card]/route.tsx` does:
 * `fetch(new URL(..., import.meta.url))`, which the bundler turns into a
 * static asset URL that works on the edge runtime. The palette is the one
 * the district card already uses, so every guide image reads as one family.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** The district card's colours: cream left panel, deep green right panel, gold accents. */
export const OG_PALETTE = {
  green: "#173c30",
  cream: "#f5f1e7",
  gold: "#d2aa76",
  /** Muted green for eyebrows and supporting copy on cream. */
  moss: "#52634e",
  /** Body copy on cream. */
  pine: "#40594b",
  /** Hairlines on cream. */
  hairline: "#bac3b2",
  /** The arched frame on green. */
  frame: "#56735b",
  /** Small copy on green. */
  mist: "#d2ddc8",
} as const;

/** Long-lived caching for artwork that changes only with a data edit and a redeploy. */
export const OG_CACHE_HEADERS = { "Cache-Control": "public, max-age=86400, s-maxage=31536000" };

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: "normal";
};

/** Cormorant Garamond Medium (display) and DM Sans Regular (everything else). */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [serif, sans] = await Promise.all([
    fetch(new URL("../../oregon-fire/fonts/CormorantGaramond-Medium.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("../../oregon-fire/fonts/DMSans-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: "Cormorant", data: serif, weight: 500, style: "normal" },
    { name: "DM Sans", data: sans, weight: 400, style: "normal" },
  ];
}

/**
 * Display size for a candidate's name on the 680px-wide left panel. The same
 * rule for everyone: shorter names get the largest size, and no single word
 * may run past the panel. Cormorant Medium averages ~0.45em per glyph.
 */
export function displayNameSize(name: string, maxWidth = 680): number {
  const longestWord = Math.max(...name.split(/\s+/).map((w) => w.length), 1);
  const byWord = Math.floor(maxWidth / (longestWord * 0.5));
  const byLength = name.length <= 14 ? 120 : name.length <= 20 ? 104 : name.length <= 26 ? 88 : 76;
  return Math.max(56, Math.min(byLength, byWord));
}
