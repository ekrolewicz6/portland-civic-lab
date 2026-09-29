/** One command: validate, merge, recompute, verify, and record failures. */
import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const source = process.argv[2];
if (!source) throw new Error('Usage: npm run orestar:refresh:manual -- /absolute/path/ORESTAR-export.xlsx');
const logDir = resolve(root, 'runtime-data/orestar-manual');
mkdirSync(logDir, { recursive: true });
const log = resolve(logDir, 'refresh-attempts.jsonl');
const python = resolve(root, 'runtime-data/orestar-analysis/py312/bin/python');
const steps = [];
let snapshot = null;
try {
  const imported = spawnSync(process.execPath, [resolve(root, 'ingest/orestar/import-manual-export.mjs'), source], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (imported.status !== 0) throw new Error(`Workbook validation failed: ${imported.stderr.trim() || imported.stdout.trim()}`);
  const audit = JSON.parse(imported.stdout);
  steps.push({ step: 'validate_and_archive', status: audit.status, newRows: audit.newRows ?? 0 });
  if (audit.status === 'validated') {
    const merged = spawnSync(python, [resolve(root, 'ingest/orestar/analysis/merge_manual_export.py'), audit.archive], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    if (merged.status !== 0) throw new Error(`Database recomputation failed: ${merged.stderr.trim() || merged.stdout.trim()}`);
    snapshot = JSON.parse(merged.stdout).snapshot;
    steps.push({ step: 'merge_and_recompute', status: 'passed', snapshot });
  }
  const verified = spawnSync(python, [resolve(root, 'ingest/orestar/analysis/verify_active.py')], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (verified.status !== 0) throw new Error(`Active snapshot verification failed: ${verified.stderr.trim() || verified.stdout.trim()}`);
  const result = JSON.parse(verified.stdout);
  snapshot = result.snapshot;
  steps.push({ step: 'verify', status: 'passed', rows: result.rows });
  const packaged = spawnSync(python, [resolve(root, 'ingest/orestar/analysis/package_publication.py')], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (packaged.status !== 0) throw new Error(`Publication packaging failed: ${packaged.stderr.trim() || packaged.stdout.trim()}`);
  const checked = spawnSync(process.execPath, [resolve(root, 'ingest/orestar/check-publication.mjs')], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (checked.status !== 0) throw new Error(`Publication privacy verification failed: ${checked.stderr.trim() || checked.stdout.trim()}`);
  steps.push({ step: 'package_and_privacy_check', status: 'passed' });
  const receipt = { at: new Date().toISOString(), source: resolve(source), status: audit.status === 'validated' ? 'promoted' : audit.status, snapshot, steps };
  appendFileSync(log, JSON.stringify(receipt) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
} catch (error) {
  const receipt = { at: new Date().toISOString(), source: resolve(source), status: 'failed', snapshot, steps, error: String(error) };
  appendFileSync(log, JSON.stringify(receipt) + '\n');
  console.error(JSON.stringify(receipt, null, 2));
  process.exitCode = 1;
}
