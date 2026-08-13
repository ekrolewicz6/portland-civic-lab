/**
 * Pull freeway detector data from PORTAL.
 *
 *   npx tsx ingest/rose-quarter/fetch-portal.ts                      # yesterday
 *   npx tsx ingest/rose-quarter/fetch-portal.ts --from 2025-09-15 --to 2025-10-17
 *   npx tsx ingest/rose-quarter/fetch-portal.ts --refetch 2026-09-14
 *   npx tsx ingest/rose-quarter/fetch-portal.ts --meta                # station/detector metadata
 *
 * Cache-first: a (highway, date, resolution) already recorded in
 * snapshots.lock.json with a matching file on disk is skipped, so re-running
 * costs nothing. `--refetch` is the only way to overwrite, and it APPENDS a new
 * lock entry rather than replacing the old one — PORTAL backfills late detector
 * data, and a published number changing underneath us must show up as a
 * reviewable diff rather than happening quietly.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  freewayUrl, rawPath, STATION_META, DETECTOR_META, META_DIR, LOCK_PATH,
  USER_AGENT, RAW_DIR, REPORTS_DIR, MANUAL_DIR,
  type Resolution, type Lock, type Snapshot, type DetectorRow,
} from "./sources";
import { REQUIRED_HIGHWAYS } from "../../src/lib/rose-quarter/prereg";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const val = (n: string) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};

/** Hourly for everything; 15-minute only where we test peak-spreading. */
const HOURLY: Resolution = "01:00:00";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const sha = (b: string | Buffer) => createHash("sha256").update(b).digest("hex");

function readLock(): Lock {
  if (!fs.existsSync(LOCK_PATH)) {
    return {
      note:
        "Append-only record of every PORTAL fetch. A changed sha256 for the same " +
        "(highway, date, resolution) means PORTAL revised the data after we read it.",
      snapshots: [],
    };
  }
  return JSON.parse(fs.readFileSync(LOCK_PATH, "utf8")) as Lock;
}

function datesBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const end = new Date(`${to}T00:00:00Z`).getTime();
  for (let d = new Date(`${from}T00:00:00Z`); d.getTime() <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function fetchJson(url: string): Promise<{ text: string; rows: DetectorRow[] }> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed: unknown = JSON.parse(text);
      const rows = (Array.isArray(parsed) ? parsed : []) as DetectorRow[];
      return { text, rows };
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await sleep(attempt * 3000);
    }
  }
  throw lastErr;
}

async function fetchDay(
  highwayId: number,
  date: string,
  resolution: Resolution,
  lock: Lock,
  refetch: boolean,
): Promise<"cached" | "fetched" | "empty"> {
  const dest = rawPath(highwayId, date, resolution);
  const prior = lock.snapshots.filter(
    (s) => s.highwayId === highwayId && s.date === date && s.resolution === resolution,
  );
  const latest = prior[prior.length - 1];

  if (!refetch && latest && fs.existsSync(dest) && sha(fs.readFileSync(dest)) === latest.sha256) {
    return "cached";
  }

  const { text, rows } = await fetchJson(freewayUrl({ highwayId, date, resolution }));
  if (rows.length === 0) return "empty";

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text);

  const hours = new Set(rows.map((r) => String(r.starttime).slice(11, 13)));
  const digest = sha(text);
  const snap: Snapshot = {
    highwayId,
    date,
    resolution,
    sha256: digest,
    bytes: Buffer.byteLength(text),
    rowCount: rows.length,
    distinctHours: hours.size,
    fetchedAt: new Date().toISOString(),
    source: "api",
    ...(latest && latest.sha256 !== digest ? { supersedes: latest.sha256 } : {}),
  };
  lock.snapshots.push(snap);

  if (resolution === HOURLY && hours.size !== 24) {
    console.warn(
      `    ! hw${highwayId} ${date}: ${hours.size}/24 hours — partial day, will be flagged`,
    );
  }
  return "fetched";
}

async function fetchMeta() {
  fs.mkdirSync(META_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  for (const [name, url] of [
    ["stations", STATION_META],
    ["detectors", DETECTOR_META],
  ] as const) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const text = await res.text();
    fs.writeFileSync(`${META_DIR}/${name}-${stamp}.json`, text);
    console.log(`  ${name}-${stamp}.json  ${(Buffer.byteLength(text) / 1024).toFixed(0)} KB`);
    await sleep(1000);
  }
}

async function main() {
  for (const d of [RAW_DIR, META_DIR, MANUAL_DIR, REPORTS_DIR]) {
    fs.mkdirSync(d, { recursive: true });
  }

  if (flag("--meta")) {
    console.log("Station and detector metadata:");
    await fetchMeta();
    return;
  }

  const refetchDate = val("--refetch");
  const from = refetchDate ?? val("--from");
  const to = refetchDate ?? val("--to") ?? from;

  let dates: string[];
  if (from) {
    dates = datesBetween(from, to!);
  } else {
    // PORTAL lags about a day.
    const y = new Date(Date.now() - 24 * 60 * 60 * 1000);
    dates = [y.toISOString().slice(0, 10)];
  }

  const lock = readLock();
  const before = lock.snapshots.length;
  let cached = 0;
  let fetched = 0;
  let empty = 0;

  console.log(
    `${dates.length} date(s) × ${REQUIRED_HIGHWAYS.length} highways at ${HOURLY}` +
      `${refetchDate ? "  (refetch)" : ""}`,
  );

  for (const date of dates) {
    process.stdout.write(`  ${date} `);
    for (const hw of REQUIRED_HIGHWAYS) {
      try {
        const r = await fetchDay(hw, date, HOURLY, lock, Boolean(refetchDate));
        if (r === "cached") cached++;
        else if (r === "empty") empty++;
        else fetched++;
        process.stdout.write(r === "cached" ? "·" : r === "empty" ? "○" : "▪");
      } catch (e) {
        process.stdout.write("✗");
        console.error(`\n    hw${hw} ${date}: ${(e as Error).message}`);
      }
      if (!flag("--fast")) await sleep(1000);
    }
    process.stdout.write("\n");
  }

  if (lock.snapshots.length !== before) {
    fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + "\n");
  }

  const superseded = lock.snapshots.slice(before).filter((s) => s.supersedes).length;
  console.log(
    `\nfetched ${fetched} · cached ${cached} · empty ${empty}` +
      (superseded ? ` · ${superseded} REVISED BY PORTAL — review the lock diff` : ""),
  );
  console.log(`lock: ${lock.snapshots.length} snapshots`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
