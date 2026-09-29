import activeManifest from './active-publication.json';
export const SNAPSHOT = 'orestar-20250101-20260927-v1'; // Frozen editorial edition.
export const ACTIVE_SNAPSHOT = activeManifest.snapshot;
export const ACTIVE_END = activeManifest.end;
export const BASE = '/deep-dives/campaign-finance';
export const bases = ['all','cash_contribution','cash_payment','noncash_support','forgiven_obligation','loan_received','loan_payment','loan_forgiven','obligation','obligation_cancellation','obligation_adjustment','contribution_refund','other_cash_receipt','other_cash_payment','cash_reversal','cash_adjustment','receivable'] as const;
export type Filters = { snapshot: string; start: string; end: string; basis: typeof bases[number]; family: 'all'|'contributions'|'everything_else'; matching: 'all'|'exclude'|'only'; q: string; entity: string; committee: string; race: string; state: string; city: string; subtype: string; page: number };
export class FilterError extends Error {}
export function parseFilters(params: URLSearchParams, current: { snapshot: string; end: string } = { snapshot: ACTIVE_SNAPSHOT, end: ACTIVE_END }): Filters {
  const allowed = new Set(['family','snapshot','start','end','basis','matching','q','entity','committee','race','state','city','subtype','page','format']);
  for (const key of params.keys()) {
    if (!allowed.has(key)) throw new FilterError(`Unknown filter: ${key}`);
    if (params.getAll(key).length>1) throw new FilterError(`Repeated filter: ${key}`);
  }
  const requestedSnapshot = params.get('snapshot') || current.snapshot;
  if (!/^orestar-20250101-\d{8}(?:-v\d+|-[a-f0-9]{8,12})$/.test(requestedSnapshot)) throw new FilterError('This explorer does not contain that snapshot.');
  // Previously shared editorial links open the one current explorer database.
  const snapshot = current.snapshot;
  const start=params.get('start')||'2025-01-01', end=params.get('end')||current.end;
  for (const day of [start,end]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day)) || new Date(day).toISOString().slice(0,10)!==day || day<'2025-01-01' || day>current.end) throw new FilterError(`Dates must be valid dates within January 1, 2025–${current.end}.`);
  }
  if (start>end) throw new FilterError('Start date must not follow end date.');
  const family=params.get('family')||'all';
  if(!['all','contributions','everything_else'].includes(family))throw new FilterError('Unknown transaction family.');
  const basis=params.get('basis')||'all';
  if (!(bases as readonly string[]).includes(basis)) throw new FilterError('Unknown accounting basis.');
  const matching=params.get('matching')||'all';
  if (!['all','exclude','only'].includes(matching)) throw new FilterError('Unknown City matching filter.');
  const page=Number(params.get('page')||'1');
  if (!Number.isInteger(page)||page<1||page>100000) throw new FilterError('Page must be a positive integer.');
  const get=(key:string,max=120)=>{ const value=(params.get(key)||'').trim(); if(value.length>max)throw new FilterError(`${key} is too long.`); return value; };
  const entity=get('entity'),committee=get('committee'),race=get('race');
  if (entity && !/^(committee:\d+|record:[a-f0-9]{24}|disclosure:\d+:[a-f0-9]{12}|unknown:\d+)$/.test(entity)) throw new FilterError('Invalid entity identifier.');
  if (committee && !/^\d+$/.test(committee)) throw new FilterError('Invalid committee identifier.');
  if (race && !/^[a-z0-9-]+$/.test(race)) throw new FilterError('Invalid race identifier.');
  const state=get('state',2).toUpperCase();
  if(state && !/^[A-Z]{2}$/.test(state))throw new FilterError('State must be a two-letter code.');
  return { family:family as Filters['family'],matching:matching as Filters['matching'],snapshot,start,end,basis:basis as Filters['basis'],q:get('q'),entity,committee,race,state,city:get('city').toUpperCase(),subtype:get('subtype'),page };
}
export function filterParams(f: Filters) {
  const p=new URLSearchParams();
  for (const [key,value] of Object.entries(f)) if(value!=='' && !(key==='page'&&value===1))p.set(key,String(value));
  return p;
}
export function money(cents: number | string | bigint) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(cents)/100); }
export function shortMoney(cents:number) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2}).format(cents/100); }
export function basisLabel(basis:string) { return basis.replaceAll('_',' '); }
