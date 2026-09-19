"use client";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import styles from "./journey.module.css";

export default function ShareGuide({ title, fragment, label = "Share this comparison" }: {
  title: string;
  fragment: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  useEffect(() => { setStatus(""); setFallback(""); }, [fragment]);
  async function share() {
    const url = new URL(window.location.pathname, window.location.origin);
    url.hash = fragment;
    setFallback("");
    setStatus("");
    if (navigator.share) {
      try {
        await navigator.share({ title, url: url.href });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url.href);
      setStatus("Link copied. Ready to share or save.");
    } catch {
      setFallback(url.href);
      setStatus("Select and copy this link.");
    }
  }
  return <div className={styles.share}>
    <button type="button" onClick={share}><Share2 size={17} aria-hidden="true" />{label}</button>
    <span role="status">{status}</span>
    {fallback && <label>Link to this view<input readOnly value={fallback} onFocus={(event) => event.target.select()} /></label>}
  </div>;
}
