/** Build deployment-safe copies of the reviewed research; never read research at runtime. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, posix } from 'node:path';

const corpus = 'research/maker-economy';
const base = '/deep-dives/maker-economy';
const github = 'https://github.com/ekrolewicz6/portland-civic-lab/blob/main/';
const pages = [
  { slug: '', file: 'document.md', label: 'The deep dive' },
  { slug: 'case-studies', file: 'case-studies.md', label: 'Six case studies' },
  { slug: 'methodology', file: 'methodology.md', label: 'Methodology' },
  { slug: 'tables', file: 'data/derived/tables.md', label: 'Economic tables' },
  { slug: 'community-research-kit', file: 'community-research-kit.md', label: 'Community research kit' },
  { slug: 'gaps', file: 'notes/gaps-and-requests.md', label: 'Gaps and draft inquiries' },
  { slug: 'sources', file: 'sources.md', label: 'Source registry' },
];
const downloads = [
  'data/qcew.csv', 'data/nonemployers.csv', 'data/observations.csv', 'data/ecosystem.csv',
  'data/derived/employment-comparison.csv', 'data/derived/nonemployer-context.csv',
  'data/derived/definition-sensitivity.csv', 'data/derived/study-checks.csv',
  'sources.json', 'classifications.json', 'checksums.lock.json',
];
const check = process.argv.includes('--check');
function emit(path: string, content: string) {
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      throw new Error(`Publication is stale: ${path}; run npx tsx ingest/maker-economy/publish.ts`);
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}
const documents = pages.map(page => {
  const original = readFileSync(resolve(corpus, page.file), 'utf8');
  const title = original.match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error(`Missing title: ${page.file}`);
  const body = original.replace(/^# .+\n+/, '').replace(/\]\(([^)]+)\)/g, (match, href: string) => {
    if (/^(https?:|#)/.test(href)) return match;
    const [relative, fragment] = href.split('#');
    const target = posix.normalize(posix.join(posix.dirname(page.file), relative));
    if (!existsSync(resolve(corpus, target))) throw new Error(`Broken link: ${page.file} -> ${target}`);
    const published = pages.find(p => p.file === target);
    const url = published ? `${base}${published.slug ? `/${published.slug}` : ''}`
      : downloads.includes(target) ? `/data/maker-economy/${target}`
      : `${github}${corpus}/${target}`;
    return `](${url}${fragment ? `#${fragment}` : ''})`;
  });
  return { ...page, title, body };
});
emit('src/lib/maker-economy/publication.json', JSON.stringify(documents, null, 2) + '\n');
for (const file of downloads) emit(`public/data/maker-economy/${file}`, readFileSync(resolve(corpus, file), 'utf8'));
console.log(`${check ? 'Checked' : 'Published'} ${documents.length} documents and ${downloads.length} evidence downloads.`);
