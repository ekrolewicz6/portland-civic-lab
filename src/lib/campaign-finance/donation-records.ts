import 'server-only';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SNAPSHOT } from './filters';
import type { CommitteeFacts } from './candidate-facts';

export type ContributionRecord = {
  id: string;
  date: string;
  cents: number;
  category: string;
  entityId: string;
  source: string;
  bookType: string;
};

// Preserve quoted commas and names in the evidence CSV.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (quoted) throw new Error('Unclosed quoted field in candidate contribution evidence');
  if (row.length || field) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows;
}

export function contributionRecords(facts: CommitteeFacts): ContributionRecord[] {
  if (!/^\d+$/.test(facts.committeeId)) throw new Error('Invalid committee ID');
  const path = resolve(process.cwd(), 'public/data/campaign-finance/candidates', facts.committeeId + '-cash-contributions.csv');
  const buffer = readFileSync(path);
  if (createHash('sha256').update(buffer).digest('hex') !== facts.evidenceSha256) {
    throw new Error('Candidate contribution evidence checksum mismatch: ' + facts.committeeId);
  }
  const [header, ...body] = parseCsv(buffer.toString('utf8'));
  const expected = ['snapshot', 'transaction_id', 'committee_id', 'transaction_date', 'filed_date', 'amount_cents', 'funding_category', 'entity_id', 'reported_source', 'identity_status', 'book_type', 'reported_city', 'reported_state'];
  if (header.join('|') !== expected.join('|')) throw new Error('Candidate evidence schema changed: ' + facts.committeeId);
  const ids = new Set<string>();
  const rows = body.map((fields): ContributionRecord => {
    if (fields.length !== expected.length || fields[0] !== SNAPSHOT || fields[2] !== facts.committeeId) {
      throw new Error('Invalid candidate evidence row: ' + facts.committeeId);
    }
    const cents = Number(fields[5]);
    if (!Number.isSafeInteger(cents) || cents <= 0 || ids.has(fields[1])) {
      throw new Error('Invalid or repeated contribution record: ' + facts.committeeId + '/' + fields[1]);
    }
    ids.add(fields[1]);
    return { id: fields[1], date: fields[3], cents, category: fields[6], entityId: fields[7], source: fields[8].trim(), bookType: fields[10] };
  });
  const total = rows.reduce((sum, row) => sum + row.cents, 0);
  const publicCents = rows.reduce((sum, row) => sum + (row.category === 'public' ? row.cents : 0), 0);
  if (rows.length !== facts.cashRecords || total !== facts.cashCents || publicCents !== facts.publicCents) {
    throw new Error('Candidate contribution records do not reconcile: ' + facts.committeeId);
  }
  return rows;
}
