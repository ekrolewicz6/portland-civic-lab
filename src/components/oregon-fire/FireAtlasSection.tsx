import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FireExplorer from "./FireExplorer";
import PlaceFinder from "./PlaceFinder";
import { coverage } from "@/lib/oregon-fire/query";

/** The guide streams independently of the atlas's database query. */
export default async function FireAtlasSection() {
  const sources = await coverage();
  return <div className="fire-guide-atlas">
    <PlaceFinder />
    <FireExplorer sources={sources} />
    <details id="sources" className="fire-coverage-disclosure">
      <summary>Data sources, coverage and latest successful updates</summary>
        <section id="source-coverage" className="fire-sources">
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
                      {!!s.unlocatedCount && <Link href={`/api/oregon-fire/unlocated?source=${s.id}`}>Unlocated records awaiting verification ↗</Link>}
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
    </details>
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
          <Link href="/contact?topic=Work+on+a+topic&project=Oregon+Fire+Map">Contribute a record or correction <ArrowUpRight size={18}/></Link>
        </section>
        <p className="fire-footer-note">For current emergency information, consult <a href="https://www.oregon.gov/oem/Pages/default.aspx">Oregon Emergency Management</a> and your county’s official alerts. For smoke conditions, visit <a href="https://fire.airnow.gov/">AirNow’s Fire and Smoke Map</a>.</p>
      </div>;
}
