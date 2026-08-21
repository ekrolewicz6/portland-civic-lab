import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Portland Portfolio Brief — weekly, free, public sources only";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Weekly · free · public sources only",
      headline: "The Portland Portfolio Brief",
      stats: [
            {
                  value: "5",
                  label: "things that need attention"
            },
            {
                  value: "16",
                  label: "initiatives tracked"
            },
            {
                  value: "30",
                  label: "open decisions"
            }
      ]
    }), { ...OG_SIZE });
}
