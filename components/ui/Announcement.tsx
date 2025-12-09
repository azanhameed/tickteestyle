/**
 * Accessible Error/Success Announcement Component
 * Uses ARIA live regions for screen reader announcements
 */

'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AnnouncementType = 'error' | 'success' | 'info';

interface AnnouncementProps {
  type: AnnouncementType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const styles = {
  error: 'bg-red-50 border-red-200 text-red-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

const iconColors = {
  error: 'text-red-500',
  success: 'text-green-500',
  info: 'text-blue-500',
};

export default function Announcement({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: AnnouncementProps) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`
        fixed top-20 right-4 z-50 max-w-md w-full
        border-l-4 rounded-lg shadow-lg p-4
        animate-slide-in-right
        ${styles[type]}
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[type]}`} aria-hidden="true" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Hook for managing announcements
 */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<AnnouncementProps | null>(null);

  const showError = (message: string) => {
    setAnnouncement({ type: 'error', message });
  };

  const showSuccess = (message: string) => {
    setAnnouncement({ type: 'success', message });
  };

  const showInfo = (message: string) => {
    setAnnouncement({ type: 'info', message });
  };

  const clear = () => {
    setAnnouncement(null);
  };

  return {
    announcement,
    showError,
    showSuccess,
    showInfo,
    clear,
  };
}
