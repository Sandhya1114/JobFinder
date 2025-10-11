import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  setJobsWithPagination, 
  appendJobs,
  setCategories, 
  setCompanies,
  resetInfiniteScroll
} from '../redux/store';

// Query key factory
export const jobsKeys = {
  all: ['jobs'],
  lists: () => [...jobsKeys.all, 'list'],
  list: (filters) => [...jobsKeys.lists(), filters],
  filterOptions: ['filterOptions'],
  categories: ['categories'],
  companies: ['companies'],
};

// Main jobs query hook - syncs with Redux
export const useJobsQuery = (filters, pagination, sorting) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const previousFiltersRef = useRef(null);
  const isMobileRef = useRef(window.innerWidth <= 768);

  // Update mobile ref on window resize
  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth <= 768;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build query key
  const queryKey = jobsKeys.list({
    category: filters.selectedCategory,
    company: filters.selectedCompany,
    experience: filters.selectedExperience,
    location: filters.selectedLocation,
    type: filters.selectedType,
    salary: filters.selectedSalary,
    search: filters.searchQuery,
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

      console.log('🔍 React Query fetching jobs with params:', params);
      const data = await api.fetchJobs(params);
      console.log('✅ React Query received:', data?.jobs?.length, 'jobs');
      return data;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });

  // ✅ CRITICAL: Detect filter changes and reset mobile infinite scroll
  useEffect(() => {
    const currentFilters = JSON.stringify({
      category: filters.selectedCategory,
      company: filters.selectedCompany,
      experience: filters.selectedExperience,
      location: filters.selectedLocation,
      type: filters.selectedType,
      salary: filters.selectedSalary,
      search: filters.searchQuery,
    });

    const previousFilters = previousFiltersRef.current;

    // If filters changed and we're on mobile, reset infinite scroll
    if (previousFilters && previousFilters !== currentFilters && isMobileRef.current) {
      console.log('🔄 Filters changed on mobile - resetting infinite scroll');
      dispatch(resetInfiniteScroll());
    }

    previousFiltersRef.current = currentFilters;
  }, [filters, dispatch]);

  // ✅ CRITICAL: Sync React Query data to Redux whenever it changes
  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('📦 Syncing React Query data to Redux');
      
      const isMobile = isMobileRef.current;
      
      if (isMobile) {
        // Mobile: Use appendJobs for infinite scroll
        const isFirstPage = pagination.currentPage === 1;
        
        dispatch(appendJobs({ 
          jobs: query.data.jobs || [], 
          pagination: query.data.pagination,
          resetList: isFirstPage 
        }));
        
        console.log(`📱 Mobile: ${isFirstPage ? 'Reset' : 'Appended'} page ${pagination.currentPage}`);
      } else {
        // Desktop: Use setJobsWithPagination for regular pagination
        dispatch(setJobsWithPagination({
          jobs: query.data.jobs || [],
          pagination: query.data.pagination
        }));
        console.log('🖥️ Desktop: Set jobs with pagination');
      }
    }
  }, [query.isSuccess, query.data, dispatch, pagination.currentPage]);

  // Prefetch next page for better UX
  const prefetchNextPage = () => {
    if (query.data?.pagination?.hasNextPage) {
      const nextPageKey = jobsKeys.list({
        category: filters.selectedCategory,
        company: filters.selectedCompany,
        experience: filters.selectedExperience,
        location: filters.selectedLocation,
        type: filters.selectedType,
        salary: filters.selectedSalary,
        search: filters.searchQuery,
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Categories query - syncs with Redux
export const useCategoriesQuery = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: jobsKeys.categories,
    queryFn: async () => {
      const data = await api.fetchCategories();
      console.log('📊 Fetched categories:', data);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // ✅ Sync categories to Redux
  useEffect(() => {
    if (query.isSuccess && query.data?.categories) {
      dispatch(setCategories(query.data.categories));
      console.log('📦 Synced categories to Redux');
    }
  }, [query.isSuccess, query.data, dispatch]);

  return query;
};

// Companies query - syncs with Redux
export const useCompaniesQuery = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: jobsKeys.companies,
    queryFn: async () => {
      const data = await api.fetchCompanies();
      console.log('🏢 Fetched companies:', data);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // ✅ Sync companies to Redux
  useEffect(() => {
    if (query.isSuccess && query.data?.companies) {
      dispatch(setCompanies(query.data.companies));
      console.log('📦 Synced companies to Redux');
    }
  }, [query.isSuccess, query.data, dispatch]);

  return query;
};

// Invalidate queries helper
export const useInvalidateJobQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateJobs: () => {
      console.log('🔄 Invalidating job queries');
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
    invalidateFilterOptions: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.filterOptions });
    },
    invalidateCategories: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.categories });
    },
    invalidateCompanies: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.companies });
    },
    invalidateAll: () => {
      console.log('🔄 Invalidating all job-related queries');
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
      queryClient.invalidateQueries({ queryKey: jobsKeys.filterOptions });
      queryClient.invalidateQueries({ queryKey: jobsKeys.categories });
      queryClient.invalidateQueries({ queryKey: jobsKeys.companies });
    }
  };
};