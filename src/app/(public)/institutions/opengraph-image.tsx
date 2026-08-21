import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Decision intelligence for public institutions, at published prices";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "For public institutions",
      headline: "The decisions cross bureau lines. The information doesn't.",
      description: "Portfolio intelligence, decision analysis, and civic data products — published prices, competed procurement, and conflicts flagged in the work itself."
    }), { ...OG_SIZE });
}
