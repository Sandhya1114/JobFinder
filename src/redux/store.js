// import { configureStore, createSlice } from '@reduxjs/toolkit';

// const jobSlice = createSlice({
//   name: 'jobs',
//   initialState: {
//     jobs: [],
//   },
//   reducers: {
//     setJobs(state, action) {
//       state.jobs = action.payload;
//     },
//   },
// });

// export const { setJobs } = jobSlice.actions;

// const store = configureStore({
//   reducer: {
//     jobs: jobSlice.reducer,
//   },
// });

// export default store;
import { configureStore, createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    categories: [],
    companies: [],
    loading: false,
    error: null,
    filters: {
      selectedCategory: null,
      selectedCompany: null,
      searchQuery: '',
    },
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
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
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
    },
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
    },
    clearFilters(state) {
      state.filters = {
        selectedCategory: null,
        selectedCompany: null,
        searchQuery: '',
      };
    },
  },
});

export const { 
  setJobs, 
  setCategories, 
  setCompanies, 
  setLoading, 
  setError,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  clearFilters
} = jobSlice.actions;

const store = configureStore({
  reducer: {
    jobs: jobSlice.reducer,
  },
});

export default store;