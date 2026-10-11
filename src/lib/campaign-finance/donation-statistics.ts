import type { ContributionRecord } from './donation-records';

export const fundingLabels = {
  small_individual: 'Named individuals giving $100 or less in total',
  medium_individual: 'Named individuals giving $100.01–$1,000 in total',
  large_individual: 'Named individuals giving more than $1,000 in total',
  business: 'Reported businesses', committee: 'Political committees / PACs',
  labor: 'Reported labor organizations', self_family: 'Candidate / immediate family',
  other: 'Other named source types', unidentified: 'Unnamed / combined entries',
} as const;
export type FundingKey = keyof typeof fundingLabels;

/** Per positive itemized cash record, not per person or combined disclosure entry. */
export function giftStatistics(amounts: number[]) {
  if (amounts.some(value => !Number.isSafeInteger(value) || value <= 0)) throw new Error('Invalid positive cash amount');
  const sorted = [...amounts].sort((a, b) => a - b);
  if (!sorted.length) return { count: 0, totalCents: 0, meanCents: null, medianCents: null, q1Cents: null, q3Cents: null, minCents: null, maxCents: null, modesCents: [] as number[], modeFrequency: 0 };
  // Linear interpolation at (n-1)*p; retains half cents in an even-sized median.
  const quantile = (p: number) => {
    const position = (sorted.length - 1) * p, lower = Math.floor(position);
    return sorted[lower] + (sorted[Math.ceil(position)] - sorted[lower]) * (position - lower);
  };
  const frequencies = new Map<number, number>();
  for (const cents of sorted) frequencies.set(cents, (frequencies.get(cents) ?? 0) + 1);
  const frequency = Math.max(...frequencies.values());
  const totalCents = sorted.reduce((sum, value) => sum + value, 0);
  return { count: sorted.length, totalCents, meanCents: totalCents / sorted.length,
    medianCents: quantile(.5), q1Cents: quantile(.25), q3Cents: quantile(.75),
    minCents: sorted[0], maxCents: sorted.at(-1)!,
    modesCents: frequency > 1 ? [...frequencies].filter(([, n]) => n === frequency).map(([cents]) => cents) : [], modeFrequency: frequency };
}

export function donationStatistics(rows: ContributionRecord[]) {
  const funding = Object.fromEntries(Object.keys(fundingLabels).map(key => [key, { cents: 0, records: 0 }])) as Record<FundingKey, { cents: number; records: number }>;
  const named = rows.filter(row => row.category !== 'public' && row.category !== 'unidentified');
  const individual = named.filter(row => row.category === 'individual');
  const groupTotals = new Map<string, number>();
  for (const row of individual) groupTotals.set(row.entityId, (groupTotals.get(row.entityId) ?? 0) + row.cents);
  for (const row of rows) {
    if (row.category === 'public') continue;
    const total = groupTotals.get(row.entityId) ?? 0;
    const key: FundingKey = row.category === 'individual' ? total <= 10000 ? 'small_individual' : total <= 100000 ? 'medium_individual' : 'large_individual'
      : row.category in fundingLabels ? row.category as FundingKey : 'other';
    funding[key].cents += row.cents; funding[key].records++;
  }
  const organizations = new Map<string, { id: string; name: string; category: string; cents: number; records: number }>();
  for (const row of named.filter(row => ['business', 'committee', 'labor'].includes(row.category))) {
    // Preserve type disagreements instead of silently merging them.
    const key = row.category + '|' + row.entityId;
    const source = organizations.get(key) ?? { id: row.entityId, name: row.source.trim(), category: row.category, cents: 0, records: 0 };
    source.cents += row.cents; source.records++; organizations.set(key, source);
  }
  const cashCents = rows.reduce((sum, row) => sum + row.cents, 0);
  const matchingCents = rows.filter(row => row.category === 'public').reduce((sum, row) => sum + row.cents, 0);
  const nonmatchingCents = cashCents - matchingCents;
  if (Object.values(funding).reduce((sum, value) => sum + value.cents, 0) !== nonmatchingCents) throw new Error('Funding sources do not reconcile');
  return { cashCents, matchingCents, nonmatchingCents, funding,
    individuals: giftStatistics(individual.map(row => row.cents)), itemized: giftStatistics(named.map(row => row.cents)),
    individualGroups: groupTotals.size,
    smallIndividualGroups: [...groupTotals.values()].filter(cents => cents <= 10000).length,
    topOrganizations: [...organizations.values()].sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name)).slice(0, 10) };
}
export type DonationStatistics = ReturnType<typeof donationStatistics>;
