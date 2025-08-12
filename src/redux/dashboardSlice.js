// // src/redux/dashboardSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchDashboardData = createAsyncThunk(
//   'dashboard/fetchData',
//   async () => {
//     const res = await fetch('/api/dashboard');
//     return await res.json();
//   }
// );

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState: {
//     applications: [],
//     savedJobs: [],
//     messages: [],
//     interviews: [],
//     recentActivity: [],
//     status: 'idle',
//     error: null
//   },
//   reducers: {
//     markMessageRead: (state, action) => {
//       const msg = state.messages.find(m => m.id === action.payload);
//       if (msg) msg.read = true;
//     },
//     applyToJob: (state, action) => {
//       state.savedJobs = state.savedJobs.filter(job => job.id !== action.payload);
//       state.applications.push({ id: Date.now(), status: 'sent' });
//       state.recentActivity.unshift({ id: Date.now(), action: 'Applied to a job' });
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         const data = action.payload;
//         state.applications = data.applications;
//         state.savedJobs = data.savedJobs;
//         state.messages = data.messages;
//         state.interviews = data.interviews;
//         state.recentActivity = data.recentActivity;
//         state.status = 'succeeded';
//       });
//   }
// });

// export const { markMessageRead, applyToJob } = dashboardSlice.actions;
// export default dashboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks for API calls
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const data = await api.fetchDashboardSummary();
    return data;
  }
);

export const applyToJobAsync = createAsyncThunk(
  'dashboard/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await api.applyToJob(jobId);
      return { jobId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJobAsync = createAsyncThunk(
  'dashboard/saveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await api.saveJob(jobId);
      return { jobId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeSavedJobAsync = createAsyncThunk(
  'dashboard/removeSavedJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const data = await api.removeSavedJob(jobId);
      return { jobId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadResumeAsync = createAsyncThunk(
  'dashboard/uploadResume',
  async ({ filename, size }, { rejectWithValue }) => {
    try {
      const data = await api.uploadResumeFile(filename, size);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'dashboard/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await api.updateProfile(profileData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMySavedJobsAsync = createAsyncThunk(
  'dashboard/fetchMySavedJobs',
  async () => {
    const data = await api.fetchMySavedJobs();
    return data;
  }
);

export const fetchMyApplicationsAsync = createAsyncThunk(
  'dashboard/fetchMyApplications',
  async () => {
    const data = await api.fetchMyApplications();
    return data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    // Stats
    overview: {
      totalJobs: 0,
      totalCompanies: 0,
      totalCategories: 0,
      recentJobs: 0,
      totalApplications: 0
    },
    
    // Data
    recentJobs: [],
    categoryStats: [],
    userStats: {
      savedJobs: 0,
      applications: 0,
      unreadMessages: 0
    },
    
    // User specific data
    mySavedJobs: [],
    myApplications: [],
    profile: {
      name: '',
      email: '',
      resume: '',
      skills: []
    },
    
    // Legacy data (for backward compatibility)
    applications: [],
    savedJobs: [],
    messages: [],
    interviews: [],
    recentActivity: [],
    
    // State
    status: 'idle',
    error: null,
    lastUpdated: null,
    actionLoading: {
      applying: false,
      saving: false,
      uploading: false,
      updating: false
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addRecentActivity: (state, action) => {
      state.recentActivity.unshift({
        id: Date.now(),
        action: action.payload.action,
        details: action.payload.details,
        timestamp: new Date().toISOString()
      });
      // Keep only last 10 activities
      state.recentActivity = state.recentActivity.slice(0, 10);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        const data = action.payload;
        state.overview = data.overview || state.overview;
        state.recentJobs = data.recentJobs || [];
        state.categoryStats = data.categoryStats || [];
        state.userStats = data.userStats || state.userStats;
        state.status = 'succeeded';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Apply to job
      .addCase(applyToJobAsync.pending, (state) => {
        state.actionLoading.applying = true;
        state.error = null;
      })
      .addCase(applyToJobAsync.fulfilled, (state, action) => {
        state.actionLoading.applying = false;
        state.userStats.applications += 1;
        state.recentActivity.unshift({
          id: Date.now(),
          action: 'Applied to job',
          details: `Applied to ${action.payload.jobTitle}`,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(applyToJobAsync.rejected, (state, action) => {
        state.actionLoading.applying = false;
        state.error = action.payload;
      })

      // Save job
      .addCase(saveJobAsync.pending, (state) => {
        state.actionLoading.saving = true;
        state.error = null;
      })
      .addCase(saveJobAsync.fulfilled, (state, action) => {
        state.actionLoading.saving = false;
        state.userStats.savedJobs += 1;
      })
      .addCase(saveJobAsync.rejected, (state, action) => {
        state.actionLoading.saving = false;
        state.error = action.payload;
      })

      // Remove saved job
      .addCase(removeSavedJobAsync.pending, (state) => {
        state.actionLoading.saving = true;
        state.error = null;
      })
      .addCase(removeSavedJobAsync.fulfilled, (state, action) => {
        state.actionLoading.saving = false;
        state.userStats.savedJobs = Math.max(0, state.userStats.savedJobs - 1);
        state.mySavedJobs = state.mySavedJobs.filter(job => job.jobs.id !== action.payload.jobId);
      })
      .addCase(removeSavedJobAsync.rejected, (state, action) => {
        state.actionLoading.saving = false;
        state.error = action.payload;
      })

      // Upload resume
      .addCase(uploadResumeAsync.pending, (state) => {
        state.actionLoading.uploading = true;
        state.error = null;
      })
      .addCase(uploadResumeAsync.fulfilled, (state, action) => {
        state.actionLoading.uploading = false;
        state.profile.resume = action.payload.filePath;
      })
      .addCase(uploadResumeAsync.rejected, (state, action) => {
        state.actionLoading.uploading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.actionLoading.updating = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.actionLoading.updating = false;
        state.profile = { ...state.profile, ...action.payload.profile };
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.actionLoading.updating = false;
        state.error = action.payload;
      })

      // Fetch saved jobs
      .addCase(fetchMySavedJobsAsync.fulfilled, (state, action) => {
        state.mySavedJobs = action.payload.savedJobs;
        state.userStats.savedJobs = action.payload.total;
      })

      // Fetch applications
      .addCase(fetchMyApplicationsAsync.fulfilled, (state, action) => {
        state.myApplications = action.payload.applications;
        state.userStats.applications = action.payload.total;
      });
  }
});

export const { clearError, addRecentActivity } = dashboardSlice.actions;

// Export async thunks for use in components
export {
  // fetchDashboardData,
  // applyToJobAsync,
  // saveJobAsync,
  // removeSavedJobAsync,
  // uploadResumeAsync,
  // updateProfileAsync,
  // fetchMySavedJobsAsync,
  // fetchMyApplicationsAsync
};

export default dashboardSlice.reducer;
