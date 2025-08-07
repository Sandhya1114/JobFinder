// src/hooks/useDataLoader.js
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import {
  setJobsWithPagination,
  appendJobsWithPagination,
  setCategories,
  setCompanies,
  setLoading,
  setLoadingMore,
  setError,
  resetJobs
} from '../redux/store';

export const useDataLoader = () => {
  const dispatch = useDispatch();
  const { filters, pagination, sorting, loading, loadingMore } = useSelector((state) => state.jobs);
  
  // Track if a load more request is in progress
  const loadMoreInProgress = useRef(false);

  const loadJobs = useCallback(async (customParams = {}, isLoadMore = false) => {
    try {
      // Prevent multiple simultaneous load more requests
      if (isLoadMore && loadMoreInProgress.current) {
        console.log('Load more already in progress, skipping...');
        return;
      }

      if (isLoadMore) {
        loadMoreInProgress.current = true;
        dispatch(setLoadingMore(true));
      } else {
        dispatch(setLoading(true));
        dispatch(setError(null));
      }

      // Combine current state with custom parameters
      const params = {
        page: isLoadMore ? pagination.currentPage + 1 : pagination.currentPage,
        limit: pagination.jobsPerPage,
        category: filters.selectedCategory?.length ? filters.selectedCategory : undefined,
        company: filters.selectedCompany?.length ? filters.selectedCompany : undefined,
        experience: filters.selectedExperience?.length ? filters.selectedExperience : undefined,
        location: filters.selectedLocation?.length ? filters.selectedLocation : undefined,
        type: filters.selectedType?.length ? filters.selectedType : undefined,
        salary: filters.selectedSalary?.length ? filters.selectedSalary : undefined,
        search: filters.searchQuery?.trim() || undefined,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...customParams
      };

      // Clean up undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '' || 
            (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      console.log('Loading jobs with params:', params, 'isLoadMore:', isLoadMore);

      const response = await api.fetchJobs(params);
      
      if (response.jobs && response.pagination) {
        if (isLoadMore) {
          // Append new jobs to existing ones
          console.log(`Appending ${response.jobs.length} new jobs to existing ${pagination.currentPage} pages`);
          dispatch(appendJobsWithPagination({
            jobs: response.jobs,
            pagination: response.pagination
          }));
        } else {
          // Replace jobs (first load or filter change)
          console.log(`Loading ${response.jobs.length} jobs for page ${response.pagination.currentPage}`);
          dispatch(setJobsWithPagination({
            jobs: response.jobs,
            pagination: response.pagination
          }));
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
      dispatch(setError(error.message));
    } finally {
      if (isLoadMore) {
        dispatch(setLoadingMore(false));
        loadMoreInProgress.current = false;
      } else {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch, filters, pagination.currentPage, pagination.jobsPerPage, sorting]);

  const loadMoreJobs = useCallback(async () => {
    console.log('🔄 loadMoreJobs called with:', {
      hasNextPage: pagination.hasNextPage,
      loadingMore: loadingMore,
      loadMoreInProgress: loadMoreInProgress.current,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages
    });

    // Only load more if there are more pages available and we're not already loading
    if (pagination.hasNextPage && !loadingMore && !loading && !loadMoreInProgress.current) {
      console.log('✅ Loading more jobs - conditions met');
      return loadJobs({}, true);
    } else {
      console.log('❌ Not loading more jobs:', {
        hasNextPage: pagination.hasNextPage,
        loadingMore: loadingMore,
        loading: loading,
        loadMoreInProgress: loadMoreInProgress.current
      });
    }
  }, [loadJobs, pagination.hasNextPage, loadingMore, loading]);

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
    await Promise.all([
      loadCategories(),
      loadCompanies()
    ]);
    // Load initial jobs
    await loadJobs();
  }, [loadJobs, loadCategories, loadCompanies]);

  const refreshJobs = useCallback(() => {
    // Reset jobs and load from page 1
    loadMoreInProgress.current = false;
    dispatch(resetJobs());
    return loadJobs();
  }, [loadJobs, dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback(async () => {
    // Reset to first page and clear existing jobs when filters change
    loadMoreInProgress.current = false;
    dispatch(resetJobs());
    await loadJobs();
  }, [loadJobs, dispatch]);

  return {
    loadJobs,
    loadMoreJobs,
    loadCategories,
    loadCompanies,
    loadAllData,
    refreshJobs,
    handleFilterChange
  };
};