import { createHash } from "node:crypto";
import {
  appendFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { once } from "node:events";

import { chromium, type BrowserContext, type Page } from "playwright";
import * as XLSX from "xlsx";

const SEARCH_URL =
  "https://secure.sos.state.or.us/orestar/gotoPublicTransactionSearch.do";
const EXPORT_LIMIT = 5_000;
const DEFAULT_SLICE_DAYS = 14;
const DEFAULT_DELAY_MS = 750;
const DEFAULT_FAILURE_ROUNDS = 3;
const MAX_REQUEST_ATTEMPTS = 3;
let eventLogPath: string | undefined;

const TRANSACTION_TYPES = {
  contributions: [{ code: "C", name: "Contribution" }],
  other: [
    { code: "E", name: "Expenditure" },
    { code: "O", name: "Other" },
    { code: "OA", name: "Other Account Receivable" },
    { code: "OD", name: "Other Disbursement" },
    { code: "OR", name: "Other Receipt" },
  ],
} as const;

type Dataset = "contributions" | "other" | "all";
type TransactionType = { code: string; name: string };

type Slice = {
  start: string;
  end: string;
  transactionType?: string;
  transactionTypeName?: string;
  subtype?: string;
  subtypeName?: string;
};

type ManifestEntry = Slice & {
  key: string;
  status: "complete" | "empty" | "failed" | "split";
  count: number;
  rawFile?: string;
  sha256?: string;
  retrievedAt?: string;
  children?: Slice[];
  error?: string;
  failureCount?: number;
};

type Manifest = {
  version: 1 | 2;
  source: string;
  filter: {
    transactionType?: "Contribution";
    dataset?: Dataset;
    transactionTypes?: TransactionType[];
    startDate: string;
    endDate: string;
    includeDeleted: false;
    includeExpired: false;
  };
  createdAt: string;
  updatedAt: string;
  initialTotal?: number;
  finalTotal?: number;
  initialTotalsByType?: Record<string, number>;
  finalTotalsByType?: Record<string, number>;
  roots?: Slice[];
  entries: Record<string, ManifestEntry>;
};

type Options = {
  start: string;
  end: string;
  outputDir: string;
  sliceDays: number;
  delayMs: number;
  failureRounds: number;
  dataset: Dataset;
  transactionTypes: TransactionType[];
  headless: boolean;
  refresh: boolean;
  mergeOnly: boolean;
};

type WorkbookRows = {
  headers: string[];
  rows: string[][];
  transactionIdIndex: number;
};

function usage(): string {
  return `Download current ORESTAR campaign-finance transactions without crossing the 5,000-row export cap.

Usage:
  npx tsx ingest/orestar/download-contributions.ts [options]

Options:
  --start YYYY-MM-DD     Transaction-date start (default: 2025-01-01)
  --end YYYY-MM-DD       Transaction-date end (default: today)
  --dataset NAME         contributions, other, or all (default: contributions)
  --output DIR           Working/output directory
  --slice-days N         Initial inclusive date-window size (default: 14)
  --delay-ms N           Delay between ORESTAR requests (default: 750)
  --failure-rounds N     Times to re-queue a failed slice (default: 3)
  --headless             Run Chrome headless (default; no visible windows)
  --headed               Explicit opt-in to a visible Chrome window
  --refresh              Re-download slices already marked complete
  --merge-only           Rebuild the merged CSV from verified raw files
  --help                  Show this help

The default output directory is runtime-data/orestar/DATASET-START_END.
Chrome is headless by default to avoid interrupting other apps. ORESTAR may reject
headless clients; stop and report that failure, never automatically open a visible
window. The script uses one tab and one request stream.`;
}

function localToday(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function parseArgs(argv: string[]): Options {
  const values = new Map<string, string>();
  const flags = new Set<string>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    if (["--headless", "--headed", "--refresh", "--merge-only", "--help"].includes(argument)) {
      flags.add(argument);
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    values.set(argument, value);
    index += 1;
  }

  if (flags.has("--help")) {
    console.log(usage());
    process.exit(0);
  }

  const start = values.get("--start") ?? "2025-01-01";
  const end = values.get("--end") ?? localToday();
  const dataset = values.get("--dataset") ?? "contributions";
  if (!(["contributions", "other", "all"] as string[]).includes(dataset)) {
    throw new Error("--dataset must be contributions, other, or all");
  }
  assertIsoDate(start, "--start");
  assertIsoDate(end, "--end");
  if (start > end) {
    throw new Error(`--start (${start}) must not be after --end (${end})`);
  }

  const sliceDays = Number(values.get("--slice-days") ?? DEFAULT_SLICE_DAYS);
  const delayMs = Number(values.get("--delay-ms") ?? DEFAULT_DELAY_MS);
  const failureRounds = Number(
    values.get("--failure-rounds") ?? DEFAULT_FAILURE_ROUNDS,
  );
  if (!Number.isInteger(sliceDays) || sliceDays < 1) {
    throw new Error("--slice-days must be a positive integer");
  }
  if (!Number.isInteger(delayMs) || delayMs < 0) {
    throw new Error("--delay-ms must be a non-negative integer");
  }
  if (!Number.isInteger(failureRounds) || failureRounds < 1) {
    throw new Error("--failure-rounds must be a positive integer");
  }

  const typedDataset = dataset as Dataset;
  const directoryLabel =
    typedDataset === "other"
      ? "non-contributions"
      : typedDataset === "all"
        ? "all-transactions"
        : "contributions";
  const transactionTypes: TransactionType[] =
    typedDataset === "all"
      ? [...TRANSACTION_TYPES.contributions, ...TRANSACTION_TYPES.other]
      : [...TRANSACTION_TYPES[typedDataset]];
  const outputDir = resolve(
    values.get("--output") ??
      join("runtime-data", "orestar", `${directoryLabel}-${start}_${end}`),
  );

  return {
    start,
    end,
    outputDir,
    sliceDays,
    delayMs,
    failureRounds,
    dataset: typedDataset,
    transactionTypes,
    headless: !flags.has("--headed"),
    refresh: flags.has("--refresh"),
    mergeOnly: flags.has("--merge-only"),
  };
}

function assertIsoDate(value: string, label: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM-DD`);
  }
  const date = parseDate(value);
  if (formatDate(date) !== value) {
    throw new Error(`${label} is not a valid calendar date: ${value}`);
  }
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number): string {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

function daysBetween(start: string, end: string): number {
  return Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / 86_400_000);
}

export function adaptiveSliceDays(
  start: string,
  end: string,
  totalRows: number,
  minimumDays: number,
): number {
  const spanDays = daysBetween(start, end) + 1;
  if (totalRows <= Math.floor(EXPORT_LIMIT * 0.9)) {
    return spanDays;
  }
  const estimatedDays = Math.max(
    1,
    Math.floor((spanDays * 3_500) / totalRows),
  );
  return Math.min(spanDays, 180, Math.max(minimumDays, estimatedDays));
}

export function buildDateSlices(start: string, end: string, sliceDays: number): Slice[] {
  const slices: Slice[] = [];
  let cursor = start;
  while (cursor <= end) {
    const candidateEnd = addDays(cursor, sliceDays - 1);
    const sliceEnd = candidateEnd < end ? candidateEnd : end;
    slices.push({ start: cursor, end: sliceEnd });
    cursor = addDays(sliceEnd, 1);
  }
  return slices;
}

export function splitDateSlice(slice: Slice): [Slice, Slice] {
  const span = daysBetween(slice.start, slice.end);
  if (span < 1) {
    throw new Error(`Cannot split a single-day slice: ${slice.start}`);
  }
  const leftEnd = addDays(slice.start, Math.floor(span / 2));
  return [
    { ...slice, end: leftEnd },
    { ...slice, start: addDays(leftEnd, 1) },
  ];
}

function displayDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function sliceKey(slice: Slice): string {
  // Preserve the original contribution-only keys so completed manifests remain resumable.
  const transactionType =
    slice.transactionType && slice.transactionType !== "C"
      ? `_${safeName(slice.transactionType)}`
      : "";
  const subtype = slice.subtype ? `_${safeName(slice.subtype)}` : "";
  return `${slice.start}_${slice.end}${transactionType}${subtype}`;
}

/** Infer legacy roots once, then persist them independently of changing live totals. */
export function manifestRoots(manifest: Manifest): Slice[] {
  if (manifest.roots) return manifest.roots;
  const children = new Set(Object.values(manifest.entries).flatMap(e => (e.children ?? []).map(sliceKey)));
  return Object.values(manifest.entries).filter(e => !children.has(e.key)).map(({start,end,transactionType,transactionTypeName,subtype,subtypeName}) => ({start,end,transactionType,transactionTypeName,subtype,subtypeName}));
}
export function activeLeaves(manifest: Manifest): ManifestEntry[] {
  const leaves: ManifestEntry[] = [];
  const seen = new Set<string>();
  function visit(slice: Slice) {
    const key = sliceKey(slice);
    if (seen.has(key)) throw new Error(`Repeated partition or cycle: ${key}`);
    seen.add(key);
    const entry = manifest.entries[key];
    if (!entry) throw new Error(`Missing partition: ${key}`);
    if (entry.status === 'split') {
      if (!entry.children?.length) throw new Error(`Split without children: ${key}`);
      entry.children.forEach(visit);
    } else if (entry.status === 'complete' || entry.status === 'empty') leaves.push(entry);
    else throw new Error(`Unresolved partition: ${key}`);
  }
  manifestRoots(manifest).forEach(visit);
  return leaves;
}

function safeName(value: string): string {
  const sanitized = value.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "");
  return sanitized || createHash("sha256").update(value).digest("hex").slice(0, 10);
}

function sha256(file: string): string {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function loadManifest(path: string, options: Options): Manifest {
  if (existsSync(path)) {
    const manifest = JSON.parse(readFileSync(path, "utf8")) as Manifest;
    const legacyContributionManifest =
      manifest.version === 1 &&
      options.dataset === "contributions" &&
      manifest.filter.transactionType === "Contribution";
    const currentManifest =
      manifest.version === 2 &&
      manifest.filter.dataset === options.dataset &&
      JSON.stringify(manifest.filter.transactionTypes) ===
        JSON.stringify(options.transactionTypes);
    if (
      manifest.filter.startDate !== options.start ||
      manifest.filter.endDate !== options.end ||
      (!legacyContributionManifest && !currentManifest)
    ) {
      throw new Error(
        `Existing manifest filters do not match this run. Choose another --output directory or use matching dates.`,
      );
    }
    return manifest;
  }
  const timestamp = new Date().toISOString();
  return {
    version: 2,
    source: SEARCH_URL,
    filter: {
      dataset: options.dataset,
      transactionTypes: options.transactionTypes,
      startDate: options.start,
      endDate: options.end,
      includeDeleted: false,
      includeExpired: false,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    entries: {},
  };
}

function saveManifest(path: string, manifest: Manifest): void {
  manifest.updatedAt = new Date().toISOString();
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(temporary, path);
}

async function delay(page: Page, milliseconds: number): Promise<void> {
  if (milliseconds > 0) {
    await page.waitForTimeout(milliseconds);
  }
}

function conciseError(error: unknown): string {
  return error instanceof Error ? error.message.split("\n")[0] : String(error);
}

function logEvent(event: Record<string, unknown>): void {
  if (!eventLogPath) return;
  appendFileSync(
    eventLogPath,
    `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`,
  );
}

async function retry<T>(label: string, page: Page, action: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      console.warn(
        `${label}: request attempt ${attempt}/${MAX_REQUEST_ATTEMPTS} failed: ${conciseError(error)}`,
      );
      logEvent({
        type: "request_failure",
        label,
        attempt,
        maxAttempts: MAX_REQUEST_ATTEMPTS,
        error: conciseError(error),
      });
      if (conciseError(error).includes("security service rejected")) throw error;
      if (attempt < MAX_REQUEST_ATTEMPTS) {
        await delay(page, attempt * 1_500);
      }
    }
  }
  throw lastError;
}

async function openSearchPage(page: Page): Promise<void> {
  await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const body = await page.locator("body").innerText();
  if (body.includes("Please Contact Us") || body.includes("Support ID:")) {
    throw new Error("ORESTAR's security service rejected this browser session");
  }
  await page.locator('form[name="cneSearchForm"]').waitFor({
    state: "visible",
    timeout: 15_000,
  });
}

async function waitForSubtypeOptions(page: Page): Promise<Array<{ value: string; name: string }>> {
  const locator = page.locator('select[name="cneSearchTranSubType"] option');
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const options = await locator.evaluateAll((elements) =>
      elements
        .map((element) => ({
          value: (element as HTMLOptionElement).value,
          name: element.textContent?.trim() ?? "",
        }))
        .filter((option) => option.value && option.name),
    );
    if (options.length > 0) {
      return options;
    }
    await page.waitForTimeout(250);
  }
  throw new Error("Contribution subtype options did not load");
}

async function configureSearch(page: Page, slice: Slice): Promise<void> {
  await page
    .locator('input[name="cneSearchTranStartDate"]')
    .fill(displayDate(slice.start));
  await page.locator('input[name="cneSearchTranEndDate"]').fill(displayDate(slice.end));
  await page
    .locator('select[name="cneSearchTranType"]')
    .selectOption(slice.transactionType ?? "C");
  if (slice.subtype) {
    await waitForSubtypeOptions(page);
    await page
      .locator('select[name="cneSearchTranSubType"]')
      .selectOption([slice.subtype]);
  }
}

function parseResultCount(body: string): number {
  const countMatch = body.match(/Results\s*:\s*([\d,]+)\s+records found/i);
  if (countMatch) {
    return Number(countMatch[1].replaceAll(",", ""));
  }
  if (/no records (?:were )?found/i.test(body) || /0\s+records found/i.test(body)) {
    return 0;
  }
  throw new Error("Could not read the result count from ORESTAR");
}

async function search(page: Page, slice: Slice, delayMs: number): Promise<number> {
  return retry(`search ${sliceKey(slice)}`, page, async () => {
    await openSearchPage(page);
    await configureSearch(page, slice);
    await delay(page, delayMs);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
      page.locator('input[name="search"]').first().click(),
    ]);
    await page.locator("body").waitFor({ state: "visible", timeout: 15_000 });
    return parseResultCount(await page.locator("body").innerText());
  });
}

async function transactionSubtypes(
  page: Page,
  slice: Slice,
): Promise<Array<{ value: string; name: string }>> {
  return retry(`load ${slice.transactionTypeName ?? "transaction"} subtypes`, page, async () => {
    await openSearchPage(page);
    await page
      .locator('select[name="cneSearchTranType"]')
      .selectOption(slice.transactionType ?? "C");
    return waitForSubtypeOptions(page);
  });
}

export function spreadsheetRows(path: string): WorkbookRows {
  // ORESTAR's XLSX writer sets zero sizes in ZIP data descriptors. SheetJS can
  // read the files correctly but emits one harmless warning per workbook part.
  // Suppress only that known exporter warning so retry/progress logs stay useful.
  const originalConsoleError = console.error;
  console.error = (...arguments_: unknown[]) => {
    if (!String(arguments_[0]).startsWith("Bad uncompressed size:")) {
      originalConsoleError(...arguments_);
    }
  };
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.readFile(path, { raw: false, cellDates: false });
  } finally {
    console.error = originalConsoleError;
  }
  const sheetName = workbook.SheetNames.includes("ORESTAR Export")
    ? "ORESTAR Export"
    : workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error(`No worksheet found in ${path}`);
  }
  const values = XLSX.utils.sheet_to_json<Array<string | number | boolean>>(
    workbook.Sheets[sheetName],
    { header: 1, raw: false, defval: "" },
  );
  const rows = values.map((row) => row.map((value) => String(value)));
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => /^(?:Tran|Transaction)\s*ID(?:\s*#)?$/i.test(cell.trim())),
  );
  if (headerIndex < 0) {
    throw new Error(`Could not find a transaction-ID header in ${path}`);
  }
  const headers = rows[headerIndex].map((value) => value.trim().replace(/^\uFEFF/, ""));
  const transactionIdIndex = headers.findIndex((header) =>
    /^(?:Tran|Transaction)\s*ID(?:\s*#)?$/i.test(header),
  );
  const data = rows
    .slice(headerIndex + 1)
    .filter((row) => row.some((cell) => cell.trim() !== ""));
  return { headers, rows: data, transactionIdIndex };
}

async function downloadExport(
  page: Page,
  slice: Slice,
  count: number,
  rawDir: string,
  delayMs: number,
): Promise<{ path: string; hash: string }> {
  return retry(`export ${sliceKey(slice)}`, page, async () => {
    const link = page.getByRole("link", { name: "Export To Excel Format" }).first();
    await link.waitFor({ state: "visible", timeout: 15_000 });
    await delay(page, delayMs);
    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await link.click();
    const download = await downloadPromise;
    const suggested = download.suggestedFilename();
    const extension = extname(suggested) || ".csv";
    const destination = join(rawDir, `${sliceKey(slice)}${extension}`);
    const temporary = `${destination}.part`;
    await download.saveAs(temporary);
    const failure = await download.failure();
    if (failure) {
      throw new Error(`ORESTAR export failed: ${failure}`);
    }
    const parsed = spreadsheetRows(temporary);
    if (parsed.rows.length !== count) {
      throw new Error(
        `Exported ${parsed.rows.length} rows but ORESTAR reported ${count} for ${sliceKey(slice)}`,
      );
    }
    renameSync(temporary, destination);
    return { path: destination, hash: sha256(destination) };
  });
}

function csvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function csvRow(row: string[]): string {
  return `${row.map(csvCell).join(",")}\n`;
}

async function mergeExports(
  options: Options,
  manifest: Manifest,
): Promise<{ path: string; rows: number; sha256: string }> {
  const complete = activeLeaves(manifest)
    .filter((entry) => entry.status === "complete")
    .sort((a, b) =>
      a.start.localeCompare(b.start) ||
      a.end.localeCompare(b.end) ||
      (a.subtype ?? "").localeCompare(b.subtype ?? ""),
    );
  if (complete.length === 0) {
    throw new Error("No completed exports are available to merge");
  }

  const fileLabel =
    options.dataset === "other"
      ? "non-contributions"
      : options.dataset === "all"
        ? "all-transactions"
        : "contributions";
  const destination = join(
    options.outputDir,
    `orestar-${fileLabel}-${options.start}_${options.end}.csv`,
  );
  const temporary = `${destination}.tmp`;
  const stream = createWriteStream(temporary, { encoding: "utf8" });
  let canonicalHeaders: string[] | undefined;
  let transactionIdIndex = -1;
  let rowCount = 0;
  const transactionIds = new Set<string>();

  for (const entry of complete) {
    if (!entry.rawFile) {
      throw new Error(`Manifest entry ${entry.key} has no raw file`);
    }
    const absolute = resolve(options.outputDir, entry.rawFile);
    if (!existsSync(absolute)) {
      throw new Error(`Missing raw export: ${absolute}`);
    }
    if (entry.sha256 && sha256(absolute) !== entry.sha256) {
      throw new Error(`Checksum mismatch for ${absolute}`);
    }
    const parsed = spreadsheetRows(absolute);
    if (parsed.rows.length !== entry.count) {
      throw new Error(
        `${basename(absolute)} contains ${parsed.rows.length} rows; manifest expects ${entry.count}`,
      );
    }
    if (!canonicalHeaders) {
      canonicalHeaders = parsed.headers;
      transactionIdIndex = parsed.transactionIdIndex;
      stream.write(csvRow([...canonicalHeaders, "Transaction Type"]));
    } else if (JSON.stringify(parsed.headers) !== JSON.stringify(canonicalHeaders)) {
      throw new Error(`Export schema changed in ${absolute}`);
    }

    for (const row of parsed.rows) {
      const transactionId = row[transactionIdIndex]?.trim();
      if (!transactionId) {
        throw new Error(`Blank transaction ID in ${absolute}`);
      }
      if (transactionIds.has(transactionId)) {
        throw new Error(`Duplicate transaction ID ${transactionId} across export slices`);
      }
      transactionIds.add(transactionId);
      const transactionTypeName =
        entry.transactionTypeName ??
        options.transactionTypes.find(
          (transactionType) => transactionType.code === (entry.transactionType ?? "C"),
        )?.name ??
        "Contribution";
      if (!stream.write(csvRow([...row, transactionTypeName]))) {
        await once(stream, "drain");
      }
      rowCount += 1;
    }
  }

  stream.end();
  await once(stream, "finish");
  renameSync(temporary, destination);
  return { path: destination, rows: rowCount, sha256: sha256(destination) };
}

async function launchBrowser(options: Options): Promise<BrowserContext> {
  const profileDir = join(options.outputDir, ".browser-profile");
  mkdirSync(profileDir, { recursive: true });
  return chromium.launchPersistentContext(profileDir, {
    channel: "chrome",
    headless: options.headless,
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
  });
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  mkdirSync(options.outputDir, { recursive: true });
  const rawDir = join(options.outputDir, "raw");
  mkdirSync(rawDir, { recursive: true });
  const manifestPath = join(options.outputDir, "manifest.json");
  const metadataPath = join(options.outputDir, "metadata.json");
  const lockPath = join(options.outputDir, ".download.lock");
  eventLogPath = join(options.outputDir, "events.ndjson");
  const manifest = loadManifest(manifestPath, options);

  if (options.mergeOnly) {
    const merged = await mergeExports(options, manifest);
    writeFileSync(
      metadataPath,
      `${JSON.stringify(
        {
          ...manifest.filter,
          sourceUrl: SEARCH_URL,
          exportLimit: EXPORT_LIMIT,
          generatedAt: new Date().toISOString(),
          initialTotal: manifest.initialTotal,
          finalTotal: manifest.finalTotal,
          initialTotalsByType: manifest.initialTotalsByType,
          finalTotalsByType: manifest.finalTotalsByType,
          mergedRows: merged.rows,
          csv: relative(options.outputDir, merged.path),
          sha256: merged.sha256,
        },
        null,
        2,
      )}\n`,
    );
    console.log(`Merged ${merged.rows.toLocaleString()} rows into ${merged.path}`);
    return;
  }

  try {
    writeFileSync(lockPath, `${process.pid}\n`, { flag: "wx" });
  } catch {
    throw new Error(`Another downloader may be using ${options.outputDir} (${lockPath} exists)`);
  }

  let context: BrowserContext | undefined;
  try {
    context = await launchBrowser(options);
    const pages = context.pages();
    const page = pages[0] ?? (await context.newPage());
    for (const extraPage of pages.slice(1)) {
      await extraPage.close();
    }

    console.log(
      `Checking ${options.dataset} transactions from ${options.start} through ${options.end}...`,
    );
    manifest.initialTotalsByType = {};
    for (const transactionType of options.transactionTypes) {
      const count = await search(
        page,
        {
          start: options.start,
          end: options.end,
          transactionType: transactionType.code,
          transactionTypeName: transactionType.name,
        },
        options.delayMs,
      );
      manifest.initialTotalsByType[transactionType.code] = count;
      console.log(`${transactionType.name}: ${count.toLocaleString()} records.`);
    }
    manifest.initialTotal = Object.values(manifest.initialTotalsByType).reduce(
      (sum, count) => sum + count,
      0,
    );
    saveManifest(manifestPath, manifest);
    console.log(
      `ORESTAR currently reports ${manifest.initialTotal.toLocaleString()} selected records.`,
    );

    const legacyRoots = manifestRoots(manifest);
    manifest.roots = legacyRoots.length ? legacyRoots : options.transactionTypes.flatMap((transactionType) => {
      const sliceDays = adaptiveSliceDays(
        options.start,
        options.end,
        manifest.initialTotalsByType?.[transactionType.code] ?? 0,
        options.sliceDays,
      );
      console.log(`${transactionType.name}: initial window size ${sliceDays} day(s).`);
      return buildDateSlices(options.start, options.end, sliceDays).map((slice) => ({
          ...slice,
          transactionType: transactionType.code,
          transactionTypeName: transactionType.name,
        }));
    });
    saveManifest(manifestPath, manifest);
    const queue = [...manifest.roots];
    const runFailures = new Map<string, number>();
    while (queue.length > 0) {
      const slice = queue.shift()!;
      const key = sliceKey(slice);
      const existing = manifest.entries[key];

      if (!options.refresh && existing?.status === "split" && existing.children) {
        queue.unshift(...existing.children);
        continue;
      }
      if (
        !options.refresh &&
        existing &&
        ["complete", "empty"].includes(existing.status) &&
        (!existing.rawFile || (existsSync(resolve(options.outputDir, existing.rawFile)) && existing.sha256 === sha256(resolve(options.outputDir, existing.rawFile))))
      ) {
        console.log(`Skipping verified slice ${key} (${existing.count.toLocaleString()} rows).`);
        continue;
      }

      try {
        const count = await search(page, slice, options.delayMs);
        console.log(`${key}: ${count.toLocaleString()} records`);

        if (count > EXPORT_LIMIT) {
          let children: Slice[];
          if (slice.start !== slice.end) {
            children = splitDateSlice(slice);
          } else if (!slice.subtype) {
            const subtypes = await transactionSubtypes(page, slice);
            children = subtypes.map((subtype) => ({
              ...slice,
              subtype: subtype.value,
              subtypeName: subtype.name,
            }));
          } else {
            throw new Error(
              `${key} still has ${count.toLocaleString()} rows after date and subtype partitioning; refusing to truncate`,
            );
          }
          manifest.entries[key] = {
            ...slice,
            key,
            status: "split",
            count,
            children,
            retrievedAt: new Date().toISOString(),
          };
          saveManifest(manifestPath, manifest);
          queue.unshift(...children);
          continue;
        }

        if (count === 0) {
          manifest.entries[key] = {
            ...slice,
            key,
            status: "empty",
            count,
            retrievedAt: new Date().toISOString(),
          };
          saveManifest(manifestPath, manifest);
          continue;
        }

        const exported = await downloadExport(page, slice, count, rawDir, options.delayMs);
        manifest.entries[key] = {
          ...slice,
          key,
          status: "complete",
          count,
          rawFile: relative(options.outputDir, exported.path),
          sha256: exported.hash,
          retrievedAt: new Date().toISOString(),
        };
        saveManifest(manifestPath, manifest);
      } catch (error) {
        const failureRound = (runFailures.get(key) ?? 0) + 1;
        runFailures.set(key, failureRound);
        manifest.entries[key] = {
          ...slice,
          key,
          status: "failed",
          count: existing?.count ?? 0,
          error: conciseError(error),
          failureCount: (existing?.failureCount ?? 0) + 1,
          retrievedAt: new Date().toISOString(),
        };
        saveManifest(manifestPath, manifest);
        logEvent({
          type: "slice_failure",
          key,
          failureRound,
          maxFailureRounds: options.failureRounds,
          error: conciseError(error),
        });
        if (failureRound < options.failureRounds) {
          console.warn(
            `${key}: queued for failure round ${failureRound + 1}/${options.failureRounds}; continuing with other slices.`,
          );
          queue.push(slice);
          continue;
        }
        throw new Error(
          `${key} failed in ${options.failureRounds} slice rounds. Progress and the last error are saved in ${manifestPath}. ` +
            `Last error: ${conciseError(error)}`,
        );
      }
    }

    console.log("Rechecking full-range counts before merging...");
    manifest.finalTotalsByType = {};
    for (const transactionType of options.transactionTypes) {
      const count = await search(
        page,
        {
          start: options.start,
          end: options.end,
          transactionType: transactionType.code,
          transactionTypeName: transactionType.name,
        },
        options.delayMs,
      );
      manifest.finalTotalsByType[transactionType.code] = count;
    }
    manifest.finalTotal = Object.values(manifest.finalTotalsByType).reduce(
      (sum, count) => sum + count,
      0,
    );
    saveManifest(manifestPath, manifest);

    const merged = await mergeExports(options, manifest);
    if (merged.rows !== manifest.finalTotal) {
      throw new Error(
        `Merged ${merged.rows.toLocaleString()} unique rows, but ORESTAR now reports ${manifest.finalTotal.toLocaleString()}. ` +
          `The live data changed during retrieval or a slice needs refreshing; rerun with --refresh.`,
      );
    }

    const metadata = {
      ...manifest.filter,
      sourceUrl: SEARCH_URL,
      exportLimit: EXPORT_LIMIT,
      generatedAt: new Date().toISOString(),
      initialTotal: manifest.initialTotal,
      finalTotal: manifest.finalTotal,
      initialTotalsByType: manifest.initialTotalsByType,
      finalTotalsByType: manifest.finalTotalsByType,
      mergedRows: merged.rows,
      csv: relative(options.outputDir, merged.path),
      sha256: merged.sha256,
      note:
        "Current public transaction records for the selected transaction families. Deleted and expired transaction versions are excluded to avoid double-counting amendments.",
    };
    writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
    logEvent({
      type: "run_complete",
      startDate: options.start,
      endDate: options.end,
      rows: merged.rows,
      sha256: merged.sha256,
    });
    console.log(`Complete: ${merged.rows.toLocaleString()} rows -> ${merged.path}`);
    console.log(`SHA-256: ${merged.sha256}`);
  } finally {
    await context?.close().catch(() => undefined);
    if (existsSync(lockPath)) {
      unlinkSync(lockPath);
    }
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === resolve(new URL(import.meta.url).pathname)) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  });
}
