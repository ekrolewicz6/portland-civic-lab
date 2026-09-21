"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Bookmark, X } from "lucide-react";
import type { ClientSheet } from "@/lib/voters-guide/race-sheet";
import { isIssueId, issueById, type IssueId } from "@/lib/voters-guide/race-sheet/issues";
import { sharedComparison } from "@/lib/voters-guide/journey";
import {
  BALLOT_MAX,
  addToBallot,
  clearBallot,
  emptyBallot,
  readBallot,
  removeFromBallot,
  writeBallot,
  type BallotState,
} from "@/lib/voters-guide/race-sheet/ballot-store";
import ShareGuide from "@/components/voters-guide/ShareGuide";
import c from "./controls.module.css";
import ChipRail from "./ChipRail";
import BottomBar from "./BottomBar";
import StanceGrid from "./StanceGrid";
import TopicPicker from "./TopicPicker";
import MiniChips from "./MiniChips";
import MyBallot from "./MyBallot";
import styles from "./race-sheet.module.css";

const ISSUE_HASH = "#issue=";

/** The hash carries only public view state: #issue=<id>&topics=<id,id>. */
function readViewHash(hash: string, validTopics: string[]) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const issue = params.get("issue");
  const topics = (params.get("topics") ?? "").split(",").filter((t) => validTopics.includes(t));
  return { issue: issue && isIssueId(issue) ? issue : null, topics };
}
function writeViewHash(issue: IssueId | null, topics: string[]) {
  // Ids are known slugs, so the fragment is written by hand and stays readable (a bare comma, not %2C).
  const q = [issue ? `issue=${issue}` : "", topics.length ? `topics=${topics.join(",")}` : ""].filter(Boolean).join("&");
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", q ? `${pathname}${search}#${q}` : `${pathname}${search}`);
}

/** The site's sticky header: the first <header> that is sticky or fixed. */
function siteHeader(): HTMLElement | null {
  const headers = Array.from(document.querySelectorAll<HTMLElement>("header"));
  return (
    headers.find((h) => {
      const position = getComputedStyle(h).position;
      return position === "sticky" || position === "fixed";
    }) ??
    headers[0] ??
    null
  );
}

