/**
 * Supabase cart helper functions
 * Handles cart synchronization with database for authenticated users
 */

import { createClient } from '@/lib/supabase/client';
import { CartItem } from '@/lib/store/cartStore';
import { Product } from '@/types/database.types';

/**
 * Sync entire cart to Supabase
 */
export async function syncCartToSupabase(
  userId: string,
  cartItems: CartItem[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Clear existing cart items
    await supabase.from('cart_items').delete().eq('user_id' as any, userId);

    // Insert all cart items
    if (cartItems.length > 0) {
      const itemsToInsert = cartItems.map((item) => ({
        user_id: userId,
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const { error } = await supabase.from('cart_items').insert(itemsToInsert as any);

      if (error) {
        console.error('Error syncing cart to Supabase:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error syncing cart to Supabase:', error);
    return { success: false, error: 'Failed to sync cart' };
  }
}

/**
 * Fetch cart from Supabase
 */
export async function fetchCartFromSupabase(
  userId: string
): Promise<{ items: CartItem[]; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id' as any, userId);

    if (error) {
      console.error('Error fetching cart from Supabase:', error);
      return { items: [], error: error.message };
    }

    const cartItems: CartItem[] =
      data?.map((item: any) => ({
        id: item.id,
        product: item.products as Product,
        quantity: item.quantity,
      })) || [];

    return { items: cartItems };
  } catch (error) {
    console.error('Error fetching cart from Supabase:', error);
    return { items: [], error: 'Failed to fetch cart' };
  }
}

/**
 * Add item to cart in Supabase
 */
export async function addToCartDB(
  userId: string,
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id' as any, userId)
      .eq('product_id' as any, productId)
      .single();

    if (existing) {
      // Update quantity
      const { error } = await (supabase
        .from('cart_items')
        .update as any)({ quantity: (existing as any).quantity + quantity })
        .eq('id' as any, (existing as any).id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Insert new item
      const { error } = await supabase.from('cart_items').insert({
        user_id: userId,
        product_id: productId,
        quantity,
      } as any);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to cart DB:', error);
    return { success: false, error: 'Failed to add to cart' };
  }
}

/**
 * Update cart item quantity in Supabase
 */
export async function updateCartItemDB(
  userId: string,
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    if (quantity <= 0) {
      // Remove item
      return await removeFromCartDB(userId, productId);
    }

    const { error } = await (supabase
      .from('cart_items')
      .update as any)({ quantity })
      .eq('user_id' as any, userId)
      .eq('product_id' as any, productId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating cart item DB:', error);
    return { success: false, error: 'Failed to update cart item' };
  }
}

/**
 * Remove item from cart in Supabase
 */
export async function removeFromCartDB(
  userId: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id' as any, userId)
      .eq('product_id' as any, productId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing from cart DB:', error);
    return { success: false, error: 'Failed to remove from cart' };
  }
}

/**
 * Clear entire cart in Supabase
 */
export async function clearCartDB(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id' as any, userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error clearing cart DB:', error);
    return { success: false, error: 'Failed to clear cart' };
  }
}