import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  setJobsWithPagination,
  setJobs,
  setCategories,
  setCompanies,
  setLoading,
  setError,
  setCurrentPage
} from '../redux/store';

export const useDataLoader = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { filters, pagination, sorting } = useSelector((state) => state.jobs);
  
  // Use refs to avoid stale closure issues
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);
  const sortingRef = useRef(sorting);
  
  // Track loading state to prevent multiple simultaneous calls
  const isLoadingRef = useRef(false);
  
  // Update refs when values change
  filtersRef.current = filters;
  paginationRef.current = pagination;
  sortingRef.current = sorting;

  const buildParams = useCallback((customParams = {}) => {
    const currentFilters = filtersRef.current;
    const currentPagination = paginationRef.current;
    const currentSorting = sortingRef.current;

    const params = {
      page: currentPagination.currentPage,
      limit: currentPagination.jobsPerPage,
      sortBy: currentSorting.sortBy,
      sortOrder: currentSorting.sortOrder,
      ...customParams
    };

    if (currentFilters.selectedCategory?.length > 0) {
      params.category = currentFilters.selectedCategory.join(',');
    }
    
    if (currentFilters.selectedCompany?.length > 0) {
      params.company = currentFilters.selectedCompany.join(',');
    }
    
    if (currentFilters.selectedExperience?.length > 0) {
      params.experience = currentFilters.selectedExperience.join(',');
    }
    
    if (currentFilters.selectedLocation?.length > 0) {
      params.location = currentFilters.selectedLocation.join(',');
    }
    
    if (currentFilters.selectedType?.length > 0) {
      params.type = currentFilters.selectedType.join(',');
    }
    
    if (currentFilters.selectedSalary?.length > 0) {
      params.salary = currentFilters.selectedSalary.join(',');
    }

    const searchQuery = currentFilters.searchQuery?.trim();
    if (searchQuery && searchQuery.length > 0) {
      params.search = searchQuery;
    }

    return params;
  }, []);

  // Create a stable cache key based on current filters
  const createCacheKey = useCallback((params) => {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return ['jobs', sortedParams];
  }, []);

  const loadJobs = useCallback(async (customParams = {}) => {
    if (isLoadingRef.current) {
      console.log('Load jobs already in progress, skipping...');
      return;
    }

    try {
      isLoadingRef.current = true;
      dispatch(setLoading(true));
      dispatch(setError(null));

      const params = buildParams(customParams);
      const cacheKey = createCacheKey(params);
      
      console.log('Loading jobs with params:', params);

      // Check if data exists in React Query cache
      const cachedData = queryClient.getQueryData(cacheKey);
      
      if (cachedData && !customParams.forceRefresh) {
        console.log('Using cached jobs data');
        dispatch(setJobsWithPagination({
          jobs: cachedData.jobs,
          pagination: cachedData.pagination
        }));
        dispatch(setLoading(false));
        isLoadingRef.current = false;
        return cachedData;
      }

      // Fetch fresh data if not in cache
      const response = await api.fetchJobs(params);
      
      if (response.jobs && response.pagination) {
        // Store in React Query cache
        queryClient.setQueryData(cacheKey, response);
        
        // Update Redux store
        dispatch(setJobsWithPagination({
          jobs: response.jobs,
          pagination: response.pagination
        }));
      } else {
        throw new Error('Invalid response structure');
      }
      
      return response;
    } catch (error) {
      console.error('Failed to load jobs:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      isLoadingRef.current = false;
    }
  }, [dispatch, buildParams, createCacheKey, queryClient]);

  const loadMoreJobs = useCallback(async () => {
    const currentPagination = paginationRef.current;
    
    if (!currentPagination.hasNextPage) {
      console.log('No more pages to load');
      return { hasMore: false, newJobs: [], pagination: currentPagination };
    }

    const nextPage = currentPagination.currentPage + 1;
    console.log(`Loading more jobs - page ${nextPage}`);

    try {
      const params = buildParams({
        page: nextPage,
        limit: currentPagination.jobsPerPage
      });

      const response = await api.fetchJobs(params);
      
      if (response.jobs && response.pagination) {
        dispatch(setCurrentPage(nextPage));

        // Cache the new page
        const cacheKey = createCacheKey(params);
        queryClient.setQueryData(cacheKey, response);

        return {
          hasMore: response.pagination.hasNextPage,
          newJobs: response.jobs,
          totalJobs: response.pagination.totalJobs,
          pagination: {
            ...response.pagination,
            currentPage: nextPage
          }
        };
      } else {
        throw new Error('Invalid response structure for load more');
      }
    } catch (error) {
      console.error('Failed to load more jobs:', error);
      dispatch(setCurrentPage(currentPagination.currentPage));
      
      return {
        hasMore: false,
        newJobs: [],
        pagination: currentPagination,
        error: error.message
      };
    }
  }, [dispatch, buildParams, createCacheKey, queryClient]);

  const loadCategories = useCallback(async () => {
    try {
      // Check cache first
      const cachedCategories = queryClient.getQueryData(['categories']);
      
      if (cachedCategories) {
        dispatch(setCategories(cachedCategories));
        return;
      }

      const response = await api.fetchCategories();
      const categories = response.categories || [];
      
      // Cache categories
      queryClient.setQueryData(['categories'], categories);
      dispatch(setCategories(categories));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, [dispatch, queryClient]);

  const loadCompanies = useCallback(async () => {
    try {
      // Check cache first
      const cachedCompanies = queryClient.getQueryData(['companies']);
      
      if (cachedCompanies) {
        dispatch(setCompanies(cachedCompanies));
        return;
      }

      const response = await api.fetchCompanies();
      const companies = response.companies || [];
      
      // Cache companies
      queryClient.setQueryData(['companies'], companies);
      dispatch(setCompanies(companies));
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  }, [dispatch, queryClient]);

  const loadAllData = useCallback(async () => {
    try {
      // Load categories and companies (they'll use cache if available)
      await Promise.all([
        loadCategories(),
        loadCompanies()
      ]);
      
      // Don't auto-load jobs here - let JobList component handle it
    } catch (error) {
      console.error('Failed to load all data:', error);
      dispatch(setError('Failed to load initial data'));
    }
  }, [loadCategories, loadCompanies, dispatch]);

  const refreshJobs = useCallback(() => {
    // Force refresh by invalidating cache
    const params = buildParams();
    const cacheKey = createCacheKey(params);
    queryClient.invalidateQueries(cacheKey);
    return loadJobs({ forceRefresh: true });
  }, [loadJobs, buildParams, createCacheKey, queryClient]);

  const resetInfiniteScroll = useCallback(() => {
    dispatch(setCurrentPage(1));
    isLoadingRef.current = false;
  }, [dispatch]);

  // Prefetch next page for better UX
  const prefetchNextPage = useCallback(() => {
    const currentPagination = paginationRef.current;
    
    if (currentPagination.hasNextPage) {
      const nextPage = currentPagination.currentPage + 1;
      const params = buildParams({
        page: nextPage,
        limit: currentPagination.jobsPerPage
      });
      const cacheKey = createCacheKey(params);
      
      queryClient.prefetchQuery({
        queryKey: cacheKey,
        queryFn: () => api.fetchJobs(params),
      });
    }
  }, [buildParams, createCacheKey, queryClient]);

  return {
    loadJobs,
    loadMoreJobs,
    loadCategories,
    loadCompanies,
    loadAllData,
    refreshJobs,
    resetInfiniteScroll,
    prefetchNextPage
  };
};