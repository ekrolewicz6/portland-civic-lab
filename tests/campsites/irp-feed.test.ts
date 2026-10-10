import { describe, it, expect } from "vitest";
import { featureToRow, feedTimestamp, parseItemDate } from "@/lib/campsites/irp-feed";

describe("IRP campsite feed", () => {
  // The newest report in the feed on October 7, 2026, as the city served it.
  const feature = {
    attributes: { OBJECTID: 1, inc_date_create: 1791278469000, inc_id: "26-168285", duplicate: 1, item_date_create: "20261006021026", IS_VEHICLE: "Yes", report_id: "1619064" },
    geometry: { x: -13659450.7244, y: 5706673.2791 },
  };

  it("keys a row on report_id and keeps the unstable OBJECTID only for reference", () => {
    const row = featureToRow(feature)!;
    expect(row.report_id).toBe("1619064");
    expect(row.arcgis_object_id).toBe(1);
    expect(row.item_date).toBe("2026-10-06T02:10:26.000Z");
    expect(row.is_duplicate).toBe(true);
    expect(row.is_vehicle).toBe(true);
    expect(row.lat).toBeGreaterThan(45.4);
    expect(row.lat).toBeLessThan(45.7);
    expect(row.lon).toBeGreaterThan(-122.8);
    expect(row.lon).toBeLessThan(-122.5);
  });

  it("drops a feature with no report_id or no valid incident date", () => {
    expect(featureToRow({ ...feature, attributes: { ...feature.attributes, report_id: null } })).toBeNull();
    expect(featureToRow({ ...feature, attributes: { ...feature.attributes, inc_date_create: null } })).toBeNull();
  });

  it("writes and reads the feed's YYYYMMDDHHMMSS timestamps", () => {
    expect(feedTimestamp(new Date("2026-09-22T02:10:26Z"))).toBe("20260922021026");
    expect(parseItemDate("20260922021026")).toBe("2026-09-22T02:10:26.000Z");
    expect(parseItemDate("2026")).toBeNull();
  });
});
