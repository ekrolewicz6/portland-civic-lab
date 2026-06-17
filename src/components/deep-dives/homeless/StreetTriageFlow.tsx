import { ArrowRight, CheckCircle2, CircleAlert, ShieldAlert } from "lucide-react";
import { FIELD_TRIAGE, OUTREACH_ACTORS, SOURCES } from "@/lib/homeless/data";

const ICONS = [ShieldAlert, CircleAlert, CheckCircle2];

export default function StreetTriageFlow() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        {FIELD_TRIAGE.map((step, i) => {
          const Icon = ICONS[i] ?? CheckCircle2;
          return (
            <div key={step.step} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-canopy)] text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-[15px] font-semibold text-[var(--color-canopy)]">{step.step}</h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] text-[var(--color-ember)]">
                <ArrowRight className="h-3.5 w-3.5" />
                {step.route}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                {step.reality}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-sm border border-[var(--color-river)]/25 bg-[var(--color-river)]/5 p-5">
        <p className="text-[13px] font-semibold text-[var(--color-canopy)]">Who is in the field?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
          The response system is not one team. Public sources identify Portland Street Response,
          Portland Solutions, Fire CHAT, NW Community Conservancy, and ImpactNW Recovery Navigation
          as parts of the outreach and navigation landscape.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {OUTREACH_ACTORS.map((actor) => {
            const source = SOURCES[actor.source as keyof typeof SOURCES];
            return (
              <a
                key={actor.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--color-river)]/25 bg-white px-3 py-1 text-[12px] text-[var(--color-river-deep)] hover:bg-[var(--color-paper-warm)]"
              >
                {actor.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

