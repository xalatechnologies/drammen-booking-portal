
import React from 'react';
import { QueryClient as TanStackQueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // No cache - always fetch fresh data
      gcTime: 30 * 1000, // Keep in memory for 30 seconds only
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: true, // Always refetch on component mount
    },
  },
});

interface QueryClientProps {
  children: React.ReactNode;
}

export function QueryClient({ children }: QueryClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
