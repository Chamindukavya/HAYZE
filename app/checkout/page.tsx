'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ArrowRight, Loader } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';

const WHATSAPP_NUMBER = '923001234567'; // Replace with your WhatsApp number
const COD_CHARGES = 0; // Cash on delivery charges

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    receiverName: '',
    receiverEmail: session?.user?.email || '',
    address: '',
    phone1: '',
    phone2: '',
  });

  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping + COD_CHARGES;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (
      !formData.receiverName ||
      !formData.receiverEmail ||
      !formData.address ||
      !formData.phone1 ||
      !formData.phone2
    ) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          image: item.images?.[0] || '',
        })),
        subtotal,
        shipping,
        total,
        receiverName: formData.receiverName,
        receiverEmail: formData.receiverEmail,
        address: formData.address,
        phone1: formData.phone1,
        phone2: formData.phone2,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}&orderId=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">CHECKOUT</h1>
          <div className="text-center py-24">
            <p className="text-muted-foreground mb-8">Your cart is empty.</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Delivery Information */}
              <div>
                <h2 className="text-2xl font-display font-bold tracking-tighter mb-6">DELIVERY INFORMATION</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="receiverEmail"
                      value={formData.receiverEmail}
                      onChange={handleInputChange}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                      placeholder="Enter full address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                        Phone 1 *
                      </label>
                      <input
                        type="tel"
                        name="phone1"
                        value={formData.phone1}
                        onChange={handleInputChange}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                        Phone 2 *
                      </label>
                      <input
                        type="tel"
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleInputChange}
                        className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-display font-bold tracking-tighter mb-6">PAYMENT METHOD</h2>
                <div className="border border-border p-6 rounded">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      defaultChecked
                      className="w-4 h-4"
                      disabled
                    />
                    <label htmlFor="cod" className="ml-3 text-sm font-semibold cursor-pointer">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
                    Pay when your order arrives
                  </p>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-background border border-border p-6 rounded">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-3">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact us on WhatsApp for any queries about your order.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-green-700 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Items */}
              <div className="border border-border p-6 rounded">
                <h2 className="text-sm font-display font-bold uppercase tracking-[0.2em] mb-6">Order Items</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-xs">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.selectedSize} / {item.selectedColor}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-xs whitespace-nowrap ml-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border border-border p-6 rounded">
                <h2 className="text-sm font-display font-bold uppercase tracking-[0.2em] mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  {COD_CHARGES > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">COD Charges</span>
                      <span className="font-semibold">${COD_CHARGES.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-foreground text-background py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
                  Your Order Number will be sent<br /> to your email after confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
