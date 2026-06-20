import "server-only";

import { DEFAULTS, annualTax } from "@/lib/growth-politics/engine";

const BASE_URL = "https://www.portlandmaps.com/arcgis/rest/services/Public";
const GEOCODE_URL = `${BASE_URL}/Address_Geocoding_PDX/GeocodeServer/findAddressCandidates`;
const BDS_PROPERTY_URL = `${BASE_URL}/BDS_Property/FeatureServer/0/query`;
const TAXLOTS_URL = `${BASE_URL}/Taxlots/MapServer/0/query`;
const TAXGRAPH_BASE_URL = "https://taxgraph.multco.us";
const MULTCO_SEARCH_URL = "https://multcoproptax.com/Property-Search";
const MULTCO_BASE_URL = "https://multcoproptax.com";

const TIMEOUT_MS = 8_000;

const BDS_FIELDS = [
  "PROPERTY_ID",
  "PROPERTY_ID_MULTNOMAH_COUNTY",
  "STATE_ID",
  "ADDRESS_SITUS",
  "AREA_SQ_FT",
  "BDS_PROPERTY_TYPE",
  "BDS_DWELLING_TYPE",
  "NEIGHBORHOOD",
  "NEIGHBORHOOD_COALITION",
  "NEIGHBORHOOD_DISTRICT",
  "COUNCIL_DISTRICT",
  "ZONE",
  "COUNTY",
] as const;

const TAXLOT_FIELDS = [
  "STATE_ID",
  "PROPERTYID",
  "TLID",
  "SITEADDR",
  "SITECITY",
  "TAXCODE",
  "PROP_CODE",
  "PRPCD_DESC",
  "LANDUSE",
  "YEARBUILT",
  "BLDGSQFT",
  "UNITS",
  "MKTVALYR1",
  "LANDVAL1",
  "BLDGVAL1",
  "TOTALVAL1",
  "MKTVALYR2",
  "LANDVAL2",
  "BLDGVAL2",
  "TOTALVAL2",
  "MKTVALYR3",
  "LANDVAL3",
  "BLDGVAL3",
  "TOTALVAL3",
  "SALEDATE",
  "SALEPRICE",
  "COUNTY",
  "SOURCE",
] as const;

export type ParcelRelationship =
  | "owner_occupier"
  | "owner_landlord"
  | "renter"
  | "buyer"
  | "builder"
  | "business_owner"
  | "neighbor"
  | "unknown";

export type HouseholdIncomeBand =
  | "not_provided"
  | "under_50k"
  | "50k_75k"
  | "75k_100k"
  | "100k_150k"
  | "150k_250k"
  | "250k_plus";

export interface ParcelLookupInput {
  address: string;
  assessedValue?: number | null;
  relationship?: ParcelRelationship;
  monthlyRent?: number | null;
  householdIncomeBand?: HouseholdIncomeBand;
}

export interface ParcelMarketValue {
  year: string | null;
  value: number | null;
  landValue: number | null;
  buildingValue: number | null;
}

export interface ParcelFacts {
  matchedAddress: string;
  geocodeScore: number;
  location: { x: number; y: number };
  address: string | null;
  propertyId: string | null;
  multnomahPropertyId: string | null;
  stateId: string | null;
  taxlotId: string | null;
  neighborhood: string | null;
  neighborhoodDistrict: string | null;
  councilDistrict: string | null;
  zone: string | null;
  county: string | null;
  propertyType: string | null;
  dwellingType: string | null;
  propertyCode: string | null;
  propertyCodeDescription: string | null;
  landUse: string | null;
  yearBuilt: string | null;
  buildingSqft: number | null;
  units: number | null;
  lotSizeSqft: number | null;
  latestMarketValue: ParcelMarketValue;
  priorMarketValues: ParcelMarketValue[];
  saleDate: string | null;
  salePrice: number | null;
  source: string | null;
}

export interface MultcoAssessmentYear {
  year: number;
  improvements: number | null;
  land: number | null;
  specialMarketUse: string | null;
  realMarketValue: number | null;
  m5Value: number | null;
  m50Assessed: number | null;
}

export interface MultcoTaxYear {
  year: number;
  preCompressionTax: number | null;
  taxCompressed: number | null;
  taxLevied: number | null;
  taxRate: number | null;
}

export interface MultcoTaxAssessment {
  propertyId: string;
  streetAddress: string | null;
  cityStateZip: string | null;
  mapTaxLot: string | null;
  levyCodeArea: string | null;
  taxYear: number | null;
  realMarketValue: number | null;
  assessedValue: number | null;
  m5Value: number | null;
  valueHistory: MultcoAssessmentYear[];
  taxHistory: MultcoTaxYear[];
  sourceUrl: string;
  searchUrl: string | null;
  sourceName: string;
  fetchedAt: string;
}

export interface ParcelClassification {
  canClassify: boolean;
  relationship: ParcelRelationship;
  householdIncomeBand: HouseholdIncomeBand;
  incomeProtection: ParcelIncomeProtection;
  primaryCohort: string;
  plainEnglish: string;
  currentPolicyImpact: ParcelCurrentPolicyImpact;
  impactBrief: ParcelImpactBrief;
  relatedCohorts: Array<{ label: string; reason: string }>;
  missing: string[];
  assessedValue: number | null;
  marketValue: number | null;
  taxedShare: number | null;
  benchmarkRatio: number;
  benchmarkLabel: string;
  currentAnnualTax: number | null;
  benchmarkAnnualTax: number | null;
  corridorAnnualTax: number | null;
  annualAdvantageVsBenchmark: number | null;
  annualIncreaseToCorridor: number | null;
  warnings: string[];
}

export interface ParcelIncomeProtection {
  label: string;
  shortLabel: string;
  assumedCashExposure: number;
  protected: boolean;
  thresholdExplanation: string;
  note: string;
}

export interface ParcelCurrentPolicyImpact {
  label: string;
  amount: number | null;
  unit: string;
  kind: "gain" | "loss" | "mixed" | "neutral" | "unknown";
  summary: string;
  howCalculated: string;
  readerMeaning: string;
  confidence: "High" | "Medium" | "Low";
  whatWouldMakeThisMoreExact: string[];
}

export interface ParcelImpactBrief {
  eyebrow: string;
  headline: string;
  summary: string;
  now: ParcelImpactMetric;
  future: ParcelImpactMetric;
  change: ParcelImpactMetric;
  addressContext: string;
  takeaways: string[];
  caveats: string[];
  nextStep: string;
}

export interface ParcelImpactMetric {
  label: string;
  amount: number | null;
  unit: string;
  description: string;
  kind: "cost" | "benefit" | "exposure" | "neutral";
}

export interface ParcelLookupResult {
  parcel: ParcelFacts;
  taxAssessment: MultcoTaxAssessment | null;
  classification: ParcelClassification;
  sources: Array<{ label: string; url: string }>;
  privacyNote: string;
  methodNote: string;
}

export interface ParcelLookupSuccess {
  ok: true;
  lookup: ParcelLookupResult;
}

export interface ParcelLookupFailure {
  ok: false;
  error: string;
}

export type ParcelLookupResponse = ParcelLookupSuccess | ParcelLookupFailure;

interface GeocodeCandidate {
  address?: string;
  score?: number;
  location?: { x: number; y: number };
}

interface ArcGISFeature<T> {
  attributes?: T;
}

interface ArcGISQueryResponse<T> {
  features?: Array<ArcGISFeature<T>>;
  error?: { message?: string };
}

type RawBdsProperty = Record<(typeof BDS_FIELDS)[number], unknown>;
type RawTaxlot = Record<(typeof TAXLOT_FIELDS)[number], unknown>;

interface MultcoSearchResult {
  PropertyQuickRefID?: string;
  PartyQuickRefID?: string;
  PropertyNumber?: string;
  SitusAddress?: string;
  PropertyValue?: number;
  TaxYear?: number;
  PropertyValueTaxYear?: number;
}

interface MultcoSearchPayload {
  ResultList?: MultcoSearchResult[];
  TaxYear?: number;
}

interface TaxGraphSearchResult {
  propertyId: string;
  streetAddress: string | null;
  cityStateZip: string | null;
  sourceUrl: string;
}

class CookieJar {
  private cookies = new Map<string, string>();

  absorb(headers: Headers) {
    const headersWithCookies = headers as Headers & { getSetCookie?: () => string[] };
    const setCookies = headersWithCookies.getSetCookie?.() ?? splitSetCookieHeader(headers.get("set-cookie"));

    for (const cookie of setCookies) {
      const [pair] = cookie.split(";");
      const index = pair.indexOf("=");
      if (index > 0) {
        this.cookies.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
      }
    }
  }

