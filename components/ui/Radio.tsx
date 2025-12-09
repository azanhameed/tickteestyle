'use client';

/**
 * Reusable radio button component
 * Custom styled radio with selected state indicator
 */

import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
          {/* Hidden Native Radio */}
          <input
            ref={ref}
            type="radio"
            className="sr-only"
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          {/* Custom Radio */}
          <div
            className={`
              relative w-5 h-5 border-2 rounded-full transition-all duration-200
              flex items-center justify-center
              ${
                props.checked
                  ? 'border-primary'
                  : 'border-gray-300 bg-white'
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
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-in fade-in zoom-in duration-200" />
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

Radio.displayName = 'Radio';

export default Radio;




