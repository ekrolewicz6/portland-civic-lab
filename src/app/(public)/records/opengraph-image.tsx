import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Public records — your right to know, under Oregon law";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Public records",
      headline: "The records belong to you",
      description:
        "How to file an Oregon public records request — and a live tracker of the requests Portland Civic Lab is filing to close the city's data gaps.",
    }),
    { ...OG_SIZE },
  );
}
