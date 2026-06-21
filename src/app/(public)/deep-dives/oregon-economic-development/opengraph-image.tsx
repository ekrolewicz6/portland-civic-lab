import { ImageResponse } from "next/og";
import { ogFrame, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Is Oregon serious about its own economy?";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Economy, government, accountability",
      headline: "Is Oregon serious about its own economy?",
      accent: "#e1864b",
      stats: [
        { value: "1,200 → 800", label: "the goal, lowered" },
        { value: "490", label: "jobs created" },
        { value: "$275M", label: "schools' tax breaks" },
      ],
    }),
    { ...OG_SIZE },
  );
}
