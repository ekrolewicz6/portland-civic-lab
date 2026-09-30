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
    short: "50% of full tax; at least $3 million a year",
    inputs: { ...common },
    documented: ["taxableValueM", "taxRatePct", "abatementYears", "paymentMode", "paymentSharePct", "minimumPaymentM", "upfrontM"],
    source: SOURCES.wascoAgreement.url,
    basis: "The signed agreement requires Project 1 to pay 50% of its full property tax bill, with a minimum annual payment of $3 million. It also requires a one-time $3 million payment. Exhibit A gives an example using $600 million of property value at a 1.10% tax rate. Those are illustration values, not actual assessed values used to set a tax bill.",
    assumptions: "We keep the illustrated property value and tax rate unchanged, count the one-time payment in year 1, and leave out scheduled payment increases. We choose the remaining values, including the chances of building, years of operation, jobs and costs, as assumptions you can change."
  },
  {
    id: "dalles-2", place: "The Dalles", title: "Google · Project 2", tag: "2021 agreement",
    short: "60% of full tax; at least $3 million a year",
    inputs: { ...common, paymentSharePct: 60 },
    documented: ["abatementYears", "paymentMode", "paymentSharePct", "minimumPaymentM", "upfrontM"],
    source: SOURCES.wascoAgreement.url,
    basis: "The same agreement requires Project 2 to pay 60% of full property tax, with a $3 million annual minimum and a one-time $3 million payment. We reuse the $600 million value and 1.10% rate to show what changes when the payment share rises. These are not estimates of Project 2’s actual property value or tax rate.",
    assumptions: "The property value, tax rate and other values are assumptions for this comparison. We leave out scheduled payment increases. You can change the values to test a different possibility."
  },
  {
    id: "hillsboro", place: "Hillsboro", title: "A five-year tax break", tag: "Program illustration",
    short: "An example using the highest allowed fees",
    inputs: { ...common, abatementYears: 5, paymentMode: "stepped-share", paymentSharePct: 33,
      laterPaymentSharePct: 65, paymentStepYear: 4, minimumPaymentM: 0, upfrontM: 0 },
    documented: ["abatementYears", "paymentMode", "paymentSharePct", "laterPaymentSharePct", "paymentStepYear"],
    source: "https://www.hillsboro-oregon.gov/community/data-centers",
    basis: "The city’s published program allows tax breaks lasting three to five years. This five-year example uses the highest community-service fees allowed: 33% of the taxes otherwise owed in years 1–3, then 50% in years 4–5. A further 15% school-support payment applies in years 4–5, bringing the modeled share to 65%. Actual agreements may charge less.",
    assumptions: "This example uses real program rules but does not represent a particular approved project. Property value, tax rate and the other inputs are assumptions. The calculation covers only property receiving the new tax break, holds its value steady and leaves out the application fee."
  }
];
