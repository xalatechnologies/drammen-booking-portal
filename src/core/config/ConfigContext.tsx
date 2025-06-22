/**
 * Configuration Context
 * 
 * Provides React context for configuration access throughout the application
 * following the Dependency Inversion Principle.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { IConfig } from './interfaces/IConfig';
import { getConfig } from './ConfigFactory';

// Create the context with a default undefined value
const ConfigContext = createContext<IConfig | undefined>(undefined);

interface ConfigProviderProps {
  config?: IConfig;
  children: ReactNode;
}

/**
 * Provider component that makes configuration available to any
 * nested components that need to access it.
 */
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ 
  config = getConfig(), 
  children 
}) => {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook that lets components easily access the configuration
 * while maintaining dependency inversion.
 */
export const useConfig = (): IConfig => {
  const context = useContext(ConfigContext);
  
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
};

/**
 * Higher-order component for wrapping components that need configuration
 * This allows easier testing and dependency injection.
 */
export function withConfig<P extends object>(
  Component: React.ComponentType<P & { config: IConfig }>
): React.FC<P> {
  return (props: P) => {
    const config = useConfig();
    return <Component {...props} config={config} />;
  };
}
