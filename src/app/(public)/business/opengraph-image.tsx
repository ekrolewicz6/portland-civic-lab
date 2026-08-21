import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab finds public funding for Portland small businesses";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "For Portland small businesses",
      headline: "There is money with your business's name on it",
      description: "Grants, tax credits, rebates, hiring subsidies. Tell us about your business once — we find what you qualify for and write the applications. You click submit."
    }), { ...OG_SIZE });
}
