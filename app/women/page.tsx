import ShopCatalog from '@/components/shop-catalog';

const womenCategories = ['All', "Women's T Shirts", "Women's Over Size T Shirts", "Women's Shorts", 'Unisex T Shirts'];

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
