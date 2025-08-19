// import { useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { api } from '../services/api';
// import {
//   setJobsWithPagination,
//   setCategories,
//   setCompanies,
//   setLoading,
//   setError
// } from '../redux/store';

// export const useDataLoader = () => {
//   const dispatch = useDispatch();
//   const { filters, pagination, sorting } = useSelector((state) => state.jobs);

//   const loadJobs = useCallback(async (customParams = {}) => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));

//       // Combine current state with custom parameters
//       const params = {
//         page: pagination.currentPage,
//         limit: pagination.jobsPerPage,
//         sortBy: sorting.sortBy,
//         sortOrder: sorting.sortOrder,
//         ...customParams // Override with any custom parameters first
//       };

//       // Add filters only if they have values
//       if (filters.selectedCategory && filters.selectedCategory.length > 0) {
//         params.category = filters.selectedCategory.join(',');
//       }
      
//       if (filters.selectedCompany && filters.selectedCompany.length > 0) {
//         params.company = filters.selectedCompany.join(',');
//       }
      
//       if (filters.selectedExperience && filters.selectedExperience.length > 0) {
//         params.experience = filters.selectedExperience.join(',');
//       }
      
//       if (filters.selectedLocation && filters.selectedLocation.length > 0) {
//         params.location = filters.selectedLocation.join(',');
//       }
      
//       if (filters.selectedType && filters.selectedType.length > 0) {
//         params.type = filters.selectedType.join(',');
//       }
      
//       if (filters.selectedSalary && filters.selectedSalary.length > 0) {
//         params.salary = filters.selectedSalary.join(',');
//       }

//       // Handle search query - ensure it's properly trimmed and not empty
//       const searchQuery = filters.searchQuery?.trim();
//       if (searchQuery && searchQuery.length > 0) {
//         params.search = searchQuery;
//       }

//       console.log('Loading jobs with params:', params); // Debug log

//       const response = await api.fetchJobs(params);
      
//       if (response.jobs && response.pagination) {
//         dispatch(setJobsWithPagination({
//           jobs: response.jobs,
//           pagination: response.pagination
//         }));
//       } else {
//         throw new Error('Invalid response structure');
//       }
//     } catch (error) {
//       console.error('Failed to load jobs:', error);
//       dispatch(setError(error.message));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch, filters, pagination.currentPage, pagination.jobsPerPage, sorting]);

//   const loadCategories = useCallback(async () => {
//     try {
//       const response = await api.fetchCategories();
//       dispatch(setCategories(response.categories || []));
//     } catch (error) {
//       console.error('Failed to load categories:', error);
//     }
//   }, [dispatch]);

//   const loadCompanies = useCallback(async () => {
//     try {
//       const response = await api.fetchCompanies();
//       dispatch(setCompanies(response.companies || []));
//     } catch (error) {
//       console.error('Failed to load companies:', error);
//     }
//   }, [dispatch]);

//   const loadAllData = useCallback(async () => {
//     await Promise.all([
//       loadCategories(),
//       loadCompanies()
//     ]);
//     // Load jobs after categories and companies are loaded
//     await loadJobs();
//   }, [loadJobs, loadCategories, loadCompanies]);

//   const refreshJobs = useCallback(() => {
//     return loadJobs();
//   }, [loadJobs]);

