/**
 * Admin database helper functions
 * Handles admin operations: products, orders, statistics
 */

import { createServerClient } from './server';
import { Product, Order, OrderItem, OrderStatus } from '@/types/database.types';

export interface ProductFilters {
  category?: string;
  search?: string;
  sortBy?: 'price' | 'stock' | 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
  pendingPayments: number;
  revenueByPaymentMethod: {
    cod: number;
    bank_transfer: number;
    jazzcash: number;
    easypaisa: number;
  };
  ordersByPaymentMethod: {
    cod: number;
    bank_transfer: number;
    jazzcash: number;
    easypaisa: number;
  };
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_method?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all products with optional filters, search, sorting, and pagination
 */
export async function getAllProducts(
  filters?: ProductFilters
): Promise<{ products: Product[]; total: number; error?: string }> {
  try {
    const supabase = await createServerClient();

    let query = supabase.from('products').select('*', { count: 'exact' });

    // Apply search filter
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`
      );
    }

    // Apply category filter
    if (filters?.category) {
        query = query.eq('category' as any, filters.category);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy as any, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0, error: error.message };
    }

    // Parse image_urls from JSONB for each product
    const products = (data as unknown as Product[] || []).map((product: any) => {
      if (product.image_urls) {
        try {
          product.image_urls = typeof product.image_urls === 'string' 
            ? JSON.parse(product.image_urls) 
            : product.image_urls;
        } catch (e) {
          // If parsing fails, it might already be an array or null
          console.warn('Could not parse image_urls for product:', product.id, e);
        }
      }
      return product;
    });

    return {
      products,
      total: count || 0,
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, error: error.message || 'Failed to fetch products' };
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(
  productId: string
): Promise<{ product: Product | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id' as any, productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return { product: null, error: error.message };
    }

    // Parse image_urls from JSONB if it exists
    if (data && (data as any).image_urls) {
      try {
        (data as any).image_urls = typeof (data as any).image_urls === 'string' 
          ? JSON.parse((data as any).image_urls) 
          : (data as any).image_urls;
      } catch (e) {
        // If parsing fails, it might already be an array
        console.warn('Could not parse image_urls:', e);
      }
    }

    return { product: data as unknown as Product };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return { product: null, error: error.message || 'Failed to fetch product' };
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<{ product: Product | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Prepare insert data - handle image_urls as JSONB array
    const insertData: any = {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Convert image_urls array to JSONB format for Supabase
    if (insertData.image_urls && Array.isArray(insertData.image_urls)) {
      insertData.image_urls = JSON.stringify(insertData.image_urls);
    }

    const { data, error } = await supabase
      .from('products')
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      // Check if it's a column not found error
      if (error.message?.includes('image_urls') || error.message?.includes('column')) {
        return {
          product: null,
          error: 'Database migration required: Please run the migration SQL to add the image_urls column. See database_migrations/multiple_images.sql',
        };
      }
      return { product: null, error: error.message };
    }

    // Parse image_urls back from JSONB if it exists
    if (data && (data as any).image_urls) {
      try {
        (data as any).image_urls = typeof (data as any).image_urls === 'string' 
          ? JSON.parse((data as any).image_urls) 
          : (data as any).image_urls;
      } catch (e) {
        // If parsing fails, it might already be an array
        console.warn('Could not parse image_urls:', e);
      }
    }

    return { product: data as unknown as Product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { product: null, error: error.message || 'Failed to create product' };
  }
}

/**
 * Update a product
 */
export async function updateProduct(
  productId: string,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ product: Product | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Prepare update data - handle image_urls as JSONB array
    const updateData: any = {
      ...productData,
      updated_at: new Date().toISOString(),
    };

    // Convert image_urls array to JSONB format for Supabase
    if (updateData.image_urls && Array.isArray(updateData.image_urls)) {
      updateData.image_urls = JSON.stringify(updateData.image_urls);
    }

    const { data, error } = await (supabase
      .from('products')
      .update as any)(updateData)
      .eq('id' as any, productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      // Check if it's a column not found error
      if (error.message?.includes('image_urls') || error.message?.includes('column')) {
        return {
          product: null,
          error: 'Database migration required: Please run the migration SQL to add the image_urls column. See database_migrations/multiple_images.sql',
        };
      }
      return { product: null, error: error.message };
    }

    // Parse image_urls back from JSONB if it exists
    if (data && (data as any).image_urls) {
      try {
        (data as any).image_urls = typeof (data as any).image_urls === 'string' 
          ? JSON.parse((data as any).image_urls) 
          : (data as any).image_urls;
      } catch (e) {
        // If parsing fails, it might already be an array
        console.warn('Could not parse image_urls:', e);
      }
    }

    return { product: data as unknown as Product };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { product: null, error: error.message || 'Failed to update product' };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('products').delete().eq('id' as any, productId);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats(): Promise<{ stats: AdminStats | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Get total products
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get total orders
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get total revenue (sum of all delivered orders)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('total_amount')
      .in('status' as any, ['delivered', 'shipped', 'processing']);

    const totalRevenue =
      ordersData?.reduce((sum, order) => sum + ((order as any).total_amount || 0), 0) || 0;

    // Get low stock products (stock < 5)
    const { data: lowStockData } = await supabase
      .from('products')
      .select('*')
      .lt('stock' as any, 5)
      .order('stock' as any, { ascending: true });

    // Get recent orders (last 10)
    const { data: recentOrdersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at' as any, { ascending: false })
      .limit(10);

    // Get pending payments count
    const { count: pendingPaymentsCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status' as any, 'awaiting_payment');

    // Get revenue by payment method
    const { data: allOrdersData } = await supabase
      .from('orders')
      .select('payment_method, total_amount, status')
      .in('status' as any, ['delivered', 'shipped', 'processing', 'payment_verified']);

    const revenueByPaymentMethod = {
      cod: 0,
      bank_transfer: 0,
      jazzcash: 0,
      easypaisa: 0,
    };

    const ordersByPaymentMethod = {
      cod: 0,
      bank_transfer: 0,
      jazzcash: 0,
      easypaisa: 0,
    };

    if (allOrdersData) {
      allOrdersData.forEach((order: any) => {
        const method = order.payment_method || 'cod';
        if (method in revenueByPaymentMethod) {
          revenueByPaymentMethod[method as keyof typeof revenueByPaymentMethod] += order.total_amount || 0;
        }
      });
    }

    // Get order counts by payment method
    const { data: ordersByMethod } = await supabase
      .from('orders')
      .select('payment_method');

    if (ordersByMethod) {
      ordersByMethod.forEach((order: any) => {
        const method = order.payment_method || 'cod';
        if (method in ordersByPaymentMethod) {
          ordersByPaymentMethod[method as keyof typeof ordersByPaymentMethod]++;
        }
      });
    }

    return {
      stats: {
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        lowStockProducts: (lowStockData as unknown as Product[]) || [],
        recentOrders: (recentOrdersData as unknown as Order[]) || [],
        pendingPayments: pendingPaymentsCount || 0,
        revenueByPaymentMethod,
        ordersByPaymentMethod,
      },
    };
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return { stats: null, error: error.message || 'Failed to fetch admin stats' };
  }
}

/**
 * Extended Order type with customer information
 */
export interface OrderWithCustomer extends Order {
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

/**
 * Get all orders with optional filters
 */
export async function getAllOrders(
  filters?: OrderFilters
): Promise<{ orders: OrderWithCustomer[]; total: number; error?: string }> {
  try {
    const supabase = await createServerClient();

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at' as any, { ascending: false });

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status' as any, filters.status);
    }

    // Apply payment method filter
    if (filters?.payment_method) {
      query = query.eq('payment_method' as any, filters.payment_method);
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return { orders: [], total: 0, error: error.message };
    }

    let orders = (data as unknown as Order[]) || [];

    // Apply search filter if provided
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      orders = orders.filter((order) => {
        // Search will be applied after fetching customer data
        return true;
      });
    }

    // Fetch customer information for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email, full_name, phone')
          .eq('id' as any, (order as any).user_id)
          .single();

        const orderWithCustomer = {
          ...order,
          customer_name: (profileData as any)?.full_name || null,
          customer_email: (profileData as any)?.email || null,
          customer_phone: (profileData as any)?.phone || null,
        } as OrderWithCustomer;

        // Apply search filter on customer data
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch =
            (order as any).id.toLowerCase().includes(searchLower) ||
            orderWithCustomer.customer_name?.toLowerCase().includes(searchLower) ||
            orderWithCustomer.customer_email?.toLowerCase().includes(searchLower) ||
            (order as any).transaction_id?.toLowerCase().includes(searchLower);
          return matchesSearch ? orderWithCustomer : null;
        }

        return orderWithCustomer;
      })
    );

    // Filter out null results from search
    const filteredOrders = ordersWithCustomers.filter(
      (order) => order !== null
    ) as OrderWithCustomer[];

    return {
      orders: filteredOrders,
      total: count || 0,
    };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { orders: [], total: 0, error: error.message || 'Failed to fetch orders' };
  }
}

/**
 * Get order with items and user profile
 */
export async function getOrderWithDetails(
  orderId: string
): Promise<{
  order: OrderWithCustomer | null;
  items: OrderItem[];
  error?: string;
}> {
  try {
    const supabase = await createServerClient();

    // Get order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id' as any, orderId)
      .single();

    if (orderError || !orderData) {
      return {
        order: null,
        items: [],
        error: orderError?.message || 'Order not found',
      };
    }

    // Get order items with product information
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id' as any, orderId);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    // Fetch product details for each item (image_url, brand)
    const itemsWithProducts = await Promise.all(
      (itemsData || []).map(async (item) => {
        const { data: product } = await supabase
          .from('products')
          .select('id, brand, image_url')
          .eq('id' as any, (item as any).product_id)
          .single();

        return {
          ...(item as any),
          product: product || null,
        };
      })
    );

    // Get user profile from profiles table
    const { data: profileData } = await supabase
      .from('profiles')
      .select('email, full_name, phone')
      .eq('id' as any, (orderData as any).user_id)
      .single();

    const orderWithCustomer: OrderWithCustomer = {
      ...(orderData as unknown as Order),
      customer_name: (profileData as any)?.full_name || null,
      customer_email: (profileData as any)?.email || null,
      customer_phone: (profileData as any)?.phone || null,
    };

    return {
      order: orderWithCustomer,
      items: (itemsWithProducts as unknown as OrderItem[]) || [],
    };
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return {
      order: null,
      items: [],
      error: error.message || 'Failed to fetch order details',
    };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    const { error } = await (supabase
      .from('orders')
      .update as any)({ status, updated_at: new Date().toISOString() })
      .eq('id' as any, orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}

/**
 * Get orders awaiting payment verification
 */
export async function getOrdersAwaitingPayment(): Promise<{
  orders: OrderWithCustomer[];
  error?: string;
}> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status' as any, 'awaiting_payment')
      .order('created_at' as any, { ascending: true });

    if (error) {
      console.error('Error fetching pending payments:', error);
      return { orders: [], error: error.message };
    }

    const orders = (data as unknown as Order[]) || [];

    // Fetch customer information for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id' as any, (order as any).user_id)
          .single();

        return {
          ...order,
          customer_name: (profileData as any)?.full_name || null,
          customer_email: (profileData as any)?.email || null,
        } as OrderWithCustomer;
      })
    );

    return {
      orders: ordersWithCustomers,
    };
  } catch (error: any) {
    console.error('Error fetching pending payments:', error);
    return { orders: [], error: error.message || 'Failed to fetch pending payments' };
  }
}