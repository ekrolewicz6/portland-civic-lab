import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/page-meta';
import { makerDocument, makerDocuments, MAKER_PATH } from '@/lib/maker-economy/publication';
import MakerPublication from '@/components/deep-dives/maker-economy/Publication';

type Props = { params: Promise<{ section: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return makerDocuments.filter(document => document.slug).map(document => ({ section: document.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const document = makerDocument(section);
  if (!document) notFound();
  return pageMeta({ title: `${document.label}: Portland’s maker economy`, description: document.title, path: `${MAKER_PATH}/${section}`, type: 'article' });
}

export default async function MakerResearchPage({ params }: Props) {
  const { section } = await params;
  const document = makerDocument(section);
  if (!document) notFound();
  return <MakerPublication document={document} />;
}
