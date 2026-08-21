import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How Portland Civic Lab stays independent — rules, contracts, funding, conflicts";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Independence & funding",
      headline: "Don't take our word for it.",
      description: "The rules we operate under, every government contract we hold, how we're funded, and where we're not neutral — on one page anyone can check."
    }), { ...OG_SIZE });
}
