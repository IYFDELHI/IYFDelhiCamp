'use client';

import { useCallback, useState } from 'react';

/**
 * State Management Utility
 * Provides consistent patterns for state management, prevents mutations, and ensures predictability
 */

// Immutable state helpers
export const StateHelpers = {
  // Deep clone to prevent mutations
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => StateHelpers.deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
      const cloned = {} as T;
      Object.keys(obj).forEach(key => {
        (cloned as Record<string, unknown>)[key] = StateHelpers.deepClone((obj as Record<string, unknown>)[key]);
      });
      return cloned;
    }
    return obj;
  },

  // Immutable array operations
  arrayOperations: {
    add: <T>(array: T[], item: T, index?: number | undefined): T[] => {
      const newArray = [...array];
      if (index !== undefined) {
        newArray.splice(index, 0, item);
      } else {
        newArray.push(item);
      }
      return newArray;
    },

    remove: <T>(array: T[], index: number): T[] => {
      return array.filter((_, i) => i !== index);
    },

    update: <T>(array: T[], index: number, item: T): T[] => {
      return array.map((existingItem, i) => i === index ? item : existingItem);
    },

    move: <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
      const newArray = [...array];
      const [removed] = newArray.splice(fromIndex, 1);
      if (removed !== undefined) {
        newArray.splice(toIndex, 0, removed);
      }
      return newArray;
    },

    sort: <T>(array: T[], compareFn?: ((a: T, b: T) => number) | undefined): T[] => {
      return [...array].sort(compareFn);
    }
  },

  // Immutable object operations
  objectOperations: {
    set: <T extends Record<string, unknown>>(obj: T, key: keyof T, value: T[keyof T]): T => {
      return { ...obj, [key]: value };
    },

    merge: <T extends Record<string, unknown>>(obj: T, updates: Partial<T>): T => {
      return { ...obj, ...updates };
    },

    remove: <T extends Record<string, unknown>>(obj: T, key: keyof T): Omit<T, keyof T> => {
      const { [key]: removed, ...rest } = obj;
      void removed; // Acknowledge the removed value exists but is unused
      return rest;
    },

    deepMerge: <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
      const result = { ...target };
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          const sourceValue = source[key];
          const targetValue = target[key];
          if (sourceValue !== undefined && typeof sourceValue === 'object' && sourceValue !== null && 
              targetValue !== undefined && typeof targetValue === 'object' && targetValue !== null) {
            (result as Record<string, unknown>)[key] = StateHelpers.objectOperations.deepMerge(
              targetValue as Record<string, unknown>, 
              sourceValue as Record<string, unknown>
            );
          } else if (sourceValue !== undefined) {
            (result as Record<string, unknown>)[key] = sourceValue;
          }
        }
      }
      return result;
    }
  }
};

