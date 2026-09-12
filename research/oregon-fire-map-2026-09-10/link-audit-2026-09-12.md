# Oregon Fire page link audit — September 12, 2026

Checked the production page after the recent-fire-scar release. The inventory includes page links, all source-table destinations, map attribution and severity-method links, the default CSV export, navigation/footer links, the contribution form, and a selected record's original-source and correction links. Expanding the primary navigation found no additional unique destinations. Record source URLs are assigned from their source definitions; this is not a crawl of every historical database row or every outbound link on external websites.

## Result and correction

**One broken destination found:** `https://www.oregon.gov/oem/emops/Pages/RAPTOR.aspx` returned HTTP 404 and the visible heading “404 Page Not Found,” matching the reported screenshot.

Replaced it with the [official Oregon Department of Emergency Management homepage](https://www.oregon.gov/oem/Pages/default.aspx). Confirmed HTTP 200, the expected page title, and the rendered agency page in a browser. OEM's [current Emergency Operations page](https://www.oregon.gov/oem/emops/pages/default.aspx) now points to ArcGIS-hosted RAPTOR resources; the deleted state-site path is no longer used.

55 unique URLs were checked, including the proposed replacement. The other 54 returned HTTP 200 after redirects; HTML titles and main headings were checked for not-found and access-denied messages. BLM's source hub, the PNW tracker, and the NIFC data portal were additionally opened in a browser to check their client-rendered destinations. All named in-page anchors resolve. The map's `href="#"` zoom controls are JavaScript controls, not missing section links.

The [machine-readable evidence](link-audit-2026-09-12.json) preserves the pre-fix finding and replacement result. Authentication redirect parameters are omitted. No form was submitted and no message was sent. External availability is a point-in-time observation, not a guarantee of continued access or data completeness.

The application typecheck and page lint check passed for the single-link correction. Publication and the final production click-through are verified during deployment.
