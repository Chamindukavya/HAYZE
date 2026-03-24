'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LoadingScreen from '@/components/loading-screen';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { HeroSection } from '@/components/ui/feature-carousel';

const featuredCategories: { name: string; image: string; href: string }[] = [
  { name: 'T-Shirts', image: '/images/home/categories/cat1.png', href: '/shop?category=T-Shirts' },
  { name: 'Shorts', image: '/images/home/categories/cat2.png', href: '/shop?category=Shorts' },
  { name: 'Tops', image: '/images/home/categories/cat2.png', href: '/shop?category=Tops' },
];

export default function Home() {
  const [latestArrivals, setLatestArrivals] = useState<Product[]>([]);
  const [isLoadingArrivals, setIsLoadingArrivals] = useState(true);
  const [arrivalsError, setArrivalsError] = useState('');


  useEffect(() => {
    const loadLatestArrivals = async () => {
      try {
        setIsLoadingArrivals(true);
        setArrivalsError('');

        const response = await fetch('/api/products?featured=true', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load latest arrivals');
        }

        const products = (await response.json()) as Product[];
        setLatestArrivals(products.slice(0, 4));
      } catch {
        setArrivalsError('Unable to load latest arrivals right now.');
      } finally {
        setIsLoadingArrivals(false);
      }
    };

    loadLatestArrivals();
  }, []);

  // Re-initialize observer when arrivals load (new elements appear)
  useEffect(() => {
    if (!isLoadingArrivals) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
      );

      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach((el) => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }
  }, [isLoadingArrivals]);

  return (
    <main className="min-h-screen bg-background">
      <LoadingScreen />
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full">
        <HeroSection
          className="pt-12 md:pt-32"
          title={
            <>
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">HAYZE</span> Style
            </>
          }
          images={[
            {
              src: 'https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60',
              alt: 'Professional portrait',
            },
            {
              src: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&auto=format&fit=crop&q=60',
              alt: 'Scenic landscape',
            },
            {
              src: 'https://plus.unsplash.com/premium_photo-1670282392820-e3590c1c5c54?w=900&auto=format&fit=crop&q=60',
              alt: 'Artistic photo',
            },
            {
              src: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=900&auto=format&fit=crop&q=60',
              alt: 'A dog wearing sunglasses',
            },
            {
              src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60',
              alt: 'Creative shot of a person from behind',
            },
          ]}
          subtitle="A curated collection of minimalist streetwear designed for the modern generation."

        />
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section id="categories" className="pb-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
            Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCategories.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`category-card reveal group relative aspect-3/4 stagger-${index + 1} p-[4px] overflow-hidden bg-background`}
            >
              {/* Outer blurred shadow for neon glow */}
              <div 
                className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_65%,#a855f7_95%,#ffffff_100%)] opacity-60 blur-[12px] group-hover:opacity-90 transition-opacity duration-500"
                style={{ animationDuration: '4s' }}
              />

              {/* Core bright neolight tail structure */}
              <div 
                className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,#a855f7_98%,#ffffff_100%)] opacity-100 blur-[2px] transition-opacity duration-500"
                style={{ animationDuration: '4s' }}
              />
              
              {/* Inner card content */}
              <div className="relative w-full h-full overflow-hidden bg-background">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 z-10">
                  <h3 className="text-2xl font-display font-bold text-white tracking-tighter">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-500">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEW ARRIVALS PREVIEW ===== */}
      <section className="py-20 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-14 reveal">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block">
                New Drops
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
                LATEST ARRIVALS
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoadingArrivals ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Loading latest arrivals...
                  </p>
                </div>
              </div>
            ) : arrivalsError ? (
              <p className="col-span-full text-xs uppercase tracking-widest text-red-500 text-center py-12">
                {arrivalsError}
              </p>
            ) : latestArrivals.length === 0 ? (
              <p className="col-span-full text-xs uppercase tracking-widest text-muted-foreground text-center py-12">
                No arrivals available yet.
              </p>
            ) : (
              latestArrivals.map((product, index) => (
                <Link
                  key={product._id}
                  href={`/shop/${product._id}`}
                  className={`product-card reveal group cursor-pointer stagger-${index + 1}`}
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-background border border-border mb-4">
                    <Image
                      src={
                        product.images?.[0] ||
                        'https://picsum.photos/seed/vibe-arrival-fallback/600/800'
                      }
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                      New
                    </div>
                  </div>
                  <h3 className="text-sm font-medium tracking-tight group-hover:underline underline-offset-4 transition-all">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal">
            {/* <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
              Our Story
            </span> */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter mb-4 italic leading-tight">
              &quot;BREATH IN - STYLE OUT&quot;
            </h2>
          </div>
          <p className="reveal stagger-3 text-muted-foreground leading-relaxed font-light text-base md:text-lg">
            HAYZE was born from a desire to bridge the gap between high-fashion
            minimalism and the raw energy of street culture. We believe in pieces that speak for
            themselves—no loud logos, just premium fabrics and perfect silhouettes.
          </p>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 bg-background border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
              Need Help?
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
              FREQUENTLY ASKED
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="space-y-8">
            {[
              {
                q: 'What is your shipping policy?',
                a: 'We offer islandwide shipping. Orders are processed within 4-5 business days.',
              },
              {
                q: 'How do I track my order?',
                a: 'Once your order is shipped, you will receive a confirmation message with a tracking number. You can track your order by visiting the orders page and entering your order number.',
              },
              {
                q: 'Do you offer returns?',
                a: 'Yes, we offer a 1-day return policy for all unworn items in original packaging.',
              },
              {
                q: 'Do you offer cash on delivery?',
                a: 'Yes, we offer cash on delivery for all orders.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal stagger-${i + 1} border-b border-border pb-8 group`}
              >
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 group-hover:tracking-[0.2em] transition-all duration-300">
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground font-light">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
