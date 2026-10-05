import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Network,
  CalendarDays,
  FileDown,
} from "lucide-react";
import {
  dateLabel,
  EDITION,
  OUTCOMES,
  portfolio,
  stats,
  upcoming,
  dependencyGroups,
  statusOf,
} from "@/lib/ced/model";
import { Badge, InitiativeLink, SectionTitle, SourceLink } from "./Shared";
export default function PortfolioHome({ asOf }: { asOf: string }) {
  const s = stats(asOf);
  const next = upcoming(asOf);
  const groups = dependencyGroups();
  const past = portfolio.decisions.filter(
    (d) => statusOf(d, asOf) === "Past expected date",
  );
  return (
    <>
      <section className="ced-hero">
        <div>
          <p className="ced-eyebrow">
            Portland · Community & Economic Development
          </p>
          <h1>
            One portfolio.
            <br />
            <em>Connected decisions.</em>
          </h1>
          <p className="ced-lede">
            What’s underway, what comes next, and what depends on what. Follow
            the work across housing, planning, climate, economic development and
            civic life.
          </p>
          <div className="ced-actions">
            <Link className="ced-button primary" href="/ced/initiatives">
              Explore the portfolio <ArrowRight size={17} />
            </Link>
            <Link className="ced-button" href="/ced/briefing">
              <FileDown size={16} /> Open briefing
            </Link>
          </div>
          <p className="ced-hero-note">
            Independent public-source map · {dateLabel(EDITION)} edition
          </p>
        </div>
        <div className="ced-now-panel">
          <div className="ced-panel-label">
            <CalendarDays size={16} />
            <span>Coming next</span>
            <Badge>60-day view</Badge>
          </div>
          {next.slice(0, 3).map((d) => (
            <Link
              key={d.id}
              className="ced-now-row"
              href={`/ced/decisions?record=${d.id}`}
            >
              <span className="ced-date-block">
                <b>
                  {new Date(
                    d.expected.start! + "T12:00:00Z",
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    timeZone: "UTC",
                  })}
                </b>
                <strong>{Number(d.expected.start!.slice(-2))}</strong>
              </span>
              <span>
                <small>
                  {d.kind === "decision" ? "Decision" : "Milestone"}
                </small>
                <strong>{d.question}</strong>
                <span>{d.authority}</span>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
          {!next.length && (
            <p className="ced-empty">
              No dated events in this window. Check the undated queue for
              unresolved work.
            </p>
          )}
          <Link className="ced-panel-footer" href="/ced/timeline">
            See the full timeline <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <div className="ced-stat-strip">
        {[
          [s.initiatives, "initiatives mapped", "/ced/initiatives"],
          [s.decisions, "unresolved decisions", "/ced/decisions"],
          [s.upcoming, "dated events · next 60 days", "/ced/timeline"],
          [s.dependencies, "mapped dependencies", "/ced/dependencies"],
        ].map(([n, label, href]) => (
          <Link href={String(href)} key={String(label)}>
            <strong>{n}</strong>
            <span>{label}</span>
            <ArrowUpRight size={15} />
          </Link>
        ))}
      </div>
      <section className="ced-section">
        <SectionTitle
          eyebrow="Movement in the public record"
          title="What changed"
          text="Recorded in this edition, compared with the August 17 research baseline."
        >
          <Link className="ced-text-link" href="/ced/changes">
            Full change history <ArrowRight size={16} />
          </Link>
        </SectionTitle>
        <div className="ced-movement-grid">
          {portfolio.changes
            .filter((c) =>
              ["central-date", "p5-rfp-issued", "psu-adopted"].includes(c.id),
            )
            .map((c) => (
              <article key={c.id}>
                <p className="ced-eyebrow">{dateLabel(c.eventDate)}</p>
                <h3>
                  <InitiativeLink id={c.initiative} />
                </h3>
                <div className="ced-transition">
                  <span>{c.before}</span>
                  <ArrowRight size={16} />
                  <strong>{c.after}</strong>
                </div>
                <p>{c.significance}</p>
                <SourceLink id={c.source} compact />
              </article>
            ))}
        </div>
      </section>
      <section className="ced-section ced-home-split">
        <div>
          <SectionTitle
            eyebrow="The coordination layer"
            title="Shared work. Shared dependencies."
            text="Select a project to see its public approvals, delivery partners and financing needs."
          />
          <div className="ced-network-teaser">
            <div className="ced-network-root">
              <Network size={25} />
              <strong>Broadway Corridor</strong>
              <span>Housing · Infrastructure · Finance</span>
            </div>
            <div className="ced-network-branches">
              {[
                "Prosper Portland",
                "PHB",
                "PP&D",
                "PBOT",
                "Project financing",
              ].map((t) => (
                <Link
                  href={`/ced/dependencies?initiative=broadway-corridor-usps-redevelopment&dependency=${encodeURIComponent(t)}`}
                  key={t}
                >
                  <span />
                  {t}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
          <Link className="ced-button primary" href="/ced/dependencies">
            Explore the dependency map <ArrowRight size={17} />
          </Link>
        </div>
        <aside className="ced-attention">
          <p className="ced-eyebrow">Needs a closer look</p>
          <h2>
            Uncertainty,
            <br />
            made visible.
          </h2>
          <Link href="/ced/decisions?status=Past+expected+date">
            <strong>{s.past}</strong>
            <span>
              past expected dates
              <br />
              <small>Completion not confirmed in this record</small>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          <Link href="/ced/decisions?timing=imprecise">
            <strong>{s.undated}</strong>
            <span>
              without a precise date
              <br />
              <small>Includes tentative and seasonal windows</small>
            </span>
            <ArrowUpRight size={17} />
          </Link>
          {past.slice(0, 2).map((d) => (
            <p key={d.id}>
              <InitiativeLink id={d.initiative} />
              <br />
              <span>
                {d.question} · {dateLabel(d.expected.label)}
              </span>
            </p>
          ))}
          <p className="ced-small">
            Missing public evidence is a follow-up question. It does not prove
            inactivity or delay.
          </p>
        </aside>
      </section>
      <section className="ced-section">
        <SectionTitle
          eyebrow="Strategy → delivery → outcomes"
          title="Start with the intended result"
          text="CED’s five official outcomes, connected to the initiatives that could contribute. These are theories of contribution, not measured causal effects."
        />
        <div className="ced-outcome-strip">
          {OUTCOMES.map((o, n) => (
            <Link key={o.id} href={`/ced/outcomes?outcome=${o.id}`}>
              <span className="ced-eyebrow">0{n + 1}</span>
              <h3>{o.name}</h3>
              <div>
                <strong>
                  {
                    portfolio.initiatives.filter((i) =>
                      i.outcomes.some((l) => l.id === o.id),
                    ).length
                  }
                </strong>
                <span>linked initiatives</span>
                <ArrowUpRight size={18} />
              </div>
            </Link>
          ))}
        </div>
        <p className="ced-small ced-muted">
          Children’s services and arts access also have direct public purposes
          beyond these five indicators.{" "}
          <Link href="/ced/outcomes">
            See where the framework needs more detail →
          </Link>
        </p>
      </section>
      <section className="ced-service-note">
        <div>
          <p className="ced-eyebrow">A useful first conversation</p>
          <h2>Does this match how you think about the work?</h2>
          <p>
            Explore a project, follow a dependency, and inspect what changed.
            Corrections to this map are the starting point for a better shared
            record.
          </p>
        </div>
        <div>
          <Link
            className="ced-button"
            href="/contact?topic=CED%20Portfolio%20Map"
          >
            Share a correction <ArrowRight size={16} />
          </Link>
          <Link className="ced-text-link" href="/institutions">
            How a maintained portfolio works <ArrowUpRight size={15} />
          </Link>
          <p className="ced-small">
            Most common mapped dependency: {groups[0]?.target} ·{" "}
            {groups[0]?.items.length} initiatives. Frequency is not a bottleneck
            rating.
          </p>
        </div>
      </section>
    </>
  );
}
