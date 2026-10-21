import { financeOgImage, financeImageMetadata } from '@/lib/campaign-finance/og-image';

export const runtime = 'edge';
export function generateImageMetadata() { return financeImageMetadata('governor'); }
export default function Image() { return financeOgImage('governor'); }
