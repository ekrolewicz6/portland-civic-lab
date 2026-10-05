import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  dateLabel,
  initiatives,
  sources,
  statusOf,
  statusExplanation,
} from "@/lib/ced/model";
import type { Decision, Initiative } from "@/lib/ced/types";
export function SourceLink({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const s = sources.get(id);
  if (!s) return null;
  return (
    <a className="ced-source" href={s.url} target="_blank" rel="noreferrer">
      <span className={`ced-source-type ${s.kind}`}>
        {s.kind === "primary" ? "Primary" : "Reported"}
      </span>
      {compact ? "Source record" : s.label}
      <ArrowUpRight size={13} />
    </a>
  );
}
export function InitiativeLink({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href={`/ced/initiatives/${id}`}>
      {children ?? initiatives.get(id)?.name ?? id}
    </Link>
  );
}
export function Badge({
  children,
  tone = "",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`ced-badge ${tone}`}>{children}</span>;
}
export function DecisionCard({
  decision: d,
  asOf,
}: {
  decision: Decision;
  asOf: string;
}) {
  const status = statusOf(d, asOf);
  const history = d.state !== "unresolved";
  return (
    <article className="ced-decision" id={d.id}>
      <div className="ced-decision-time">
        <Badge
          tone={
            history ? "green" : status === "Past expected date" ? "amber" : ""
          }
        >
          {status}
        </Badge>
        <strong>{dateLabel(d.expected.label)}</strong>
        <span>{d.kind === "decision" ? "Decision" : "Milestone"}</span>
      </div>
      <div>
        <p className="ced-eyebrow">
          <InitiativeLink id={d.initiative} />
        </p>
        <h3>{d.question}</h3>
        <p className="ced-small">{d.authority}</p>
        <p className="ced-small ced-muted">{statusExplanation(d, asOf)}</p>
        {d.successor && (
          <Link
            className="ced-text-link"
            href={`/ced/decisions?record=${d.successor}`}
          >
            See replacement record <ArrowRight size={14} />
          </Link>
        )}
        <div className="ced-record-dates">
          Observed {dateLabel(d.observed)} · Checked {dateLabel(d.checked)}
          {d.resolution && (
            <>
              {" "}
              · {d.state === "resolved" ? "Resolved" : "Superseded"}{" "}
              {dateLabel(d.resolution.date)}
            </>
          )}
        </div>
        <SourceLink id={d.resolution?.source ?? d.source} compact />
      </div>
    </article>
  );
}
export function InitiativeCard({ item: i }: { item: Initiative }) {
  return (
    <article className="ced-initiative-card" id={i.id}>
      <div className="ced-card-top">
        <span className="ced-eyebrow">{i.domain}</span>
        <Badge>{i.stage}</Badge>
      </div>
      <h3>
        <InitiativeLink id={i.id} />
      </h3>
      <p>{i.objective}</p>
      <div className="ced-card-owner">{i.owner}</div>
      {i.progress && <div className="ced-progress">{i.progress}</div>}
      <div className="ced-card-next">
        <span className="ced-eyebrow">Next in the record</span>
        <strong>{i.next.label}</strong>
        <span>{dateLabel(i.next.expected.label)}</span>
      </div>
      <div className="ced-card-bottom">
        <span>Checked {dateLabel(i.checked)}</span>
        <InitiativeLink id={i.id}>
          View initiative <ArrowRight size={15} />
        </InitiativeLink>
      </div>
    </article>
  );
}
export function ConflictNotice() {
  return (
    <aside className="ced-disclosure">
      <strong>Conflict disclosure</strong>
      <p>
        Portland Civic Lab also operates Rip City Not Rip Off, a public project
        analyzing the arena agreement. PCL does not offer paid advisory work to
        the City, Trail Blazers, or financially interested parties on the live
        Moda Center negotiation. These portfolio entries use public sources
        only.
      </p>
      <Link href="/independence">Read our independence policy →</Link>
    </aside>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="ced-section-title">
      <div>
        {eyebrow && <p className="ced-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}
