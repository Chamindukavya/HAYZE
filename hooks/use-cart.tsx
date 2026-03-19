'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage after hydration (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('hayze_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage whenever items change, but only after hydration
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('hayze_cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, size: string, color: string) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item._id === product._id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingItem) {
        return prev.map((item) =>
          item === existingItem
            ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(item.stock, 1)) }
            : item
        );
      }

      if (product.stock < 1) {
        return prev;
      }

      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeItem = (id: string, size: string, color: string) => {
    setItems((prev) => prev.filter(
      (item) => !(item._id === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item._id === id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: Math.min(quantity, Math.max(item.stock, 1)) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
