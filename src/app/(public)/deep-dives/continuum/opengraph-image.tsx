import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Where the path out of homelessness breaks: barriers, costs and better connections";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Homelessness · The continuum",
      headline: "Where the path out of homelessness breaks",
      accent: "#c8956c",
      description:
        "Explore the barriers, follow a journey, compare local costs—and see what could connect people to a lasting home.",
    }),
    { ...OG_SIZE },
  );
}
