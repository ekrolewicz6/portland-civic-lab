"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronUp, Plus, X } from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: string;
  proposer: string;
  votes: number;
  voted: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-slate-50 text-slate-700 border-slate-200",
  planned: "bg-blue-50 text-blue-800 border-blue-200",
  built: "bg-emerald-50 text-emerald-800 border-emerald-200",
  declined: "bg-stone-100 text-stone-500 border-stone-200",
};

export default function ProposalsBoard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/proposals");
      const data = await res.json();
      if (data.ok) {
        setProposals(data.proposals);
        setSignedIn(data.signedIn);
      }
    } catch {
      // Leave the empty state in place.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleVote(id: number) {
    if (!signedIn) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch(`/api/proposals/${id}/vote`, { method: "POST" });
    const data = await res.json().catch(() => null);
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (data?.ok) {
      setProposals((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, votes: data.votes, voted: data.voted } : p
        )
      );
    }
  }

  async function handlePropose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
      }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (!data?.ok) {
      setFormError(data?.error || "Couldn't save your proposal right now.");
      return;
    }
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-editorial text-[26px] text-[var(--color-ink)]">
          {loading ? "Loading proposals…" : `${proposals.length} proposal${proposals.length === 1 ? "" : "s"}`}
        </h2>
        <button
          onClick={() => (signedIn ? setShowForm(true) : (window.location.href = "/signup"))}
          className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
        >
          <Plus className="h-4 w-4" />
          {signedIn ? "Propose a topic" : "Join to propose"}
        </button>
      </div>

      {!loading && proposals.length === 0 && (
        <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-8 text-center">
          <p className="text-[15px] text-[var(--color-ink-light)]">
            No proposals yet — be the first to suggest what Portland Civic Lab
            should track.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {proposals.map((p) => (
          <div
            key={p.id}
            className="flex gap-4 rounded-sm border border-[var(--color-parchment)] bg-white p-5"
          >
            <button
              onClick={() => toggleVote(p.id)}
              aria-label={p.voted ? "Remove your vote" : "Vote for this topic"}
              className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-sm border transition-colors ${
                p.voted
                  ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                  : "border-[var(--color-parchment)] bg-[var(--color-paper)] text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-[14px] font-bold">{p.votes}</span>
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-editorial text-[20px] leading-tight text-[var(--color-ink)]">
                  {p.title}
                </h3>
                <span
                  className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    STATUS_STYLES[p.status] ?? STATUS_STYLES.open
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                {p.description}
              </p>
              <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
                Proposed by {p.proposer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!signedIn && !loading && proposals.length > 0 && (
        <p className="mt-6 text-center text-[13px] text-[var(--color-ink-muted)]">
          <a href="/login" className="text-[var(--color-canopy)] underline">
            Sign in
          </a>{" "}
          to vote — one member, one vote per topic.
        </p>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-sm border border-[var(--color-parchment)] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
                Propose a topic
              </h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePropose} className="mt-4 space-y-4">
              <label className="block">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-light)]">
                  Title
                </span>
                <input
                  required
                  name="title"
                  minLength={5}
                  maxLength={120}
                  className="mt-1.5 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
                  placeholder="e.g. Street tree canopy by neighborhood"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-light)]">
                  Why it matters
                </span>
                <textarea
                  required
                  name="description"
                  rows={4}
                  minLength={20}
                  maxLength={2000}
                  className="mt-1.5 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)]"
                  placeholder="What question would this answer, and what data might exist?"
                />
              </label>
              {formError && <p className="text-[13px] text-red-700">{formError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-sm bg-[var(--color-canopy)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit proposal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
