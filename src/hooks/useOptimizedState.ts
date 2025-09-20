'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Debounced state hook to prevent excessive updates
export function useDebouncedState<T>(initialValue: T, delay: number = 300): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, debouncedValue, updateValue];
}

// Throttled state hook to limit update frequency
export function useThrottledState<T>(
  initialValue: T,
  delay: number = 100
): [T, (value: T) => void] {
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateValue = useCallback((newValue: T) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= delay) {
      setThrottledValue(newValue);
      lastUpdateRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(newValue);
        lastUpdateRef.current = Date.now();
      }, delay - timeSinceLastUpdate);
    }
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [throttledValue, updateValue];
}

// Memoized state with custom equality check
export function useMemoizedState<T>(
  initialValue: T,
  equalityFn?: (prev: T, next: T) => boolean
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  
  const updateValue = useCallback((newValue: T) => {
    setValue(prevValue => {
      const isEqual = equalityFn 
        ? equalityFn(prevValue, newValue)
        : Object.is(prevValue, newValue);
      
      return isEqual ? prevValue : newValue;
    });
  }, [equalityFn]);

  return [value, updateValue];
}

// Optimized array state with built-in operations
export function useOptimizedArray<T>(
  initialValue: T[] = []
): {
  items: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  set: (items: T[]) => void;
} {
  const [items, setItems] = useState<T[]>(initialValue);

  const operations = useMemo(() => ({
    add: (item: T) => {
      setItems(prev => [...prev, item]);
    },
    remove: (index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
    },
    update: (index: number, item: T) => {
      setItems(prev => prev.map((existingItem, i) => i === index ? item : existingItem));
    },
    clear: () => {
      setItems([]);
    },
    set: (newItems: T[]) => {
      setItems(newItems);
    }
  }), []);

  return {
    items,
    ...operations
  };
}

// Optimized object state with partial updates
export function useOptimizedObject<T extends Record<string, unknown>>(
  initialValue: T
): {
  state: T;
  update: (partial: Partial<T>) => void;
  set: (newState: T) => void;
  reset: () => void;
} {
  const [state, setState] = useState<T>(initialValue);
  const initialRef = useRef<T>(initialValue);

  const operations = useMemo(() => ({
    update: (partial: Partial<T>) => {
      setState(prev => ({ ...prev, ...partial }));
    },
    set: (newState: T) => {
      setState(newState);
    },
    reset: () => {
      setState(initialRef.current);
    }
  }), []);

  return {
    state,
    ...operations
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(name: string) {
  const renderCountRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    renderCountRef.current += 1;
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log(`${name} render #${renderCountRef.current} took ${duration.toFixed(2)}ms`);
        }
      }
    };
  });

  return {
    renderCount: renderCountRef.current,
    logPerformance: (label: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name} - ${label} at render #${renderCountRef.current}`);
      }
    }
  };
}

// Stable callback hook to prevent unnecessary re-renders
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);

  return useCallback((...args: unknown[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}

const optimizedStateHooks = {
  useDebouncedState,
  useThrottledState,
  useMemoizedState,
  useOptimizedArray,
  useOptimizedObject,
  usePerformanceMonitor,
  useStableCallback
};

export default optimizedStateHooks;