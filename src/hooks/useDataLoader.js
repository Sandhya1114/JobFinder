// src/hooks/useDataLoader.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import {
  setJobsWithPagination,
  setCategories,
  setCompanies,
  setLoading,
  setError
} from '../redux/store';

export const useDataLoader = () => {
  const dispatch = useDispatch();
  const { filters, pagination, sorting } = useSelector((state) => state.jobs);

  const loadJobs = useCallback(async (customParams = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Combine current state with custom parameters
      const params = {
        page: pagination.currentPage,
        limit: pagination.jobsPerPage,
        category: filters.selectedCategory,
        company: filters.selectedCompany,
        experience: filters.selectedExperience,
        location: filters.selectedLocation,
        type: filters.selectedType,
        salary: filters.selectedSalary,
        search: filters.searchQuery?.trim() || '', // Ensure search is properly trimmed
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...customParams // Override with any custom parameters
      };

      // Remove empty search to avoid unnecessary filtering
      if (!params.search) {
        delete params.search;
      }

      console.log('Loading jobs with params:', params); // Debug log

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
    }
  }, [dispatch, filters, pagination.currentPage, pagination.jobsPerPage, sorting]);

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
    // Load jobs after categories and companies are loaded
    await loadJobs();
  }, [loadJobs, loadCategories, loadCompanies]);

  const refreshJobs = useCallback(() => {
    return loadJobs();
  }, [loadJobs]);

  return {
    loadJobs,
    loadCategories,
    loadCompanies,
    loadAllData,
    refreshJobs
  };
};