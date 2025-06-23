import { StateCreator, StoreApi } from 'zustand';

/**
 * Logger middleware for Zustand stores
 * Logs all state changes with action name, previous state, next state, and timing
 */
export const logger = <T extends object>(
  config: StateCreator<T>,
  name = 'store'
): StateCreator<T> => {
  return (set, get, api) => {
    const loggedSet: typeof set = (...args) => {
      const isFunction = typeof args[0] === 'function';
      
      // Get the current state before the update
      const previousState = get();
      
      // Get the action name if available (for debugging)
      let actionName = 'unknown';
      if (isFunction) {
        // Try to extract function name from toString()
        const fnString = args[0].toString();
        const nameMatch = fnString.match(/(?:async\s+)?(?:function\s+)?([^()\s]+)\s*\(/);
        if (nameMatch && nameMatch[1]) {
          actionName = nameMatch[1];
        } else {
          // If we can't get the function name, use a timestamp
          actionName = `anonymous_${Date.now()}`;
        }
      }
      
      console.group(`%c${name}: ${actionName}`, 'color: #3498db; font-weight: bold');
      console.log('%cPrev State:', 'color: #8e44ad', previousState);
      
      const startTime = performance.now();
      
      // Apply the state update
      const result = set(...args);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Get the new state after the update
      const nextState = get();
      
      console.log('%cNext State:', 'color: #2ecc71', nextState);
      console.log(`%cDuration: ${duration.toFixed(2)}ms`, `color: ${duration > 10 ? '#e74c3c' : '#27ae60'}`);
      console.groupEnd();
      
      return result;
    };
    
    return config(loggedSet, get, api);
  };
};

/**
 * Create a logger middleware with a specific store name
 */
export const createLogger = (name: string) => {
  return <T extends object>(config: StateCreator<T>): StateCreator<T> => {
    return logger(config, name);
  };
};
