// api.js - Debug version with better error handling and logging
const API_BASE_URL =  'http://localhost:5000/api';

const buildQueryString = (params) => {
  const filteredParams = {};
  
  // Only include parameters that have meaningful values
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      // For arrays, only include if they have items
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filteredParams[key] = value;
        }
      } else {
        filteredParams[key] = value;
      }
    }
  });

  const queryString = new URLSearchParams(filteredParams).toString();
  console.log('Built query string:', queryString); // Debug log
  return queryString;
};

export const api = {
  async fetchJobs(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching jobs from URL:', url); // Debug log
      console.log('Request params:', params); // Debug log

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async fetchJobById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  },

  async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async fetchCompanies() {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  async fetchProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async uploadResume(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  },

  async getJobStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }
};