  header(): string {
    return Array.from(this.cookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }
}

function splitSetCookieHeader(header: string | null): string[] {
  if (!header) return [];
  return header.split(/,(?=\s*[^;,]+=)/g);
}

function buildUrl(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`PortlandMaps request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function fetchTextWithCookies(
  url: string,
  {
    jar,
    method = "GET",
    body,
    referer,
  }: {
    jar: CookieJar;
    method?: "GET" | "POST";
    body?: BodyInit;
    referer?: string;
  },
): Promise<string> {
  const cookie = jar.header();
  const headers: Record<string, string> = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "User-Agent": "Portland Civic Lab parcel lookup/1.0",
  };

  if (referer) headers.Referer = referer;
  if (cookie) headers.Cookie = cookie;

  const res = await fetch(url, {
    method,
    body,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  jar.absorb(res.headers);

  if (!res.ok) {
    throw new Error(`Multnomah County property request failed with status ${res.status}`);
  }

  return res.text();
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#34;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)));
}

function htmlToText(html: string): string {
  return decodeHtml(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:td|th|tr|div|p|li|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n"),
  );
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /([^\s="'<>\/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(tag)) !== null) {
    attrs[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attrs;
}

function parseInputFields(html: string): Array<{ name: string; id: string | null; type: string; value: string }> {
  const fields: Array<{ name: string; id: string | null; type: string; value: string }> = [];
  const inputPattern = /<input\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = inputPattern.exec(html)) !== null) {
    const attrs = parseAttributes(match[0]);
    if (attrs.name) {
      fields.push({
        name: attrs.name,
        id: attrs.id ?? null,
        type: (attrs.type ?? "text").toLowerCase(),
        value: attrs.value ?? "",
      });
    }
  }

  return fields;
}

function getInputValue(html: string, idOrName: string): string | null {
  return (
    parseInputFields(html).find((field) => field.id === idOrName || field.name === idOrName)?.value ??
    null
  );
}

function parseMoney(value: string | null | undefined): number | null {
  if (!value || value === "-") return null;
  return toNumber(value);
}

function normalizePropertyId(value: string | null | undefined): string | null {
  const match = value?.trim().match(/^R\d+$/i);
  return match ? match[0].toUpperCase() : null;
}

function compactTextLines(html: string): string[] {
  return htmlToText(html)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function compactInlineText(html: string): string {
  return htmlToText(html).replace(/\s+/g, " ").trim();
}

function tableCellTexts(rowHtml: string): string[] {
  const cells: string[] = [];
  const cellPattern = /<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
  let match: RegExpExecArray | null;

  while ((match = cellPattern.exec(rowHtml)) !== null) {
    cells.push(compactInlineText(match[1]));
  }

  return cells;
}

function normalizeTaxGraphLabel(label: string): string {
  return label
    .replace(/^[^a-z0-9]+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parseTaxGraphTableByHeading(html: string, heading: string): Array<{ label: string; values: Array<string> }> {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tableMatch = html.match(
    new RegExp(`<h2>\\s*${escapedHeading}\\s*<\\/h2>[\\s\\S]*?<table\\b[^>]*class="[^"]*\\btable-d3\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/table>`, "i"),
  );
  if (!tableMatch) return [];

  const tableHtml = tableMatch[1];
  const rowMatches = Array.from(tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)).map((match) => match[1]);
  if (rowMatches.length < 2) return [];

  const headerCells = tableCellTexts(rowMatches[0]);
  const years = headerCells
    .slice(1)
    .map((cell) => Number(cell))
    .filter((year) => Number.isInteger(year));
  if (years.length === 0) return [];

  const rows: Array<{ label: string; values: Array<string> }> = [];
  for (const rowHtml of rowMatches.slice(1)) {
    const cells = tableCellTexts(rowHtml);
    const label = cells[0];
    if (!label) continue;
    rows.push({
      label,
      values: years.map((year, index) => `${year}:${cells[index + 1] ?? ""}`),
    });
  }

  return rows;
}

function taxGraphTableSeries(html: string, heading: string): { years: number[]; rowValues: Map<string, Array<number | null>> } {
  const rows = parseTaxGraphTableByHeading(html, heading);
  const years =
    rows[0]?.values
      .map((value) => Number(value.split(":")[0]))
      .filter((year) => Number.isInteger(year)) ?? [];
  const rowValues = new Map<string, Array<number | null>>();

  for (const row of rows) {
    rowValues.set(
      normalizeTaxGraphLabel(row.label),
      row.values.map((value) => parseMoney(value.slice(value.indexOf(":") + 1))),
    );
  }

  return { years, rowValues };
}

function parseTaxGraphValueHistory(html: string): MultcoAssessmentYear[] {
  const { years, rowValues } = taxGraphTableSeries(html, "Value History");

  const land = rowValues.get("real market value - land") ?? [];
  const improvements = rowValues.get("real market value - improvements") ?? [];
  const rmv = rowValues.get("total real market value") ?? [];
  const mav = rowValues.get("maximum assessed value") ?? [];
  const assessed = rowValues.get("assessed value") ?? [];

  return years
    .map((year, index) => ({
      year,
      improvements: improvements[index] ?? null,
      land: land[index] ?? null,
      specialMarketUse: null,
      realMarketValue: rmv[index] ?? null,
      m5Value: mav[index] ?? null,
      m50Assessed: assessed[index] ?? null,
    }))
    .sort((a, b) => b.year - a.year);
}

function parseTaxGraphTaxHistory(html: string): MultcoTaxYear[] {
  const tax = taxGraphTableSeries(html, "Tax History");
  const rates = taxGraphTableSeries(html, "Tax Rate History");
  const preCompression = tax.rowValues.get("pre- compression tax") ?? tax.rowValues.get("pre-compression tax") ?? [];
  const compressed = tax.rowValues.get("tax compressed") ?? [];
  const levied = tax.rowValues.get("tax levied") ?? [];
  const taxRate = rates.rowValues.get("tax rate") ?? [];
  const years = tax.years.length > 0 ? tax.years : rates.years;

  return years
    .map((year, index) => ({
      year,
      preCompressionTax: preCompression[index] ?? null,
      taxCompressed: compressed[index] ?? null,
      taxLevied: levied[index] ?? null,
      taxRate: taxRate[index] ?? null,
    }))
    .sort((a, b) => b.year - a.year);
}

function parseTaxGraphMetadata(html: string): Pick<
  MultcoTaxAssessment,
  "streetAddress" | "cityStateZip" | "mapTaxLot" | "levyCodeArea"
> {
  const getField = (label: string) => {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = html.match(
      new RegExp(
        `<span\\s+class="field-name">\\s*${escapedLabel}:\\s*<\\/span>\\s*<span\\s+class="field-value">([\\s\\S]*?)<\\/span>`,
        "i",
      ),
    );
    return match ? compactInlineText(match[1]) || null : null;
  };

  return {
    streetAddress: getField("Street address"),
    cityStateZip: getField("City, State, Zip"),
    mapTaxLot: getField("Map and Tax Lot"),
    levyCodeArea: getField("Levy Code Area"),
  };
}

function parseTaxGraphSearchResults(html: string, searchUrl: string): TaxGraphSearchResult[] {
  const results: TaxGraphSearchResult[] = [];

  for (const match of html.matchAll(/<div class="property-search-result">([\s\S]*?)<\/div><\/div>/gi)) {
    const block = match[1];
    const href = block.match(/href="\/property\/([^"]+)"/i)?.[1];
    const propertyId = normalizePropertyId(href);
    if (!propertyId) continue;

    const spans = Array.from(block.matchAll(/<span>([\s\S]*?)<\/span>/gi)).map((span) => compactInlineText(span[1]));
    results.push({
      propertyId,
      streetAddress: spans[0] ?? null,
      cityStateZip: spans[1] ?? null,
      sourceUrl: `${TAXGRAPH_BASE_URL}/property/${propertyId.toLowerCase()}`,
    });
  }

  return results;
}

async function fetchPlainText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": "Portland Civic Lab parcel lookup/1.0",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    throw new Error(`TaxGraph request failed with status ${res.status}`);
  }

  return res.text();
}

async function lookupTaxGraphAssessment(propertyId: string | null): Promise<MultcoTaxAssessment | null> {
  const id = normalizePropertyId(propertyId);
  if (!id) return null;

  try {
    const sourceUrl = `${TAXGRAPH_BASE_URL}/property/${encodeURIComponent(id.toLowerCase())}`;
    const html = await fetchPlainText(sourceUrl);
    if (!new RegExp(`Property ID:\\s*${id}`, "i").test(htmlToText(html))) return null;

    const valueHistory = parseTaxGraphValueHistory(html);
    const taxHistory = parseTaxGraphTaxHistory(html);
    const metadata = parseTaxGraphMetadata(html);
    const latest = valueHistory[0] ?? null;
    if (!latest) return null;

    return {
      propertyId: id,
      ...metadata,
      taxYear: latest.year,
      realMarketValue: latest.realMarketValue,
      assessedValue: latest.m50Assessed,
      m5Value: latest.m5Value,
      valueHistory,
      taxHistory,
      sourceUrl,
      searchUrl: null,
      sourceName: "Multnomah County TaxGraph",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function searchTaxGraph(query: string): Promise<TaxGraphSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 4) return [];

  try {
    const searchUrl = `${TAXGRAPH_BASE_URL}/property-search-results?combine=${encodeURIComponent(trimmed)}`;
    const html = await fetchPlainText(searchUrl);
    return parseTaxGraphSearchResults(html, searchUrl);
  } catch {
    return [];
  }
}

function parseMultcoSearchJson(html: string): MultcoSearchPayload | null {
  const raw = getInputValue(html, "dnn_ctr410_MultnomahGuestView_SearchResultJson");
  if (!raw || raw === "{}") return null;

  try {
    return JSON.parse(raw) as MultcoSearchPayload;
  } catch {
    return null;
  }
}

function buildMultcoSearchForm(html: string, query: string): FormData {
  const form = new FormData();
  form.append("__EVENTTARGET", "btnSearch");
  form.append("__EVENTARGUMENT", query);

  for (const field of parseInputFields(html)) {
    if (field.name === "__EVENTTARGET" || field.name === "__EVENTARGUMENT") continue;
    if (field.type !== "hidden" && field.name !== "dnn$ctr410$MultnomahGuestView$SearchTextBox") continue;

    form.append(
      field.name,
      field.name === "dnn$ctr410$MultnomahGuestView$SearchTextBox" ? query : field.value,
    );
  }

  return form;
}

function selectMultcoResult(payload: MultcoSearchPayload | null, propertyId: string): MultcoSearchResult | null {
  const resultList = payload?.ResultList ?? [];
  if (resultList.length === 0) return null;

  const target = propertyId.trim().toUpperCase();
  return (
    resultList.find(
      (result) =>
        result.PropertyQuickRefID?.trim().toUpperCase() === target ||
        result.PropertyNumber?.trim().toUpperCase() === target,
    ) ?? resultList[0] ?? null
  );
}

function buildMultcoDetailUrl(result: MultcoSearchResult): string | null {
  if (!result.PropertyQuickRefID || !result.PartyQuickRefID) return null;

  return `${MULTCO_BASE_URL}/Property-Detail/PropertyQuickRefID/${encodeURIComponent(
    result.PropertyQuickRefID,
  )}/PartyQuickRefID/${encodeURIComponent(result.PartyQuickRefID)}/`;
}

function parseMultcoAssessedValues(html: string): MultcoAssessmentYear[] {
  const lines = compactTextLines(html);
  const start = lines.findIndex((line) => line.toUpperCase() === "ASSESSED VALUES");
  if (start === -1) return [];

  const rows: MultcoAssessmentYear[] = [];

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const upper = line.toUpperCase();

    if (upper === "SALES HISTORY" || upper === "DISCLAIMER") break;
    if (!/^\d{4}$/.test(line)) continue;

    const year = Number(line);
    const values: string[] = [];
    let j = i + 1;

    while (j < lines.length && !/^\d{4}$/.test(lines[j])) {
      const candidate = lines[j];
      const candidateUpper = candidate.toUpperCase();
      if (candidateUpper === "SALES HISTORY" || candidateUpper === "DISCLAIMER") break;
      if (candidate.includes("$") || candidate === "-") values.push(candidate);
      j += 1;
    }

    if (values.length >= 6) {
      rows.push({
        year,
        improvements: parseMoney(values[0]),
        land: parseMoney(values[1]),
        specialMarketUse: values[2] ?? null,
        realMarketValue: parseMoney(values[3]),
        m5Value: parseMoney(values[4]),
        m50Assessed: parseMoney(values[values.length - 1]),
      });
    }

    i = j - 1;
  }

  return rows.sort((a, b) => b.year - a.year);
}

async function lookupMultcoTaxAssessment(propertyId: string | null): Promise<MultcoTaxAssessment | null> {
  const query = propertyId?.trim();
  if (!query || !/^R\d+$/i.test(query)) return null;

  try {
    const jar = new CookieJar();
    const searchPage = await fetchTextWithCookies(MULTCO_SEARCH_URL, { jar });
    const form = buildMultcoSearchForm(searchPage, query);
    const searchResultsPage = await fetchTextWithCookies(MULTCO_SEARCH_URL, {
      jar,
      method: "POST",
      body: form,
      referer: MULTCO_SEARCH_URL,
    });
    const result = selectMultcoResult(parseMultcoSearchJson(searchResultsPage), query);
    const detailUrl = result ? buildMultcoDetailUrl(result) : null;
    if (!result || !detailUrl) return null;

    const detailPage = await fetchTextWithCookies(detailUrl, {
      jar,
      referer: MULTCO_SEARCH_URL,
    });
    const detailText = htmlToText(detailPage);
    if (/critical error|unexpected error/i.test(detailText)) return null;

    const valueHistory = parseMultcoAssessedValues(detailPage);
    const latest = valueHistory[0] ?? null;

    return {
      propertyId: result.PropertyQuickRefID ?? query,
      streetAddress: result.SitusAddress ?? null,
      cityStateZip: null,
      mapTaxLot: null,
      levyCodeArea: null,
      taxYear: latest?.year ?? result.PropertyValueTaxYear ?? result.TaxYear ?? null,
      realMarketValue: latest?.realMarketValue ?? null,
      assessedValue: latest?.m50Assessed ?? toNumber(result.PropertyValue),
      m5Value: latest?.m5Value ?? null,
      valueHistory,
      taxHistory: [],
      sourceUrl: detailUrl,
      searchUrl: MULTCO_SEARCH_URL,
      sourceName: "Multnomah County property detail",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function normalizeSaleDate(value: unknown): string | null {
  const date = toStringOrNull(value);
  if (!date || date === "01/01/1900") return null;
  return date;
}

function marketValueFrom(raw: RawTaxlot | null, index: 1 | 2 | 3): ParcelMarketValue {
  if (!raw) {
    return { year: null, value: null, landValue: null, buildingValue: null };
  }

  return {
    year: toStringOrNull(raw[`MKTVALYR${index}`]),
    value: toNumber(raw[`TOTALVAL${index}`]),
    landValue: toNumber(raw[`LANDVAL${index}`]),
    buildingValue: toNumber(raw[`BLDGVAL${index}`]),
  };
}

function latestMarketValue(raw: RawTaxlot | null): { latest: ParcelMarketValue; prior: ParcelMarketValue[] } {
  const values = [marketValueFrom(raw, 3), marketValueFrom(raw, 2), marketValueFrom(raw, 1)];
  const latest = values.find((value) => value.value !== null && value.value > 0) ?? values[0];

  return {
    latest,
    prior: values.filter((value) => value !== latest && value.value !== null),
  };
}

function isLikelyMultifamily(parcel: ParcelFacts): boolean {
  const units = parcel.units ?? 0;
  const searchable = [
    parcel.propertyType,
    parcel.dwellingType,
    parcel.propertyCodeDescription,
    parcel.landUse,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return units >= 2 || /multi|apartment|duplex|triplex|fourplex|plex|condo|rental/.test(searchable);
}

function isLikelyResidential(parcel: ParcelFacts): boolean {
  const landUse = parcel.landUse?.trim().toLowerCase();
  const propertyCode = parcel.propertyCode?.trim().toUpperCase();
  const searchable = [
    parcel.propertyType,
    parcel.dwellingType,
    parcel.propertyCodeDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    isLikelyMultifamily(parcel) ||
    landUse === "res" ||
    landUse === "residential" ||
    propertyCode === "R" ||
    /^R[0-9A-Z]?$/.test(propertyCode ?? "") ||
    /\b(residential|single|house|housing|dwelling|townhome|attached|condo|adu)\b/.test(searchable)
  );
}

function relationshipLabel(relationship: ParcelRelationship): string {
  switch (relationship) {
    case "owner_occupier":
      return "owner who lives here";
    case "owner_landlord":
      return "owner who rents this out";
    case "renter":
      return "renter at this address";
    case "buyer":
      return "possible buyer";
    case "builder":
      return "builder or project sponsor";
    case "business_owner":
      return "business or commercial property owner";
    case "neighbor":
      return "nearby resident";
    default:
      return "person connected to this parcel";
  }
}

function taxShareLabel(taxedShare: number | null): string {
  return taxedShare === null ? "an unknown share" : `${Math.round(taxedShare * 100)}%`;
}

function signedDollarText(value: number | null): string {
  if (value === null) return "not enough data";
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function metric(
  label: string,
  amount: number | null,
  unit: string,
  description: string,
  kind: ParcelImpactMetric["kind"],
): ParcelImpactMetric {
  return { label, amount, unit, description, kind };
}

export function normalizeHouseholdIncomeBand(value: string | null): HouseholdIncomeBand {
  if (
    value === "under_50k" ||
    value === "50k_75k" ||
    value === "75k_100k" ||
    value === "100k_150k" ||
    value === "150k_250k" ||
    value === "250k_plus"
  ) {
    return value;
  }

  return "not_provided";
}

function incomeProtectionForBand(band: HouseholdIncomeBand): ParcelIncomeProtection {
  switch (band) {
    case "under_50k":
      return {
        label: "Under $50k household income",
        shortLabel: "Protected",
        assumedCashExposure: 0,
        protected: true,
        thresholdExplanation: "Model assumes full cash protection below $50k.",
        note: "The floor increase is shown as a protected/deferred amount, not an immediate cash bill.",
      };
    case "50k_75k":
      return {
        label: "$50k-$75k household income",
        shortLabel: "Protected",
        assumedCashExposure: 0,
        protected: true,
        thresholdExplanation: "Model assumes full cash protection from $50k to $75k.",
        note: "The floor increase is shown as a protected/deferred amount, not an immediate cash bill.",
      };
    case "75k_100k":
      return {
        label: "$75k-$100k household income",
        shortLabel: "Mostly protected",
        assumedCashExposure: 0.25,
        protected: true,
        thresholdExplanation: "Model assumes only 25% of the floor increase is paid in cash from $75k to $100k.",
        note: "The remaining floor increase would need a deferral, circuit breaker, or hardship rule.",
      };
    case "100k_150k":
      return {
        label: "$100k-$150k household income",
        shortLabel: "Partial exposure",
        assumedCashExposure: 0.5,
        protected: false,
        thresholdExplanation: "Model assumes 50% of the floor increase is paid in cash from $100k to $150k.",
        note: "This is the transition band where the package should phase out protection instead of creating a cliff.",
      };
    case "150k_250k":
      return {
        label: "$150k-$250k household income",
        shortLabel: "Full exposure",
        assumedCashExposure: 1,
        protected: false,
        thresholdExplanation: "Model assumes full cash exposure above $150k.",
        note: "This household is modeled as able to carry the tax-basis correction without income protection.",
      };
    case "250k_plus":
      return {
        label: "$250k+ household income",
        shortLabel: "Full exposure",
        assumedCashExposure: 1,
        protected: false,
        thresholdExplanation: "Model assumes full cash exposure above $250k.",
        note: "This is the clearest case where a low taxable basis should not receive household-income protection.",
      };
    case "not_provided":
    default:
      return {
        label: "Income not provided",
        shortLabel: "Unknown",
        assumedCashExposure: 1,
        protected: false,
        thresholdExplanation: "No household-income protection is applied unless an income band is selected.",
        note: "Choose an income band to see whether the model treats the owner-occupier as protected, partially exposed, or fully exposed.",
      };
  }
}

function currentPolicyImpact({
  parcel,
  relationship,
  householdIncomeBand,
  assessedValue,
  marketValue,
  taxedShare,
  annualAdvantageVsBenchmark,
  monthlyRent,
}: {
  parcel: ParcelFacts;
  relationship: ParcelRelationship;
  householdIncomeBand: HouseholdIncomeBand;
  assessedValue: number | null;
  marketValue: number | null;
  taxedShare: number | null;
  annualAdvantageVsBenchmark: number | null;
  monthlyRent?: number | null;
}): ParcelCurrentPolicyImpact {
  const renterMonthlyRent = monthlyRent && monthlyRent > 0 ? monthlyRent : DEFAULTS.medianRent;
  const renterRentSource = monthlyRent && monthlyRent > 0 ? "your entered total unit rent" : "the default median rent";
  const renterShortageLoss = Math.round(renterMonthlyRent * 12 * 0.1);
  const units = typeof parcel.units === "number" && parcel.units > 0 ? parcel.units : 1;
  const taxAdvantage = annualAdvantageVsBenchmark ?? null;
  const positiveTaxAdvantage = taxAdvantage === null ? null : Math.max(0, Math.round(taxAdvantage));
  const buyerScarcityLoss = marketValue ? Math.round(marketValue * 0.1 * 0.065) : null;
  const scarcityAssetGain = marketValue ? Math.round(marketValue * 0.1 * DEFAULTS.capRate) : null;
  const taxedShareText = taxShareLabel(taxedShare);

  if (!marketValue || !assessedValue || taxedShare === null) {
    return {
      label: "Today's estimated position",
      amount: null,
      unit: "not enough parcel data",
      kind: "unknown",
      summary: "We need both market value and assessed value before estimating whether today's rules help or hurt this address.",
      howCalculated: "Current-policy impact depends on assessed value divided by market value, plus your relationship to the address.",
      readerMeaning: "The address lookup found some parcel facts, but not enough tax basis data to produce a current gain/loss estimate.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "County real market value for the same tax year.",
        "Measure 50 assessed value for the same parcel and tax year.",
        "Your relationship to the address.",
      ],
    };
  }

  if (relationship === "renter") {
    return {
      label: "Estimated current-policy loss",
      amount: -renterShortageLoss,
      unit: "per renting household per year",
      kind: "loss",
      summary: `Under today's housing shortage, this model estimates about ${signedDollarText(renterShortageLoss)} per year in rent pressure for a household paying ${signedDollarText(renterMonthlyRent)} per month.`,
      howCalculated: `${renterRentSource} x 12 x 10% shortage premium.`,
      readerMeaning:
        "This is not this unit's tax bill. It is the modeled cost of living in a tight rental market where too few homes are available.",
      confidence: monthlyRent && monthlyRent > 0 ? "Medium" : "Low",
      whatWouldMakeThisMoreExact: [
        "Your total monthly rent for the whole unit.",
        "Whether you are likely to move soon.",
        "Whether your rent is subsidized or income-restricted.",
        "Your actual rent increase history and lease terms.",
      ],
    };
  }

  if (relationship === "owner_occupier") {
    const amount = taxAdvantage === null ? null : Math.round(taxAdvantage);
    const kind: ParcelCurrentPolicyImpact["kind"] =
      amount === null ? "unknown" : amount > 250 ? "gain" : amount < -250 ? "loss" : "neutral";
    const summary =
      amount === null
        ? "This model cannot estimate the current owner impact yet."
        : amount > 250
          ? `Today's rules appear to give this owner-occupied address about ${signedDollarText(amount)} per year in lower property tax than a similar new or heavily changed residential property.`
          : amount < -250
            ? `Today's rules appear to leave this address paying about ${signedDollarText(Math.abs(amount))} more per year than the benchmark comparison.`
            : "Today's rules do not show a large annual tax advantage or penalty for this address against the benchmark.";

    return {
      label:
        kind === "gain"
          ? "Estimated current-policy gain"
          : kind === "loss"
            ? "Estimated current-policy loss"
            : "Estimated current-policy position",
      amount,
      unit: "per year versus changed-property benchmark",
      kind,
      summary,
      howCalculated: `Benchmark annual tax minus current modeled annual tax. This address is taxed on ${taxedShareText} of market value. The selected income band is not used in this current-rules comparison.`,
      readerMeaning:
        kind === "gain"
          ? "This does not mean the owner is doing anything wrong. It means the current tax rules appear to attach a yearly property-tax advantage to this parcel."
          : kind === "loss"
            ? "This address is already carrying more of today's property-tax base than many low-tax older parcels."
            : "This address is close enough to the benchmark that the current tax-basis effect is not the main story.",
      confidence: "Medium",
      whatWouldMakeThisMoreExact: [
        "Formal confirmation of owner-occupancy status; the estimate is already using your selected owner-occupier answer.",
        "Any exemptions, deferrals, compression effects, or special assessments.",
        "The exact tax bill, not only the modeled rate.",
        "The final county tax statement for the same tax year.",
      ],
    };
  }

  if (relationship === "owner_landlord") {
    const ownerTaxGain = positiveTaxAdvantage ?? null;
    const scarcityRentGain = Math.round(renterShortageLoss * units);
    const totalGain = ownerTaxGain === null ? null : ownerTaxGain + scarcityRentGain;

    return {
      label: "Estimated current-policy gain",
      amount: totalGain,
      unit: `per year across ${units.toLocaleString()} listed unit${units === 1 ? "" : "s"}`,
      kind: totalGain === null ? "unknown" : totalGain > 250 ? "gain" : "neutral",
      summary:
        totalGain === null
          ? "This model cannot estimate the landlord-side current advantage yet."
          : `Today's rules may be worth about ${signedDollarText(totalGain)} per year to the property owner in modeled tax advantage and scarcity rent premium.`,
      howCalculated: "Positive property-tax advantage versus benchmark, plus a 10% modeled rent-scarcity premium per listed unit.",
      readerMeaning:
        "This is a property-owner-side estimate. It does not prove the owner is overcharging or that a tenant receives or loses this exact amount.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "Actual rent roll for every unit.",
        "Operating expenses, debt, insurance, vacancies, and maintenance.",
        "Whether leases allow tax or cost pass-throughs.",
        "Whether any units are income-restricted or subsidized.",
      ],
    };
  }

  if (relationship === "buyer") {
    const inheritedTaxGain = positiveTaxAdvantage ?? 0;
    const net = buyerScarcityLoss === null ? null : inheritedTaxGain - buyerScarcityLoss;

    return {
      label: net !== null && net > 0 ? "Estimated current-policy gain" : "Estimated current-policy loss",
      amount: net,
      unit: "per year",
      kind: net === null ? "unknown" : net > 250 ? "gain" : net < -250 ? "loss" : "mixed",
      summary:
        net === null
          ? "This model cannot estimate the buyer position yet."
          : `For a buyer, this model nets any inherited tax discount against an approximate shortage-driven mortgage burden. The result is ${signedDollarText(net)} per year.`,
      howCalculated: "Modeled inherited annual tax advantage minus annual mortgage cost of a 10% scarcity premium.",
      readerMeaning:
        "A buyer can benefit from an old low tax bill and still lose overall if scarcity has already raised the purchase price.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "Actual purchase price and down payment.",
        "Mortgage rate and loan term.",
        "Whether the taxable value resets or changes after purchase.",
        "Your income and monthly payment limit.",
      ],
    };
  }

  if (relationship === "builder") {
    const taxStepUp = taxAdvantage === null ? null : Math.max(0, Math.round(taxAdvantage));
    return {
      label: "Estimated current-policy loss",
      amount: taxStepUp === null ? null : -taxStepUp,
      unit: "per year before fees, delay, and financing",
      kind: taxStepUp === null ? "unknown" : taxStepUp > 250 ? "loss" : "mixed",
      summary:
        taxStepUp === null
          ? "This model cannot estimate the project tax step-up yet."
          : `If the parcel becomes new or heavily changed housing, the first visible current-policy burden is roughly ${signedDollarText(taxStepUp)} per year in tax-basis step-up before adding fees and delay.`,
      howCalculated: "Current owner tax advantage versus changed-property benchmark, shown as a project-side cost if redevelopment loses the old basis.",
      readerMeaning:
        "This is only the tax-basis signal. For builders, the larger current-policy losses often come from land cost, fees, delay, financing, and project uncertainty.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "Project type and number of units.",
        "Expected permit path and timeline.",
        "System development charges and infrastructure requirements.",
        "Construction cost, financing, affordability requirements, and land price.",
      ],
    };
  }

  if (relationship === "business_owner") {
    const amount = taxAdvantage === null ? null : Math.round(taxAdvantage);
    return {
      label: amount !== null && amount > 250 ? "Estimated current-policy gain" : "Estimated current-policy position",
      amount,
      unit: "per year, directional",
      kind: amount === null ? "unknown" : amount > 250 ? "gain" : amount < -250 ? "loss" : "mixed",
      summary:
        amount === null
          ? "This model cannot estimate the commercial current-policy position yet."
          : `This non-residential comparison is directional only: it shows ${signedDollarText(amount)} per year against the residential benchmark.`,
      howCalculated: "Modeled annual tax difference versus the residential changed-property benchmark.",
      readerMeaning:
        "Commercial property needs a separate benchmark before this should be treated as a policy conclusion.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "Commercial changed-property ratio by property class.",
        "Whether the business owns or leases the space.",
        "Lease pass-through terms for taxes and operating costs.",
        "Business income-tax exposure.",
      ],
    };
  }

  if (relationship === "neighbor") {
    return {
      label: "Estimated current-policy gain",
      amount: scarcityAssetGain,
      unit: "per year, property-value signal",
      kind: scarcityAssetGain === null ? "unknown" : "gain",
      summary:
        scarcityAssetGain === null
          ? "This model cannot estimate the scarcity-value signal yet."
          : `If scarcity adds 10% to nearby property value, the annualized value signal is about ${signedDollarText(scarcityAssetGain)} per year for a property like this.`,
      howCalculated: "10% of market value multiplied by the page's capitalization-rate assumption.",
      readerMeaning:
        "This is not a bill. It is a way to show why existing property owners may financially benefit from scarcity even if they never receive a check.",
      confidence: "Low",
      whatWouldMakeThisMoreExact: [
        "Whether you own or rent nearby.",
        "Actual comparable sales and neighborhood price trends.",
        "How much new housing would affect local prices and rents.",
        "Whether you face direct displacement risk or property-tax hardship.",
      ],
    };
  }

  return {
    label: "Today's estimated position",
    amount: taxAdvantage === null ? null : Math.round(taxAdvantage),
    unit: "per year",
    kind: "mixed",
    summary: "Choose a relationship to see whether today's rules look like a gain or loss for you.",
    howCalculated: "The current-policy number changes depending on whether you rent, own, buy, build, operate a business, or live nearby.",
    readerMeaning: "The same parcel can serve one group and burden another.",
    confidence: "Low",
    whatWouldMakeThisMoreExact: ["Your relationship to the address.", "Your actual rent or ownership details.", "The exact tax bill, not only the modeled rate."],
  };
}

