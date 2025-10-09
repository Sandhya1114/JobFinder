// src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 10 minutes
      staleTime: 10 * 60 * 1000,
      // Keep unused data in cache for 15 minutes
      cacheTime: 15 * 60 * 1000,
      // Retry failed requests 1 time
      retry: 1,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data exists
      refetchOnMount: false,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
    },
  },
});