/**
 * The deal-pricing model for the data centers deep-dive.
 *
 * The core idea: an abatement only *costs* a community the forgone taxes if
 * the facility would have been built there anyway. So the honest way to price
 * a deal is expected value over the counterfactual:
 *
 *   EV(sign the deal)  = PV(fees during abatement)
 *                      + PV(full taxes after abatement)
 *                      + PV(income taxes from the jobs)          [state ledger]
 *
 *   EV(hold firm)      = p × [PV(full taxes) + PV(income taxes)]
 *                      + (1 − p) × PV(baseline land revenue ≈ 0)
 *
 * where p = the probability the company builds with NO tax break ("leverage").
 * The deal pencils out exactly when p is below the break-even probability
 *
 *   p* = EV(sign) / [PV(full taxes) + PV(income taxes)]
 *
 * High-leverage places (Hillsboro: the fiber cables are here) have high true p,
 * so almost no abatement clears the bar. Low-leverage places (Boardman: the
 * land across the river is just as good) have low p, so a deep abatement can
 * still beat holding firm. All flows are real (inflation-adjusted) and
 * discounted; see ASSUMPTIONS for what's simplified.
 */

export const ASSUMPTIONS = {
  /** Analysis horizon, years — matches the long-term rural enterprise-zone term. */
  horizonYears: 15,
  /** Real discount rate for public cash flows. */
  discountRate: 0.04,
  /**
   * Steady-state taxable value as a share of stated on-site investment.
   * Servers (most of the investment) depreciate over ~5 years but are
   * continuously refreshed; buildings depreciate slowly. 0.7 approximates the
   * long-run average of that cycle under Oregon assessment rules.
   */
  taxableShare: 0.7,
  /** Effective Oregon personal income tax at data-center wages. */
  effectiveIncomeTax: 0.065,
} as const;

export interface DealInputs {
  investmentM: number; // total on-site investment, $M (building + equipment)
  taxRatePct: number; // effective property tax rate, % of taxable value
  abatementYears: number; // 0–15
  feeM: number; // fee-in-lieu, $M/yr during the abatement
  jobs: number; // permanent jobs
  wageK: number; // average wage, $K/yr
  leveragePct: number; // p: chance they build with NO break, 0–100
}

export interface DealResult {
  /** PV of property taxes if fully taxed for the whole horizon, $M. */
  pvFullTax: number;
  /** PV of what the deal actually pays (fees + post-abatement taxes), $M. */
  pvDealProperty: number;
  /** PV of state income taxes from the permanent jobs, $M. */
  pvIncomeTax: number;
  /** PV of property taxes forgone under the deal, $M. */
  pvForgone: number;
  /** EV of signing, $M. */
  evSign: number;
  /** EV of holding firm at the user's leverage, $M. */
  evHold: number;
  /** evSign − evHold, $M. Positive = signing beats holding firm. */
  net: number;
  /** Break-even leverage probability, 0–1. */
  breakEvenP: number;
  /** PV of forgone taxes per permanent job over the horizon, $. */
  forgonePerJob: number;
  /** Same, per job per year, $. */
  forgonePerJobYear: number;
}

/** PV of $1/yr for n years at rate d (ordinary annuity). */
export function annuity(d: number, n: number): number {
  if (n <= 0) return 0;
  return (1 - Math.pow(1 + d, -n)) / d;
}

export function dealMath(inp: DealInputs): DealResult {
  const { horizonYears: N, discountRate: d, taxableShare, effectiveIncomeTax } = ASSUMPTIONS;
  const abateYrs = Math.min(Math.max(inp.abatementYears, 0), N);

  const fullTaxPerYear = inp.investmentM * taxableShare * (inp.taxRatePct / 100); // $M/yr
  const pvFullTax = fullTaxPerYear * annuity(d, N);
  const pvFees = inp.feeM * annuity(d, abateYrs);
  const pvPostAbatement = fullTaxPerYear * (annuity(d, N) - annuity(d, abateYrs));
  const pvDealProperty = pvFees + pvPostAbatement;

  const incomeTaxPerYear = (inp.jobs * inp.wageK * 1000 * effectiveIncomeTax) / 1_000_000; // $M/yr
  const pvIncomeTax = incomeTaxPerYear * annuity(d, N);

  const evSign = pvDealProperty + pvIncomeTax;
  const p = Math.min(Math.max(inp.leveragePct / 100, 0), 1);
  // Baseline (no facility) land revenue is ~0 for dryland/industrial-zoned sites.
  const evHold = p * (pvFullTax + pvIncomeTax);

  const denominator = pvFullTax + pvIncomeTax;
  const breakEvenP = denominator > 0 ? Math.min(evSign / denominator, 1) : 0;

  const pvForgone = pvFullTax - pvDealProperty;
  const forgonePerJob = inp.jobs > 0 ? (pvForgone * 1_000_000) / inp.jobs : 0;

  return {
    pvFullTax,
    pvDealProperty,
    pvIncomeTax,
    pvForgone,
    evSign,
    evHold,
    net: evSign - evHold,
    breakEvenP,
    forgonePerJob,
    forgonePerJobYear: forgonePerJob / N,
  };
}
