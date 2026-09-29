import { COMMITTEE, SOURCES } from "@/lib/datacenters/data";
export default function CommitteeDetail() {
  return <div className="grid gap-5 md:grid-cols-2">
    <div><h3 className="font-semibold">Members listed by ODOE</h3><ul className="mt-3 space-y-3 text-sm">
      {COMMITTEE.members.map(m => <li key={m.name}><strong>{m.name}{m.coChair ? " · Co-chair" : ""}</strong><span className="block text-[var(--color-ink-muted)]">{m.role}</span></li>)}
    </ul></div>
    <div><h3 className="font-semibold">Charge</h3><ul className="mt-3 list-disc pl-5 space-y-2 text-sm">{COMMITTEE.charge.map(c => <li key={c}>{c}</li>)}</ul>
      <p className="mt-4 text-sm leading-relaxed">The original charge anticipated October recommendations. The September preliminary report instead expects final recommendations before the end of 2026.
        {" "}<a className="underline" href={SOURCES.preliminary.url}>Read the updated report</a>.</p>
    </div>
    <div className="md:col-span-2"><h3 className="font-semibold">Recent milestones</h3><ul className="mt-3 space-y-2 text-sm">
      {COMMITTEE.schedule.map(s => <li key={s.date}><strong>{s.date}:</strong> {s.topic}</li>)}
    </ul><p className="mt-3 text-sm"><a className="underline text-[var(--color-river-deep)]" href={SOURCES.advisoryCommittee.url}>Check the official notice and written-comment form</a> for current instructions.</p></div>
  </div>;
}
