import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab — Policy Deep-Dives";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Policy deep-dives",
      headline: "The big issues, explained for everyone",
      description:
        "Plain-language explainers of Portland's biggest policy questions — the numbers, the people, and the trade-offs, with interactive tools.",
    }),
    { ...OG_SIZE },
  );
}
