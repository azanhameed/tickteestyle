/**
 * Error Logging Utility
 * Central error tracking and reporting
 */

interface ErrorLogEntry {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  userAgent?: string;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an error
   */
  logError(error: Error | string, context?: Record<string, any>): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;

    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorMessage,
      stack,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.addLog(entry);
    
    // Console log in development
    if (this.isDevelopment) {
      console.error('🔴 Error:', errorMessage, context);
      if (stack) console.error(stack);
    }

    // Send to external service in production (future: Sentry, LogRocket)
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: Record<string, any>): void {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addLog(entry);

    if (this.isDevelopment) {
      console.warn('🟡 Warning:', message, context);
    }
  }

  /**
   * Log info message
   */
  logInfo(message: string, context?: Record<string, any>): void {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };

    this.addLog(entry);

    if (this.isDevelopment) {
      console.info('🔵 Info:', message, context);
    }
  }

  /**
   * Add log entry to store
   */
  private addLog(entry: ErrorLogEntry): void {
    this.logs.push(entry);
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      try {
        const storedLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
        storedLogs.push(entry);
        
        // Keep last 50 logs in localStorage
        if (storedLogs.length > 50) {
          storedLogs.shift();
        }
        
        localStorage.setItem('error_logs', JSON.stringify(storedLogs));
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Send error to external monitoring service
   */
  private sendToExternalService(entry: ErrorLogEntry): void {
    // Future integration: Sentry, LogRocket, Datadog, etc.
    // Example:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(new Error(entry.message), {
    //     contexts: { custom: entry.context },
    //   });
    // }

    // For now, send to custom API endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Ignore errors in error logging
      });
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('error_logs');
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

/**
 * React hook for error logging
 */
export function useErrorLogger() {
  return {
    logError: (error: Error | string, context?: Record<string, any>) =>
      errorLogger.logError(error, context),
    logWarning: (message: string, context?: Record<string, any>) =>
      errorLogger.logWarning(message, context),
    logInfo: (message: string, context?: Record<string, any>) =>
      errorLogger.logInfo(message, context),
  };
}

/**
 * Global error handlers for window errors
 */
if (typeof window !== 'undefined') {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    errorLogger.logError(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(`Unhandled Promise Rejection: ${event.reason}`, {
      promise: event.promise,
    });
  });

  // Expose to window for ErrorBoundary
  (window as any).errorLogger = errorLogger;
}

export default errorLogger;
