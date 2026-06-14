// Assembles everything known about one bureau for its dedicated page:
// org node (leader, funding, service area), the reporting chain, the full
// classification staffing+pay, the program/department budget split, and a few
// computed aggregates (cost per FTE, pay distribution).

import { flattenTree, unitPath } from "./queries";
import {
  BUREAU_PERSONNEL,
  type BureauPersonnel,
} from "@/data/org-personnel";
import { BUREAU_FINANCE, type BureauFinance } from "@/data/org-analysis";
import type { FlatUnit } from "./queries";

export function bureauIds(): string[] {
  return Object.keys(BUREAU_PERSONNEL);
}

export interface PayBucket {
  label: string;
  fte: number;
}

const BUCKETS: { label: string; lo: number; hi: number }[] = [
  { label: "< $50k", lo: 0, hi: 50000 },
  { label: "$50–75k", lo: 50000, hi: 75000 },
  { label: "$75–100k", lo: 75000, hi: 100000 },
  { label: "$100–125k", lo: 100000, hi: 125000 },
  { label: "$125–150k", lo: 125000, hi: 150000 },
  { label: "$150–200k", lo: 150000, hi: 200000 },
  { label: "$200k+", lo: 200000, hi: Infinity },
];

export interface BureauDetail {
  node: FlatUnit;
  personnel: BureauPersonnel;
  finance: BureauFinance | null;
  chain: { id: string; name: string }[];
  costPerFte: number;
  buckets: PayBucket[];
}

export function getBureauDetail(id: string): BureauDetail | null {
  const node = flattenTree().find((u) => u.id === id);
  const personnel = BUREAU_PERSONNEL[id];
  if (!node || !personnel) return null;

  const finance = BUREAU_FINANCE[id] ?? null;
  const chain = unitPath(id).map((p) => ({ id: p.id, name: p.name }));
  const costPerFte = personnel.totalFte
    ? personnel.totalCost / personnel.totalFte
    : 0;

  const buckets: PayBucket[] = BUCKETS.map((b) => ({ label: b.label, fte: 0 }));
  for (const c of personnel.classifications) {
    const mid =
      c.salaryMin && c.salaryMax
        ? (c.salaryMin + c.salaryMax) / 2
        : c.salaryMin ?? c.salaryMax ?? 0;
    if (!mid) continue;
    const i = BUCKETS.findIndex((b) => mid >= b.lo && mid < b.hi);
    if (i >= 0) buckets[i].fte = Math.round((buckets[i].fte + c.fte) * 100) / 100;
  }

  return { node, personnel, finance, chain, costPerFte, buckets };
}
