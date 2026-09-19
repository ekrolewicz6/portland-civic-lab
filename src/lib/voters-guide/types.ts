export type Geography =
  "Portland" | "Multnomah" | "Washington" | "Clackamas" | "Oregon";
export type Evidence = {
  label: string;
  url: string;
  kind:
    | "Candidate statement"
    | "Public record"
    | "Reporting"
    | "Election authority";
  date: string;
  note?: string;
};
export type CandidatePortrait = {
  src: string;
  sourceUrl: string;
  credit: string;
  reviewed: string;
};
export type Candidate = {
  analysis?: {
    values: string[];
    tradeoff: string;
    issues: Partial<
      Record<
        "housing" | "safety" | "money" | "climate",
        { position: string; source: Evidence }
      >
    >;
    sources: Evidence[];
  };
  portrait?: CandidatePortrait;
  id: string;
  name: string;
  affiliation: string;
  background: string;
  summary: string;
  priorities: string[];
  interpretation: string;
  question: string;
  sources: Evidence[];
  record?: {
    text: string;
    source: Evidence;
    decisionId?: string;
  }[];
  missing?: string;
};
export type Race = {
  id: string;
  title: string;
  geography: Geography;
  jurisdiction: string;
  seats: number;
  method: string;
  authority: string;
  stakes: string;
  comparison: string;
  rosterSource: Evidence;
  rosterStatus: "Official list checked" | "Certification check pending";
  candidates: Candidate[];
};
export type RaceSummary = Pick<
  Race,
  "id" | "title" | "geography" | "jurisdiction" | "method" | "stakes"
> & {
  candidates: { name: string }[];
  profileCount: number;
};

export const REVIEW_DATE = "2026-09-18";
export const REVIEW_LABEL = "September 18, 2026";
export const ELECTION_DATE = "November 3, 2026";

export const officialSources = {
  portland:
    "https://www.portland.gov/auditor/elections/run4office/2026-city-candidates",
  multnomah: "https://multco.us/info/candidate-filings-november-2026-election",
  washington: "https://www.washingtoncountyor.gov/elections/current-election",
  clackamas:
    "https://www.clackamas.us/elections/november-3-2026-general-election",
  state: "https://sos.oregon.gov/elections/pages/current-election.aspx",
  filings: "https://secure.sos.state.or.us/orestar/CFSearchPage.do",
  pamphlet:
    "https://sos.oregon.gov/elections/Voters-Pamphlet/Pages/default.aspx",
  myVote:
    "https://secure.sos.state.or.us/orestar/vr/showVoterSearch.do?lang=eng&source=SOS",
};

export const pamphlets = {
  multnomah:
    "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download",
  washington:
    "https://www.washingtoncountyor.gov/elections/documents/november-3-2026-voters-pamphlet/download?inline=",
  clackamas:
    "https://docs.clackamas.us/documents/drupal/03f4f9db-a1ab-4a1f-9ce1-16059d49a513",
};

export function pamphletSource(
  county: keyof typeof pamphlets,
  page: number,
): Evidence {
  return {
    label: `${county[0].toUpperCase()}${county.slice(1)} County voters’ pamphlet · PDF page ${page}`,
    url: `${pamphlets[county]}#page=${page}`,
    kind: "Candidate statement",
    date: "November 2026 edition; reviewed September 18, 2026",
    note: "Written by the candidate or campaign. Publication by the county does not verify the claims.",
  };
}

export function electionSource(label: string, url: string): Evidence {
  return {
    label,
    url,
    kind: "Election authority",
    date: "Checked September 18, 2026",
  };
}

export function slug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function candidate(
  name: string,
  background: string,
  summary: string,
  priorities: string[],
  interpretation: string,
  question: string,
  sources: Evidence[],
  affiliation = "Nonpartisan office",
): Candidate {
  return {
    id: slug(name),
    name,
    background,
    summary,
    priorities,
    interpretation,
    question,
    sources,
    affiliation,
  };
}
