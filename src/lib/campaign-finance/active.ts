import 'server-only';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

export type ActiveManifest = {
  snapshot: string; start: string; end: string; rows: number; database: string;
  database_sha256: string; semantics_version: string; completeness_verified: boolean;
  source_files: { sha256: string; retrieval_end: string; method?: string; new_rows?: number }[];
};

const localPath = resolve(process.cwd(), 'research/campaign-finance/active-snapshot-manifest.json');
const path = !process.env.VERCEL && existsSync(localPath)
  ? localPath : resolve(process.cwd(), 'server-data/campaign-finance/manifest.json');
let cached: { mtime: number; value: ActiveManifest } | undefined;

export function activeManifest(): ActiveManifest {
  const mtime = statSync(path).mtimeMs;
  if (cached?.mtime === mtime) return cached.value;
  const value = JSON.parse(readFileSync(path, 'utf8')) as ActiveManifest;
  if (!/^orestar-20250101-\d{8}(-[a-f0-9]{8,12}|-v\d+)$/.test(value.snapshot) ||
      !/^202\d-\d{2}-\d{2}$/.test(value.end) ||
      !/^[a-f0-9]{64}$/.test(value.database_sha256) ||
      !(value.database === 'server-data/campaign-finance/finance.duckdb' ||
        (!process.env.VERCEL && value.database.startsWith('runtime-data/orestar-analysis/') && !value.database.includes('..')))) {
    throw new Error('Invalid active campaign-finance manifest');
  }
  cached = { mtime, value };
  return value;
}
