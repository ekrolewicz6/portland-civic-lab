"use client";
import { useEffect, useState } from "react";
export function useGuideChoice(
  key: string,
  allowed: readonly string[],
  fallback: string,
) {
  const [value, setValue] = useState(fallback);
  const choices = allowed.join("|");
  useEffect(() => {
    const read = () => {
      const v = new URLSearchParams(location.search).get(key);
      setValue(v && choices.split("|").includes(v) ? v : fallback);
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("fire-guide-change", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("fire-guide-change", read);
    };
  }, [key, choices, fallback]);
  function change(v: string) {
    if (!allowed.includes(v)) return;
    const u = new URL(location.href);
    u.searchParams.set(key, v);
    history.pushState(null, "", u);
    setValue(v);
    window.dispatchEvent(new Event("fire-guide-change"));
  }
  return [value, change] as const;
}
export function exploreScene(patch: Record<string, string>) {
  const u = new URL(location.href);
  for (const key of ["q", "agency", "method", "purpose", "status"])
    u.searchParams.delete(key);
  const defaults = {
    from: "2021",
    to: String(new Date().getFullYear()),
    scars: "1",
    scarMode: "age",
    scarYears: "5",
    scarEnd: String(new Date().getFullYear()),
    zoom: "8",
  };
  if (!patch.place) u.searchParams.delete("place");
  for (const [k, v] of Object.entries({ ...defaults, ...patch }))
    u.searchParams.set(k, v);
  u.searchParams.delete("selected");
  u.searchParams.delete("cursor");
  u.hash = "explore";
  history.pushState(null, "", u);
  window.dispatchEvent(new PopStateEvent("popstate"));
  document.getElementById("explore")?.focus({ preventScroll: true });
  document.getElementById("explore")?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
