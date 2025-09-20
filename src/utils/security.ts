'use client';

/**
 * Security utilities for input validation, sanitization, and protection
 */

// Input validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9\s]{1,100}$/,
  safeText: /^[a-zA-Z0-9\s.,!?'-]{1,500}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
} as const;

// XSS prevention - HTML entity encoding
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// SQL injection prevention - basic sanitization
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['";\\]/g, '') // Remove dangerous characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments
    .replace(/\*\//g, '')
    .trim();
}

// Input validation with sanitization
export function validateAndSanitize(
  input: string, 
  type: keyof typeof ValidationPatterns,
  options: { 
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    sanitize?: boolean;
  } = {}
): { isValid: boolean; sanitized: string; error: string | undefined } {
  const { maxLength = 1000, minLength = 0, required = true, sanitize = true } = options;
  
  // Check if input exists
  if (!input || typeof input !== 'string') {
    return {
      isValid: !required,
      sanitized: '',
      error: required ? 'Input is required' : undefined
    };
  }

  // Length validation
  if (input.length < minLength) {
    return {
      isValid: false,
      sanitized: input,
      error: `Input must be at least ${minLength} characters`
    };
  }

  if (input.length > maxLength) {
    return {
      isValid: false,
      sanitized: input,
      error: `Input must not exceed ${maxLength} characters`
    };
  }

  // Pattern validation
  const pattern = ValidationPatterns[type];
  const isValid = pattern.test(input);

  // Sanitization
  const sanitized = sanitize ? sanitizeHtml(input) : input;

  return {
    isValid,
    sanitized,
    error: isValid ? undefined : `Invalid ${type} format`
  };
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for server-side
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Content Security Policy headers
export const SecurityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.razorpay.com",
    "frame-src https://api.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
} as const;

// Secure session management
export class SecureSession {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  static set(data: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;

    const session = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + this.MAX_AGE
    };

    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }
  }

  static get(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() > session.expires) {
        this.clear();
        return null;
      }

      return session.data;
    } catch (error) {
      console.warn('Failed to retrieve session data:', error);
      this.clear();
      return null;
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  static isValid(): boolean {
    return this.get() !== null;
  }
}

// Environment validation
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'ADMIN_API_KEY'
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check for weak secrets
  if (process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY.length < 32) {
    errors.push('ADMIN_API_KEY should be at least 32 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Audit logging
export interface AuditLog {
  timestamp: string;
  action: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: Record<string, unknown> | undefined;
}

export class AuditLogger {
  private static logs: AuditLog[] = [];
  private static readonly MAX_LOGS = 1000;

  static log(action: string, details: Record<string, unknown> | undefined = undefined): void {
    const auditLog: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      ip: this.getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      details
    };

    this.logs.push(auditLog);

    // Keep only recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(auditLog);
    }
  }

  private static getClientIP(): string {
    // This would be implemented server-side
    return 'client-ip';
  }

  private static sendToLoggingService(log: AuditLog): void {
    // Implementation would send to external logging service
    console.log('Audit log:', log);
  }

  static getLogs(): AuditLog[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}