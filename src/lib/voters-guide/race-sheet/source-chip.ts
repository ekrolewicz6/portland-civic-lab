import type { Evidence } from "../types";

export type SourceVenue =
  | "Pamphlet"
  | "Site"
  | "Filing"
  | "Questionnaire"
  | "Post"
  | "Record"
  | "Register"
  | "Reporting"
  | "Response";

export type SourceChip = {
  venue: SourceVenue;
  /** Short chip text, e.g. "Pamphlet p. 60", "Campaign site". */
  label: string;
  url: string;
  evidence: Evidence;
};

/** Pure: classify an Evidence by its URL and kind for a compact chip. */
export function sourceChip(evidence: Evidence): SourceChip {
  const url = evidence.url;
  let host = "";
  try {
    host = new URL(url).host.replace(/^www\./, "");
  } catch {
    host = "";
  }
  const page = url.match(/#page=(\d+)/)?.[1];
  const pick = (venue: SourceVenue, label: string): SourceChip => ({ venue, label, url, evidence });

  if (evidence.kind === "Public record") {
    if (/(^|\.)(portland\.gov|portlandoregon\.gov|efiles\.portlandoregon\.gov)$/i.test(host)) return pick("Record", "City record");
    if (/(^|\.)(multco\.us|washingtoncountyor\.gov|clackamas\.us|civicweb\.net|granicus\.com)$/i.test(host)) return pick("Record", "County record");
    if (/(^|\.)(oregon\.gov|oregonlegislature\.gov|state\.or\.us|pdx\.edu|pers\.state\.or\.us|olis\.oregonlegislature\.gov)$/i.test(host)) return pick("Record", "State record");
    if (/(^|\.)(gov|congress\.gov|house\.gov|senate\.gov|treasury\.gov|census\.gov|cbo\.gov|fiscaldata\.treasury\.gov)$/i.test(host)) return pick("Record", "Federal record");
    if (/\.gov$/i.test(host) || /(^|\.)(greshamoregon\.gov|beavertonoregon\.gov|hillsboro-oregon\.gov|tigard-or\.gov|ci\.oswego\.or\.us|orcity\.org)$/i.test(host)) return pick("Record", "City record");
    if (/justia\.com|courtlistener|uscourts\.gov/i.test(host)) return pick("Record", "Court record");
    return pick("Record", "Official record");
  }
  if (evidence.kind === "Election authority") {
    if (/orestar|cfDetail/i.test(url)) return pick("Filing", "State filing");
    return pick("Register", "Official list");
  }
  if (evidence.kind === "Reporting") return pick("Reporting", host || "Reporting");
  // Candidate statements
  if (/portlandciviclab\.org$/i.test(host) && /research-log#/.test(url)) return pick("Response", "Emailed response");
  if (/multco\.us|washingtoncountyor\.gov|clackamas\.us|docs\.clackamas/i.test(host) && page)
    return pick("Pamphlet", `Pamphlet p. ${page}`);
  if (/multco\.us|washingtoncountyor\.gov|clackamas\.us|docs\.clackamas|sos\.oregon\.gov/i.test(host))
    return pick("Pamphlet", "Voters’ pamphlet");
  if (/portland\.gov/i.test(host)) return pick("Filing", "City filing");
  if (/portlandmercury|wweek|oregonlive|opb\.org/i.test(host)) return pick("Questionnaire", "Questionnaire");
  if (/(^|\.)(linkedin\.com|facebook\.com|instagram\.com|x\.com|twitter\.com|bsky\.app|threads\.net)$/i.test(host)) return pick("Post", "Public post");
  return pick("Site", "Campaign site");
}
