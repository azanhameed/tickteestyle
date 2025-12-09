'use client';

/**
 * Order Status Badge Component
 * Displays order status with appropriate color coding
 */

import { OrderStatus } from '@/types/database.types';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  awaiting_payment: {
    label: 'Awaiting Payment',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  payment_verified: {
    label: 'Payment Verified',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  payment_rejected: {
    label: 'Payment Rejected',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  processing: {
    label: 'Processing',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
  },
  shipped: {
    label: 'Shipped',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800',
  },
  delivered: {
    label: 'Delivered',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  refunded: {
    label: 'Refunded',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
};

const sizeConfig = {
  small: 'px-2 py-0.5 text-xs',
  medium: 'px-2 py-1 text-xs',
  large: 'px-3 py-1.5 text-sm',
};

export default function OrderStatusBadge({ 
  status, 
  size = 'medium',
  className = '' 
}: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={`${sizeClass} font-semibold rounded-full ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
}