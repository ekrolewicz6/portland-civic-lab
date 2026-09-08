"use client";

import { useEffect, useState } from "react";
import styles from "./ContinuumStory.module.css";

const SECTIONS = [
  { id: "capacity", label: "Capacity" }, { id: "breaks", label: "Failures" }, { id: "pathways", label: "Journeys" },
  { id: "count", label: "Outcomes" }, { id: "money", label: "Costs" },
  { id: "fix", label: "Changes" }, { id: "investigate", label: "Investigate" }, { id: "stages", label: "Reference" },
];

export default function StoryNavigation() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    SECTIONS.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  return <nav className={styles.nav} aria-label="On this page"><div className={`${styles.container} ${styles.navInner}`}>
    <span className={styles.navBrand}>The path to a lasting home</span>
    <div className={styles.navLinks}>{SECTIONS.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setActive(id)}>{label}</a>)}</div>
  </div></nav>;
}
