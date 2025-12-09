'use client';

/**
 * Payment verification modal
 * Allows admin to review payment details and verify/reject payment
 */

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/utils/formatters';
import { Order } from '@/types/database.types';

export interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order & { customer_name?: string; customer_email?: string };
  onVerify: (orderId: string, notes?: string) => Promise<void>;
  onReject: (orderId: string, reason: string) => Promise<void>;
}

export default function PaymentVerificationModal({
  isOpen,
  onClose,
  order,
  onVerify,
  onReject,
}: PaymentVerificationModalProps) {
  const [action, setAction] = useState<'verify' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = async () => {
    setIsProcessing(true);
    try {
      await onVerify(order.id, notes);
      setAction(null);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(order.id, reason);
      setAction(null);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'jazzcash':
        return 'JazzCash';
      case 'easypaisa':
        return 'EasyPaisa';
      default:
        return method || 'Unknown';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Verification"
      size="large"
    >
      <div className="space-y-6">
        {/* Order Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold">{order.id.substring(0, 8)}...</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="text-sm">{formatDate(order.created_at, { short: true })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="text-sm font-medium">{order.customer_name || order.customer_email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-primary">{formatPrice(order.total_amount)}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Payment Method</p>
          <Badge variant="info">{getPaymentMethodLabel(order.payment_method)}</Badge>
        </div>

        {/* Transaction ID */}
        {order.transaction_id && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{order.transaction_id}</p>
          </div>
        )}

        {/* Payment Proof */}
        {order.payment_proof_url && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {order.payment_proof_url.endsWith('.pdf') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-600">PDF Document</p>
                  <a
                    href={order.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                  >
                    <Download className="w-5 h-5 inline" />
                  </a>
                </div>
              ) : (
                <>
                  <Image
                    src={order.payment_proof_url}
                    alt="Payment proof"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  <a
                    href={order.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                    title="View full size"
                  >
                    <Eye className="w-5 h-5 text-primary" />
                  </a>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!action && (
          <div className="flex gap-4 pt-4 border-t">
            <Button
              variant="primary"
              onClick={() => setAction('verify')}
              leftIcon={<CheckCircle className="w-5 h-5" />}
              className="flex-1"
            >
              Verify Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => setAction('reject')}
              leftIcon={<XCircle className="w-5 h-5" />}
              className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
            >
              Reject Payment
            </Button>
          </div>
        )}

        {/* Verify Form */}
        {action === 'verify' && (
          <div className="space-y-4 pt-4 border-t">
            <Textarea
              label="Admin Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes about this payment verification..."
            />
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAction(null);
                  setNotes('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleVerify}
                isLoading={isProcessing}
                className="flex-1"
              >
                Confirm Verification
              </Button>
            </div>
          </div>
        )}

        {/* Reject Form */}
        {action === 'reject' && (
          <div className="space-y-4 pt-4 border-t">
            <Textarea
              label="Rejection Reason *"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Please provide a reason for rejecting this payment..."
              required
              error={!reason.trim() ? 'Reason is required' : undefined}
            />
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAction(null);
                  setReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                isLoading={isProcessing}
                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}




