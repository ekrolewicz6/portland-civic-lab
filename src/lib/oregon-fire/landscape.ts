import type { MapItem } from "./types";

export const MTBS_WMS = "https://edcintl.cr.usgs.gov/geoserver/mtbs/ows";
export const MTBS_VERIFIED_YEAR = 2026;
export const MTBS_LEGEND = [
  ["#008080", "Unburned to low"],
  ["#52CCCC", "Low"],
  ["#FFE820", "Moderate"],
  ["#A80000", "High"],
  ["#39B54A", "Increased greenness"],
  ["#FFFFFF", "Non-processing mask"],
] as const;
export function scarColor(year: number, end: number) {
  const age = end - year;
  return [
    "#963921",
    "#b5532d",
    "#c97740",
    "#c58d54",
    "#c49f70",
    "#b7a58b",
    "#a8a895",
    "#96a396",
    "#87958b",
    "#76867d",
  ][Math.max(0, Math.min(9, age))];
}
export interface ScarItem extends MapItem {
  year: number;
  sourceId: string;
}
export interface LandscapeResult {
  scars: ScarItem[];
  total: number;
  from: number;
  to: number;
  years: { year: number; count: number }[];
  coverage: {
    sourceId: string;
    lastSuccess: string | null;
    maxYear: number | null;
    state: string;
  }[];
}
