import { deepDiveArticleNode, ldJson } from "@/lib/structured-data";

/** Article JSON-LD for a deep-dive landing page, built from the deep-dives registry. */
export default function DeepDiveSchema({ slug }: { slug: string }) {
  const node = deepDiveArticleNode(slug);
  if (!node) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(node) }} />;
}
