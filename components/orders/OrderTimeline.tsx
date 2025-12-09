'use client';

/**
 * Order timeline component
 * Visual progress indicator for order status
 */

import { CheckCircle, Circle, Clock, Package, Truck } from 'lucide-react';
import { OrderStatus } from '@/types/order.types';
import { formatDate } from '@/utils/formatters';

export interface OrderTimelineProps {
  currentStatus: OrderStatus;
  orderDate: string;
  estimatedDelivery?: string;
}

const stages: Array<{ status: OrderStatus; label: string; icon: React.ReactNode }> = [
  {
    status: 'pending',
    label: 'Order Placed',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    status: 'processing',
    label: 'Processing',
    icon: <Package className="w-5 h-5" />,
  },
  {
    status: 'shipped',
    label: 'Shipped',
    icon: <Truck className="w-5 h-5" />,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

const statusOrder: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderTimeline({
  currentStatus,
  orderDate,
  estimatedDelivery,
}: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">This order has been cancelled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-500"
            style={{ height: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {/* Timeline Stages */}
        <div className="space-y-8">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const stageIndex = statusOrder.indexOf(stage.status);

            return (
              <div key={stage.status} className="relative flex items-start space-x-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6">{stage.icon}</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-semibold ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-primary font-medium mt-1">In Progress</p>
                      )}
                      {isCompleted && !isCurrent && index === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(orderDate, { short: true })}
                        </p>
                      )}
                      {isCompleted && !isCurrent && index === stages.length - 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {estimatedDelivery
                            ? `Delivered on ${formatDate(estimatedDelivery, { short: true })}`
                            : 'Completed'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {estimatedDelivery && currentStatus !== 'delivered' && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Estimated Delivery:</span>{' '}
            {formatDate(estimatedDelivery)}
          </p>
        </div>
      )}
    </div>
  );
}


