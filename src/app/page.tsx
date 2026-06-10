import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  ClipboardList,
  Database,
  Gauge,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ASK_PORTLAND_URL, PERMITS_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Portland Civic Lab — Dashboards and civic tools for Portland",
  },
  description:
    "Portland Civic Lab builds public dashboards, civic measurement tools, and practical products that help Portlanders understand how the city is doing and what residents actually think.",
  alternates: { canonical: "https://www.portlandciviclab.org" },
  openGraph: {
    title: "Portland Civic Lab — Dashboards and civic tools for Portland",
    description:
      "Public dashboards, civic measurement, and practical tools for understanding Portland.",
    url: "https://www.portlandciviclab.org",
    siteName: "Portland Civic Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portland Civic Lab — Dashboards and civic tools for Portland",
    description:
      "Public dashboards, civic measurement, and practical tools for understanding Portland.",
  },
};

const dashboardTopics = [
  { title: "Housing", href: "/dashboard/housing" },
  { title: "Homelessness", href: "/dashboard/homelessness" },
  { title: "Safety", href: "/dashboard/safety" },
  { title: "Fiscal health", href: "/dashboard/fiscal" },
  { title: "Performance", href: "/dashboard/performance" },
  { title: "Climate", href: "/dashboard/climate" },
  { title: "Transportation", href: "/dashboard/transportation" },
  { title: "Accountability", href: "/dashboard/accountability" },
];

const projects = [
  {
    eyebrow: "Core platform",
    title: "Portland Dashboards",
    description:
      "Source-linked public dashboards for housing, homelessness, public safety, budgets, city performance, and government accountability.",
    href: "/dashboard",
    cta: "Open dashboards",
    icon: BarChart3,
    primary: true,
  },
  {
    eyebrow: "Civic measurement",
    title: "Ask Portland",
    description:
      "Independent, non-partisan surveys that gather input directly from Portlanders, publish the method, and show raw results next to weighted estimates.",
    href: ASK_PORTLAND_URL,
    cta: "Visit Ask Portland",
    icon: ClipboardList,
    primary: false,
  },
  {
    eyebrow: "Workflow tools",
    title: "Portland Permits",
    description:
      "Practical tools for understanding zoning, estimating fees, and navigating permitting timelines before people submit an application.",
    href: PERMITS_URL,
    cta: "Open permitting tools",
    icon: MapPinned,
    primary: false,
  },
];

