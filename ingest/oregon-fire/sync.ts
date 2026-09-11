/** Source downloads are inputs; snapshots live in Postgres, never Git.
 * npx tsx --env-file=.env.local ingest/oregon-fire/sync.ts [--source blm] [--force]
 */
import { registerSources, syncSource } from "../../src/lib/oregon-fire/ingest";
import { FIRE_SOURCES } from "../../src/lib/oregon-fire/sources";

async function main() {
  await registerSources();
  const args = process.argv.slice(2),
    ids = args.flatMap((a, i) => (a === "--source" ? [args[i + 1]] : []));
  const sources = FIRE_SOURCES.filter(
    (s) => s.endpoint && (!ids.length || ids.includes(s.id)),
  );
  if (!sources.length) throw new Error("No matching source");
  for (const source of sources) {
    let result = await syncSource(source.id, 180000, args.includes("--force"));
    console.log(JSON.stringify(result));
    while (result.status === "running") {
      result = await syncSource(source.id, 180000);
      console.log(JSON.stringify(result));
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : "Import failed");
    process.exit(1);
  });
