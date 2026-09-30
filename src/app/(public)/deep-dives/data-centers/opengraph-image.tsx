import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Oregon’s data centers: are the tax breaks worth it?";

export default function Image() {
  return ogImage({
      eyebrow: "Energy, water & taxes",
      headline: "Oregon’s data centers. Are the tax breaks worth it?",
      accent: "#4a7f9e",
      description:
        "Understand the effects on jobs, schools, electricity and water. Try examples based on real tax agreements.",
    });
}
