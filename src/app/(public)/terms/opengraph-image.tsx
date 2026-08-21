import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab terms of use";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Terms",
      headline: "The fine print, in plain English",
      description: "Terms of use for Portland Civic Lab's free public tools."
    }), { ...OG_SIZE });
}
