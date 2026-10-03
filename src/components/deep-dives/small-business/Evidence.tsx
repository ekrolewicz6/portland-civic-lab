import type { ReactNode } from "react";
import evidence from "@/data/small-business/evidence.json";

export function Source({ id, children }: { id: string; children?: ReactNode }) {
  const source = evidence.sources.find((s) => s.id === id);
  return source ? (
    <a
      href={source.url}
      title={`${source.publisher}: ${source.title}`}
      target="_blank"
      rel="noreferrer"
    >
      {children || source.title} ↗
    </a>
  ) : (
    <span>{children || id}</span>
  );
}
export function Figure({
  number,
  title,
  subtitle,
  children,
  note,
  sources,
  download,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  note: ReactNode;
  sources: string[];
  download?: string;
}) {
  return (
    <figure className="sb-figure">
      <div className="sb-figure-heading">
        <span className="sb-eyebrow">Figure {number}</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {children}
      <figcaption>
        <span>{note}</span>
        <span className="sb-figure-links">
          {sources.map((id) => (
            <Source key={id} id={id} />
          ))}
          {download && (
            <a href={`/data/small-business/${download}`} download>
              Download data ↓
            </a>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
export function Chapter({
  id,
  number,
  label,
  title,
  intro,
  children,
  dark = false,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section id={id} className={`sb-chapter ${dark ? "sb-dark" : ""}`}>
      <div className="sb-wrap">
        <header className="sb-chapter-heading">
          <span className="sb-chapter-number">{number}</span>
          <div>
            <p className="sb-eyebrow">{label}</p>
            <h2>{title}</h2>
            <div className="sb-intro">{intro}</div>
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
export function Note({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="sb-note">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
