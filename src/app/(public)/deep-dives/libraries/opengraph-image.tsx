import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Portland already has a world-class library system. It hasn't decided what that means — a deep-dive on Multnomah County Library.";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Libraries & public knowledge infrastructure",
      headline: "Portland already has a world-class library system. It hasn't decided what that means.",
      accent: "#c8956c",
      description:
        "19 locations, a $459M bond just finished, 18.1 million checkouts a year — next to a 38% cardholder-household rate and a safety crisis. The gap, the map, and who approves what.",
    }),
    { ...OG_SIZE },
  );
}
