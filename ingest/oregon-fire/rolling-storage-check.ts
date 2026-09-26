/** Integration assertions run entirely inside a rolled-back transaction. */
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createDedicatedClient} from '../../src/lib/db-query';
(async()=>{const db=createDedicatedClient();const rollback=new Error('rollback-only probe');try{await db.begin(async connection=>{const tx=connection as unknown as typeof db;const run=randomUUID(),empty=randomUUID(),id='pnw:lookup-probe-'+run;
await tx`INSERT INTO fire.import_runs(id,source_id,status,completed_at) VALUES(${run},'pnw','complete',now()),(${empty},'pnw','complete',now())`;
await tx`INSERT INTO fire.records(run_id,id,source_id,native_id,data,attributes,geometry,map_geometry,checksum,west,east,south,north,public) VALUES(${run},${id},'pnw','probe','{}'::jsonb,'{}'::jsonb,'{}'::jsonb,'{}'::jsonb,'probe',-123,-122,44,45,false)`;
await tx`UPDATE fire.sources SET active_run=${run} WHERE id='pnw'`;
assert.equal((await tx`SELECT run_id FROM fire.rolling_latest WHERE record_id=${id}`)[0].run_id,run);
await tx`UPDATE fire.sources SET active_run=${empty} WHERE id='pnw'`;
assert.equal((await tx`SELECT run_id FROM fire.rolling_latest WHERE record_id=${id}`)[0].run_id,run);
throw rollback;});}catch(e){if(e!==rollback)throw e;}assert.equal((await db`SELECT record_id FROM fire.rolling_latest WHERE record_id LIKE 'pnw:lookup-probe-%'`).length,0);await db.end();console.log('Rolling lookup trigger passed publication, valid-empty retention and rollback-only cleanup');})();
