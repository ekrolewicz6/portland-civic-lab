// Pure query helpers over the canonical org tree. No I/O — safe to use in
// server components, route handlers, and the client.

import {
  ORG_TREE,
  SERVICE_AREAS,
  TOTAL_AUTHORIZED_FTE,
  FTE_FISCAL_YEAR,
  type OrgUnit,
  type ServiceAreaSlug,
  type UnitType,
  type FundModel,
} from "@/data/org-structure";

export interface FlatUnit extends Omit<OrgUnit, "children"> {
  /** id of the parent node (null for root) */
  parentId: string | null;
  /** name of the parent node (null for root) */
  parentName: string | null;
  /** root = 0 */
  depth: number;
  /** number of direct children */
  childCount: number;
  /** total descendants */
  descendantCount: number;
}

function descendantCount(node: OrgUnit): number {
  if (!node.children?.length) return 0;
  return node.children.reduce(
    (sum, child) => sum + 1 + descendantCount(child),
    0,
  );
}

/** Depth-first flatten with parent + depth metadata. Includes the root. */
export function flattenTree(root: OrgUnit = ORG_TREE): FlatUnit[] {
  const out: FlatUnit[] = [];
  const walk = (
    node: OrgUnit,
    parent: OrgUnit | null,
    depth: number,
  ): void => {
    const { children, ...rest } = node;
    out.push({
      ...rest,
      parentId: parent?.id ?? null,
      parentName: parent?.name ?? null,
      depth,
      childCount: children?.length ?? 0,
      descendantCount: descendantCount(node),
    });
    children?.forEach((child) => walk(child, node, depth + 1));
  };
  walk(root, null, 0);
  return out;
}

/** All operating units — every node except the synthetic root + branch nodes. */
export function operatingUnits(): FlatUnit[] {
  return flattenTree().filter(
    (u) => u.type !== "root" && u.type !== "branch",
  );
}

export function findUnit(id: string): FlatUnit | undefined {
  return flattenTree().find((u) => u.id === id);
}

/** Path from root to the unit (inclusive), for breadcrumbs. */
export function unitPath(id: string): FlatUnit[] {
  const flat = flattenTree();
  const byId = new Map(flat.map((u) => [u.id, u]));
  const path: FlatUnit[] = [];
  let current = byId.get(id);
  while (current) {
    path.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return path;
}

/** Case-insensitive search over name, abbr, leader, and notes. */
export function searchUnits(query: string): FlatUnit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return flattenTree().filter((u) => {
    return (
      u.name.toLowerCase().includes(q) ||
      (u.abbr?.toLowerCase().includes(q) ?? false) ||
      (u.leader?.toLowerCase().includes(q) ?? false) ||
      (u.notes?.toLowerCase().includes(q) ?? false) ||
      (u.reorg2025?.toLowerCase().includes(q) ?? false)
    );
  });
}

function tally<T extends string>(
  units: FlatUnit[],
  key: (u: FlatUnit) => T | undefined,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const u of units) {
    const k = key(u);
    if (!k) continue;
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export interface OrgStats {
  totalUnits: number;
  bureaus: number;
  /** citywide authorized FTE (budget Table 8 total) */
  totalFte: number;
  fteFiscalYear: string;
  byServiceArea: {
    slug: ServiceAreaSlug;
    label: string;
    count: number;
    fte: number;
  }[];
  byType: Record<string, number>;
  byFundModel: Record<string, number>;
  unconfirmed: number;
  vacant: number;
  reorgMoves: number;
}

/** Summary statistics over the operating units (root + branches excluded). */
export function orgStats(): OrgStats {
  const units = operatingUnits();
  const saCounts = tally<ServiceAreaSlug>(units, (u) => u.serviceArea);
  const fteByArea: Record<string, number> = {};
  for (const u of units) {
    if (u.fteAuthorized) {
      fteByArea[u.serviceArea] =
        (fteByArea[u.serviceArea] ?? 0) + u.fteAuthorized;
    }
  }
  return {
    totalUnits: units.length,
    bureaus: units.filter((u) => u.type === "bureau").length,
    totalFte: TOTAL_AUTHORIZED_FTE,
    fteFiscalYear: FTE_FISCAL_YEAR,
    byServiceArea: SERVICE_AREAS.map((sa) => ({
      slug: sa.slug,
      label: sa.label,
      count: saCounts[sa.slug] ?? 0,
      fte: Math.round((fteByArea[sa.slug] ?? 0) * 100) / 100,
    })),
    byType: tally<UnitType>(units, (u) => u.type),
    byFundModel: tally<FundModel>(units, (u) => u.fundModel),
    unconfirmed: units.filter((u) => u.unconfirmed).length,
    vacant: units.filter((u) => u.vacant).length,
    reorgMoves: units.filter((u) => u.reorg2025).length,
  };
}

/** Units that moved or were created/renamed in the 2024/2025 reorganization. */
export function reorgMoves(): FlatUnit[] {
  return operatingUnits().filter((u) => u.reorg2025);
}
