import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Apply for Portland Civic Lab business certification";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "PCB certification",
      headline: "Apply for Portland Civic Lab Certification",
      description: "Recognition for Portland businesses across the Lab's directory and tools — one application, reviewed by people."
    }), { ...OG_SIZE });
}
