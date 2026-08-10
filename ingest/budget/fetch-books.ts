/**
 * Download the Adopted Budget PDFs and extract their text layer.
 *
 *   npx tsx ingest/budget/fetch-books.ts
 *   npx tsx ingest/budget/fetch-books.ts --accept-new-checksum
 *
 * Idempotent: a file whose sha256 already matches the lock is skipped entirely.
 *
 * A checksum that does NOT match the lock is a hard failure. The city silently
 * re-posting a corrected volume is exactly the failure mode that would otherwise
 * change published numbers on the site with no code change to review.
 * --accept-new-checksum rewrites the lock, which shows up as a reviewable diff
 * and forces reconciliation to be re-run.
 *
 * Requires poppler (`pdftotext`, `pdfinfo`) — already present on this machine.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  SOURCES, LOCK_PATH, PDF_DIR, TEXT_DIR, PARSED_DIR, REPORTS_DIR, ROOT, FY,
  type Lock, type LockEntry,
} from "./sources";

const acceptNew = process.argv.includes("--accept-new-checksum");

function sha256(file: string): string {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function pdfPages(file: string): number {
  const out = execFileSync("pdfinfo", [file], { encoding: "utf8" });
  const m = out.match(/^Pages:\s+(\d+)/m);
  if (!m) throw new Error(`pdfinfo gave no page count for ${file}`);
  return Number(m[1]);
}

function pdfCreated(file: string): string | null {
  const out = execFileSync("pdfinfo", [file], { encoding: "utf8" });
  return out.match(/^CreationDate:\s+(.+)$/m)?.[1].trim() ?? null;
}

async function download(url: string, dest: string): Promise<void> {
  process.stdout.write(`  downloading ${path.basename(dest)} … `);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`${(buf.length / 1e6).toFixed(1)} MB`);
}

function readLock(): Lock {
  if (!fs.existsSync(LOCK_PATH)) {
    return { fy: FY, lockedAt: new Date().toISOString().slice(0, 10), files: {} };
  }
  return JSON.parse(fs.readFileSync(LOCK_PATH, "utf8")) as Lock;
}

async function main() {
  for (const d of [PDF_DIR, TEXT_DIR, PARSED_DIR, REPORTS_DIR]) {
    fs.mkdirSync(d, { recursive: true });
  }

  const lock = readLock();
  let lockChanged = false;
  const problems: string[] = [];

  for (const src of SOURCES) {
    const pdf = path.join(PDF_DIR, src.file);
    console.log(`\n${src.key} — ${src.title}`);

    if (!fs.existsSync(pdf)) {
      await download(src.url, pdf);
    }

    const hash = sha256(pdf);
    const prior = lock.files[src.key];

    if (prior && prior.sha256 !== hash) {
      if (!acceptNew) {
        problems.push(
          `${src.key}: checksum changed.\n` +
            `    locked  ${prior.sha256.slice(0, 16)}…  ${prior.bytes} bytes, ${prior.pages} pp\n` +
            `    on disk ${hash.slice(0, 16)}…  ${fs.statSync(pdf).size} bytes\n` +
            `    The published document may have been revised. Re-run with ` +
            `--accept-new-checksum to adopt it, then re-run reconciliation.`,
        );
        continue;
      }
      console.log("  ! checksum changed — adopting (--accept-new-checksum)");
    }

    const pages = pdfPages(pdf);
    if (src.expectedPages && pages !== src.expectedPages) {
      problems.push(`${src.key}: expected ${src.expectedPages} pages, found ${pages}`);
      continue;
    }

    const entry: LockEntry = {
      sha256: hash,
      bytes: fs.statSync(pdf).size,
      pages,
      pdfCreated: pdfCreated(pdf),
      url: src.url,
    };
    if (!prior || prior.sha256 !== hash) {
      lock.files[src.key] = entry;
      lockChanged = true;
      console.log(prior ? "  lock updated" : "  NEW LOCK ENTRY — review before commit");
    }
    console.log(`  sha256 ${hash.slice(0, 16)}…  ${pages} pp  created ${entry.pdfCreated}`);

    if (!src.parse) {
      console.log("  archived (not parsed)");
      continue;
    }

    // Keep form feeds: \f is the page delimiter, and page numbers are what make
    // every extracted figure citable.
    const txt = path.join(TEXT_DIR, `${src.key}-layout.txt`);
    if (!fs.existsSync(txt) || fs.statSync(txt).mtimeMs < fs.statSync(pdf).mtimeMs) {
      process.stdout.write("  pdftotext -layout … ");
      execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", pdf, txt]);
      const pageCount = fs.readFileSync(txt, "utf8").split("\f").length - 1;
      console.log(`${(fs.statSync(txt).size / 1e6).toFixed(1)} MB, ${pageCount} page breaks`);
      if (Math.abs(pageCount - pages) > 1) {
        problems.push(
          `${src.key}: text has ${pageCount} pages but pdfinfo says ${pages}. ` +
            `Everything downstream is page-indexed, so this must match.`,
        );
      }
    } else {
      console.log("  text extract up to date");
    }
  }

  if (lockChanged) {
    lock.lockedAt = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + "\n");
    console.log(`\nWrote ${LOCK_PATH}`);
  }

  if (problems.length) {
    console.error(`\n${"=".repeat(70)}\nFETCH FAILED\n${"=".repeat(70)}`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }

  console.log(`\nOK — sources ready under ${ROOT}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
