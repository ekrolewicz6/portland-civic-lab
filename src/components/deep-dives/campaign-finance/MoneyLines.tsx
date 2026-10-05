'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { addDays, axisDollars, nearestLine, shortDay, stepPath, valueAt, wholeDollars, type PlotPoint } from '@/lib/campaign-finance/money-flow';
import s from './money-flow.module.css';

export type Line = {
  id: string; name: string; href?: string; color: string; dashed: boolean;
  /** Running total inside the chart's window. Empty when the campaign has no records. */
  points: PlotPoint[]; carried: boolean; totalCents: number; detail: string;
};
type Pick = { id: string; offset: number };
type Props = {
  label: string; measure: 'raised' | 'paid'; start: string; span: number; top: number; lines: Line[];
  ticks: { offset: number; label: string; year?: string }[]; flags: { id: string; offset: number }[];
};

/** How close a pointer must be to a line, in pixels, before the line answers. Fingers get more room. */
const MOUSE_REACH = 36, TOUCH_REACH = 44;
const firstDay = (line: Line) => line.points[0][0];
const lastDay = (line: Line) => line.points.at(-1)![0];
const within = (line: Line, offset: number) => Math.min(lastDay(line), Math.max(firstDay(line), offset));

/**
 * One panel of the lead chart: the lines, the reading that follows a pointer, finger or
 * arrow key, and the legend. Pointing at a line or a name lifts that campaign out of the
 * rest; clicking or tapping keeps it lifted.
 */
