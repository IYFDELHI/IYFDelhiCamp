/**
 * Global Type Definitions
 * Comprehensive type definitions to ensure complete type safety across the application
 */

// Window interface extensions
declare global {
  interface Window {
    // User activity tracking
    lastUserActivity?: number;
    
    // Performance monitoring
    gc?: () => void;
    
    // Browser compatibility
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    
    // Payment gateway
    Razorpay?: RazorpayInstance;
    
    // Development tools
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevToolsHook;
  }

  // Performance interface extensions
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }

  // Navigator interface extensions
  interface Navigator {
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
    };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  }
}

// Additional type definitions for window properties
interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

interface DevToolsHook {
  onCommitFiberRoot?: (id: number, root: unknown, priorityLevel?: number) => void;
  onCommitFiberUnmount?: (id: number, fiber: unknown) => void;
  supportsFiber?: boolean;
}

// React component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// Animation and motion types
export interface AnimationConfig {
  type: 'spring' | 'tween' | 'keyframes';
  duration?: number;
  delay?: number;
  ease?: string | number[];
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
}

export interface MotionVariants {
  initial?: MotionValue;
  animate?: MotionValue;
  exit?: MotionValue;
  hover?: MotionValue;
  tap?: MotionValue;
  focus?: MotionValue;
  whileInView?: MotionValue;
}

type MotionValue = string | number | boolean | Record<string, unknown>;

// Form and validation types
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface FormField<T = unknown> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox' | 'radio';
  value: T;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule<T>;
}

export interface FormState<T extends Record<string, unknown> = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Registration and camp types
export interface CampRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  area: string;
  facilitator: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  medicalNotes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  orderId?: string;
  registrationDate: string;
  status: 'active' | 'cancelled' | 'waitlist';
}

export interface CampStatistics {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingPayments: number;
  facilitatorBreakdown: Record<string, number>;
  areaBreakdown: Record<string, number>;
  levelBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
  ageGroups: Record<string, number>;
}

// Media and gallery types
export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  type: 'image' | 'video';
  thumbnail?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  tags?: string[];
  uploadDate?: string;
}

export interface GalleryConfig {
  autoplay?: boolean;
  autoplayInterval?: number;
  showThumbnails?: boolean;
  showNavigation?: boolean;
  showFullscreen?: boolean;
  loop?: boolean;
  preloadCount?: number;
  lazyLoad?: boolean;
  responsive?: boolean;
}

// Performance monitoring types
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  cumulativeLayoutShift: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface PerformanceThresholds {
  fps: { good: number; poor: number };
  memoryUsage: { good: number; poor: number };
  loadTime: { good: number; poor: number };
  renderTime: { good: number; poor: number };
  interactionTime: { good: number; poor: number };
}

// Error handling types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  eventType?: string;
}

export interface ErrorReport {
  id: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: {
    url: string;
    userAgent: string;
    timestamp: string;
    userId?: string;
    sessionId?: string;
    component?: string;
  };
  metadata?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'security' | 'performance' | 'user';
}

// State management types
export interface StateAction<T = unknown> {
  type: string;
  payload?: T;
  meta?: Record<string, unknown>;
}

export interface StateTransition<TState extends string, TEvent extends string> {
  from: TState;
  to: TState;
  event: TEvent;
  timestamp: number;
  context?: Record<string, unknown>;
}

export interface StateMachineConfig<TState extends string, TEvent extends string> {
  initialState: TState;
  states: Record<TState, {
    on?: Partial<Record<TEvent, TState>>;
    entry?: () => void;
    exit?: () => void;
  }>;
  context?: Record<string, unknown>;
}

// Security types
export interface SecurityConfig {
  enableCSP: boolean;
  enableXSSProtection: boolean;
  enableClickjacking: boolean;
  enableMIMESniffing: boolean;
  enableReferrerPolicy: boolean;
  enableHSTS: boolean;
  trustedDomains: string[];
  allowedScriptSources: string[];
  allowedStyleSources: string[];
  allowedImageSources: string[];
}

export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  error?: string;
  warnings?: string[];
}

// Browser compatibility types
export interface BrowserFeatureSupport {
  optionalChaining: boolean;
  nullishCoalescing: boolean;
  asyncAwait: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  fetch: boolean;
  webP: boolean;
  backdropFilter: boolean;
  grid: boolean;
  flexbox: boolean;
  objectFit: boolean;
  stickyPosition: boolean;
  performanceObserver: boolean;
  requestIdleCallback: boolean;
}

export interface BrowserInfo {
  userAgent: string;
  features: BrowserFeatureSupport;
  version?: string;
  engine?: string;
  platform?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<string, never>;

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];

// Function types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;
export type StateUpdater<T> = (prevState: T) => T;
export type StateValidator<T> = (state: T) => ValidationResult;
export type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;
export type PerformanceObserver = (metrics: PerformanceMetrics) => void;

// Component prop types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ComponentColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'gray';

// Layout and responsive types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animations: Record<string, string>;
}

// Export all types
export type * from './global';

// Module augmentation for better type inference
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Custom data attributes
    'data-testid'?: string;
    'data-cy'?: string;
    'data-track'?: string;
  }
}

declare module 'framer-motion' {
  interface AnimationProps {
    layoutId?: string;
    layout?: boolean | 'position' | 'size';
    layoutDependency?: unknown;
    layoutScroll?: boolean;
  }
}

export {};