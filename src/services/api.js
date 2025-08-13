// Updated api.js with better error handling and logging
const API_BASE_URL = 'http://localhost:5000/api';

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

// Helper function for better error handling
const handleApiResponse = async (response, context = '') => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errorDetails = '';
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        errorDetails = errorData.details || '';
      } else {
        errorDetails = await response.text();
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
    }
    
    const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
    console.error(`API Error (${context}):`, fullError);
    throw new Error(fullError);
  }

  try {
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (parseError) {
    console.error('Error parsing successful response:', parseError);
    throw new Error('Invalid response format');
  }
};

export const api = {
  // Test database connection
  async testConnection() {
    try {
      console.log('Testing database connection...');
      const response = await fetch(`${API_BASE_URL}/dashboard/test`);
      const data = await handleApiResponse(response, 'test connection');
      console.log('Connection test result:', data);
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  },

  async fetchJobs(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching jobs from URL:', url);
      console.log('Request params:', params);

      const response = await fetch(url);
      const data = await handleApiResponse(response, 'fetch jobs');
      
      console.log('Jobs API Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async fetchJobById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      return await handleApiResponse(response, 'fetch job by ID');
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  },

  async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return await handleApiResponse(response, 'fetch categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async fetchCompanies() {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`);
      return await handleApiResponse(response, 'fetch companies');
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  async fetchDashboardSummary() {
    try {
      console.log('Fetching dashboard summary...');
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
      const data = await handleApiResponse(response, 'fetch dashboard summary');
      console.log('Dashboard summary response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  async fetchProfile() {
    try {
      console.log('Fetching profile...');
      const response = await fetch(`${API_BASE_URL}/profile`);
      const data = await handleApiResponse(response, 'fetch profile');
      console.log('Profile response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      console.log('Updating profile with data:', profileData);
      
      // Validate required fields
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          skills: Array.isArray(profileData.skills) ? profileData.skills : []
        })
      });
      
      const data = await handleApiResponse(response, 'update profile');
      console.log('Profile update response:', data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadResumeFile(file) {
    try {
      console.log('Uploading resume file:', file.name, file.size, file.type);
      
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 10MB.');
      }

      const formData = new FormData();
      formData.append('resume', file);

      console.log('Sending file upload request...');

      const response = await fetch(`${API_BASE_URL}/dashboard/upload-resume`, {
        method: 'POST',
        body: formData // No Content-Type header, browser sets it
      });

      const data = await handleApiResponse(response, 'upload resume');
      console.log('Resume upload response:', data);
      return data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  },

  async applyToJob(jobId) {
    try {
      console.log('Applying to job:', jobId);
      
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await handleApiResponse(response, 'apply to job');
      console.log('Job application response:', data);
      return data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  },

  async saveJob(jobId) {
    try {
      console.log('Saving job:', jobId);
      
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/saved-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId })
      });
      
      const data = await handleApiResponse(response, 'save job');
      console.log('Save job response:', data);
      return data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async removeSavedJob(jobId) {
    try {
      console.log('Removing saved job:', jobId);
      
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await handleApiResponse(response, 'remove saved job');
      console.log('Remove saved job response:', data);
      return data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },

  async fetchMySavedJobs() {
    try {
      console.log('Fetching saved jobs...');
      const response = await fetch(`${API_BASE_URL}/dashboard/my-saved-jobs`);
      const data = await handleApiResponse(response, 'fetch saved jobs');
      console.log('Saved jobs response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  async fetchMyApplications() {
    try {
      console.log('Fetching applications...');
      const response = await fetch(`${API_BASE_URL}/dashboard/my-applications`);
      const data = await handleApiResponse(response, 'fetch applications');
      console.log('Applications response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // ========== STATS APIs ==========
  async getJobStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/stats`);
      return await handleApiResponse(response, 'fetch job stats');
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }
};