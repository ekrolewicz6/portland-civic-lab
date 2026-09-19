"use client";
import { useEffect, useRef, useState } from "react";
import type { Candidate, Race } from "@/lib/voters-guide/types";
import {
  assess,
  discoveryEvidence,
  discoveryVersion,
  experienceOptions,
  orderResults,
  priorities,
  questions,
  type Answers,
  type ExperiencePreference,
} from "@/lib/voters-guide/discovery";
import CandidatePortrait from "./CandidatePortrait";
import styles from "./discovery.module.css";

type Session = {
  version: string;
  priorities: string[];
  answers: Answers;
  experience: ExperiencePreference[];
  saved: string[];
};
const empty = (): Session => ({
  version: discoveryVersion,
  priorities: [],
  answers: {},
  experience: [],
  saved: [],
});
const groups = [
  "Alignment on every answered question",
  "Some alignment to explore",
  "A documented difference to consider",
  "Not enough evidence to compare your choices",
];
export default function CandidateDiscovery({ race }: { race: Race }) {
  const [state, setState] = useState<Session>(empty);
  const [stage, setStage] = useState("intro");
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [compare, setCompare] = useState("housing");
  const heading = useRef<HTMLHeadingElement>(null);
  const key = `pcl-guide-${race.id}`;
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const value = JSON.parse(raw);
        if (
          value.version === discoveryVersion &&
          Array.isArray(value.priorities) &&
          Array.isArray(value.saved) &&
          Array.isArray(value.experience) &&
          value.answers &&
          typeof value.answers === "object"
        ) {
          setState({
            version: discoveryVersion,
            priorities: value.priorities
              .filter((id: unknown) => priorities.some((p) => p.id === id))
              .slice(0, 3),
            saved: value.saved.filter((id: unknown) =>
              race.candidates.some((c) => c.id === id),
            ),
            answers: Object.fromEntries(
              questions
                .filter((q) =>
                  q.options.some((o) => o.id === value.answers[q.id]),
                )
                .map((q) => [q.id, value.answers[q.id]]),
            ),
            experience: value.experience
              .filter(
                (p: ExperiencePreference) =>
                  p &&
                  typeof p.requirement === "boolean" &&
                  experienceOptions.some((e) => e.id === p.id),
              )
              .slice(0, 2),
          });
        }
      }
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
  }, [key, race.candidates]);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      setStorageAvailable(false);
    }
  }, [state, key, ready]);
  function go(next: string) {
    setStage(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  const queue = [
    ...state.priorities.map((id) => questions.find((q) => q.id === id)!),
    ...questions.filter((q) => ["funding", "budget"].includes(q.id)),
  ];
  const activeAnswers = Object.fromEntries(
    queue
      .filter((q) => state.answers[q.id])
      .map((q) => [q.id, state.answers[q.id]]),
  );
  const results = orderResults(
    race.candidates,
    activeAnswers,
    state.experience,
  );
  const eligible = results.filter((r) => !r.unmet.length);
  const unmet = results.filter((r) => r.unmet.length);
  const shortlist = race.candidates.filter((p) => state.saved.includes(p.id));
  const current = queue[index];
  function save(id: string) {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(id)
        ? s.saved.filter((v) => v !== id)
        : [...s.saved, id],
    }));
  }
  function nextQuestion() {
    if (index < queue.length - 1) {
      setIndex(index + 1);
      requestAnimationFrame(() => heading.current?.focus());
    } else go("experience");
  }
  function reset() {
    setState(empty());
    setIndex(0);
    go("intro");
  }
  function card(result: ReturnType<typeof assess>) {
    const { person, evidence, aligned, different, unknown } = result;
    const firstDifference = different[0];
    const record = person.record?.find((r) => r.decisionId);
    return (
      <article className={styles.card} key={person.id}>
        <header className={styles.identity}>
          <div className={styles.portrait}>
            <CandidatePortrait person={person} compact />
          </div>
          <div>
            <h4>{person.name}</h4>
            <a href={`#${person.id}`}>Full profile &amp; sources</a>
          </div>
        </header>
        <h5>Where you align</h5>
        <p>
          {aligned.length
            ? aligned
                .map(
                  (q) =>
                    q.options.find((o) => o.id === activeAnswers[q.id])!.text,
                )
                .join(" ")
            : "We have not established alignment with your selected approaches. That is not a judgment about this candidate."}
        </p>
        <details>
          <summary>Differences, experience &amp; promises</summary>
          <h5>A difference to consider</h5>
          <p>
            {firstDifference
              ? evidence.positions[firstDifference.id].text
              : unknown.length
                ? `We cannot yet establish whether they share your choice on ${unknown.map((q) => (q.id === "budget" ? "Moda Center" : q.id === "funding" ? "funding" : priorities.find((p) => p.id === q.id)?.label.toLowerCase())).join(", ")}. Read their full position before deciding.`
                : "These answers align, but they do not cover every issue. Their full record may reveal other differences that matter to you."}
          </p>
          <h5>Relevant experience</h5>
          <p>{person.background}</p>
          <p className={styles.note}>
            {result.experienceMatches.length
              ? `Matches the experience you selected: ${result.experienceMatches.map((p) => experienceOptions.find((e) => e.id === p.id)!.label.toLowerCase()).join(", ")}. `
              : ""}
            Roles are reported experience, not a rating of effectiveness.
          </p>
          {!!result.unmet.length && (
            <p className={styles.note}>
              Requirement not established:{" "}
              {result.unmet
                .map((p) => experienceOptions.find((e) => e.id === p.id)!.label)
                .join(", ")}
              . Missing evidence does not mean missing experience.
            </p>
          )}
          <h5>What they have delivered or proposed</h5>
          <p>
            {record
              ? record.text
              : (person.priorities[0] ??
                "We still need a substantiated account of their specific proposals.")}
          </p>
          <p className={styles.note}>
            {record
              ? "A recorded action does not by itself prove a successful outcome."
              : "This is a proposal, not a verified result."}
          </p>
          <details>
            <summary>Evidence, tradeoffs &amp; open questions</summary>
            <p>{person.analysis?.tradeoff ?? person.interpretation}</p>
            <p>
              <strong>What still needs an answer:</strong> {person.question}
            </p>
            {queue.map((q) => {
              const p = evidence.positions[q.id];
              return p && activeAnswers[q.id] ? (
                <section key={q.id}>
                  <h5>{q.title}</h5>
                  <p>{p.text}</p>
                  <a href={p.source.url}>{p.source.label}</a>
                  <p className={styles.note}>
                    {p.source.kind} · {p.source.date}
                  </p>
                </section>
              ) : null;
            })}
            {evidence.experience.map((e) => (
              <p key={e.id}>
                {experienceOptions.find((o) => o.id === e.id)?.label}:{" "}
                <a href={e.source.url}>
                  {e.status} · {e.source.label}
                </a>
              </p>
            ))}
            {record && (
              <p>
                <a href={record.source.url}>Source for recorded action</a>
              </p>
            )}
            <a href={`#${person.id}`}>Read the complete analysis →</a>
          </details>
        </details>
        <button
          type="button"
          aria-pressed={state.saved.includes(person.id)}
          onClick={() => save(person.id)}
        >
          {state.saved.includes(person.id)
            ? "Remove from shortlist"
            : "Save to my shortlist"}
          <span className={styles.sr}>: {person.name}</span>
        </button>
      </article>
    );
  }
  const titles: Record<string, string> = {
    intro: "Start with what matters to you.",
    priorities: "What matters most to you?",
    experience: "What experience matters to you?",
    results: "Candidates to explore",
    shortlist: "Your shortlist",
  };
  return (
    <section
      className={styles.discovery}
      id="find-candidates"
      aria-label="Find candidates to consider"
    >
      <div className={styles.topline}>
        <span>Your priorities. Your choice.</span>
        <span>About 3 minutes</span>
      </div>
      <h2 ref={heading} tabIndex={-1}>
        {stage === "question" ? current.title : titles[stage]}
      </h2>
      {stage === "intro" && (
        <>
          <p className={styles.lede}>
            Choose what matters to you. Explore candidates’ positions,
            experience and differences, with the evidence close at hand.
          </p>
          <button className={styles.primary} onClick={() => go("priorities")}>
            Find candidates to consider →
          </button>
          <div className={styles.steps}>
            <span>
              <b>01</b> Choose priorities
            </span>
            <span>
              <b>02</b> Explore approaches
            </span>
            <span>
              <b>03</b> Build your shortlist
            </span>
          </div>
          <p className={styles.note}>
            No scores or suggested ballot order. Your answers stay in this
            browser tab.
          </p>
        </>
      )}
      {stage === "priorities" && (
        <>
          <p>
            Choose up to three. You can explore the other issues in the full
            guide at any time.
          </p>
          <div className={styles.choices}>
            {priorities.map((p) => (
              <button
                key={p.id}
                aria-pressed={state.priorities.includes(p.id)}
                disabled={
                  !state.priorities.includes(p.id) &&
                  state.priorities.length === 3
                }
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    priorities: s.priorities.includes(p.id)
                      ? s.priorities.filter((id) => id !== p.id)
                      : [...s.priorities, p.id],
                  }))
                }
              >
                <strong>{p.label}</strong>
                <span>{p.detail}</span>
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button onClick={() => go("intro")}>Back</button>
            <button
              className={styles.primary}
              onClick={() => {
                setIndex(0);
                go("question");
              }}
            >
              {state.priorities.length
                ? "Continue"
                : "Continue with general questions"}{" "}
              →
            </button>
          </div>
        </>
      )}
      {stage === "question" && (
        <>
          <p className={styles.note}>
            Question {index + 1} of {queue.length}
          </p>
          <p className={styles.lede}>{current.context}</p>
          <div className={styles.choices}>
            {current.options.map((o) => (
              <button
                key={o.id}
                aria-pressed={state.answers[current.id] === o.id}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    answers: { ...s.answers, [current.id]: o.id },
                  }))
                }
              >
                {o.text}
              </button>
            ))}
            <button
              aria-pressed={!state.answers[current.id]}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  answers: { ...s.answers, [current.id]: "" },
                }))
              }
            >
              Not sure / no preference
            </button>
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => (index ? setIndex(index - 1) : go("priorities"))}
            >
              Back
            </button>
            <button className={styles.primary} onClick={nextQuestion}>
              {index === queue.length - 1
                ? "Next: experience"
                : "Next question"}{" "}
              →
            </button>
          </div>
        </>
      )}
      {stage === "experience" && (
        <>
          <p>
            Choose up to two, or skip. A preference brings relevant experience
            forward within each policy group. A requirement limits the initial
            results to candidates whose relevant experience we can establish.
          </p>
          <p className={styles.note}>
            A role can show relevant experience without proving success. We do
            not infer an ability to build agreements from a job title.
          </p>
          <div className={styles.choices}>
            {experienceOptions.map((e) => {
              const selected = state.experience.find((p) => p.id === e.id);
              return (
                <div key={e.id}>
                  <button
                    aria-pressed={!!selected}
                    disabled={!selected && state.experience.length === 2}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        experience: selected
                          ? s.experience.filter((p) => p.id !== e.id)
                          : [...s.experience, { id: e.id, requirement: false }],
                      }))
                    }
                  >
                    {e.label}
                  </button>
                  {selected && (
                    <label className={styles.requirement}>
                      <input
                        type="checkbox"
                        checked={selected.requirement}
                        onChange={(event) =>
                          setState((s) => ({
                            ...s,
                            experience: s.experience.map((p) =>
                              p.id === e.id
                                ? { ...p, requirement: event.target.checked }
                                : p,
                            ),
                          }))
                        }
                      />{" "}
                      Require evidence of this experience
                    </label>
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => {
                setIndex(queue.length - 1);
                go("question");
              }}
            >
              Back
            </button>
            <button className={styles.primary} onClick={() => go("results")}>
              Explore candidates →
            </button>
          </div>
        </>
      )}
      {stage === "results" && (
        <>
          <p className={styles.lede}>
            A starting point for your decision. These groups describe the
            evidence for your answers, not a ranking of candidates.
          </p>
          <details className={styles.preferences}>
            <summary>Your choices &amp; how these results work</summary>
            {queue.map((q) => (
              <p key={q.id}>
                <strong>{q.title}</strong>
                <br />
                {q.options.find((o) => o.id === activeAnswers[q.id])?.text ??
                  "No preference selected"}
              </p>
            ))}
            <p>
              Only explicit, sourced support counts as alignment. An alternative
              proposal is not automatically opposition. All answered questions
              count equally; repeated votes add no weight. Unknown positions
              stay unknown.
            </p>
            <p>
              Within each group, candidates with more of your selected
              experience appear first; otherwise names appear alphabetically.
              Experience requirements are shown separately when our research
              cannot establish them. There is no overall score.
            </p>
            <p>
              This short introduction covers selected choices, not every policy
              or qualification.{" "}
              <a href="#disagreements">Explore all 29 Council issues</a>.
            </p>
            <button onClick={() => go("priorities")}>
              Edit priorities &amp; policy answers
            </button>
            <button onClick={() => go("experience")}>
              Edit experience preferences
            </button>
          </details>
          {!Object.keys(activeAnswers).length && (
            <p className={styles.notice}>
              You have not selected a policy approach. We are showing the field
              without claiming policy alignment.
            </p>
          )}
          {!eligible.length && (
            <p className={styles.notice}>
              Our research cannot establish your experience requirements for any
              candidate. No requirement has been relaxed. You can change your
              preferences or explore everyone below.
            </p>
          )}
          {groups.map((label, i) => {
            const group = eligible.filter((r) => r.group === i);
            return group.length ? (
              <section key={label} className={styles.group}>
                <h3>
                  {label} <span>({group.length})</span>
                </h3>
                <div className={styles.cards}>{group.map(card)}</div>
              </section>
            ) : null;
          })}
          {!!unmet.length && (
            <details className={styles.preferences}>
              <summary>
                Experience requirements not established ({unmet.length}{" "}
                candidates)
              </summary>
              <p>
                These candidates remain part of the field. An unestablished
                requirement is a research gap, not a finding that someone is
                unqualified.
              </p>
              <div className={styles.cards}>{unmet.map(card)}</div>
            </details>
          )}
        </>
      )}
      {stage === "shortlist" && (
        <>
          <p>
            Saved for your own consideration. Names appear alphabetically; this
            is not a ballot ranking.
          </p>
          {!shortlist.length ? (
            <p>
              No candidates saved yet. Explore results to build your shortlist.
            </p>
          ) : (
            <>
              <label className={styles.select}>
                Compare one question at a time
                <select
                  value={compare}
                  onChange={(e) => setCompare(e.target.value)}
                >
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                  <option value="experience">Relevant experience</option>
                  <option value="promises">
                    Proposals &amp; open questions
                  </option>
                </select>
              </label>
              <div className={styles.cards}>
                {shortlist
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((person) => (
                    <ShortlistCard
                      key={person.id}
                      person={person}
                      topic={compare}
                      remove={() => save(person.id)}
                    />
                  ))}
              </div>
            </>
          )}
          <button onClick={() => go("results")}>Back to candidates</button>
        </>
      )}
      <nav className={styles.footer} aria-label="Guide shortcuts">
        <a href="#candidates">Browse all {race.candidates.length} candidates</a>
        <a href="#disagreements">Explore the full record</a>
        <button onClick={() => go("shortlist")}>
          My shortlist ({state.saved.length})
        </button>
        {stage !== "intro" && (
          <button onClick={reset}>Reset answers &amp; shortlist</button>
        )}
      </nav>
      {!storageAvailable && (
        <p className={styles.note}>
          Browser storage is unavailable. You can still use the guide, but your
          choices will not survive a reload.
        </p>
      )}
      <noscript>
        <p>
          The guided questions need JavaScript. The complete candidate profiles
          and research remain available below.
        </p>
      </noscript>
    </section>
  );
}
function ShortlistCard({
  person,
  topic,
  remove,
}: {
  person: Candidate;
  topic: string;
  remove: () => void;
}) {
  const q = questions.find((q) => q.id === topic);
  const position = q ? person.analysis?.issues[q.issue] : undefined;
  const experience = discoveryEvidence(person).experience;
  return (
    <article className={styles.card}>
      <header className={styles.identity}>
        <div className={styles.portrait}>
          <CandidatePortrait person={person} compact />
        </div>
        <h3>{person.name}</h3>
      </header>
      <p>
        {topic === "experience"
          ? person.background
          : topic === "promises"
            ? person.summary
            : (position?.position ??
              "A specific position has not been established in our reviewed sources.")}
      </p>
      {position && <a href={position.source.url}>{position.source.label}</a>}
      {topic === "experience" && (
        <>
          <p className={styles.note}>
            Reported roles, not a rating of successful outcomes.
          </p>
          {experience.map((e) => (
            <p key={e.id}>
              <a href={e.source.url}>{e.source.label}</a>
            </p>
          ))}
        </>
      )}
      {topic === "promises" && (
        <p>
          <strong>What still needs an answer:</strong> {person.question}
        </p>
      )}
      <details>
        <summary>Tradeoffs &amp; fuller context</summary>
        <p>{person.analysis?.tradeoff ?? person.interpretation}</p>
      </details>
      <a href={`#${person.id}`}>Complete profile &amp; record →</a>
      <button onClick={remove}>Remove {person.name}</button>
    </article>
  );
}
