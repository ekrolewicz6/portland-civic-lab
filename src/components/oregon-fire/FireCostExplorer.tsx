"use client";
import { useState } from "react";
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 1, notation: "compact" }).format(value);
export default function FireCostExplorer() {
  const [investment, setInvestment] = useState(1000000);
  const [chance, setChance] = useState(20);
  const [damageReduction, setDamageReduction] = useState(10000000);
  const avoided = chance / 100 * damageReduction;
  const max = Math.max(investment, avoided, 1000000);
  const difference = avoided - investment;
  return <div className="fire-cost-explorer" id="costs">
    <div className="fire-cost-heading"><span className="fire-eyebrow">Try the numbers</span><span className="fire-example-badge">Invented example · not an Oregon estimate</span></div>
    <h3>When could spending now pay off later?</h3>
    <p>Imagine a project that makes a later wildfire less damaging. Its financial benefit depends on whether that fire reaches the project while the work is still effective.</p>
    <div className="fire-cost-layout">
      <div className="fire-cost-controls">
        <label htmlFor="fire-investment">Cost of the work <output htmlFor="fire-investment">{money(investment)}</output></label>
        <input id="fire-investment" type="range" min={250000} max={5000000} step={250000} value={investment} onChange={e => setInvestment(Number(e.target.value))} aria-valuetext={`${money(investment)} total project cost`} />
        <small>Assume this includes planning, preparation, burning, and maintenance over 20 years.</small>
        <label htmlFor="fire-chance">Chance of a relevant wildfire <output htmlFor="fire-chance">{chance}%</output></label>
        <input id="fire-chance" type="range" min={0} max={100} step={5} value={chance} onChange={e => setChance(Number(e.target.value))} aria-valuetext={`${chance} percent over 20 years`} />
        <small>Within those 20 years, while the work can still affect the fire.</small>
        <label htmlFor="fire-reduction">Damage avoided if that fire occurs <output htmlFor="fire-reduction">{money(damageReduction)}</output></label>
        <input id="fire-reduction" type="range" min={1000000} max={20000000} step={1000000} value={damageReduction} onChange={e => setDamageReduction(Number(e.target.value))} aria-valuetext={`${money(damageReduction)} less damage if the fire occurs`} />
        <small>An assumed difference between the same place with and without the work.</small>
      </div>
      <div className="fire-cost-result" aria-live="polite" aria-atomic="true">
        <div className="fire-cost-bar-label"><span>Cost of work</span><strong>{money(investment)}</strong></div>
        <div className="fire-cost-track"><div className="fire-cost-bar investment" style={{ width: `${investment / max * 100}%` }} /></div>
        <div className="fire-cost-bar-label"><span>Expected damage avoided</span><strong>{money(avoided)}</strong></div>
        <div className="fire-cost-track"><div className="fire-cost-bar avoided" style={{ width: `${avoided / max * 100}%` }} /></div>
        <p className="fire-cost-equation">{chance}% × {money(damageReduction)} = <strong>{money(avoided)}</strong></p>
        <p className="fire-cost-verdict">With these assumptions, expected avoided damage is <strong>{money(Math.abs(difference))} {difference >= 0 ? "above" : "below"}</strong> the cost of the work.</p>
        <p>We multiply the chance of a fire by the damage avoided if it happens. This averages possible futures. The actual outcome could be no wildfire, or a fire with a much larger benefit.</p>
      </div>
    </div>
    <details><summary>What a real comparison would need</summary><p>Verified costs, local wildfire probabilities, evidence of treatment effects, maintenance schedules, and a common time period. This simple example leaves out the timing of money, treatment risks, smoke, firefighting costs, and ecological benefits. It cannot establish actual savings or whether a specific project is worthwhile.</p><a href="https://research.fs.usda.gov/treesearch/55535">Research on treatment encounters and possible savings ↗</a></details>
    <noscript><style>{".fire-cost-controls{display:none}"}</style><p>The starting example is readable above. Enable JavaScript to change the assumptions, or calculate it directly: wildfire probability × damage avoided if it occurs.</p></noscript>
  </div>;
}
