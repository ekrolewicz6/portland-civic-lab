import { ImageResponse } from 'next/og';
import logo from '@/lib/og-logo.json';
import publication from './active-publication.json';
import download from './downloads.json';

export type FinanceCard = 'data' | 'council' | 'governor';
const cards = {
  data: { eyebrow: 'THE OPEN CAMPAIGN-FINANCE LEDGER', lines: ['Follow the money.', 'Make it yours.'], description: 'Every published record. One compact download.\nBuilt for your questions—and your AI.', footer: 'Download. Explore. Discover.', badge: `${(download.downloads.bundle.bytes / 1_000_000).toFixed(1)} MB ANALYSIS KIT` },
  council: { eyebrow: 'PORTLAND COUNCIL · DISTRICTS 3 + 4', lines: ['The money', 'behind the ballot.'], description: 'Small donors. Big contributions. Public matching.\nSee who funds Portland’s next council.', footer: 'Follow the funds. Check the records.', badge: 'EXPLORE THE RECORDS' },
  governor: { eyebrow: 'OREGON GOVERNOR · 2026', lines: ['The money behind', 'the governor’s race.'], description: 'Who gives. Where it comes from. What it buys.\nExplore the Kotek and Drazan campaigns.', footer: 'Two campaigns. The public record.', badge: 'KOTEK + DRAZAN' },
} as const;

export const financeCardAlt = (kind: FinanceCard) => kind === 'data'
  ? `Follow the money. Make it yours. Download ${publication.rows.toLocaleString('en-US')} published Oregon campaign-finance records through ${publication.end}. Portland Civic Lab.`
  : kind === 'council' ? 'The money behind the ballot. Explore small donors, large contributions and public matching in Portland council Districts 3 and 4. Portland Civic Lab.'
  : 'The money behind the governor’s race. Explore the Kotek and Drazan campaigns. Portland Civic Lab.';

// Snapshot-specific image URLs keep subsequent data releases from reusing stale cards.
export function financeImageMetadata(kind: FinanceCard) {
  return [{ id: publication.snapshot, size: { width: 1200, height: 630 }, contentType: 'image/png', alt: financeCardAlt(kind) }];
}

/** Decorative ledger engraving, not a statistical chart. */
function LedgerArt() {
  return <svg width="420" height="270" viewBox="0 0 420 270" fill="none">
    <circle cx="210" cy="136" r="120" stroke="#5f7a64" strokeWidth="1" />
    <circle cx="210" cy="136" r="99" stroke="#476852" strokeWidth="1" />
    <path d="M21 136H399M210 4V266" stroke="#476852" strokeWidth="1" strokeDasharray="3 7" />
    <path d="M82 92L82 205Q82 223 100 223H287" stroke="#c8956c" strokeWidth="2" />
    <path d="M99 77L99 190Q99 208 117 208H304" stroke="#a6b49a" strokeWidth="2" />
    <rect x="117" y="53" width="204" height="138" rx="9" fill="#214b3b" stroke="#d8dfc8" strokeWidth="2" />
    <path d="M117 91H321M163 91V191M250 91V191M117 124H321M117 157H321" stroke="#76917a" strokeWidth="1" />
    {[107,140,173].map((y)=><g key={y}><circle cx="140" cy={y} r="4" fill="#c8956c" /><path d={`M181 ${y}H230M269 ${y}H302`} stroke="#d8dfc8" strokeWidth="3" strokeLinecap="round" /></g>)}
    <path d="M136 73H197" stroke="#d8dfc8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="304" cy="199" r="38" fill="#d2a47a" />
    <path d="M304 180V211M293 201L304 212L315 201M288 218H320" stroke="#173c30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="81" cy="61" r="5" fill="#d2a47a" /><circle cx="352" cy="104" r="3" fill="#c1cfb4" /><circle cx="63" cy="180" r="3" fill="#c1cfb4" />
  </svg>;
}

export async function financeOgImage(kind: FinanceCard) {
  const [serif, sans] = await Promise.all([
    fetch(new URL('../oregon-fire/fonts/CormorantGaramond-Medium.ttf', import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL('../oregon-fire/fonts/DMSans-Regular.ttf', import.meta.url)).then(r => r.arrayBuffer()),
  ]);
  const card = cards[kind];
  const date = new Date(`${publication.end}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f1e7', color: '#173c30', fontFamily: 'DM Sans', position: 'relative' }}>
    <div style={{ display: 'flex', width: 760, height: '100%', flexDirection: 'column', padding: '46px 52px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 25 }}>
        {/* Embedded brand art renders directly in Satori. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={43} height={43} alt="" />Portland Civic Lab
      </div>
      <div style={{ display: 'flex', marginTop: 54, alignItems: 'center', gap: 12, fontSize: 17, letterSpacing: '.09em', color: '#5c6a55' }}><span style={{ width: 24, height: 2, background: '#ac7149' }} />{card.eyebrow}</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 23, fontFamily: 'Cormorant', fontSize: kind === 'governor' ? 80 : 87, lineHeight: 1.02, letterSpacing: '-.035em' }}>{card.lines.map((line, i) => <span key={line} style={{ color: i === 1 ? '#98613f' : '#173c30' }}>{line}</span>)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 29, gap: 7, fontSize: 22, color: '#50614e' }}>{card.description.split('\n').map(line => <span key={line}>{line}</span>)}</div>
      <div style={{ display: 'flex', position: 'absolute', left: 52, bottom: 39, width: 652, paddingTop: 19, borderTop: '1px solid #bdc4b4', fontSize: 18, justifyContent: 'space-between' }}><span>{card.footer}</span><span style={{ color: '#65715e' }}>Open access</span></div>
    </div>
    <div style={{ display: 'flex', width: 440, height: '100%', flexDirection: 'column', alignItems: 'center', background: '#173c30', position: 'relative', color: '#f5f1e7' }}>
      <div style={{ display: 'flex', position: 'absolute', left: 20, right: 20, top: 20, bottom: 20, border: '1px solid #547459' }} />
      <div style={{ display: 'flex', marginTop: 51, fontSize: 16, letterSpacing: '.14em', color: '#c7d2bc' }}>{kind === 'governor' ? 'FOLLOW THE FUNDING' : 'OREGON’S PUBLIC LEDGER'}</div>
      <div style={{ display: 'flex', marginTop: 12 }}><LedgerArt /></div>
      <div style={{ display: 'flex', marginTop: -4, fontSize: kind === 'governor' ? 45 : 65, letterSpacing: '-.045em' }}>{kind === 'governor' ? 'Two campaigns.' : publication.rows.toLocaleString('en-US')}</div>
      <div style={{ display: 'flex', marginTop: 4, fontSize: 18, color: '#c7d2bc' }}>{kind === 'governor' ? 'One place to follow the money.' : 'published transaction records'}</div>
      <div style={{ display: 'flex', marginTop: 26, padding: '11px 22px', border: '1px solid #b58a62', color: '#edc8a2', fontSize: 15, letterSpacing: '.09em' }}>{card.badge}</div>
      <div style={{ display: 'flex', position: 'absolute', bottom: 43, fontSize: 16, color: '#c7d2bc' }}>Records through {date}</div>
    </div>
  </div>, { width: 1200, height: 630, fonts: [{ name: 'Cormorant', data: serif, weight: 500, style: 'normal' }, { name: 'DM Sans', data: sans, weight: 400, style: 'normal' }] });
}
