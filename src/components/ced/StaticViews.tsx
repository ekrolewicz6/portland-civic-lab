import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { COUNCIL_BUDGET_HEARING_ISSUES } from "@/lib/performance/product-layers";
import {
  dateLabel,
  EDITION,
  initiatives,
  portfolio,
  sources,
  stats,
  statusOf,
  upcoming,
} from "@/lib/ced/model";
import {
  Badge,
  ConflictNotice,
  InitiativeLink,
  SectionTitle,
  SourceLink,
} from "./Shared";
import PrintButton from "./PrintButton";
export function Changes() {
  return (
    <>
      <div className="ced-change-intro">
        <strong>August 17 baseline → October 3 edition</strong>
        <p>
          {portfolio.changes.length} recorded changes, with event dates
          separated from the date PCL incorporated them. This is an editorial
          change log; continuous monitoring is not yet established for this
          product.
        </p>
      </div>
      <div className="ced-changes">
        {portfolio.changes.map((c) => (
          <article key={c.id}>
            <div>
              <strong>{dateLabel(c.eventDate)}</strong>
              <small>Incorporated {dateLabel(c.recorded)}</small>
            </div>
            <div>
              <h3>
                <InitiativeLink id={c.initiative} />
              </h3>
              <div className="ced-transition">
                <span>{c.before}</span>
                <ArrowRight size={15} />
                <strong>{c.after}</strong>
              </div>
              <p>{c.significance}</p>
              <SourceLink id={c.source} />
            </div>
          </article>
        ))}
      </div>
      <aside className="ced-disclosure">
        <strong>Coverage changes are separate from government action.</strong>
        <p>
          This edition expands the research from 16 to 28 initiatives. Newly
          mapped projects are not necessarily newly launched. The portfolio
          combines umbrella programs and individual projects, so the count
          should not be read as 28 independent investments.
        </p>
      </aside>
    </>
  );
}
export function Oversight({ asOf }: { asOf: string }) {
  const past = portfolio.decisions.filter(
    (d) => statusOf(d, asOf) === "Past expected date",
  );
  const issues = COUNCIL_BUDGET_HEARING_ISSUES.filter(
    (i) => i.serviceAreaSlug === "community-economic-development",
  );
  return (
    <>
      <div className="ced-oversight-intro">
        <div>
          <p className="ced-eyebrow">Questions the record can’t yet answer</p>
          <h2>Make the missing information actionable.</h2>
          <p>
            Each gap identifies a record that could clarify delivery,
            responsibility or public value. A missing publication does not
            establish misconduct, inactivity or a missed internal deadline.
          </p>
        </div>
        <Link
          className="ced-button"
          href="/contact?topic=CED%20Portfolio%20Map%20correction"
        >
          Provide an update <ArrowUpRight size={16} />
        </Link>
      </div>
      <SectionTitle title="Expected dates needing a fresh record" />
      {past.length ? (
        past.map((d) => (
          <div className="ced-gap" key={d.id}>
            <div>
              <Badge tone="amber">Past expected date</Badge>
              <h3>{d.question}</h3>
              <p>
                <InitiativeLink id={d.initiative} /> ·{" "}
                {dateLabel(d.expected.label)}
              </p>
            </div>
            <Link href={`/ced/decisions?record=${d.id}`}>
              Inspect the evidence →
            </Link>
          </div>
        ))
      ) : (
        <p>No elapsed dated expectations in the current register.</p>
      )}
      <section className="ced-section">
        <SectionTitle
          title="Unanswered, by initiative"
          text="Concrete follow-up questions from the October 3 public-source review."
        />
        <div className="ced-gap-grid">
          {portfolio.initiatives.map((i) => (
            <article className="ced-gap-card" key={i.id}>
              <p className="ced-eyebrow">{i.owner}</p>
              <h3>
                <InitiativeLink id={i.id} />
              </h3>
              {i.unknowns.map((x) => (
                <p key={x}>{x}</p>
              ))}
              <SourceLink id={i.recordSource} compact />
            </article>
          ))}
        </div>
      </section>
      <details className="ced-details">
        <summary>
          Historical Council oversight questions · May 7, 2026 budget hearing
        </summary>
        <p className="ced-small">
          Preserved from the earlier CED research. These are dated hearing
          interpretations, not a claim that the same questions remain unanswered
          today. Current project records above take precedence.
        </p>
        <div className="ced-gap-grid">
          {issues.map((i) => (
            <article className="ced-gap-card" key={i.slug}>
              <Badge>PCL hearing synthesis</Badge>
              <h3>{i.title}</h3>
              <p>{i.hearingRecord}</p>
              <blockquote>{i.question}</blockquote>
              <Link href="/dashboard/performance/council">
                Original Council analysis and source context →
              </Link>
            </article>
          ))}
        </div>
      </details>
      <ConflictNotice />
    </>
  );
}
export function Methodology() {
  const current = portfolio.sources.filter((s) => s.checked === EDITION);
  const historical = portfolio.sources.filter((s) => s.checked !== EDITION);
  return (
    <>
      <div className="ced-method-grid">
        <article>
          <p className="ced-eyebrow">Scope</p>
          <h2>One record, many useful views.</h2>
          <p>
            The portfolio contains selected material initiatives in and around
            Portland’s Community & Economic Development service area. It is a
            public-source demonstration of portfolio coordination, not an
            exhaustive list or an internal City system.
          </p>
          <p>
            Initiatives, decisions, funding entries, dependencies and changes
            have stable identifiers. All screens and exports read the same
            structured record.
          </p>
          <SourceLink id="ced-scope" />
        </article>
        <article>
          <p className="ced-eyebrow">Freshness</p>
          <h2>Checking a source is not confirming delivery.</h2>
          <p>
            Each entry has a last-checked date. A source can still describe an
            old plan. We separately record the event date, expected timing,
            observed date, and evidence of resolution.
          </p>
          <p>
            Timing labels are evaluated when you open the page. A passed date is
            flagged; completion is recorded only with evidence. Broad seasonal
            windows remain broad.
          </p>
        </article>
        <article>
          <p className="ced-eyebrow">Interpretation</p>
          <h2>Three evidence layers.</h2>
          <p>
            <b>Public record:</b> what an agency document or on-record report
            says, with a direct link and source class.
          </p>
          <p>
            <b>PCL synthesis:</b> stage assignment, dependency interpretation
            and possible contribution to outcomes.
          </p>
          <p>
            <b>Unknown:</b> the information not established by the reviewed
            sources.
          </p>
        </article>
        <article>
          <p className="ced-eyebrow">Money & outcomes</p>
          <h2>No false precision.</h2>
          <p>
            Allocations, authorizations, program envelopes, proposals and
            estimates are separate. Overlap is explicit. The ledger is partial
            and is deliberately not summed across unlike or overlapping amounts.
          </p>
          <p>
            Outcome links are contribution hypotheses. Neither a grant award nor
            an activity count establishes a causal effect on affordability,
            emissions or GDP.
          </p>
        </article>
      </div>
      <section className="ced-section">
        <SectionTitle title="How the record is maintained" />
        <ol className="ced-method-steps">
          <li>
            <b>Check the primary record.</b> Read agency project pages, adopted
            legislation, agendas and procurement notices. Preserve source access
            failures.
          </li>
          <li>
            <b>Reconcile the transition.</b> Compare the source with the
            existing decision. Distinguish a recommendation, approval, funding
            commitment and delivery.
          </li>
          <li>
            <b>Preserve history.</b> Add the resolution source, event date and
            observed date. Keep superseded expectations and connect them to
            their replacement.
          </li>
          <li>
            <b>Publish a reviewed edition.</b> Validate references and dates,
            check the rendered views and document meaningful changes. This
            release has no autonomous publishing or sending behavior.
          </li>
        </ol>
        <div className="ced-actions">
          <a
            download
            className="ced-button primary"
            href="/ced/export?format=json"
          >
            <Download size={15} />
            Full structured record
          </a>
          <a download className="ced-button" href="/ced/export?format=csv">
            <Download size={15} />
            Decision register CSV
          </a>
        </div>
      </section>
      <section className="ced-section">
        <SectionTitle
          title="Source ledger"
          text={`${current.length} source entries checked for this edition; ${historical.length} historical references retained from the earlier research. Source entries may refer to the same document in different research contexts.`}
        />
        <div className="ced-source-ledger">
          {current.map((s) => (
            <article key={s.id} id={s.id}>
              <SourceLink id={s.id} />
              <p>
                Checked {dateLabel(s.checked)}
                {s.note && ` · ${s.note}`}
              </p>
            </article>
          ))}
        </div>
        <details className="ced-details">
          <summary>Earlier research references · August 17, 2026</summary>
          <div className="ced-source-ledger">
            {historical.map((s) => (
              <article key={s.id}>
                <SourceLink id={s.id} />
                <p>
                  Last recorded check: {dateLabel(s.checked)}. Not reverified in
                  this edition unless separately listed above.
                </p>
              </article>
            ))}
          </div>
        </details>
      </section>
      <ConflictNotice />
    </>
  );
}
export function Briefing({ asOf }: { asOf: string }) {
  const s = stats(asOf);
  const next = upcoming(asOf);
  return (
    <>
      <div className="ced-toolbar">
        <p className="ced-small">
          Prepared from the {dateLabel(EDITION)} source edition. Timing
          evaluated {dateLabel(asOf)}.
        </p>
        <PrintButton />
      </div>
      <section className="ced-brief-lede">
        <h2>The work between strategy and outcomes</h2>
        <p>
          CED’s five outcome indicators describe the results Portland wants.
          This map connects those indicators to selected initiatives, public
          decisions, delivery dependencies and financial records.
        </p>
        <div className="ced-brief-stats">
          <span>
            <b>{s.initiatives}</b> initiatives
          </span>
          <span>
            <b>{s.decisions}</b> unresolved decisions
          </span>
          <span>
            <b>{s.upcoming}</b> dated events in 60 days
          </span>
          <span>
            <b>{s.past}</b> elapsed expectations
          </span>
        </div>
      </section>
      <section className="ced-section">
        <SectionTitle title="Three things to examine together" />
        <div className="ced-demo-steps">
          <article>
            <span>01</span>
            <h3>
              <Link href="/ced">The portfolio</Link>
            </h3>
            <p>
              Is this a useful representation of the work? Which important
              initiative, owner or decision is missing?
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>
              <Link href="/ced/dependencies">The dependencies</Link>
            </h3>
            <p>
              Open Broadway Corridor. Check how infrastructure, housing finance,
              development approvals and private financing fit together.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>
              <Link href="/ced/changes">The changing record</Link>
            </h3>
            <p>
              Compare what was pending with what is now authorized. Which
              updates would make a recurring management review easier?
            </p>
          </article>
        </div>
      </section>
      <section className="ced-section">
        <SectionTitle title="Upcoming in the reviewed record" />
        <div className="ced-compact-list">
          {next.map((d) => (
            <Link key={d.id} href={`/ced/decisions?record=${d.id}`}>
              <span>
                <strong>{d.question}</strong>
                <small>
                  {initiatives.get(d.initiative)?.name} · {d.kind}
                </small>
              </span>
              <span>{dateLabel(d.expected.label)}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="ced-section">
        <SectionTitle title="Confirmed transitions" />
        {portfolio.changes
          .filter((c) =>
            [
              "psu-adopted",
              "albina-adopted",
              "p5-rfp-issued",
              "hps-report",
            ].includes(c.id),
          )
          .map((c) => (
            <article className="ced-brief-change" key={c.id}>
              <h3>
                {dateLabel(c.eventDate)} · {initiatives.get(c.initiative)?.name}
              </h3>
              <p>
                {c.before} → <strong>{c.after}</strong>. {c.significance}
              </p>
              <SourceLink id={c.source} />
            </article>
          ))}
      </section>
      <aside className="ced-disclosure">
        <h3>The central question</h3>
        <p className="ced-brief-question">
          “How closely does this match the way you actually have to think about
          the portfolio—and where is it wrong?”
        </p>
        <p>
          This demonstration makes no procurement or partnership claim. A
          maintained service would need a defined scope, agreed source access,
          independent evaluation and the appropriate procurement process.
        </p>
        <Link href="/institutions">
          Service approach, published pricing and contracting rules →
        </Link>
      </aside>
      <ConflictNotice />
    </>
  );
}
