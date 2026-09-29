import {describe,it,expect} from 'vitest';
import {parseFilters,filterParams,ACTIVE_END,ACTIVE_SNAPSHOT,SNAPSHOT} from '../../src/lib/campaign-finance/filters';
import {activeLeaves,manifestRoots,buildDateSlices} from './download-contributions';
describe('validated public filters',()=>{
  it('round trips shareable filters',()=>{const f=parseFilters(new URLSearchParams({q:'Tina Kotek',basis:'cash_contribution',page:'3',state:'or'}));expect(parseFilters(filterParams(f))).toEqual(f);expect(f.snapshot).toBe(ACTIVE_SNAPSHOT);expect(f.end).toBe(ACTIVE_END);});
  it('opens older editorial links in the one active explorer database',()=>{expect(parseFilters(new URLSearchParams({snapshot:SNAPSHOT})).snapshot).toBe(ACTIVE_SNAPSHOT);});
  it.each(['2026-02-30','2024-12-31','tomorrow'])('rejects invalid or out-of-snapshot date %s',start=>expect(()=>parseFilters(new URLSearchParams({start}))).toThrow());
  it.each([{page:'0'},{page:'1.5'},{basis:'DROP TABLE transactions'},{snapshot:'live'},{entity:'person:1'},{state:'123'},{start:'2026-09-20',end:'2026-09-01'}])('rejects invalid filter %j',p=>expect(()=>parseFilters(new URLSearchParams(p))).toThrow());
  it('keeps contribution-family selection distinct from cash basis',()=>{const f=parseFilters(new URLSearchParams({family:'contributions'}));expect(f.family).toBe('contributions');expect(f.basis).toBe('all');expect(()=>parseFilters(new URLSearchParams({family:'unknown'}))).toThrow();});
  it('keeps reviewed City matching deposits separate from other contributions',()=>{const f=parseFilters(new URLSearchParams({committee:'24897',start:'2026-08-09',end:'2026-08-09',basis:'cash_contribution',matching:'exclude'}));expect(f.matching).toBe('exclude');expect(parseFilters(filterParams(f))).toEqual(f);expect(parseFilters(new URLSearchParams({matching:'only'})).matching).toBe('only');expect(()=>parseFilters(new URLSearchParams({matching:'unreviewed'}))).toThrow();});
  it('rejects repeated and unknown parameters',()=>{expect(()=>parseFilters(new URLSearchParams('page=1&page=2'))).toThrow();expect(()=>parseFilters(new URLSearchParams('sql=select'))).toThrow();});
});
describe('frozen acquisition partition tree',()=>{
  const make=()=>({version:2 as const,source:'test',filter:{startDate:'2025-01-01',endDate:'2025-01-02',includeDeleted:false as const,includeExpired:false as const},createdAt:'test',updatedAt:'test',entries:{'2025-01-01_2025-01-02':{key:'2025-01-01_2025-01-02',start:'2025-01-01',end:'2025-01-02',status:'split' as const,count:6000,children:[{start:'2025-01-01',end:'2025-01-01'},{start:'2025-01-02',end:'2025-01-02'}]},'2025-01-01_2025-01-01':{key:'2025-01-01_2025-01-01',start:'2025-01-01',end:'2025-01-01',status:'complete' as const,count:3000},'2025-01-02_2025-01-02':{key:'2025-01-02_2025-01-02',start:'2025-01-02',end:'2025-01-02',status:'complete' as const,count:3000}}});
  it('infers legacy roots once',()=>{expect(manifestRoots(make())).toHaveLength(1);expect(activeLeaves(make())).toHaveLength(2);});
  it('ignores obsolete children after a refreshed parent becomes a leaf',()=>{const m=make();const refreshed={...m,roots:manifestRoots(m),entries:{...m.entries,'2025-01-01_2025-01-02':{...m.entries['2025-01-01_2025-01-02'],status:'complete' as const,count:4000}}};expect(activeLeaves(refreshed)).toHaveLength(1);});
  it('builds nonoverlapping inclusive date windows',()=>{expect(buildDateSlices('2025-01-01','2025-01-05',2)).toEqual([{start:'2025-01-01',end:'2025-01-02'},{start:'2025-01-03',end:'2025-01-04'},{start:'2025-01-05',end:'2025-01-05'}]);});
});
