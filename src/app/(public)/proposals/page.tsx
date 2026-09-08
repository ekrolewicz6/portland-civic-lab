import type { Metadata } from "next";
import ProposalsBoard from "@/components/proposals/ProposalsBoard";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Topic Proposals",
  description:
    "Propose a topic for Portland Civic Lab to take on, and back the ones you want to see. Votes tell us what people want. What we find when we get there is never put to a vote.",
  path: "/proposals",
});

export default function ProposalsPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] 3xl:max-w-[1800px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85">
              <span>Proposals</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>Open to anyone</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              What should the Lab look into next?
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Propose a topic, or back one that is already here. We read every
              proposal, and the votes tell us what people actually want. We pick
              what to take on from that list and say why. What we find once we
              start is never put to a vote.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 sm:py-16">
        <ProposalsBoard />
      </section>
    </div>
  );
}
