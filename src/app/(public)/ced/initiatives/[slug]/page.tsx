import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Network } from "lucide-react";
import {
  dateLabel,
  initiatives,
  isActive,
  OUTCOMES,
  portfolio,
  sources,
  today,
  windowIsPast,
} from "@/lib/ced/model";
import {
  Badge,
  ConflictNotice,
  DecisionCard,
  InitiativeLink,
  SectionTitle,
  SourceLink,
} from "@/components/ced/Shared";
import { FundingCard } from "@/components/ced/Explorer";
import { metaDescription } from "@/lib/page-meta";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = initiatives.get(slug);
  return {
    title: i?.name ?? "Initiative not found",
    description: i ? metaDescription(`${i.objective} Decisions, money, dependencies and sources for ${i.name}, in the CED Portfolio Map.`) : undefined,
    alternates: { canonical: `/ced/initiatives/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = initiatives.get(slug);
  if (!i) notFound();
  const asOf = today();
  const records = portfolio.decisions.filter((d) => d.initiative === i.id);
  const active = records.filter(isActive);
  const history = records.filter((d) => !isActive(d));
  const funding = portfolio.funding.filter((f) => f.initiative === i.id);
  return (
    <>
      <Link className="ced-back" href="/ced/initiatives">
        <ArrowLeft size={15} />
        All initiatives
      </Link>
      <header className="ced-initiative-head">
        <div>
          <p className="ced-eyebrow">{i.domain}</p>
          <h1>{i.name}</h1>
          <p className="ced-lede">{i.objective}</p>
          <div className="ced-actions">
            <Badge tone="green">{i.stage}</Badge>
            <span className="ced-small">
              PCL stage classification · checked {dateLabel(i.checked)}
            </span>
          </div>
        </div>
        <aside>
          <span className="ced-eyebrow">
            Accountable institution in the record
          </span>
          <h3>{i.owner}</h3>
          <p>Partners: {i.partners.join(" · ")}</p>
          <span className="ced-small">
            Partner listings describe the project, not a relationship with
            Portland Civic Lab.
          </span>
        </aside>
      </header>
      <div className="ced-initiative-snapshot">
        <div>
          <span className="ced-eyebrow">Last documented movement</span>
          <strong>{i.latest.label}</strong>
          <span>{dateLabel(i.latest.date)}</span>
          <SourceLink id={i.latest.source} compact />
        </div>
        <div>
          <span className="ced-eyebrow">Next known milestone</span>
          <strong>{i.next.label}</strong>
          <span>{dateLabel(i.next.expected.label)}</span>
          {windowIsPast(i.next.expected, asOf) && (
            <Badge tone="amber">Past expected date · check completion</Badge>
          )}
          <SourceLink id={i.next.source} compact />
        </div>
        <div>
          <span className="ced-eyebrow">Unresolved records</span>
          <strong className="ced-count">
            {active.filter((d) => d.kind === "decision").length} decisions
          </strong>
          <span>
            {active.filter((d) => d.kind === "milestone").length} milestones ·{" "}
            {history.length} historical records
          </span>
          <a className="ced-text-link" href="#decision-records">
            Open the queue ↓
          </a>
        </div>
      </div>
      <div className="ced-evidence-grid">
        <article className="ced-fact">
          <p className="ced-eyebrow">Public record</p>
          <h2>{i.publicStatus}</h2>
          <p>{i.summary}</p>
          {i.progress && <p className="ced-progress">{i.progress}</p>}
          <SourceLink id={i.recordSource} />
        </article>
        <article className="ced-analysis">
          <p className="ced-eyebrow">PCL synthesis</p>
          <h2>Why this matters</h2>
          <p>{i.analysis}</p>
          <h3>Success would look like</h3>
          <p>{i.success}</p>
          <h3>If no further action is taken</h3>
          <p>{i.inaction}</p>
        </article>
        <article className="ced-unknown">
          <p className="ced-eyebrow">Unknown from this review</p>
          <h2>What would clarify the picture?</h2>
          <ul>
            {i.unknowns.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <p className="ced-small">{i.reviewNote}</p>
        </article>
      </div>
      <section className="ced-section" id="decision-records">
        <SectionTitle
          title="Decisions & milestones"
          text="Authority, expected timing and the evidence behind the current record."
        />
        <div className="ced-decision-list">
          {active.map((d) => (
            <DecisionCard key={d.id} decision={d} asOf={asOf} />
          ))}
        </div>
        {!active.length && (
          <p className="ced-empty">
            No discrete upcoming decision is documented in this entry. Ongoing
            implementation does not mean there are no internal decisions.
          </p>
        )}
        {history.length > 0 && (
          <details className="ced-details">
            <summary>Decision history · {history.length} records</summary>
            {history.map((d) => (
              <DecisionCard key={d.id} decision={d} asOf={asOf} />
            ))}
          </details>
        )}
      </section>
      <section className="ced-section">
        <SectionTitle
          title="Dependencies"
          text="A requirement or coordination link is not necessarily a blocker."
        >
          <Link
            className="ced-button"
            href={`/ced/dependencies?initiative=${i.id}`}
          >
            <Network size={15} />
            Open in the map
          </Link>
        </SectionTitle>
        <div className="ced-gap-grid">
          {i.dependencies.map((d) => (
            <article key={d.target} className="ced-gap-card">
              <div className="ced-card-top">
                <Badge>{d.type}</Badge>
                <Badge>
                  {d.basis === "public-record"
                    ? "Public record"
                    : "PCL synthesis"}
                </Badge>
              </div>
              <h3>
                {initiatives.has(d.target) ? (
                  <InitiativeLink id={d.target} />
                ) : (
                  d.target
                )}
              </h3>
              <p>{d.description}</p>
              <p className="ced-small">
                Status:{" "}
                {d.status === "unknown"
                  ? "Not established in reviewed sources"
                  : d.status}
              </p>
              <SourceLink id={d.source} compact />
            </article>
          ))}
        </div>
      </section>
      <section className="ced-section">
        <SectionTitle
          title="Money"
          text="Financial figures retain their original meaning, period and overlap limits."
        />
        {funding.length ? (
          funding.map((f) => <FundingCard key={f.id} item={f} />)
        ) : (
          <div className="ced-empty">
            No comparable amount has been normalized for this initiative. This
            is an evidence gap, not a zero budget.
          </div>
        )}
        <Link className="ced-text-link" href="/ced/money">
          Inspect the portfolio funding ledger <ArrowUpRight size={15} />
        </Link>
      </section>
      <section className="ced-section">
        <SectionTitle
          title="Intended outcomes"
          text="PCL’s contribution pathways; effects are not causally established by this record."
        />
        {i.outcomes.length ? (
          <div className="ced-outcome-links">
            {i.outcomes.map((o) => (
              <article key={o.id}>
                <h3>
                  <Link href={`/ced/outcomes?outcome=${o.id}`}>
                    {OUTCOMES.find((x) => x.id === o.id)?.name}
                  </Link>
                </h3>
                <div>
                  <Badge>
                    {o.strength === "indirect"
                      ? "Indirect / contextual"
                      : "Plausible contribution"}
                  </Badge>
                  <p>{o.relationship}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>
            The direct purpose of this initiative is not adequately captured by
            CED’s five headline indicators. Its program-level success measures
            are described above.
          </p>
        )}
      </section>
      {i.conflict && <ConflictNotice />}
      <section className="ced-section">
        <SectionTitle
          title="Source ledger"
          text="Current and earlier references remain available. Check the date beside each source."
        />
        <div className="ced-source-ledger">
          {i.sources.map((id) => {
            const s = sources.get(id);
            return s ? (
              <article key={id}>
                <SourceLink id={id} />
                <p>
                  Checked {dateLabel(s.checked)}
                  {s.note && ` · ${s.note}`}
                </p>
              </article>
            ) : null;
          })}
        </div>
      </section>
      <Link
        className="ced-button"
        href={`/contact?topic=CED%20Portfolio%20Map%20correction&project=${encodeURIComponent(i.name)}`}
      >
        Suggest a correction <ArrowUpRight size={16} />
      </Link>
    </>
  );
}
