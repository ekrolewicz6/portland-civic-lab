import { Users, ListChecks, CalendarDays, Megaphone } from "lucide-react";
import { COMMITTEE } from "@/lib/datacenters/data";

/**
 * Governor Kotek's Data Center Advisory Committee: who's on it, what it must
 * deliver, its public schedule, and how to participate.
 */
export default function CommitteeDetail() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* Members */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Users className="w-5 h-5 text-[var(--color-ember)]" />
          <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">The seven members</h3>
        </div>
        <ul className="space-y-2.5">
          {COMMITTEE.members.map((m) => (
            <li key={m.name} className="flex items-baseline gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-ember)]" />
              <span className="text-[13px] leading-snug">
                <span className="font-semibold text-[var(--color-ink)]">{m.name}</span>
                {m.coChair && (
                  <span className="ml-1.5 rounded-sm bg-[#f6ecd9] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ember)]">
                    Co-chair
                  </span>
                )}
                <span className="block text-[12px] text-[var(--color-ink-muted)]">{m.role}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
          A deliberately mixed table: grid planning, environmental law, a county in data-center
          country, climate-minded business, and private capital — the coalition any deal framework
          has to survive.
        </p>
      </div>

      {/* Charge */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <ListChecks className="w-5 h-5 text-[var(--color-ember)]" />
          <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
            What it must deliver
          </h3>
        </div>
        <ol className="space-y-2.5">
          {COMMITTEE.charge.map((c, i) => (
            <li key={c} className="flex items-baseline gap-2.5">
              <span className="font-mono text-[12px] font-bold text-[var(--color-ember)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">{c}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
          Deliverable: recommendations for a comprehensive regulatory framework, due to the
          Governor no later than {COMMITTEE.reportDue} — the direct input to whatever replaces the
          moratorium in the 2027 session.
        </p>
      </div>

      {/* Schedule */}
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <CalendarDays className="w-5 h-5 text-[var(--color-ember)]" />
          <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
            One topic per month, in public
          </h3>
        </div>
        <ul className="space-y-1.5">
          {COMMITTEE.schedule.map((s) => (
            <li key={s.date} className="flex items-baseline gap-3">
              <span className="w-[118px] flex-shrink-0 font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-muted)]">
                {s.date}
              </span>
              <span className="text-[13px] text-[var(--color-ink-light)] leading-snug">
                {s.topic}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Participation */}
      <div className="rounded-sm border-2 border-[var(--color-fern)]/30 bg-[#f1f7f3] p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Megaphone className="w-5 h-5 text-[var(--color-fern)]" />
          <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">
            You can weigh in — here&apos;s how
          </h3>
        </div>
        <ul className="space-y-2 text-[13px] text-[var(--color-ink-light)] leading-relaxed">
          <li>
            Meetings run on Zoom with recordings posted to YouTube; agendas, slides, and summaries
            are published for every session.
          </li>
          <li>
            Each meeting reserves ~30 minutes for public comment — 15 first-come slots. Email{" "}
            <span className="font-mono text-[12px] text-[var(--color-ink)]">{COMMITTEE.email}</span>{" "}
            with your name, the meeting date, and a two-minute summary.
          </li>
          <li>
            A dedicated public listening session on the preliminary findings is scheduled for
            September 23, 2026 — the last realistic moment to move the report.
          </li>
        </ul>
      </div>
    </div>
  );
}
