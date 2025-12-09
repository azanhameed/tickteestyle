'use client';

/**
 * Reusable quantity selector component
 * Minus button, number input, plus button
 */

import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
  className = '',
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!max || value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      let clampedValue = Math.max(min, newValue);
      if (max) {
        clampedValue = Math.min(max, clampedValue);
      }
      onChange(clampedValue);
    }
  };

  const isMinDisabled = value <= min || disabled;
  const isMaxDisabled = (max !== undefined && value >= max) || disabled;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isMinDisabled}
        className={`p-2 border border-gray-300 rounded-lg transition-all ${
          isMinDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50 hover:border-primary active:scale-95'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 px-2 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={isMaxDisabled}
        className={`p-2 border border-gray-300 rounded-lg transition-all ${
          isMaxDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50 hover:border-primary active:scale-95'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}


