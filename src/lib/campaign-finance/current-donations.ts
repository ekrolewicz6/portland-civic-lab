import 'server-only';
import { cache } from 'react';
import { currentContributionRecords } from './query';
import { donationStatistics } from './donation-statistics';
import { financeFacts } from './candidate-facts';
import { governorCandidates } from './governor';

export const donationCandidates = [
  ...financeFacts.links.filter(link => link.status === 'reviewed').map(link => ({ committeeId: link.committeeId, name: link.candidateName, raceId: link.raceId, href: `/voters-guide/${link.raceId}/${link.candidateId}#campaign-finance` })),
  ...governorCandidates.map(candidate => ({ committeeId: candidate.committeeId, name: candidate.name, raceId: 'oregon-governor', href: `/voters-guide/oregon-governor/${candidate.candidateId}#campaign-finance` })),
];
export const currentDonationStatistics = cache(async (committeeId: string) => {
  if (!donationCandidates.some(candidate => candidate.committeeId === committeeId)) throw new Error('Unreviewed candidate committee');
  return donationStatistics(await currentContributionRecords(committeeId));
});
