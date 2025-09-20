'use client';

/**
 * Centralized error reporting utility
 * Handles error collection, batching, and retry logic
 */

interface ErrorReport {
  id: string;
  error: {
    name: string;
    message: string;
    stack: string | undefined;
  };
  context: {
    url: string;
    userAgent: string;
    timestamp: string;
    userId?: string;
    sessionId?: string;
  };
  metadata: Record<string, unknown> | undefined;
}

class ErrorReporter {
  private pendingErrors: ErrorReport[] = [];
  private batchSize = 5;
  private flushInterval = 30000; // 30 seconds
  private maxRetries = 3;
  private isOnline = true;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Monitor online status
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      // Flush errors periodically
      this.startFlushTimer();
      
      // Flush on page unload
      window.addEventListener('beforeunload', this.flushSync);
      
      // Load pending errors from localStorage
      this.loadPendingErrors();
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.flushErrors();
  };

  private handleOffline = () => {
    this.isOnline = false;
  };

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      this.flushErrors();
    }, this.flushInterval);
  }

  private loadPendingErrors() {
    try {
      const stored = localStorage.getItem('pendingErrorReports');
      if (stored) {
        this.pendingErrors = JSON.parse(stored);
        localStorage.removeItem('pendingErrorReports');
      }
    } catch (error) {
      console.warn('Failed to load pending errors:', error);
    }
  }

  private savePendingErrors() {
    try {
      if (this.pendingErrors.length > 0) {
        localStorage.setItem('pendingErrorReports', JSON.stringify(this.pendingErrors));
      }
    } catch (error) {
      console.warn('Failed to save pending errors:', error);
    }
  }

  public reportError(
    error: Error,
    context?: Partial<ErrorReport['context']>,
    metadata?: Record<string, unknown>
  ) {
    const errorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        ...context
      },
      metadata
    };

    this.pendingErrors.push(errorReport);

    // Auto-flush if batch size reached or critical error
    if (this.pendingErrors.length >= this.batchSize || this.isCriticalError(error)) {
      this.flushErrors();
    }
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /network/i,
      /security/i,
      /permission/i,
      /cors/i,
      /unauthorized/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    );
  }

  private async flushErrors() {
    if (!this.isOnline || this.pendingErrors.length === 0) {
      return;
    }

    const errorsToSend = [...this.pendingErrors];
    this.pendingErrors = [];

    try {
      await this.sendErrors(errorsToSend);
    } catch (error) {
      console.warn('Failed to send error batch:', error);
      // Re-add failed errors to pending list
      this.pendingErrors.unshift(...errorsToSend);
      this.savePendingErrors();
    }
  }

  private async sendErrors(errors: ErrorReport[], retryCount = 0): Promise<void> {
    try {
      const response = await fetch('/api/errors/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendErrors(errors, retryCount + 1);
      }
      throw error;
    }
  }

  private flushSync = () => {
    // Synchronous flush for page unload
    if (this.pendingErrors.length > 0) {
      this.savePendingErrors();
    }
  };

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('errorReportingSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorReportingSessionId', sessionId);
    }
    return sessionId;
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
      window.removeEventListener('beforeunload', this.flushSync);
    }
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    this.flushSync();
  }
}

// Singleton instance
const errorReporter = new ErrorReporter();

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    errorReporter.reportError(
      new Error(event.message),
      {
        url: event.filename || window.location.href
      },
      {
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript'
      }
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    errorReporter.reportError(error, undefined, {
      type: 'unhandled_promise_rejection'
    });
  });
}

export default errorReporter;
export type { ErrorReport };