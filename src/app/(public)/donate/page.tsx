import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, Database, ShieldCheck } from "lucide-react";
import DonationForm from "@/components/donate/DonationForm";

export const metadata: Metadata = {
  title: "Support the work — Portland Civic Lab",
  description:
    "Back Portland Civic Lab — a for-profit company that gives all its civic tools away free. Monthly or one-time support through secure Stripe Checkout. Not a tax-deductible charitable donation.",
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
      <section className="relative overflow-hidden bg-[var(--color-canopy)] text-white lg:min-h-[calc(100svh-56px)]">
        <div className="absolute right-[-10rem] top-[-18rem] h-[42rem] w-[42rem] rounded-full bg-[var(--color-canopy-light)] opacity-35 blur-[170px] 2xl:right-[2rem] 2xl:h-[58rem] 2xl:w-[58rem]" />
        <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[var(--color-ember)] opacity-10 blur-[150px] 2xl:h-[44rem] 2xl:w-[44rem]" />
        <div className="absolute inset-y-0 right-0 hidden w-[32vw] bg-[radial-gradient(circle_at_70%_30%,rgba(211,151,104,0.13),transparent_32rem)] 2xl:block" />

        <div className="relative mx-auto grid w-full max-w-[1760px] grid-cols-1 items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-14 xl:gap-12 xl:px-16 2xl:px-20 2xl:py-12 3xl:max-w-[2200px]">
          <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-ember)]">
              <span>Free tools, for everyone</span>
              <span className="h-px w-10 bg-[var(--color-ember)]/60" />
              <span>Back the next build</span>
            </div>
            <h1 className="mt-7 max-w-4xl font-editorial text-[46px] leading-[0.98] tracking-tight sm:text-[68px] lg:text-[76px] xl:text-[88px] 2xl:max-w-5xl 2xl:text-[112px] 3xl:text-[124px]">
              Help make Portland legible.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/72 sm:text-[20px] xl:max-w-3xl 2xl:text-[22px]">
              Portland Civic Lab builds public dashboards, civic surveys, and practical tools —
              and gives them all away free. Backing the Lab helps keep them free, current, and
              independent, and funds what we build next.
            </p>

            <p className="mt-6 max-w-2xl rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-4 text-[14px] leading-relaxed text-white/72 backdrop-blur xl:max-w-3xl 2xl:text-[15px]">
              One thing up front: Portland Civic Lab is a for-profit company, so your support
              is not a tax-deductible charitable donation. You&apos;re backing a small company
              that gives its work away free — eyes open, exactly what it looks like. We think
              that&apos;s a better deal than a write-off, and we&apos;d rather say so plainly.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:gap-4 2xl:max-w-6xl 2xl:grid-cols-3">
              {USES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur xl:p-5 2xl:grid 2xl:min-h-[210px] 2xl:grid-rows-[auto_auto_1fr]"
                >
                  <item.icon className="h-5 w-5 text-[var(--color-ember-bright)] 2xl:h-6 2xl:w-6" />
                  <h2 className="mt-4 text-[15px] font-semibold text-white 2xl:text-[18px]">{item.title}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/58 2xl:text-[15px]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 2xl:pt-2">
            <DonationForm />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-6 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-16 xl:px-16 2xl:px-20 3xl:max-w-[2200px]">
        <div className="rounded-[2rem] border border-[var(--color-parchment)] bg-white p-6 lg:col-span-7 lg:p-8 xl:col-span-8 2xl:p-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Why recurring
          </p>
          <h2 className="mt-3 max-w-5xl font-editorial text-[36px] leading-tight text-[var(--color-ink)] sm:text-[48px] 2xl:text-[64px]">
            Recurring support keeps the work from becoming a one-off.
          </h2>
          <p className="mt-4 max-w-4xl text-[16px] leading-relaxed text-[var(--color-ink-light)] 2xl:text-[18px]">
            The hard part is not launching one chart. It is keeping the source data fresh,
            documenting what changed, building tools people can actually use, and staying
            independent enough to call the numbers straight.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 lg:col-span-5 lg:p-8 xl:col-span-4 2xl:p-10">
          <ShieldCheck className="h-7 w-7 text-[var(--color-canopy)]" />
          <h2 className="mt-5 text-[22px] font-semibold text-[var(--color-ink)]">
            Payments run through Stripe Checkout.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            You choose the amount and frequency here, then Stripe handles the secure payment page.
            We never store card information on Portland Civic Lab servers. Monthly support can be
            canceled anytime — just email us and we&apos;ll stop the next charge.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-[0.14em] text-[var(--color-canopy)]"
          >
            Questions before supporting
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
