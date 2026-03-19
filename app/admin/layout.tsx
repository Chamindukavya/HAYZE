'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-8">
          <Link href="/" className="text-2xl font-display font-bold tracking-tighter">HAYZE</Link>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                activeTab === item.name 
                  ? "bg-white text-black" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <Settings size={18} />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-zinc-900 border border-white/5 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors rounded-lg"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
