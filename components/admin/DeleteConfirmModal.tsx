'use client';

/**
 * Delete Confirmation Modal Component
 * Reusable modal for confirming destructive actions
 */

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading = false,
  title = 'Delete Item',
  message,
}: DeleteConfirmModalProps) {
  const defaultMessage = `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} title={title} size="small">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 mb-2">{message || defaultMessage}</p>
            <p className="text-sm text-gray-500">
              This action is permanent and cannot be reversed.
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={loading}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

