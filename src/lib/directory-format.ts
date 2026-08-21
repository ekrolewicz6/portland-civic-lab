/**
 * Shared formatting helpers for the business directory
 * (used by both the directory cards and the business detail page).
 */

function titleCase(str: string): string {
  const smallWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at",
    "to", "by", "in", "of", "up", "as", "is", "it", "if",
  ]);
  return str
    .toLowerCase()
    .split(" ")
    .map((w, i) => {
      if (i === 0 || !smallWords.has(w)) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }
      return w;
    })
    .join(" ");
}

export function formatEntityType(raw: string): string {
  const map: Record<string, string> = {
    "DOMESTIC LIMITED LIABILITY COMPANY": "Limited Liability Company",
    "DOMESTIC BUSINESS CORPORATION": "Business Corporation",
    "DOMESTIC NONPROFIT CORPORATION": "Nonprofit Corporation",
    "DOMESTIC LIMITED PARTNERSHIP": "Limited Partnership",
    "DOMESTIC PROFESSIONAL CORPORATION": "Professional Corporation",
    "FOREIGN LIMITED LIABILITY COMPANY": "Foreign LLC",
    "FOREIGN BUSINESS CORPORATION": "Foreign Business Corporation",
    "FOREIGN NONPROFIT CORPORATION": "Foreign Nonprofit",
    "FOREIGN LIMITED PARTNERSHIP": "Foreign Limited Partnership",
    "ASSUMED BUSINESS NAME": "Assumed Business Name",
    "DOMESTIC GENERAL PARTNERSHIP": "General Partnership",
    "FOREIGN PROFESSIONAL CORPORATION": "Foreign Professional Corporation",
  };
  return map[raw.toUpperCase()] ?? titleCase(raw);
}

/** Map entity types to tier-like badge colors */
export function entityBadgeColor(entityType: string): {
  bg: string;
  text: string;
  border: string;
} {
  const t = entityType.toUpperCase();
  if (t.includes("DOMESTIC") && t.includes("LIMITED LIABILITY"))
    return {
      bg: "bg-[var(--color-canopy)]/8",
      text: "text-[var(--color-canopy)]",
      border: "border-[var(--color-canopy)]/20",
    };
  if (t.includes("DOMESTIC") && t.includes("BUSINESS CORPORATION"))
    return {
      bg: "bg-[var(--color-river)]/8",
      text: "text-[var(--color-river-deep)]",
      border: "border-[var(--color-river)]/20",
    };
  if (t.includes("FOREIGN"))
    return {
      bg: "bg-[var(--color-violet-mist)]/8",
      text: "text-[var(--color-violet-mist)]",
      border: "border-[var(--color-violet-mist)]/20",
    };
  if (t.includes("NONPROFIT"))
    return {
      bg: "bg-[var(--color-fern)]/8",
      text: "text-[var(--color-fern)]",
      border: "border-[var(--color-fern)]/20",
    };
  if (t.includes("ASSUMED"))
    return {
      bg: "bg-[var(--color-ember)]/8",
      text: "text-[var(--color-clay)]",
      border: "border-[var(--color-ember)]/20",
    };
  return {
    bg: "bg-[var(--color-storm)]/8",
    text: "text-[var(--color-storm)]",
    border: "border-[var(--color-storm)]/20",
  };
}
