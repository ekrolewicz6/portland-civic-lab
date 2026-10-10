import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { portfolio, stats, EDITION } from "@/lib/ced/model";
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "CED Portfolio Map: initiatives, decisions and dependencies across Portland";
export default function Image() {
  const s = stats(EDITION);
  return ogImage({
    eyebrow: "Public-source demonstration · October 3, 2026",
    headline: "One portfolio. Connected decisions.",
    stats: [
      {
        value: String(portfolio.initiatives.length),
        label: "initiatives mapped",
      },
      { value: String(s.decisions), label: "unresolved decisions" },
      { value: String(s.dependencies), label: "mapped dependencies" },
    ],
  });
}
