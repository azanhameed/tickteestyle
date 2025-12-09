/**
 * Supabase order helper functions
 * Handles order creation, fetching, and updates
 */

import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';
import { OrderData, OrderItemData, OrderStatus } from '@/types/order.types';
import { Order, OrderItem } from '@/types/database.types';

/**
 * Create a new order
 */
export async function createOrder(
  userId: string,
  orderData: OrderData
): Promise<{ order: Order | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: orderData.totalAmount,
        status: orderData.status || 'pending',
        payment_intent_id: orderData.paymentIntentId || null,
        payment_method: orderData.paymentMethod || null,
        payment_proof_url: orderData.paymentProofUrl || null,
        transaction_id: orderData.transactionId || null,
        payment_verified: false,
        shipping_address: JSON.stringify(orderData.shippingAddress),
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return { order: null, error: error.message };
    }

    return { order: data as Order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { order: null, error: 'Failed to create order' };
  }
}

/**
 * Create order items for an order
 */
export async function createOrderItems(
  orderId: string,
  orderItems: OrderItemData[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const itemsToInsert = orderItems.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      product_name: item.productName,
    }));

    const { error } = await supabase.from('order_items').insert(itemsToInsert as any);

    if (error) {
      console.error('Error creating order items:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating order items:', error);
    return { success: false, error: 'Failed to create order items' };
  }
}

/**
 * Fetch all orders for a user with pagination
 */
export async function fetchUserOrders(
  userId: string,
  limit?: number,
  offset?: number
): Promise<{ orders: Order[]; error?: string }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('orders')
      .select('*')
      .eq('user_id' as any, userId)
      .order('created_at' as any, { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user orders:', error);
      return { orders: [], error: error.message };
    }

    return { orders: (data as unknown as Order[]) || [] };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { orders: [], error: 'Failed to fetch orders' };
  }
}

/**
 * Fetch order by ID
 */
export async function fetchOrderById(
  orderId: string
): Promise<{ order: Order | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id' as any, orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return { order: null, error: error.message };
    }

    return { order: data as Order };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { order: null, error: 'Failed to fetch order' };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await (supabase
      .from('orders')
      .update as any)({ status, updated_at: new Date().toISOString() })
      .eq('id' as any, orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

/**
 * Fetch order with items (with user verification)
 */
export async function fetchOrderWithItems(
  orderId: string,
  userId: string
): Promise<{ order: Order | null; items: OrderItem[]; error?: string }> {
  try {
    const supabase = createClient();

    // Fetch order and verify ownership
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id' as any, orderId)
      .eq('user_id' as any, userId)
      .single();

    if (orderError || !orderData) {
      return { order: null, items: [], error: orderError?.message || 'Order not found' };
    }

    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id' as any, orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return { order: orderData as Order, items: [], error: itemsError.message };
    }

    return {
      order: orderData as Order,
      items: (itemsData as unknown as OrderItem[]) || [],
    };
  } catch (error) {
    console.error('Error fetching order with items:', error);
    return { order: null, items: [], error: 'Failed to fetch order' };
  }
}

/**
 * Calculate order statistics for a user
 */
export async function calculateOrderStats(
  userId: string
): Promise<{
  totalOrders: number;
  totalSpent: number;
  recentOrders: Order[];
  error?: string;
}> {
  try {
    const supabase = createClient();

    // Fetch all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id' as any, userId)
      .order('created_at' as any, { ascending: false });

    if (error) {
      console.error('Error calculating order stats:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        recentOrders: [],
        error: error.message,
      };
    }

    const orderList = (orders as unknown as Order[]) || [];
    const totalOrders = orderList.length;
    const totalSpent = orderList.reduce((sum, order) => sum + order.total_amount, 0);
    const recentOrders = orderList.slice(0, 5);

    return {
      totalOrders,
      totalSpent,
      recentOrders,
    };
  } catch (error) {
    console.error('Error calculating order stats:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      recentOrders: [],
      error: 'Failed to calculate stats',
    };
  }
}