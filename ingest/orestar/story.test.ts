import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fundingRows, story, storyCandidate } from '../../src/lib/campaign-finance/story';

describe('race-led campaign finance story', () => {
  it('uses the same reviewed candidate facts and reconciled funding categories', () => {
    const d3 = fundingRows('portland-district-3'), d4 = fundingRows('portland-district-4');
    expect(d3).toHaveLength(9); expect(d4).toHaveLength(8);
    const rows = [...d3, ...d4];
    expect(rows.reduce((sum, r) => sum + r.cash, 0)).toBe(story.totals.cash_cents);
    expect(rows.reduce((sum, r) => sum + r.public, 0)).toBe(story.totals.public_cents);
    expect(rows.reduce((sum, r) => sum + r.unidentified, 0)).toBe(story.totals.unidentified_cents);
    for (const r of rows) expect(r.public + r.individual + r.unidentified + r.other).toBe(r.cash);
    expect([...d3].sort((a, b) => b.cash - a.cash)[0].name).toBe('Tiffany Koyama Lane');
    expect([...d3].sort((a, b) => (b.cash - b.public) - (a.cash - a.public))[0].name).toBe('Steve Novick');
    expect(storyCandidate('23295').nonmatchingCents - storyCandidate('17629').nonmatchingCents).toBe(73815);
    expect(() => storyCandidate('unknown')).toThrow();
  });
  it('retains exact September windows and the weekly peaks', () => {
    const expected = { '23295': [174000, 919000], '17629': [651000, 1082500], '23365': [171066, 849148] };
    for (const [id, amounts] of Object.entries(expected)) {
      const r = story.september.find(r => r.committee_id === id)!;
      expect([r.pre_cents, r.post_cents]).toEqual(amounts);
    }
    for (const id of new Set(story.weeks.map(w => w.committee_id))) {
      const weeks = story.weeks.filter(w => w.committee_id === id);
      expect(weeks).toHaveLength(38);
      expect(Math.max(...weeks.map(w => w.nonmatching_cents))).toBe(storyCandidate(id).peak2026?.cents);
      expect(weeks.filter(w => w.provisional)).toHaveLength(2);
      for (const w of weeks) expect(w.public_cents + w.nonmatching_cents).toBe(w.cash_cents);
    }
  });
  it('reconciles the Torres August week to dated contributions and the separate City deposit', () => {
    const lines = readFileSync('research/campaign-finance/investigation/portland/transactions.csv', 'utf8').split(/\r?\n/);
    const august9 = lines.filter(line => /^\d+,2026-08-09,/.test(line) && line.split(',')[4] === '24897')
      .map(line => line.split(',')).filter(row => row[10] === 'cash_contribution');
    expect(august9).toHaveLength(54);
    expect(august9.every(row => row.length === 19)).toBe(true);
    expect(august9.reduce((sum, row) => sum + Number(row[11]), 0)).toBe(1933500);
    expect(august9.filter(row => row[8] === 'False').reduce((sum, row) => sum + Number(row[11]), 0)).toBe(1775000);
    expect(august9.filter(row => row[8] === 'True').reduce((sum, row) => sum + Number(row[11]), 0)).toBe(158500);
    expect(august9.filter(row => row[11] === '35000')).toHaveLength(47);
    expect(lines.filter(line => /^\d+,2026-/.test(line) && /,cash_contribution,35000,/.test(line))).toHaveLength(426);
    expect(august9.filter(row => row[2] === '2026-08-12')).toHaveLength(33);
    expect(august9.filter(row => row[2] === '2026-08-27')).toHaveLength(13);
    expect(august9.filter(row => row[2] === '2026-09-15')).toHaveLength(8);
    const city = lines.find(line => line.startsWith('5753076,2026-08-04,'))!.split(',');
    expect(city[4]).toBe('24897');
    expect(Number(city[11])).toBe(7200000);
    expect(readFileSync('public/data/campaign-finance/public-matching-receipts.csv', 'utf8')).toMatch(/^5753076,24897,2026-08-04,/m);
  });
  it('retains all tests and distinguishes strict matches from name sensitivity', () => {
    expect(story.pairs).toHaveLength(136);
    expect(story.pairs.filter(p => p.bh_q < .05)).toHaveLength(6);
    const p = story.pairs.find(p => p.committee_a === '24897' && p.committee_b === '17629')!;
    expect(p.shared).toBe(5); expect(p.same_name_sensitivity_shared).toBe(43); expect(p.bh_q).toBe(1);
    expect(story.network.draws).toBe(2997);
  });
  it('publishes unchanged checksummed evidence and prevents stale candidate inputs', () => {
    const sha = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
    expect(sha('src/lib/campaign-finance/candidate-facts.json')).toBe(story.candidateFactsSha256);
    expect(sha('research/campaign-finance/investigation/portland/report-data.json')).toBe(story.sourceReportSha256);
    for (const evidence of story.evidence) {
      expect(sha('public/data/campaign-finance/story/' + evidence.file)).toBe(evidence.sha256);
      expect(readFileSync('public/data/campaign-finance/story/' + evidence.file, 'utf8').split('\n')[0]).not.toMatch(/street|address/i);
    }
    expect(readFileSync('public/data/campaign-finance/story/story-data.json', 'utf8')).toBe(readFileSync('src/lib/campaign-finance/story-data.json', 'utf8'));
  });
});
