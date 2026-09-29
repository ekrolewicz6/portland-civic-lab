import 'server-only';
import { DuckDBInstance } from '@duckdb/node-api';
import { createHash } from 'node:crypto';
import { createReadStream, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import crosswalk from '../../../public/data/campaign-finance/committee-race-crosswalk.json';
import { activeManifest, type ActiveManifest } from './active';
import { FilterError, type Filters } from './filters';
import type { CommitteeFacts } from './candidate-facts';
import type { ContributionRecord } from './donation-records';

type Link = { raceId:string; committeeId:string; status:string; candidateId:string; candidateName:string };
export const reviewedLinks = crosswalk.links as Link[];
export const PAGE_SIZE = 25;
const PUBLIC_MATCHING_IDS = readFileSync(resolve(process.cwd(), 'public/data/campaign-finance/public-matching-receipts.csv'), 'utf8')
  .split(/\r?\n/).slice(1).filter(Boolean).map(row => row.split(',')[0]);
if (!PUBLIC_MATCHING_IDS.length || PUBLIC_MATCHING_IDS.some(id => !/^\d+$/.test(id)) || new Set(PUBLIC_MATCHING_IDS).size !== PUBLIC_MATCHING_IDS.length) {
  throw new Error('Reviewed City matching transaction IDs are missing or invalid.');
}
export type Transaction = { transaction_id:string; original_id:string|null; transaction_date:string; filed_date:string|null; status:string; committee_id:string; committee_name:string; entity_id:string; entity_name:string; identity_status:string; subtype:string; basis:string; direction:string; amount_cents:string; city:string; state:string; purpose_codes:string; source_dataset:string; source_row:number; retrieved_at:string; family:string };
export type BasisTotal={ basis:string; records:string; amount_cents:string };
let database: { snapshot: string; promise: Promise<DuckDBInstance> } | undefined;
async function instance() {
  const manifest=activeManifest();
  if (database?.snapshot !== manifest.snapshot) database={snapshot:manifest.snapshot,promise:(async()=>{
    const path=resolve(process.cwd(),manifest.database);
    const hash=createHash('sha256');
    for await (const chunk of createReadStream(path)) hash.update(chunk);
    if(hash.digest('hex')!==manifest.database_sha256)throw new Error('Campaign-finance snapshot checksum mismatch; rebuild and verify before serving.');
    return DuckDBInstance.create(path,{access_mode:'READ_ONLY',threads:'2',memory_limit:'256MB',enable_external_access:'false',allow_unsigned_extensions:'false'});
  })().catch(error=>{database=undefined;throw error;})};
  return { db:await database.promise,manifest };
}
function where(f:Filters,manifest:ActiveManifest) {
  const clauses=['transaction_date >= ?','transaction_date <= ?'];
  const values:string[]=[f.start,f.end];
  if(f.family==='contributions')clauses.push("family='Contribution'");
  if(f.family==='everything_else')clauses.push("family<>'Contribution'");
  if(f.basis!=='all'){clauses.push('basis=?');values.push(f.basis);}
  if(f.matching!=='all'){
    if (manifest.snapshot.endsWith('-v1')) {
      const placeholders=PUBLIC_MATCHING_IDS.map(()=>'?').join(',');
      clauses.push(`transaction_id ${f.matching==='only'?'IN':'NOT IN'} (${placeholders})`);
      values.push(...PUBLIC_MATCHING_IDS);
    } else clauses.push(`transaction_id ${f.matching==='only'?'IN':'NOT IN'} (SELECT transaction_id FROM reviewed_matching_ids)`);
  }
  if(f.q){clauses.push('(contains(lower(committee_name),lower(?)) OR contains(lower(entity_name),lower(?)))');values.push(f.q,f.q);}
  if(f.committee){clauses.push('committee_id=?');values.push(f.committee);}
  if(f.entity){
    if(f.entity.startsWith('committee:')){clauses.push('(entity_id=? OR committee_id=?)');values.push(f.entity,f.entity.slice(10));}
    else {clauses.push('entity_id=?');values.push(f.entity);}
  }
  if(f.race){
    const ids=[...new Set(reviewedLinks.filter(l=>l.raceId===f.race&&l.status==='reviewed').map(l=>l.committeeId))];
    if(!ids.length)throw new FilterError('No reviewed committee links for this race; missing is not zero.');
    clauses.push(`committee_id IN (${ids.map(()=>'?').join(',')})`);values.push(...ids);
  }
  for(const key of ['state','city','subtype'] as const)if(f[key]){clauses.push(`${key}=?`);values.push(f[key]);}
  return {sql:clauses.join(' AND '),values};
}
// Explicit public allowlist: never export residential addresses or raw records.
const COLUMNS='transaction_id, original_id, transaction_date, filed_date, status, committee_id, committee_name, entity_id, entity_name, identity_status, subtype, basis, direction, amount_cents, city, state, purpose_codes, source_dataset, source_row, retrieved_at, family';
export async function transactions(f:Filters) {
  const {db,manifest}=await instance(); const con=await db.connect();
  try {
    const {sql,values}=where(f,manifest);
    const totals=(await con.runAndReadAll(`SELECT basis,count(*)::BIGINT AS records,sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE ${sql} GROUP BY basis ORDER BY basis`,values)).getRowObjectsJson() as BasisTotal[];
    const latest=(await con.runAndReadAll(`SELECT max(transaction_date) AS transaction_date,max(filed_date) AS filed_date FROM transactions WHERE ${sql}`,values)).getRowObjectsJson()[0] as {transaction_date:string|null;filed_date:string|null};
    const rows=(await con.runAndReadAll(`SELECT ${COLUMNS} FROM transactions WHERE ${sql} ORDER BY transaction_date DESC,transaction_id DESC LIMIT ${PAGE_SIZE} OFFSET ${(f.page-1)*PAGE_SIZE}`,values)).getRowObjectsJson() as Transaction[];
    const retrievedAt=manifest.source_files.map(source=>source.retrieval_end).sort().at(-1) ?? null;
    return {snapshot:manifest.snapshot,metric:manifest.semantics_version,filters:f,totals,latest,retrievedAt,records:totals.reduce((n,r)=>n+Number(r.records),0),pageSize:PAGE_SIZE,rows};
  } finally {con.closeSync();}
}
export async function entityProfile(id:string) {
  const {db}=await instance();const con=await db.connect();
  try {
    const committee=id.startsWith('committee:');
    let row=(await con.runAndReadAll(committee?'SELECT committee_id,name,first_observed,last_observed,records FROM committees WHERE committee_id=?':'SELECT * FROM entities WHERE entity_id=?',[committee?id.slice(10):id])).getRowObjectsJson()[0];
    const observedFiler=committee&&Boolean(row);
    if(committee&&!row)row=(await con.runAndReadAll('SELECT * FROM entities WHERE entity_id=?',[id])).getRowObjectsJson()[0];
    if(!row)return null;
    const aliases=(await con.runAndReadAll('SELECT name,first_observed,last_observed,records FROM aliases WHERE entity_id=? ORDER BY records DESC LIMIT 50',[id])).getRowObjectsJson();
    const relationships=(await con.runAndReadAll(observedFiler?"SELECT entity_id AS related_id,any_value(entity_name) AS name,basis,count(*) AS records,sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE committee_id=? GROUP BY entity_id,basis ORDER BY abs(sum(amount_cents)) DESC LIMIT 40":"SELECT 'committee:'||committee_id AS related_id,any_value(committee_name) AS name,basis,count(*) AS records,sum(amount_cents)::BIGINT AS amount_cents FROM transactions WHERE entity_id=? GROUP BY committee_id,basis ORDER BY abs(sum(amount_cents)) DESC LIMIT 40",[observedFiler?id.slice(10):id])).getRowObjectsJson();
    return {row,aliases,relationships,observedFiler};
  } finally {con.closeSync();}
}
const csvValue=(value:unknown)=>{
  let text=value==null?'':String(value);
  if(/^[=+@\t\r]/.test(text)||(/^-[^\d]/.test(text)))text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
};
let activeExports=0;
export async function evidenceStream(f:Filters,signal:AbortSignal) {
  if(activeExports>=2)throw new FilterError('Two exports are already running. Please retry when one finishes.');
  const {db,manifest}=await instance();
  const {sql,values}=where(f,manifest);
  activeExports++;
  const con=await db.connect().catch(error=>{activeExports--;throw error;});
  let first=true,closed=false,cursor:{date:string;id:string}|undefined;
  const close=()=>{if(!closed){closed=true;activeExports--;con.closeSync();}};
  return new ReadableStream<Uint8Array>({
    async pull(controller){
      try {
        if(signal.aborted){close();controller.close();return;}
        const cursorSql=cursor?' AND (transaction_date < ? OR (transaction_date = ? AND transaction_id < ?))':'';
        const batchValues=cursor?[...values,cursor.date,cursor.date,cursor.id]:values;
        const rows=(await con.runAndReadAll(`SELECT ${COLUMNS} FROM transactions WHERE ${sql}${cursorSql} ORDER BY transaction_date DESC,transaction_id DESC LIMIT 5000`,batchValues)).getRowObjectsJson();
        const cols=COLUMNS.split(', ');
        let chunk=first?['snapshot','metric_definition',...cols].join(',')+'\r\n':'';
        chunk+=rows.map(row=>[manifest.snapshot,manifest.semantics_version,...cols.map(c=>row[c])].map(csvValue).join(',')).join('\r\n');
        if(rows.length)chunk+='\r\n';
        if(chunk)controller.enqueue(new TextEncoder().encode(chunk));
        first=false;
        const last=rows.at(-1);
        if(last)cursor={date:String(last.transaction_date),id:String(last.transaction_id)};
        if(rows.length<5000){close();controller.close();}
      }catch(error){close();controller.error(error);}
    },cancel(){close();}
  });
}

export async function currentCandidateFacts(committeeId:string):Promise<CommitteeFacts|null> {
  if (!/^\d+$/.test(committeeId)) throw new FilterError('Invalid committee ID');
  const {db}=await instance();const con=await db.connect();
  try {
    const row=(await con.runAndReadAll('SELECT facts_json FROM candidate_finance_facts WHERE committee_id=?',[committeeId])).getRowObjectsJson()[0];
    return row ? JSON.parse(String(row.facts_json)) as CommitteeFacts : null;
  } finally {con.closeSync();}
}

export async function currentContributionRecords(committeeId:string):Promise<ContributionRecord[]> {
  if (!/^\d+$/.test(committeeId)) throw new FilterError('Invalid committee ID');
  const {db}=await instance();const con=await db.connect();
  try {
    const rows=(await con.runAndReadAll("SELECT t.transaction_id AS id,t.transaction_date AS date,t.amount_cents AS cents,CASE WHEN m.transaction_id IS NOT NULL THEN 'public' WHEN t.is_disclosure_category OR t.identity_status='unknown' THEN 'unidentified' WHEN t.book_type='Individual' THEN 'individual' WHEN t.book_type='Political Committee' THEN 'committee' WHEN t.book_type='Business Entity' THEN 'business' WHEN t.book_type='Labor Organization' THEN 'labor' WHEN t.book_type='Candidate & Immediate Family' THEN 'self_family' ELSE 'other' END AS category,t.entity_id AS entityId,t.entity_name AS \"source\",t.book_type AS bookType FROM transactions t LEFT JOIN reviewed_matching_ids m ON t.transaction_id=m.transaction_id WHERE t.committee_id=? AND t.basis='cash_contribution' ORDER BY t.transaction_date,t.transaction_id",[committeeId])).getRowObjectsJson();
    return rows.map(row=>({id:String(row.id),date:String(row.date),cents:Number(row.cents),category:String(row.category),entityId:String(row.entityId),source:String(row.source),bookType:String(row.bookType)}));
  } finally {con.closeSync();}
}

export type DailyCash = { committee_id: string; transaction_date: string; cash_cents: number; public_cents: number; nonmatching_cents: number; individual_itemized_cents: number; unidentified_cents: number };
export async function currentCashDaily(committeeIds:string[]):Promise<DailyCash[]> {
  if (!committeeIds.length || committeeIds.some(id=>!/^\d+$/.test(id))) throw new FilterError('Invalid committee list');
  const {db}=await instance();const con=await db.connect();
  try {
    const sql=`SELECT t.committee_id,t.transaction_date,sum(t.amount_cents)::INTEGER AS cash_cents,sum(CASE WHEN m.transaction_id IS NOT NULL THEN t.amount_cents ELSE 0 END)::INTEGER AS public_cents,sum(CASE WHEN m.transaction_id IS NULL THEN t.amount_cents ELSE 0 END)::INTEGER AS nonmatching_cents,sum(CASE WHEN m.transaction_id IS NULL AND t.book_type='Individual' AND NOT t.is_disclosure_category AND t.identity_status<>'unknown' THEN t.amount_cents ELSE 0 END)::INTEGER AS individual_itemized_cents,sum(CASE WHEN m.transaction_id IS NULL AND (t.is_disclosure_category OR t.identity_status='unknown') THEN t.amount_cents ELSE 0 END)::INTEGER AS unidentified_cents FROM transactions t LEFT JOIN reviewed_matching_ids m ON t.transaction_id=m.transaction_id WHERE t.basis='cash_contribution' AND t.committee_id IN (${committeeIds.map(()=>'?').join(',')}) GROUP BY t.committee_id,t.transaction_date ORDER BY t.committee_id,t.transaction_date`;
    return (await con.runAndReadAll(sql,committeeIds)).getRowObjectsJson() as DailyCash[];
  } finally {con.closeSync();}
}
