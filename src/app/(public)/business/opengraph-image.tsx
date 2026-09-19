import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab finds public funding for Portland small businesses";

export default function Image() {
  return ogImage({
    eyebrow: "For Portland small businesses",
    headline: "Find support for your small business.",
    description: "Explore funding programs, practical resources and public records for Portland businesses. See which opportunities may fit.",
    motif: "places"
  });
}
