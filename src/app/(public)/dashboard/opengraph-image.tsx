import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's public data, organized and source-linked";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "The dashboards",
      headline: "See how Portland is actually doing",
      stats: [
            {
                  value: "8",
                  label: "topic areas"
            },
            {
                  value: "100%",
                  label: "numbers source-linked"
            },
            {
                  value: "$0",
                  label: "paywalls, ever"
            }
      ]
    }), { ...OG_SIZE });
}