export default function RaceSheet({ sheet }: { sheet: ClientSheet }) {
  const raceId = sheet.raceId;
  const [active, setActive] = useState<IssueId | null>(null);
  const [extra, setExtra] = useState<string[]>([]);
  const topicIds = useMemo(() => sheet.topics.map((t) => t.id), [sheet.topics]);
  const [ballot, setBallot] = useState<BallotState>(emptyBallot);
  const [persistent, setPersistent] = useState(true);
  const [ballotOpen, setBallotOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerId = useId();
  const [notice, setNotice] = useState<string | null>(null);
  const [shared, setShared] = useState<string[] | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const validIds = useRef(sheet.rows.map((r) => r.id));
  /** The control that opened My ballot, captured at click time so focus can return to it. */
  const ballotOpener = useRef<HTMLElement | null>(null);

  /* (1) Measure the real site header so the rail sticks just under it. */
  useEffect(() => {
    const header = siteHeader();
    const root = document.documentElement;
    if (!header) return;
    const publish = () => root.style.setProperty("--site-header-height", `${header.getBoundingClientRect().height}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  /* (4) Hydrate the reader's list from this tab's storage. */
  useEffect(() => {
    const { state, persistent: ok } = readBallot(raceId, validIds.current);
    setBallot(state);
    setPersistent(ok);
  }, [raceId]);

  /* (5) Shared and legacy fragments on mount; #issue= also on hashchange. */
  useEffect(() => {
    function readIssueHash() {
      const hash = window.location.hash;
      if (!hash.startsWith(ISSUE_HASH) && !hash.startsWith("#topics=")) return false;
      const view = readViewHash(hash, topicIds);
      setActive(view.issue);
      setExtra(view.topics);
      return true;
    }
    const hash = window.location.hash;
    if (!readIssueHash() && hash.length > 1) {
      if (hash.startsWith("#compare?")) {
        const view = sharedComparison(hash, { candidates: sheet.candidateIds.map((id) => ({ id })) });
        if (view && view.ids.length > 0) setShared(view.ids);
      } else if (hash.startsWith("#disagreement-")) {
        // Legacy CouncilRecord anchors live on the votes route (design §6).
        window.location.replace(`/voters-guide/${raceId}/votes#${hash.slice("#disagreement-".length)}`);
      } else {
        const id = decodeURIComponent(hash.slice(1)).split("?")[0];
        if (validIds.current.includes(id)) {
          window.location.replace(`/voters-guide/${raceId}/${id}`);
        }
      }
    }
    window.addEventListener("hashchange", readIssueHash);
    return () => window.removeEventListener("hashchange", readIssueHash);
  }, [raceId, sheet.candidateIds, topicIds]);

  /* Chip change mirrors into the hash, never pushing history. */
  const changeIssue = useCallback(
    (issue: IssueId | null) => {
      setActive(issue);
      writeViewHash(issue, extra);
    },
    [extra],
  );
  const changeTopics = useCallback(
    (next: string[]) => {
      setExtra(next);
      writeViewHash(active, next);
    },
    [active],
  );
  const extraTopicsSelected = useMemo(() => extra.map((id) => sheet.topics.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => Boolean(t)), [extra, sheet.topics]);

  /* Ballot writes: storage first, in-memory fallback with a visible notice. */
  const commit = useCallback(
    (next: BallotState) => {
      setBallot(next);
      const ok = writeBallot(raceId, next);
      setPersistent(ok);
    },
    [raceId],
  );

  const flash = useCallback((text: string) => {
    setNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4000);
  }, []);
  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      if (ballot.order.includes(id)) {
        commit(removeFromBallot(ballot, id));
        return;
      }
      if (ballot.order.length >= BALLOT_MAX) {
        flash(`Your ballot holds ${BALLOT_MAX} names. Remove one to add another.`);
        return;
      }
      commit(addToBallot(ballot, id));
    },
    [ballot, commit, flash],
  );

  const openBallot = useCallback((open: boolean, opener?: HTMLElement) => {
    if (open) ballotOpener.current = opener ?? null;
    setBallotOpen(open);
  }, []);

  const issue = active ? (issueById(active) ?? null) : null;
  const savedSet = new Set(ballot.order);
  /* Shared names render and save in the site's A–Z order, never in the link author's order. */
  const sharedRows = useMemo(() => (shared ? sheet.rows.filter((r) => shared.includes(r.id)) : []), [shared, sheet.rows]);

  const saveShared = useCallback(() => {
    if (!shared) return;
    let next = ballot;
    let skipped = 0;
    for (const id of sharedRows.map((r) => r.id)) {
      const before = next;
      next = addToBallot(next, id);
      if (next === before && !before.order.includes(id)) skipped += 1;
    }
    commit(next);
    if (skipped > 0) flash(`Your ballot holds ${BALLOT_MAX} names. ${skipped} could not be added.`);
    setShared(null);
  }, [shared, sharedRows, ballot, commit, flash]);

  return (
    <div className={styles.sheet} data-race-sheet data-issue={active ?? "summary"}>
      <ChipRail
        active={active}
        onChange={changeIssue}
        coverage={sheet.coverage}
        total={sheet.rows.length}
        pickerOpen={pickerOpen}
        pickerId={pickerId}
        selectedTopics={extra.length}
        onTogglePicker={() => setPickerOpen((v) => !v)}
      />

      <BottomBar raceId={raceId} savedCount={ballot.order.length} onOpenBallot={(opener) => openBallot(true, opener)} />

      {sharedRows.length > 0 && (
        <section className={styles.sharedView} aria-labelledby="shared-view-title">
          <div className={styles.sharedHead}>
            <p className={styles.eyebrow}>Shared view · sent to you</p>
            <button type="button" className={`${c.btn} ${c.icon}`} aria-label="Dismiss shared view" onClick={() => setShared(null)}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <h2 id="shared-view-title" className={styles.sharedTitle}>
            {sharedRows.map((r) => r.name).join(" · ")}
          </h2>
          <ul className={styles.sharedList}>
            {sharedRows.map((r) => (
              <li key={r.id}>
                <span className={styles.name}>{r.name}</span>
                <MiniChips row={r} />
              </li>
            ))}
          </ul>
          <p className={styles.sharedNote}>Nothing here is saved unless you choose to. Saved A–Z; reorder below.</p>
          <button type="button" className={`${c.btn} ${c.primary}`} onClick={saveShared}>
            <Bookmark size={16} aria-hidden="true" />
            Save these to my ballot
          </button>
        </section>
      )}

      <TopicPicker
        id={pickerId}
        open={pickerOpen}
        topics={sheet.topics}
        coverage={sheet.topicCoverage}
        total={sheet.rows.length}
        selected={extra}
        onChange={changeTopics}
      />

      <StanceGrid
        rows={sheet.rows}
        raceId={raceId}
        active={active}
        coverage={sheet.coverage}
        extra={extraTopicsSelected}
        topicCoverage={sheet.topicCoverage}
        topicDecisions={sheet.topicDecisions}
        saved={savedSet}
        onToggleSave={toggleSave}
        onHighlight={changeIssue}
      />

      <div className={styles.shareWrap}>
        <ShareGuide
          title={`${sheet.raceTitle} · Voter guide`}
          fragment={[active ? `issue=${active}` : "", extra.length ? `topics=${extra.join(",")}` : ""].filter(Boolean).join("&")}
          label={active && issue ? `Share the ${issue.short.toLowerCase()} view` : "Share this list"}
        />
      </div>

      <MyBallot
        sheet={sheet}
        state={ballot}
        persistent={persistent}
        open={ballotOpen}
        opener={ballotOpener}
        onOpenChange={openBallot}
        onChange={commit}
        onClear={() => {
          const ok = clearBallot(raceId);
          setBallot(emptyBallot());
          setPersistent(ok);
        }}
        notice={notice}
      />
    </div>
  );
}
