import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The Rose Quarter Experiment — a $2 billion freeway fight, about to be tested by a five-week closure";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Policy deep-dive · Freeways",
      headline: "Portland is about to run the experiment by accident.",
      accent: "#4a7f9e",
      description:
        "Sept 11: southbound I-5 closes for five weeks and the traffic goes to I-405 and I-205 — nearly what removal advocates propose permanently. Both sides' predictions, published before the closure.",
    }),
    { ...OG_SIZE },
  );
}
