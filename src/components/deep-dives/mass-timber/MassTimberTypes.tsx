import { Layers, Columns3, SquareStack } from "lucide-react";

const TYPES = [
  {
    icon: Layers,
    name: "Cross-laminated timber (CLT)",
    what: "Layers of lumber glued at right angles into big structural panels.",
    use: "Floors and walls — the flat slabs of a building.",
  },
  {
    icon: Columns3,
    name: "Glulam",
    what: "Glue-laminated beams and columns — many boards bonded into one strong member.",
    use: "The posts and beams that hold a building up.",
  },
  {
    icon: SquareStack,
    name: "Mass plywood panel (MPP)",
    what: "Veneer-based structural panels — an Oregon invention (Freres Engineered Wood).",
    use: "A lighter, wood-efficient alternative to CLT panels.",
  },
];

export default function MassTimberTypes() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {TYPES.map((t) => (
          <div key={t.name} className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
            <t.icon className="w-7 h-7 text-[var(--color-fern)]" strokeWidth={1.5} />
            <h3 className="mt-3 text-[16px] font-semibold text-[var(--color-canopy)] leading-tight">
              {t.name}
            </h3>
            <p className="mt-2 text-[13px] text-[var(--color-ink-light)] leading-relaxed">{t.what}</p>
            <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
              <span className="font-semibold uppercase tracking-wide text-[10px]">Used for: </span>
              {t.use}
            </p>
          </div>
        ))}
      </div>

      {/* Panelized vs modular */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Two ways to build with it
          </div>
          <h4 className="mt-2 font-editorial-normal text-[20px] text-[var(--color-canopy)]">
            Panelized
          </h4>
          <p className="mt-2 text-[13px] text-[var(--color-ink-light)] leading-relaxed">
            Panels and beams are made in a plant, shipped flat, and stood up on site like a
            giant flat-pack. The frame goes up fast with a small crew; everything else —
            plumbing, wiring, finishes — is still built on site. Lower risk.
          </p>
        </div>
        <div className="rounded-sm border-2 border-[var(--color-fern)]/30 bg-[#f3f7f4] p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Two ways to build with it
          </div>
          <h4 className="mt-2 font-editorial-normal text-[20px] text-[var(--color-canopy)]">
            Volumetric / modular
          </h4>
          <p className="mt-2 text-[13px] text-[var(--color-ink-light)] leading-relaxed">
            Whole finished rooms — walls, floors, wiring, plumbing, sometimes fixtures — are
            built in a factory, trucked to the site, and stacked like Lego. This captures the
            most factory efficiency <strong>and</strong> carries the factory-economics risk
            that is the central pitfall of this whole field.
          </p>
        </div>
      </div>
    </div>
  );
}
