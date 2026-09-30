import { SOURCES } from "@/lib/datacenters/data";
export default function SubsidyPerJob() {
  return <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
    <h3 className="font-semibold">What an older tax-break-per-job comparison shows</h3>
    <p className="mt-2 text-sm leading-relaxed">A 2016 state audit divided the value of 2015 tax breaks by the number of new jobs businesses reported. The result was $4,200 per job in standard enterprise zones and $54,500 in long-term rural zones. The calculation does not tell us how many of those jobs would have existed without the breaks. It also does not tell us what a proposed data center would cost today.</p>
    <p className="mt-2 text-sm">These figures cover one year and use dollars from that time. The calculator combines payments over many years and gives future payments less weight, so its totals are not directly comparable.</p>
    <a className="mt-3 inline-block text-xs underline text-[var(--color-river-deep)]" href={SOURCES.audit2016.url}>Source: February 2023 reporting on the 2016 audit</a>
  </div>;
}
