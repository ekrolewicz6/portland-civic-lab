import type { Geometry } from "geojson";

export type FireKind = "prescribed" | "wildfire" | "planned";
export type RecordKind =
  | "treatment"
  | "planning-unit"
  | "registration"
  | "permit"
  | "ignition"
  | "accomplishment"
  | "occurrence"
  | "perimeter";
export interface FireRecord {
  id: string;
  sourceId: string;
  nativeId: string;
  name: string;
  kind: FireKind;
  recordKind: RecordKind;
  agency: string;
  county: string | null;
  method: string;
  purpose: string | null;
  status: string;
  date: string | null;
  datePrecision: "day" | "month" | "year" | "unknown";
  year: number | null;
  treatmentAcres: number | null;
  burnedAcres: number | null;
  polygonAcres: number | null;
  geometryMeaning: string;
  accuracy: string;
  sourceUrl: string;
  documentIds: string[];
  irwinId: string | null;
  sourceUpdatedAt: string | null;
  reportedYear?: number | null;
  reportedDate?: string | null;
  dateNote?: string | null;
  lastObservedAt?: string;
  inLatestFeed?: boolean;
}
export interface FireSource {
  id: string;
  name: string;
  agency: string;
  url: string;
  endpoint?: string;
  where?: string;
  spatialEnvelope?: [number, number, number, number];
  fields?: string[];
  cadenceHours?: number;
  coverage: string;
  limitations: string;
  verification: "queried" | "discovered" | "downloaded";
  role: "primary" | "enrichment" | "requested";
}
export interface SourceCoverage extends FireSource {
  lastSuccess: string | null;
  error: string | null;
  recordCount: number | null;
  heldCount: number | null;
  minYear: number | null;
  maxYear: number | null;
  unlocatedCount?: number | null;
  state: "available" | "stale" | "unavailable";
}
export interface MapItem {
  id: string;
  geometry: Geometry;
  name: string;
  kind: FireKind | "mixed";
  count?: number;
}
export interface RecordResult {
  dataStatus: "available" | "unavailable";
  records: FireRecord[];
  total: number;
  nextCursor: string | null;
  map: MapItem[];
  aggregated: boolean;
  sourceCounts: { sourceId: string; count: number }[];
  filters: {
    agencies: string[];
    methods: string[];
    purposes: string[];
    statuses: string[];
  };
  error?: string;
}
