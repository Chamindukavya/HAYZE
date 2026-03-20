import ShopCatalog from '@/components/shop-catalog';

const womenCategories = ['All', 'OverSized', 'Regular', 'Shorts', 'Tops'];

export default function WomenPage() {
  return (
    <ShopCatalog
      pageTitle="WOMEN"
      pageSubtitle="Discover modern womenswear crafted for comfort and confidence."
      categories={womenCategories}
      gender="women"
    />
  );
}
