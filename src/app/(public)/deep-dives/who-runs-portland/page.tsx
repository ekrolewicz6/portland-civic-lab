import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import {
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  GitBranch,
  Hospital,
  Landmark,
  Map,
  Network,
  School,
  ShieldCheck,
  Train,
} from "lucide-react";
import { DIVE_CONTAINER, Eyebrow, H2, Lead } from "@/components/deep-dives/shared";
import { PowerMapInteractive } from "@/components/deep-dives/power-map/PowerMapInteractive";
import { pageMeta } from "@/lib/page-meta";
import {
  governanceActors,
  type GovernanceActor,
  type SourceLink,
} from "@/lib/power-map/data";

export const metadata: Metadata = pageMeta({
  title: "Who Runs Portland?",
  description:
    "A plain-language guide to Portland's overlapping city, county, regional, state, transit, school, health, and special-district governments.",
  path: "/deep-dives/who-runs-portland",
});

const actorIcons: Record<string, ComponentType<{ className?: string }>> = {
  oregon: Landmark,
  "multnomah-county": Building2,
  metro: Network,
  portland: ShieldCheck,
  trimet: Train,
  schools: School,
  "special-districts": GitBranch,
  "health-systems": Hospital,
  "clark-vancouver": Map,
};

const layerOrder = [
  { label: "State", actorId: "oregon", scope: "Law, Medicaid, schools, courts" },
  { label: "Metro", actorId: "metro", scope: "Regional planning, housing money, garbage" },
  { label: "County", actorId: "multnomah-county", scope: "Health, services, jail, elections" },
  { label: "City", actorId: "portland", scope: "Police, fire, streets, permits, utilities" },
  { label: "Special districts", actorId: "special-districts", scope: "Transit, schools, ports, water, venues" },
] as const;

const responsibilityRules = [
  {
    title: "Geography answers where",
    body: "City limits, county lines, school districts, transit districts, and Metro's three-county boundary do not match each other.",
  },
  {
    title: "Law answers who may act",
    body: "The state sets many rules that local governments must follow, from land use to criminal law to Medicaid-funded health systems.",
  },
  {
    title: "Money answers who can scale",
    body: "A large total budget does not mean flexible control. Many dollars are restricted, dedicated, pass-through, or enterprise funds.",
  },
  {
    title: "Operations answer who does the work",
    body: "The agency that gets blamed may not be the contractor, provider, bureau, or district that actually performs the service.",
  },
];

type Tone = "default" | "warm";

const wideSectionTone: Record<Tone, string> = {
  default: "",
  warm: "border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)]",
};

const WIDE_CONTAINER = "mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-10 2xl:px-12";

