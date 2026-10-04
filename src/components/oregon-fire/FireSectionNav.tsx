"use client";
import { useEffect, useRef, useState } from "react";

export type FireNavItem = { id: string; label: string; number?: string };

/** Sticky in-page navigation that marks the section being read. */
export default function FireSectionNav({
  items,
  label,
  className,
}: {
  items: FireNavItem[];
  label: string;
  className: string;
}) {
  const [active, setActive] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const ids = items.map((item) => item.id).join("|");

  useEffect(() => {
    const sections = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  // Keep the current link in view when the row scrolls sideways on a phone.
  useEffect(() => {
    const row = track.current;
    const link = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!row || !link || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({
      left: link.offsetLeft - (row.clientWidth - link.clientWidth) / 2,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  return (
    <nav className={className} aria-label={label}>
      <div className="fire-wrap">
        <div className="fire-nav-track" ref={track}>
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.number && <span>{item.number}</span>}
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
