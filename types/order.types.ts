/**
 * Order and checkout type definitions
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

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  saveAddress: boolean;
  paymentMethod: 'cod' | 'bank_transfer' | 'jazzcash' | 'easypaisa';
}

export interface OrderData {
  userId: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentIntentId?: string | null;
  paymentProofUrl?: string | null;
  transactionId?: string | null;
  status?: OrderStatus;
}

export interface OrderItemData {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentProofUrl?: string | null;
  transactionId?: string | null;
  orderReference?: string | null;
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
    productName: string;
  }>;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}


