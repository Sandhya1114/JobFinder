// const API_BASE_URL =  'http://localhost:5000/api';

// const buildQueryString = (params) => {
//   const filteredParams = {};
  
//   // Only include parameters that have meaningful values
//   Object.keys(params).forEach(key => {
//     const value = params[key];
//     if (value !== undefined && value !== null && value !== '') {
//       // For arrays, only include if they have items
//       if (Array.isArray(value)) {
//         if (value.length > 0) {
//           filteredParams[key] = value;
//         }
//       } else {
//         filteredParams[key] = value;
//       }
//     }
//   });

//   const queryString = new URLSearchParams(filteredParams).toString();
//   console.log('Built query string:', queryString); // Debug log
//   return queryString;
// };

// export const api = {
//   async fetchJobs(params = {}) {
//     try {
//       const queryString = buildQueryString(params);
//       const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
      
//       console.log('Fetching jobs from URL:', url); // Debug log
//       console.log('Request params:', params); // Debug log

//       const response = await fetch(url);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error Response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('API Response:', data); // Debug log
      
//       return data;
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       throw error;
//     }
//   },

//   async fetchJobById(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching job by ID:', error);
//       throw error;
//     }
//   },

//   async fetchCategories() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/categories`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       throw error;
//     }
//   },

//   async fetchCompanies() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/companies`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error;
//     }
//   },

//   async fetchProfile() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/profile`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       throw error;
//     }
//   },

//   async uploadResume(formData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/upload-resume`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error uploading resume:', error);
//       throw error;
//     }
//   },

//   async getJobStats() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/jobs/stats`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching job stats:', error);
//       throw error;
//     }
//   }
// };
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

// Get auth token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem('authToken') || null;
};

// Make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.error('Unauthorized request');
      throw new Error('Please log in to access this feature');
    }
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response;
};

export const api = {
  // ============ EXISTING JOB SEARCH API ============
  async fetchJobs(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching jobs from URL:', url);
      console.log('Request params:', params);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
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

  // ============ DASHBOARD API METHODS ============

  // Profile API
  async fetchProfile() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/profile`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Education API
  async fetchEducation() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/education`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching education:', error);
      throw error;
    }
  },

  async addEducation(educationData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/education`, {
        method: 'POST',
        body: JSON.stringify(educationData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  },

  async updateEducation(id, educationData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/education/${id}`, {
        method: 'PUT',
        body: JSON.stringify(educationData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  },

  async deleteEducation(id) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/education/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  },

  // Saved Jobs API
  async fetchSavedJobs(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/saved-jobs${queryString ? `?${queryString}` : ''}`;
      const response = await makeAuthenticatedRequest(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  async saveJob(jobId, notes = '', priority = 0) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/saved-jobs`, {
        method: 'POST',
        body: JSON.stringify({
          job_id: jobId,
          notes,
          priority,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async updateSavedJob(id, updateData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/saved-jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating saved job:', error);
      throw error;
    }
  },

  async removeSavedJob(id) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/saved-jobs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },

  async checkJobSaved(jobId) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs/${jobId}/saved`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      throw error;
    }
  },

  // Skills API
  async fetchSkills(params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/skills${queryString ? `?${queryString}` : ''}`;
      const response = await makeAuthenticatedRequest(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  async addSkill(skillData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/skills`, {
        method: 'POST',
        body: JSON.stringify(skillData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  },

  async updateSkill(id, skillData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/skills/${id}`, {
        method: 'PUT',
        body: JSON.stringify(skillData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  },

  async deleteSkill(id) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/skills/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },

  // Work Experience API
  async fetchWorkExperience() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/work-experience`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching work experience:', error);
      throw error;
    }
  },

  async addWorkExperience(experienceData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/work-experience`, {
        method: 'POST',
        body: JSON.stringify(experienceData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding work experience:', error);
      throw error;
    }
  },

  async updateWorkExperience(id, experienceData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/work-experience/${id}`, {
        method: 'PUT',
        body: JSON.stringify(experienceData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating work experience:', error);
      throw error;
    }
  },

  async deleteWorkExperience(id) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/work-experience/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting work experience:', error);
      throw error;
    }
  },

  // Resumes API
  async fetchResumes() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/resumes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  },

  async addResume(resumeData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        body: JSON.stringify(resumeData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding resume:', error);
      throw error;
    }
  },

  async deleteResume(id) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  // Legacy resume upload (keeping for compatibility)
  async uploadResume(formData) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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

  // Dashboard Stats API
  async getDashboardStats() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};