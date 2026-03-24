import ShopCatalog from '@/components/shop-catalog';
import { Suspense } from 'react';

export default function MenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-24" />}>
      <ShopCatalog
        pageTitle="MEN"
        pageSubtitle="Explore premium menswear essentials made for everyday style."
        gender="men"
      />
    </Suspense>
  );
}
