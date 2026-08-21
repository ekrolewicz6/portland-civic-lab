import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Commercial spaces for Portland businesses";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Commercial spaces",
      headline: "Find your business a home",
      description: "Portland storefronts, kitchens, and studios — listed with the details that actually matter."
    }), { ...OG_SIZE });
}
