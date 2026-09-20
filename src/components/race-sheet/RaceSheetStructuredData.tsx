/**
 * Renders one JSON-LD block. Pass the output of `raceStructuredData`,
 * `candidateStructuredData` or `votesStructuredData` from
 * `@/lib/voters-guide/race-sheet/seo`. `<` is escaped so no data value can
 * close the script element.
 */
export default function RaceSheetStructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
