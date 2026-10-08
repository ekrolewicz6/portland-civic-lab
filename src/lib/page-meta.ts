import type { Metadata } from "next";

const BASE = "https://www.portlandciviclab.org";

/** About where Google cuts a description off on a desktop result. */
const DESCRIPTION_MAX = 160;

/**
 * A description that fits a search result: whole sentences up to 160
 * characters, or, when the first sentence alone is longer, a cut at a word
 * boundary. Short descriptions pass through unchanged.
 */
export function metaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_MAX) return clean;
  let out = "";
  for (const sentence of clean.split(/(?<=[.!?])\s+/)) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > DESCRIPTION_MAX) break;
    out = next;
  }
  if (out.length >= 80) return out;
  const cut = clean.slice(0, DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "")}…`;
}

/**
 * Build a page's metadata with matching canonical + Open Graph + Twitter so the
 * share card shows THIS page's title/description. The og:image / twitter:image
 * come from the route's own opengraph-image.tsx automatically — don't set them
 * here.
 *
 * A route WITHOUT its own opengraph-image.tsx inherits its section's image only
 * if it sets no openGraph of its own: Next replaces the whole openGraph object,
 * image included. Pass `sectionImage: true` there to set the title,
 * description and canonical and keep the section's card.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  sectionImage = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  sectionImage?: boolean;
}): Metadata {
  const url = `${BASE}${path}`;
  description = metaDescription(description);
  if (sectionImage) return { title, description, alternates: { canonical: url } };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Portland Civic Lab", type },
    twitter: { card: "summary_large_image", title, description },
  };
}
