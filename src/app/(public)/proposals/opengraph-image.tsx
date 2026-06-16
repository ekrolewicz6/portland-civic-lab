import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Propose and vote on what Portland Civic Lab builds next";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Participate",
      headline: "What should the Lab track next?",
      description:
        "Propose and vote on the dashboards and civic tools Portland Civic Lab builds next. Members decide what we measure.",
    }),
    { ...OG_SIZE },
  );
}
