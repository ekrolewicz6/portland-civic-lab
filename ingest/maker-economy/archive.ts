/** Restore pinned public source files into runtime-data/maker-economy.
 * Run from repo root: npx tsx ingest/maker-economy/archive.ts
 * Existing files are checked. Changed remote files are kept as .candidate;
 * historical locks are never silently updated. No credentials are required. */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sources, locks, raw, sha, checkedRaw } from './common';
async function main() {
  mkdirSync(raw, { recursive: true });
  let failed = 0;
  for (let i = 0; i < sources.length; i += 5) {
    const results = await Promise.allSettled(sources.slice(i, i + 5).map(async s => {
      const lock = locks.find(l => l.id === s.id);
      if (lock?.status !== 'archived' || !lock.file) { console.log(`${s.id}: unarchived; see source registry`); return; }
      if (existsSync(lock.file)) { checkedRaw(s.id); return; }
      const response = await fetch(s.url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`${s.id}: HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (sha(bytes) !== lock.sha256) {
        writeFileSync(resolve(raw, `${s.id}.${s.format}.candidate`), bytes);
        throw new Error(`${s.id}: remote content changed; review candidate before updating research`);
      }
      writeFileSync(resolve(lock.file), bytes);
    }));
    for (const r of results) if (r.status === 'rejected') { failed++; console.error(String(r.reason)); }
  }
  console.log(`Archive check: ${failed} errors`); if (failed) process.exitCode = 1;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
