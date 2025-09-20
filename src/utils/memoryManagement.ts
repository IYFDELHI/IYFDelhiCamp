'use client';

/**
 * Memory Management Utilities
 * Comprehensive tools for preventing memory leaks and optimizing performance
 */

// WeakMap for storing cleanup functions to prevent memory leaks
const cleanupRegistry = new WeakMap<object, (() => void)[]>();

/**
 * Register cleanup functions for components
 */
export function registerCleanup(component: object, cleanup: () => void): void {
  const existing = cleanupRegistry.get(component) || [];
  existing.push(cleanup);
  cleanupRegistry.set(component, existing);
}

/**
 * Execute all cleanup functions for a component
 */
export function executeCleanup(component: object): void {
  const cleanups = cleanupRegistry.get(component);
  if (cleanups) {
    cleanups.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    cleanupRegistry.delete(component);
  }
}

/**
 * Memory leak detection utilities
 */
export class MemoryLeakDetector {
  private static instance: MemoryLeakDetector;
  private observers: Map<string, { count: number; lastCheck: number }> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  static getInstance(): MemoryLeakDetector {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector();
    }
    return MemoryLeakDetector.instance;
  }

  startMonitoring(intervalMs: number = 10000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
  }

  registerComponent(componentName: string): void {
    const current = this.observers.get(componentName) || { count: 0, lastCheck: Date.now() };
    current.count++;
    this.observers.set(componentName, current);
  }

  unregisterComponent(componentName: string): void {
    const current = this.observers.get(componentName);
    if (current) {
      current.count = Math.max(0, current.count - 1);
      if (current.count === 0) {
        this.observers.delete(componentName);
      } else {
        this.observers.set(componentName, current);
      }
    }
  }

  private checkMemoryUsage(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as Performance & { 
      memory: { 
        usedJSHeapSize: number; 
        totalJSHeapSize: number; 
        jsHeapSizeLimit: number; 
      } | undefined
    }).memory;

    if (!memory) return;

    const usedMB = memory.usedJSHeapSize / 1024 / 1024;
    const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

    // Log warning if memory usage is high
    if (usedMB > limitMB * 0.8) {
      console.warn(`High memory usage detected: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`);
      this.suggestGarbageCollection();
    }

    // Check for potential leaks in registered components
    this.observers.forEach((data, componentName) => {
      if (data.count > 10) { // Arbitrary threshold
        console.warn(`Potential memory leak in ${componentName}: ${data.count} instances`);
      }
    });
  }

  private suggestGarbageCollection(): void {
    if ('gc' in window && typeof (window as Window & { gc?: () => void }).gc === 'function') {
      try {
        (window as Window & { gc?: () => void }).gc?.();
        console.log('Manual garbage collection triggered');
      } catch (error) {
        console.warn('Manual garbage collection failed:', error);
      }
    }
  }

  getMemoryStats(): { usedMB: number; totalMB: number; limitMB: number } | null {
    if (typeof window === 'undefined' || !('memory' in performance)) return null;

    const memory = (performance as Performance & { 
      memory: { 
        usedJSHeapSize: number; 
        totalJSHeapSize: number; 
        jsHeapSizeLimit: number; 
      } | undefined
    }).memory;

    if (!memory) return null;

    return {
      usedMB: memory.usedJSHeapSize / 1024 / 1024,
      totalMB: memory.totalJSHeapSize / 1024 / 1024,
      limitMB: memory.jsHeapSizeLimit / 1024 / 1024
    };
  }
}

/**
 * Event listener cleanup utility
 */
export class EventListenerManager {
  private listeners: Map<string, { element: EventTarget; event: string; handler: EventListener; options: AddEventListenerOptions | undefined }[]> = new Map();

  add(
    id: string,
    element: EventTarget,
    event: string,
    handler: EventListener,
    options: AddEventListenerOptions | undefined = undefined
  ): void {
    const existing = this.listeners.get(id) || [];
    existing.push({ element, event, handler, options });
    this.listeners.set(id, existing);
    
    element.addEventListener(event, handler, options);
  }

