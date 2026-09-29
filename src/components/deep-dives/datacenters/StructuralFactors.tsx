import { STRUCTURAL_FACTORS } from "@/lib/datacenters/dcac-findings";
export default function StructuralFactors() {
  return <div className="grid gap-4 md:grid-cols-2">{STRUCTURAL_FACTORS.map(f =>
    <article key={f.title} className="border border-[var(--color-parchment)] p-4 rounded-sm">
      <h4 className="font-semibold text-[var(--color-canopy)]">{f.title}</h4>
      <p className="mt-2 text-sm leading-relaxed">{f.detail}</p>
    </article>)}</div>;
}
