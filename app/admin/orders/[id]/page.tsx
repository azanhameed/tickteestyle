'use client';

/**
 * Order Details Page (Admin)
 * View and manage individual order details
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { OrderItem } from '@/types/database.types';
import { formatPrice, formatDate } from '@/utils/formatters';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import UpdateOrderStatusModal from '@/components/admin/UpdateOrderStatusModal';
import PaymentProofModal from '@/components/admin/PaymentProofModal';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'react-hot-toast';

interface OrderItemWithProduct extends OrderItem {
  product?: {
    id: string;
    brand: string;
    image_url: string | null;
    image_urls?: string[] | null;
  } | null;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderDetails {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_intent_id?: string | null;
  shipping_address: string | null;
  payment_method?: string | null;
  transaction_id?: string | null;
  payment_proof_url?: string | null;
  payment_verified?: boolean;
  created_at: string;
  updated_at?: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [items, setItems] = useState<OrderItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [paymentProofModalOpen, setPaymentProofModalOpen] = useState(false);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
      if (orderId) {
        fetchOrderDetails();
      }
    }
  }, [isAdmin, adminLoading, orderId, router]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Order not found');
          router.push('/admin/orders');
          return;
        }
        throw new Error(data.error || 'Failed to fetch order details');
      }

      setOrder(data.order);
      setItems(data.items || []);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      toast.error(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      toast.success('Order status updated successfully');
      fetchOrderDetails();
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleVerifyPayment = async (adminNotes?: string) => {
    try {
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          verified: true,
          adminNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      toast.success('Payment verified successfully');
      fetchOrderDetails();
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      toast.error(err.message || 'Failed to verify payment');
      throw err;
    }
  };

  const handleRejectPayment = async (reason: string) => {
    try {
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          verified: false,
          rejectionReason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject payment');
      }

      toast.success('Payment rejected');
      fetchOrderDetails();
    } catch (err: any) {
      console.error('Error rejecting payment:', err);
      toast.error(err.message || 'Failed to reject payment');
      throw err;
    }
  };

  const formatOrderId = (id: string): string => {
    return `#ORD-${id.substring(0, 8).toUpperCase()}`;
  };

  const formatPaymentMethod = (method: string | null): string => {
    if (!method) return 'N/A';
    const methods: Record<string, string> = {
      cod: 'Cash on Delivery',
      bank_transfer: 'Bank Transfer',
      jazzcash: 'JazzCash',
      easypaisa: 'EasyPaisa',
    };
    return methods[method] || method;
  };

  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">The order you are looking for does not exist.</p>
            <Link href="/admin/orders">
              <Button variant="primary">Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingAddress: ShippingAddress | null = order.shipping_address
    ? typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address
    : null;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Order Details', href: `/admin/orders/${orderId}` },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <Link href="/admin/orders">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              className="mb-4"
            >
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Order Details - {formatOrderId(order.id)}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">
                    {formatOrderId(order.id)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                  <OrderStatusBadge status={order.status as any} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPaymentMethod(order.payment_method || null)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Verified</p>
                  <div className="mt-1">
                    {order.payment_verified ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3 inline mr-1" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer_email || 'N/A'}
                  </p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer_phone}</p>
                  </div>
                )}
                {shippingAddress && (
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {shippingAddress.fullName}
                      <br />
                      {shippingAddress.streetAddress}
                      <br />
                      {shippingAddress.city}, {shippingAddress.postalCode}
                      <br />
                      {shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                              {(() => {
                                const primaryImage = item.product?.image_urls && item.product.image_urls.length > 0
                                  ? item.product.image_urls[0]
                                  : item.product?.image_url || null;
                                return primaryImage ? (
                                  <Image
                                    src={primaryImage}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-gray-400">No Image</span>
                                  </div>
                                );
                              })()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.product_name}
                              </div>
                              {item.product?.brand && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.product.brand}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 text-right">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">Rs. 0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Rs. 0</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPaymentMethod(order.payment_method || null)}
                  </p>
                </div>
                {order.transaction_id && (
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-sm font-mono text-gray-900">{order.transaction_id}</p>
                  </div>
                )}
                {order.payment_proof_url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setPaymentProofModalOpen(true)}
                      leftIcon={<Eye className="w-4 h-4" />}
                      className="w-full"
                    >
                      View Payment Proof
                    </Button>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Payment Verified</p>
                  <div className="mt-1">
                    {order.payment_verified ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3 inline mr-1" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => setStatusModalOpen(true)}
                  className="w-full"
                  disabled={isUpdatingStatus}
                >
                  Update Order Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        <UpdateOrderStatusModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          currentStatus={order.status as any}
          orderId={order.id}
          onUpdate={handleStatusUpdate}
          loading={isUpdatingStatus}
        />

        {order.payment_proof_url && (
          <PaymentProofModal
            isOpen={paymentProofModalOpen}
            onClose={() => setPaymentProofModalOpen(false)}
            imageUrl={order.payment_proof_url}
            order={order as any}
            onVerify={handleVerifyPayment}
            onReject={handleRejectPayment}
            loading={isUpdatingStatus}
          />
        )}
      </div>
    </div>
  );
}