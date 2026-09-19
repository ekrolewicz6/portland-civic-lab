import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab privacy practices";

export default function Image() {
  return ogImage({
      eyebrow: "Privacy",
      headline: "What we collect, and what we never do",
      description: "The Lab's privacy practices in plain English — written to be read, not scrolled past."
    });
}
