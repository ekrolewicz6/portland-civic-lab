import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const sourceBytes=readFileSync('src/lib/campaign-finance/zip-map-data.json');
const source=JSON.parse(sourceBytes.toString('utf8'));
const published=JSON.parse(readFileSync('src/lib/campaign-finance/district-zip-data.json','utf8'));
const csv=readFileSync('public/data/campaign-finance/zip-map/district-zip-totals.csv','utf8').trim().split('\n').map(line=>line.split(','));
const coverageCsv=readFileSync('public/data/campaign-finance/zip-map/district-coverage.csv','utf8').trim().split('\n').map(line=>line.split(','));
const sum=(rows,key)=>rows.reduce((total,row)=>total+(row[key]??0),0);

test('district ZIP publication reconciles to the immutable candidate source',()=>{
  assert.equal(published.snapshot,source.snapshot);
  assert.equal(published.candidateZipSourceSha256,createHash('sha256').update(sourceBytes).digest('hex'));
  assert.deepEqual(published.races.map(race=>[race.raceId,race.reviewedCommittees,race.rosteredCandidates,race.cashCents]),[
    ['portland-district-3',9,21,96449112],
    ['portland-district-4',8,12,110671693],
  ]);
  for(const race of published.races){
    const members=source.candidates.filter(candidate=>candidate.raceId===race.raceId);
    assert.deepEqual(race.committeeIds,[...members.map(member=>member.committeeId)].sort());
    assert.equal(race.cashCents,sum(members,'cashCents'));
    assert.equal(sum(race.zipTotals,'cents'),race.coverageCents.mapped+race.coverageCents.other_zip);
    assert.equal(sum(race.zipTotals.filter(row=>row.mapped),'cents'),race.coverageCents.mapped);
    const tableRows=csv.slice(1).filter(row=>row[1]===race.raceId);
    assert.equal(tableRows.length,race.zipTotals.length);
    assert.equal(sum(tableRows.map(row=>({cents:Number(row[5])})),'cents'),sum(race.zipTotals,'cents'));
    for(const row of race.zipTotals){
      const table=tableRows.find(record=>record[4]===row.zip5);
      assert.ok(table);
      assert.equal(Number(table[5]),row.cents);
      assert.equal(Number(table[6]),row.records);
      assert.equal(table[7],row.mapped?'yes':'no');
    }
    const categories=coverageCsv.slice(1).filter(row=>row[1]===race.raceId);
    assert.equal(categories.length,6);
    assert.equal(sum(categories.map(row=>({cents:Number(row[5])})),'cents'),race.cashCents);
  }
});

test('public exports contain only aggregate ZIP and coverage fields',()=>{
  assert.deepEqual(csv[0],['snapshot','race_id','reviewed_committees','rostered_candidates','zip5','gross_nonmatching_cash_cents','contribution_records','on_local_map']);
  assert.deepEqual(coverageCsv[0],['snapshot','race_id','reviewed_committees','rostered_candidates','category','gross_cash_cents','contribution_records']);
  assert.equal(published.races.length,2);
});
