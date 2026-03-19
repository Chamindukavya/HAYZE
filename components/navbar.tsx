'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'motion/react';
import ThemeToggle from './theme-toggle';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import darkLogo from '@/app/public/images/HAYZE LOGO Dark mode.png';
import lightLogo from '@/app/public/images/HAYZ LOGO Light mode.png';
import { useCart } from '@/hooks/use-cart';
import { signOut, useSession } from 'next-auth/react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  // { name: 'Gifts', href: '/gifts' },
  // { name: 'New Arrivals', href: '/shop?sort=newest' },
  // { name: 'Collections', href: '/shop?category=collections' },
  { name: 'Orders', href: '/orders' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { itemCount } = useCart();
  const [openModel, setOpenModel] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && theme === 'dark' ? darkLogo : lightLogo;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="relative z-20 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-20 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 shrink-0 flex items-center md:static md:translate-x-0">
            <Link href="/" className="relative h-18 w-32 sm:h-18 sm:w-32">
              <Image
                src={logoSrc}
                alt="HAYZE"
                fill
                priority
                // sizes="(max-width: 640px) 50px, 50px"
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 relative">
            <ThemeToggle />
            <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpenModel((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <User size={20} />
            </button>

            {openModel && (
              <div className="absolute right-0 top-10 w-56 rounded-md border border-border bg-background p-3 shadow-lg">
                {status === 'authenticated' ? (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground font-medium truncate">
                      {session.user?.name || session.user?.email || 'User'}
                    </p>

                    {(session.user as any)?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setOpenModel(false)}
                        className="block w-full rounded-md border border-border px-3 py-2 text-sm text-center text-foreground hover:bg-muted transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setOpenModel(false);
                        void signOut();
                      }}
                      className="w-full rounded-md bg-background border-2 border-foreground px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-opacity"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    onClick={() => setOpenModel(false)}
                    className="block w-full rounded-md bg-background border-2 border-foreground px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-opacity"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