  remove(id: string): void {
    const listeners = this.listeners.get(id);
    if (listeners) {
      listeners.forEach(({ element, event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      this.listeners.delete(id);
    }
  }

  removeAll(): void {
    this.listeners.forEach((_, id) => {
      this.remove(id);
    });
  }

  getActiveListeners(): string[] {
    return Array.from(this.listeners.keys());
  }
}

/**
 * Timer cleanup utility
 */
export class TimerManager {
  private timers: Map<string, NodeJS.Timeout | number> = new Map();
  private intervals: Map<string, NodeJS.Timeout | number> = new Map();
  private animationFrames: Map<string, number> = new Map();

  setTimeout(id: string, callback: () => void, delay: number): void {
    this.clearTimeout(id); // Clear existing timer with same id
    const timerId = setTimeout(() => {
      callback();
      this.timers.delete(id);
    }, delay);
    this.timers.set(id, timerId);
  }

  setInterval(id: string, callback: () => void, delay: number): void {
    this.clearInterval(id); // Clear existing interval with same id
    const intervalId = setInterval(callback, delay);
    this.intervals.set(id, intervalId);
  }

  requestAnimationFrame(id: string, callback: () => void): void {
    this.cancelAnimationFrame(id); // Clear existing frame with same id
    const frameId = requestAnimationFrame(() => {
      callback();
      this.animationFrames.delete(id);
    });
    this.animationFrames.set(id, frameId);
  }

  clearTimeout(id: string): void {
    const timerId = this.timers.get(id);
    if (timerId) {
      clearTimeout(timerId);
      this.timers.delete(id);
    }
  }

  clearInterval(id: string): void {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
    }
  }

  cancelAnimationFrame(id: string): void {
    const frameId = this.animationFrames.get(id);
    if (frameId) {
      cancelAnimationFrame(frameId);
      this.animationFrames.delete(id);
    }
  }

  clearAll(): void {
    // Clear all timers
    this.timers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.timers.clear();

    // Clear all intervals
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();

    // Cancel all animation frames
    this.animationFrames.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });
    this.animationFrames.clear();
  }

  getActiveTimers(): { timeouts: string[]; intervals: string[]; frames: string[] } {
    return {
      timeouts: Array.from(this.timers.keys()),
      intervals: Array.from(this.intervals.keys()),
      frames: Array.from(this.animationFrames.keys())
    };
  }
}

/**
 * Resource cleanup utility for refs and objects
 */
export class ResourceManager {
  private resources: Map<string, { cleanup: () => void; type: string }> = new Map();

  register(id: string, resource: { cleanup: () => void; type: string }): void {
    // Clean up existing resource with same id
    this.cleanup(id);
    this.resources.set(id, resource);
  }

  cleanup(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      try {
        resource.cleanup();
      } catch (error) {
        console.warn(`Failed to cleanup resource ${id}:`, error);
      }
      this.resources.delete(id);
    }
  }

  cleanupAll(): void {
    this.resources.forEach((_, id) => {
      this.cleanup(id);
    });
  }

  getActiveResources(): Array<{ id: string; type: string }> {
    return Array.from(this.resources.entries()).map(([id, resource]) => ({
      id,
      type: resource.type
    }));
  }
}

/**
 * Comprehensive memory management hook
 */
export function useMemoryManagement(componentName: string) {
  const eventManager = new EventListenerManager();
  const timerManager = new TimerManager();
  const resourceManager = new ResourceManager();
  const detector = MemoryLeakDetector.getInstance();

  // Register component
  detector.registerComponent(componentName);

  const cleanup = () => {
    eventManager.removeAll();
    timerManager.clearAll();
    resourceManager.cleanupAll();
    detector.unregisterComponent(componentName);
  };

  return {
    eventManager,
    timerManager,
    resourceManager,
    cleanup,
    getMemoryStats: () => detector.getMemoryStats()
  };
}

// Global memory management instance
export const globalMemoryManager = {
  detector: MemoryLeakDetector.getInstance(),
  eventManager: new EventListenerManager(),
  timerManager: new TimerManager(),
  resourceManager: new ResourceManager()
};

// Initialize memory monitoring in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  globalMemoryManager.detector.startMonitoring(15000); // Check every 15 seconds
}

const MemoryManagement = {
  registerCleanup,
  executeCleanup,
  MemoryLeakDetector,
  EventListenerManager,
  TimerManager,
  ResourceManager,
  useMemoryManagement,
  globalMemoryManager
};

export default MemoryManagement;