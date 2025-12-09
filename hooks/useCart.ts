'use client';

/**
 * Custom hook for cart operations
 * Simplified API for components using cartStore
 */

import { useCallback } from 'react';
import { Product } from '@/types/database.types';
import { useCartStore, CartItem } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';

export interface UseCartReturn {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  getQuantity: (productId: string) => number;
  calculateShipping: (subtotal: number) => number;
  calculateTax: (subtotal: number) => number;
}

export function useCart(): UseCartReturn {
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);
  const calculateShipping = useCartStore((state) => state.calculateShipping);
  const calculateTax = useCartStore((state) => state.calculateTax);

  const supabase = createClient();

  const add = useCallback(
    async (product: Product, quantity: number = 1) => {
      addItem(product, quantity);
      // Optionally sync with Supabase
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: existingItem, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id' as any, user.id)
            .eq('product_id' as any, product.id)
            .single();

          if (!error && existingItem) {
            await (supabase
              .from('cart_items')
              .update as any)({ quantity: (existingItem as any).quantity + quantity })
              .eq('id' as any, (existingItem as any).id);
          } else {
            await supabase.from('cart_items').insert({
              user_id: user.id,
              product_id: product.id,
              quantity,
            } as any);
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
        // Don't throw - local cart is already updated
      }
    },
    [addItem, supabase]
  );

  const remove = useCallback(
    async (productId: string) => {
      await removeItem(productId, supabase);
    },
    [removeItem, supabase]
  );

  const update = useCallback(
    async (productId: string, quantity: number) => {
      await updateQuantity(productId, quantity, supabase);
    },
    [updateQuantity, supabase]
  );

  const clear = useCallback(async () => {
    await clearCart(supabase);
  }, [clearCart, supabase]);

  return {
    items: cartItems,
    count: totalItems,
    total: totalPrice,
    add,
    remove,
    update,
    clear,
    getQuantity: getItemQuantity,
    calculateShipping,
    calculateTax,
  };
}