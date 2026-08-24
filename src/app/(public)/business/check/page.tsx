import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import AddressCheck from "./AddressCheck";

export const metadata: Metadata = pageMeta({
  title: "Check what your address qualifies for",
  description:
    "Portland's biggest small-business grants are gated on district boundaries no owner can see. Enter an address and find out which doors are open, which are closed, and why.",
  path: "/business/check",
});

export default function BusinessCheckPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <header className="noise-overlay relative overflow-hidden bg-[var(--color-canopy)] py-14 text-white sm:py-16">
        <div className="relative z-10 mx-auto w-full max-w-[900px] px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
            For business ——— Address check
          </p>
          <h1 className="mt-4 font-editorial-normal text-[34px] leading-[1.08] sm:text-[46px]">
            Some of the biggest grants
            <span className="block font-editorial italic text-[var(--color-ember-bright)]">
              depend on a line you can&apos;t see.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75">
            Whether your address sits inside a tax increment district decides access to matching
            grants worth up to $75,000. Whether your business district association is a Venture
            Portland member decides whether district money can reach your block at all. Neither
            boundary is on any map you&apos;d think to check.
          </p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            No account, nothing stored. This tells you which doors are open — and which ones
            aren&apos;t worth the walk.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 sm:py-14">
        <AddressCheck />
      </main>
    </div>
  );
}
