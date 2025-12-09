'use client';

/**
 * Update Order Status Modal Component
 * Modal for updating order status with confirmation
 */

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { OrderStatus } from '@/types/database.types';

export interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  orderId: string;
  onUpdate: (newStatus: OrderStatus) => Promise<void>;
  loading?: boolean;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'awaiting_payment', label: 'Awaiting Payment' },
  { value: 'payment_verified', label: 'Payment Verified' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  currentStatus,
  orderId,
  onUpdate,
  loading = false,
}: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating && !loading) {
      setSelectedStatus(currentStatus);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Order Status"
      size="small"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Status
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
            {statusOptions.find((s) => s.value === currentStatus)?.label || currentStatus}
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            New Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isUpdating || loading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {selectedStatus !== currentStatus && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Are you sure you want to change the order status from{' '}
              <span className="font-semibold">
                {statusOptions.find((s) => s.value === currentStatus)?.label}
              </span>{' '}
              to{' '}
              <span className="font-semibold">
                {statusOptions.find((s) => s.value === selectedStatus)?.label}
              </span>
              ?
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating || loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            isLoading={isUpdating || loading}
            disabled={isUpdating || loading || selectedStatus === currentStatus}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}

