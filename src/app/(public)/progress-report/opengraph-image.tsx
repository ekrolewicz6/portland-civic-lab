import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Progress Report — is the city keeping its promises?";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Progress report",
      headline: "Is Portland keeping its promises?",
      description: "Quarterly, data-driven analysis of city government performance — what was promised, what was delivered, what slipped."
    }), { ...OG_SIZE });
}
