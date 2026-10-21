import { financeOgImage, financeImageMetadata } from '@/lib/campaign-finance/og-image';

export const runtime = 'edge';
export function generateImageMetadata() { return financeImageMetadata('council'); }
export default function Image() { return financeOgImage('council'); }
