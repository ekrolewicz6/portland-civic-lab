"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Vote } from "lucide-react";
import { GUIDE_SCALE, electionBannerLabel } from "@/lib/election";
import styles from "./ElectionBanner.module.css";

/**
 * Election banner: links to the voters' guide and campaign-finance reporting, under the header
 * on the homepage and on every interior page, until polls close on Election
 * Day. Its content sits on the header's own container, so the icon lines up
 * with the wordmark and the button with the nav. The server passes the
 * countdown it computed; the browser recomputes it on mount and every minute,
 * so a page built days ago still shows the right count and the banner retires
 * itself at 8 p.m. on November 3 without a deploy. Hidden on the guide itself
 * and on the full-bleed fire atlas.
 */

const HIDDEN_ON = ["/voters-guide", "/oregon-fire"];

/* The header's shell, repeated so the two rows share one grid. */
const SHELL = "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 3xl:max-w-[1800px]";

export default function ElectionBanner({ initialLabel }: { initialLabel: string | null }) {
  const pathname = usePathname() ?? "/";
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    const update = () => setLabel(electionBannerLabel(new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!label) return null;
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <div className={styles.banner} data-testid="election-banner">
      <span className={`${styles.shell} ${SHELL}`}>
        <Link href="/voters-guide" className={styles.guideLink}>
          <span className={styles.mark} aria-hidden="true">
            <Vote size={16} strokeWidth={2} />
          </span>
          <span className={styles.copy}>
            <span className={styles.eyebrow}>
              <span className={styles.date}>Nov 3, 2026</span>
              <span className={styles.dot} aria-hidden="true" />
              <span>{label}</span>
            </span>
            <span className={styles.title}>
              Compare {GUIDE_SCALE.candidates} candidates in {GUIDE_SCALE.races} races in our free, nonpartisan voters&rsquo; guide
            </span>
          </span>
          <span className={styles.cta}>
            <span>Open the guide</span>
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
        <Link href="/deep-dives/campaign-finance" className={styles.financeLink}>
          Follow the campaign money <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </span>
    </div>
  );
}
