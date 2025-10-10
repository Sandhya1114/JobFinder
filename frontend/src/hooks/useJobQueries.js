// // src/hooks/useJobQueries.js
// import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { api } from '../services/api';

// // Query keys for better cache management
// export const jobQueryKeys = {
//   all: ['jobs'],
//   lists: () => [...jobQueryKeys.all, 'list'],
//   list: (filters) => [...jobQueryKeys.lists(), { filters }],
//   details: () => [...jobQueryKeys.all, 'detail'],
//   detail: (id) => [...jobQueryKeys.details(), id],
//   categories: ['categories'],
//   companies: ['companies'],
//   filterOptions: ['filterOptions'],
// };

// /**
//  * Hook to fetch jobs with pagination and filters
//  * Data is cached and reused across route changes
//  */
// export const useJobs = (filters = {}, options = {}) => {
//   return useQuery({
//     queryKey: jobQueryKeys.list(filters),
//     queryFn: () => api.fetchJobs(filters),
//     staleTime: 10 * 60 * 1000, // 10 minutes
//     cacheTime: 15 * 60 * 1000, // 15 minutes
//     ...options,
//   });
// };

// /**
//  * Hook for infinite scroll pagination (mobile)
//  * Automatically handles loading more jobs
//  */
// export const useInfiniteJobs = (filters = {}, options = {}) => {
//   return useInfiniteQuery({
//     queryKey: [...jobQueryKeys.list(filters), 'infinite'],
//     queryFn: ({ pageParam = 1 }) => 
//       api.fetchJobs({ ...filters, page: pageParam }),
//     getNextPageParam: (lastPage) => {
//       const { pagination } = lastPage;
//       return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
//     },
//     staleTime: 10 * 60 * 1000,
//     cacheTime: 15 * 60 * 1000,
//     ...options,
//   });
// };

// /**
//  * Hook to fetch a single job by ID
//  */
// export const useJob = (id, options = {}) => {
//   return useQuery({
//     queryKey: jobQueryKeys.detail(id),
//     queryFn: () => api.fetchJobById(id),
//     enabled: !!id,
//     staleTime: 15 * 60 * 1000, // Job details stay fresh longer
//     ...options,
//   });
// };

// /**
//  * Hook to fetch categories
//  * Cached for a long time as categories rarely change
//  */
// export const useCategories = (options = {}) => {
//   return useQuery({
//     queryKey: jobQueryKeys.categories,
//     queryFn: () => api.fetchCategories(),
//     staleTime: 30 * 60 * 1000, // 30 minutes
//     cacheTime: 60 * 60 * 1000, // 1 hour
//     ...options,
//   });
// };

// /**
//  * Hook to fetch companies
//  * Cached for a long time as companies rarely change
//  */
// export const useCompanies = (options = {}) => {
//   return useQuery({
//     queryKey: jobQueryKeys.companies,
//     queryFn: () => api.fetchCompanies(),
//     staleTime: 30 * 60 * 1000, // 30 minutes
//     cacheTime: 60 * 60 * 1000, // 1 hour
//     ...options,
//   });
// };

// /**
//  * Hook to fetch dynamic filter options
//  * Cached for a long time as filter options change slowly
//  */
// export const useFilterOptions = (options = {}) => {
//   return useQuery({
//     queryKey: jobQueryKeys.filterOptions,
//     queryFn: () => api.fetchFilterOptions(),
//     staleTime: 30 * 60 * 1000, // 30 minutes
//     cacheTime: 60 * 60 * 1000, // 1 hour
//     ...options,
//   });
// };

// /**
//  * Hook to prefetch jobs (useful for preloading next page)
//  */
// export const usePrefetchJobs = () => {
//   const queryClient = useQueryClient();

//   const prefetchJobs = async (filters) => {
//     await queryClient.prefetchQuery({
//       queryKey: jobQueryKeys.list(filters),
//       queryFn: () => api.fetchJobs(filters),
//     });
//   };

