"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Search, Check, X, HelpCircle, ArrowRight } from "lucide-react";

interface Programme {
  slug: string;
  name: string;
  funder: string;
  amountMin: number | null;
  amountMax: number | null;
  valueType: string;
  url: string | null;
  description: string | null;
  where: string | null;
  verificationStatus: string;
  reason: string | null;
}

interface Result {
  geography: {
    matchedAddress: string | null;
    tifDistrict: string | null;
    businessDistricts: Array<{ name: string; venturePortlandMember: boolean; website: string | null }>;
    censusTract: string | null;
    unresolved: string[];
  };
  openings: string[];
  open: Programme[];
  closed: Programme[];
  unknown: Programme[];
  provenance: Record<string, { label: string; retrieved: string; count: number }>;
  note: string;
  error?: string;
}

const money = (min: number | null, max: number | null) => {
  const f = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
  if (max == null && min == null) return null;
  if (max == null) return `from ${f(min!)}`;
  if (min == null || min === max) return `up to ${f(max)}`;
  return `${f(min)}–${f(max)}`;
};

export default function AddressCheck() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/business/geo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
      } else if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Couldn't reach the lookup. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="addr" className="sr-only">
          Business street address
        </label>
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]" />
          <input
            id="addr"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="1755 SW Jefferson St"
            className="w-full rounded-sm border border-[var(--color-parchment)] bg-white py-3 pl-9 pr-3 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-canopy)] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[var(--color-canopy-mid)] disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {loading ? "Checking…" : "Check this address"}
        </button>
      </form>

      {error && (
        <div className="rounded-sm border-l-2 border-[var(--color-clay)] bg-white p-4 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* what the address is */}
          <div className="rounded-sm border-2 border-[var(--color-canopy)] bg-white p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
              {result.geography.matchedAddress}
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-[12px] text-[var(--color-ink-muted)]">
                  Tax increment district
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-[var(--color-ink)]">
                  {result.geography.tifDistrict ?? "None"}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[var(--color-ink-muted)]">Business districts</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-[var(--color-ink)]">
                  {result.geography.businessDistricts.length || "None"}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] text-[var(--color-ink-muted)]">Census tract</dt>
                <dd className="mt-0.5 font-mono text-[15px] font-semibold text-[var(--color-ink)]">
                  {result.geography.censusTract ?? "—"}
                </dd>
              </div>
            </dl>

            {result.openings.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-[var(--color-parchment)] pt-4">
                {result.openings.map((o) => (
                  <li key={o} className="flex gap-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-ember)]" />
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Bucket
            icon={<Check className="h-4 w-4 text-[var(--color-fern)]" />}
            title={`${result.open.length} programmes this address doesn't rule out`}
            note="Location clears these. They still gate on ownership, size and industry."
            items={result.open}
            tone="open"
          />
          {result.unknown.length > 0 && (
            <Bucket
              icon={<HelpCircle className="h-4 w-4 text-[var(--color-ember)]" />}
              title={`${result.unknown.length} we couldn't check`}
              note="We're not going to guess. Here's what each one depends on."
              items={result.unknown}
              tone="unknown"
            />
          )}
          {result.closed.length > 0 && (
            <Bucket
              icon={<X className="h-4 w-4 text-[var(--color-clay)]" />}
              title={`${result.closed.length} this address rules out`}
              note="Worth knowing so you don't spend a week on them."
              items={result.closed}
              tone="closed"
            />
          )}

          <div className="rounded-sm bg-[var(--color-paper-warm)] p-5">
            <p className="text-[14px] leading-relaxed text-[var(--color-ink-light)]">{result.note}</p>
            <Link
              href="/member/business/new"
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-river-deep)] hover:underline"
            >
              Register your business <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 font-mono text-[11px] text-[var(--color-ink-muted)]">
              District boundaries from the City of Portland ·{" "}
              {Object.values(result.provenance)
                .map((p) => `${p.label.toLowerCase()} retrieved ${p.retrieved}`)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Bucket({
  icon,
  title,
  note,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  items: Programme[];
  tone: "open" | "closed" | "unknown";
}) {
  if (!items.length) return null;
  const border =
    tone === "open" ? "#3d7a5a" : tone === "closed" ? "#b85c3a" : "#c8956c";
  return (
    <section>
      <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[var(--color-ink)]">
        {icon}
        {title}
      </h2>
      <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">{note}</p>
      <ul className="mt-3 space-y-2">
        {items.map((p) => {
          const amt = money(p.amountMin, p.amountMax);
          return (
            <li
              key={p.slug}
              className={`rounded-sm border border-[var(--color-parchment)] bg-white p-4 ${
                tone === "closed" ? "opacity-70" : ""
              }`}
              style={{ borderLeftWidth: 3, borderLeftColor: border }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-[14.5px] font-semibold text-[var(--color-ink)]">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </span>
                {amt && (
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
                    {amt}
                    {p.valueType === "recurring_annual" && (
                      <span className="text-[11px] font-normal text-[var(--color-ink-muted)]">/yr</span>
                    )}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
                {p.funder}
                {p.where ? ` · ${p.where}` : ""}
                {p.verificationStatus !== "verified" && " · not re-verified recently"}
              </p>
              {p.reason && (
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                  {p.reason}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
