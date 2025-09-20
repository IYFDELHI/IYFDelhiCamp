'use client';

/**
 * Type Guard Utilities
 * Provides runtime type checking and safe type assertions to replace unsafe 'as' casts
 */

// Basic type guards
export const TypeGuards = {
  // Primitive type guards
  isString: (value: unknown): value is string => {
    return typeof value === 'string';
  },

  isNumber: (value: unknown): value is number => {
    return typeof value === 'number' && !isNaN(value);
  },

  isBoolean: (value: unknown): value is boolean => {
    return typeof value === 'boolean';
  },

  isFunction: (value: unknown): value is (...args: unknown[]) => unknown => {
    return typeof value === 'function';
  },

  isObject: (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  isArray: <T = unknown>(value: unknown): value is T[] => {
    return Array.isArray(value);
  },

  isNull: (value: unknown): value is null => {
    return value === null;
  },

  isUndefined: (value: unknown): value is undefined => {
    return value === undefined;
  },

  isNullish: (value: unknown): value is null | undefined => {
    return value === null || value === undefined;
  },

  // Complex type guards
  isNonEmptyString: (value: unknown): value is string => {
    return TypeGuards.isString(value) && value.length > 0;
  },

  isPositiveNumber: (value: unknown): value is number => {
    return TypeGuards.isNumber(value) && value > 0;
  },

  isNonEmptyArray: <T = unknown>(value: unknown): value is [T, ...T[]] => {
    return TypeGuards.isArray<T>(value) && value.length > 0;
  },

  isValidEmail: (value: unknown): value is string => {
    if (!TypeGuards.isString(value)) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },

  isValidPhone: (value: unknown): value is string => {
    if (!TypeGuards.isString(value)) return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  isValidUrl: (value: unknown): value is string => {
    if (!TypeGuards.isString(value)) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // DOM type guards
  isElement: (value: unknown): value is Element => {
    return value instanceof Element;
  },

  isHTMLElement: (value: unknown): value is HTMLElement => {
    return value instanceof HTMLElement;
  },

  isHTMLInputElement: (value: unknown): value is HTMLInputElement => {
    return value instanceof HTMLInputElement;
  },

  isHTMLFormElement: (value: unknown): value is HTMLFormElement => {
    return value instanceof HTMLFormElement;
  },

  // Event type guards
  isMouseEvent: (value: unknown): value is MouseEvent => {
    return value instanceof MouseEvent;
  },

  isKeyboardEvent: (value: unknown): value is KeyboardEvent => {
    return value instanceof KeyboardEvent;
  },

  isTouchEvent: (value: unknown): value is TouchEvent => {
    return value instanceof TouchEvent;
  },

  // Error type guards
  isError: (value: unknown): value is Error => {
    return value instanceof Error;
  },

  isErrorWithMessage: (value: unknown): value is Error & { message: string } => {
    return TypeGuards.isError(value) && TypeGuards.isString(value.message);
  },

  // Promise type guards
  isPromise: <T = unknown>(value: unknown): value is Promise<T> => {
    return value instanceof Promise || (
      TypeGuards.isObject(value) && 
      TypeGuards.isFunction((value as Record<string, unknown>).then)
    );
  },

  // Date type guards
  isDate: (value: unknown): value is Date => {
    return value instanceof Date && !isNaN(value.getTime());
  },

  isValidDateString: (value: unknown): value is string => {
    if (!TypeGuards.isString(value)) return false;
    const date = new Date(value);
    return TypeGuards.isDate(date);
  }
};

// Object shape validators
export const ObjectValidators = {
  // Validate object has required keys
  hasKeys: <T extends Record<string, unknown>>(
    obj: unknown,
    keys: (keyof T)[]
  ): obj is T => {
    if (!TypeGuards.isObject(obj)) return false;
    return keys.every(key => key in obj);
  },

  // Validate object has required keys with specific types
  hasTypedKeys: <T extends Record<string, unknown>>(
    obj: unknown,
    schema: { [K in keyof T]: (value: unknown) => value is T[K] }
  ): obj is T => {
    if (!TypeGuards.isObject(obj)) return false;
    
    return Object.entries(schema).every(([key, validator]) => {
      return key in obj && validator(obj[key]);
    });
  },

  // Validate array of objects with specific shape
  isArrayOfType: <T>(
    value: unknown,
    itemValidator: (item: unknown) => item is T
  ): value is T[] => {
    return TypeGuards.isArray(value) && value.every(itemValidator);
  }
};

// Application-specific type guards
export const AppTypeGuards = {
  // Registration form validation
  isValidRegistration: (value: unknown): value is {
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    area: string;
    facilitator: string;
    level: string;
  } => {
    return ObjectValidators.hasTypedKeys(value, {
      name: TypeGuards.isNonEmptyString,
      email: TypeGuards.isValidEmail,
      phone: TypeGuards.isValidPhone,
      age: TypeGuards.isPositiveNumber,
      gender: TypeGuards.isNonEmptyString,
      area: TypeGuards.isNonEmptyString,
      facilitator: TypeGuards.isNonEmptyString,
      level: TypeGuards.isNonEmptyString
    });
  },

  // API response validation
  isApiResponse: <T = unknown>(
    value: unknown,
    dataValidator?: (data: unknown) => data is T
  ): value is { success: boolean; data?: T; error?: string; message?: string } => {
    if (!TypeGuards.isObject(value)) return false;
    
    const hasRequiredShape = ObjectValidators.hasTypedKeys(value, {
      success: TypeGuards.isBoolean
    });
    
    if (!hasRequiredShape) return false;
    
    // Validate optional fields
    if ('data' in value && dataValidator && !dataValidator(value.data)) {
      return false;
    }
    
    if ('error' in value && !TypeGuards.isString(value.error)) {
      return false;
    }
    
    if ('message' in value && !TypeGuards.isString(value.message)) {
      return false;
    }
    
    return true;
  },

  // Performance metrics validation
  isPerformanceMetrics: (value: unknown): value is {
    fps: number;
    memoryUsage: number;
    loadTime: number;
    renderTime: number;
  } => {
    return ObjectValidators.hasTypedKeys(value, {
      fps: TypeGuards.isNumber,
      memoryUsage: TypeGuards.isNumber,
      loadTime: TypeGuards.isNumber,
      renderTime: TypeGuards.isNumber
    });
  },

  // Media item validation
  isMediaItem: (value: unknown): value is {
    id: string;
    src: string;
    alt: string;
    type: 'image' | 'video';
  } => {
    if (!ObjectValidators.hasTypedKeys(value, {
      id: TypeGuards.isNonEmptyString,
      src: TypeGuards.isNonEmptyString,
      alt: TypeGuards.isString,
      type: TypeGuards.isString
    })) return false;
    
    const obj = value as { id: string; src: string; alt: string; type: string };
    return obj.type === 'image' || obj.type === 'video';
  }
};

// Safe casting utilities
export const SafeCast = {
  // Safe string casting with fallback
  toString: (value: unknown, fallback = ''): string => {
    if (TypeGuards.isString(value)) return value;
    if (TypeGuards.isNumber(value)) return value.toString();
    if (TypeGuards.isBoolean(value)) return value.toString();
    return fallback;
  },

  // Safe number casting with fallback
  toNumber: (value: unknown, fallback = 0): number => {
    if (TypeGuards.isNumber(value)) return value;
    if (TypeGuards.isString(value)) {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  },

  // Safe boolean casting
  toBoolean: (value: unknown): boolean => {
    if (TypeGuards.isBoolean(value)) return value;
    if (TypeGuards.isString(value)) {
      return value.toLowerCase() === 'true' || value === '1';
    }
    if (TypeGuards.isNumber(value)) return value !== 0;
    return Boolean(value);
  },

  // Safe array casting
  toArray: <T = unknown>(value: unknown, fallback: T[] = []): T[] => {
    if (TypeGuards.isArray<T>(value)) return value;
    if (value !== null && value !== undefined) return [value as T];
    return fallback;
  },

  // Safe object casting
  toObject: <T extends Record<string, unknown>>(
    value: unknown,
    fallback: T = {} as T
  ): T => {
    if (TypeGuards.isObject(value)) return value as T;
    return fallback;
  }
};

// Runtime type assertion with error handling
export const Assert = {
  // Assert with custom error message
  assert: <T>(
    value: unknown,
    guard: (value: unknown) => value is T,
    message?: string
  ): T => {
    if (guard(value)) return value;
    throw new TypeError(message || `Type assertion failed`);
  },

  // Assert string
  string: (value: unknown, message?: string): string => {
    return Assert.assert(value, TypeGuards.isString, message || 'Expected string');
  },

  // Assert number
  number: (value: unknown, message?: string): number => {
    return Assert.assert(value, TypeGuards.isNumber, message || 'Expected number');
  },

  // Assert boolean
  boolean: (value: unknown, message?: string): boolean => {
    return Assert.assert(value, TypeGuards.isBoolean, message || 'Expected boolean');
  },

  // Assert array
  array: <T = unknown>(value: unknown, message?: string): T[] => {
    return Assert.assert(value, TypeGuards.isArray<T>, message || 'Expected array');
  },

  // Assert object
  object: <T extends Record<string, unknown>>(
    value: unknown,
    message?: string
  ): T => {
    return Assert.assert(value, TypeGuards.isObject, message || 'Expected object') as T;
  },

  // Assert non-null
  nonNull: <T>(value: T | null, message?: string): T => {
    if (value === null) {
      throw new TypeError(message || 'Expected non-null value');
    }
    return value;
  },

  // Assert non-undefined
  defined: <T>(value: T | undefined, message?: string): T => {
    if (value === undefined) {
      throw new TypeError(message || 'Expected defined value');
    }
    return value;
  },

  // Assert non-nullish
  nonNullish: <T>(value: T | null | undefined, message?: string): T => {
    if (value === null || value === undefined) {
      throw new TypeError(message || 'Expected non-nullish value');
    }
    return value;
  }
};

// Type narrowing utilities
export const Narrow = {
  // Narrow union types
  narrowUnion: <T extends string>(
    value: string,
    allowedValues: readonly T[]
  ): T | null => {
    return allowedValues.includes(value as T) ? (value as T) : null;
  },

  // Filter array by type
  filterByType: <T, U extends T>(
    array: T[],
    guard: (item: T) => item is U
  ): U[] => {
    return array.filter(guard);
  },

  // Find first item of type
  findByType: <T, U extends T>(
    array: T[],
    guard: (item: T) => item is U
  ): U | undefined => {
    return array.find(guard);
  }
};

// Development-only type checking
export const DevTypeCheck = {
  // Log type information in development
  logType: (value: unknown, label?: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label || 'Value'} type:`, {
        value,
        type: typeof value,
        constructor: value?.constructor?.name,
        isArray: Array.isArray(value),
        isNull: value === null,
        isUndefined: value === undefined
      });
    }
  },

  // Warn about type mismatches in development
  warnTypeMismatch: <T>(
    value: unknown,
    guard: (value: unknown) => value is T,
    expected: string
  ): void => {
    if (process.env.NODE_ENV === 'development' && !guard(value)) {
      console.warn(`Type mismatch: expected ${expected}, got ${typeof value}`, value);
    }
  }
};

const TypeGuardUtils = {
  TypeGuards,
  ObjectValidators,
  AppTypeGuards,
  SafeCast,
  Assert,
  Narrow,
  DevTypeCheck
};

export default TypeGuardUtils;