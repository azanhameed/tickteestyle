'use client';

/**
 * Toast notification helper functions
 * Custom styled toasts matching luxury brand
 */

import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#fff',
    color: '#1e3a8a',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Show success toast
 */
export function showSuccess(message: string) {
  return toast.success(message, {
    ...toastOptions,
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  });
}

/**
 * Show error toast
 */
export function showError(message: string) {
  return toast.error(message, {
    ...toastOptions,
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  });
}

/**
 * Show info toast
 */
export function showInfo(message: string) {
  return toast(message, {
    ...toastOptions,
    icon: <Info className="w-5 h-5 text-blue-500" />,
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  });
}

/**
 * Show warning toast
 */
export function showWarning(message: string) {
  return toast(message, {
    ...toastOptions,
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    iconTheme: {
      primary: '#f59e0b',
      secondary: '#fff',
    },
  });
}

/**
 * Show loading toast
 */
export function showLoading(message: string) {
  return toast.loading(message, {
    ...toastOptions,
  });
}

/**
 * Dismiss toast
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}




