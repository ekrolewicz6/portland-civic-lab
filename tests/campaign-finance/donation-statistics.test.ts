import { describe, expect, it } from 'vitest';
import { giftStatistics, donationStatistics } from '../../src/lib/campaign-finance/donation-statistics';
import type { ContributionRecord } from '../../src/lib/campaign-finance/donation-records';
const gift = (cents: number, category = 'individual', entityId = 'person:1'): ContributionRecord => ({ id: String(cents), date: '2026-10-10', cents, category, entityId, source: 'Reported source', bookType: 'Individual' });
describe('donation statistics', () => {
  it('retains even median fractions, interpolates quartiles and reports tied modes', () => {
    expect(giftStatistics([100,100,101,101])).toMatchObject({ medianCents:100.5,meanCents:100.5,q1Cents:100,q3Cents:101,modesCents:[100,101],modeFrequency:2 });
    expect(giftStatistics([100,200,300,1000])).toMatchObject({medianCents:250,q1Cents:175,q3Cents:475,modesCents:[]});
    expect(giftStatistics([]).medianCents).toBeNull();
    expect(giftStatistics([100]).modesCents).toEqual([]);
  });
  it('keeps matching and combined rows out of gift statistics and reconciles cash categories', () => {
    const stats = donationStatistics([gift(2500),gift(2500),gift(2500),gift(2500),gift(2500),gift(1000000,'public'),gift(450000,'unidentified'),gift(200000,'business'),gift(500000,'committee'),gift(10000,'individual','person:2')]);
    expect(stats.individuals).toMatchObject({count:6,medianCents:2500,meanCents:3750,modesCents:[2500],modeFrequency:5});
    expect(stats.funding.small_individual.cents).toBe(10000);
    expect(stats.funding.medium_individual.cents).toBe(12500);
    expect(stats.smallIndividualGroups).toBe(1);
    expect(stats.matchingCents).toBe(1000000);
    expect(stats.itemized.count).toBe(8);
    expect(Object.values(stats.funding).reduce((n,r)=>n+r.cents,0)).toBe(stats.nonmatchingCents);
  });
});
