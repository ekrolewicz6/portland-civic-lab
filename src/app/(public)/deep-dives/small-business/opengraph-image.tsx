import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The state of small business in Portland: How well does Portland help its small businesses?";
export default function Image() {
  return ogImage({
    eyebrow: "State of small business · Portland",
    headline: "How well does Portland help its small businesses?",
    accent: "#c5df99",
    description:
      "What small businesses do, what they pay, what gets in their way and whether the help on offer is working.",
  });
}
