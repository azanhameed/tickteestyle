'use client';

/**
 * Profile statistics component
 * Displays user stats in card format
 */

import { Package, DollarSign, Calendar } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';

export interface ProfileStatsProps {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

export default function ProfileStats({
  totalOrders,
  totalSpent,
  memberSince,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total Spent',
      value: formatPrice(totalSpent),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Member Since',
      value: formatDate(memberSince, { short: true }),
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}


