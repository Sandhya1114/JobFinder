// advancedFilterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const advancedFilterSlice = createSlice({
  name: 'advancedFilter',
  initialState: {
    // Filter options from database
    filterOptions: {
      categories: [],
      companies: [],
      locations: [],
      types: [],
      experienceLevels: [],
      salaryRanges: [],
      stats: {
        totalCategories: 0,
        totalCompanies: 0,
        totalLocations: 0,
        totalTypes: 0,
        totalExperienceLevels: 0,
        minSalary: 0,
        maxSalary: 0
      }
    },
    
    // Job counts for each filter
    filterCounts: {
      categories: {},
      companies: {},
      locations: {},
      types: {},
      experienceLevels: {},
      totalJobs: 0
    },
    
    // Currently applied filters
    activeFilters: {
      categories: [],
      companies: [],
      locations: [],
      types: [],
      experienceLevels: [],
      salaryMin: null,
      salaryMax: null,
      search: ''
    },
    
    // Filtered jobs result
    filteredJobs: [],
    
    // Pagination for filtered results
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalJobs: 0,
      jobsPerPage: 20,
      hasNextPage: false,
      hasPreviousPage: false
    },
    
    // Sorting
    sorting: {
      sortBy: 'created_at',
      sortOrder: 'desc'
    },
    
    // Loading states
    loading: {
      options: false,
      counts: false,
      jobs: false
    },
    
    // Error state
    error: null,
    
    // UI state
    ui: {
      isFilterPanelOpen: false,
      expandedSections: {
        categories: true,
        companies: false,
        locations: false,
        types: false,
        experience: false,
        salary: false
      }
    }
  },
  
  reducers: {
    // Set filter options
    setFilterOptions(state, action) {
      state.filterOptions = action.payload;
      state.loading.options = false;
      state.error = null;
    },
    
    // Set filter counts
    setFilterCounts(state, action) {
      state.filterCounts = action.payload;
      state.loading.counts = false;
      state.error = null;
    },
    
    // Set filtered jobs
    setFilteredJobs(state, action) {
      const { jobs, pagination } = action.payload;
      state.filteredJobs = jobs;
      state.pagination = {
        ...state.pagination,
        ...pagination
      };
      state.loading.jobs = false;
      state.error = null;
    },
    
    // Toggle category filter
    toggleCategoryFilter(state, action) {
      const categoryId = action.payload;
      const index = state.activeFilters.categories.indexOf(categoryId);
      
      if (index === -1) {
        state.activeFilters.categories.push(categoryId);
      } else {
        state.activeFilters.categories.splice(index, 1);
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Toggle company filter
    toggleCompanyFilter(state, action) {
      const companyId = action.payload;
      const index = state.activeFilters.companies.indexOf(companyId);
      
      if (index === -1) {
        state.activeFilters.companies.push(companyId);
      } else {
        state.activeFilters.companies.splice(index, 1);
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Toggle location filter
    toggleLocationFilter(state, action) {
      const location = action.payload;
      const index = state.activeFilters.locations.indexOf(location);
      
      if (index === -1) {
        state.activeFilters.locations.push(location);
      } else {
        state.activeFilters.locations.splice(index, 1);
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Toggle type filter
    toggleTypeFilter(state, action) {
      const type = action.payload;
      const index = state.activeFilters.types.indexOf(type);
      
      if (index === -1) {
        state.activeFilters.types.push(type);
      } else {
        state.activeFilters.types.splice(index, 1);
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Toggle experience level filter
    toggleExperienceFilter(state, action) {
      const experience = action.payload;
      const index = state.activeFilters.experienceLevels.indexOf(experience);
      
      if (index === -1) {
        state.activeFilters.experienceLevels.push(experience);
      } else {
        state.activeFilters.experienceLevels.splice(index, 1);
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Set salary range
    setSalaryRange(state, action) {
      const { min, max } = action.payload;
      state.activeFilters.salaryMin = min;
      state.activeFilters.salaryMax = max;
      state.pagination.currentPage = 1;
    },
    
    // Set search query
    setFilterSearch(state, action) {
      state.activeFilters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    
    // Clear all filters
    clearAllFilters(state) {
      state.activeFilters = {
        categories: [],
        companies: [],
        locations: [],
        types: [],
        experienceLevels: [],
        salaryMin: null,
        salaryMax: null,
        search: ''
      };
      state.pagination.currentPage = 1;
    },
    
    // Clear specific filter type
    clearFilterType(state, action) {
      const filterType = action.payload;
      
      switch (filterType) {
        case 'categories':
          state.activeFilters.categories = [];
          break;
        case 'companies':
          state.activeFilters.companies = [];
          break;
        case 'locations':
          state.activeFilters.locations = [];
          break;
        case 'types':
          state.activeFilters.types = [];
          break;
        case 'experience':
          state.activeFilters.experienceLevels = [];
          break;
        case 'salary':
          state.activeFilters.salaryMin = null;
          state.activeFilters.salaryMax = null;
          break;
        case 'search':
          state.activeFilters.search = '';
          break;
      }
      
      state.pagination.currentPage = 1;
    },
    
    // Set current page
    setFilterPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    
    // Set sorting
    setFilterSorting(state, action) {
      state.sorting = {
        ...state.sorting,
        ...action.payload
      };
      state.pagination.currentPage = 1;
    },
    
    // Set loading states
    setFilterLoading(state, action) {
      const { type, isLoading } = action.payload;
      state.loading[type] = isLoading;
    },
    
    // Set error
    setFilterError(state, action) {
      state.error = action.payload;
      state.loading = {
        options: false,
        counts: false,
        jobs: false
      };
    },
    
    // Toggle filter panel
    toggleFilterPanel(state) {
      state.ui.isFilterPanelOpen = !state.ui.isFilterPanelOpen;
    },
    
    // Toggle expanded section
    toggleExpandedSection(state, action) {
      const section = action.payload;
      state.ui.expandedSections[section] = !state.ui.expandedSections[section];
    }
  }
});

export const {
  setFilterOptions,
  setFilterCounts,
  setFilteredJobs,
  toggleCategoryFilter,
  toggleCompanyFilter,
  toggleLocationFilter,
  toggleTypeFilter,
  toggleExperienceFilter,
  setSalaryRange,
  setFilterSearch,
  clearAllFilters,
  clearFilterType,
  setFilterPage,
  setFilterSorting,
  setFilterLoading,
  setFilterError,
  toggleFilterPanel,
  toggleExpandedSection
} = advancedFilterSlice.actions;

export default advancedFilterSlice.reducer;