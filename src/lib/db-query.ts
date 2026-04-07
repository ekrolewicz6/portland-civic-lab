import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL ||
  "postgresql://edankrolewicz@localhost:5432/portland_dashboard";
const isPooled = databaseUrl.includes("pooler.supabase.com");

// Parse connection string explicitly to avoid URL parser issues with special
// characters in passwords (e.g. * getting misinterpreted)
function parseConnectionOptions(url: string) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
      database: parsed.pathname.slice(1) || "postgres",
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      ssl: "prefer" as const,
    };
  } catch {
    return undefined;
  }
}

const explicitOpts = isPooled ? parseConnectionOptions(databaseUrl) : undefined;

if (explicitOpts) {
  console.log(`[db] Connecting to Supabase pooler: ${explicitOpts.host}:${explicitOpts.port}/${explicitOpts.database} (user: ${explicitOpts.username})`);
} else {
  // Mask password in log
  const safeUrl = databaseUrl.replace(/:([^@]+)@/, ":***@");
  console.log(`[db] Connecting via URL: ${safeUrl}`);
}

// Serverless-safe connection settings.
// On Vercel, functions freeze/thaw between invocations. A long-lived connection
// pool can leave stale sockets that hang on the next request. To stay reliable:
//   - max: 1            → one connection per function invocation (no pool reuse races)
//   - idle_timeout: 20  → close idle connections quickly so stale sockets die
//   - max_lifetime: 60  → recycle connections every minute
//   - connect_timeout: 10 → fail fast on connect issues instead of hanging
//   - prepare: false    → required for Supabase transaction-mode pooler
const SERVERLESS_OPTS = {
  max: 1,
  idle_timeout: 20,
  max_lifetime: 60,
  connect_timeout: 10,
  prepare: false,
  onnotice: () => {}, // suppress NOTICE messages
};

const sql = explicitOpts
  ? postgres({
      ...explicitOpts,
      ...SERVERLESS_OPTS,
    })
  : postgres(databaseUrl, SERVERLESS_OPTS);

export default sql;

/**
 * Check the dashboard_cache table for a cached response.
 * Returns the cached data if found and updated within the last hour, otherwise null.
 */
export async function getCachedData<T>(question: string, ttlMs: number = 60 * 60 * 1000): Promise<T | null> {
  try {
    const rows = await sql`
      SELECT data, updated_at
      FROM public.dashboard_cache
      WHERE question = ${question}
    `;
    if (rows.length === 0) return null;

    const row = rows[0];
    const updatedAt = new Date(row.updated_at as string);
    const cutoff = new Date(Date.now() - ttlMs);

    if (updatedAt < cutoff) return null;

    // Reject poisoned error responses; accept everything else.
    const cached = row.data as Record<string, unknown>;
    if (!cached) return null;
    if (cached.dataStatus === "unavailable") return null;
    if (cached.dataStatus === "error") return null;

    return cached as T;
  } catch {
    return null;
  }
}

/**
 * Store computed data in the dashboard_cache table.
 * Refuses to cache responses that look like error/empty states.
 */
export async function setCachedData(
  question: string,
  data: unknown,
): Promise<void> {
  // Don't cache error responses — they'll poison the cache.
  // Accept everything else (live, available, partial, etc).
  const d = data as Record<string, unknown> | null;
  if (!d) return;
  if (d.dataStatus === "unavailable" || d.dataStatus === "error") return;
  try {
    // Pass the object directly — postgres.js auto-serializes to JSONB.
    // Previously this used JSON.stringify(data)::jsonb which caused
    // double-encoding (data stored as a JSON string scalar instead of object),
    // making cached.dataStatus reads return undefined and bypassing the cache.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = sql.json(d as any);
    await sql`
      INSERT INTO public.dashboard_cache (question, data, updated_at)
      VALUES (${question}, ${json}, NOW())
      ON CONFLICT (question)
      DO UPDATE SET data = ${json}, updated_at = NOW()
    `;
  } catch {
    // Silently ignore cache write failures
  }
}
