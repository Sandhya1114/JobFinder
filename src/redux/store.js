

// export default store;
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
    filters: {
      selectedCategory: [], // Changed to an array
      selectedCompany: [], // Changed to an array
      searchQuery: '',
      selectedExperience: [], // Changed to an array
      selectedLocation: [], // Changed to an array
      selectedType: [], // Changed to an array
      selectedSalary: [], // Changed to an array
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
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
    },
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
    },
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
    },
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
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
    },
  },
});
import savedJobsReducer, {
  saveJob,
  unsaveJob,
} from '../redux/savedJobsSlice'; // ✅ Assuming savedJobsSlice is in same directory

import profileReducer from '../redux/profileSlice'; // ✅ Assuming profileSlice is in same directory
// Export actions for use in components
export const { 
  setJobs, 
  setCategories, 
  setCompanies, 
  setLoading, 
  setError,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience, 
  setSelectedLocation, 
  setSelectedType,
  setSelectedSalary, 
  clearFilters,
  // saveJob,
  // unsaveJob,

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
