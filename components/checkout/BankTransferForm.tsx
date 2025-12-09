'use client';

/**
 * Bank transfer payment form
 * Displays bank details and payment proof upload
 */

import { useState } from 'react';
import { Copy, Check, Building2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PaymentProofUpload from './PaymentProofUpload';
import Button from '@/components/ui/Button';
import { showSuccess } from '@/lib/toast';

export interface BankTransferFormProps {
  paymentProofUrl: string | null;
  onPaymentProofChange: (url: string) => void;
  orderReference: string;
  onOrderReferenceChange: (ref: string) => void;
  orderId?: string;
}

// Bank details - Update these with your actual bank information
const BANK_DETAILS = {
  bankName: 'HBL',
  accountTitle: 'TickTee Style',
  accountNumber: '1234567890',
  iban: 'PK12HABB1234567890',
  branch: 'Main Branch',
};

export default function BankTransferForm({
  paymentProofUrl,
  onPaymentProofChange,
  orderReference,
  onOrderReferenceChange,
  orderId,
}: BankTransferFormProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showSuccess('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bank Details Card */}
      <Card padding="large" className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-900">Bank Account Details</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
              <p className="font-semibold text-gray-900">{BANK_DETAILS.bankName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Account Title</p>
              <p className="font-semibold text-gray-900">{BANK_DETAILS.accountTitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <p className="font-mono font-semibold text-gray-900">{BANK_DETAILS.accountNumber}</p>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}
              leftIcon={copiedField === 'account' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copiedField === 'account' ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">IBAN</p>
              <p className="font-mono font-semibold text-gray-900">{BANK_DETAILS.iban}</p>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => copyToClipboard(BANK_DETAILS.iban, 'iban')}
              leftIcon={copiedField === 'iban' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copiedField === 'iban' ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Branch</p>
              <p className="font-semibold text-gray-900">{BANK_DETAILS.branch}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Transfer the exact order amount to the bank account above</li>
          <li>Use your order reference number in the transfer description</li>
          <li>Upload a screenshot or photo of the payment confirmation</li>
          <li>Your order will be processed after payment verification (usually within 24 hours)</li>
        </ol>
      </div>

      {/* Order Reference */}
      <Input
        label="Order Reference Number"
        value={orderReference}
        onChange={(e) => onOrderReferenceChange(e.target.value)}
        placeholder="Enter reference number from your bank transfer"
        helperText="Include this reference number in your bank transfer description"
        required
      />

      {/* Payment Proof Upload */}
      <PaymentProofUpload
        onUpload={onPaymentProofChange}
        existingUrl={paymentProofUrl}
        orderId={orderId}
      />

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Your order will remain in "Awaiting Payment" status until we verify your payment. 
          You will receive an email confirmation once your payment is verified.
        </p>
      </div>
    </div>
  );
}




