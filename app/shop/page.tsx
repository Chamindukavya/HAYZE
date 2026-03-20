import ShopCatalog from '@/components/shop-catalog';

const categories = [
  'All', 'OverSized', 'Regular', 'Shorts', 'Tops'
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
