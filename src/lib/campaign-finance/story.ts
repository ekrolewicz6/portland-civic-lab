import { financeFacts } from './candidate-facts';
import story from './story-data.json';
import { SNAPSHOT } from './filters';

export { story };
export const STORY_EVIDENCE = '/data/campaign-finance/story/';
if (story.snapshot !== SNAPSHOT) throw new Error('Story snapshot mismatch');
export type FundingRow = { id: string; name: string; href: string; cash: number; public: number; individual: number; unidentified: number; other: number };
export function fundingRows(raceId: string): FundingRow[] {
  return financeFacts.links.filter(l => l.status === 'reviewed' && l.raceId === raceId).map(l => {
    const c = financeFacts.committees[l.committeeId];
    const category = (key: string) => c.sources.find(s => s.key === key)?.cents ?? 0;
    return { id: l.committeeId, name: l.candidateName, href: `/voters-guide/${l.raceId}/${l.candidateId}#campaign-finance`, cash: c.cashCents, public: c.publicCents, individual: category('individual'), unidentified: category('unidentified'), other: c.nonmatchingCents - category('individual') - category('unidentified') };
  });
}
export function storyCandidate(id: string) {
  const c = financeFacts.committees[id];
  const link = financeFacts.links.find(l => l.status === 'reviewed' && l.committeeId === id);
  if (!c || !link) throw new Error('Unreviewed story candidate: ' + id);
  return { ...c, name: link.candidateName, href: `/voters-guide/${link.raceId}/${link.candidateId}#campaign-finance` };
}
export function shortDate(iso: string) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')); }
