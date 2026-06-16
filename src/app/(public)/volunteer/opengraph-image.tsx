import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Volunteer with Portland Civic Lab";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Get involved",
      headline: "Help build Portland's civic infrastructure",
      description:
        "Lend your skills — code, data, design, writing, or local knowledge. Portland Civic Lab is built in the open and welcomes contributors.",
    }),
    { ...OG_SIZE },
  );
}
