import Link from "next/link";
import { ArrowRight, House, LifeBuoy, ShieldCheck } from "lucide-react";

const CONNECTIONS = [
  { title: "A suitable place", body: "Temporary safety that fits the household.", icon: ShieldCheck },
  { title: "A home", body: "A real unit, a funded offer and a completed move.", icon: House },
  { title: "Stability", body: "Care and tenancy support that continue after move-in.", icon: LifeBuoy },
];

/** A concise entry to the continuum story without importing the old stage model. */
export default function ContinuumTldr() {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-parchment)] bg-white">
      <div className="p-5 sm:p-7">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-canopy-light)]">The handoff is part of the service</p>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[var(--color-ink)]">
          A shelter bed provides safety. A suitable home ends homelessness.
          Continuing support helps that home last. The system has to connect all three.
        </p>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {CONNECTIONS.map(({ title, body, icon: Icon }, index) => (
            <li key={title} className="relative border-t-2 border-[var(--color-sage)] pt-4 sm:pr-5">
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-6 w-6 text-[var(--color-canopy-light)]" aria-hidden="true" />
                {index < CONNECTIONS.length - 1 ? <ArrowRight className="hidden h-5 w-5 text-[var(--color-sage)] sm:block" aria-hidden="true" /> : null}
              </div>
              <h3 className="mt-3 text-[17px] font-semibold leading-snug text-[var(--color-canopy)]">{title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-ink-light)]">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
          Shelter is optional. Housing work and care can happen together.
        </p>
      </div>
      <Link
        href="/deep-dives/continuum"
        className="group flex min-h-[64px] items-center justify-between gap-4 bg-[var(--color-canopy)] px-5 py-5 text-white transition-colors hover:bg-[var(--color-canopy-light)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-river-deep)] sm:px-7"
      >
        <span>
          <span className="block text-[17px] font-semibold">See where the connections break</span>
          <span className="mt-1 block text-[15px] leading-relaxed text-white/80">The evidence, the costs and the next decisions.</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}
