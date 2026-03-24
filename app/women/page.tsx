import ShopCatalog from '@/components/shop-catalog';
import { Suspense } from 'react';

export default function WomenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-24" />}>
      <ShopCatalog
        pageTitle="WOMEN"
        pageSubtitle="Discover modern womenswear crafted for comfort and confidence."
        gender="women"
      />
    </Suspense>
  );
}
