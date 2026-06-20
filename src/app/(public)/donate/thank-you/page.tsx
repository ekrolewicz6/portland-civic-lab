import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank you — Portland Civic Lab",
  robots: { index: false, follow: false },
};

export default function DonateThankYouPage() {
  return (
    <main className="bg-[var(--color-paper)]">
      <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-canopy)] text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]">
          Donation received
        </p>
        <h1 className="mt-4 font-editorial text-[48px] leading-none text-[var(--color-ink)] sm:text-[72px]">
          Thank you for backing the work.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--color-ink-light)]">
          Your support helps keep Portland Civic Lab useful, independent, and current.
          Stripe will send the payment receipt to the email used at checkout.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white"
          >
            Explore the dashboards
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--color-parchment)] bg-white px-5 py-3 text-[15px] font-semibold text-[var(--color-ink)]"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
