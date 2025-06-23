# Zustand Middleware

This directory contains middleware for enhancing Zustand stores with additional capabilities like logging, analytics, and performance monitoring.

## Available Middleware

### Logger Middleware

The logger middleware logs all state changes with action name, previous state, next state, and timing information. This is useful for debugging and development.

```typescript
import { create } from 'zustand';
import { createLogger } from '@/zustand-only/middleware';

const useStore = create(
  createLogger('StoreName')(
    (set) => ({
      // Store implementation
    })
  )
);
```

### Analytics Middleware

The analytics middleware tracks state changes and sends them to analytics providers. It supports filtering actions to track and sanitizing sensitive data.

```typescript
import { create } from 'zustand';
import { createAnalytics } from '@/zustand-only/middleware';

const useStore = create(
  createAnalytics({
    storeName: 'UserStore',
    trackableActions: ['login', 'logout', 'updateProfile'],
    analyticsEnabled: process.env.NODE_ENV === 'production'
  })(
    (set) => ({
      // Store implementation
    })
  )
);
```

### Performance Monitoring Middleware

The performance monitoring middleware tracks performance metrics for state updates and reports issues when updates take longer than a specified threshold.

```typescript
import { create } from 'zustand';
import { createPerformanceMonitor } from '@/zustand-only/middleware';

const useStore = create(
  createPerformanceMonitor({
    storeName: 'CartStore',
    thresholdMs: 16, // ~1 frame at 60fps
    maxMetrics: 100
  })(
    (set) => ({
      // Store implementation
    })
  )
);
```

### Combining Middleware

You can combine multiple middleware using the `combineMiddleware` function:

```typescript
import { create } from 'zustand';
import { 
  combineMiddleware, 
  createLogger, 
  createAnalytics, 
  createPerformanceMonitor 
} from '@/zustand-only/middleware';

const useStore = create(
  combineMiddleware(
    createLogger('StoreName'),
    createAnalytics({ storeName: 'StoreName' }),
    createPerformanceMonitor({ storeName: 'StoreName' })
  )(
    (set) => ({
      // Store implementation
    })
  )
);
```

## Best Practices

1. **Development vs. Production**: Use logger middleware only in development environments to avoid performance impacts in production.

2. **Sensitive Data**: Be careful with logging and analytics middleware to avoid exposing sensitive user data. The analytics middleware includes sanitization, but review what data is being tracked.

3. **Performance Impact**: Middleware adds overhead to state updates. Use performance monitoring to identify bottlenecks and optimize as needed.

4. **Custom Middleware**: You can create custom middleware by following the pattern in the existing middleware implementations.

5. **Middleware Order**: When combining middleware, the order matters. The middleware is applied from right to left, so the first middleware in the list will be the outermost wrapper.
