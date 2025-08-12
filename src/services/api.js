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
  async applyToJob(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  },

  async saveJob(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/saved-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async removeSavedJob(jobId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },
  async uploadResumeFile(filename, size) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/upload-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, size })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
  },
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  async fetchMySavedJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/my-saved-jobs`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },
   async fetchMyApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/my-applications`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }
};