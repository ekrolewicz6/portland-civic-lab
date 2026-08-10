/**
 * Column detection by RIGHT-EDGE alignment.
 *
 * The budget book right-aligns money columns, so a value token's end offset
 * lands at (or just left of) its header cell's end offset.
 *
 * This beats the obvious alternative — "take the last N numbers on the line" —
 * which breaks two ways this doesn't:
 *   - a blank cell shifts every later value one column left, silently
 *     reporting one year's number as another's;
 *   - a label containing digits ("9-1-1 Operations", "82nd Ave Area TIF")
 *     gets eaten as a value.
 * Anything that fails to land near a column edge is reported as an orphan
 * rather than guessed at.
 *
 * Headers wrap. Observed in Vol 2 (~757 tables):
 *
 *                                                     FY 2025-26 Revised
 *                     FY 2023-24 Actuals   FY 2024-25 Actuals              FY 2026-27 Adopted
 *                                                            Budget
 *
 * so a header is a BLOCK of up to 3 lines whose year-bands are unioned.
 */

export interface ColumnBand {
  /** "" for the Dollar/Percent Change columns, which map to no fiscal year. */
  year: string;
  basis: "actuals" | "revised" | "adopted" | "proposed" | "requested" | "change";
  /** Character offset of the end of the header cell; values align near here. */
  right: number;
  left: number;
}

const HEADER_CELL =
  /(?:FY\s+)?(\d{4}-\d{2})\s+(Actuals|Revised Budget|Revised|Adopted Budget|Adopted|Proposed Budget|Proposed|Requested Budget|Requested)\b/g;

/**
 * Citywide summary tables add "Dollar Change" / "Percent Change" columns.
 * They must be detected as bands — otherwise their values are orphaned or,
 * worse, snapped onto a neighbouring year column.
 */
const CHANGE_CELL = /(Dollar|Percent)\s+Change\b/g;

const BASIS: Record<string, ColumnBand["basis"]> = {
  actuals: "actuals",
  revised: "revised",
  "revised budget": "revised",
  adopted: "adopted",
  "adopted budget": "adopted",
  proposed: "proposed",
  "proposed budget": "proposed",
  requested: "requested",
  "requested budget": "requested",
};

/** Bands on a single line. May be partial when the header wraps. */
export function detectColumns(line: string): ColumnBand[] | null {
  HEADER_CELL.lastIndex = 0;
  const bands: ColumnBand[] = [];
  let m: RegExpExecArray | null;
  while ((m = HEADER_CELL.exec(line)) !== null) {
    bands.push({
      year: m[1],
      basis: BASIS[m[2].toLowerCase()] ?? "adopted",
      left: m.index,
      right: m.index + m[0].length,
    });
  }
  CHANGE_CELL.lastIndex = 0;
  let c: RegExpExecArray | null;
  while ((c = CHANGE_CELL.exec(line)) !== null) {
    bands.push({
      year: "",
      basis: "change",
      left: c.index,
      right: c.index + c[0].length,
    });
  }
  bands.sort((a, b) => a.right - b.right);
  return bands.length ? bands : null;
}

export interface HeaderBlock {
  bands: ColumnBand[];
  /** Index of the last line consumed by the header. */
  endIndex: number;
}

/**
 * Detect a header starting at or near `i`, unioning year-bands across a window
 * of lines so a wrapped header resolves to a complete band set.
 * Returns null if fewer than 2 distinct years are found.
 */
export function detectHeaderBlock(
  lines: string[],
  i: number,
  window = 3,
): HeaderBlock | null {
  const byYear = new Map<string, ColumnBand>();
  let end = i;
  for (let k = i; k < Math.min(lines.length, i + window); k++) {
    const found = detectColumns(lines[k]);
    if (!found) continue;
    for (const b of found) {
      // Widest right edge wins: a wrapped "Budget" fragment sits at or left of
      // the year fragment, and values align to the outermost edge.
      // Change columns are keyed by position since they share the "" year.
      const key = b.year || `change@${b.right}`;
      const prior = byYear.get(key);
      if (!prior || b.right > prior.right) byYear.set(key, b);
    }
    end = k;
  }
  if ([...byYear.values()].filter((b) => b.year).length < 2) return null;
  const bands = [...byYear.values()].sort((a, b) => a.right - b.right);
  return { bands, endIndex: end };
}

export interface Token {
  text: string;
  start: number;
  end: number;
}

const VALUE = /\(?-?\$?\s?[\d,]+(?:\.\d+)?\)?%?/g;

/** Numeric tokens at or right of `fromCol`. */
export function tokenize(line: string, fromCol = 0): Token[] {
  VALUE.lastIndex = 0;
  const out: Token[] = [];
  let m: RegExpExecArray | null;
  while ((m = VALUE.exec(line)) !== null) {
    if (!/\d/.test(m[0])) continue;
    if (m.index + m[0].length <= fromCol) continue;
    out.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  return out;
}

export interface Assignment {
  /** One slot per band; null where the row has no value in that column. */
  values: (string | null)[];
  /** Tokens that landed near no column edge — a hard error upstream. */
  orphans: Token[];
  /** Text left of the first column — the row's inline label, if any. */
  labelText: string;
}

/**
 * Assign numeric tokens to bands by nearest right edge.
 *
 * Tolerance adapts to the column pitch: a value may sit a few characters left
 * of its header's edge (a short "$0" under a long "FY 2026-27 Adopted"), but it
 * can never be closer to a neighbouring column than to its own, so the cap is
 * half the smallest inter-band gap.
 */
export function assignToColumns(line: string, bands: ColumnBand[]): Assignment {
  const firstLeft = bands[0].left;
  const labelText = line.slice(0, Math.max(0, firstLeft)).trim();
  const tokens = tokenize(line, Math.max(0, firstLeft - 2));

  let minGap = Infinity;
  for (let i = 1; i < bands.length; i++) {
    minGap = Math.min(minGap, bands[i].right - bands[i - 1].right);
  }
  const tol = Math.max(2, Math.min(10, Math.floor(minGap / 2)));

  const values: (string | null)[] = bands.map(() => null);
  const orphans: Token[] = [];

  for (const t of tokens) {
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < bands.length; i++) {
      const d = Math.abs(t.end - bands[i].right);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    if (best >= 0 && bestDist <= tol && values[best] === null) {
      values[best] = t.text;
    } else {
      orphans.push(t);
    }
  }
  return { values, orphans, labelText };
}
