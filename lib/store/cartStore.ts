/**
 * Zustand store for shopping cart state management
 * Handles cart items, totals, and persistence to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/database.types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string, supabaseClient?: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, supabaseClient?: any) => Promise<void>;
  clearCart: (supabaseClient?: any) => Promise<void>;
  getItemQuantity: (productId: string) => number;
  addToCart: (product: Product, quantity?: number, supabaseClient?: any) => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  calculateShipping: (subtotal: number) => number;
  calculateTax: (subtotal: number) => number;
}

/**
 * Calculate total items in cart
 */
function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate total price of cart
 */
function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,

      /**
       * Add item to cart or update quantity if already exists
       */
      addItem: (product: Product, quantity: number = 1) => {
        const currentItems = get().cartItems;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.product.id === product.id
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          newItems = currentItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // New item, add to cart
          newItems = [
            ...currentItems,
            {
              id: `${product.id}-${Date.now()}`,
              product,
              quantity,
            },
          ];
        }

        set({
          cartItems: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: async (productId: string, supabaseClient?: any) => {
        const newItems = get().cartItems.filter(
          (item) => item.product.id !== productId
        );

        set({
          cartItems: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });

        // Sync with Supabase if user is logged in
        if (supabaseClient) {
          try {
            const {
              data: { user },
            } = await supabaseClient.auth.getUser();

            if (user) {
              await supabaseClient
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
            }
          } catch (error) {
            console.error('Error removing from cart DB:', error);
          }
        }
      },

      /**
       * Update quantity of an item
       */
      updateQuantity: async (productId: string, quantity: number, supabaseClient?: any) => {
        if (quantity <= 0) {
          await get().removeItem(productId, supabaseClient);
          return;
        }

        const newItems = get().cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );

        set({
          cartItems: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });

        // Sync with Supabase if user is logged in
        if (supabaseClient) {
          try {
            const {
              data: { user },
            } = await supabaseClient.auth.getUser();

            if (user) {
              const { data: existingItem } = await supabaseClient
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .single();

              if (existingItem) {
                await supabaseClient
                  .from('cart_items')
                  .update({ quantity })
                  .eq('id', existingItem.id);
              } else {
                await supabaseClient.from('cart_items').insert({
                  user_id: user.id,
                  product_id: productId,
                  quantity,
                });
              }
            }
          } catch (error) {
            console.error('Error updating cart item DB:', error);
          }
        }
      },

      /**
       * Clear all items from cart
       */
      clearCart: async (supabaseClient?: any) => {
        set({
          cartItems: [],
          totalItems: 0,
          totalPrice: 0,
        });

        // Sync with Supabase if user is logged in
        if (supabaseClient) {
          try {
            const {
              data: { user },
            } = await supabaseClient.auth.getUser();

            if (user) {
              await supabaseClient.from('cart_items').delete().eq('user_id', user.id);
            }
          } catch (error) {
            console.error('Error clearing cart DB:', error);
          }
        }
      },

      /**
       * Get quantity of a specific item in cart
       */
      getItemQuantity: (productId: string) => {
        const item = get().cartItems.find(
          (item) => item.product.id === productId
        );
        return item ? item.quantity : 0;
      },

      /**
       * Get cart total (subtotal)
       */
      getCartTotal: () => {
        return get().totalPrice;
      },

      /**
       * Get cart item count
       */
      getCartCount: () => {
        return get().totalItems;
      },

      /**
       * Calculate shipping cost
       * Free for orders over Rs. 5000, otherwise Rs. 200
       */
      calculateShipping: (subtotal: number) => {
        return subtotal >= 5000 ? 0 : 200;
      },

      /**
       * Calculate tax (10% of subtotal)
       */
      calculateTax: (subtotal: number) => {
        return subtotal * 0.1;
      },

      /**
       * Add to cart with Supabase sync for logged-in users
       * This function can be called from components that have access to Supabase client
       */
      addToCart: async (product: Product, quantity: number = 1, supabaseClient?: any) => {
        // Add to local cart first
        get().addItem(product, quantity);

        // Sync with Supabase if user is logged in
        if (supabaseClient) {
          try {
            const {
              data: { user },
            } = await supabaseClient.auth.getUser();

            if (user) {
              // Check if item already exists in cart
              const { data: existingItem } = await supabaseClient
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('product_id', product.id)
                .single();

              if (existingItem) {
                // Update quantity
                await supabaseClient
                  .from('cart_items')
                  .update({ quantity: existingItem.quantity + quantity })
                  .eq('id', existingItem.id);
              } else {
                // Insert new item
                await supabaseClient.from('cart_items').insert({
                  user_id: user.id,
                  product_id: product.id,
                  quantity,
                });
              }
            }
          } catch (error) {
            console.error('Error syncing cart with Supabase:', error);
            // Don't throw - local cart is already updated
          }
        }
      },
    }),
    {
      name: 'ticktee-cart-storage',
      version: 1,
    }
  )
);

