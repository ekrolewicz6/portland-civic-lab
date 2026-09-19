import { guideStructuredData, type GuideCard } from "@/lib/voters-guide/metadata";

export default function GuideStructuredData({ card }: { card: GuideCard }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(guideStructuredData(card)).replace(/</g, "\\u003c"),
  }} />;
}
