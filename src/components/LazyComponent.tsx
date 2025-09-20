'use client';

import { lazy, Suspense, ComponentType, ReactNode, useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface LazyComponentProps {
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  className?: string | undefined;
}

// Default loading component
const DefaultLoader = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Default error fallback
const DefaultErrorFallback = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="text-center">
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
        <span className="text-red-600 text-sm">!</span>
      </div>
      <p className="text-sm text-gray-600">Failed to load component</p>
    </div>
  </div>
);

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: P) {
    const { 
      fallback = <DefaultLoader className={options.className ?? ''} />,
      errorFallback = <DefaultErrorFallback className={options.className ?? ''} />,
      className = ''
    } = options;

    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <div className={className}>
            <LazyComponent {...props} />
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Lazy section wrapper for page sections
export function LazySection({ 
  children, 
  fallback,
  errorFallback,
  className = '',
  minHeight = 'min-h-[200px]'
}: LazyComponentProps & { 
  children: ReactNode;
  minHeight?: string;
}) {
  return (
    <ErrorBoundary 
      fallback={errorFallback || <DefaultErrorFallback className={`${minHeight} ${className}`} />}
    >
      <Suspense 
        fallback={fallback || <DefaultLoader className={`${minHeight} ${className}`} />}
      >
        <div className={className}>
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

// Intersection Observer based lazy loading
export function LazyOnView({ 
  children, 
  fallback,
  className = '',
  rootMargin = '100px',
  threshold = 0.1
}: LazyComponentProps & { 
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isInView ? (
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      ) : (
        fallback || <DefaultLoader className={className} />
      )}
    </div>
  );
}

// Preload component for critical resources
export function PreloadComponent({ 
  importFunc,
  preloadDelay = 2000 
}: {
  importFunc: () => Promise<{ default: ComponentType<unknown> }>;
  preloadDelay?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      importFunc().catch(console.error);
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [importFunc, preloadDelay]);

  return null;
}

export default LazySection;