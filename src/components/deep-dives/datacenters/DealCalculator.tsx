"use client";
import { useState } from "react";
import { ArrowDownToLine, ArrowRight, RotateCcw, SlidersHorizontal, MapPin } from "lucide-react";
import { dealMath, cashFlowCsv, DEFAULT_INPUTS, type DealInputs, type Ledger } from "@/lib/datacenters/engine";
import { DEAL_EXAMPLES } from "@/lib/datacenters/examples";
import { ReceiptBars, MoneyTimeline, money } from "./FiscalCharts";

type NumericKey = Exclude<keyof DealInputs, "paymentMode">;
const INPUT_LABELS: Record<NumericKey, string> = {
  taxableValueM: "Taxable value ($M)", taxRatePct: "Property tax rate (%)", abatementYears: "Years of tax break",
  feeM: "Annual payment ($M)", paymentSharePct: "Share of full tax (%)", minimumPaymentM: "Annual payment floor ($M)",
  laterPaymentSharePct: "Later share of full tax (%)", paymentStepYear: "Higher share starts in year",
  upfrontM: "One-time deal payment ($M)", jobs: "Permanent jobs", wageK: "Annual wage ($K)", incomeTaxPct: "State income tax rate (%)",
  buildWithoutPct: "Chance it gets built without a break (%)", buildWithPct: "Chance it gets built with a deal (%)",
  horizonYears: "Years to compare", operatingYears: "Years the site operates", discountPct: "Discount rate (%)",
  baselineM: "No-build land taxes per year ($M)", serviceCostM: "Public costs per year ($M)",
  constructionLocalM: "Local construction tax receipts ($M)", constructionStateM: "State construction tax receipts ($M)"
};
export default function DealCalculator() {
  const [exampleId, setExampleId] = useState(DEAL_EXAMPLES[0].id);
  const [inp, setInp] = useState<DealInputs>({ ...DEAL_EXAMPLES[0].inputs });
  const [ledger, setLedger] = useState<Ledger>("local");
  const example = DEAL_EXAMPLES.find(e => e.id === exampleId);
  const result = dealMath(inp, ledger);
  const threshold = result.breakEvenP;
  const inRange = threshold !== null && threshold >= 0 && threshold <= 1;
  const tied = Math.abs(result.net) < .000001;
  function change(key: NumericKey, value: number) { setInp(prev => ({ ...prev, [key]: value })); }
  function choose(id: string) {
    const chosen = DEAL_EXAMPLES.find(e => e.id === id);
    setExampleId(id); setInp({ ...(chosen?.inputs ?? DEFAULT_INPUTS) }); setLedger("local");
  }
  function provenance(key: keyof DealInputs) {
    if (example && inp[key] !== example.inputs[key]) return "Edited";
    return example?.documented.includes(key) ? "Document-based" : "Assumption";
  }
  function field(key: NumericKey, min: number, max: number, step: number, help?: string) {
    const kind = provenance(key);
    return <label className="dc-field" key={key}>
      <span className="dc-field-label">{INPUT_LABELS[key]}</span>
      <span className="dc-input-wrap"><input type="number" aria-label={INPUT_LABELS[key]} value={inp[key]} min={min} max={max} step={step}
        onChange={e => { const n = e.currentTarget.valueAsNumber; if (Number.isFinite(n)) change(key, Math.min(max, Math.max(min, step === 1 ? Math.round(n) : n))); }} /></span>
      <span className={"dc-input-source " + (kind === "Document-based" ? "is-sourced" : "")}>{kind}</span>
      {help && <span className="dc-input-help">{help}</span>}
    </label>;
  }
  function download() {
    const note = "# Example=" + (example?.title ?? "Custom") + "; scenario, not audited actual collections\n";
    const url = URL.createObjectURL(new Blob([note + cashFlowCsv(inp, ledger)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "data-center-fiscal-scenario.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="dc-calculator" data-testid="deal-calculator">
    <div className="dc-calc-start"><span className="dc-kicker">01 / Pick a starting point</span><p>Real terms. Editable assumptions. See what changes the answer.</p></div>
    <div className="dc-examples" role="group" aria-label="Example agreements">
      {DEAL_EXAMPLES.map(e => <button key={e.id} type="button" onClick={() => choose(e.id)} aria-pressed={e.id === exampleId} data-testid={"example-" + e.id} className="dc-example">
        <span className="dc-example-place"><MapPin size={13} /> {e.place}<span className="dc-example-arrow"><ArrowRight size={18} /></span></span>
        <strong>{e.title}</strong><span>{e.short}</span><small>{e.tag}</small>
      </button>)}
    </div>
    <div className="dc-example-note"><span className="dc-note-marker">i</span><p>These are <strong>scenarios, not audited project returns.</strong> The Dalles examples use a signed agreement; Hillsboro uses published program rules. Unknowns are filled with visible assumptions.</p></div>

    <div className="dc-calc-grid">
      <div className="dc-calc-controls" id="dc-assumptions">
        <div className="dc-step-heading"><span className="dc-kicker">02 / Test the big unknown</span><button type="button" className="dc-text-button" onClick={() => choose("custom")}>Start custom</button></div>
        <h3>Would it be built anyway?</h3>
        <p className="dc-small">The more likely the project is without a tax break, the harder the break is to justify.</p>
        <div className="dc-probability">
          <div><label htmlFor="dc-build-chance">Chance of building without a break</label><output htmlFor="dc-build-chance">{inp.buildWithoutPct.toLocaleString("en-US", { maximumFractionDigits: 1 })}<span>%</span></output></div>
          <input id="dc-build-chance" type="range" min="0" max="100" step="1" value={inp.buildWithoutPct} aria-label={INPUT_LABELS.buildWithoutPct} onChange={e => change("buildWithoutPct", Number(e.target.value))} />
          <div className="dc-range-labels"><span>Needs the deal</span><span>Would build anyway</span></div>
          <div className="dc-probability-options">{[[25, "Unlikely"], [50, "50 / 50"], [100, "Certain"]].map(([n, label]) => <button type="button" key={n} aria-pressed={inp.buildWithoutPct === n} onClick={() => change("buildWithoutPct", Number(n))}>{label}</button>)}</div>
          <p className="dc-fine">An assumption you control. We do not know this probability for these sites.</p>
        </div>
        <a className="dc-mobile-jump" href="#dc-comparison">See the comparison <ArrowRight size={15}/></a>
        <div className="dc-main-inputs">
          {field("taxableValueM", 0, 20000, 10)}
          {field("taxRatePct", 0, 5, .05)}
          {field("abatementYears", 0, 30, 1)}
          {field("horizonYears", 1, 50, 1)}
        </div>
        <details className="dc-disclosure">
          <summary><SlidersHorizontal size={16} /> Payments, jobs and other assumptions</summary>
          <div className="dc-detail-body">
            <div className="dc-main-inputs">
              <label className="dc-field"><span className="dc-field-label">Payment rule</span><select aria-label="Payment rule" value={inp.paymentMode} onChange={e => setInp(prev => ({ ...prev, paymentMode: e.target.value as DealInputs["paymentMode"] }))}><option value="fixed">Fixed annual payment</option><option value="share">Share of full property tax</option><option value="stepped-share">Share that changes later</option></select><span className="dc-input-source">{provenance("paymentMode")}</span></label>
              {inp.paymentMode === "fixed" ? field("feeM", 0, 100, .1, "Total taxes and fees; count each payment once.") : field("paymentSharePct", 0, 100, 1)}
              {inp.paymentMode === "stepped-share" && <>{field("laterPaymentSharePct", 0, 100, 1)}{field("paymentStepYear", 1, 50, 1)}</>}
              {inp.paymentMode !== "fixed" && field("minimumPaymentM", 0, 100, .1, "A minimum total, not an extra fee.")}
              {field("upfrontM", 0, 1000, .1, "Counted in year 1 if built.")}
              {field("buildWithPct", 0, 100, 1)}
              {field("operatingYears", 0, 50, 1)}
              {field("discountPct", 0, 15, .5)}
              {field("baselineM", 0, 100, .01)}
              {field("serviceCostM", 0, 100, .1, "Zero means unpriced. Enter costs for the view selected.")}
              {field("constructionLocalM", 0, 1000, .1)}
              {field("constructionStateM", 0, 1000, .1, "Used in the Oregon view only.")}
              {field("jobs", 0, 10000, 1)}
              {field("wageK", 0, 1000, 1)}
              {field("incomeTaxPct", 0, 100, .5, "Jobs, wages and income tax affect the Oregon view only.")}
            </div>
          </div>
        </details>
        <details className="dc-disclosure"><summary>Where these example numbers come from</summary><div className="dc-detail-body dc-small">
          {example ? <><p>{example.basis}</p><p>{example.assumptions}</p><a href={example.source}>Read the original source ↗</a></> : <p>All custom starting values are illustrative assumptions.</p>}
          <p>Every example starts with the same 50% chance without a break and 100% with a deal, 30 years of operation, a 4% discount rate and $50,000 in annual land receipts. Jobs, wages and tax rates in the Oregon view are illustrative. Costs and construction receipts start at zero because they are unpriced.</p>
        </div></details>
        <div className="dc-calc-tools"><button type="button" onClick={() => choose(exampleId)}><RotateCcw size={15} /> Reset example</button><button type="button" onClick={download}><ArrowDownToLine size={15} /> Download CSV</button></div>
      </div>

      <div className="dc-calc-results" id="dc-comparison">
        <div className="dc-result-sticky">
          <div className="dc-step-heading"><span className="dc-kicker">03 / Compare the outcomes</span><span className="dc-view-years">{inp.horizonYears} years</span></div>
          <div className="dc-ledger-switch" role="group" aria-label="Fiscal perspective">
            <button type="button" aria-pressed={ledger === "local"} onClick={() => setLedger("local")}>Local public money</button>
            <button type="button" aria-pressed={ledger === "statewide"} onClick={() => setLedger("statewide")}>Local + Oregon</button>
          </div>
          <p className="dc-fine">{ledger === "local" ? "Host-area public receipts, before school-funding transfers." : "Adds estimated state income tax and state construction receipts."}</p>
          <div className={"dc-verdict " + (result.net < -.000001 ? "is-negative" : "")} aria-live="polite" aria-atomic="true">
            <span className="dc-verdict-label">{tied ? "The options break even" : result.net > 0 ? "The deal comes out ahead" : "No tax break comes out ahead"}</span>
            <strong data-testid="net-result">{money(result.net)}</strong>
            <p>{tied ? "The two options bring in the same modeled public money." : "The deal brings in " + money(Math.abs(result.net)) + (result.net > 0 ? " more" : " less") + " than offering no break."} <span>With these assumptions, after entered costs.</span></p>
          </div>
          <ReceiptBars result={result} />
          <div className="dc-tipping-point">
            <div><span>The break-even point</span><strong data-testid="break-even">{inRange ? (threshold! * 100).toFixed(1) + "%" : "Outside this range"}</strong></div>
            {inRange ? <>
              <div className="dc-threshold-track" aria-hidden="true"><span style={{ width: threshold! * 100 + "%" }} /><i style={{ left: threshold! * 100 + "%" }} /><b style={{ left: inp.buildWithoutPct + "%" }} /></div>
              <div className="dc-range-labels"><span>Deal ahead</span><span>No break ahead</span></div>
              <p>Below <strong>{(threshold! * 100).toFixed(1)}%</strong> chance of building anyway, the deal wins. Above it, no break wins. The dot is your assumption.</p>
              <button type="button" className="dc-text-button" onClick={() => change("buildWithoutPct", threshold! * 100)}>Set to break-even <ArrowRight size={14} /></button>
            </> : <p>{threshold === null ? "No standard threshold: the fully taxed project does not beat leaving the land as it is after entered costs." : threshold! > 1 ? "The deal leads throughout the 0–100% range under these inputs." : "The deal trails throughout the 0–100% range under these inputs."}</p>}
          </div>
          <MoneyTimeline result={result} abatementYears={inp.abatementYears} />
          <a className="dc-mobile-jump" href="#dc-assumptions">Change the assumptions ↑</a>
          <p className="dc-fine dc-model-limit">This is a money comparison. Water, pollution, alternative land uses and cleanup still need their own checks. Zero entered costs are unpriced, not proven to be zero.</p>
        </div>
      </div>
    </div>
    <details className="dc-disclosure dc-calc-method"><summary>See the full numbers and calculation</summary><div className="dc-detail-body dc-method-grid">
      <dl>{[["Expected deal value", result.evSign], ["Expected no-break value", result.evHold], ["Full property tax if built", result.pvFullTax], ["Deal property receipts if built", result.pvDealProperty], ["Included post-abatement property tax", result.pvPostAbatement], ["Included state income tax if built", result.pvIncomeTax], ["Included construction tax receipts if built", result.pvConstruction], ["Entered public costs if built", result.pvCosts]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{money(value as number)}</dd></div>)}</dl>
      <div className="dc-small"><p><strong>Compare like with like.</strong> Both options use the same facility, start year, operating life and constant taxable value. Full tax = taxable value × tax rate. The deal uses the entered payment rule during the break, then full tax.</p>
      <p>Public costs are subtracted. Construction receipts and an upfront payment enter once in year 1. Each annual amount is divided by (1 + discount rate) to the power of that year, so future money is expressed in today&apos;s dollars.</p>
      <p>Each outcome is weighted by its chance of being built; otherwise baseline land taxes apply. After closure only baseline land taxes remain. Break-even chance = (expected deal − baseline) ÷ (fully-taxed build − baseline), when that denominator is positive.</p>
      <p>The Oregon view adds jobs × wage × effective income-tax rate, without accounting for displaced jobs or credits. School transfers, changing assessments, corporate taxes, utility franchise fees, alternative development and environmental effects are not fully modeled.</p></div>
    </div></details>
  </div>;
}
