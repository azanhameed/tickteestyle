'use client';

/**
 * Reusable empty state component
 * Used for empty cart, no orders, no products, etc.
 */

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionHref,
  actionOnClick,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

      {/* Message */}
      <p className="text-gray-600 mb-8 max-w-md">{message}</p>

      {/* Action Button */}
      {actionLabel && (actionHref || actionOnClick) && (
        <div>
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary" size="large">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="large" onClick={actionOnClick}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}




