import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Aaron Swartz at 40: a free Portland screening of The Internet’s Own Boy on Sunday, November 8, 2026";

export default function Image() {
  return ogImage({
    eyebrow: "Free screening · Sunday, November 8",
    headline: "Aaron Swartz at 40: The Internet’s Own Boy",
    description: "A free Portland screening of the documentary on what would have been his 40th birthday. Hosted by Portland Civic Lab.",
    motif: "people",
  });
}
