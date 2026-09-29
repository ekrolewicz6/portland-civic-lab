/** Offline expansion from archived public scripts; no route guessing or calls. */
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root='research/campaign-finance/api';
const archive='runtime-data/orestar-analysis/endpoint-map';
const catalogue=JSON.parse(readFileSync(root+'/endpoint-catalogue.json','utf8'));
for(const file of readdirSync(archive).filter(f=>/\.(html|js)$/.test(f))){
  const script=readFileSync(archive+'/'+file,'utf8');
  for(const match of script.matchAll(/(?:\/orestar)?\/ajaxdataserver\/[A-Za-z0-9_]+/g)){
    const path=match[0].startsWith('/orestar/')?match[0]:'/orestar'+match[0];
    const context=script.slice(match.index!,match.index!+600);
    const template=context.match(/parameters?\s*[:=]\s*["']([^"']*)["']/)?.[1]??(context.includes('data: "code="')?'code=':'');
    const query=[...template.matchAll(/(?:^|,|&)([A-Za-z][A-Za-z0-9_]*)=/g)].map(m=>m[1]);
    let route=catalogue.endpoints.find((e:{path:string})=>e.path===path);
    if(!route){route={path,methods:[],observations:[],responses:[],forms:[],status:'observed-reference-only'};catalogue.endpoints.push(route);}
    const observation={source:'local-archive:'+file,kind:'public-script-parameter-template',query,example:'https://secure.sos.state.or.us'+path,parameterTemplate:template,sourceSha256:createHash('sha256').update(script).digest('hex')};
    if(!route.observations.some((o:{source:string;kind:string})=>o.source===observation.source&&o.kind===observation.kind))route.observations.push(observation);
  }
}
catalogue.endpoints.sort((a:{path:string},b:{path:string})=>a.path.localeCompare(b.path));
catalogue.staticInspectionAt=new Date().toISOString();
catalogue.failures=catalogue.failures.map((f:Record<string,unknown>)=>({...f,error:String(f.error).split('\n')[0]}));
writeFileSync(root+'/endpoint-catalogue.json',JSON.stringify(catalogue,null,2)+'\n');
writeFileSync(root+'/README.md',`# ORESTAR public endpoint catalogue\n\nReconstructed public HTML/form/network/script reference. **Not an official or exhaustive API specification.** No private filing or account mutation was exercised.\n\n${catalogue.endpoints.length} observed routes/assets; ${catalogue.pages.length} captured page states. Offline script inspection: ${catalogue.staticInspectionAt}.\n\n| Route | Observed methods | Verification |\n|---|---|---|\n${catalogue.endpoints.map((e:{path:string;methods:string[];status:string})=>`| \`${e.path}\` | ${e.methods.join(', ')||'Not established'} | ${e.status} |`).join('\n')}\n\nUse \`npm run orestar:api -- transaction\` for offline lookup. Add \`--json\` for field options and evidence. Parameter templates do not establish a working server contract. HTTP 200 does not establish correct result content. Read WORKFLOWS.md for sequential-session recipes and current limitations.\n`);
console.log(catalogue.endpoints.length+' observed routes/assets after offline script inspection');
