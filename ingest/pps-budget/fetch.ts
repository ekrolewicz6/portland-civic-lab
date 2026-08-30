/**
 * Download the PPS corpus documents and extract text layers.
 *
 *   npx tsx ingest/pps-budget/fetch.ts --tier 1
 *   npx tsx ingest/pps-budget/fetch.ts --tier 2
 *   npx tsx ingest/pps-budget/fetch.ts --tier 2 --accept-new-checksum
 *
 * Same discipline as ingest/budget/fetch-books.ts: a checksum that stops
 * matching the lock is a hard failure (a silently revised document is exactly
 * what must never change published numbers without review). Falls back to the
 * Wayback snapshot recorded by archive.ts when the live URL has died.
 *
 * Requires poppler (pdftotext, pdfinfo).
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  DOCS, LOCK_PATH, ARCHIVE_LOCK_PATH, PDF_DIR, TEXT_DIR, XLSX_DIR, ROOT,
  type Lock, type LockEntry, type PpsDoc,
} from "./sources";

function readArchives(): Record<string, { waybackUrl: string; waybackTs: string }> {
  if (!fs.existsSync(ARCHIVE_LOCK_PATH)) return {};
  return JSON.parse(fs.readFileSync(ARCHIVE_LOCK_PATH, "utf8"));
}

const acceptNew = process.argv.includes("--accept-new-checksum");
const tierArg = process.argv.indexOf("--tier");
const maxTier = tierArg >= 0 ? Number(process.argv[tierArg + 1]) : 1;
const onlyArg = process.argv.indexOf("--only");
const onlyId = onlyArg >= 0 ? process.argv[onlyArg + 1] : null;

const sha256 = (f: string) => createHash("sha256").update(fs.readFileSync(f)).digest("hex");

function pdfPages(file: string): number | null {
  try {
    const out = execFileSync("pdfinfo", [file], { encoding: "utf8" });
    return Number(out.match(/^Pages:\s+(\d+)/m)?.[1] ?? NaN) || null;
  } catch {
    return null;
  }
}

function readLock(): Lock {
  if (!fs.existsSync(LOCK_PATH)) {
    return { lockedAt: new Date().toISOString().slice(0, 10), files: {} };
  }
  const l = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8")) as Lock;
  l.files ??= {};
  return l;
}

async function download(doc: PpsDoc, dest: string, archives: ReturnType<typeof readArchives>): Promise<string> {
  const candidates = [doc.url, doc.mirrorUrl, archives[doc.url]?.waybackUrl].filter(
    (u): u is string => !!u && u !== "",
  );
  let lastErr = "";
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh)" },
      });
      if (!res.ok) {
        lastErr = `HTTP ${res.status} for ${url}`;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const head = buf.subarray(0, 5).toString("latin1");
      if (doc.kind === "pdf" && head !== "%PDF-") {
        lastErr = `not a PDF from ${url} (starts "${head}")`;
        continue;
      }
      fs.writeFileSync(dest, buf);
      return url;
    } catch (e) {
      lastErr = (e as Error).message;
    }
  }
  throw new Error(lastErr || "no candidate URLs");
}

async function main() {
  for (const d of [PDF_DIR, TEXT_DIR, XLSX_DIR]) fs.mkdirSync(d, { recursive: true });

  const lock = readLock();
  const archives = readArchives();
  let lockChanged = false;
  const problems: string[] = [];
  let fetched = 0;
  let skipped = 0;

  const targets = DOCS.filter(
    (d) =>
      d.kind !== "page" &&
      (onlyId ? d.id === onlyId : (d.fetchTier ?? 9) <= maxTier),
  );
  console.log(`tier <= ${maxTier}: ${targets.length} documents`);

  for (const doc of targets) {
    const dir = doc.kind === "xlsx" ? XLSX_DIR : PDF_DIR;
    const dest = path.join(dir, `${doc.id}.${doc.kind}`);

    if (!fs.existsSync(dest)) {
      process.stdout.write(`${doc.id} … `);
      try {
        const from = await download(doc, dest, archives);
        const viaWayback = from.includes("web.archive.org");
        console.log(
          `${(fs.statSync(dest).size / 1e6).toFixed(1)} MB${viaWayback ? " (via Wayback)" : ""}`,
        );
        fetched++;
      } catch (e) {
        problems.push(`${doc.id}: ${(e as Error).message}`);
        console.log("FAILED");
        continue;
      }
    } else {
      skipped++;
    }

    const hash = sha256(dest);
    const prior = lock.files[doc.id];
    if (prior && prior.sha256 !== hash && !acceptNew) {
      problems.push(
        `${doc.id}: checksum changed (locked ${prior.sha256.slice(0, 12)}…, disk ${hash.slice(0, 12)}…). ` +
          `The published document may have been revised. --accept-new-checksum to adopt.`,
      );
      continue;
    }
    if (!prior || prior.sha256 !== hash) {
      lock.files[doc.id] = {
        sha256: hash,
        bytes: fs.statSync(dest).size,
        pages: doc.kind === "pdf" ? pdfPages(dest) : null,
        url: doc.url,
        waybackUrl: archives[doc.url]?.waybackUrl,
        waybackTs: archives[doc.url]?.waybackTs,
        fetchedAt: new Date().toISOString().slice(0, 10),
      } satisfies LockEntry;
      lockChanged = true;
    }

    if (doc.kind === "pdf") {
      const txt = path.join(TEXT_DIR, `${doc.id}.txt`);
      if (!fs.existsSync(txt) || fs.statSync(txt).mtimeMs < fs.statSync(dest).mtimeMs) {
        try {
          execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", dest, txt]);
        } catch {
          problems.push(`${doc.id}: pdftotext failed (scanned/secured PDF? note for OCR)`);
        }
      }
    }
  }

  if (lockChanged) {
    lock.lockedAt = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + "\n");
    console.log(`\nwrote ${LOCK_PATH}`);
  }

  console.log(`\nfetched ${fetched}, already present ${skipped}, problems ${problems.length}`);
  if (problems.length) {
    console.error(`${"=".repeat(60)}\nPROBLEMS`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`OK — corpus under ${ROOT}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
