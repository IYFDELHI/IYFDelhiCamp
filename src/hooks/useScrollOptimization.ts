'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface ScrollOptimizationOptions {
  throttleMs?: number;
  debounceMs?: number;
  enableRAF?: boolean;
  enablePassive?: boolean;
}

interface ScrollState {
  scrollY: number;
  scrollX: number;
  isScrolling: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  velocity: number;
}

/**
 * High-performance scroll optimization hook
 * Handles thousands of users and hundreds of scrolls without crashes
 */
export function useScrollOptimization(
  callback?: (scrollState: ScrollState) => void,
  options: ScrollOptimizationOptions = {}
) {
  const {
    throttleMs = 16, // ~60fps
    debounceMs = 150,
    enableRAF = true,
    enablePassive = true
  } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollX: 0,
    isScrolling: false,
    direction: null,
    velocity: 0
  });

  const rafRef = useRef<number | null>(null);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollRef = useRef({ x: 0, y: 0, time: 0 });
  const mountedRef = useRef(true);

  // Optimized scroll handler with memory management
  const handleScroll = useCallback(() => {
    if (!mountedRef.current) return;

    const now = performance.now();
    const currentX = window.scrollX;
    const currentY = window.scrollY;
    const lastScroll = lastScrollRef.current;

    // Calculate velocity and direction
    const deltaX = currentX - lastScroll.x;
    const deltaY = currentY - lastScroll.y;
    const deltaTime = now - lastScroll.time;
    
    const velocity = deltaTime > 0 ? Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime : 0;
    
    let direction: ScrollState['direction'] = null;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      direction = deltaY > 0 ? 'down' : 'up';
    } else if (Math.abs(deltaX) > 0) {
      direction = deltaX > 0 ? 'right' : 'left';
    }

    const newScrollState: ScrollState = {
      scrollX: currentX,
      scrollY: currentY,
      isScrolling: true,
      direction,
      velocity: Math.min(velocity, 100) // Cap velocity to prevent extreme values
    };

    // Update refs
    lastScrollRef.current = { x: currentX, y: currentY, time: now };

    // Throttled state update
    if (enableRAF) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        if (mountedRef.current) {
          setScrollState(newScrollState);
          callback?.(newScrollState);
        }
      });
    } else {
      setScrollState(newScrollState);
      callback?.(newScrollState);
    }

    // Debounced scroll end detection
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setScrollState(prev => ({ ...prev, isScrolling: false, velocity: 0 }));
      }
    }, debounceMs);

  }, [callback, enableRAF, debounceMs]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    if (!mountedRef.current) return;

    if (throttleRef.current) {
      return;
    }

    throttleRef.current = setTimeout(() => {
      handleScroll();
      throttleRef.current = null;
    }, throttleMs);
  }, [handleScroll, throttleMs]);

  // Setup scroll listeners with cleanup
  useEffect(() => {
    mountedRef.current = true;

    // Initialize scroll position
    lastScrollRef.current = {
      x: window.scrollX,
      y: window.scrollY,
      time: performance.now()
    };

    const scrollHandler = throttleMs > 0 ? throttledScrollHandler : handleScroll;
    const options = enablePassive ? { passive: true } : false;

    window.addEventListener('scroll', scrollHandler, options);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      window.removeEventListener('scroll', scrollHandler);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [throttledScrollHandler, handleScroll, throttleMs, enablePassive]);

  return scrollState;
}

/**
 * Hook for scroll-based visibility detection with intersection observer fallback
 */
export function useScrollVisibility(
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;

    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsVisible(entry?.isIntersecting ?? false);
          setIntersectionRatio(entry?.intersectionRatio ?? 0);
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '50px',
          ...options
        }
      );

      observerRef.current.observe(element);

      cleanup = () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else {
      // Fallback for older browsers
      const handleScroll = () => {
        const currentElement = elementRef.current;
        if (!currentElement) return;
        const rect = currentElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isInView = rect.top < windowHeight && rect.bottom > 0;
        setIsVisible(isInView);
        setIntersectionRatio(isInView ? 1 : 0);
      };

      (window as Window).addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check

      cleanup = () => {
        (window as Window).removeEventListener('scroll', handleScroll);
      };
    }

    return cleanup;
  }, [elementRef, options]);

  return { isVisible, intersectionRatio };
}

/**
 * Hook for virtual scrolling support
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll
  };
}

const scrollHooks = {
  useScrollOptimization,
  useScrollVisibility,
  useVirtualScroll
};

export default scrollHooks;