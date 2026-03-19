'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LoadingScreen from '@/components/loading-screen';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

const featuredCategories: { name: string; image: string; href: string }[] = [
  { name: 'Shorts', image: '/images/home/categories/short.webp', href: '/shop?category=tops' },
  { name: 'Shirts', image: '/images/home/categories/shirt.webp', href: '/shop?category=bottoms' },
  { name: 'Accessories', image: '/images/home/categories/short.webp', href: '/shop?category=accessories' },
];

const HERO_TITLE = 'H A Y Z E';

// Hook for Intersection Observer based scroll reveal
function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);
}

// Smooth scroll to section
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Home() {
  const [latestArrivals, setLatestArrivals] = useState<Product[]>([]);
  const [isLoadingArrivals, setIsLoadingArrivals] = useState(true);
  const [arrivalsError, setArrivalsError] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);

  useScrollReveal();

  useEffect(() => {
    // Trigger hero animations after a short delay for a smooth entrance
    const timer = setTimeout(() => setHeroVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadLatestArrivals = async () => {
      try {
        setIsLoadingArrivals(true);
        setArrivalsError('');

        const response = await fetch('/api/products', { cache: 'no-store' });
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/images/home/hero/HeroVid.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white dark:hidden" />
        <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-b from-transparent to-black dark:block" />

        {/* Hero Content — Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          {/* Decorative top line */}
          <div
            className={`hero-line w-16 h-px bg-white/60 mb-8 ${heroVisible ? '' : 'opacity-0'}`}
          />

          {/* Title with letter animation */}
          <h1 className="hero-title mb-4">
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-[0.2em] text-shimmer leading-none">
              <div>
              {HERO_TITLE.split('').map((char, i) => (
                <span
                  key={i}
                  className="hero-letter"
                  style={{ animationDelay: `${0.4 + i * 0.06}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
              <div className='text-2xl'>
                CLOTHING
              </div>
            </span>
          </h1>

          {/* Decorative middle line */}
          <div
            className={`hero-line w-24 h-px bg-white/40 mb-6 ${heroVisible ? '' : 'opacity-0'}`}
          />

          {/* Subtitle */}
          <p className="hero-subtitle text-base sm:text-lg md:text-xl text-white/80 max-w-lg font-light tracking-[0.15em] uppercase leading-relaxed mb-10">
            A curated collection of minimalist streetwear designed for the modern generation.
          </p>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="hero-cta magnetic-btn inline-block bg-white text-black px-12 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] border border-white/20 hover:bg-transparent hover:text-white transition-all duration-500 mb-12"
          >
            Shop Collection
          </Link>

          {/* Scroll Indicator */}
          <button
            onClick={() => scrollToSection('categories')}
            className="scroll-indicator flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll down"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section id="categories" className="py-24 px-4 max-w-7xl mx-auto">
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
              className={`category-card reveal group relative aspect-3/4 overflow-hidden bg-background border border-border stagger-${index + 1}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-display font-bold text-white tracking-tighter">
                  {cat.name}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-500">
                  Explore →
                </span>
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
