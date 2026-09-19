import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'The work behind Portland’s handmade city';

export default function Image() {
  return ogImage({
    eyebrow: 'Work & the maker economy',
    headline: 'Portland’s handmade city.',
    accent: '#c8956c',
    description: 'The workshops, home studios, businesses, and markets that turn skilled work into objects—and income.',
  });
}
