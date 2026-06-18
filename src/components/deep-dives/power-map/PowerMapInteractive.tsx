"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CircleDollarSign,
  GitBranch,
  Hospital,
  Landmark,
  MapIcon,
  Network,
  School,
  ShieldCheck,
  Train,
} from "lucide-react";
import {
  governanceActors,
  powerMapIssues,
  type GovernanceActor,
  type PowerMapIssue,
} from "@/lib/power-map/data";

const actorIcons: Record<string, ComponentType<{ className?: string }>> = {
  oregon: Landmark,
  "multnomah-county": Building2,
  metro: Network,
  portland: ShieldCheck,
  trimet: Train,
  schools: School,
  "special-districts": GitBranch,
  "health-systems": Hospital,
  "clark-vancouver": MapIcon,
};

const actorColors: Record<string, string> = {
  oregon: "#315d74",
  "multnomah-county": "#b77b3d",
  metro: "#6f7f4d",
  portland: "#143d2c",
  trimet: "#bd3f32",
  schools: "#7b5e8e",
  "special-districts": "#6b7280",
  "health-systems": "#2f9c8f",
  "clark-vancouver": "#8a6a42",
};

const visibleScores: Record<string, number> = {
  portland: 95,
  trimet: 72,
  "multnomah-county": 62,
  schools: 56,
  "health-systems": 48,
  metro: 36,
  oregon: 32,
  "special-districts": 28,
  "clark-vancouver": 18,
};

function actorName(actorId: string, actorsById: Map<string, GovernanceActor>) {
  return actorsById.get(actorId)?.layer ?? actorId;
}

function ActorMark({
  actorId,
  actorsById,
  compact = false,
}: {
  actorId: string;
  actorsById: Map<string, GovernanceActor>;
  compact?: boolean;
}) {
  const Icon = actorIcons[actorId] ?? Building2;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: actorColors[actorId] ?? "#143d2c" }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      {!compact ? <span>{actorName(actorId, actorsById)}</span> : null}
    </span>
  );
}

