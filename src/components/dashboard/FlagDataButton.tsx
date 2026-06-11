"use client";

import { FormEvent, useState } from "react";
import { Flag, X, CheckCircle2 } from "lucide-react";

interface FlagDataButtonProps {
  question: string;
}

type FlagState = "idle" | "submitting" | "success" | "error";

export default function FlagDataButton({ question }: FlagDataButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FlagState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/data-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        metric: formData.get("metric"),
        message: formData.get("message"),
        email: formData.get("email"),
        website: formData.get("website"),
      }),
    });

    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !result?.ok) {
      setState("error");
      setError(result?.error || "Couldn't send your report right now.");
      return;
    }
    setState("success");
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setState("idle");
          setError("");
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)] bg-[var(--color-parchment)]/50 hover:bg-[var(--color-parchment)] rounded-sm transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        Flag an issue
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-sm border border-[var(--color-parchment)] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
                Something look wrong?
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {state === "success" ? (
              <div className="mt-4 flex items-start gap-2 rounded-sm border border-[var(--color-sage)]/40 bg-[var(--color-sage)]/10 px-4 py-3 text-[14px] text-[var(--color-canopy)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Thanks — we review every report and fix what&apos;s wrong.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                  Tell us which number looks off and why — a link to an
                  official source helps us fix it fast.
                </p>

                <label className="block">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-light)]">
                    Which number? (optional)
                  </span>
                  <input
                    name="metric"
                    maxLength={200}
                    className="mt-1.5 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
                    placeholder="e.g. Median rent, April 2026"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-light)]">
                    What&apos;s wrong?
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    minLength={10}
                    maxLength={2000}
                    className="mt-1.5 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
                    placeholder="The value doesn't match ... because ..."
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-light)]">
                    Email for follow-up (optional)
                  </span>
                  <input
                    name="email"
                    type="email"
                    maxLength={200}
                    className="mt-1.5 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
                    placeholder="Only used to follow up on this report"
                  />
                </label>

                <label className="hidden" aria-hidden="true">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>

                {state === "error" && (
                  <p className="text-[13px] text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="w-full rounded-sm bg-[var(--color-canopy)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)] disabled:opacity-60"
                >
                  {state === "submitting" ? "Sending..." : "Send report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
