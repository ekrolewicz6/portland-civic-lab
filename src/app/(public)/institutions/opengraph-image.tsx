import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Decision intelligence for public institutions, at published prices";

export default function Image() {
  return ogImage({
    eyebrow: "Research for public institutions",
    headline: "A shared picture. A better decision.",
    description: "Connect public records across buildings, budgets and bureaus. Research and tools that help institutions decide what comes next.",
    motif: "people"
  });
}