function buildImpactBrief({
  parcel,
  relationship,
  householdIncomeBand,
  assessedValue,
  marketValue,
  taxedShare,
  currentAnnualTax,
  benchmarkAnnualTax,
  corridorAnnualTax,
  annualAdvantageVsBenchmark,
  annualIncreaseToCorridor,
  monthlyRent,
}: {
  parcel: ParcelFacts;
  relationship: ParcelRelationship;
  householdIncomeBand: HouseholdIncomeBand;
  assessedValue: number | null;
  marketValue: number | null;
  taxedShare: number | null;
  currentAnnualTax: number | null;
  benchmarkAnnualTax: number | null;
  corridorAnnualTax: number | null;
  annualAdvantageVsBenchmark: number | null;
  annualIncreaseToCorridor: number | null;
  monthlyRent?: number | null;
}): ParcelImpactBrief {
  const addressName = parcel.address ?? parcel.matchedAddress ?? "this address";
  const propertyType = parcel.propertyCodeDescription ?? parcel.dwellingType ?? parcel.propertyType ?? "this parcel";
  const taxedShareText = taxShareLabel(taxedShare);
  const incomeProtection = incomeProtectionForBand(householdIncomeBand);
  const advantage = annualAdvantageVsBenchmark ?? null;
  const positiveAdvantage = advantage === null ? null : Math.max(0, advantage);
  const renterMonthlyRent = monthlyRent && monthlyRent > 0 ? monthlyRent : DEFAULTS.medianRent;
  const renterRentSource = monthlyRent && monthlyRent > 0 ? "your entered total unit rent" : "the default median rent";
  const renterShortageNow = renterMonthlyRent * 12 * 0.1;
  const renterShortageFuture = renterMonthlyRent * 12 * 0.05;
  const buyerScarcityNow = marketValue ? marketValue * 0.1 * 0.065 : null;
  const buyerScarcityFuture = buyerScarcityNow === null ? null : buyerScarcityNow / 2;
  const scarcityYield = marketValue ? marketValue * 0.1 * DEFAULTS.capRate : null;
  const scarcityYieldFuture = scarcityYield === null ? null : scarcityYield / 2;
  const redevelopmentTaxStepUp =
    currentAnnualTax !== null && benchmarkAnnualTax !== null
      ? Math.max(0, benchmarkAnnualTax - currentAnnualTax)
      : null;
  const redevelopmentTaxFuture = redevelopmentTaxStepUp === null ? null : redevelopmentTaxStepUp / 2;

  if (relationship === "renter") {
    const taxContext =
      advantage !== null && advantage > 250
        ? `This property appears to pay about ${signedDollarText(advantage)} less per year than a similar new or heavily changed residential property would under the benchmark. That saving belongs to the property owner unless competition or policy pushes it through to renters.`
        : advantage !== null && advantage < -250
          ? `This property does not show a tax discount versus the benchmark; it is modeled about ${signedDollarText(Math.abs(advantage))} higher per year. Your renter exposure is more likely the citywide shortage than this parcel's tax break.`
          : "This property does not show a large tax discount versus the benchmark. For a renter, the bigger exposure is usually the shortage of available homes.";

    return {
      eyebrow: "Renter impact",
      headline: "Your main cost is not the property-tax bill. It is the rent premium created when too few homes are available.",
      summary:
        "The address helps identify whether the building itself carries a tax advantage, but renters usually pay through market rent, moving costs, application costs, and lack of choices.",
      now: metric(
        "Current rules",
        renterShortageNow,
        "per renting household per year",
        `Modeled citywide rent-shortage burden using ${renterRentSource} and a 10% scarcity premium.`,
        "cost",
      ),
      future: metric(
        "If the package worked",
        renterShortageFuture,
        "per renting household per year",
        "Illustrative case where more supply and direct tenant support cut the shortage premium in half.",
        "benefit",
      ),
      change: metric(
        "Modeled renter savings",
        renterShortageFuture - renterShortageNow,
        "per year",
        "This is not a rent forecast for this unit; it shows the scale if market pressure eased for a household with this total unit rent.",
        "benefit",
      ),
      addressContext: `${addressName} is listed as ${propertyType}. ${taxContext}`,
      takeaways: [
        "A low tax bill for the property owner does not automatically mean a lower rent for you.",
        "If the building has a tax advantage, the policy question is whether any reform uses that value for tenant stability or more homes.",
        "If the building does not have a tax advantage, your issue is still real: scarcity can raise rent even when this specific parcel is not under-taxed.",
      ],
      caveats: [
        "This does not know your lease terms, income, subsidy status, roommate arrangement, or landlord expenses.",
        "If you live with roommates, enter the full rent for the whole unit, not only your personal share.",
        "The renter number is a citywide model, not a parcel-specific rent estimate.",
      ],
      nextStep: "Use the rent-shortage calculator below with your actual rent, then compare it with this parcel's tax position.",
    };
  }

  if (relationship === "owner_occupier") {
    const rawIncrease = annualIncreaseToCorridor ?? null;
    const modeledCashIncrease =
      rawIncrease === null ? null : Math.round(rawIncrease * incomeProtection.assumedCashExposure);
    const protectedOrDeferredIncrease =
      rawIncrease === null ? null : Math.max(0, rawIncrease - (modeledCashIncrease ?? 0));
    const modeledFutureTax =
      currentAnnualTax === null || modeledCashIncrease === null ? null : currentAnnualTax + modeledCashIncrease;
    const changeKind = modeledCashIncrease !== null && modeledCashIncrease > 0 ? "cost" : "neutral";
    const hasRawIncrease = rawIncrease !== null && rawIncrease > 0;
    const selectedIncome = householdIncomeBand !== "not_provided";

    return {
      eyebrow: "Owner-occupier impact",
      headline:
        hasRawIncrease && !selectedIncome
          ? "This address is below the minimum-share floor. Choose an income band to see whether the household is protected or exposed."
          : hasRawIncrease && incomeProtection.protected
          ? "This address is below the minimum-share floor, but the selected income band would protect most or all of the cash increase."
          : hasRawIncrease
            ? "This address is below the minimum-share floor, and the selected income band would carry some or all of the new tax burden."
          : "This address is already at or above the minimum-share floor, so this reform model shows no automatic tax increase.",
      summary:
        "For an owner who lives here, the key question is whether the tax system is protecting a household from shock or protecting a property advantage that can outlive the household need. A minimum floor raises low-share parcels, but household-income protection can change how much is paid in cash.",
      now: metric("Current modeled tax", currentAnnualTax, "per year", "Estimated from county real market value and assessed value.", "neutral"),
      future: metric(
        selectedIncome ? "Modeled cash bill" : "No income band selected",
        selectedIncome ? modeledFutureTax : corridorAnnualTax,
        "per year",
        selectedIncome
          ? `Applies the selected income-band assumption: ${incomeProtection.thresholdExplanation}`
          : "Shows the raw minimum-floor package before any household-income protection.",
        changeKind,
      ),
      change: metric(
        selectedIncome ? "Modeled cash increase" : "Raw floor increase",
        selectedIncome ? modeledCashIncrease : annualIncreaseToCorridor,
        "per year",
        selectedIncome
          ? `Protected/deferred amount in this model: ${signedDollarText(protectedOrDeferredIncrease)}.`
          : "Choose an income band to see how much of this floor increase would be protected or paid in cash.",
        changeKind,
      ),
      addressContext: `${addressName} is taxed on ${taxedShareText} of market value. The county assessed value is ${signedDollarText(assessedValue)} against a market value of ${signedDollarText(marketValue)}. Income assumption: ${incomeProtection.label}.`,
      takeaways: [
        "The most important number is assessed value divided by market value.",
        selectedIncome
          ? `${incomeProtection.shortLabel}: ${incomeProtection.note}`
          : "Add an income band to distinguish cash protection from a permanent property-tax advantage.",
        "If this address is already above the floor, any relief should be handled separately through income-based hardship rules, not an automatic cut.",
      ],
      caveats: [
        selectedIncome
          ? `This uses your selected ${incomeProtection.label} band, but does not verify eligibility details such as household size, age, disability status, exemptions, deferrals, bonds, or compression.`
          : "This does not know income band, age, disability status, exemptions, deferrals, bonds, or compression.",
        "The income bands are a policy model for this page, not current Oregon eligibility rules.",
      ],
      nextStep: selectedIncome
        ? "Compare the raw parcel floor increase with the modeled cash increase after income protection."
        : "Choose an income band to see whether this household would be protected, partially exposed, or fully exposed.",
    };
  }

  if (relationship === "owner_landlord") {
    const corridorKind: ParcelImpactMetric["kind"] =
      annualIncreaseToCorridor !== null && annualIncreaseToCorridor > 0
        ? "cost"
        : "neutral";

    return {
      eyebrow: "Rental-owner impact",
      headline:
        positiveAdvantage !== null && positiveAdvantage > 0
          ? "This address may produce extra cash flow because market rent is not automatically tied to the owner's lower tax bill."
          : "This rental property does not show a clear property-tax discount, so the bigger economics may be rent level, debt, operating costs, and vacancy.",
      summary:
        "For a landlord, a lower taxable value is valuable when rents are set by the market. The policy question is whether that advantage should stay private or help fund tenant stability and housing supply.",
      now: metric("Owner tax advantage", positiveAdvantage, "per year", "Modeled savings versus a similar new or heavily changed property benchmark.", positiveAdvantage ? "benefit" : "neutral"),
      future: metric("Minimum floor increase", annualIncreaseToCorridor, "per year", "Simplified added tax if the parcel is below the floor. Above-floor parcels show $0.", corridorKind),
      change: metric("Net annual shift", annualIncreaseToCorridor, "per year", "Positive means the property gives up some annual cash flow; $0 means no floor increase.", corridorKind),
      addressContext: `${addressName} is taxed on ${taxedShareText} of market value. Renters at the property do not automatically receive any tax advantage.`,
      takeaways: [
        "If rents are market-set, a lower tax bill can increase owner cash flow without lowering rent.",
        "A reform package could target non-owner-occupied property more strongly than owner-occupied households.",
        "Tenant stability funding is one way to convert private tax advantage into public housing stability.",
      ],
      caveats: ["This does not model mortgage debt, maintenance, insurance, vacancy, rent regulation, or actual lease levels."],
      nextStep: "Compare the annual tax advantage with rent levels and decide what share should be public benefit.",
    };
  }

  if (relationship === "buyer") {
    return {
      eyebrow: "Buyer impact",
      headline:
        advantage !== null && advantage > 0
          ? "A low tax bill can make this property more valuable to buy, but it also means similar newer homes may be treated worse."
          : "This address does not show a big inherited tax discount, so your bigger cost may be the purchase-price premium from scarce housing.",
      summary:
        "For buyers, the hidden cost shows up two ways: the future tax bill attached to the parcel and the price premium caused by too few homes in the market.",
      now: metric("Scarcity price burden", buyerScarcityNow, "per year of mortgage cost", "Approximate yearly mortgage cost of a 10% shortage premium on this address's market value.", "cost"),
      future: metric("If scarcity eased", buyerScarcityFuture, "per year of mortgage cost", "Illustrative case where the shortage premium is cut in half.", "benefit"),
      change: metric("Modeled buyer savings", buyerScarcityFuture === null || buyerScarcityNow === null ? null : buyerScarcityFuture - buyerScarcityNow, "per year", "Negative means lower annual mortgage burden from less scarcity.", "benefit"),
      addressContext: `${addressName} is taxed on ${taxedShareText} of market value. The modeled annual tax difference versus the benchmark is ${signedDollarText(advantage)}.`,
      takeaways: [
        "A lower future tax bill can get capitalized into a higher sale price.",
        "A buyer of a newer or heavily changed home may face a higher tax basis than a buyer of an older low-tax property.",
        "The shortage premium can matter more than the tax difference when few homes are available.",
      ],
      caveats: ["This does not know your down payment, interest rate, lender terms, exemptions, or actual sale price."],
      nextStep: "Use both numbers: annual tax difference and shortage-driven mortgage premium.",
    };
  }

  if (relationship === "builder") {
    return {
      eyebrow: "Builder impact",
      headline:
        redevelopmentTaxStepUp !== null && redevelopmentTaxStepUp > 0
          ? "If this parcel becomes new housing, it may move from an old tax position toward today's cost stack."
          : "This parcel does not show a large tax step-up by itself, so project feasibility likely turns on fees, delay, financing, and required affordability.",
      summary:
        "For a project sponsor, the address is useful because it shows the starting parcel. The real decision is whether a new project can survive taxes, fees, financing costs, delay, and affordability requirements.",
      now: metric("Tax step-up signal", redevelopmentTaxStepUp, "per year", "Current tax bill versus the changed-property benchmark before adding fees and delay.", "cost"),
      future: metric("If backfilled or reduced", redevelopmentTaxFuture, "per year", "Illustrative case where public backfill or reform cuts this burden in half.", "benefit"),
      change: metric("Modeled project relief", redevelopmentTaxFuture === null || redevelopmentTaxStepUp === null ? null : redevelopmentTaxFuture - redevelopmentTaxStepUp, "per year", "Negative means less annual burden on the project.", "benefit"),
      addressContext: `${addressName} is ${propertyType} with ${parcel.units ?? "unknown"} listed unit(s), zone ${parcel.zone ?? "not listed"}, and a taxed share of ${taxedShareText}.`,
      takeaways: [
        "The current parcel tax position matters, but it is not the whole project feasibility story.",
        "New housing usually has to carry today's tax basis plus fees, delay, interest, and affordability costs.",
        "A serious package should say which public costs are worth funding publicly instead of loading onto the next project.",
      ],
      caveats: ["This is not a pro forma. It does not include land price, construction cost, SDCs, inclusionary housing, financing, or review timeline."],
      nextStep: "Use the project feasibility calculator with real project assumptions.",
    };
  }

  if (relationship === "business_owner") {
    return {
      eyebrow: "Business-property impact",
      headline:
        advantage !== null && advantage > 0
          ? "This commercial parcel appears to carry a low taxable-value share, but the current model treats commercial results as directional."
          : "This commercial parcel does not show a clear tax discount under the residential benchmark comparison.",
      summary:
        "For a business or commercial property owner, the same basic issue can exist: some property pays on much less than market value. Commercial rules need their own model before this should drive policy.",
      now: metric("Directional tax advantage", advantage, "per year", "Compared with the residential changed-property benchmark, shown only as a rough signal.", advantage !== null && advantage > 0 ? "benefit" : "neutral"),
      future: metric("Commercial reform case", null, "not modeled yet", "Needs commercial changed-property ratios and parcel-class analysis.", "neutral"),
      change: metric("Annual change", null, "not modeled yet", "The site should not imply a commercial tax change until the commercial model exists.", "neutral"),
      addressContext: `${addressName} is listed as ${propertyType}. Its taxed share is ${taxedShareText}, but commercial property should not be judged only against the residential benchmark.`,
      takeaways: [
        "Commercial parcels can also carry hidden tax advantages or disadvantages.",
        "Business tenants may feel the cost through rent, CAM charges, or location scarcity.",
        "A future version should separate owner-occupied small businesses from passive commercial property ownership.",
      ],
      caveats: ["Commercial changed-property ratios and lease pass-through terms are not yet modeled."],
      nextStep: "Use this as a flag, not a conclusion, until the commercial cohort model is added.",
    };
  }

  if (relationship === "neighbor") {
    return {
      eyebrow: "Neighbor impact",
      headline:
        "Your direct bill may not change because of this parcel, but the address shows the financial incentives around neighborhood change.",
      summary:
        "For neighbors, the issue is less this parcel's bill and more whether scarcity, low tax bases, and rising land values reward blocking new homes nearby.",
      now: metric("Scarcity value signal", scarcityYield, "per year", "Annualized value of a 10% scarcity premium on this address's market value.", "benefit"),
      future: metric("If scarcity eased", scarcityYieldFuture, "per year", "Illustrative case where added supply cuts that scarcity premium in half.", "cost"),
      change: metric("Modeled value shift", scarcityYieldFuture === null || scarcityYield === null ? null : scarcityYieldFuture - scarcityYield, "per year", "Negative means less scarcity value attached to nearby property.", "cost"),
      addressContext: `${addressName} is taxed on ${taxedShareText} of market value. The parcel helps show whether local rules are protecting an old tax position, a scarce asset, or both.`,
      takeaways: [
        "Neighborhood stability can be real, but scarcity also creates private financial upside.",
        "The cost of blocking homes is spread across renters, buyers, workers, and future residents.",
        "A fair package should distinguish livability concerns from financial scarcity protection.",
      ],
      caveats: ["This does not know whether you own, rent, support, or oppose any specific project."],
      nextStep: "Use the parcel result to separate real local impacts from incentives created by scarcity.",
    };
  }

  return {
    eyebrow: "Address impact",
    headline: "This address gives you a starting point: how much of its market value is actually taxed.",
    summary:
      "Pick the relationship that best describes you. The meaning changes depending on whether you rent, own, buy, build, operate a business, or live nearby.",
    now: metric("Current modeled tax", currentAnnualTax, "per year", "Estimated from county real market value and assessed value.", "neutral"),
    future: metric("Minimum floor package", corridorAnnualTax, "per year", "Simplified floor scenario that only raises parcels below the floor.", "neutral"),
    change: metric("Reform increase", annualIncreaseToCorridor, "per year", "Positive means more tax under the floor. $0 means no automatic increase.", "neutral"),
    addressContext: `${addressName} is taxed on ${taxedShareText} of market value.`,
    takeaways: [
      "The same parcel can mean different things to different people.",
      "The tax bill is only one part of the housing-cost system.",
      "Use the dropdown to translate the parcel into your actual position.",
    ],
    caveats: ["This is an educational model, not an official tax estimate."],
    nextStep: "Choose a relationship from the dropdown, then rerun the lookup.",
  };
}

