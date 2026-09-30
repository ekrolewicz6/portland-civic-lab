"use client";
import { useId } from "react";
import type { DealResult } from "@/lib/datacenters/engine";
export const money = (v: number) => (v < -0.00001 ? "−" : "") + "$" + Math.abs(v).toFixed(1) + "M";
export function ReceiptBars({ result }: { result: DealResult }) {
  const id = useId();
  const lo = Math.min(0, result.evSign, result.evHold), hi = Math.max(0, result.evSign, result.evHold);
  const x = (n: number) => 520 * (n - lo) / (hi - lo || 1);
  return <svg viewBox="0 0 520 146" role="img" aria-labelledby={id} className="dc-receipt-bars">
    <title id={id}>{`Estimated public money after entered costs: deal ${money(result.evSign)}, no tax break ${money(result.evHold)}. These amounts account for the chances of building and not building.`}</title>
    {[{ label: "Offer the deal", value: result.evSign, color: "#407a63" }, { label: "Offer no tax break", value: result.evHold, color: "#4a7f9e" }].map((r, i) => <g key={r.label}>
      <text x="0" y={20 + i * 72} fontSize="17" fill="currentColor">{r.label}</text>
      <text x="520" y={20 + i * 72} textAnchor="end" fontSize="19" fontWeight="700" fill="currentColor">{money(r.value)}</text>
      <rect x="0" y={32 + i * 72} width="520" height="22" rx="5" fill="#ebe9e1" />
      <rect x={Math.min(x(0), x(r.value))} y={32 + i * 72} width={Math.max(0, Math.abs(x(r.value) - x(0)))} height="22" rx="5" fill={r.color} />
    </g>)}
    {lo < 0 && <line x1={x(0)} x2={x(0)} y1="28" y2="132" stroke="#102c23" strokeDasharray="3 3" />}
  </svg>;
}
export function MoneyTimeline({ result, abatementYears }: { result: DealResult; abatementYears: number }) {
  const id = useId();
  const points = [{ year: 0, deal: 0, noBreak: 0 }, ...result.timeline];
  const years = result.timeline.length;
  const lo = Math.min(0, ...points.flatMap(p => [p.deal, p.noBreak]));
  const hi = Math.max(1, ...points.flatMap(p => [p.deal, p.noBreak]));
  const x = (year: number) => 60 + year / years * 490;
  const y = (amount: number) => 212 - (amount - lo) / (hi - lo || 1) * 180;
  const line = (key: "deal" | "noBreak") => points.map((p, i) => (i ? "L" : "M") + x(p.year) + "," + y(p[key])).join(" ");
  const cut = Math.min(abatementYears, years);
  return <figure className="dc-timeline">
    <figcaption><strong>Public money over time</strong><span>Running total · today&apos;s dollars</span></figcaption>
    <div className="dc-chart-legend"><span><i className="dc-dot dc-green" /> Offer the deal</span><span><i className="dc-dot dc-blue" /> No tax break</span></div>
    <svg viewBox="0 0 570 252" role="img" aria-labelledby={id}>
      <title id={id}>{`Estimated running total of public money over ${years} years. Final deal value ${money(result.evSign)}; no-break value ${money(result.evHold)}. Tax break lasts ${abatementYears} years.`}</title>
      <rect x={60} y="22" width={x(cut) - 60} height="190" fill="#eee5d4" rx="3" />
      {[lo, (lo + hi) / 2, hi].map((v, i) => <g key={i}><line x1="60" x2="550" y1={y(v)} y2={y(v)} stroke="#d8dfd7" strokeDasharray="3 4" /><text x="51" y={y(v) + 5} textAnchor="end" fontSize="15" fill="#56675d">{v < 0 ? "−" : ""}{Math.abs(v).toFixed(hi < 5 ? 1 : 0)}M</text></g>)}
      <path d={line("noBreak")} fill="none" stroke="#4a7f9e" strokeWidth="3" strokeDasharray="6 4" />
      <path d={line("deal")} fill="none" stroke="#28634a" strokeWidth="4" />
      {[0, Math.round(years / 2), years].map(year => <text key={year} x={x(year)} y="241" textAnchor={year === years ? "end" : year === 0 ? "start" : "middle"} fontSize="16" fill="#56675d">{year === 0 ? "Start" : "Year " + year}</text>)}
      <circle cx={x(years)} cy={y(result.evSign)} r="5" fill="#28634a" />
      <circle cx={x(years)} cy={y(result.evHold)} r="4" fill="#4a7f9e" />
    </svg>
    <p className="dc-fine"><span className="dc-shade-key" /> The shaded area shows the years with a tax break. After that, the model charges full property tax for as long as the site operates.</p>
  </figure>;
}
