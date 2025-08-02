// src/services/api.js
const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // Fetch all jobs
  fetchJobs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch companies
  fetchCompanies: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Fetch job by ID
  fetchJobById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return await response.json();
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Fetch profile
  fetchProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};