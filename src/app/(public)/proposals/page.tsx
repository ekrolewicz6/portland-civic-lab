import type { Metadata } from "next";
import ProposalsBoard from "@/components/proposals/ProposalsBoard";

export const metadata: Metadata = {
  title: "Topic Proposals",
  description:
    "Members decide what Portland Civic Lab tracks next. Propose a dashboard topic and vote on what matters most.",
  alternates: { canonical: "https://www.portlandciviclab.org/proposals" },
};

export default function ProposalsPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85">
              <span>Proposals</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>Members decide what we build</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              What should Portland Civic Lab track next?
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              This is where the Lab&apos;s roadmap gets decided — in public,
              by members. Propose a topic, vote on what matters, and watch
              the most-supported ideas become dashboards.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <ProposalsBoard />
      </section>
    </div>
  );
}
