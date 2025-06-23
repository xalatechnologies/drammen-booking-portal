import { StateCreator } from 'zustand';

interface PerformanceMetric {
  action: string;
  duration: number;
  timestamp: number;
  stateSize: number;
}

/**
 * Performance monitoring middleware for Zustand stores
 * Tracks performance metrics for state updates
 */
export const performanceMonitor = <T extends object>(
  config: StateCreator<T>,
  options: {
    storeName: string;
    maxMetrics?: number;
    thresholdMs?: number;
    onPerformanceIssue?: (metric: PerformanceMetric) => void;
  } = { storeName: 'store' }
): StateCreator<T> => {
  // Initialize metrics storage
  const metrics: PerformanceMetric[] = [];
  
  const {
    storeName,
    maxMetrics = 100,
    thresholdMs = 16, // ~1 frame at 60fps
    onPerformanceIssue = (metric) => {
      console.warn(
        `Performance issue in ${storeName}: ${metric.action} took ${metric.duration.toFixed(2)}ms`,
        `(State size: ${formatBytes(metric.stateSize)})`
      );
    }
  } = options;
  
  return (set, get, api) => {
    const monitoredSet: typeof set = (...args) => {
      const isFunction = typeof args[0] === 'function';
      
      // Get the action name if available
      let actionName = 'unknown';
      if (isFunction) {
        const fnString = args[0].toString();
        const nameMatch = fnString.match(/(?:async\s+)?(?:function\s+)?([^()\s]+)\s*\(/);
        if (nameMatch && nameMatch[1]) {
          actionName = nameMatch[1];
        } else {
          actionName = `anonymous_${Date.now()}`;
        }
      }
      
      const startTime = performance.now();
      
      // Apply the state update
      const result = set(...args);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Get the new state and estimate its size
      const nextState = get();
      const stateSize = estimateObjectSize(nextState);
      
      // Record the metric
      const metric: PerformanceMetric = {
        action: actionName,
        duration,
        timestamp: Date.now(),
        stateSize
      };
      
      // Add to metrics history, keeping only the most recent
      metrics.push(metric);
      if (metrics.length > maxMetrics) {
        metrics.shift();
      }
      
      // Report if duration exceeds threshold
      if (duration > thresholdMs) {
        onPerformanceIssue(metric);
      }
      
      return result;
    };
    
    // Extend the API with performance methods
    const performanceApi = {
      ...api,
      getPerformanceMetrics: () => [...metrics],
      getAverageUpdateTime: () => {
        if (metrics.length === 0) return 0;
        const sum = metrics.reduce((acc, metric) => acc + metric.duration, 0);
        return sum / metrics.length;
      },
      getMaxUpdateTime: () => {
        if (metrics.length === 0) return 0;
        return Math.max(...metrics.map(metric => metric.duration));
      },
      getStateSize: () => estimateObjectSize(get()),
      clearMetrics: () => {
        metrics.length = 0;
      }
    };
    
    return config(monitoredSet, get, performanceApi);
  };
};

/**
 * Create a performance monitor middleware with specific options
 */
export const createPerformanceMonitor = (options: {
  storeName: string;
  maxMetrics?: number;
  thresholdMs?: number;
  onPerformanceIssue?: (metric: PerformanceMetric) => void;
}) => {
  return <T extends object>(config: StateCreator<T>): StateCreator<T> => {
    return performanceMonitor(config, options);
  };
};

/**
 * Estimate the size of an object in bytes
 * This is a rough estimate and not exact
 */
function estimateObjectSize(obj: any): number {
  const objectList = new WeakSet();
  
  function sizeOf(value: any): number {
    if (value === null) return 0;
    
    const type = typeof value;
    
    // Handle primitive types
    if (type === 'boolean') return 4;
    if (type === 'number') return 8;
    if (type === 'string') return value.length * 2;
    if (type === 'undefined') return 0;
    if (type === 'function') return 0; // Skip functions
    
    // Handle objects (including arrays)
    if (type === 'object') {
      // Avoid circular references
      if (objectList.has(value)) return 0;
      objectList.add(value);
      
      let size = 0;
      
      // Arrays
      if (Array.isArray(value)) {
        size = 40; // Array overhead
        for (let i = 0; i < value.length; i++) {
          size += sizeOf(value[i]);
        }
        return size;
      }
      
      // Objects
      size = 40; // Object overhead
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          size += key.length * 2; // Key size
          size += sizeOf(value[key]); // Value size
        }
      }
      return size;
    }
    
    return 0;
  }
  
  return sizeOf(obj);
}

/**
 * Format bytes to a human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
