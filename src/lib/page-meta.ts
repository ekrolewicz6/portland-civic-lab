import type { Metadata } from "next";

const BASE = "https://www.portlandciviclab.org";

/**
 * Build a page's metadata with matching canonical + Open Graph + Twitter so the
 * share card shows THIS page's title/description (not the root layout's, which
 * otherwise leaks through inheritance). The og:image / twitter:image come from
 * the route's own opengraph-image.tsx automatically — don't set them here.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${BASE}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Portland Civic Lab", type },
    twitter: { card: "summary_large_image", title, description },
  };
}
