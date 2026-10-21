import { Suspense } from 'react';
import FinanceNavigation, { FinanceNavigationFallback } from '@/components/deep-dives/campaign-finance/FinanceNavigation';

// Downloads must be readable in the initial HTML, including without JavaScript.
// Keep the investigation's streaming chart layout on its existing routes.
export default function DataAccessLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Suspense fallback={<FinanceNavigationFallback />}><FinanceNavigation /></Suspense>
    {children}
  </>;
}