function classifyWithTaxShare({
  parcel,
  relationship,
  assessedValue,
  marketValue,
}: {
  parcel: ParcelFacts;
  relationship: ParcelRelationship;
  assessedValue: number;
  marketValue: number;
}): Pick<ParcelClassification, "primaryCohort" | "plainEnglish" | "relatedCohorts"> {
  const taxedShare = marketValue > 0 ? assessedValue / marketValue : null;
  const lowTaxShare = taxedShare !== null && taxedShare <= 0.35;
  const moderateTaxShare = taxedShare !== null && taxedShare > 0.35 && taxedShare <= 0.5;
  const highTaxShare = taxedShare !== null && taxedShare > 0.55;
  const multifamily = isLikelyMultifamily(parcel);
  const residential = isLikelyResidential(parcel);
  const taxedShareText = taxedShare === null ? "unknown" : `${Math.round(taxedShare * 100)}%`;

  if (!residential || relationship === "business_owner") {
    return {
      primaryCohort: lowTaxShare
        ? "Business or commercial parcel with a low taxable-value share"
        : "Business or commercial parcel closer to today's tax base",
      plainEnglish: lowTaxShare
        ? "This parcel appears non-residential and is being taxed on a relatively small share of market value. That can be a real property advantage, but this page does not yet model commercial changed-property ratios."
        : "This parcel appears non-residential and does not show the same very low taxable-value share as the strongest Measure 50 advantage examples.",
      relatedCohorts: [
        {
          label: "Local businesses and commercial property owners",
          reason: `The entered taxable-value share is ${taxedShareText}. Treat the dollar comparison as directional until commercial ratios are added.`,
        },
      ],
    };
  }

  if (relationship === "renter") {
    return {
      primaryCohort: multifamily
        ? "Renter in an existing rental property"
        : "Renter or household affected by the local housing shortage",
      plainEnglish:
        "The parcel record can describe the building, but it cannot prove how much of the owner's tax advantage reaches you as lower rent. Your personal burden is mostly rent pressure, moving costs, and how many homes are available.",
      relatedCohorts: [
        {
          label: lowTaxShare ? "Renter in older low-tax rental stock" : "Renter searching in today's market",
          reason: `The parcel's entered taxable-value share is ${taxedShareText}; renters do not automatically receive that benefit.`,
        },
      ],
    };
  }

  if (relationship === "owner_landlord") {
    return {
      primaryCohort: lowTaxShare
        ? "Landlord with an older low-tax-bill property"
        : "Rental-property owner closer to today's tax base",
      plainEnglish: lowTaxShare
        ? "This looks like a rental property where the tax system counts a relatively small share of market value. That can create extra cash flow if rents are set by the market."
        : "This property does not show the same large tax-bill discount as a very low-tax legacy parcel.",
      relatedCohorts: [
        {
          label: "Landlords with older low-tax-bill buildings",
          reason: `The entered taxable-value share is ${taxedShareText}.`,
        },
      ],
    };
  }

  if (relationship === "buyer") {
    return {
      primaryCohort: lowTaxShare
        ? "Buyer of a property carrying an old low tax bill"
        : "Buyer paying closer to today's tax base",
      plainEnglish: lowTaxShare
        ? "If this parcel sells with a low taxable value, part of that lower future tax bill can be reflected in the price. The buyer gets a lower bill than a similar new home."
        : "This parcel appears closer to today's taxable-value level, so the hidden tax-bill discount is smaller.",
      relatedCohorts: [
        {
          label: "First-time buyers and move-up buyers",
          reason: "Sale price, future tax bill, and the shortage premium all matter for a buyer's annual cost.",
        },
      ],
    };
  }

  if (relationship === "builder") {
    return {
      primaryCohort: "Builder or project sponsor facing today's cost stack",
      plainEnglish:
        "A parcel lookup can show whether the land is carrying an old tax position, but a new or heavily changed project usually faces today's changed-property ratio, fees, interest, delay, and affordability requirements.",
      relatedCohorts: [
        {
          label: multifamily ? "New multifamily projects" : "Small infill builders",
          reason: "The project cohort depends more on project type, review path, fees, and timing than the current owner's tax bill.",
        },
      ],
    };
  }

  if (relationship === "neighbor") {
    return {
      primaryCohort: lowTaxShare
        ? "Nearby homeowner in a low-tax-bill environment"
        : "Nearby resident affected by neighborhood change and housing scarcity",
      plainEnglish:
        "For neighbors, the parcel's tax status is only part of the story. The bigger question is whether current rules protect existing property value while pushing housing costs onto people trying to move nearby.",
      relatedCohorts: [
        {
          label: "Homeowners who oppose new housing nearby",
          reason: "This does not assume your position; it shows the financial incentive that can exist when scarcity raises property values.",
        },
      ],
    };
  }

  if (highTaxShare) {
    return {
      primaryCohort: "Owner paying a higher share than many older low-tax parcels",
      plainEnglish:
        "This parcel is being taxed on a higher share of market value than many older low-tax parcels. Under today's rules, this address looks more burdened by the tax formula than parcels with much lower taxable-value shares.",
      relatedCohorts: [
        {
          label: "Higher-share homeowners",
          reason: `The entered taxable-value share is ${taxedShareText}. That means a larger slice of market value is already counted for taxes than on many low-tax older parcels.`,
        },
      ],
    };
  }

  if (lowTaxShare) {
    return {
      primaryCohort: "Long-held owner-occupier or low-tax-bill property",
      plainEnglish:
        "This looks like a property where the tax system counts a small share of market value. That can be legitimate household protection, but it can also be a valuable property advantage.",
      relatedCohorts: [
        {
          label: "Long-held owner-occupiers in high-appreciation neighborhoods",
          reason: `The entered taxable-value share is ${taxedShareText}.`,
        },
        {
          label: "Older and fixed-income homeowners",
          reason: "If the owner has low or fixed income, today's lower tax bill may be important household protection rather than spare wealth.",
        },
      ],
    };
  }

  if (moderateTaxShare) {
    return {
      primaryCohort: "Owner in the middle of today's tax-base spread",
      plainEnglish:
        "This property is not at the very low end and not at the highest end. Today's rules count a middle share of market value, so the household story depends more on income, tenure, and whether the owner actually lives here.",
      relatedCohorts: [
        {
          label: "Mixed / depends",
          reason: `The entered taxable-value share is ${taxedShareText}. The household's income, age, tenure, and property use matter.`,
        },
      ],
    };
  }

  return {
    primaryCohort: "Parcel closer to today's tax base",
    plainEnglish:
      "This property does not appear to have a very low taxable-value share. The hidden benefit is smaller than it is for parcels taxed on much less of their market value.",
    relatedCohorts: [
      {
        label: "Mixed / depends",
        reason: `The entered taxable-value share is ${taxedShareText}.`,
      },
    ],
  };
}

