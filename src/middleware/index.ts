export { logger, createLogger } from './logger';
export { analytics, createAnalytics } from './analytics';
export { performanceMonitor, createPerformanceMonitor } from './performance';

/**
 * Combine multiple middleware functions into a single middleware
 * This allows for applying multiple middleware to a single store
 */
export function combineMiddleware<T extends object>(
  ...middlewares: Array<(config: any) => any>
) {
  return (config: any) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, config);
  };
}
