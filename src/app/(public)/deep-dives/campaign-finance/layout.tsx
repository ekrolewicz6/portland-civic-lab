import { Suspense } from 'react';
import FinanceNavigation, { FinanceNavigationFallback } from '@/components/deep-dives/campaign-finance/FinanceNavigation';

export default function CampaignFinanceLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Suspense fallback={<FinanceNavigationFallback />}><FinanceNavigation /></Suspense>
    <Suspense fallback={<p role="status">Loading campaign finance…</p>}>{children}</Suspense>
  </>;
}
