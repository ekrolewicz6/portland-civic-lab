import type { Ladder as LadderModel } from "@/lib/voters-guide/race-sheet";
import { SourceChipButton } from "./CandidateCard";
import { Gap, SaidGlyph } from "./Glyph";
import styles from "./stance.module.css";

/**
 * What → how → measured by. The same three questions for every candidate on
 * every issue. A missing rung is a gap; if the Lab has asked the candidate,
 * the date shows so a reader knows the question is in their court.
 */
function Rung({ label, rung, askedOn }: { label: string; rung: LadderModel["how"]; askedOn: string | null }) {
  return (
    <div className={styles.rung}>
      <dt className={styles.rungLabel}>{label}</dt>
      <dd className={styles.rungBody}>
        {rung ? (
          <>
            <span className={styles.rungText}>
              <SaidGlyph />
              {rung.text}
            </span>
            <SourceChipButton chip={rung.source} />
          </>
        ) : (
          <span className={styles.rungGap}>
            <Gap />{" "}
            {askedOn ? `Not in their sources. We asked the candidate on ${formatDate(askedOn)}; no reply yet.` : "Not in their sources."}
          </span>
        )}
      </dd>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

export default function Ladder({ what, ladder }: { what: React.ReactNode; ladder: LadderModel }) {
  return (
    <dl className={styles.ladder}>
      <div className={styles.rung}>
        <dt className={styles.rungLabel}>What</dt>
        <dd className={styles.rungBody}>{what}</dd>
      </div>
      <Rung label="How" rung={ladder.how} askedOn={ladder.askedOn} />
      <Rung label="Measured by" rung={ladder.measure} askedOn={ladder.askedOn} />
    </dl>
  );
}
