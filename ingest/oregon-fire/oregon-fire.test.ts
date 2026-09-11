import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { Feature, Polygon } from "geojson";
import {
  normalize,
  prepareFeature,
  type InputFeature,
} from "../../src/lib/oregon-fire/normalize";
import {
  fetchFeatures,
  getJson,
  inspectLayer,
  type LayerMetadata,
} from "../../src/lib/oregon-fire/arcgis";
import { SOURCE_BY_ID } from "../../src/lib/oregon-fire/sources";
import { csvCell, filterSchema } from "../../src/lib/oregon-fire/query";

const boundary: Feature<Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-124, 42],
        [-117, 42],
        [-117, 46],
        [-124, 46],
        [-124, 42],
      ],
    ],
  },
};
const point: InputFeature = {
  type: "Feature",
  properties: { GlobalID: "unit-1" },
  geometry: { type: "Point", coordinates: [-122, 44] },
};
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("wildfire-consumed treatments never become prescribed accomplishments", () => {
  const r = normalize(SOURCE_BY_ID.facts, {
    ...point,
    properties: {
      activity_cn: "1",
      activity_unit_cn: "2",
      suid: "3",
      activity: "Planned Treatment Burned in Wildfire",
      fiscal_year_completed: 2021,
      uom: "ACRES",
      nbr_units_accomplished: 90,
    },
  });
  assert.equal(r.kind, "wildfire");
  assert.equal(r.recordKind, "treatment");
  assert.equal(r.burnedAcres, null);
  assert.equal(r.treatmentAcres, 90);
  assert.equal(r.datePrecision, "year");
});
test("PNW in-progress status does not establish an ignition", () => {
  const r = normalize(SOURCE_BY_ID.pnw, {
    ...point,
    properties: { GlobalID: "1", BURN_STATUS: 3 },
  });
  assert.equal(r.kind, "planned");
  assert.match(r.status, /uncertain/);
  assert.equal(
    normalize(SOURCE_BY_ID.pnw, {
      ...point,
      properties: { GlobalID: "1", BURN_STATUS: 5 },
    }).kind,
    "prescribed",
  );
});
test("BLM date precision and repeated treatment identifiers survive normalization", () => {
  const a = {
    TRT_GUID: "shared-project",
    GlobalID: "treatment-a",
    TRT_DATE: Date.UTC(2020, 0, 1),
    TRT_DATE_ACC: "Year",
    PLANID: "Unknown",
    TRT_ACRES: 42,
  };
  const r = normalize(SOURCE_BY_ID.blm, { ...point, properties: a });
  assert.equal(r.datePrecision, "year");
  assert.equal(r.year, 2020);
  assert.deepEqual(r.documentIds, []);
  assert.equal(r.burnedAcres, null);
  assert.notEqual(
    r.id,
    normalize(SOURCE_BY_ID.blm, {
      ...point,
      properties: { ...a, GlobalID: "treatment-b" },
    }).id,
  );
  assert.match(r.geometryMeaning, /not a burn boundary/);
});
test("multiple ignitions remain separate and missing identifiers fail", () => {
  const properties = {
    DistrictName: "Test district",
    RegistrationNumber: "R1",
    BurnType: "Pile",
    ActualIgnitionTime: Date.UTC(2025, 2, 1),
  };
  const first = normalize(SOURCE_BY_ID["odf-3"], { ...point, properties });
  const second = normalize(SOURCE_BY_ID["odf-3"], {
    ...point,
    properties: { ...properties, ActualIgnitionTime: Date.UTC(2025, 2, 2) },
  });
  assert.notEqual(first.id, second.id);
  assert.throws(
    () => normalize(SOURCE_BY_ID.blm, { ...point, properties: {} }),
    /identifier/,
  );
});
test("Oregon intersection excludes Washington-only geometry and preserves crossing polygons", () => {
  assert.equal(
    prepareFeature(
      SOURCE_BY_ID.blm,
      { ...point, geometry: { type: "Point", coordinates: [-122, 47] } },
      boundary,
    ),
    null,
  );
  const crossing: InputFeature = {
    ...point,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-123, 45.9],
          [-122, 45.9],
          [-122, 46.1],
          [-123, 46.1],
          [-123, 45.9],
        ],
      ],
    },
  };
  assert.ok(prepareFeature(SOURCE_BY_ID.blm, crossing, boundary));
  assert.throws(
    () =>
      prepareFeature(
        SOURCE_BY_ID.blm,
        {
          ...point,
          geometry: { type: "Point", coordinates: [500000, 450000] },
        },
        boundary,
      ),
    /WGS84/,
  );
});
test("identified cultural prescribed burns are held for review", () => {
  assert.equal(
    prepareFeature(
      SOURCE_BY_ID.blm,
      {
        ...point,
        properties: { GlobalID: "1", REASON: "Cultural restoration" },
      },
      boundary,
    )?.held,
    true,
  );
});
test("year-only records and missing dates do not invent precise dates", () => {
  const r = normalize(SOURCE_BY_ID["explorer-0"], {
    ...point,
    properties: { GlobalID: "1", fire_year: 1990 },
  });
  assert.equal(r.year, 1990);
  assert.equal(r.date, null);
  assert.equal(r.datePrecision, "year");
  assert.equal(normalize(SOURCE_BY_ID.blm, point).datePrecision, "unknown");
});
test("source placeholder years are retained without entering the timeline", () => {
  const r = normalize(SOURCE_BY_ID.blm, {
    ...point,
    properties: { GlobalID: "1", TRT_FY: 8888 },
  });
  assert.equal(r.reportedYear, 8888);
  assert.equal(r.year, null);
  assert.equal(r.date, null);
  assert.match(r.dateNote!, /unverified/);
});
test("query validation and CSV export prevent invalid bounds and formula execution", () => {
  assert.equal(
    filterSchema.safeParse({ bbox: "-120,45,-123,46" }).success,
    false,
  );
  assert.equal(filterSchema.safeParse({ from: 2026, to: 2021 }).success, false);
  assert.equal(filterSchema.parse({}).from, 2021);
  assert.equal(csvCell('=HYPERLINK("bad")'), '"\'=HYPERLINK(""bad"")"');
});
test("ArcGIS HTTP-200 errors cannot masquerade as valid empty feeds", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ error: { code: 400, message: "Unavailable" } }),
    );
  await assert.rejects(getJson("https://example.test/query"), /ArcGIS 400/);
});
test("valid empty ID inventory remains successful, truncated inventories fail", async () => {
  const meta = {
    objectIdField: "OBJECTID",
    fields: [{ name: "OBJECTID", type: "esriFieldTypeOID" }],
  };
  globalThis.fetch = async (u) =>
    new Response(
      JSON.stringify(String(u).includes("/query") ? { objectIds: null } : meta),
    );
  assert.deepEqual((await inspectLayer(SOURCE_BY_ID.blm)).ids, []);
  globalThis.fetch = async (u) =>
    new Response(
      JSON.stringify(
        String(u).includes("/query")
          ? { objectIds: [1], exceededTransferLimit: true }
          : meta,
      ),
    );
  await assert.rejects(
    inspectLayer(SOURCE_BY_ID.blm),
    /truncated ID inventory/,
  );
});
test("pagination splits transfer-limited responses and drops private attributes", async () => {
  const meta: LayerMetadata = {
    fields: [
      { name: "OBJECTID", type: "esriFieldTypeOID" },
      { name: "GlobalID", type: "esriFieldTypeGlobalID" },
      { name: "FirstName", type: "esriFieldTypeString" },
    ],
  };
  const requested: number[][] = [];
  globalThis.fetch = async (u) => {
    const url = new URL(String(u)),
      ids = url.searchParams.get("objectIds")!.split(",").map(Number);
    requested.push(ids);
    assert.equal(url.searchParams.get("outSR"), "4326");
    assert.ok(!url.searchParams.get("outFields")!.includes("FirstName"));
    return new Response(
      JSON.stringify({
        exceededTransferLimit: ids.length > 2,
        features: ids.slice(0, 2).map((id) => ({
          ...point,
          properties: {
            OBJECTID: id,
            GlobalID: String(id),
            FirstName: "DO NOT PUBLISH",
          },
        })),
      }),
    );
  };
  const rows = await fetchFeatures(SOURCE_BY_ID.blm, meta, [1, 2, 3, 4, 5]);
  assert.equal(rows.length, 5);
  assert.ok(requested.length > 1);
  assert.ok(rows.every((r) => !("FirstName" in r.properties)));
});
test("a source disappearing mid-download fails the whole snapshot", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ features: [] }));
  await assert.rejects(
    fetchFeatures(SOURCE_BY_ID.blm, { fields: [] }, [42]),
    /changed or truncated/,
  );
});
test("matching row counts cannot hide a server ignoring requested IDs", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        features: [{ ...point, properties: { OBJECTID: 999 } }],
      }),
    );
  await assert.rejects(
    fetchFeatures(
      SOURCE_BY_ID.blm,
      { fields: [{ name: "OBJECTID", type: "esriFieldTypeOID" }] },
      [42],
    ),
    /changed or truncated/,
  );
});
