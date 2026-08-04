import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Who runs Portland? The overlapping governments, explained";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Government & accountability",
      headline: "Who runs Portland?",
      accent: "#6f8f4a",
      description:
        "A plain-language guide to the overlapping city, county, regional, state, transit, school, health, and special-district governments that actually run Portland.",
    }),
    { ...OG_SIZE },
  );
}
