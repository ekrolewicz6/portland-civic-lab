/**
 * Apply a SQL migration file to the database in DATABASE_URL.
 *
 * Usage: npx tsx ingest/apply-migration.ts drizzle/0003_members.sql
 *
 * Migrations in this repo are written to be idempotent (IF NOT EXISTS), so
 * re-running a file is safe.
 */
import postgres from "postgres";
import fs, { readFileSync } from "node:fs";
import path from "node:path";

// Load .env.local (same pattern as the other ingest scripts)
const envPath = path.resolve(import.meta.dirname ?? ".", "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx ingest/apply-migration.ts <path-to-sql-file>");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 15 });

  try {
    const ddl = readFileSync(file, "utf8");
    await sql.unsafe(ddl);
    console.log(`Applied ${file}`);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
