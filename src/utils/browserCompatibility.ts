'use client';

/**
 * Browser Compatibility Utility
 * Handles feature detection, polyfills, and graceful degradation for older browsers
 */

// Feature detection utilities
export const BrowserFeatures = {
  // Modern JavaScript features
  supportsOptionalChaining: () => {
    try {
      // Test optional chaining support
      const test = { a: { b: 1 } };
      return test?.a?.b === 1;
    } catch {
      return false;
    }
  },

  supportsNullishCoalescing: () => {
    try {
      // Test nullish coalescing support
      const testValue: null | string = null;
      return (testValue ?? 'default') === 'default';
    } catch {
      return false;
    }
  },

  supportsAsyncAwait: () => {
    try {
      // Check if async/await is supported
      return typeof (async () => {})().then === 'function';
    } catch {
      return false;
    }
  },

  // Web APIs
  supportsIntersectionObserver: () => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  supportsResizeObserver: () => {
    return typeof window !== 'undefined' && 'ResizeObserver' in window;
  },

  supportsFetch: () => {
    return typeof window !== 'undefined' && 'fetch' in window;
  },

  supportsWebP: () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },

  // CSS features
  supportsBackdropFilter: () => {
    if (typeof window === 'undefined') return false;
    const testElement = document.createElement('div');
    testElement.style.backdropFilter = 'blur(1px)';
    return testElement.style.backdropFilter !== '';
  },

  supportsGrid: () => {
    if (typeof window === 'undefined') return false;
    const testElement = document.createElement('div');
    testElement.style.display = 'grid';
    return testElement.style.display === 'grid';
  },

  supportsFlexbox: () => {
    if (typeof window === 'undefined') return false;
    const testElement = document.createElement('div');
    testElement.style.display = 'flex';
    return testElement.style.display === 'flex';
  },

  supportsObjectFit: () => {
    if (typeof window === 'undefined') return false;
    const testElement = document.createElement('div');
    testElement.style.objectFit = 'cover';
    return testElement.style.objectFit === 'cover';
  },

  supportsStickyPosition: () => {
    if (typeof window === 'undefined') return false;
    const testElement = document.createElement('div');
    testElement.style.position = 'sticky';
    return testElement.style.position === 'sticky';
  },

  // Performance APIs
  supportsPerformanceObserver: () => {
    return typeof window !== 'undefined' && 'PerformanceObserver' in window;
  },

  supportsRequestIdleCallback: () => {
    return typeof window !== 'undefined' && 'requestIdleCallback' in window;
  }
};

