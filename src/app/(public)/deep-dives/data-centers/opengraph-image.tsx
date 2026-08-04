import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Oregon's data center bargain — both cases, and the win-win test";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Energy, water & taxes",
      headline: "Oregon built the cloud. Was it worth the bill?",
      accent: "#4a7f9e",
      description:
        "~125 data centers, $450M+ a year in tax breaks, and a state that just hit pause. The strongest case for, the strongest case against, and the win-win test.",
    }),
    { ...OG_SIZE },
  );
}
