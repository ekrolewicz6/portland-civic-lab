import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab — Policy Deep-Dives";

export default function Image() {
  return ogImage({
    eyebrow: "Policy deep-dives",
    headline: "Portland’s big questions, explained.",
    description: "Read the evidence, understand the tradeoffs and explore what could change. Free research on the decisions that shape Portland.",
    motif: "research"
  });
}
