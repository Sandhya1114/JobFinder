
// // src/redux/store.js
// import { configureStore, createSlice } from '@reduxjs/toolkit';

// // Create a slice for jobs
// const jobSlice = createSlice({
//   name: 'jobs',
//   initialState: {
//     jobs: [],
//     categories: [],
//     companies: [],
//     loading: false,
//     error: null,
//     pagination: {
//       currentPage: 1,
//       totalPages: 0,
//       totalJobs: 0,
//       jobsPerPage: 20,
//       hasNextPage: false,
//       hasPreviousPage: false,
//       startIndex: 0,
//       endIndex: 0
//     },
//     filters: {
//       selectedCategory: [],
//       selectedCompany: [],
//       searchQuery: '',
//       selectedExperience: [],
//       selectedLocation: [],
//       selectedType: [],
//       selectedSalary: [],
//     },
//     sorting: {
//       sortBy: 'created_at',
//       sortOrder: 'desc'
//     }
//   },
//   reducers: {
//     setJobs(state, action) {
//       state.jobs = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setJobsWithPagination(state, action) {
//       const { jobs, pagination } = action.payload;
//       state.jobs = jobs;
//       state.pagination = {
//         ...state.pagination,
//         ...pagination
//       };
//       state.loading = false;
//       state.error = null;
//     },
//     setCategories(state, action) {
//       state.categories = action.payload;
//     },
//     setCompanies(state, action) {
//       state.companies = action.payload;
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setError(state, action) {
//       state.error = action.payload;
//       state.loading = false;
//     },
//     setPagination(state, action) {
//       state.pagination = {
//         ...state.pagination,
//         ...action.payload
//       };
//     },
//     setCurrentPage(state, action) {
//       state.pagination.currentPage = action.payload;
//     },
//     setJobsPerPage(state, action) {
//       state.pagination.jobsPerPage = action.payload;
//       state.pagination.currentPage = 1; // Reset to first page when changing page size
//     },
//     setSelectedCategory(state, action) {
//       state.filters.selectedCategory = action.payload;
//       state.pagination.currentPage = 1; // Reset to first page when filter changes
//     },
//     setSelectedCompany(state, action) {
//       state.filters.selectedCompany = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSearchQuery(state, action) {
//       state.filters.searchQuery = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSelectedExperience(state, action) {
//       state.filters.selectedExperience = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSelectedLocation(state, action) {
//       state.filters.selectedLocation = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSelectedType(state, action) {
//       state.filters.selectedType = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSelectedSalary(state, action) {
//       state.filters.selectedSalary = action.payload;
//       state.pagination.currentPage = 1;
//     },
//     setSorting(state, action) {
//       state.sorting = {
//         ...state.sorting,
//         ...action.payload
//       };
//       state.pagination.currentPage = 1;
//     },
//     clearFilters(state) {
//       state.filters = {
//         selectedCategory: [],
//         selectedCompany: [],
//         searchQuery: '',
//         selectedExperience: [],
//         selectedLocation: [],
//         selectedType: [],
//         selectedSalary: [],
//       };
//       state.pagination.currentPage = 1;
//     },
//   },
// });

// import savedJobsReducer from './savedJobsSlice';
// import profileReducer from './profileSlice';

// // Export actions for use in components
// export const {
//   setJobs,
//   setJobsWithPagination,
//   setCategories,
//   setCompanies,
//   setLoading,
//   setError,
//   setPagination,
//   setCurrentPage,
//   setJobsPerPage,
//   setSelectedCategory,
//   setSelectedCompany,
//   setSearchQuery,
//   setSelectedExperience,
//   setSelectedLocation,
//   setSelectedType,
//   setSelectedSalary,
//   setSorting,
//   clearFilters,
// } = jobSlice.actions;

// // Configure the store
// const store = configureStore({
//   reducer: {
//     jobs: jobSlice.reducer,
//     profile: profileReducer,
//     savedJobs: savedJobsReducer,
//   },
// });

// export default store;
// src/redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice for jobs with infinite scroll support
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    categories: [],
    companies: [],
    loading: false,
    loadingMore: false, // New: for loading more jobs
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
    // New: infinite scroll state
    infiniteScroll: {
      hasMore: true,
      // isInitialLoad: true,
      isInitialLoad:true,
      lastLoadedPage: 0
    }
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.infiniteScroll.isInitialLoad = false;
    },
    setJobsWithPagination(state, action) {
      const { jobs, pagination } = action.payload;
      state.jobs = jobs;
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.infiniteScroll.isInitialLoad = false;
    },
    // New: Append jobs for infinite scroll
    appendJobs(state, action) {
      const { jobs, pagination } = action.payload;
      state.jobs = [...state.jobs, ...jobs];
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      state.loadingMore = false;
      state.error = null;
      
      // Update infinite scroll state
      state.infiniteScroll.hasMore = pagination.hasNextPage;
      state.infiniteScroll.lastLoadedPage = pagination.currentPage;
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
      // Reset infinite scroll when changing page size
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
      state.pagination.currentPage = 1;
      // Reset infinite scroll when filter changes
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    setSorting(state, action) {
      state.sorting = {
        ...state.sorting,
        ...action.payload
      };
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
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
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    // New: Reset jobs for new search/filter
    resetJobs(state) {
      state.jobs = [];
      state.pagination.currentPage = 1;
      state.infiniteScroll.hasMore = true;
      state.infiniteScroll.isInitialLoad = true;
      state.infiniteScroll.lastLoadedPage = 0;
    },
    // New: Set infinite scroll state
    setInfiniteScrollState(state, action) {
      state.infiniteScroll = {
        ...state.infiniteScroll,
        ...action.payload
      };
    }
  },
});

import savedJobsReducer from './savedJobsSlice';
import profileReducer from './profileSlice';

// Export actions for use in components
export const {
  setJobs,
  setJobsWithPagination,
  appendJobs,
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
  resetJobs,
  setInfiniteScrollState
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