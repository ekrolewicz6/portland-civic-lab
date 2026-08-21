import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's independent business directory";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Business directory",
      headline: "Portland's independent business directory",
      description: "Local businesses, mapped and searchable — who they are, where they are, and how to support them."
    }), { ...OG_SIZE });
}
