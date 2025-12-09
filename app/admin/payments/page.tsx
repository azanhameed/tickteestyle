'use client';

/**
 * Payment Verification Page
 * View and verify orders awaiting payment
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { OrderWithCustomer } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/utils/formatters';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import PaymentProofModal from '@/components/admin/PaymentProofModal';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function PaymentsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
      fetchPendingPayments();
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    // Apply search filter
    let filtered = [...orders];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.transaction_id?.toLowerCase().includes(query) ||
          order.customer_name?.toLowerCase().includes(query)
      );
    }

    // Sort by date (oldest first)
    filtered.sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return aDate - bDate;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  const fetchPendingPayments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pending-payments');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pending payments');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      console.error('Error fetching pending payments:', err);
      toast.error(err.message || 'Failed to load pending payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (adminNotes?: string) => {
    if (!selectedOrder) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          verified: true,
          adminNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      toast.success('Payment verified successfully');
      setPaymentModalOpen(false);
      setSelectedOrder(null);
      fetchPendingPayments(); // Refresh list
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      toast.error(err.message || 'Failed to verify payment');
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedOrder) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          verified: false,
          rejectionReason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject payment');
      }

      toast.success('Payment rejected');
      setPaymentModalOpen(false);
      setSelectedOrder(null);
      fetchPendingPayments(); // Refresh list
    } catch (err: any) {
      console.error('Error rejecting payment:', err);
      toast.error(err.message || 'Failed to reject payment');
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewDetails = (order: OrderWithCustomer) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleVerifyClick = (order: OrderWithCustomer) => {
    if (!order.payment_proof_url) {
      toast.error('No payment proof available');
      return;
    }
    setSelectedOrder(order);
    setPaymentModalOpen(true);
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

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled in useEffect
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Payment Verification
          </h1>
          <p className="text-gray-600">
            Orders awaiting payment verification
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} pending
            verification
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID or Transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No payments pending verification ✓
            </h3>
            <p className="text-gray-600">
              All payments have been verified. Great job!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
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
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900">
                            {formatOrderId(order.id)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer_name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatPaymentMethod(order.payment_method)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">
                            {order.transaction_id || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary">
                            {formatPrice(order.total_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(order.created_at, { short: true })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleViewDetails(order)}
                            >
                              View Details
                            </Button>
                            {order.payment_proof_url && (
                              <Button
                                variant="primary"
                                size="small"
                                onClick={() => handleVerifyClick(order)}
                                leftIcon={<CreditCard className="w-4 h-4" />}
                              >
                                Verify
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold font-mono text-gray-900">
                        {formatOrderId(order.id)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.customer_name || 'N/A'}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment:</span>
                      <span className="text-gray-700">
                        {formatPaymentMethod(order.payment_method)}
                      </span>
                    </div>
                    {order.transaction_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="font-mono text-gray-900 text-xs">
                          {order.transaction_id}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-700">
                        {formatDate(order.created_at, { short: true })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleViewDetails(order)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {order.payment_proof_url && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleVerifyClick(order)}
                        leftIcon={<CreditCard className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Proof Modal */}
        {selectedOrder && selectedOrder.payment_proof_url && (
          <PaymentProofModal
            isOpen={paymentModalOpen}
            onClose={() => {
              setPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            imageUrl={selectedOrder.payment_proof_url}
            order={selectedOrder}
            onVerify={handleVerify}
            onReject={handleReject}
            loading={isVerifying}
          />
        )}
      </div>
    </div>
  );
}

