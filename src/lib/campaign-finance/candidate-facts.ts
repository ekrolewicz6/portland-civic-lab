import publication from './candidate-facts.json';
import { money, SNAPSHOT } from './filters';

export type Amount = { cents: number; records: number };
export type Category = Amount & { key: string; label: string };
export type CommitteeFacts = {
  committeeId: string; committeeName: string | null; observedRecords: number;
  cashCents: number; cashRecords: number; publicCents: number; nonmatchingCents: number;
  sources: Category[]; geography: Category[]; bases: Record<string, Amount>;
  visibleIndividualGroups: number; repeatIndividualGroups: number; visibleSourceGroups: number;
  topSources: { id: string; name: string; bookType: string; identityStatus: string; cents: number; records: number; distinctDates: number; firstDate: string; lastDate: string }[];
  monthly: { month: string; cashCents: number; publicCents: number; nonmatchingCents: number; loanCents: number; inKindCents: number }[];
  peak2026: { start: string; end: string; cents: number; provisional: boolean } | null;
  latestCashDate: string | null;
  account: { year: number; openingCashCents: number; endingCashCents: number; outstandingLoanCents: number; payableCents: number; personalExpenditureCents: number; source: string; retrievedAt: string; reconciliation: string } | null;
  evidenceUrl: string; evidenceSha256: string;
};
type FinanceLink = { committeeId: string; raceId: string; candidateId: string; candidateName: string; status: string };
export const financeFacts = publication as unknown as {
  version: string; snapshot: string; start: string; end: string;
  links: FinanceLink[]; committees: Record<string, CommitteeFacts>; definitions: Record<string, string>;
};
if (financeFacts.snapshot !== SNAPSHOT) throw new Error('Candidate finance snapshot mismatch');

export function candidateFinance(raceId: string, candidateId: string, committees: Record<string, CommitteeFacts> = financeFacts.committees) {
  const ids = [...new Set(financeFacts.links.filter(l => l.status === 'reviewed' && l.raceId === raceId && l.candidateId === candidateId).map(l => l.committeeId))];
  return ids.flatMap(id => committees[id] ? [committees[id]] : []);
}
export function percentage(part: number, total: number) {
  return total > 0 ? `${(part / total * 100).toFixed(1)}%` : 'Not applicable';
}
export type RaceCandidate = { id: string; name: string };
export function raceFinance(raceId: string, candidates: RaceCandidate[], facts: Record<string, CommitteeFacts> = financeFacts.committees) {
  const rows = candidates.map(candidate => {
    const committees = candidateFinance(raceId, candidate.id, facts);
    const covered = committees.length > 0 && committees.every(c => c.observedRecords > 0);
    return { candidate, committees, covered,
      cashCents: committees.reduce((n, c) => n + c.cashCents, 0),
      publicCents: committees.reduce((n, c) => n + c.publicCents, 0),
      nonmatchingCents: committees.reduce((n, c) => n + c.nonmatchingCents, 0),
    };
  });
  const linked = rows.filter(r => r.covered);
  const ids = linked.flatMap(r => r.committees.map(c => c.committeeId));
  // A reused committee may require effective-date attribution before a comparison.
  const ambiguous = new Set(ids).size !== ids.length;
  const cash = linked.reduce((n, r) => n + r.cashCents, 0);
  const publicCash = linked.reduce((n, r) => n + r.publicCents, 0);
  const unidentified = linked.reduce((n, r) => n + r.committees.reduce((s, c) => s + (c.sources.find(x => x.key === 'unidentified')?.cents ?? 0), 0), 0);
  const sentences: string[] = [];
  if (!linked.length) sentences.push('This race does not yet have reviewed, comparable fundraising records in this edition. No fundraising ranking is shown. Missing data is not zero fundraising.');
  else if (ambiguous) sentences.push('Some candidates share a linked committee. Race-wide totals and rankings are withheld until its records can be attributed without double-counting.');
  else {
    sentences.push(`Reviewed records are available for ${linked.length} of ${candidates.length} candidates. These linked committees reported ${money(cash)} in gross cash contributions during the observation window${linked.length < candidates.length ? '; this is not a complete race total' : ''}.`);
    if (cash > 0) sentences.push(`Reviewed City matching receipts account for ${money(publicCash)} (${percentage(publicCash, cash)}) of that cash. The remaining ${money(cash - publicCash)} includes individual, organizational, self/family and unidentified receipts; it is not exclusively individual donations.`);
    if (linked.length > 1 && cash > 0) {
      const leaders = (key: 'cashCents' | 'nonmatchingCents') => {
        const maximum = Math.max(...linked.map(r => r[key]));
        return { maximum, names: linked.filter(r => r[key] === maximum).map(r => r.candidate.name).join(' and ') };
      };
      const total = leaders('cashCents'); const nonmatch = leaders('nonmatchingCents');
      sentences.push(`${total.names} reported the highest gross cash total among reviewed candidates (${money(total.maximum)}). ${nonmatch.maximum > 0 ? `${nonmatch.names} reported the highest cash total excluding reviewed City matches (${money(nonmatch.maximum)}).` : 'No cash outside reviewed City matches is recorded for these candidates.'}`);
    }
    if (cash > publicCash) sentences.push(`${money(unidentified)} (${percentage(unidentified, cash - publicCash)}) of cash outside reviewed matches is unidentified or aggregate reporting. The underlying contributors cannot be counted or linked to other candidates from those records.`);
    const monthly = new Map<string, { cash: number; publicCash: number }>();
    const geography = new Map<string, number>();
    for (const row of linked) for (const committee of row.committees) {
      for (const month of committee.monthly) {
        if (month.month < '2026-01') continue;
        const existing = monthly.get(month.month) ?? { cash: 0, publicCash: 0 };
        monthly.set(month.month, { cash: existing.cash + month.cashCents, publicCash: existing.publicCash + month.publicCents });
      }
      for (const place of committee.geography) geography.set(place.key, (geography.get(place.key) ?? 0) + place.cents);
    }
    const months = [...monthly.entries()].sort((a, b) => b[1].cash - a[1].cash || a[0].localeCompare(b[0]));
    if (months.length && months[0][1].cash > 0) {
      const maximum = months[0][1].cash;
      const peaks = months.filter(([, amount]) => amount.cash === maximum);
      sentences.push(`The largest combined monthly cash total in the observed part of 2026 was ${money(maximum)} in ${peaks.map(([month]) => month).join(' and ')}${peaks.length === 1 ? `, including ${money(peaks[0][1].publicCash)} in reviewed City matches` : ''}. September ends on the snapshot date and recent receipts remain provisional; this timing does not identify a cause.`);
    }
    if (cash > publicCash) sentences.push(`Outside reviewed City matches, ${money(geography.get('portland') ?? 0)} is reported with a Portland, Oregon location, ${money(geography.get('other_oregon') ?? 0)} elsewhere in Oregon and ${money(geography.get('outside_oregon') ?? 0)} outside Oregon. Another ${money(geography.get('unknown') ?? 0)} has unknown or aggregate location. Reported postal locality is not verified city or district residency.`);
  }
  return { rows, covered: linked.length, ambiguous, sentences };
}
