import { AtSign, ClipboardList, ExternalLink, Facebook, Globe, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import type { ContactChannel } from "@/lib/voters-guide/race-sheet/types";
import c from "./controls.module.css";
import styles from "./brief.module.css";

/**
 * How to reach the campaign: only channels the candidate published (their
 * pamphlet statement, their site, their own filing or announcement), each
 * a real control. When nothing was published, the reason is stated so a
 * missing email is never mistaken for a missing candidate.
 */
function ChannelIcon({ channel }: { channel: ContactChannel }) {
  const size = 15;
  if (channel.kind === "website") return <Globe size={size} aria-hidden="true" />;
  if (channel.kind === "email") return <Mail size={size} aria-hidden="true" />;
  if (channel.kind === "phone") return <Phone size={size} aria-hidden="true" />;
  if (channel.kind === "form") return <ClipboardList size={size} aria-hidden="true" />;
  const name = channel.label.toLowerCase();
  if (name.includes("instagram")) return <Instagram size={size} aria-hidden="true" />;
  if (name.includes("facebook")) return <Facebook size={size} aria-hidden="true" />;
  if (name.includes("linkedin")) return <Linkedin size={size} aria-hidden="true" />;
  return <AtSign size={size} aria-hidden="true" />;
}

const FROM: Record<ContactChannel["from"], string> = {
  pamphlet: "pamphlet statement",
  site: "campaign site",
  filing: "City filing",
  announcement: "campaign announcement",
  questionnaire: "questionnaire",
};

export default function ReachCampaign({
  channels,
  none,
  compact = false,
}: {
  channels: ContactChannel[];
  none: string | null;
  compact?: boolean;
}) {
  if (channels.length === 0) {
    return compact ? null : <p className={styles.reachNone}>{none ?? "No campaign contact published in the sources we reviewed."}</p>;
  }
  const venues = [...new Set(channels.map((ch) => FROM[ch.from]))];
  const external = (ch: ContactChannel) => ch.kind === "website" || ch.kind === "form" || ch.kind === "social";
  return (
    <div className={styles.reach}>
      <ul className={`${c.row} ${styles.reachList}`} aria-label="Ways to reach the campaign">
        {channels.map((ch) => (
          <li key={ch.url}>
            <a
              href={ch.url}
              className={`${c.btn} ${c.small} ${ch.kind === "website" ? c.secondary : c.quiet}`}
              rel={external(ch) ? "noopener noreferrer" : undefined}
              target={external(ch) ? "_blank" : undefined}
            >
              <ChannelIcon channel={ch} />
              <span>{ch.label}</span>
              {external(ch) && <ExternalLink size={12} aria-hidden="true" className={styles.reachExt} />}
              {external(ch) && <span className={styles.srOnly}> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
      {!compact && <p className={styles.reachFrom}>As published in their {venues.join(" and ")}.</p>}
    </div>
  );
}
