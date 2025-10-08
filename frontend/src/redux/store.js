
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
      allJobs: [] // Stores all loaded jobs for mobile
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
    // FIXED: Better duplicate handling in appendJobs
    // appendJobs(state, action) {
    //   const { jobs: newJobs, pagination, resetList = false } = action.payload;
      
    //   if (resetList) {
    //     // Reset the list with new jobs
    //     state.infiniteScroll.allJobs = newJobs || [];
    //     console.log('Reset infinite scroll jobs list with', newJobs?.length || 0, 'jobs');
    //   } else {
    //     // FIXED: Better duplicate detection using job ID and position
    //     const existingJobIds = new Set();
    //     const existingJobKeys = new Set();
        
    //     // Create sets of existing job identifiers
    //     state.infiniteScroll.allJobs.forEach(job => {
    //       existingJobIds.add(job.id);
    //       // Create a composite key for better duplicate detection
    //       existingJobKeys.add(`${job.id}-${job.title}-${job.companies?.name || job.company?.name}`);
    //     });
        
    //     // Filter out duplicates using multiple criteria
    //     const uniqueNewJobs = (newJobs || []).filter(job => {
    //       const jobKey = `${job.id}-${job.title}-${job.companies?.name || job.company?.name}`;
    //       return !existingJobIds.has(job.id) && !existingJobKeys.has(jobKey);
    //     });
        
    //     if (uniqueNewJobs.length > 0) {
    //       state.infiniteScroll.allJobs = [...state.infiniteScroll.allJobs, ...uniqueNewJobs];
    //       console.log('Appended', uniqueNewJobs.length, 'new unique jobs. Total jobs:', state.infiniteScroll.allJobs.length);
    //     } else {
    //       console.log('No new unique jobs to append. All', newJobs?.length || 0, 'jobs were duplicates.');
    //     }
    //   }
      
    //   if (pagination) {
    //     // Update the main pagination state
    //     state.pagination = {
    //       ...state.pagination,
    //       ...pagination,
    //       currentPage: pagination.currentPage || state.pagination.currentPage
    //     };
    //     state.infiniteScroll.hasMore = pagination.hasNextPage || false;
    //     console.log('Updated pagination - current page:', state.pagination.currentPage, 'hasMore:', state.infiniteScroll.hasMore);
    //   }
      
    //   state.infiniteScroll.isLoading = false;
    //   state.loading = false;
    //   state.error = null;
    // },
    appendJobs(state, action) {
  const { jobs: newJobs, pagination, resetList = false } = action.payload;

  if (resetList) {
    // Reset the list with new jobs
    state.infiniteScroll.allJobs = newJobs || [];
    console.log('Reset infinite scroll jobs list with', newJobs?.length || 0, 'jobs');
  } else {
    // Directly append new jobs without filtering for duplicates
    state.infiniteScroll.allJobs.push(...newJobs);
    console.log('Appended', newJobs.length, 'jobs. Total jobs:', state.infiniteScroll.allJobs.length);
  }

  if (pagination) {
    state.pagination = {
      ...state.pagination,
      ...pagination,
      currentPage: pagination.currentPage || state.pagination.currentPage
    };
    state.infiniteScroll.hasMore = pagination.hasNextPage || false;
    console.log('Updated pagination - current page:', state.pagination.currentPage, 'hasMore:', state.infiniteScroll.hasMore);
  }

  state.infiniteScroll.isLoading = false;
  state.loading = false;
  state.error = null;
}
,
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
      state.pagination.currentPage = 1;
      console.log('Reset infinite scroll state and current page to 1');
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
      console.log('Set current page to:', action.payload);
    },
    setJobsPerPage(state, action) {
      state.pagination.jobsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing page size
    },
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filter changes
      // Reset infinite scroll when filters change
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
    },
    setSorting(state, action) {
      state.sorting = {
        ...state.sorting,
        ...action.payload
      };
      state.pagination.currentPage = 1;
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
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
      state.infiniteScroll.allJobs = [];
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isLoading = false;
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

// Export actions for use in components
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