import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for jobs
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    categories: [],
    companies: [],
    loading: false,
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
    setJobsWithPagination(state, action) {
      const { jobs, pagination } = action.payload;
      state.jobs = jobs;
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      state.loading = false;
      state.error = null;
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
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
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
      state.pagination.currentPage = 1; // Reset to first page when changing page size
    },
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filter changes
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

import dashboardReducer from './dashboardSlice';
import profileReducer from './profileSlice';
import savedJobsReducer from './savedJobsSlice';
import educationReducer from './educationSlice';
import skillsReducer from './skillsSlice';
import workExperienceReducer from './workExperienceSlice';
import resumesReducer from './resumesSlice';

// Export actions for use in components
export const {
  setJobs,
  setJobsWithPagination,
  setCategories,
  setCompanies,
  setLoading,
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
    dashboard: dashboardReducer,
    education: educationReducer,
    skills: skillsReducer,
    workExperience: workExperienceReducer,
    resumes: resumesReducer,
  },
 middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;