// State validation utilities
export const StateValidation = {
  // Validate state shape
  validateShape: <T>(state: T, schema: Record<string, string>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    Object.keys(schema).forEach(key => {
      const expectedType = schema[key];
      const actualValue = (state as Record<string, unknown>)[key];
      const actualType = typeof actualValue;
      
      if (actualType !== expectedType) {
        errors.push(`Expected ${key} to be ${expectedType}, got ${actualType}`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  },

  // Validate required fields
  validateRequired: <T>(state: T, requiredFields: (keyof T)[]): { isValid: boolean; missing: (keyof T)[] } => {
    const missing = requiredFields.filter(field => {
      const value = state[field];
      return value === null || value === undefined || value === '';
    });
    
    return { isValid: missing.length === 0, missing };
  },

  // Validate state consistency
  validateConsistency: <T>(state: T, rules: Array<(state: T) => string | null>): { isValid: boolean; violations: string[] } => {
    const violations = rules
      .map(rule => rule(state))
      .filter((violation): violation is string => violation !== null);
    
    return { isValid: violations.length === 0, violations };
  }
};

// Enhanced useState with validation and immutability
export function useValidatedState<T>(
  initialState: T,
  options: {
    validator?: ((state: T) => { isValid: boolean; errors: string[] }) | undefined;
    onError?: ((errors: string[]) => void) | undefined;
    immutable?: boolean | undefined;
  } = {}
): [T, (newState: T | ((prev: T) => T)) => void, { errors: string[]; isValid: boolean }] {
  const { validator, onError, immutable = true } = options;
  const [state, setState] = useState<T>(immutable ? StateHelpers.deepClone(initialState) : initialState);
  const [validationResult, setValidationResult] = useState<{ errors: string[]; isValid: boolean }>({
    errors: [],
    isValid: true
  });

  const setValidatedState = useCallback((newState: T | ((prev: T) => T)) => {
    const nextState = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(state)
      : newState;

    const clonedState = immutable ? StateHelpers.deepClone(nextState) : nextState;

    if (validator) {
      const validation = validator(clonedState);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        onError?.(validation.errors);
        return; // Don't update state if validation fails
      }
    }

    setState(clonedState);
  }, [state, validator, onError, immutable]);

  return [state, setValidatedState, validationResult];
}

// State machine implementation
export interface StateMachine<TState extends string, TEvent extends string> {
  currentState: TState;
  transitions: Record<TState, Partial<Record<TEvent, TState>>>;
  onTransition?: ((from: TState, to: TState, event: TEvent) => void) | undefined;
}

export function useStateMachine<TState extends string, TEvent extends string>(
  initialState: TState,
  transitions: Record<TState, Partial<Record<TEvent, TState>>>,
  onTransition?: ((from: TState, to: TState, event: TEvent) => void) | undefined
) {
  const [currentState, setCurrentState] = useState<TState>(initialState);
  const [history, setHistory] = useState<Array<{ from: TState; to: TState; event: TEvent; timestamp: number }>>([]);

  const transition = useCallback((event: TEvent) => {
    const nextState = transitions[currentState]?.[event];
    
    if (nextState && nextState !== currentState) {
      const transitionRecord = {
        from: currentState,
        to: nextState,
        event,
        timestamp: Date.now()
      };
      
      setHistory(prev => [...prev, transitionRecord]);
      setCurrentState(nextState);
      onTransition?.(currentState, nextState, event);
    }
  }, [currentState, transitions, onTransition]);

  const canTransition = useCallback((event: TEvent): boolean => {
    return transitions[currentState]?.[event] !== undefined;
  }, [currentState, transitions]);

  const reset = useCallback(() => {
    setCurrentState(initialState);
    setHistory([]);
  }, [initialState]);

  return {
    currentState,
    transition,
    canTransition,
    history,
    reset
  };
}

// Async state management
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useAsyncState<T>(
  initialData: T | null = null
): [
  AsyncState<T>,
  {
    setData: (data: T) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
    execute: (asyncFn: () => Promise<T>) => Promise<void>;
  }
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
    lastUpdated: initialData ? Date.now() : null
  });

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      loading: false,
      error: null,
      lastUpdated: Date.now()
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      lastUpdated: initialData ? Date.now() : null
    });
  }, [initialData]);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [setData, setError, setLoading]);

  return [state, { setData, setLoading, setError, reset, execute }];
}

// State persistence utilities
export const StatePersistence = {
  // Save state to localStorage
  saveToStorage: <T>(key: string, state: T): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  },

  // Load state from localStorage
  loadFromStorage: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
    return defaultValue;
  },

  // Remove state from localStorage
  removeFromStorage: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to remove state from localStorage:', error);
    }
  }
};

// Persistent state hook
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    return StatePersistence.loadFromStorage(key, initialValue);
  });

  const setPersistentState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      StatePersistence.saveToStorage(key, newState);
      return newState;
    });
  }, [key]);

  return [state, setPersistentState];
}

// State debugging utilities
export const StateDebugger = {
  // Log state changes
  logStateChange: <T>(componentName: string, prevState: T, newState: T): void => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 State Change: ${componentName}`);
      console.log('Previous:', prevState);
      console.log('New:', newState);
      console.log('Diff:', StateDebugger.getStateDiff(prevState, newState));
      console.groupEnd();
    }
  },

  // Get state differences
  getStateDiff: <T>(prev: T, current: T): Record<string, { from: unknown; to: unknown }> => {
    const diff: Record<string, { from: unknown; to: unknown }> = {};
    
    if (typeof prev === 'object' && typeof current === 'object' && prev && current) {
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(current)]);
      
      allKeys.forEach(key => {
        const prevValue = (prev as Record<string, unknown>)[key];
        const currentValue = (current as Record<string, unknown>)[key];
        
        if (prevValue !== currentValue) {
          diff[key] = { from: prevValue, to: currentValue };
        }
      });
    }
    
    return diff;
  },

  // Validate state integrity
  validateStateIntegrity: <T>(state: T, rules: Array<(state: T) => boolean>): boolean => {
    return rules.every(rule => {
      try {
        return rule(state);
      } catch (error) {
        console.error('State integrity check failed:', error);
        return false;
      }
    });
  }
};

// State management context factory
export function createStateContext<T>() {
  // This function would need to be implemented in a .tsx file for JSX support
  // For now, returning a factory function that can be used to create context
  return {
    createContext: () => {
      const context = {
        state: null as T | null,
        setState: (() => {}) as (value: T | ((prev: T) => T)) => void
      };
      return context;
    }
  };
}

const StateManagement = {
  StateHelpers,
  StateValidation,
  useValidatedState,
  useStateMachine,
  useAsyncState,
  StatePersistence,
  usePersistentState,
  StateDebugger,
  createStateContext
};

export default StateManagement;