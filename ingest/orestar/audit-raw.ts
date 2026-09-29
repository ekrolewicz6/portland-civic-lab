import {readFileSync,writeFileSync} from 'node:fs';
import {DuckDBInstance} from '@duckdb/node-api';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {spreadsheetRows,activeLeaves} from './download-contributions';
const sources=['contributions','non-contributions'];
const allIds=new Set<string>();
const audits=[];
for(const source of sources){
  const dir=resolve(`runtime-data/orestar/${source}-2025-01-01_2026-09-27`);
  const manifest=JSON.parse(readFileSync(resolve(dir,'manifest.json'),'utf8'));
  for(const e of activeLeaves(manifest)){
    if(e.status==='empty')continue;
    const data=spreadsheetRows(resolve(dir,e.rawFile!));
    if(data.rows.length!==e.count)throw Error(`Raw count mismatch: ${e.key}`);
    for(const row of data.rows){
      if(row.length!==45)throw Error(`Raw row width ${row.length}: ${e.key}`);
      const id=row[data.transactionIdIndex];
      if(!id||allIds.has(id))throw Error(`Raw ID missing or duplicate: ${id}`);
      allIds.add(id);
    }
    audits.push({source,key:e.key,records:data.rows.length,headers:data.headers.length});
  }
}
if(allIds.size!==316926)throw Error(`Raw total ${allIds.size}`);
async function verifyNormalizedIds(){
  const manifest=JSON.parse(readFileSync('research/campaign-finance/snapshot-manifest.json','utf8'));
  const db=await DuckDBInstance.create(resolve(manifest.database),{access_mode:'READ_ONLY',threads:'2'});const con=await db.connect();
  try{
    const rows=(await con.runAndReadAll('SELECT transaction_id FROM transactions')).getRowObjectsJson();
    if(rows.length!==allIds.size||rows.some(r=>!allIds.has(String(r.transaction_id))))throw Error('Raw and normalized transaction ID sets disagree');
    const idSetSha256=createHash('sha256').update([...allIds].sort().join('\n')).digest('hex');
    writeFileSync('research/campaign-finance/raw-export-audit.json',JSON.stringify({status:'passed',uniqueIds:allIds.size,normalizedIdSet:'exactly equal',idSetSha256,exports:audits},null,2)+'\n');
    console.log(`Verified ${audits.length} raw exports, 45 original fields, and exact equality of all ${allIds.size} raw/normalized transaction IDs.`);
  }finally{con.closeSync();db.closeSync();}
}
verifyNormalizedIds().catch(error=>{console.error(error);process.exitCode=1;});
