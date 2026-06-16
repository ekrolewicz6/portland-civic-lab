import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Mass timber: Oregon's big housing bet, explained";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Housing & industry",
      headline: "Mass timber: Oregon's big housing bet",
      accent: "#6f8f4a",
      description:
        "Can building homes out of wood in factories fix the housing shortage? What mass timber is, what it costs, and the successes and the failures.",
    }),
    { ...OG_SIZE },
  );
}
