export type LocationTier = "flagship" | "commons";

/** Marker styling for the real Leaflet map, keyed to the future model's own layers. */
export const TIER_META: Record<LocationTier, { label: string; color: string; radius: number }> = {
  flagship: { label: "Flagships (Layer 3)", color: "#c8956c", radius: 11 },
  commons: { label: "Neighborhood commons (Layer 2)", color: "#1a3a2a", radius: 7 },
};

/** Centered roughly on the county's populated span, downtown to Troutdale. */
export const MAP_CENTER: [number, number] = [45.5225, -122.585];
export const MAP_DEFAULT_ZOOM = 10.4;
