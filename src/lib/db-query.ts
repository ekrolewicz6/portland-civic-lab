import postgres from "postgres";

const databaseUrl =
  process.env.DATABASE_URL ||
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
  console.log(
    `[db] Connecting to Supabase pooler: ${explicitOpts.host}:${explicitOpts.port}/${explicitOpts.database} (user: ${explicitOpts.username})`,
  );
} else {
  const safeUrl = databaseUrl.replace(/:([^@]+)@/, ":***@");
  console.log(`[db] Connecting via URL: ${safeUrl}`);
}

// Serverless-safe connection settings.
const SERVERLESS_OPTS = {
  max: 1,
  idle_timeout: 10,
  max_lifetime: 30,
  connect_timeout: 10,
  prepare: false,
  onnotice: () => {},
};

// ── Client lifecycle ────────────────────────────────────────────────────
//
// On Vercel, Lambdas freeze between invocations. A module-level postgres
// client survives the freeze, but its underlying TCP socket and the
// Supabase pooler's allocation may not. Symptoms we observed:
//   - Some requests hang for the full Vercel timeout (60s)
//   - Many endpoints work for a while, then "all of them" stall together,
//     then recover. Classic sign of stale connections accumulating across
//     Lambda freeze/thaw cycles.
//
// Fix: lazily recreate the client whenever it's older than MAX_CLIENT_AGE_MS.
// On a thaw after a long freeze, the next request will get a fresh client
// and the old one is closed in the background. Active requests within a
// 30-second window share the same client (no per-query connection overhead).

const MAX_CLIENT_AGE_MS = 30_000;

type SqlClient = ReturnType<typeof postgres>;

let _client: SqlClient | null = null;
let _createdAt = 0;

function makeClient(): SqlClient {
  return explicitOpts
    ? postgres({ ...explicitOpts, ...SERVERLESS_OPTS })
    : postgres(databaseUrl, SERVERLESS_OPTS);
}

function getClient(): SqlClient {
  const now = Date.now();
  if (!_client || now - _createdAt > MAX_CLIENT_AGE_MS) {
    if (_client) {
      // Fire-and-forget cleanup of the stale client. If its socket is
      // already dead, end() will throw — we don't care.
      const stale = _client;
      stale.end({ timeout: 5 }).catch(() => {});
    }
    _client = makeClient();
    _createdAt = now;
  }
  return _client;
}

// Proxy that transparently delegates to the current client. Routes can
// `import sql from "@/lib/db-query"` once and never worry about lifecycle.
// Both tagged-template calls (sql`SELECT 1`) and method calls (sql.unsafe,
// sql.json, etc.) go through the Proxy and pick up the current client.
const sql = new Proxy(function () {} as unknown as SqlClient, {
  apply(_target, _thisArg, args) {
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)(...args);
  },
  get(_target, prop) {
    const client = getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (client as any)[prop];
    // Bind methods to the underlying client so internal `this` accesses
    // hit the real object instead of recursing through the proxy.
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as SqlClient;

export default sql;

// Exposed for tests/cron jobs that need to force a clean reconnect.
export async function resetDbClient(): Promise<void> {
  if (_client) {
    const stale = _client;
    _client = null;
    _createdAt = 0;
    await stale.end({ timeout: 5 }).catch(() => {});
  }
}

/**
 * Check the dashboard_cache table for a cached response.
 */
export async function getCachedData<T>(
  question: string,
  ttlMs: number = 60 * 60 * 1000,
): Promise<T | null> {
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
 */
export async function setCachedData(
  question: string,
  data: unknown,
): Promise<void> {
  const d = data as Record<string, unknown> | null;
  if (!d) return;
  if (d.dataStatus === "unavailable" || d.dataStatus === "error") return;
  try {
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
