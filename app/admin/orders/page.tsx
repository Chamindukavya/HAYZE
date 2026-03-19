'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Loader, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  ORDERED: 'bg-blue-500/10 text-blue-500 border-blue-500',
  PACKING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
  HAND_OVER_TO_COURIER: 'bg-purple-500/10 text-purple-500 border-purple-500',
  DELIVERED: 'bg-green-500/10 text-green-500 border-green-500',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
      fetchOrders();
    }
  }, [status, session, statusFilter, dateFrom, dateTo]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.set('status', statusFilter);
      }
      if (dateFrom) {
        params.set('dateFrom', dateFrom);
      }
      if (dateTo) {
        params.set('dateTo', dateTo);
      }

      const query = params.toString();
      const response = await fetch(`/api/orders${query ? `?${query}` : ''}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="animate-spin text-muted-foreground" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if ((session?.user as any)?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-background pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-red-500 mb-8">Unauthorized. Admin access only.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-12">MANAGE ORDERS</h1>

        <div className="border border-border rounded p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="ALL">All</option>
                <option value="ORDERED">ORDERED</option>
                <option value="PACKING">PACKING</option>
                <option value="HAND_OVER_TO_COURIER">HAND_OVER_TO_COURIER</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full border border-border hover:bg-muted transition-colors px-3 py-2 text-xs font-bold uppercase tracking-[0.2em]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded text-sm mb-8">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground mb-8">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-border rounded">
                <button
                  onClick={() => toggleExpanded(String(order._id))}
                  className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                        Order ID
                      </p>
                      <p className="font-bold text-sm truncate">{String(order._id)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                        Name
                      </p>
                      <p className="text-sm font-semibold">{order.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="text-sm">{order.phone1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                        Status
                      </p>
                      <div className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded border ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex md:justify-end">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        {expandedOrderIds.includes(String(order._id)) ? (
                          <>
                            Collapse <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Expand <ChevronDown size={16} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {expandedOrderIds.includes(String(order._id)) && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 pb-6 border-b border-border">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Order Number
                        </p>
                        <p className="font-bold">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Receiver
                        </p>
                        <p className="text-sm">{order.receiverName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Total
                        </p>
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Date
                        </p>
                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-1">
                          Status
                        </p>
                        <div className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded border ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-border">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm flex justify-between">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {item.size} / {item.color} x {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-border">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Contact & Delivery</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Email</p>
                          <p>{order.receiverEmail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Phone 1</p>
                          <p>{order.phone1}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Phone 2</p>
                          <p>{order.phone2}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Address</p>
                          <p className="line-clamp-2">{order.address}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Update Status</h3>
                      <div className="flex gap-2 flex-wrap">
                        {['ORDERED', 'PACKING', 'HAND_OVER_TO_COURIER', 'DELIVERED'].map((statusItem) => (
                          <button
                            key={statusItem}
                            onClick={() => handleStatusUpdate(String(order._id), statusItem)}
                            disabled={updatingId === String(order._id) || order.status === statusItem}
                            className={`px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${
                              order.status === statusItem
                                ? `${STATUS_COLORS[statusItem]} cursor-default`
                                : 'border border-border hover:bg-muted'
                            } disabled:opacity-50`}
                          >
                            {statusItem}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
