import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's public data, free to use — with an open API";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Open data",
      headline: "Portland's public data, free to use",
      description:
        "Every dataset behind the dashboards, with a documented API. Open source and AGPL-licensed — fork it, build on it, hold the city to it.",
    }),
    { ...OG_SIZE },
  );
}
