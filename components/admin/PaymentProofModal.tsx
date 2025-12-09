'use client';

/**
 * Payment Proof Modal Component
 * Displays payment proof image and allows verification/rejection
 */

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { OrderWithCustomer } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/utils/formatters';

export interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  order: OrderWithCustomer;
  onVerify: (adminNotes?: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  loading?: boolean;
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  imageUrl,
  order,
  onVerify,
  onReject,
  loading = false,
}: PaymentProofModalProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [imageZoom, setImageZoom] = useState(100);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await onVerify(adminNotes);
      setAdminNotes('');
      onClose();
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setIsRejecting(true);
    try {
      await onReject(rejectionReason);
      setRejectionReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleClose = () => {
    if (!isVerifying && !isRejecting && !loading) {
      setAdminNotes('');
      setRejectionReason('');
      setImageZoom(100);
      onClose();
    }
  };

  const formatOrderId = (id: string): string => {
    return `#ORD-${id.substring(0, 8).toUpperCase()}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Payment Proof Verification"
      size="large"
    >
      <div className="space-y-6">
        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Order ID:</span>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {formatOrderId(order.id)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Customer:</span>
            <span className="text-sm font-medium text-gray-900">
              {order.customer_name || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-semibold text-primary">
              {formatPrice(order.total_amount)}
            </span>
          </div>
          {order.transaction_id && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction ID:</span>
              <span className="text-sm font-mono text-gray-900">{order.transaction_id}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Order Date:</span>
            <span className="text-sm text-gray-900">
              {formatDate(order.created_at, { short: true })}
            </span>
          </div>
        </div>

        {/* Payment Proof Image */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Payment Proof</label>
            <div className="flex gap-2">
              <button
                onClick={() => setImageZoom(Math.max(50, imageZoom - 25))}
                className="p-1 text-gray-600 hover:text-gray-900"
                disabled={imageZoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 px-2">{imageZoom}%</span>
              <button
                onClick={() => setImageZoom(Math.min(200, imageZoom + 25))}
                className="p-1 text-gray-600 hover:text-gray-900"
                disabled={imageZoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200" style={{ height: '400px' }}>
            <div className="absolute inset-0 flex items-center justify-center overflow-auto">
              <Image
                src={imageUrl}
                alt="Payment proof"
                width={800}
                height={600}
                className="object-contain"
                style={{ width: `${imageZoom}%`, height: 'auto' }}
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes (Optional)
          </label>
          <textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Add any notes about this payment verification..."
            disabled={isVerifying || isRejecting || loading}
          />
        </div>


        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying || isRejecting || loading}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleVerify}
            isLoading={isVerifying || loading}
            disabled={isVerifying || isRejecting || loading}
            className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
            leftIcon={<CheckCircle className="w-5 h-5" />}
          >
            Verify Payment
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const reason = prompt('Please provide a reason for rejecting this payment:');
              if (reason) {
                onReject(reason);   // ✅ FIXED — use parent callback directly
              }
            }}
            isLoading={isRejecting || loading}
            disabled={isVerifying || isRejecting || loading}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            leftIcon={<XCircle className="w-5 h-5" />}
          >
            Reject Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
