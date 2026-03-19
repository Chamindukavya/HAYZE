'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 22 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tighter">DASHBOARD</h1>
        <p className="text-muted-foreground text-sm">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$128,430', icon: DollarSign, trend: '+12.5%', up: true },
          { label: 'Total Orders', value: '1,240', icon: ShoppingBag, trend: '+8.2%', up: true },
          { label: 'Total Products', value: '48', icon: Package, trend: '-2.4%', up: false },
          { label: 'Active Users', value: '842', icon: Activity, trend: '+15.3%', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-background p-6 border border-border rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <stat.icon size={20} className="text-muted-foreground" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1",
                stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background p-8 border border-border rounded-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-8">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="sales" fill="currentColor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background p-8 border border-border rounded-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-8">Order Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line type="monotone" dataKey="orders" stroke="currentColor" strokeWidth={2} dot={{ fill: 'currentColor' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest">Recent Orders</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View All</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { id: '#ORD-7241', customer: 'John Doe', status: 'Delivered', amount: '$145.00', date: '2 mins ago' },
              { id: '#ORD-7240', customer: 'Jane Smith', status: 'Processing', amount: '$85.00', date: '15 mins ago' },
              { id: '#ORD-7239', customer: 'Mike Ross', status: 'Pending', amount: '$210.00', date: '1 hour ago' },
              { id: '#ORD-7238', customer: 'Sarah Connor', status: 'Shipped', amount: '$45.00', date: '3 hours ago' },
            ].map((order, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full",
                    order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-500" :
                    order.status === 'Processing' ? "bg-blue-500/10 text-blue-500" :
                    order.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                    "bg-muted-foreground/10 text-muted-foreground"
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{order.amount}</td>
                <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Remove local cn function as we now import it
