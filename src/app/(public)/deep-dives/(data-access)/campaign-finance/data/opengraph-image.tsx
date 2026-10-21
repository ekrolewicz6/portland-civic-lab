import { financeOgImage, financeImageMetadata } from '@/lib/campaign-finance/og-image';

export const runtime = 'edge';
export function generateImageMetadata() { return financeImageMetadata('data'); }
export default function Image() { return financeOgImage('data'); }
