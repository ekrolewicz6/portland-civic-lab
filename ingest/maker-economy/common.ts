import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
export const root = resolve('research/maker-economy');
export const raw = resolve('runtime-data/maker-economy');
export type Row = Record<string, string>;
export function parseCSV(text: string): Row[] {
  const rows: string[][] = []; let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if (c === '\n' && !quoted) { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const headers = rows.shift(); if (!headers) throw new Error('Empty CSV');
  return rows.filter(r => r.some(Boolean)).map(r => {
    if (r.length !== headers.length) throw new Error(`CSV width mismatch: ${r.length}/${headers.length}`);
    return Object.fromEntries(headers.map((h, i) => [h, r[i]]));
  });
}
export function readCSV(path: string): Row[] { return parseCSV(readFileSync(path, 'utf8')); }
export function csv(rows: Record<string, string | number>[]): string {
  if (!rows.length) throw new Error('No rows');
  const keys = Object.keys(rows[0]);
  const quote = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
  return [keys.map(quote).join(','), ...rows.map(r => keys.map(k => quote(r[k] ?? '')).join(','))].join('\n') + '\n';
}
export function writeCSV(path: string, rows: Record<string, string | number>[]) { writeFileSync(path, csv(rows)); }
export function sha(bytes: Buffer): string { return createHash('sha256').update(bytes).digest('hex'); }
export function number(value: string): number {
  if (value === '' || !Number.isFinite(Number(value))) throw new Error(`Invalid numeric value: ${value}`);
  return Number(value);
}
export interface Source { id: string; title: string; url: string; format: string; geography: string; period: string; reviewed_on: string; }
export interface Lock { id: string; url: string; file?: string; sha256?: string; bytes?: number; retrieved_on: string; status: string; error?: string; }
export const sources: Source[] = JSON.parse(readFileSync(resolve(root, 'sources.json'), 'utf8'));
export const locks: Lock[] = JSON.parse(readFileSync(resolve(root, 'checksums.lock.json'), 'utf8'));
export function checkedRaw(id: string): Buffer {
  const lock = locks.find(l => l.id === id);
  if (!lock?.file || !lock.sha256 || lock.status !== 'archived') throw new Error(`No archived source: ${id}`);
  const bytes = readFileSync(resolve(lock.file));
  if (sha(bytes) !== lock.sha256) throw new Error(`Source checksum changed: ${id}`);
  return bytes;
}
