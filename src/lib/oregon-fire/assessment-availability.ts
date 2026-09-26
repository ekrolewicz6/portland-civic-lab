// Reviewed display availability, not a claim that every fire in a year was assessed.
export const ASSESSMENT_MANIFEST = {
  checkedAt: "2026-09-26",
  source: "USGS / USFS MTBS",
  capabilities: "https://edcintl.cr.usgs.gov/geoserver/mtbs/ows?service=WMS&request=GetCapabilities",
  coverage: "Selected assessed fires; generally at least 1,000 acres in Oregon. Unmapped ground is not necessarily unburned.",
  assessmentDate: "Varies by fire; annual layer year is the fire year, not its assessment date.",
  products: Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, layer: `mtbs_CONUS_${2000 + i}`, state: "reviewed-display" as const })),
  pending: [2025, 2026],
  pendingReason: "Advertised newer and test layers require content and publication-status review before display approval.",
};
export const severityYears = ASSESSMENT_MANIFEST.products.map((p) => p.year);
export function severityProduct(year: number) { return ASSESSMENT_MANIFEST.products.find((p) => p.year === year) ?? null; }