function classifyParcel({
  parcel,
  assessedValue,
  marketValueOverride,
  relationship = "unknown",
  monthlyRent,
  householdIncomeBand = "not_provided",
}: {
  parcel: ParcelFacts;
  assessedValue?: number | null;
  marketValueOverride?: number | null;
  relationship?: ParcelRelationship;
  monthlyRent?: number | null;
  householdIncomeBand?: HouseholdIncomeBand;
}): ParcelClassification {
  const marketValue = marketValueOverride && marketValueOverride > 0 ? marketValueOverride : parcel.latestMarketValue.value;
  const incomeProtection = incomeProtectionForBand(householdIncomeBand);
  const multifamily = isLikelyMultifamily(parcel);
  const residential = isLikelyResidential(parcel);
  const benchmarkRatio = multifamily ? DEFAULTS.multifamilyCpr : DEFAULTS.residentialCpr;
  const benchmarkLabel = multifamily
    ? "Multifamily changed-property ratio"
    : residential
      ? "Residential changed-property ratio"
      : "Residential benchmark shown for rough comparison";
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!marketValue || marketValue <= 0) {
    missing.push("A usable market value from PortlandMaps Taxlots.");
  }

  if (!assessedValue || assessedValue <= 0) {
    missing.push("The assessed or taxable value from the property tax bill.");
  }

  if (!marketValue || marketValue <= 0 || !assessedValue || assessedValue <= 0) {
    const fallbackCurrentPolicyImpact = currentPolicyImpact({
      parcel,
      relationship,
      householdIncomeBand,
      assessedValue: assessedValue ?? null,
      marketValue: marketValue ?? null,
      taxedShare: null,
      annualAdvantageVsBenchmark: null,
      monthlyRent,
    });
    const fallbackImpactBrief = buildImpactBrief({
      parcel,
      relationship,
      householdIncomeBand,
      assessedValue: assessedValue ?? null,
      marketValue: marketValue ?? null,
      taxedShare: null,
      currentAnnualTax: null,
      benchmarkAnnualTax: marketValue ? annualTax(marketValue, benchmarkRatio) : null,
      corridorAnnualTax: marketValue ? annualTax(marketValue, 0.5) : null,
      annualAdvantageVsBenchmark: null,
      annualIncreaseToCorridor: null,
      monthlyRent,
    });

    return {
      canClassify: false,
      relationship,
      householdIncomeBand,
      incomeProtection,
      primaryCohort: "One number missing before this can classify the tax cohort",
      plainEnglish:
        "PortlandMaps can usually provide parcel facts and market value. To identify the Measure 50 cohort, we also need assessed value because the key number is assessed value divided by market value.",
      currentPolicyImpact: fallbackCurrentPolicyImpact,
      impactBrief: fallbackImpactBrief,
      relatedCohorts: [
        {
          label: relationshipLabel(relationship),
          reason: "Your relationship to the parcel helps separate owners, renters, buyers, builders, and nearby residents.",
        },
      ],
      missing,
      assessedValue: assessedValue ?? null,
      marketValue: marketValue ?? null,
      taxedShare: null,
      benchmarkRatio,
      benchmarkLabel,
      currentAnnualTax: null,
      benchmarkAnnualTax: marketValue ? annualTax(marketValue, benchmarkRatio) : null,
      corridorAnnualTax: marketValue ? annualTax(marketValue, 0.5) : null,
      annualAdvantageVsBenchmark: null,
      annualIncreaseToCorridor: null,
      warnings,
    };
  }

  const taxedShare = assessedValue / marketValue;
  const currentAnnualTax = annualTax(marketValue, taxedShare);
  const benchmarkAnnualTax = annualTax(marketValue, benchmarkRatio);
  const minimumFloorAnnualTax = annualTax(marketValue, 0.5);
  const corridorAnnualTax = Math.max(currentAnnualTax, minimumFloorAnnualTax);
  const annualIncreaseToCorridor = Math.max(0, minimumFloorAnnualTax - currentAnnualTax);

  if (taxedShare > 1) {
    warnings.push("The assessed value entered is higher than the market value returned by PortlandMaps. Check both numbers before relying on the model.");
  }

  if (taxedShare < 0.15) {
    warnings.push("This is an unusually low taxable-value share. Verify the assessed value is for the same parcel and tax year.");
  }

  if (!residential) {
    warnings.push("This parcel appears non-residential. The page does not yet model commercial changed-property ratios, so use the tax comparison as a rough signal.");
  }

  const cohort = classifyWithTaxShare({ parcel, relationship, assessedValue, marketValue });
  const currentPolicy = currentPolicyImpact({
    parcel,
    relationship,
    householdIncomeBand,
    assessedValue,
    marketValue,
    taxedShare,
    annualAdvantageVsBenchmark: benchmarkAnnualTax - currentAnnualTax,
    monthlyRent,
  });
  const impactBrief = buildImpactBrief({
    parcel,
    relationship,
    householdIncomeBand,
    assessedValue,
    marketValue,
    taxedShare,
    currentAnnualTax,
    benchmarkAnnualTax,
    corridorAnnualTax,
    annualAdvantageVsBenchmark: benchmarkAnnualTax - currentAnnualTax,
    annualIncreaseToCorridor,
    monthlyRent,
  });

  return {
    canClassify: true,
    relationship,
    householdIncomeBand,
    incomeProtection,
    primaryCohort: cohort.primaryCohort,
    plainEnglish: cohort.plainEnglish,
    currentPolicyImpact: currentPolicy,
    impactBrief,
    relatedCohorts: cohort.relatedCohorts,
    missing,
    assessedValue,
    marketValue,
    taxedShare,
    benchmarkRatio,
    benchmarkLabel,
    currentAnnualTax,
    benchmarkAnnualTax,
    corridorAnnualTax,
    annualAdvantageVsBenchmark: benchmarkAnnualTax - currentAnnualTax,
    annualIncreaseToCorridor,
    warnings,
  };
}

