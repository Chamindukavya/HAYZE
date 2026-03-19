'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Gift, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ClaimGiftPage() {
  const params = useParams();
  const [gift, setGift] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [giftRes, productsRes] = await Promise.all([
          fetch(`/api/gifts/${params.id}`),
          fetch('/api/products')
        ]);

        if (giftRes.ok && productsRes.ok) {
          const giftData = await giftRes.json();
          const productsData = await productsRes.json();
          setGift(giftData);
          setProducts(productsData);
          if (giftData.status === 'claimed') {
            setClaimed(true);
            setSelectedProduct(giftData.claimedItem);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleClaim = async () => {
    if (!selectedProduct) return;
    setClaiming(true);

    try {
      const res = await fetch(`/api/gifts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct._id }),
      });

      if (res.ok) {
        setClaimed(true);
      }
    } catch (error) {
      console.error('Error claiming gift:', error);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin opacity-50" size={32} />
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-4">GIFT NOT FOUND</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-8">This gift link may have expired or is invalid.</p>
        <Link href="/" className="bg-foreground text-background px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em]">Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-border mb-6">
            <Gift size={32} />
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter mb-4">A GIFT FOR YOU</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">
            {gift.senderName} has sent you a special gift. Choose your favorite piece below.
          </p>
          {gift.message && (
            <div className="mt-8 max-w-xl mx-auto p-6 border border-border italic text-sm opacity-70">
              &ldquo;{gift.message}&rdquo;
            </div>
          )}
        </div>

        {claimed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto border border-border p-12 text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center mx-auto">
              <Check size={40} />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold tracking-tighter uppercase">Gift Claimed!</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                You&apos;ve selected the <span className="text-foreground font-bold">{selectedProduct?.name}</span>. 
                {gift.senderName} has been notified to complete the order.
              </p>
            </div>
            <div className="relative aspect-[3/4] w-48 mx-auto border border-border">
              <Image 
                src={selectedProduct?.images?.[0] || 'https://picsum.photos/seed/vibe-placeholder/400/500'} 
                alt={selectedProduct?.name || 'Product'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div 
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  className={`group cursor-pointer border transition-all ${
                    selectedProduct?._id === product._id ? 'border-foreground' : 'border-border'
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {selectedProduct?._id === product._id && (
                      <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
                        <div className="bg-foreground text-background p-2 rounded-full">
                          <Check size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">{product.name}</h3>
                    <p className="text-[8px] uppercase tracking-[0.2em] opacity-50 mt-1">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-8 left-0 right-0 flex justify-center px-4">
              <button 
                onClick={handleClaim}
                disabled={!selectedProduct || claiming}
                className="max-w-md w-full bg-foreground text-background py-6 text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {claiming ? 'CLAIMING...' : selectedProduct ? `CLAIM ${selectedProduct.name}` : 'SELECT AN ITEM'}
                {!claiming && selectedProduct && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
