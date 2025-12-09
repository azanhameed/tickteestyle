'use client';

/**
 * Mobile wallet payment form (JazzCash/EasyPaisa)
 * Displays wallet details and transaction ID input
 */

import { useState } from 'react';
import { Copy, Check, Smartphone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PaymentProofUpload from './PaymentProofUpload';
import Button from '@/components/ui/Button';
import { showSuccess } from '@/lib/toast';

export interface MobileWalletFormProps {
  walletType: 'jazzcash' | 'easypaisa';
  transactionId: string;
  onTransactionIdChange: (id: string) => void;
  paymentProofUrl: string | null;
  onPaymentProofChange: (url: string) => void;
  orderId?: string;
}

// Wallet details - Update these with your actual wallet numbers
const WALLET_DETAILS = {
  jazzcash: {
    number: '03150374729',
    name: 'JazzCash',
  },
  easypaisa: {
    number: '03150374729',
    name: 'EasyPaisa',
  },
};

export default function MobileWalletForm({
  walletType,
  transactionId,
  onTransactionIdChange,
  paymentProofUrl,
  onPaymentProofChange,
  orderId,
}: MobileWalletFormProps) {
  const [copied, setCopied] = useState(false);
  const wallet = WALLET_DETAILS[walletType];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallet.number);
      setCopied(true);
      showSuccess('Wallet number copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Details Card */}
      <Card padding="large" className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-3 mb-6">
          <Smartphone className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-900">{wallet.name} Details</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">{wallet.name} Number</p>
              <p className="text-2xl font-mono font-bold text-primary">{wallet.number}</p>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={copyToClipboard}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Open your {wallet.name} app or dial *786#</li>
          <li>Select "Send Money" or "Transfer"</li>
          <li>Enter the wallet number above: <strong>{wallet.number}</strong></li>
          <li>Enter the exact order amount</li>
          <li>Complete the transaction</li>
          <li>Enter the Transaction ID below</li>
          <li>Optionally upload a screenshot of the payment confirmation</li>
        </ol>
      </div>

      {/* Transaction ID Input */}
      <Input
        label="Transaction ID"
        value={transactionId}
        onChange={(e) => onTransactionIdChange(e.target.value)}
        placeholder="Enter your transaction ID from the payment confirmation"
        helperText="You can find this in your payment confirmation SMS or app notification"
        required
      />

      {/* Payment Proof Upload (Optional) */}
      <div>
        <PaymentProofUpload
          onUpload={onPaymentProofChange}
          existingUrl={paymentProofUrl}
          orderId={orderId}
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional: Upload a screenshot of your payment confirmation for faster verification
        </p>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Your order will remain in "Awaiting Payment" status until we verify your payment. 
          You will receive an email confirmation once your payment is verified (usually within 24 hours).
        </p>
      </div>
    </div>
  );
}




