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
        "What FPDR — the police & fire pension on every Portland property tax bill — costs you, who receives it, and how it could be fixed.",
    }),
    { ...OG_SIZE },
  );
}
