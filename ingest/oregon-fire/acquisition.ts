/** Public endpoint evidence and bounded reconciliation samples. No messages sent.
 * npx tsx ingest/oregon-fire/acquisition.ts
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { FIRE_SOURCES } from "../../src/lib/oregon-fire/sources";
import { getJson, type LayerMetadata } from "../../src/lib/oregon-fire/arcgis";
const root = "research/oregon-fire-map-2026-09-10";
async function main() {
  const registry = JSON.parse(await readFile(`${root}/endpoint-registry-2026-09-26.json`,"utf8"));
  const results: Record<string,unknown>[] = [];
  await mkdir("runtime-data/oregon-fire/reconciliation", {recursive:true});
  const pending = FIRE_SOURCES.filter((s) => s.endpoint);
  async function worker() {
    for (;;) {
      const s = pending.shift(); if (!s) return;
      const endpoint = s.endpoint!; const queriedAt = new Date().toISOString();
      try {
        const meta = await getJson<LayerMetadata>(endpoint,{f:"json"});
        const oid = meta.objectIdField ?? meta.objectIdFieldName ?? meta.fields.find((f)=>f.type==="esriFieldTypeOID")?.name;
        if (!oid) throw new Error("No object ID field");
        const fields = (s.fields ?? [oid]).filter((name)=>meta.fields.some((f)=>f.name===name));
        const parameters = { f:"json", where:s.where ?? "1=1", outFields:fields.join(","), returnGeometry:"false", resultRecordCount:s.publication==="reconciliation" ? "100" : "2", orderByFields:oid };
        const sample = await getJson<{features:{attributes:Record<string,unknown>}[];exceededTransferLimit?:boolean}>(`${endpoint}/query`,parameters);
        if (!Array.isArray(sample.features)) throw new Error("Invalid sample response");
        const checksum = createHash("sha256").update(JSON.stringify(sample)).digest("hex");
        const result = {sourceId:s.id,endpoint,queriedAt,stage:"sample-queried",query:parameters,metadataChecksum:createHash("sha256").update(JSON.stringify(meta)).digest("hex"),sampleChecksum:checksum,sampleRows:sample.features.length,exceededTransferLimit:sample.exceededTransferLimit ?? false,fields:meta.fields.map((f)=>f.name),publication:s.publication ?? "public",limitations:"Bounded sample is not a complete source import or statewide total."};
        results.push(result);
        if (s.publication==="reconciliation") await writeFile(`runtime-data/oregon-fire/reconciliation/${s.id}-sample.json`,JSON.stringify({ ...result, sample },null,2));
        const entry=registry.sources.find((e:{url:string})=>e.url===endpoint); if(entry) Object.assign(entry,{stage:"sample-queried",verificationEvidence:result});
        console.log(JSON.stringify({source:s.id,sampleRows:sample.features.length,stage:"sample-queried"}));
      } catch (error) { results.push({sourceId:s.id,endpoint,queriedAt,stage:"access-failed",error:error instanceof Error ? error.message : "Query failed"}); console.log(JSON.stringify({source:s.id,stage:"access-failed"})); }
    }
  }
  await Promise.all([worker(),worker(),worker()]);
  await writeFile(`${root}/evidence-2026-09-26/endpoint-probes.json`,JSON.stringify(results,null,2)+"\n");
  await writeFile(`${root}/endpoint-registry-2026-09-26.json`,JSON.stringify(registry,null,2)+"\n");
}
main().catch((e)=>{console.error(e instanceof Error ? e.message : "Acquisition failed");process.exitCode=1;});
