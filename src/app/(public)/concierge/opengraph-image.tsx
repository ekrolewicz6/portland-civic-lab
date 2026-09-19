import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Civic Concierge — ask anything about Portland city government";

export default function Image() {
  return ogImage({
    eyebrow: "Civic Concierge",
    headline: "Ask about Portland.",
    description: "Find a starting point for questions about city services, government and public data.",
    motif: "research"
  });
}
