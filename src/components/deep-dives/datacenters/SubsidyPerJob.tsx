import { SOURCES } from "@/lib/datacenters/data";
export default function SubsidyPerJob() {
  return <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
    <h3 className="font-semibold">A historical comparison, not a current price per job</h3>
    <p className="mt-2 text-sm leading-relaxed">A 2016 state audit compared 2015 exemptions per reported new job: $4,200 in standard zones and $54,500 in long-term rural zones. These are program-level observations, not the cost of causing one additional job, and not a current estimate for a proposed campus.</p>
    <p className="mt-2 text-sm">Do not compare these nominal, single-year figures with a discounted multi-year calculator result.</p>
    <a className="mt-3 inline-block text-xs underline text-[var(--color-river-deep)]" href={SOURCES.audit2016.url}>Source: February 2023 reporting on the 2016 audit</a>
  </div>;
}
