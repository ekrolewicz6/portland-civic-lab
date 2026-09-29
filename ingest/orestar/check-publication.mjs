/** Release gate: public assets and the minimized, read-only server database. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync, existsSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { DuckDBInstance } from '@duckdb/node-api';

const root = resolve(process.argv[2] || '.');
const json = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const sha = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const privateField = /^(?:street|street_address|streetAddress|address1|address2|address_line_1|address_line_2|residential_address|latitude|longitude|source_raw_file|purpose_description|cookies?|authorization|access_token|refresh_token|password|sessionId)$/i;
const privateText = /\/Users\/|\/private\/var\/|\/var\/folders\/|Library\/Messages\/Attachments|NSIRD_screencaptureui|Bearer\s+[a-zA-Z0-9._-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
let checked = 0;
function inspect(value, path) {
  if (!value || typeof value !== 'object') return;
  assert.notEqual(value.type, 'Point', `Individual point geometry is not allowed: ${path}`);
  assert.notEqual(value.type, 'MultiPoint', `Individual point geometry is not allowed: ${path}`);
  for (const [key, child] of Object.entries(value)) {
    assert(!privateField.test(key), `Private field ${key}: ${path}`);
    inspect(child, path);
  }
}
function walk(path) {
  for (const entry of readdirSync(path)) {
    const file = resolve(path, entry);
    const stat = lstatSync(file);
    assert(!stat.isSymbolicLink(), `Publication symlink: ${relative(root, file)}`);
    if (stat.isDirectory()) { walk(file); continue; }
    const extension = extname(file);
    assert(!['.xlsx', '.xls', '.heic', '.parquet', '.log', '.ndjson'].includes(extension.toLowerCase()), `Unexpected raw artifact: ${relative(root, file)}`);
    if (['.json', '.geojson', '.csv', '.ts', '.tsx', '.css', '.md', '.txt'].includes(extension)) {
      const content = readFileSync(file, 'utf8');
      assert(!privateText.test(content), `Private path or credential: ${relative(root, file)}`);
      if (extension === '.json' || extension === '.geojson') inspect(JSON.parse(content), relative(root, file));
      if (extension === '.csv') {
        const header = content.split(/\r?\n/, 1)[0].split(',').map(s => s.replaceAll('"', '').trim());
        assert(header.every(key => !privateField.test(key)), `Private CSV column: ${relative(root, file)}`);
      }
    }
    checked++;
  }
}
for (const directory of ['public/data/campaign-finance', 'src/lib/campaign-finance', 'server-data/campaign-finance']) walk(resolve(root, directory));

const manifest = json('server-data/campaign-finance/manifest.json');
const client = json('src/lib/campaign-finance/active-publication.json');
assert.equal(manifest.database, 'server-data/campaign-finance/finance.duckdb');
assert.equal(sha(manifest.database), manifest.database_sha256, 'Database checksum');
assert.equal(client.snapshot, manifest.snapshot);
assert.equal(client.rows, manifest.rows);
assert(!existsSync(resolve(root, 'public/server-data')), 'Database must not be served as a static download');
const allowed = {
  transactions: 'transaction_id original_id transaction_date filed_date status committee_id committee_name entity_id entity_name identity_status subtype basis direction amount_cents city state purpose_codes source_dataset source_row retrieved_at family book_type is_disclosure_category'.split(' '),
  entities: 'entity_id name identity_status first_observed last_observed records'.split(' '),
  aliases: 'entity_id name first_observed last_observed records'.split(' '),
  committees: 'committee_id name first_observed last_observed records'.split(' '),
  reviewed_matching_ids: ['transaction_id'],
  candidate_finance_facts: ['committee_id', 'facts_json'],
};
const db = await DuckDBInstance.create(resolve(root, manifest.database), { access_mode: 'READ_ONLY', threads: '2', enable_external_access: 'false' });
const connection = await db.connect();
try {
  const run = async sql => (await connection.runAndReadAll(sql)).getRowObjectsJson();
  assert.deepEqual((await run('SHOW TABLES')).map(r => r.name).sort(), Object.keys(allowed).sort());
  for (const [table, columns] of Object.entries(allowed)) {
    assert.deepEqual((await run(`DESCRIBE ${table}`)).map(r => r.column_name), columns, `Schema: ${table}`);
  }
  const totals = (await run('SELECT count(*) AS rows,count(DISTINCT transaction_id) AS ids,min(transaction_date) AS start,max(transaction_date) AS end FROM transactions'))[0];
  assert.equal(Number(totals.rows), manifest.rows);
  assert.equal(Number(totals.ids), manifest.rows);
  assert.equal(totals.start, manifest.start);
  assert.equal(totals.end, manifest.end);
  const facts = await run('SELECT committee_id,facts_json FROM candidate_finance_facts');
  for (const record of facts) {
    const value = JSON.parse(record.facts_json);
    inspect(value, `candidate ${record.committee_id}`);
    const total = (await connection.runAndReadAll("SELECT count(*) AS records,sum(amount_cents) AS cents FROM transactions WHERE committee_id=? AND basis='cash_contribution'", [record.committee_id])).getRowObjectsJson()[0];
    assert.equal(value.cashCents, Number(total.cents));
    assert.equal(value.cashRecords, Number(total.records));
    assert.equal(value.cashCents, value.publicCents + value.nonmatchingCents);
    assert(value.topSources.every(s => !/^(disclosure:|unknown:)/.test(s.id)), 'Aggregate rows are not donor identities');
  }
  for (const artifact of Object.values(json('src/lib/campaign-finance/supplier-data.json').evidence)) {
    assert.equal(sha('public' + artifact.url), artifact.sha256, `Evidence checksum: ${artifact.url}`);
  }
  console.log(JSON.stringify({ status: 'passed', filesChecked: checked, snapshot: manifest.snapshot, rows: manifest.rows, candidateProfilesReconciled: facts.length, privacy: 'allowlisted schema; no raw addresses, point locations, local paths or credentials' }, null, 2));
} finally { connection.closeSync(); db.closeSync(); }
