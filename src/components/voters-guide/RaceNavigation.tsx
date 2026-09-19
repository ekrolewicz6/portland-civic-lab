"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Users, Columns2, Landmark, Info } from "lucide-react";
import type { Race } from "@/lib/voters-guide/types";
import styles from "./race-navigation.module.css";

const views = [
  { id: "find-candidates", label: "Candidates", icon: Users },
  { id: "compare", label: "Compare", icon: Columns2 },
  { id: "disagreements", label: "Council record", icon: Landmark },
  { id: "about-guide", label: "About", icon: Info },
];
export default function RaceNavigation({ race, children }: { race: Race; children: ReactNode }) {
  const [view, setView] = useState("find-candidates");
  const root = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!navigation.current) return;
    const observer = new ResizeObserver(([entry]) => {
      root.current?.style.setProperty("--race-navigation-height", `${entry.target.getBoundingClientRect().height}px`);
    });
    observer.observe(navigation.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let browsePosition: number | undefined;
    function remember(event: MouseEvent) {
      const link = (event.target as Element).closest("a[href^='#']");
      if (link && root.current?.dataset.view === "find-candidates") browsePosition = window.scrollY;
    }
    function navigate() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const profile = race.candidates.some((p) => p.id === hash);
      const next = profile ? "profile" : hash.startsWith("disagreement-") ? "disagreements" : hash === "candidates" ? "candidates" : views.some((v) => v.id === hash) ? hash : "find-candidates";
      setView(next);
      root.current?.querySelectorAll<HTMLElement>("[data-profile]").forEach((el) => {
        el.dataset.active = String(el.dataset.profile === hash);
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const target = document.getElementById(hash || "find-candidates");
        if (!target) return;
        if (next === "find-candidates" && browsePosition !== undefined) window.scrollTo({ top: browsePosition, behavior: "instant" });
        else target.scrollIntoView({ block: "start", behavior: "instant" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }));
    }
    if (window.location.hash) navigate();
    window.addEventListener("hashchange", navigate);
    document.addEventListener("click", remember, true);
    return () => { window.removeEventListener("hashchange", navigate); document.removeEventListener("click", remember, true); };
  }, [race.candidates]);
  function openCompare() {
    if (view === "find-candidates") window.dispatchEvent(new Event("pcl:request-candidate-comparison"));
  }
  return <div ref={root} className={styles.experience} data-view={view}>
    <nav ref={navigation} className={styles.navigation} aria-label="Race guide sections">
      {views.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`}
        aria-current={(view === id || (id === "find-candidates" && ["profile", "candidates"].includes(view))) ? "page" : undefined}
        onClick={id === "compare" ? openCompare : undefined}>
        <Icon size={19} aria-hidden="true" /><span>{label}</span>
      </a>)}
    </nav>
    {children}
  </div>;
}