// Polyfill implementations
export const Polyfills = {
  // Array methods polyfills
  arrayFrom: () => {
    if (!Array.from) {
      Array.from = function<T>(arrayLike: ArrayLike<T>, mapFn?: (v: T, k: number) => T): T[] {
        const items = Object(arrayLike);
        const len = parseInt(items.length) || 0;
        const result = new Array(len);
        
        for (let i = 0; i < len; i++) {
          result[i] = mapFn ? mapFn(items[i], i) : items[i];
        }
        
        return result;
      };
    }
  },

  arrayIncludes: () => {
    if (!Array.prototype.includes) {
      Array.prototype.includes = function<T>(searchElement: T, fromIndex?: number): boolean {
        const len = this.length;
        const start = Math.max(fromIndex || 0, 0);
        
        for (let i = start; i < len; i++) {
          if (this[i] === searchElement) return true;
        }
        
        return false;
      };
    }
  },

  // String methods polyfills
  stringIncludes: () => {
    if (!String.prototype.includes) {
      String.prototype.includes = function(search: string, start?: number): boolean {
        return this.indexOf(search, start) !== -1;
      };
    }
  },

  stringStartsWith: () => {
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(search: string, pos?: number): boolean {
        return this.substr(pos || 0, search.length) === search;
      };
    }
  },

  stringEndsWith: () => {
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(search: string, length?: number): boolean {
        const actualLength = length === undefined ? this.length : length;
        return this.substring(actualLength - search.length, actualLength) === search;
      };
    }
  },

  // Object methods polyfills
  objectEntries: () => {
    if (!Object.entries) {
      Object.entries = function<T>(obj: { [key: string]: T }): [string, T][] {
        const keys = Object.keys(obj);
        const result: [string, T][] = [];
        
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== undefined && obj[key] !== undefined) {
            result.push([key, obj[key]]);
          }
        }
        
        return result;
      };
    }
  },

  objectValues: () => {
    if (!Object.values) {
      Object.values = function<T>(obj: { [key: string]: T }): T[] {
        const keys = Object.keys(obj);
        const result: T[] = [];
        
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== undefined && obj[key] !== undefined) {
            result.push(obj[key]);
          }
        }
        
        return result;
      };
    }
  },

  // Fetch polyfill (basic implementation)
  fetch: () => {
    if (!BrowserFeatures.supportsFetch()) {
      // Basic fetch polyfill using XMLHttpRequest
      (window as Window & { fetch: typeof fetch }).fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === 'string' ? input : input.toString();
        const options = init || {};
        
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const method = options.method || 'GET';
          
          xhr.open(method, url);
          
          // Set headers
          if (options.headers) {
            const headers = options.headers as Record<string, string>;
            Object.keys(headers).forEach(key => {
              const headerValue = headers[key];
              if (headerValue !== undefined) {
                xhr.setRequestHeader(key, headerValue);
              }
            });
          }
          
          xhr.onload = () => {
            const response = {
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              statusText: xhr.statusText,
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
              text: () => Promise.resolve(xhr.responseText)
            } as Response;
            
            resolve(response);
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(options.body as string);
        });
      };
    }
  },

  // IntersectionObserver polyfill (basic implementation)
  intersectionObserver: () => {
    if (!BrowserFeatures.supportsIntersectionObserver()) {
      // Basic polyfill using scroll events
      class IntersectionObserverPolyfill implements IntersectionObserver {
        private callback: IntersectionObserverCallback;
        private elements: Set<Element> = new Set();
        private scrollHandler: () => void;
        
        // Required properties for IntersectionObserver interface
        readonly root: Element | Document | null = null;
        readonly rootMargin: string = '0px';
        readonly thresholds: ReadonlyArray<number> = [0];

        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          this.callback = callback;
          this.scrollHandler = this.checkIntersections.bind(this);
          
          // Apply options if provided
          if (options) {
            if (options.root !== undefined) {
              (this as { root: Element | Document | null }).root = options.root;
            }
            if (options.rootMargin !== undefined) {
              (this as { rootMargin: string }).rootMargin = options.rootMargin;
            }
            if (options.threshold !== undefined) {
              const thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold];
              (this as { thresholds: ReadonlyArray<number> }).thresholds = thresholds;
            }
          }
          
          window.addEventListener('scroll', this.scrollHandler, { passive: true });
          window.addEventListener('resize', this.scrollHandler, { passive: true });
        }

        observe(element: Element): void {
          this.elements.add(element);
          this.checkIntersections();
        }

        unobserve(element: Element): void {
          this.elements.delete(element);
        }

        disconnect(): void {
          this.elements.clear();
          window.removeEventListener('scroll', this.scrollHandler);
          window.removeEventListener('resize', this.scrollHandler);
        }

        takeRecords(): IntersectionObserverEntry[] {
          // Basic implementation - return empty array as we don't queue entries
          return [];
        }

        private checkIntersections(): void {
          const entries: IntersectionObserverEntry[] = [];
          
          this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
            
            entries.push({
              target: element,
              isIntersecting,
              intersectionRatio: isIntersecting ? 1 : 0,
              boundingClientRect: rect,
              intersectionRect: rect,
              rootBounds: { 
                top: 0, 
                left: 0, 
                right: window.innerWidth, 
                bottom: window.innerHeight, 
                width: window.innerWidth, 
                height: window.innerHeight,
                x: 0,
                y: 0,
                toJSON: () => ({})
              },
              time: Date.now()
            } as IntersectionObserverEntry);
          });
          
          if (entries.length > 0) {
            this.callback(entries, this);
          }
        }
      }

      (window as Window & { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = IntersectionObserverPolyfill as unknown as typeof IntersectionObserver;
    }
  }
};

