import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Benefits calculator for Portland businesses";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Benefits calculator",
      headline: "What is your business owed?",
      description: "Estimate the grants, credits, and rebates your Portland business may qualify for — from public program rules, in minutes."
    }), { ...OG_SIZE });
}
