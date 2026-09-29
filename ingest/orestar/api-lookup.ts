/** Offline discovery only: this command never calls ORESTAR or replays tokens. */
import {readFileSync} from 'node:fs';
const catalogue=JSON.parse(readFileSync('research/campaign-finance/api/endpoint-catalogue.json','utf8'));
const args=process.argv.slice(2);const json=args.includes('--json');
const query=args.filter(a=>!a.startsWith('--')).join(' ').toLowerCase();
const rows=catalogue.endpoints.filter((e:{path:string})=>(args.includes('--all')||!(/\/js\//.test(e.path)))&&e.path.toLowerCase().includes(query));
if(json)console.log(JSON.stringify({scope:catalogue.scope,generatedAt:catalogue.generatedAt,endpoints:rows},null,2));
else{
  console.log('ORESTAR public UI reference — reconstructed, not an official or exhaustive API spec.');
  console.log('Offline lookup only. Ordinary session navigation and fresh CSRF tokens are required.\n');
  for(const e of rows){
    console.log(`${e.methods.join('/')||'METHOD UNVERIFIED'} ${e.path} [${e.status}]`);
    const queryNames=[...new Set(e.observations.flatMap((o:{query:string[]})=>o.query))];
    const fields=[...new Set(e.forms.flatMap((f:{fields:{name:string}[]})=>f.fields.map(v=>v.name)))];
    if(queryNames.length)console.log('  Observed query keys: '+queryNames.join(', '));
    if(fields.length)console.log('  Observed form controls: '+fields.join(', '));
    if(e.responses.length)console.log('  Responses: '+[...new Set(e.responses.map((r:{status:number;contentType:string})=>`${r.status} ${r.contentType}`))].join('; '));
  }
  console.log(`\n${rows.length} matches. Add --json for observed options and evidence; --all includes script assets.`);
  console.log('Workflow recipes: research/campaign-finance/api/WORKFLOWS.md');
}
