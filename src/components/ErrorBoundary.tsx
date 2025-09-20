'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: ((error: Error, errorInfo: ErrorInfo) => void) | undefined;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
  errorId: string;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging with context
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      retryCount: this.state.retryCount
    };

    console.error('ErrorBoundary caught an error:', errorDetails);
    
    // Store error info in state
    this.setState({
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Use setTimeout to avoid blocking the error handling
      setTimeout(() => {
        this.reportError(errorDetails).catch(err => {
          console.warn('Async error reporting failed:', err);
        });
      }, 0);
    }

    // Auto-retry mechanism for transient errors
    this.scheduleRetry();
  }

  override componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }

    // Reset when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        prevProps.resetKeys![index] !== key
      );
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  override componentWillUnmount() {
    // Cleanup timeouts
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = async (errorDetails: Record<string, unknown>) => {
    try {
      // Send to error reporting service with retry logic
      if (typeof window !== 'undefined' && 'fetch' in window) {
        const maxRetries = 3;
        let retryCount = 0;
        
        const sendError = async (): Promise<void> => {
          try {
            const response = await fetch('/api/errors', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(errorDetails),
              signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          } catch (fetchError) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Exponential backoff: 1s, 2s, 4s
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount - 1) * 1000));
              return sendError();
            }
            throw fetchError;
          }
        };
        
        await sendError();
      }
    } catch (reportingError) {
      console.warn('Error reporting failed after retries:', reportingError);
      
      // Fallback: Store in localStorage for later retry
      try {
        const storedErrors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
        storedErrors.push({ ...errorDetails, timestamp: Date.now() });
        // Keep only last 10 errors to prevent storage bloat
        localStorage.setItem('pendingErrors', JSON.stringify(storedErrors.slice(-10)));
      } catch (storageError) {
        console.warn('Failed to store error in localStorage:', storageError);
      }
    }
  };

  private scheduleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s
      const retryDelay = Math.pow(2, retryCount) * 1000;
      
      this.retryTimeoutId = window.setTimeout(() => {
        this.setState(prevState => ({
          retryCount: prevState.retryCount + 1
        }));
        
        this.resetErrorBoundary();
      }, retryDelay);
    }
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
      retryCount: 0
    });
  };

  handleReset = () => {
    this.resetErrorBoundary();
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Don&apos;t worry, this has been logged and we&apos;re working on it.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `async_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId,
      retryCount: 0
    };
  }

  override componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  override componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    this.setState({ 
      hasError: true, 
      error: new Error(`Unhandled promise rejection: ${event.reason}`) 
    });
  };

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorId: '',
      retryCount: 0
    });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundary onError={this.props.onError}>
          <div className="min-h-[200px] flex items-center justify-center p-4">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Error
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Failed to load this section. Please try again.
              </p>
              <Button 
                onClick={this.handleReset}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;