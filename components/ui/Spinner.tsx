'use client';

/**
 * Loading spinner component
 * Smooth rotation animation with various sizes
 */

import { Loader2 } from 'lucide-react';

export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8',
};

export default function Spinner({
  size = 'medium',
  color = 'text-primary',
  className = '',
}: SpinnerProps) {
  return (
    <Loader2
      className={`${sizeStyles[size]} ${color} animate-spin ${className}`}
      aria-label="Loading"
      role="status"
    />
  );
}




