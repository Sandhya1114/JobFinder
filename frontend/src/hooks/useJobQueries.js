// src/hooks/useJobQueries.js
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Query keys for better cache management
export const jobQueryKeys = {
  all: ['jobs'],
  lists: () => [...jobQueryKeys.all, 'list'],
  list: (filters) => [...jobQueryKeys.lists(), { filters }],
  details: () => [...jobQueryKeys.all, 'detail'],
  detail: (id) => [...jobQueryKeys.details(), id],
  categories: ['categories'],
  companies: ['companies'],
  filterOptions: ['filterOptions'],
};

/**
 * Hook to fetch jobs with pagination and filters
 * Data is cached and reused across route changes
 */
export const useJobs = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: jobQueryKeys.list(filters),
    queryFn: () => api.fetchJobs(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

/**
 * Hook for infinite scroll pagination (mobile)
 * Automatically handles loading more jobs
 */
export const useInfiniteJobs = (filters = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: [...jobQueryKeys.list(filters), 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      api.fetchJobs({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single job by ID
 */
export const useJob = (id, options = {}) => {
  return useQuery({
    queryKey: jobQueryKeys.detail(id),
    queryFn: () => api.fetchJobById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // Job details stay fresh longer
    ...options,
  });
};

/**
 * Hook to fetch categories
 * Cached for a long time as categories rarely change
 */
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: jobQueryKeys.categories,
    queryFn: () => api.fetchCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

/**
 * Hook to fetch companies
 * Cached for a long time as companies rarely change
 */
export const useCompanies = (options = {}) => {
  return useQuery({
    queryKey: jobQueryKeys.companies,
    queryFn: () => api.fetchCompanies(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

/**
 * Hook to fetch dynamic filter options
 * Cached for a long time as filter options change slowly
 */
export const useFilterOptions = (options = {}) => {
  return useQuery({
    queryKey: jobQueryKeys.filterOptions,
    queryFn: () => api.fetchFilterOptions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

/**
 * Hook to prefetch jobs (useful for preloading next page)
 */
export const usePrefetchJobs = () => {
  const queryClient = useQueryClient();

  const prefetchJobs = async (filters) => {
    await queryClient.prefetchQuery({
      queryKey: jobQueryKeys.list(filters),
      queryFn: () => api.fetchJobs(filters),
    });
  };

  return prefetchJobs;
};

/**
 * Hook to invalidate job queries (force refresh)
 */
export const useInvalidateJobs = () => {
  const queryClient = useQueryClient();

  const invalidateJobs = () => {
    queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
  };

  return invalidateJobs;
};

/**
 * Hook for saving a job (mutation)
 */
export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, notes, priority }) => 
      api.saveJob(jobId, notes, priority),
    onSuccess: () => {
      // Invalidate saved jobs queries after successful save
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
  });
};