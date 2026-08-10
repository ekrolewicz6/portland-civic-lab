/**
 * Page splitting. `pdftotext` emits \f between pages, and we keep it — the page
 * number is what makes every extracted figure citable back to the PDF.
 */

export interface Page {
  /** 1-indexed, matches the PDF's own page numbering. */
  n: number;
  lines: string[];
  raw: string;
}

export function splitPages(txt: string): Page[] {
  const chunks = txt.split("\f");
  // pdftotext emits a trailing \f after the last page.
  if (chunks.length && chunks[chunks.length - 1].trim() === "") chunks.pop();
  return chunks.map((raw, i) => ({ n: i + 1, raw, lines: raw.split("\n") }));
}

/** First `k` non-blank lines — where the running breadcrumb header lives. */
export function topLines(p: Page, k = 4): string[] {
  const out: string[] = [];
  for (const l of p.lines) {
    if (!l.trim()) continue;
    out.push(l.trim());
    if (out.length >= k) break;
  }
  return out;
}
