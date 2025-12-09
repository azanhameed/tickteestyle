'use client';

/**
 * Admin Dashboard Page
 * Main dashboard with statistics and overview
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Plus,
  Eye,
  ShoppingBag,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/utils/formatters';
import StatCard from '@/components/admin/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
  recentOrders: Array<{
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    customer_name?: string | null;
    customer_email?: string | null;
  }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading, user } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
      fetchStats();
    }
  }, [isAdmin, adminLoading, router]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      setStats(data.stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect handled in useEffect, but show loading just in case
  if (!isAdmin) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_payment':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xl text-gray-600">Welcome back, Admin</p>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts ?? 0}
            icon={Package}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingCart}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Total Revenue"
            value={stats ? formatPrice(stats.totalRevenue) : 'Rs. 0'}
            icon={DollarSign}
            color="purple"
            loading={statsLoading}
          />
          <StatCard
            title="Pending Verifications"
            value={stats?.pendingPayments ?? 0}
            icon={Clock}
            color="orange"
            loading={statsLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/products/add">
              <Button
                variant="primary"
                className="w-full justify-center"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button
                variant="outline"
                className="w-full justify-center"
                leftIcon={<Eye className="w-5 h-5" />}
              >
                View All Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button
                variant="outline"
                className="w-full justify-center"
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/payments">
              <Button
                variant="outline"
                className="w-full justify-center"
                leftIcon={<CreditCard className="w-5 h-5" />}
              >
                Verify Payments
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : stats && stats.recentOrders.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          <th className="pb-3 pr-4">Order ID</th>
                          <th className="pb-3 pr-4">Customer</th>
                          <th className="pb-3 pr-4">Amount</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 pr-4 text-sm font-mono text-gray-900">
                              {order.id.substring(0, 8)}...
                            </td>
                            <td className="py-3 pr-4 text-sm text-gray-700">
                              {order.customer_name || order.customer_email || 'N/A'}
                            </td>
                            <td className="py-3 pr-4 text-sm font-semibold text-primary">
                              {formatPrice(order.total_amount)}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                  order.status
                                )}`}
                              >
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-500">
                              {formatDate(order.created_at, { short: true })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-500">
                            {order.id.substring(0, 8)}...
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name || order.customer_email || 'N/A'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            {formatPrice(order.total_amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.created_at, { short: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">No recent orders</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Low Stock Products</h2>
            </div>
            <div className="p-6">
              {statsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : stats && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Stock: <span className="font-semibold text-orange-600">{product.stock}</span>
                        </p>
                      </div>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="small">
                          Restock
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">All products well stocked ✓</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

