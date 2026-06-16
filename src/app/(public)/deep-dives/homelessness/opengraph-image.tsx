import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Why Portland can't end homelessness — the math, explained";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Homelessness",
      headline: "Why Portland can't end homelessness",
      accent: "#3f7f9f",
      description:
        "Portland spends more than ever and the count keeps rising. The math that explains why — and what would actually work.",
    }),
    { ...OG_SIZE },
  );
}
