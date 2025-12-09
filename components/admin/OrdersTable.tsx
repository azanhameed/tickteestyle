'use client';

/**
 * Admin Orders Table Component
 * Displays orders in a table with responsive design
 */

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, Loader2 } from 'lucide-react';
import { OrderWithCustomer } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/utils/formatters';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import Button from '@/components/ui/Button';

export interface OrdersTableProps {
  orders: OrderWithCustomer[];
  loading?: boolean;
  onViewOrder?: (orderId: string) => void;
}

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

export default function OrdersTable({
  orders,
  loading = false,
  onViewOrder,
}: OrdersTableProps) {
  const router = useRouter();

  const handleViewOrder = (orderId: string) => {
    if (onViewOrder) {
      onViewOrder(orderId);
    } else {
      router.push(`/admin/orders/${orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {formatOrderId(order.id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer_name || 'N/A'}
                    </div>
                    {order.customer_email && (
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.created_at, { short: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-primary">
                      {formatPrice(order.total_amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatPaymentMethod(order.payment_method)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order.id);
                      }}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewOrder(order.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-mono">
                  {formatOrderId(order.id)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(order.created_at, { short: true })}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium text-gray-900">
                  {order.customer_name || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment:</span>
                <span className="text-gray-700">
                  {formatPaymentMethod(order.payment_method)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOrder(order.id);
              }}
              leftIcon={<Eye className="w-4 h-4" />}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

