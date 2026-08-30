/**
 * Wayback-archive every URL in the registry BEFORE fetching. PPS documents sit
 * behind Finalsite UUIDs that have already rotted once (legacy /Page/NNNN URLs
 * are dead); the snapshot is what makes gitignored PDFs safe to not commit.
 *
 *   npx tsx ingest/pps-budget/archive.ts            # archive everything unarchived
 *   npx tsx ingest/pps-budget/archive.ts --retry    # also retry prior failures
 *
 * Anonymous Save Page Now is rate-limited, so this throttles hard and treats
 * "already has a recent snapshot" as success (availability API checked first).
 * Progress is written to the lock's `archives` map after every URL, so the run
 * is resumable.
 */

import fs from "node:fs";
import { DOCS, ARCHIVE_LOCK_PATH } from "./sources";

type ArchiveLock = Record<string, { waybackUrl: string; waybackTs: string }>;

const RETRY = process.argv.includes("--retry");
const THROTTLE_MS = 30000;
const BACKOFF_MS = 90000;
const RECENT_DAYS = 120;

function readLock(): ArchiveLock {
  if (!fs.existsSync(ARCHIVE_LOCK_PATH)) return {};
  return JSON.parse(fs.readFileSync(ARCHIVE_LOCK_PATH, "utf8")) as ArchiveLock;
}

function writeLock(lock: ArchiveLock) {
  fs.writeFileSync(ARCHIVE_LOCK_PATH, JSON.stringify(lock, null, 2) + "\n");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function recentSnapshot(url: string): Promise<{ waybackUrl: string; waybackTs: string } | null> {
  try {
    const res = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "portland-civic-lab research archiver" } },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      archived_snapshots?: { closest?: { url: string; timestamp: string; available: boolean } };
    };
    const c = body.archived_snapshots?.closest;
    if (!c?.available) return null;
    const ts = c.timestamp; // YYYYMMDDhhmmss
    const age =
      (Date.now() - Date.parse(`${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`)) /
      86400000;
    if (age > RECENT_DAYS) return null;
    return { waybackUrl: c.url.replace(/^http:/, "https:"), waybackTs: ts };
  } catch {
    return null;
  }
}

async function savePageNow(url: string): Promise<{ waybackUrl: string; waybackTs: string } | "RATE" | null> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      redirect: "follow",
      headers: { "User-Agent": "portland-civic-lab research archiver" },
    });
    // SPN redirects to /web/<ts>/<url> on success; the final URL is the snapshot.
    if (res.ok && /\/web\/\d{14}/.test(res.url)) {
      const ts = res.url.match(/\/web\/(\d{14})/)![1];
      return { waybackUrl: res.url, waybackTs: ts };
    }
    if (res.status === 429) return "RATE";
    // Some saves return 200 on the SPN page itself; verify via availability.
    return await recentSnapshot(url);
  } catch {
    return null;
  }
}

async function main() {
  const archives = readLock();
  const urls: { id: string; url: string }[] = [];
  for (const d of DOCS) {
    urls.push({ id: d.id, url: d.url });
    if (d.mirrorUrl) urls.push({ id: `${d.id}#mirror`, url: d.mirrorUrl });
  }

  const todo = urls.filter(
    (u) => !archives[u.url] || (RETRY && archives[u.url]?.waybackTs === "FAILED"),
  );
  console.log(`${urls.length} registry URLs, ${todo.length} to archive`);

  let ok = 0;
  let failed = 0;
  for (const [i, u] of todo.entries()) {
    process.stdout.write(`[${i + 1}/${todo.length}] ${u.id} … `);

    const existing = await recentSnapshot(u.url);
    if (existing) {
      archives[u.url] = existing;
      writeLock(archives);
      ok++;
      console.log(`recent snapshot ${existing.waybackTs}`);
      await sleep(1500);
      continue;
    }

    let saved = await savePageNow(u.url);
    if (saved === "RATE") {
      console.log("429; backing off");
      await sleep(BACKOFF_MS);
      saved = await savePageNow(u.url);
      if (saved === "RATE") saved = null;
    }
    if (saved) {
      archives[u.url] = saved;
      ok++;
      console.log(`saved ${saved.waybackTs}`);
    } else {
      archives[u.url] = { waybackUrl: "", waybackTs: "FAILED" };
      failed++;
      console.log("FAILED (retry later with --retry)");
    }
    writeLock(archives);
    await sleep(THROTTLE_MS);
  }

  console.log(`\narchived ok: ${ok}, failed: ${failed}, previously done: ${urls.length - todo.length}`);
  if (failed > 0) process.exitCode = 2;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
