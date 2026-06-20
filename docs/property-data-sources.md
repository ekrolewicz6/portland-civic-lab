# Property Data Sources

This documents the current programmatic parcel-data strategy for Portland Civic Lab.

## Resolution Order

1. If user input is a Multnomah property ID like `R494022`, use it directly.
2. Otherwise geocode the address through PortlandMaps.
3. If PortlandMaps returns a confident geocode and taxlot, use the taxlot `PROPERTYID`.
4. If geocoding fails or no property ID comes back, search TaxGraph:
   `https://taxgraph.multco.us/property-search-results?combine={query}`.
5. Use the first TaxGraph result to get the property detail URL:
   `https://taxgraph.multco.us/property/{propertyId}`.

## Primary Assessment Source: TaxGraph

TaxGraph renders the needed data in static HTML. No authenticated JSON API is required.

Property detail pattern:

```text
https://taxgraph.multco.us/property/r494022
```

Parse these sections:

- `Value History`: land RMV, improvements RMV, total RMV, maximum assessed value, assessed value.
- `Tax History`: pre-compression tax, compressed amount, tax levied.
- `Tax Rate History`: levy-code tax rate.
- Header metadata: street address, city/state/zip, map and tax lot, levy code area.

Privacy rule: the page includes owner name, but the application must not return or display owner names.

## Parcel Metadata Source: PortlandMaps ArcGIS

TaxGraph gives assessment/tax history. PortlandMaps gives parcel context.

Address geocode:

```text
https://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer/findAddressCandidates
```

Taxlot by point or property ID:

```text
https://www.portlandmaps.com/arcgis/rest/services/Public/Taxlots/MapServer/0/query
```

BDS property by point or property ID:

```text
https://www.portlandmaps.com/arcgis/rest/services/Public/BDS_Property/FeatureServer/0/query
```

Use only non-owner fields. The Taxlots layer exposes owner fields, but the application intentionally does not request them.

## Last-Resort Fallback: MultCo Property Records

The older property-records system is an ASP.NET/DNN app. It is more brittle but useful as a fallback.

Search flow:

1. `GET https://multcoproptax.com/Property-Search` to collect cookies and hidden form fields.
2. `POST https://multcoproptax.com/Property-Search` as multipart form data.
3. Set `__EVENTTARGET=btnSearch`.
4. Set `__EVENTARGUMENT={query}`.
5. Include hidden fields plus `dnn$ctr410$MultnomahGuestView$SearchTextBox={query}`.
6. Parse hidden `dnn_ctr410_MultnomahGuestView_SearchResultJson`.
7. Use `PropertyQuickRefID` and `PartyQuickRefID` to fetch:
   `https://multcoproptax.com/Property-Detail/PropertyQuickRefID/{propertyId}/PartyQuickRefID/{partyId}/`.
8. Parse the `ASSESSED VALUES` section.

Privacy rule: the search JSON and detail page include owner fields. They must be discarded.

## Current Code

The production lookup path lives in:

```text
src/lib/growth-politics/parcel-lookup.ts
src/app/api/growth-politics/parcel/route.ts
```

Smoke-test examples:

```bash
curl 'http://localhost:3007/api/growth-politics/parcel?address=2410%20SW%20Nebraska%20St&relationship=owner_occupier'
curl 'http://localhost:3007/api/growth-politics/parcel?address=R494022&relationship=owner_occupier'
curl 'http://localhost:3007/api/growth-politics/parcel?address=2420%20NE%20Sandy%20Blvd&relationship=business_owner'
```
