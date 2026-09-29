import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Oregon's data center bargain — real examples and the break-even point";

export default function Image() {
  return ogImage({
      eyebrow: "Energy, water & taxes",
      headline: "Oregon built the cloud. Was it worth the bill?",
      accent: "#4a7f9e",
      description:
        "Try real agreement terms. Find the break-even point. Follow the money, power and water behind Oregon’s data-center deals.",
    });
}