//   return prefetchJobs;
// };

// /**
//  * Hook to invalidate job queries (force refresh)
//  */
// export const useInvalidateJobs = () => {
//   const queryClient = useQueryClient();

//   const invalidateJobs = () => {
//     queryClient.invalidateQueries({ queryKey: jobQueryKeys.all });
//   };

//   return invalidateJobs;
// };

// /**
//  * Hook for saving a job (mutation)
//  */
// export const useSaveJob = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ jobId, notes, priority }) => 
//       api.saveJob(jobId, notes, priority),
//     onSuccess: () => {
//       // Invalidate saved jobs queries after successful save
//       queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
//     },
//   });
// };

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Query key factory for better organization
export const jobsKeys = {
  all: ['jobs'],
  lists: () => [...jobsKeys.all, 'list'],
  list: (filters) => [...jobsKeys.lists(), filters],
  details: () => [...jobsKeys.all, 'detail'],
  detail: (id) => [...jobsKeys.details(), id],
  filterOptions: ['filterOptions'],
  categories: ['categories'],
  companies: ['companies'],
};

// Main jobs query hook
export const useJobsQuery = (filters, pagination, sorting) => {
  const queryClient = useQueryClient();

  // Build query key from current filters
  const queryKey = jobsKeys.list({
    ...filters,
    page: pagination.currentPage,
    limit: pagination.jobsPerPage,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const params = {
        page: pagination.currentPage,
        limit: pagination.jobsPerPage,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
      };

      // Add filters
      if (filters.selectedCategory?.length > 0) {
        params.category = filters.selectedCategory.join(',');
      }
      if (filters.selectedCompany?.length > 0) {
        params.company = filters.selectedCompany.join(',');
      }
      if (filters.selectedExperience?.length > 0) {
        params.experience = filters.selectedExperience.join(',');
      }
      if (filters.selectedLocation?.length > 0) {
        params.location = filters.selectedLocation.join(',');
      }
      if (filters.selectedType?.length > 0) {
        params.type = filters.selectedType.join(',');
      }
      if (filters.selectedSalary?.length > 0) {
        params.salary = filters.selectedSalary.join(',');
      }
      if (filters.searchQuery?.trim()) {
        params.search = filters.searchQuery.trim();
      }

      return api.fetchJobs(params);
    },
    // Keep previous data while fetching new data
    keepPreviousData: true,
    // Data is fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache for 10 minutes
    cacheTime: 10 * 60 * 1000,
  });

  // Prefetch next page for better UX
  const prefetchNextPage = () => {
    if (query.data?.pagination?.hasNextPage) {
      const nextPageKey = jobsKeys.list({
        ...filters,
        page: pagination.currentPage + 1,
        limit: pagination.jobsPerPage,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
      });

      queryClient.prefetchQuery({
        queryKey: nextPageKey,
        queryFn: async () => {
          const params = {
            page: pagination.currentPage + 1,
            limit: pagination.jobsPerPage,
            sortBy: sorting.sortBy,
            sortOrder: sorting.sortOrder,
          };
          // ... add filters (same as above)
          return api.fetchJobs(params);
        },
      });
    }
  };

  return {
    ...query,
    prefetchNextPage,
  };
};

// Filter options query
export const useFilterOptionsQuery = () => {
  return useQuery({
    queryKey: jobsKeys.filterOptions,
    queryFn: () => api.fetchFilterOptions(),
    staleTime: 10 * 60 * 1000, // 10 minutes - filter options rarely change
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Categories query
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: jobsKeys.categories,
    queryFn: () => api.fetchCategories(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

// Companies query
export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: jobsKeys.companies,
    queryFn: () => api.fetchCompanies(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

// Infinite scroll query for mobile
export const useInfiniteJobsQuery = (filters, sorting) => {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite', filters, sorting],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: 20,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
      };
      // ... add filters
      return api.fetchJobs(params);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });
};
