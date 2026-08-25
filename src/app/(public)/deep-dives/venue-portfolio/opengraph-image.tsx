import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Portland's public entertainment venue portfolio — the $1B+ capital cliff and the doctrine to govern it";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Venues & public assets",
      headline: "Portland owns the show. It doesn't run it like an owner.",
      accent: "#b85c3a",
      description:
        "One owner strategy, multiple specialized operators, common data, explicit subsidy, funded lifecycle reserves, and portfolio-wide capital allocation.",
    }),
    { ...OG_SIZE },
  );
}
