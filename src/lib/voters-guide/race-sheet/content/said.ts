import type { SaidPlacement } from "../types";

/**
 * Challengers' explicit statements about the exact choice a featured vote
 * decided (featured.ts → discovery.ts). Incumbents never appear here; their
 * recorded votes are the Voted column.
 *
 * Rule (the retired quiz's own): a placement needs an explicit statement in
 * the candidate's reviewed sources about the specific proposal — the arena
 * deal, the water rate increase, the street repair fee, using expected
 * police-oversight savings for police and fire, moving camp-removal money to
 * services. A broad goal ("supports public safety", "lower utility bills",
 * "no new taxes") never qualifies. Every line is an attributed paraphrase of
 * ≤10 words with no vote language; `from` names the parent field and
 * `sourceUrl` must exist in that candidate's sources.
 *
 * Reviewed September 19, 2026 against every published candidate's summary,
 * priorities, interpretation and analysis (portland.ts, council-analysis.ts).
 * No challenger in either district addresses the camp-removal amendment, the
 * water rate increase, the street repair fee or the oversight-savings
 * transfer, so those questions carry only the "not addressed" count.
 *
 * Struck September 19, 2026 (editorial audit): León on camp removal rested
 * on a broad "opposes sweeps" position, not on the $4.3 million amendment;
 * Hallett on Moda ("an agreement to retain the Blazers") was a statement
 * about keeping the team, not about backing these starting terms, which the
 * row's own limit sentence says are not the same question. Sweeney, Ward and
 * McDonald address public spending on or renovation of the arena and stay.
 */
export const saidPlacements: SaidPlacement[] = [
  /* ── District 3 · Back these starting terms for renovating Moda Center? ── */
  {
    candidateId: "john-sweeney",
    questionId: "moda",
    line: "Opposes spending aimed at keeping the Blazers in Portland",
    from: "priorities[2]",
    sourceUrl:
      "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=53",
    reviewedBy: "pending",
    reviewedOn: "2026-09-19",
  },
  {
    candidateId: "martin-ward",
    questionId: "moda",
    line: "Rejects Moda renovations",
    from: "priorities[1]",
    sourceUrl:
      "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=55",
    reviewedBy: "pending",
    reviewedOn: "2026-09-19",
  },

  /* ── District 4 · Back these starting terms for renovating Moda Center? ── */
  {
    candidateId: "john-mcdonald",
    questionId: "moda",
    line: "Supports modernizing Moda Center and retaining the Trail Blazers",
    from: "priorities[0]",
    sourceUrl:
      "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=63",
    reviewedBy: "pending",
    reviewedOn: "2026-09-19",
  },
];
