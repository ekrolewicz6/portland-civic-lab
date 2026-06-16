import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, PenLine, Database, Users } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Volunteer",
  description:
    "Help build Portland Civic Lab — code, data sourcing, writing, design, and local knowledge all move the project forward.",
  path: "/volunteer",
});

const roles = [
  {
    icon: Code2,
    title: "Engineers & designers",
    description:
      "The whole platform is open source. Pick up an issue, improve accessibility, extract shared components, or build a new dashboard topic.",
    cta: { label: "Read the contributor guide", href: "https://github.com/ekrolewicz6/portland-civic-lab/blob/main/CONTRIBUTING.md", external: true },
  },
  {
    icon: Database,
    title: "Data hunters",
    description:
      "Several sources still need manual refreshes or public records requests. Help automate a feed, track down a dataset, or verify numbers against official documents.",
    cta: { label: "See the source inventory", href: "/methodology", external: false },
  },
  {
    icon: PenLine,
    title: "Writers & researchers",
    description:
      "Plain-language explanations are half the product. Help write topic explainers, document methods, or draft the first Portland Progress Report.",
    cta: { label: "Pitch us", href: "/contact", external: false },
  },
  {
    icon: Users,
    title: "Neighbors with local knowledge",
    description:
      "You know your street better than any dataset. Flag numbers that don't match reality, suggest what we should track next, and tell us what's missing.",
    cta: { label: "Send a note", href: "/contact", external: false },
  },
];

export default function VolunteerPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85">
              <span>Volunteer</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>Built by Portlanders</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              Help build this
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Portland Civic Lab is an open project. The dashboards, the parks
              atlas, the permitting tools — all of it gets better with more
              hands. You don&apos;t need to be a programmer: data sleuthing,
              writing, design, and plain local knowledge all count.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--color-canopy)]/8 text-[var(--color-canopy)]">
                <role.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-editorial text-[26px] leading-tight text-[var(--color-ink)]">
                {role.title}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                {role.description}
              </p>
              {role.cta.external ? (
                <a
                  href={role.cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-canopy)] hover:underline"
                >
                  {role.cta.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={role.cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-canopy)] hover:underline"
                >
                  {role.cta.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
          <h2 className="font-editorial text-[26px] text-[var(--color-ink)]">
            Not sure where you fit?
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            Tell us what you&apos;re good at and how much time you have — even
            an hour a month helps. We&apos;ll find something real for you to
            own.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
