/** Save the raw workbook rows that the importer held for review, so an approved amendment can be applied later. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import xlsx from 'xlsx';

const archive = process.argv[2];
if (!archive) throw new Error('Usage: node ingest/orestar/extract-held-records.mjs runtime-data/orestar-manual/<sha256>');
const audit = JSON.parse(readFileSync(resolve(archive, 'audit.json'), 'utf8'));
const held = audit.heldForReview;
if (!held) throw new Error('This archive has no held records');
const wanted = new Set([...held.changedExisting.map(item => item.transactionId), ...held.superseding.map(item => item.incomingTransactionId)]);
const workbook = xlsx.read(readFileSync(resolve(archive, audit.sourceArchiveFile ?? `${audit.sha256}.xlsx`)), { type: 'buffer', cellDates: false });
const grid = xlsx.utils.sheet_to_json(workbook.Sheets['ORESTAR Export'], { header: 1, defval: '', raw: false });
const headers = grid[0];
const rows = grid.slice(1).map((values, index) => ({ ...Object.fromEntries(headers.map((header, i) => [header, String(values[i] ?? '')])), __source_row: index + 2 })).filter(row => wanted.has(row['Tran Id']));
if (rows.length !== wanted.size) throw new Error(`Expected ${wanted.size} held rows, found ${rows.length}`);
writeFileSync(resolve(archive, 'held-raw-records.json'), JSON.stringify(rows, null, 2) + '\n');
console.log(JSON.stringify({ archive, heldRows: rows.length }));
