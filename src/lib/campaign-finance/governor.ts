import data from './governor-data.json';
import counties from './oregon-counties.json';
import { BASE } from './filters';

/**
 * Reviewed governor's-race edition, built by ingest/orestar/analysis/publish_governor.py.
 * It is dated to its own snapshot and does not move when the active ledger is
 * refreshed; rerun the script to bring it forward.
 */
type Amount = { cents: number; records: number };
export type GovernorKind = { key: string; label: string; cents: number; records: number; groups: number };
export type GovernorSource = { id: string; name: string; bookType: string; kind: string; city: string; state: string; cents: number; records: number; firstDate: string; lastDate: string };
export type GovernorPayee = { name: string; bookType: string; city: string; state: string; cents: number; records: number; firstDate: string; lastDate: string; mainPurpose: string };
type Unlinked = {
  candidateId: string; name: string; party: string; committeeId: string | null; committeeName: string | null;
  linkStatus: string; linkBasis: string; linkSource: string; linkRetrievedAt: string; href: string;
  governorCommitteeFrom: string | null; announced: string | null; announcedSource: string;
};
export type GovernorCandidate = Unlinked & {
  committeeId: string; committeeName: string; governorCommitteeFrom: string; announced: string;
  totals: {
    cashCents: number; cashRecords: number; namedCents: number; smallCents: number; namedGroups: number; individualGroups: number;
    inKindCents: number; refundCents: number; paidCents: number; paymentRecords: number; firstCashDate: string; latestCashDate: string;
    latestPaymentDate: string; latestFiledDate: string; republicanGovernorsCents: number; topTenCents: number; medianPaymentFilingLagDays: number | null;
  };
  kinds: GovernorKind[];
  reportedTypes: ({ label: string } & Amount)[];
  bands: { key: string; label: string; cents: number; groups: number }[];
  topSources: GovernorSource[];
  overCap: Record<'individual' | 'business', { groups: number; cents: number; aboveCapCents: number }>;
  weekly: { week: string; cents: number; records: number }[];
  peaks: { start: string; end: string; cents: number; records: number; top: { name: string; cents: number }[] }[];
  monthly: { month: string; cashCents: number; paymentCents: number }[];
  geography: {
    oregonCents: number; oregonRecords: number; outsideCents: number; outsideRecords: number; unknownCents: number; unknownRecords: number;
    states: ({ state: string } & Amount)[];
    individuals: Record<'oregon' | 'outside' | 'unknown', Amount>;
    counties: ({ county: string } & Amount)[];
    countyUndetermined: Amount;
  };
  spending: { purposes: ({ label: string } & Amount)[]; payees: GovernorPayee[]; toIndividuals: Amount; toCombined: Amount };
  account: { year: number; openingCash2025Cents: number; beginningCashCents: number; endingCashCents: number; outstandingLoanCents: number; retrievedAt: string; reconciliation: string; paymentDifferenceCents: number; source: string };
  likeForLike: { asOf: string; raisedCents: number; paidCents: number; cashPositionCents: number; raisedAfterCents: number; paidAfterCents: number };
};

export const governor = data as unknown as Omit<typeof data, 'candidates'> & { candidates: (Unlinked | GovernorCandidate)[] };

const isLinked = (candidate: Unlinked | GovernorCandidate): candidate is GovernorCandidate => candidate.linkStatus === 'reviewed' && 'totals' in candidate;
/** Alphabetical by displayed name, as on the voter guide; never ranked by money. */
export const governorCandidates = governor.candidates.filter(isLinked).sort((a, b) => a.name.localeCompare(b.name));
export const governorUnlinked = governor.candidates.filter(candidate => !isLinked(candidate));
export const governorCandidate = (candidateId: string) => governorCandidates.find(candidate => candidate.candidateId === candidateId);
export const GOVERNOR_PATH = `${BASE}/governor`;
export const GOVERNOR_EVIDENCE = '/data/campaign-finance/governor/';
export const oregonCounties = counties;

export const KIND_ORDER = ['individual', 'small', 'business', 'trade', 'labor', 'governors', 'candidates', 'other'] as const;
export const KIND_SHORT: Record<string, string> = {
  individual: 'Named individuals',
  small: 'Combined gifts of $100 or less',
  business: 'Businesses',
  trade: 'Business and trade committees',
  labor: 'Unions and union committees',
  governors: 'National governors’ groups',
  candidates: 'Other candidates and parties',
  other: 'Other committees and organizations',
};

export const KIND_SINGULAR: Record<string, string> = {
  individual: 'Individual',
  business: 'Business',
  trade: 'Business or trade committee',
  labor: 'Union or union committee',
  governors: 'National governors’ group',
  candidates: 'Candidate committee or party',
  other: 'Committee or organization',
};

/** Whole percentages; a real amount that rounds to zero reads "under 1%", and one that rounds up to all reads "over 99%". */
export function share(part: number, whole: number) {
  if (whole <= 0 || part <= 0) return '0%';
  const rounded = Math.round(100 * part / whole);
  if (rounded === 0) return 'under 1%';
  if (rounded === 100 && part < whole) return 'over 99%';
  return `${rounded}%`;
}
export const wholeDollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(cents / 100));
/** $12.8 million or $703,500: figures for sentences. */
export function roundMoney(cents: number) {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${Number((dollars / 1_000_000).toFixed(dollars >= 10_000_000 ? 1 : 2))} million`;
  return wholeDollars(cents);
}
export const plural = (count: number, one: string, many = `${one}s`) => `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
/** Small counts spelled out for prose; pass capital for the start of a sentence. */
export function words(count: number, capital = false) {
  const word = WORDS[count] ?? count.toLocaleString('en-US');
  return capital ? word[0].toUpperCase() + word.slice(1) : word;
}
/** About $965,000: a balance rounded to the nearest thousand dollars. */
export const nearestThousand = (cents: number) => `$${(Math.round(cents / 100_000) * 1000).toLocaleString('en-US')}`;
export function longDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
}
export function longMonthDay(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
}
export function monthDay(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
}
export const explorerHref = (committeeId: string, extra = '') => `${BASE}/explorer?committee=${committeeId}${extra}`;
