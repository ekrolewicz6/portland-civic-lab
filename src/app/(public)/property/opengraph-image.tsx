import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Property screening for owners and developers, at published prices";

export default function Image() {
  return ogImage({
    eyebrow: "Property research",
    headline: "See a property’s possibilities.",
    description: "Understand the public record, unanswered questions and next steps before committing to a building or a portfolio.",
    motif: "places"
  });
}
