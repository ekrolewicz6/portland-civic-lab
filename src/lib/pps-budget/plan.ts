/**
 * The Movable Dollar Plan — the page's action layer, transcribed from
 * research/pps-budget/recommendations.md (the version that survived the
 * seven-persona red team and the final hostile judge).
 */

export const RED_TEAM = {
  personas: [
    "District CFO",
    "Union research director",
    "N/NE Portland equity advocate",
    "Anti-closure parent organizer",
    "Construction bond veteran",
    "Board general counsel",
    "Retired deputy superintendent",
  ],
  objections: 58,
  fatal: 18,
  note: "Where an objection was right, the plan changed and says so. Where it was wrong, the answer is printed under the decision it attacks.",
} as const;

export interface PlanDecision {
  id: string;
  title: string;
  motion: string;
  cost: string;
  authority: string;
  objection: { from: string; text: string };
  answer: string;
  status: "changed" | "defended";
}

export const PLAN_DECISIONS: PlanDecision[] = [
  {
    id: "D0",
    title: "Reconcile the plan with the board's own governance model",
    motion:
      "Amend governance policy to expressly reserve fiscal transparency, budget development, capital oversight, the contract portfolio, and enrollment and attendance goals as board-level matters.",
    cost: "One policy amendment",
    authority: "The board owns its own governance policies",
    objection: {
      from: "Retired deputy superintendent",
      text: "Half these motions are operational directives from a board whose governance model forbids exactly that. The two-word veto is 'operational matter.'",
    },
    answer:
      "Correct, which is why this is Decision 0, first in time. A board cannot govern outcomes while blind to money; the framework itself assumes functioning financial reporting, which this district does not have.",
    status: "changed",
  },
  {
    id: "D1",
    title: "Publish the books, at the speed the books can bear",
    motion:
      "Fund 2-3 finance analysts first, exempt from every savings target. Quarterly unaudited statements with seasonal comparators and a revision log; monthly only after one clean audit cycle. The one-page budget and the trend table in every book. Quarterly public reporting on the assumptions that drove the last deficit. Publish the strike-settlement cost model.",
    cost: "2-3 positions, under half a percent of the deficit",
    authority: "Board policy; none of it touches a contract or statute",
    objection: {
      from: "District CFO",
      text: "You are ordering monthly financials from an office that just failed its annual close: six significant deficiencies and a Local Budget Law violation, with staff turnover named as the cause, after 96 central-office positions were cut. Every early error becomes next month's 'they lied' story.",
    },
    answer:
      "Accepted almost entirely: capacity first, quarterly before monthly, revision logs by design. But the audit findings are not a reason to stay dark. They are the strongest evidence in the record that nobody, including the board, can currently see the money.",
    status: "changed",
  },
  {
    id: "D2",
    title: "Give the citizen reviewers a real seat",
    motion:
      "Staged CBRC access written into the budget calendar itself: assumptions in January, detail as modules land, a guaranteed review window. The board's written item-by-item response published no later than the adoption meeting, with any failure explained in public session. TSCC asked to witness compliance.",
    cost: "Calendar discipline",
    authority: "The board created the CBRC; the board sets its terms",
    objection: {
      from: "District CFO",
      text: "Nine days exists because the state revenue forecast lands in May and adoption is bracketed at June 30. Four weeks earlier means four weeks staler.",
    },
    answer:
      "Accepted: staged access replaces the flat earlier deadline, so the committee gets real time without reviewing stale numbers. What we kept: nine working days for $2.8 billion, three years running, is a choice, and the committee's own reports say so.",
    status: "changed",
  },
  {
    id: "D3",
    title: "Aim the capital-honesty standard at the actor who breaks the chain",
    motion:
      "No ballot figure below the validated estimate range without a public line-item reconciliation. Rebaseline the 2025 bond program publicly within six months. Repair the Bond Accountability Committee and route its existing reports to the full board. Publish estimates-at-completion as ranges decomposed against a construction index. Ratify the $60M Center for Black Student Excellence as a floor with a scope decision by June 2027.",
    cost: "Validation fees, a rounding error against $1.83B",
    authority: "Board policy over the Office of School Modernization",
    objection: {
      from: "Construction bond veteran",
      text: "Validation theater. Independent estimates existed at every ballot, in 2017 and again in 2025, and leadership set the public number below them anyway, with no documented rationale, in the auditors' own words. You are asking for a second thermometer while the patient sets the reading.",
    },
    answer:
      "The single most important objection we received. The remedy changed from 'more validation' to a rule that binds the board itself: adopting a number below the validated range now requires a public, recorded, line-item explanation. That targets the actual failure mode of 2017, 2020, and 2025.",
    status: "changed",
  },
  {
    id: "D4",
    title: "Move real dollars toward students, on a metric that cannot be gamed",
    motion:
      "Commission the peer benchmarking study and let it set the target. Measure 'dollars reaching schools and students' (instruction plus direct student supports) on a frozen, auditor-certified crosswalk. Start with an honest verified list, likely $2-5M, routed highest-need schools first. Apply the same rollback teeth to central administration lines as to anything touching a classroom.",
    cost: "Negative, but honestly small at first",
    authority: "Board budget authority; the superintendent returns executable plans",
    objection: {
      from: "District CFO",
      text: "The first draft's $26M pot was phantom: grant-funded coaches free no discretionary dollar, the contract spikes are one-time moving and legal costs, and the marquee purchases, counselors and librarians, are support functions, so buying them pushes your own instructional-share metric DOWN. The engine contradicted the dashboard.",
    },
    answer:
      "Fully accepted. The target waits for the study, the metric now counts student supports on the right side of the line, the pot is confessed down to its verified size, and overload pay came off the stop list entirely: the contract itself says overload is a penalty for understaffing, so it is now this plan's leading indicator, not a funding source.",
    status: "changed",
  },
  {
    id: "D5",
    title: "The footprint correction: one decision, phased execution, promises sized to audited savings",
    motion:
      "Criteria adopted in public before any list, with historic under-investment as a counterweight and a cap on concentration in any one cluster. The savings model independently validated to the same standard as bond estimates, published for a 45-day review with per-school hearings. A racial-equity impact analysis under the board's own 2011 policy. Phased effective dates, no school before 2028-29. Savings split 70% to the deficit, 30% escrowed to named positions in receiving schools first, with a tripwire: future phases suspend if escrowed positions go unfunded.",
    cost: "Transition budget named before the vote; net savings honest, likely $1-2M per elementary",
    authority: "The board's alone",
    objection: {
      from: "Anti-closure parent organizer",
      text: "'Bind by resolution' binds no one. This district's record includes a 10 percent reserve policy pinned at 5, a pension reserve spent in one year, and a promise to the state of a right-sizing process by 2020-21 that is still 'planning' in 2026. You are asking my community to trade its school for the good faith of an institution your own research proves cannot be taken on faith.",
    },
    answer:
      "We could not fully answer this, and the plan says so in writing: a future board can un-vote anything. What replaced the promise: a dedicated fund, restricted appropriations, a public tracking table, an annual CBRC compliance review, and the tripwire. Breach is now visible, priced, and consequence-bearing. That is the strongest enforcement available to a school board, and communities deserve that sentence plainly.",
    status: "changed",
  },
  {
    id: "D6",
    title: "Run enrollment as the long game it actually is",
    motion:
      "An enrollment function missioned on kindergarten capture rate, disaggregated by race and cluster, targets set on closing the gaps, with the methodology produced outside the office that is graded on it. An intergovernmental agreement with Multnomah County on Preschool for All transitions. Exit interviews offered to every departing family, published in aggregate. Librarians and arts protected universally; TAG protected only paired with universal screening and demographic reporting.",
    cost: "Low single-digit millions, honestly scored as an investment",
    authority: "Board and superintendent; the county agreement is negotiated, not assumed",
    objection: {
      from: "District CFO",
      text: "Your payback arithmetic was backwards. Oregon pays on the higher of this year's or last year's count, and PPS is already paid on the prior year, so a recovered kindergartner adds zero formula revenue until recovery outruns the annual decline of roughly 800 students. I would have killed that slide in ninety seconds.",
    },
    answer:
      "Fully accepted and corrected in public: near-zero marginal revenue in years one and two, then compounding for a decade as recovered cohorts prop up every future count. Still one of the strongest long plays the district has. Not a budget patch, and no longer sold as one.",
    status: "changed",
  },
  {
    id: "D7",
    title: "Attendance: the cheapest outcome win, done so communities will accept it",
    motion:
      "A board goal on chronic absenteeism (above 36 percent, ten points over the national average) with quarterly reporting by school and by race, an annual coding audit, and a firewall: attendance never becomes a closure criterion. Supports specified as social workers, family-engagement staff, and community organizations, with an explicit no-law-enforcement-referral commitment. Calendar coherence pursued in successor bargaining, priced honestly, because the fragmented weeks are bargained preparation time.",
    cost: "Small, from Decision 4's verified tranche",
    authority: "Goal and reporting now; calendar at the table",
    objection: {
      from: "Union research director",
      text: "The calendar is not the board's to rebuild. The contract fixes the work year, requires our consent for aggregate changes, and those 'fragmented' days are the planning and development time we bargained because preparation is instruction. A unilateral resolution during open negotiations is an unfair labor practice charge within the month.",
    },
    answer:
      "Accepted in full. The calendar moved to the successor table as a priced objective with the union as co-author, and the union's own words, 'our members hate fragmented weeks too,' suggest a deal exists. The goal, the reporting, and the supports need nobody's consent and start now.",
    status: "changed",
  },
  {
    id: "D8",
    title: "Go to Salem with the right asks in the right venues",
    motion:
      "The adequacy case as the umbrella, three quantified asks inside it: raise the 11 percent special-education funding cap jointly with the appropriation, in coalition with the largest districts. Pursue a constitutional referral exempting voter-approved local option levies from Measure 5 compression, with a statutory backfill as the near-term win. State assumption of PERS rate shocks above a threshold. Plus: marginal Salem dollars flow through the equity allocation first, and the 2029 levy renewal becomes a named workstream in 2028.",
    cost: "Focus",
    authority: "The board speaks; the legislature and, for compression, the voters dispose",
    objection: {
      from: "Board general counsel",
      text: "Measure 5 compression is in the Oregon Constitution. No bill fixes it, and a board that walks into Salem demanding a statutory fix to a constitutional provision forfeits exactly the credibility this decision was designed to buy.",
    },
    answer:
      "Accepted: the ask is now a joint resolution and a statewide campaign with the coalition of compression-losing districts, honestly priced at two to three biennia, with the backfill bill as the achievable near-term metric. The $53.4M leak did not change; the vehicle did.",
    status: "changed",
  },
  {
    id: "D9",
    title: "The equity spine",
    motion:
      "Every metric this plan creates is reported disaggregated by race and school poverty band, on the same schedule as the aggregate. Every implementing resolution carries the equity analysis the board's 2011 policy contemplates. The equity allocation, halved in 2024-25 without the return-on-investment analysis the citizen committee twice requested, gets that analysis before any further change in either direction.",
    cost: "Reporting configuration. The cheapest decision in the plan",
    authority: "Board reporting standards",
    objection: {
      from: "N/NE Portland equity advocate",
      text: "Eight decisions and your board's own Racial Educational Equity Policy is never named. Per-student arithmetic that never asks which students is how this district has always hurt mine.",
    },
    answer:
      "The first draft's worst omission, accepted without qualification. This decision exists because of that sentence, and the plan keeps it in print.",
    status: "changed",
  },
];

export const RECONCILIATION_RULE =
  "In a cut year, no promise outranks the deficit except the small investments that make every later promise checkable.";
