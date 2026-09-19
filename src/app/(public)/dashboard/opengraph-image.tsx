import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's public data, organized and source-linked";

export default function Image() {
  return ogImage({
    eyebrow: "Portland’s public data",
    headline: "Portland, by the numbers.",
    description: "Explore housing, safety, city finances and more. See what the public data says, with links to the sources.",
    motif: "data"
  });
}
