'use client';

import { useRef, useState, type RefObject } from 'react';
import { nearestPoint, nearestPolyline, rowAt, stepReading, type LinePoint, type Reading } from '@/lib/campaign-finance/timeline-lines';

/** A line that can be read: its weekly rows in date order and where each one is drawn, in the chart's own units. */
export type ReadLine = { id: string; rows: { weekStart: string }[]; at: LinePoint[] };

/** How close a pointer must be to a line, in pixels, before the line answers. Fingers get more room. */
const MOUSE_REACH = 36, TOUCH_REACH = 44;
const same = (a: Reading | null, b: Reading | null) => a?.id === b?.id && a?.week === b?.week;

/**
 * The reading that follows a pointer, a finger or the arrow keys along the timeline's lines.
 * Pointing near a line lifts it, a click or tap keeps it lifted, and a sideways drag reads
 * along it. A reading is kept as a candidate and a week, so it survives a change of view,
 * money type or time period, and drops out when its candidate is no longer drawn.
 * `lines` holds only lines with at least one row; `view` is the size the chart is drawn at.
 */
export function useLineReading<Line extends ReadLine>(lines: Line[], plot: RefObject<HTMLElement | null>, view: { width: number; height: number }) {
  const [hover, setHover] = useState<Reading | null>(null);
  const [pinned, setPinned] = useState<Reading | null>(null);
  const [keys, setKeys] = useState(false);
  const [said, setSaid] = useState<'reading' | 'all' | ''>('');
  const pointer = useRef('mouse');
  const drag = useRef<{ x: number; y: number; id: string | null } | null>(null);
  const dragged = useRef(false);

  const resolve = (pick: Reading | null) => {
    const line = pick ? lines.find(item => item.id === pick.id) : undefined;
    if (!line || !pick) return null;
    const index = rowAt(line.rows, pick.week);
    return { line, index, row: line.rows[index] as Line['rows'][number] };
  };
  const held = resolve(pinned);
  const active = resolve(hover) ?? held;

  /** A pointer's place in the chart's own units, and how many screen pixels one unit takes. */
  const inView = (clientX: number, clientY: number, node: Element) => {
    const box = node.getBoundingClientRect();
    const scale = Math.max(1, box.width) / view.width;
    return { x: (clientX - box.left) / scale, y: (clientY - box.top) / scale, scale };
  };
  const weekUnder = (line: Line, x: number): Reading => ({ id: line.id, week: line.rows[nearestPoint(line.at, x)].weekStart });
  const atEnd = (line: Line): Reading => ({ id: line.id, week: line.rows[line.rows.length - 1].weekStart });
  /** The line within reach of a pointer. The line already being read keeps the reading where others run alongside it. */
  const locate = (at: { x: number; y: number; scale: number }, reach: number) => {
    const near = nearestPolyline(lines.map(line => line.at), at.x, at.y, active ? lines.indexOf(active.line) : -1);
    return near && near.distance * at.scale <= reach ? weekUnder(lines[near.index], at.x) : null;
  };
  /** Bring the chart back on screen when a name is picked from a legend that has scrolled past it. */
  const reveal = () => {
    const node = plot.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const visible = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 72);
    if (visible < 0.6 * box.height) node.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const clear = () => { setPinned(null); setHover(null); setSaid(''); };

  return {
    /** The line and week being read now: under the pointer if there is one, otherwise the pinned one. */
    active,
    /** The line kept lifted by a click, a tap or the keyboard. */
    held,
    /** True while the chart holds keyboard focus. */
    keys,
    /** What the live region should say: the pinned reading after a key press, or that every line is back. */
    said,
    clear,
    /** Handlers for the element that wraps the chart. */
    area: {
      onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
        const at = inView(event.clientX, event.clientY, event.currentTarget);
        if (event.pointerType === 'mouse') {
          const near = locate(at, MOUSE_REACH);
          setHover(current => same(current, near) ? current : near);
          return;
        }
        const touch = drag.current;
        if (!touch) return;
        // A sideways drag reads along one line. Vertical drags stay with the page, which scrolls.
        if (touch.id === null) {
          if (Math.abs(event.clientX - touch.x) < 8) return;
          touch.id = locate(inView(touch.x, touch.y, event.currentTarget), TOUCH_REACH)?.id ?? held?.line.id ?? '';
          dragged.current = true;
        }
        const line = lines.find(item => item.id === touch.id);
        if (!line) return;
        const next = weekUnder(line, at.x);
        setPinned(current => same(current, next) ? current : next);
        setSaid('');
      },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        pointer.current = event.pointerType;
        dragged.current = false;
        drag.current = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY, id: null };
      },
      onPointerUp: () => { drag.current = null; },
      onPointerCancel: () => { drag.current = null; },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHover(null); },
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        // The click that can follow a short drag would otherwise move the reading to another line.
        if (dragged.current) { dragged.current = false; return; }
        const touch = pointer.current !== 'mouse';
        const near = locate(inView(event.clientX, event.clientY, event.currentTarget), touch ? TOUCH_REACH : MOUSE_REACH);
        // A second mouse click on the same line lets it go. A second tap moves the reading along it.
        setPinned(current => near && !touch && current?.id === near.id ? null : near);
        setSaid('');
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Escape') {
          if (!held) return;
          setPinned(null); setHover(null); setSaid('all');
          event.preventDefault();
          return;
        }
        const next = stepReading(lines, held ? { id: held.line.id, week: held.row.weekStart } : null, event.key);
        if (!next) return;
        event.preventDefault();
        setPinned(next); setHover(null); setSaid('reading');
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => { if (event.target === event.currentTarget) setKeys(event.currentTarget.matches(':focus-visible')); },
      onBlur: () => setKeys(false),
    },
    /** Handlers for a candidate's name in the legend: pointing at it lifts the line, pressing it keeps the line lifted. */
    name: (line: Line) => ({
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHover(atEnd(line)); },
      onPointerLeave: (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHover(null); },
      onFocus: (event: React.FocusEvent<HTMLElement>) => { if (event.currentTarget.matches(':focus-visible')) setHover(atEnd(line)); },
      onBlur: () => setHover(null),
      onClick: () => {
        const letGo = held?.line.id === line.id;
        setPinned(letGo ? null : atEnd(line)); setHover(null); setSaid('');
        if (!letGo) reveal();
      },
    }),
  };
}
