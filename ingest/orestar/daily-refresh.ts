/** Reconcile a complete current ORESTAR view before promoting daily charts. */
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { acquirePublicSession } from './session-lock';

const root = resolve(import.meta.dirname, '../..');
const base = join(root, 'runtime-data/orestar-daily');
const log = join(base, 'events.ndjson');
const start = '2025-01-01';
const date = (value: Date) => value.toISOString().slice(0, 10);
const yesterday = () => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  const now = new Date(`${value('year')}-${value('month')}-${value('day')}T00:00:00Z`);
  now.setUTCDate(now.getUTCDate() - 1);
  return date(now);
};
const args = process.argv.slice(2);
const option = (name: string) => {
  const position = args.indexOf(name);
  return position < 0 ? undefined : args[position + 1];
};
const end = option('--end') ?? yesterday();
if (!/^\d{4}-\d{2}-\d{2}$/.test(end) || Number.isNaN(Date.parse(end)) || new Date(`${end}T00:00:00Z`).toISOString().slice(0, 10) !== end || end < start) {
  throw new Error('--end must be a valid date on or after 2025-01-01');
}
if (args.some(arg => !['--end', '--build-only', end].includes(arg))) {
  throw new Error('Usage: npm run orestar:daily -- [--end YYYY-MM-DD] [--build-only]');
}
const buildOnly = args.includes('--build-only');
mkdirSync(base, { recursive: true });
const event = (type: string, fields: Record<string, unknown> = {}) => {
  appendFileSync(log, JSON.stringify({ at: new Date().toISOString(), type, end, ...fields }) + '\n');
};
const run = (label: string, command: string, childArgs: string[]) => {
  event('stage_start', { label });
  const started = Date.now();
  const result = spawnSync(command, childArgs, { cwd: root, stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    event('stage_failed', { label, exitCode: result.status, error: result.error?.message, elapsedMs: Date.now() - started });
    throw new Error(`${label} failed; verified previous snapshot remains active`);
  }
  event('stage_complete', { label, elapsedMs: Date.now() - started });
};
const py = join(root, 'runtime-data/orestar-analysis/py312/bin/python');
let release: (() => void) | undefined;
try {
  // Use the same lock as the other public collectors. No foreground window.
  if (!buildOnly) {
    release = acquirePublicSession();
    for (const [dataset, label] of [['contributions', 'contributions'], ['other', 'non-contributions']]) {
      const output = join(base, 'runs', end, label);
      // A failed run retains raw partitions and its retry log. The collector's
      // bounded request and slice retries run before this stage can fail.
      const collector = [join(root, 'node_modules/.bin/tsx'), join(root, 'ingest/orestar/download-contributions.ts'), '--dataset', dataset, '--start', start, '--end', end, '--output', output, '--headless'];
      run(`collect_${dataset}`, collector[0], collector.slice(1));
    }
    release();
    release = undefined;
  }
  run('verify_and_publish', py, [join(root, 'ingest/orestar/analysis/daily_dashboard.py'), '--end', end]);
  // A complete verified current view replaces the active transaction database.
  // The prior database stays available until the new manifest is promoted.
  run('rebuild_active_database', py, [join(root, 'ingest/orestar/analysis/build_active_daily.py'), '--end', end]);
  run('verify_active_database', py, [join(root, 'ingest/orestar/analysis/verify_active.py')]);
  const current = JSON.parse(readFileSync(join(base, 'current.json'), 'utf8'));
  event('run_complete', { snapshot: current.snapshot, sourceRows: current.sourceRows });
} catch (error) {
  event('run_failed', { error: error instanceof Error ? error.message : String(error) });
  process.exitCode = 1;
} finally {
  release?.();
}
