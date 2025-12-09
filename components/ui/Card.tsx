'use client';

/**
 * Reusable card container component
 * Clean card design with optional header and footer
 */

import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'small' | 'medium' | 'large';
}

const paddingStyles = {
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8',
};

export default function Card({
  children,
  title,
  footer,
  className = '',
  hover = false,
  padding = 'medium',
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}




