"use client";
import { useState } from "react";
import { dealMath, cashFlowCsv, DEFAULT_INPUTS, type DealInputs, type Ledger } from "@/lib/datacenters/engine";

type NumericKey = Exclude<keyof DealInputs, "paymentMode">;
const money = (m: number) => (m < 0 ? "−" : "") + "$" + Math.abs(m).toFixed(1) + "M";
const inputClass = "mt-1 w-full rounded-sm border border-[var(--color-sage)] bg-white px-3 py-2 text-[var(--color-ink)] font-mono";
export default function DealCalculator() {
  const [inp, setInp] = useState<DealInputs>({ ...DEFAULT_INPUTS });
  const [ledger, setLedger] = useState<Ledger>("local");
  const result = dealMath(inp, ledger);
  function field(key: NumericKey, label: string, min: number, max: number, step: number, help?: string) {
    return <label className="block text-sm" key={key}>
      <span className="font-semibold">{label}</span>
      <input type="number" className={inputClass} aria-label={label} value={inp[key]}
        min={min} max={max} step={step}
        onChange={e => {
          const value = e.currentTarget.valueAsNumber;
          if (Number.isFinite(value)) setInp(prev => ({ ...prev, [key]: Math.min(max, Math.max(min, step === 1 ? Math.round(value) : value)) }));
        }} />
      {help && <span className="mt-1 block text-xs text-[var(--color-ink-muted)]">{help}</span>}
    </label>;
  }
  function download() {
    const url = URL.createObjectURL(new Blob([cashFlowCsv(inp, ledger)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "data-center-fiscal-scenario.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const threshold = result.breakEvenP;
  const thresholdText = threshold === null ? "No standard threshold" :
    threshold < 0 ? "Deal below baseline at every probability" :
    threshold > 1 ? "Deal ahead across 0–100%" : (threshold * 100).toFixed(1) + "%";
  return <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-8" data-testid="deal-calculator">
    <h3 className="font-editorial-normal text-2xl text-[var(--color-canopy)]">Explore a fiscal scenario</h3>
    <p className="mt-2 text-sm leading-relaxed">Every starting value is an illustrative assumption. No regional build probability is measured here.
      Replace the inputs with the agreement and assessor&apos;s estimates before applying this to a project.</p>
    <div className="my-5 flex flex-wrap gap-2" role="group" aria-label="Fiscal perspective">
      {([["local", "Local public receipts"], ["statewide", "Combined Oregon receipts"]] as const).map(([key, label]) =>
        <button key={key} type="button" aria-pressed={ledger === key} onClick={() => setLedger(key)}
          className={`rounded-sm border px-4 py-2 text-sm ${ledger === key ? "bg-[var(--color-canopy)] text-white border-[var(--color-canopy)]" : "border-[var(--color-sage)]"}`}>{label}</button>)}
    </div>
    <p className="mb-5 text-xs text-[var(--color-ink-muted)]">
      Local combines the host area&apos;s public recipients before school equalization. Combined adds modeled state income taxes and state construction receipts.
      Neither view allocates school-funding transfers, measures private income, or counts every tax.
    </p>
    <div className="grid gap-8 xl:grid-cols-2">
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("taxableValueM", "Assumed taxable value ($M)", 0, 20000, 10, "Held constant while operating; not a fixed share of investment.")}
          {field("taxRatePct", "Effective property tax rate (%)", 0, 5, 0.05)}
          {field("abatementYears", "Abatement years", 0, 30, 1)}
          {field("horizonYears", "Analysis horizon (years)", 1, 50, 1, "Try 15, 30 and 40 years.")}
          <label className="block text-sm"><span className="font-semibold">Payments during abatement</span>
            <select aria-label="Payments during abatement" className={inputClass} value={inp.paymentMode}
              onChange={e => setInp(prev => ({ ...prev, paymentMode: e.target.value as DealInputs["paymentMode"] }))}>
              <option value="fixed">Fixed annual total</option><option value="share">Share of full property tax</option>
            </select>
          </label>
          {inp.paymentMode === "fixed" ? field("feeM", "Annual public payment ($M)", 0, 100, 0.1, "All included property taxes and fees; do not add them twice.") :
            field("paymentSharePct", "Annual payment share (%)", 0, 100, 1)}
          {inp.paymentMode === "share" && field("minimumPaymentM", "Minimum annual payment ($M)", 0, 100, 0.1, "Floor applies to the total, not an additional fee.")}
          {field("buildWithoutPct", "Build probability without break (%)", 0, 100, 1, "User assumption; 50% is not a research estimate.")}
          {field("buildWithPct", "Build probability with deal (%)", 0, 100, 1, "An approved deal does not guarantee construction.")}
        </div>
        <details className="mt-5 border-t border-[var(--color-parchment)] pt-4">
          <summary className="cursor-pointer font-semibold text-sm py-2">Adjust costs, operating life and other receipts</summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {field("operatingYears", "Operating life (years)", 0, 50, 1, "Both build scenarios use this life; then only baseline receipts remain.")}
            {field("discountPct", "Real discount rate (%)", 0, 15, 0.5)}
            {field("baselineM", "Annual no-build land receipts ($M)", 0, 100, 0.01)}
            {field("serviceCostM", "Annual incremental public costs ($M)", 0, 100, 0.1, "Enter costs for the selected perspective; zero means unpriced.")}
            {field("upfrontM", "One-time deal payment ($M)", 0, 1000, 0.1, "Simplified to year 1, conditional on construction.")}
            {field("constructionLocalM", "Local construction tax receipts ($M)", 0, 1000, 0.1, "One-time public receipts, not construction spending.")}
            {field("constructionStateM", "State construction tax receipts ($M)", 0, 1000, 0.1, "Only used in combined Oregon view.")}
            {field("jobs", "Permanent jobs", 0, 10000, 1)}
            {field("wageK", "Average annual wage ($K)", 0, 1000, 1)}
            {field("incomeTaxPct", "Effective state income tax (%)", 0, 100, 0.5, "Simplified payroll estimate; excludes displacement and tax credits.")}
          </div>
        </details>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => { setInp({ ...DEFAULT_INPUTS }); setLedger("local"); }} className="rounded-sm border border-[var(--color-sage)] px-3 py-2 text-sm">Reset assumptions</button>
          <button type="button" onClick={download} className="rounded-sm bg-[var(--color-canopy)] px-3 py-2 text-sm text-white">Download cash flows (CSV)</button>
        </div>
      </div>
      <div className="rounded-sm bg-[var(--color-paper-warm)] p-5 sm:p-6">
        <div aria-live="polite" aria-atomic="true">
          <p className="font-mono text-xs uppercase tracking-wide">Conditional fiscal comparison · {inp.horizonYears} years</p>
          <p className="mt-3 text-3xl font-mono font-bold text-[var(--color-canopy)]" data-testid="net-result">{money(result.net)}</p>
          <p className="mt-2 text-sm">Expected deal receipts minus expected receipts without a break, after entered public costs.
            {Math.abs(result.net) < 0.000001 ? " The options tie under these assumptions." : result.net > 0 ? " The entered assumptions favor the deal." : " The entered assumptions favor offering no break."}</p>
          <p className="mt-4 text-sm font-semibold">Break-even probability without a break: {thresholdText}</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{threshold === null ?
            "The fully taxed build does not exceed baseline receipts after entered costs. Compare the expected values directly; no normal cutoff applies." :
            threshold >= 0 && threshold <= 1 ? "Below this cutoff the deal has the higher modeled value; above it, no break does. This is not an estimate of the actual probability." :
            "The threshold lies outside the possible probability range. This is a property of the inputs, not a location forecast."}</p>
        </div>
        <dl className="mt-5 space-y-2 text-sm">
          {[
            ["Expected deal value", result.evSign], ["Expected no-break value", result.evHold],
            ["Full property tax if built", result.pvFullTax], ["Deal property receipts if built", result.pvDealProperty],
            ["Included post-abatement property tax", result.pvPostAbatement],
            ["Included state income tax if built", result.pvIncomeTax],
            ["Included construction tax receipts if built", result.pvConstruction],
            ["Entered public costs if built", result.pvCosts],
          ].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-[var(--color-parchment)] pb-2">
            <dt>{label}</dt><dd className="font-mono whitespace-nowrap">{money(value as number)}</dd></div>)}
        </dl>
        <p className="mt-3 text-xs">All results are discounted present values in real dollars. A 15-year horizon with a 15-year exemption includes no post-exemption operating revenue.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="text-left font-semibold mb-2">Sensitivity to the uncertain build probability</caption>
            <thead><tr><th scope="col" className="py-2 pr-3">Without break</th><th scope="col">Deal minus no break</th></tr></thead>
            <tbody>{[0, 25, 50, 75, 100].map(p => <tr key={p} className="border-t border-[var(--color-parchment)]">
              <th scope="row" className="py-2 font-normal">{p}%</th><td className="font-mono">{money(dealMath({ ...inp, buildWithoutPct: p }, ledger).net)}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed border-t border-[var(--color-parchment)] pt-4">
          Unpriced: environmental effects, alternative development, closure cleanup, changing assessments, corporate taxes and utility franchise fees.
          Jobs, receipts and costs stay constant while operating. The model assumes the same facility and start year in both build scenarios.
          A positive result cannot establish that a project passes the six conditions.
        </p>
      </div>
    </div>
    <details className="mt-6 border-t border-[var(--color-parchment)] pt-4">
      <summary className="cursor-pointer font-semibold text-sm py-2">Read the calculation</summary>
      <div className="mt-3 space-y-2 text-sm leading-relaxed">
        <p>For each year: full property tax = taxable value × tax rate. During the exemption, the deal pays the entered total or the greater of the tax share and payment floor; afterward it pays full tax. State income tax = jobs × wages × effective rate, in the combined view only.</p>
        <p>Subtract entered service costs, add construction receipts and the deal payment once in year 1, then discount each flow by (1 + discount rate) raised to that year. No-build land receipts apply if the project is not built and after assumed closure.</p>
        <p>Expected deal = q × deal-if-built + (1 − q) × no-build baseline. Expected no-break = p × fully-taxed-if-built + (1 − p) × baseline. Here q and p are the two probabilities you enter.</p>
        <p>Break-even p = (expected deal − baseline) / (fully-taxed-if-built − baseline), provided the denominator is positive. The CSV includes every input and annual flow.</p>
      </div>
    </details>
  </div>;
}
