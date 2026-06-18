import { ArrowRight, Clock, Users } from "lucide-react";
import { PLACEMENT_COHORTS } from "@/lib/homeless/data";

export default function CohortRouting() {
  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] p-5 text-white sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ember)]">
              Operating rule
            </p>
            <h3 className="mt-2 max-w-2xl font-editorial text-[28px] leading-tight sm:text-[34px]">
              The first placement has to match the cohort.
            </h3>
          </div>
          <p className="text-[14px] leading-relaxed text-white/72">
            A real offer is not a generic shelter referral. It is an available first step that matches
            the person&apos;s risk, urgency, legal status, health needs, family situation, and likely
            path out.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PLACEMENT_COHORTS.map((cohort) => (
          <article
            key={cohort.id}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_8px_26px_rgba(15,36,25,0.035)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[17px] font-semibold leading-tight text-[var(--color-canopy)]">
                  {cohort.cohort}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-paper-warm)] px-3 py-1 text-[12px] font-semibold text-[var(--color-ember)]">
                  <Clock className="h-3.5 w-3.5" />
                  {cohort.deadline}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-4">
              <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                First placement
              </p>
              <p className="mt-2 text-[14px] font-semibold leading-relaxed text-[var(--color-ink)]">
                {cohort.firstPlacement}
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                  Capacity needed
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cohort.capacityNeeded.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-2.5 py-1 text-[12px] leading-snug text-[var(--color-ink-light)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                  Owners
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cohort.responsibleOwners.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-parchment)] bg-white px-2.5 py-1 text-[12px] leading-snug text-[var(--color-ink-light)]"
                    >
                      <Users className="h-3 w-3 text-[var(--color-sage)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--color-parchment)] pt-4">
              <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Measure
              </p>
              <p className="mt-1 flex items-start gap-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ember)]" />
                {cohort.metrics.join(", ")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
