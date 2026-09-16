import { SOURCES } from "@/lib/fpdr/data";

export default function SourceLink({
  id,
  children,
}: {
  id: keyof typeof SOURCES;
  children?: React.ReactNode;
}) {
  const source = SOURCES[id];
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fpdr-source"
    >
      {children ?? source.org}
    </a>
  );
}