const methodBlocks = [
  {
    title: "Public data",
    description:
      "Dashboards make official city, county, state, and federal data easier to compare, audit, and use.",
    icon: Database,
  },
  {
    title: "Resident input",
    description:
      "Ask Portland measures what residents actually think, with transparent sampling, weighting, and methodology.",
    icon: ClipboardList,
  },
  {
    title: "Practical workflows",
    description:
      "Tools like Portland Permits turn complicated processes into clearer next steps for real users.",
    icon: Gauge,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header />

      <section className="relative bg-[var(--color-canopy)] noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[680px] h-[680px] bg-[var(--color-canopy-light)] rounded-full blur-[190px] opacity-28 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-[var(--color-ember)] rounded-full blur-[170px] opacity-[0.08] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-18 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
            <div className="lg:col-span-8 max-w-5xl">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85 animate-fade-up">
                <span>Portland Civic Lab</span>
                <div className="w-8 h-px bg-[var(--color-ember)]/60" />
                <span>Public dashboards and civic tools</span>
              </div>

              <h1 className="mt-6 font-editorial-normal text-[42px] sm:text-[58px] lg:text-[72px] xl:text-[78px] text-white leading-[1.03] tracking-tight animate-fade-up">
                Portland, decoded.
                <span className="block font-editorial italic text-[var(--color-ember-bright)]">
                  Numbers, voices, and what comes next.
                </span>
              </h1>

              <p
                className="mt-6 max-w-3xl text-[16px] sm:text-[19px] text-white/70 leading-relaxed animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
                Portland Civic Lab builds dashboards, surveys, and practical
                tools that help residents, staff, advocates, and
                decision-makers see what is happening, what people think, and
                what should happen next.
              </p>

              <div
                className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up"
                style={{ animationDelay: "180ms" }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
                >
                  Open the dashboards
                  <BarChart3 className="w-4 h-4" />
                </Link>
                <a
                  href={ASK_PORTLAND_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/6 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Visit Ask Portland
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div
              className="lg:col-span-4 animate-fade-up"
              style={{ animationDelay: "220ms" }}
            >
              <div className="rounded-sm border border-white/12 bg-white/[0.06] p-5 sm:p-6 backdrop-blur">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]">
                  Start here
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-white/72">
                  One place to see how Portland is doing — housing, safety,
                  budgets, climate, and how city government is performing.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {dashboardTopics.slice(0, 6).map((topic) => (
                    <span
                      key={topic.title}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70"
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                The dashboards
              </span>
            </div>
            <h2 className="font-editorial text-[32px] sm:text-[42px] lg:text-[54px] text-[var(--color-ink)] leading-tight">
              See how Portland is actually doing
            </h2>
            <p className="mt-5 max-w-xl text-[16px] text-[var(--color-ink-light)] leading-relaxed">
              Portland&apos;s public data is scattered across dozens of agencies
              and hard to make sense of. We pull it into one place — organized by
              topic, with the original sources, trends over time, and plain
              explanations of what the numbers mean.
            </p>
            <div className="mt-7">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
              >
                Browse the dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardTopics.map((topic, index) => (
              <Link
                key={topic.title}
                href={topic.href}
                className="group rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-sage)]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-light)]">
                    Dashboard topic
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-ember)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="mt-5 font-editorial text-[24px] text-[var(--color-ink)]">
                  {topic.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                Current projects
              </span>
            </div>
            <h2 className="font-editorial text-[32px] sm:text-[42px] text-[var(--color-ink)] leading-tight">
              Three ways to get a clearer picture of Portland
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] text-[var(--color-ink-light)] leading-relaxed">
              Dashboards that track how the city is doing, surveys that capture
              what residents actually think, and permitting tools that make
              building in Portland less confusing.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                className={`group relative overflow-hidden rounded-sm border p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                  project.primary
                    ? "bg-[var(--color-canopy)] text-white border-[var(--color-canopy)] lg:col-span-1"
                    : "bg-white border-[var(--color-parchment)] text-[var(--color-ink)] hover:border-[var(--color-sage)]"
                }`}
              >
                <div
                  className={`absolute left-0 right-0 top-0 h-[3px] ${
                    project.primary
                      ? "bg-[var(--color-ember)]"
                      : "bg-[var(--color-canopy)]/80"
                  }`}
                />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-sm ${
                    project.primary
                      ? "bg-white/10 text-[var(--color-ember)]"
                      : "bg-[var(--color-canopy)]/7 text-[var(--color-canopy)]"
                  }`}
                >
                  <project.icon className="h-5 w-5" />
                </div>
                <div
                  className={`mt-6 text-[10px] font-mono uppercase tracking-[0.2em] ${
                    project.primary
                      ? "text-[var(--color-ember)]"
                      : "text-[var(--color-ember)]"
                  }`}
                >
                  {project.eyebrow}
                </div>
                <h3
                  className={`mt-3 font-editorial text-[28px] leading-tight ${
                    project.primary ? "text-white" : "text-[var(--color-ink)]"
                  }`}
                >
                  {project.title}
                </h3>
                <p
                  className={`mt-4 text-[14px] leading-relaxed ${
                    project.primary ? "text-white/70" : "text-[var(--color-ink-light)]"
                  }`}
                >
                  {project.description}
                </p>
                <div
                  className={`mt-7 inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.14em] ${
                    project.primary
                      ? "text-[var(--color-ember)]"
                      : "text-[var(--color-canopy)]"
                  }`}
                >
                  {project.cta}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                How it fits
              </span>
            </div>
            <h2 className="font-editorial text-[30px] sm:text-[38px] text-[var(--color-ink)] leading-tight">
              Data, opinion, and workflows belong together
            </h2>
            <p className="mt-4 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
              A dashboard can show what is happening. A survey can show what
              people believe and want. A workflow tool can help someone act on
              the rules in front of them. Portland Civic Lab connects those
              layers without pretending they are the same thing.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {methodBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--color-canopy)]/7 text-[var(--color-canopy)]">
                  <block.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-editorial text-[24px] text-[var(--color-ink)]">
                  {block.title}
                </h3>
                <p className="mt-3 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ember)]">
                <ShieldCheck className="h-4 w-4" />
                Have an idea?
              </div>
              <h2 className="mt-4 font-editorial text-[28px] sm:text-[34px] text-[var(--color-ink)] leading-tight">
                Something about Portland you wish someone was tracking?
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                If there&apos;s a local problem you want measured, or public data
                that&apos;s hard to find and should be easier, tell us. The best
                ideas for what to build next come from people who live here.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-3 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper)]"
              >
                Suggest a project
                <Building2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
