/**
 * City of Portland Adopted Budget — source documents.
 *
 * Everything fiscal-year-specific lives here and in `expectations.<fy>.ts`.
 * The parsers themselves are year-agnostic: column labels are read off each
 * table's own header row, never hardcoded.
 *
 * Download with:  npx tsx ingest/budget/fetch-books.ts
 * PDFs land in runtime-data/ (gitignored). checksums.lock.json IS committed —
 * it is the only thing in git that pins what we extracted from.
 */

export const FY = "2026-27";
export const BOOK_TITLE = "FY 2026-27 Adopted Budget";
export const PUBLISHER = "Portland City Budget Office";
export const BUDGET_PAGE =
  "https://www.portland.gov/budget/2026-2027-budget/development/adopted";

/** Fiscal years, in the column order every table in the book uses. */
export const YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"] as const;
export type FiscalYear = (typeof YEARS)[number];

/** What each column represents. Actuals are closed books; adopted is the plan. */
export const YEAR_BASIS: Record<FiscalYear, "actuals" | "revised" | "adopted"> = {
  "2023-24": "actuals",
  "2024-25": "actuals",
  "2025-26": "revised",
  "2026-27": "adopted",
};

export interface BookSource {
  key: string;
  volume: 1 | 2 | null;
  title: string;
  url: string;
  /** Only volumes 1 and 2 are parsed; the rest are archived for reference. */
  parse: boolean;
  expectedPages?: number;
  file: string;
}

const DOC = "https://www.portland.gov/budget/2026-2027-budget/documents";

export const SOURCES: BookSource[] = [
  {
    key: "vol1",
    volume: 1,
    title: "FY 2026-27 Adopted Budget, Volume 1 — City Summaries and Fund Detail",
    url: `${DOC}/fy-26-27-adopted-budget-book-volume-1-0/download`,
    parse: true,
    expectedPages: 388,
    file: "vol1-adopted.pdf",
  },
  {
    key: "vol2",
    volume: 2,
    title: "FY 2026-27 Adopted Budget, Volume 2 — Bureau and Program Detail",
    url: `${DOC}/fy-26-27-adopted-budget-book-volume-2/download`,
    parse: true,
    expectedPages: 1090,
    file: "vol2-adopted.pdf",
  },
  {
    key: "amendments",
    volume: null,
    title: "FY 26-27 Budget Amendments — Only Passed Amendments",
    url: `${DOC}/fy-26-27-budget-amendments-only-passed-amendments/download`,
    parse: false,
    file: "amendments-passed.pdf",
  },
  {
    key: "supplemental",
    volume: null,
    title: "July 2026 Supplemental Budget",
    url: `${DOC}/july-2026-supplemental-budget/download`,
    parse: false,
    file: "supplemental-2026-07.pdf",
  },
];

/** runtime-data/budget/fy<FY>/... — gitignored. */
export const ROOT = `runtime-data/budget/fy${FY}`;
export const PDF_DIR = `${ROOT}/pdf`;
export const TEXT_DIR = `${ROOT}/text`;
export const PARSED_DIR = `${ROOT}/parsed`;
export const REPORTS_DIR = `${ROOT}/reports`;

export const LOCK_PATH = "ingest/budget/checksums.lock.json";

export interface LockEntry {
  sha256: string;
  bytes: number;
  pages: number;
  pdfCreated: string | null;
  url: string;
}
export interface Lock {
  fy: string;
  lockedAt: string;
  files: Record<string, LockEntry>;
}
