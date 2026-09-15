import { ImageResponse } from 'next/og';
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Portland makes things. How much of that economy can we see?';

export default function Image() {
  return new ImageResponse(ogFrame({
    eyebrow: 'Makers & the creative economy',
    headline: 'Portland makes things.',
    accent: '#c8956c',
    description: 'What workshops and independent makers create, whom they support, and what we can actually measure.',
  }), { ...OG_SIZE });
}
