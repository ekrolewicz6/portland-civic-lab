import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {candidateFinance,financeFacts,raceFinance,percentage} from '../../src/lib/campaign-finance/candidate-facts';
import {portlandRaces} from '../../src/lib/voters-guide/portland';

describe('published candidate fundraising facts',()=>{
  it('publishes only reviewed links and a fixed snapshot',()=>{
    expect(financeFacts.links).toHaveLength(18);
    expect(financeFacts.links.every(l=>l.status==='reviewed')).toBe(true);
    expect(financeFacts.snapshot).toBe('orestar-20250101-20260927-v1');
    expect(candidateFinance('portland-district-3','not-a-reviewed-candidate')).toEqual([]);
    expect(candidateFinance('portland-district-4','tiffany-koyama-lane')).toEqual([]);
  });
  it('reconciles source, geography, monthly and accounting totals for every committee',()=>{
    for(const c of Object.values(financeFacts.committees)){
      expect(c.sources.reduce((n,s)=>n+s.cents,0)).toBe(c.cashCents);
      expect(c.sources.reduce((n,s)=>n+s.records,0)).toBe(c.cashRecords);
      expect(c.geography.reduce((n,g)=>n+g.cents,0)).toBe(c.nonmatchingCents);
      expect(c.monthly.reduce((n,m)=>n+m.cashCents,0)).toBe(c.cashCents);
      expect(c.bases.cash_contribution?.cents??0).toBe(c.cashCents);
      expect(c.publicCents+c.nonmatchingCents).toBe(c.cashCents);
      expect(c.monthly).toHaveLength(21);
      for(const s of c.topSources)expect(s.id).not.toMatch(/^(disclosure|unknown):/);
      expect(c.topSources.every(s=>s.distinctDates<=s.records)).toBe(true);
      expect(createHash('sha256').update(readFileSync('public'+c.evidenceUrl)).digest('hex')).toBe(c.evidenceSha256);
      const header=readFileSync('public'+c.evidenceUrl,'utf8').split('\n')[0];
      expect(header).not.toMatch(/street|address|employer|occupation/);
    }
  });
  it('keeps public receipts, nonmatching cash and debt separate',()=>{
    const t=candidateFinance('portland-district-3','tiffany-koyama-lane')[0];
    expect(t.cashCents).toBe(27780922);expect(t.publicCents).toBe(20000000);expect(t.nonmatchingCents).toBe(7780922);
    const z=financeFacts.committees['17629'];
    expect(z.account?.outstandingLoanCents).toBe(4500000);expect(z.bases.loan_received?.cents??0).toBe(0);
    expect(percentage(0,0)).toBe('Not applicable');
  });
  it('makes a neutral, coverage-qualified District 3 comparison',()=>{
    const race=portlandRaces.find(r=>r.id==='portland-district-3')!;
    const summary=raceFinance(race.id,race.candidates);
    expect(summary.covered).toBe(9);expect(summary.rows).toHaveLength(21);
    const story=summary.sentences.join(' ');
    expect(story).toContain('not a complete race total');
    expect(story).toContain('Tiffany Koyama Lane reported the highest gross cash');
    expect(story).toContain('Steve Novick reported the highest cash total excluding');
    expect(story).not.toMatch(/grassroots|momentum|winning|popular|conservative|progressive|moderate|caused/i);
    expect(summary.rows.filter(r=>!r.covered)).toHaveLength(12);
  });
  it('makes a consistent District 4 comparison and preserves candidate order',()=>{
    const race=portlandRaces.find(r=>r.id==='portland-district-4')!;
    const summary=raceFinance(race.id,race.candidates);
    expect(summary.covered).toBe(8);expect(summary.rows.map(r=>r.candidate.id)).toEqual(race.candidates.map(c=>c.id));
    expect(summary.sentences.join(' ')).toContain('Eli Arnold reported the highest gross cash');
  });
  it('does not invent comparisons for races without reviewed records',()=>{
    const summary=raceFinance('unreviewed-race',[{id:'person',name:'Person'}]);
    expect(summary.covered).toBe(0);expect(summary.sentences.join(' ')).toContain('not zero fundraising');
    expect(summary.sentences.join(' ')).not.toContain('$0');
  });
});
