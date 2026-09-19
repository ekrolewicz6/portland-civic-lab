import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { isValidQuestion, questionMeta } from "@/lib/questions";
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland Civic Lab: explore the public data behind this city issue.";
export default async function Image({ params }: { params: Promise<{ question: string }> }) {
  const { question } = await params;
  const meta = isValidQuestion(question) ? questionMeta[question] : null;
  return ogImage({ eyebrow: meta?.shortTitle ?? "Public data", headline: meta?.title ?? "Understand Portland.", description: meta?.description ?? "Explore Portland’s public data and the sources behind it.", accent: meta?.color ?? "#c8956c", motif: "data" });
}
