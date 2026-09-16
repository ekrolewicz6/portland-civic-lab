import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The pension on your property tax bill — FPDR, explained";

export default function Image() {
  return new ImageResponse(
    ogFrame({
      eyebrow: "Budgets & pensions",
      headline: "The pension on your property tax bill",
      accent: "#c98a3c",
      description:
        "Your FPDR tax bill, the promise behind it, and the tradeoffs between paying as benefits come due and building an invested reserve.",
    }),
    { ...OG_SIZE },
  );
}
