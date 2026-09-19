import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact Portland Civic Lab";

export default function Image() {
  return ogImage({
      eyebrow: "Contact",
      headline: "Talk to the Lab",
      description: "Questions, corrections, ideas, partnerships — we read everything, and corrections go to the front of the line."
    });
}
