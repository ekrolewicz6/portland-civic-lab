/**
 * Categorical palette for the four public listing networks. Fixed order, never
 * cycled. Adjacent pairs were checked for colour-vision separation on the paper
 * surface (#f7f3ed) and the canopy surface (#0f2419); every use also carries a
 * legend and contiguous grouping, so identity is never colour alone.
 */
export const NETWORK_ORDER = ['market-directory', 'potters-directory', 'guilds-2026', 'open-studios-2025'] as const;

export const NETWORK_NAMES: Record<string, string> = {
  'market-directory': 'Portland Saturday Market',
  'potters-directory': 'Ceramic Showcase',
  'guilds-2026': 'Gathering of the Guilds',
  'open-studios-2025': 'Portland Open Studios',
};

export const NETWORK_NOTES: Record<string, string> = {
  'market-directory': 'Undated craft-vendor directory',
  'potters-directory': 'Undated artist directory',
  'guilds-2026': '2026 exhibitors, including shared booths',
  'open-studios-2025': '2025 tour profiles',
};

export const NETWORK_COLORS_LIGHT: Record<string, string> = {
  'market-directory': '#2e8b57',
  'potters-directory': '#2f7fb8',
  'guilds-2026': '#c8701a',
  'open-studios-2025': '#b4487a',
};

export const NETWORK_COLORS_DARK: Record<string, string> = {
  'market-directory': '#4fb079',
  'potters-directory': '#4f98d2',
  'guilds-2026': '#d4862a',
  'open-studios-2025': '#cf6ea3',
};