// CSS fallbacks
export const CSSFallbacks = {
  // Add backdrop-filter fallback
  addBackdropFilterFallback: () => {
    if (!BrowserFeatures.supportsBackdropFilter()) {
      const style = document.createElement('style');
      style.textContent = `
        .glass {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Add grid fallback
  addGridFallback: () => {
    if (!BrowserFeatures.supportsGrid()) {
      const style = document.createElement('style');
      style.textContent = `
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        .grid > * {
          flex: 1 1 auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Add object-fit fallback
  addObjectFitFallback: () => {
    if (!BrowserFeatures.supportsObjectFit()) {
      // Use background-image as fallback for object-fit
      const images = document.querySelectorAll('img[style*="object-fit"]');
      images.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        const parent = imgElement.parentElement;
        if (parent) {
          parent.style.backgroundImage = `url(${imgElement.src})`;
          parent.style.backgroundSize = 'cover';
          parent.style.backgroundPosition = 'center';
          imgElement.style.opacity = '0';
        }
      });
    }
  }
};

// Browser compatibility manager
export class BrowserCompatibilityManager {
  private static instance: BrowserCompatibilityManager;
  private initialized = false;

  static getInstance(): BrowserCompatibilityManager {
    if (!BrowserCompatibilityManager.instance) {
      BrowserCompatibilityManager.instance = new BrowserCompatibilityManager();
    }
    return BrowserCompatibilityManager.instance;
  }

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;

    // Apply polyfills
    Polyfills.arrayFrom();
    Polyfills.arrayIncludes();
    Polyfills.stringIncludes();
    Polyfills.stringStartsWith();
    Polyfills.stringEndsWith();
    Polyfills.objectEntries();
    Polyfills.objectValues();
    Polyfills.fetch();
    Polyfills.intersectionObserver();

    // Apply CSS fallbacks
    CSSFallbacks.addBackdropFilterFallback();
    CSSFallbacks.addGridFallback();
    CSSFallbacks.addObjectFitFallback();

    this.initialized = true;
  }

  // Get browser info for debugging
  getBrowserInfo(): {
    userAgent: string;
    features: Record<string, boolean>;
  } {
    if (typeof window === 'undefined') {
      return { userAgent: 'SSR', features: {} };
    }

    return {
      userAgent: navigator.userAgent,
      features: {
        optionalChaining: BrowserFeatures.supportsOptionalChaining(),
        nullishCoalescing: BrowserFeatures.supportsNullishCoalescing(),
        asyncAwait: BrowserFeatures.supportsAsyncAwait(),
        intersectionObserver: BrowserFeatures.supportsIntersectionObserver(),
        resizeObserver: BrowserFeatures.supportsResizeObserver(),
        fetch: BrowserFeatures.supportsFetch(),
        webP: BrowserFeatures.supportsWebP(),
        backdropFilter: BrowserFeatures.supportsBackdropFilter(),
        grid: BrowserFeatures.supportsGrid(),
        flexbox: BrowserFeatures.supportsFlexbox(),
        objectFit: BrowserFeatures.supportsObjectFit(),
        stickyPosition: BrowserFeatures.supportsStickyPosition(),
        performanceObserver: BrowserFeatures.supportsPerformanceObserver(),
        requestIdleCallback: BrowserFeatures.supportsRequestIdleCallback()
      }
    };
  }
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      BrowserCompatibilityManager.getInstance().init();
    });
  } else {
    BrowserCompatibilityManager.getInstance().init();
  }
}

export default BrowserCompatibilityManager;