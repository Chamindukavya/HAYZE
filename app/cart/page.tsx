'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const shipping = 350;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">YOUR BAG</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-8">
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 pb-8 border-b border-border">
                  <div className="relative w-24 h-32 md:w-32 md:h-40 bg-background border border-border overflow-hidden">
                    <Image
                      src={item.images?.[0] || 'https://picsum.photos/seed/vibe-cart-fallback/200/250'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold tracking-tight">{item.name}</h3>
                        <p className="font-bold">{item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground space-y-1">
                        <p>Size: {item.selectedSize}</p>
                        <p>Color: {item.selectedColor}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id, item.selectedSize, item.selectedColor)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-background p-8 h-fit border border-border">
              <h2 className="text-xl font-display font-bold tracking-tighter mb-8">ORDER SUMMARY</h2>
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="w-full bg-foreground text-background py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 inline-block text-center">
                Buy
                {/* <ArrowRight size={16} /> */}
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted-foreground mb-8">Your bag is empty.</p>
            <Link href="/shop" className="inline-block bg-foreground text-background px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
