/** Deterministic, local-only district ZIP publication from the immutable candidate ZIP snapshot. */
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';

const sourcePath='src/lib/campaign-finance/zip-map-data.json';
const appPath='src/lib/campaign-finance/district-zip-data.json';
const publicPath='public/data/campaign-finance/zip-map/district-zip-totals.csv';
const coveragePath='public/data/campaign-finance/zip-map/district-coverage.csv';
const sourceBytes=readFileSync(sourcePath);
const source=JSON.parse(sourceBytes.toString('utf8'));
const races=[
  {id:'portland-district-3',label:'District 3',rosteredCandidates:21},
  {id:'portland-district-4',label:'District 4',rosteredCandidates:12},
];
const categories=['mapped','other_zip','unidentified','missing_zip','invalid_zip','public'];
const sum=(rows,key)=>rows.reduce((total,row)=>total+(row[key]??0),0);
const rows=[];
const coverageRows=[];
const published=[];
for(const race of races){
  const members=source.candidates.filter(candidate=>candidate.raceId===race.id);
  if(!members.length||new Set(members.map(member=>member.committeeId)).size!==members.length)throw Error('Missing or duplicate committee in '+race.id);
  const coverageCents=Object.fromEntries(categories.map(key=>[key,sum(members.map(member=>member.coverageCents),key)]));
  const coverageRecords=Object.fromEntries(categories.map(key=>[key,sum(members.map(member=>member.coverageRecords),key)]));
  const zipMap=new Map();
  for(const member of members){
    for(const row of member.zipTotals){
      const previous=zipMap.get(row.zip5);
      if(previous&&previous.mapped!==row.mapped)throw Error('Conflicting polygon assignment for '+row.zip5);
      zipMap.set(row.zip5,{zip5:row.zip5,cents:(previous?.cents??0)+row.cents,records:(previous?.records??0)+row.records,mapped:row.mapped});
    }
  }
  const zipTotals=[...zipMap.values()].sort((a,b)=>a.zip5.localeCompare(b.zip5));
  const cashCents=sum(members,'cashCents');
  if(sum(Object.values(coverageCents).map(value=>({value})),'value')!==cashCents)throw Error('Cash reconciliation failed for '+race.id);
  if(sum(zipTotals,'cents')!==coverageCents.mapped+coverageCents.other_zip)throw Error('ZIP reconciliation failed for '+race.id);
  if(sum(zipTotals.filter(row=>row.mapped),'cents')!==coverageCents.mapped)throw Error('Map reconciliation failed for '+race.id);
  if(sum(zipTotals,'records')!==coverageRecords.mapped+coverageRecords.other_zip)throw Error('ZIP record reconciliation failed for '+race.id);
  const entry={raceId:race.id,candidate:race.label+' — '+members.length+' reviewed campaigns combined',reviewedCommittees:members.length,rosteredCandidates:race.rosteredCandidates,committeeIds:members.map(member=>member.committeeId).sort(),cashCents,coverageCents,coverageRecords,zipTotals};
  published.push(entry);
  for(const row of zipTotals)rows.push([source.snapshot,race.id,members.length,race.rosteredCandidates,row.zip5,row.cents,row.records,row.mapped?'yes':'no']);
  for(const key of categories)coverageRows.push([source.snapshot,race.id,members.length,race.rosteredCandidates,key,coverageCents[key],coverageRecords[key]]);
}
const result={
  version:'district-zip-map-v1',
  snapshot:source.snapshot,
  start:source.start,
  end:source.end,
  candidateZipSourceSha256:createHash('sha256').update(sourceBytes).digest('hex'),
  definition:'Sums of gross cash contribution transactions across reviewed candidate committees in each council race. A gift to two different committees is two transactions. City matching, unidentified, and other unlocated sources are not assigned to ZIPs. Unlinked candidates are missing, not zero.',
  races:published,
};
const csv=(header,body)=>[header,...body.map(row=>row.join(','))].join('\n')+'\n';
for(const [path,value] of [
  [appPath,JSON.stringify(result,null,2)+'\n'],
  [publicPath,csv('snapshot,race_id,reviewed_committees,rostered_candidates,zip5,gross_nonmatching_cash_cents,contribution_records,on_local_map',rows)],
  [coveragePath,csv('snapshot,race_id,reviewed_committees,rostered_candidates,category,gross_cash_cents,contribution_records',coverageRows)],
]){
  mkdirSync(dirname(path),{recursive:true});
  writeFileSync(path+'.tmp',value);
  renameSync(path+'.tmp',path);
}
console.log('Published '+published.length+' district views, '+rows.length+' district-ZIP rows; all totals reconciled.');
