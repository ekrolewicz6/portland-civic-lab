/**
 * My ballot storage: the reader's own ordered list, kept only in this
 * browser tab (sessionStorage). Nothing here ever reaches a URL, an
 * analytics event or another tab. Every access is guarded: when storage
 * throws (private mode, quota, disabled), reads and writes fall back to a
 * per-page in-memory map and the caller shows a visible notice.
 */

export type BallotState = {
  /** Candidate ids in the reader's order. */
  order: string[];
  /** Private note per candidate id, ≤80 characters. */
  notes: Record<string, string>;
};

export const BALLOT_MAX = 6;
export const NOTE_MAX = 80;

export const ballotKey = (raceId: string) => `pcl-ballot-${raceId}`;

export const emptyBallot = (): BallotState => ({ order: [], notes: {} });

const memory = new Map<string, BallotState>();

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.sessionStorage;
    // Some browsers expose the object but throw on access.
    const probe = "__pcl_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** Drop unknown ids and over-long notes; cap at six names; keep order. */
export function sanitizeBallot(input: unknown, validIds: readonly string[]): BallotState {
  const valid = new Set(validIds);
  const out = emptyBallot();
  if (!input || typeof input !== "object") return out;
  const raw = input as { order?: unknown; notes?: unknown };
  if (Array.isArray(raw.order)) {
    for (const id of raw.order) {
      if (typeof id === "string" && valid.has(id) && !out.order.includes(id)) out.order.push(id);
      if (out.order.length >= BALLOT_MAX) break;
    }
  }
  if (raw.notes && typeof raw.notes === "object") {
    for (const [id, note] of Object.entries(raw.notes as Record<string, unknown>)) {
      if (typeof note === "string" && out.order.includes(id) && note.trim()) {
        out.notes[id] = note.slice(0, NOTE_MAX);
      }
    }
  }
  return out;
}

export type BallotRead = {
  state: BallotState;
  /** False when this browser could not persist the list across a reload. */
  persistent: boolean;
};

export function readBallot(raceId: string, validIds: readonly string[]): BallotRead {
  const key = ballotKey(raceId);
  const s = storage();
  if (!s) {
    return { state: sanitizeBallot(memory.get(key), validIds), persistent: false };
  }
  try {
    const raw = s.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return { state: sanitizeBallot(parsed, validIds), persistent: true };
  } catch {
    return { state: sanitizeBallot(memory.get(key), validIds), persistent: false };
  }
}

/** Returns true when the write reached session storage. */
export function writeBallot(raceId: string, state: BallotState): boolean {
  const key = ballotKey(raceId);
  memory.set(key, state);
  const s = storage();
  if (!s) return false;
  try {
    if (state.order.length === 0) s.removeItem(key);
    else s.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearBallot(raceId: string): boolean {
  return writeBallot(raceId, emptyBallot());
}

/* ── Pure list operations, used by the panel ─────────────────────────── */

export function addToBallot(state: BallotState, id: string): BallotState {
  if (state.order.includes(id) || state.order.length >= BALLOT_MAX) return state;
  return { ...state, order: [...state.order, id] };
}

export function removeFromBallot(state: BallotState, id: string): BallotState {
  if (!state.order.includes(id)) return state;
  const notes = { ...state.notes };
  delete notes[id];
  return { order: state.order.filter((x) => x !== id), notes };
}

export function moveInBallot(state: BallotState, id: string, delta: -1 | 1): BallotState {
  const from = state.order.indexOf(id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= state.order.length) return state;
  const order = [...state.order];
  order.splice(from, 1);
  order.splice(to, 0, id);
  return { ...state, order };
}

export function noteInBallot(state: BallotState, id: string, note: string): BallotState {
  const notes = { ...state.notes };
  const trimmed = note.slice(0, NOTE_MAX);
  if (trimmed.trim()) notes[id] = trimmed;
  else delete notes[id];
  return { ...state, notes };
}
