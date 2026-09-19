import Link from "next/link";
import { ArrowRight, Vote } from "lucide-react";
import { electionBannerLabel } from "@/lib/election";
import styles from "./ElectionBanner.module.css";

/**
 * Homepage election banner. One full-width link to the voters' guide,
 * shown until polls close on Election Day and then gone without a deploy
 * (the homepage revalidates hourly). Slim by design: it sits between the
 * header and the hero as part of the masthead, not on top of the page.
 */

export default function ElectionBanner({ now = new Date() }: { now?: Date }) {
  const countdown = electionBannerLabel(now);
  if (!countdown) return null;
  return (
    <Link href="/voters-guide" className={styles.banner} data-testid="election-banner">
      <span className={styles.mark} aria-hidden="true">
        <Vote size={17} strokeWidth={2} />
      </span>
      <span className={styles.copy}>
        <span className={styles.eyebrow}>
          <span className={styles.date}>
            Nov 3, 2026 <span className={styles.dot} aria-hidden="true" />
          </span>
          {countdown}
        </span>
        <span className={styles.title}>Read the nonpartisan Voters&rsquo; Guide to City Council</span>
      </span>
      <span className={styles.cta}>
        <span>Open the guide</span>
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
