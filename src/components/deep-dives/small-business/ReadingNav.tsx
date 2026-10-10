"use client";
import { useEffect, useRef, useState } from "react";
export function ReadingNav({ chapters }: { chapters: string[][] }) {
  const [active, setActive] = useState("picture");
  const nav = useRef<HTMLElement>(null),
    progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const report = document.querySelector<HTMLElement>(".sb-report");
    const header = document.querySelector("body header");
    const sections = [...document.querySelectorAll<HTMLElement>(".sb-chapter")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = header?.getBoundingClientRect().height || 64;
      report?.style.setProperty("--sb-header-offset", `${offset}px`);
      let current = sections[0]?.id || "picture";
      for (const section of sections)
        if (section.getBoundingClientRect().top <= offset + 100)
          current = section.id;
      setActive(current);
      if (report && progress.current) {
        const start = report.offsetTop;
        const length = report.offsetHeight - innerHeight;
        progress.current.style.width = `${Math.max(0, Math.min(100, ((scrollY - start) / length) * 100))}%`;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    const scroller = nav.current?.querySelector<HTMLElement>(".sb-nav-scroll");
    const link = scroller?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (
      scroller &&
      link &&
      (link.offsetLeft < scroller.scrollLeft ||
        link.offsetLeft + link.offsetWidth >
          scroller.scrollLeft + scroller.clientWidth)
    )
      scroller.scrollTo({
        left: Math.max(
          0,
          link.offsetLeft - scroller.clientWidth / 2 + link.offsetWidth / 2,
        ),
        behavior: "instant",
      });
  }, [active]);
  return (
    <nav
      ref={nav}
      className="sb-nav"
      aria-label="Small business report chapters"
    >
      <div className="sb-nav-scroll">
        {chapters.map(([id, label]) => (
          <a
            href={`#${id}`}
            key={id}
            aria-current={active === id ? "location" : undefined}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="sb-reading-progress" aria-hidden="true">
        <div ref={progress} />
      </div>
    </nav>
  );
}
