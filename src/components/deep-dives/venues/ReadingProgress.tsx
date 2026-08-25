"use client";

import { useEffect, useState } from "react";

/**
 * Thin ember reading-progress bar for the sticky section nav. Mounts as an
 * absolutely positioned 2px strip along the nav's bottom edge (the nav is
 * position: sticky, so `absolute` anchors to it) and tracks document scroll.
 *
 * Renders at width 0% on the server and on first client paint, so there is
 * no SSR mismatch and no layout shift; the scroll listener is passive and
 * throttled to one measurement per animation frame.
 */
export default function ReadingProgress() {
  const [pct, setPct] = useState("0%");

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setPct(`${(progress * 100).toFixed(2)}%`);
    };

    const onScroll = () => {
      if (raf === 0) raf = window.requestAnimationFrame(measure);
    };

    measure(); // catch deep links and restored scroll positions
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== 0) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-ember)]"
      style={{ width: pct }}
    />
  );
}
