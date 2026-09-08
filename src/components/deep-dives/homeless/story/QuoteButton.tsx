"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./ContinuumStory.module.css";

export default function QuoteButton({ quote }: { quote: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(`“${quote}” — Portland Civic Lab\nhttps://www.portlandciviclab.org/deep-dives/continuum#the-handoff`);
      setStatus("Quote and link copied");
    } catch {
      setStatus("Select the quote to copy it");
    }
  }
  return <div className={styles.quoteTools}>
    <button type="button" className={styles.copyButton} onClick={copy}>{status === "Quote and link copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}Copy quote + link</button>
    <span className={styles.copyStatus} role="status">{status}</span>
  </div>;
}
