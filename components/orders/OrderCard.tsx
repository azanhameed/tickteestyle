'use client';

/**
 * Order card component
 * Displays order summary in list/grid view
 */

import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { Order } from '@/types/database.types';
import { formatPrice } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import OrderStatusBadge from './OrderStatusBadge';

export interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  // Parse shipping address to get item count (if available)
  let itemCount = 0;
  try {
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : order.shipping_address;
  } catch (e) {
    // Ignore parsing errors
  }

  // Format order ID (shortened)
  const shortOrderId = `#ORD-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-primary group"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                {shortOrderId}
              </h3>
            </div>
            <OrderStatusBadge status={order.status} size="small" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>Placed on {formatDate(order.created_at, { short: true })}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(order.total_amount)}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}


