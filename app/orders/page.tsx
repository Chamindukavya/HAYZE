'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Loader, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Suspense } from 'react';

const STATUS_INFO: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  ORDERED: {
    label: 'Order Confirmed',
    icon: <Clock size={20} />,
    color: 'text-blue-500',
  },
  PACKING: {
    label: 'Being Packed',
    icon: <Package size={20} />,
    color: 'text-yellow-500',
  },
  HAND_OVER_TO_COURIER: {
    label: 'In Transit',
    icon: <Truck size={20} />,
    color: 'text-purple-500',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: <CheckCircle size={20} />,
    color: 'text-green-500',
  },
};

function OrdersContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState(initialOrderNumber);
  const [showMyOrders, setShowMyOrders] = useState(!initialOrderNumber);

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch();
    } else if (status === 'authenticated' && (session?.user as any)?.id) {
      fetchMyOrders();
    }
  }, [status, session, initialOrderNumber]);

  const fetchMyOrders = async () => {
    if (!(session?.user as any)?.id) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
      setShowMyOrders(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!searchOrderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(searchOrderNumber)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrders([data.order]);
      setShowMyOrders(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchOrderNumber('');
    setOrders([]);
    setError('');
    if ((session?.user as any)?.id) {
      fetchMyOrders();
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">TRACK YOUR ORDERS</h1>

        {/* Search Section */}
        <div className="bg-background border border-border p-8 rounded-lg mb-12">
          <h2 className="text-lg font-display font-bold tracking-tight mb-6">Search by Order Number</h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., ORD-XXXXX-XXXXX)"
              className="w-full sm:flex-1 border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-foreground text-background px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : 'Search'}
            </button>
            {searchOrderNumber && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="w-full sm:w-auto border border-border bg-background px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-muted transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Tab Section - Show for logged in users */}
        {(session?.user as any)?.id && !searchOrderNumber && (
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={fetchMyOrders}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                showMyOrders ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground'
              }`}
            >
              My Orders
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded text-sm mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {(loading || status === 'loading') && (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Orders Display */}
        {!loading && status !== 'loading' && orders.length === 0 && !error && (
          <div className="text-center py-24">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-8">
              {(session?.user as any)?.id ? 'You have no orders yet.' : 'No orders found. Try searching by order number.'}
            </p>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => {
              const statusInfo = STATUS_INFO[order.status];
              return (
                <div key={order._id} className="border border-border p-8 rounded">
                  {/* Header */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-border">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                        Order Number
                      </p>
                      <p className="font-display font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                        Order Date
                      </p>
                      <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                        Total Amount
                      </p>
                      <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                        Payment Method
                      </p>
                      <p className="text-sm">{order.paymentMethod} - Cash on Delivery</p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Delivery Status</h3>
                    <div className="flex items-center justify-between">
                      {['ORDERED', 'PACKING', 'HAND_OVER_TO_COURIER', 'DELIVERED'].map((status, idx, arr) => {
                        const isCompleted = arr.indexOf(order.status) >= idx;
                        const isCurrent = order.status === status;
                        const info = STATUS_INFO[status];

                        return (
                          <div key={status} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isCurrent
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {info.icon}
                            </div>
                            <p className="text-xs font-semibold text-center">{info.label}</p>
                            {idx < arr.length - 1 && (
                              <div
                                className={`w-full h-1 my-3 transition-colors ${
                                  arr.indexOf(order.status) > idx ? 'bg-green-500' : 'bg-muted'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                              Size: {item.size} | Color: {item.color}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">Qty: {item.quantity}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Receiver Name
                        </p>
                        <p>{order.receiverName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Email
                        </p>
                        <p>{order.receiverEmail}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Primary Phone
                        </p>
                        <p>{order.phone1}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Secondary Phone
                        </p>
                        <p>{order.phone2}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Delivery Address
                        </p>
                        <p className="line-clamp-3">{order.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background pt-24" />}>
      <OrdersContent />
    </Suspense>
  );
}
