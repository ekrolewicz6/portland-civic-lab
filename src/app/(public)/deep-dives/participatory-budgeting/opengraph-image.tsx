import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Measure 26-267: should Portland guarantee residents a vote on part of its budget? A visual guide to the arguments and the money.";

export default function Image() {
  return ogImage({
    eyebrow: "Measure 26-267 · November 3, 2026",
    headline: "Should Portland guarantee residents a vote on part of its budget?",
    description: "Understand Measure 26-267, the strongest cases for YES and NO, and the money left for projects.",
    motif: "research",
  });
}
