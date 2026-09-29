/** One public ORESTAR collector at a time. Recover only a proven-dead owner. */
import {appendFileSync,existsSync,mkdirSync,readFileSync,renameSync,unlinkSync,writeFileSync} from 'node:fs';
const directory='runtime-data/orestar-analysis/enrichment';
const lock=directory+'/.collector.lock';
export function acquirePublicSession(){
  mkdirSync(directory,{recursive:true});
  if(existsSync(lock)){
    const pid=Number(readFileSync(lock,'utf8'));
    if(!Number.isInteger(pid)||pid<2)throw Error('Unrecognized collector lock; inspect before recovery');
    let terminated=false;
    try{process.kill(pid,0);}catch(error){if((error as NodeJS.ErrnoException).code==='ESRCH')terminated=true;else throw error;}
    if(!terminated)throw Error(`ORESTAR collector ${pid} is active; do not parallelize source requests`);
    const recovery=lock+'.recovered-'+Date.now();renameSync(lock,recovery);
    appendFileSync(directory+'/events.ndjson',JSON.stringify({at:new Date().toISOString(),type:'stale_lock_recovered',pid,recovery})+'\n');
  }
  writeFileSync(lock,String(process.pid),{flag:'wx'});
  return ()=>{if(existsSync(lock)&&readFileSync(lock,'utf8')===String(process.pid))unlinkSync(lock);};
}