function WideSection({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = "default",
}: {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <section id={id} className={`py-14 sm:py-16 xl:py-20 ${wideSectionTone[tone]}`}>
      <div className={WIDE_CONTAINER}>
        <div className="mb-8 max-w-4xl sm:mb-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          <H2>{title}</H2>
          {lead ? <Lead className="max-w-3xl">{lead}</Lead> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function SourceLinks({ links }: { links: SourceLink[] }) {
  if (!links.length) {
    return <span className="text-[12px] text-[var(--color-ink-muted)]">Agency-specific materials</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((source) => (
        <a
          key={source.href}
          href={source.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1 text-[12px] font-medium text-[var(--color-canopy)] hover:border-[var(--color-sage)]"
        >
          {source.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

function ActorCard({ actor }: { actor: GovernanceActor }) {
  const Icon = actorIcons[actor.id] ?? Building2;

  return (
    <article className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_8px_28px_rgba(15,36,25,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            {actor.geography}
          </p>
          <h3 className="mt-2 text-[22px] font-semibold leading-tight text-[var(--color-ink)]">
            {actor.layer}
          </h3>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[var(--color-canopy)] text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 rounded-sm bg-[var(--color-paper-warm)] p-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink)]">
          <CircleDollarSign className="h-4 w-4 text-[var(--color-ember)]" />
          {actor.budget}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
          {actor.budgetNote}
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Responsible for
          </h4>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
            {actor.controls.slice(0, 6).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-sage)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Constraints
          </h4>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
            {actor.constraints.slice(0, 5).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-ember)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-parchment)] pt-4">
        <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
          <span className="font-semibold text-[var(--color-ink)]">Governance:</span>{" "}
          {actor.electedOrAppointed}
        </p>
      </div>

      <div className="mt-4">
        <SourceLinks links={actor.sourceLinks} />
      </div>
    </article>
  );
}

function PowerTable() {
  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] text-left text-[13px]">
          <thead className="bg-[var(--color-canopy)] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Layer</th>
              <th className="px-4 py-3 font-semibold">Geography</th>
              <th className="px-4 py-3 font-semibold">Budget signal</th>
              <th className="px-4 py-3 font-semibold">Main responsibilities</th>
              <th className="px-4 py-3 font-semibold">Money sources</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {governanceActors.slice(0, 6).map((actor) => (
              <tr key={actor.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-[var(--color-ink)]">{actor.layer}</td>
                <td className="px-4 py-4 text-[var(--color-ink-light)]">{actor.geography}</td>
                <td className="px-4 py-4 text-[var(--color-ink-light)]">
                  <span className="font-semibold text-[var(--color-canopy)]">{actor.budget}</span>
                  <span className="mt-1 block text-[12px] leading-snug text-[var(--color-ink-muted)]">
                    {actor.budgetNote}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--color-ink-light)]">
                  {actor.controls.slice(0, 5).join(", ")}
                </td>
                <td className="px-4 py-4 text-[var(--color-ink-light)]">
                  {actor.moneySources.slice(0, 5).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LayeredGovernmentDiagram() {
  return (
    <div className="rounded-sm border border-white/15 bg-white/8 p-4 backdrop-blur-sm sm:p-5">
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
        How to read responsibility
      </p>
      <div className="mt-4 space-y-2.5 sm:space-y-3">
        {layerOrder.map((layer, index) => (
          <div
            key={layer.label}
            className="grid gap-2 rounded-sm border border-white/12 bg-white/8 p-3 sm:grid-cols-[72px_1fr] sm:items-center"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/45">
              Layer {index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[18px] font-semibold text-white">{layer.label}</span>
                <span className="max-w-full rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium leading-snug text-white/65">
                  {governanceActors.find((actor) => actor.id === layer.actorId)?.geography}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-white/62">{layer.scope}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-white/65">
        The public often sees one visible issue. The answer is usually a stack of geography, law,
        money, and operations.
      </p>
    </div>
  );
}

function RelationshipRules() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {responsibilityRules.map((rule, index) => (
        <div key={rule.title} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <CheckCircle2 className="h-5 w-5 text-[var(--color-ember)]" />
            <span className="text-[12px] font-mono font-semibold text-[var(--color-ink-muted)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-4 text-[20px] font-semibold leading-tight text-[var(--color-ink)]">
            {rule.title}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            {rule.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function WhoRunsPortlandPage() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] text-white noise-overlay">
        <div className={`relative z-10 ${DIVE_CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
            <span>Portland Civic Lab</span>
            <div className="h-px w-8 bg-[var(--color-ember)]/50" />
            <span>Government responsibility</span>
          </div>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl font-editorial text-[42px] leading-[1.05] tracking-tight sm:text-[60px] lg:text-[74px]">
                Who actually runs Portland?
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[19px]">
                Not one government. Portland is a stack of city, county, regional, state,
                transit, school, health, and special-purpose systems. This guide explains
                what each layer controls, how they relate, and why blame often lands in the
                wrong place.
              </p>
            </div>
            <LayeredGovernmentDiagram />
          </div>
        </div>
      </section>

      <nav className="sticky top-[64px] z-20 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur">
        <div className={`${DIVE_CONTAINER} flex gap-4 overflow-x-auto py-3 text-[13px] font-semibold text-[var(--color-ink-muted)]`}>
          {[
            ["Responsibility test", "#power-map"],
            ["Reference map", "#reference-map"],
            ["Relationship rules", "#relationships"],
            ["Actors", "#actors"],
            ["Sources", "#sources"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="shrink-0 hover:text-[var(--color-canopy)]">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <WideSection
        id="power-map"
        eyebrow="Responsibility test"
        title="Start with a resident question."
        lead="The useful civic move is not asking who sounds responsible. It is asking which layer owns the geography, legal authority, money, and operation needed to solve the problem."
      >
        <PowerMapInteractive />
      </WideSection>

      <WideSection
        id="reference-map"
        eyebrow="Reference map"
        title="The formal layers."
        lead="These are the main governments and quasi-governmental systems people run into in greater Portland. Their boundaries, budgets, and responsibilities overlap."
        tone="warm"
      >
        <PowerTable />
      </WideSection>

      <WideSection
        id="relationships"
        eyebrow="How responsibility splits"
        title="Most civic problems cross at least two layers."
        lead="A street, school, hospital, tax bill, train platform, or housing project can look like one issue to residents while sitting across several legal and budget systems."
        tone="warm"
      >
        <RelationshipRules />
      </WideSection>

      <WideSection
        id="actors"
        eyebrow="Actors"
        title="The main power centers."
        lead="This is a map of offices, agencies, and institutions first. Individual officeholders matter, but the durable civic lesson is what the institution can actually do."
      >
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {governanceActors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      </WideSection>

      <WideSection
        id="sources"
        eyebrow="Sources"
        title="Budget and responsibility claims are sourced."
        lead="Headline budget figures come from official public documents where available. For Metro, this page intentionally avoids a headline dollar figure until the current adopted budget book is pulled directly from Metro."
      >
        <div className="space-y-4">
          {governanceActors.map((actor) => (
            <div key={actor.id} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{actor.layer}</p>
                  <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">{actor.budget}</p>
                </div>
                <SourceLinks links={actor.sourceLinks} />
              </div>
            </div>
          ))}
        </div>
      </WideSection>
    </div>
  );
}
