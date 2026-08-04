import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Lloyd Center: demolished on a promise — Portland's mall, explained";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Housing & redevelopment",
      headline: "Demolished on a promise",
      accent: "#3f7f9f",
      description:
        "Portland's dead mall is coming down for up to 5,141 homes — with zero affordable units required and no ice rink. Both sides of the Lloyd Center fight, explained.",
    }),
    { ...OG_SIZE },
  );
}
