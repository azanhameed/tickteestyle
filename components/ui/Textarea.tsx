'use client';

/**
 * Reusable textarea component
 * Supports multiline text input with error states and auto-resize
 */

import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      autoResize = false,
      showCharCount = false,
      maxLength,
      className = '',
      disabled,
      rows = 4,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = (ref || textareaRef) as React.RefObject<HTMLTextAreaElement>;

    useEffect(() => {
      if (autoResize && combinedRef.current) {
        combinedRef.current.style.height = 'auto';
        combinedRef.current.style.height = `${combinedRef.current.scrollHeight}px`;
      }
    }, [value, autoResize, combinedRef]);

    const baseStyles =
      'px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none';
    
    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-primary focus:ring-primary';

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={combinedRef}
            className={`${baseStyles} ${stateStyles} ${className}`}
            disabled={disabled}
            rows={autoResize ? 1 : rows}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${props.id}-error`
                : helperText
                ? `${props.id}-helper`
                : showCharCount
                ? `${props.id}-count`
                : undefined
            }
            {...props}
          />

          {error && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div>
            {error && (
              <p id={`${props.id}-error`} className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {helperText && !error && (
              <p id={`${props.id}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {showCharCount && maxLength && (
            <p
              id={`${props.id}-count`}
              className={`text-xs ${
                currentLength >= maxLength ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;




