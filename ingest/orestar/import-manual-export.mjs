/** Validate and privately archive a manual ORESTAR XLSX against the active database. */
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';
import { DuckDBInstance } from '@duckdb/node-api';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
// --hold-conflicts keeps every existing record as it is and leaves out incoming
// records that would change or supersede one. They are listed for review and are
// never promoted by this script.
const holdConflicts = process.argv.slice(2).includes('--hold-conflicts');
const source = process.argv.slice(2).find(argument => !argument.startsWith('--'));
if (!source) throw new Error('Usage: npm run orestar:refresh:manual -- /absolute/path/ORESTAR-export.xlsx [--hold-conflicts]');
const input = resolve(source);
const bytes = readFileSync(input);
const sha256 = createHash('sha256').update(bytes).digest('hex');
const expectedHeaders = 'Tran Id|Original Id|Tran Date|Tran Status|Filer|Contributor/Payee|Sub Type|Payer of Personal Expenditure|Amount|Aggregate Amount|Contributor/Payee Committee ID|Filer Id|Attest By Name|Attest Date|Review By Name|Review Date|Due Date|Occptn Ltr Date|Pymt Sched Txt|Purp Desc|Intrst Rate|Check Nbr|Tran Stsfd Ind|Filed By Name|Filed Date|Addr book Agent Name|Book Type|Title Txt|Occptn Txt|Emp Name|Emp City|Emp State|Employ Ind|Self Employ Ind|Addr Line1|Addr Line2|City|State|Zip|Zip Plus Four|County|Country|Foreign Postal Code|Purpose Codes|Exp Date'.split('|');
const workbook = xlsx.read(bytes, { type: 'buffer', cellDates: false });
if (workbook.SheetNames.length !== 1 || workbook.SheetNames[0] !== 'ORESTAR Export') throw new Error('Unexpected sheet layout');
const grid = xlsx.utils.sheet_to_json(workbook.Sheets['ORESTAR Export'], { header: 1, defval: '', raw: false });
if (JSON.stringify(grid[0]) !== JSON.stringify(expectedHeaders)) throw new Error('Unexpected ORESTAR export headers');
const rows = grid.slice(1).filter(values => values.some(value => String(value).trim())).map((values, index) => {
  if (values.length !== expectedHeaders.length) throw new Error(`Row ${index + 2} has ${values.length} columns; expected ${expectedHeaders.length}`);
  return { ...Object.fromEntries(expectedHeaders.map((header, i) => [header, String(values[i] ?? '')])), __source_row: index + 2 };
});
if (!rows.length) throw new Error('Workbook contains no transaction records');
const iso = value => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) throw new Error(`Unexpected date ${value}`);
  const date = `${match[3]}-${match[1]}-${match[2]}`;
  if (new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`Invalid date ${value}`);
  return date;
};
const cents = value => {
  const clean = value.trim().replaceAll(',', '').replaceAll('$', '');
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(clean)) throw new Error(`Unexpected amount ${value}`);
  const [dollars, fraction = ''] = clean.split('.');
  const sign = dollars.startsWith('-') ? -1 : 1;
  return sign * (Math.abs(Number(dollars)) * 100 + Number(fraction.padEnd(2, '0')));
};
const semantics = JSON.parse(readFileSync(resolve(root, 'research/campaign-finance/transaction-semantics.json'), 'utf8'));
const seen = new Set();
const today = new Date().toISOString().slice(0, 10);
for (const row of rows) {
  const id = row['Tran Id'];
  if (!/^\d+$/.test(id) || seen.has(id)) throw new Error(`Blank/duplicate transaction ID ${id}`);
  seen.add(id);
  if (!/^\d+$/.test(row['Filer Id'])) throw new Error(`Invalid filer ID: ${id}`);
  if (!semantics.subtypes[row['Sub Type']]) throw new Error(`Unreviewed accounting subtype: ${row['Sub Type']}`);
  const date = iso(row['Tran Date']);
  if (date < '2025-01-01' || date > today) throw new Error(`Transaction date outside supported range: ${id} ${date}`);
  iso(row['Filed Date']);
  cents(row.Amount);
}
const manifest = JSON.parse(readFileSync(resolve(root, 'research/campaign-finance/active-snapshot-manifest.json'), 'utf8'));
if (manifest.source_files.some(file => file.sha256 === sha256)) {
  console.log(JSON.stringify({ status: 'already_imported', snapshot: manifest.snapshot, sha256 }));
  process.exit(0);
}
const db = await DuckDBInstance.create(resolve(root, manifest.database), { access_mode: 'READ_ONLY', threads: '2', memory_limit: '1GB' });
const con = await db.connect();
const old = new Map();
for (let start = 0; start < rows.length; start += 500) {
  const batch = rows.slice(start, start + 500);
  const found = await con.runAndReadAll(`SELECT transaction_id,original_id,transaction_date,filed_date,committee_id,subtype,amount_cents,status FROM transactions WHERE transaction_id IN (${batch.map(() => '?').join(',')})`, batch.map(row => row['Tran Id']));
  for (const row of found.getRowObjectsJson()) old.set(row.transaction_id, row);
}
let newRows = rows.filter(row => !old.has(row['Tran Id']));
const held = { changedExisting: [], superseding: [] };
for (const row of rows.filter(row => old.has(row['Tran Id']))) {
  const previous = old.get(row['Tran Id']);
  const incoming = { transaction_date: iso(row['Tran Date']), filed_date: iso(row['Filed Date']), committee_id: row['Filer Id'], subtype: row['Sub Type'], amount_cents: cents(row.Amount), status: row['Tran Status'], original_id: row['Original Id'] };
  const existing = { ...previous, amount_cents: Number(previous.amount_cents), original_id: previous.original_id ?? '' };
  const differences = Object.keys(incoming).filter(field => existing[field] !== incoming[field]).map(field => ({ field, existing: existing[field], incoming: incoming[field] }));
  if (!differences.length) continue;
  if (!holdConflicts) throw new Error(`Existing transaction ${row['Tran Id']} changed; manual amendment review required before promotion`);
  held.changedExisting.push({ transactionId: row['Tran Id'], filerId: row['Filer Id'], filer: row.Filer, subtype: row['Sub Type'], transactionDate: existing.transaction_date, differences });
}
const originalIds = newRows.map(row => row['Original Id']).filter(Boolean);
if (new Set(originalIds).size !== originalIds.length) throw new Error('Two incoming records have the same Original Id');
const collisions = [];
for (let start = 0; start < originalIds.length; start += 500) {
  const batch = originalIds.slice(start, start + 500);
  const conflicts = await con.runAndReadAll(`SELECT transaction_id,original_id,transaction_date,subtype,amount_cents FROM transactions WHERE original_id IN (${batch.map(() => '?').join(',')}) OR transaction_id IN (${batch.map(() => '?').join(',')})`, [...batch, ...batch]);
  collisions.push(...conflicts.getRowObjectsJson());
}
con.closeSync();
if (collisions.length) {
  if (!holdConflicts) throw new Error('Incoming amendment collides with an existing current Original Id; review required');
  for (const existing of collisions) {
    const incoming = newRows.find(row => row['Original Id'] === existing.original_id || row['Original Id'] === existing.transaction_id);
    if (!incoming) throw new Error(`Unmatched amendment collision for existing transaction ${existing.transaction_id}`);
    held.superseding.push({
      existingTransactionId: existing.transaction_id, existingTransactionDate: existing.transaction_date, existingAmountCents: Number(existing.amount_cents),
      incomingTransactionId: incoming['Tran Id'], incomingTransactionDate: iso(incoming['Tran Date']), incomingAmountCents: cents(incoming.Amount),
      filerId: incoming['Filer Id'], filer: incoming.Filer, subtype: incoming['Sub Type'],
    });
  }
  const heldIds = new Set(held.superseding.map(item => item.incomingTransactionId));
  newRows = newRows.filter(row => !heldIds.has(row['Tran Id']));
}
const heldCount = held.changedExisting.length + held.superseding.length;
if (!newRows.length) {
  console.log(JSON.stringify({ status: 'no_new_records', snapshot: manifest.snapshot, sourceRows: rows.length, sha256 }));
  process.exit(0);
}
const reviewed = new Set(JSON.parse(readFileSync(resolve(root, 'research/campaign-finance/committee-race-crosswalk.json'), 'utf8')).links.filter(link => link.status === 'reviewed').map(link => link.committeeId));
const matchingRows = readFileSync(resolve(root, 'public/data/campaign-finance/public-matching-receipts.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const knownPayorGroups = new Set(matchingRows.map(fields => `${fields[1]}|${fields[3]}`));
const norm = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toUpperCase();
const identity = row => {
  if (row['Contributor/Payee Committee ID'].trim()) return 'committee:' + row['Contributor/Payee Committee ID'].trim();
  const fields = ['Contributor/Payee', 'Book Type', 'Addr Line1', 'Addr Line2', 'City', 'State', 'Zip', 'Country'];
  return 'record:' + createHash('sha256').update(JSON.stringify(fields.map(field => norm(row[field])))).digest('hex').slice(0, 24);
};
for (const row of newRows) {
  if (reviewed.has(row['Filer Id']) && row['Sub Type'] === 'Cash Contribution' && /SMALL DONOR ELECTION|CITY OF PORTLAND|OPEN AND ACCOUNTABLE ELECTION/i.test(row['Contributor/Payee']) && !knownPayorGroups.has(`${row['Filer Id']}|${identity(row)}`)) {
    throw new Error(`Possible new City matching receipt ${row['Tran Id']}; review payor before promotion`);
  }
}
const byDate = Object.fromEntries([...new Set(newRows.map(row => iso(row['Tran Date'])))].sort().map(date => [date, newRows.filter(row => iso(row['Tran Date']) === date).length]));
const audit = {
  version: 2, state: 'provisional_manual_supplement', baseSnapshot: manifest.snapshot,
  sourceFile: basename(input), sha256, sourceFileMtimeUtc: statSync(input).mtime.toISOString(),
  sourceRows: rows.length, overlapRows: old.size, newRows: newRows.length, sourceColumns: expectedHeaders.length,
  transactionDateCounts: byDate, latestTransactionDate: Object.keys(byDate).at(-1),
  totalCountVerified: false, searchFiltersVerified: false, olderDatedLateFilingsCovered: false,
  limits: ['The workbook contains no ORESTAR result count or search criteria.', 'Older-dated late filings and amendments outside this workbook are not ruled out.', 'Existing transaction changes and ambiguous public payors require review.', 'Street addresses and employer fields remain in the private archive.',
    ...(heldCount ? [`${heldCount} incoming record(s) that change or supersede an existing record were held for review and not applied; the existing versions remain.`] : [])],
  ...(heldCount ? { heldForReview: held } : {}),
};
const archive = resolve(root, 'runtime-data/orestar-manual', sha256);
mkdirSync(archive, { recursive: true });
copyFileSync(input, resolve(archive, `${sha256}.xlsx`));
writeFileSync(resolve(archive, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');
writeFileSync(resolve(archive, 'new-raw-records.json'), JSON.stringify(newRows, null, 2) + '\n');
console.log(JSON.stringify({ status: 'validated', archive, ...audit }, null, 2));
