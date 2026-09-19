"use client";
import { useEffect, useState } from "react";
import {
  comparisonTopics,
  type ComparisonTopic,
} from "@/lib/voters-guide/council-topics";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import {
  comparisonEvent,
  comparisonChangeEvent,
} from "@/lib/voters-guide/explorer";
import ShareGuide from "./ShareGuide";
import journey from "./journey.module.css";
import { comparisonFragment, sharedComparison } from "@/lib/voters-guide/journey";
import CandidatePortrait from "./CandidatePortrait";
import CouncilDisagreements, {
  CouncilIssuePicker,
  DecisionExplanation,
} from "./CouncilRecord";
import { Printer } from "lucide-react";
import type { Candidate, Evidence, Race } from "@/lib/voters-guide/types";
import styles from "@/app/(public)/voters-guide/guide.module.css";
function Source({ source }: { source: Evidence }) {
  return (
    <>
      <a href={source.url}>{source.label}</a>
      <small>
        {source.kind} · {source.date}
      </small>
      {source.note && <small>{source.note}</small>}
    </>
  );
}
function Profile({
  person,
  showPortrait,
}: {
  person: Candidate;
  showPortrait: boolean;
}) {
  const [recordIssue, setRecordIssue] = useState("supplemental-budget");
  const selectedDecisions = councilDisagreements.find(
    (item) => item.id === recordIssue,
  )!.decisionIds;
  return (
    <article
      className={styles.candidate}
      id={person.id}
      data-profile={person.id}
      aria-labelledby={`${person.id}-title`}
    >
      <header className={styles.candidateHead}>
        {showPortrait && (
          <div className={styles.profilePortrait}>
            <CandidatePortrait person={person} />
          </div>
        )}
        <div className={styles.profileIdentity}>
          <div className={styles.eyebrow}>{person.affiliation}</div>
          <h2 id={`${person.id}-title`}>
            <a href={`#${person.id}`}>{person.name}</a>
          </h2>
          <p>{person.background}</p>
          <a href="#find-candidates">← Back to quick comparison</a>
          <ShareGuide title={person.name + " · Portland Civic Lab"} fragment={person.id} label="Share this profile" />
          {person.portrait && (
            <a className={styles.photoCredit} href={person.portrait.sourceUrl}>
              Photo: {person.portrait.credit} ↗
            </a>
          )}
        </div>
      </header>
      <div className={styles.candidateBody}>
        <h3>What they say they would do</h3>
        <p>{person.summary}</p>
        {person.priorities.length > 0 && (
          <ul>
            {person.priorities.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {person.missing && <p className={styles.gap}>{person.missing}</p>}
        <div className={styles.interpretation}>
          <h3>What guides their choices · our interpretation</h3>
          {person.analysis?.values.length ? (
            <div className={styles.valueTags}>
              {person.analysis.values.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          ) : null}
          <p>{person.analysis?.tradeoff ?? person.interpretation}</p>
          {person.analysis && (
            <div className={styles.inlineSources}>
              {person.analysis.sources.map((source) => (
                <a key={source.url} href={source.url}>
                  {source.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
        {person.analysis && (
          <details className={styles.issueDisclosure}>
            <summary>Issue-by-issue positions and evidence</summary>
            {comparisonTopics
              .filter(
                (t) =>
                  t.id !== "values" &&
                  t.id !== "record" &&
                  t.id !== "experience",
              )
              .map((t) => {
                const issue =
                  person.analysis?.issues[
                    t.id as "housing" | "safety" | "money" | "climate"
                  ];
                return (
                  <div key={t.id} className={styles.record}>
                    <h3>{t.label}</h3>
                    <p>
                      {issue?.position ??
                        "No specific position established in the reviewed sources. This is a research gap, not evidence of neutrality or opposition."}
                    </p>
                    {issue && <Source source={issue.source} />}
                  </div>
                );
              })}
          </details>
        )}
        <h3>Decisions &amp; reasons</h3>
        {person.record?.some((entry) => entry.decisionId) && (
          <CouncilIssuePicker
            value={recordIssue}
            onChange={setRecordIssue}
            label={`Record issue for ${person.name}`}
          />
        )}
        {person.record?.length ? (
          person.record.map((r, i) => {
            const decision = councilDecisions.find(
              (d) => d.id === r.decisionId,
            );
            return decision ? (
              <details
                className={styles.profileDecision}
                key={r.decisionId}
                data-active={selectedDecisions.includes(decision.id)}
              >
                <summary>
                  {decision.title} <span>· {decision.votes[person.name]}</span>
                </summary>
                <div className={styles.eyebrow}>{decision.source.date}</div>
                <p>{decision.summary}</p>
                <DecisionExplanation person={person} decision={decision} />
              </details>
            ) : (
              <div className={styles.record} key={i}>
                <p>{r.text}</p>
                <Source source={r.source} />
              </div>
            );
          })
        ) : (
          <p>
            Independent record review is not yet complete. The policy summary
            above is attributed to the linked candidate materials.
          </p>
        )}
        <div className={styles.questions}>
          <h3>A question the evidence leaves open</h3>
          <p>{person.question}</p>
        </div>
        <details className={styles.sources}>
          <summary>
            Sources behind this profile ({person.sources.length})
          </summary>
          <ol>
            {person.sources.map((s, i) => (
              <li key={`${s.url}-${i}`}>
                <Source source={s} />
              </li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  );
}
function ComparisonAnswer({
  person,
  topic,
}: {
  person: Candidate;
  topic: ComparisonTopic;
}) {
  const issue =
    topic !== "values" && topic !== "record" && topic !== "experience"
      ? person.analysis?.issues[topic]
      : undefined;
  return (
    <section
      className={styles.answerCard}
      aria-label={`${person.name} comparison`}
    >
      <header className={styles.answerIdentity}>
        <div className={styles.answerPortrait}>
          <CandidatePortrait person={person} />
        </div>
        <div>
          <span className={styles.eyebrow}>
            {person.background.startsWith("Incumbent")
              ? "Incumbent"
              : "Candidate"}
          </span>
          <h4>{person.name}</h4>
          <a href={`#${person.id}`}>Full brief ↗</a>
        </div>
      </header>
      {topic === "experience" ? (
        <>
          <div className={styles.evidenceLabel}>Reported experience</div>
          <p>{person.background}</p>
          <div className={styles.answerSources}>
            <Source source={person.sources[0]} />
          </div>
        </>
      ) : topic === "values" ? (
        <>
          <div className={styles.evidenceLabel}>Our interpretation</div>
          <div className={styles.valueTags}>
            {person.analysis?.values.length ? (
              person.analysis.values.map((v) => <span key={v}>{v}</span>)
            ) : (
              <span>Insufficient current evidence</span>
            )}
          </div>
          <p>{person.analysis?.tradeoff ?? person.interpretation}</p>
          <h5>The question to resolve</h5>
          <p>{person.question}</p>
          <div className={styles.answerSources}>
            {person.analysis?.sources.map((s) => (
              <Source key={s.url} source={s} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.evidenceLabel}>
            {issue ? "Stated position" : "Evidence gap"}
          </div>
          <p>
            {issue?.position ??
              "No specific position established in the reviewed sources. This is not evidence of neutrality or opposition."}
          </p>
          {issue ? (
            <div className={styles.answerSources}>
              <Source source={issue.source} />
            </div>
          ) : (
            <a href={`#${person.id}`}>Read the available evidence ↗</a>
          )}
        </>
      )}
    </section>
  );
}

export default function CandidateComparison({ race }: { race: Race }) {
  const [selected, setSelected] = useState<string[]>(["", "", ""]);
  const [third, setThird] = useState(false);
  const [topic, setTopic] = useState<ComparisonTopic>("values");
  const [recordIssue, setRecordIssue] = useState("supplemental-budget");
  useEffect(() => {
    function open(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail?.raceId !== race.id || !Array.isArray(detail.selected)) return;
      const ids = [
        ...new Set<string>(
          detail.selected.filter((id: string) =>
            race.candidates.some((p) => p.id === id),
          ),
        ),
      ].slice(0, 3);
      setSelected([ids[0] ?? "", ids[1] ?? "", ids[2] ?? ""]);
      setThird(ids.length === 3);
      if (comparisonTopics.some((t) => t.id === detail.topic))
        setTopic(detail.topic);
    }
    window.addEventListener(comparisonEvent, open);
    return () => window.removeEventListener(comparisonEvent, open);
  }, [race.id, race.candidates]);

  useEffect(() => {
    function restoreSharedView() {
      const value = sharedComparison(window.location.hash, race);
      if (!value) return;
      setSelected([value.ids[0] ?? "", value.ids[1] ?? "", value.ids[2] ?? ""]);
      setThird(value.ids.length === 3);
      setTopic(value.topic);
      setRecordIssue(value.issue);
      window.dispatchEvent(new CustomEvent(comparisonChangeEvent, {
        detail: { raceId: race.id, selected: value.ids, topic: value.topic },
      }));
    }
    restoreSharedView();
    window.addEventListener("hashchange", restoreSharedView);
    return () => window.removeEventListener("hashchange", restoreSharedView);
  }, [race]);

  const recordTopic = councilDisagreements.find(
    (item) => item.id === recordIssue,
  )!;
  const people = [...race.candidates].sort((a, b) =>
    a.name.localeCompare(b.name, "en"),
  );
  const compared = people.filter((p) => selected.includes(p.id));
  const count = compared.length;
  const hasPortraits = people.some((p) => p.portrait);
  const currentTopic = comparisonTopics.find((t) => t.id === topic)!;
  function share(nextSelected: string[] | undefined, nextTopic = topic) {
    window.dispatchEvent(
      new CustomEvent(comparisonChangeEvent, {
        detail: { raceId: race.id, selected: nextSelected, topic: nextTopic },
      }),
    );
  }
  function toggle(id: string) {
    const index = selected.indexOf("");
    if (!selected.includes(id) && index < 0) return;
    const next = selected.includes(id)
      ? selected.map((v) => (v === id ? "" : v))
      : selected.map((v, i) => (i === index ? id : v));
    setSelected(next);
    share(next);
  }
  function clear() {
    setSelected(["", "", ""]);
    setThird(false);
    share([]);
  }
  function print() {
    const closed = [
      ...document.querySelectorAll<HTMLDetailsElement>("details"),
    ].filter((d) => !d.open);
    closed.forEach((d) => {
      d.open = true;
    });
    window.addEventListener(
      "afterprint",
      () =>
        closed.forEach((d) => {
          d.open = false;
        }),
      { once: true },
    );
    window.print();
  }
  return (
    <>
      <div data-panel="record"><CouncilDisagreements people={people} /></div>
      <section
        className={styles.compareStudio}
        id="compare"
        aria-labelledby="compare-heading"
      >
        <a href="#find-candidates">← Back to quick comparison</a>
        <div className={styles.studioHeading}>
          <div>
            <div className={styles.eyebrow}>Your choice. A clearer view.</div>
            <h2 id="compare-heading">
              Same issue.
              <br />
              <em>Different choices.</em>
            </h2>
          </div>
          <p>
            Choose two names, then an issue. Read their answers together and
            decide which approach fits what matters to you.
          </p>
        </div>
        <div className={styles.pickerGrid}>
          {selected.map((value, index) =>
            index < 2 || third || selected[2] ? (
              <label key={index}>
                <span>
                  Candidate {index + 1}
                  {index === 2 ? " · optional" : ""}
                </span>
                <select
                  aria-label={`Candidate ${index + 1}`}
                  value={value}
                  onChange={(e) => {
                    const next = selected.map((v, i) =>
                      i === index ? e.target.value : v,
                    );
                    setSelected(next);
                    share(next);
                  }}
                >
                  <option value="">Choose a candidate</option>
                  {people.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={selected.includes(p.id) && value !== p.id}
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null,
          )}
          {!third && !selected[2] && (
            <button
              className={styles.addCandidate}
              onClick={() => setThird(true)}
            >
              + Add a third candidate
            </button>
          )}
        </div>
        <div className={styles.selectionMeta}>
          <span role="status">
            {count < 2
              ? `${count} selected · choose ${2 - count} more to compare`
              : `Comparing ${compared.map((p) => p.name).join(" and ")}`}
          </span>
          {count > 0 && <button onClick={clear}>Clear comparison</button>}
        </div>
        <div
          className={styles.topicPicker}
          role="group"
          aria-label="Comparison issue"
        >
          {comparisonTopics.map((t) => (
            <button
              key={t.id}
              aria-pressed={topic === t.id}
              onClick={() => {
                setTopic(t.id);
                share(undefined, t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.topicIntroduction}>
          <div className={styles.eyebrow}>{currentTopic.label}</div>
          <h3>{currentTopic.question}</h3>
          <p>{currentTopic.context}</p>
        </div>
        {count < 2 ? (
          <div className={styles.comparisonEmpty}>
            <span aria-hidden="true">A ↔ B</span>
            <h3>A fair comparison starts with the same question.</h3>
            <p>
              Choose two names above to get started. You can change either
              candidate or explore another issue at any time.
            </p>
          </div>
        ) : topic === "record" ? (
          <div className={styles.decisionList}>
            <CouncilIssuePicker
              value={recordIssue}
              onChange={setRecordIssue}
              label="Recorded decisions issue"
            />
            <p>{recordTopic.context}</p>
            {councilDecisions.map((decision) => (
              <section
                className={styles.decisionCard}
                key={decision.id}
                data-active={recordTopic.decisionIds.includes(decision.id)}
              >
                <div className={styles.eyebrow}>
                  {decision.voteLabel ?? "Final action"} ·{" "}
                  {decision.source.date}
                </div>
                <h4>{decision.title}</h4>
                <p>{decision.summary}</p>
                <div className={styles.decisionAccounts} data-count={count}>
                  {compared.map((p) => (
                    <DecisionExplanation
                      key={p.id}
                      person={p}
                      decision={decision}
                      identity
                    />
                  ))}
                </div>
                <p className={styles.decisionLimit}>{decision.limit}</p>
                <div className={styles.answerSources}>
                  <Source source={decision.source} />
                </div>
              </section>
            ))}
            <p className={styles.researchBoundary}>
              A challenger has no vote in these Council roll calls. That is not
              a judgment about experience or a prediction of how they would
              vote. Other verified historical statements appear in individual
              briefs.
            </p>
          </div>
        ) : (
          <div className={styles.answerGrid} data-count={count}>
            {compared.map((p) => (
              <ComparisonAnswer key={p.id} person={p} topic={topic} />
            ))}
          </div>
        )}
        <p className={styles.comparisonPrivacy}>
          Candidates appear alphabetically. Sharing includes the selected names
          and topic, without a score or suggested ranking.
        </p>
        {count >= 2 && <section className={journey.takeaway} aria-label="Your next step">
          <h3>What matters most to your choice?</h3>
          <p>Consider their plans, their experience, and the choices they have made. You can agree on one issue and disagree on another.</p>
          <div className={journey.actions}>
            <ShareGuide title={race.title + " · Candidate comparison"} fragment={comparisonFragment(selected, topic, recordIssue)} />
            <a href="#find-candidates">Explore more candidates →</a>
          </div>
          <p>Send someone this same comparison, or keep the link to return to it.</p>
        </section>}
      </section>
      <div className={styles.compareControls} id="candidates">
        <div className={styles.sectionTop}>
          <div>
            <div className={styles.eyebrow}>The complete field</div>
            <h2>Meet all {people.length} candidates.</h2>
          </div>
          <button className={styles.printButton} onClick={print}>
            <Printer size={16} aria-hidden="true" /> Print this race
          </button>
        </div>
        <p className={styles.directoryNote}>
          Open a brief or choose up to three candidates. Photo credits appear in
          each brief.
        </p>
        {count > 0 && (
          <div className={styles.directoryCompare}>
            <span>{count} of 3 selected</span>
            <a href="#compare">
              {count >= 2 ? "See comparison ↑" : "Choose another candidate ↑"}
            </a>
            <button onClick={clear}>Clear</button>
          </div>
        )}
        <div
          className={
            hasPortraits ? styles.portraitDirectory : styles.candidateChoices
          }
          role="group"
          aria-label="Candidates to compare"
        >
          {people.map((p) => (
            <div key={p.id} className={styles.directoryPerson}>
              <a className={styles.directoryLink} href={`#${p.id}`}>
                <CandidatePortrait person={p} />
                <span className={styles.directoryName}>{p.name}</span>
                <span className={styles.readBrief}>
                  Read their brief <span aria-hidden="true">↗</span>
                </span>
              </a>
              <label className={styles.portraitChoice}>
                <input
                  type="checkbox"
                  aria-label={`Compare ${p.name}`}
                  checked={selected.includes(p.id)}
                  disabled={count === 3 && !selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
                Compare<span className={styles.srOnly}> {p.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.candidateGrid} data-panel="profiles">
        {people.map((person) => (
          <Profile
            person={person}
            showPortrait={hasPortraits}
            key={person.id}
          />
        ))}
      </div>
    </>
  );
}
