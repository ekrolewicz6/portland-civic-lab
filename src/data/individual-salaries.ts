// Individual employee salary roster — v3, public-records-gated.
//
// This layer is EMPTY until the City's employee wage roster is obtained via a
// public records request (draft: docs/prr-drafts/city-employee-salary-roster.md).
// Once the GovQA CSV/Excel arrives, run `npx tsx ingest/load-salary-roster.ts
// <file.csv>` to populate `src/data/individual-salaries.ts` from it. The bureau
// pages read `INDIVIDUAL_SALARIES[bureauId]` and only render the individual
// layer when `INDIVIDUAL_SALARIES_AVAILABLE` is true, so nothing breaks while
// it is unfilled.
//
// Privacy: the loader applies a Texas-Tribune-style threshold — names are kept
// for elected/appointed officials and positions above the citywide median, and
// suppressed (set to null) below it. Change `NAME_THRESHOLD` in the loader to
// adjust.

export const INDIVIDUAL_SALARIES_AVAILABLE = false;
/** Set by the loader when populated, e.g. "FY2024-25". */
export const INDIVIDUAL_SALARIES_FY = "";
export const INDIVIDUAL_SALARIES_SOURCE =
  "City of Portland public records request (GovQA)";

export interface EmployeePay {
  /** null = name suppressed below the disclosure threshold (privacy policy) */
  name: string | null;
  classification: string;
  bureauId: string;
  regularGross: number;
  overtime: number;
  otherEarnings: number;
}

/** Keyed by org-chart bureau id (e.g. "ppb"). Empty until the roster is loaded. */
export const INDIVIDUAL_SALARIES: Record<string, EmployeePay[]> = {};
