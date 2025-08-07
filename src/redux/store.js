// src/redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for jobs
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [], // This will accumulate ALL jobs from all loaded pages
    categories: [],
    companies: [],
    loading: false,
    loadingMore: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalJobs: 0,
      jobsPerPage: 20,
      hasNextPage: false,
      hasPreviousPage: false,
      startIndex: 0,
      endIndex: 0
    },
    filters: {
      selectedCategory: [],
      selectedCompany: [],
      searchQuery: '',
      selectedExperience: [],
      selectedLocation: [],
      selectedType: [],
      selectedSalary: [],
    },
    sorting: {
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // For initial load or filter changes - REPLACE all jobs
    setJobsWithPagination(state, action) {
      const { jobs, pagination } = action.payload;
      console.log('🔄 Setting jobs with pagination:', { 
        newJobsCount: jobs.length, 
        page: pagination.currentPage 
      });
      
      state.jobs = jobs; // Replace with new jobs
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      state.loading = false;
      state.error = null;
    },
    
    // For infinite scroll - APPEND new jobs to existing ones
    appendJobsWithPagination(state, action) {
      const { jobs, pagination } = action.payload;
      
      console.log('➕ Appending jobs:', { 
        existingJobsCount: state.jobs.length,
        newJobsCount: jobs.length,
        fromPage: pagination.currentPage
      });
      
      // Create a Set of existing job IDs to avoid duplicates
      const existingJobIds = new Set(state.jobs.map(job => job.id));
      const newUniqueJobs = jobs.filter(job => !existingJobIds.has(job.id));
      
      console.log('📊 After duplicate filtering:', {
        duplicatesFound: jobs.length - newUniqueJobs.length,
        uniqueNewJobs: newUniqueJobs.length
      });
      
      // Append new unique jobs to existing ones
      state.jobs = [...state.jobs, ...newUniqueJobs];
      
      // Update pagination info
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      
      state.loadingMore = false;
      state.error = null;
      
      console.log('✅ Total jobs after append:', state.jobs.length);
    },
    
    // Reset jobs when filters change
    resetJobs(state) {
      console.log('🔄 Resetting jobs - clearing all loaded jobs');
      state.jobs = [];
      state.pagination = {
        ...state.pagination,
        currentPage: 1,
        totalPages: 0,
        totalJobs: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 0,
        endIndex: 0
      };
    },
    
    setCategories(state, action) {
      state.categories = action.payload;
    },
    
    setCompanies(state, action) {
      state.companies = action.payload;
    },
    
    setLoading(state, action) {
      state.loading = action.payload;
    },
    
    setLoadingMore(state, action) {
      state.loadingMore = action.payload;
    },
    
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.loadingMore = false;
    },
    
    setPagination(state, action) {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    
    setCurrentPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    
    setJobsPerPage(state, action) {
      state.pagination.jobsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    
    // All filter setters reset to page 1 and clear jobs
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSorting(state, action) {
      state.sorting = {
        ...state.sorting,
        ...action.payload
      };
      state.pagination.currentPage = 1;
    },
    
    clearFilters(state) {
      console.log('🧹 Clearing all filters');
      state.filters = {
        selectedCategory: [],
        selectedCompany: [],
        searchQuery: '',
        selectedExperience: [],
        selectedLocation: [],
        selectedType: [],
        selectedSalary: [],
      };
      state.pagination.currentPage = 1;
    },
  },
});

import savedJobsReducer from './savedJobsSlice';
import profileReducer from './profileSlice';

// Export actions for use in components
export const {
  setJobs,
  setJobsWithPagination,
  appendJobsWithPagination,
  resetJobs,
  setCategories,
  setCompanies,
  setLoading,
  setLoadingMore,
  setError,
  setPagination,
  setCurrentPage,
  setJobsPerPage,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  setSorting,
  clearFilters,
} = jobSlice.actions;

// Configure the store
const store = configureStore({
  reducer: {
    jobs: jobSlice.reducer,
    profile: profileReducer,
    savedJobs: savedJobsReducer,
  },
});

export default store;