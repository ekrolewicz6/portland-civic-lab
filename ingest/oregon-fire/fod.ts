import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { randomUUID } from "node:crypto";
import sql from "../../src/lib/db-query";
import {
  registerSources,
  oregonBoundary,
  writeBatch,
  completeRun,
  failRun,
} from "../../src/lib/oregon-fire/ingest";
import type { InputFeature } from "../../src/lib/oregon-fire/normalize";

async function main() {
  const path = "runtime-data/oregon-fire/";
  const manifest = JSON.parse(
    await readFile(path + "fod-manifest.json", "utf8"),
  );
  if (
    manifest.edition !== 7 ||
    manifest.sha256 !==
      "a5d691bdbcf5a3de6a7e0d94380df311dd2c552645395312e55510424a7483fb"
  )
    throw new Error("Expected verified FOD seventh edition");
  await registerSources();
  const boundary = await oregonBoundary(),
    id = randomUUID();
  await sql`INSERT INTO fire.import_runs(id,source_id,status) VALUES(${id},'fod','running')`;
  let count = 0,
    accepted = 0,
    held = 0,
    batch: InputFeature[] = [];
  try {
    const flush = async () => {
      const c = await writeBatch(id, "fod", batch, boundary);
      accepted += c.accepted;
      held += c.held;
      batch = [];
    };
    for await (const line of createInterface({
      input: createReadStream(path + "fod-oregon.jsonl"),
      crlfDelay: Infinity,
    })) {
      batch.push(JSON.parse(line));
      count++;
      if (batch.length >= 500) await flush();
    }
    if (batch.length) await flush();
    if (count !== manifest.rows) throw new Error("FOD row count mismatch");
    await sql`UPDATE fire.import_runs SET fetched_count=${count},accepted_count=${accepted},held_count=${held} WHERE id=${id}`;
    await completeRun(id, "fod", manifest);
    console.log(JSON.stringify({ source: "fod", count, accepted, held }));
  } catch (e) {
    await failRun(id, "fod", e);
    throw e;
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "FOD import failed");
    process.exit(1);
  });
