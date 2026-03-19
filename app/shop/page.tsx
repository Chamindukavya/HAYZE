'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import type { Product } from '@/types';

const categories = ['All',"Men's T Shirts","Men's Over Size T Shirts", "Women's T Shirts", "Unisex T Shirts", 'Tops', "Women's Shorts"];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load products');
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch {
        setError('Unable to load products right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const displayedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const searchValue = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (activeSort === 'Price: Low to High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'Price: High to Low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'Most Popular') {
      sorted.sort((a, b) => b.clicks - a.clicks);
    } else {
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return sorted;
  }, [products, activeCategory, searchTerm, activeSort]);

  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-display font-bold tracking-tighter">SHOP ALL</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">Browse our full collection of premium essentials.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-y border-border py-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[8px] uppercase tracking-[0.3em] font-bold px-6 py-3 border transition-all ${
                  activeCategory === cat 
                    ? 'bg-foreground text-background border-foreground' 
                    : 'border-border text-foreground hover:bg-foreground hover:text-background'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={14} />
              <input 
                type="text" 
                placeholder="SEARCH PRODUCTS..." 
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent border border-border pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest focus:outline-none focus:bg-foreground focus:text-background transition-all"
              />
            </div>
            <div className="relative group">
              <button className="flex items-center gap-3 text-[8px] uppercase tracking-[0.3em] font-bold border border-border px-6 py-3 hover:bg-foreground hover:text-background transition-all">
                Sort: {activeSort} <ChevronDown size={10} />
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-background border border-border hidden group-hover:block z-20">
                {sortOptions.map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => setActiveSort(opt)}
                    className="w-full text-left px-6 py-4 text-[8px] uppercase tracking-[0.3em] font-bold hover:bg-foreground hover:text-background transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="mb-32 py-16 text-center text-sm uppercase tracking-[0.2em] opacity-60">
            Loading products...
          </div>
        ) : error ? (
          <div className="mb-32 py-16 text-center text-sm uppercase tracking-[0.2em] text-red-500">
            {error}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="mb-32 py-16 text-center text-sm uppercase tracking-[0.2em] opacity-60">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 mb-16">
          {displayedProducts.map((product) => (
            <Link key={product._id} href={`/shop/${product._id}`} className="group">
              <div className="relative aspect-3/4 overflow-hidden border border-border mb-6">
                <Image
                  src={product.images?.[0] || 'https://picsum.photos/seed/vibe-shop-fallback/800/1000'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
                
                {/* Quick View Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button className="w-full bg-foreground text-background py-4 text-[8px] font-bold uppercase tracking-[0.3em] border border-border">
                    Quick View
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest group-hover:underline underline-offset-8">{product.name}</h3>
                  <p className="text-[8px] uppercase tracking-[0.3em] opacity-50 mt-2">{product.category}</p>
                </div>
                <p className="text-[10px] font-bold">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                {(product.colors.length > 0 ? product.colors : ['Default']).slice(0, 3).map((color) => (
                  <div
                    key={`${product._id}-${color}`}
                    className="h-2.5 rounded-full border border-border min-w-2.5 px-1 text-[7px] uppercase tracking-widest flex items-center justify-center"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
