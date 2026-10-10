"use client";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  dateLabel,
  dependencyGroups,
  initiatives,
  isActive,
  MONEY_LABELS,
  money,
  OUTCOMES,
  portfolio,
  statusOf,
  upcoming,
} from "@/lib/ced/model";
import {
  Badge,
  DecisionCard,
  InitiativeCard,
  InitiativeLink,
  SectionTitle,
  SourceLink,
} from "./Shared";
import type { Decision, Funding } from "@/lib/ced/types";
function useFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  function set(key: string, value: string, defaultValue = "all") {
    const p = new URLSearchParams(params.toString());
    if (value && value !== defaultValue) p.set(key, value);
    else p.delete(key);
    router.replace(`${path}${p.size ? "?" + p.toString() : ""}`, {
      scroll: false,
    });
  }
  return { params, set, clear: () => router.replace(path, { scroll: false }) };
}
const domains = [...new Set(portfolio.initiatives.map((i) => i.domain))];
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="ced-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function SearchBox({
  initial,
  onSearch,
}: {
  initial: string;
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form
      className="ced-search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
    >
      <Search size={18} />
      <input
        aria-label="Search the portfolio"
        type="search"
        placeholder="Search projects, owners or decisions…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
export function InitiativesExplorer() {
  const { params, set, clear } = useFilters();
  const q = params.get("q") ?? "";
  const domain = params.get("domain") ?? "all";
  const stage = params.get("stage") ?? "all";
  const outcome = params.get("outcome");
  const owner = params.get("owner") ?? "all";
  const visible = portfolio.initiatives.filter(
    (i) =>
      (domain === "all" || i.domain === domain) &&
      (stage === "all" || i.stage === stage) &&
      (owner === "all" || i.owner === owner) &&
      (!outcome || i.outcomes.some((o) => o.id === outcome)) &&
      `${i.name} ${i.owner} ${i.partners.join(" ")} ${i.summary}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="ced-filter-bar">
        <SearchBox key={q} initial={q} onSearch={(v) => set("q", v)} />
        <Select
          label="Domains"
          value={domain}
          onChange={(v) => set("domain", v)}
          options={domains}
        />
        <Select
          label="Stages"
          value={stage}
          onChange={(v) => set("stage", v)}
          options={[
            "Discovery",
            "Planning",
            "Decision",
            "Procurement",
            "Delivery",
            "Operating",
          ]}
        />
        <Select
          label="Owners"
          value={owner}
          onChange={(v) => set("owner", v)}
          options={[...new Set(portfolio.initiatives.map((i) => i.owner))]}
        />
      </div>
      <div className="ced-results-line">
        <span aria-live="polite">
          {visible.length} of {portfolio.initiatives.length} initiatives
          {outcome &&
            ` · ${OUTCOMES.find((o) => o.id === outcome)?.name ?? outcome}`}
        </span>
        {params.size > 0 && (
          <button onClick={clear}>
            <X size={14} />
            Clear filters
          </button>
        )}
        <a download href="/ced/export?format=json">
          <Download size={14} />
          Download data
        </a>
      </div>
      <div className="ced-initiative-grid">
        {visible.map((i) => (
          <InitiativeCard key={i.id} item={i} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="ced-empty">
          <h3>No initiatives match these filters.</h3>
          <button className="ced-button" onClick={clear}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
export function DecisionsExplorer({ asOf }: { asOf: string }) {
  const { params, set, clear } = useFilters();
  const history = params.get("view") === "history";
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const kind = params.get("kind") ?? "all";
  const specific = params.get("record");
  const imprecise = params.get("timing") === "imprecise";
  const base = portfolio.decisions.filter((d) =>
    history ? !isActive(d) : isActive(d),
  );
  const rows = (
    specific ? portfolio.decisions.filter((d) => d.id === specific) : base
  )
    .filter(
      (d) =>
        (status === "all" || statusOf(d, asOf) === status) &&
        (kind === "all" || d.kind === kind) &&
        (!imprecise || !d.expected.start) &&
        `${d.question} ${d.authority} ${initiatives.get(d.initiative)?.name}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      history
        ? (b.resolution?.date ?? "").localeCompare(a.resolution?.date ?? "")
        : (a.expected.start ?? "9999").localeCompare(
            b.expected.start ?? "9999",
          ),
    );
  return (
    <>
      <div className="ced-toolbar">
        <div className="ced-segment">
          <Link
            aria-current={!history && !specific ? "page" : undefined}
            href="/ced/decisions"
          >
            Unresolved <b>{portfolio.decisions.filter(isActive).length}</b>
          </Link>
          <Link
            aria-current={history ? "page" : undefined}
            href="/ced/decisions?view=history"
          >
            Decision history{" "}
            <b>{portfolio.decisions.filter((d) => !isActive(d)).length}</b>
          </Link>
        </div>
        <a download className="ced-button" href="/ced/export?format=csv">
          <Download size={15} />
          Download register
        </a>
      </div>
      <div className="ced-filter-bar">
        <SearchBox key={q} initial={q} onSearch={(v) => set("q", v)} />
        <Select
          label="Statuses"
          value={status}
          onChange={(v) => set("status", v)}
          options={
            history
              ? ["Resolved", "Superseded"]
              : [
                  "Upcoming",
                  "Due",
                  "Past expected date",
                  "No public date found",
                ]
          }
        />
        <Select
          label="Types"
          value={kind}
          onChange={(v) => set("kind", v)}
          options={["decision", "milestone"]}
        />
      </div>
      <div className="ced-results-line">
        <span aria-live="polite">
          {rows.length} records · clock evaluated {dateLabel(asOf)} · evidence
          checked separately
        </span>
        {params.size > 0 && <button onClick={clear}>Clear filters</button>}
      </div>
      <div className="ced-decision-list">
        {rows.map((d) => (
          <DecisionCard key={d.id} decision={d} asOf={asOf} />
        ))}
      </div>
      {!rows.length && (
        <p className="ced-empty">
          No records match. <button onClick={clear}>Clear filters</button>
        </p>
      )}
      <p className="ced-small ced-muted">
        The queue includes both decisions and milestones, clearly labeled.
        Resolved or superseded records stay in history. Passing a date only
        changes its timing label; it never marks an action complete.
      </p>
    </>
  );
}
export function TimelineExplorer({ asOf }: { asOf: string }) {
  const { params, set } = useFilters();
  const horizon = params.get("horizon") ?? "60";
  const type = params.get("type") ?? "all";
  const domain = params.get("domain") ?? "all";
  const inDomain = (d: Decision) =>
    domain === "all" || initiatives.get(d.initiative)?.domain === domain;
  const active = portfolio.decisions.filter(isActive);
  const windowed =
    horizon === "all"
      ? active.filter((d) => d.expected.start)
      : upcoming(asOf, Number(horizon));
  const rows = windowed
    .filter((d) => (type === "all" || d.kind === type) && inDomain(d))
    .sort((a, b) => a.expected.start!.localeCompare(b.expected.start!));
  const groups = new Map<string, Decision[]>();
  rows.forEach((d) => {
    const month = d.expected.start!.slice(0, 7);
    groups.set(month, [...(groups.get(month) ?? []), d]);
  });
  const undated = active.filter(
    (d) =>
      !d.expected.start && (type === "all" || d.kind === type) && inDomain(d),
  );
  return (
    <>
      <div className="ced-toolbar">
        <div className="ced-segment">
          {[
            ["60", "Next 60 days"],
            ["180", "Next 6 months"],
            ["all", "All dates"],
          ].map(([v, l]) => (
            <button
              key={v}
              aria-pressed={horizon === v}
              onClick={() => set("horizon", v, "60")}
            >
              {l}
            </button>
          ))}
        </div>
        <Select
          label="Domains"
          value={domain}
          onChange={(v) => set("domain", v)}
          options={domains}
        />
        <Select
          label="Types"
          value={type}
          onChange={(v) => set("type", v)}
          options={["decision", "milestone"]}
        />
      </div>
      <p className="ced-small ced-muted">
        Today: {dateLabel(asOf)}. Days are exact only when the source gives a
        day. Quarters, years and tentative windows retain their original
        precision.
      </p>
      <div className="ced-timeline">
        {[...groups].map(([month, events]) => (
          <section key={month}>
            <div className="ced-month">
              <span />
              {dateLabel(month)}
            </div>
            <div>
              {events.map((d) => (
                <div className="ced-timeline-event" key={d.id}>
                  <span className="ced-timeline-date">
                    {dateLabel(d.expected.label)}
                    <Badge>{d.kind}</Badge>
                  </span>
                  <div>
                    <h3>
                      <Link href={`/ced/decisions?record=${d.id}`}>
                        {d.question}
                      </Link>
                    </h3>
                    <p>
                      <InitiativeLink id={d.initiative} /> · {d.authority}
                    </p>
                    <Badge
                      tone={
                        statusOf(d, asOf) === "Past expected date"
                          ? "amber"
                          : ""
                      }
                    >
                      {statusOf(d, asOf)}
                    </Badge>
                    <SourceLink id={d.source} compact />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {!rows.length && (
        <p className="ced-empty">No dated records in this window.</p>
      )}
      <details className="ced-details">
        <summary>
          {undated.length} records with tentative timing or no public date
        </summary>
        <div className="ced-compact-list">
          {undated.map((d) => (
            <Link key={d.id} href={`/ced/decisions?record=${d.id}`}>
              <span>
                <strong>{d.question}</strong>
                <small>{initiatives.get(d.initiative)?.name}</small>
              </span>
              <span>{d.expected.label}</span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </details>
    </>
  );
}
export function DependencyExplorer() {
  const { params, set } = useFilters();
  const requested =
    initiatives.get(params.get("initiative") ?? "") ??
    initiatives.get("broadway-corridor-usps-redevelopment")!;
  const target = params.get("dependency") ?? "";
  const groups = useMemo(() => dependencyGroups(), []);
  const linked = portfolio.initiatives.filter((i) =>
    i.dependencies.some((d) => d.target === target),
  );
  const list = target ? linked : portfolio.initiatives;
  const selected =
    target && !requested.dependencies.some((d) => d.target === target)
      ? (linked[0] ?? requested)
      : requested;
  return (
    <>
      <div className="ced-map-toolbar">
        <p>
          <span className="ced-line-key" />
          Documented connection <span className="ced-line-key dashed" />
          PCL synthesis
        </p>
        <Link href="/ced/methodology">How to read this map →</Link>
      </div>
      <div className="ced-map-layout">
        <aside className="ced-map-list">
          <div className="ced-map-list-head">
            <strong>
              {target
                ? `Uses ${initiatives.get(target)?.name ?? target}`
                : "Choose an initiative"}
            </strong>
            {target && (
              <button
                aria-label="Clear dependency filter"
                onClick={() => set("dependency", "")}
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div>
            {list.map((i) => (
              <button
                key={i.id}
                aria-pressed={i.id === selected.id}
                onClick={() => set("initiative", i.id)}
              >
                <span>{i.name}</span>
                <small>{i.dependencies.length} connections</small>
              </button>
            ))}
          </div>
        </aside>
        <div className="ced-graph">
          <div className="ced-graph-label">
            Initiative → dependency
            <br />
            <span>
              Click a dependency to find the other work connected to it.
            </span>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 700 500"
            preserveAspectRatio="none"
          >
            {selected.dependencies.map((d, n) => {
              const y = 80 + (n + 0.5) * (360 / selected.dependencies.length);
              return (
                <path
                  key={d.target}
                  d={`M 225 260 C 320 260, 355 ${y}, 445 ${y}`}
                  className={d.basis === "pcl-synthesis" ? "synthesis" : ""}
                />
              );
            })}
          </svg>
          <div className="ced-graph-root">
            <span className="ced-eyebrow">{selected.owner}</span>
            <strong>{selected.name}</strong>
            <Badge>{selected.stage}</Badge>
          </div>
          {selected.dependencies.map((d, n) => (
            <button
              className={`ced-graph-node ${target === d.target ? "selected" : ""}`}
              style={{
                top: `${(80 + (n + 0.5) * (360 / selected.dependencies.length)) / 5}%`,
              }}
              key={d.target}
              onClick={() =>
                set("dependency", target === d.target ? "" : d.target)
              }
              aria-pressed={target === d.target}
            >
              <span className="ced-eyebrow">{d.type}</span>
              <strong>{initiatives.get(d.target)?.name ?? d.target}</strong>
              <span>
                {groups.find((g) => g.target === d.target)?.items.length ?? 0}{" "}
                linked initiatives <ArrowUpRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="ced-map-detail">
        <div>
          <p className="ced-eyebrow">Selected initiative</p>
          <h2>
            <InitiativeLink id={selected.id} />
          </h2>
          <p>{selected.analysis}</p>
          <Link className="ced-button" href={`/ced/initiatives/${selected.id}`}>
            Open the initiative <ArrowRight size={16} />
          </Link>
        </div>
        <div>
          {selected.dependencies
            .filter((d) => !target || d.target === target)
            .map((d) => (
              <article key={d.target}>
                <div className="ced-card-top">
                  <h3>{initiatives.get(d.target)?.name ?? d.target}</h3>
                  <Badge>
                    {d.basis === "public-record"
                      ? "Public record"
                      : "PCL synthesis"}
                  </Badge>
                </div>
                <p>{d.description}</p>
                <p className="ced-small">
                  Dependency status:{" "}
                  {d.status === "unknown"
                    ? "Not established in the reviewed record"
                    : d.status}
                </p>
                <SourceLink id={d.source} compact />
              </article>
            ))}
          {target &&
            !selected.dependencies.some((d) => d.target === target) && (
              <p>
                Select an initiative in the filtered list to inspect its
                connection.
              </p>
            )}
        </div>
      </div>
      <section className="ced-section">
        <SectionTitle
          title="Connections that recur"
          text="How many mapped initiatives involve each institution or requirement. A frequent dependency is not evidence of a bottleneck, and these counts do not measure staff workload."
        />
        <div className="ced-dependency-bars">
          {groups.slice(0, 12).map((g) => (
            <button
              key={g.target}
              aria-pressed={target === g.target}
              onClick={() => {
                set("dependency", target === g.target ? "" : g.target);
                window.scrollTo({ top: 180, behavior: "auto" });
              }}
            >
              <span>{initiatives.get(g.target)?.name ?? g.target}</span>
              <div>
                <i
                  style={{
                    width: `${(g.items.length / groups[0].items.length) * 100}%`,
                  }}
                />
              </div>
              <strong>{g.items.length}</strong>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
export function MoneyExplorer() {
  const { params, set } = useFilters();
  const type = params.get("type") ?? "all";
  const rows = portfolio.funding.filter(
    (f) => type === "all" || f.type === type,
  );
  return (
    <>
      <div className="ced-money-rule">
        <strong>Different kinds of dollars. No misleading grand total.</strong>
        <p>
          Program envelopes contain grants; grants may fund projects listed
          elsewhere. Estimates and proposed contributions are not committed
          public capital. The entries below retain their source, period and
          overlap notes.
        </p>
      </div>
      <div className="ced-toolbar">
        <div className="ced-pills">
          <button
            aria-pressed={type === "all"}
            onClick={() => set("type", "all")}
          >
            All records
          </button>
          {Object.entries(MONEY_LABELS).map(([v, l]) => (
            <button
              key={v}
              aria-pressed={type === v}
              onClick={() => set("type", v)}
            >
              {l}
            </button>
          ))}
        </div>
        <a download href="/ced/export?format=json" className="ced-text-link">
          <Download size={15} />
          Data export
        </a>
      </div>
      <div className="ced-funding-list">
        {rows.map((f) => (
          <FundingCard key={f.id} item={f} />
        ))}
      </div>
      <p className="ced-small ced-muted">
        {rows.length} selected financial records. This is a partial funding
        ledger, not the CED budget. Unlisted amounts are unknown here, not zero.
      </p>
    </>
  );
}
export function FundingCard({ item: f }: { item: Funding }) {
  return (
    <article className="ced-funding">
      <div>
        <span className="ced-eyebrow">{MONEY_LABELS[f.type]}</span>
        <strong className="ced-money">{money(f.amount)}</strong>
        <span>{f.payer} resources</span>
      </div>
      <div>
        <p className="ced-eyebrow">
          <InitiativeLink id={f.initiative} />
        </p>
        <h3>{f.label}</h3>
        <p>{f.status}</p>
        <p className="ced-small">Period: {f.period}</p>
        <p className="ced-overlap">
          <SlidersHorizontal size={14} />
          {f.overlap}
        </p>
        <SourceLink id={f.source} />
      </div>
    </article>
  );
}
export function OutcomesExplorer() {
  const { params, set } = useFilters();
  const selected =
    OUTCOMES.find((o) => o.id === params.get("outcome")) ?? OUTCOMES[0];
  const linked = portfolio.initiatives.filter((i) =>
    i.outcomes.some((o) => o.id === selected.id),
  );
  return (
    <>
      <div className="ced-outcome-tabs">
        {OUTCOMES.map((o, n) => (
          <button
            key={o.id}
            aria-pressed={selected.id === o.id}
            onClick={() => set("outcome", o.id)}
          >
            <span>0{n + 1}</span>
            <strong>{o.name}</strong>
            <b>
              {
                portfolio.initiatives.filter((i) =>
                  i.outcomes.some((l) => l.id === o.id),
                ).length
              }
            </b>
          </button>
        ))}
      </div>
      <div className="ced-outcome-heading">
        <div>
          <p className="ced-eyebrow">CED’s official indicator</p>
          <h2>{selected.indicator}</h2>
          <p>{selected.explanation}</p>
          <SourceLink id="ced-kpis" />
        </div>
        <aside>
          <p className="ced-eyebrow">Follow the measurement</p>
          <p>
            Use the official series and its period to assess outcomes. This map
            shows the work that may contribute.
          </p>
          <Link
            className="ced-text-link"
            href={`/dashboard/performance/${selected.measureId}`}
          >
            Open the indicator record <ArrowUpRight size={15} />
          </Link>
          {selected.id === "housing-costs" && (
            <p className="ced-small">
              Definition note: CED’s framework says <b>less than 30%</b>; the
              existing performance series reports <b>more than 30%</b>. We
              retain that difference and do not silently invert the value.
            </p>
          )}
        </aside>
      </div>
      <SectionTitle
        title={`${linked.length} initiatives with a possible contribution`}
        text="All connections below are PCL synthesis grounded in the cited program descriptions. No project-level causal effect has been established by this map."
      />
      <div className="ced-outcome-links">
        {linked.map((i) => {
          const o = i.outcomes.find((o) => o.id === selected.id)!;
          return (
            <article key={i.id}>
              <div>
                <h3>
                  <InitiativeLink id={i.id} />
                </h3>
                <span>{i.owner}</span>
              </div>
              <div>
                <Badge>
                  {o.strength === "indirect"
                    ? "Indirect / contextual"
                    : "Plausible contribution"}
                </Badge>
                <p>{o.relationship}</p>
                <SourceLink id={o.source} compact />
              </div>
            </article>
          );
        })}
      </div>
      <aside className="ced-disclosure">
        <h3>Some public purposes need their own measures.</h3>
        <p>
          Children’s services and equitable arts access are not well represented
          by these five economic, housing and climate indicators. They remain in
          the portfolio with direct program outcomes; the map does not force
          them into GDP or jobs.
        </p>
        {portfolio.initiatives
          .filter((i) => i.outcomes.length === 0)
          .map((i) => (
            <p key={i.id}>
              <InitiativeLink id={i.id} /> — {i.success}
            </p>
          ))}
      </aside>
    </>
  );
}
