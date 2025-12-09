/**
 * Admin Statistics Helper Functions
 * Fetches statistics for admin dashboard
 */

import { createServerClient } from './server';
import { Product, Order } from '@/types/database.types';

export interface AdminStatsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  lowStockProducts: Product[];
  recentOrders: (Order & {
    customer_name?: string | null;
    customer_email?: string | null;
  })[];
}

/**
 * Get comprehensive admin statistics
 * Fetches all statistics needed for the admin dashboard
 * 
 * @returns {Promise<{ stats: AdminStatsData | null; error?: string }>}
 */
export async function getAdminStats(): Promise<{ stats: AdminStatsData | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Get total products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) {
      console.error('Error fetching products count:', productsError);
    }

    // Get total orders count
    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (ordersError) {
      console.error('Error fetching orders count:', ordersError);
    }

    // Get total revenue (sum of all orders excluding cancelled)
    const { data: ordersData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount, status')
      .neq('status' as any, 'cancelled' as any);

    if (revenueError) {
      console.error('Error fetching revenue data:', revenueError);
    }

    const totalRevenue =
      ordersData?.reduce((sum, order) => sum + ((order as any).total_amount || 0), 0) || 0;

    // Get pending payments count
    const { count: pendingPaymentsCount, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status' as any, 'awaiting_payment' as any);

    if (pendingError) {
      console.error('Error fetching pending payments:', pendingError);
    }

    // Get low stock products (stock < 10)
    const { data: lowStockData, error: lowStockError } = await supabase
      .from('products')
      .select('*')
      .lt('stock' as any, 10)
      .order('stock' as any, { ascending: true })
      .limit(10);

    if (lowStockError) {
      console.error('Error fetching low stock products:', lowStockError);
    }

    // Get recent 5 orders with customer info
    const { data: recentOrdersData, error: recentOrdersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at' as any, { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      console.error('Error fetching recent orders:', recentOrdersError);
    }

    // Fetch customer information for recent orders
    const recentOrdersWithCustomers = await Promise.all(
      (recentOrdersData || []).map(async (order) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id' as any, (order as any).user_id)
          .single();

        return {
          ...(order as any),
          customer_name: (profileData as any)?.full_name || null,
          customer_email: (profileData as any)?.email || null,
        };
      })
    );

    return {
      stats: {
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        pendingPayments: pendingPaymentsCount || 0,
        lowStockProducts: (lowStockData as unknown as Product[]) || [],
        recentOrders: recentOrdersWithCustomers as any,
      },
    };
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return { stats: null, error: error.message || 'Failed to fetch admin stats' };
  }
}