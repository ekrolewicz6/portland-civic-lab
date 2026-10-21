/** Verify the public archive against every allowed server table and evidence file. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { gunzipSync } from 'node:zlib';
import { unzipSync } from 'fflate';
import { DuckDBInstance } from '@duckdb/node-api';

const hash = body => createHash('sha256').update(body).digest('hex');
export async function checkDownloads(root, ledger, allowed) {
  const directory = resolve(root, 'public/data/campaign-finance/downloads');
  assert.deepEqual(readdirSync(directory).sort(), ['README.md','analysis.sql','analysis.zip','manifest.json','schema.json','transactions.csv.gz','transactions.parquet'].sort(), 'Unexpected public download artifact');
  const manifest = JSON.parse(readFileSync(resolve(directory, 'manifest.json'), 'utf8'));
  for (const key of ['snapshot', 'start', 'end', 'rows', 'completeness_verified']) assert.deepEqual(manifest[key], ledger[key], `Download ${key}`);
  assert.deepEqual(Object.keys(manifest.tables).sort(), Object.keys(allowed).sort());
  const binaries = {};
  for (const [key, entry] of Object.entries(manifest.downloads)) {
    const name = {bundle:'analysis.zip', parquet:'transactions.parquet', csv:'transactions.csv.gz'}[key];
    assert(name, `Unknown download: ${key}`);
    assert.equal(entry.url, `https://www.portlandciviclab.org/data/campaign-finance/downloads/${name}`);
    const body = readFileSync(resolve(directory, name));
    assert.equal(body.length, entry.bytes); assert.equal(hash(body), entry.sha256);
    binaries[key] = body;
  }
  assert.deepEqual(Object.keys(binaries).sort(), ['bundle','csv','parquet']);
  const archive = unzipSync(binaries.bundle);
  assert.deepEqual(Object.keys(archive).sort(), Object.keys(manifest.bundleMembers).sort());
  for (const [name, body] of Object.entries(archive)) {
    assert(!name.startsWith('/') && !name.split('/').includes('..') && !name.includes('\\'), `Unsafe archive path: ${name}`);
    const entry = manifest.bundleMembers[name];
    assert.equal(body.length, entry.bytes, name); assert.equal(hash(body), entry.sha256, name);
  }
  const insideChecksums = JSON.parse(Buffer.from(archive['checksums.json']).toString());
  assert.deepEqual(insideChecksums, Object.fromEntries(Object.entries(manifest.bundleMembers).filter(([name]) => name !== 'checksums.json')));
  const expectedEvidence = [];
  const walk = (folder, prefix='') => {
    for (const name of readdirSync(folder)) {
      if (!prefix && name === 'downloads') continue;
      const path = resolve(folder, name), relative = prefix + name;
      if (statSync(path).isDirectory()) { walk(path, relative + '/'); continue; }
      const member = 'evidence/' + relative;
      expectedEvidence.push(member);
      assert(archive[member], `Missing public evidence: ${relative}`);
      assert.equal(hash(archive[member]), hash(readFileSync(path)), `Stale archived evidence: ${relative}`);
    }
  };
  walk(resolve(root, 'public/data/campaign-finance'));
  assert.deepEqual(Object.keys(archive).filter(name => name.startsWith('evidence/')).sort(), expectedEvidence.sort());
  const documents = ['README.md','analysis.sql','schema.json','snapshot.json','evidence-index.json','checksums.json','LICENSE-CONTENT.md'];
  assert.deepEqual(Object.keys(archive).sort(), [...expectedEvidence, ...Object.keys(allowed).map(table => `tables/${table}.parquet`), ...documents].sort(), 'Unexpected archive member');
  const readme = readFileSync(resolve(root, 'ingest/orestar/download-docs/README.md'), 'utf8').replaceAll('{{SNAPSHOT}}', ledger.snapshot).replaceAll('{{END}}', ledger.end).replaceAll('{{ROWS}}', String(ledger.rows));
  assert.equal(Buffer.from(archive['README.md']).toString(), readme, 'Stale analysis guide');
  assert.equal(hash(archive['analysis.sql']), hash(readFileSync(resolve(root, 'ingest/orestar/download-docs/analysis.sql'))), 'Stale example SQL');
  assert.equal(hash(archive['LICENSE-CONTENT.md']), hash(readFileSync(resolve(root, 'LICENSE-CONTENT.md'))));
  for (const name of ['README.md','schema.json','analysis.sql']) assert.equal(hash(readFileSync(resolve(directory, name))), hash(archive[name]), name);
  assert.equal(hash(binaries.parquet), hash(archive['tables/transactions.parquet']));
  const schema = JSON.parse(Buffer.from(archive['schema.json']).toString());
  assert.deepEqual(schema.tables, manifest.tables);
  const metadata = JSON.parse(readFileSync(resolve(root, 'src/lib/campaign-finance/downloads.json'), 'utf8'));
  assert.equal(metadata.snapshot, ledger.snapshot); assert.deepEqual(metadata.downloads, manifest.downloads);
  const temp = mkdtempSync(resolve(tmpdir(), 'finance-download-check-'));
  const db = await DuckDBInstance.create(resolve(root, ledger.database), {access_mode:'READ_ONLY', threads:'2'});
  const con = await db.connect();
  try {
    const scalar = async (sql, values=[]) => Number((await con.runAndReadAll(sql, values)).getRows()[0][0]);
    for (const [table, columns] of Object.entries(allowed)) {
      const file = resolve(temp, `${table}.parquet`);
      const info = manifest.tables[table];
      assert.equal(info.file, `tables/${table}.parquet`);
      writeFileSync(file, archive[info.file]);
      const actualSchema = (await con.runAndReadAll('DESCRIBE SELECT * FROM read_parquet(?)', [file])).getRowObjectsJson();
      assert.deepEqual(actualSchema.map(row => row.column_name), columns, `Download schema ${table}`);
      assert.deepEqual(info.columns.map(row => row.name), columns);
      assert.equal(await scalar('SELECT count(*) FROM read_parquet(?)', [file]), info.rows, table);
      for (const query of [
        `SELECT count(*) FROM (SELECT * FROM read_parquet(?) EXCEPT ALL SELECT * FROM ${table})`,
        `SELECT count(*) FROM (SELECT * FROM ${table} EXCEPT ALL SELECT * FROM read_parquet(?))`,
      ]) assert.equal(await scalar(query, [file]), 0, `Download rows differ: ${table}`);
    }
    const csv = gunzipSync(binaries.csv);
    assert.equal(csv.length, manifest.uncompressedTransactionCsvBytes);
    const file = resolve(temp, 'transactions.csv'); writeFileSync(file, csv);
    assert.equal(await scalar('SELECT count(*) FROM read_csv(?, all_varchar=true)', [file]), ledger.rows);
    assert.equal(await scalar("SELECT count(*) FROM (SELECT transaction_id,cast(amount_cents AS BIGINT) AS amount_cents FROM read_csv(?,all_varchar=true) EXCEPT ALL SELECT transaction_id,amount_cents FROM transactions)", [file]), 0, 'CSV IDs and cents');
    return {files: Object.keys(archive).length, bytes: binaries.bundle.length, rows: ledger.rows};
  } finally { con.closeSync(); db.closeSync(); rmSync(temp, {recursive:true,force:true}); }
}
