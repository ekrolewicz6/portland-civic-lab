import { DEFAULT_INPUTS, type DealInputs } from "./engine";
import { SOURCES } from "./data";

export interface DealExample {
  id: string; place: string; title: string; tag: string; short: string;
  inputs: DealInputs; documented: (keyof DealInputs)[];
  source: string; basis: string; assumptions: string;
}
const common: DealInputs = { ...DEFAULT_INPUTS, taxableValueM: 600, paymentMode: "share",
  feeM: 0, paymentSharePct: 50, minimumPaymentM: 3, upfrontM: 3 };
export const DEAL_EXAMPLES: DealExample[] = [
  {
    id: "dalles-1", place: "The Dalles", title: "Google · Project 1", tag: "2021 agreement",
    short: "50% of full tax, with a $3M floor",
    inputs: { ...common },
    documented: ["taxableValueM", "taxRatePct", "abatementYears", "paymentMode", "paymentSharePct", "minimumPaymentM", "upfrontM"],
    source: SOURCES.wascoAgreement.url,
    basis: "The signed Design LLC agreement uses a 50% share and $3M annual floor for Project 1, plus a $3M upfront payment. Exhibit A illustrates $600M of value at 1.10%. Those example values are not actual assessed values.",
    assumptions: "We hold the contract's illustration constant, place the upfront payment in year 1 and omit escalators. All probabilities, operating years, discounting, baseline receipts, jobs, wages and costs are assumptions."
  },
  {
    id: "dalles-2", place: "The Dalles", title: "Google · Project 2", tag: "2021 agreement",
    short: "60% of full tax, with a $3M floor",
    inputs: { ...common, paymentSharePct: 60 },
    documented: ["abatementYears", "paymentMode", "paymentSharePct", "minimumPaymentM", "upfrontM"],
    source: SOURCES.wascoAgreement.url,
    basis: "Project 2 in the same signed agreement uses a 60% share, $3M annual floor and $3M upfront payment. We reuse the $600M / 1.10% illustration to isolate the stronger payment term, not to value Project 2.",
    assumptions: "Value and rate are comparison assumptions here. All probabilities, operating years, discounting, baseline receipts, jobs, wages and costs are also assumed; escalators are omitted."
  },
  {
    id: "hillsboro", place: "Hillsboro", title: "A five-year tax break", tag: "Program illustration",
    short: "Maximum city fees + school support",
    inputs: { ...common, abatementYears: 5, paymentMode: "stepped-share", paymentSharePct: 33,
      laterPaymentSharePct: 65, paymentStepYear: 4, minimumPaymentM: 0, upfrontM: 0 },
    documented: ["abatementYears", "paymentMode", "paymentSharePct", "laterPaymentSharePct", "paymentStepYear"],
    source: "https://www.hillsboro-oregon.gov/community/data-centers",
    basis: "The city's published program allows 3–5 years. This five-year illustration uses the maximum community-service fee: 33% in years 1–3, then 50% plus 15% school support in years 4–5. Actual agreements may charge less.",
    assumptions: "This is a real program, not a named approved project. Value, tax rate, probabilities and other inputs are assumed. We model only the newly exempt assets, hold value steady and omit the application fee."
  }
];
