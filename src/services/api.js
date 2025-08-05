// // src/services/api.js
// const API_BASE_URL = 'http://localhost:5000';

// export const api = {
//   // Fetch all jobs
//   fetchJobs: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/jobs`);
//       if (!response.ok) throw new Error('Failed to fetch jobs');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       throw error;
//     }
//   },

//   // Fetch categories
//   fetchCategories: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/categories`);
//       if (!response.ok) throw new Error('Failed to fetch categories');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       throw error;
//     }
//   },

//   // Fetch companies
//   fetchCompanies: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/companies`);
//       if (!response.ok) throw new Error('Failed to fetch companies');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error;
//     }
//   },

//   // Fetch job by ID
//   fetchJobById: async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
//       if (!response.ok) throw new Error('Failed to fetch job');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching job:', error);
//       throw error;
//     }
//   },

//   // Fetch stats
//   fetchStats: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/jobs/stats`);
//       if (!response.ok) throw new Error('Failed to fetch stats');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       throw error;
//     }
//   },

//   // Fetch profile
//   fetchProfile: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/profile`);
//       if (!response.ok) throw new Error('Failed to fetch profile');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       throw error;
//     }
//   }
// };
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // Fetch jobs with pagination and filters
  fetchJobs: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        company,
        experience,
        location,
        type,
        salary,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      // Add filter parameters if they exist
      if (category && category.length > 0) {
        queryParams.append('category', Array.isArray(category) ? category.join(',') : category);
      }
      if (company && company.length > 0) {
        queryParams.append('company', Array.isArray(company) ? company.join(',') : company);
      }
      if (experience && experience.length > 0) {
        queryParams.append('experience', Array.isArray(experience) ? experience.join(',') : experience);
      }
      if (location && location.length > 0) {
        queryParams.append('location', Array.isArray(location) ? location.join(',') : location);
      }
      if (type && type.length > 0) {
        queryParams.append('type', Array.isArray(type) ? type.join(',') : type);
      }
      if (salary && salary.length > 0) {
        queryParams.append('salary', Array.isArray(salary) ? salary.join(',') : salary);
      }
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }

      console.log('API Request URL:', `${API_BASE_URL}/api/jobs?${queryParams}`); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`);
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