// src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce refetch behavior to prevent conflicts with Redux
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      
      // Keep data fresh for reasonable time
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Error handling
      onError: (error) => {
        console.error('React Query Error:', error);
      },
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error('Mutation Error:', error);
      },
    },
  },
});