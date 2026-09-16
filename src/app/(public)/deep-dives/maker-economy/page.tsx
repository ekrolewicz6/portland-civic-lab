import { pageMeta } from '@/lib/page-meta';
import { makerDocuments, MAKER_PATH } from '@/lib/maker-economy/publication';
import MakerPublication from '@/components/deep-dives/maker-economy/Publication';

export const metadata = pageMeta({
  title: 'The work behind Portland’s handmade city',
  description: '597 public listings, physical production, business receipts, and the costs behind maker income. An evidence-led investigation of Portland’s maker economy.',
  path: MAKER_PATH,
  type: 'article',
});

export default function MakerEconomyPage() {
  return <MakerPublication document={makerDocuments[0]} />;
}
