import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BarChart3, Calculator, Clock3, MapPinned } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PERMITS_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Portland Civic Labs — Practical tools for permits and city systems",
  },
  description:
    "Portland Civic Labs builds practical tools that simplify permitting, surface real city data, and help Portlanders navigate how the city actually works.",
  alternates: { canonical: "https://www.portlandciviclab.org" },
  openGraph: {
    title: "Portland Civic Labs — Practical tools for permits and city systems",
    description: "Tools that simplify permitting and make Portland's city data easier to use.",
    url: "https://www.portlandciviclab.org",
    siteName: "Portland Civic Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portland Civic Labs — Practical tools for permits and city systems",
    description: "Tools that simplify permitting and make Portland's city data easier to use.",
  },
};

const permitTools = [
  {
    title: "Zoning Check",
    description: "Understand what is allowed on your property.",
    href: `${PERMITS_URL}/zoning`,
    icon: MapPinned,
  },
  {
    title: "Fee Calculator",
    description: "Estimate costs before submitting anything.",
    href: `${PERMITS_URL}/fees`,
    icon: Calculator,
  },
  {
    title: "Timeline Estimator",
    description: "See how long approvals typically take.",
    href: `${PERMITS_URL}/timeline`,
    icon: Clock3,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header />

      <section className="relative bg-[var(--color-canopy)] noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[var(--color-ember)] rounded-full blur-[160px] opacity-[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-22">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85 animate-fade-up">
              <span>Portland Civic Labs</span>
              <div className="w-8 h-px bg-[var(--color-ember)]/60" />
              <span>Portland, Oregon</span>
            </div>

            <h1 className="mt-6 font-editorial-normal text-[42px] sm:text-[54px] lg:text-[72px] text-white leading-[1.02] tracking-tight animate-fade-up">
              Make Portland&apos;s systems easier to understand
              <span className="font-editorial italic text-[var(--color-ember-bright)]">
                {" "}and easier to use
              </span>
            </h1>

            <p
              className="mt-6 max-w-2xl text-[16px] sm:text-[18px] text-white/68 leading-relaxed animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Portland Civic Labs builds practical tools that simplify permitting,
              surface real city data, and help Portlanders navigate how the city
              actually works.
            </p>

            <div
              className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <a
                href={PERMITS_URL}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
              >
                Explore Portland Permits
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/6 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                View Live Dashboard
                <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[var(--color-ember)]" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
              Start Here
            </span>
          </div>
          <h2 className="font-editorial text-[30px] sm:text-[38px] lg:text-[46px] text-[var(--color-ink)] leading-tight">
            Start with what people need most: permits
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] text-[var(--color-ink-light)] leading-relaxed">
            Permitting is one of the most complex parts of interacting with the
            city. We built a simpler way to understand what you can build, what
            it will cost, and how long it will take before you even apply.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {permitTools.map((tool, index) => (
            <a
              key={tool.title}
              href={tool.href}
              className="group relative bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-6 transition-all duration-300 hover:border-[var(--color-sage)] hover:-translate-y-0.5 overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--color-canopy)]/80 transition-all duration-300 group-hover:h-[5px]" />
              <div className="w-11 h-11 rounded-sm bg-[var(--color-canopy)]/7 text-[var(--color-canopy)] flex items-center justify-center">
                <tool.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-editorial text-[22px] text-[var(--color-ink)]">
                {tool.title}
              </h3>
              <p className="mt-3 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--color-canopy)]">
                Open tool
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8">
          <a
            href={PERMITS_URL}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-canopy)] hover:text-[var(--color-canopy-mid)] transition-colors"
          >
            Open Portland Permits
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[var(--color-ember)]" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                  The Problem
                </span>
              </div>
              <h2 className="font-editorial text-[28px] sm:text-[34px] text-[var(--color-ink)] leading-tight">
                The system works, but it creates unnecessary friction
              </h2>
              <p className="mt-4 text-[15px] text-[var(--color-ink-light)] leading-relaxed max-w-xl">
                Most city processes were not designed to be easy to navigate.
                Applications are often incomplete, reviews happen step-by-step,
                and small issues can delay projects for weeks.
              </p>
              <ul className="mt-6 space-y-3 text-[14px] text-[var(--color-ink-light)]">
                <li className="flex gap-3"><span className="font-mono text-[var(--color-ember)]">01</span><span>Requirements are hard to understand upfront</span></li>
                <li className="flex gap-3"><span className="font-mono text-[var(--color-ember)]">02</span><span>Reviews do not happen at the same time</span></li>
                <li className="flex gap-3"><span className="font-mono text-[var(--color-ember)]">03</span><span>Small errors cause repeated delays</span></li>
                <li className="flex gap-3"><span className="font-mono text-[var(--color-ember)]">04</span><span>Timelines are often unpredictable</span></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[var(--color-ember)]" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                  What We Built
                </span>
              </div>
              <h2 className="font-editorial text-[28px] sm:text-[34px] text-[var(--color-ink)] leading-tight">
                A better way for systems to work
              </h2>
              <p className="mt-4 text-[15px] text-[var(--color-ink-light)] leading-relaxed max-w-xl">
                Instead of changing the rules, we improve how the process works.
              </p>
              <div className="mt-8 space-y-5">
                <div className="bg-white/70 border border-[var(--color-parchment)] rounded-sm p-5">
                  <h3 className="font-semibold text-[var(--color-ink)]">Catch issues early</h3>
                  <p className="mt-2 text-[14px] text-[var(--color-ink-light)]">Identify missing information before submission.</p>
                </div>
                <div className="bg-white/70 border border-[var(--color-parchment)] rounded-sm p-5">
                  <h3 className="font-semibold text-[var(--color-ink)]">Review in parallel</h3>
                  <p className="mt-2 text-[14px] text-[var(--color-ink-light)]">Reduce delays caused by sequential workflows.</p>
                </div>
                <div className="bg-white/70 border border-[var(--color-parchment)] rounded-sm p-5">
                  <h3 className="font-semibold text-[var(--color-ink)]">Make progress visible</h3>
                  <p className="mt-2 text-[14px] text-[var(--color-ink-light)]">Clear timelines and next steps for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                Dashboard
              </span>
            </div>
            <h2 className="font-editorial text-[30px] sm:text-[38px] lg:text-[44px] text-[var(--color-ink)] leading-tight">
              Understand how the city is performing
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] text-[var(--color-ink-light)] leading-relaxed">
              We built a live dashboard to make city data easier to explore, so
              residents and decision-makers can see what is happening in housing,
              safety, and infrastructure.
            </p>
            <div className="mt-7">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-3 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper)]"
              >
                View the dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-6">
            <h3 className="font-editorial text-[24px] text-[var(--color-ink)]">Built for Portland</h3>
            <p className="mt-3 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              Our tools are designed using Portland&apos;s zoning rules,
              permitting processes, and real-world workflows. We focus on
              practical improvements that reduce delays and make systems easier
              to use.
            </p>
            <h4 className="mt-6 font-semibold text-[var(--color-ink)]">Looking ahead</h4>
            <p className="mt-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              We are starting with permitting, with the goal of improving how
              city systems work more broadly, making them more predictable,
              accessible, and easier for everyone to navigate.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
