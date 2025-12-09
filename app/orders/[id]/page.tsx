'use client';

/**
 * Order detail page
 * Displays complete order information
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Watch } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderItem } from '@/types/database.types';
import { ShippingAddress } from '@/types/order.types';
import { formatPrice } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderTimeline from '@/components/orders/OrderTimeline';
import Button from '@/components/ui/Button';

interface OrderItemWithProduct extends OrderItem {
  product?: {
    id: string;
    name: string;
    brand: string;
    image_url: string | null;
  } | null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Check authentication
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login?redirect=/orders/' + orderId);
          return;
        }

        // Fetch order details
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          if (response.status === 404) {
            setError('Order not found');
          } else if (response.status === 401) {
            setError('Unauthorized access');
          } else {
            setError(result.error || 'Failed to load order');
          }
          return;
        }

        setOrder(result.order);
        setItems(result.items || []);
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Order not found' ? 'Order Not Found' : 'Error Loading Order'}
            </h2>
            <p className="text-gray-600 mb-8">{error || 'Order not found'}</p>
            <div className="space-x-4">
              <Link href="/orders">
                <Button variant="primary">Back to Orders</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parse shipping address
  let shippingAddress: ShippingAddress | null = null;
  try {
    shippingAddress =
      typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;
  } catch (e) {
    console.error('Error parsing shipping address:', e);
  }

  // Calculate order totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = order.total_amount - subtotal - tax;
  const total = order.total_amount;

  // Format order ID
  const shortOrderId = `#ORD-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <h2 className="text-2xl font-bold text-gray-900">{shortOrderId}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status as any} />
              </div>
            </div>

            {/* Order Timeline */}
            <OrderTimeline
              currentStatus={order.status}
              orderDate={order.created_at}
            />

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>
              <div className="space-y-4">
                {items.map((item) => {
                  // Get first image from image_urls array, fallback to image_url for backward compatibility
                  const primaryImage = (item.product as any)?.image_urls && (item.product as any).image_urls.length > 0
                    ? (item.product as any).image_urls[0]
                    : item.product?.image_url || null;
                  const imageUrl = primaryImage || '/placeholder-watch.jpg';
                  const subtotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        {imageUrl && imageUrl.startsWith('http') ? (
                          <Image
                            src={imageUrl}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Watch className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.product_name}</h4>
                        {item.product?.brand && (
                          <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(subtotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {order.payment_method === 'cod'
                      ? 'Cash on Delivery'
                      : order.payment_method === 'bank_transfer'
                      ? 'Bank Transfer'
                      : order.payment_method === 'jazzcash'
                      ? 'JazzCash'
                      : order.payment_method === 'easypaisa'
                      ? 'EasyPaisa'
                      : order.payment_method || 'N/A'}
                  </span>
                </div>
                {order.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm text-gray-900">{order.transaction_id}</span>
                  </div>
                )}
                {order.payment_verified && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>✓ Payment Verified</strong> - Your payment has been verified and your order is being processed.
                    </p>
                  </div>
                )}
                {order.status === 'awaiting_payment' && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Payment Pending Verification</strong> - Your payment is being verified. 
                      You will receive an email confirmation once verified (usually within 24 hours).
                    </p>
                    <Link href="/payment-instructions" className="mt-2 inline-block text-sm text-primary hover:underline">
                      View Payment Instructions →
                    </Link>
                  </div>
                )}
                {order.status === 'payment_rejected' && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Payment Rejected</strong> - We were unable to verify your payment. 
                      Please contact support for assistance.
                    </p>
                    <a
                      href="mailto:support@tickteestyle.com"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Contact Support →
                    </a>
                  </div>
                )}
                {order.payment_proof_url && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Proof</p>
                    <a
                      href={order.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Payment Proof →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {shippingAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.streetAddress}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  {shippingAddress.phone && (
                    <p className="mt-2 text-sm text-gray-600">Phone: {shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Payment Information</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Method:</span>{' '}
                    {order.payment_method === 'cod'
                      ? 'Cash on Delivery'
                      : order.payment_method === 'bank_transfer'
                      ? 'Bank Transfer'
                      : order.payment_method === 'jazzcash'
                      ? 'JazzCash'
                      : order.payment_method === 'easypaisa'
                      ? 'EasyPaisa'
                      : order.payment_method || 'N/A'}
                  </p>
                  {order.transaction_id && (
                    <p>
                      <span className="font-medium">Transaction ID:</span>{' '}
                      <span className="font-mono">{order.transaction_id}</span>
                    </p>
                  )}
                  {order.payment_verified && (
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className="text-green-600 font-semibold">Verified</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full" disabled>
                  Track Order (Coming Soon)
                </Button>
                <Link href="/shop">
                  <Button variant="primary" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


