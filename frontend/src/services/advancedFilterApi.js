// advancedFilterApi.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const buildQueryString = (params) => {
  const filteredParams = {};
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filteredParams[key] = value.join(',');
        }
      } else {
        filteredParams[key] = value;
      }
    }
  });

  return new URLSearchParams(filteredParams).toString();
};

export const advancedFilterApi = {
  /**
   * Fetch all available filter options from database
   */
  async fetchFilterOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/advanced-filters/options`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Filter options loaded:', data);
      return data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  /**
   * Fetch job counts for each filter option
   */
  async fetchFilterCounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/advanced-filters/counts`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Filter counts loaded:', data);
      return data;
    } catch (error) {
      console.error('Error fetching filter counts:', error);
      throw error;
    }
  },

  /**
   * Fetch jobs with advanced filters applied
   */
  async fetchFilteredJobs(filterParams) {
    try {
      const {
        categories = [],
        companies = [],
        locations = [],
        types = [],
        experienceLevels = [],
        salaryMin = null,
        salaryMax = null,
        search = '',
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = filterParams;

      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(categories.length > 0 && { categories: categories.join(',') }),
        ...(companies.length > 0 && { companies: companies.join(',') }),
        ...(locations.length > 0 && { locations: locations.join(',') }),
        ...(types.length > 0 && { types: types.join(',') }),
        ...(experienceLevels.length > 0 && { experienceLevels: experienceLevels.join(',') }),
        ...(salaryMin && { salaryMin }),
        ...(salaryMax && { salaryMax }),
        ...(search && { search })
      };

      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/advanced-filters/jobs${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching filtered jobs from:', url);
      console.log('Filter params:', filterParams);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Filtered jobs response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching filtered jobs:', error);
      throw error;
    }
  },

  /**
   * Get filtered jobs count without fetching full data
   */
  async getFilteredJobsCount(filterParams) {
    try {
      const data = await this.fetchFilteredJobs({ ...filterParams, limit: 1 });
      return data.pagination.totalJobs;
    } catch (error) {
      console.error('Error getting filtered jobs count:', error);
      throw error;
    }
  }
};