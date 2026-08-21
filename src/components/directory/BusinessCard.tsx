import Link from "next/link";
import { Building2, Calendar, MapPin } from "lucide-react";
import { formatEntityType, entityBadgeColor } from "@/lib/directory-format";

interface BusinessCardProps {
  id: number;
  name: string;
  entityType: string;
  registryDate: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  index?: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BusinessCard({
  id,
  name,
  entityType,
  registryDate,
  address,
  city,
  state,
  zip,
  index = 0,
}: BusinessCardProps) {
  const badge = entityBadgeColor(entityType);
  const location = [city, state].filter(Boolean).join(", ");
  const fullAddress = [address, location, zip].filter(Boolean).join(" ");

  return (
    <Link
      href={`/directory/${id}`}
      className="metric-card group block"
      style={
        {
          "--accent-color": "var(--color-canopy)",
          animationDelay: `${index * 40}ms`,
        } as React.CSSProperties
      }
    >
      <div className="animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
        {/* Header: name + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-sm bg-[var(--color-canopy)]/6 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-[var(--color-canopy)]" />
            </div>
            <h3 className="font-semibold text-[14px] text-[var(--color-ink)] leading-snug truncate group-hover:text-[var(--color-canopy)] transition-colors duration-200">
              {titleCase(name)}
            </h3>
          </div>
        </div>

        {/* Entity type badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] rounded-sm border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {formatEntityType(entityType)}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1.5">
          {fullAddress && (
            <div className="flex items-center gap-2 text-[12px] text-[var(--color-ink-muted)]">
              <MapPin className="w-3 h-3 flex-shrink-0 text-[var(--color-sage)]" />
              <span className="truncate">{titleCase(fullAddress)}</span>
            </div>
          )}
          {registryDate && (
            <div className="flex items-center gap-2 text-[12px] text-[var(--color-ink-muted)]">
              <Calendar className="w-3 h-3 flex-shrink-0 text-[var(--color-sage)]" />
              <span>Registered {formatDate(registryDate)}</span>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className="mt-4 pt-3 border-t border-[var(--color-parchment)] flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            OR SOS #{id}
          </span>
          <span className="text-[11px] font-medium text-[var(--color-canopy)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
