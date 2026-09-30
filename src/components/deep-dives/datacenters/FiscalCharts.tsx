"use client";
import { useId } from "react";
import type { DealResult } from "@/lib/datacenters/engine";
export const money = (v: number) => (v < -0.00001 ? "−" : "") + "$" + Math.abs(v).toFixed(1) + "M";

/** HTML labels keep their readable size as the chart narrows or text is enlarged. */
export function ReceiptBars({ result }: { result: DealResult }) {
  const lo = Math.min(0, result.evSign, result.evHold), hi = Math.max(0, result.evSign, result.evHold);
  const x = (n: number) => 100 * (n - lo) / (hi - lo || 1);
  return <div className="dc-receipt-bars" role="group" aria-label="Estimated public money after entered costs">
    {[{ label: "Offer the deal", value: result.evSign, color: "#407a63" }, { label: "Offer no tax break", value: result.evHold, color: "#4a7f9e" }].map(r => <div key={r.label}>
      <div className="dc-receipt-heading"><span>{r.label}</span><strong>{money(r.value)}</strong></div>
      <div className="dc-receipt-track" aria-hidden="true">
        <span style={{ left: Math.min(x(0), x(r.value)) + "%", width: Math.abs(x(r.value) - x(0)) + "%", backgroundColor: r.color }} />
        {lo < 0 && <i style={{ left: x(0) + "%" }} />}
      </div>
    </div>)}
  </div>;
}
export function MoneyTimeline({ result, abatementYears }: { result: DealResult; abatementYears: number }) {
  const id = useId();
  const points = [{ year: 0, deal: 0, noBreak: 0 }, ...result.timeline];
  const years = result.timeline.length;
  const lo = Math.min(0, ...points.flatMap(p => [p.deal, p.noBreak]));
  const hi = Math.max(1, ...points.flatMap(p => [p.deal, p.noBreak]));
  const x = (year: number) => year / years * 1000;
  const y = (amount: number) => 224 - (amount - lo) / (hi - lo || 1) * 208;
  const line = (key: "deal" | "noBreak") => points.map((p, i) => (i ? "L" : "M") + x(p.year) + "," + y(p[key])).join(" ");
  const cut = Math.min(abatementYears, years);
  return <figure className="dc-timeline">
    <figcaption><strong>Public money over time</strong><span>Running total · today&apos;s dollars</span></figcaption>
    <div className="dc-chart-legend"><span><i className="dc-dot dc-green" /> Offer the deal</span><span><i className="dc-dot dc-blue" /> No tax break</span></div>
    <div className="dc-timeline-chart">
      <div className="dc-timeline-y" aria-hidden="true">
        {[lo, (lo + hi) / 2, hi].map((v, i) => <span key={i} style={{ top: `${y(v) / 240 * 100}%` }}>{v < 0 ? "−" : ""}${Math.abs(v).toFixed(hi < 5 ? 1 : 0)}M</span>)}
      </div>
      <div className="dc-timeline-plot">
        <svg viewBox="0 0 1000 240" preserveAspectRatio="none" role="img" aria-labelledby={id}>
          <title id={id}>{`Estimated running total of public money over ${years} years. Final deal value ${money(result.evSign)}; no-break value ${money(result.evHold)}. Tax break lasts ${abatementYears} years.`}</title>
          <rect x="0" y="8" width={x(cut)} height="216" fill="#eee5d4" />
          {[lo, (lo + hi) / 2, hi].map((v, i) => <line key={i} x1="0" x2="1000" y1={y(v)} y2={y(v)} stroke="#d8dfd7" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />)}
          <path d={line("noBreak")} fill="none" stroke="#4a7f9e" strokeWidth="3" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
          <path d={line("deal")} fill="none" stroke="#28634a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="dc-timeline-x" aria-hidden="true">{Array.from(new Set([0, Math.round(years / 2), years])).map(year => <span key={year} style={year === years ? {right: 0} : {left: `${year / years * 100}%`, transform: year === 0 ? undefined : "translateX(-50%)"}}>{year === 0 ? "Start" : "Year " + year}</span>)}</div>
    </div>
    <p className="dc-fine"><span className="dc-shade-key" /> The shaded area shows the years with a tax break. After that, the model charges full property tax for as long as the site operates.</p>
  </figure>;
}
