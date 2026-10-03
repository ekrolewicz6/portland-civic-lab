import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "The state of small business in Portland: Small business. Big questions.";
export default function Image() {
  return ogImage({
    eyebrow: "State of small business · Portland",
    headline: "Small business. Big questions.",
    accent: "#c5df99",
    description:
      "The economy behind the storefront: jobs, livelihoods, public support, and what comes next.",
  });
}
