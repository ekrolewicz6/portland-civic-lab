'use client';

type Source = { id: string; name: string; basis: string };

/** Keep the complete source list inside one hydration boundary. */
export default function ReviewedSources({ sources }: { sources: Source[] }) {
  return <ul data-reviewed-sources>{sources.map(source => <li key={source.id}>{source.name}: {source.basis}</li>)}</ul>;
}
