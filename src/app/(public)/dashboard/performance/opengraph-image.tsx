import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland city performance: the measures, trends and explanations behind city services.";
export default function Image() {
  return ogImage({ eyebrow: "City performance", headline: "How is the City doing?", description: "Explore official performance measures, follow the trends and read the explanations behind Portland’s service results.", motif: "data" });
}
