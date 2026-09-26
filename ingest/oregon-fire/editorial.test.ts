import { test } from "node:test";
import assert from "node:assert/strict";
import { publishedProjects, projectSchema, documentationCoverage, placeContext } from "../../src/lib/oregon-fire/projects";
import { costObservations } from "../../src/lib/oregon-fire/costs";
import { normalize, prepareFeature, type InputFeature } from "../../src/lib/oregon-fire/normalize";
import { SOURCE_BY_ID } from "../../src/lib/oregon-fire/sources";
import { severityProduct } from "../../src/lib/oregon-fire/assessment-availability";
const feature: InputFeature = { type: "Feature", properties: { IrwinID: "abc", activity_cn: "a", activity_unit_cn: "b", suid: "c" }, geometry: { type: "Point", coordinates: [-122,44] } };
test("unapproved projects and evidence never publish; approved claims require evidence", () => {
  const p = publishedProjects()[0];
  assert.equal(publishedProjects([{ ...p, approved: false }]).length, 0);
  assert.throws(() => projectSchema.parse({ ...p, evidence: p.evidence.map((e) => ({...e,approved:false})) }), /evidence/);
  assert.equal(p.recordIds.length, 0); // Unknown geometry cannot create an inferred record link.
});
test("documentation metrics describe the curated denominator and respond to reviewed evidence", () => {
  const p = publishedProjects()[0];
  assert.deepEqual([documentationCoverage().denominator, documentationCoverage().verifiedGeometry, documentationCoverage().monitoring], [1,0,0]);
  assert.equal(documentationCoverage([{ ...p, documentation: {unitGeometryVerified:true,monitoringReportObtained:true} }]).monitoring, 1);
  assert.equal(placeContext("4115800").projects[0].id,"woodpecker");
  assert.equal(placeContext("4105900").profile,null);
});
test("mechanical activities remain distinct from fire; aggregation pilots remain held", () => {
  const r = normalize(SOURCE_BY_ID["facts-mechanical"], {...feature, properties:{...feature.properties,activity:"Mechanical Thinning",uom:"ACRES",nbr_units_accomplished:10}});
  assert.equal(r.kind,"mechanical"); assert.equal(r.burnedAcres,null); assert.equal(r.treatmentAcres,10);
  const consumed = normalize(SOURCE_BY_ID["facts-mechanical"], {...feature,properties:{...feature.properties,activity:"Planned Treatment Burned in Wildfire"}});
  assert.equal(consumed.kind,"wildfire");
  const boundary = { type:"Feature" as const, properties:{}, geometry:{ type:"Polygon" as const, coordinates:[[[-124,42],[-117,42],[-117,46],[-124,46],[-124,42]]] } };
  const twig = {...feature,properties:{unique_id:"1",identifier_database:"NFPORS",activity:"Prescribed Fire",status:"Completed"}};
  assert.equal(prepareFeature(SOURCE_BY_ID.twig,twig,boundary)?.held,true);
  assert.notEqual(normalize(SOURCE_BY_ID.twig,twig).id,normalize(SOURCE_BY_ID.twig,{...twig,properties:{...twig.properties,identifier_database:"IFPRS"}}).id);
});
test("incident estimates stay cumulative and projected; missing/zero cost is not a fact", () => {
  const r = normalize(SOURCE_BY_ID.wfigs,feature);
  assert.equal(costObservations(r,{}).length,0);
  assert.equal(costObservations(r,{EstimatedCostToDate:0}).length,0);
  const costs=costObservations(r,{EstimatedCostToDate:100,EstimatedFinalCost:500,ICS209ReportDateTime:Date.UTC(2026,8,26)});
  assert.deepEqual(costs.map((c)=>c.status),["estimated-to-date","projected-final"]);
  assert.match(costs[0].flags[0],/do not sum/);
});
test("advertised or test assessments do not become reviewed display products", () => {
  assert.ok(severityProduct(2024)); assert.equal(severityProduct(2026),null);
});