function IssuePicker({
  activeIssue,
  setActiveIssue,
}: {
  activeIssue: PowerMapIssue;
  setActiveIssue: (issue: PowerMapIssue) => void;
}) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
        Pick a resident question
      </p>
      <div className="mt-4 grid gap-2">
        {powerMapIssues.map((issue) => {
          const active = issue.id === activeIssue.id;
          return (
            <button
              key={issue.id}
              type="button"
              onClick={() => setActiveIssue(issue)}
              className={`rounded-sm border px-4 py-3 text-left transition ${
                active
                  ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                  : "border-[var(--color-parchment)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[var(--color-sage)]"
              }`}
            >
              <span className="block text-[14px] font-semibold leading-snug">{issue.label}</span>
              <span className={`mt-1 block text-[12px] leading-snug ${active ? "text-white/70" : "text-[var(--color-ink-muted)]"}`}>
                {issue.visibleLayer}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IssueStory({
  issue,
  actorsById,
}: {
  issue: PowerMapIssue;
  actorsById: Map<string, GovernanceActor>;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
      <div className="bg-[var(--color-canopy)] p-5 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
          What a resident experiences
        </p>
        <h3 className="mt-3 text-[26px] font-semibold leading-tight">{issue.residentQuestion}</h3>
        <div className="mt-5 grid gap-3 2xl:grid-cols-3">
          <div className="border-t border-white/20 pt-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Visible layer</p>
            <p className="mt-1 text-[14px] font-semibold">{issue.visibleLayer}</p>
          </div>
          <div className="border-t border-white/20 pt-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Usually blamed</p>
            <p className="mt-1 text-[14px] font-semibold">{issue.usuallyBlamed}</p>
          </div>
          <div className="border-t border-white/20 pt-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">Responsibility question</p>
            <p className="mt-1 text-[14px] font-semibold">{issue.betterQuestion}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-sm bg-[var(--color-paper-warm)] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-ember)]" />
            <p className="text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              <span className="font-semibold text-[var(--color-ink)]">Why it gets confusing: </span>
              {issue.handoffFailure}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Responsibility path
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {issue.actualOwners.map((owner, index) => (
              <div key={`${owner.actorId}-${owner.role}`} className="relative rounded-sm border border-[var(--color-parchment)] p-4">
                <div className="flex items-center justify-between gap-2">
                  <ActorMark actorId={owner.actorId} actorsById={actorsById} compact />
                  <span className="text-[11px] font-bold text-[var(--color-ink-muted)]">{index + 1}</span>
                </div>
                <p className="mt-3 text-[13px] font-semibold leading-tight text-[var(--color-ink)]">
                  {actorName(owner.actorId, actorsById)}
                </p>
                <p className="mt-2 text-[12px] font-semibold leading-snug text-[var(--color-canopy)]">
                  {owner.role}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">{owner.lever}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthorityStack({
  issue,
  actorsById,
}: {
  issue: PowerMapIssue;
  actorsById: Map<string, GovernanceActor>;
}) {
  const ownerRank = new Map(issue.actualOwners.map((owner, index) => [owner.actorId, index]));

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Authority stack
          </p>
          <h3 className="mt-2 text-[24px] font-semibold leading-tight text-[var(--color-ink)]">
            The visible layer is not always the deciding layer.
          </h3>
        </div>
        <p className="max-w-md text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          Left bar: how visible this layer is to residents. Right bar: how much this selected question
          depends on that layer.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {governanceActors.slice(0, 8).map((actor) => {
          const rank = ownerRank.get(actor.id);
          const involved = rank != null;
          const controlScore = involved ? Math.max(34, 100 - rank * 13) : 12;
          return (
            <div key={actor.id} className={`grid gap-3 rounded-sm border p-3 md:grid-cols-[220px_1fr_1fr] md:items-center ${
              involved ? "border-[var(--color-sage)] bg-[var(--color-paper-warm)]" : "border-[var(--color-parchment)]"
            }`}>
              <div className="flex items-center gap-3">
                <ActorMark actorId={actor.id} actorsById={actorsById} compact />
                <div>
                  <p className="text-[14px] font-semibold leading-tight text-[var(--color-ink)]">{actor.layer}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{actor.budget}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                  <span>Visible</span>
                  <span>{visibleScores[actor.id] ?? 20}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-parchment)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${visibleScores[actor.id] ?? 20}%`,
                      backgroundColor: actorColors[actor.id] ?? "#143d2c",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                  <span>Selected question</span>
                  <span>{involved ? "owns a lever" : "secondary"}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-parchment)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-ember)]"
                    style={{ width: `${controlScore}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RelationshipMap({
  issue,
  actorsById,
}: {
  issue: PowerMapIssue;
  actorsById: Map<string, GovernanceActor>;
}) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Relationship map
          </p>
          <h3 className="mt-2 text-[24px] font-semibold leading-tight text-[var(--color-ink)]">
            Responsibility splits as work moves.
          </h3>
        </div>
        <p className="max-w-md text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          A resident sees one issue. The work often passes through several agencies, each with
          different authority, money, rules, and operating duties.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-5">
        {issue.sequence.map((step, index) => (
          <div key={`${step.actorId}-${step.label}`} className="relative">
            <div className={`h-full rounded-sm border p-4 ${
              step.failure
                ? "border-[var(--color-ember)] bg-[#fff7ed]"
                : "border-[var(--color-parchment)] bg-[var(--color-paper)]"
            }`}>
              <div className="flex items-center justify-between gap-2">
                <ActorMark actorId={step.actorId} actorsById={actorsById} compact />
                {index < issue.sequence.length - 1 ? (
                  <ArrowRight className="hidden h-4 w-4 text-[var(--color-ink-muted)] lg:block" />
                ) : null}
              </div>
              <p className="mt-3 text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{step.label}</p>
              <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
                {actorName(step.actorId, actorsById)}
              </p>
              {step.failure ? (
                <p className="mt-3 rounded-sm bg-white px-2 py-1.5 text-[12px] font-semibold text-[var(--color-ember)]">
                  {step.failure}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PowerMapInteractive() {
  const [activeId, setActiveId] = useState(powerMapIssues[0].id);
  const activeIssue = powerMapIssues.find((issue) => issue.id === activeId) ?? powerMapIssues[0];
  const actorsById = useMemo(
    () => new Map(governanceActors.map((actor) => [actor.id, actor])),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <IssuePicker
          activeIssue={activeIssue}
          setActiveIssue={(issue) => setActiveId(issue.id)}
        />
        <IssueStory issue={activeIssue} actorsById={actorsById} />
      </div>
      <AuthorityStack issue={activeIssue} actorsById={actorsById} />
      <RelationshipMap issue={activeIssue} actorsById={actorsById} />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <CircleDollarSign className="h-5 w-5 text-[var(--color-ember)]" />
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Budget is not control
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            Total budgets include restricted money, enterprise funds, internal transfers, and
            pass-through dollars. Flexible control is often much smaller.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <ShieldCheck className="h-5 w-5 text-[var(--color-ember)]" />
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Blame is not authority
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            The layer you see first may only own the visible symptom. The binding lever may sit
            with a funder, provider, regulator, court, hospital, or regional body.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <Network className="h-5 w-5 text-[var(--color-ember)]" />
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Coordination is an accountability problem
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            If no one can see the owner, status, next action, and constraint, the public experiences
            one issue while institutions experience many separate queues.
          </p>
        </div>
      </div>
    </div>
  );
}
