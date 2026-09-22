import Image from "next/image";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import { DISTRICT_VIEWBOX, districtShapes, riverPath, type DistrictNumber } from "@/lib/voters-guide/district-shapes";
import { scatterInDistrict } from "@/lib/voters-guide/district-scatter";
import styles from "./hero-map.module.css";

/**
 * The opening picture of the voters guide: Portland's four council
 * districts drawn on a night-dark ground, the Willamette running through,
 * and every candidate standing in the district they want to represent.
 * Decorative: the same people appear as tappable cards below, so the
 * portraits here carry no links and no names for assistive tech.
 */
export default function HeroMap({
  fields,
}: {
  /** Per published district: its number and the rows whose portraits stand on it. */
  fields: { district: DistrictNumber; rows: SheetRow[] }[];
}) {
  const published = new Set(fields.map((f) => f.district));
  const markers = fields.flatMap(({ district, rows }) => {
    const small = rows.length > 15;
    const points = scatterInDistrict(district, rows.length, small ? { radius: 12, spacing: 28 } : { radius: 14, spacing: 34 });
    return rows.map((row, i) => ({ row, point: points[i], size: small ? 24 : 28, district }));
  });

  return (
    <div className={styles.frame} aria-hidden="true">
      <svg className={styles.map} viewBox={DISTRICT_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#3d7a5a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3d7a5a" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-river-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="600" height="600" fill="url(#hero-glow)" />
        {districtShapes.map(({ district, path }) => (
          <path key={district} className={published.has(district) ? styles.field : styles.rest} d={path} fillRule="evenodd" />
        ))}
        <path className={styles.river} d={riverPath} fillRule="evenodd" filter="url(#hero-river-glow)" />
        {districtShapes.map(({ district, centroid: [cx, cy] }) => (
          <text
            key={district}
            className={published.has(district) ? styles.numeral : styles.numeralRest}
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {district}
          </text>
        ))}
      </svg>
      {markers.map(({ row, point, size }) =>
        point ? (
          <span
            key={row.id}
            className={styles.marker}
            style={{ left: `${(point.x / 600) * 100}%`, top: `${(point.y / 600) * 100}%`, width: `${(size / 600) * 100}%` }}
          >
            {row.portrait ? (
              <Image src={row.portrait.src} alt="" width={48} height={48} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <span className={styles.initials}>
                {row.name
                  .split(" ")
                  .filter((n) => !n.startsWith("("))
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </span>
        ) : null,
      )}
    </div>
  );
}
