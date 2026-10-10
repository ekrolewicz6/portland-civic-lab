import { describe, it, expect, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { DuckDBInstance } from "@duckdb/node-api";
import { governor, governorCandidates } from "@/lib/campaign-finance/governor";

/**
 * Reconciles the governor edition against the published ledger the explorer
 * serves. When a later refresh moves the ledger forward, the edition keeps its
 * own date and this check is skipped until publish_governor.py is rerun.
 */
const manifest = JSON.parse(readFileSync("server-data/campaign-finance/manifest.json", "utf8"));
const sameSnapshot = manifest.snapshot === governor.snapshot;
const db = await DuckDBInstance.create(manifest.database, { access_mode: "READ_ONLY", threads: "2" });
const connection = await db.connect();
afterAll(() => { connection.closeSync(); db.closeSync(); });
const one = async (sql: string, values: string[]) => (await connection.runAndReadAll(sql, values)).getRowObjectsJson()[0] as Record<string, string | null>;

describe.skipIf(!sameSnapshot)("governor edition against the published ledger", () => {
  it.each(governorCandidates.map((c) => [c.name, c] as const))("%s: totals, dates and groups match the records", async (_name, c) => {
    const cash = await one("SELECT count(*) AS records, sum(amount_cents) AS cents, min(transaction_date) AS first, max(transaction_date) AS latest FROM transactions WHERE committee_id=? AND basis='cash_contribution'", [c.committeeId]);
    expect(Number(cash.cents)).toBe(c.totals.cashCents);
    expect(Number(cash.records)).toBe(c.totals.cashRecords);
    expect(cash.first).toBe(c.totals.firstCashDate);
    expect(cash.latest).toBe(c.totals.latestCashDate);
    const paid = await one("SELECT count(*) AS records, sum(amount_cents) AS cents, max(transaction_date) AS latest FROM transactions WHERE committee_id=? AND basis='cash_payment'", [c.committeeId]);
    expect(Number(paid.cents)).toBe(c.totals.paidCents);
    expect(Number(paid.records)).toBe(c.totals.paymentRecords);
    expect(paid.latest).toBe(c.totals.latestPaymentDate);
    const people = await one("SELECT sum(amount_cents) AS cents, count(DISTINCT entity_id) AS sources FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND book_type='Individual' AND NOT is_disclosure_category AND identity_status<>'unknown'", [c.committeeId]);
    const individual = c.kinds.find((k) => k.key === "individual")!;
    expect(Number(people.cents)).toBe(individual.cents);
    expect(Number(people.sources)).toBe(individual.groups);
    const small = await one("SELECT coalesce(sum(amount_cents),0) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND (is_disclosure_category OR identity_status='unknown')", [c.committeeId]);
    expect(Number(small.cents)).toBe(c.totals.smallCents);
    const oregon = await one("SELECT coalesce(sum(amount_cents),0) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND upper(trim(state))='OR' AND NOT is_disclosure_category AND identity_status<>'unknown'", [c.committeeId]);
    expect(Number(oregon.cents)).toBe(c.geography.oregonCents);
    const peak = c.peaks[0];
    const week = await one("SELECT sum(amount_cents) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND transaction_date BETWEEN ? AND ?", [c.committeeId, peak.start, peak.end]);
    expect(Number(week.cents)).toBe(peak.cents);
    const top = c.topSources[0];
    const source = await one("SELECT sum(amount_cents) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND entity_id=?", [c.committeeId, top.id]);
    expect(Number(source.cents)).toBe(top.cents);
  });

  it("finds the $10 million transfer and no committee for the unlinked candidate", async () => {
    const ten = governor.context.tenMillion;
    const record = await one("SELECT max(amount_cents) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution' AND transaction_date=?", [ten.committeeId, ten.date]);
    expect(Number(record.cents)).toBe(ten.cents);
    const smith = await one("SELECT count(*) AS committees FROM committees WHERE lower(name) LIKE ?", ["%brett smith%"]);
    expect(Number(smith.committees)).toBe(0);
  });
});
