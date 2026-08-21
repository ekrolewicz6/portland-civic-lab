import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Civic Concierge — ask anything about Portland city government";

export default function Image() {
  return new ImageResponse(ogFrame({
      eyebrow: "Civic Concierge",
      headline: "Ask Portland anything",
      description: "An AI assistant that answers questions about Portland city government from the Lab's public data — with sources attached."
    }), { ...OG_SIZE });
}
