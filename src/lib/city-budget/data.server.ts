/**
 * Server-only accessor for the budget dataset.
 *
 * The JSON is ~1.3 MB. It must never be reachable from a "use client" module —
 * importing it there would ship the whole budget book to every visitor. The
 * client gets the compact payload built by `clientPayload()` instead (~60 KB).
 */

import "server-only";
import raw from "@/data/budget/fy2026-27.json";
import type { BudgetDataset, Program } from "./types";

export const dataset = raw as unknown as BudgetDataset;

export function getProgram(slug: string): Program | undefined {
  return dataset.programs.find((p) => p.slug === slug);
}

/** Everything the interactive diagram needs, and nothing else. */
export function clientPayload() {
  return {
    fy: dataset.fy,
    years: dataset.years,
    citywide: dataset.citywide,
    yearlyObjects: dataset.yearlyObjects,
    bureaus: dataset.bureaus,
    programs: dataset.programs.map((p) => ({
      slug: p.slug,
      name: p.name,
      serviceArea: p.serviceArea,
      bureau: p.bureau,
      bureauSlug: p.bureauSlug,
      pages: p.pages,
      total: p.total,
      fte: p.fte,
      // Prose is the bulk of the payload; the inspector shows a short excerpt.
      description: p.description ? p.description.slice(0, 240) : null,
      expenses: p.expenses.map((e) => ({
        label: e.label,
        depth: e.depth,
        class: e.class,
        isTotal: e.isTotal,
        values: e.values,
      })),
      funding: p.funding.map((f) => ({
        fundName: f.fundName,
        gfSplit: f.gfSplit,
        class: f.class,
        label: f.label,
        values: f.values,
      })),
    })),
    funds: dataset.funds.map((f) => ({
      slug: f.slug,
      name: f.name,
      serviceArea: f.serviceArea,
      pages: f.pages,
      summaryOnly: f.summaryOnly,
      revenues: [],
      expenses: [],
      revenueGrandTotal: f.revenueGrandTotal,
      expenseGrandTotal: f.expenseGrandTotal,
    })),
    classTotals: dataset.classTotals,
    serviceAreaSummaries: [],
    reconciliation: dataset.reconciliation,
    sources: dataset.sources,
    documentTitle: dataset.documentTitle,
    publisher: dataset.publisher,
    extractedAt: dataset.extractedAt,
  } as unknown as BudgetDataset;
}
