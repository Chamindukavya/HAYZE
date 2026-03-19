'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Heart, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const productId = params?.slug;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const images = useMemo(() => {
    if (!product?.images?.length) {
      return ['https://picsum.photos/seed/vibe-product-fallback/1000/1200'];
    }
    return product.images;
  }, [product]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`/api/products/${productId}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const data = (await response.json()) as Product;
        setProduct(data);
        setSelectedSize(data.sizes[0] || 'One Size');
        setSelectedColor(data.colors[0] || 'Default');

        const relatedResponse = await fetch(
          `/api/products?category=${encodeURIComponent(data.category)}`,
          { cache: 'no-store' }
        );

        if (relatedResponse.ok) {
          const related = (await relatedResponse.json()) as Product[];
          setRelatedProducts(related.filter((item) => item._id !== data._id).slice(0, 4));
        }
      } catch {
        setError('Product could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const sizeOptions = product?.sizes.length ? product.sizes : ['One Size'];
  const colorOptions = product?.colors.length ? product.colors : ['Default'];

  const handleAddToBag = () => {
    if (!product) return;
    addItem(product, selectedSize || 'One Size', selectedColor || 'Default');
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-sm uppercase tracking-[0.2em] opacity-60">
          Loading product...
        </div>
      ) : error || !product ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-red-500 mb-8">{error || 'Product not found.'}</p>
          <Link href="/shop" className="inline-block border border-border px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-foreground hover:text-background transition-all">
            Back to Shop
          </Link>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Image Gallery - Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-fit">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-3/4 overflow-hidden bg-background border border-border">
                <Image
                  src={img}
                  alt={`Product Image ${i + 1}`}
                  fill
                  className="object-cover hover:transition-all duration-700"
                  priority={i === 0}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          {/* Product Details - Sticky */}
          <div className="lg:col-span-6">
            <div className="sticky top-32 flex flex-col">
              <div className="mb-12">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                  <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                  <ChevronRight size={10} />
                  <span>{product.category}</span>
                  <ChevronRight size={10} />
                  <span className="text-foreground">{product.name}</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6 leading-none">{product.name}</h1>
                <p className="text-3xl font-bold tracking-tighter">{product.price.toFixed(2)}</p>
              </div>

              <div className="space-y-12 mb-12">
                {/* Color Selection */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Color: {selectedColor}</h3>
                  <div className="flex gap-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border transition-all ${
                          selectedColor === color ? 'border-foreground scale-110' : 'border-border hover:border-foreground/50'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Size</h3>
                    <button className="text-[10px] uppercase tracking-widest underline underline-offset-8 text-muted-foreground hover:text-foreground transition-colors">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-4 text-[10px] font-bold border transition-all ${
                          selectedSize === size 
                            ? 'bg-foreground text-background border-foreground' 
                            : 'border-border text-muted-foreground hover:border-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-16">
                <button
                  onClick={handleAddToBag}
                  className="w-full bg-foreground text-background py-6 text-xs font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={18} />
                  Add to Bag
                </button>
                {/* <button className="w-full border border-border py-6 flex items-center justify-center hover:border-foreground transition-colors gap-3 text-xs font-bold uppercase tracking-[0.3em]">
                  <Heart size={18} />
                  Add to Wishlist
                </button> */}
              </div>

              <div className="space-y-10 border-t border-border pt-10">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Description</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Details</h3>
                  <ul className="text-sm text-muted-foreground font-light space-y-2 list-none">
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground rounded-full" /> Category: {product.category}</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground rounded-full" /> In Stock: {product.stock}</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground rounded-full" /> Available Sizes: {sizeOptions.join(', ')}</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground rounded-full" /> Available Colors: {colorOptions.join(', ')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-48 border-t border-border pt-24">
          <h2 className="text-4xl font-display font-bold tracking-tighter mb-16">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <Link key={item._id} href={`/shop/${item._id}`} className="group cursor-pointer">
                <div className="relative aspect-3/4 overflow-hidden bg-background border border-border mb-6">
                  <Image
                    src={item.images?.[0] || 'https://picsum.photos/seed/vibe-related-fallback/600/800'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest group-hover:underline underline-offset-8">{item.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.2em]">${item.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      )}

      <Footer />
    </main>
  );
}
