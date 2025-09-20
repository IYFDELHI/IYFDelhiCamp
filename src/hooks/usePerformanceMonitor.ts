'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  frameRate: number;
  isLowPerformance: boolean;
  cpuUsage: number;
}

interface PerformanceThresholds {
  maxMemoryMB?: number;
  maxRenderTimeMs?: number;
  minFrameRate?: number;
  maxCpuUsage?: number;
}

/**
 * Performance monitoring hook for high-traffic scenarios
 * Prevents crashes by monitoring system resources
 */
export function usePerformanceMonitor(
  thresholds: PerformanceThresholds = {},
  onPerformanceIssue?: (metrics: PerformanceMetrics) => void
) {
  const {
    maxMemoryMB = 100,
    maxRenderTimeMs = 16,
    minFrameRate = 30,
    maxCpuUsage = 80
  } = thresholds;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    frameRate: 60,
    isLowPerformance: false,
    cpuUsage: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(0);
  const monitoringRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Memory usage monitoring
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
    }
    return 0;
  }, []);

  // Frame rate monitoring with proper cleanup
  const animationFrameRef = useRef<number | null>(null);
  
  const measureFrameRate = useCallback(() => {
    if (!mountedRef.current) return;

    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed);
      
      setMetrics(prev => ({
        ...prev,
        frameRate: fps,
        isLowPerformance: fps < minFrameRate
      }));

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    if (mountedRef.current) {
      animationFrameRef.current = requestAnimationFrame(measureFrameRate);
    }
  }, [minFrameRate]);

  // Render time monitoring
  const startRenderMeasure = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100
    }));
  }, []);

  // CPU usage estimation (simplified)
  const estimateCpuUsage = useCallback((): number => {
    const start = performance.now();
    let iterations = 0;
    
    // Simple CPU load test
    while (performance.now() - start < 1) {
      iterations++;
    }
    
    // Normalize to percentage (rough estimation)
    const baselineIterations = 100000;
    const usage = Math.min(100, Math.max(0, 100 - (iterations / baselineIterations) * 100));
    
    return Math.round(usage);
  }, []);

  // Performance monitoring loop with debouncing
  const monitorPerformance = useCallback(() => {
    if (!mountedRef.current) return;

    const memoryUsage = getMemoryUsage();
    const cpuUsage = estimateCpuUsage();
    
    setMetrics(prev => {
      const newMetrics: PerformanceMetrics = {
        memoryUsage,
        renderTime: prev.renderTime, // Use previous render time
        frameRate: prev.frameRate,   // Use previous frame rate
        cpuUsage,
        isLowPerformance: 
          memoryUsage > maxMemoryMB ||
          prev.renderTime > maxRenderTimeMs ||
          prev.frameRate < minFrameRate ||
          cpuUsage > maxCpuUsage
      };

      // Only trigger callback if performance issue is new or worsening
      if (newMetrics.isLowPerformance && !prev.isLowPerformance && onPerformanceIssue) {
        // Use setTimeout to avoid blocking the main thread
        setTimeout(() => onPerformanceIssue(newMetrics), 0);
      }

      return newMetrics;
    });
  }, [getMemoryUsage, estimateCpuUsage, maxMemoryMB, maxRenderTimeMs, minFrameRate, maxCpuUsage, onPerformanceIssue]);

  // Setup monitoring
  useEffect(() => {
    mountedRef.current = true;

    // Start frame rate monitoring
    animationFrameRef.current = requestAnimationFrame(measureFrameRate);

    // Start performance monitoring interval
    monitoringRef.current = setInterval(monitorPerformance, 2000);

    return () => {
      mountedRef.current = false;
      
      if (monitoringRef.current) {
        clearInterval(monitoringRef.current);
        monitoringRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [measureFrameRate, monitorPerformance]);

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure,
    isHealthy: !metrics.isLowPerformance
  };
}

/**
 * Hook for memory leak detection
 */
export function useMemoryLeakDetection(
  componentName: string,
  checkIntervalMs: number = 5000
) {
  const initialMemoryRef = useRef<number>(0);
  const [memoryGrowth, setMemoryGrowth] = useState(0);
  const [isLeaking, setIsLeaking] = useState(false);
  const checkCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      initialMemoryRef.current = memory?.usedJSHeapSize ?? 0;
    }

    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        const currentMemory = memory?.usedJSHeapSize ?? 0;
        const growth = currentMemory - initialMemoryRef.current;
        const growthMB = growth / 1024 / 1024;

        setMemoryGrowth(growthMB);
        
        checkCountRef.current++;
        
        // Consider it a leak if memory grows consistently over 10MB after 5 checks
        if (checkCountRef.current >= 5 && growthMB > 10) {
          setIsLeaking(true);
          console.warn(`Potential memory leak detected in ${componentName}: ${growthMB.toFixed(2)}MB growth`);
        }
      }
    }, checkIntervalMs);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [componentName, checkIntervalMs]);

  return { memoryGrowth, isLeaking };
}

/**
 * Hook for automatic garbage collection suggestions
 */
export function useGarbageCollectionOptimizer() {
  const lastGCRef = useRef(performance.now());
  const [shouldTriggerGC, setShouldTriggerGC] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const triggerGarbageCollection = useCallback(() => {
    if ('gc' in window && typeof (window as Window & { gc?: () => void }).gc === 'function') {
      try {
        (window as Window & { gc?: () => void }).gc?.();
        lastGCRef.current = performance.now();
        setShouldTriggerGC(false);
      } catch (error) {
        console.warn('Manual garbage collection failed:', error);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      
      const now = performance.now();
      const timeSinceLastGC = now - lastGCRef.current;
      
      // Suggest GC every 30 seconds under high load
      if (timeSinceLastGC > 30000) {
        setShouldTriggerGC(true);
      }
    }, 5000);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { shouldTriggerGC, triggerGarbageCollection };
}

const performanceHooks = {
  usePerformanceMonitor,
  useMemoryLeakDetection,
  useGarbageCollectionOptimizer
};

export default performanceHooks;