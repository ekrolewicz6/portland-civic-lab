import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab. Understand Portland. Free voter guides, public data and research. A cream and forest-green card with a gold sun above an illustrated Portland bridge.";
export default function Image() {
  return ogImage({
    eyebrow: "Your city. Open to you.",
    headline: "Understand Portland.",
    description: "Free voter guides, public data and research. Find your way into the decisions that shape your city.",
    footerLeft: "Free to explore. Built for Portland.",
    motif: "city",
  });
}
