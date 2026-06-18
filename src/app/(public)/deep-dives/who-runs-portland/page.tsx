import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
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
  Users,
  Waypoints,
} from "lucide-react";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import { PowerMapInteractive } from "@/components/deep-dives/power-map/PowerMapInteractive";
import { pageMeta } from "@/lib/page-meta";
import {
  governanceActors,
  streetToStabilityCohorts,
  type GovernanceActor,
  type SourceLink,
} from "@/lib/power-map/data";

export const metadata: Metadata = pageMeta({
  title: "Who Runs Portland?",
  description:
    "A plain-language map of Portland's overlapping governments, budgets, and homelessness levers - and the Street-to-Stability command system Civic Lab is building first.",
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
            Controls
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
            Homelessness / housing levers
          </h4>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-[var(--color-ink-light)]">
            {actor.homelessnessHousingLevers.slice(0, 5).map((item) => (
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
              <th className="px-4 py-3 font-semibold">Scope</th>
              <th className="px-4 py-3 font-semibold">Budget signal</th>
              <th className="px-4 py-3 font-semibold">What they control</th>
              <th className="px-4 py-3 font-semibold">Why it matters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-parchment)]">
            {governanceActors.slice(0, 5).map((actor) => (
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
                  {actor.controls.slice(0, 4).join(", ")}
                </td>
                <td className="px-4 py-4 text-[var(--color-ink-light)]">
                  {actor.homelessnessHousingLevers.slice(0, 4).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeroPowerGlyph() {
  const nodes = [
    { label: "City", detail: "visible streets", style: { left: "6%", top: "20%" } },
    { label: "County", detail: "services", style: { right: "7%", top: "18%" } },
    { label: "Metro", detail: "regional money", style: { left: "2%", bottom: "16%" } },
    { label: "State", detail: "law + Medicaid", style: { right: "4%", bottom: "17%" } },
    { label: "TriMet", detail: "corridors", style: { left: "36%", top: "1%" } },
    { label: "Hospitals", detail: "discharge", style: { left: "35%", bottom: "0" } },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
      <div className="relative h-[285px]">
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-white/10" />
        <div className="absolute left-1/2 top-[9%] h-[82%] w-px bg-white/10" />
        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-ember)]/60 bg-[var(--color-canopy)] text-center shadow-[0_0_60px_rgba(207,138,82,0.18)]">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
              One problem
            </p>
            <p className="mt-1 text-[20px] font-semibold leading-none text-white">many owners</p>
          </div>
        </div>
        {nodes.map((node) => (
          <div
            key={node.label}
            className="absolute max-w-[140px] rounded-sm border border-white/15 bg-white/10 px-3 py-2"
            style={node.style}
          >
            <p className="text-[14px] font-semibold text-white">{node.label}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-white/55">{node.detail}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4">
        <p className="text-[12px] leading-relaxed text-white/65">
          Civic failure is often not the absence of power. It is power split into pieces that do
          not share a live operating picture.
        </p>
      </div>
    </div>
  );
}

function RelationshipDiagram() {
  const steps = [
    {
      label: "Visible crisis",
      title: "Street, park, transit, business district",
      body: "The public sees the problem in city space, so City Hall gets most of the blame.",
    },
    {
      label: "Service authority",
      title: "County and provider network",
      body: "Shelter, behavioral health, jail release, and many outreach contracts often sit with the county and its providers.",
    },
    {
      label: "Regional money",
      title: "Metro SHS and housing funds",
      body: "Regional dollars and land-use choices shape what counties and cities can actually scale.",
    },
    {
      label: "Legal and health frame",
      title: "Oregon law, OHA, Medicaid",
      body: "The state sets the rules and payment machinery for treatment, Medicaid, licensing, courts, and housing law.",
    },
    {
      label: "Operational handoff",
      title: "Hospitals, courts, outreach, transit",
      body: "The person moves through systems that do not share one live workflow.",
    },
    {
      label: "Missing layer",
      title: "Street-to-Stability command center",
      body: "Civic Lab's wedge is the shared routing and accountability layer between all of them.",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="relative rounded-sm border border-[var(--color-parchment)] bg-white p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
              {step.label}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-paper-warm)] text-[12px] font-bold text-[var(--color-canopy)]">
              {index + 1}
            </span>
          </div>
          <h3 className="mt-3 text-[18px] font-semibold leading-tight text-[var(--color-ink)]">
            {step.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">{step.body}</p>
        </div>
      ))}
    </div>
  );
}

function CohortMatrix() {
  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
      <div className="grid border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 md:grid-cols-[1.1fr_1.4fr_1fr_1fr] gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
        <div>Cohort</div>
        <div>First placement</div>
        <div>Responsible owners</div>
        <div>Metrics</div>
      </div>
      <div className="divide-y divide-[var(--color-parchment)]">
        {streetToStabilityCohorts.map((cohort) => (
          <div key={cohort.cohort} className="grid gap-3 p-4 text-[13px] md:grid-cols-[1.1fr_1.4fr_1fr_1fr]">
            <div>
              <p className="font-semibold leading-tight text-[var(--color-ink)]">{cohort.cohort}</p>
              <p className="mt-1 text-[12px] text-[var(--color-ember)]">{cohort.deadline}</p>
            </div>
            <p className="leading-relaxed text-[var(--color-ink-light)]">{cohort.firstPlacement}</p>
            <p className="leading-relaxed text-[var(--color-ink-light)]">
              {cohort.responsibleGovernments.join(", ")}
            </p>
            <p className="leading-relaxed text-[var(--color-ink-light)]">{cohort.metrics.slice(0, 3).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhoRunsPortlandPage() {
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] text-white noise-overlay">
        <div className={`relative z-10 ${DIVE_CONTAINER} py-16 sm:py-20 lg:py-24`}>
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
            <span>Portland Civic Lab</span>
            <div className="h-px w-8 bg-[var(--color-ember)]/50" />
            <span>Power map</span>
          </div>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-editorial text-[42px] leading-[1.05] tracking-tight sm:text-[60px] lg:text-[74px]">
                Who actually runs Portland?
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[19px]">
                The surprise is that there is no single government. Portland is run through
                overlapping city, county, regional, state, transit, school, health, and provider
                systems. A lot of our politics is really coordination failure.
              </p>
            </div>
            <HeroPowerGlyph />
          </div>
        </div>
      </section>

      <nav className="sticky top-[64px] z-20 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur">
        <div className={`${DIVE_CONTAINER} flex gap-4 overflow-x-auto py-3 text-[13px] font-semibold text-[var(--color-ink-muted)]`}>
          {[
            ["Try a problem", "#power-map"],
            ["Reference map", "#reference-map"],
            ["Handoffs", "#relationships"],
            ["Actors", "#actors"],
            ["Street-to-Stability", "#street-to-stability"],
            ["Sources", "#sources"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="shrink-0 hover:text-[var(--color-canopy)]">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <Section
        id="power-map"
        eyebrow="Try the map"
        title="Start with the problem people actually feel."
        lead="A table tells you the institutions. The useful civic move is seeing how one everyday problem crosses several owners before anything changes."
      >
        <PowerMapInteractive />
      </Section>

      <Section
        id="reference-map"
        eyebrow="Reference map"
        title="The formal layers still matter."
        lead="After you see the handoff, the institutional reference table becomes useful: it shows the geography, budget signal, and control surface for the main power centers."
        tone="warm"
      >
        <PowerTable />
      </Section>

      <Section
        id="relationships"
        eyebrow="The operating reality"
        title="Homelessness is where the power map breaks."
        lead="The person on the sidewalk does not move through one institution. They move through calls, eligibility rules, legal thresholds, service contracts, hospitals, courts, transit, shelters, and treatment systems."
        tone="warm"
      >
        <RelationshipDiagram />
        <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <h3 className="text-[20px] font-semibold text-[var(--color-ink)]">
            The core diagnostic
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            The system does not reliably know who has a real placement option, which bed is open
            now, what restriction blocks the match, who owns the next action, or whether the person
            arrived. That is the coordination gap Civic Lab is building around.
          </p>
        </div>
      </Section>

      <Section
        id="actors"
        eyebrow="Actors"
        title="The main power centers."
        lead="This is a public-facing map of offices and agencies first. Individuals matter, but the more durable civic lesson is institutional ownership."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {governanceActors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      </Section>

      <Section
        id="street-to-stability"
        eyebrow="The build"
        title="Street-to-Stability is the command layer."
        lead="The product goal is not to create another directory. It is to route every field contact into a real, cohort-appropriate placement path and show where the system fails."
        tone="dark"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Real offer", "Appropriate to cohort, available or call-ready, transportable, documented."],
            ["Cohort triage", "Match the person to the first right lane, not the most convenient bed."],
            ["Capacity marketplace", "Expose the exact missing bed, unit, worker, referral, or transport resource."],
            ["Live workflow", "Call, hold, transport, arrival, and failure reason in one field sequence."],
            ["No PII v1", "Synthetic cases and anonymous criteria until legal/compliance work is complete."],
            ["Public accountability", "Aggregate outcomes, source labels, and owner clarity for every lever."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-sm border border-white/12 bg-white/8 p-5">
              <CheckCircle2 className="h-5 w-5 text-[var(--color-ember)]" />
              <h3 className="mt-3 text-[18px] font-semibold text-white">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-sm border border-white/12 bg-white/8 p-5">
          <p className="text-[13px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Product standard
          </p>
          <p className="mt-3 text-[22px] font-semibold leading-snug text-white">
            Referral is not an outcome. Arrival is an outcome. Retention is an outcome. A failed
            handoff is data, not a footnote.
          </p>
        </div>
      </Section>

      <Section
        id="cohorts"
        eyebrow="Cohorts"
        title="Different people need different first placements."
        lead="Housing First is a tool for the right population. It is not a substitute for detox, psychiatric stabilization, medical respite, jail-release bridges, family shelter, or safe parking."
      >
        <CohortMatrix />
      </Section>

      <Section
        id="wedge"
        eyebrow="MVP"
        title="Build the no-PII wedge first."
        lead="The first product should be useful before it is politically complete: anonymous/synthetic case flow, existing catalog and matcher, call-ready options, and clear failure reasons."
        tone="warm"
      >
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
            <Waypoints className="h-6 w-6 text-[var(--color-ember)]" />
            <h3 className="mt-4 text-[24px] font-semibold leading-tight text-[var(--color-ink)]">
              The first public product loop
            </h3>
            <ol className="mt-5 space-y-3 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
              {[
                "Pick a synthetic field case.",
                "Assign the cohort and first placement type.",
                "Use anonymous criteria to rank existing catalog options.",
                "Show the phone number, access restrictions, referral notes, and call script.",
                "Log the synthetic outcome: placed, no availability, referral-only, transport gap, declined after yes, or name/ban-list check needed.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-canopy)] text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
            <Users className="h-6 w-6 text-[var(--color-ember)]" />
            <h3 className="mt-4 text-[24px] font-semibold leading-tight text-[var(--color-ink)]">
              What v1 does not store
            </h3>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {["No real names", "No DOBs", "No medical records", "No by-name list", "No HMIS writes", "No consent packet yet"].map((item) => (
                <div key={item} className="rounded-sm bg-[var(--color-paper-warm)] px-3 py-2 text-[13px] font-semibold text-[var(--color-ink)]">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
              The future named-case workflow needs consent, legal review, role-based access,
              audit trails, and integration decisions. The wedge does not wait for that work.
            </p>
            <Link
              href="https://beds.portlandciviclab.org/street-to-stability"
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-4 py-3 text-[14px] font-semibold text-white"
            >
              Open the wedge MVP
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="sources"
        eyebrow="Sources"
        title="Every budget/control claim needs a source."
        lead="This page uses official public sources for headline budget and authority claims. Metro's current budget should be pulled from the official adopted budget document before a dollar headline is used."
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
      </Section>
    </div>
  );
}
