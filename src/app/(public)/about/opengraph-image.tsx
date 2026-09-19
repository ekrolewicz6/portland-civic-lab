import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Portland Civic Lab: the people building it and how to join them";

export default function Image() {
  return ogImage({
    eyebrow: "About the Lab",
    headline: "A clearer view of your city.",
    description: "Meet the people behind Portland Civic Lab, how the work is funded, and the ways you can take part.",
    motif: "people"
  });
}
