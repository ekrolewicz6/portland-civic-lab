import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Oregon's data center bargain — both cases, and the win-win test";

export default function Image() {
  return ogImage({
      eyebrow: "Energy, water & taxes",
      headline: "Oregon built the cloud. Was it worth the bill?",
      accent: "#4a7f9e",
      description:
        "The competing cases, six conditions for a better agreement, and a transparent calculator for Oregon’s data-center tax deals.",
    });
}
