import { StateCreator } from 'zustand';

/**
 * Analytics middleware for Zustand stores
 * Tracks state changes and sends them to analytics providers
 */
export const analytics = <T extends object>(
  config: StateCreator<T>,
  options: {
    storeName: string;
    trackableActions?: string[];
    analyticsEnabled?: boolean;
    onEvent?: (eventName: string, data: any) => void;
  } = { storeName: 'store' }
): StateCreator<T> => {
  return (set, get, api) => {
    const {
      storeName,
      trackableActions = [],
      analyticsEnabled = process.env.NODE_ENV === 'production',
      onEvent = (eventName, data) => {
        // Default implementation - can be replaced with actual analytics service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', eventName, data);
        }
      }
    } = options;
    
    const trackedSet: typeof set = (...args) => {
      const isFunction = typeof args[0] === 'function';
      const previousState = get();
      
      // Apply the state update
      const result = set(...args);
      
      // Only track if analytics is enabled
      if (analyticsEnabled) {
        try {
          // Get the action name if available
          let actionName = 'state_update';
          let shouldTrack = trackableActions.length === 0; // Track all if no specific actions
          
          if (isFunction) {
            // Try to extract function name from toString()
            const fnString = args[0].toString();
            const nameMatch = fnString.match(/(?:async\s+)?(?:function\s+)?([^()\s]+)\s*\(/);
            if (nameMatch && nameMatch[1]) {
              actionName = nameMatch[1];
              // Check if this action should be tracked
              shouldTrack = trackableActions.length === 0 || trackableActions.includes(actionName);
            }
          }
          
          if (shouldTrack) {
            const nextState = get();
            
            // Create a sanitized version of the state for analytics
            // This removes sensitive data and reduces payload size
            const sanitizedPrevState = sanitizeState(previousState);
            const sanitizedNextState = sanitizeState(nextState);
            
            // Track the state change
            onEvent(`${storeName}_${actionName}`, {
              store: storeName,
              action: actionName,
              stateChanges: getStateChanges(sanitizedPrevState, sanitizedNextState),
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          // Never let analytics break the application
          console.error('Analytics error:', error);
        }
      }
      
      return result;
    };
    
    return config(trackedSet, get, api);
  };
};

/**
 * Create an analytics middleware with specific options
 */
export const createAnalytics = (options: {
  storeName: string;
  trackableActions?: string[];
  analyticsEnabled?: boolean;
  onEvent?: (eventName: string, data: any) => void;
}) => {
  return <T extends object>(config: StateCreator<T>): StateCreator<T> => {
    return analytics(config, options);
  };
};

/**
 * Sanitize state for analytics by removing sensitive data
 * and reducing payload size
 */
function sanitizeState(state: any): any {
  if (!state || typeof state !== 'object') {
    return state;
  }
  
  // Create a new object to avoid modifying the original
  const sanitized: any = Array.isArray(state) ? [] : {};
  
  // List of sensitive keys to remove or mask
  const sensitiveKeys = [
    'password', 'token', 'secret', 'apiKey', 'key', 'auth',
    'credit', 'card', 'cvv', 'cvc', 'pin', 'ssn', 'social'
  ];
  
  // Keys to exclude entirely (too large or not useful)
  const excludeKeys = ['error', 'errors', 'logs', 'rawData', 'html'];
  
  for (const key in state) {
    // Skip if this is an excluded key
    if (excludeKeys.some(excluded => key.toLowerCase().includes(excluded))) {
      continue;
    }
    
    // Mask if this is a sensitive key
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    const value = state[key];
    
    // Handle different types of values
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'function') {
      // Skip functions
      continue;
    } else if (typeof value === 'object') {
      if (Object.keys(value).length > 20) {
        // If object is too large, just indicate its size
        sanitized[key] = `[Object with ${Object.keys(value).length} keys]`;
      } else if (Array.isArray(value) && value.length > 20) {
        // If array is too large, just indicate its length
        sanitized[key] = `[Array with ${value.length} items]`;
      } else {
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeState(value);
      }
    } else {
      // For primitive values, include them directly
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Get changes between previous and next state
 */
function getStateChanges(prevState: any, nextState: any): Record<string, { prev: any; next: any }> {
  const changes: Record<string, { prev: any; next: any }> = {};
  
  // Check for added or changed keys
  for (const key in nextState) {
    if (!(key in prevState) || JSON.stringify(prevState[key]) !== JSON.stringify(nextState[key])) {
      changes[key] = {
        prev: key in prevState ? prevState[key] : undefined,
        next: nextState[key]
      };
    }
  }
  
  // Check for removed keys
  for (const key in prevState) {
    if (!(key in nextState)) {
      changes[key] = {
        prev: prevState[key],
        next: undefined
      };
    }
  }
  
  return changes;
}
