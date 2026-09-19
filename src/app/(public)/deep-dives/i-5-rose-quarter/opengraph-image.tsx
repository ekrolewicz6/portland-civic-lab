import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The Rose Quarter Experiment — a $2 billion freeway fight, about to be tested by a five-week closure";

export default function Image() {
  return ogImage({
    eyebrow: "I-5 and the Rose Quarter",
    headline: "What happens when the traffic moves?",
    accent: "#4a7f9e",
    description: "A freeway closure offers a chance to test competing predictions about where drivers go. Explore the evidence and the choices."
  });
}
