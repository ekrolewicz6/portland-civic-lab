import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Events hosted by Portland Civic Lab in Portland";

export default function Image() {
  return ogImage({
    eyebrow: "Events",
    headline: "Gatherings the Lab hosts in Portland.",
    description: "The date, the place and how to register for each one.",
    motif: "people",
  });
}
