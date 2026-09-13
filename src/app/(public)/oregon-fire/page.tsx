import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Flame,
  BookOpen,
  MapPin,
  Compass,
} from "lucide-react";
import ForestContext from "@/components/oregon-fire/ForestContext";
import FireExplorer from "@/components/oregon-fire/FireExplorer";
import { coverage } from "@/lib/oregon-fire/query";
import FireGuide from "@/components/oregon-fire/FireGuide";
import PlaceFinder from "@/components/oregon-fire/PlaceFinder";
import FireStories from "@/components/oregon-fire/FireStories";
import FireComparison from "@/components/oregon-fire/FireComparison";
import FireDecisions from "@/components/oregon-fire/FireDecisions";
import { pageMeta } from "@/lib/page-meta";
import {
  FIRE_TITLE,
  FIRE_DESCRIPTION,
  FIRE_AUTHORS,
  fireStructuredData,
} from "@/lib/oregon-fire/metadata";
import "./fire.css";
import "./guide.css";

const editorial = localFont({
  src: "../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf",
  variable: "--font-editorial",
  weight: "500",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  ...pageMeta({
    title: FIRE_TITLE,
    description: FIRE_DESCRIPTION,
    path: "/oregon-fire",
  }),
  authors: FIRE_AUTHORS.map((name) => ({ name })),
  keywords: [
    "Oregon fire map",
    "Oregon prescribed burns",
    "prescribed fire",
    "Oregon wildfire history",
    "planned burns",
    "burn treatment records",
    "recent Oregon fire scars",
    "burn severity map",
  ],
};
export default async function OregonFirePage() {
  const sources = await coverage();
  return (
    <article className={`fire-page ${editorial.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fireStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="fire-hero">
        <div className="fire-hero-top">
          <span className="fire-eyebrow">
            <Flame size={15} /> A living atlas · Oregon
          </span>
          <a href="#sources">
            Sources & coverage <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="fire-hero-grid">
          <div>
            <h1>
              Fire in Oregon
              <span>
                Where it happens.
                <br />
                Why it matters.
              </span>
            </h1>
          </div>
          <div className="fire-intro">
            <p>
              Fire is part of this landscape.
              <br />
              The records tell different stories.
            </p>
            <p>
              Learn how fire shapes different Oregon landscapes. Find a place
              you know, follow a documented story, or explore prescribed burns
              and wildfire history. See what happened—and what the evidence
              can tell us about better choices.
            </p>
            <a href="#explore">
              Explore the map <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="fire-byline">
          <span>By {FIRE_AUTHORS.join(" & ")}</span>
          <span>First edition · Coverage in progress</span>
        </div>
      </header>
      <div className="fire-shell">
        <nav
          className="fire-entry-paths"
          aria-label="Choose your way into the atlas"
        >
          <a href="#understand">
            <BookOpen size={23} />
            <span>
              <strong>Understand fire</strong>
              <small>A short guide to Oregon’s landscapes</small>
            </span>
            <ArrowDown size={17} />
          </a>
          <a href="#find-place">
            <MapPin size={23} />
            <span>
              <strong>Find a place</strong>
              <small>Start with a community you know</small>
            </span>
            <ArrowDown size={17} />
          </a>
          <a href="#explore">
            <Compass size={23} />
            <span>
              <strong>Explore the records</strong>
              <small>Go straight to the map and sources</small>
            </span>
            <ArrowDown size={17} />
          </a>
        </nav>
        <nav className="fire-chapter-nav" aria-label="Field guide chapters">
          <a href="#understand">Landscapes</a><a href="#find-place">Find a place</a><a href="#explore">Map</a><a href="#fire-stories">Stories</a><a href="#through-time">Through time</a><a href="#burn-windows">Burn windows</a><a href="#what-success-means">What success means</a><a href="#sources">Sources</a>
        </nav>
        <FireGuide />
        <PlaceFinder />
        <FireExplorer sources={sources} />
        <ForestContext />
        <FireStories />
        <FireComparison />
        <FireDecisions />
        <section id="sources" className="fire-sources">
          <div className="fire-section-head">
            <div>
              <span className="fire-eyebrow">Open source, visible limits</span>
              <h2>What’s here. What’s missing.</h2>
            </div>
            <p>
              Counts below describe the latest complete import for each source,
              after location and publication checks. Rolling-feed history may
              contain additional records.
            </p>
          </div>
          <div className="fire-coverage-table">
            <table>
              <caption className="sr-only">
                Fire data sources, coverage and refresh status
              </caption>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Coverage & limitations</th>
                  <th>Import status</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id}>
                    <th scope="row">
                      <a href={s.url}>
                        {s.name} <ArrowUpRight size={12} />
                      </a>
                      <span>
                        {s.agency} ·{" "}
                        {s.role === "requested"
                          ? "Acquisition pending"
                          : s.role}
                      </span>
                    </th>
                    <td>
                      {s.coverage}
                      <p>{s.limitations}</p>
                    </td>
                    <td>
                      <strong className={`fire-status ${s.state}`}>
                        {s.lastSuccess
                          ? `${s.recordCount?.toLocaleString()} records`
                          : "Not imported"}
                      </strong>
                      <span>
                        {s.lastSuccess
                          ? new Date(s.lastSuccess)
                              .toISOString()
                              .slice(0, 16)
                              .replace("T", " ") + " UTC"
                          : "Source identified; records pending"}
                      </span>
                      {s.minYear && (
                        <span>
                          {s.minYear}–{s.maxYear}
                        </span>
                      )}
                      {s.state === "stale" && <span>Refresh overdue</span>}
                      {s.error && <span>{s.error}</span>}
                      {!!s.unlocatedCount && (
                        <span>
                          {s.unlocatedCount} source records lack mapped
                          locations
                        </span>
                      )}
                      {!!s.heldCount && (
                        <span>{s.heldCount} held for review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="fire-invitation">
          <div>
            <span className="fire-eyebrow">Help make the record better</span>
            <h2>Know the story of a burn?</h2>
            <p>
              We’re looking for records, burn plans, explanations, and
              corrections. Contributions are reviewed before publication. We
              seek agreement with the relevant programs before publishing
              identified tribal or cultural burns.
            </p>
          </div>
          <Link href="/contact?topic=Work+on+a+topic&project=Oregon+Fire+Map">
            Contribute to the atlas <ArrowUpRight size={18} />
          </Link>
        </section>
        <p className="fire-footer-note">
          An educational project from Portland Civic Lab. For current emergency
          information, consult{" "}
          <a href="https://www.oregon.gov/oem/Pages/default.aspx">
            Oregon Emergency Management
          </a>{" "}
          and your county’s official alerts.
        </p>
      </div>
    </article>
  );
}
