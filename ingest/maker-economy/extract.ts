/** Extract small, provenance-tagged evidence rows from pinned public bulk files.
 * Raw downloads remain in runtime-data/. Requires system unzip for Census ZIP.
 * Run: npx tsx ingest/maker-economy/extract.ts */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, raw, checkedRaw, parseCSV, writeCSV, number } from './common';
interface Classification { code: string; label: string; tier: string; }
const classes: { qcew: Classification[]; nes: Classification[] } = JSON.parse(readFileSync(resolve(root, 'classifications.json'), 'utf8'));
const qrows = [2019, 2023, 2025].flatMap(year => {
  const id = `qcew${year}`;
  const all = parseCSV(checkedRaw(id).toString());
  return classes.qcew.map(c => {
    const matches = all.filter(r => r.area_fips === '41051' && r.year === String(year) && r.qtr === 'A' && r.own_code === '5' && r.size_code === '0' && r.industry_code === c.code);
    if (matches.length !== 1) throw new Error(`${id}/${c.code}: expected one row, found ${matches.length}`);
    const r = matches[0], suppressed = r.disclosure_code.trim() !== '';
    return { year, geography: 'Multnomah County OR', geoid: '41051', coverage: 'QCEW private ownership; covered payroll jobs', naics_vintage: year < 2022 ? 2017 : 2022, code: c.code, label: c.label, tier: c.tier, annual_avg_establishments: number(r.annual_avg_estabs), annual_avg_jobs: suppressed ? '' : number(r.annual_avg_emplvl), annual_payroll_usd: suppressed ? '' : number(r.total_annual_wages), average_annual_pay_usd: suppressed ? '' : number(r.avg_annual_pay), employment_location_quotient: suppressed || r.lq_disclosure_code.trim() ? '' : number(r.lq_annual_avg_emplvl), disclosure_code: r.disclosure_code, status: suppressed ? 'employment-and-pay-suppressed' : 'published', doc_id: id, locator: `area_fips=41051;own_code=5;industry_code=${c.code};size_code=0;year=${year};qtr=A` };
  });
});
writeCSV(resolve(root, 'data/qcew.csv'), qrows);
checkedRaw('nes2023');
const nes = parseCSV(execFileSync('unzip', ['-p', resolve(raw, 'nes2023.zip'), 'nonemp23co.txt'], { maxBuffer: 180 * 1024 * 1024 }).toString());
const nrows = classes.nes.map(c => {
  const matches = nes.filter(r => r.ST === '41' && r.CTY === '051' && r.NAICS === c.code);
  if (matches.length !== 1) throw new Error(`NES/${c.code}: expected one row`);
  const r = matches[0];
  return { year: 2023, geography: 'Multnomah County OR', geoid: '41051', coverage: 'tax-reporting nonemployer establishments; NES universe; geography generally mailing address', naics_vintage: 2022, code: c.code, label: c.label, tier: c.tier, establishments: r.ESTAB_F.trim() ? '' : number(r.ESTAB), receipts_usd: r.RCPTOT_F.trim() || r.RCPTOT_N_F === 'S' ? '' : number(r.RCPTOT) * 1000, establishment_flag: r.ESTAB_F, receipt_flag: r.RCPTOT_F, noise_flag: r.RCPTOT_N_F, doc_id: 'nes2023', locator: `nonemp23co.txt;ST=41;CTY=051;NAICS=${c.code};RCPTOT thousands converted to dollars` };
});
writeCSV(resolve(root, 'data/nonemployers.csv'), nrows);
console.log(`Extracted ${qrows.length} QCEW and ${nrows.length} NES rows; suppression preserved.`);
