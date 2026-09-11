/** Private, temporary integration records; always removed in finally.
 * npx tsx --env-file=.env.local ingest/oregon-fire/storage-check.ts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sql from "../../src/lib/db-query";
import { SOURCE_BY_ID } from "../../src/lib/oregon-fire/sources";
import {
  writeBatch,
  completeRun,
  failRun,
  oregonBoundary,
} from "../../src/lib/oregon-fire/ingest";
import type { InputFeature } from "../../src/lib/oregon-fire/normalize";

async function main() {
  const sourceId = `private-storage-check-${randomUUID()}`,
    first = randomUUID(),
    second = randomUUID();
  const source = { ...SOURCE_BY_ID.blm, id: sourceId };
  SOURCE_BY_ID[sourceId] = source;
  await sql`INSERT INTO fire.sources(id,definition) VALUES(${sourceId},${sql.json({ name: "Private integration check" })})`;
  try {
    await sql`INSERT INTO fire.import_runs(id,source_id,status) VALUES(${first},${sourceId},'running')`;
    const boundary = await oregonBoundary();
    const feature: InputFeature = {
      type: "Feature",
      properties: {
        GlobalID: "private-fixture",
        REASON: "Cultural example — PRIVATE TEST",
        TRT_NAME: "Private storage check",
      },
      geometry: { type: "Point", coordinates: [-122, 44] },
    };
    await writeBatch(first, sourceId, [feature], boundary);
    await writeBatch(first, sourceId, [feature], boundary);
    let [row] =
      await sql`SELECT *,jsonb_typeof(data) AS data_type FROM fire.records WHERE run_id=${first}`;
    assert.equal(row.data_type, "object");
    assert.equal(row.public, false);
    const checksum = row.checksum;
    const [{ n }] =
      await sql`SELECT count(*)::int AS n FROM fire.records WHERE run_id=${first}`;
    assert.equal(n, 1);
    const [before] =
      await sql`SELECT active_run FROM fire.sources WHERE id=${sourceId}`;
    assert.equal(before.active_run, null);
    await writeBatch(
      first,
      sourceId,
      [{ ...feature, geometry: { type: "Point", coordinates: [-121, 44] } }],
      boundary,
    );
    [row] = await sql`SELECT * FROM fire.records WHERE run_id=${first}`;
    assert.notEqual(row.checksum, checksum);
    assert.equal(row.west, -121);
    await completeRun(first, sourceId, { test: true });
    const [published] =
      await sql`SELECT s.active_run,s.last_success,i.metadata FROM fire.sources s JOIN fire.import_runs i ON i.id=s.active_run WHERE s.id=${sourceId}`;
    assert.equal(published.active_run, first);
    assert.equal(typeof published.metadata, "object");
    assert.ok(!Array.isArray(published.metadata));
    assert.equal(published.metadata.test, true);
    await sql`INSERT INTO fire.import_runs(id,source_id,status) VALUES(${second},${sourceId},'running')`;
    await writeBatch(second, sourceId, [feature], boundary);
    await failRun(
      second,
      sourceId,
      new Error("Intentional partial-download failure"),
    );
    const [retained] =
      await sql`SELECT active_run,last_success,last_error FROM fire.sources WHERE id=${sourceId}`;
    assert.equal(retained.active_run, first);
    assert.deepEqual(retained.last_success, published.last_success);
    assert.match(retained.last_error, /partial-download/);
    console.log(
      "Storage checks passed: repeat import, changed geometry, JSON types, private holds, atomic publication and failure retention.",
    );
  } finally {
    await sql`DELETE FROM fire.rejections WHERE run_id IN (${first},${second})`;
    await sql`DELETE FROM fire.records WHERE source_id=${sourceId}`;
    await sql`DELETE FROM fire.import_runs WHERE source_id=${sourceId}`;
    await sql`DELETE FROM fire.sources WHERE id=${sourceId}`;
    delete SOURCE_BY_ID[sourceId];
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Storage check failed");
    process.exit(1);
  });
