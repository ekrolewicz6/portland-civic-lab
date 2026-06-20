import { ImageResponse } from "next/og";
import { ogFrame, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The hidden contradictions in Portland's growth politics";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Housing, taxes, and growth",
      headline: "The hidden contradictions in Portland's growth politics",
      accent: "#e1864b",
      stats: [
        { value: "120,560", label: "homes needed" },
        { value: "48.1%", label: "residential CPR" },
        { value: "$276M", label: "modeled scarcity cost" },
      ],
    }),
    { ...OG_SIZE },
  );
}
