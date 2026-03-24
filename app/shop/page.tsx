import ShopCatalog from '@/components/shop-catalog';
import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-24" />}>
      <ShopCatalog
        pageTitle="SHOP ALL"
        pageSubtitle="Browse our full collection of premium essentials."
      />
    </Suspense>
  );
}
