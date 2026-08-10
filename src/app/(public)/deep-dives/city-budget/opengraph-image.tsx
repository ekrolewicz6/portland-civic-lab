import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's $8.5 billion budget, traced line by line";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Policy deep-dive ——— City finances",
      headline: "Portland's $8.5 billion, line by line",
      accent: "#4a7f9e",
      description:
        "83 funds, 286 programs, four fiscal years — parsed from 1,478 pages of budget PDFs and reconciled to the dollar.",
    }),
    { ...OG_SIZE },
  );
}
