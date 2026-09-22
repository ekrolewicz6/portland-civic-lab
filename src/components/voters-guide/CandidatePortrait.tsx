import Image from "next/image";
import type { Candidate } from "@/lib/voters-guide/types";
import styles from "@/app/(public)/voters-guide/guide.module.css";

/**
 * `priority` marks the one portrait that is the page's largest above-the-fold
 * element (the standalone brief's hero) so it is not lazily loaded. Row
 * avatars and the print edition's embedded briefs stay lazy.
 */
export default function CandidatePortrait({
  person,
  compact = false,
  priority = false,
}: {
  person: Candidate;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={styles.portrait}>
      {person.portrait ? (
        compact ? (
          // A fixed 96px source with no `sizes`: a 1x/2x srcSet instead of one entry per device
          // width, since the hub alone draws every candidate and `fill` adds ~2 KB of URLs each.
          <Image
            src={person.portrait.src}
            alt=""
            width={96}
            height={120}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        ) : (
          <Image
            src={person.portrait.src}
            alt={person.name}
            fill
            priority={priority}
            sizes="(max-width: 600px) 45vw, 240px"
          />
        )
      ) : (
        <div
          className={styles.portraitPlaceholder}
          aria-label={
            compact
              ? undefined
              : `Portrait not yet available for ${person.name}`
          }
          aria-hidden={compact || undefined}
        >
          <span>
            {person.name
              .split(" ")
              .filter((n) => !n.startsWith("("))
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")}
          </span>
          {!compact && <small>Portrait to come</small>}
        </div>
      )}
    </div>
  );
}
