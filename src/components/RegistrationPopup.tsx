'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationForm from './RegistrationForm';
import { useScrollOptimization } from '../hooks/useScrollOptimization';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Error Boundary Component
class RegistrationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode | undefined },
  { hasError: boolean; error?: Error | undefined }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode | undefined }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RegistrationPopup Error:', error, errorInfo);
    
    // Report to monitoring service in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Add your error reporting service here
      console.error('Production error reported:', { error, errorInfo });
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">The registration popup encountered an error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Optimized auto-popup hook with proper cleanup and memory management
export function useAutoPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const lastOpenTimeRef = useRef<number>(0);
  
  // Minimum time between popups (90 seconds)
  const POPUP_INTERVAL = 90000;
  
  // Performance monitoring
  const { isHealthy } = usePerformanceMonitor({
    maxMemoryMB: 150,
    maxRenderTimeMs: 20,
    minFrameRate: 25
  }, (performanceMetrics) => {
    console.warn('Performance issue detected:', performanceMetrics);
  });

  // Scroll optimization
  const scrollState = useScrollOptimization((state) => {
    // Pause auto-popup during heavy scrolling to prevent crashes
    if (state.velocity > 50 && state.isScrolling) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, {
    throttleMs: 16,
    debounceMs: 200,
    enableRAF: true,
    enablePassive: true
  });
  
  // Memoized callbacks to prevent unnecessary re-renders
  const openPopup = useCallback(() => {
    if (!mountedRef.current || !isHealthy) return;
    
    const now = Date.now();
    const timeSinceLastOpen = now - lastOpenTimeRef.current;
    
    // Prevent rapid successive opens
    if (timeSinceLastOpen < 5000) return;
    
    try {
      setIsPopupOpen(true);
      lastOpenTimeRef.current = now;
    } catch (error) {
      console.error('Error opening popup:', error);
    }
  }, [isHealthy]);

  const closePopup = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error closing popup:', error);
    }
  }, []);

  // Setup auto-popup with proper cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    const startAutoPopup = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (!mountedRef.current || isPopupOpen || !isHealthy) return;
        
        // Only show popup if user is active and not scrolling heavily
        const isUserActive = document.hasFocus() && 
          (Date.now() - ((window as Window & { lastUserActivity?: number }).lastUserActivity ?? 0)) < 30000;
        
        if (isUserActive && !scrollState.isScrolling) {
          openPopup();
        }
      }, POPUP_INTERVAL);
    };

    // Track user activity for smarter popup timing
    const trackActivity = () => {
      (window as Window & { lastUserActivity?: number }).lastUserActivity = Date.now();
    };

    // Add activity listeners with passive option for better performance
    const activityEvents = ['scroll', 'click', 'mousemove', 'keydown'];
    activityEvents.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    // Start auto-popup only if performance is healthy
    if (isHealthy) {
      startAutoPopup();
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
    };
  }, [isPopupOpen, openPopup, isHealthy, scrollState.isScrolling]);

  // Restart auto-popup when performance improves
  useEffect(() => {
    if (isHealthy && !intervalRef.current && mountedRef.current && !isPopupOpen) {
      const startAutoPopup = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
          if (!mountedRef.current || isPopupOpen || !isHealthy) return;
          
          const isUserActive = document.hasFocus() && 
            (Date.now() - ((window as Window & { lastUserActivity?: number }).lastUserActivity ?? 0)) < 30000;
          
          if (isUserActive && !scrollState.isScrolling) {
            openPopup();
          }
        }, POPUP_INTERVAL);
      };
      
      startAutoPopup();
    } else if (!isHealthy && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isHealthy, isPopupOpen, openPopup, scrollState.isScrolling]);

  return useMemo(() => ({
    isPopupOpen,
    closePopup,
    openPopup
  }), [isPopupOpen, closePopup, openPopup]);
}

// Memoized popup component with error boundary
const RegistrationPopup = React.memo<RegistrationPopupProps>(({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key with cleanup
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal after a brief delay to ensure it's rendered
      const focusTimeout = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(focusTimeout);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
    // Return undefined for the else case to satisfy TypeScript
    return undefined;
  }, [isOpen]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Optimized close handler with animation state
  const handleClose = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200); // Match animation duration
  }, [onClose, isAnimating]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle backdrop click with proper event handling
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Memoized animation variants
  const backdropVariants = useMemo(() => ({
    hidden: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }), []);

  const modalVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  }), []);

  return (
    <RegistrationErrorBoundary>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-title"
            aria-describedby="registration-modal-description"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              ref={modalRef}
              className="relative max-w-md w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="document"
            >
              <RegistrationForm 
                isOpen={true} 
                onClose={handleClose}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RegistrationErrorBoundary>
  );
});

RegistrationPopup.displayName = 'RegistrationPopup';

export default RegistrationPopup;