async function geocodeAddress(address: string): Promise<GeocodeCandidate | null> {
  const url = buildUrl(GEOCODE_URL, {
    Address: address,
    f: "json",
    outFields: "*",
    maxLocations: "1",
    outSR: "4326",
  });

  const data = await fetchJson<{ candidates?: GeocodeCandidate[] }>(url);
  return data.candidates?.[0] ?? null;
}

async function queryAtPoint<T>(url: string, fields: readonly string[], x: number, y: number): Promise<T | null> {
  const queryUrl = buildUrl(url, {
    geometry: JSON.stringify({ x, y }),
    geometryType: "esriGeometryPoint",
    spatialRel: "esriSpatialRelIntersects",
    outFields: fields.join(","),
    returnGeometry: "false",
    f: "json",
    inSR: "4326",
  });

  const data = await fetchJson<ArcGISQueryResponse<T>>(queryUrl);
  if (data.error) {
    throw new Error(data.error.message ?? "PortlandMaps query error");
  }

  return data.features?.[0]?.attributes ?? null;
}

async function queryByPropertyId<T>(
  url: string,
  fields: readonly string[],
  fieldName: string,
  propertyId: string,
): Promise<T | null> {
  const queryUrl = buildUrl(url, {
    where: `${fieldName} = '${propertyId.replace(/'/g, "''")}'`,
    outFields: fields.join(","),
    returnGeometry: "false",
    f: "json",
  });

  const data = await fetchJson<ArcGISQueryResponse<T>>(queryUrl);
  if (data.error) {
    throw new Error(data.error.message ?? "PortlandMaps property query error");
  }

  return data.features?.[0]?.attributes ?? null;
}