export default function MoneyLines({ label, measure, start, span, top, lines, ticks, flags }: Props) {
  const drawn = useMemo(() => lines.filter(line => line.points.length), [lines]);
  const paths = useMemo(() => new Map(drawn.map(line => [line.id, stepPath(line.points, span, top, line.carried)])), [drawn, span, top]);
  const [hover, setHover] = useState<Pick | null>(null);
  const [pinned, setPinned] = useState<Pick | null>(null);
  const [keys, setKeys] = useState(false);
  const [spoken, setSpoken] = useState('');
  const area = useRef<HTMLDivElement>(null);
  const pointer = useRef('mouse');
  const drag = useRef<{ x: number; y: number; id: string | null } | null>(null);

  const verb = measure === 'raised' ? 'raised' : 'paid out';
  const shown = hover ?? pinned;
  const active = shown ? drawn.find(line => line.id === shown.id) : undefined;
  const pinnedLine = pinned ? drawn.find(line => line.id === pinned.id) : undefined;
  const reading = active && shown ? { x: shown.offset / Math.max(1, span), cents: valueAt(active.points, shown.offset), day: addDays(start, shown.offset) } : null;
  const atEnd = (line: Line): Pick => ({ id: line.id, offset: lastDay(line) });
  const describe = (line: Line, offset: number) => `${line.name}: ${wholeDollars(valueAt(line.points, offset))} ${verb} by ${shortDay(addDays(start, offset))}.`;

  const locate = (clientX: number, clientY: number, reach: number) => {
    const box = area.current?.getBoundingClientRect();
    if (!box) return null;
    const near = nearestLine(drawn, clientX - box.left, clientY - box.top, { width: box.width, height: box.height, span, top });
    return near && near.distance <= reach ? { line: drawn[near.index], offset: near.offset } : null;
  };
  const dayUnder = (clientX: number) => {
    const box = area.current!.getBoundingClientRect();
    return Math.round(span * (clientX - box.left) / Math.max(1, box.width));
  };
  /** Bring the chart back on screen when a name is picked from a legend that has scrolled past it. */
  const reveal = () => {
    const node = area.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const visible = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 72);
    if (visible < 0.6 * box.height) node.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const toggle = (line: Line) => {
    if (pinned?.id === line.id) { setPinned(null); return; }
    setPinned(atEnd(line));
    reveal();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!drawn.length) return;
    const index = pinnedLine ? drawn.indexOf(pinnedLine) : -1;
    const line = drawn[Math.max(index, 0)];
    const from = pinnedLine && pinned ? pinned.offset : lastDay(line);
    const days = event.shiftKey ? 1 : 7;
    let next: Pick;
    switch (event.key) {
      case 'ArrowLeft': next = { id: line.id, offset: within(line, from - days) }; break;
      case 'ArrowRight': next = { id: line.id, offset: within(line, from + days) }; break;
      case 'PageUp': next = { id: line.id, offset: within(line, from - 30) }; break;
      case 'PageDown': next = { id: line.id, offset: within(line, from + 30) }; break;
      case 'Home': next = { id: line.id, offset: firstDay(line) }; break;
      case 'End': next = atEnd(line); break;
      case 'ArrowDown': case 'ArrowUp': {
        const other = drawn[index < 0 ? 0 : (index + (event.key === 'ArrowDown' ? 1 : drawn.length - 1)) % drawn.length];
        next = { id: other.id, offset: within(other, from) };
        break;
      }
      case 'Escape': setPinned(null); setSpoken('All lines shown.'); event.preventDefault(); return;
      default: return;
    }
    event.preventDefault();
    setPinned(next);
    setSpoken(describe(drawn.find(item => item.id === next.id)!, next.offset));
  };

  return <>
    <div className={s.chart}>
      <div className={s.yLabels} aria-hidden="true">{[0, top / 2, top].map(value => <span key={value} style={{ top: `${100 - 100 * value / top}%` }}>{axisDollars(value)}</span>)}</div>
      <div className={s.area} ref={area} data-plot tabIndex={0} role="application" aria-label={`${label} Arrow keys: left and right move through time, up and down change campaign, Escape shows every line.`}
        onKeyDown={onKeyDown} onFocus={event => setKeys(event.currentTarget.matches(':focus-visible'))} onBlur={() => setKeys(false)}
        onPointerMove={event => {
          if (event.pointerType === 'mouse') { const near = locate(event.clientX, event.clientY, MOUSE_REACH); setHover(near ? { id: near.line.id, offset: near.offset } : null); return; }
          const held = drag.current;
          if (!held) return;
          // A sideways drag reads along one line. Vertical drags stay with the page, which scrolls.
          if (held.id === null) {
            if (Math.abs(event.clientX - held.x) < 8) return;
            held.id = locate(held.x, held.y, TOUCH_REACH)?.line.id ?? pinnedLine?.id ?? '';
          }
          const line = drawn.find(item => item.id === held.id);
          if (line) setPinned({ id: line.id, offset: within(line, dayUnder(event.clientX)) });
        }}
        onPointerDown={event => { pointer.current = event.pointerType; drag.current = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY, id: null }; }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
        onPointerLeave={event => { if (event.pointerType === 'mouse') setHover(null); }}
        onClick={event => {
          const touch = pointer.current !== 'mouse';
          const near = locate(event.clientX, event.clientY, touch ? TOUCH_REACH : MOUSE_REACH);
          if (!near) { setPinned(null); return; }
          // A second mouse click on the same line lets it go. A second tap moves the reading along it.
          setPinned(current => !touch && current?.id === near.line.id ? null : { id: near.line.id, offset: near.offset });
        }}>
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          {ticks.map(tick => <line key={tick.offset} x1={1000 * tick.offset / span} x2={1000 * tick.offset / span} y1="0" y2="300" stroke="#edf0e9" vectorEffect="non-scaling-stroke" />)}
          <line x1="0" x2="1000" y1="150" y2="150" stroke="#dde3db" vectorEffect="non-scaling-stroke" />
          <line x1="0" x2="1000" y1="0" y2="0" stroke="#dde3db" vectorEffect="non-scaling-stroke" />
          {flags.map(flag => <line key={flag.id} x1={1000 * flag.offset / span} x2={1000 * flag.offset / span} y1="0" y2="300" stroke="#7d8f84" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />)}
          {[...drawn].reverse().map(line => <path key={line.id} data-series={line.id} className={active && active.id !== line.id ? s.dim : undefined} d={paths.get(line.id)} fill="none" stroke={line.color} strokeWidth="2.5" strokeDasharray={line.dashed ? '7 4' : undefined} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
          {active ? <>
            <path d={paths.get(active.id)} fill="none" stroke="#fffdf8" strokeWidth="8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path data-lifted={active.id} d={paths.get(active.id)} fill="none" stroke={active.color} strokeWidth="4" strokeDasharray={active.dashed ? '9 4' : undefined} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </> : null}
        </svg>
        {flags.map((flag, index) => <span key={flag.id} className={s.flag} style={{ left: `${100 * flag.offset / span}%` }} aria-hidden="true">{index + 1}</span>)}
        {drawn.map(line => { const [offset, cents] = line.points.at(-1)!; return <span key={line.id} data-end={line.id} className={`${s.dot} ${active && active.id !== line.id ? s.dim : ''}`} aria-hidden="true" style={{ left: `${100 * offset / span}%`, top: `${100 - 100 * cents / top}%`, background: line.color }} />; })}
        {active && reading ? <>
          <span className={s.guide} style={{ left: `${100 * reading.x}%` }} aria-hidden="true" />
          <span className={s.marker} style={{ left: `${100 * reading.x}%`, top: `${100 - 100 * reading.cents / top}%`, background: active.color }} aria-hidden="true" />
          <div className={`${s.tip} ${reading.cents / top > 0.62 ? s.tipBelow : ''}`} data-tip style={{ left: `${(100 * reading.x).toFixed(2)}%`, '--slide': `${(-100 * reading.x).toFixed(2)}%`, top: `${100 - 100 * reading.cents / top}%` } as React.CSSProperties} aria-hidden="true">
            <b><i className={`${s.key} ${active.dashed ? s.keyDashed : ''}`} style={{ color: active.color }} />{active.name}</b>
            <span>{wholeDollars(reading.cents)} {verb} by {shortDay(reading.day)}</span>
          </div>
        </> : null}
        <span className={s.spoken} aria-live="polite">{spoken}</span>
      </div>
      <div className={s.xLabels} aria-hidden="true">{ticks.map(tick => { const at = tick.offset / span; return <span key={tick.offset} className={at < 0.04 ? s.xStart : at > 0.94 ? s.xEnd : undefined} style={{ left: `${100 * at}%` }}>{tick.label}{tick.year ? <small>{tick.year}</small> : null}</span>; })}</div>
    </div>
    <p className={s.pick} data-pick>
      {pinnedLine ? <><span><i className={`${s.key} ${pinnedLine.dashed ? s.keyDashed : ''}`} style={{ color: pinnedLine.color }} aria-hidden="true" /><b>{pinnedLine.name}</b><em>is highlighted.</em></span><button type="button" onClick={() => { setPinned(null); setHover(null); }}>Show all lines</button></>
        : keys ? <span>Left and right arrows move through time. Up and down arrows change campaign.</span>
        : drawn.length ? <><span className={s.forMouse}>Point at a line to see whose it is. Click a line or a name to keep it highlighted.</span><span className={s.forTouch}>Tap a line or a name to pick out one campaign.</span></> : null}
    </p>
    <ol className={s.legend}>{lines.map(line => {
      const name = line.href ? <Link href={line.href}>{line.name}</Link> : line.name;
      if (!line.points.length) return <li key={line.id} className={s.noRecords}><i className={s.key} style={{ color: '#c9d2c8' }} aria-hidden="true" /><span>{name}</span><strong>None</strong><small>{line.detail}</small></li>;
      return <li key={line.id} data-series={line.id} className={`${s.pickable} ${active?.id === line.id ? s.lifted : ''}`} data-pinned={pinned?.id === line.id ? '' : undefined}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(atEnd(line)); }} onPointerLeave={event => { if (event.pointerType === 'mouse') setHover(null); }}
        onFocus={() => setHover(atEnd(line))} onBlur={() => setHover(null)}
        onClick={event => { if (!(event.target as HTMLElement).closest('a')) toggle(line); }}>
        <i className={`${s.key} ${line.dashed ? s.keyDashed : ''}`} style={{ color: line.color }} aria-hidden="true" />
        <span>{name}</span><strong>{wholeDollars(line.totalCents)}</strong>
        <small>{line.detail}</small>
      </li>;
    })}</ol>
  </>;
}
