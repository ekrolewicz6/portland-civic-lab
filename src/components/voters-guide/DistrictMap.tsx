import {
  DISTRICT_VIEWBOX,
  districtShapes,
  districtShapesSource,
  riverPath,
  type DistrictNumber,
} from "@/lib/voters-guide/district-shapes";
import styles from "./district-map.module.css";

/**
 * "Which district am I in?" — an SVG map of Portland's four City Council
 * districts. Districts with a published race page are links; the rest are
 * drawn muted and marked "coming later". Server-renderable: no hover-only
 * behaviour, a tap on a published district navigates.
 *
 * Paint order is districts, then the river, then every label, so captions
 * that straddle the Willamette (District 3's label sits near it) stay legible.
 */
export type DistrictMapProps = {
  /** District numbers that have a race page (3 and 4 today). */
  published: Iterable<DistrictNumber>;
  /** URL of the race page for a published district. */
  hrefFor: (district: DistrictNumber) => string;
  /**
   * Optional short caption per district, drawn under the numeral. Keep it to
   * a couple of words: District 3 is only ~180 viewBox units wide at its label.
   */
  labels?: Partial<Record<DistrictNumber, string>>;
  className?: string;
};

export default function DistrictMap({
  published,
  hrefFor,
  labels,
  className,
}: DistrictMapProps) {
  const publishedSet = new Set(published);
  const publishedList = districtShapes
    .map((s) => s.district)
    .filter((d) => publishedSet.has(d));
  const summary =
    publishedList.length === 0
      ? "Map of Portland's four City Council districts. No race pages are published yet."
      : `Map of Portland's four City Council districts. Race pages are published for ${formatList(
          publishedList.map((d) => `District ${d}`),
        )}; the others are coming later.`;

  return (
    <svg
      className={[styles.map, className].filter(Boolean).join(" ")}
      viewBox={DISTRICT_VIEWBOX}
      role="img"
      aria-label={summary}
      xmlns="http://www.w3.org/2000/svg"
    >
      {districtShapes.map(({ district, path }) =>
        publishedSet.has(district) ? (
          <a
            key={district}
            href={hrefFor(district)}
            className={styles.link}
            aria-label={`District ${district} race page`}
          >
            <path className={styles.shape} d={path} fillRule="evenodd" />
          </a>
        ) : (
          <g key={district} className={styles.pending}>
            <title>{`District ${district} · coming later`}</title>
            <path className={styles.shape} d={path} fillRule="evenodd" />
          </g>
        ),
      )}
      <path
        className={styles.river}
        d={riverPath}
        fillRule="evenodd"
        aria-hidden="true"
      />
      <g className={styles.labels} aria-hidden="true">
        {districtShapes.map(({ district, centroid: [cx, cy] }) => {
          const caption = labels?.[district];
          return (
            <g
              key={district}
              className={publishedSet.has(district) ? undefined : styles.pending}
            >
              <text
                className={styles.numeral}
                x={cx}
                y={caption ? cy - 6 : cy}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {district}
              </text>
              {caption ? (
                <text
                  className={styles.caption}
                  x={cx}
                  y={cy + 28}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {caption}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** "Boundaries: City of Portland, fetched 2026-09-19" with a link to the layer. */
export function DistrictMapSource({ className }: { className?: string }) {
  const { label, url, fetched } = districtShapesSource;
  return (
    <p className={[styles.source, className].filter(Boolean).join(" ")}>
      Boundaries:{" "}
      <a href={url} rel="noopener noreferrer">
        {label}
      </a>
      , fetched <time dateTime={fetched}>{fetched}</time>
    </p>
  );
}

function formatList(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
