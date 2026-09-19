import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland business directory: search registered businesses and explore the public record.";

export default function Image() {
  return ogImage({
      eyebrow: "Business directory",
      headline: "Portland’s business directory.",
      description: "Find registered businesses, explore locations and follow the public record."
    });
}
