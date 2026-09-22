import type { Race } from "../types";

/**
 * What kind of office a race fills, and therefore which parts of the race
 * sheet apply. Derived from the research object's id and jurisdiction so
 * nothing here needs to be authored per race. The council races keep every
 * feature; the others get the same grid, briefs, ladders and contacts, with
 * the Council-vote panels omitted rather than left empty.
 */
export type OfficeGroup = "council" | "city" | "county" | "state" | "federal" | "legislature";

export type Office = {
  group: OfficeGroup;
  /** The body the seat sits on: "Portland City Council", "Multnomah County", "State of Oregon", "U.S. Congress", "Oregon Legislature", "City of Gresham". */
  body: string;
  /** The short race name for headings and cards: "District 4", "Governor", "County Chair", "U.S. House · District 3". */
  short: string;
  /** The phrase after "for" in a candidate's title: "Portland City Council District 4", "Governor of Oregon", "Multnomah County Chair". */
  seat: string;
  /** A one- to five-character mark for cards and share images where a district numeral would go. */
  mark: string;
  /** Portland council district number, when the race is one. */
  district: number | null;
  /** True when sitting members have recorded Council votes in our research (the votes page and featured votes). */
  hasCouncilRecord: boolean;
  /** The plain word for a sitting member, used in copy. */
  memberWord: string;
};

const GROUP_LABEL: Record<OfficeGroup, string> = {
  council: "Portland City Council",
  city: "City councils and mayors",
  county: "County offices",
  state: "Statewide",
  federal: "U.S. Congress",
  legislature: "Oregon Legislature",
};

export function groupLabel(group: OfficeGroup) {
  return GROUP_LABEL[group];
}

/** Display order of groups on the hub: the offices a Portland voter sees first. */
export const GROUP_ORDER: OfficeGroup[] = ["council", "county", "state", "federal", "legislature", "city"];

/** True for the races a Portland voter sees on their own ballot: city, Multnomah County, statewide, and the congressional districts that cover the city. */
export function onPortlandBallot(race: Race): boolean {
  const o = officeOf(race);
  if (o.group === "council" || o.group === "state") return true;
  if (o.group === "city") return o.body === "City of Portland";
  if (o.group === "county") return o.body === "Multnomah County";
  if (o.group === "federal") return race.id === "oregon-us-senate" || ["oregon-house-1", "oregon-house-3", "oregon-house-5"].includes(race.id);
  return false;
}

/** The short ballot-index label: the seat without the body, since the index prints the body once per line. */
export function indexLabel(race: Race): string {
  const o = officeOf(race);
  if (o.group === "federal") return o.short.replace("U.S. House · ", "House ");
  if (o.group === "legislature") return o.short.replace(" · ", " ");
  return o.short;
}

export function officeOf(race: Race): Office {
  const id = race.id;
  const m = (re: RegExp) => race.title.match(re)?.[1] ?? null;

  if (id.startsWith("portland-district-")) {
    const district = Number(id.replace("portland-district-", ""));
    return { group: "council", body: "Portland City Council", short: `District ${district}`, seat: `Portland City Council District ${district}`, mark: `0${district}`, district, hasCouncilRecord: true, memberWord: "councilor" };
  }
  if (id === "portland-auditor") return { group: "city", body: "City of Portland", short: "City Auditor", seat: "Portland City Auditor", mark: "AUD", district: null, hasCouncilRecord: false, memberWord: "auditor" };
  if (id === "oregon-governor") return { group: "state", body: "State of Oregon", short: "Governor", seat: "Governor of Oregon", mark: "GOV", district: null, hasCouncilRecord: false, memberWord: "governor" };
  if (id === "oregon-us-senate") return { group: "federal", body: "U.S. Congress", short: "U.S. Senate", seat: "U.S. Senate from Oregon", mark: "SEN", district: null, hasCouncilRecord: false, memberWord: "senator" };
  if (id.startsWith("oregon-house-")) {
    const d = id.replace("oregon-house-", "");
    return { group: "federal", body: "U.S. Congress", short: `U.S. House · District ${d}`, seat: `U.S. House, Oregon District ${d}`, mark: `OR-${d}`, district: null, hasCouncilRecord: false, memberWord: "representative" };
  }
  if (id.startsWith("oregon-state-senate-")) {
    const d = id.replace("oregon-state-senate-", "");
    return { group: "legislature", body: "Oregon Legislature", short: `Senate · District ${d}`, seat: `Oregon Senate District ${d}`, mark: `SD ${d}`, district: null, hasCouncilRecord: false, memberWord: "senator" };
  }
  if (id.startsWith("oregon-state-house-")) {
    const d = id.replace("oregon-state-house-", "");
    return { group: "legislature", body: "Oregon Legislature", short: `House · District ${d}`, seat: `Oregon House District ${d}`, mark: `HD ${d}`, district: null, hasCouncilRecord: false, memberWord: "representative" };
  }
  if (id.startsWith("multnomah-") || id.startsWith("washington-") || id.startsWith("clackamas-")) {
    const county = id.split("-")[0];
    const County = county[0].toUpperCase() + county.slice(1) + " County";
    const rest = race.title.replace(/^.*?(Chair|Commissioner|Auditor|Sheriff|Clerk|Treasurer).*$/, "$1");
    const district = m(/District (\d+)/);
    const position = m(/Position (\d+)/);
    const short = district ? `District ${district} Commissioner` : position ? `Commissioner, Position ${position}` : rest === "Chair" ? "County Chair" : rest;
    const seat = district ? `${County} Commissioner, District ${district}` : position ? `${County} Commissioner, Position ${position}` : `${County} ${rest}`;
    const mark = district ? `D${district}` : position ? `P${position}` : rest === "Chair" ? "CHAIR" : rest === "Auditor" ? "AUD" : rest === "Sheriff" ? "SHF" : rest === "Clerk" ? "CLK" : rest === "Treasurer" ? "TRS" : rest.slice(0, 3).toUpperCase();
    return { group: "county", body: County, short, seat, mark, district: null, hasCouncilRecord: false, memberWord: rest === "Chair" ? "chair" : rest.toLowerCase() };
  }
  // City races: "<City> Mayor", "<City> Council · Position N", "<City> Council · Ward N, Position A", "<City> City Council", "<City> Commission".
  const city = race.jurisdiction.replace(/^City of /, "").split(" · ")[0];
  const short = race.title.replace(`${city} `, "");
  const seat = /Mayor/.test(short) ? `Mayor of ${city}` : `${city} ${short.replace(" · ", ", ")}`;
  const num = m(/(?:Position|Ward) (\d+)/);
  const mark = /Mayor/.test(short) ? "MAYOR" : num ? (/Ward/.test(short) ? `W${num}` : `P${num}`) : "CNCL";
  return { group: "city", body: `City of ${city}`, short, seat, mark, district: null, hasCouncilRecord: false, memberWord: /Mayor/.test(short) ? "mayor" : "councilor" };
}
