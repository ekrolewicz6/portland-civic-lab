/* Reproduce the audit against an unmodified source snapshot.
 * Usage: node run-audit.cjs /absolute/path/to/source [output-directory]
 * Requires npm ci --ignore-scripts in that snapshot. Never uses production data.
 * Source TypeScript is transpiled in memory; only cookies, network, Stripe,
 * notifications, and the database connection are substituted. Original server
 * actions, auth helpers, query logic, validators, and routing execute unchanged.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const source = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3] || __dirname);
process.chdir(source);
for (const key of ['DATABASE_URL','WORKOS_CLIENT_ID','WORKOS_API_KEY','WORKOS_COOKIE_PASSWORD','STRIPE_SECRET_KEY','ANTHROPIC_API_KEY','SUPABASE_SERVICE_ROLE_KEY']) delete process.env[key];
process.env.DISABLE_DEV_PERSONAS = 'false';
process.env.STRIPE_WEBHOOK_SECRET = 'audit-local-only';
const localRequire = Module.createRequire(path.join(source,'package.json'));
const ts = localRequire('typescript');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(name, parent, ...rest) {
  if (name.startsWith('@/')) name = path.join(source,'src',name.slice(2));
  return originalResolve.call(this,name,parent,...rest);
};
for (const ext of ['.ts','.tsx']) Module._extensions[ext] = (module, filename) => {
  const js = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  module._compile(js,filename);
};
const results=[];
const record=(id,scenario,expected_safe,observed,gap=false)=>results.push({id,scenario,expected_safe,observed,verdict:gap?'gap_confirmed':'control_passed'});
let database, persona='homeowner', notificationCalls=0, stripeCalls=[], stripeEvent;
const stripeMock={checkout:{sessions:{create:async data=>{stripeCalls.push(data);return {id:'cs_audit_'+stripeCalls.length,url:'https://example.invalid/local-audit',payment_intent:null};}}},webhooks:{constructEvent:()=>stripeEvent},charges:{retrieve:async()=>({receipt_url:'https://example.invalid/receipt'})}};
const originalLoad=Module._load;
Module._load=function(name,parent,...rest){
  if(name==='@/lib/db') return {db:database};
  if(name==='@/lib/stripe/client') return {hasStripe:true,getStripe:()=>stripeMock};
  if(name==='@/lib/notifications/triggers') return {notifyStatusChange:async()=>{notificationCalls++;}};
  if(name==='next/headers') return {cookies:async()=>({get:key=>key==='dev-persona'&&persona?{value:persona}:undefined,set:()=>{},delete:()=>{}})};
  if(name==='next/navigation') return {redirect:to=>{throw new Error('AUDIT_REDIRECT:'+to);}};
  return originalLoad.call(this,name,parent,...rest);
};
global.fetch=async()=>{throw new Error('AUDIT_NETWORK_DISABLED');};
for(const protocol of ['node:http','node:https']){const mod=require(protocol);mod.request=mod.get=()=>{throw new Error('AUDIT_NETWORK_DISABLED');};}
const get=relative=>localRequire(path.join(source,relative));
const flatten=s=>s.steps.flatMap(st=>st.sections.flatMap(sec=>sec.fields));
const forms=fs.readdirSync(path.join(source,'catalog/forms')).flatMap(category=>fs.readdirSync(path.join(source,'catalog/forms',category)).filter(f=>f.endsWith('.json')).map(f=>({category,path:`catalog/forms/${category}/${f}`,schema:JSON.parse(fs.readFileSync(path.join(source,'catalog/forms',category,f),'utf8'))}))).sort((a,b)=>a.schema.slug.localeCompare(b.schema.slug));
const form=slug=>forms.find(f=>f.schema.slug===slug).schema;
function fixture(schema){
 const data={};
 for(const f of flatten(schema)){
  if(['info','section-header'].includes(f.type))continue;
  if(f.type==='address')data[f.key]={street:'1900 SW 4th Ave',city:'Portland',state:'OR',zip:'97201'};
  else if(['select','radio'].includes(f.type))data[f.key]=String((f.options?.find(o=>['no','residential','single-family','homeowner','wood','rear-yard','prescriptive','roof-flush'].includes(o.value))||f.options?.[0]||{value:'audit'}).value);
  else if(['checkbox-group','multi-select'].includes(f.type))data[f.key]=[String((f.options?.[0]||{value:'audit'}).value)];
  else if(f.type==='checkbox')data[f.key]=true;
  else if(['number','currency'].includes(f.type))data[f.key]=Math.min(f.validation?.max??Infinity,Math.max(f.validation?.min??0,f.type==='currency'?1000:1));
  else if(f.type==='email')data[f.key]='audit@example.invalid';
  else if(f.type==='phone')data[f.key]='5035550100';
  else if(f.type==='date')data[f.key]='2026-09-09';
  else if(f.type==='date-range')data[f.key]={start:'2026-09-09',end:'2026-09-10'};
  else if(f.type==='file-upload')data[f.key]=[{name:'audit.pdf',size:100,type:'application/pdf',storagePath:'audit/nonexistent.pdf',uploaded:true}];
  else if(f.type==='repeater')data[f.key]=[{audit:'synthetic'}];
  else data[f.key]='Synthetic audit value '.repeat(6);
 }
 return data;
}
const docsFor=(schema,data)=>flatten(schema).filter(f=>f.type==='file-upload').map(f=>({key:f.key,filename:'audit.pdf',mimeType:'application/pdf',fileSizeBytes:100}));
const {runPipeline}=get('src/lib/review-pipeline/pipeline.ts');
const {checkAutoApproval}=get('src/lib/review-pipeline/auto-approve.ts');
const {routeToDisciplines}=get('src/lib/review-pipeline/disciplines.ts');
const {runCompletenessCheck}=get('src/lib/review-pipeline/stages/completeness.ts');
const {runDocumentValidation}=get('src/lib/review-pipeline/stages/document-validation.ts');
const {buildStepSchema}=get('src/lib/form-engine/schema-to-zod.ts');
const run=(slug,changes={},docs,zoningData)=>{try{return runPipeline({applicationId:'audit-'+slug,formSlug:slug,formSchema:form(slug),formData:{...fixture(form(slug)),...changes},documents:docs??docsFor(form(slug)),zoningData});}catch(e){return {autoApproved:false,currentStage:'exception',assignedDisciplines:[],allFindings:[],error:e.message};}};
const summary=r=>({autoApproved:r.autoApproved,stage:r.currentStage,disciplines:r.assignedDisciplines,blockers:r.allFindings.filter(f=>f.severity==='blocker').map(f=>f.id),warnings:r.allFindings.filter(f=>f.severity==='warning').map(f=>f.id),...(r.error?{error:r.error}:{})});
async function main(){
 const inventory=[];
 for(const entry of forms){
  const s=entry.schema, fields=flatten(s),r=run(s.slug); let empty,clientException=null;
  try{empty=runCompletenessCheck({applicationId:'empty',formSchema:s,formData:{},uploadedDocumentKeys:[]});}catch(e){empty={passed:false,error:e.message};}
  const uploadKeys=fields.filter(f=>f.type==='file-upload').map(f=>f.key);
  const docCheck=runDocumentValidation({applicationId:'audit',formSlug:s.slug,documents:docsFor(s)});
  let fileMismatch=false;try{fileMismatch=uploadKeys.length>0&&s.steps.some(step=>{const z=buildStepSchema(step,fixture(s)).safeParse(fixture(s));return !z.success&&z.error.issues.some(i=>uploadKeys.includes(i.path[0])&&i.code==='invalid_type');});}catch(e){clientException=e.message;}
  const metadata=get('src/lib/form-engine/loader.ts').getFormCatalog().find(f=>f.slug===s.slug);
  inventory.push({slug:s.slug,title:s.title,category:entry.category,source_path:entry.path,catalog_metadata:metadata,registry_present:!!get('src/lib/form-engine/loader.ts').getFormSchema(s.slug),steps:s.steps.length,fields:fields.length,required_fields:fields.filter(f=>f.validation?.required).length,upload_fields:uploadKeys,declared_documents:s.requiredDocuments??[],default_disciplines:routeToDisciplines({formSlug:s.slug,formData:{}}),fixture_result:summary(r),empty_form_blocked:!empty.passed,empty_form_exception:empty.error??null,client_exception:clientException,unmatchable_document_keys:docCheck.findings.filter(f=>f.id.startsWith('doc-missing-')).map(f=>f.field),client_file_shape_mismatch:fileMismatch});
 }
 fs.writeFileSync(path.join(output,'catalog-verification.json'),JSON.stringify(inventory,null,2));
 for(const slug of ['electrical-permit','mechanical-permit','plumbing-permit','field-issuance-remodel','fence-permit','solar-permit']){
  const r=run(slug); record('BASE-'+slug,'Synthetic complete field fixture with catalog upload keys','Workflow should consistently interpret its own schema',summary(r),slug==='solar-permit'&&!r.autoApproved);
  const e=runPipeline({applicationId:'empty',formSlug:slug,formSchema:form(slug),formData:{},documents:[]});assert.equal(e.autoApproved,false);record('EMPTY-'+slug,'Empty application','Must not auto-approve',summary(e));
 }
 for(const [id,slug,changes] of [
  ['FENCE-MATERIAL','fence-permit',{fenceType:'masonry-concrete',fenceHeight:6,swimmingPoolBarrier:'no'}],
  ['FENCE-FRONT','fence-permit',{fenceHeight:6,fenceLocation:['front-yard'],swimmingPoolBarrier:'no'}],
  ['FENCE-CORNER','fence-permit',{fenceHeight:6,fenceLocation:['corner-lot-street-side'],swimmingPoolBarrier:'no'}],
  ['FENCE-HISTORIC','fence-permit',{fenceHeight:6,withinHistoricDistrict:'yes',inOverlayZone:'yes',swimmingPoolBarrier:'no'}],
  ['FIR-COST','field-issuance-remodel',{estimatedCost:500000}],
  ['FIR-ATTESTATION','field-issuance-remodel',{confirmRegistered:false,attestNonStructural:false}],
  ['MECH-COMMERCIAL','mechanical-permit',{propertyType:'commercial',workType:['hood-vent']}],
  ['PLUMB-MEDICAL','plumbing-permit',{propertyType:'commercial',workType:['medical-gas']}],
  ['ELECTRIC-LICENSE','electrical-permit',{performedBy:'contractor',contractorCcb:'not-a-license',contractorBcdLicense:'invalid'}],
  ['CERT-FALSE','electrical-permit',{certifyAccurate:false,certifyCode:false,certifyLicense:false}],
  ['BAD-EMAIL','electrical-permit',{email:'not an email'}]
 ]){const r=run(slug,changes);record(id,'Real catalog field adverse scenario: '+JSON.stringify(changes),'Must not receive unsupported automatic approval',summary(r),r.autoApproved);}
 for(const [id,changes,expected] of [['FENCE-WOOD-7',{fenceMaterial:'wood',fenceHeight:7},true],['FENCE-WOOD-OVER',{fenceMaterial:'wood',fenceHeight:7.01},false],['FENCE-MASONRY-4',{fenceMaterial:'masonry-concrete',fenceHeight:4},true],['FENCE-MASONRY-OVER',{fenceMaterial:'masonry-concrete',fenceHeight:4.01},false],['FENCE-CHAIN-8',{fenceMaterial:'chain-link',fenceHeight:8},true],['FENCE-CHAIN-OVER',{fenceMaterial:'chain-link',fenceHeight:8.01},false],['FENCE-POOL',{swimmingPoolBarrier:'yes'},false]]){
  const r=checkAutoApproval({formSlug:'fence-permit',formData:changes,stageResults:[{passed:true,findings:[]}]});assert.equal(r.eligible,expected);record(id,'Internal approval boundary (engine field names, not UI names)','Match encoded threshold, not proof of legal coverage',r);
 }
 for(const [id,slug,data,expected] of [['SOLAR-25','solar-permit',{systemSizeKw:25},true],['SOLAR-OVER','solar-permit',{systemSizeKw:25.01},false],['SOLAR-GROUND-INTERNAL','solar-permit',{mountType:'ground'},false],['FIR-50000','field-issuance-remodel',{estimatedValuation:50000},true],['FIR-OVER','field-issuance-remodel',{estimatedValuation:50001},false],['FIR-STRUCTURAL-INTERNAL','field-issuance-remodel',{structuralChanges:true},false]]){const r=checkAutoApproval({formSlug:slug,formData:data,stageResults:[{passed:true,findings:[]}]});assert.equal(r.eligible,expected);record(id,'Internal threshold boundary','Match encoded criterion only',r);}
 const solarDocs=['site_plan','electrical_diagram'].map(key=>({key,filename:'blank.pdf',mimeType:'application/pdf',fileSizeBytes:1}));
 const sr=run('solar-permit',{mountingType:'ground',reviewPath:'engineered',propertyType:'commercial',systemSizeKw:20},solarDocs);record('SOLAR-ADVERSE','Supply document keys expected by engine, then select ground/engineered/commercial in actual form','Must route for appropriate substantive review',summary(sr),sr.autoApproved);
 const er=run('fence-permit',{fenceHeight:6,swimmingPoolBarrier:'no'},[],{environmentalZones:['p'],overlays:['d']});record('OVERLAY-DROPPED','Environmental and design warnings on auto-approval candidate','Required review must block auto-approval until disposition',summary(er),er.autoApproved&&er.assignedDisciplines.length===0);
 const dr=runDocumentValidation({applicationId:'audit',formSlug:'solar-permit',documents:solarDocs});record('DOC-CONTENT','Metadata claims two one-byte PDFs; no bytes available to validator','Substantive plan validity cannot be established from metadata',{passed:dr.passed,findings:dr.findings},dr.passed);
 const emptyDoc=runDocumentValidation({applicationId:'audit',formSlug:'solar-permit',documents:solarDocs.map(d=>({...d,fileSizeBytes:0}))});assert.equal(emptyDoc.passed,false);record('DOC-EMPTY','Zero-byte required PDF','Must block',emptyDoc.findings.map(f=>f.id));
 const wrongDoc=runDocumentValidation({applicationId:'audit',formSlug:'solar-permit',documents:solarDocs.map(d=>({...d,mimeType:'text/plain'}))});assert.equal(wrongDoc.passed,false);record('DOC-MIME','Wrong declared MIME type','Must block',wrongDoc.findings.map(f=>f.id));
 const {PGlite}=localRequire('@electric-sql/pglite');const {drizzle}=localRequire('drizzle-orm/pglite');const dbSchema=get('src/lib/db/schema.ts');const {eq}=localRequire('drizzle-orm');const client=new PGlite();database=drizzle(client,{schema:dbSchema});
 const seed=fs.readFileSync(path.join(source,'scripts/seed.ts'),'utf8');const createSql=seed.match(/await execSql\(`([\s\S]*?)`\);/);assert.ok(createSql);await client.exec(createSql[1]);
 const people={};for(const [p,role] of [['homeowner','citizen'],['contractor','citizen'],['admin','admin']]){[people[p]]=await database.insert(dbSchema.profiles).values({workosUserId:'user_demo_'+p,email:p+'@example.invalid',firstName:'Audit',lastName:p,role}).returning();}
 const definitions={};for(const {schema:s,category} of forms){[definitions[s.slug]]=await database.insert(dbSchema.formDefinitions).values({slug:s.slug,title:s.title,category,schema:s}).returning();}
 let seq=0;async function newApp(slug='electrical-permit',status='draft',data=fixture(form(slug))){const [a]=await database.insert(dbSchema.applications).values({referenceNumber:'AUDIT-'+(++seq),profileId:people.homeowner.id,formDefinitionId:definitions[slug].id,formData:data,status,totalSteps:form(slug).steps.length}).returning();return a;}
 const row=async id=>(await database.select().from(dbSchema.applications).where(eq(dbSchema.applications.id,id)))[0];
 const {executePipeline,advancePipelineStage}=get('src/actions/pipeline.ts');const actions=get('src/actions/applications.ts');const reviews=get('src/actions/discipline-review.ts');
 const gis=get('src/lib/zoning/gis-client.ts');const noEnv=await gis.queryEnvironmentalZones(-122.67,45.51);const noDesign=await gis.queryDesignOverlay(-122.67,45.51);record('GIS-OUTAGE','All overlay requests fail with network disabled','Preserve unknown status instead of clear overlay result',{environmentalZones:noEnv,designOverlay:noDesign},noEnv.length===0&&noDesign===false);
 for(const slug of ['adu-permit','residential-building-permit','commercial-building-permit','demolition-permit','land-use-review','tenant-improvement','sewer-lateral-connection']){
  persona='homeowner';const a=await newApp(slug);const input={applicationId:a.id,formSlug:slug,formTitle:form(slug).title,category:'permits',formData:fixture(form(slug)),totalSteps:form(slug).steps.length};const submitted=await actions.submitApplication(input);const persisted=await row(a.id);const assigned=await database.select().from(dbSchema.disciplineReviews).where(eq(dbSchema.disciplineReviews.applicationId,a.id));record('JOURNEY-'+slug,'Original submit action with synthetic records and external effects disabled','Persist application and explicitly route unresolved work',{success:submitted.success,status:persisted.status,stage:persisted.pipelineStage,reviewCount:assigned.length},!assigned.length||persisted.pipelineStage==='document_validation');
  if(slug==='adu-permit'){
   persona='admin';await reviews.completeDisciplineReview(a.id,assigned[0].discipline,'needs_correction','Synthetic correction');persona='homeowner';const draft=await actions.getLatestDraft(slug);record('CORRECTION-RESUME','Open apply route data source after requested correction','Load the application requiring corrections',{status:(await row(a.id)).status,returnedDraftId:draft?.id??null,expectedId:a.id},draft?.id!==a.id);await actions.submitApplication(input);const again=await database.select().from(dbSchema.disciplineReviews).where(eq(dbSchema.disciplineReviews.applicationId,a.id));record('CORRECTION-REVIEW-REPLAY','Resubmit same ADU after a correction request','Version review work and supersede previous round explicitly',{firstCount:assigned.length,afterCount:again.length,status:(await row(a.id)).status},again.length>assigned.length);
  }
  if(slug==='residential-building-permit'){
   const beforeDocs=(await database.select().from(dbSchema.applicationDocuments).where(eq(dbSchema.applicationDocuments.applicationId,a.id))).length;await actions.submitApplication(input);const afterDocs=(await database.select().from(dbSchema.applicationDocuments).where(eq(dbSchema.applicationDocuments.applicationId,a.id))).length;record('SUBMIT-REPLAY','Repeat original submission with same application and upload objects','Deduplicate document links and processing',{beforeDocs,afterDocs},afterDocs>beforeDocs);
  }
 }
 persona='admin';const pendingApp=await newApp('adu-permit','in_review');await database.insert(dbSchema.disciplineReviews).values([{applicationId:pendingApp.id,discipline:'structural',status:'pending'},{applicationId:pendingApp.id,discipline:'zoning',status:'pending'}]);await reviews.completeDisciplineReview(pendingApp.id,'structural','approved');assert.equal((await row(pendingApp.id)).status,'in_review');record('REVIEW-PENDING-CONTROL','One of two discipline reviews remains pending','Keep application in review',{status:(await row(pendingApp.id)).status});
 persona='homeowner';let roleDenied=false;try{await reviews.completeDisciplineReview(pendingApp.id,'zoning','approved');}catch{roleDenied=true;}assert.equal(roleDenied,true);record('REVIEW-ROLE-CONTROL','Applicant attempts staff review action','Deny',{denied:roleDenied});
 persona=null;const noAuth=await newApp();const nr=await executePipeline(noAuth.id);record('ACTION-NO-AUTH','Call original exported pipeline action with anonymous cookie context','Require authorized caller and allowable prior state',{success:nr.success,status:(await row(noAuth.id)).status},nr.success);
 persona='homeowner';const missing=await newApp('electrical-permit','submitted',{});await executePipeline(missing.id);const mr=await row(missing.id);const mreviews=await database.select().from(dbSchema.disciplineReviews).where(eq(dbSchema.disciplineReviews.applicationId,missing.id));record('MISSING-QUEUE','Persist pipeline result for empty submission','Return actionable corrections or assigned triage',{status:mr.status,stage:mr.pipelineStage,assignedReviews:mreviews.length},mr.status==='in_review'&&mreviews.length===0);
 const app=await newApp('electrical-permit','submitted');await executePipeline(app.id);const before=(await database.select().from(dbSchema.pipelineRuns).where(eq(dbSchema.pipelineRuns.applicationId,app.id))).length;await executePipeline(app.id);const after=(await database.select().from(dbSchema.pipelineRuns).where(eq(dbSchema.pipelineRuns.applicationId,app.id))).length;record('PIPELINE-REPLAY','Execute same application twice','Idempotent processing for same revision',{before,after},after>before);
 const saved=await actions.saveDraft({applicationId:app.id,formSlug:'electrical-permit',formTitle:'Electrical',category:'permits',formData:{...fixture(form('electrical-permit')),workDescription:'Changed after approval'},currentStep:0,totalSteps:3,completedSteps:[]});record('EDIT-AFTER-APPROVAL','Save draft over an already approved application','Invalidate approval or reject edit',{success:saved.success,status:(await row(app.id)).status},saved.success&&(await row(app.id)).status==='approved');
 persona='contractor';const denied=await actions.saveDraft({applicationId:app.id,formSlug:'electrical-permit',formTitle:'Electrical',category:'permits',formData:{},currentStep:0,totalSteps:3,completedSteps:[]});assert.equal(denied.success,false);record('OWNERSHIP-DRAFT','Another applicant edits original applicant draft','Deny',denied);
 persona='admin';const blocked=await newApp('adu-permit','in_review');await database.insert(dbSchema.disciplineReviews).values({applicationId:blocked.id,discipline:'structural',status:'pending'});await database.insert(dbSchema.checksheetItems).values({applicationId:blocked.id,discipline:'structural',severity:'blocker',description:'Unresolved structural defect',source:'human_review'});await reviews.completeDisciplineReview(blocked.id,'structural','approved');record('REVIEW-BLOCKER','Last discipline approves while blocker remains unresolved','Do not approve unresolved blockers',{status:(await row(blocked.id)).status},(await row(blocked.id)).status==='approved');
 const emptyReview=await newApp('tenant-improvement','in_review');await reviews.completeDisciplineReview(emptyReview.id,'structural','approved');record('REVIEW-NO-ROWS','Complete a nonexistent discipline row when no reviews exist','Require actual required-review records',{status:(await row(emptyReview.id)).status},(await row(emptyReview.id)).status==='approved');
 const stageApp=await newApp('commercial-building-permit','draft');const advanced=await advancePipelineStage(stageApp.id,'issued');record('ADMIN-ISSUE-BYPASS','Advance draft directly to issued','Require completed reviews, fees and issuing record',{result:advanced,status:(await row(stageApp.id)).status},(await row(stageApp.id)).status==='issued');
 persona=null;const pdf=get('src/app/api/applications/[id]/pdf/route.ts');const response=await pdf.GET({}, {params:Promise.resolve({id:app.id})});const html=await response.text();record('PDF-NO-AUTH','Anonymous request handler call for synthetic application','Authorize or apply an explicit public-record redaction policy',{status:response.status,containsEmail:html.includes('homeowner@example.invalid'),containsFormData:html.includes('Changed after approval')},response.status===200&&html.includes('homeowner@example.invalid'));
 persona='homeowner';const payments=get('src/actions/payments.ts');const payApp=await newApp('commercial-building-permit','draft');const checkout=await payments.createCheckoutSession({applicationId:payApp.id,formTitle:'Audit',amountCents:1,successUrl:'https://example.invalid/success',cancelUrl:'https://example.invalid/cancel'});record('PAYMENT-AMOUNT','Create checkout on draft for caller-supplied one cent','Use server assessment and eligible payment state',{result:checkout,amount:stripeCalls.at(-1)?.line_items[0].price_data.unit_amount,status:(await row(payApp.id)).status},checkout.success);record('PAYMENT-METADATA','Inspect original checkout payload','Propagate application correlation to PaymentIntent metadata',{sessionMetadata:!!stripeCalls.at(-1)?.metadata,paymentIntentData:stripeCalls.at(-1)?.payment_intent_data??null},!stripeCalls.at(-1)?.payment_intent_data);
 const webhook=get('src/app/api/webhooks/stripe/route.ts');const fire=async event=>{stripeEvent=event;return webhook.POST({text:async()=>'',headers:new Headers({'stripe-signature':'local-test-signature'})});};
 const approvedPayApp=await newApp('electrical-permit','approved');await payments.createCheckoutSession({applicationId:approvedPayApp.id,formTitle:'Audit',amountCents:10000,successUrl:'https://example.invalid/success',cancelUrl:'https://example.invalid/cancel'});await fire({type:'checkout.session.completed',data:{object:{metadata:{applicationId:approvedPayApp.id},payment_intent:'pi_approved',payment_status:'paid'}}});await fire({type:'payment_intent.succeeded',data:{object:{id:'pi_approved',metadata:{},latest_charge:null}}});record('PAYMENT-NORMAL-SEQUENCE','Completed checkout on an approved application followed by PaymentIntent without duplicated session metadata','Paid eligible application should reach issuance through a consistent correlation path',{status:(await row(approvedPayApp.id)).status,paymentStatus:(await row(approvedPayApp.id)).paymentStatus},(await row(approvedPayApp.id)).paymentStatus==='paid'&&(await row(approvedPayApp.id)).status!=='issued');
 await fire({type:'payment_intent.succeeded',data:{object:{id:'pi_audit',metadata:{applicationId:payApp.id},latest_charge:null}}});const h1=(await database.select().from(dbSchema.applicationStatusHistory).where(eq(dbSchema.applicationStatusHistory.applicationId,payApp.id))).length;await fire({type:'payment_intent.succeeded',data:{object:{id:'pi_audit',metadata:{applicationId:payApp.id},latest_charge:null}}});const h2=(await database.select().from(dbSchema.applicationStatusHistory).where(eq(dbSchema.applicationStatusHistory.applicationId,payApp.id))).length;record('PAYMENT-ISSUE-GATE','Successful PaymentIntent with application metadata on draft','Payment alone must not bypass reviews',{status:(await row(payApp.id)).status},(await row(payApp.id)).status==='issued');record('PAYMENT-REPLAY','Deliver same success notification twice','Idempotent ledger and status transition',{historyBefore:h1,historyAfter:h2},h2>h1);
 await fire({type:'payment_intent.payment_failed',data:{object:{id:'pi_audit',metadata:{applicationId:payApp.id}}}});record('PAYMENT-LATE-FAILURE','Deliver failure after success','Reject stale event or preserve reconciled state',{status:(await row(payApp.id)).status,paymentStatus:(await row(payApp.id)).paymentStatus},(await row(payApp.id)).status==='issued'&&(await row(payApp.id)).paymentStatus==='failed');
 fs.writeFileSync(path.join(output,'test-results.json'),JSON.stringify({sourceCommit:'23b4670d8d26b9093f6e401bb89d9d6f30d8506d',runAt:new Date().toISOString(),method:'Original functions + memory PostgreSQL; synthetic cookies; Stripe contract mock, not live Stripe verification; no network',total:results.length,gaps:results.filter(r=>r.verdict==='gap_confirmed').length,notificationCallsSuppressed:notificationCalls,results},null,2));
 await client.close();console.log(JSON.stringify({catalog:inventory.length,tests:results.length,gaps:results.filter(r=>r.verdict==='gap_confirmed').length,emptyBlocked:inventory.filter(r=>r.empty_form_blocked).length,noDefaultDisciplines:inventory.filter(r=>!r.default_disciplines.length).length,uploadForms:inventory.filter(r=>r.upload_fields.length).length,clientFileShapeMismatch:inventory.filter(r=>r.client_file_shape_mismatch).length,documentKeyMismatch:inventory.filter(r=>r.unmatchable_document_keys.length).map(r=>r.slug)},null,2));
}
main().catch(error=>{fs.writeFileSync(path.join(output,'harness-error.txt'),error.stack);console.error(error);process.exitCode=1;});
