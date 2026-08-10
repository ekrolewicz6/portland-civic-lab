/**
 * Money and FTE parsing.
 *
 * The important rule: an empty cell is null, NOT zero. "Budgeted $0" and
 * "this line did not exist that year" are different civic claims, and
 * collapsing them would invent a fact.
 */

/** Integer dollars, or null for an absent cell. Parentheses mean negative. */
export function parseMoney(tok: string | null | undefined): number | null {
  if (tok == null) return null;
  const t = tok.trim();
  if (!t || t === "-" || t === "--" || t === "—" || /^n\/?a$/i.test(t)) return null;

  const negative = /^\(.*\)$/.test(t) || t.startsWith("-");
  const digits = t.replace(/[()$,\s%-]/g, "");
  if (!digits || !/^\d+(\.\d+)?$/.test(digits)) return null;

  const n = Math.round(Number(digits));
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** FTE keeps 2 decimals. */
export function parseFte(tok: string | null | undefined): number | null {
  if (tok == null) return null;
  const t = tok.trim();
  if (!t || t === "-" || t === "--") return null;
  const negative = /^\(.*\)$/.test(t) || t.startsWith("-");
  const digits = t.replace(/[()$,\s%-]/g, "");
  if (!digits || !/^\d+(\.\d+)?$/.test(digits)) return null;
  const n = Math.round(Number(digits) * 100) / 100;
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** Positionally aligned to YEARS. */
export type Values = [number | null, number | null, number | null, number | null];

export function emptyValues(): Values {
  return [null, null, null, null];
}

export function addValues(a: Values, b: Values): Values {
  const out = emptyValues();
  for (let i = 0; i < 4; i++) {
    if (a[i] == null && b[i] == null) out[i] = null;
    else out[i] = (a[i] ?? 0) + (b[i] ?? 0);
  }
  return out;
}

export function valuesEqual(a: Values, b: Values, tolerance = 0): boolean {
  for (let i = 0; i < 4; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (Math.abs(x - y) > tolerance) return false;
  }
  return true;
}

export function isAllNull(v: Values): boolean {
  return v.every((x) => x == null);
}
