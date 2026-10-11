import 'server-only';
import frozen from './campaign-dynamics.json';
import { activeManifest } from './active';
import { currentCashDaily } from './query';
import { buildEventWindows, timelineCatalog } from './timeline';

type CashKey='cash_cents'|'public_cents'|'nonmatching_cents'|'individual_itemized_cents'|'unidentified_cents';
const cashKeys:CashKey[]=['cash_cents','public_cents','nonmatching_cents','individual_itemized_cents','unidentified_cents'];
const empty=()=>({cash_cents:0,public_cents:0,nonmatching_cents:0,individual_itemized_cents:0,unidentified_cents:0});
const dayAt=(date:string,offset:number)=>new Date(Date.parse(date+'T00:00:00Z')+offset*86400000).toISOString().slice(0,10);
type CurrentTimeline = Omit<typeof frozen, 'events'> & { events: ReturnType<typeof buildEventWindows> };
let activeTimelineCache:{snapshot:string;result:Promise<CurrentTimeline>}|undefined;

export function currentTimeline() {
  const active=activeManifest();
  if(activeTimelineCache?.snapshot===active.snapshot)return activeTimelineCache.result;
  const result=(async()=>{
    const ids=frozen.candidates.map(candidate=>candidate.committeeId);
    const daily=await currentCashDaily(ids);
    const indexed=new Map(daily.map(row=>[row.committee_id+'|'+row.transaction_date,row]));
    const value=(id:string,date:string,key:CashKey)=>Number(indexed.get(id+'|'+date)?.[key]??0);
    const totals=new Map<string,ReturnType<typeof empty>>();
    const weekly=[];
    for(const id of ids){
      const cumulative=empty();
      let monday='2024-12-30';
      while(monday<=active.end){
        const sunday=dayAt(monday,6);
        const weekEnd=sunday>active.end?active.end:sunday;
        const values=empty();
        for(let date=monday;date<=weekEnd;date=dayAt(date,1))if(date>='2025-01-01')for(const key of cashKeys)values[key]+=value(id,date,key);
        for(const key of cashKeys)cumulative[key]+=values[key];
        weekly.push({committeeId:id,weekStart:monday,weekEnd,weekly:values,cumulative:{...cumulative}});
        monday=dayAt(monday,7);
      }
      totals.set(id,{...cumulative});
    }
    const events=buildEventWindows(ids,'2025-01-01',active.end,value);
    const candidates=frozen.candidates.map(candidate=>{
      const total=totals.get(candidate.committeeId)!;
      return {...candidate,cashCents:total.cash_cents,publicCents:total.public_cents,nonmatchingCents:total.nonmatching_cents};
    });
    return {...frozen,snapshot:active.snapshot,end:active.end,candidates,weekly,events,eventCatalog:timelineCatalog.version,
      refresh:{status:active.source_files.some(source=>source.method==='user_supplied_manual_export')?'provisional':'validated',sourceRows:active.rows,
        scope:'Transaction-date curves and reviewed event windows; donor profiles, geography and editorial findings stay on their dated edition.'}};
  })();
  activeTimelineCache={snapshot:active.snapshot,result};
  result.catch(()=>{if(activeTimelineCache?.result===result)activeTimelineCache=undefined;});
  return result;
}
