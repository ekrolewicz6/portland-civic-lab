import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, Database, ShieldCheck } from "lucide-react";
import DonationForm from "@/components/donate/DonationForm";

export const metadata: Metadata = {
  title: "Support the work — Portland Civic Lab",
  description:
    "Back Portland Civic Lab — we give all our civic tools away free, and support helps keep them that way. Monthly or one-time through secure Stripe Checkout. Contributions aren't tax-deductible charitable donations.",
  alternates: { canonical: "https://www.portlandciviclab.org/donate" },
};

const USES = [
  {
    icon: BarChart3,
    title: "Keep public dashboards current",
    body: "Fund data refreshes, source checks, and the unglamorous maintenance that makes public dashboards trustworthy.",
  },
  {
    icon: ClipboardList,
    title: "Run independent civic measurement",
    body: "Support surveys and public methods that show what Portlanders think, not just what institutions report.",
  },
  {
    icon: Database,
    title: "Turn public records into usable tools",
    body: "Help convert scattered PDFs, portals, hearings, and spreadsheets into decision-ready public infrastructure.",
  },
];

export default function DonatePage() {
  return (
    <main className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay text-white">
        <div className="absolute right-[-10rem] top-[-18rem] h-[42rem] w-[42rem] rounded-full bg-[var(--color-canopy-light)] opacity-35 blur-[170px]" />
        <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[var(--color-ember)] opacity-10 blur-[150px]" />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:px-12 3xl:max-w-[1800px]">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]">
              <span>Free tools, for everyone</span>
              <span className="h-px w-10 bg-[var(--color-ember)]/60" />
              <span>Back the next build</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-editorial-normal text-[38px] leading-[1.03] tracking-tight sm:text-[48px] lg:text-[52px] xl:text-[56px]">
              Help make Portland legible.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/72 sm:text-[18px]">
              Portland Civic Lab builds public dashboards, civic surveys, and practical tools —
              and gives them all away free. Backing the Lab helps keep them free, current, and
              independent, and funds what we build next.
            </p>

            <p className="mt-5 max-w-2xl rounded-sm border border-white/12 bg-white/[0.06] px-5 py-4 text-[14px] leading-relaxed text-white/72 backdrop-blur">
              One thing up front: because the Lab is a company that gives its work away —
              not a charity — your support isn&apos;t a tax-deductible donation. You&apos;re
              backing free, public tools, eyes open. We think that&apos;s a better deal than a
              write-off, and we&apos;d rather say so plainly.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {USES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-sm border border-white/12 bg-white/[0.06] p-4 backdrop-blur"
                >
                  <item.icon className="h-5 w-5 text-[var(--color-ember-bright)]" />
                  <h2 className="mt-3 text-[15px] font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/58">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <DonationForm />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:px-12 sm:py-16 3xl:max-w-[1800px]">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 lg:col-span-7 lg:p-8">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Why recurring
          </p>
          <h2 className="mt-3 max-w-3xl font-editorial text-[28px] leading-tight text-[var(--color-ink)] sm:text-[36px]">
            Recurring support keeps the work from becoming a one-off.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-light)]">
            The hard part is not launching one chart. It is keeping the source data fresh,
            documenting what changed, building tools people can actually use, and staying
            independent enough to call the numbers straight.
          </p>
        </div>

        <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 lg:col-span-5 lg:p-8">
          <ShieldCheck className="h-6 w-6 text-[var(--color-canopy)]" />
          <h2 className="mt-4 text-[20px] font-semibold text-[var(--color-ink)]">
            Payments run through Stripe Checkout.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            You choose the amount and frequency here, then Stripe handles the secure payment page.
            We never store card information on Portland Civic Lab servers. Monthly support can be
            canceled anytime — just email us and we&apos;ll stop the next charge.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-[0.14em] text-[var(--color-canopy)] hover:text-[var(--color-fern)] transition-colors"
          >
            Questions before supporting
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
