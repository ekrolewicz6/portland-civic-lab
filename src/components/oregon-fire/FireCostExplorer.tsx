"use client";
import { useState } from "react";

const money = (value: number) => value >= 1000000
  ? `$${(value / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 })} million`
  : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function FireCostExplorer() {
  const [investment, setInvestment] = useState(1000000);
  const [chance, setChance] = useState(20);
  const [damageReduction, setDamageReduction] = useState(10000000);
  const avoided = chance / 100 * damageReduction;
  const difference = avoided - investment;
  const breakEven = investment / damageReduction * 100;
  const reset = () => { setInvestment(1000000); setChance(20); setDamageReduction(10000000); };

  return <div className="fire-cost-explorer" id="costs">
    <div className="fire-cost-heading"><span className="fire-eyebrow">Spending ahead / a worked example</span><span className="fire-example-badge">Made-up numbers · 20 years</span></div>
    <h3>We pay for the work. Will a fire reach it?</h3>
    <p className="fire-cost-intro">Imagine spending <strong>{money(investment)}</strong> on a project. If a wildfire reaches it while the work is effective, assume the project prevents <strong>{money(damageReduction)}</strong> in damage. The question is how likely that fire is.</p>

    <fieldset className="fire-cost-controls">
      <legend>Change the three assumptions</legend>
      <div className="fire-cost-input-grid">
        <div className="fire-cost-input">
          <label htmlFor="fire-investment"><span>1. What does the project cost?</span><output htmlFor="fire-investment">{money(investment)}</output></label>
          <input id="fire-investment" type="range" min={250000} max={5000000} step={250000} value={investment} onChange={e => setInvestment(Number(e.target.value))} aria-describedby="fire-investment-help" aria-valuetext={`${money(investment)} total over 20 years`} />
          <p id="fire-investment-help">All spending over 20 years: planning, preparation, burning and upkeep. We pay this whether a wildfire arrives or not.</p>
        </div>
        <div className="fire-cost-input">
          <label htmlFor="fire-chance"><span>2. What is the chance fire reaches the work?</span><output htmlFor="fire-chance">{chance}%</output></label>
          <input id="fire-chance" type="range" min={0} max={100} step={5} value={chance} onChange={e => setChance(Number(e.target.value))} aria-describedby="fire-chance-help" aria-valuetext={`${chance} percent within 20 years, while the work is effective`} />
          <p id="fire-chance-help">Within those 20 years, while the work can still change the fire’s effects. This is the assumed chance, not a measured local forecast.</p>
        </div>
        <div className="fire-cost-input">
          <label htmlFor="fire-reduction"><span>3. If it arrives, how much damage does the work prevent?</span><output htmlFor="fire-reduction">{money(damageReduction)}</output></label>
          <input id="fire-reduction" type="range" min={1000000} max={20000000} step={1000000} value={damageReduction} onChange={e => setDamageReduction(Number(e.target.value))} aria-describedby="fire-reduction-help" aria-valuetext={`${money(damageReduction)} in damage avoided if that fire arrives`} />
          <p id="fire-reduction-help">The difference in damage with and without the project, if that fire occurs. This is damage avoided, not the fire’s total damage.</p>
        </div>
      </div>
      <button type="button" onClick={reset} className="fire-cost-reset">Reset the example</button>
    </fieldset>

    <div className="fire-cost-futures">
      <div><h4>Imagine 100 possible futures for this place.</h4><p><strong>{chance} out of 100:</strong> fire reaches the work.<br/><strong>{100 - chance} out of 100:</strong> it doesn’t.</p><div className="fire-cost-legend"><span><i className="fire-future-fire" /> Fire reaches the work</span><span><i className="fire-future-none" /> No fire reaches it</span></div></div>
      <div className="fire-cost-dots" role="img" aria-label={`${chance} of 100 possible futures have a wildfire reaching the work; ${100 - chance} do not.`}>{Array.from({ length: 100 }, (_, i) => <span aria-hidden="true" key={i} className={i < chance ? "fire-future-fire" : "fire-future-none"} />)}</div>
    </div>
    <div className="fire-cost-outcomes">
      <div><span className="fire-eyebrow">If fire reaches the work</span><p>Spend <strong>{money(investment)}</strong>.<br/>Avoid <strong>{money(damageReduction)}</strong> in damage.</p></div>
      <div><span className="fire-eyebrow">If no fire reaches the work</span><p>Still spend <strong>{money(investment)}</strong>.<br/>Avoid <strong>$0</strong> in wildfire damage.</p></div>
    </div>

    <div className="fire-cost-result" aria-live="polite" aria-atomic="true">
      <h4>Average the possible futures.</h4>
      <p>Only {chance} of the 100 futures receive the assumed {money(damageReduction)} benefit. Spread that benefit across all 100, and the average damage avoided is <strong>{money(avoided)}</strong>.</p>
      <p className="fire-cost-equation">{chance}% × {money(damageReduction)} = <strong>{money(avoided)}</strong></p>
      <div className="fire-cost-balance"><div><span>Average damage avoided</span><strong>{money(avoided)}</strong></div><span aria-hidden="true">−</span><div><span>Project cost</span><strong>{money(investment)}</strong></div></div>
      <p className="fire-cost-verdict">{difference === 0
        ? <>The two amounts are equal: the project <strong>breaks even</strong> in this damage-only calculation.</>
        : difference > 0
          ? <>On average, damage avoided exceeds project cost by <strong>{money(difference)}</strong>.</>
          : <>On average, damage avoided falls short of project cost by <strong>{money(-difference)}</strong>.</>}</p>
      <p className="fire-cost-threshold">{breakEven > 100
        ? <>Even a 100% chance would not cover the project cost with this amount of damage avoided.</>
        : <>To cover the project cost, the chance of fire reaching the work would need to be <strong>{breakEven.toLocaleString("en-US", { maximumFractionDigits: 1 })}%</strong>.</>}</p>
      <p className="fire-cost-meaning">This is an average across possible futures. In this simplified example, the place actually avoids either $0 or {money(damageReduction)} in damage—not the average amount.</p>
    </div>
    <p className="fire-cost-scope">A project can also improve habitat or meet other goals without a later wildfire. Those benefits are outside this damage-only calculation.</p>
    <details><summary>What would we need to use real Oregon numbers?</summary><p>Itemized project costs, upkeep schedules, a local estimate of the chance fire reaches the work, and evidence of how much damage the project could prevent. Both choices need the same place and time period. A fuller comparison also includes when money is spent, smoke, treatment risks, response costs and ecological outcomes.</p><a href="https://research.fs.usda.gov/treesearch/55535">Study of fire reaching treatments and potential savings ↗</a></details>
    <noscript><style>{".fire-cost-controls{display:none}"}</style><p>The starting example is shown above. Enable JavaScript to change its three assumptions.</p></noscript>
  </div>;
}
