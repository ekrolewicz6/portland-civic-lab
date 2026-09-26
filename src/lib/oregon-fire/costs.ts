import type { FireRecord } from "./types";
import { numberValue, isoDate, type Attributes } from "./normalize";

export interface CostObservation {
  amount: number; currency: "USD"; dollarYear: number | null; reportedAt: string | null;
  status: "estimated-to-date" | "projected-final" | "recorded-unit-cost";
  scope: string; unit: string; sourceUrl: string; flags: string[];
}
export function costObservations(record: FireRecord, a: Attributes): CostObservation[] {
  const result: CostObservation[] = [];
  const reportedAt = isoDate(a.ICS209ReportDateTime);
  if (record.sourceId.startsWith("wfigs") && record.recordKind === "occurrence") {
    for (const [field, status] of [["EstimatedCostToDate", "estimated-to-date"], ["EstimatedFinalCost", "projected-final"]] as const) {
      const amount = numberValue(a, field);
      // Operational zero values are not an audited assertion of no expenditure.
      if (amount !== null && amount > 0) result.push({ amount, currency: "USD", dollarYear: reportedAt ? Number(reportedAt.slice(0, 4)) : null, reportedAt, status,
        scope: "Incident response estimate; excludes a separate accounting of property damage", unit: "incident", sourceUrl: record.sourceUrl,
        flags: ["Provisional cumulative report; do not sum successive reports", ...(!reportedAt ? ["Report date unavailable"] : [])] });
    }
  }
  return result;
}
