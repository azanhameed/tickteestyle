/**
 * TypeScript types for Supabase database schema
 * Generated types for TickTee Style luxury watch e-commerce platform
 */

/**
 * Product table interface
 * Represents a luxury watch product in the catalog
 */
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string | null;
  image_url: string | null; // Kept for backward compatibility
  image_urls: string[] | null; // Array of image URLs for multiple images
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

/**
 * Profile table interface
 * User profile information
 */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Order status enum
 */
export type OrderStatus = 
  | 'pending'
  | 'awaiting_payment'
  | 'payment_verified'
  | 'payment_rejected'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

/**
 * Order table interface
 * Represents a customer order
 */
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_intent_id: string | null;
  payment_method: string | null;
  payment_proof_url: string | null;
  transaction_id: string | null;
  payment_verified: boolean;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * OrderItem table interface
 * Individual items within an order
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  created_at: string;
}

/**
 * CartItem table interface
 * Items in a user's shopping cart
 */
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * Database schema type
 * Main type for all database tables
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CartItem, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: OrderStatus;
    };
  };
}


