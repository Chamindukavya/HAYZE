'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const orderId = searchParams.get('orderId');
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!orderNumber) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <p className="text-red-500 mb-8">Invalid order confirmation.</p>
            <Link href="/shop" className="inline-block bg-foreground text-background px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter mb-4">ORDER CONFIRMED!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Information */}
        <div className="bg-background border border-border p-12 rounded-lg mb-16">
          <div className="text-center mb-8">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-4">Your Order Number</h2>
            <div className="flex items-center justify-center gap-4">
              <p className="text-3xl font-display font-bold tracking-tighter">{orderNumber}</p>
              <button
                onClick={handleCopyOrderNumber}
                className="p-2 hover:bg-muted rounded transition-colors"
                title="Copy order number"
              >
                <Copy size={20} />
              </button>
            </div>
            {copied && <p className="text-xs text-green-500 mt-2">Copied to clipboard!</p>}
          </div>

          <div className="border-t border-border pt-8">
            <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] mb-6">What's Next?</h3>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold">Order Confirmation</p>
                  <p className="text-muted-foreground text-xs">A confirmation email has been sent to your email address.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold">Processing</p>
                  <p className="text-muted-foreground text-xs">We will prepare and process your order.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div>
                  <p className="font-semibold">Handover to Courier</p>
                  <p className="text-muted-foreground text-xs">Your package will be handed over to the courier.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <p className="font-semibold">Delivered</p>
                  <p className="text-muted-foreground text-xs">Your order arrives at your doorstep.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="bg-background border border-border p-8 rounded-lg mb-16">
          <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] mb-4">Track Your Order</h3>
          <p className="text-sm text-muted-foreground mb-6">
            You can track your order status using your order number. Visit the order tracking page to check the current status.
          </p>
          <Link
            href={`/orders?orderNumber=${orderNumber}`}
            className="inline-block bg-foreground text-background px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
          >
            Track Order
          </Link>
        </div>

        {/* Contact Support */}
        <div className="bg-background border border-border p-8 rounded-lg mb-16">
          <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] mb-4">Questions?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            If you have any questions about your order, feel free to contact us on WhatsApp.
          </p>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-green-700 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block border border-border px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background pt-24" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
