// // // src/hooks/useDataLoader.js
// // import { useEffect } from 'react';
// // import { useDispatch } from 'react-redux';
// // import { api } from '../services/api';
// // import { 
// //   setJobs, 
// //   setCategories, 
// //   setCompanies, 
// //   setLoading, 
// //   setError 
// // } from '../redux/store';

// // export const useDataLoader = () => {
// //   const dispatch = useDispatch();

// //   const loadJobs = async () => {
// //     try {
// //       dispatch(setLoading(true));
// //       const response = await api.fetchJobs();
// //       dispatch(setJobs(response.jobs || []));
// //     } catch (error) {
// //       dispatch(setError(error.message));
// //     }
// //   };

// //   const loadCategories = async () => {
// //     try {
// //       const response = await api.fetchCategories();
// //       dispatch(setCategories(response.categories || []));
// //     } catch (error) {
// //       console.error('Failed to load categories:', error);
// //     }
// //   };

// //   const loadCompanies = async () => {
// //     try {
// //       const response = await api.fetchCompanies();
// //       dispatch(setCompanies(response.companies || []));
// //     } catch (error) {
// //       console.error('Failed to load companies:', error);
// //     }
// //   };

// //   const loadAllData = async () => {
// //     await Promise.all([
// //       loadJobs(),
// //       loadCategories(),
// //       loadCompanies()
// //     ]);
// //   };

// //   return {
// //     loadJobs,
// //     loadCategories,
// //     loadCompanies,
// //     loadAllData
// //   };
// // };
// // src/hooks/useDataLoader.js
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
//         category: filters.selectedCategory,
//         company: filters.selectedCompany,
//         experience: filters.selectedExperience,
//         location: filters.selectedLocation,
//         type: filters.selectedType,
//         salary: filters.selectedSalary,
//         search: filters.searchQuery?.trim() || '', // Ensure search is properly trimmed
//         sortBy: sorting.sortBy,
//         sortOrder: sorting.sortOrder,
//         ...customParams // Override with any custom parameters
//       };

//       // Remove empty search to avoid unnecessary filtering
//       if (!params.search) {
//         delete params.search;
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
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...customParams // Override with any custom parameters first
      };

      // Add filters only if they have values
      if (filters.selectedCategory && filters.selectedCategory.length > 0) {
        params.category = filters.selectedCategory.join(',');
      }
      
      if (filters.selectedCompany && filters.selectedCompany.length > 0) {
        params.company = filters.selectedCompany.join(',');
      }
      
      if (filters.selectedExperience && filters.selectedExperience.length > 0) {
        params.experience = filters.selectedExperience.join(',');
      }
      
      if (filters.selectedLocation && filters.selectedLocation.length > 0) {
        params.location = filters.selectedLocation.join(',');
      }
      
      if (filters.selectedType && filters.selectedType.length > 0) {
        params.type = filters.selectedType.join(',');
      }
      
      if (filters.selectedSalary && filters.selectedSalary.length > 0) {
        params.salary = filters.selectedSalary.join(',');
      }

      // Handle search query - ensure it's properly trimmed and not empty
      const searchQuery = filters.searchQuery?.trim();
      if (searchQuery && searchQuery.length > 0) {
        params.search = searchQuery;
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