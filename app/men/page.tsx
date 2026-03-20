import ShopCatalog from '@/components/shop-catalog';

const menCategories = ['All', "Men's T Shirts", "Men's Over Size T Shirts", 'Unisex T Shirts'];

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
