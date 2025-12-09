'use client';

/**
 * Reusable checkbox component
 * Custom styled checkbox with checkmark icon
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, fullWidth = false, className = '', disabled, ...props },
    ref
  ) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <label
          className={`
            inline-flex items-center cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'text-red-600' : ''}
            ${className}
          `}
        >
          {/* Hidden Native Checkbox */}
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          {/* Custom Checkbox */}
          <div
            className={`
              relative w-5 h-5 border-2 rounded transition-all duration-200
              flex items-center justify-center
              ${
                props.checked
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300'
              }
              ${
                error
                  ? 'border-red-500'
                  : !disabled && !props.checked
                  ? 'hover:border-primary'
                  : ''
              }
              ${
                !disabled
                  ? 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
                  : ''
              }
            `}
          >
            {props.checked && (
              <Check className="w-4 h-4 text-white animate-in fade-in zoom-in duration-200" />
            )}
          </div>

          {label && (
            <span className="ml-3 text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>

        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;




