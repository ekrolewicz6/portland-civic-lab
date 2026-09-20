import Link from 'next/link';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DIVE_CONTAINER } from '@/components/deep-dives/shared';
import { headingId, MAKER_PATH, makerDocuments } from '@/lib/maker-economy/publication';
import data from '@/lib/maker-economy/figures.json';
import MakerFigure from './Figures';
import { ListingMural, ObjectsBand } from './Visuals';
import styles from './publication.module.css';

const components: Components = {
  h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
  a: ({ href, children }) => href?.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
  table: ({ children }) => <div className={styles.tableScroll} role="region" aria-label="Research table, scroll horizontally for more columns" tabIndex={0}><table>{children}</table></div>,
  pre: ({ children, node }) => {
    const code = node?.children[0];
    if (code?.type === 'element' && Array.isArray(code.properties.className) && code.properties.className.includes('language-maker-figure')) {
      const name = code.children.filter(n => n.type === 'text').map(n => n.type === 'text' ? n.value : '').join('').trim();
      return <MakerFigure name={name} />;
    }
    return <pre>{children}</pre>;
  },
};

/** Figures the article implies but the research document does not declare; keyed by section id. */
const IMPLIED_FIGURES: Record<string, string> = {
  'why-this-matters-to-portlands-economy': 'roles',
  'how-to-get-to-a-credible-portland-estimate': 'roadmap',
};

const FIGURE_BLOCK = /```maker-figure\n([\s\S]*?)```\n?/g;

type Section = { heading: string; id: string; figures: string[]; body: string };

/**
 * Split a document into its intro and `##` sections, and hoist every declared
 * figure to the top of its section so the visual leads and the prose follows.
 */
function sectionize(markdown: string): { intro: string; sections: Section[] } {
  const [intro, ...rest] = markdown.split(/^(?=## )/m);
  const sections = rest.map(chunk => {
    const newline = chunk.indexOf('\n');
    const heading = chunk.slice(3, newline).trim();
    const id = headingId(heading);
    const figures = [...chunk.matchAll(FIGURE_BLOCK)].map(m => m[1].trim());
    if (IMPLIED_FIGURES[id]) figures.unshift(IMPLIED_FIGURES[id]);
    return { heading, id, figures, body: chunk.slice(newline + 1).replace(FIGURE_BLOCK, '') };
  });
  return { intro, sections };
}

const STATS = [
  { value: data.totals.listings.toLocaleString(), label: 'public listings across four artist and craft networks' },
  { value: data.totals.nonemployerBusinesses.toLocaleString(), label: 'county businesses with no payroll, in nine production categories' },
  { value: `$${(data.totals.nonemployerReceipts / 1e6).toFixed(1)}m`, label: 'in their 2023 gross receipts, before any expenses' },
  { value: '$1,365', label: 'left from $3,500 of booth sales in the illustrative model' },
];

export default function MakerPublication({ document }: { document: typeof makerDocuments[number] }) {
  const isArticle = document.slug === '';
  const { intro, sections } = sectionize(document.body);
  return (
    <article className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {isArticle ? (
        <header className={styles.hero}>
          <div className={`${DIVE_CONTAINER} ${styles.heroGrid}`}>
            <div className={styles.heroText}>
              <p className={styles.kicker}><Link href="/deep-dives">Portland Civic Lab / Deep dives</Link><span>Work & the maker economy</span></p>
              <h1 className={styles.title}>The work behind <em>Portland’s handmade city.</em></h1>
              <p className={styles.dek}>Inside the workshops, home studios, small businesses, and markets that turn Portland’s skills into objects, and income.</p>
              <p className={styles.byline}>Public-source investigation <span>·</span> Revised September 15, 2026</p>
            </div>
            <div className={styles.heroMural}><ListingMural tone="dark" /></div>
          </div>
          <div className={`${DIVE_CONTAINER} ${styles.stats}`}>
            {STATS.map(s => <div key={s.label} className={styles.stat}><strong>{s.value}</strong><span>{s.label}</span></div>)}
          </div>
        </header>
      ) : (
        <header className={styles.subHero}>
          <div className={DIVE_CONTAINER}>
            <p className={styles.kicker}><Link href="/deep-dives">Portland Civic Lab / Deep dives</Link><span>Work & the maker economy</span></p>
            <h1 className={styles.subTitle}>{document.title}</h1>
            <p className={styles.dek}>Evidence, methods, and research tools for understanding Portland’s maker economy.</p>
            <p className={styles.byline}>Public-source investigation <span>·</span> Revised September 15, 2026</p>
          </div>
        </header>
      )}
      <nav aria-label="Maker economy research" className={styles.docNav}>
        <div className={`${DIVE_CONTAINER} flex flex-wrap gap-x-6 gap-y-3 py-4 text-xs`}>
          {makerDocuments.map(item => <Link key={item.slug} href={`${MAKER_PATH}${item.slug ? `/${item.slug}` : ''}`} aria-current={item.slug === document.slug ? 'page' : undefined} className={`underline-offset-4 hover:underline ${item.slug === document.slug ? 'font-semibold text-[var(--color-canopy)] underline' : 'text-[var(--color-ink-light)]'}`}>{item.label}</Link>)}
        </div>
      </nav>
      {isArticle && <div className={DIVE_CONTAINER}><ObjectsBand /></div>}
      <div className={`${DIVE_CONTAINER} ${styles.articleGrid}`}>
        <aside className={styles.contents}>
          <nav aria-label="On this page"><h2>In this investigation</h2><ol>{sections.map((s, i) => <li key={s.id}><a href={`#${s.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{s.heading.replace(/^\d+\. /, '')}</a></li>)}</ol></nav>
          <a className={styles.download} href="/data/maker-economy/data/directory-listings.csv">The public listing register ↓</a>
        </aside>
        <div className="min-w-0">
          {intro.trim() && <div className={`${styles.prose} ${styles.intro}`}><Markdown remarkPlugins={[remarkGfm]} components={components}>{intro}</Markdown></div>}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <h2 className={styles.sectionTitle}><span>{String(i + 1).padStart(2, '0')}</span>{s.heading}</h2>
              {s.figures.map(name => <MakerFigure key={name} name={name} />)}
              <div className={styles.prose}><Markdown remarkPlugins={[remarkGfm]} components={components}>{s.body}</Markdown></div>
            </section>
          ))}
        </div>
      </div>
      <footer className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] py-10">
        <div className={`${DIVE_CONTAINER} flex flex-wrap items-center justify-between gap-5 text-sm`}><p>Help make the picture of Portland’s makers more complete.</p><div className="flex flex-wrap gap-5 font-semibold text-[var(--color-canopy)]"><a className="underline underline-offset-4" href="https://github.com/ekrolewicz6/portland-civic-lab/tree/main/research/maker-economy">Research repository</a><Link className="underline underline-offset-4" href="/contact?topic=Work%20on%20a%20topic&project=Portland%20maker%20economy">Work on this topic</Link></div></div>
      </footer>
    </article>
  );
}
