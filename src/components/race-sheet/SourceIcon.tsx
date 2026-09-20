import { BookOpen, ClipboardList, FileText, Globe, Landmark, Link2, Mail, MessageSquare, Newspaper, ScrollText } from "lucide-react";
import type { SourceVenue } from "@/lib/voters-guide/race-sheet/source-chip";

/** One glyph per source venue, so a citation is recognizable before it is read. */
const ICONS: Record<SourceVenue, typeof BookOpen> = {
  Pamphlet: BookOpen,
  Site: Globe,
  Filing: FileText,
  Questionnaire: ClipboardList,
  Post: MessageSquare,
  Record: Landmark,
  Register: ScrollText,
  Reporting: Newspaper,
  Response: Mail,
};

export function SourceIcon({ venue, size = 14, className }: { venue: SourceVenue; size?: number; className?: string }) {
  const Icon = ICONS[venue] ?? Link2;
  return <Icon size={size} aria-hidden="true" className={className} />;
}