function buildParcelFacts({
  candidate,
  bds,
  taxlot,
  propertyId,
  taxGraphResult,
}: {
  candidate: GeocodeCandidate | null;
  bds: RawBdsProperty | null;
  taxlot: RawTaxlot | null;
  propertyId?: string | null;
  taxGraphResult?: TaxGraphSearchResult | null;
}): ParcelFacts {
  const values = latestMarketValue(taxlot);
  const address = toStringOrNull(taxlot?.SITEADDR) ?? toStringOrNull(bds?.ADDRESS_SITUS) ?? taxGraphResult?.streetAddress ?? candidate?.address ?? null;
  const normalizedPropertyId = toStringOrNull(taxlot?.PROPERTYID) ?? toStringOrNull(bds?.PROPERTY_ID) ?? propertyId ?? taxGraphResult?.propertyId ?? null;

  return {
    matchedAddress: candidate?.address ?? taxGraphResult?.streetAddress ?? address ?? normalizedPropertyId ?? "Matched parcel",
    geocodeScore: candidate?.score ?? 0,
    location: {
      x: candidate?.location?.x ?? 0,
      y: candidate?.location?.y ?? 0,
    },
    address,
    propertyId: normalizedPropertyId,
    multnomahPropertyId: toStringOrNull(bds?.PROPERTY_ID_MULTNOMAH_COUNTY),
    stateId: toStringOrNull(taxlot?.STATE_ID) ?? toStringOrNull(bds?.STATE_ID),
    taxlotId: toStringOrNull(taxlot?.TLID),
    neighborhood: toStringOrNull(bds?.NEIGHBORHOOD),
    neighborhoodDistrict: toStringOrNull(bds?.NEIGHBORHOOD_DISTRICT) ?? toStringOrNull(bds?.NEIGHBORHOOD_COALITION),
    councilDistrict: toStringOrNull(bds?.COUNCIL_DISTRICT),
    zone: toStringOrNull(bds?.ZONE),
    county: toStringOrNull(taxlot?.COUNTY) ?? toStringOrNull(bds?.COUNTY),
    propertyType: toStringOrNull(bds?.BDS_PROPERTY_TYPE),
    dwellingType: toStringOrNull(bds?.BDS_DWELLING_TYPE),
    propertyCode: toStringOrNull(taxlot?.PROP_CODE),
    propertyCodeDescription: toStringOrNull(taxlot?.PRPCD_DESC),
    landUse: toStringOrNull(taxlot?.LANDUSE),
    yearBuilt: toStringOrNull(taxlot?.YEARBUILT),
    buildingSqft: toNumber(taxlot?.BLDGSQFT),
    units: toNumber(taxlot?.UNITS),
    lotSizeSqft: toNumber(bds?.AREA_SQ_FT),
    latestMarketValue: values.latest,
    priorMarketValues: values.prior,
    saleDate: normalizeSaleDate(taxlot?.SALEDATE),
    salePrice: toNumber(taxlot?.SALEPRICE),
    source: toStringOrNull(taxlot?.SOURCE),
  };
}

