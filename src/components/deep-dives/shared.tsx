import React from "react";

/**
 * Shared layout primitives for the Policy Deep-Dive pages.
 *
 * The pages are long-form and interactive, so they need to (a) stay readable
 * on a phone, (b) read like an article on a laptop, and (c) genuinely use the
 * space on a large monitor. The Section component handles all three: an
 * editorial two-column layout on wide screens (a heading rail + a wide body
 * column for visuals and calculators) that collapses to a single column below
 * the `xl` breakpoint. Prose is capped for line-length no matter how wide the
 * viewport gets.
 */

/** Responsive page gutter — long-form pages should use real desktop width. */
export const DIVE_CONTAINER =
  "mx-auto w-full max-w-[1880px] px-4 sm:px-6 lg:px-10 2xl:px-12";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[var(--color-ember)]" />
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
        {children}
      </span>
    </div>
  );
}

export function H2({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <h2
      className={`font-editorial text-[28px] sm:text-[34px] xl:text-[38px] leading-[1.1] ${
        tone === "dark" ? "text-white" : "text-[var(--color-ink)]"
      }`}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={`mt-4 max-w-xl text-[16px] sm:text-[17px] xl:text-[18px] leading-relaxed ${
        tone === "dark" ? "text-white/70" : "text-[var(--color-ink-light)]"
      } ${className}`}
    >
      {children}
    </p>
  );
}

type Tone = "default" | "warm" | "dark" | "darker";

const TONE_BG: Record<Tone, string> = {
  default: "",
  warm: "bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]",
  dark: "bg-[var(--color-canopy)] text-white",
  darker: "bg-[#1c1410] text-white",
};

/**
 * Editorial section. On xl+ it lays out as [compact heading rail | wide body];
 * below xl it stacks. The heading rail sticks while you scroll its body on
 * large screens. `aside` is extra content under the heading (e.g. a source line).
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = "default",
  aside,
}: {
  id?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
  tone?: Tone;
  aside?: React.ReactNode;
}) {
  const isDark = tone === "dark" || tone === "darker";
  return (
    <section id={id} className={`scroll-mt-24 py-12 sm:py-14 xl:py-16 ${TONE_BG[tone]}`}>
      <div className={DIVE_CONTAINER}>
        <div className="grid gap-y-8 gap-x-8 xl:grid-cols-[minmax(300px,0.28fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(360px,0.26fr)_minmax(0,1fr)] 2xl:gap-x-12">
          <div className="xl:self-start xl:sticky xl:top-24">
            <Eyebrow>{eyebrow}</Eyebrow>
            <H2 tone={isDark ? "dark" : "light"}>{title}</H2>
            {lead ? <Lead tone={isDark ? "dark" : "light"}>{lead}</Lead> : null}
            {aside ? <div className="mt-5">{aside}</div> : null}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
