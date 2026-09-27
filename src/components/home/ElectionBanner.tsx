"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Vote } from "lucide-react";
import { GUIDE_SCALE, electionBannerLabel } from "@/lib/election";
import styles from "./ElectionBanner.module.css";

/**
 * Election banner: one full-width link to the voters' guide, under the header
 * on the homepage and on every interior page, until polls close on Election
 * Day. The server passes the countdown it computed; the browser recomputes it
 * on mount and every minute, so a page built days ago still shows the right
 * count and the banner retires itself at 8 p.m. on November 3 without a
 * deploy. Hidden on the guide itself and on the full-bleed fire atlas.
 */

const HIDDEN_ON = ["/voters-guide", "/oregon-fire"];

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
    <Link href="/voters-guide" className={styles.banner} data-testid="election-banner">
      <span className={styles.mark} aria-hidden="true">
        <Vote size={17} strokeWidth={2} />
      </span>
      <span className={styles.copy}>
        <span className={styles.eyebrow}>
          <span className={styles.date}>
            Nov 3, 2026 <span className={styles.dot} aria-hidden="true" />
          </span>
          {label}
        </span>
        <span className={styles.title}>
          Compare {GUIDE_SCALE.candidates} candidates in {GUIDE_SCALE.races} races in our free, nonpartisan voters&rsquo; guide
        </span>
      </span>
      <span className={styles.cta}>
        <span>Open the guide</span>
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
