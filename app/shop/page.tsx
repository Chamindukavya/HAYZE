import ShopCatalog from '@/components/shop-catalog';

const categories = [
  'All',
  "Men's T Shirts",
  "Men's Over Size T Shirts",
  "Women's T Shirts",
  'Unisex T Shirts',
  'Tops',
  "Women's Shorts",
];

export default function ShopPage() {
  return (
    <ShopCatalog
      pageTitle="SHOP ALL"
      pageSubtitle="Browse our full collection of premium essentials."
      categories={categories}
    />
  );
}
