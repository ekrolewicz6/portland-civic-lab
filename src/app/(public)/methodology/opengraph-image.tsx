import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Methodology & data sources behind the Portland dashboard";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Methodology",
      headline: "Where every number comes from",
      description:
        "The data sources, collection methods, and verification behind the Portland Civic Dashboard. Honest about what's measured and what isn't.",
    }),
    { ...OG_SIZE },
  );
}
