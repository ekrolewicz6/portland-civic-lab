import { RATE_SHIFT, SOURCES } from "@/lib/datacenters/data";

/** Bars show the magnitude of each rate change; text carries its direction. */
export default function RateShift() {
  const maxAbs = Math.max(...RATE_SHIFT.map((r) => Math.abs(r.changePct)));
  return (
    <div className="dc-rate-shift">
      <h3>How PGE’s electricity rates changed</h3>
      <p>PGE’s new rates took effect July 8, 2026, under the POWER Act, Oregon’s law addressing large electricity users.</p>
      <div>
        {RATE_SHIFT.map((r) => {
          const up = r.changePct > 0;
          const color = up ? "#e0a870" : "#b7d5c1";
          return (
            <div key={r.who}>
              <div className="dc-rate-heading">
                <h4>{r.who}</h4>
                <strong className="font-mono tabular-nums" style={{ color }}>
                  {up ? "+" : ""}{r.changePct}%
                </strong>
              </div>
              <div className="dc-rate-track" aria-hidden="true">
                <span style={{ width: `${(Math.abs(r.changePct) / maxAbs) * 100}%`, backgroundColor: color }} />
              </div>
              <p>{r.detail}</p>
            </div>
          );
        })}
      </div>
      <a href={SOURCES.pgeRates.url} className="dc-source">Source: PGE’s financial filing describing the July 8 changes</a>
    </div>
  );
}
