import { pageMeta } from '@/lib/page-meta';
import { makerDocuments, MAKER_PATH } from '@/lib/maker-economy/publication';
import MakerPublication from '@/components/deep-dives/maker-economy/Publication';

export const metadata = pageMeta({
  title: 'Portland makes things. How much of that economy can we see?',
  description: 'What makerspaces and independent producers contribute to Portland: six case studies, economic evidence, and the gaps behind a citywide maker count.',
  path: MAKER_PATH,
  type: 'article',
});

export default function MakerEconomyPage() {
  return <MakerPublication document={makerDocuments[0]} />;
}
