import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  categories: [],
  companies: [],
  loading: false,
  error: null,
  filters: {
    selectedCategory: null,
    selectedCompany: null,
    searchQuery: '',
    selectedExperience: null,
    selectedLocation: null,
    selectedType: null,
    selectedSalary: null,
  },
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Job data management
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

    // Filters
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

    // Reset all filters
    clearFilters(state) {
      state.filters = {
        selectedCategory: null,
        selectedCompany: null,
        searchQuery: '',
        selectedExperience: null,
        selectedLocation: null,
        selectedType: null,
        selectedSalary: null,
      };
    },
  },
});

// Export actions and reducer
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
} = jobSlice.actions;

export default jobSlice.reducer;
