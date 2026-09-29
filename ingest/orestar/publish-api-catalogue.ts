/** Publish an explicitly reconstructed contract; never imply vendor support. */
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
type Field={name:string;type:string;required:boolean;value?:string;options?:{value:string;label:string}[]};
type Form={method:string;fields:Field[];source:string};
type Route={path:string;methods:string[];status:string;forms:Form[];observations:{kind:string;query:string[];example:string;source:string}[];responses:{status:number;contentType:string}[]};
const root=resolve('research/campaign-finance/api');
const catalogue=JSON.parse(readFileSync(resolve(root,'endpoint-catalogue.json'),'utf8'));
// Browser exceptions may contain cookies in multiline request traces. Publish
// only the useful first-line failure, never cookies, headers or token values.
catalogue.failures=catalogue.failures.map((f:Record<string,unknown>)=>({...f,error:String(f.error).split('\n')[0]}));
const excluded=(path:string)=>/\/js\/|SignOut|amendceWorkQueue|transactionReviewEdit|\/vr\/|JavaScriptServlet/.test(path);
const paths:Record<string,unknown>={};
for(const route of catalogue.endpoints as Route[]){
  if(excluded(route.path))continue;
  const operations:Record<string,unknown>={};
  for(const method of route.methods.filter(m=>['GET','POST'].includes(m))){
    const forms=route.forms.filter(f=>f.method===method);
    const grouped=new Map<string,Field[]>();
    for(const form of forms)for(const field of form.fields){
      if(field.type==='button'||field.type==='reset')continue;
      const variants=grouped.get(field.name)??[];
      if(!variants.some(v=>JSON.stringify(v)===JSON.stringify(field)))variants.push(field);
      grouped.set(field.name,variants);
    }
    const properties:Record<string,unknown>={};
    for(const[name,variants]of grouped){
      const repeated=forms.some(form=>form.fields.filter(f=>f.name===name&&f.type!=='radio'&&f.type!=='submit').length>1);
      const multiple=variants.some(f=>f.type==='select-multiple');
      const options=[...new Map(variants.flatMap(f=>f.options??[]).map(o=>[o.value,o])).values()];
      properties[name]={...(multiple?{type:'array',items:{type:'string'}}:repeated?{oneOf:[{type:'string'},{type:'array',items:{type:'string'}}]}:{type:'string'}),
        description:/csrf/i.test(name)?'Fresh token from the same anonymous session; do not replay saved values.':
          'Observed public-form control. Disabled controls, submit action and dependent selections affect the payload. Server requirements are not fully established.',
        'x-observed-control-types':[...new Set(variants.map(f=>f.type))],
        ...(options.length?{'x-observed-options':options}:{}),
        ...(repeated?{'x-repeated-name':true}:{}),
      };
    }
    const queryNames=new Set(route.observations.flatMap(o=>o.query));
    const parameters=method==='GET'?[...new Set([...queryNames,...grouped.keys()])].map(name=>({name,in:'query',required:false,schema:properties[name]??{type:'string'}})):[];
    const observedTypes=[...new Set(route.responses.map(r=>r.contentType.split(';')[0]).filter(Boolean))];
    const mediaTypes=observedTypes.length?observedTypes:[route.path.includes('Xcel')?'application/octet-stream':'text/html'];
    operations[method.toLowerCase()]={summary:`Observed public UI route: ${route.path}`,
      description:'Reconstructed web-interface contract, not an official JSON API. Session state and CSRF may apply. Read public content only; do not submit filings. HTTP 200 may contain an incomplete/error page.',
      operationId:`${method.toLowerCase()}_${route.path.replace(/[^A-Za-z0-9]/g,'_')}`,parameters,
      ...(method==='POST'?{requestBody:{required:false,content:{'application/x-www-form-urlencoded':{schema:{type:'object',properties}}}}}:{}),
      responses:{'200':{description:'Observed or expected public response; validate page identity and complete content before using it.',content:Object.fromEntries(mediaTypes.map(type=>[type,{schema:{type:'string'}}]))}},
      'x-verification':route.status,'x-observed-responses':route.responses,'x-evidence':route.observations,'x-session-stateful':true,
      ...(route.path.includes('XcelCNESearch')?{'x-export-row-cap':5000,'x-safe-full-export-strategy':'Frozen nonoverlapping date/type/subtype partitions; verify count, hash, coverage and unique IDs.'}:{}),
    };
  }
  if(Object.keys(operations).length)paths[route.path]=operations;
}
const spec={openapi:'3.1.0',info:{title:'ORESTAR observed public read surface (reconstructed)',version:'2026-09-27.2',description:'Unofficial research contract from public HTML, forms, scripts and network observations. Not exhaustive or vendor-supported. Unresolved workflows remain in the catalogue.'},servers:[{url:'https://secure.sos.state.or.us'}],paths,
  'x-session-guidance':'Use ordinary navigation, fresh CSRF tokens and one sequential session. Dropdowns and account-year navigation depend on session state. Respect rate limits and stop at access controls.',
  'x-official-upload-specifications':'https://sos.oregon.gov/elections/Pages/manuals-tutorials.aspx',
  'x-private-or-nonfinance-routes-excluded':(catalogue.endpoints as Route[]).filter(e=>excluded(e.path)).map(e=>e.path)};
const destination=resolve('public/data/campaign-finance/api');mkdirSync(destination,{recursive:true});
for(const directory of [root,destination]){
  for(const [name,data]of [['openapi.reconstructed.json',spec],['endpoint-catalogue.json',catalogue]] as const){
    const json=JSON.stringify(data,null,2)+'\n';
    if(/cookie:|JSESSIONID_ORESTAR=|OWASP_CSRFTOKEN=(?!SESSION_VALUE)[A-Z0-9-]+/i.test(json))throw Error('Session-bearing data cannot be published');
    writeFileSync(resolve(directory,name),json);
  }
}
console.log(`${Object.keys(paths).length} public route contracts; ${catalogue.endpoints.length} total observed routes/assets; ${catalogue.failures.length} retained failure attempts.`);
