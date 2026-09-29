import { createHash } from "node:crypto";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { once } from "node:events";
import { basename, join, relative, resolve } from "node:path";

type Options = {
  start: string;
  end: string;
  contributions: string;
  other: string;
  outputDir: string;
};

type Entity = {
  key: string;
  orestarId: string;
  roles: Set<string>;
  kinds: Map<string, number>;
  names: Map<string, number>;
  addresses: Map<string, number>;
  occupations: Map<string, number>;
  employers: Map<string, number>;
  firstDate?: string;
  lastDate?: string;
  filerTransactions: number;
  filerAmount: number;
  counterpartyTransactions: number;
  counterpartyAmount: number;
};

type Counts = {
  contributions: number;
  other: number;
  transactions: number;
};

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
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") {
      console.log(`Build normalized ORESTAR entity and activity indexes.

Options:
  --start YYYY-MM-DD       Start date (default: 2025-01-01)
  --end YYYY-MM-DD         End date (default: today)
  --contributions FILE     Contribution CSV
  --other FILE             Non-contribution CSV
  --output DIR             Output directory`);
      process.exit(0);
    }
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${argument}`);
    }
    values.set(argument, value);
    index += 1;
  }

  const start = values.get("--start") ?? "2025-01-01";
  const end = values.get("--end") ?? localToday();
  const contributions = resolve(
    values.get("--contributions") ??
      join(
        "runtime-data",
        "orestar",
        `contributions-${start}_${end}`,
        `orestar-contributions-${start}_${end}.csv`,
      ),
  );
  const other = resolve(
    values.get("--other") ??
      join(
        "runtime-data",
        "orestar",
        `non-contributions-${start}_${end}`,
        `orestar-non-contributions-${start}_${end}.csv`,
      ),
  );
  const outputDir = resolve(
    values.get("--output") ??
      join("runtime-data", "orestar", `entity-index-${start}_${end}`),
  );
  return { start, end, contributions, other, outputDir };
}

function* parseCsv(text: string): Generator<string[]> {
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
      continue;
    }
    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
      yield row;
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (inQuotes) {
    throw new Error("CSV ended inside a quoted field");
  }
  if (field || row.length > 0) {
    row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
    yield row;
  }
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvRow(values: Array<string | number>): string {
  return `${values.map(csvCell).join(",")}\n`;
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalized(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/\s+/g, " ");
}

function fingerprint(parts: string[]): string {
  return createHash("sha256")
    .update(parts.map(normalized).join("\u001f"))
    .digest("hex")
    .slice(0, 24);
}

function increment(map: Map<string, number>, value: string): void {
  const clean = value.trim();
  if (clean) map.set(clean, (map.get(clean) ?? 0) + 1);
}

function rankedValues(map: Map<string, number>): string[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value);
}

function entity(map: Map<string, Entity>, key: string, orestarId = ""): Entity {
  let existing = map.get(key);
  if (!existing) {
    existing = {
      key,
      orestarId,
      roles: new Set(),
      kinds: new Map(),
      names: new Map(),
      addresses: new Map(),
      occupations: new Map(),
      employers: new Map(),
      filerTransactions: 0,
      filerAmount: 0,
      counterpartyTransactions: 0,
      counterpartyAmount: 0,
    };
    map.set(key, existing);
  }
  return existing;
}

function isoDate(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : value;
}

function numberValue(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const negative = trimmed.startsWith("(") && trimmed.endsWith(")");
  const numeric = Number(trimmed.replace(/[$,()]/g, ""));
  if (!Number.isFinite(numeric)) {
    throw new Error(`Invalid amount: ${value}`);
  }
  return negative ? -numeric : numeric;
}

function updateDate(entityValue: Entity, date: string): void {
  if (!date) return;
  if (!entityValue.firstDate || date < entityValue.firstDate) {
    entityValue.firstDate = date;
  }
  if (!entityValue.lastDate || date > entityValue.lastDate) {
    entityValue.lastDate = date;
  }
}

function direction(
  family: string,
  filerKey: string,
  counterpartyKey: string,
): { relation: string; source: string; target: string } {
  if (["Contribution", "Other Receipt", "Other Account Receivable"].includes(family)) {
    return {
      relation:
        family === "Contribution"
          ? "contributed_to"
          : family === "Other Receipt"
            ? "receipt_to"
            : "receivable_owed_to",
      source: counterpartyKey,
      target: filerKey,
    };
  }
  if (["Expenditure", "Other Disbursement"].includes(family)) {
    return {
      relation: family === "Expenditure" ? "paid" : "disbursed_to",
      source: filerKey,
      target: counterpartyKey,
    };
  }
  return { relation: "other_adjustment", source: filerKey, target: counterpartyKey };
}

async function processCsv(
  path: string,
  fallbackFamily: string,
  activityStream: ReturnType<typeof createWriteStream>,
  entities: Map<string, Entity>,
  transactionIds: Set<string>,
): Promise<number> {
  const iterator = parseCsv(readFileSync(path, "utf8"));
  const first = iterator.next();
  if (first.done) throw new Error(`CSV is empty: ${path}`);
  const headers = first.value.map((header) => header.replace(/^\uFEFF/, "").trim());
  const index = (name: string, required = true): number => {
    const found = headers.indexOf(name);
    if (found < 0 && required) throw new Error(`Missing ${name} in ${path}`);
    return found;
  };
  const positions = {
    transactionId: index("Tran Id"),
    originalId: index("Original Id"),
    date: index("Tran Date"),
    status: index("Tran Status"),
    filer: index("Filer"),
    counterparty: index("Contributor/Payee"),
    subtype: index("Sub Type"),
    amount: index("Amount"),
    counterpartyCommitteeId: index("Contributor/Payee Committee ID"),
    filerId: index("Filer Id"),
    purposeDescription: index("Purp Desc"),
    bookType: index("Book Type"),
    occupation: index("Occptn Txt"),
    employer: index("Emp Name"),
    address1: index("Addr Line1"),
    address2: index("Addr Line2"),
    city: index("City"),
    state: index("State"),
    zip: index("Zip"),
    country: index("Country"),
    purposeCodes: index("Purpose Codes"),
    transactionType: index("Transaction Type", false),
  };

  let count = 0;
  for (const row of iterator) {
    if (row.every((value) => !value.trim())) continue;
    const transactionId = row[positions.transactionId]?.trim();
    if (!transactionId) throw new Error(`Blank transaction ID in ${path}`);
    if (transactionIds.has(transactionId)) {
      throw new Error(`Duplicate transaction ID ${transactionId} across datasets`);
    }
    transactionIds.add(transactionId);

    const family =
      (positions.transactionType >= 0 ? row[positions.transactionType]?.trim() : "") ||
      fallbackFamily;
    const date = isoDate(row[positions.date] ?? "");
    const amountText = row[positions.amount] ?? "";
    const amount = numberValue(amountText);
    const filerId = row[positions.filerId]?.trim();
    const filerName = row[positions.filer]?.trim();
    const filerKey = filerId
      ? `committee:${filerId}`
      : `filer:${fingerprint([filerName])}`;
    const filerEntity = entity(entities, filerKey, filerId);
    filerEntity.roles.add("filer");
    increment(filerEntity.kinds, "ORESTAR filer/committee");
    increment(filerEntity.names, filerName);
    updateDate(filerEntity, date);
    filerEntity.filerTransactions += 1;
    filerEntity.filerAmount += amount;

    const counterpartyId = row[positions.counterpartyCommitteeId]?.trim();
    const counterpartyName = row[positions.counterparty]?.trim();
    const address = [
      row[positions.address1],
      row[positions.address2],
      row[positions.city],
      row[positions.state],
      row[positions.zip],
      row[positions.country],
    ]
      .map((value) => value?.trim() ?? "")
      .filter(Boolean)
      .join(", ");
    const bookType = row[positions.bookType]?.trim() ?? "";
    const counterpartyKey =
      counterpartyId || counterpartyName
        ? counterpartyId
          ? `committee:${counterpartyId}`
          : `party:${fingerprint([counterpartyName, bookType, address])}`
        : "";
    if (counterpartyKey) {
      const counterpartyEntity = entity(entities, counterpartyKey, counterpartyId);
      counterpartyEntity.roles.add("counterparty");
      increment(counterpartyEntity.kinds, bookType || "Unclassified counterparty");
      increment(counterpartyEntity.names, counterpartyName);
      increment(counterpartyEntity.addresses, address);
      increment(counterpartyEntity.occupations, row[positions.occupation] ?? "");
      increment(counterpartyEntity.employers, row[positions.employer] ?? "");
      updateDate(counterpartyEntity, date);
      counterpartyEntity.counterpartyTransactions += 1;
      counterpartyEntity.counterpartyAmount += amount;
    }

    const edge = direction(family, filerKey, counterpartyKey);
    if (
      !activityStream.write(
        csvRow([
          transactionId,
          row[positions.originalId] ?? "",
          date,
          row[positions.status] ?? "",
          family,
          row[positions.subtype] ?? "",
          edge.relation,
          edge.source,
          edge.target,
          filerKey,
          counterpartyKey,
          amountText,
          row[positions.purposeCodes] ?? "",
          row[positions.purposeDescription] ?? "",
        ]),
      )
    ) {
      await once(activityStream, "drain");
    }
    count += 1;
  }
  return count;
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  for (const input of [options.contributions, options.other]) {
    if (!existsSync(input)) throw new Error(`Missing input: ${input}`);
  }
  mkdirSync(options.outputDir, { recursive: true });
  const activityPath = join(
    options.outputDir,
    `orestar-activity-${options.start}_${options.end}.csv`,
  );
  const activityTemporary = `${activityPath}.tmp`;
  const activityStream = createWriteStream(activityTemporary, { encoding: "utf8" });
  activityStream.write(
    csvRow([
      "Tran Id",
      "Original Id",
      "Tran Date",
      "Tran Status",
      "Transaction Type",
      "Sub Type",
      "Relationship",
      "Source Entity Key",
      "Target Entity Key",
      "Filer Entity Key",
      "Counterparty Entity Key",
      "Amount",
      "Purpose Codes",
      "Purpose Description",
    ]),
  );

  const entities = new Map<string, Entity>();
  const transactionIds = new Set<string>();
  const counts: Counts = { contributions: 0, other: 0, transactions: 0 };
  counts.contributions = await processCsv(
    options.contributions,
    "Contribution",
    activityStream,
    entities,
    transactionIds,
  );
  counts.other = await processCsv(
    options.other,
    "",
    activityStream,
    entities,
    transactionIds,
  );
  counts.transactions = counts.contributions + counts.other;
  activityStream.end();
  await once(activityStream, "finish");
  renameSync(activityTemporary, activityPath);

  const entitiesPath = join(
    options.outputDir,
    `orestar-entities-${options.start}_${options.end}.csv`,
  );
  const entitiesTemporary = `${entitiesPath}.tmp`;
  const entitiesStream = createWriteStream(entitiesTemporary, { encoding: "utf8" });
  entitiesStream.write(
    csvRow([
      "Entity Key",
      "ORESTAR ID",
      "Roles",
      "Primary Kind",
      "Primary Name",
      "Name Aliases",
      "Primary Address",
      "Address Variants",
      "Occupations",
      "Employers",
      "First Activity Date",
      "Last Activity Date",
      "Transactions as Filer",
      "Amount as Filer",
      "Transactions as Counterparty",
      "Amount as Counterparty",
    ]),
  );
  for (const item of [...entities.values()].sort((a, b) => a.key.localeCompare(b.key))) {
    const names = rankedValues(item.names);
    const kinds = rankedValues(item.kinds);
    const addresses = rankedValues(item.addresses);
    if (
      !entitiesStream.write(
        csvRow([
          item.key,
          item.orestarId,
          [...item.roles].sort().join(" | "),
          kinds[0] ?? "",
          names[0] ?? "",
          names.slice(1).join(" | "),
          addresses[0] ?? "",
          addresses.slice(1).join(" | "),
          rankedValues(item.occupations).join(" | "),
          rankedValues(item.employers).join(" | "),
          item.firstDate ?? "",
          item.lastDate ?? "",
          item.filerTransactions,
          item.filerAmount.toFixed(2),
          item.counterpartyTransactions,
          item.counterpartyAmount.toFixed(2),
        ]),
      )
    ) {
      await once(entitiesStream, "drain");
    }
  }
  entitiesStream.end();
  await once(entitiesStream, "finish");
  renameSync(entitiesTemporary, entitiesPath);

  const metadata = {
    generatedAt: new Date().toISOString(),
    startDate: options.start,
    endDate: options.end,
    counts: { ...counts, entities: entities.size },
    inputs: [options.contributions, options.other].map((path) => ({
      file: basename(path),
      sha256: sha256(path),
    })),
    outputs: [entitiesPath, activityPath].map((path) => ({
      file: relative(options.outputDir, path),
      sha256: sha256(path),
    })),
    entityKeyMethod:
      "committee:<ORESTAR ID> when an ID is available; otherwise a SHA-256 fingerprint of normalized name, book type, and public address fields.",
    limitations: [
      "Name-and-address fingerprints are analytical identities, not authoritative person identifiers.",
      "Committee registration profiles, candidates, measures, and officers require separate ORESTAR public-search harvests.",
    ],
  };
  writeFileSync(
    join(options.outputDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );
  console.log(
    `Built ${entities.size.toLocaleString()} entities and ${counts.transactions.toLocaleString()} normalized activities.`,
  );
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
