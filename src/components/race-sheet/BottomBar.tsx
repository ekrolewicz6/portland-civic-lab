"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bookmark, Info, Landmark, List } from "lucide-react";
import styles from "./race-sheet.module.css";

/**
 * Four ways in on phones: List · My ballot · Votes · About, a fixed bar with
 * the safe-area inset whose My ballot item carries the saved count. From 769px
 * up the bar is hidden and the floating tray is the way into My ballot.
 * Publishes its height as --race-sheet-bar-height on the root element so the
 * page padding, the site footer and focus scroll margins clear it.
 *
 * The same bar stays put on the race's votes page: there Votes is the current
 * item, List and About point back to the sheet, and My ballot opens the drawer
 * on the sheet (the #ballot fragment), since the list lives on that page.
 */
export default function BottomBar({
  raceId,
  hasVotes = true,
  savedCount,
  onOpenBallot,
  current = "sheet",
}: {
  raceId: string;
  hasVotes?: boolean;
  savedCount: number;
  /** Receives the button that opened the dialog so focus can return to it. On the votes page, absent. */
  onOpenBallot?: (opener: HTMLElement) => void;
  /** Which page the bar is on. */
  current?: "sheet" | "votes";
}) {
  const sheetPath = `/voters-guide/${raceId}`;
  const onSheet = current === "sheet";
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const root = document.documentElement;
    const queries = [window.matchMedia("(max-width: 768px)"), window.matchMedia("(max-height: 520px)")];
    function publish() {
      const fixed = getComputedStyle(el!).position === "fixed";
      root.style.setProperty("--race-sheet-bar-height", fixed ? `${el!.getBoundingClientRect().height}px` : "0px");
    }
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    for (const q of queries) q.addEventListener("change", publish);
    return () => {
      observer.disconnect();
      for (const q of queries) q.removeEventListener("change", publish);
      root.style.removeProperty("--race-sheet-bar-height");
    };
  }, []);

  return (
    <nav ref={bar} className={styles.bar} aria-label="Race guide sections" data-race-sheet-bar>
      <a href={onSheet ? "#list" : `${sheetPath}#list`} className={styles.barItem}>
        <List size={18} aria-hidden="true" />
        <span>List</span>
      </a>
      {onSheet && onOpenBallot ? (
        <button
          type="button"
          className={styles.barItem}
          onClick={(event) => onOpenBallot(event.currentTarget)}
          aria-haspopup="dialog"
        >
          <Bookmark size={18} aria-hidden="true" fill={savedCount > 0 ? "currentColor" : "none"} />
          <span>
            My ballot
            {savedCount > 0 && <span className={styles.barCount}> · {savedCount}</span>}
          </span>
        </button>
      ) : (
        <a href={`${sheetPath}#ballot`} className={styles.barItem}>
          <Bookmark size={18} aria-hidden="true" fill={savedCount > 0 ? "currentColor" : "none"} />
          <span>
            My ballot
            {savedCount > 0 && <span className={styles.barCount}> · {savedCount}</span>}
          </span>
        </a>
      )}
      {hasVotes &&
        (onSheet ? (
          <Link href={`${sheetPath}/votes`} prefetch={false} className={styles.barItem}>
            <Landmark size={18} aria-hidden="true" />
            <span>Votes</span>
          </Link>
        ) : (
          <a href="#votes" className={styles.barItem} aria-current="page">
            <Landmark size={18} aria-hidden="true" />
            <span>Votes</span>
          </a>
        ))}
      <a href={onSheet ? "#about" : `${sheetPath}#about`} className={styles.barItem}>
        <Info size={18} aria-hidden="true" />
        <span>About</span>
      </a>
    </nav>
  );
}
