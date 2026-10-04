'use client';

import { useState } from 'react';
import s from './governor.module.css';

type County = { county: string; cents: number; records: number };
type Shape = { fips: string; name: string; d: string };
export type CountyMapCandidate = { candidateId: string; name: string; href: string; counties: County[]; oregonCents: number; oregonRecords: number };

const RAMP = ['#f1efe6', '#d3e3d6', '#a5c7b1', '#6ea389', '#3a7a61', '#173c31'];
const SCALES = {
  dollars: { label: 'Dollars', stops: [1, 1_000_000, 5_000_000, 25_000_000, 100_000_000], legend: ['None', 'Under $10,000', '$10,000 to $49,999', '$50,000 to $249,999', '$250,000 to $999,999', '$1 million or more'] },
  gifts: { label: 'Number of gifts', stops: [1, 25, 100, 400, 1000], legend: ['None', '1 to 24', '25 to 99', '100 to 399', '400 to 999', '1,000 or more'] },
} as const;
type Measure = keyof typeof SCALES;
const dollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(cents / 100));
const level = (value: number, stops: readonly number[]) => stops.reduce((index, stop, position) => value >= stop ? position + 1 : index, 0);

export default function CountyMaps({ candidates, shapes, width, height }: { candidates: CountyMapCandidate[]; shapes: Shape[]; width: number; height: number }) {
  const [measure, setMeasure] = useState<Measure>('dollars');
  const scale = SCALES[measure];
  const value = (county: County) => measure === 'dollars' ? county.cents : county.records;
  return <div data-county-maps={measure}>
    <div className={s.toggle} role="group" aria-label="Measure shown on the maps">
      {(Object.keys(SCALES) as Measure[]).map(key => <button key={key} type="button" aria-pressed={measure === key} onClick={() => setMeasure(key)}>{SCALES[key].label}</button>)}
    </div>
    <div className={s.ramp} aria-hidden="true">{scale.legend.map((label, index) => <span key={label}><i style={{ background: RAMP[index] }} />{label}</span>)}</div>
    <div className={s.maps}>{candidates.map(candidate => {
      const byName = new Map(candidate.counties.map(county => [county.county, county]));
      const ranked = [...candidate.counties].sort((a, b) => value(b) - value(a) || a.county.localeCompare(b.county)).slice(0, 5);
      return <div className={s.map} key={candidate.candidateId} data-candidate={candidate.candidateId}>
        <div className={s.panelHead}><a href={candidate.href}>{candidate.name}</a><strong>{dollars(candidate.oregonCents)} · {candidate.oregonRecords.toLocaleString('en-US')} gifts</strong></div>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${candidate.name}: named individuals’ gifts by Oregon county. Largest: ${ranked.map(county => `${county.county} ${measure === 'dollars' ? dollars(county.cents) : `${county.records} gifts`}`).join(', ')}.`}>
          {shapes.map(shape => {
            const county = byName.get(shape.name) ?? { county: shape.name, cents: 0, records: 0 };
            return <path key={shape.fips} d={shape.d} fill={RAMP[level(value(county), scale.stops)]}><title>{`${shape.name} County: ${dollars(county.cents)} in ${county.records.toLocaleString('en-US')} gifts`}</title></path>;
          })}
        </svg>
        <ol className={s.mapList}>{ranked.map(county => <li key={county.county}><span>{county.county} County</span><span>{dollars(county.cents)} · {county.records.toLocaleString('en-US')} gifts</span></li>)}</ol>
      </div>;
    })}</div>
  </div>;
}
