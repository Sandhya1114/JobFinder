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
    },
    // Mobile infinite scroll state
    infiniteScroll: {
      isLoading: false,
      hasMore: true,
      allJobs: []
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
    appendJobs(state, action) {
      const { jobs: newJobs, pagination, resetList = false } = action.payload;

      if (resetList) {
        state.infiniteScroll.allJobs = newJobs || [];
        console.log('🔄 Reset infinite scroll jobs list with', newJobs?.length || 0, 'jobs');
      } else {
        const existingJobIds = new Set(state.infiniteScroll.allJobs.map(job => job.id));
        const uniqueNewJobs = (newJobs || []).filter(job => !existingJobIds.has(job.id));
        
        if (uniqueNewJobs.length > 0) {
          state.infiniteScroll.allJobs = [...state.infiniteScroll.allJobs, ...uniqueNewJobs];
          console.log('✅ Appended', uniqueNewJobs.length, 'new unique jobs. Total:', state.infiniteScroll.allJobs.length);
        } else {
          console.log('⚠️ No new unique jobs to append. All were duplicates.');
        }
      }

      if (pagination) {
        state.pagination = {
          ...state.pagination,
          ...pagination,
          currentPage: pagination.currentPage || state.pagination.currentPage
        };
        state.infiniteScroll.hasMore = pagination.hasNextPage || false;
      }

      state.infiniteScroll.isLoading = false;
      state.loading = false;
      state.error = null;
    },
    setInfiniteScrollLoading(state, action) {
      state.infiniteScroll.isLoading = action.payload;
    },
    setInfiniteScrollHasMore(state, action) {
      state.infiniteScroll.hasMore = action.payload;
    },
    resetInfiniteScroll(state) {
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
      console.log('🔄 Reset infinite scroll state');
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
      console.log('📄 Set current page to:', action.payload);
    },
    setJobsPerPage(state, action) {
      state.pagination.jobsPerPage = action.payload;
      state.pagination.currentPage = 1;
      console.log('📊 Set jobs per page to:', action.payload);
    },
    // FIXED: Don't reset infinite scroll on filter changes for desktop
    // Only reset current page and let React Query handle the rest
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
      state.pagination.currentPage = 1;
      console.log('🏷️ Set category filter:', action.payload);
    },
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
      state.pagination.currentPage = 1;
      console.log('🏢 Set company filter:', action.payload);
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
      console.log('🔍 Set search query:', action.payload);
    },
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
      state.pagination.currentPage = 1;
      console.log('💼 Set experience filter:', action.payload);
    },
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
      state.pagination.currentPage = 1;
      console.log('📍 Set location filter:', action.payload);
    },
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
      state.pagination.currentPage = 1;
      console.log('📅 Set type filter:', action.payload);
    },
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
      state.pagination.currentPage = 1;
      console.log('💰 Set salary filter:', action.payload);
    },
    setSorting(state, action) {
      state.sorting = {
        ...state.sorting,
        ...action.payload
      };
      state.pagination.currentPage = 1;
      console.log('🔀 Set sorting:', action.payload);
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
      console.log('🧹 Cleared all filters');
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
import advancedFilterReducer from './advancedFilterSlice';

// Export actions
export const {
  setJobs,
  setJobsWithPagination,
  appendJobs,
  setInfiniteScrollLoading,
  setInfiniteScrollHasMore,
  resetInfiniteScroll,
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
    advancedFilter: advancedFilterReducer,
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