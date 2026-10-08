import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { eventPath, shortDate, type LabEvent } from "@/lib/events";
import styles from "./ElectionBanner.module.css";

/**
 * Homepage banner for a Lab event, in the election banner's slot and style.
 * The homepage passes announcedEvent(now), so the banner starts on the
 * event's announceFrom date and retires when the event ends. The screening's
 * starts the day after the election, once the election banner has retired.
 */

/* The header's shell, repeated so the two rows share one grid. */
const SHELL = "mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 3xl:max-w-[1800px]";

export default function EventBanner({ event }: { event: LabEvent }) {
  return (
    <div className={styles.banner} data-testid="event-banner">
      <span className={`${styles.shell} ${SHELL}`}>
        <Link href={eventPath(event)} className={styles.guideLink}>
          <span className={styles.mark} aria-hidden="true">
            <CalendarDays size={16} strokeWidth={2} />
          </span>
          <span className={styles.copy}>
            <span className={styles.eyebrow}>
              <span>{shortDate(event)}</span>
              <span className={styles.dot} aria-hidden="true" />
              <span>{event.kind}</span>
            </span>
            <span className={styles.title}>{event.title}</span>
          </span>
          <span className={styles.cta}>
            <span>Event details</span>
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </span>
    </div>
  );
}
