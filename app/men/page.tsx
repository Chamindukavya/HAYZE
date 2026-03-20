import ShopCatalog from '@/components/shop-catalog';

const menCategories = ['All', 'OverSized', 'Regular',];

export default function MenPage() {
  return (
    <ShopCatalog
      pageTitle="MEN"
      pageSubtitle="Explore premium menswear essentials made for everyday style."
      categories={menCategories}
      gender="men"
    />
  );
}