//   return {
//     loadJobs,
//     loadCategories,
//     loadCompanies,
//     loadAllData,
//     refreshJobs
//   };
// };
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    // Combine current state with custom parameters
    const params = {
      page: currentPagination.currentPage,
      limit: currentPagination.jobsPerPage,
      sortBy: currentSorting.sortBy,
      sortOrder: currentSorting.sortOrder,
      ...customParams // Override with any custom parameters
    };

    // Add filters only if they have values
    if (currentFilters.selectedCategory && currentFilters.selectedCategory.length > 0) {
      params.category = currentFilters.selectedCategory.join(',');
    }
    
    if (currentFilters.selectedCompany && currentFilters.selectedCompany.length > 0) {
      params.company = currentFilters.selectedCompany.join(',');
    }
    
    if (currentFilters.selectedExperience && currentFilters.selectedExperience.length > 0) {
      params.experience = currentFilters.selectedExperience.join(',');
    }
    
    if (currentFilters.selectedLocation && currentFilters.selectedLocation.length > 0) {
      params.location = currentFilters.selectedLocation.join(',');
    }
    
    if (currentFilters.selectedType && currentFilters.selectedType.length > 0) {
      params.type = currentFilters.selectedType.join(',');
    }
    
    if (currentFilters.selectedSalary && currentFilters.selectedSalary.length > 0) {
      params.salary = currentFilters.selectedSalary.join(',');
    }

    // Handle search query - ensure it's properly trimmed and not empty
    const searchQuery = currentFilters.searchQuery?.trim();
    if (searchQuery && searchQuery.length > 0) {
      params.search = searchQuery;
    }

    return params;
  }, []); // Empty dependency array since we use refs

  const loadJobs = useCallback(async (customParams = {}) => {
    // Prevent multiple simultaneous calls for initial load
    if (isLoadingRef.current) {
      console.log('Load jobs already in progress, skipping...');
      return;
    }

    try {
      isLoadingRef.current = true;
      dispatch(setLoading(true));
      dispatch(setError(null));

      const params = buildParams(customParams);
      console.log('Loading jobs with params:', params);

      const response = await api.fetchJobs(params);
      
      if (response.jobs && response.pagination) {
        dispatch(setJobsWithPagination({
          jobs: response.jobs,
          pagination: response.pagination
        }));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      isLoadingRef.current = false;
    }
  }, [dispatch, buildParams]);

  // FIXED: Improved loadMoreJobs with better error handling and duplicate prevention
  const loadMoreJobs = useCallback(async () => {
    const currentPagination = paginationRef.current;
    
    // Don't load if already loading or no more pages
    if (!currentPagination.hasNextPage) {
      console.log('No more pages to load');
      return { hasMore: false, newJobs: [], pagination: currentPagination };
    }

    const nextPage = currentPagination.currentPage + 1;
    console.log(`Loading more jobs - page ${nextPage} (current: ${currentPagination.currentPage})`);

    try {
      // Build params for the next page
      const params = buildParams({
        page: nextPage,
        limit: currentPagination.jobsPerPage
      });

      console.log('Load more jobs params:', params);
      const response = await api.fetchJobs(params);
      
      if (response.jobs && response.pagination) {
        // Update the current page in Redux immediately
        dispatch(setCurrentPage(nextPage));

        console.log(`Successfully loaded page ${nextPage} with ${response.jobs.length} jobs`);
        console.log('API returned pagination:', response.pagination);

        // FIXED: Ensure we return the correct structure
        return {
          hasMore: response.pagination.hasNextPage,
          newJobs: response.jobs,
          totalJobs: response.pagination.totalJobs,
          pagination: {
            ...response.pagination,
            currentPage: nextPage // Ensure we return the correct current page
          }
        };
      } else {
        throw new Error('Invalid response structure for load more');
      }
    } catch (error) {
      console.error('Failed to load more jobs:', error);
      
      // Reset the page number on error
      dispatch(setCurrentPage(currentPagination.currentPage));
      
      // Return error state
      return {
        hasMore: false,
        newJobs: [],
        pagination: currentPagination,
        error: error.message
      };
    }
  }, [dispatch, buildParams]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.fetchCategories();
      dispatch(setCategories(response.categories || []));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, [dispatch]);

  const loadCompanies = useCallback(async () => {
    try {
      const response = await api.fetchCompanies();
      dispatch(setCompanies(response.companies || []));
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  }, [dispatch]);

  const loadAllData = useCallback(async () => {
    try {
      // Load categories and companies first
      await Promise.all([
        loadCategories(),
        loadCompanies()
      ]);
      
      // Then load jobs
      await loadJobs();
    } catch (error) {
      console.error('Failed to load all data:', error);
      dispatch(setError('Failed to load initial data'));
    }
  }, [loadJobs, loadCategories, loadCompanies, dispatch]);

  const refreshJobs = useCallback(() => {
    return loadJobs();
  }, [loadJobs]);

  // Helper function to reset for mobile infinite scroll
  const resetInfiniteScroll = useCallback(() => {
    dispatch(setCurrentPage(1));
    isLoadingRef.current = false;
  }, [dispatch]);

  return {
    loadJobs,
    loadMoreJobs,
    loadCategories,
    loadCompanies,
    loadAllData,
    refreshJobs,
    resetInfiniteScroll
  };
};