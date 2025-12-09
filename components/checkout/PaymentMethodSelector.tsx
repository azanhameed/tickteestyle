'use client';

import { Banknote, Smartphone } from 'lucide-react';
import Radio from '@/components/ui/Radio';
import Card from '@/components/ui/Card';

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa';

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
  fee?: number;
  feeLabel?: string;
}

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    value: 'cod',
    label: 'Cash on Delivery (COD)',
    description: 'Pay when you receive your order',
    icon: <Banknote className="w-6 h-6" />,
    fee: 200,
    feeLabel: 'COD Fee',
  },
  {
    value: 'jazzcash',
    label: 'JazzCash',
    description: 'Pay via JazzCash mobile wallet',
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    value: 'easypaisa',
    label: 'EasyPaisa',
    description: 'Pay via EasyPaisa mobile wallet',
    icon: <Smartphone className="w-6 h-6" />,
  },
];

export default function PaymentMethodSelector({
  selectedMethod,
  onChange,
  className = '',
}: PaymentMethodSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {paymentMethods.map((method) => (
        <label
          key={method.value}
          className={`block cursor-pointer ${selectedMethod === method.value ? 'ring-2 ring-primary' : ''}`}
        >
          <Card
            hover
            padding="medium"
            className={`transition-all duration-200 ${selectedMethod === method.value ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
          >
            <div className="flex items-start space-x-4">
              <Radio
                name="paymentMethod"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={(e) => onChange(e.target.value as PaymentMethod)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-primary">{method.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{method.label}</span>
                      {method.fee && (
                        <span className="text-sm font-medium text-primary">
                          +{method.feeLabel}: Rs. {method.fee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-9">{method.description}</p>
              </div>
            </div>
          </Card>
        </label>
      ))}
    </div>
  );
}
