# Database schema layout

Two complementary files:

- **`schema.ts`** — hand-maintained definitions for tables the app owns and
  migrates (`drizzle/NNNN_*.sql` files, applied with
  `npx tsx ingest/apply-migration.ts <file>`). Add new app tables here AND
  as a numbered migration.

- **`introspected/schema.ts` + `introspected/relations.ts`** — a generated,
  read-only snapshot of the FULL database (177 tables across all topic
  schemas: safety, housing, homelessness, education, …). Use it for typed
  access to ingest-owned tables instead of `as unknown` casts. Regenerate
  after ingest schema changes:

  ```bash
  set -a; source .env.local; set +a
  npx drizzle-kit pull --config drizzle-introspect.config.ts
  rm -f src/db/introspected/0000_*.sql && rm -rf src/db/introspected/meta
  ```

  (The generated `.sql`/`meta` artifacts are deleted on purpose — they are
  a CREATE-everything dump, never to be applied.)

Known debt: many API routes still query raw SQL with `as unknown` casts
that predate the introspected snapshot. Migrate them to typed queries
opportunistically when touching those routes.
