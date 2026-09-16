import { describe, expect, it } from 'vitest';
import { showcaseCommission, showcaseRemainder } from '@/lib/maker-economy/model';
import figures from '@/lib/maker-economy/figures.json';

describe('Ceramic Showcase 2026 published individual-booth rules', () => {
  it.each([[0,0],[2000,340],[3000,480],[3500,540],[4000,600],[5500,750],[6000,775]])('charges the marginal tiers on $%i sales', (sales,expected) => {
    expect(showcaseCommission(sales)).toBe(expected);
  });
  it('applies the new tier only to the dollars above each threshold', () => {
    for (const [threshold,rate] of [[2000,.14],[3000,.12],[4000,.10],[5500,.05]]) {
      expect(showcaseCommission(threshold+100)-showcaseCommission(threshold)).toBeCloseTo(100*rate);
    }
  });
  it('subtracts fees and entered costs and preserves losses', () => {
    expect(showcaseRemainder(3500,1050,250)).toBe(1365);
    expect(showcaseRemainder(0,100,50)).toBe(-445);
  });
  it.each([-1,NaN,Infinity])('rejects invalid sales %s', sales => expect(() => showcaseCommission(sales)).toThrow());
});

describe('research publication boundaries', () => {
  it('keeps source-listing counts separate from profile groups', () => {
    expect(figures.networks.reduce((sum,n) => sum+n.count,0)).toBe(figures.totals.listings);
    expect(figures.profiles.flatMap(p => p.listings)).toHaveLength(figures.totals.listings);
    expect(new Set(figures.profiles.flatMap(p=>p.listings)).size).toBe(figures.totals.listings);
  });
  it('does not merge different artists just because they share a website', () => {
    for(const names of [['Debra Nelson','Larry Nelson'],['Janet Buskirk','Jim Koudelka']]) {
      const ids=names.map(name=>figures.profiles.find(p=>p.names.includes(name))?.id);
      expect(ids.every(Boolean)).toBe(true);
      expect(new Set(ids).size).toBe(2);
    }
  });
  it('keeps the receipts chart entirely in one year and county with disjoint codes', () => {
    expect(new Set(figures.nonemployers.map(r=>r.year))).toEqual(new Set(['2023']));
    expect(new Set(figures.nonemployers.map(r=>r.geoid))).toEqual(new Set(['41051']));
    const codes=figures.nonemployers.map(r=>r.code);
    expect(codes.every(a=>codes.every(b=>a===b || !a.startsWith(b)))).toBe(true);
    expect(codes).not.toContain('7115');
    expect(codes).not.toContain('3399');
  });
});
