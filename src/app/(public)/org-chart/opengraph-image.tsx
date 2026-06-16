import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The Portland org chart — every bureau, sized by headcount and salary cost";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "City government",
      headline: "The Portland org chart",
      stats: [
        { value: "$777M", label: "Citywide salary cost" },
        { value: "7,284", label: "Authorized positions" },
        { value: "$8.1B", label: "Operating budget" },
      ],
    }),
    { ...OG_SIZE },
  );
}
