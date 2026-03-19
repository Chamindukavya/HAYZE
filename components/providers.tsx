'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/hooks/use-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
