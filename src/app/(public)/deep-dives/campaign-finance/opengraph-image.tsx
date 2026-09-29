import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'The money behind Portland’s next council — a visual campaign-finance investigation';

export default function Image() {
  return ogImage({
    eyebrow: 'Elections & campaign money',
    headline: 'The money behind Portland’s next council.',
    accent: '#c8956c',
    description: 'Who gives. Where it comes from. Who gets paid. Explore Districts 3 and 4 through the public records.',
  });
}