export function normalizeRelationship(value: string | null): ParcelRelationship {
  if (
    value === "owner_occupier" ||
    value === "owner_landlord" ||
    value === "renter" ||
    value === "buyer" ||
    value === "builder" ||
    value === "business_owner" ||
    value === "neighbor"
  ) {
    return value;
  }

  return "unknown";
}

export function parseCurrencyInput(value: string | null): number | null {
  return toNumber(value);
}

async function resolveParcel(input: string): Promise<{
  candidate: GeocodeCandidate | null;
  taxGraphResult: TaxGraphSearchResult | null;
  bds: RawBdsProperty | null;
  taxlot: RawTaxlot | null;
  propertyId: string | null;
}> {
  const directPropertyId = normalizePropertyId(input);

  if (directPropertyId) {
    const [bds, taxlot] = await Promise.all([
      queryByPropertyId<RawBdsProperty>(BDS_PROPERTY_URL, BDS_FIELDS, "PROPERTY_ID", directPropertyId),
      queryByPropertyId<RawTaxlot>(TAXLOTS_URL, TAXLOT_FIELDS, "PROPERTYID", directPropertyId),
    ]);

    return {
      candidate: null,
      taxGraphResult: null,
      bds,
      taxlot,
      propertyId: directPropertyId,
    };
  }

  const candidate = await geocodeAddress(input).catch(() => null);
  if (candidate?.location && (candidate.score ?? 0) >= 70) {
    const [bds, taxlot] = await Promise.all([
      queryAtPoint<RawBdsProperty>(BDS_PROPERTY_URL, BDS_FIELDS, candidate.location.x, candidate.location.y),
      queryAtPoint<RawTaxlot>(TAXLOTS_URL, TAXLOT_FIELDS, candidate.location.x, candidate.location.y),
    ]);
    const propertyId = toStringOrNull(taxlot?.PROPERTYID) ?? toStringOrNull(bds?.PROPERTY_ID);

    if (propertyId) {
      return {
        candidate,
        taxGraphResult: null,
        bds,
        taxlot,
        propertyId,
      };
    }
  }

  const [taxGraphResult] = await searchTaxGraph(input);
  if (!taxGraphResult) {
    throw new Error("Could not find a confident parcel match from PortlandMaps or TaxGraph.");
  }

  const [bds, taxlot] = await Promise.all([
    queryByPropertyId<RawBdsProperty>(BDS_PROPERTY_URL, BDS_FIELDS, "PROPERTY_ID", taxGraphResult.propertyId),
    queryByPropertyId<RawTaxlot>(TAXLOTS_URL, TAXLOT_FIELDS, "PROPERTYID", taxGraphResult.propertyId),
  ]);

  return {
    candidate,
    taxGraphResult,
    bds,
    taxlot,
    propertyId: taxGraphResult.propertyId,
  };
}

export async function lookupParcel(input: ParcelLookupInput): Promise<ParcelLookupResult> {
  const address = input.address.trim();
  if (address.length < 4) {
    throw new Error("Enter a Portland address or parcel ID.");
  }

  const resolved = await resolveParcel(address);
  const parcel = buildParcelFacts(resolved);
  const taxAssessment =
    (await lookupTaxGraphAssessment(resolved.propertyId ?? parcel.propertyId)) ??
    (await lookupMultcoTaxAssessment(resolved.propertyId ?? parcel.propertyId));
  const assessedValue = input.assessedValue ?? taxAssessment?.assessedValue ?? null;
  const classification = classifyParcel({
    parcel,
    assessedValue,
    marketValueOverride: taxAssessment?.realMarketValue,
    relationship: input.relationship ?? "unknown",
    monthlyRent: input.monthlyRent ?? null,
    householdIncomeBand: input.householdIncomeBand ?? "not_provided",
  });

  return {
    parcel,
    taxAssessment,
    classification,
    sources: [
      {
        label: "PortlandMaps Taxlots ArcGIS layer",
        url: "https://www.portlandmaps.com/arcgis/rest/services/Public/Taxlots/MapServer/0",
      },
      {
        label: "PortlandMaps BDS Property ArcGIS layer",
        url: "https://www.portlandmaps.com/arcgis/rest/services/Public/BDS_Property/FeatureServer/0",
      },
      {
        label: "Multnomah County property assessment FAQs",
        url: "https://multco.us/info/property-assessment-faqs",
      },
      ...(taxAssessment
        ? [
            {
              label: taxAssessment.sourceName,
              url: taxAssessment.sourceUrl,
            },
          ]
        : []),
    ],
    privacyNote:
      "This lookup intentionally requests only parcel facts needed for the model. It does not return owner names or owner mailing addresses.",
    methodNote:
      "Cohort classification uses Multnomah County assessed value when available, the latest county real-market value where available, and a manual assessed-value override only if supplied. It is an educational model, not an official tax estimate.",
  };
}
