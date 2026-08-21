import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland's Community & Economic Development portfolio, from public records";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Public-source demonstration",
      headline: "The CED portfolio, as one picture",
      stats: [
            {
                  value: "16",
                  label: "initiatives tracked"
            },
            {
                  value: "30",
                  label: "decisions pending"
            },
            {
                  value: "87",
                  label: "public sources"
            }
      ]
    }), { ...OG_SIZE });
}
