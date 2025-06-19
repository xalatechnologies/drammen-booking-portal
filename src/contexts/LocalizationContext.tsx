
import React from 'react';

interface LocalizationContextProps {
  children: React.ReactNode;
}

export function LocalizationContext({ children }: LocalizationContextProps) {
  return <>{children}</>;
}
