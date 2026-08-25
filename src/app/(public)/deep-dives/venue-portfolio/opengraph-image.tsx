import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Every big stage in Portland belongs to you. So do the bills — a deep-dive on the city's entertainment venues.";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Venues & public assets",
      headline: "Every big stage in Portland belongs to you. So do the bills.",
      accent: "#b85c3a",
      description:
        "The arena, the sold-out stadium, five theaters, the town square — the public owns them all. The repairs could top a billion dollars. Nobody's counting.",
    }),
    { ...OG_SIZE },
  );
}
