import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'The money behind the race for governor: Oregon campaign records for Christine Drazan and Tina Kotek';

export default function Image() {
  return ogImage({
    eyebrow: 'Elections & campaign money',
    headline: 'The money behind the race for governor.',
    accent: '#c8956c',
    description: 'Who gave, when it arrived, where it came from and what it paid for, from Oregon’s public campaign records.',
  });
}
