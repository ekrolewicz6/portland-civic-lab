import 'server-only';
import { activeManifest } from './active';
import { governorCandidates } from './governor';
import { currentMoneyFlows, currentMoneyTotals, type MoneyTotals } from './query';
import { buildPanel } from './money-flow';

const DAY = 86_400_000;
const longDay = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));
/** Dashed ochre and solid ink: the two governor lines keep these in every chart. */
const GOVERNOR_LINES = ['#9a6418', '#163b30'];

/**
 * Live ledger figures for the governor's race. A committee is flagged when its
 * latest payment is more than three weeks older than the ledger, so a short
 * spending line is never read as a campaign that stopped paying bills.
 */
export async function governorMoney() {
  const end = activeManifest().end;
  const ids = governorCandidates.map(candidate => candidate.committeeId);
  const [flows, both, ...each] = await Promise.all([currentMoneyFlows(ids), currentMoneyTotals(ids), ...ids.map(id => currentMoneyTotals([id]))]);
  const candidates = governorCandidates.map((candidate, index) => {
    const totals = each[index] as MoneyTotals;
    return { candidate, totals, stale: Boolean(totals.latestPayment) && Date.parse(end) - Date.parse(totals.latestPayment!) > 21 * DAY };
  });
  const stale = candidates.filter(item => item.stale);
  const staleNote = stale.map(({ candidate, totals }) => `These records have no payments by ${candidate.name}’s committee after ${longDay(totals.latestPayment!)}.`).join(' ');
  const panel = buildPanel('governor', 'Governor of Oregon', governorCandidates.map((candidate, index) => ({ id: candidate.committeeId, name: candidate.name, href: candidate.href, color: GOVERNOR_LINES[index % 2], dashed: index === 0 })), flows);
  // Two candidates, listed alphabetically wherever they appear on the governor page.
  panel.series.sort((a, b) => a.name.localeCompare(b.name));
  return { end, panel, both, candidates, staleNote };
}
