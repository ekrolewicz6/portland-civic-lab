import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Flame, BookOpen } from "lucide-react";
import ForestContext from "@/components/oregon-fire/ForestContext";
import FireExplorer from "@/components/oregon-fire/FireExplorer";
import { coverage } from "@/lib/oregon-fire/query";
import { WOODPECKER } from "@/lib/oregon-fire/sources";
import { pageMeta } from "@/lib/page-meta";
import { FIRE_TITLE, FIRE_DESCRIPTION, FIRE_AUTHORS, fireStructuredData } from "@/lib/oregon-fire/metadata";
import "./fire.css";

const editorial = localFont({ src: "../../../lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf", variable: "--font-editorial", weight: "500", display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  ...pageMeta({ title: FIRE_TITLE, description: FIRE_DESCRIPTION, path: "/oregon-fire" }),
  authors: FIRE_AUTHORS.map((name) => ({ name })),
  keywords: ["Oregon fire map", "Oregon prescribed burns", "prescribed fire", "Oregon wildfire history", "planned burns", "burn treatment records", "recent Oregon fire scars", "burn severity map"],
};
export default async function OregonFirePage() {
  const sources = await coverage();
  return (
    <article className={`fire-page ${editorial.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fireStructuredData).replace(/</g, "\\u003c") }} />
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
              Explore prescribed burns, the reasons behind them, and the
              wildfire scars around them. Compare years of fire and satellite burn severity. Follow each record back to its
              source—and see what we still need to learn.
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
        <FireExplorer sources={sources} />
        <ForestContext />
        <section className="fire-reading">
          <div>
            <span className="fire-eyebrow">Reading the landscape</span>
            <h2>
              A burn has a purpose.
              <br />A place has a history.
            </h2>
            <p>
              A registration, a planned treatment, and a completed burn describe
              different things. This map keeps them distinct. Even a completed
              treatment polygon can include ground that did not burn.
            </p>
          </div>
          <div className="fire-principles">
            <div>
              <span>01</span>
              <h3>Follow the evidence</h3>
              <p>
                Reported purpose codes appear as reported. Site-specific
                explanations need a document or an attributed account.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>See the gaps</h3>
              <p>
                Federal treatment records are the starting point. State,
                private, agricultural, and ecological burn histories are still
                being assembled.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Keep the distinctions</h3>
              <p>
                Records are not unique fires. Treatment acres, reported fire
                size, and mapped area are different measures. Overlap does not
                prove effectiveness.
              </p>
            </div>
          </div>
        </section>
        <section className="fire-story">
          <div className="fire-story-label">
            <BookOpen size={24} />
            <span className="fire-eyebrow">
              From the field
              <br />
              McDonald-Dunn Research Forest
            </span>
          </div>
          <div>
            <span className="fire-eyebrow">
              Documented example · October 2025
            </span>
            <h2>{WOODPECKER.title}</h2>
            <p>{WOODPECKER.body}</p>
            <a href={WOODPECKER.url}>
              Read OSU’s account <ArrowUpRight size={16} />
            </a>
            <p className="fire-small">
              {WOODPECKER.attribution}. This story has no map pin until unit
              geometry is verified.
            </p>
          </div>
        </section>
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
          <a href="https://www.oregon.gov/oem/emops/Pages/RAPTOR.aspx">
            Oregon Emergency Management
          </a>{" "}
          and your county’s official alerts.
        </p>
      </div>
    </article>
  );
}
